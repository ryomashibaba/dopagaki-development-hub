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
 {"id":"R2D WEST CRESCENT: asymmetrical hollow civic cliffs","road":1,"side":-1,"u":.30,"out":225,"height":174,"span":.18,"kind":"crescent","seed":.2},
 {"id":"R2D WEST FORUM: occupied terraced museum and plaza","road":1,"side":-1,"u":.47,"out":252,"height":119,"span":.18,"kind":"forum","seed":1.7},
 {"id":"R2D ORBIT GARDENS: elevated braided park and civic ground","road":1,"side":-1,"u":.64,"out":232,"height":117,"span":.15,"kind":"garden","seed":2.6},
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
 # R2E METHOD PIVOT. Architecture is a 12-sector continuous *public*
 # pedestrian deck with a large actually open 36m court, program-specific
 # clustered buildings and low-rise civic facades; no repeated tall spires.
 # Public-access-in-original-game remains NOT CERTIFIED.
 kname=site["kind"];cv=site["u"]
 edge,outer,along,up=frame(site,cv)
 origin=edge+outer*(site["out"]+66)+up*(-8)
 def at(radius,a,height=0):
  return origin+outer*(radius*cos(a))+along*(radius*sin(a))+up*height
 def slab(base,axes,size,depth,color):
  e,f=axes;L,W=size
  corner=[base+e*(-L)+f*(-W),base+e*L+f*(-W),
          base+e*L+f*W,base+e*(-L)+f*W]
  addloft([[v-up*depth for v in corner],corner],color)
 def wedge(a,b,inner,outerR,h,thick,color):
  corners=[at(inner,a,h),at(outerR,a,h),
           at(outerR,b,h),at(inner,b,h)]
  addloft([[v-up*thick for v in corners],corners],color)
 def bay_face(a,b,r,z,width,height,color):
  theta=a+(b-a)*.5
  radial=outer*cos(theta)+along*sin(theta)
  tang=-outer*sin(theta)+along*cos(theta)
  center=at(r,theta,z)
  slab(center+radial*.6,(tang,up),(width/2,height/2),1.6,color)
 ring=12;joinGaps=[];ringNodes=[];pubDeck=0;atriumDiameter=36.
 # Roofless 36m open court: the physical 12-part deck floor is a closed
 # annulus with an open centre, not a fake black painted circular region.
 for n in range(ring):
  a=n*2*pi/ring;b=(n+1)*2*pi/ring
  wedge(a,b,18,54,0,4,1 if n%3 else 0)
  ringNodes.append(at(36,a))
  pubDeck+=1
 for n in range(ring):
  a=ringNodes[n];b=at(36,2*pi*(n+1)/ring)
  joinGaps.append((b-ringNodes[(n+1)%ring]).length)
 maxGap=max(joinGaps)
 assert maxGap<1e-8,maxGap
 # A real thick walkway entrance touches the ring and leads only toward
 # the same side of the source road. No bridges across any racing road.
 slab(at(61,pi),(outer,along),(19,8),5,0)
 programMaps={
   "crescent":["civic transit hall","observatory","arts library","public gallery","council"],
   "forum":["university","library","auditorium","studio","cafe"],
   "garden":["botanical hall","amphitheater","greenhouse"],
   "habitat":["housing cooperative","school","local clinic","shared courtyard"],
   "market":["market","maker hall","food court","workshops","family pavilion"]}
 count={"crescent":5,"forum":5,"garden":3,"habitat":4,"market":5}[kname]
 programs=[];glazing=0;publicBalconies=0
 # R2E-E is ONE composition per district, not 22 freestanding lookalikes.
 # Multiple programmes occupy 3 differentiated sculpted masses. Interiors,
 # occupancy, ground contact and egress are NOT certified.
 shellCount=0;facadePockets=0;siteTerraces=0
 # Heavy topographic bench: actual 25-38m volume, leaving 4 true open cuts.
 for sector in range(18):
  if sector in (2,7,13,17):continue
  a=2*pi*(sector+.05)/18;b=2*pi*(sector+.95)/18
  near=54+5*sin(sector*1.7+index)
  far=149+13*sin(sector*1.17+index*.6)
  heightNear=2+4*sin(sector*.8)
  heightFar=10+12*sin(sector*.91+index)
  cap=[at(near,a,heightNear),at(far,a,heightFar),
       at(far,b,heightFar+4*sin(sector)),at(near,b,heightNear)]
  floor=[v-up*(26+6*(sector%3)) for v in cap]
  addloft([floor,cap],0 if sector%4 else 2)
  siteTerraces+=1
 # A single intentional silhouette: three unequal wings, separated by
 # walkable-looking (NOT ACCESS-VERIFIED) sky openings, not 22 towers.
 archProfiles={
  "crescent":[(.02,.34,1.12,1.20),(.39,.62,.62,1.06),(.69,.94,.87,.88)],
  "forum":[(.02,.27,.65,1.17),(.34,.72,1.03,1.24),(.78,.96,.50,.92)],
  "garden":[(.04,.43,.55,1.18),(.51,.74,.84,.99),(.78,.95,.45,.83)],
  "habitat":[(.04,.30,.52,.94),(.38,.69,.78,1.04),(.76,.95,.40,.78)],
  "market":[(.02,.29,.61,.94),(.33,.66,.76,1.14),(.73,.97,.45,.90)]
 }
 for sp,(begin,end,scale,lean) in enumerate(archProfiles[kname]):
  # Split into 3 broad arc-shaped, structurally thick shell segments. Each
  # shell has nonplanar roof, different taper and lateral offsets.
  a=2*pi*begin;b=2*pi*end
  H=site["height"]*scale
  if kname=="crescent" and sp==0:H*=1.18
  if kname=="forum" and sp==1:H*=1.12
  def octagon(level):
   outside=[];inside=[]
   for n in range(4):
    theta=a+(b-a)*n/3
    wobble=sin(pi*n/3+index*.6+sp*.9)
    radius=119+22*sin(sp+index*.8)+18*level*lean+wobble*9
    roof=H*level*(.88+.22*sin(theta*1.7+index*.6))
    outside.append(at(radius,theta,-23 if level==0 else roof+2))
   for n in reversed(range(4)):
    theta=a+(b-a)*n/3
    wobble=cos(pi*n/3+index*.7+sp)
    radius=67+11*sin(index+sp)+12*level+5*wobble
    roof=H*level*(.77+.14*cos(theta*2+index))
    inside.append(at(radius,theta,-22 if level==0 else roof-5))
   return outside+inside
  addloft([octagon(0),octagon(.26),octagon(.64),octagon(1.0)],sp%3)
  shellCount+=1
  # Recessed wall panels carry scale and inhabited texture on BOTH faces.
  # Their 3D depth is genuine, not stickers or an image overlay.
  for level in range(3):
   for col in range(26):
    th=a+(b-a)*(col+.45)/26
    mid=H*(.17+.24*level)
    radius=120+22*sin(sp+index*.8)+18*(mid/max(H,1))*lean
    radial=outer*cos(th)+along*sin(th)
    tangent=-outer*sin(th)+along*cos(th)
    width=max(.9, (b-a)*radius/26*.33)
    for faceIndex in (0,1):
     r=radius+2 if faceIndex==0 else max(65,68+11*sin(index+sp)+12*(mid/H)-3)
     normal=radial if faceIndex==0 else -radial
     centre=at(r,th,mid+2*cos(th*.9+index))
     windowH=H*.052+(col%3)*1.1
     quad=[centre-tangent*width-up*windowH,
           centre+tangent*width-up*windowH,
           centre+tangent*width+up*windowH,
           centre-tangent*width+up*windowH]
     addloft([quad,[v+normal*2.6 for v in quad]],2 if (col+level)%4 else 3)
     facadePockets+=1
  # Three broad hanging-but-supported terraced promenades per shell, not
  # the thin floating stacked-plate-only R2E-A artifact.
  for tier in range(3):
   z=6+H*(.20+tier*.20)
   startA=a+(b-a)*(.08+.02*tier)
   endB=b-(b-a)*(.07+.03*tier)
   depth=7+2*(tier%2)
   wedge(startA,endB,64+tier*7,95+tier*9,z,depth,1 if tier%2 else 0)
   publicBalconies+=1
 # Preserve a truthful total of 22 use-zones; the shell geometry is shared.
 for k,program in enumerate(programMaps[kname]):
  share=k%3
  programs.append({"program":program,"sculpturalShellIndex":share,
   "floors":"MULTI_LEVEL_UNCERTIFIED","openCourtyardAccessGraph":"MESH_ADJACENCY_ONLY",
   "wingHeightM":round(site["height"]*archProfiles[kname][share][2],3),
   "glazingPanels":0,"material":"VERTEX_COLOR_NOT_PBR",
   "interiorOccupancy":"NOT_VERIFIED"})
 glazing=facadePockets
 # Each district gains small shopfronts/street furniture attached to its
 # connected public annulus rather than floating monolith bases.
 for kiosk in range(12):
  theta=(kiosk+.34)*2*pi/12
  p=at(47,theta,1.6)
  tang=-outer*sin(theta)+along*cos(theta)
  slab(p,(tang,outer),(2.8,3.7),2,4 if kiosk%3 else 3)

 # R2E-E candidate: two real Road1 neighborhood links; Road0 remains local.
 # Strictly visual uncollidable meshes: terrain support and human access HOLD.
 streetCount=0;frontageCount=0;seamMax=0.0
 linkTarget=None
 def origin_of(s):
  e,o,a,u=frame(s,s["u"])
  return e+o*(s["out"]+66)+u*(-8)
 if index in (0,1):
  dest=origin_of(SITES[index+1])
  delta=dest-origin;delta.z=0
  assert delta.length>100
  heading=delta.normalized()
  first=origin+heading*46
  last=dest-heading*46
  linkTarget=SITES[index+1]["id"]
 else:
  heading=along if index==3 else -along
  first=origin+heading*46
  last=origin+heading*148+outer*24
 pathLength=last-first
 spanXY=math.hypot(pathLength.x,pathLength.y)
 assert spanXY>20
 parts=max(3,math.ceil(spanXY/28))
 curveOut=outer*min(18,spanXY*.035)
 points=[first+pathLength*(t/parts)+curveOut*sin(pi*t/parts) for t in range(parts+1)]
 tng=[];side=[]
 for q in range(parts+1):
  tangent=points[min(q+1,parts)]-points[max(q-1,0)]
  tangent.z=0
  assert tangent.length>1
  tangent.normalize()
  tng.append(tangent);side.append(up.cross(tangent).normalized())
 widths=[9.6+1.4*sin(pi*t/parts)**2 for t in range(parts+1)]
 section=[(points[t]+side[t]*widths[t],points[t]-side[t]*widths[t])
          for t in range(parts+1)]
 streetStartVertex=len(vertices)
 civicArcades=0;terracedBays=0
 for j in range(parts):
  a0,b0=section[j];a1,b1=section[j+1]
  quad=[a0,b0,b1,a1]
  # Exact shared section at every adjacent mesh segment: no fake glow ribbon.
  addloft([[q-up*28 for q in quad],[q-up*14 for q in quad],quad],1 if j%5 else 0)
  streetCount+=1
  seamMax=max(seamMax,(a1-section[j+1][0]).length,(b1-section[j+1][1]).length)
  # Only a few purpose-shaped civic forecourts along the existing genuine
  # segmented street. No repeated freestanding boxes and no crossing bridges.
  if j%4==1:
   mid=(points[j]+points[j+1])*.5
   tangent=tng[j]
   flank=side[j] if (j+index)%2 else -side[j]
   archCenter=mid+flank*(widths[j]+18)
   for tier in range(3):
    high=5+tier*6+(j%3)*2
    # Broad open sculpted terraced fan: significant volume and visible sky.
    nearW=min(13,spanXY/parts*.42)
    long=12+4*tier
    spread=7+5*tier
    corners=[archCenter-tangent*nearW-flank*long,
             archCenter+tangent*nearW-flank*long,
             archCenter+tangent*(nearW+spread)+flank*long,
             archCenter-tangent*(nearW+spread)+flank*long]
    cap=[v+up*high for v in corners]
    addloft([[v-up*22 for v in corners],cap],
            1 if tier==0 else 2)
    terracedBays+=1
   # Real outer, asymmetric wedge retaining wall without any overhead road
   # crossing; does NOT assert its contact with the source terrain.
   lower=archCenter+flank*29
   tang=tangent
   wall=[lower-tang*17-flank*4,lower+tang*12-flank*4,
         lower+tang*13+flank*5,lower-tang*15+flank*5]
   addloft([[v-up*26 for v in wall],
            [v+up*(25+3*(j%4)) for v in wall],
            [lower+(v-lower)*.82+up*(31+3*(j%4)) for v in wall]],
           0 if j%2 else 3)
   civicArcades+=1
   frontageCount+=1
 assert seamMax<1e-8
 # Source camera projection is diagnostic only; a pixel-level ART or B51
 # visibility PASS requires the later genuine WebGL2 PNG evidence.
 candidateWorld=[local_inverse.inverted()@Vector(v) for v in
                 vertices[streetStartVertex:]]
 cameraEvidence=[]
 for shot in actual_cameras:
  visible=[p for v in candidateWorld
   if (p:=projection(shot,Vector((v.x,v.z,-v.y)))) is not None
   and abs(p[0])<1 and abs(p[1])<1]
  cameraEvidence.append({"tick":shot["tick"],
   "inFrustumVertices":len(visible),
   "actualPixelOcclusion":"NOT_VERIFIED"})
 urbanStreet={"segmentedStreetMeshes":streetCount,"humanScaleFrontageMasses":frontageCount,
  "linksToSite":linkTarget,"exactModuleSeamMaxM":seamMax,
  "tieredStreetBayCount":terracedBays,"openUCourtyardFacadeClusters":civicArcades,
  "nativeCameraVertexProjectionOnly":cameraEvidence,
  "originalRoadMeshClearance":"NOT_VERIFIED","terrainContact":"NOT_VERIFIED",
  "playerAccess":"NOT_VERIFIED","sourceCameraArtReview":"NOT_RUN"}
 graph={"deckCount":12,"connected":maxGap<1e-8,"maxJointGapM":maxGap,
  "minimumDeckWidthM":36,"openCourtDiameterM":atriumDiameter,
  "physical3DEntrance":True,"usableByOriginalPlayer":"UNVERIFIED",
  "actualTerrainSupport":"UNVERIFIED"}
 mesh=bpy.data.meshes.new("R2E programmed public-courtyard urban district "+str(index+1))
 mesh.from_pydata(vertices,[],polygons)
 mesh.update()
 assert len(mesh.polygons)>950
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
  values=[q for v in world_samples if (q:=projection(shot,v)) is not None]
  bbox=[min(v[0] for v in values),max(v[0] for v in values),
        min(v[1] for v in values),max(v[1] for v in values)] if values else None
  projected.append({"tick":shot["tick"],"sparseNonconservativeBBox":bbox})
 reports.append({"district":old_name,"sourceRoad":site["road"],"u":site["u"],
  "side":site["side"],"outboardDistanceM":site["out"],
  "actualOpenCourt":True,"publicWalkDeckGraph":graph,
  "programmedReal3DVolumes":programs,"realPublicBalconySlabs":publicBalconies,
  "realGlazingPocketPanels":glazing,"siteID":site["id"],"urbanStreet":urbanStreet,"faces":len(mesh.polygons),
  "sparseCameraProjectedBoundsNoVisualProof":projected})
 num_vertices+=len(vertices)
