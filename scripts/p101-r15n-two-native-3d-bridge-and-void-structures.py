"""R15N: editable paired genuinely source-anchored B48 cantilever study, ART HOLD.

Build two materially different bridge-support / inhabitable void solutions from
ACTUAL source last-grounded position and velocity, in untouched original R1
Blender. Two roads x two approaches. Keep render of actual original R1 native
16.5/17s camera; B51 source envelope and real original terrain-foundation
witnesses. ALL newly generated meshes are STUDY ONLY, not game colliders.
"""
import bpy,os,sys,json,math,collections
from mathutils import Vector
from mathutils.bvhtree import BVHTree
a=sys.argv[sys.argv.index("--")+1:]
def arg(x):
 assert x in a,x
 return a[a.index(x)+1]
read=lambda f:json.load(open(f,encoding="utf8"))
ROOT=arg("--out");os.makedirs(ROOT,exist_ok=True)
D=read(arg("--r15m"))
R1={r:read(arg("--native-"+r)) for r in ("true-pinch","pinch-switch")}
SHA="af076d67492a677d2235e4730aef8cdf4808e106"
assert D["schema"]=="dopagaki.r15m-original-b48-world-mesh-last-grounded-and-top-boundary-240hz/1"
assert D["sourceGameBlob"]==SHA
ROADS=("true-pinch","pinch-switch")
KINDS=("A_LATTICE_RIB","B_SPLIT_CIVIC_SPINE")
def rounded(v):return [round(float(x),4) for x in v]
def bvh(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
   [tuple(p.vertices) for p in o.data.polygons],all_triangles=False)
def polyarea(o):
 return sum(p.area for p in o.data.polygons)
def bsig(cx,roads,movers):
 return {
 "CX":sorted((x.name,x["source_sha256"],len(x.data.polygons)) for x in cx),
 "B48":sorted((x.name,x["ORIGINAL_GAME_B48_SHA256"],len(x.data.polygons)) for x in roads),
 "B51":sorted((x.name,x["SOURCE_ORIGINAL_B51_ID"],len(x.data.vertices)) for x in movers)}
def material(prefix,label,rgb,metal=0,rough=.39,emit=0):
 mat=bpy.data.materials.new(prefix+" "+label);mat.use_nodes=True
 mat.diffuse_color=(*rgb,1.)
 bs=mat.node_tree.nodes.get("Principled BSDF")
 bs.inputs["Base Color"].default_value=(*rgb,1)
 bs.inputs["Metallic"].default_value=metal
 bs.inputs["Roughness"].default_value=rough
 if emit:
  bs.inputs["Emission Color"].default_value=(*rgb,1)
  bs.inputs["Emission Strength"].default_value=emit
 return mat
def worldbox(o):
 v=[o.matrix_world@p.co for p in o.data.vertices]
 return ([min(p[k] for p in v) for k in range(3)],
         [max(p[k] for p in v) for k in range(3)])
def intersect(mn,mx,othermn,othermx):
 return all(mn[i]<=othermx[i] and othermn[i]<=mx[i] for i in range(3))
def boxdynamic(frame,ob):
 # Source original B51 center, halfsize and real yaw; conservative AABB
 # envelope ±yaw cannot prove an actual mesh collision or perceptual warning.
 cx=Vector(ob["center"]);sx,sy,sz=ob["halfSize"];ang=ob["yawRadians"]
 # Conservative horizontal axis aligned yaw rectangle.
 dx=abs(math.cos(ang))*sx+abs(math.sin(ang))*sz
 dz=abs(math.sin(ang))*sx+abs(math.cos(ang))*sz
 return ([cx.x-dx,cx.y-sy,cx.z-dz],[cx.x+dx,cx.y+sy,cx.z+dz])
report={"schema":"dopagaki.r15n-real-original-b48-entry-bridge-native-camera-editable-study/1",
 "sourceBlob":SHA,"originalInputRecordedFromRealR15M":True,
 "sourceSceneRoads":list(ROADS),"studyDesigns":list(KINDS),
 "originalR1CamerasStudyOnlyNotBrowser":True,"perRoadAndDesign":{},
 "newOriginalGameColliders":0,"actualNativeRunnerWithStudyBridge":False,
 "realGameplayBridgeImplemented":False,"officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD",
 "PERFORMANCE":"HOLD","INTEGRATION":"HOLD","RELEASE":"HOLD","MERGE":"HOLD"}
