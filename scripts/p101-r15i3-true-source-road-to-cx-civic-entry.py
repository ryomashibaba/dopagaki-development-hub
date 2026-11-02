"""R15I3: ONE actual editable source-side civic entry promenade.

Uses real selected original paired B48 road rim and real CX promenade:
both-world same XYZ, near-level 27.57m connection, not a floating box.
Renders both original source cameras at 11-17 s. Not a new game collider
or structural load, human walkability, gameplay, art, WebGL certification.
"""
import bpy,sys,json,os,math,collections
from mathutils import Vector
from mathutils.bvhtree import BVHTree
args=sys.argv[sys.argv.index("--")+1:]
def arg(x):
 assert x in args,x
 return args[args.index(x)+1]
road=arg("--road");assert road in ("true-pinch","pinch-switch")
out=arg("--out");os.makedirs(out,exist_ok=True)
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
TARGET="B48 original physics p93-CROWN_REVERSAL-01:689:702"
source=json.load(open(arg("--r15i"),encoding="utf8"))
route=json.load(open(arg("--r15i2"),encoding="utf8"))
native=json.load(open(arg("--native"),encoding="utf8"))
assert source["originalSourceCXBlob"]==route["originalSourceCXBlob"]==native["sourceCXBlob"]==SRC
assert native["road"]==road and len(native["frames"])==13
orig=next(x for x in source["originalPairedWorldCandidateEvaluations"][road] if x["id"]==TARGET)
site=next(x for x in route["sourceResultsByRoad"][road] if x["id"]==TARGET)
assert site["bestUnobstructedHypotheticalCXBrace"] is not None
assert site["priorOriginalCameraUnoccludedFrameCount"]>=2
assert site["originalB48RoadRimWitness"] and site["priorRoadAdjacent8x6SourceGeometryClear"]
a=Vector(orig["rimMid"]);b=Vector(orig["testDeckCenterXYZ"])
c=Vector(site["bestUnobstructedHypotheticalCXBrace"]["trueNearestTriangleWorldXYZ"])
outward=Vector(orig["outward"])
along=Vector(orig["along"])
assert abs(c.y-b.y)<1 and 24<(b-c).length<35
assert site["bestUnobstructedHypotheticalCXBrace"]["originalTerrainSurfaceNormal"][1]>.75
assert (a-b).length<6
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
   sorted((o.name,o["SOURCE_ORIGINAL_B51_ID"],len(o.data.vertices)) for o in B51))
before=signature()
def tree(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
   [tuple(f.vertices) for f in o.data.polygons],all_triangles=False)
original=[("CX",o,tree(o)) for o in CX]+[("B48",o,tree(o)) for o in B48]
# Reconfirm genuine original ROAD and CX landing surfaces by independent rays.
def contact(start,direction,length,items):
 hits=[]
 for cat,o,tr in items:
  h,n,j,dist=tr.ray_cast(start,direction,length)
  if h is not None:hits.append((dist,cat,o.name,h,n))
 return sorted(hits,key=lambda x:x[0])
atroad=contact(a-outward*.45+Vector((0,3,0)),Vector((0,-1,0)),5,
  [x for x in original if x[0]=="B48"])
atcx=contact(c+Vector((0,3,0)),Vector((0,-1,0)),5,
  [x for x in original if x[0]=="CX"])
assert atroad and abs(atroad[0][3].y-a.y)<1.5
# R15I2 selected the nearest point on an EXACT original source CX mesh.
# A DOWNWARD RAY across ALL CX meshes may hit a DIFFERENT overlying source
# mesh first, so that is not an identity test of the chosen contact point.
cx_name=site["bestUnobstructedHypotheticalCXBrace"]["cxTerrainSource"]
cx_sources=[(o,tr) for kind,o,tr in original if kind=="CX" and o.name==cx_name]
assert len(cx_sources)==1,(cx_name,len(cx_sources))
cx_hit,cx_normal,cx_index,cx_near_distance=cx_sources[0][1].find_nearest(c,1.0)
assert cx_hit is not None and (cx_hit-c).length<.6 and cx_normal.y>.75,(
  cx_name,c, cx_hit,cx_normal,cx_near_distance)
# The independent all-CX vertical witness is logged separately, with no
# claim that all-CX upward obstruction is harmless.
cx_vertical_nearest=atcx[0] if atcx else None
print("R15I3_CX_RECHECK",road,"target",cx_name,"target_surface_distance",
 round(float((cx_hit-c).length),4),"vertical_first_source",
 cx_vertical_nearest[2] if cx_vertical_nearest else None,
 "vertical_first_delta",round(float((cx_vertical_nearest[3]-c).length),4)
 if cx_vertical_nearest else None,flush=True)
