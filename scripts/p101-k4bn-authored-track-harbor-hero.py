"""K4BN — source-road-calibrated custom UV+PBR maritime hero, DCC research only.

Not another primitive skyline. Uses substantial authored parametric mesh sections,
true per-face UVs, physically coherent layered materials, road-surface granular
microstructure and deliberately composed near/mid/far art. No game integration.

Source B48 Road5 mesh, all 6 cameras, all original B51 movers and physics remain
unmodified; art-only DCC shaders and editable research meshes are unapproved.
"""
import bpy,sys,os,json,hashlib,struct,math,random
from math import sin,cos,pi
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:]
def flag(x):return os.path.abspath(args[args.index(x)+1])
base=flag('--base');outdir=flag('--out')
os.makedirs(outdir,exist_ok=True)
def sha(p):
 h=hashlib.sha256()
 with open(p,'rb') as f:
  for a in iter(lambda:f.read(1<<20),b''):h.update(a)
 return h.hexdigest()
PARENT_SHA="7297b0ea17ffacb7f2c84cecf901947ce11de4e0a91ff4c93703f43cbe7b4a80"
assert sha(base)==PARENT_SHA
bpy.ops.wm.open_mainfile(filepath=base)
scene=bpy.context.scene
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
cams={};src={};rc={};other={}
for name,tick in (("control",11307),("ultra",11341)):
 a=[o for o in rig.objects if o.type=="CAMERA" and str(tick) in o.name]
 assert len(a)==1
 cams[name]=a[0]
 c=bpy.data.collections["K4AY SOURCE B48 | "+name.upper()+" | TRUE TESSELLATED ROAD5"]
 assert len(c.objects)==1
 rc[name]=c;src[name]=next(iter(c.objects))
 other[name]=bpy.data.collections["K4BC v2 | TRUE ORIGINAL SOURCE OTHER SIX B48 | "+name.upper()]
 assert len(other[name].objects)==6
def fp(obj):
 h=hashlib.sha256()
 for v in obj.data.vertices:
  h.update(struct.pack('<3d',*[float(x) for x in v.co]))
 for face in obj.data.polygons:
  h.update(struct.pack('<3i',*[int(v) for v in face.vertices]))
 return h.hexdigest()
fp0={n:fp(o) for n,o in src.items()}
assert set(fp0.values())=={"f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"}
cam0={n:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens)) for n,o in cams.items()}
C=cams['control'].location.copy()
look=cams['control'].matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((look.x,look.y,0)).normalized()
S=Vector((-F.y,F.x,0))
def P(d,s,z):return C+F*d+S*s+Vector((0,0,z))
obj=src['control']; inv=obj.matrix_world.inverted()
def ray(d,s):
 orig=inv@P(d,s,600)
 direct=(inv.to_3x3()@Vector((0,0,-1))).normalized()
 valid,local,n,face=obj.ray_cast(orig,direct,distance=1500)
 if not valid:return None
 pt=obj.matrix_world@local
 return (float(pt.z-C.z),int(face))
survey=[]
for dd in (-25,0,25,50,75,100,125,150,170):
 hits=[s for s in range(-70,111,2) if ray(dd,s) is not None]
 assert len(hits)>=35,(dd,hits)
 lo=min(hits);hi=max(hits)
 assert -50<lo<-20 and 40<hi<90,(dd,lo,hi)
 assert ray(dd,lo+5) is not None and ray(dd,hi-5) is not None
 survey.append(dict(d=dd,left=lo,right=hi,lz=ray(dd,lo+5)[0],rz=ray(dd,hi-5)[0],count=len(hits)))
def it(d,key):
 if d<=survey[0]['d']:return survey[0][key]
 if d>=survey[-1]['d']:return survey[-1][key]
 for a,b in zip(survey,survey[1:]):
  if a['d']<=d<=b['d']:
   t=(d-a['d'])/(b['d']-a['d'])
   return a[key]*(1-t)+b[key]*t
