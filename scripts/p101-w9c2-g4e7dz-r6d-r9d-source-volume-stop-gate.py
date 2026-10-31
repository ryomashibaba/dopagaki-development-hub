"""R9D: report real R9A/R9B/R9C premodel outcome, never auto-approve.
All evidence comes from native 240Hz original CX/B48/B51 research artifacts.
"""
import argparse,os,json
SOURCE='af076d67492a677d2235e4730aef8cdf4808e106'
def evaluate(a,b,c):
 assert a['schema']=='dopagaki.g4e7dz-r6d-r9a-existing-cx-supported-footprint/1'
 assert b['schema']=='dopagaki.g4e7dz-r6d-r9b-actual-footprint-physical-sample-gate/1'
 assert c['schema']=='dopagaki.g4e7dz-r6d-r9c-original-floor-void-grid-search/1'
 assert a['road']==b['road']==c['road']
 assert a['sourceCXBlob']==b['sourceCXBlob']==c['sourceCXBlob']==SOURCE
 assert a['sourceIdentityUnchanged'] and b['originalCX18B48_7B51_28Unchanged'] and c['sourcePreservedCX18B48_7B51_28']
 assert a['anyNewBlenderCityMeshes']==b['actualNewCityMeshesBuilt']==c['newBlenderCityMeshes']==0
 assert a['officialArt']==b['officialArt']==c['officialArt']==0
 aSite=a['bestSourceFloorDirectBuildSite']
 checked=b['independentExistingFloorBVHPrismChecks']
 audited=c['first15BlockedVolumeCandidates']
 # Follow source evidence, not a fabricated 'best' line in a single report.
 # Checking exact original CX/B48/B51 triangle conflicts is mandatory.
 qualified=sum(not x['actual8x8x31mBVHSourceTriangleConflicts'] and
  not x['all28OriginalB51_721TickAabbWarnings'] and
  not x['originalB51_13SourceFrameTriangleConflicts'] and
  x['minimumOriginalPlayerHorizontalDistanceMetres']>=24 for x in checked)
 assert qualified==b['physicalGameRoadAndB51_721TickSampleClearCandidateCount']
 clear=[x for x in c['top12ClearPhysicalVolumeCandidates']
   if x['sourceFourCornersSamePolygon'] and not x['originalStaticSourceIntersectionPairs']
   and not x['B51_28Moving721TickSampleEnvelopeWarnings']
   and len(x['originalFiveCameraUnoccludedMultiFloorPoint'])>=2
   and x['minimumRealBallPlanarMetres']>=24]
 # R9C lists only up to 12 passing candidates: if the selected best is not
 # in this verified shortlist, STOP even if summary says "safe".
 actualSafe=bool(clear and c['bestRealSourceResearchPocket'] in clear and
   c['realExistingFloorSpatialPocketCandidates']>0)
 obstacles=sorted({x['type'] for item in audited
   for x in item['originalStaticSourceIntersectionPairs']})
 reasons=[]
 if not aSite:reasons.append('NO_SUPPORTED_VISIBLE_EARLY_EXISTING_CX_FLOOR')
 if qualified==0:reasons.append('EIGHT_METRE_REAL_SOURCE_BUILDING_EXTRUSIONS_COLLIDE')
 if not actualSafe:reasons.append('SIX_METRE_REAL_SOURCE_FLOOR_POCKET_NOT_PROVEN')
 if not a['anyPublicCityPedestrianEntryCertified'] and not b['existingOriginalCXHumanEntranceCertified']:
  reasons.append('NO_PROVEN_HUMAN_ENTRANCE_TO_EXISTING_CX_FLOOR')
 if not a['structuralLoadCapacityCertified'] and not b['actualLoadBearingSafetyCertified']:
  reasons.append('NO_LOAD_BEARING_CAPACITY_CERTIFICATION')
 decision='STOP_CURRENT_DIRECT_CX_FLOOR_CITY_MODEL_NO_GEOMETRIC_POCKET' if reasons else 'STILL_HUMAN_ART_AND_GAME_HOLD'
 return {'schema':'dopagaki.g4e7dz-r6d-r9d-proven-source-volume-stop/1',
  'road':a['road'],'sourceCXBlob':SOURCE,'protectedOriginalSource':True,
  'realOriginalUpwardFloorCandidates':a['realOriginalFacesExplored'],
  'real8mFourCornerSupportedFaces':a['realOriginalFloorFootprints4of4Support'],
  'realEarlyCameraAndFourCornerSupportedFaces':a['realSourceSupportedVisibleEarlyTwoFrames'],
  'R9AEarlyVisibleButNotAnEmptyRoom':bool(aSite),
  'R9BVolume8x8x31mActualOriginalSourceTested':len(checked),
  'R9BGeometricPhysicalNoCollision':qualified,
  'R9C6x6x23_2mSameSourceFloorPocketPositionsTested':c['originalCxFloorSamePolygonPadCentersTested'],
  'R9CGeometricEmptySafePocketCount':c['realExistingFloorSpatialPocketCandidates'],
  'R9CIndependentlyValidVisibleClearShortlistedPocketCount':len(clear),
  'R9CCollisionSourceCategories':obstacles,
  'actualCityNewMeshes':0,'newGameColliders':0,
  'sourceOriginalGameChanged':False,
  'requiresRealHumanAccessAndLoadBearingProof':True,
  'actualExistingSourceBuildingRecessPotential':'RESEARCH_ONLY_NOT_YET_VERIFIED',
  'decision':decision,'nextStep':'SURVEY_REAL_CX_INTERNAL_COURTYARD_AND_EXIT_ACCESS_OR_OTHER_SUPPORT_MECHANISM_BEFORE_ART',
  'falsifiableMissingRequirements':reasons,
  'officialArt':0,'officialSlope2Metres':0,
  'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
  'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
def main():
 p=argparse.ArgumentParser()
 for k in ('r9a','r9b','r9c','out'):p.add_argument('--'+k,required=True)
 q=p.parse_args()
 z=evaluate(*(json.load(open(getattr(q,k))) for k in ('r9a','r9b','r9c')))
 os.makedirs(os.path.dirname(q.out),exist_ok=True)
 with open(q.out,'w') as f:json.dump(z,f,indent=2,ensure_ascii=False)
 print('R9D_SOURCE_PREMODEL_FALSE_PASS_STOP',z['road'],
   z['R9C6x6x23_2mSameSourceFloorPocketPositionsTested'],'tested',
   z['R9CGeometricEmptySafePocketCount'],'safe','DECISION',z['decision'])
if __name__=='__main__':main()
