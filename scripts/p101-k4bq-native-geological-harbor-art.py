"""K4BQ -- geologically designed living coastal racetrack original 3D study.

ACTUAL editable Blender object construction. Source B48 7 road meshes,
B51 28 movers, original six cameras, source game, collisions: NEVER EDITED.
The geometry here is an independent non-game research art scene under a
separate chase/original-pose cloned camera. Art not certified.

Prior K4BP hero D showed improvement in form but lacked actual geology,
fine asphalt, plants, believable inhabited harbor and coastal layers.
This builds one close-camera production-style pilot instead of new giant
boxes. It is still NOT a world-quality ART PASS until independently viewed.
"""
import bpy,os,sys,math,json,hashlib,struct,random
from math import sin,cos,pi
from mathutils import Vector
arg=sys.argv[sys.argv.index('--')+1:]
def option(name):return os.path.abspath(arg[arg.index(name)+1])
parent=option('--base');dst=option('--out')
os.makedirs(dst,exist_ok=True)
PARENT_SHA="93c3583655eeb48fa06d61239646bb470419c72bf84cd97235be2288240d26aa"
def checksum(fn):
 h=hashlib.sha256()
 with open(fn,'rb') as f:
  for b in iter(lambda:f.read(1<<20),b''):h.update(b)
 return h.hexdigest()
assert checksum(parent)==PARENT_SHA,"wrong frozen K4BP editable blend"
bpy.ops.wm.open_mainfile(filepath=parent)
scene=bpy.context.scene
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
original_camera_values={ob.name:(tuple(ob.location),tuple(ob.rotation_euler),float(ob.data.lens))
                        for ob in rig.objects if ob.type=='CAMERA'}
assert len(original_camera_values)>=6
cams={};roads={};other={}
for mode,tick in [('control',11307),('ultra',11341)]:
 a=[o for o in rig.objects if o.type=='CAMERA' and str(tick) in o.name]
 assert len(a)==1
 cams[mode]=a[0]
 col=bpy.data.collections['K4AY SOURCE B48 | '+mode.upper()+' | TRUE TESSELLATED ROAD5']
 assert len(col.objects)==1
 roads[mode]=next(iter(col.objects))
 six=bpy.data.collections['K4BC v2 | TRUE ORIGINAL SOURCE OTHER SIX B48 | '+mode.upper()]
 assert len(six.objects)==6
 other[mode]=six
def mesh_fp(ob):
 h=hashlib.sha256()
 for v in ob.data.vertices:
  h.update(struct.pack('<3d',*[float(q) for q in v.co]))
 for face in ob.data.polygons:
  h.update(struct.pack('<3i',*[int(q) for q in face.vertices]))
 return h.hexdigest()
fp_before={k:mesh_fp(o) for k,o in roads.items()}
assert set(fp_before.values())=={'f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2'}
C=cams['control'].location.copy()
direction=cams['control'].matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((direction.x,direction.y,0)).normalized()
S=Vector((-F.y,F.x,0))
def P(d,s,z):return C+F*d+S*s+Vector((0,0,z))
source=roads['control'];to_local=source.matrix_world.inverted()
def source_hit(d,s):
 p=to_local@P(d,s,580)
 v=(to_local.to_3x3()@Vector((0,0,-1))).normalized()
 hit,q,n,index=source.ray_cast(p,v,distance=1600)
 if not hit:return None
 w=source.matrix_world@q
 return float(w.z-C.z)
samples=[]
for d in range(-16,190,2):
 z=source_hit(d,0)
 if z is not None:samples.append((d,z))
assert len(samples)>65
def ground(d):
 hit=source_hit(d,0)
 if hit is not None:return hit
 if d<=samples[0][0]:return samples[0][1]
 if d>=samples[-1][0]:return samples[-1][1]
 for (d0,z0),(d1,z1) in zip(samples,samples[1:]):
  if d0<=d<=d1:return z0+(z1-z0)*(d-d0)/(d1-d0)
 raise AssertionError(d)

# All prior unsuccessful art preserved in original K4BP .blend,
# render-hidden in K4BQ pilot only. Research cameras are clones only.
hidden=[]
for c in bpy.data.collections:
 if c.name.startswith(('K4BM |','K4BN |','K4BO |','K4BL |',
                       'K4BP | 02','K4BP | 03','K4BP | 01')):
  c.hide_render=True;hidden.append(c.name)
