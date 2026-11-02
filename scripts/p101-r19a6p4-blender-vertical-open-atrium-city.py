"""R19 A6 P4 — original source camera-anchored real Blender vertical arcology.
Five editable district meshes, 14/28m separately from unmodified B48 81
stations. NO repetitive horizontal ribbon, portal, cuboid-tower or false ART PASS.
The sectioned habitable petal walls enclose a TRUE OPEN central void above base.
Source physical B51 pixel occlusion, ground contact, human access unverified.
"""
import bpy,sys,os,json,hashlib,math
from mathutils import Vector
from math import pi,sin,cos
def arg(k):
 a=sys.argv[sys.argv.index("--")+1:];return a[a.index(k)+1]
def sha(p):
 with open(p,"rb") as f:return hashlib.sha256(f.read()).hexdigest()
src,out,blend,rep,anchor,cameras=[os.path.abspath(arg(k)) for k in
 ("--source","--output","--blend","--report","--anchors","--cameras")]
mode=arg("--mode");assert mode in ("ultra","control")
os.makedirs(os.path.dirname(out),exist_ok=True)
roads=json.load(open(anchor,encoding="utf8"))
cams=json.load(open(cameras,encoding="utf8"))
assert roads["mode"]==mode and roads["sourceBlob"]=="af076d67492a677d2235e4730aef8cdf4808e106"
assert roads["roadCount"]==7 and roads["realB51"]==28
assert cams["origin"]["originalGitBlob"]==roads["sourceBlob"]
actual_cameras=[f for f in cams["frames"] if f["mode"]==mode]
assert sorted(x["tick"] for x in actual_cameras)==[265,721,1057,1249,1921,2761]
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=src)
objects=sorted([o for o in bpy.context.scene.objects if o.type=="MESH"],key=lambda o:o.name)
assert len(objects)==5
source_faces=sum(len(o.data.polygons) for o in objects)
assert source_faces==10566
def bvec(web):
 return Vector((web[0],-web[2],web[1]))
def station(road,u):
 v=max(0.,min(80.,u*80.));i=min(79,int(v));alpha=v-i
 a=roads["roads"][road]["stations"][i]
 c=roads["roads"][road]["stations"][i+1]
 return {k:Vector(a[k]).lerp(Vector(c[k]),alpha) for k in ("center","left","right","forward")}
def frame(site,u):
 st=station(site["road"],u)
 centre=st["center"];edge=st["left" if site["side"]<0 else "right"]
 fw=st["forward"];fw.y=0.;fw.normalize()
 outward=edge-centre;outward.y=0
 outward-=fw*outward.dot(fw)
 outward.normalize()
 assert abs(fw.dot(outward))<.015
 return bvec(edge),bvec(outward),bvec(fw),bvec((0,1,0))
SITES=[
 {"id":"P4-A1 OPEN ATOLL — west civic heart","road":1,"side":-1,
  "u":.35,"out":155,"height":194,"cores":2,"petals":7,"baseR":56,"skew":16,"seed":.2},
 {"id":"P4-A2 FRACTURED SOLAR LIBRARY — east terraced towers","road":1,"side":1,
  "u":.50,"out":162,"height":166,"cores":2,"petals":5,"baseR":48,"skew":11,"seed":1.5},
 {"id":"P4-A3 SKYWARD VERTICAL COMMONS — distant west","road":1,"side":-1,
  "u":.70,"out":270,"height":146,"cores":2,"petals":4,"baseR":39,"skew":13,"seed":2.8},
 {"id":"P4-A4 ROAD0 QUIET HABITAT — outer west","road":0,"side":-1,
  "u":.40,"out":236,"height":105,"cores":2,"petals":6,"baseR":31,"skew":8,"seed":3.8},
 {"id":"P4-A5 ROAD0 INHABITED FORESHORE — outer east","road":0,"side":1,
  "u":.73,"out":273,"height":92,"cores":2,"petals":5,"baseR":34,"skew":9,"seed":5.3}
]
PALETTES=[
 [(0.16,.40,.51),(.39,.66,.68),(.08,.23,.32),(.92,.70,.39),(.62,.77,.69)],
 [(.30,.37,.51),(.51,.75,.76),(.10,.21,.37),(.91,.62,.34),(.55,.64,.71)],
 [(.18,.34,.48),(.46,.65,.66),(.07,.18,.29),(.95,.78,.49),(.57,.74,.78)],
 [(.23,.45,.45),(.58,.70,.58),(.11,.28,.33),(.76,.66,.48),(.40,.57,.57)],
 [(.30,.36,.45),(.61,.68,.71),(.10,.19,.29),(.84,.71,.50),(.39,.51,.64)]
]
def projection(shot,xyz):
 eye=Vector(shot["eye"]);front=Vector(shot["front"]).normalized()
 right=front.cross(Vector((0,1,0))).normalized()
 up=right.cross(front).normalized()
 d=xyz-eye;z=d.dot(front)
 if z<=.66:return None
 return (1.35*d.dot(right)/(1013/698)/z,1.35*d.dot(up)/z)
