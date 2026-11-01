"""R2F5-K2: THREE independent, source-camera projected city chapters only.
All source coordinates from genuine 7 B48 road stations, camera recordings from
the actual 240Hz original W9-C1 renderer. Proxies are NOT geometry or gameplay.
Do NOT count bounding rectangles as sightline, ART, collisions or city completeness.
"""
import json,math,hashlib
from pathlib import Path

base=Path('r19-evidence/r19a6p4r2f5k')
out=Path('r19-evidence/r19a6p4r2f5k2')
out.mkdir(parents=True,exist_ok=True)
anchors=json.loads((base/'R2F5K_ALL7_FROZEN_SOURCE_ROAD_ANCHORS.json').read_text())
camera=json.loads((base/'R2F5K_REAL_ORIGINAL_EXTENDED_CAMERA_COVERAGE.json').read_text())
blob='af076d67492a677d2235e4730aef8cdf4808e106'
assert anchors['originalGameBlob']==camera['sourceBlob']==blob
assert anchors['physicalRoadCount']==camera['roadCount']==7
assert anchors['originalB51']==camera['B51']==28
assert camera['errors']==[] and anchors['addedColliders']==camera['addedColliders']==0
assert {s['mode'] for s in camera['sessions']}=={'ultra','control'}
def add(a,b):return [x+y for x,y in zip(a,b)]
def sub(a,b):return [x-y for x,y in zip(a,b)]
def mul(a,t):return [x*t for x in a]
def dot(a,b):return sum(x*y for x,y in zip(a,b))
def norm(a):
    m=math.sqrt(dot(a,a));assert m>1e-8
    return mul(a,1/m)
def cross(a,b):
    return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]
def station(mode,road,u):
    entries=anchors['sourceModes'][mode]['roads'][road]['stations']
    t=u*80;k=min(79,int(t));f=t-k
    return {field:add(mul(entries[k][field],1-f),mul(entries[k+1][field],f))
            for field in ('center','left','right','forward')}
def basis(st,side,offset):
    along=norm([st['forward'][0],0,st['forward'][2]])
    edge=st['left'] if side==-1 else st['right']
    outward=sub(edge,st['center']);outward[1]=0
    outward=sub(outward,mul(along,dot(along,outward)))
    outward=norm(outward)
    centre=add(edge,mul(outward,offset))
    return centre,outward,along
def corners(centre,outward,along,volume):
    length,width,height=volume
    pts=[]
    for lx in (-1,1):
        for rx in (-1,1):
            for up in (0,height):
                pts.append(add(add(add(centre,mul(along,lx*length/2)),
                           mul(outward,rx*width/2)),[0,up,0]))
    return pts
def project(state,p):
    eye=state['cameraEye'];front=norm(state['cameraFront'])
    right=norm(cross(front,[0,1,0]))
    up=norm(cross(right,front))
    v=sub(p,eye);depth=dot(v,front)
    if depth<=.66:return None
    return [1013*(1+1.35*dot(v,right)/(1013/698)/depth)/2,
            698*(1-1.35*dot(v,up)/depth)/2,depth]
def metric(state,pts):
    projections=[project(state,p) for p in pts]
    if any(q is None for q in projections):return None
    left=min(p[0] for p in projections);right=max(p[0] for p in projections)
    top=min(p[1] for p in projections);bottom=max(p[1] for p in projections)
    w=max(0,min(1013,right)-max(0,left))
    h=max(0,min(698,bottom)-max(0,top))
    return dict(projectedBBoxPx=[round(v,2) for v in (left,top,right,bottom)],
      clippedWidthPx=round(w,2),clippedHeightPx=round(h,2),
      clippedBBoxAreaPx2=round(w*h,2),
      minimumCameraDepthM=round(min(q[2] for q in projections),2),
      actualPixelOcclusion='UNKNOWN',humanSemanticRecognition='UNKNOWN')