for c in bpy.data.collections:
 if 'K4AY SOURCE B48' in c.name or 'K4BC v2 | TRUE ORIGINAL SOURCE OTHER SIX' in c.name:
  c.hide_render=True
 if 'K4AY SOURCE B51 OBB PROXIES' in c.name:c.hide_render=True
for obj in roads.values():obj.hide_render=True
def col(name):
 c=bpy.data.collections.new('K4BQ | '+name)
 scene.collection.children.link(c)
 return c
track=col('01 hand-authored narrow research racing track')
rocks=col('02 geologically fractured coastal escarpments')
botany=col('03 living maritime pines and dune vegetation')
quay=col('04 left open harbor and functional boardwalk')
center=col('05 curved human-scaled maritime interpretation pavilion')
vessels=col('06 working harbor service craft')
signals=col('07 racing safety and designed guide language')
horizon=col('08 layered far coastal city and sea')
lighting=col('09 architecturally coherent physical lighting')
created=[]
rng=random.Random(20261104)
def m(name,rgb,rough=.55,metal=0,emit=0):
 a=bpy.data.materials.new('K4BQ | '+name);a.use_nodes=True
 p=a.node_tree.nodes.get('Principled BSDF')
 p.inputs['Base Color'].default_value=(*rgb,1)
 p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal
 if emit:
  p.inputs['Emission Color'].default_value=(*rgb,1)
  p.inputs['Emission Strength'].default_value=emit
 return a
def pbr(name,c0,c1,nscale=.6,grain=9,bumpdist=.1,metal=.0):
 a=m(name,c0,.79,metal)
 nd=a.node_tree.nodes;lk=a.node_tree.links
 p=nd.get('Principled BSDF')
 t=nd.new('ShaderNodeTexNoise')
 t.inputs['Scale'].default_value=nscale
 t.inputs['Detail'].default_value=6
 t.inputs['Roughness'].default_value=.72
 mini=nd.new('ShaderNodeTexNoise')
 mini.inputs['Scale'].default_value=grain
 mini.inputs['Detail'].default_value=4.2
 ramp=nd.new('ShaderNodeValToRGB')
 ramp.color_ramp.elements[0].position=.17
 ramp.color_ramp.elements[0].color=(*c0,1)
 ramp.color_ramp.elements[1].position=.81
 ramp.color_ramp.elements[1].color=(*c1,1)
 lk.new(t.outputs['Fac'],ramp.inputs['Fac'])
 lk.new(ramp.outputs['Color'],p.inputs['Base Color'])
 b=nd.new('ShaderNodeBump')
 b.inputs['Strength'].default_value=.44
 b.inputs['Distance'].default_value=bumpdist
 lk.new(mini.outputs['Fac'],b.inputs['Height'])
 lk.new(b.outputs['Normal'],p.inputs['Normal'])
 return a
asphalt=pbr('hand-spec asphalt crushed basalt/damp tirepatina',
            (.012,.020,.024),(.086,.092,.084),.15,27,.018,.03)
strata=pbr('actual rugged layered green-grey coastal schist',
           (.042,.069,.070),(.26,.25,.20),.47,6,.45,.04)
stone=pbr('salt weathered slate path stone',(.15,.17,.17),(.35,.34,.28),1.1,18,.07,.04)
vegetation=pbr('bracken, coastal sedge, dune grass',
               (.032,.12,.063),(.23,.31,.16),.55,14,.08,.0)
needle=m('dark green pine cluster with shadowed needles',(.045,.115,.074),.92)
needle2=m('wind-bleached native coastal pine tips',(.13,.22,.13),.91)
bark=pbr('ridged native pine bark',(.070,.037,.021),(.21,.12,.062),2.2,16,.08)
skyline_mat=m('distance atmospheric blue stone',(.19,.25,.27),.87,.06)
water=m('true harbor sea dark glaucous teal',(.014,.080,.110),.23,.08)
copper=pbr('salt patinated copper folded roof',
           (.054,.13,.12),(.20,.34,.28),.9,8,.035,.65)
ceramic=pbr('architectural glazed travertine ivory',
            (.31,.31,.27),(.62,.60,.50),1.2,18,.04,.14)