# Curve footpath along the genuine B48 source rim to an actual existing
# CX roadbank-promenade. No invented vertical lift or disconnected sky dock.
p0=a+outward*.08
p1=b+outward*2.0
p2=c-(c-b)*.40+Vector((0,.05,0))
p3=c
def bezier(t):
 q=1-t
 return p0*q**3+p1*(3*q*q*t)+p2*(3*q*t*t)+p3*t**3
def tangent(t):
 q=1-t
 return (3*(p1-p0)*q*q+6*(p2-p1)*q*t+3*(p3-p2)*t*t).normalized()
N=32
path=[bezier(i/N) for i in range(N+1)]
grade=[]
for aa,bb in zip(path,path[1:]):
 h=math.hypot(aa.x-bb.x,aa.z-bb.z)
 grade.append(abs(bb.y-aa.y)/max(h,.001))
assert max(grade)<.09, max(grade)
assert min(math.dist(path[i],path[i+1]) for i in range(N))>.12
col=bpy.data.collections.new("R15I3 ORIGINAL ROAD CONNECTED EDITABLE CIVIC GALLERY - ART HOLD")
scene.collection.children.link(col)
def material(name,rgb,metal=0):
 m=bpy.data.materials.new("R15I3 "+name)
 m.diffuse_color=(*rgb,1);m.use_nodes=True
 p=m.node_tree.nodes.get("Principled BSDF")
 p.inputs["Base Color"].default_value=(*rgb,1)
 p.inputs["Metallic"].default_value=metal;p.inputs["Roughness"].default_value=.47
 return m
materials={
 "pale":material("open source light limestone",(.72,.78,.77),.21),
 "teal":material("teal tensile form",(.16,.36,.42),.48),
 "copper":material("warm structural composite",(.51,.30,.19),.62),
 "light":material("cityline sky glaze",(.30,.72,.72),.46)}
built=[]
def mesh(name,vertices,faces,skin,role):
 m=bpy.data.meshes.new(name)
 m.from_pydata([tuple(p) for p in vertices],[],faces);m.update()
 ob=bpy.data.objects.new("R15I3 "+name,m)
 col.objects.link(ob);m.materials.append(materials[skin])
 ob["R15I3_ROLE"]=role;ob["R15I3_GAME_COLLIDER"]=False
 ob["R15I3_STRUCTURE_AND_HUMAN_WALK_HOLD"]=True
 built.append(ob);return ob
def ringbeam(name,points,width,depth,skin,role):
 verts=[]
 for i,p in enumerate(points):
  t=i/(len(points)-1)
  dx=tangent(t)
  side=Vector((-dx.z,0,dx.x)).normalized()
  w=side*width*.5
  verts.extend([p+w+Vector((0,depth*.5,0)),p-w+Vector((0,depth*.5,0)),
    p-w-Vector((0,depth*.5,0)),p+w-Vector((0,depth*.5,0))])
 faces=[(3,2,1,0),tuple(4*(len(points)-1)+j for j in range(4))]
 for i in range(len(points)-1):
  for j in range(4):
   faces.append((4*i+j,4*i+(j+1)%4,4*(i+1)+(j+1)%4,4*(i+1)+j))
 return mesh(name,verts,faces,skin,role)
# Roadside OPEN CIVIC FLOOR, 4m to 7m width, a real continuous mesh,
# NOT a row of decorative boxes. Measurable centerline slope.
verts=[];faces=[]
for i,p in enumerate(path):
 t=i/N
 tangent0=tangent(t)
 side=Vector((-tangent0.z,0,tangent0.x)).normalized()
 w=2.2+1.15*math.sin(math.pi*t)**2+.30*t
 left=p-side*w
 right=p+side*w
 verts.extend([left+Vector((0,.12,0)),right+Vector((0,.12,0)),
   right-Vector((0,.25,0)),left-Vector((0,.25,0))])
faces.append((3,2,1,0))
faces.append(tuple(4*N+i for i in range(4)))
for i in range(N):
 for j in range(4):
  faces.append((4*i+j,4*i+(j+1)%4,4*(i+1)+(j+1)%4,4*(i+1)+j))
