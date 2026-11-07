#!/usr/bin/env python3
"""R41/R42 RESEARCH-ONLY: approximate original-camera depth of saved R39 geometry.

Run:
  python scripts/k4ct-r41-offline-depth-feasibility.py \
    --r38-zip R38_depth_causality.zip \
    --r40-zip R40_original_R39_water_visibility.zip --out r41.json

Dependencies: Python 3, numpy, numba. NO original Game/Blender source mutation,
NO source WebGL2 execution, NO asset adoption. Only verified ZIP inputs.
"""
import argparse
import collections
import hashlib
import json
import math
from pathlib import Path
from zipfile import ZipFile
import numpy as np
from numba import njit

W,H=505,350
ASPECT=1014./699.  # approximate observed source-game CSS canvas
PROTECTED={0,12,13,19,34,35,41,42}

@njit(cache=True)
def raster(projected,z,ids,w,h):
    depth=np.full((h,w),np.inf)
    who=np.full((h,w),-1,dtype=np.int32)
    for i in range(len(ids)):
        z0,z1,z2=z[i]
        # Near-plane crossing triangles are SKIPPED, not clipped.
        if min(z0,z1,z2)<0.67: continue
        x0,y0=projected[i,0];x1,y1=projected[i,1];x2,y2=projected[i,2]
        det=(x1-x0)*(y2-y0)-(y1-y0)*(x2-x0)
        if abs(det)<1e-6:continue
        xmin=max(0,int(math.floor(min(x0,x1,x2))))
        xmax=min(w-1,int(math.ceil(max(x0,x1,x2))))
        ymin=max(0,int(math.floor(min(y0,y1,y2))))
        ymax=min(h-1,int(math.ceil(max(y0,y1,y2))))
        for iy in range(ymin,ymax+1):
            for ix in range(xmin,xmax+1):
                px,py=ix+0.5,iy+0.5
                a=((x1-px)*(y2-py)-(y1-py)*(x2-px))/det
                b=((x2-px)*(y0-py)-(y2-py)*(x0-px))/det
                c=1.-a-b
                if min(a,b,c)<-1e-8:continue
                zi=1./(a/z0+b/z1+c/z2)
                if zi<depth[iy,ix]:
                    depth[iy,ix]=zi;who[iy,ix]=ids[i]
    return depth,who

def project(v,camera):
    eye,front,right,up=np.asarray(camera).reshape(4,3)
    rel=v-eye;z=rel@front
    safe=np.where(np.abs(z)<1e-4,np.nan,z)
    xx=(1+1.35*(rel@right)/ASPECT/safe)*.5*W
    yy=(1-1.35*(rel@up)/safe)*.5*H
    return np.stack((xx,yy),axis=-1),z

def blocking(who,mask):
    counts=collections.Counter(who[mask].tolist())
    return [{'group':int(g),'approxHalfResPixels':int(n),
             'protected':int(g) in PROTECTED} for g,n in counts.most_common(10)]