titanium=m('bead blasted ferritic metal structural steel',(.12,.19,.20),.37,.72)
glass=m('deep unobstructed sapphire public windows',(.015,.068,.092),.19,.35)
interior=m('warm occupied waterfront interpretation hall',(.75,.35,.14),.46,.02,1.3)
brass=m('muted copper gold operational details',(.38,.26,.115),.35,.58)
cyan=m('restrained route luminous turquoise',(.09,.54,.48),.40,.13,.75)
amber=m('recessed amber safety marker',(.90,.52,.17),.41,.18,.65)
barrier=m('matt pale granite service apron',(.36,.37,.33),.69,.12)
dark=m('industrial dark shadow gap',(.009,.013,.020),.86)

def mesh(name,verts,faces,ma,collection,role,face_materials=None,smooth=False):
 me=bpy.data.meshes.new('K4BQ / '+name+' / native editable model')
 me.from_pydata([tuple(v) for v in verts],[],faces)
 me.update(calc_edges=True)
 obj=bpy.data.objects.new('K4BQ / '+name,me)
 collection.objects.link(obj)
 ma_list=ma if isinstance(ma,list) else [ma]
 for x in ma_list:me.materials.append(x)
 if face_materials:
  assert len(face_materials)==len(me.polygons)
  for f,ix in zip(me.polygons,face_materials):f.material_index=ix
 for poly in me.polygons:poly.use_smooth=smooth
 obj['ART']='UNASSESSED_HOLD'
 obj['DCC_RESEARCH_ONLY']=True
 obj['GAMEPLAY_COLLIDER_CREATED']=False
 obj['INTENDED_FUNCTION']=role
 created.append(obj)
 return obj
def loft(name,rows,ma,target,role):
 n=len(rows[0]);assert n>=3 and len(rows)>1 and all(len(x)==n for x in rows)
 verts=[p for row in rows for p in row]
 faces=[(i*n+j,(i+1)*n+j,(i+1)*n+(j+1)%n,i*n+(j+1)%n)
         for i in range(len(rows)-1) for j in range(n)]
 faces.extend([tuple(range(n-1,-1,-1)),tuple((len(rows)-1)*n+j for j in range(n))])
 return mesh(name,verts,faces,ma,target,role,smooth=True)
def segment(name,points,radius,ma,target,role,n=7):
 points=[Vector(p) for p in points]
 if len(points)<2:return None
 rows=[]
 for i,p in enumerate(points):
  a=points[min(i+1,len(points)-1)]-points[max(i-1,0)]
  if a.length<.001:continue
  dire=a.normalized();axis=Vector((0,0,1))
  if abs(dire.dot(axis))>.9:axis=Vector((1,0,0))
  u=dire.cross(axis).normalized()
  v=dire.cross(u).normalized()
  rows.append([p+radius*(u*cos(2*pi*k/n)+v*sin(2*pi*k/n)) for k in range(n)])
 if len(rows)>1:return loft(name,rows,ma,target,role)
def block(name,d0,d1,s0,s1,z0,z1,ma,target,role):
 return loft(name,[[P(d,s,z) for s,z in
             ((s0,z0),(s1,z0),(s1,z1),(s0,z1))] for d in (d0,d1)],
             ma,target,role)
def fractal(a,b,seed=0):
 return (sin(a*.17+b*.19+seed)*.55+
         sin(a*.063-b*.117+seed*1.7)*1.6+
         cos(a*.41-b*.35+seed*2.4)*.26+
         sin(a*.93+b*.78+seed*3.1)*.11)
def terrain_height(d,s):
 h=ground(d)
 v=max(0,(abs(s)-16.4)/75)
 n=fractal(d,s)
 if s>0:
  # East / south-facing native pines and terraced public escarpments
  return h+.3+9.5*v**.73+6.0*v*v+n*(.20+.82*v)
 # West is a real downward sea cut, not another symmetric huge grey wall.
 return h+.3-13.0*v**.8-3.8*v*v+n*(.2+.55*v)
# Road: actual source-Camera-scale narrow research chassis, not a
# physically approved substitute for B48. Multi-resolution rounded crown
# and a true asphalt material; no massive unreadable painted clipart.
road_rows=[]
for i in range(134):
 d=-16+1.53*i
 zz=ground(d)
 road_rows.append([P(d,s,zz+.54+.025*(1-(s/13.1)**2))
                   for s in (-16.5,-13.15,-9,0,9,13.15,16.5)])