def roi_area(bbox,xlim,ylim):
 if bbox is None:return 0
 return max(0,min(xlim[1],bbox[1])-max(xlim[0],bbox[0]))*max(0,min(ylim[1],bbox[3])-max(ylim[0],bbox[2]))
reports=[];num_vertices=0
for index,(obj,site) in enumerate(zip(objects,SITES)):
 old_name=obj.name;local_inverse=obj.matrix_world.inverted()
 vertices=[];polygons=[];colors=[];world_samples=[]
 palette=PALETTES[index]
 def addface(ids,k=0):
  polygons.append(tuple(ids));colors.append(palette[k%len(palette)])
 def addloft(rings,material=0):
  n=len(rings[0])
  assert n in (4,8)
  start=len(vertices)
  for ring in rings:
   assert len(ring)==n
   for v in ring:
    assert all(math.isfinite(z) and abs(z)<1e6 for z in v)
    vertices.append(tuple(local_inverse @ v))
    # Actual original world coordinates, used only in read-only camera QA.
    if len(vertices)%53==0:world_samples.append(Vector((v.x,v.z,-v.y)))
  for row in range(len(rings)-1):
   for k in range(n):
    a=start+row*n+k;bb=start+row*n+(k+1)%n
    cc=start+(row+1)*n+(k+1)%n;dd=start+(row+1)*n+k
    addface((a,bb,cc,dd),material+row//5+k//2)
  addface(tuple(start+k for k in reversed(range(n))),material+2)
  addface(tuple(start+(len(rings)-1)*n+k for k in range(n)),material+3)
 def box_bridge(a,b,width,thickness,color):
  d=(b-a).normalized()
  horizontal=Vector((d.x,d.y,0))
  horizontal.normalize()
  side=Vector((-horizontal.y,horizontal.x,0))
  up=Vector((0,0,1))
  ring0=[a+side*width/2-up*thickness/2,a-side*width/2-up*thickness/2,
         a-side*width/2+up*thickness/2,a+side*width/2+up*thickness/2]
  ring1=[b+side*width/2-up*thickness/2,b-side*width/2-up*thickness/2,
         b-side*width/2+up*thickness/2,b+side*width/2+up*thickness/2]
  addloft([ring0,ring1],color)
 core_origins=[];petal_count=0;plinth_count=0;terrace_count=0
 for ci in range(site["cores"]):
  # Not repeated positions: each cluster responds to real road curvature and
  # uses varying lateral/depth and tower height. All on one side, no over-road span.
  du=(ci-(site["cores"]-1)/2)*(.056 if site["road"]==1 else .071)
  u=site["u"]+du
  edge,outward,tangent,up=frame(site,u)
  dist=site["out"]+18*(ci%2)+11*sin(ci*1.9+site["seed"])
  assert dist>=73 and site["road"] in (0,1)
  base=edge+outward*dist+tangent*(13*sin(ci*2.05+site["seed"]))
  core_origins.append((base,outward,tangent,up))
  H=site["height"]*(.76+.18*sin(ci*2.1+site["seed"])+.07*cos(ci*.8))
  radius=site["baseR"]*(.85+.18*cos(ci*1.6+site["seed"]))
  # Massive sculpted stepped foundation. Ends below original road: world
  # contact is NOT certified. Never claim terrain supports it.
  plinth=[]
  for lvl,(h,r) in enumerate([(-65,1.08),(-37,1.31),(-14,1.45),(7,1.13),(21,.84)]):
   ring=[base+up*h+outward*(radius*r*cos(2*pi*k/8+site["seed"]))+
         tangent*(radius*r*.82*sin(2*pi*k/8+site["seed"])) for k in range(8)]
   plinth.append(ring)
  addloft(plinth,ci);plinth_count+=1
  # Six offset vertical massing petals. Each has a solid 4-vertex cross section.
  # Interior radius remains >12m throughout: a TRUE OPEN ATRIUM, not a
  # facade painted with a dark artificial hole. No overhead ribbons.
  for petal in range(site["petals"]):
   rings=[]
   twist=(.24+.08*index)*(1 if (petal+ci)%2 else -1)
   for j in range(60):
    t=j/59
    peak=H*(.68+.30*abs(sin(petal*1.43+ci*.83+site["seed"])))
    z=20+peak*t
    phase=2*pi*petal/site["petals"]+site["seed"]*.17+twist*t
    centre=base+up*z+outward*(site["skew"]*sin(pi*t)**1.4*t)+tangent*(9*sin(1.6*pi*t+ci*.8)*t)
    outer=radius*(1-.28*t)+6*sin(pi*t)**2
    inner=max(14.0,outer-21.0)
    half_angle=(.69+.03*sin(ci*.7+petal))*pi/site["petals"]
    ring=[]
    for rad,sign in [(inner,-1),(outer,-1),(outer,1),(inner,1)]:
     a=phase+sign*half_angle
     ring.append(centre+outward*(rad*cos(a))+tangent*(rad*.79*sin(a)))
    rings.append(ring)
   addloft(rings,(petal+ci+index)%5);petal_count+=1
  # Arc-shaped inhabited decks anchor towers; separate radial wedges preserve
  # central void and six open sky slots, unlike long aerial bridge ribbons.
  for level in [.17,.38,.62,.82]:
   for petal in range(site["petals"]):
    ang=2*pi*petal/site["petals"]+site["seed"]*.17
    inner=radius*.43;outer=radius*1.17
    spans=[]
    for zz in [20+H*level,20+H*level+3.5]:
     ring=[]
     for rad,sign in [(inner,-1),(outer,-1),(outer,1),(inner,1)]:
      phi=ang+sign*(.65*pi/site["petals"])
      ring.append(base+up*zz+outward*rad*cos(phi)+tangent*rad*.79*sin(phi))
     spans.append(ring)
    addloft(spans,(petal+int(level*10)+index)%5)
    terrace_count+=1
 # Narrow local skywalks between adjacent *same-side* cores, never cross road.
 # A connection is only visual; human navigability and inside access HOLD.
 bridge_count=0
 for ci in range(len(core_origins)-1):
  aa,ao,at,au=core_origins[ci];bb,bo,bt,bu=core_origins[ci+1]
  height=site["height"]*.32
  a=aa+au*height;b=bb+bu*height
  if (b-a).length<=185:
   for deck_height,deck_width in [(10.,22.),(22.,13.)]:
    box_bridge(aa+au*deck_height,bb+bu*deck_height,deck_width,6.0,ci+index)
    bridge_count+=1
 mesh=bpy.data.meshes.new("P4 camera driven inhabited petal arcology "+str(index+1))
 mesh.from_pydata(vertices,[],polygons)
 mesh.update()
 assert len(mesh.polygons)>1600
 color=mesh.color_attributes.new(name="COLOR_0",type="FLOAT_COLOR",domain="CORNER")
 for poly,p in zip(mesh.polygons,colors):
  rgba=(*p,1.0)
  for li in poly.loop_indices:color.data[li].color=rgba
 old=obj.data;obj.data=mesh
 if old.users==0:bpy.data.meshes.remove(old)
 material=bpy.data.materials.new("P4 source-camera architectural copper glass "+str(index+1))
 material.diffuse_color=(*palette[0],1.0)
 material.metallic=.20;material.roughness=.38
 mesh.materials.append(material);obj.name=old_name
 projected=[]
 for sh in actual_cameras:
  screen=[projection(sh,v) for v in world_samples]
  points=[v for v in screen if v is not None]
  bounds=[min(q[0] for q in points),max(q[0] for q in points),
          min(q[1] for q in points),max(q[1] for q in points)] if points else None
  projected.append({"tick":sh["tick"],"boundsNDC":bounds,
   "screenClippedAreaProxy":roi_area(bounds,(-1,1),(-1,1))/4,
   "road0CentralArealOverlapUpperBoundProxy":roi_area(bounds,(-.65,.65),(-.4,.4))/4})
 reports.append({"district":old_name,"sourceRoad":site["road"],"side":site["side"],
  "u":site["u"],"outboardDistanceM":site["out"],"nominalTowers":site["cores"],
  "actualOpenAtriumPetalCount":petal_count,
  "sculptedFoundationCount":plinth_count,"localPublicTerracePieces":terrace_count,
  "localBridgesNotHumanValidated":bridge_count,"faces":len(mesh.polygons),
  "revision":"R1 fewer sculptural inhabited masses / stronger asymmetric roofline / short civic decks",
  "cameraProjectedSparseVertexSampleBBoxNotConservative":projected})
 num_vertices+=len(vertices)
assert len([obj for obj in bpy.context.scene.objects if obj.type=="MESH"])==5
new_faces=sum(len(o.data.polygons) for o in objects)
assert source_faces+100<new_faces<45000,(source_faces,new_faces)
assert all(a["faces"]>1600 for a in reports)
bpy.ops.wm.save_as_mainfile(filepath=blend)
bpy.ops.export_scene.gltf(filepath=out,export_format="GLB",use_selection=False)
assert os.stat(out).st_size>100000
report={"schema":"dopagaki.r19a6p4-real-A1-camera-anchored-vertical-atrium-arcology/1",
 "mode":mode,"originalSourceBlob":roads["sourceBlob"],
 "source_glb_sha256":sha(src),"edited_glb_sha256":sha(out),
 "blend_sha256":sha(blend),"source_anchors_sha256":sha(anchor),
 "archived_A1_12_camera_sha256":sha(cameras),
 "source_faces":source_faces,"edited_faces":new_faces,"added_faces":new_faces-source_faces,
 "editable_districts":5,"districts":reports,"vertices":num_vertices,
 "new_colliders":0,"globalB48B51ClearanceVerified":False,
 "humanArchitecturalAccess":"NOT_VERIFIED","actualTerrainContactVerified":False,
 "PBR_game":"NOT_IMPLEMENTED","Blender":bpy.app.version_string,
 "designRevision":"R1_AFTER_R0_NATIVE_12_ART_REJECT",
 "cameraProjectionOnlyNotActualB51RasterMask":True,
 "officialSlope2Metres":0,"ART":"HOLD","HUMAN":"HOLD","GAMEPLAY":"HOLD","PERFORMANCE":"HOLD",
 "RELEASE":"HOLD","MERGE":"HOLD"}
with open(rep,"w",encoding="utf8") as f:json.dump(report,f,ensure_ascii=False,indent=2)
print("R19_A6P4_ACTUAL_BLENDER_OPEN_ATRIUM_CITY_SOURCE_CAMERA",json.dumps({
 "mode":mode,"realBlender":report["Blender"],"faces":new_faces,"districts":5,
 "petals":sum(x["actualOpenAtriumPetalCount"] for x in reports),
 "ART":"HOLD","B51Raster":"NOT_MEASURED"}))
