"""R15J: two genuinely editable terrain-anchored urban *massing studies*.

Actual original R1 cameras / CX18 / B48 / B51. Competing macros on ONE
same-world R15I4 road/CX candidate: LANDSCAPE and RIFT. Not game geometry,
not a certified load path, human entrance, visual ART or original WebGL.
Never treat fewer intersections or higher pixels as an ART pass.
"""
import bpy,sys,os,json,math,collections
from mathutils import Vector
from mathutils.bvhtree import BVHTree
argv=sys.argv[sys.argv.index("--")+1:]
def arg(k):
 assert k in argv,k
 return argv[argv.index(k)+1]
road=arg("--road");variant=arg("--variant")
assert road in ("true-pinch","pinch-switch") and variant in ("LANDSCAPE","RIFT")
out=arg("--out");os.makedirs(out,exist_ok=True)
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
TARGET="B48 original physics p93-CROWN_REVERSAL-01:559:572"
study=json.load(open(arg("--r15i4"),encoding="utf8"))
road_preflight=json.load(open(arg("--r15i"),encoding="utf8"))
native=json.load(open(arg("--native"),encoding="utf8"))
hazards=json.load(open(arg("--hazards"),encoding="utf8"))
assert study["schema"]=="dopagaki.r15i4-dual-original-source-multicamera-true-cx-access-grade-shortlist/1"
assert study["sourceBlob"]==native["sourceCXBlob"]==hazards["sourceCXBlob"]==SRC
assert native["road"]==hazards["road"]==road
assert len(native["frames"])==13 and len(hazards["hazards"])==28
site=next(x for x in study["gradeAndEarlyCameraSelectionOnlyNotBuilt"] if x["id"]==TARGET)
assert site["theoreticalBezierApproachMetres"]<85 and site["theoretical32SegmentMaxSlope"]<.09
road_test=next(x for x in road_preflight["originalPairedWorldCandidateEvaluations"][road] if x["id"]==TARGET)
assert road_test["rimMid"]==site["originalRoadRimXYZ"]
assert road_test["originalB48InboardSurfaceWitness"] is not None
a=Vector(site["originalRoadRimXYZ"])
outward_source=Vector(road_test["outward"])
c=Vector(site["originalCXTerrainLandingWorldXYZ"])
horiz=c-a;horiz.y=0
along=horiz.normalized()
across=Vector((-along.z,0,along.x))
p0=a+along*.08
p1=a+(c-a)*.22+Vector((0,.05,0))
p2=c-(c-a)*.33+Vector((0,.10,0))
p3=c
def bez(t):
 q=1-t
 return p0*q**3+p1*3*q*q*t+p2*3*q*t*t+p3*t**3
def tan(t):
 q=1-t
 v=3*(p1-p0)*q*q+6*(p2-p1)*q*t+3*(p3-p2)*t*t;v.y=0
 return v.normalized()
path=[bez(i/40) for i in range(41)]
grade=max(abs(y.y-x.y)/max(math.hypot(y.x-x.x,y.z-x.z),.001) for x,y in zip(path,path[1:]))
assert grade<.09,grade

bpy.ops.wm.open_mainfile(filepath=arg("--source"))
scene=bpy.context.scene
assert scene["DO_SCENE_IS_NOT_GAME_WEBGL"] and scene["DR_ACTUAL_B48_MESH_COUNT"]==7
CX=[o for o in bpy.data.objects if o.get("game_world_xyz_unmodified")]
B48=[o for o in bpy.data.objects if o.get("MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER")]
B51=[o for o in bpy.data.objects if o.get("SOURCE_ORIGINAL_B51_ID")]
MOV=[o for o in bpy.data.objects if o.get("R1_B51_ID")]
assert (len(CX),len(B48),len(B51),len(MOV))==(18,7,28,28)
cams=bpy.data.collections["DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION"]
early=bpy.data.collections["R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION"]
assert len(cams.objects)==5 and len(early.objects)==8
def signature():
 return (sorted((o.name,o["source_sha256"],len(o.data.polygons)) for o in CX),
 sorted((o.name,o["ORIGINAL_GAME_B48_SHA256"],len(o.data.polygons)) for o in B48),
 sorted((o.name,o["SOURCE_ORIGINAL_B51_ID"],len(o.data.vertices)) for o in B51),
 sorted((o.name,float(o["true_240hz_time"])) for o in cams.objects))
orig=signature()
def bvh(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
  [tuple(f.vertices) for f in o.data.polygons],all_triangles=False)
