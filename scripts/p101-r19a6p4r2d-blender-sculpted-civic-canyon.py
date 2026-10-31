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
 {"id":"R2D WEST CRESCENT: asymmetrical hollow civic cliffs","road":1,"side":-1,"u":.30,"out":270,"height":174,"span":.18,"kind":"crescent","seed":.2},
 {"id":"R2D WEST FORUM: occupied terraced museum and plaza","road":1,"side":-1,"u":.47,"out":308,"height":119,"span":.18,"kind":"forum","seed":1.7},
 {"id":"R2D ORBIT GARDENS: elevated braided park and civic ground","road":1,"side":-1,"u":.64,"out":267,"height":117,"span":.15,"kind":"garden","seed":2.6},
 {"id":"R2D QUIET DUNE: low habitat and folded courtyard","road":0,"side":-1,"u":.44,"out":272,"height":80,"span":.18,"kind":"habitat","seed":3.6},
 {"id":"R2D MARKET BASIN: open multilevel market terraces","road":0,"side":1,"u":.73,"out":295,"height":78,"span":.20,"kind":"market","seed":5.2}
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
    addface((a,bb,cc,dd),material+(1 if k==1 and row%19==0 else 0))
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
 # R2D architectural language: hollow cliff, layered public ground, gardens.
 # No repetitive equal cross-section towers, portals or long sky-ribbons.
 # Artistic reference is a source-native 3D scene, NOT human-access QA.
 massings=[];plazas=0;facets=0;public_voids=1;gallery_edges=0
 def octagonal_disk(center,along,across,up,l,w,depth,mat):
  rings=[]
  for z,scale in [(-depth,1.0),(-2,1.08),(2,.97)]:
   rings.append([center+along*(l*scale*cos(2*pi*q/8))+
                 across*(w*scale*sin(2*pi*q/8))+up*z for q in range(8)])
  addloft(rings,mat)
 def sculptural_wall(center,along,across,up,H,W,D,identity,mat):
  # An inhabited cliff wing: 4 diagonal shoulders, eroded central ridges,
  # stepped cuts, deliberately singular roof profile.
  # Dense per-building geometry is truly sculpted in Blender, not a shader.
  rings=[]
  for step in range(66):
   t=step/65
   setback=1.0-.28*t-.07*sin(2*pi*t+identity)
   pitch=10*sin(1.7*pi*t+identity)*t
   base=(center+up*(H*t)+along*(18*sin(pi*t)**1.4*sin(identity+.4))+
         across*(10*sin(pi*t)*cos(identity)))
   ring=[]
   for q in range(8):
    theta=2*pi*q/8+.11*sin(identity)
    # Irregular concave footprint with wings and open-air roof slots.
    wing=1+.18*sin(3*theta+identity+2.1*t)
    radW=W*.5*setback*wing
    radD=D*.5*(1-.18*t)*wing
    roofCut=(7*sin(theta*2+identity)+
             5*cos(3*theta+identity*1.4))*t**5
    ring.append(base+along*(radW*cos(theta))+
                across*(radD*sin(theta))+up*(pitch+roofCut))
   rings.append(ring)
  addloft(rings,mat)
 def carved_pod(center,along,across,up,H,width,length,k,mat):
  # Broad layered midrise, never an upright 48-ring octagonal prism.
  # Distinct inclined faces and a genuine 3D splayed roof in each body.
  rings=[]
  for n in range(24):
   t=n/23
   v=1-.21*t+(.075 if t<.4 else -.075 if t>.78 else 0)
   top=H*t
   lean=(11+3*k)*sin(pi*t)**1.3*sin(k*1.2+site["seed"])
   ring=[]
   for j in range(8):
    a=j*pi/4+.09*k
    folded=1+.16*sin(2*a+k*.81)*sin(pi*t)
    ring.append(center+along*(length*.5*cos(a)*v*folded+lean)+
     across*(width*.5*sin(a)*v*folded)+up*(top+6*sin(a+k*.91)*t*t))
   rings.append(ring)
  addloft(rings,mat)
 # Keep the whole district close to the already proven R2C road stations.
 # Road edge offsets remain >= 240m; actual B51 crossing is still CI-gated.
 baseEdge,outward,tangent,up=frame(site,site["u"])
 foot=baseEdge+outward*(site["out"]+31)
 # Carve a visible, genuinely EMPTY central public courtyard:
 # physical solid ground only around three independent sides, no roof.
 if index==0:
  bands=[(-.36,-41,70,23),(.04,67,84,18),(.42,-58,54,24)]
 elif index==1:
  bands=[(-.36,36,60,25),(.01,-60,76,19),(.38,46,51,23)]
 elif index==2:
  bands=[(-.33,-32,55,28),(.06,53,81,16),(.39,-46,48,25)]
 elif index==3:
  bands=[(-.32,-28,41,22),(.03,41,66,20),(.4,-55,46,26)]
 else:
  bands=[(-.39,50,54,20),(.04,-49,70,19),(.39,31,48,25)]
 for section,offset,span,depth in bands:
  u=site["u"]+site["span"]*section
  edge,diagonal,forward,vertical=frame(site,u)
  centre=edge+diagonal*(site["out"]+60+offset)+vertical*(-21)
  octagonal_disk(centre,forward,diagonal,vertical,span,depth,10,index+1)
  plazas+=1
  # Different height public galleries, anchored to their own plaza, not road.
  for level,scale in [(15,1.0),(35,.78)]:
   c=centre+vertical*level+diagonal*(9*sin(section*11+index))
   octagonal_disk(c,forward,diagonal,vertical,span*scale*.82,
                  depth*scale*.83,4,2)
   gallery_edges+=1
 # Primary urban silhouettes are purposely different across districts.
 count=[3,4,3,3,4][index]
 for k in range(count):
  du=(k-(count-1)/2)*(site["span"]/(count+.35))
  u=site["u"]+du
  edge,oo,aa,uu=frame(site,u)
  lateral=(-1 if k%2 else 1)*(35+9*sin(k*1.9+index))
  out=site["out"]+77+(-15 if k%3 else 23)
  centre=edge+oo*(out+lateral)+aa*(19*sin(k*1.51+index))+uu*(-10)
  H=site["height"]*([.64,1.,.47,.73][k%4])
  W=[80,105,64,94,58][(k+index)%5]
  D=[69,92,76,53,81][(k*2+index)%5]
  if k==0 and index==0:
   H*=1.15;W*=1.13
  if site["kind"] in ("habitat","market"):
   H*=.74
  if site["kind"] in ("garden","forum") and k==count-1:
   H*=.60;W*=1.2
  sculptural_wall(centre,aa,oo,uu,H,W,D,k+.7*index,0 if k%3 else 1)
  massings.append({"kind":"carved irregular civic wing","height":round(H,2),
    "width":W,"depth":D,"outboard_m":round(out+lateral,2),"u":round(u,4)})
 # Additional true low/midrise massing anchors near road and between cliffs.
 # Faceted, stepped and folded *real geometry* create depth without towers.
 for k in range([5,5,6,6,7][index]):
  t=(k+.5)/[5,5,6,6,7][index]
  locu=site["u"]+site["span"]*(t-.5)*.9
  edge,oo,aa,uu=frame(site,locu)
  dest=site["out"]+28+18*(k%3)
  centre=edge+oo*dest+aa*(12*cos(k*2.4+site["seed"]))+uu*(-18)
  H=(18+[12,28,10,31,17,23,11][k%7])*(1 if index<3 else .79)
  carved_pod(centre,aa,oo,uu,H,37+9*(k%3),58+12*(k%2),k,2 if k%3 else 0)
  massings.append({"kind":"low-rise folded civic annex","height":round(H,2),
    "outboard_m":round(dest,2),"u":round(locu,4)})
 # Layered civic steps: real 3D ground plates separated by an open-air gap.
 # They are not continuous elevated high-speed roads or huge connecting arches.
 for k in range(4):
  locu=site["u"]+site["span"]*((k+.5)/4-.5)
  edge,oo,aa,uu=frame(site,locu)
  c=edge+oo*(site["out"]+20+11*(k%2))+uu*(-29)
  octagonal_disk(c,aa,oo,uu,27+5*(k%2),33+6*(k%3),7,1)
  plazas+=1
 mesh=bpy.data.meshes.new("R2D sculpted public canyon and inhabited urban fabric "+str(index+1))
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
 for shot in actual_cameras:
  points=[q for v in world_samples if (q:=projection(shot,v)) is not None]
  bbox=[min(v[0] for v in points),max(v[0] for v in points),
        min(v[1] for v in points),max(v[1] for v in points)] if points else None
  projected.append({"tick":shot["tick"],"sparseSourceCameraNDCBBoxNotConservative":bbox,
    "sparseVisibleAreaProxy":roi_area(bbox,(-1,1),(-1,1))/4})
 reports.append({"district":old_name,"sourceRoad":site["road"],"side":site["side"],
  "u":site["u"],"outboardDistanceM":site["out"],"architecturalKind":site["kind"],
  "sculptedArchitecturalMasses":len(massings),"architecturalBodies":massings,
  "separatePublicGroundAndSteps":plazas,"localGalleryDecks":gallery_edges,
  "realOpenAirCentralCourt":True,"faces":len(mesh.polygons),
  "revision":"R2D: asymmetric civic cliffs, visibly open courts and urban fabric",
  "cameraProjectedSparseVertexSampleBBoxNotConservative":projected})
 num_vertices+=len(vertices)