def boundary(d,side):return it(d,'left' if side<0 else 'right')
def height(d,side):return it(d,'lz' if side<0 else 'rz')
oldhidden=[]
for c in bpy.data.collections:
 if c.name.startswith(("K4BL |","K4BK |","K4BJ |","K4BI |","K4BH |")):
  assert c!=rig and c not in rc.values() and c not in other.values()
  c.hide_render=True;oldhidden.append(c.name)
def collection(name):
 c=bpy.data.collections.new("K4BN | "+name)
 scene.collection.children.link(c);return c
roadart=collection("01 manually constructed PBR road surface DCC")
cliffs=collection("02 fractured geological coastal slopes")
west=collection("03 West library carved atrium")
east=collection("04 East passenger terminal fan structure")
city=collection("05 distant functioning dock structures")
elements=collection("06 human scale details and typography")
lights=collection("07 practical public light sources")
made=[]
def mat(name,col,rough=.55,metal=0,em=0):
 m=bpy.data.materials.new("K4BN | "+name)
 m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF')
 bs.inputs['Base Color'].default_value=(*col,1)
 bs.inputs['Roughness'].default_value=rough
 bs.inputs['Metallic'].default_value=metal
 if em:
  bs.inputs['Emission Color'].default_value=(*col,1)
  bs.inputs['Emission Strength'].default_value=em
 return m
dark=mat("deep graphite stone marine foundation",(.030,.039,.041),.88,.07)
pale=mat("warm fired ceramic structural hull",(.58,.52,.42),.53,.08)
redstone=mat("salmon sandstone colored exposed geologic seam",(.29,.18,.13),.9,.03)
steel=mat("brushed gunmetal skeleton",(.18,.23,.23),.38,.73)
brass=mat("warmer copper edge fin",(.49,.31,.15),.32,.67)
glass=mat("smoky steel blue glazed research lobby",(.018,.13,.18),.20,.46)
void=mat("deep excavated actual shadow cavity",(.005,.013,.019),.81,.01)
lit=mat("habitable amber civic rooms",(.7,.30,.105),.45,.03,1.3)
green=mat("fired verdigris waterline canopy",(.07,.18,.14),.53,.58)
sand=mat("hand-cut coastal granite paving",(.28,.28,.26),.82,.04)
pine=mat("maritime evergreen",(.06,.16,.10),.94,.02)
bark=mat("rifted wind-worn pine bark",(.15,.087,.047),.95,.01)
sea=mat("wave-streak blue grey water",(.013,.075,.094),.18,.16)
ochre=mat("ceramic saffron information panels",(.65,.39,.13),.64,.08)
emissive=mat("diffused warm carved lintel",(.96,.66,.35),.35,.03,.85)

def mesh(name,v,faces,material,coll,role,smooth=False,uv=True):
 data=bpy.data.meshes.new("K4BN / "+name+" / unique author mesh")
 data.from_pydata([tuple(x) for x in v],[],faces)
 data.update(calc_edges=True)
 obj=bpy.data.objects.new("K4BN / "+name,data)
 coll.objects.link(obj);data.materials.append(material)
 obj['K4BN_ART']="UNJUDGED_HOLD"
 obj['K4BN_DCC_ONLY']=True
 obj['K4BN_GAME_COLLIDER']=False
 obj['K4BN_PRESERVE_ORIGINAL_B48']=True
 obj['ARCHITECTURAL_INTENT']=role
 for f in data.polygons:f.use_smooth=smooth
 if uv:
  layer=data.uv_layers.new(name="K4BN_PHYSICAL_UV_EDITABLE")
  for poly in data.polygons:
   n=len(poly.loop_indices)
   for k,loop_idx in enumerate(poly.loop_indices):
    vi=data.loops[loop_idx].vertex_index
    world=obj.matrix_world@data.vertices[vi].co
    # 1 texture repeat / 3m horizontal, 2m vertical; physical point,
    # not auto-UV generated random colors.
    rel=world-C
    ux=float(rel.dot(F))/3.5
    uy=float((rel.dot(S)+rel.z*.3))/3.5
    layer.data[loop_idx].uv=(ux,uy)
 made.append(obj)
 return obj