roadverts=[p for r in road_rows for p in r]
roadfaces=[]
index=[]
n=7
for i in range(len(road_rows)-1):
 for j in range(n-1):
  roadfaces.append((i*n+j,(i+1)*n+j,(i+1)*n+j+1,i*n+j+1))
  index.append(1 if j in (0,n-2) else 0)
road_obj=mesh('physically variegated 26m curved material research test',
              roadverts,roadfaces,[asphalt,stone],track,
              'ART_ONLY_NEVER_ORIGINAL_DRIVEABLE_B48',index,True)
# Add physically believable twin fine markings, realistic patch surfaces
# in 3D geometry and contrast structure (no giant source road stencils).
stripverts=[];stripfaces=[]
for k,s0 in enumerate((-11.1,11.1)):
 rows=[]
 for d in range(-15,183,2):
  h=ground(d)+.575
  rows.append([P(d,s0-.12,h),P(d,s0+.12,h)])
 q0=len(stripverts)
 stripverts.extend(p for row in rows for p in row)
 for i in range(len(rows)-1):
  stripfaces.append((q0+i*2,q0+(i+1)*2,q0+(i+1)*2+1,q0+i*2+1))
mesh('thin physically laid reflective weathered edge paint',
     stripverts,stripfaces,barrier,track,
     'SIMPLE_LEGIBLE_SOURCE_SCALE_EDGE_MARKING')
# Actual geo-strata terrain with thousands of unique vertices. Instead of
# old flat smooth 4-point ramps, natural diagonal rivulets, rocky relief,
# distinct rocky outcrops, wet erosion and sparse living vegetation.
for side,label in [(-1,'WEST_OPEN_HARBOR'),(1,'EAST_SLOPING_HILLSIDE')]:
 distance=[16.4,19,22,25,28,32,36,40,44,49,54,61,69,78,88,100,114]
 v=[];faces=[];idx=[]
 for i in range(92):
  d=-19+2.3*i
  for s0 in distance:
   s=side*s0
   v.append(P(d,s,terrain_height(d,s)))
 for i in range(91):
  for j in range(len(distance)-1):
   n=len(distance)
   faces.append((i*n+j,(i+1)*n+j,(i+1)*n+j+1,i*n+j+1))
   # individual rock faces on steep wave-cut zones, grass on gentle upper
   # soil, without unsupported texture/image downloading.
   idx.append(0 if j in (0,1,2,7,8) or (i*13+j*17)%19<5 else 1)
 mesh(label+' authored subdivided eroded native coastal topography',
      v,faces,[strata,vegetation],rocks,'GEOLOGICAL_COHERENT_NON_GAME_ENVIRONMENT',idx,True)
 # Highly segmented lip made of hard granite and actual water run-offs.
 rows=[]
 for d in range(-15,189,2):
  h=ground(d)
  rows.append([P(d,side*16.4,h+.54),
               P(d,side*17.7,h+.15),
               P(d,side*19.2,h+.23),
               P(d,side*20.3,h+.95)])
 loft(label+' hand-hewn crenellated safety shoulder',
      rows,stone,rocks,'HUMAN_SCALE_GUARD_NO_GAME_COLLIDER')
# Batch 160 irregular physically meaningful lithology boulders in
# colored polyhedra, not 160 duplicate cylinders, sampled strictly offroad.
for side,label in [(-1,'WEST'),(1,'EAST')]:
 verts=[];faces=[];inds=[]
 for i in range(165):
  d=rng.uniform(-11,179)
  s=side*rng.uniform(22,104)
  h=terrain_height(d,s)
  rad=rng.uniform(.30,2.15)
  phase=rng.uniform(0,2*pi)
  n=9
  rings=[]
  for zz,rr in [(-rad*.15,rad*.8),(rad*.42,rad),(rad*1.25,rad*.34)]:
   rings.append([P(d+rad*rrad*cos(2*pi*k/n+phase),
                   s+rad*rrad*sin(2*pi*k/n+phase),
                   h+zz+rad*.13*sin(3*k+phase))
                 for k in range(n)
                 for rrad in [rr/rad]])
  k0=len(verts);verts.extend(p for ring in rings for p in ring)
  for j in range(2):
   for k in range(n):
    faces.append((k0+j*n+k,k0+(j+1)*n+k,
                  k0+(j+1)*n+(k+1)%n,k0+j*n+(k+1)%n))
    inds.append(0 if (i+j+k)%4 else 1)
 mesh(label+' natural fractured rock field / instanced geological shapes',
      verts,faces,[strata,stone],rocks,
      'SIMULATED_IRREGULAR_COASTAL_BOULDERS',inds)
