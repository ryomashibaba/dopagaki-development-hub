"""R19 A6 P4 R2 — integrated, camera-grounded low/mid-rise city streets and civic canyon.
Five editable district meshes, 14/28m separately from unmodified B48 81
stations. NO repetitive horizontal ribbon, portal, cuboid-tower or false ART PASS.
Urban masses surround a genuinely open civic court and stepped topography; no tower repetitions.
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
 {"id":"R2-01 WEST CIVIC CANYON — principal urban capital","road":1,"side":-1,
  "u":.54,"out":208,"buildings":7,"height":145,"width":66,"span":.24,"seed":.2},
 {"id":"R2-02 EAST DELTA ACADEMY — inhabited stepped district","road":1,"side":1,
  "u":.46,"out":219,"buildings":7,"height":99,"width":62,"span":.23,"seed":1.7},
 {"id":"R2-03 FAR SKY ORCHARDS — split luminous civic slope","road":1,"side":-1,
  "u":.83,"out":335,"buildings":5,"height":89,"width":62,"span":.16,"seed":2.6},
 {"id":"R2-04 ROAD0 UPPER HABITAT — restrained skyline","road":0,"side":-1,
  "u":.44,"out":272,"buildings":5,"height":79,"width":48,"span":.18,"seed":3.6},
 {"id":"R2-05 ROAD0 RECESSED MARKET — terraced roadside foreground","road":0,"side":1,
  "u":.73,"out":295,"buildings":5,"height":74,"width":53,"span":.20,"seed":5.2}
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
 # Each district is an inhabited urban *ensemble*, not a series of spires.
 # Architectural family: broad asymmetrical eight-sided stepped midrises,
 # deep civic terraces, a physical stepped ground court and joined local streets.
 # District 0 is a unified, open-centre canyon seen in the original Road1 camera.
 massings=[];terrace_count=0;court_count=0;glazed_bays=0
 def plaza_volume(p,along,side,up,halfspan,halfbreadth,z,material):
  # A low, real, physically thick plaza: never a fake flat billboard.
  rings=[]
  for depth in [-10.0,-2.0,4.0]:
   rings.append([p+along*halfspan*math.cos(k*pi/4)+
     side*halfbreadth*math.sin(k*pi/4)+up*(depth+z)
     for k in range(8)])
  addloft(rings,material)
 # Real ground/civic base is discontinuous at the public void; no giant roof.
 for pad in range(3):
  u=site["u"]+site["span"]*(pad-1)*.33
  edge,outward,tangent,up=frame(site,u)
  p=edge+outward*(site["out"]+34)+up*(-14+pad*2)
  plaza_volume(p,tangent,outward,up,27+pad*8,46-pad*5,0,pad+index)
  court_count+=1
 # Each locality follows the actual road curvature and makes a readable
 # middle-distance skyline with broad widths (unlike R1 narrow tower rows).
 for bi in range(site["buildings"]):
  t=(bi+.5)/site["buildings"]
  u=site["u"]+(t-.5)*site["span"]
  edge,outward,tangent,up=frame(site,u)
  if index==0:
   # Two canyon walls and a deliberately EMPTY middle court: offset pair
   # separated laterally, not a portal/ribbon spanning the roadway.
   court_side=1 if bi%2 else -1
   distance=site["out"]+(50 if court_side>0 else 5)+16*sin(bi*1.71)
   sidewalk=tangent*(court_side*27+7*sin(bi*1.3))
  else:
   distance=site["out"]+16*(bi%3)+13*sin(bi*1.6+site["seed"])
   sidewalk=tangent*(9*sin(bi*2.17+site["seed"]))
  base=edge+outward*distance+sidewalk
  heightMod=[.42,.68,1.,.58,.85,.34,.72][(bi+2*index)%7]
  H=site["height"]*heightMod
  W=site["width"]*(.8+.29*sin(bi*2.17+site["seed"])**2)
  D=W*(.74+.19*cos(bi+site["seed"]))
  assert W/H>.26 and distance>170
  # Sculpted inhabited facades formed in real Blender from 48 rings.
  # Nonuniform roofs, recessed terrace setbacks, diagonal tectonic folds:
  # no identical spire/column silhouette.
  rings=[]
  for ring_i in range(48):
   v=ring_i/47
   peakZ=-8+H*v
   tier=0 if v<.21 else 1 if v<.46 else 2 if v<.72 else 3
   setback=[1.0,.92,.78,.62][tier]
   if index==0 and bi==3:setback*=1.12
   lean=14*sin(pi*v)**1.4*cos(1.3*bi+site["seed"])
   swing=9*sin(pi*v)**1.1*sin(1.7*bi+site["seed"])
   center=base+up*peakZ+outward*lean+tangent*swing
   ring=[]
   for q in range(8):
    angle=q*pi/4+(bi%2)*.13
    r=1+.065*sin(v*4*pi+bi*.65)
    lateral=(W*.5*math.cos(angle)*setback*r)
    longitudinal=(D*.5*math.sin(angle)*setback*r)
    roofPitch=(0 if ring_i<47 else 4.5*sin(angle+site["seed"]+bi*.7))
    ring.append(center+outward*lateral+tangent*longitudinal+up*roofPitch)
   rings.append(ring)
  addloft(rings,(bi+index)%5)
  # Separate, solid 3D exterior platforms, not painted or simulated streets.
  for lev in [.21,.46,.72]:
   p=base+outward*(4*sin(lev*pi+bi))+tangent*(3*cos(bi))+up*(H*lev-8)
   halfW=W*.63*(1.1-.23*lev)
   halfD=D*.63
   plaza_volume(p,outward,tangent,up,halfW,halfD,0,bi+int(10*lev))
   terrace_count+=1
  # Façade window arrays: deliberately a different density per block.
  # These are nonphysical drawn-on glazing surfaces, NOT navigable rooms.
  for floor in range(5+((bi+index)%5)):
   v=.12+(.71*(floor+.5)/(6+((bi+index)%5)))
   tier=0 if v<.21 else 1 if v<.46 else 2 if v<.72 else 3
   setback=[1.,.92,.78,.62][tier]
   yy=-8+H*v
   for side_i in [-1,1]:
    for bay in [-1,0,1]:
     dx=(bay+.06*sin(bi+index))*.26*W*setback
     facade=base+up*yy+outward*(side_i*(W*.5*setback+1.2))+tangent*dx
     # Real 3D structural panel, fine at camera distance but never
     # represented as usable rooms or transparent PBR glazing.
     a=facade+tangent*(-3.5)+up*(-2.3)
     b=facade+tangent*(3.5)+up*(-2.3)
     c=facade+tangent*(3.5)+up*(2.3)
     d=facade+tangent*(-3.5)+up*(2.3)
     start=len(vertices)
     for p in [a,b,c,d]:vertices.append(tuple(local_inverse@p))
     addface((start,start+1,start+2,start+3),3 if floor%3 else 1)
     glazed_bays+=1
  massings.append({"roofline_height_m":round(H,3),"width_m":round(W,3),
   "camera_city_u":round(u,4),"outboard_m":round(distance,3),
   "terrace_levels":3,"façade_glazing_panels":glazed_bays})
 # Streetscape: short pedestrian platforms ONLY between local adjacent city
 # buildings, below roofline, same side of the *original* physical road.
 # No fake user-access claim; the true connecting path remains to be certified.
 streetpieces=0
 for si in range(site["buildings"]-1):
  uu=site["u"]+((si+1)/site["buildings"]-.5)*site["span"]
  edge,outward,tangent,up=frame(site,uu)
  p=edge+outward*(site["out"]+25)+up*(-16)
  plaza_volume(p,tangent,outward,up,14,20,-1,si+index)
  streetpieces+=1
 mesh=bpy.data.meshes.new("P4 R2 integrated true inhabited urban district "+str(index+1))
 mesh.from_pydata(vertices,[],polygons)
 mesh.update()
 assert len(mesh.polygons)>1600
 color=mesh.color_attributes.new(name="COLOR_0",type="FLOAT_COLOR",domain="CORNER")
 for poly,p in zip(mesh.polygons,colors):
  rgba=(*p,1.0)
  for li in poly.loop_indices:color.data[li].color=rgba
 old=obj.data;obj.data=mesh
 if old.users==0:bpy.data.meshes.remove(old)
 material=bpy.data.materials.new("P4 R2 inhabited stone glazed urban terraces "+str(index+1))
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
  "u":site["u"],"outboardDistanceM":site["out"],
  "inhabitedUrbanMassingCount":len(massings),"cityMassingSamples":massings,
  "actualPhysicalCivicBaseVolumes":court_count,
  "localSteppedPublicTerracePieces":terrace_count,"shortSameSideStreetPieces":streetpieces,
  "renderOnlyFacadeGlazingPanels":glazed_bays,"faces":len(mesh.polygons),
  "revision":"P4 R2 FULL ARCHITECTURAL LANGUAGE REBUILD — real stepped plazas, low-midrise city",
  "cameraProjectedSparseVertexSampleBBoxNotConservative":[]})
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
 "architecturalLanguage":"STEPPED_INHABITED_URBAN_STREETS_AND_OPEN_CIVIC_CANYON",
 "designRevision":"R2_FULL_CITY_REDESIGN_AFTER_R1_ART_REJECT",
 "cameraProjectionOnlyNotActualB51RasterMask":True,
 "officialSlope2Metres":0,"ART":"HOLD","HUMAN":"HOLD","GAMEPLAY":"HOLD","PERFORMANCE":"HOLD",
 "RELEASE":"HOLD","MERGE":"HOLD"}
with open(rep,"w",encoding="utf8") as f:json.dump(report,f,ensure_ascii=False,indent=2)
print("R19_A6P4_ACTUAL_BLENDER_OPEN_ATRIUM_CITY_SOURCE_CAMERA",json.dumps({
 "mode":mode,"realBlender":report["Blender"],"faces":new_faces,"districts":5,
 "buildings":sum(x["inhabitedUrbanMassingCount"] for x in reports),
 "ART":"HOLD","B51Raster":"NOT_MEASURED"}))