source={s['mode']:{x['tick']:x['state'] for x in s['observed']} for s in camera['sessions']}
# PROVISIONAL educational proxies only; no Blender model and no candidate acceptance.
cases=[
 dict(name='K2_A_LOW_OPEN_MARKET_QUARTER',programme='market',roadIndex=0,
  u=.75,side='right',offsetFromRoadEdgeM=70,
  boundingVolumeM=[90,65,32],targetTicks=[265,721,1057],
  intendedSilhouette='LOW_WIDE_PERMEABLE_MARKET_NOT_A_LONG_WALL'),
 dict(name='K2_B_ASYMMETRIC_TRANSIT_EXCHANGE',programme='transit',roadIndex=2,
  u=.25,side='left',offsetFromRoadEdgeM=70,
  boundingVolumeM=[120,70,67],targetTicks=[3841,4321,4801],
  intendedSilhouette='TALL_SPLIT_ROOF_INHABITED_TRANSIT_GAP'),
 dict(name='K2_C_OPEN_CIVIC_TERRACE_VOID',programme='public_court',roadIndex=3,
  u=.20,side='right',offsetFromRoadEdgeM=100,
  boundingVolumeM=[135,95,43],targetTicks=[5761,6721],
  intendedSilhouette='DEEP_LOW_PUBLIC_CANYON_AND_GENUINE_NEGATIVE_SPACE'),
]
assert len({x['roadIndex'] for x in cases})==3
report=dict(schema='dopagaki.r2f5k2-three-source-visibility-proxy-chapters/1',
 originalSourceBlob=blob,realNativeCameraHz=240,
 sourceRoads=7,sourceB51=28,sourceModes=['ultra','control'],
 recordedOriginalStage='P96_SCRIPTED_NON_HUMAN',sourcePhysicsModified=False,
 addedColliders=0,visualProxyOnly=True,actualNativeGeometry=False,
 candidateArtAccepted=False,semanticsRecognizable='NOT_EVALUATED',
 roadAndHazardClearance='NOT_TESTED',originalFullCourseCoverage='NOT_OBSERVED',
 release='HOLD',merge='HOLD',cases=[])
for case in cases:
    road=case['roadIndex'];side=-1 if case['side']=='left' else 1
    assert road<=3 and case['offsetFromRoadEdgeM']-case['boundingVolumeM'][1]/2>=30
    proof=[]
    for mode in ('ultra','control'):
        st=station(mode,road,case['u'])
        centre,outward,along=basis(st,side,case['offsetFromRoadEdgeM'])
        pts=corners(centre,outward,along,case['boundingVolumeM'])
        assert all(all(math.isfinite(v) for v in p) for p in pts)
        for tick in case['targetTicks']:
            assert tick in source[mode],'Cannot project imaginary camera at '+str(tick)
            state=source[mode][tick]
            m=metric(state,pts)
            assert m is not None, 'Near plane invalid'
            assert m['minimumCameraDepthM']>15,'Unsafe camera near clip'
            assert m['clippedWidthPx']>=65 and m['clippedHeightPx']>=30
            assert m['clippedBBoxAreaPx2']>=3000
            proof.append(dict(mode=mode,tick=tick,seconds=round(tick/240,6),
              originalSourceViewerRoad=state['road'],
              realWorldTentativeCentreXYZ=[round(x,4) for x in centre],**m))
    report['cases'].append(dict(**case,sourceProof=proof,
      anchorEdgeLocalSetbackM=case['offsetFromRoadEdgeM']-case['boundingVolumeM'][1]/2,
      offroadGlobalCollision='UNVERIFIED',actualNegativeSpace='NOT_BUILT',
      multipleTrueCameraTimesValidatedForFrustum=True,
      actualRasterAndArchitectureQuality='NOT_TESTED'))
assert len(report['cases'])==3
assert all(len(c['sourceProof'])==2*len(c['targetTicks']) for c in report['cases'])
unseen=[x['index'] for x in anchors['sourceModes']['ultra']['roads'] if x['index']>=4]
assert unseen==[4,5,6]
report['unobservedRoadIndexes']=unseen
report['firstSourceFailureByMode']={s['mode']:s['firstUnreached'] for s in camera['sessions']}
(report_path:=out/'R2F5K2_THREE_SITE_PROJECTION_RESEARCH_ONLY.json').write_text(
 json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('R2F5K2_SOURCE_CAMERA_PROJECTION_LIMITED_PASS',json.dumps({
 'cases':len(report['cases']),
 'trueCameraProjectionChecks':sum(len(c['sourceProof']) for c in report['cases']),
 'candidateART':'NOT_APPROVED', 'unseenRoads':unseen,
 'sourceFailures':{k:v['actualNativeTick'] for k,v in report['firstSourceFailureByMode'].items()}
 },ensure_ascii=False))