# Green living vegetation with authored trunk and foliage geometry, not
# just flat green walls. Batched, camera-oriented irregular pyramids.
for side,label in [(-1,'WEST'),(1,'EAST')]:
 tv=[];tf=[];fv=[];ff=[];fidx=[]
 trees=0
 for i in range(72):
  d=rng.uniform(-8,170)
  s=side*rng.uniform(31,108)
  # Open occasional views to maritime harbor structures and road horizon.
  if 67<d<105 and 39<abs(s)<80:continue
  h=terrain_height(d,s)
  height=rng.uniform(4.5,11.5) if side>0 else rng.uniform(3,7.5)
  tilt=rng.uniform(-1.2,1.2)
  base=P(d,s,h)
  tip=P(d+tilt*.7,s+side*height*.05,h+height)
  # Tapered actual woody cylindrical trunk, branch networks in one mesh.
  def trunk_segment(a,b,r1,r2):
   n=6;direction=(b-a).normalized()
   cross=direction.cross(Vector((1,0,0))).normalized()
   cross2=direction.cross(cross).normalized()
   if cross.length<.001:return
   off=len(tv)
   for v0,radius in ((a,r1),(b,r2)):
    for k in range(n):
     ang=2*pi*k/n
     tv.append(v0+radius*(cross*cos(ang)+cross2*sin(ang)))
   for k in range(n):
    tf.append((off+k,off+(k+1)%n,off+n+(k+1)%n,off+n+k))
  trunk_segment(base,tip,.17*height/7,.045*height/7)
  for c in range(4):
   t=.33+c*.16
   origin=base.lerp(tip,t)
   direction=F*(.70+rng.random()*.8)+S*(side*(.5+rng.random()))+Vector((0,0,.3))
   branch_tip=origin+direction*height*.32
   trunk_segment(origin,branch_tip,.12,.025)
  # Needle clusters: multiple elongated irregular volumetric tuft leaves,
  # light gray-green/blue randomized by real branch and coast exposure.
  for c in range(7):
   z=.32+c*.095
   centre=base.lerp(tip,z)
   centre+=F*(sin(i*3+c*.9)*height*.12)
   centre+=S*(cos(i*3+c*1.1)*height*.12)
   radius=height*(.27-.11*z)*(1+rng.uniform(-.23,.19))
   angle=rng.uniform(-.8,.8)
   tip2=centre+Vector((0,0,height*.24))
   start=len(fv)
   for k in range(7):
    a=angle+2*pi*k/7
    fv.append(centre+F*(radius*cos(a))+S*(radius*.75*sin(a)))
   fv.append(tip2)
   for k in range(7):
    ff.append((start+k,start+(k+1)%7,start+7))
    fidx.append((i+c+k)%5==0)
  trees+=1
 mesh(label+' real windworn native maritime pine trunks and branches',
      tv,tf,bark,botany,'LIVING_PUBLIC_COASTAL_TREE_STRUCTURE')
 mesh(label+' modelled volumetric blue-green needle crowns',
      fv,ff,[needle,needle2],botany,'VARIED_TERRAIN_CONIFER',fidx)
 # dune grass thousands of short tapered solid spikes on slopes and
 # keep their height/repetition readable near actual source camera
 gv=[];gf=[];gidx=[]
 for j in range(1150):
  d=rng.uniform(-13,188);s=side*rng.uniform(21,107)
  z=terrain_height(d,s)
  q=P(d,s,z)
  hh=rng.uniform(.14,.9)
  forward=F*rng.uniform(-.18,.18)
  lateral=S*rng.uniform(-.16,.16)
  start=len(gv)
  gv.extend((q+F*(-.065),q+F*(.065),q+forward+lateral+Vector((0,0,hh))))
  gf.append((start,start+1,start+2));gidx.append((j//13)%5==0)
 mesh(label+' original densely varied dune grass micro geometry',
      gv,gf,[vegetation,needle2],botany,'HIGH_FREQUENCY_TERRAIN_PLANT',gidx)
# The left cliff drops toward a real harbor. A narrow stepped dock and
# quay edge, physically distinct from the game track.
zsea=min(ground(115),ground(150))-14
mesh('tide harbor surface with real PBR glass color',
     [P(82,-210,zsea),P(365,-210,zsea),
      P(365,-45,zsea),P(82,-45,zsea)],
     [(0,1,2,3)],water,quay,'SEA_RESEARCH_BACKGROUND_ONLY')
# Platform with slim pile support follows coast, beyond the left slope.
for j,(aa,bb) in enumerate([(80,108),(112,147)]):
 h=ground((aa+bb)*.5)-7
 block('WEST working waterfront open-access timber promenade '+str(j),
       aa,bb,-76,-58,h,h+.85,stone,quay,'PUBLIC_HARBOR_WALKWAY')
 for d in range(aa+3,bb-2,9):
  segment('WEST marine working piled pier foundation '+str(j)+'/'+str(d),
          [P(d,-68,zsea-1),P(d,-68,h+1)],.48,titanium,quay,
          'STILTS_IN_WATER_NOT_COLLISION')
# Harbour boats: not one giant cargo-shaped box. All hulls are
# lofted cross-sections with inward taper, deck consoles, and rigging.
def workboat(name,d,s,scale,ma):
 hh=zsea+1
 rows=[]
 for i,t in enumerate((0,.15,.36,.60,.84,1)):
  rad=scale*(.16+.84*sin(pi*max(.02,t))**.8)
  dd=d+(t-.5)*scale*4.7
  rows.append([P(dd,s-rad,hh-1.1*scale),
               P(dd,s+rad,hh-1.1*scale),
               P(dd,s+rad*.94,hh+scale*1.1),
               P(dd,s-rad*.94,hh+scale*1.1)])
 loft(name+' genuinely cross-sectioned operational maritime hull',
      rows,ma,vessels,'WORKING_FERRY_HULL_NOT_GAME')
 block(name+' raised bridge occupancy',d-scale*.40,d+scale*.65,
       s-scale*.64,s+scale*.64,hh+scale*1.2,hh+scale*3.6,
       glass,vessels,'PUBLIC_SHIP_BRIDGE')
 block(name+' architected wheelhouse weather roof',
       d-scale*.48,d+scale*.72,s-scale*.76,s+scale*.76,
       hh+scale*3.7,hh+scale*4.05,ceramic,vessels,'CREW_NAVIGATION_PROTECTION')
 segment(name+' steel mast and radio antenna',
         [P(d,s,hh+scale*3.8),P(d+.5*scale,s,hh+scale*7)],
         .17*scale,brass,vessels,'ACTUAL_MARINE_COMMUNICATION_MAST')
 for sign in (-1,1):
  segment(name+' stainless quay mooring rail '+str(sign),
          [P(d-scale*1.8,s+sign*scale*.8,hh+scale*1.4),
           P(d+scale*1.8,s+sign*scale*.8,hh+scale*1.4)],
          .11*scale,titanium,vessels,'HUMAN_WORK_BOAT_PROPORTIONS')
workboat('nearshore marine service ferry',131,-98,3.7,copper)
workboat('port inspection workboat',188,-122,2.6,ceramic)
# EAST maritime interpretation centre — one continuous materially readable
# inhabited low building on the planted hillside, hand curved canopy ribs,
# terrace glass and warm interior; unlike former huge uniform rectangle.
forms=[];glazed=[];eave=[]
for dd in range(70,161,4):
 t=(dd-70)/90
 z=ground(dd)+terrain_height(dd,66)-ground(dd)+1.0
 span=10+3.5*sin(pi*t)
 rise=11+3*sin(pi*t)
 forms.append([P(dd,54,z),P(dd,54+span,z+.5),
               P(dd,54+span,z+rise),P(dd,54,z+rise-.8)])
 glazed.append([P(dd,53.4,z+2.8),P(dd,53.7,z+2.8),
                P(dd,53.7,z+rise-2),P(dd,53.4,z+rise-2)])
 eave.append([P(dd,49,z+rise+1.8),
              P(dd,56+span,z+rise+5.0+3*sin(pi*t)),
              P(dd,58+span,z+rise+5.9+3*sin(pi*t)),
              P(dd,48,z+rise+2.5)])
loft('EAST heritage maritime interpretive gallery occupied structure',
      forms,ceramic,center,'PHYSICAL_CULTURAL_INTERPRETATION_CENTER')
loft('EAST physically recessed glazed atrium and reading terrace',
      glazed,glass,center,'VISIBLE_INTERIOR_GLAZING')
loft('EAST singular UV patinated folded coastal civic roof',
      eave,copper,center,'COHERENT_CURVED_ARCHITECTURE_NO_BOX_SPAM')
for i,d in enumerate(range(72,160,7)):
 z=terrain_height(d,54)
 segment('EAST actual exposed timber rib hand-shaped '+str(i),
         [P(d,48,z+12.4),P(d,55,z+18),
          P(d+1.1,69,z+20)],.25,titanium,center,
         'STRUCTURALLY_ATTACHED_CURVED_SUN_SHADE')
 # Deep inward light strips from a readable cultural venue
 segment('EAST occupied linear exhibition amber light '+str(i),
         [P(d,53.0,z+7),P(d+3.3,53,z+7)],
         .13,interior,center,'ACTUAL_PUBLIC_GALLERY_INTERIOR')
# Real harbor lighthouse landmark: outward, beyond crest. No road-spanning
# toy beam. Slender accessible sea observatory and crisp maritime beacon.
d=175;s=-112;z=ground(175)-9
rings=[]
for h,r in ((0,4.5),(3,4.0),(11,3.5),(22,2.9),
            (35,2.3),(43,2.2),(47,2.1)):
 rings.append([P(d+r*cos(2*pi*k/12),
                 s+r*sin(2*pi*k/12),z+h) for k in range(12)])
loft('WEST lighthouse true faceted tapered stone shaft',
     rings,ceramic,horizon,'HARBOUR_SIGNAL_VIEWING_TOWER')
# lantern with independent visible balcony and glass glazing
rings=[]
for h,r in ((47,2.5),(49,3.4),(51,3.4),(54,2.8),(56,3.4)):
 rings.append([P(d+r*cos(2*pi*k/12),
                 s+r*sin(2*pi*k/12),z+h) for k in range(12)])
loft('WEST lighthouse panoramic working lantern rooms',
     rings,glass,horizon,'ACTUAL_LIGHTHOUSE_NAVIGATION')
segment('WEST lighthouse superstructure golden lightning rod',
       [P(d,s,z+55),P(d,s,z+61)],.21,brass,horizon,
       'COASTAL_NAVIGATION')
# Distant industrial harbor skyline, atmospheric layers not
# featureless foreground walls. Curved shoreline after real Road5 end.
for k,side in enumerate((-1,1)):
 rows=[]
 for d in (181,208,236,280,325,400,520,680):
  s0=side*(95+16*sin(d*.009))
  s1=side*(190+25*sin(d*.005+k))
  h0=ground(175)-19
  rows.append([P(d,s0,zsea-10),
               P(d,s1,zsea-24),
               P(d,s1,h0+11+16*sin(d*.011+k)),
               P(d,s0,h0-3+8*sin(d*.02+k))])
 loft(('WEST' if side<0 else 'EAST')+' ocean eroded long distance harbor headland',
      rows,skyline_mat,horizon,'TRUE_DEPTH_PARALLAX_OFFGAME_HARBOR')
# Controlled, natural low source sky with actual broad area illumination
world=scene.world;world.use_nodes=True
for node in world.node_tree.nodes:
 if node.type=='TEX_SKY':
  node.sky_type='NISHITA'
  node.sun_elevation=math.radians(11.0)
  node.sun_rotation=math.radians(220)
 if node.type=='BACKGROUND':node.inputs['Strength'].default_value=.29
for ob in bpy.data.objects:
 if ob.type=='LIGHT':ob.hide_render=True
light=bpy.data.lights.new('K4BQ warm afternoon raking sun','SUN')
light.energy=2.6;light.angle=math.radians(5.5)
o=bpy.data.objects.new('K4BQ / natural sun eastward cut',light)
lighting.objects.link(o)
o.rotation_euler=tuple(math.radians(x) for x in (35,-34,139))
for name,dd,ss,zz in [('east gallery',104,56,22),('seaside docking',131,-88,9)]:
 dl=bpy.data.lights.new('K4BQ '+name+' functional public area light','AREA')
 dl.energy=4200;dl.color=(1,.72,.49);dl.shape='RECTANGLE'
 dl.size=12;dl.size_y=5
 obj=bpy.data.objects.new('K4BQ '+name+' task light',dl)
 lighting.objects.link(obj)
 obj.location=P(dd,ss,ground(dd)+zz)

# Render only K4BP's separately cloned two research cameras.
# Original rig cameras are never selected/moved/modified.
study={}
for mode in ('CHASE_NARROW','NARROW_FIXED_ORIGINAL_POSE'):
 found=[o for o in bpy.data.objects if o.type=='CAMERA' and
        o.name.startswith('K4BP | EXPERIMENT CAMERA | '+mode+' |')]
 assert len(found)==1,(mode,[x.name for x in found])
 study[mode]=found[0]
cam_study_before={mode:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
                  for mode,o in study.items()}
def source_protected():
 assert fp_before=={k:mesh_fp(o) for k,o in roads.items()}
 after={ob.name:(tuple(ob.location),tuple(ob.rotation_euler),float(ob.data.lens))
        for ob in rig.objects if ob.type=='CAMERA'}
 assert after==original_camera_values
 assert cam_study_before=={mode:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
                            for mode,o in study.items()}
source_protected()
scene.render.engine='BLENDER_EEVEE'
if hasattr(scene,'eevee'):
 scene.eevee.taa_render_samples=128
 if hasattr(scene.eevee,'use_gtao'):scene.eevee.use_gtao=True
scene.render.resolution_x=1520
scene.render.resolution_y=950
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
try:scene.view_settings.view_transform='Filmic'
except Exception:pass
try:scene.view_settings.look='Medium High Contrast'
except Exception:pass
scene.view_settings.exposure=-.32
screens=[]
for mode,cam in study.items():
 scene.camera=cam
 name='K4BQ_'+mode+'_NEW_AUTHORED_RESEARCH_DCC_ART_UNJUDGED.png'
 scene.render.filepath=os.path.join(dst,name)
 bpy.ops.render.render(write_still=True)
 screens.append({'mode':mode,'sourceCamera':False,
                 'sourceRoad':False,'newRoadIsResearchOnly':True,'file':name})
# Native .blend stays editable; original sources and camera values are
# still protected after final image generation, no game file edited.
source_protected()
scene.camera=study['CHASE_NARROW']
blend='K4BQ_GEOLOGICAL_HARBOR_EDITABLE_RESEARCH_ART_HOLD.blend'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(dst,blend))
fmeta={}
for name in [blend]+[x['file'] for x in screens]:
 f=os.path.join(dst,name)
 size=os.stat(f).st_size
 assert size>40000,(name,size)
 fmeta[name]={'bytes':size,'sha256':checksum(f)}
data={
 'schema':'dopagaki.K4BQ.sculpted-coastal-maritime-design-research/1',
 'parentK4BPExactBlenderSHA256':PARENT_SHA,
 'frozenOriginalGameGitBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'unchangedSourceRoad5Geometry':True,
 'unchangedSourceCameraPoses':True,
 'unchangedResearchCameraPoses':True,
 'sourceB48RoadCount':7,'sourceB51MoverCount':28,
 'originalPhysicsHz':240,'originalBallRadiusM':.65,
 'researchOnlyAlternativeRoadWidthM':26.3,
 'researchOnlyChaseCamera':True,'isRealGameWebGLScreenshot':False,
 'newGameColliders':0,'sourceGameEdited':False,
 'fullAuthorCreatedResearchObjects':len(created),
 'oldRejectedArtPreservedButRenderHidden':hidden,
 'sourceRoad5ActualGroundSamples':samples,
 'originalSourceFingerprints':fp_before,
 'screens':screens,
 'formalArtAccepted':0,'formalSlope2DNAAcceptedM':0,
 'ART':'UNJUDGED_HOLD','SAT':'HOLD','CCD':'HOLD','FPS':'HOLD',
 'HUMAN':'HOLD','RELEASE':'HOLD','MERGE':'HOLD','files':fmeta
}
with open(os.path.join(dst,'K4BQ_ACTUAL_NATIVE_AUTHOR_PROVENANCE.json'),'w') as f:
 json.dump(data,f,indent=2,ensure_ascii=False)
print('K4BQ_SOURCE_LOCKED_NATIVE_ART_UNJUDGED',
      json.dumps({'newEditable':len(created),'originalRoads':fp_before,
                  'sourceProtected':True},ensure_ascii=False))