def loft(name,rows,material,coll,role,smooth=True):
 n=len(rows[0]);assert n>=3 and len(rows)>1
 assert all(len(row)==n for row in rows)
 v=[p for row in rows for p in row]
 faces=[(i*n+j,(i+1)*n+j,(i+1)*n+(j+1)%n,i*n+(j+1)%n)
        for i in range(len(rows)-1) for j in range(n)]
 faces.extend([tuple(range(n-1,-1,-1)),tuple((len(rows)-1)*n+j for j in range(n))])
 return mesh(name,v,faces,material,coll,role,smooth)
def tube(name,pts,radius,ma,col,role,ns=8):
 pts=[Vector(v) for v in pts];assert len(pts)>1
 rows=[]
 for i,p in enumerate(pts):
  axis=(pts[min(i+1,len(pts)-1)]-pts[max(i-1,0)]).normalized()
  reference=Vector((0,0,1))
  if abs(axis.dot(reference))>.9:reference=Vector((1,0,0))
  u=axis.cross(reference).normalized();w=axis.cross(u).normalized()
  rows.append([p+radius*(cos(2*pi*k/ns)*u+sin(2*pi*k/ns)*w) for k in range(ns)])
 return loft(name,rows,ma,col,role)
def box(name,d0,d1,s0,s1,z0,z1,ma,col,role):
 return loft(name,[[P(d,s,z) for s,z in
            ((s0,z0),(s1,z0),(s1,z1),(s0,z1))]
            for d in (d0,d1)],ma,col,role,False)



# K4BN: Hide only the K4BM rejected FAR skyline. Keep the existing editable
# UV/PBR K4BM near-camera structures and road, i.e., no pointless duplication
# of hundreds of unaccepted box meshes.
old_far=bpy.data.collections["K4BM | 05 distant functioning dock structures"]
old_far.hide_render=True
oldhidden.append(old_far.name)

# ORIGINAL editorial racing identity authored as non-collision paint alpha.
# Image packed inside native editable Blender original; previous Road5
# micro-surface, original vertex/face fingerprint and physics are preserved.
atlas=flag('--atlas')
atlas_sha=sha(atlas)
image=bpy.data.images.load(atlas,check_existing=False)
image.name="K4BN / ORIGINAL HYPER RUSH / QUAY05 PAINTED SURFACE"
image.pack()
for obj in src.values():
 material=obj.data.materials[0]
 assert material.use_nodes and "K4BM" in material.name
 nodes=material.node_tree.nodes
 links=material.node_tree.links
 bs=nodes.get("Principled BSDF")
 assert bs is not None and len(bs.inputs["Base Color"].links)==1
 original=bs.inputs["Base Color"].links[0].from_socket
 geo=nodes.new("ShaderNodeNewGeometry")
 def projected(axis,offset,range_m):
  product=nodes.new("ShaderNodeVectorMath")
  product.operation="DOT_PRODUCT"
  links.new(geo.outputs["Position"],product.inputs[0])
  product.inputs[1].default_value=tuple(axis)
  sub=nodes.new("ShaderNodeMath")
  sub.operation="SUBTRACT"
  links.new(product.outputs["Value"],sub.inputs[0])
  sub.inputs[1].default_value=float(axis.dot(C))
  add=nodes.new("ShaderNodeMath")
  add.operation="ADD"
  links.new(sub.outputs[0],add.inputs[0])
  add.inputs[1].default_value=float(offset)
  div=nodes.new("ShaderNodeMath")
  div.operation="DIVIDE"
  links.new(add.outputs[0],div.inputs[0])
  div.inputs[1].default_value=float(range_m)
  return div.outputs[0]
 uv=nodes.new("ShaderNodeCombineXYZ")
 links.new(projected(S,60,150),uv.inputs["X"])
 links.new(projected(F,65,275),uv.inputs["Y"])
 tex=nodes.new("ShaderNodeTexImage")
 tex.image=image
 tex.extension="CLIP"
 tex.interpolation="Linear"
 links.new(uv.outputs[0],tex.inputs["Vector"])
 mix=nodes.new("ShaderNodeMixRGB")
 mix.blend_type="MIX"
 links.new(tex.outputs["Alpha"],mix.inputs[0])
 links.new(original,mix.inputs[1])
 links.new(tex.outputs["Color"],mix.inputs[2])
 links.new(mix.outputs[0],bs.inputs["Base Color"])

