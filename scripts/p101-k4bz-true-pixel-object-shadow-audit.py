"""K4BZ: non-destructive genuine pixel-to-geometry and light occlusion audit.

NO render, NO source writes, NO artistic guess. Read exactly the successful
K4BY A3 editable .blend + true same-CHASE image. Report first visible
ray-cast surfaces, second surfaces and potential SUN blockers.
"""
import bpy,sys,math,hashlib,struct,json,collections
from pathlib import Path
from mathutils import Vector

args=sys.argv[sys.argv.index("--")+1:]
def path_arg(k):return Path(args[args.index(k)+1]).resolve()
BASE=path_arg("--base"); IMAGE=path_arg("--image"); OUT=path_arg("--out")
OUT.mkdir(parents=True,exist_ok=True)
EXPECTED_BLEND="f0d3d7a27e5fbf599447b0e784b71684ff634b071d283f8b59bdaf06a179d4e4"
EXPECTED_PNG="ad46b5377fd9d144c7ab94b428df52d5f97cb7675fe44c3d14389b7858c925f7"
SOURCE_ROAD="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
GAME_BLOB="af076d67492a677d2235e4730aef8cdf4808e106"
def sha(path):
 h=hashlib.sha256()
 with open(path,"rb") as f:
  for b in iter(lambda:f.read(1<<20),b""):h.update(b)
 return h.hexdigest()
assert sha(BASE)==EXPECTED_BLEND,("noncanonical genuine native",sha(BASE))
assert sha(IMAGE)==EXPECTED_PNG,("noncanonical screenshot",sha(IMAGE))
bpy.ops.wm.open_mainfile(filepath=str(BASE))
sc=bpy.context.scene
assert sc.render.resolution_x==768 and sc.render.resolution_y==480
assert sc.render.resolution_percentage==100
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
def rig_poses():
 return {x.name:(tuple(x.location),tuple(x.rotation_euler),float(x.data.lens))
         for x in rig.objects if x.type=="CAMERA"}
frozen_poses=rig_poses();assert len(frozen_poses)>=6
cams=[x for x in bpy.data.objects if x.type=="CAMERA" and
      x.name.startswith("K4BP | EXPERIMENT CAMERA | CHASE_NARROW |")]
assert len(cams)==1
cam=cams[0]
frozen_cam=(tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))
assert sc.camera==cam
roads=[]
for suffix in ("CONTROL","ULTRA"):
 co=bpy.data.collections["K4AY SOURCE B48 | "+suffix+" | TRUE TESSELLATED ROAD5"]
 assert len(co.objects)==1
 roads.append(next(iter(co.objects)))
def road_sha(ob):
 h=hashlib.sha256()
 for v in ob.data.vertices:h.update(struct.pack("<3d",*[float(c) for c in v.co]))
 for face in ob.data.polygons:h.update(struct.pack("<3i",*[int(i) for i in face.vertices]))
 return h.hexdigest()
assert {road_sha(o) for o in roads}=={SOURCE_ROAD}
oldtrees=[o for o in bpy.data.objects if o.name.startswith("K4BS | genuine CC0 scanned pine tree ")]
canopies=[o for o in bpy.data.objects if o.name.startswith("K4BV | TRUE WIND SHAPED CC0 COASTAL CANOPY")]
assert len(oldtrees)==8 and len(canopies)==1
tree_matrices={x.name:tuple(tuple(row) for row in x.matrix_world) for x in oldtrees+canopies}
# These 12 pixel coordinates are identified from the true actual A3 RGB.
# Each dark pixel has a same-row control in the apparent unaffected lane.
sample_pairs=[
 ((292,300),(317,300)),
 ((280,330),(310,330)),
 ((267,360),(310,360)),
 ((250,400),(295,400)),
 ((235,440),(280,440)),
 ((225,470),(270,470))
]
deps=bpy.context.evaluated_depsgraph_get()
bpy.context.view_layer.update()
frame=cam.data.view_frame(scene=sc)
loX=min(v.x for v in frame);hiX=max(v.x for v in frame)
loY=min(v.y for v in frame);hiY=max(v.y for v in frame)
zcam=sum(v.z for v in frame)/len(frame)
quat=cam.matrix_world.to_quaternion()
origin_camera=cam.matrix_world.translation.copy()
w=768;h=480
def cam_ray(px,py):
 ux=(float(px)+.5)/w;uy=1-(float(py)+.5)/h
 v=Vector((loX+(hiX-loX)*ux,loY+(hiY-loY)*uy,zcam))
 if cam.data.type=="ORTHO":
  return cam.matrix_world@v, quat@Vector((0,0,-1))
 assert cam.data.type=="PERSP",cam.data.type
 return origin_camera, (quat@v).normalized()
