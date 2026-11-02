"""R6D-R8B: deterministic independent role/time/grade-constrained premodel graph.
Reads the 144 real R8A candidates rather than inventing new sites.
No 3D geometry, game change, load-bearing or ART permission.
"""
import argparse,json,math,os
ROLE_ORDER=[
 ('EARLY_PUBLIC','t1250',('t1150','t1200','t1250','t1300')),
 ('MID_TRANSFER','t1400',('t1350','t1400','t1450','t1500')),
 ('LATE_HABITAT','t1550',('t1500','t1550','t1600','t1650')),
 ('EXIT_INTERIOR','t1700',('t1600','t1650','t1700'))]
def gap(a,b):
 return math.hypot(b[0]-a[0],b[2]-a[2])
def edgescore(a,b):
 horizontal=gap(a,b);rise=abs(b[1]-a[1])
 if horizontal<20:return None
 slope=rise/horizontal
 # Research-only preference: smaller rise, less exaggerated elevated bridge,
 # and shorter urban connections. A lift route remains only hypothetical.
 return (max(0,slope-.09)*1100 + rise*.17 + horizontal*.036),slope,horizontal
def progress(point,start,end):
 x=point[0]-start[0];z=point[2]-start[2]
 dx=end[0]-start[0];dz=end[2]-start[2]
 l=math.hypot(dx,dz)
 return (x*dx+z*dz)/l
