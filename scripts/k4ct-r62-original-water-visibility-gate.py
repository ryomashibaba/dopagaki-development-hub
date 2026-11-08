"""R62: original protected water (y=93) early-camera depth gate, research only.
INPUTS: authentic R49 DCC export JSON and R60 actual original 240Hz native
Chromium camera/poses JSON. OUTPUT: BOUNDED approximate SOFTWARE Z-raster.
Never claim true GL water ownership, human readability or ART acceptance.

python scripts/k4ct-r62-original-water-visibility-gate.py R49_DCC.json R60_NATIVE.json output.json
Requires numpy + numba; never edits either input, original game or Blender.
"""
import sys,json,math,hashlib
from pathlib import Path
import numpy as np
from numba import njit
W,H=505,350
O=np.array([1157.592,0.,-494.670])
S=np.array([-.3907528,0.,-.92049565])
F=np.array([.92049565,0.,-.3907528])
ROAD_SHA='4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b'
def xyz(d,t,y):return O+S*d+F*t+np.array([0.,y,0.])
def projection(tris,cam):
 eye,front,right,up=np.asarray(cam).reshape(4,3)
 rel=tris-eye;z=rel@front;safe=np.where(abs(z)<1e-9,1e-9,z)
 x=(1+1.35*(rel@right)/(1014/699)/safe)*W*.5
 y=(1-1.35*(rel@up)/safe)*H*.5
 return np.stack((x,y),axis=-1),z
@njit(cache=True)
def raster(p,z,ids,w,h):
 depth=np.full((h,w),np.inf);who=np.full((h,w),-1,dtype=np.int32)
 for i in range(len(ids)):
  z0,z1,z2=z[i]
  if min(z0,z1,z2)<.67:continue
  x0,y0=p[i,0];x1,y1=p[i,1];x2,y2=p[i,2]
  det=(x1-x0)*(y2-y0)-(y1-y0)*(x2-x0)
  if abs(det)<1e-6:continue
  for yy in range(max(0,int(math.floor(min(y0,y1,y2)))),min(h-1,int(math.ceil(max(y0,y1,y2))))+1):
   for xx in range(max(0,int(math.floor(min(x0,x1,x2)))),min(w-1,int(math.ceil(max(x0,x1,x2))))+1):
    a=((x1-xx-.5)*(y2-yy-.5)-(y1-yy-.5)*(x2-xx-.5))/det
    b=((x2-xx-.5)*(y0-yy-.5)-(y2-yy-.5)*(x0-xx-.5))/det
    c=1-a-b
    if min(a,b,c)<-1e-8:continue
    depthval=1/(a/z0+b/z1+c/z2)
    if depthval<depth[yy,xx]:depth[yy,xx]=depthval;who[yy,xx]=ids[i]
 return depth,who