# The actual authentic Road5 end is at forward ≈188.8m. Beyond it we are
# strictly producing NON-DRIVEABLE 3D coastal skyline research.
race_col=collection("08 road edge signature language")
port_col=collection("09 working container ferry original hero")
crane_col=collection("10 open truss cargo cranes and sea")
ridge_col=collection("11 distant coastal stratified town")
navy=mat("naval blue double-chine hull",(.021,.047,.065),.36,.26)
marine=mat("maritime ceramic white",(.57,.59,.55),.47,.12)
vesselglass=mat("deep functional wheelhouse glazing",(.010,.037,.06),.25,.36)
deck=mat("ship habitable deck plating",(.24,.28,.27),.72,.23)
redcargo=mat("oxidized port container paint",(.37,.16,.10),.77,.15)
tealcargo=mat("teal maritime container paint",(.08,.29,.29),.69,.15)
cargo_yellow=mat("maritime crane muted saffron",(.63,.38,.12),.52,.56)
hazard=mat("legible low glare safety orange",(.93,.52,.16),.32,.09,1.5)
aqua=mat("race edge sea cyan",(.058,.58,.56),.29,.15,1.1)
coastal=mat("natural shoreline grey-green slate",(.10,.13,.14),.88,.03)
coastal_far=mat("distant blue atmospheric granite",(.17,.23,.24),.92,.02)
tidal=mat("sea water deep ink blue",(.025,.085,.12),.27,.11)

# Source road-edge anchor. All dimensions measured on real source B48 mesh:
# do not repeat the infamous ±157m site error.
for side,label in ((-1,"WEST"),(1,"EAST")):
 for j,(aa,bb) in enumerate([(-22,0),(2,28),(30,55),(57,84),
                            (86,111),(113,140),(142,169)]):
  rows=[]
  for dd in range(aa,bb+1,2):
   ss=boundary(dd,side)+side*4.3
   h=height(dd,side)
   rows.append([P(dd,ss,h-.9),
                P(dd,ss+side*3,h-1.4),
                P(dd,ss+side*3,h+1.05),
                P(dd,ss,h+.8)])
  loft(label+" road-scale sculpted true-source curb "+str(j),
       rows,coastal,race_col,"SOURCE_ROAD_EDGE_ONLY_NOT_GAME_COLLIDER",False)
  pts=[P(dd,boundary(dd,side)+side*6.7,height(dd,side)+1.15)
       for dd in range(aa,bb+1,4)]
  tube(label+" emerald and amber inlaid wayfinding rail "+str(j),
       pts,.18,aqua if j%3 else hazard,race_col,
       "RESEARCH_PUBLIC_LIGHT_NO_COLLISION")
  if j in (1,3,5):
   d=(aa+bb)/2
   s=boundary(d,side)+side*5.5
   z=height(d,side)
   box(label+" hand cast directional safety plaque "+str(j),
       d-1,d+1,s,s+side*1.7,z+.6,z+1.8,
       cargo_yellow,race_col,"GENUINE_RACE_COURSE_FURNITURE_DCC")

# Architectural hero is now a long visibly used FERRY-CARGO SHIP, not
# two giant model cylinders or a generic skybridge that crosses the road.
water_level=min(height(170,-1),height(170,1))-23
ship_s=22
ship_profiles=[]
for dd in (211,225,246,277,310,332):
 t=(dd-211)/(332-211)
 halfwidth=16*(.55+.43*sin(pi*t))
 z0=water_level+.8
 z1=water_level+13+2*sin(pi*t)
 ship_profiles.append([P(dd,ship_s-halfwidth,z0),
                       P(dd,ship_s+halfwidth,z0),
                       P(dd,ship_s+halfwidth*.78,z1),
                       P(dd,ship_s-halfwidth*.78,z1)])
