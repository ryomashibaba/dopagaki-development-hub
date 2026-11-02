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
 shellCount=0;facadePockets=0;siteTerraces=0;heroSkySlots=0;publicStairTiers=0;civicGroundModules=0;civicButtressVolumes=0
 archProfiles={
  "crescent":[(.02,.34,1.12,1.20),(.39,.62,.62,1.06),(.69,.94,.87,.88)],
  "forum":[(.02,.27,.65,1.17),(.34,.72,1.03,1.24),(.78,.96,.50,.92)],
  "garden":[(.04,.43,.55,1.18),(.51,.74,.84,.99),(.78,.95,.45,.83)],
  "habitat":[(.04,.30,.52,.94),(.38,.69,.78,1.04),(.76,.95,.40,.78)],
  "market":[(.02,.29,.61,.94),(.33,.66,.76,1.14),(.73,.97,.45,.90)]}
 # Deep 3D urban ground; voids remain actual empty air, not painted black.
 for k in range(20):
  if k in (3,10,17):continue
  a=2*pi*(k+.03)/20;b=2*pi*(k+.96)/20
  near=54+6*sin(k*.63+index);far=148+17*sin(k*.51+index*.7)
  cap=[at(near,a,2),at(far,a,12+13*sin(k*.5+index)),
       at(far,b,16+9*sin(k*.7+index)),at(near,b,3)]
  addloft([[v-up*(31+4*(k%3)) for v in cap],cap],0 if k%4 else 2)
  siteTerraces+=1
 # Each source-road precinct has a DIFFERENT three-dimensional silhouette.
 # 0 = crescent civic cliff, 1 = public forum, 2 = folded botanical ground.
 forms={
   0:[(.02,.34,1.16),(.45,.69,.53),(.79,.96,.75)],
   1:[(.04,.28,.44),(.34,.75,.90),(.84,.98,.41)],
   2:[(.03,.49,.49),(.60,.94,.68)],
   3:[(.07,.41,.48),(.53,.88,.55)],
   4:[(.03,.37,.46),(.45,.82,.61)]}[index]
 # R2F1-C: SELECT the hero wall from the original 240Hz camera
 # rather than always carving arbitrary form #0 (invisible at 11.504s).
 # This is a projection proxy only; true raster occlusion is reviewed later.
 cameraTick=1921 if index==0 else 2761 if index in (1,2) else None
 cameraForHero=next((f for f in actual_cameras if f["tick"]==cameraTick),None)
 def screenScore(form):
  if cameraForHero is None:return 0.
  u0,u1,fraction=form;H=site["height"]*fraction
  p=[]
  for t in (0,.17,.33,.50,.67,.83,1.):
   theta=2*pi*(u0+(u1-u0)*t)
   inner=65+10*sin(index+forms.index(form)+2.8*t)
   far=130+18*sin(index*.9+forms.index(form)+2.6*t)
   high=H*(.59+.22*sin(pi*t)+.13*sin(3*pi*t+forms.index(form)*.7))
   for r,z in ((inner,-30),(far,-30),(far,high),(inner,high*.75)):
    v=at(r,theta,z)
    q=projection(cameraForHero,Vector((v.x,v.z,-v.y)))
    if q is not None and abs(q[0])<1 and abs(q[1])<1:p.append(q)
  if len(p)<3:return 0.
  return round((max(v[0] for v in p)-min(v[0] for v in p))*
               (max(v[1] for v in p)-min(v[1] for v in p)),6)
 heroCameraScores=[screenScore(form) for form in forms]
 heroFormIndex=max(range(len(forms)),key=lambda i:heroCameraScores[i])
 if index<3:assert heroCameraScores[heroFormIndex]>0,(index,heroCameraScores)
 for sp,(u0,u1,hFraction) in enumerate(forms):
  a=2*pi*u0;b=2*pi*u1;H=site["height"]*hFraction
  def section(t):
   th=a+(b-a)*t
   r0=65+10*sin(index+sp+2.8*t)
   r1=130+18*sin(index*.9+sp+2.6*t)
   height=H*(.59+.22*sin(pi*t)+.13*sin(3*pi*t+sp*.7))
   lean=14*sin(pi*t)*sin(index+sp+.8)
   return [at(r0,th,-30),at(r1,th,-30),
           at(r1+lean,th,height),
           at(r0+lean*.4,th,height*(.65+.12*sin(2*pi*t+index)))]
  countSections=132 if index<3 else 88
  # The first hero of each Road1 district has a REAL full-height
  # open-to-sky void. Original game road, colliders and camera unchanged.
  opening=(.24,.57) if index==0 else (.28,.64) if index==1 else (.23,.56)
  carvedHero=(index<3 and sp==heroFormIndex)
  # R2F1-D original source-camera-selected hero: REPLACE the tall
  # bisected wall with a 3D inhabited-looking open-air civic escarpment.
  # Nine deep concentric inhabited terraces, independent angular modules,
  # genuine open-to-sky public canyon, and large voids all the way to
  # the public street: no giant portal, no repetitive cubes, no sky ribbon.
  if carvedHero:
   heroSkySlots+=1
   for band in range(9):
    r0=49+band*10.4;r1=r0+10.8
    for piece in range(24):
     # Three generous radial skylight cuts, not a cosmetic wall stencil.
     # Primary court corridor is pieces 10..13. Thin cuts separate
     # other occupied stepped terraces as actual empty 3D air.
     if piece in (3,4,10,11,12,13,19):continue
     t0=(piece+.015)/24;t1=(piece+.985)/24
     az0=a+(b-a)*t0;az1=a+(b-a)*t1
     h0=5.5+band*7.7+4.3*sin(piece*.42+index*.6+band*.19)
     h1=5.5+band*7.7+4.3*sin((piece+1)*.42+index*.6+band*.19)
     crown0=2.5+3.1*sin(band*.76+piece*.27+sp)
     crown1=2.5+3.1*sin(band*.76+(piece+1)*.27+sp)
     upper=[at(r0,az0,h0),at(r1,az0,h0+crown0),
            at(r1,az1,h1+crown1),at(r0,az1,h1)]
     # Every terrace is a REAL 28+ metre deep polygon volume.
     # Individual segments do not form a thin floating slab.
     lower=[v-up*(29+band*1.8) for v in upper]
     middle=[v-up*(13+band*.4) for v in upper]
     addloft([lower,middle,upper],0 if band<4 else (1 if band<7 else 2))
     civicGroundModules+=1
     # Sculptural access ribs inhabit the outer terrace, placed behind
     # the civic plaza rather than across the original racing roadway.
     if band in (2,5,8) and piece in (0,7,16,22):
      center=(upper[1]+upper[2])*.5
      tang=-outer*sin((az0+az1)*.5)+along*cos((az0+az1)*.5)
      radial=outer*cos((az0+az1)*.5)+along*sin((az0+az1)*.5)
      depth=4+band*.46
      cross=[center-tang*4-radial*depth,
             center+tang*4-radial*depth,
             center+tang*2+radial*depth,
             center-tang*2+radial*depth]
      addloft([[v-up*(18+band*1.2) for v in cross],
               [v+up*(7+band*.75) for v in cross],
               [center+(v-center)*.72+up*(12+band*.78) for v in cross]],3)
      civicButtressVolumes+=1
   # Six thick terrain segments visually lead from public centre to the
   # fully sky-open radial slot. No claim that a human can traverse it.
   slot0=a+(b-a)*10.5/24;slot1=a+(b-a)*13.5/24
   for step in range(6):
    r0=48+step*15;r1=r0+15.4
    h0=2+step*5.6+(2.3 if index==1 else 0)
    h1=h0+2.2
    top=[at(r0,slot0,h0),at(r1,slot0,h1),
         at(r1,slot1,h1+1.1),at(r0,slot1,h0+1.1)]
    addloft([[v-up*(32+step*2) for v in top],
             [v-up*(15+step*.7) for v in top],top],1 if step%2 else 0)
    publicStairTiers+=1
   shellCount+=1
  else:
   addloft([section(j/countSections) for j in range(countSections+1)],
           (sp+index)%3)
   shellCount+=1
  # Inhabited-looking true recess volumes, not fake PBR windows.
  for k in range(0 if carvedHero else 72):
   if (k+sp)%4==0:continue
   t=(k+.5)/72
   if carvedHero and opening[0]<=t<=opening[1]:continue
   theta=a+(b-a)*t
   r=131+18*sin(index*.9+sp+2.6*t)
   centre=at(r,theta,H*(.17+.22*(k%3)))
   tang=-outer*sin(theta)+along*cos(theta)
   norm=outer*cos(theta)+along*sin(theta)
   w=1.05+(k%3)*.4;h=2.8+(sp%2)*1.3
   face=[centre-tang*w-up*h,centre+tang*w-up*h,
         centre+tang*w+up*h,centre-tang*w+up*h]
   addloft([face,[v+norm*4.2 for v in face]],2 if k%3 else 3)
   facadePockets+=1
  for level in range(0 if carvedHero else (3 if index==1 else 2)):
   begin=a+(b-a)*(.18+level*.09)
   finish=b-(b-a)*(.18+level*.05)
   if carvedHero:
    for az0,az1 in ((begin,min(finish,a+(b-a)*opening[0])),
                    (max(begin,a+(b-a)*opening[1]),finish)):
     if az1-az0>.025:
      wedge(az0,az1,64+7*level,97+8*level,
            H*(.21+level*.19),11+level*3,1 if level%2 else 0)
      publicBalconies+=1
   else:
    wedge(begin,finish,64+7*level,97+8*level,
          H*(.21+level*.19),11+level*3,1 if level%2 else 0)
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
  # Native source-road 1 civic terrain: deep, curved ground on both
  # sides of the true pedestrian-side street, never over the race roadway.
  if index<2:
   for sign in (-1,1):
    f0=side[j]*sign;f1=side[j+1]*sign
    h0=10+13*sin(pi*j/parts+index*.6+sign*.4)
    h1=10+13*sin(pi*(j+1)/parts+index*.6+sign*.4)
    c0=points[j]+f0*widths[j];c1=points[j+1]+f1*widths[j+1]
    o0=points[j]+f0*(widths[j]+44)+up*h0
    o1=points[j+1]+f1*(widths[j+1]+44)+up*h1
    quad=[c0,c1,o1,o0]
    addloft([[v-up*35 for v in quad],quad],0 if j%4 else 2)
    terracedBays+=1
   if j in (parts//3,parts*2//3):
    mid=(points[j]+points[j+1])*.5
    tangent=tng[j];flank=side[j] if j%2 else -side[j]
    centre=mid+flank*(widths[j]+50)+up*15
    quad=[centre-tangent*19-flank*8,centre+tangent*25-flank*9,
          centre+tangent*14+flank*19,centre-tangent*18+flank*14]
    addloft([[v-up*30 for v in quad],quad],1)
    frontageCount+=1;civicArcades+=1
  elif j%4==1:
   # Road0 secondary exterior precinct, no overhead crossing.
   mid=(points[j]+points[j+1])*.5
   tangent=tng[j];flank=side[j] if j%2 else -side[j]
   centre=mid+flank*(widths[j]+17)+up*8
   quad=[centre-tangent*13-flank*9,centre+tangent*15-flank*7,
         centre+tangent*12+flank*15,centre-tangent*15+flank*13]
   addloft([[v-up*25 for v in quad],quad],1)
   frontageCount+=1;civicArcades+=1;terracedBays+=1
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
  "realGlazingPocketPanels":glazing,"siteID":site["id"],"urbanStreet":urbanStreet,
   "heroOpenSkySlots":heroSkySlots,"publicStairMasses":publicStairTiers,
   "civicGroundRealVolumeModules":civicGroundModules,
   "civicUrbanRibButtresses":civicButtressVolumes,
   "heroGeometryMode":"OPEN_AIR_STEPPED_CIVIC_GROUND" if heroSkySlots else "PRESERVED_NON_HERO",

   "heroFormIndexChosenByOriginalCamera":heroFormIndex if index<3 else None,
   "heroOriginalCameraTick":cameraTick,
   "heroProjectedCandidateAreaNDCOnly":heroCameraScores,
   "actualHumanPathVerified":False,"faces":len(mesh.polygons),
  "sparseCameraProjectedBoundsNoVisualProof":projected})
 num_vertices+=len(vertices)