original=[("CX",o,bvh(o)) for o in CX]+[("B48",o,bvh(o)) for o in B48]
sourceCx=[o for o in CX if o.name==site["originalCXSourceMeshName"]]
assert len(sourceCx)==1,site["originalCXSourceMeshName"]
near,n,j,d=bvh(sourceCx[0]).find_nearest(c,2.0)
assert near is not None and (near-c).length<.6 and n.y>.75,("CX_LANDING_NOT_UPWARD_FACING",site["id"],n.y)
# Visible-from-road at time t13 and genuine B48 road surface at entrance.
road_sources=[t for k,o,t in original if k=="B48"]
assert any(t.ray_cast(a-outward_source*.45+Vector((0,3,0)),Vector((0,-1,0)),6)[0] is not None for t in road_sources)
col=bpy.data.collections.new("R15J "+variant+" ORIGINAL ROAD AND CX MASSING HUMAN ART HOLD")
scene.collection.children.link(col)
def mat(name,rgb,metal):
 m=bpy.data.materials.new("R15J "+variant+" "+name);m.use_nodes=True
 m.diffuse_color=(*rgb,1)
 nd=m.node_tree.nodes.get("Principled BSDF")
 nd.inputs["Base Color"].default_value=(*rgb,1)
 nd.inputs["Metallic"].default_value=metal
 nd.inputs["Roughness"].default_value=.43
 return m
mats={
 "stone":mat("layered pale shell",(.68,.74,.69),.24),
 "shadow":mat("inner dark occupied hollow",(.09,.20,.23),.26),
 "metal":mat("warm amber joints",(.49,.28,.16),.65),
 "glass":mat("teal city circulation",(.19,.52,.58),.36),
 "green":mat("public landscape strata",(.15,.36,.25),.09)}
built=[]
def obj(name,verts,faces,skin,role):
 me=bpy.data.meshes.new(name);me.from_pydata([tuple(x) for x in verts],[],faces);me.update()
 o=bpy.data.objects.new("R15J "+variant+" "+name,me)
 col.objects.link(o);me.materials.append(mats[skin])
 o["R15J_ROLE"]=role;o["R15J_GAME_COLLIDER"]=False
 o["R15J_BUILDING_STRUCTURAL_CERTIFIED"]=False
 built.append(o);return o
def at(u,v,y=0):
 return c+along*u+across*v+Vector((0,y,0))
def prism_strip(name,pts,width,depth,skin,role):
 vs=[];f=[]
 for i,p in enumerate(pts):
  direction=(pts[min(i+1,len(pts)-1)]-pts[max(i-1,0)])
  direction.y=0
  if direction.length<1e-6:direction=along.copy()
  s=Vector((-direction.z,0,direction.x)).normalized()
  vs.extend([p+s*width*.5+Vector((0,depth*.5,0)),
       p-s*width*.5+Vector((0,depth*.5,0)),
       p-s*width*.5-Vector((0,depth*.5,0)),
       p+s*width*.5-Vector((0,depth*.5,0))])
 f.append((3,2,1,0));n=len(pts)-1
 f.append(tuple(4*n+i for i in range(4)))
 for i in range(n):
  for j in range(4):
   f.append((4*i+j,4*i+(j+1)%4,4*(i+1)+(j+1)%4,4*(i+1)+j))
 return obj(name,vs,f,skin,role)
# Actual longitudinal continuous study floor: a broad 8m approach, not
# a guarantee that source B48 and CX endpoints join without a gap.
prism_strip("01 B48 to CX 44m research entry ribbon",path,7.2,.42,"stone",
    "PHYSICAL_EDITABLE_STUDY_FLOOR_NO_CONTINUOUS_HUMAN_TRAVERSAL_CERTIFICATION")
# Ground-related public ground-plane: 4 radial platforms whose ends
# fan out at the roadbank, shaped as curved bands (not repeated boxes).
for i,(v0,v1,width) in enumerate(((-17,-9,5),(-8,-1,7),(1,9,7),(10,20,5))):
 pts=[at(3+12*t, v0+(v1-v0)*t+2*math.sin(math.pi*t),.75+1.8*t) for t in (0,.25,.5,.75,1)]
 prism_strip("02 inhabited terrain-facing terrace "+str(i),pts,width,.65,
      "green" if i in (0,3) else "stone","TERRACED_PUBLIC_OCCUPANCY_CONCEPT_NO_HUMAN_ACCESS_PROOF")