def run(p38,p40,protected_floor=False):
    with ZipFile(p38) as z:
        f38=json.loads(z.read('k4ct-r38-depth/K4CT_R38_WATER_DEPTH_FRUSTUM.json'))
    with ZipFile(p40) as z:
        geom=json.loads(z.read('k4ct-contact-retry/K4CT_DCC_BLENDER_TO_NATIVE_GEOMETRY.json'))
        real=json.loads(z.read('k4ct-r40-native-water/K4CT_R40_R39_WATER_VISIBILITY.json'))
    assert geom['triangles']==30904 and geom['originalB48']==7
    assert geom['originalB51']==28 and geom['newColliders']==0
    assert real['originalWebGL2'] and real['originalRunner240Hz']
    assert real['restorationEveryFrameValid']
    assert real['sampledTicks']==[15900,15924,15972]
    assert [x['seconds'] for x in f38['frames']]==[66.25,66.35,66.55]
    V=np.asarray(geom['vertices'],dtype=float).reshape(-1,3,6)[:,:,:3]
    ids=np.zeros(len(V),dtype=np.int32)
    groups={}
    pos=0
    for name,count in geom['objects'].items():
        key=int(name[:2]);ids[pos:pos+count]=key
        groups[key]=(pos,pos+count);pos+=count
    assert pos==len(V) and groups[24][1]-groups[24][0]==526
    assert PROTECTED.issubset(groups)
    i0,i1=groups[24];waterVertices=V[i0:i1]
    _,front,right,_=np.asarray(f38['frames'][1]['camera']).reshape(4,3)
    hypotheticals={
        'UNCHANGED':np.array([0.,0.,0.]),
        'TOWARD_CAMERA_20M':-np.array([front[0],0.,front[2]])*20.,
        'SCREEN_LEFT_20M':-np.array([right[0],0.,right[2]])*20.,
        'LEFT_PLUS_NEAR_20M_EACH':-np.array([front[0]+right[0],0.,front[2]+right[2]])*20.
    }
    frames=[]
    for j,frame in enumerate(f38['frames']):
        xy,z=project(V,frame['camera'])
        water,_=raster(xy[i0:i1],z[i0:i1],ids[i0:i1],W,H)
        mask=np.isfinite(water)
        variants={}
        scenarios={
          'ALL_NONROAD_EXCEPT_WATER24':~np.isin(ids,[0,24]),
          'FOREBAY19_REMOVED_DIAGNOSTIC':~np.isin(ids,[0,19,24]),
          'LOCAL_NONPROTECTED_AND19_REMOVED_DIAGNOSTIC':~np.isin(ids,[0,3,15,16,17,19,20,21,24]),
          'INCLUDE_ROAD00_APPROX_DIAGNOSTIC':ids!=24,
        }
        for name,sel in scenarios.items():
            dep,owner=raster(xy[sel],z[sel],ids[sel],W,H)
            behind=mask&(water>=dep)
            variants[name]={
              'projectedWater24VisibleApproxHalfResPixels':int((mask&(water<dep)).sum()),
              'projectedWater24BehindApproxHalfResPixels':int(behind.sum()),
              'approximateNearestBlockers':blocking(owner,behind)
            }
        sel=scenarios['ALL_NONROAD_EXCEPT_WATER24']
        occ,_=raster(xy[sel],z[sel],ids[sel],W,H)
        roadSel=ids==0
        road,_=raster(xy[roadSel],z[roadSel],ids[roadSel],W,H)
        translations=[]
        for name,shift in hypotheticals.items():
            hypotXy,hypotZ=project(waterVertices+shift,frame['camera'])
            surface,_=raster(hypotXy,hypotZ,ids[i0:i1],W,H)
            present=np.isfinite(surface)
            visible=present&(surface<occ)
            roadSafe=visible&((~np.isfinite(road))|(surface<road))
            translations.append({
                'name':name,'worldDeltaXZmeters':[round(float(shift[0]),3),round(float(shift[2]),3)],
                'projectedPixelsApproxHalfRes':int(present.sum()),
                'visibleInFrontOfOtherDccApproxHalfRes':int(visible.sum()),
                'visibleInFrontOfOtherDccAndApproxRoadHalfRes':int(roadSafe.sum()),
                'NO_HYDRAULIC_CONNECTION_OR_ART_PROOF':True
            })
        frames.append({
            'seconds':frame['seconds'],'sourceTick':real['sampledTicks'][j],
            'group24MeshTriangles':i1-i0,
            'group24ProjectedPixelsApproxHalfRes':int(mask.sum()),
            'group24TrueWebGL2InfluenceRGBgt25':real['frames'][j]['groupHideInfluence']['24']['crops']['gameFrame']['changedRGBgt25'],
            'depthApproxVariants':variants,
            'hypotheticalTranslationsNotActualWebGL2':translations
        })
        if protected_floor:
            # Diagnostic-only: current unchanged R39 water24 footprint
            # versus protected source geometry 00/12/13/19/34/35/41/42.
            # No actual DCC or source renderer/group is ever edited.
            protected_scenarios={
                'PROTECTED8_INCLUDING_ROAD00':PROTECTED,
                'PROTECTED7_WITHOUT_ROAD00':PROTECTED-{0},
                'PROTECTED8_WITHOUT_FOREBAY19_HYPOTHETICAL':PROTECTED-{19},
                'PROTECTED8_WITHOUT_TOWER12_HYPOTHETICAL':PROTECTED-{12},
                'PROTECTED8_WITHOUT_19_AND_12_HYPOTHETICAL':PROTECTED-{19,12},
                'ONLY_PROTECTED_FOREBAY19':{19},
                'ONLY_PROTECTED_TOWER12':{12}
            }
            protected_results={}
            for name,kept in protected_scenarios.items():
                selected=np.isin(ids,sorted(kept))
                dep,owner=raster(xy[selected],z[selected],ids[selected],W,H)
                blocked=mask&(water>=dep)
                protected_results[name]={
                    'visibleApproxHalfResPixels':int((mask&(water<dep)).sum()),
                    'blockedApproxHalfResPixels':int(blocked.sum()),
                    'approximateBlockersNotPixelOwnership':blocking(owner,blocked)
                }
            # The source-author code retained two old triangles in group24
            # and evaluated 524 new Blender water triangles afterwards.
            assert i1-i0==526
            authored_only,_=raster(xy[i0+2:i1],z[i0+2:i1],ids[i0+2:i1],W,H)
            protected_results['NEW_R39_AUTHORED_524_PROJECTED_PIXELS']=int(np.isfinite(authored_only).sum())
            protected_results['R40_ORIGINAL_WEBGL2_GROUP24_RGBgt25']=real['frames'][j]['groupHideInfluence']['24']['crops']['gameFrame']['changedRGBgt25']
            frames[-1]['r42ProtectedOnlyFloorApprox']=protected_results
    return {
        'schema':('k4ct-r42-protected-only-depth-floor-offline-approx-v1' if protected_floor else 'k4ct-r41-original-camera-half-res-depth-approx-v1'),
        'provenance':{
            'r38OriginalGameRun':42375928902,'r39OriginalBlenderRun':42377482537,
            'r40OriginalGameRun':42378264567,
            'r38ZipSHA256':hashlib.sha256(Path(p38).read_bytes()).hexdigest(),
            'r40ZipSHA256':hashlib.sha256(Path(p40).read_bytes()).hexdigest(),
            'gameBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
            'blenderAuthorBlob':'096fffbc1627915eb0122224955bb02cfba6b3ae'
        },
        'method':{
            'type':'OFFLINE_APPROX_NOT_NATIVE_GL',
            'resizedCanvasWH':[W,H],'approxAspect':ASPECT,
            'projection':'R9 GLSL P=vec4(1.35*right/aspect,1.35*up,1.00022*front-1.30014,front)',
            'depth':'nearest perspective-correct reciprocal camera-front distance',
            'notExact':'R38 camera reused with identical original driving controls; near-plane triangles skipped; source B48, cull/fog/GL state not simulated; screen canvas approximate',
            'notART':'Hypothetical translations are not Blender, connected water or real WebGL2; blocker group counts are APPROX only, not pixel ownership.'
        },'sourceR39Triangles':geom['triangles'],'frames':frames,
        'verdict':'NO_GO_CURRENT_R39_SITE; do NOT create another giant DCC or repeat R39 CI',
        'formalARTAdopted':0,'slope2DNAmeters':0,'ART':'HOLD_R39_REJECT',
        'METHOD':'HOLD','HUMAN':'HOLD','SAT':'HOLD','CCD':'HOLD',
        'FPS':'HOLD','RELEASE':'HOLD','MERGE':'HOLD',
        'noNewCI':True,'noGameOrBlenderEdits':True,'userActions':0,
        **({'r42Caveat':'Offline approximation ONLY, not exact native WebGL2 pixel ownership or approved art.', 'r42Gate':'NO_GO_CURRENT_R39_WATER24_FOOTPRINT_NONPROTECTED_ONLY'} if protected_floor else {})
    }

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--r38-zip',type=Path,required=True)
    parser.add_argument('--r40-zip',type=Path,required=True)
    parser.add_argument('--out',type=Path,required=True)
    parser.add_argument('--protected-floor',action='store_true',
                        help='R42 offline-only protected8 occlusion floor on current water24')
    args=parser.parse_args()
    if args.protected_floor:
        assert hashlib.sha256(args.r38_zip.read_bytes()).hexdigest()=='5b9c81e6dc15ec9811b9dbf5bdaf9e8101b068b8e8616593f7cae6b99a3e962d'
        assert hashlib.sha256(args.r40_zip.read_bytes()).hexdigest()=='0ea313f4b7161e55842357b50a69828e9ad6c183dfffd86197618ab7f6aa9507'
    result=run(args.r38_zip,args.r40_zip,protected_floor=args.protected_floor)
    args.out.parent.mkdir(parents=True,exist_ok=True)
    args.out.write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n')
    print('R41_OFFLINE_DEPTH_FEASIBILITY_DONE_NO_NATIVE_GL:',result['verdict'])
    for f in result['frames']:
        print(f['seconds'],'native',f['group24TrueWebGL2InfluenceRGBgt25'],
              'approxProjected',f['group24ProjectedPixelsApproxHalfRes'])