floor=mesh("actual continuous curved road-to-CX public path",verts,faces,"pale",
 "SOURCE_CONNECTED_PEDESTRIAN_FLOOR_GEOMETRY_NOT_HUMAN_CERTIFIED")
# Two continuous sculpted guardways follow path's open-air side, avoiding
# repeated posts and flat giant wall planes.
for sign in (-1,1):
 points=[]
 for i,p in enumerate(path):
  t=i/N;dx=tangent(t);side=Vector((-dx.z,0,dx.x)).normalized()
  w=2.28+1.15*math.sin(math.pi*t)**2+.30*t
  points.append(p+side*sign*(w+.18)+Vector((0,.90+.30*math.sin(math.pi*t),0)))
 ringbeam("open continuous curving edge "+str(sign),points,.34,.26,
          "copper","LOW_SCULPTED_GUARD_NOT_TALL_HAZARD_BLIND_WALL")
# A load-bearing-looking triangular open web, genuinely attached to the same
# continuous floor and actual CX surface. Engineering strength NOT certified.
def web(name,points,skin):
 return ringbeam(name,points,.66,.60,skin,"VISIBLE_REAL_MESH_CONNECTOR_NOT_LOAD_CERTIFIED")
for t,offset in ((.28,-.65),(.67,.65)):
 mid=bezier(t)
 q=mid+Vector((0,-.24,0))
 junction=c+Vector((0,.20,0))
 web("open source CX diagonal brace "+str(t),[q+Vector((0,offset,0)),
      (q+junction)*.5+Vector((0,-1.8,0)),junction],
     "teal")
# One asymmetrically folded open civic shade, never a repetition of the
# floating R15H arches. Segmented shell follows occupied pedestrian level.
# Visible gap below canopy allows the road and B51 to remain exposed.
roofV=[];roofF=[]
for i in range(19):
 t=.23+.60*i/18
 p=bezier(t)
 dx=tangent(t);side=Vector((-dx.z,0,dx.x)).normalized()
 roofheight=4.6+2.2*math.sin(math.pi*(t-.23)/.60)
 edge0=p+side*2.8+Vector((0,roofheight,0))
 edge1=p+side*6.2+Vector((0,roofheight+2.5*math.sin(math.pi*t),0))
 roofV.extend([edge0,edge1,edge1+Vector((0,.55,0)),edge0+Vector((0,.55,0))])
roofF.extend([(3,2,1,0),(72,73,74,75)])
for i in range(18):
 for j in range(4):
  roofF.append((4*i+j,4*i+(j+1)%4,4*(i+1)+(j+1)%4,4*(i+1)+j))
mesh("one non-repeating folded open sky shade",roofV,roofF,"light",
 "ASYMMETRIC_LIGHT_OPEN_AIR_SHADE_ART_HOLD")
assert len(built)==6,len(built)
# Compare real original collision triangles with EACH editable new object;
# contact at the genuine CX/road ends is recorded, NOT waived as a full pass.
collisions=[]
for obj in built:
 tr=tree(obj)
 for category,srcobj,originalBvh in original:
  pairs=tr.overlap(originalBvh)
  if pairs:collisions.append([obj.name,category,srcobj.name,len(pairs)])
assert signature()==before
# Visibility test reuses exact source-native eye/front cameras and original
# source CX/B48/B51 3D. Only initial source ray hits, NOT real WebGL.
frameVisibility={}
for fi,f in enumerate(native["frames"],1):
 scene.frame_set(fi);bpy.context.view_layer.update()
 cam=cams.objects.get(f["id"]+" REAL ORIGINAL 240HZ") or early.objects.get("R1 "+f["id"]+" SOURCE CAMERA")
 assert cam and (cam.location-Vector(f["eye"])).length<.0002
 front=Vector(f["front"]).normalized()
 right=front.cross(Vector((0,1,0))).normalized()
 up=right.cross(front).normalized()
 active={x["id"] for x in f["moving"] if x["enabled"]}
 moving=[("B51",o,tree(o)) for o in MOV if o["R1_B51_ID"] in active]
 nodes=[("R15I3",o,tree(o)) for o in built]+original+moving
 cnt=collections.Counter()
 for yi in range(12):
  for xi in range(19):
   u=(xi+.5)/19;v=(yi+.5)/12
   ray=(front+right*((u-.5)*2/1.35*(1008/645))+up*((.5-v)*2/1.35)).normalized()
   best=2500;who="SKY"
   for entry in nodes:
    kind=entry[0];tr=entry[2]
    hit,n,idx,dist=tr.ray_cast(cam.location,ray,best)
    if hit is not None and dist is not None and dist<best:
     best=dist;who=kind
   cnt[who]+=1
 frameVisibility[f["id"]]={"newGeometryFirstHit":cnt["R15I3"],
  "originalCameraRays":228,"newGeometrySourceCameraFraction":round(cnt["R15I3"]/228,5)}