for road in ROADS:
 native=R1[road]
 assert native["sourceCXBlob"]==SHA and len(native["frames"])==13
 c=D["originalSourcedEngineExitAnd3DBlenderGroundRelations"][road][0]
 assert c["scenario"]=="ORIGINAL"
 assert c["lastSupportedRealRoadId"]=="p93-CROWN_REVERSAL-01"
 first=c["trueLastSourcePhysicalRoadSupport"]
 launch=Vector(first["sourceOriginalB48NearestSurfacePointXYZ"])
 originalVelocity=Vector(first["playerVelocityXYZ"])
 fwd=Vector((originalVelocity.x,0,originalVelocity.z)).normalized()
 side=Vector((-fwd.z,0,fwd.x))
 assert fwd.length>.99
 for kind in KINDS:
  bpy.ops.wm.open_mainfile(filepath=arg("--source-"+road))
  scene=bpy.context.scene
  assert scene["DO_SCENE_IS_NOT_GAME_WEBGL"]
  cx=[o for o in bpy.data.objects if o.get("game_world_xyz_unmodified")]
  roads=[o for o in bpy.data.objects if o.get("MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER")]
  moving=[o for o in bpy.data.objects if o.get("SOURCE_ORIGINAL_B51_ID")]
  proxies=[o for o in bpy.data.objects if o.get("R1_B51_ID")]
  assert len(cx)==18 and len(roads)==7 and len(moving)==len(proxies)==28
  original=bsig(cx,roads,moving)
  trees=[("CX",o,bvh(o)) for o in cx]+[("B48",o,bvh(o)) for o in roads]
  sourceRoad=next(o for o in roads if o.name.endswith(c["lastSupportedRealRoadId"]))
  landing,n,poly,dist=bvh(sourceRoad).find_nearest(launch,2.)
  assert landing is not None and dist<.02,("NO_REAL_SOURCE_B48_ANCHOR",road,dist)
  col=bpy.data.collections.new("R15N "+kind+" ACTUAL B48 SOURCE STUDY NOT GAME")
  scene.collection.children.link(col)
  mats={
   "skin":material("R15N",kind+" bone titanium",(.65,.79,.84),.72),
   "dark":material("R15N",kind+" hollow shadow",(.035,.09,.15),.38),
   "copper":material("R15N",kind+" structural copper",(.85,.43,.16),.62),
   "deck":material("R15N",kind+" ceramic route",(.29,.35,.41),.25),
   "glass":material("R15N",kind+" inhabitable ring blue",(.04,.36,.44),.15),
   "light":material("R15N",kind+" guidance teal",(.14,.82,.75),.3,emit=1.8)}
  objects=[]
  def obj(name,verts,faces,skin,role):
   mesh=bpy.data.meshes.new("R15N "+name);mesh.from_pydata([tuple(x) for x in verts],[],faces);mesh.update()
   o=bpy.data.objects.new("R15N "+kind+" "+name,mesh)
   col.objects.link(o);mesh.materials.append(mats[skin])
   o["R15N_ROLE"]=role;o["R15N_STUDY_NOT_GAME"]=True
   o["R15N_ORIGINAL_PHYSICS_COLLIDER"]=False;o["R15N_ART_APPROVAL"]=False
   objects.append(o);return o
  def pipe(name,p,q,r,skin,role,verts=8):
   vec=q-p
   if vec.length<.04:return None
   axis=vec.normalized();right=axis.cross(Vector((0,1,0)))
   if right.length<.2:right=axis.cross(Vector((1,0,0)))
   right.normalize();up=axis.cross(right).normalized()
   vs=[];fs=[]
   for s in (p,q):
    for k in range(verts):
     ang=2*math.pi*k/verts
     vs.append(s+r*(right*math.cos(ang)+up*math.sin(ang)))
   fs.append(tuple(reversed(tuple(range(verts)))))
   fs.append(tuple(range(verts,verts*2)))
   for k in range(verts):fs.append((k,(k+1)%verts,(k+1)%verts+verts,k+verts))
   return obj(name,vs,fs,skin,role)
  def strip(name,stations,width,thickness,skin,role):
   vs=[];fs=[]
   for i,pos in enumerate(stations):
    axis=stations[min(len(stations)-1,i+1)]-stations[max(0,i-1)]
    across=Vector((-axis.z,0,axis.x)).normalized()
    for yy in (0,-thickness):
     for sign in (-1,1):vs.append(pos+across*sign*width*.5+Vector((0,yy,0)))
   for i in range(len(stations)-1):
    k=i*4;q=(i+1)*4
    fs.extend([(k,k+1,q+1,q),(k+2,q+2,q+3,k+3),
       (k,q,k+2),(k+1,k+3,q+3,q+1)])
   fs.extend([(0,2,3,1),tuple(range(4*(len(stations)-1),4*len(stations)))])
   return obj(name,vs,fs,skin,role)
  span=64 if kind=="A_LATTICE_RIB" else 72
  width=10 if kind=="A_LATTICE_RIB" else 14
  # Physiological route trial: slope ~12-15%, NOT source-certified human.
  grade=.13 if kind=="A_LATTICE_RIB" else .16
  # Keep exactly one original road anchor shared across two genuine worlds.
  origin=Vector(launch)
  def centre(x):
   # A = straight cantilever, B = gentle swept bifurcated public spine
   off=(0 if kind=="A_LATTICE_RIB" else 2.2*math.sin(math.pi*x/span))
   return origin+fwd*x+side*off+Vector((0,-grade*x,0))
  steps=24
  stations=[centre(span*i/steps) for i in range(steps+1)]
  deck=strip("continuous fixed entry primary route",stations,width,.56,"deck","primary_continuous_3d_study_walk")
  # Surround a generous central void with structure, not opaque roof.
  pierSources=[];nonGroundedPier=0
  supportStations=[9,21,33,45,57] if span==64 else [9,21,34,49,65]
  for k,distAlong in enumerate(supportStations):
   p=centre(distAlong)
   start=p+Vector((0,-.7,0))
   candidates=[]
   for category,source,tree in trees:
    hit,no,poly,d=tree.ray_cast(start,Vector((0,-1,0)),130)
    if hit is not None and no.y>.15:
     candidates.append((d,source.name,hit,no))
   if candidates:
    d,name,hit,n=min(candidates,key=lambda t:t[0])
    # Foundation is a geometric ray witness; no load or continuous contact.
    supports={ "src":name,"distance":round(d,3),"endpoint":rounded(hit)}
    if d<=90:
     p_left=p+side*(width*.36);p_right=p-side*(width*.36)
     pipe("pier L%02d"%k,p_left+Vector((0,-1,0)),hit+side*.6,.27,"skin","source_hit_footing_witness")
     pipe("pier R%02d"%k,p_right+Vector((0,-1,0)),hit-side*.6,.27,"skin","source_hit_footing_witness")
     pierSources.append(supports)
    else:nonGroundedPier+=1
   else:nonGroundedPier+=1
  # A: double-X open web vertical box girder, 2.5m tall; not gigantic slabs.
  # B: taller non-symmetric civic breathing arches with public gallery offset.
  for k,p in enumerate(stations[::3]):
   fraction=k/(len(stations[::3])-1)
   towerHeight=(4.4 if kind=="A_LATTICE_RIB" else 11.5+2*math.sin(math.pi*fraction))
   left=p-side*(width*.5+.65)
   right=p+side*(width*.5+.65)
   a=left+Vector((0,towerHeight,0))
   b=right+Vector((0,towerHeight*.72,0))
   pipe("rib left %02d"%k,left,a,.27 if kind=="A_LATTICE_RIB" else .41,"skin","open_arch")
   pipe("rib right %02d"%k,right,b,.27 if kind=="A_LATTICE_RIB" else .34,"skin","open_arch")
   pipe("rib crown %02d"%k,a,b,.22 if kind=="A_LATTICE_RIB" else .34,
        "copper","uncovered_open_civic_arch")
   if k:
    prev=stations[(k-1)*3];prior=prev+side*(width*.5+.65)
    pipe("web brace right %02d"%k,prior+Vector((0,3,0)),b,.11,"skin","cross_bracing")
   pipe("rails strip L%02d"%k,left+Vector((0,.8,0)),left+Vector((0,1.05,0)),.09,
    "light","guide")
   pipe("rails strip R%02d"%k,right+Vector((0,.8,0)),right+Vector((0,1.05,0)),.09,
    "light","guide")
  if kind=="B_SPLIT_CIVIC_SPINE":
   # Real mesh gallery is connected at 3 source-known junctions; NOT
   # falsely assume pedestrians can enter from the original game.
   offsets=[3.1*math.sin(math.pi*i/steps) for i in range(steps+1)]
   gallery=[p+side*(width*.52+off)+Vector((0,2.4+1.3*math.sin(math.pi*i/steps),0))
       for i,(p,off) in enumerate(zip(stations,offsets))]
   strip("inhabited upper gallery circulation",gallery,3.4,.34,"glass","upper_public_gallery")
   for j in [0,8,16,24]:
    o=stations[j]+side*(width*.4)
    q=gallery[j]-side*1.4
    pipe("civic connector %d"%j,o,q,.25,"copper","circulation_connector")
   for j in (5,11,17,23):
    a=gallery[j]+Vector((0,-2.1,0))
    b=stations[j]+side*(width*.42)+Vector((0,-.55,0))
    pipe("gallery cantilever tie %d"%j,a,b,.21,"skin","load_path_hypothesis")
  # Important: obstruction warnings, actual 3D floor and real foundation
  # are not certified just because a Blender mesh is visible.
  assert bsig(cx,roads,moving)==original
  scene["R15N_PRIVATE_EDITABLE_STUDY_ONLY"]=True
  scene["R15N_REAL_SOURCE_GAME_WEBGL_RENDERED"]=False
  scene["R15N_ORIGINAL_GAME_COLLIDERS_ADDED"]=0
  scene["R15N_ART_HUMAN_AND_FOUNDATIONS"]="HOLD"
  cam_collection=bpy.data.collections["DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION"]
  early=bpy.data.collections["R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION"]
  assert len(cam_collection.objects)==5 and len(early.objects)==8
  def findcam(t):
   return cam_collection.objects.get(t+" REAL ORIGINAL 240HZ") or early.objects.get("R1 "+t+" SOURCE CAMERA")
  sampled=[]
  b51Watch=[]
  for t in ("t1600","t1650","t1700"):
   frame=next(f for f in native["frames"] if f["id"]==t)
   camera=findcam(t);assert camera and (camera.location-Vector(frame["eye"])).length<.0002
   b51={} 
   for mov in frame["moving"]:
    if mov["enabled"] is False:continue
    mn,mx=boxdynamic(frame,mov)
    touched=[]
    for o in objects:
     lom,lomax=worldbox(o)
     if intersect(mn,mx,lom,lomax):touched.append(o.name)
    if touched:b51[mov["id"]]=len(touched)
   b51Watch.append({"camera":t,"originalB51ResearchPossibleAabbIntersections":b51,
    "notProofOfGameplayInterceptionOrActualHumanWarning":True})
   # Source original camera first-hit, paired with original scenery;
   # no fabricated viewpoint substituted for real original camera.
   front=Vector(frame["front"]).normalized()
   right=front.cross(Vector((0,1,0))).normalized()
   up=right.cross(front).normalized()
   tests=[("BRIDGE",o,bvh(o)) for o in objects]+[("SOURCE",o,bvh(o)) for o in cx+roads]
   counts=collections.Counter()
   eye=Vector(frame["eye"])
   for y in range(9):
    for x in range(15):
     ray=(front+right*((x+.5)/15-.5)*2/1.35*(1008/645)+
         up*(.5-(y+.5)/9)*2/1.35).normalized()
     nearest=2500;winner="SKY"
     for label,o,tree in tests:
      pos,no,index,d=tree.ray_cast(eye,ray,nearest)
      if pos is not None and d is not None and d<nearest:
       nearest=d;winner=label
     counts[winner]+=1
   sampled.append({"frame":t,"originalSourceCameraSamples":135,
    "studyBridgeFirstHitRays":counts["BRIDGE"],
    "studyBridgeFirstHitFraction":round(counts["BRIDGE"]/135,4),
    "sourceOriginalSceneryFirstHitRays":counts["SOURCE"],
    "isNotArtApprovalOrB51GameplaySafety":True})
  # Render original real R1 camera paired snapshots (16.5/17s) per design.
  scene.render.engine="CYCLES";scene.cycles.device="CPU"
  scene.cycles.samples=5;scene.cycles.use_denoising=False
  scene.render.threads_mode="FIXED";scene.render.threads=2
  scene.render.resolution_x=1008;scene.render.resolution_y=645
  scene.render.resolution_percentage=70
  scene.render.image_settings.file_format="PNG"
  scene.render.film_transparent=False
  out=os.path.join(ROOT,road,kind)
  os.makedirs(out,exist_ok=True)
  for t in ("t1650","t1700"):
   idx=next(i for i,f in enumerate(native["frames"],1) if f["id"]==t)
   scene.frame_set(idx)
   scene.camera=findcam(t)
   assert scene.camera
   scene.render.filepath=os.path.join(out,"R15N_"+kind+"_"+road+"_"+t+"_REAL_SOURCE_R1_CAMERA_BLENDER_ONLY.png")
   bpy.ops.render.render(write_still=True)
  fn=os.path.join(out,"R15N_"+kind+"_"+road+"_EDITABLE_REAL_SOURCE_B48_NOT_GAME.blend")
  bpy.ops.wm.save_as_mainfile(filepath=fn)
  assert bsig(cx,roads,moving)==original
  newMeshes=[o for o in objects if o.type=="MESH"]
  assert len(newMeshes)>=24
  # Independent GLB parse can prove geometry exists but NOT its aesthetic merit.
  for o in bpy.context.selected_objects:o.select_set(False)
  for o in objects:o.select_set(True)
  bpy.context.view_layer.objects.active=objects[0]
  glb=os.path.join(out,"R15N_"+kind+"_"+road+"_STUDY_OBJECTS_ONLY.glb")
  bpy.ops.export_scene.gltf(filepath=glb,export_format="GLB",use_selection=True,
    export_animations=False)
  result={"schema":"dopagaki.r15n-source-grounded-real-blender-open-brace-bridge/1",
   "sourceGameBlob":SHA,"road":road,"design":kind,
   "sourceOriginalB48Road":c["lastSupportedRealRoadId"],
   "sourceLastSupportedXYZ":first["playerWorldXYZ"],
   "trueSourceRoadAnchorXYZ":rounded(launch),
   "anchorNearestTrueOriginalB48DistanceMetres":round(dist,5),
   "sourceOriginalExitVelocityXYZ":rounded(originalVelocity),
   "studyPrimaryRouteSpanMetres":span,"studyWidthMetres":width,
   "hypotheticalDownwardGrade":grade,
   "realNewEditableBlenderMeshObjects":len(newMeshes),
   "sourceOriginalGeometrySignatures":original,
   "groundAnchorWitnesses":pierSources,
   "studyPierStationsWithoutSourceGroundRayWitness":nonGroundedPier,
   "actualVerifiedStructuralLoadPath":False,
   "studySourceCameras":sampled,
   "b51SourceDynamicAabbResearch":b51Watch,
   "actualNativePhysicsReplayWithStudyDeck":False,
   "sourceOriginalGameCodeEdited":False,"newGameColliders":0,
   "sourceOriginalGameWebGLRendered":False,"artApproved":False,
   "officialArt":0,"officialSlope2Meters":0,
   "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD","RELEASE":"HOLD"}
  with open(os.path.join(out,"R15N_"+kind+"_"+road+"_REAL_SOURCE_DESIGN_QA.json"),"w",encoding="utf8") as f:
   json.dump(result,f,indent=2,ensure_ascii=False)
  report["perRoadAndDesign"][road+"|"+kind]={
   "sourceRoadAnchorXYZ":rounded(launch),"resultRelative":os.path.relpath(out,ROOT),
   "meshCount":len(newMeshes),"sourceGroundHitPiers":len(pierSources),
   "ungroundedPierStations":nonGroundedPier,
   "nativeBridgeSourceFirstHit":[p["studyBridgeFirstHitFraction"] for p in sampled],
   "originalB51PossibleAABBOverlap":[len(x["originalB51ResearchPossibleAabbIntersections"]) for x in b51Watch],
   "sourcePhysicsNotRepaired":True}
  print("R15N_TRUE_SOURCE_REAL_3D_BRIDGE",road,kind,
   "geometry",len(newMeshes),"ground_witness_piers",len(pierSources),
   "unhit_piers",nonGroundedPier,
   "original_camera_source_hit",[p["studyBridgeFirstHitFraction"] for p in sampled],flush=True)
assert len(report["perRoadAndDesign"])==4
with open(os.path.join(ROOT,"R15N_TWO_REAL_ROADS_TWO_EDITABLE_OPEN_BRACE_DESIGNS_SOURCE_ART_HOLD.json"),"w",encoding="utf8") as f:
 json.dump(report,f,indent=2,ensure_ascii=False)