def evaluate(dcc,native):
 assert dcc['triangles']==32004
 assert dcc['originalB48']==7 and dcc['originalB51']==28 and dcc['newColliders']==0
 assert dcc['sourcePhysicalRoad5SHA256']==ROAD_SHA
 frames=native['frames'];assert [f['tick'] for f in frames]==[15660,15744,15924]
 assert all(f['nativeWebGL2'] and f['originalB51']==28 and len(f['trueSourceCamera'])==12 for f in frames)
 V=np.asarray(dcc['vertices'],dtype=float).reshape(-1,3,6)[:,:,:3]
 ids=np.empty(len(V),dtype=np.int32);start=0
 for name,n in dcc['objects'].items():
  ids[start:start+n]=int(name[:2]);start+=n
 assert start==len(V)
 water=(ids==19)&(np.max(np.abs(V[:,:,1]-93.),axis=1)<.1)
 assert int(water.sum())==144
 source=np.array([1105.4104192514728,93.,-516.421496256048])
 candidates=[(float(d),float(t),float(y)) for d in np.arange(20.,240.,15.)
   for t in np.arange(-300.,60.,20.) for y in (74.,80.,84.,88.,90.,92.)]
 pts=np.asarray([xyz(*q) for q in candidates])
 points=pts[:,None,:].repeat(3,axis=1)
 visible=[];records=[]
 for f in frames:
  p,z=projection(V,f['trueSourceCamera'])
  depth,who=raster(p,z,ids,W,H)
  wp,wz=projection(V[water],f['trueSourceCamera'])
  wdep,_=raster(wp,wz,np.ones(int(water.sum()),dtype=np.int32),W,H)
  projected=np.isfinite(wdep)
  waterShown=projected&(wdep<=depth+1.)
  q,zz=projection(points,f['trueSourceCamera'])
  xy=q[:,0];v=zz[:,0]
  xx=np.rint(xy[:,0]).astype(int);yy=np.rint(xy[:,1]).astype(int)
  within=(xx>6)&(xx<W-5)&(yy>50)&(yy<H-15)&(v>0)
  valid=np.where(within)[0];sight=np.zeros(len(pts),dtype=bool)
  sight[valid]=v[valid]<depth[yy[valid],xx[valid]]-1
  visible.append(sight)
  sp,sz=projection(source.reshape(1,1,3).repeat(3,axis=1),f['trueSourceCamera'])
  sx,sy=sp[0,0];ix=int(round(sx));iy=int(round(sy))
  records.append({'original240HzTick':f['tick'],
   'originalR49Group19AllVisibleApproxHalfResPixels':int(np.sum(who==19)),
   'protected19SurfaceY93Triangles':int(water.sum()),
   'waterSurfaceProjectedHalfResPixels':int(np.sum(projected)),
   'waterSurfaceVisibleAfterOriginalDepthHalfResPixels':int(np.sum(waterShown)),
   'R61ActualSourceEnd':{'projectedFullCanvasXY':[round(float(sx*2),1),round(float(sy*2),1)],
    'sourceDepthM':round(float(sz[0,0]),3),
    'frontDepthM':round(float(depth[iy,ix]),3),
    'frontObjectPrefix':int(who[iy,ix])},
   'newOutboardGridVisibleCount':int(np.sum(sight))})
 both=np.logical_and.reduce(visible)
 nearby=[]
 for i in np.where(both)[0]:
  coords=[]
  for f in frames:
   p,z=projection(pts[i][None,None,:].repeat(3,axis=1),f['trueSourceCamera'])
   coords.append([round(float(2*p[0,0,0]),1),round(float(2*p[0,0,1]),1)])
  nearby.append({'localD_T_Y':list(candidates[i]),
    'distanceFromActualProtectedSourceEndM':round(float(np.linalg.norm(pts[i]-source)),2),
    'screenXYapprox':coords})
 nearby.sort(key=lambda a:a['distanceFromActualProtectedSourceEndM'])
 return {'schema':'k4ct-r62-original-native-camera-protected-water-visibility-v1',
  'method':'Actual original Chromium 240Hz camera + actual Blender triangle positions; half-res CPU z-raster only, NOT an actual new native Chromium water rendering and not an exhaustive geometry proof',
  'sourceProtected':{'originalB48':7,'originalB51':28,'newColliders':0,'DCCtriangles':32004,'originalWater19SurfaceTriangles':144,'originalGameAndProtectedMeshUnedited':True},
  'frames':records,
  'alternativeOutboardSample':{'gridPoints':len(candidates),'seenAll3':int(np.sum(both)),
   'nearest':nearby[:12],'limits':'coarse screen-space samples only; none are directly the protected source'},
  'verdict':{'R61FallSite':'EARLY_ORIGINAL_WATER_SOURCE_OCCLUDED_APPROX',
   'ART':'HOLD','HUMAN':'HOLD','SAT':'HOLD','CCD':'HOLD','FPS':'HOLD','RELEASE':'HOLD','MERGE':'HOLD',
   'formalARTAdopted':0,'slope2DNAMetres':0,
   'NEXT':'Do not spend another true Blender/native CI on the same R61 hidden water inlet. Genuine native early-source visibility or a physically convincing new outboard water route must first be established under protected original constraints.'}}
def main(args):
 if len(args)!=4:raise SystemExit(__doc__)
 a,b,c=map(Path,args[1:]);old=(hashlib.sha256(a.read_bytes()).hexdigest(),hashlib.sha256(b.read_bytes()).hexdigest())
 result=evaluate(json.loads(a.read_text()),json.loads(b.read_text()))
 assert old==(hashlib.sha256(a.read_bytes()).hexdigest(),hashlib.sha256(b.read_bytes()).hexdigest())
 result['inputSHA256']={'R49_REAL_DCC':old[0],'R60_ACTUAL_ORIGINAL_240HZ_CAMERA':old[1]}
 c.parent.mkdir(parents=True,exist_ok=True);c.write_text(json.dumps(result,indent=2)+'\n')
 print(json.dumps({'ticks':[f['original240HzTick'] for f in result['frames']],
  'waterSurfaceVisible':[f['waterSurfaceVisibleAfterOriginalDepthHalfResPixels'] for f in result['frames']],
  'sampledAll3':result['alternativeOutboardSample']['seenAll3'],
  'ART':result['verdict']['ART']}))
if __name__=='__main__':main(sys.argv)