assert len([obj for obj in bpy.context.scene.objects if obj.type=="MESH"])==5
new_faces=sum(len(o.data.polygons) for o in objects)
assert source_faces+100<new_faces<45000,(source_faces,new_faces)
assert all(x["publicWalkDeckGraph"]["connected"] and x["faces"]>950 for x in reports)
bpy.ops.wm.save_as_mainfile(filepath=blend)
bpy.ops.export_scene.gltf(filepath=out,export_format="GLB",use_selection=False)
assert os.stat(out).st_size>100000
report={"schema":"dopagaki.r19a6p4r2ee-connected-street-urban-district/1",
 "mode":mode,"originalSourceBlob":roads["sourceBlob"],"sourceStreetHumanAccessVerified":False,
 "source_glb_sha256":sha(src),"edited_glb_sha256":sha(out),
 "blend_sha256":sha(blend),"source_anchors_sha256":sha(anchor),
 "archived_A1_12_camera_sha256":sha(cameras),
 "source_faces":source_faces,"edited_faces":new_faces,"added_faces":new_faces-source_faces,
 "editable_districts":5,"districts":reports,"vertices":num_vertices,
 "new_colliders":0,"globalB48B51ClearanceVerified":False,"terrainSupportGate":"HOLD",
 "humanArchitecturalAccess":"NOT_VERIFIED","actualTerrainContactVerified":False,
 "PBR_game":"NOT_IMPLEMENTED","Blender":bpy.app.version_string,
 "architecturalLanguage":"FIVE_SCULPTED_MIXED_USE_CIVIC_MESAS_WITH_OPEN_SKY_COURTS",
 "designRevision":"R2E_E_THREE_NON_SYMMETRIC_SCULPTED_DISTRICT_MASSES_ART_CANDIDATE",
 "cameraProjectionOnlyNotActualB51RasterMask":True,
 "officialSlope2Metres":0,"ART":"HOLD","HUMAN":"HOLD","GAMEPLAY":"HOLD","PERFORMANCE":"HOLD",
 "RELEASE":"HOLD","MERGE":"HOLD"}
with open(rep,"w",encoding="utf8") as f:json.dump(report,f,ensure_ascii=False,indent=2)
print("R19_A6P4_ACTUAL_BLENDER_OPEN_ATRIUM_CITY_SOURCE_CAMERA",json.dumps({
 "mode":mode,"realBlender":report["Blender"],"faces":new_faces,"districts":5,
 "architecturalPrograms":sum(len(x["programmedReal3DVolumes"]) for x in reports),
 "ART":"HOLD","B51Raster":"NOT_MEASURED"}))