assert signature()==before
scene["R15I3_REAL_SOURCE_EDITABLE_CONNECTED_FLOOR_ONLY"]=True
scene["R15I3_ACTUAL_SOURCE_GAME_WEBGL"]=False
scene["R15I3_STRUCTURE_HUMAN_AND_ART"]="HOLD"
scene["R15I3_NEW_GAME_COLLIDERS"]=0
scene.cycles.device="CPU";scene.cycles.samples=5;scene.cycles.use_denoising=False
scene.render.threads_mode="FIXED";scene.render.threads=2
scene.render.image_settings.file_format="PNG"
scene.frame_set(1)
blend="R15I3_"+road+"_ROAD_TO_CX_EDITABLE_CIVIC_ENTRY_SOURCE_ONLY.blend"
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
images=[]
for frame in ("t1100","t1200","t1300","t1400","t1500","t1600","t1700"):
 idx=next(i for i,f in enumerate(native["frames"],1) if f["id"]==frame)
 scene.frame_set(idx)
 cam=cams.objects.get(frame+" REAL ORIGINAL 240HZ") or early.objects.get("R1 "+frame+" SOURCE CAMERA")
 scene.camera=cam
 filename="R15I3_"+road+"_"+frame+"_TRUE_R1_CAMERA_BLENDER_NOT_WEBGL.png"
 scene.render.filepath=os.path.join(out,filename)
 bpy.ops.render.render(write_still=True)
 images.append(filename)
audit={"schema":"dopagaki.r15i3-real-road-to-cx-editable-civic-entry-source-prototype/1",
 "originalSourceCXBlob":SRC,"road":road,"selectedTrueOriginalB48RoadRimId":TARGET,
 "exactSourceRoadLipXYZ":[round(float(v),4) for v in a],
 "exactSourceCXPublicPromenadeContactXYZ":[round(float(v),4) for v in c],
 "originalSourceCXEndpointAndRoadSurfaceReverified":True,
 "sourceCXVerifiedLandingObject":cx_name,
 "sourceCXLandingNearestTriangleDistance":round(float((cx_hit-c).length),5),
 "allSourceCXDownwardRayFirstObject":cx_vertical_nearest[2] if cx_vertical_nearest else None,
 "allSourceCXDownwardRayFirstDistanceFromSelectedLanding":round(float((cx_vertical_nearest[3]-c).length),4) if cx_vertical_nearest else None,
 "sourcePublicPathCenterlineSampleCount":len(path),
 "sourceCurvedPathMaximumCenterlineGrade":round(max(grade),5),
 "originalSourceCX18B48_7B51_28Unchanged":signature()==before,
 "actualBlenderEditableMeshCount":len(built),
 "newGeometryAllActualSourceCXB48IntersectionsUnwaived":collisions,
 "originalSource13RealCameraFirstHit":frameVisibility,
 "sevenTrueOriginalCameraBlenderNotWebGLImages":images,
 "realEditablePrivateBlend":blend,
 "sourceRoadGeometryEdited":False,"newGameColliders":0,
 "sourceGameWebGLRendered":False,
 "realPhysicalLoadAnalysis":False,"humanContinuousTraversabilityCertified":False,
 "sourceFullB51FairnessAndAdvanceWarningsCertified":False,
 "humanVisualArtApproval":False,"officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD",
 "PERFORMANCE":"HOLD","INTEGRATION":"HOLD","RELEASE":"HOLD","MERGE":"HOLD"}
with open(os.path.join(out,"R15I3_"+road+"_TRUE_ORIGINAL_CIVIC_ENTRY_AUDIT.json"),"w",encoding="utf8") as f:
 json.dump(audit,f,ensure_ascii=False,indent=2)
print("R15I3_TRUE_ROAD_CONNECTED_GEOMETRY",road,"meshes",len(built),
 "grade",max(grade),"source collision pairs",sum(x[3] for x in collisions),
 "source new rays",[frameVisibility[t]["newGeometrySourceCameraFraction"] for t in ("t1500","t1600","t1700")],
 "UNAPPROVED PUBLIC ART/LOAD/HUMAN/GAME",flush=True)