def evaluate(raw,original):
 assert raw['schema']=='dopagaki.g4e7dz-r6d-r8a-original-source-premodel-graph/1'
 assert original['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
 assert raw['road']==original['road']
 assert raw['sourceProtected'] and not raw['sourceGameChanged']
 assert raw['sourceCXBlob']==original['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
 rows=raw['siteCandidateTable'];assert len(rows)==raw['candidateCount']==144
 assert raw['siteRolesOrdered']==[x[0] for x in ROLE_ORDER]
 first=next(f['playerPosition'] for f in original['frames'] if f['id']=='t1100')
 last=next(f['playerPosition'] for f in original['frames'] if f['id']=='t1700')
 base=raw['pedestrianGraphNodes'][0]['point']
 groups=[]
 for role,anchor,window in ROLE_ORDER:
  c=[]
  for v in rows:
   if v['anchor']!=anchor or v['originalB48Nearest3dDistance']<12:continue
   if v['full721tickB51SampledAabbMargin9mHits'] or v['longestConsecutiveSourceFrames']<2:continue
   total=sum(t in v['sourceClearFrames'] for t in window)
   if total<2:continue
   item=dict(v)
   item['role']=role;item['visibilityInRoleWindow']=total
   item['longitudinalProgressMetres']=round(progress(v['worldXYZ'],first,last),4)
   c.append(item)
  # Intentionally do NOT collapse to best visible point before graph optimization.
  groups.append(c)
 assert len(groups)==4
 # DP: exactly 4 distinct chronological original-camera sites; actual
 # scene progression must increase, not reverse R8A's false ordering.
 dp={}
 for v in groups[0]:
  c=edgescore(base,v['worldXYZ'])
  if c is None:continue
  # Connection to REAL CX face is costly, but the model may need an elevator;
  # score is not a walking certification.
  cost=c[0] - 1.5*v['visibilityInRoleWindow']
  dp[tuple(v['worldXYZ'])]=(cost,[v])
 for group in groups[1:]:
  cur={}
  for v in group:
   target=tuple(v['worldXYZ'])
   for cost,path in dp.values():
    prev=path[-1]
    if v['longitudinalProgressMetres']<=prev['longitudinalProgressMetres']+20:continue
    if math.dist(v['worldXYZ'],prev['worldXYZ'])<55:continue
    edge=edgescore(prev['worldXYZ'],v['worldXYZ'])
    if not edge:continue
    score=cost+edge[0]-1.5*v['visibilityInRoleWindow']
    if target not in cur or score<cur[target][0]:
     cur[target]=(score,path+[v])
  dp=cur
 if not dp:
  chosen=[]
 else:
  _,chosen=min(dp.values(),key=lambda x:x[0])
 route=[{'id':'SOURCE_CX_WALKABLE_FACE_ONLY','xyz':base,'role':'REAL_EXISTING_FLOOR_NEEDS_ACCESS_DESIGN'}]
 route += [{'id':c['role'],'xyz':c['worldXYZ'],
   'anchorOriginalCamera':c['anchor'],
   'clearInRoleWindow':c['visibilityInRoleWindow'],
   'sourceClearFrames':c['sourceClearFrames'],
   'longitudinalProgressMetres':c['longitudinalProgressMetres'],
   'candidateB48Min3dDistanceMetres':c['originalB48Nearest3dDistance']} for c in chosen]
 links=[]
 for a,b in zip(route,route[1:]):
  edge=edgescore(a['xyz'],b['xyz'])
  if not edge:continue
  cost,grade,horizontal=edge
  longRoute=horizontal>80
  # No imaginary corridor floor: if grade > 9%, require a prospective lift.
  # Long suspended decks require real supports even if planar grade is low.
  links.append({'from':a['id'],'to':b['id'],
   'planHorizontalMetres':round(horizontal,3),
   'heightDifferenceMetres':round(abs(b['xyz'][1]-a['xyz'][1]),3),
   'directLineGrade':round(grade,5),
   'simpleDirectRampPreliminarilyPossible':grade<=.09,
   'verticalLiftOrSwitchbackRequired':grade>.09,
   'longSpanNeedsActualLoadPath':longRoute,
   'realWalkFloorBuilt':False,'originalMeshesSweptEdgeClear':'NOT_CHECKED',
   'continuousMovingObstacleSafety':'NOT_CHECKED',
   'publicWalkabilityCertified':False})
 chronological=len(chosen)==4 and all(chosen[i+1]['longitudinalProgressMetres']>
   chosen[i]['longitudinalProgressMetres']+20 for i in range(3))
 allSitesHaveSourceVisibility=chronological and all(x['clearInRoleWindow']>=2 for x in route[1:])
 # Actual R8B gives no false "physical path" PASS. It only repairs R8A's
 # greedy reversal and quantifies where lift or load-bearing is necessary.
 reasons=[]
 if not chronological:reasons.append('FOUR_CHRONOLOGICAL_PREMODEL_ROLES_NOT_FOUND')
 if chronological and not allSitesHaveSourceVisibility:reasons.append('SITE_NOT_VISIBLE_FOR_TWO_ROLE_FRAMES')
 if any(x['verticalLiftOrSwitchbackRequired'] for x in links):reasons.append('DIRECT_RAMPS_EXCEED_NINE_PERCENT_REQUIRE_VERTICAL_TRANSFERS')
 if any(x['longSpanNeedsActualLoadPath'] for x in links):reasons.append('LONG_FLOATING_GALLERIES_REQUIRE_REAL_STRUCTURAL_SUPPORTS')
 reasons.append('NO_CONSTRUCTED_PEDESTRIAN_FLOORS_OR_REAL_HUMAN_CX_ACCESS')
 reasons.append('NO_INTERIOR_CITY_ART_YET_TO_TEST_REAL_GAME_CAMERA_OCCLUSION')
 return {'schema':'dopagaki.g4e7dz-r6d-r8b-chronology-grade-constrained/1',
  'road':raw['road'],'sourceCXBlob':raw['sourceCXBlob'],
  'rawCandidateCount':len(rows),'candidateGroupsByOriginalCamera':
    {role:len(gr) for (role,anchor,win),gr in zip(ROLE_ORDER,groups)},
  'originalR8AGreedyReversal':any(raw['selection'].get(ROLE_ORDER[i][0],{}).get('anchor','')>
   raw['selection'].get(ROLE_ORDER[i+1][0],{}).get('anchor','') for i in range(3)),
  'selectedChronologicalSites':route,'siteRoleTimeOrderValid':chronological,
  'siteRoleNativeVisibilityAtLeastTwoFrames':allSitesHaveSourceVisibility,
  'proposedGraphEdges':links,
  'directRampGradeNinePercentSatisfiedEverywhere':len(links)==4 and all(
    x['simpleDirectRampPreliminarilyPossible'] for x in links),
  'allSourceTriangleSegmentIntersectionChecks':'NOT_RUN_IN_THIS_STAGE',
  'sourceB51_721TickFullEdgeSafety':'NOT_RUN',
  'existingCxFaceProvenButPedestrianLink':'NOT_CERTIFIED',
  'realPhysicalHumanPathCertified':False,
  'allNewArtGeometryBuilt':False,
  'modelingPermission':'PREMODEL_RESEARCH_ONLY_NEEDS_REAL_FULL_MESH_PATH_AND_CAMERA_TESTS',
  'hardRequirementsRemaining':reasons,
  'newCityMeshes':0,'newGameColliders':0,'officialArt':0,'officialSlope2Metres':0,
  'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD',
  'PERFORMANCE':'HOLD','INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
def main():
 p=argparse.ArgumentParser()
 for k in ('input','native','out'):p.add_argument('--'+k,required=True)
 a=p.parse_args()
 d=evaluate(json.load(open(a.input)),json.load(open(a.native)))
 os.makedirs(os.path.dirname(a.out),exist_ok=True)
 with open(a.out,'w',encoding='utf-8') as o:json.dump(d,o,indent=2,ensure_ascii=False)
 print('R8B_CHRONOLOGICAL_GRAPH_PREMODEL',d['road'],
 'groups',d['candidateGroupsByOriginalCamera'],
 'chronological',d['siteRoleTimeOrderValid'],
 'directRampAllNinePercent',d['directRampGradeNinePercentSatisfiedEverywhere'],
 'edgeGrades',[x['directLineGrade'] for x in d['proposedGraphEdges']],
 'ART','HOLD')
if __name__=='__main__':main()