loft("VESSEL single author shaped double-chine steel ship hull",
     ship_profiles,navy,port_col,"BEYOND_B48_REAL_CARGO_SHIP_NOT_DRIVEABLE")
box("VESSEL one original deck double hull",222,316,ship_s-18,ship_s+18,
    water_level+12,water_level+14,deck,port_col,"OCEAN_VESSEL_REAL_DECK")
box("VESSEL elevated inhabited working wheelhouse",254,295,
    ship_s-13,ship_s+13,water_level+25,water_level+37,
    vesselglass,port_col,"CREW_NAVIGATION_GLAZING")
box("VESSEL sculpted compact white ceramic bridge canopy",252,299,
    ship_s-15,ship_s+15,water_level+36,water_level+42,
    marine,port_col,"REAL_SHIP_BRIDGE")
for h in [water_level+26,water_level+38]:
 tube("VESSEL fabricated full-width deck rail "+str(h),
      [P(d,ship_s+15,h) for d in (251,262,284,299)],
      .3,steel,port_col,"WORKING_CREW_DECK")
for i,(d0,s0,col) in enumerate([(230,-13,redcargo),(250,-13,tealcargo),
                                (270,-13,marine),(233,6,tealcargo),
                                (258,6,redcargo),(278,6,marine)]):
 s0+=ship_s
 box("VESSEL genuine stacked ISO container no "+str(i),
     d0,d0+16,s0,s0+10,water_level+14,water_level+24,
     col,port_col,"TRUE_CONTAINER_VESSEL_STORAGE")
 for k in range(1,8):
  d=d0+2*k
  tube("VESSEL corrugated structural channel "+str(i)+"_"+str(k),
       [P(d,s0+10.15,water_level+14.3),P(d,s0+10.15,water_level+23.6)],
       .13,steel,port_col,"3D_CORRUGATED_CONTAINER_FACE")

tube("VESSEL navigation communications antenna",
     [P(283,ship_s-8,water_level+42),
      P(282,ship_s-5,water_level+62)],
     .9,marine,port_col,"WORKING_RADIO_MAST")
for sg in (-1,1):
 tube("VESSEL maritime stay cable "+str(sg),
      [P(282,ship_s-5,water_level+62),
       P(302,ship_s+sg*16,water_level+16)],
      .18,steel,port_col,"NAVAL_TENSION_RIGGING")

# True triangulated port gantry: visible air passes through load-bearing legs.
# Detail authored as separate editable 3D members; no new game collider.
def port_crane(name,d,s,height_m,halfwidth,col):
 z=water_level-2
 for side in (-1,1):
  for depth in (-1,1):
   tube(name+" open-frame leg "+str(side)+"_"+str(depth),
        [P(d+depth*8,s+side*(halfwidth+5),z),
         P(d+depth*4,s+side*halfwidth,z+height_m*.53),
         P(d+depth*2,s+side*halfwidth*.55,z+height_m)],
        .75,col,crane_col,"ACTUAL_OPEN_TRUSS_CRANE")
 for q in (.29,.56,.87):
  for side in (-1,1):
   tube(name+" diagonal truss cross-brace "+str(q)+"_"+str(side),
        [P(d-5,s-side*halfwidth,z+height_m*q),
         P(d+4,s+side*halfwidth,z+height_m*q),
         P(d-5,s+side*halfwidth,z+height_m*q)],
        .38,steel,crane_col,"STRESSED_OPEN_METAL_BRACING")
 tube(name+" articulated loading jib",
      [P(d,s-halfwidth*.8,z+height_m),
       P(d+27,s-halfwidth*1.5,z+height_m+14),
       P(d+55,s-halfwidth*1.7,z+height_m+9)],
      1.0,col,crane_col,"VISIBLE_FUNCTIONAL_DOCK_CRANE")
 tube(name+" real shipping hoist cable",
      [P(d+44,s-halfwidth*1.7,z+height_m+9),
       P(d+44,s-halfwidth*1.7,z+12)],
      .2,steel,crane_col,"ACTIVE_HARBOR_CRANE")
 box(name+" realistic navigation beacon",d-1,d+1,
     s-halfwidth,s-halfwidth+1,z+height_m+2,z+height_m+4,
     hazard,crane_col,"VISIBLE_OPERATIONAL_WARNING")
