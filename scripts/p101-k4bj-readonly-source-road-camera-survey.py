"""Read-only real B48 Road5 / immutable source-camera geometry survey K4BJ.

No construction, no image fabrication, no runtime gameplay. Measures actual
source triangulated road vs unmodified original fixed-pose camera, to prevent
further misplaced facade/rail research.
"""
import bpy,sys,os,json,hashlib,struct,statistics,math
from collections import defaultdict
from mathutils import Vector
a=sys.argv[sys.argv.index("--")+1:]
def flag(k):return os.path.abspath(a[a.index(k)+1])
base,out=flag("--base"),flag("--out")
os.makedirs(out,exist_ok=True)
def sha(fn):
 h=hashlib.sha256()
 with open(fn,"rb") as f:
  for b in iter(lambda:f.read(1<<20),b""):h.update(b)
 return h.hexdigest()
assert sha(base)=="93526d4adff8f1061081109123f7619de9bb6a0b835b15af6baf9bf6bb3ba086"
bpy.ops.wm.open_mainfile(filepath=base)
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
def getcamera(t):
 m=[o for o in rig.objects if o.type=="CAMERA" and str(t) in o.name]
 assert len(m)==1
 return m[0]
cam=getcamera(11307)
sister=getcamera(11341)
roadcol=bpy.data.collections["K4AY SOURCE B48 | CONTROL | TRUE TESSELLATED ROAD5"]
assert len(roadcol.objects)==1
road=next(iter(roadcol.objects))
assert len(road.data.polygons)==4728
def fp(o):
 h=hashlib.sha256()
 for v in o.data.vertices:h.update(struct.pack("<3d",*[float(q) for q in v.co]))
 for f in o.data.polygons:h.update(struct.pack("<3i",*[int(q) for q in f.vertices]))
 return h.hexdigest()
before=fp(road)
assert before=="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
C=cam.location.copy()
fr=cam.matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((fr.x,fr.y,0)).normalized()
S=Vector((-F.y,F.x,0))
def coords(world):
 vec=world-C
 return (float(vec.dot(F)),float(vec.dot(S)),float(vec.z))
worldverts=[road.matrix_world@v.co for v in road.data.vertices]
viewverts=[coords(p) for p in worldverts]
quant=lambda seq,q:sorted(seq)[min(len(seq)-1,max(0,round(q*(len(seq)-1))))] if seq else None
def dist(v):
 return {"count":len(v),"min":round(min(v),3) if v else None,
         "p05":round(quant(v,.05),3) if v else None,
         "median":round(quant(v,.5),3) if v else None,
         "p95":round(quant(v,.95),3) if v else None,
         "max":round(max(v),3) if v else None}
dall=[x[0] for x in viewverts]
sall=[x[1] for x in viewverts]
zall=[x[2] for x in viewverts]
# Genuine physical source mesh width per near-camera longitudinal band,
# not a projected image's apparent width in pixels.
bands=[]
for lo,hi in [(-200,-100),(-100,-50),(-50,-25),(-25,0),(0,25),
              (25,50),(50,75),(75,100),(100,150),(150,200),
              (200,300),(300,450),(450,650),(650,950)]:
 part=[(d,s,z) for d,s,z in viewverts if lo<=d<hi]
 bands.append({"dMin":lo,"dMax":hi,"vertexCount":len(part),
              "s":dist([s for d,s,z in part]),
              "heightRelativeCamera":dist([z for d,s,z in part])})
# Read-only exact object ray cast. This is not a B51 safety or collider
# clearance validation; merely actual mesh intersection along world up.
ob=road
inv=ob.matrix_world.inverted()
def P(d,s,z):return C+F*d+S*s+Vector((0,0,z))
def hit(d,s):
 w=P(d,s,700)
 orig=inv@w
 dr=(inv.to_3x3()@Vector((0,0,-1))).normalized()
 yes,p,n,i=ob.ray_cast(orig,dr,distance=2200)
 if not yes:return None
 wp=ob.matrix_world@p
 return {"d":round(d,2),"s":round(s,2),
         "heightRelativeCam":round(float(wp.z-C.z),3),
         "face":int(i)}
# Survey broad lateral section on actual source road at controlled d.
sections=[]
svals=[-200,-157,-120,-80,-60,-40,-30,-25,-20,-18,-15,-12,-10,-8,-6,
       -4,-2,0,2,4,6,8,10,12,15,18,20,25,30,40,60,80,120,157,200]
for d in (-60,-20,0,20,50,100,150,250,350,500,750):
 arr=[hit(d,s) for s in svals]
 good=[x for x in arr if x]
 sections.append({"distanceForward":d,"testedOffsetsM":svals,
                  "hitOffsetsM":[r["s"] for r in good],
                  "missOffsetsM":[s for s,x in zip(svals,arr) if x is None],
                  "hitCount":len(good),"hitHeights":good})
assert before==fp(road)
assert sister.type=="CAMERA"
data={"schema":"dopagaki.K4BJ.read-only-source-road5-camera-scale-probe/1",
 "parentBlendSha256":sha(base),
 "originalGameBlob":"af076d67492a677d2235e4730aef8cdf4808e106",
 "originalRoad5GeometryFingerprintPreserved":before==fp(road),
 "sourceCamera":{"name":cam.name,"eye":list(map(float,cam.location)),
                 "forwardHorizontal":list(map(float,F)),
                 "rightHorizontal":list(map(float,S)),
                 "lens":float(cam.data.lens)},
 "physicalSourceRoadMesh":{"vertices":len(worldverts),"triangles":len(road.data.polygons),
   "projectedDistanceForwardM":dist(dall),"projectedLateralM":dist(sall),
   "relativeVerticalM":dist(zall),"bands":bands},
 "actualSourceRoadVerticalRaycastSections":sections,
 "roadEdgeAt157mPreviouslyNoHits":True,
 "safetyAndCollisionClearance":"NOT_TESTED_HOLD",
 "CAVEAT":"Vertex d bands are coarse geometry support, not exact safe rideable width. Rays are surface hits, not dynamic swept-volume clearance.",
 "ART":"REJECT_PREVIOUS_HOLD","formalArtAccepted":0,"slope2DNAAcceptedMetres":0,
 "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD"}
outpath=os.path.join(out,"K4BJ_REAL_SOURCE_ROAD_CAMERA_SCALE_SURVEY.json")
with open(outpath,"w") as f:json.dump(data,f,indent=2,ensure_ascii=False)
print("K4BJ_REAL_ROAD_SURVEY_SOURCE_PRESERVED",
 json.dumps({"vertexProjectedLaterals":data["physicalSourceRoadMesh"]["projectedLateralM"],
             "raycastSections":[{"d":x["distanceForward"],"hits":x["hitOffsetsM"]} for x in sections]},
             ensure_ascii=False))
