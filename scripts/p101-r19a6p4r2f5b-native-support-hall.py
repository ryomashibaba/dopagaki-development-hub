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
 shellCount=0;facadePockets=0;siteTerraces=0;heroSkySlots=0;publicStairTiers=0;civicGroundModules=0;civicButtressVolumes=0;inhabitedPrimaryVolumes=0
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
 # R2F5B-C: SELECT the hero wall from the original 240Hz camera
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
  # R2F5B-D original source-camera-selected hero: REPLACE the tall
  # bisected wall with a 3D inhabited-looking open-air civic escarpment.
  # Nine deep concentric inhabited terraces, independent angular modules,
  # genuine open-to-sky public canyon, and large voids all the way to
  # the public street: no giant portal, no repetitive cubes, no sky ribbon.
  # R2F5B: source-camera-ORIENTED real city entrance, seen from native
  # tick1921 or 2761. Instead of building a wall and cutting a hole,
  # arrange the entire foreground as a wide open civic landscape.
  if index<3:
   if sp!=0:continue
   # Derive the PUBLIC MOUTH azimuth from the TRUE original camera eye
   # in the existing city's radial frame. This avoids guessed screen-side
   # placement and leaves the original gameplay camera untouched.
   d=bvec(cameraForHero["eye"])-origin
   publicAz=math.atan2(d.dot(along),d.dot(outer))
   assert math.isfinite(publicAz)
   cameraEntranceAzimuthRad=publicAz
   # Four broad ground masses, from public courtyard outward. They each
   # form one continuous 8-point curved solid, no tiny stepped columns.
   # Outer lip faces the original game's camera, so the public terrace
   # can be SEEN, not hidden behind the building facade.
   for level in range(4):
    r0=51+level*33;r1=r0+35.3
    lo=publicAz-.59+level*.035
    hi=publicAz+.59-level*.027
    N=86
    def piazza(t):
     th=lo+(hi-lo)*t
     s=sin(pi*t)
     rA=r0+1.3*sin(2.4*pi*t+level)
     rB=r1+2.1*sin(1.8*pi*t+index)
     crest=3.6+level*4.8+1.2*s+.55*sin(3*pi*t+index)
     return [at(rA,th,-29),at(rB,th,-32),
             at(rB,th,crest-3.0),
             at(rB-4.5,th,crest),
             at(rA+11,th,crest+.8),
             at(rA+3,th,crest-1.8),
             at(rA,th,crest-6),at(rA,th,-13)]
    addloft([piazza(k/N) for k in range(N+1)],1 if level%2 else 0)
    civicGroundModules+=1
    publicStairTiers+=1
   # Two asymmetrically curved occupied building wings *beside* the
   # public mouth. Their visible inner flank turns toward the plaza,
   # so one can see lower roofs and the broad public ground.
   wings=(
    (-1.39,-.73,53,172,42,0),
    (.77,1.61,55,168,32,2),
    (2.00,4.19,82,163,62,3))
   for wing,(rel0,rel1,innerR,farR,peak,material) in enumerate(wings):
    N=106 if wing==2 else 92
    lo=publicAz+rel0;hi=publicAz+rel1
    def building(t):
     th=lo+(hi-lo)*t
     s=sin(pi*t)
     r0=innerR+6.5*sin(2*pi*t+index+wing)
     r1=farR+7*sin(1.7*pi*t+wing)
     # Distinct civic hall roof heights and gently sloped, asymmetric
     # silhouettes, not an uninterrupted wall at racing-road scale.
     z=peak*(.51+.22*s+.16*sin(2.4*pi*t+.48*wing+index*.3))
     eave=z*(.68+.12*s)
     return [at(r0,th,-28),
             at(r1,th,-31),
             at(r1,th,z*.38),
             at(r1-15,th,z),
             at(r1-30,th,z+5*s),
             at(r0+31,th,eave),
             at(r0+10,th,9+3*s),
             at(r0,th,-9)]
    addloft([building(k/N) for k in range(N+1)],material)
    inhabitedPrimaryVolumes+=1
    shellCount+=1
    if wing<2:civicButtressVolumes+=1
   # This gap is real open air from the native camera direction to the
   # 36m central court. A glTF polygon union is NOT human walkway QA.
   heroSkySlots+=1
   continue
  # Road0 off-axis districts remain the documented R2F5B control.
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
 # R2F5B: two source-camera-VERIFIED near-road public halls, NOT
 # bridges or road colliders. Same ORIGINAL road1 source positions
 # u=.100 at tick1921 and u=.350 at tick2761, out 35 metres from
 # physical road edge. Earlier 100m+ roadside setback was visually tiny.
 roadsideFacilities=[]
 if index in (0,1):
  roadU=.100 if index==0 else .350
  nativeTick=1921 if index==0 else 2761
  roadEdge,roadOut,roadAhead,roadUp=frame({"road":1,"side":-1},roadU)
  roadsideCentre=roadEdge+roadOut*35
  realShot=next(x for x in actual_cameras if x["tick"]==nativeTick)
  camEye=bvec(realShot["eye"])
  toward=camEye-roadsideCentre;toward.z=0.;assert toward.length>10
  toward.normalize()
  lat=up.cross(toward).normalized()
  assert abs(toward.dot(lat))<1e-7
  def pg(x,y,z=0):
   return roadsideCentre+lat*x+toward*y+up*z
  startNearby=len(vertices)
  # R2F5-B native Blender supported hall, ONLY original 8s Road1.
  # Actual structural 3D geometry; terrain contact remains unverified.
  nativeParts=[]
  nativeWorld=[]
  nativeCount=0
  nativeSupportError=0.
  if index==0:
   from mathutils import Matrix
   orientation=Matrix((lat,toward,up)).transposed().to_quaternion()
   def nativeFinish(o,c,bevel=.17):
    nonlocal_dummy=None
    bpy.ops.object.select_all(action="DESELECT")
    o.select_set(True);bpy.context.view_layer.objects.active=o
    if bevel:
     mod=o.modifiers.new("STRUCTURAL_EDGE_BEVEL",type="BEVEL")
     mod.width=bevel;mod.segments=3
     bpy.ops.object.modifier_apply(modifier=mod.name)
    attr=o.data.color_attributes.new(name="COLOR_0",type="FLOAT_COLOR",domain="CORNER")
    rgba=(*palette[c%5],1.)
    for poly in o.data.polygons:
     for li in poly.loop_indices:attr.data[li].color=rgba
    nativeParts.append(o)
   def nativeCube(tag,centre,size,c=0,edge=.17,rotation=None):
    bpy.ops.mesh.primitive_cube_add(size=1,location=centre)
    o=bpy.context.object;o.name="R2F5B_"+tag
    o.rotation_mode="QUATERNION";o.rotation_quaternion=rotation if rotation else orientation
    o.dimensions=size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    nativeFinish(o,c,edge)
   def nativeBeam(tag,a,b,width=.7,depth=.7,c=2):
    d=b-a;assert d.length>.5
    nativeCube(tag,(a+b)*.5,(width,depth,d.length),c,.12,d.to_track_quat("Z","Y"))
   def nativeRoof(tag,corners,thick,c):
    vs=[tuple(p) for p in corners]+[tuple(p-up*thick) for p in corners]
    fs=[(0,1,2,3),(7,6,5,4),(0,4,5,1),(1,5,6,2),(2,6,7,3),(3,7,4,0)]
    rm=bpy.data.meshes.new("SUPPORTED_ROOF_"+tag);rm.from_pydata(vs,[],fs);rm.update()
    o=bpy.data.objects.new("R2F5B_ROOF_"+tag,rm)
    bpy.context.collection.objects.link(o);nativeFinish(o,c,.24)
   nativeCube("CONTIGUOUS_FOUNDATION",pg(0,-1,.4),(49,35,3.4),0,.36)
   nativeCube("PUBLIC_CENTRE_ROUTE",pg(0,-1,2.23),(12,32,.4),1,.08)
   for side,(xa,xb,z0,z1,tilt,colorRoof) in enumerate((
       (-25.1,-9.2,15.1,13.7,.7,4),
       (9.1,24.7,15.1,12.8,1.1,1))):
    front=15.;back=-16.;thick=1.4
    def height(x,y):
     t=(x-xa)/(xb-xa)
     return z0*(1-t)+z1*t+tilt*(front-y)/(front-back)
    nativeRoof(str(side),[
     pg(xa,front,height(xa,front)),pg(xb,front,height(xb,front)),
     pg(xb,back,height(xb,back)),pg(xa,back,height(xa,back))],thick,colorRoof)
    for yy in (12.,-1.2,-13.):
     for xx in (xa+1.6,xb-1.6):
      roofBottom=height(xx,yy)-thick
      nativeBeam("ROOF_SUPPORT_%s_%.2f_%.2f"%(side,xx,yy),
                 pg(xx,yy,2.1),pg(xx,yy,roofBottom),.9,.9,2)
      nativeCube("GROUND_FOOTING_%s_%.2f_%.2f"%(side,xx,yy),
                 pg(xx,yy,2.1),(2.,2.,.8),0,.1)
      nativeSupportError=max(nativeSupportError,abs(height(xx,yy)-thick-roofBottom))
    for xx in (xa+1.6,xb-1.6):
     nativeBeam("LONGITUDINAL_ROOF_GIRDER_%s_%.2f"%(side,xx),
                pg(xx,back,height(xx,back)-thick-.6),
                pg(xx,front,height(xx,front)-thick-.6),.6,.8,3)
    mid=(xa+xb)*.5
    nativeCube("GALLERY_FLOOR_"+str(side),pg(mid,-4.,3.7),
               (xb-xa-3.,21.,2.8),0,.18)
    for k,y in enumerate((-9.,2.8)):
     nativeCube("COUNTER_%s_%s"%(side,k),pg(mid,y,6.),
                (6.2,2.5,2.),3,.16)
     nativeCube("SHOP_REAR_%s_%s"%(side,k),pg(mid,y-2.2,9.6),
                (7.2,.8,4.8),2,.13)
   for k,(x,y,w) in enumerate(((-18.,7.,6.),(16.7,5.8,7.1),(-18.,-9.,6.))):
    nativeCube("STREET_SHOP_COUNTER_"+str(k),pg(x,y,3.5),
               (w,2.8,2.6),3,.15)
    nativeCube("SHOP_LIGHT_"+str(k),pg(x,y-2.3,7.6),(w+.5,.8,4.),4,.12)
    nativeCube("STREET_SHOP_LEDGE_"+str(k),pg(x,y+.5,5.05),(w+.8,1.6,.4),1,.07)
   for side,x in enumerate((-16.5,16.4)):
    for step in range(5):
     nativeCube("GALLERY_STAIR_%s_%s"%(side,step),
                pg(x,11.8-1.9*step,2.45+.62*step),
                (3.4,2.,1.+.62*step),0,.07)
   for side,x in enumerate((-23.5,23.)):
    nativeBeam("OUTSIDE_DIAGONAL_BRACE_"+str(side),
               pg(x,12.,5.),pg(x,-1.2,10.8),.5,.6,3)
   nativeCount=sum(len(o.data.vertices) for o in nativeParts)
   assert nativeSupportError<1e-8 and len(nativeParts)>=55 and nativeCount>500
   nativeWorld=[Vector((p.x,p.z,-p.y)) for o in nativeParts
                for v in o.data.vertices for p in (o.matrix_world@v.co,)]
   interiorOpenGalleries=2;marketBays=3;retailBaseZ=2.15
   venueKind="TRUE_NATIVE_BLENDER_STRUCTURAL_MARKET"
  else:
    # R2F5-A CAMERA-FIRST RECONCEPTION, not another shell tweak.
    # Ground level is referenced to the REAL SOURCE Road1 edge (z=0).
    # Prior R2F5B-B "market counters" were placed at z=-8 below a
    # nearby public deck near z=+2. Here retail, platforms, and interior
    # floor are at +1.5..+5.5m, inside the native camera sight line.
    venueKind="INTERMODAL_MARKET_CONCOURSE" if index==0 else "BOTANICAL_EXCHANGE_TERMINAL"
    # Broad one-piece grounded-feeling hardscape. A 2.8m thick planar
    # base, NOT an invented physical collider or proven terrain support.
    floorCorners=[pg(-24,-18,1.8),pg(24,-18,1.8),
                  pg(24,16,1.8),pg(-24,16,1.8)]
    addloft([[p-up*2.8 for p in floorCorners],floorCorners],0)
    # Contrasting continuous pedestrian desire lines towards the rear
    # transit interchange. These actually sit ON the +1.8m floor.
    for x in (-7.1,7.4):
     slab(pg(x,1.0,2.02),(lat,toward),(1.2,14.8),.38,3)
    # A broad, explicit CENTER path. Never put roofs across x=-9..9
    # near the front. Painted stripe is 3D, not a new movement surface.
    slab(pg(0,1.0,2.05),(lat,toward),(3.3,14.1),.22,1)
    interiorOpenGalleries=0
    # Two different load-bearing terraces with roofs that FOLD toward
    # the court. The structure is NOT two filled wall blocks. Both roofs
    # have 3D thickness, and actual sky / air below each.
    for wing,(left,right,outside,baseRoof,peak,mat) in enumerate((
         (-25,-10,-24,16.8,7.2,4),
         (10,24,23,13.3,4.9,1))):
     n=42
     def roof(t):
      y=-17+31*t
      bend=sin(pi*t)
      uplift=(peak*bend*(.52+.48*sin(1.7*pi*t+wing*.7)**2))
      low=baseRoof+uplift+(.8*wing)
      innerX=right if wing==0 else left
      outerX=left if wing==0 else right
      # Open-air inside; for the viewer the inclined roof underside is
      # a long, legible civic silhouette, not a 24m wall/solid box.
      zInner=low+2.4+1.5*sin(t*pi*1.15+wing*.5)
      zOuter=low+5.3+2.8*sin(pi*t+index*.45)
      return [pg(innerX+.4*(1-2*wing),y,zInner-1.2),
              pg(outerX,y,zOuter-1.8),
              pg(outerX,y,zOuter+1.2),
              pg(innerX+.4*(1-2*wing),y,zInner+1.1)]
     addloft([roof(i/n) for i in range(n+1)],mat)
     # Only OUTSIDE load-bearing edge wall, open toward the central hall.
     def support(t):
      y=-16+29*t
      h=baseRoof+1.0+peak*.64*sin(pi*t)
      return [pg(outside-1.5,y,1.5),pg(outside+1.5,y,1.5),
              pg(outside+1.5,y,h),pg(outside-1.5,y,h)]
     addloft([support(i/n) for i in range(n+1)],2)
     # Distinct lower occupied store galleries. Floor at z=+4.3,
     # real open space between store gallery and folded roof.
     galleryCenter=(left+right)/2
     slab(pg(galleryCenter,-4.6,4.3),(lat,toward),
         ((right-left)/2-.65,10.6),2.5,0 if wing==0 else 3)
     # One sloped end baffle; DO NOT close the camera-facing entrance.
     rear=[pg(left,-15.2,2),pg(right,-15.2,2),
           pg(right,-15.2,10.8),pg(left,-15.2,11.7)]
     addloft([rear,[v+toward*2.3 for v in rear]],2)
     interiorOpenGalleries+=1
    # Occupied-feeling, actual ground-level retail and transit counters.
    # The prior underground z=-8 stalls have all been REMOVED here.
    # Distinct asymmetric counters / canopies, not cloned skyscrapers.
    marketBays=0
    retailBaseZ=2.15
    for k,(x,y,wide) in enumerate(((-6.1,-9.0,2.3),
                                   (.9,-11.5,3.1),
                                   (7.2,-7.9,2.0))):
     h=2.7+(k%2)*1.4
     slab(pg(x,y,retailBaseZ+h),(lat,toward),(wide,2.15),h,3 if k!=1 else 4)
     # Real rear display wall, separated per stall. Neighbor bays
     # retain >1m open walk-in gaps instead of a giant blank facade.
     rear=[pg(x-wide,y-2.0,retailBaseZ),
           pg(x+wide,y-2.0,retailBaseZ),
           pg(x+wide,y-2.0,retailBaseZ+7.0+1.1*k),
           pg(x-wide,y-2.0,retailBaseZ+7.0+1.1*k)]
     addloft([rear,[v-toward*.8 for v in rear]],4 if k%2 else 2)
     if k!=1:
      awning=[pg(x-wide-.9,y+2.6,retailBaseZ+7.2),
              pg(x+wide+.9,y+2.6,retailBaseZ+7.2),
              pg(x+wide+.7,y-1.7,retailBaseZ+9.6+index),
              pg(x-wide-.7,y-1.7,retailBaseZ+9.6+index)]
      addloft([[v-up*1.15 for v in awning],awning],1 if k==0 else 4)
     marketBays+=1
    # An unmistakable side-mounted wayfinding fin, in scale with a
    # public interchange, NOT a floating bridge or central banner.
    wayX=-22.1 if index==0 else 21.8
    sign=[pg(wayX-1.6,8.0,2.0),pg(wayX+1.6,8.0,2.0),
          pg(wayX+1.6,8.0,21.0+index*3.0),
          pg(wayX-1.6,8.0,21.0+index*3.0)]
    addloft([sign,[v-toward*2.1 for v in sign]],3)
    # Station's four broad stair/platform tiers lead up to the side
    # galleries; only a candidate, WALKABILITY UNVERIFIED in Minecraft.
    for j in range(4):
     xx=(-16.6 if index==0 else 15.8)
     raised=2.0+.73*j
     slab(pg(xx,7.5-3.1*j,raised),(lat,toward),
         (3.1,2.7),.8,1 if j%2 else 0)
    # Index1 botanical exchange has real shallow green planter beds
    # integrated into the upper civic gallery, never used for track
    # occlusion or physics collision.
    landscapeModules=0
    if index==1:
     for x,y,z in ((-18,-8.1,5.9),(18,-3.0,6.1),(17,8.1,4.9)):
      slab(pg(x,y,z),(lat,toward),(2.5,3.5),1.1,4)
      landscapeModules+=1
    else:
     # Index0 transport market has contrasting side ticket canopies.
     for x,y in ((-17.4,7.3),(17.6,5.2)):
      canopy=[pg(x-3.2,y-2.8,8.0),pg(x+3.2,y-2.8,8.7),
              pg(x+2.5,y+2.8,10.2),pg(x-2.5,y+2.8,9.0)]
      addloft([[v-up*1.0 for v in canopy],canopy],3)
    # Verifiable positional contract: all storefront bases are ABOVE
    # the measured source-road edge reference plane, NOT underground.
    assert retailBaseZ>1.8 and interiorOpenGalleries==2 and marketBays==3
  actualNearby=[local_inverse.inverted()@Vector(v) for v in vertices[startNearby:]]
  actualWorld=[Vector((q.x,q.z,-q.y)) for q in actualNearby]
  actualWorld.extend(nativeWorld)
  sampledPixels=[projection(realShot,q) for q in actualWorld]
  sampledPixels=[q for q in sampledPixels if q is not None]
  pixelBox=[(min(q[0] for q in sampledPixels)+1)*1013/2,
            (max(q[0] for q in sampledPixels)+1)*1013/2,
            (1-max(q[1] for q in sampledPixels))*698/2,
            (1-min(q[1] for q in sampledPixels))*698/2]
  visibleArea=max(0,min(1013,pixelBox[1])-max(0,pixelBox[0]))*max(0,min(698,pixelBox[3])-max(0,pixelBox[2]))
  assert visibleArea>3000,(mode,index,pixelBox,visibleArea)
  # Geometry is visible in a VIEW FRUSTUM, not an actual pixel-mask
  # guarantee. The renderer will independently capture true screenshots.
  roadsideFacilities.append({
   "nativeOriginalRoad1U":roadU,
   "roadEdgeSide":"left",
   "offsetFromOriginalRoadEdgeM":35,
   "sourceNativeCameraTick":nativeTick,
   "cameraDerivedPublicEntrance":True,
   "noncollidingArt":True,"actualTerrainContact":"NOT_VERIFIED",
   "staticSourceB48TriangleIntersections":"NOT_VERIFIED",
   "humanAccess":"NOT_VERIFIED","B51PixelOcclusion":"NOT_VERIFIED",
   "originalCameraProjectedVertexBBoxPixels":pixelBox,
   "projectedFrustumRectangleAreaPixels":visibleArea,
   "actualReal3DNewVertexCount":len(vertices)-startNearby+nativeCount,
   "nativeBlenderPartCount":len(nativeParts),
   "roofPostGapMaxM":nativeSupportError if index==0 else None,
   "buildingMethod":"NATIVE_BLENDER_SUPPORTS" if index==0 else "PRESERVED_R2F5B_CONTROL",
   "realCourtyardCount":1,"inhabitedWingCount":2,
   "interiorOpenGalleries":interiorOpenGalleries,
   "visibleRearMarketBays":marketBays,
   "marketCountersAboveRoadEdgeReference":retailBaseZ>1.8,
   "marketCounterBaseHeightAboveRoadEdgeM":retailBaseZ,
   "streetConcourseReferenceHeightAboveRoadEdgeM":1.8,
   "centralUnroofedWalkwayWidthM":18,
   "distinctTransitAndMarketVenueKind":venueKind,
   "actualHumanWalkabilityAndLandSupport":"NOT_VERIFIED",
   "fullWidthOverEntranceRoofPresent":False,
   "entranceSightlineWidthM":18,
   "interiorPublicAccessCertified":False,
   "sourceWorldCentreXYZ":[roadsideCentre.x,roadsideCentre.z,-roadsideCentre.y]})
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
 if nativeParts:
  bpy.ops.object.select_all(action="DESELECT")
  obj.select_set(True)
  for part in nativeParts:part.select_set(True)
  bpy.context.view_layer.objects.active=obj
  bpy.ops.object.join()
  mesh=obj.data
  assert mesh.color_attributes.get("COLOR_0")
  assert len([o for o in bpy.context.scene.objects if o.type=="MESH"])==5
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
   "roadsidePublicFacilities":roadsideFacilities,
   "heroOpenSkySlots":heroSkySlots,"publicStairMasses":publicStairTiers,
   "civicGroundRealVolumeModules":civicGroundModules,
   "civicUrbanRibButtresses":civicButtressVolumes,
   "distinctMonolithicInhabitedWings":inhabitedPrimaryVolumes,
   "trueOriginalCameraPublicEntranceAzimuthRad":cameraEntranceAzimuthRad if index<3 else None,
   "heroGeometryMode":"CAMERA_ORIENTED_TRUE_OPEN_PIAZZA" if heroSkySlots else "PRESERVED_ROAD0",

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
assert [len(x["roadsidePublicFacilities"]) for x in reports]==[1,1,0,0,0]
assert [x["publicStairMasses"] for x in reports]==[4,4,4,0,0]
assert [x["civicGroundRealVolumeModules"] for x in reports[:3]]==[4,4,4]
assert [x["civicUrbanRibButtresses"] for x in reports[:3]]==[2,2,2]
assert all(x["civicGroundRealVolumeModules"]==0 for x in reports[3:])
assert [x["distinctMonolithicInhabitedWings"] for x in reports]==[3,3,3,0,0]
assert all(math.isfinite(x["trueOriginalCameraPublicEntranceAzimuthRad"]) for x in reports[:3])
bpy.ops.wm.save_as_mainfile(filepath=blend)
bpy.ops.export_scene.gltf(filepath=out,export_format="GLB",use_selection=False)
assert os.stat(out).st_size>100000
report={"schema":"dopagaki.r19a6p4r2f5b-connected-street-urban-district/1",
 "mode":mode,"originalSourceBlob":roads["sourceBlob"],"sourceStreetHumanAccessVerified":False,
 "source_glb_sha256":sha(src),"edited_glb_sha256":sha(out),
 "blend_sha256":sha(blend),"source_anchors_sha256":sha(anchor),
 "archived_A1_12_camera_sha256":sha(cameras),
 "source_faces":source_faces,"edited_faces":new_faces,"added_faces":new_faces-source_faces,
 "editable_districts":5,"districts":reports,"vertices":num_vertices,
 "new_colliders":0,"globalB48B51ClearanceVerified":False,"terrainSupportGate":"HOLD",
 "humanArchitecturalAccess":"NOT_VERIFIED","actualTerrainContactVerified":False,
 "PBR_game":"NOT_IMPLEMENTED","Blender":bpy.app.version_string,
 "architecturalLanguage":"R2F5B_ACTUAL_NATIVE_SUPPORT_ARCHITECTURE",
 "designRevision":"R2F5B_ONE_NATIVE_SUPPORTED_MARKET_ART_HOLD",
 "cameraProjectionOnlyNotActualB51RasterMask":True,
 "officialSlope2Metres":0,"ART":"HOLD","HUMAN":"HOLD","GAMEPLAY":"HOLD","PERFORMANCE":"HOLD",
 "RELEASE":"HOLD","MERGE":"HOLD"}
with open(rep,"w",encoding="utf8") as f:json.dump(report,f,ensure_ascii=False,indent=2)
print("R19_A6P4_ACTUAL_BLENDER_OPEN_ATRIUM_CITY_SOURCE_CAMERA",json.dumps({
 "mode":mode,"realBlender":report["Blender"],"faces":new_faces,"districts":5,
 "architecturalPrograms":sum(len(x["programmedReal3DVolumes"]) for x in reports),
 "ART":"HOLD","B51Raster":"NOT_MEASURED"}))
