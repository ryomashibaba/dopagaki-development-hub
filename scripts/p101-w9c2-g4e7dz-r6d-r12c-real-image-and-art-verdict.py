"""R12C: independent R11-R1 vs R12B native original-camera image AND
original CX/B48/B51 geometry & 13 source frame comparison.
CI success is NOT aesthetic or gameplay pass. Do not edit game or production.
"""
import argparse,os,json,math,statistics
from PIL import Image,ImageChops
SOURCE='af076d67492a677d2235e4730aef8cdf4808e106'
TIMES=('t1100','t1200','t1300','t1400','t1500','t1600','t1700')
COMPARE=('t1100','t1300','t1500','t1700')
def openimage(p):return Image.open(p).convert('RGB')
def diffFraction(a,b,threshold=45):
 a=openimage(a);b=openimage(b)
 assert a.size==b.size,(a.size,b.size)
 delta=ImageChops.difference(a,b)
 # Count any channel differing by >=45, NOT segmentation nor city coverage.
 pix=list(delta.getdata())
 return round(sum(max(p)>=threshold for p in pix)/len(pix),5)
def evaluate(a,b,sourceDir,r11Dir,r12Dir):
 assert a['schema']=='dopagaki.g4e7dz-r6d-r11r1-folded-estuary-true-source/1'
 assert b['schema']=='dopagaki.g4e7dz-r6d-r12b-source-safe-real-city-cut/1'
 assert a['road']==b['road'] and a['sourceCXBlob']==b['sourceCXBlob']==SOURCE
 assert b['unchangedOriginalCX18_B48_7_B51_28_Cameras5'] and b['originalGap52']
 assert b['originalEmptyBoxSourcePreflightR12A']
 assert b['trueStructuralInterEraConnections']=='NOT_DESIGNED_OR_CERTIFIED'
 assert a['newGameColliders']==b['newGameColliders']==0
 assert a['officialArt']==b['officialArt']==0
 assert not b['sourceGameChanged']
 assert len(b['districtsWithActualWorldCoordinates'])==3
 assert b['newBlenderResearchMeshes']>=90
 assert not b['originalSourceB48ExactTrianglesIntersectionPairs']
 assert not b['originalSourceCXExactTrianglesIntersectionPairs']
 assert not b['all28MovingB51_721TickSampledAabbIntersectionPairs']
 assert all(x['intersectionObjectPairs']==0 for x in b['original13TimedMoverB51ExactTriangleIntersections'].values())
 assert set(a['original7CamerasActualBVHFirstHit'])==set(b['original7CamerasActualBVHFirstHit'])==set(TIMES)
 baseline={};now={};weak=[];court={}
 for key in TIMES:
  old=a['original7CamerasActualBVHFirstHit'][key]['firstHitGrid']
  new=b['original7CamerasActualBVHFirstHit'][key]['firstHitGrid']
  assert sum(old.values())==sum(new.values())==19*12
  oldFraction=old['R11']/228 # R11R1 original category
  newFraction=new['R12B']/228
  assert abs(oldFraction-a['original7CamerasActualBVHFirstHit'][key]['newCityFirstHitFraction'])<.0002
  assert abs(newFraction-b['original7CamerasActualBVHFirstHit'][key]['newCityFirstHitFraction'])<.0002
  baseline[key]=round(oldFraction,5);now[key]=round(newFraction,5)
  if newFraction<.08:weak.append(key)
  court[key]=sum(x['realThreeDimensionalRayClearToCourt'] for x in b['original7CamerasActualCourt3DRay'][key])
 pngs=[]
 for key in COMPARE:
  reference=os.path.join(sourceDir,f'R1_{b["road"]}_{key}_TRUE_BLENDER_SOURCE_NOT_WEBGL.png')
  old=os.path.join(r11Dir,f'R11R1_{b["road"]}_{key}_ACTUAL_NATIVE_CAMERA_BLENDER_NOT_WEBGL.png')
  latest=os.path.join(r12Dir,f'R12B_{b["road"]}_{key}_ACTUAL_NATIVE_CAMERA_BLENDER_NOT_WEBGL.png')
  pngs.append({'originalFrame':key,
   'r11r1DifferentRGBPixels45Of255':diffFraction(reference,old),
   'r12bDifferentRGBPixels45Of255':diffFraction(reference,latest)})
 # Need real human-legible city from camera: cannot pass 7-frame coverage
 # when virtually no city is visible. Even 8% would NOT auto-pass ART.
 visibilityFails=len(weak)>0
 brokenPhysicalGraph=any(not x['physicalPublicConnectionToOtherErasCertified']
    for x in b['districtsWithActualWorldCoordinates'])
 verdict='ART_REJECT_REAL_IMAGE_TINY_DISCONNECTED_CITY' if visibilityFails or brokenPhysicalGraph else 'ART_HOLD_HUMAN_IMAGE_REVIEW'
 return {'schema':'dopagaki.g4e7dz-r6d-r12c-source-image-independent-art/1',
  'road':b['road'],'sourceCXBlob':SOURCE,
  'originalSourceMeshesUnchanged':True,'sourceCX18':18,'sourceB48':7,'sourceB51':28,
  'originalR1SourceNativeCamera7Frames':list(TIMES),
  'R11R1NativeOriginalCameraFirstHitFractions':baseline,
  'R12BNativeOriginalCameraFirstHitFractions':now,
  'R11R1MeanAllSeven':round(statistics.mean(baseline.values()),5),
  'R12BMeanAllSeven':round(statistics.mean(now.values()),5),
  'R12BFramesBelow8PctRealNativeMeshFirstHit':weak,
  'R12BClearViewTowardThreePocketCentersPerFrame':court,
  'actualOriginalRGBThreshold45Comparison':pngs,
  'R12BActualR1SourceExactRoadAndCXTrianglePairs':0,
  'R12BOriginalAll28B51_721TickConservativeBoxPairs':0,
  'R12BOriginalB51_13ActualPoseExactIntersectPairs':0,
  'R12BProgramSections':3,
  'R12BRealFloorMaterialsAnd3DMeshedStructures':True,
  'R12BThreeEraActualPedestrianConnectivity':'NOT_CERTIFIED',
  'R12BStructuralHumanGameplayArtQuality':'NOT_APPROVED',
  'verdict':verdict,'reasons':['LOW_EARLY_MIDDLE_OR_LATE_SOURCE_CAMERA_VISIBILITY' if visibilityFails else 'SEE_IMAGE_AUDIT',
     'THREE_INDEPENDENT_SECTIONS_NOT_TRAVERSABLE_IN_THE_ORIGINAL_GAME',
     'GAME_CAMERA_PERSPECTIVE_TOO_SMALL_TO_READ_INTERIOR_CITY_FUNCTIONS'],
  'R12BArtAccepted':False,'originalGameChanged':False,
  'officialArt':0,'officialSlope2Metres':0,'newGameColliders':0,
  'ART':'REJECT','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
  'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
def main():
 p=argparse.ArgumentParser()
 for k in ('r11r1','r12b','r1images','r11images','r12images','out'):
  p.add_argument('--'+k,required=True)
 q=p.parse_args()
 a=json.load(open(q.r11r1));b=json.load(open(q.r12b))
 result=evaluate(a,b,q.r1images,q.r11images,q.r12images)
 os.makedirs(os.path.dirname(q.out),exist_ok=True)
 with open(q.out,'w',encoding='utf8') as f:json.dump(result,f,ensure_ascii=False,indent=2)
 print('R12C_ACTUAL_IMAGE_REVIEW',result['road'],'original7frame mean R11R1',
 result['R11R1MeanAllSeven'],'R12B',result['R12BMeanAllSeven'],
 'weak',result['R12BFramesBelow8PctRealNativeMeshFirstHit'],
 'image diffs',result['actualOriginalRGBThreshold45Comparison'],
 'STATUS',result['verdict'])
if __name__=='__main__':main()