def human_material(ob,polygon):
 idx=None;matname=None;polyobj=ob.original if hasattr(ob,"original") else ob
 try:
  if polygon>=0 and polyobj.type=="MESH" and polygon<len(polyobj.data.polygons):
   idx=int(polyobj.data.polygons[polygon].material_index)
   if idx<len(polyobj.material_slots) and polyobj.material_slots[idx].material:
    matname=polyobj.material_slots[idx].material.name
 except (IndexError,RuntimeError,ReferenceError):
  pass
 return idx,matname
def cast(start,ray,distance=1500):
 hit,loc,n,poly,ob,matrix=sc.ray_cast(deps,start,ray,distance=distance)
 if not hit:return None,None,None
 slot,material=human_material(ob,poly)
 return {
  "object":ob.name,"objectType":ob.type,"faceIndex":int(poly),
  "materialSlot":slot,"material":material,
  "location":[round(float(v),5) for v in loc],
  "worldNormal":[round(float(v),5) for v in n],
  "normalZ":round(float(n.z),5),
  "distanceM":round(float((loc-start).length),5),
  "hideRender":bool(ob.hide_render),
  "hideViewport":bool(ob.hide_viewport),
  "researchOnly":bool(ob.get("RESEARCH_DCC_ONLY") or ob.get("ONLY_NATIVE_RESEARCH")),
  "notGameCollider":bool(ob.get("NOT_GAME_COLLIDER") or ob.get("NO_REAL_GAME_COLLIDER")),
  "semantic":str(ob.get("ACTUAL_USE") or ob.get("AUTHORED_FUNCTION") or ""),
  "geometryFingerprintedAsSourceRoad5":str(ob.get("AUTHENTIC_SOURCE_ROAD5_GEOMETRY_SHA256") or
                                         ob.get("ACTUAL_SOURCE_SHA256") or ""),
 },loc,n
lights=[]
for ob in bpy.data.objects:
 if ob.type=="LIGHT":
  lights.append({"name":ob.name,"type":ob.data.type,
    "hideRender":bool(ob.hide_render),
    "energy":float(ob.data.energy)})
suns=[ob for ob in bpy.data.objects if ob.type=="LIGHT" and ob.data.type=="SUN" and not ob.hide_render]
def light_ambiguity(loc,n,primary_name):
 if loc is None:return []
 observations=[]
 for lamp in suns:
  # Light local -Z is ray direction towards scene; reverse for
  # traversal FROM the point TOWARDS the true SUN.
  ray=-(lamp.matrix_world.to_quaternion()@Vector((0,0,-1)))
  ray.normalize()
  records=[]
  for offset in (.035,.16):
   start=loc+n.normalized()*offset
   r,hitpt,_=cast(start,ray,800)
   records.append({"offsetM":offset,
      "firstPotentialBlocker":None if r is None else r["object"],
      "occluderDetails":r})
  observations.append({"sun":lamp.name,"towardsSun":[round(v,5) for v in ray],
                       "rayOcclusionCandidates":records,
                       "thisIsNotYetRenderedShadowProof":True})
 return observations
