"""R12D: prove why R12B is sparse and how to choose R13 high-quality
contiguous source space, without building decorative extra meshes.
All centres are TRUE R12A source-volume results, not fabricated locations.
"""
import argparse,os,json,math
SOURCE='af076d67492a677d2235e4730aef8cdf4808e106'
def verify(a,b,c):
 assert a['schema']=='dopagaki.g4e7dz-r6d-r12a-source-cameras-safe-volume-field/1'
 assert b['schema']=='dopagaki.g4e7dz-r6d-r12b-source-safe-real-city-cut/1'
 assert c['schema']=='dopagaki.g4e7dz-r6d-r12c-source-image-independent-art/1'
 assert a['road']==b['road']==c['road']
 assert a['sourceCXBlob']==b['sourceCXBlob']==c['sourceCXBlob']==SOURCE
 assert a['sourceCX18B48_7B51_28Cameras5Unchanged'] and b['unchangedOriginalCX18_B48_7_B51_28_Cameras5']
 assert c['verdict']=='ART_REJECT_REAL_IMAGE_TINY_DISCONNECTED_CITY'
 assert not c['R12BArtAccepted'] and c['originalSourceMeshesUnchanged']
 assert b['newGameColliders']==b['officialArt']==c['officialArt']==0
 safe=a['allSafeCameraVisibleCandidatePositions']
 assert len(safe)==a['candidateCount']
 era=('EARLY','MIDDLE','LATE')
 selected=b['districtsWithActualWorldCoordinates']
 assert [x['name'] for x in selected]==['CIVIC','HABITAT','TRANSIT']
 for x,name in zip(selected,era):
  assert x['physicalPublicConnectionToOtherErasCertified']==False
  assert any(row['era']==name and row['worldXYZ']==x['centerWorld'] for row in safe)
 # The R12A SOURCE preflight boxes are 26x30x36m at the fixed candidate
 # coordinates. Spatial proximity within 32m is not a walkability claim.
 comparisons=[]
 for aera,bera in zip(era,era[1:]):
  u=[x for x in safe if x['era']==aera]
  v=[x for x in safe if x['era']==bera]
  best=None;overlap=0
  for aa in u:
   for bb in v:
    d=math.dist(aa['worldXYZ'],bb['worldXYZ'])
    if best is None or d<best[0]:
     best=(d,aa,bb)
    if d<=32:overlap+=1
  assert best is not None
  comparisons.append({'from':aera,'to':bera,
   'minimalOriginalSafeCandidateCentreDistanceMetres':round(best[0],4),
   'numberOfSourceCandidatePairsWithin32m':overlap,
   'closestProvenR12ASafeSourceBoxes':[best[1]['worldXYZ'],best[2]['worldXYZ']],
   'sourceOriginalMeshSafeCorridorBetweenThem':'NOT_CHECKED',
   'publicTravelFunctionFullyBuilt':False})
 mids=[]
 for x,y in zip(selected,selected[1:]):
  d=math.dist(x['centerWorld'],y['centerWorld'])
  mids.append({'from':x['name'],'to':y['name'],'chosenR12BCentreDistance3DMetres':round(d,3),
   'newPhysicalWalkwayBetweenSitesExists':False})
 assert c['R12BMeanAllSeven']<.03
 unproven=any(row['numberOfSourceCandidatePairsWithin32m']==0 for row in comparisons)
 status='STOP_UNCONNECTED_SMALL_MODULE_CYCLE_REBUILD_GLOBAL_SOURCE_SAFE_CANYON' if unproven else 'NO_AUTOMATIC_APPROVAL'
 return {'schema':'dopagaki.g4e7dz-r6d-r12d-disconnected-native-source-volume/1',
 'road':a['road'],'sourceCXBlob':SOURCE,
 'candidateVolumesBothCxAndB48ExactTriangleClearAndB51All28AabbClear':True,
 'originalPreflightResearchCellMetres':[26,30,36],
 'qualifiedTrueSourceCandidatesByEra':a['candidateCountByEra'],
 'selectedBThreeModuleActualCentreGaps':mids,
 'minimalAllGenuineR12ACandidateCrossEraGaps':comparisons,
 'R12BAllSevenOriginalCameraCityFirstHitMean':c['R12BMeanAllSeven'],
 'R11R1AllSevenOriginalCameraCityFirstHitMean':c['R11R1MeanAllSeven'],
 'R12BAuthenticCameraFramesBelow8Percent':c['R12BFramesBelow8PctRealNativeMeshFirstHit'],
 'R13RequiredChange':'FINE_8M_TRUE_SOURCE_BVH_AND_13_NATIVE_CAMERA_SEARCH_IN_EARLY_MIDDLE_GAP_THEN_ONE_CONTIGUOUS_CITY_INTERIOR',
 'R13FirstResearchTarget':'real early-to-middle safe passage, tested for original B48 CX and all28 B51 before any 3D modeling',
 'R13NoTechPassWithoutTrueInteriorVisibility':True,
 'R13HumanArtNotAutomaticFromCameraFractions':True,
 'currentRejectedGeometryCannotBeDecoratedIntoAdoption':True,
 'decision':status,'originalSourceGameChanged':False,
 'newMeshes':0,'newGameColliders':0,'officialArt':0,'officialSlope2Metres':0,
 'ART':'REJECT','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
def main():
 p=argparse.ArgumentParser()
 for n in ('r12a','r12b','r12c','out'):p.add_argument('--'+n,required=True)
 q=p.parse_args()
 v=verify(*(json.load(open(getattr(q,n))) for n in ('r12a','r12b','r12c')))
 os.makedirs(os.path.dirname(q.out),exist_ok=True)
 with open(q.out,'w',encoding='utf8') as f:json.dump(v,f,ensure_ascii=False,indent=2)
 print('R12D_REAL_SOURCE_CONNECTIVITY',v['road'],v['decision'],
 v['minimalAllGenuineR12ACandidateCrossEraGaps'],
 'source',v['R12BAllSevenOriginalCameraCityFirstHitMean'],
 'old',v['R11R1AllSevenOriginalCameraCityFirstHitMean'])
if __name__=='__main__':main()