port_crane("EAST WORKING QUAY 04",225,118,78,13,cargo_yellow)
port_crane("WEST DOCK 03",276,-125,66,10,steel)

# Thin full-depth environmental coastline behind port operations, not a
# generic opaque full-frame wall and not a fake extension of Road5.
for side,label in ((-1,"west"),(1,"east")):
 for band in (0,1):
  rows=[]
  for dd in (193,215,241,278,329,390,465,550,655):
   shore=side*(82+band*92+12*sin(dd*.015+side))
   far_s=shore+side*(46+band*42)
   z=height(170,side)-8+12*sin(dd*.026+band)
   rows.append([P(dd,shore,water_level-22),
                P(dd,far_s,water_level-30),
                P(dd,far_s,z+6+band*10),
                P(dd,shore,z)])
  loft(label+" real coastline sedimentary parallax "+str(band),
       rows,coastal if band==0 else coastal_far,
       ridge_col,"NONRIDEABLE_TIDAL_TERRAIN")
mesh("actual sea plane beyond Road5 road source limit",
    [P(196,-1000,water_level),P(1400,-1000,water_level),
     P(1400,1200,water_level),P(196,1200,water_level)],
    [(0,1,2,3)],tidal,ridge_col,"OPEN_OCEAN_NOT_GAME_COLLIDER")

# The parent K4BM near-camera UV research meshes remain editable and visible.
# Remove only the parent DCC test typography that was cropped by the camera.
for ob in bpy.data.objects:
 if ob.type=="FONT" and ob.name.startswith("K4BM /"):
  ob.hide_render=True

# Atmospheric art balance: leave original immutable camera, single raking
# broad sun, physically plausible exposed public interior lighting.
world=scene.world;world.use_nodes=True
for n in world.node_tree.nodes:
 if n.type=='TEX_SKY':
  n.sky_type='NISHITA'
  n.sun_elevation=math.radians(8.7)
  n.sun_rotation=math.radians(240)
 if n.type=='BACKGROUND':n.inputs['Strength'].default_value=.36
for o in bpy.data.objects:
 if o.type=='LIGHT':o.hide_render=True
sun=bpy.data.lights.new('K4BN softened strong directional sea light','SUN')
sun.energy=2.7;sun.angle=math.radians(7.2)
so=bpy.data.objects.new('K4BN / visible sun gobo raking illumination',sun)
lights.objects.link(so)
so.rotation_euler=tuple(math.radians(q) for q in (31,-31,150))
for name,dd,side,zh in [('library',78,-1,21),('archive',140,-1,20),
                        ('ferry',84,1,21),('concourse',131,1,20)]:
 l=bpy.data.lights.new('K4BN / '+name+' actual task area light','AREA')
 l.energy=7600;l.color=(1,.78,.54);l.shape='RECTANGLE'
 l.size=15;l.size_y=7
 ob=bpy.data.objects.new('K4BN / '+name+' lighting fixture',l)
 lights.objects.link(ob)
 ob.location=P(dd,boundary(dd,side)+side*22,height(dd,side)+zh)

scene.render.engine="BLENDER_EEVEE"
if hasattr(scene,'eevee'):
 for key,v in (('taa_render_samples',128),('use_gtao',True),('gtao_distance',4.0),
               ('gtao_factor',1.18),('use_soft_shadows',True)):
  if hasattr(scene.eevee,key):setattr(scene.eevee,key,v)