assert len([obj for obj in bpy.context.scene.objects if obj.type=="MESH"])==5
new_faces=sum(len(o.data.polygons) for o in objects)
assert source_faces+100<new_faces<45000,(source_faces,new_faces)
assert all(a["faces"]>1600 for a in reports)
bpy.ops.wm.save_as_mainfile(filepath=blend)
bpy.ops.export_scene.gltf(filepath=out,export_format="GLB",use_selection=False)
assert os.stat(out).st_size>100000
report={"schema":"dopagaki.r19a6p4r2d-sculpted-urban-civic-canyon/1",
 "mode":mode,"originalSourceBlob":roads["sourceBlob"],
 "source_glb_sha256":sha(src),"edited_glb_sha256":sha(out),
 "blend_sha256":sha(blend),"source_anchors_sha256":sha(anchor),
 "archived_A1_12_camera_sha256":sha(cameras),
 "source_faces":source_faces,"edited_faces":new_faces,"added_faces":new_faces-source_faces,
 "editable_districts":5,"districts":reports,"vertices":num_vertices,
 "new_colliders":0,"globalB48B51ClearanceVerified":False,
 "humanArchitecturalAccess":"NOT_VERIFIED","actualTerrainContactVerified":False,
 "PBR_game":"NOT_IMPLEMENTED","Blender":bpy.app.version_string,
 "architecturalLanguage":"ASYMMETRIC_SCULPTED_CIVIC_WALLS_AND_REAL_OPEN_AIR_COURTS",
 "designRevision":"R2D_NEW_MASSING_LANGUAGE_AFTER_R2C_ART_REJECT",
 "cameraProjectionOnlyNotActualB51RasterMask":True,
 "officialSlope2Metres":0,"ART":"HOLD","HUMAN":"HOLD","GAMEPLAY":"HOLD","PERFORMANCE":"HOLD",
 "RELEASE":"HOLD","MERGE":"HOLD"}
with open(rep,"w",encoding="utf8") as f:json.dump(report,f,ensure_ascii=False,indent=2)
print("R19_A6P4_ACTUAL_BLENDER_OPEN_ATRIUM_CITY_SOURCE_CAMERA",json.dumps({
 "mode":mode,"realBlender":report["Blender"],"faces":new_faces,"districts":5,
 "architecturalMasses":sum(x["sculptedArchitecturalMasses"] for x in reports),
 "ART":"HOLD","B51Raster":"NOT_MEASURED"}))