results=[]
for index,(dark,control) in enumerate(sample_pairs):
 item={"pair":index+1,"darkPixel":list(dark),"comparisonPixel":list(control),"rays":[]}
 for role,pt in (("dark",dark),("control",control)):
  org,ray=cam_ray(*pt)
  nearest,loc,n=cast(org,ray)
  layers=[];cursor=org.copy()
  for depth in range(5):
   layer,hitpt,normal=cast(cursor,ray)
   if layer is None:break
   layer["layer"]=depth
   layers.append(layer)
   cursor=hitpt+ray*.10
  item["rays"].append({"role":role,"pixel":list(pt),
    "cameraOrigin":[round(v,4) for v in org],
    "cameraDirection":[round(v,7) for v in ray],
    "firstHit":nearest,"firstFiveHits":layers,
    "possibleSunOcclusion":light_ambiguity(loc,n,None if nearest is None else nearest["object"])})
 results.append(item)
assert rig_poses()==frozen_poses
assert (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==frozen_cam
assert {road_sha(o) for o in roads}=={SOURCE_ROAD}
assert all(tuple(tuple(row) for row in x.matrix_world)==tree_matrices[x.name] for x in oldtrees+canopies)
assert sha(BASE)==EXPECTED_BLEND and sha(IMAGE)==EXPECTED_PNG

darknames=[x["rays"][0]["firstHit"]["object"] if x["rays"][0]["firstHit"] else "NO_HIT" for x in results]
controlnames=[x["rays"][1]["firstHit"]["object"] if x["rays"][1]["firstHit"] else "NO_HIT" for x in results]
same=sum(a==b for a,b in zip(darknames,controlnames))
sun_delta=[]
for row in results:
 d=row["rays"][0]["possibleSunOcclusion"]
 c=row["rays"][1]["possibleSunOcclusion"]
 if d and c:
  obsd=d[0]["rayOcclusionCandidates"][0]["firstPotentialBlocker"]
  obsc=c[0]["rayOcclusionCandidates"][0]["firstPotentialBlocker"]
  sun_delta.append({"darkPotentialBlocker":obsd,"controlPotentialBlocker":obsc,
                    "different":obsd!=obsc})
# This intentionally does NOT infer final cast-shadow causality
# from a single ray pass, since material shading, contact shadows and
# non-renderable visibility can differ from ray-scene intersection.
audit={
 "schema":"dopagaki.k4bz.actual-source-locked-screen-pixel-ray-shadow-candidate-audit/1",
 "sourceBlendSHA256":EXPECTED_BLEND,"sourceRealScreenshotSHA256":EXPECTED_PNG,
 "actualOriginalGameBlob":GAME_BLOB,"actualOriginalRoad5VertexFaceSHA256":SOURCE_ROAD,
 "frozenOriginalSixCameras":True,"frozenResearchChaseCamera":True,
 "frozenActual9OriginalTrees":True,"gameSourceEdited":False,"originalNativeEdited":False,
 "newBlenderRender":False,"newGameColliders":0,
 "cameraName":cam.name,"cameraType":cam.data.type,
 "imageSize":[w,h],"screenPixelOrigin":"top-left",
 "nativeLights":lights,"darkTargetVsComparisonPairs":results,
 "firstHitDarkObjects":darknames,"firstHitControlObjects":controlnames,
 "sameDarkControlFirstHitObjectCount":same,
 "SUNShadowRayCandidateDifferences":sun_delta,
 "actualRootCause":"NOT_ESTABLISHED_BY_RAY_ONLY",
 "nextStep":"If dark/control first hit matches but light blockers differ: independent fixed-camera shadow-caster A/B. If object hits differ: isolate exact mesh/material then re-render without source edits. If both identical: investigate material lighting / normals / shadow map.",
 "ART":"REJECT","formalArtAccepted":0,"formalSlope2DNAMetres":0,
 "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD"}
p=OUT/"K4BZ_REAL_CHASE_BLACK_WEDGE_PER_PIXEL_GEOMETRY_SHADOW_CANDIDATES.json"
p.write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding="utf-8")
print("K4BZ_PIXEL_RAY_CAUSALITY_NOT_YET_PROVEN",
      json.dumps({"sameHitObjects":same,"dark":darknames,"controls":controlnames,
                  "suns":[x["name"] for x in lights if x["type"]=="SUN"],
                  "shadowDifferences":sun_delta},ensure_ascii=False),flush=True)