# OPEN multi-story civic void between two distinct not-boxy outer masses.
# Frontally facing the same ORIGINAL path; no overhead face seals the 18m gap.
def wing(name,sign,scaleheight,drift,skin):
 levels=(0,6,12,19,27,34)
 vs=[]
 for y in levels:
  t=y/34
  # Sculpted variable-width/lateral twisting non-rectangular volume.
  base_v=sign*(16+3*t+2*math.sin(math.pi*t))
  offset=4+2*math.sin(math.pi*t)+drift*t
  u=16+4*t+2*math.sin(math.pi*t)
  half=6.0-1.2*t
  height=y*scaleheight
  for du,dv in ((-8,-half),(-8,half),(8,half),(8,-half)):
   vs.append(at(u+du+offset,base_v+dv,height))
 faces=[(3,2,1,0),(20,21,22,23)]
 for i in range(len(levels)-1):
  for j in range(4):
   faces.append((4*i+j,4*i+(j+1)%4,4*(i+1)+(j+1)%4,4*(i+1)+j))
 return obj(name,vs,faces,skin,"GROUNDED_FORM_HYPOTHESIS_CX_NEAREST_SURFACE_NOT_STRUCTURAL_ANCHOR")
if variant=="LANDSCAPE":
 wing("03 asym east carved ridge",1,1.0,-3,"stone")
 wing("04 asym west inhabited cliff", -1,.73,5,"shadow")
 # Single low connecting civic gallery crosses OUTSIDE of principal void.
 prism_strip("05 peripheral landscape connection",[
  at(15,-27,5),at(25,-28,7),at(31,-10,9)],4.2,.6,"glass","CONNECTION_OUTSIDE_PRIMARY_VOID")
 # Individually slanted terraces connecting to landscape without microboxes.
 for i,side in enumerate((-1,1)):
  prism_strip("06 stepped civic balcony "+str(i),
    [at(18,side*12,7),at(24,side*19,9),at(32,side*26,12)],
    6.5,.65,"metal","INHABITED_LAYER_HYPOTHESIS")
else:
 wing("03 high fissured transit escarpment",1,1.18,-7,"shadow")
 wing("04 low split cultural slope",-1,.58,8,"stone")
 # Offset separated platforms; the sky void remains literal open air.
 for i,(v,raise_y) in enumerate(((13,8),(-14,5),(19,17))):
  prism_strip("05 asymmetric fault terrace "+str(i),
   [at(8,v,raise_y),at(15,v+2,raise_y+1),at(26,v+6,raise_y+2)],
   5.6,.75,"glass" if i==0 else "metal","SPLIT_PUBLIC_VOID_PERIPHERAL_TERRACE")
# A literal 18m wide sky-open gap at z-sides through the whole central axis.
void_test_origin=at(20,0,3)
void_clear={}
for y in (3,10,18,26):
 pt=at(20,0,y)
 strikes=[]
 for o in built:
  hit,n,j,d=bvh(o).ray_cast(pt,Vector((0,0,1)),15)
  # Horizontal main cavity check, along source circulation instead of
  # confusing the floor with an empty shaft.
  if hit is not None:strikes.append(o.name)
 void_clear[str(y)]=strikes
# Collision counts are reported, NEVER waived or replaced by an art claim.
collision=[]
for o in built:
 t=bvh(o)
 for k,old,oldtree in original:
  over=t.overlap(oldtree)
  if over:collision.append([o.name,k,old.name,len(over)])
# B51 conservative ORIGINAL moving swept AABB against the actual built
# geometric AABB; coarse-positive warnings remain warnings.
def bound(o):
 pts=[o.matrix_world@v.co for v in o.data.vertices]
 return {"min":[min(q[i] for q in pts) for i in range(3)],
         "max":[max(q[i] for q in pts) for i in range(3)]}
def overlap(a,b):
 return all(a["min"][i]<=b["max"][i] and b["min"][i]<=a["max"][i] for i in range(3))
mover_warnings=[]
for o in built:
 bb=bound(o)
 for h in hazards["hazards"]:
  if h["sampledAabb"] and overlap(bb,h["sampledAabb"]):
   mover_warnings.append([o.name,h["id"]])