scene.render.resolution_x=1440
scene.render.resolution_y=900
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
try:scene.view_settings.view_transform='Filmic'
except Exception:pass
try:scene.view_settings.look='Medium High Contrast'
except Exception:pass
scene.view_settings.exposure=-.24
assert fp0=={m:fp(obj) for m,obj in src.items()}
assert cam0=={m:(tuple(obj.location),tuple(obj.rotation_euler),float(obj.data.lens)) for m,obj in cams.items()}
def show(mode):
 for m,c in rc.items():c.hide_render=m!=mode
 for obj in src.values():obj.hide_render=False
 for m,c in other.items():c.hide_render=m!=mode
 for c in bpy.data.collections:
  if 'K4AY SOURCE B51 OBB PROXIES' in c.name:c.hide_render=True
 bpy.context.view_layer.update()
shots=[]
for mode,tick in [('control',11307),('ultra',11341)]:
 show(mode);scene.camera=cams[mode]
 name='K4BN_'+mode.upper()+'_'+str(tick)+'_ACTUAL_SOURCE_CAMERA_UVPBR_ART_HOLD.png'
 scene.render.filepath=os.path.join(outdir,name)
 bpy.ops.render.render(write_still=True)
 shots.append({'mode':mode,'tick':tick,'file':name})
show('control');scene.camera=cams['control']
blend='K4BN_UV_PBR_AUTHOR_SCULPTED_EDITABLE_DCC_ART_HOLD.blend'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(outdir,blend))
files={}
for name in [blend]+[s['file'] for s in shots]:
 path=os.path.join(outdir,name);size=os.stat(path).st_size
 assert size>10000
 files[name]={'bytes':size,'sha256':sha(path)}
audit={
 'schema':'dopagaki.K4BN.track-painted-livery-and-functioning-harbor/1',
 'parentK4BMNativeBlenderSHA256':PARENT_SHA,
 'originalRacePaintAtlasSHA256':atlas_sha,
 'paintAtlasPackedInNativeBlender':True,
 'obsoleteK4BMDistantCityHiddenNotDeleted':True,
 'frozenSourceGameBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'originalRoad5VertexAndFaceFingerprintPreserved':fp0=={m:fp(obj) for m,obj in src.items()},
 'sourceCameraNumericPosesAndLensUnchanged':cam0=={m:(tuple(obj.location),tuple(obj.rotation_euler),float(obj.data.lens)) for m,obj in cams.items()},
 'realRoad5SectionsMeasured':survey,
 'originalB48Roads':7,'originalB51Movers':28,'originalPhysicsHz':240,'originalBallRadiusM':.65,
 'retainedPriorUnapprovedArtHiddenNotDeleted':oldhidden,
 'independentEditableResearchObjects':len(made),
 'nativeUVEditedResearchMeshes':sum(bool(o.type=='MESH' and o.data.uv_layers) for o in made),
 'originalFixedSourceCameraDCCImages':shots,
 'nativeRenderEngine':'BLENDER_EEVEE',
 'newPlayableGameCollisionMeshes':0,'gameSourceModified':False,'isGameWebGLFrame':False,
 'ART':'UNJUDGED_HOLD','formalArtAccepted':0,'formalSlope2DNAacceptedMetres':0,
 'B51_CLEARANCE':'HOLD','SAT':'HOLD','CCD':'HOLD','HUMAN':'HOLD','FPS':'HOLD',
 'RELEASE':'HOLD','MERGE':'HOLD','files':files
}
with open(os.path.join(outdir,'K4BN_ORIGINAL_CAMERA_UVPBR_PROVENANCE.json'),'w') as f:
 json.dump(audit,f,ensure_ascii=False,indent=2)
print("K4BN_REAL_ROAD_SOURCE_EDITABLE_UV_PBR_TECH_ART_UNJUDGED",json.dumps({
 'uv_meshes':audit['nativeUVEditedResearchMeshes'],'source_road_unchanged':audit['originalRoad5VertexAndFaceFingerprintPreserved'],
 'road_scales':survey}))