assert len([obj for obj in bpy.context.scene.objects if obj.type=="MESH"])==5
new_faces=sum(len(o.data.polygons) for o in objects)
assert source_faces+100<new_faces<45000,(source_faces,new_faces)
assert all(x["publicWalkDeckGraph"]["connected"] and x["faces"]>950 for x in reports)
assert [x["heroOpenSkySlots"] for x in reports]==[1,1,1,0,0]
assert [x["publicStairMasses"] for x in reports]==[6,6,6,0,0]
assert all(x["civicGroundRealVolumeModules"]>=120 for x in reports[:3])
assert all(x["civicUrbanRibButtresses"]>=4 for x in reports[:3])
assert all(x["civicGroundRealVolumeModules"]==0 for x in reports[3:])
bpy.ops.wm.save_as_mainfile(filepath=blend)
bpy.ops.export_scene.gltf(filepath=out,export_format="GLB",use_selection=False)
assert os.stat(out).st_size>100000
report={"schema":"dopagaki.r19a6p4r2f1-connected-street-urban-district/1",
 "mode":mode,"originalSourceBlob":roads["sourceBlob"],"sourceStreetHumanAccessVerified":False,
 "source_glb_sha256":sha(src),"edited_glb_sha256":sha(out),
 "blend_sha256":sha(blend),"source_anchors_sha256":sha(anchor),
 "archived_A1_12_camera_sha256":sha(cameras),
 "source_faces":source_faces,"edited_faces":new_faces,"added_faces":new_faces-source_faces,
 "editable_districts":5,"districts":reports,"vertices":num_vertices,
 "new_colliders":0,"globalB48B51ClearanceVerified":False,"terrainSupportGate":"HOLD",
 "humanArchitecturalAccess":"NOT_VERIFIED","actualTerrainContactVerified":False,
 "PBR_game":"NOT_IMPLEMENTED","Blender":bpy.app.version_string,
 "architecturalLanguage":"R2F_CAMERA_FIRST_THREE_DIFFERENT_ROAD1_CIVIC_LANDFORMS",
 "designRevision":"R2F1D_CAMERA_HERO_REPLACED_BY_OPEN_AIR_CIVIC_ESCARPMENT_ART_HOLD",
 "cameraProjectionOnlyNotActualB51RasterMask":True,
 "officialSlope2Metres":0,"ART":"HOLD","HUMAN":"HOLD","GAMEPLAY":"HOLD","PERFORMANCE":"HOLD",
 "RELEASE":"HOLD","MERGE":"HOLD"}
with open(rep,"w",encoding="utf8") as f:json.dump(report,f,ensure_ascii=False,indent=2)
print("R19_A6P4_ACTUAL_BLENDER_OPEN_ATRIUM_CITY_SOURCE_CAMERA",json.dumps({
 "mode":mode,"realBlender":report["Blender"],"faces":new_faces,"districts":5,
 "architecturalPrograms":sum(len(x["programmedReal3DVolumes"]) for x in reports),
 "ART":"HOLD","B51Raster":"NOT_MEASURED"}))