# The original 13 frame source camera R1 first-hit against every new mesh.
firsthit={}
for fi,f in enumerate(native["frames"],1):
 scene.frame_set(fi);bpy.context.view_layer.update()
 cam=cams.objects.get(f["id"]+" REAL ORIGINAL 240HZ") or early.objects.get("R1 "+f["id"]+" SOURCE CAMERA")
 assert cam and (cam.location-Vector(f["eye"])).length<.0002
 front=Vector(f["front"]).normalized()
 right=front.cross(Vector((0,1,0))).normalized()
 up=right.cross(front).normalized()
 active={m["id"] for m in f["moving"] if m["enabled"]}
 nodes=[("NEW",o,bvh(o)) for o in built]+original+[("B51",o,bvh(o)) for o in MOV if o["R1_B51_ID"] in active]
 counts=collections.Counter()
 for iy in range(12):
  for ix in range(19):
   u=(ix+.5)/19;v=(iy+.5)/12
   ray=(front+right*((u-.5)*2/1.35*(1008/645))+up*((.5-v)*2/1.35)).normalized()
   best=2500;winner="SKY"
   for kind,o,t in nodes:
    h,n,j,d=t.ray_cast(cam.location,ray,best)
    if h is not None and d is not None and d<best:best=d;winner=kind
   counts[winner]+=1
 firsthit[f["id"]]={"newStudyFirstHits":counts["NEW"],"originalSourceCameraRays":228,
                     "newStudyFirstHitFraction":round(counts["NEW"]/228,5)}
assert signature()==orig
scene["R15J_PRIVATE_SOURCE_MASSING_ONLY"]=True
scene["R15J_GAME_WEBGL_RENDERED"]=False
scene["R15J_ORIGINAL_GAME_COLLIDERS_ADDED"]=0
scene["R15J_STRUCTURAL_HUMAN_AND_ART"]="HOLD"
scene.cycles.device="CPU";scene.cycles.samples=5;scene.cycles.use_denoising=False
scene.render.threads_mode="FIXED";scene.render.threads=2
scene.render.image_settings.file_format="PNG"
scene.frame_set(1)
blend="R15J_"+variant+"_"+road+"_SOURCE_EDITABLE_NOT_GAME.blend"
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
images=[]
for time in ("t1100","t1200","t1300","t1400","t1500","t1600","t1700"):
 idx=next(i for i,f in enumerate(native["frames"],1) if f["id"]==time)
 scene.frame_set(idx)
 cam=cams.objects.get(time+" REAL ORIGINAL 240HZ") or early.objects.get("R1 "+time+" SOURCE CAMERA")
 assert cam
 scene.camera=cam
 filename="R15J_"+variant+"_"+road+"_"+time+"_TRUE_R1_CAMERA_BLENDER_NOT_WEBGL.png"
 scene.render.filepath=os.path.join(out,filename)
 bpy.ops.render.render(write_still=True)
 images.append(filename)
assert signature()==orig
audit={"schema":"dopagaki.r15j-real-source-road-cx-two-macro-architectures-private-visual/1",
 "originalSourceBlob":SRC,"originalRoad":road,"design":variant,
 "originalRoadRimId":TARGET,"originalRoadRimWorldXYZ":[round(float(v),4) for v in a],
 "originalCXExactLandingXYZ":[round(float(v),4) for v in c],
 "originalCXSourceObject":sourceCx[0].name,
 "originalCXSurfaceNearestDistance":round((near-c).length,5),
 "actualEditableBlenderObjectCount":len(built),
 "realOriginalCollisionTriangleOverlapPairsNotWaived":collision,
 "all28B51Original721TickCoarseAABBWarningsNotWaived":mover_warnings,
 "sourceR1CameraThirteenFrameInitialHit":firsthit,
 "sourceR1SevenFramesActuallyRendered":images,
 "privateEditableBlend":blend,
 "openMainVoidSampledHorizontalRayHitsNotArtProof":void_clear,
 "newSourceGameColliders":0,"originalSourceGameModified":False,
 "sourceActualBrowserWebGL":False,"humanStructuralLoadingCertified":False,
 "actualRoadToBuildingFullWidthHumanWalkCertified":False,
 "originalB51HumanWarningFairnessCertified":False,
 "genuineArtApproved":False,"officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD","PERFORMANCE":"HOLD",
 "INTEGRATION":"HOLD","RELEASE":"HOLD","MERGE":"HOLD"}
with open(os.path.join(out,"R15J_"+variant+"_"+road+"_SOURCE_MASSING_AND_CAMERA_AUDIT.json"),"w",encoding="utf8") as f:
 json.dump(audit,f,indent=2,ensure_ascii=False)
print("R15J_TRUE_PRIVATE_ORIGINAL_WORLD",variant,road,"editable",len(built),
 "source_triangle_collisions",len(collision),"B51_AABB_WARNINGS",len(mover_warnings),
 "t13_pixel_fraction",firsthit["t1300"]["newStudyFirstHitFraction"],
 "ART NOT CERTIFIED",flush=True)
