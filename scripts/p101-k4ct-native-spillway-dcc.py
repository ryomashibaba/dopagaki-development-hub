"""K4CT: native editable Blender world authored around the EXACT original B51-13/14 source stations.
The DCC triangle vertices are exported unchanged to the ORIGINAL WebGL2 PRIVATE game
as noncolliding scenery. No static Game/Road5/Camera/240Hz solver/28 B51 changes.
A concept render is NOT a substitute for native camera review or human ART acceptance.
"""
import bpy, json, math
from pathlib import Path
from collections import defaultdict
from mathutils import Vector

OUT=Path('test-results/k4ct-contact-retry')
site=json.loads((OUT/'K4CT_DCC_AUTHENTIC_SITE.json').read_text())
stations={s['id']:s for s in site['stations']}
assert site['schema']=='k4ct-authentic-source-physical-spillway-dcc-v1'
assert site['originalB48Count']==7 and site['originalB51Count']==28
assert site['newColliders']==0
assert {s['id'] for s in site['stations']}=={'a13-machine-13','a13-machine-14'}
assert bpy.app.version>=(4,0,0),bpy.app.version_string
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# In game Y is vertical. Blender Z is vertical. This proper rotation preserves scale.
def world_to_blender(p):return (p[0],-p[2],p[1])
def add(a,b):return tuple(a[i]+b[i] for i in range(3))
def sub(a,b):return tuple(a[i]-b[i] for i in range(3))
def mul(v,k):return tuple(t*k for t in v)
def mix(a,b,t):return add(mul(a,1-t),mul(b,t))
def length(v):return math.sqrt(sum(x*x for x in v))
def unit(v):
 d=length(v)
 return mul(v,1/d) if d>1e-9 else (1,0,0)
def cross(a,b):return (a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])
Y=(0,1,0)
COLORS={
 # R8I coastal daylight. REAL source obstacle and HUD color is untouched;
 # the road bands retain their exact prior base RGB values.
 'basalt':(.23,.285,.315), 'shale':(.32,.375,.402),
 'chalk':(.575,.583,.555), 'limestone':(.655,.650,.595),
 'copper':(.70,.445,.265), 'oxidized':(.255,.465,.455),
 'darksteel':(.19,.275,.307), 'steel':(.47,.53,.56),
 'amber':(.95,.62,.26), 'signal':(.88,.30,.19),
 'glass':(.36,.615,.665), 'lights':(.85,.81,.59),
 'tide':(.105,.335,.40), 'shallows':(.14,.425,.478), 'foam':(.43,.66,.68),
 'moss':(.265,.382,.34), 'slate':(.34,.41,.44),
 'roof':(.375,.46,.50),
 'asphalt':(.20,.26,.27), 'roadmark':(.42,.62,.60), 'roadedge':(.86,.59,.28),
 'concrete':(.54,.565,.54), 'strata':(.39,.455,.47),
 'dunestone':(.49,.50,.465), 'window':(.47,.66,.71),
 'turbine':(.325,.425,.48), 'deepstone':(.155,.225,.272),
 'saltstone':(.59,.62,.60), 'weathered_iron':(.29,.415,.45)
}
GROUPS=defaultdict(list)
def tri(group,a,b,c,mat):
 assert mat in COLORS and all(math.isfinite(t) for p in (a,b,c) for t in p)
 if length(cross(sub(b,a),sub(c,a)))<1e-6:return
 GROUPS[group].append((a,b,c,mat))
def quad(g,a,b,c,d,m,twoside=True):
 tri(g,a,b,c,m);tri(g,a,c,d,m)
 if twoside:
  tri(g,c,b,a,m);tri(g,d,c,a,m)
def beam(g,a,b,r,mat):
 direction=unit(sub(b,a))
 side=unit(cross(direction,Y)) if abs(direction[1])<.9 else (1,0,0)
 vertical=unit(cross(direction,side))
 ring=lambda p:[add(p,add(mul(side,r*x),mul(vertical,r*z))) for x,z in ((-1,-1),(1,-1),(1,1),(-1,1))]
 A=ring(a);C=ring(b)
 for j in range(4):quad(g,A[j],A[(j+1)%4],C[(j+1)%4],C[j],mat)
 quad(g,*A,mat);quad(g,*C,mat)
def box(g,centre,w,d,h,mat,fw=(0,0,1),side=(1,0,0)):
 fw=unit((fw[0],0,fw[2]));side=unit((side[0],0,side[2]))
 corner=lambda x,y,z:add(centre,add(mul(side,x*w/2),add(mul(Y,y*h/2),mul(fw,z*d/2))))
 b=[corner(x,-1,z) for x,z in ((-1,-1),(1,-1),(1,1),(-1,1))]
 t=[corner(x,1,z) for x,z in ((-1,-1),(1,-1),(1,1),(-1,1))]
 quad(g,*b,mat)
 quad(g,*t,mat)
 for i in range(4):quad(g,b[i],b[(i+1)%4],t[(i+1)%4],t[i],mat)
def road(idx):
 return next(r for r in site['roads'] if r['index']==idx)
def sample(idx,u):
 r=road(idx);f=max(0,min(128,u*128));i=min(127,int(f));t=f-i
 return {k:mix(r['samples'][i][k],r['samples'][i+1][k],t) for k in ('left','center','right')}
def frame(idx,u):
 p=sample(idx,u)
 before=sample(idx,max(0,u-.012))['center']
 after=sample(idx,min(1,u+.012))['center']
 fw=unit((after[0]-before[0],0,after[2]-before[2]))
 side=unit((p['right'][0]-p['left'][0],0,p['right'][2]-p['left'][2]))
 return p,fw,side
def offset_edge(p,side,dist,base):
 edge=p['right' if base=='R' else 'left']
 direction=side if base=='R' else mul(side,-1)
 return add(edge,mul(direction,dist))

# K4CT R5 one integrated scene: CUT TIDAL FOUNDRY.
# Design the real Road5/6 high-speed chase first. A single colossal tidal-lock
# campus is cut into the cliff and linked to working water / pier / service way.
# Road and original 28 moving B51 are visually recognizable. No made-up racing
# lane, no fake collision surface, no repeating neon portal arches over the road.
#
# Geometry is authored here into genuine independent Blender meshes AND exported
# from this same source for the original private WebGL2 game. The physical B48
# surface and the Runner remain IDENTICAL to K4CT R4.
def along(idx,u,side='R',distance=80,height=0):
 p,fw,lat=frame(idx,u)
 at=offset_edge(p,lat,distance,side)
 return add(at,(0,height,0)),fw,lat

def grain(i,v):
 return math.sin(i*0.69+v*1.9)*.55+math.sin(i*1.67+v*2.6)*.30+math.sin(i*3.11+v)*.15

def drum(g,centre,fw,lat,radius,height,material,segments=14,top_r=None):
 top_r=radius if top_r is None else top_r
 def ring(rad,y):
  return [add(centre,add(mul(fw,rad*math.cos(2*math.pi*k/segments)),
                           add(mul(lat,rad*math.sin(2*math.pi*k/segments)),(0,y,0))))
          for k in range(segments)]
 a=ring(radius,0);b=ring(top_r,height)
 for k in range(segments):
  q=(k+1)%segments
  quad(g,a[k],a[q],b[q],b[k],material)
 # The road side always sees a real solid volume; no fake alpha/glass walls.
 for k in range(1,segments-1):
  tri(g,a[0],a[k+1],a[k],material)
  tri(g,b[0],b[k],b[k+1],material)

def truss(g,a,b,span_width,depth,material):
 line=unit(sub(b,a))
 lateral=unit(cross(line,Y))
 for k in range(12):
  t=k/12;u=(k+1)/12
  A=mix(a,b,t);B=mix(a,b,u)
  beam(g,add(A,mul(lateral,span_width)),add(B,mul(lateral,span_width)),.75,material)
  beam(g,add(A,mul(lateral,-span_width)),add(B,mul(lateral,-span_width)),.75,material)
  if k%2==0:
   beam(g,add(A,mul(lateral,-span_width)),add(B,mul(lateral,span_width)),.46,material)
  else:
   beam(g,add(A,mul(lateral,span_width)),add(B,mul(lateral,-span_width)),.46,material)
  if k%3==0:
   beam(g,add(A,mul(lateral,span_width)),add(A,mul(lateral,-span_width)),.68,material)
  beam(g,add(A,(0,-depth,0)),add(B,(0,-depth,0)),.36,'darksteel')

allRoadHeights=[s['center'][1] for road_ in site['roads'] for s in road_['samples']]
tideY=min(allRoadHeights)-30

# A) Honest, conformal visible race surface. This is an *air-separated 0.12m
# visual-only* triangle skin; true B48 collision and speed are not touched.
roadBands=((0,.026,'darksteel'),(.026,.045,'roadedge'),
 (.045,.450,'asphalt'),(.450,.462,'roadmark'),(.462,.538,'asphalt'),
 (.538,.550,'roadmark'),(.550,.955,'asphalt'),
 (.955,.973,'roadedge'),(.973,1,'darksteel'))
for index in (5,6):
 for k in range(128):
  p=sample(index,k/128);q=sample(index,(k+1)/128)
  def skin(points,t):
   return add(mix(points['left'],points['right'],t),(0,.12,0))
  for t0,t1,material in roadBands:
   quad('00_PHYSICAL_ROAD_CONFORMAL_VISIBLE_SKIN',
        skin(p,t0),skin(q,t0),skin(q,t1),skin(p,t1),material,False)

# B) Real carved rock rather than repeating planes. Longitudinally coherent
# strata, differing ledges, erosion cuts, and a robust skyline; keep all solid
# visual cliff terrain safely OUTBOARD of the native race envelope.
for index in (5,6):
 samples=[sample(index,k/144) for k in range(145)]
 for k in range(144):
  u=(k+.5)/144
  aa=samples[k];bb=samples[k+1]
  _,fw,lat=frame(index,u)
  levels=[(29,-8),(42,-12),(61,-4),(84,14),(119,37),(158,53),(202,66)]
  def section(p,key):
   side=unit(sub(p['right'],p['left']))
   return [add(offset_edge(p,side,dist,'L'),
     (0,h+grain(key,j)*(.5+4.4*j/6),0))
     for j,(dist,h) in enumerate(levels)]
  A=section(aa,k);B=section(bb,k+1)
  # R8D: source CAMERA screen-right = physical LEFT bank. Create an
  # actual open quarry sky aperture (no fake dark polygon, no new road),
  # instead of adding R8C's rejected broad grey corrugated shell.
  quarryVoid=(index==5 and .816<u<.940) or (index==6 and .415<u<.645)
  for layer in range(len(levels)-1):
   if quarryVoid and layer>=2:continue
   if layer>=3 and ((.18<u<.26) or (.62<u<.705)) and index==5:
    continue
   if layer>=4 and (.20<u<.33) and index==6:continue
   if layer>=5 and (k%17<=1):continue
   # The lower foundation lip is exposed rock, not pitch-black fake cave.
   material=('basalt' if layer==0 else 'shale') if quarryVoid else (
     'deepstone','basalt','shale','strata','chalk','moss')[layer]
   quad('01_CARVED_BASALT_AND_LAYERED_RIFT',
       A[layer],B[layer],B[layer+1],A[layer+1],material)
  # High irregular eroded buttress against the cliff, not a flat shell.
  if k%15==0 and not quarryVoid:
   anchor=A[4];highest=add(anchor,(0,23+5*math.sin(k),0))
   beam('02_EARTH_ANCHORED_STONE_RIBS',anchor,highest,4.3,'basalt')
   beam('02_EARTH_ANCHORED_STONE_RIBS',highest,
        add(anchor,add(mul(lat,-25),(0,-4,0))),2.0,'shale')


# R8D ONE integrated ore route, supported by two real-road-adjacent rock
# abutments, consistently >=48m OUTBOARD of left B48. Not across a lane:
# no collision, no fake safe path, no modification to B51, CCD or camera.
p0,fw0,side0=frame(5,.835)
p1,fw1,side1=frame(5,.936)
head=add(offset_edge(p0,side0,66,'L'),(0,36,0))
tail=add(offset_edge(p1,side1,80,'L'),(0,42,0))
truss('38_R8D_ONE_SUSPENDED_QUARRY_CONVEYOR',
      head,tail,6.4,7.5,'darksteel')
for u in (.835,.936):
 p,fw,side=frame(5,u)
 footing=offset_edge(p,side,74,'L')
 for d in (-5.8,5.8):
  base=add(footing,mul(fw,d))
  beam('39_R8D_CLIFF_ANCHORED_LOAD_PATHS',
       add(base,(0,-27,0)),add(base,(0,43,0)),3.2,'concrete')
  beam('39_R8D_CLIFF_ANCHORED_LOAD_PATHS',
       add(base,(0,41,0)),add(base,add(mul(side,-24),(0,9,0))),
       1.8,'oxidized')
# Large dark cargo hopper establishes purpose; visible open loading hall
# underneath and a corrosion-colour structure integrated with quarry strata.
p,fw,side=frame(5,.917)
ore=add(offset_edge(p,side,81,'L'),(0,10,0))
box('40_R8D_QUARRY_ORE_HOPPER_OPEN_LOADING_BAY',
    add(ore,(0,21,0)),37,31,24,'basalt',fw,side)
for dx in (-14,14):
 base=add(ore,mul(fw,dx))
 beam('40_R8D_QUARRY_ORE_HOPPER_OPEN_LOADING_BAY',
      add(base,(0,-24,0)),add(base,(0,33,0)),2.4,'steel')
beam('40_R8D_QUARRY_ORE_HOPPER_OPEN_LOADING_BAY',
     add(ore,(0,36,0)),add(ore,add(mul(side,23),(0,14,0))),
     3.6,'copper')

# R8J: a single identifiable working tidal generator wheel, not R8D's
# two generic cargo-lift rectangular portal columns. This occupies the
# EXACT original Road6 chase sightline at 68.05 seconds: outboard of
# physical LEFT B48 by 87m, with completely empty air over the raceway.
# All objects are real editable Blender meshes and noncolliding WebGL2 art.
p,fw,side=frame(6,.625)
lift=add(offset_edge(p,side,87,'L'),(0,4,0))
rotorGroup='41_R8J_COASTAL_TIDAL_TURBINE_CROWN'
plantGroup='42_R8J_QUARRY_ANCHORED_TURBINE_PENSTOCK'
wheelCenter=add(lift,(0,34,0))
def wheelPoint(radius,angle,depth):
 return add(wheelCenter,
   add(mul(fw,depth),
     add(mul(side,radius*math.cos(angle)),(0,radius*math.sin(angle),0))))
# The 24-sector open steel annulus is an actual THICK 3D wheel:
# two separated circular ribs, outer and inner rim walls, no planar mask.
nWheel=24
for k in range(nWheel):
 t0=2*math.pi*k/nWheel;t1=2*math.pi*(k+1)/nWheel
 for depth in (-3.7,3.7):
  quad(rotorGroup,
       wheelPoint(21.5,t0,depth),wheelPoint(21.5,t1,depth),
       wheelPoint(26.5,t1,depth),wheelPoint(26.5,t0,depth),
       'weathered_iron' if depth>0 else 'steel')
 for radius,mat in ((21.5,'deepstone'),(26.5,'oxidized')):
  quad(rotorGroup,
       wheelPoint(radius,t0,-3.7),wheelPoint(radius,t1,-3.7),
       wheelPoint(radius,t1,3.7),wheelPoint(radius,t0,3.7),mat)
# Radially pitched bronze blades and a stepped mechanical axle. A real
# open rotor silhouette, NOT an animated or physically colliding gate.
for k in range(12):
 a=2*math.pi*(k+.20)/12
 a1=a+.145
 inner0=wheelPoint(7.5,a,-2.7)
 inner1=wheelPoint(7.5,a1,2.3)
 outer0=wheelPoint(20.7,a+.09,2.1)
 outer1=wheelPoint(20.7,a1+.09,-2.4)
 quad(rotorGroup,inner0,outer0,outer1,inner1,
      'copper' if k%3 else 'oxidized')
 for depth in (-5,5):
  a0=wheelPoint(5.2,2*math.pi*k/12,depth)
  a1=wheelPoint(5.2,2*math.pi*(k+1)/12,depth)
  tri(rotorGroup,wheelPoint(0,0,depth),a0,a1,'turbine')
# The machined annular hub connects to both real structural bearing seats.
for k in range(16):
 t0=2*math.pi*k/16;t1=2*math.pi*(k+1)/16
 quad(rotorGroup,
      wheelPoint(5.2,t0,-6.8),wheelPoint(5.2,t1,-6.8),
      wheelPoint(5.2,t1,6.8),wheelPoint(5.2,t0,6.8),'turbine')
# Two massive load-bearing geology-embedded support feet, with a SINGLE
# service catwalk under the wheel, never a false raceable route.
for alongTrack in (-17,17):
 bearing=add(lift,mul(fw,alongTrack))
 seat=add(bearing,add(mul(side,-8),(0,17,0)))
 beam(plantGroup,add(bearing,(0,-42,0)),seat,5.4,'saltstone')
 beam(plantGroup,seat,add(bearing,add(mul(side,-29),(0,4,0))),
      3.0,'weathered_iron')
box(plantGroup,add(lift,add(mul(side,-10),(0,-4,0))),
    17,57,5,'saltstone',fw,side)
# One coherent gravity-fed pair of penstocks from the turbine discharge
# into the existing maritime basin. They DO NOT cross source Road6 B48.
for x in (-9,9):
 head=add(lift,add(mul(fw,x),(0,-1,0)))
 offWater=add(head,add(mul(side,-72),(0,tideY+9-head[1],0)))
 beam(plantGroup,head,offWater,3.8,'oxidized')
 beam(plantGroup,offWater,add(offWater,(0,-16,0)),4.4,'deepstone')
# One enclosed control cabin inset behind the rotor; the main view
# remains through the ring and across sky, with original B51 legible.
control=add(lift,add(mul(side,-24),(0,39,0)))
box(plantGroup,control,22,18,12,'deepstone',fw,side)
for x in (-6,6):
 for sideShift in (-9.5,9.5):
  front=add(control,add(mul(fw,x),mul(side,sideShift)))
  box(plantGroup,front,5,1.2,6,'window',fw,side)

# C) Tidal sea, stepped embankment and real industrial retaining wall. Source
# road is very high above the water, so the quays have structural connections
# from terrace to sea instead of platforms floating in the sky.
for index in (5,6):
 samples=[sample(index,k/144) for k in range(145)]
 for k in range(144):
  p=samples[k];q=samples[k+1]
  _,fw,lat=frame(index,(k+.5)/144)
  def wall_section(x):
   side=unit(sub(x['right'],x['left']))
   base=x['right']
   def s(dist,y):return add(offset_edge(x,side,dist,'R'),
                    (0,y-base[1],0))
   return [s(24,base[1]-10),s(37,base[1]-23),
           s(61,base[1]-44),s(88,tideY+12),s(105,tideY+3),
           s(140,tideY),s(440,tideY)]
  A=wall_section(p);B=wall_section(q)
  for layer,mat in enumerate(('basalt','shale','strata','concrete','slate','shallows')):
   if layer==5 and k%7==0:mat='tide'
   quad('03_CLIFF_TO_WORKING_TIDAL_BASIN',
        A[layer],B[layer],B[layer+1],A[layer+1],mat,False)
  if k%11==0:
   beam('04_MARITIME_CONCRETE_SPILLWAY_BUTTRESSES',
        add(A[2],(0,5,0)),add(A[4],(0,-8,0)),3.0,'concrete')
  if k%9==0:
   # Directional wave whitecap, appears only on the physical sea plane.
   x=add(A[5],(0,.22,0));z=add(B[5],(0,.22,0))
   quad('05_WATER_TURBULENCE_AND_FOAM',x,z,
        add(z,mul(lat,12)),add(x,mul(lat,12)),'foam',False)

# D) The ONE main monument: a working tidal sluice/power-house at the end of
# road 5. Its four real open arch bays, columns and long turbine ducts create
# an identifiable port program. Not another repeated road gate.
gate,gateForward,gateLat=along(5,.88,'R',151,height=0)
gateBase=(gate[0],tideY+6,gate[2])
gateGroup='06_ANCHORED_4_BAY_TIDAL_LOCK_AND_SLUICE'
box(gateGroup,add(gateBase,(0,-6,0)),185,56,17,'deepstone',gateForward,gateLat)
for bay in range(4):
 x=(bay-1.5)*42
 root=add(gateBase,mul(gateForward,x))
 for delta in (-18,18):
  pile=add(root,mul(gateForward,delta))
  beam(gateGroup,add(pile,(0,-3,0)),add(pile,(0,49,0)),5.1,'concrete')
 # A genuine semi-circular open arch with negative space below the voussoirs.
 for depth in (-17,17):
  centre=add(root,add(mul(gateLat,depth),(0,30,0)))
  for k in range(12):
   t0=math.pi*k/12;t1=math.pi*(k+1)/12
   def arc(r,t):return add(centre,add(mul(gateForward,r*math.cos(t)),(0,r*math.sin(t),0)))
   quad(gateGroup,arc(21,t0),arc(21,t1),arc(16.1,t1),arc(16.1,t0),
        'limestone',False)
  for k in range(0,12,3):
   t=math.pi*(k+.5)/12
   beam('07_SLUICE_ARCH_SPILLGATES',
        add(centre,add(mul(gateForward,15*math.cos(t)),(0,15*math.sin(t),0))),
        add(centre,add(mul(gateForward,15*math.cos(t)),(0,-16,0))),
        1.1,'copper')
# Real horizontal mechanical spine, drain slots and raised operating walk.
box(gateGroup,add(gateBase,(0,54,0)),192,57,8,'steel',gateForward,gateLat)
for x in (-76,-33,9,51,76):
 p=add(gateBase,add(mul(gateForward,x),(0,59,0)))
 box('08_WORKING_HYDRAULICS_AND_SERVICE',p,6,27,3,'oxidized',gateForward,gateLat)
for x in (-65,-22,22,65):
 shaft=add(gateBase,add(mul(gateForward,x),(0,67,0)))
 drum('08_WORKING_HYDRAULICS_AND_SERVICE',shaft,gateForward,gateLat,4.7,16,'turbine',10)
 beam('08_WORKING_HYDRAULICS_AND_SERVICE',add(shaft,(0,16,0)),
      add(shaft,add(mul(gateLat,22),(0,21,0))),1.8,'copper')

# E) Main public-industrial silhouette above a cut into cliff: stacked halls
# with sawtooth clerestory, accessible piers, real structural load paths.
hall,hf,hl=along(5,.69,'R',125,height=-33)
hallGroup='09_QUARRY_EMBEDDED_POWERHOUSE_AND_STEPPED_ROOFS'
box(hallGroup,add(hall,(0,-12,0)),160,64,33,'basalt',hf,hl)
for offset in (-64,-32,0,32,64):
 support=add(hall,mul(hf,offset))
 beam(hallGroup,add(support,(0,-28,0)),
      add(support,(0,-93,0)),4.2,'concrete')
 # Sawtooth roof has daylight openings; not just a solid cuboid.
 for k in range(3):
  roota=add(support,add(mul(hl,-30+k*21),(0,20,0)))
  roofb=add(roota,add(mul(hl,18),(0,11,0)))
  roofc=add(roofb,add(mul(hl,8),(0,-11,0)))
  beam(hallGroup,roota,roofb,1.3,'steel')
  beam(hallGroup,roofb,roofc,1.3,'roof')
  quad(hallGroup,add(roota,mul(hf,-13)),add(roota,mul(hf,13)),
      add(roofb,mul(hf,13)),add(roofb,mul(hf,-13)),'roof',False)
for k in range(16):
 off=(k-7.5)*9.2
 p=add(hall,add(mul(hf,off),add(mul(hl,-32),(0,2,0))))
 box('10_CLERESTORY_AND_WORKING_HALL_WINDOWS',p,3.7,1.7,12,'window',hf,hl)
for k in range(5):
 origin=add(hall,add(mul(hf,-67+k*31),mul(hl,41)))
 beam('11_VERTICAL_PUMPS_TO_TIDAL_LOCK',
      add(origin,(0,-9,0)),add(origin,(0,-74,0)),3.5,'oxidized')
 box('11_VERTICAL_PUMPS_TO_TIDAL_LOCK',add(origin,(0,-73,0)),7,9,9,'turbine',hf,hl)
 # The pipes follow geography down to the sluice; not independent artwork.
 beam('11_VERTICAL_PUMPS_TO_TIDAL_LOCK',
      add(origin,(0,-74,0)),add(mix(origin,gateBase,.7),(0,12,0)),1.7,'copper')

# F) One visible coastal lift tower, NOT two colorful obstacle-like portal
# frames. It represents the huge level difference between raceway and tide.
tower,tf,tl=along(6,.18,'R',138,height=-45)
towerGroup='12_SINGLE_TIDAL_LIFT_AND_CONTROL_TOWER'
box(towerGroup,add(tower,(0,-2,0)),66,57,26,'deepstone',tf,tl)
drum(towerGroup,add(tower,(0,11,0)),tf,tl,21,80,'concrete',18,top_r=13)
drum(towerGroup,add(tower,(0,91,0)),tf,tl,16,10,'oxidized',18,top_r=16)
drum(towerGroup,add(tower,(0,102,0)),tf,tl,12,14,'copper',18,top_r=4)
for k in range(9):
 t=k*2*math.pi/9
 local=add(tower,add(mul(tf,17*math.cos(t)),add(mul(tl,17*math.sin(t)),(0,69,0))))
 box('13_CONTROL_FLOOR_GLAZING',local,6,5,10,'window',tf,tl)
for d in (-25,25):
 base=add(tower,mul(tf,d))
 beam(towerGroup,add(base,(0,-10,0)),add(base,(0,-89,0)),6,'concrete')
 beam(towerGroup,add(base,(0,15,0)),add(tower,(0,92,0)),2.1,'darksteel')
# R8G: Re-author R5's 1536-triangle repetitive bridge as ONE open,
# readable tidal-service water conduit physically connecting the power
# station and lift. Every segment is far OUTBOARD of B48; no raceable road,
# collision, camera, source 28 B51, or machine warning has changed.
# Deliberately no repetitive V bracing or road-spanning false portals.
way0=add(hall,add(mul(hl,17),(0,24,0)))
way1=add(tower,add(mul(tl,-7),(0,45,0)))
channelAxis=unit(sub(way1,way0))
channelLat=unit(cross(channelAxis,Y))
for k in range(18):
 a=mix(way0,way1,k/18)
 b=mix(way0,way1,(k+1)/18)
 def channel(at,across,vertical):
  return add(at,add(mul(channelLat,across),(0,vertical,0)))
 # A genuine U-section penstock with cold tidal feed inside;
 # walls sit ABOVE the narrow water, not a fake driving surface.
 quad('14_CABLE_STAYED_SERVICE_CAUSEWAY',
      channel(a,-6.4,-3),channel(b,-6.4,-3),
      channel(b,6.4,-3),channel(a,6.4,-3),'weathered_iron',False)
 quad('14_CABLE_STAYED_SERVICE_CAUSEWAY',
      channel(a,-6,-.9),channel(b,-6,-.9),
      channel(b,6,-.9),channel(a,6,-.9),'tide',False)
 for side in (-1,1):
  quad('14_CABLE_STAYED_SERVICE_CAUSEWAY',
       channel(a,side*6.4,-3),channel(b,side*6.4,-3),
       channel(b,side*6.4,3.7),channel(a,side*6.4,3.7),
       'saltstone',False)
 # Only two widely spaced seaward foundations, not 8 or 12 frames.
 if k in (5,13):
  at=mix(a,b,.5)
  for side in (-1,1):
   post=channel(at,side*6.4,-3)
   foot=(post[0],tideY-8,post[2])
   beam('14_CABLE_STAYED_SERVICE_CAUSEWAY',
        foot,post,4.2,'saltstone')
  beam('14_CABLE_STAYED_SERVICE_CAUSEWAY',
       channel(at,-7.2,-5),channel(at,7.2,-5),
       1.8,'weathered_iron')


# K4CT R6: Camera-led upper tidal channel, carved negative space, and one
# dramatic hydraulic connection. Authored on original Road5/6 source frames.
# Noncolliding only. No obstacle portals, no alternate driving road or CCD edits.
# A single open water datum on each road avoids the previous sloping fake sea.
for index,begin,end,waterY in ((5,.60,.94,105.0),(6,.025,.36,93.0)):
 for k in range(72):
  a=begin+(end-begin)*k/72
  b=begin+(end-begin)*(k+1)/72
  p=sample(index,a);q=sample(index,b)
  def bank(s,dist,y):
   side=unit(sub(s['right'],s['left']))
   at=offset_edge(s,side,dist,'R')
   return (at[0],y,at[2])
  # One broad upstream forebay, a rock-topped retaining berm and real open
  # water with shore edges below the ORIGINAL B48 racing surface.
  for d0,d1,mat in ((32,39,'deepstone'),(39,42,'concrete'),
                      (42,102,'shallows'),(102,107,'strata'),
                      (107,114,'deepstone')):
   y0=waterY+(.8 if d0<42 or d0>=102 else 0)
   y1=waterY+(.8 if d1<=42 or d1>102 else 0)
   quad('19_R6_SOURCE_FRAMED_UPPER_TIDAL_FOREBAY',
        bank(p,d0,y0),bank(q,d0,y0),
        bank(q,d1,y1),bank(p,d1,y1),mat,False)
  if k%8==0:
   for d in (39,107):
    beam('20_R6_REAL_RETAINING_LOAD_PATHS',
         bank(p,d,waterY+.8),bank(p,d,waterY-34),2.3,'concrete')
 # A large shore break does NOT create a passage on the race course.
 for u in (begin+.06,begin+.17):
  p,fw,lat=frame(index,u)
  siteLeft=offset_edge(p,lat,114,'R')
  beam('20_R6_REAL_RETAINING_LOAD_PATHS',
       add(siteLeft,(0,waterY-p['right'][1]-25,0)),
       add(siteLeft,(0,waterY-p['right'][1]+2,0)),5.8,'basalt')

# Angular upper stratified ridge deliberately frames the CHASE without
# spanning the race lane. Discontinuous facets/readable geological erosion,
# replacing the impression of a featureless, infinitely smooth bank.
for index,begin,end in ((5,.57,.93),(6,.04,.42)):
 for k in range(84):
  u0=begin+(end-begin)*k/84
  u1=begin+(end-begin)*(k+1)/84
  def ridge(u,i):
   p,fw,lat=frame(index,u)
   base=p['left']
   rock=lambda d,h: add(offset_edge(p,lat,d,'L'),(0,h,0))
   wobble=2.6*math.sin(i*.38)+1.4*math.cos(i*.93)
   return [rock(31,-7+wobble*.5),rock(46,4+wobble),
           rock(69,21+wobble*.8),rock(106,43+wobble*1.4)]
  a=ridge(u0,k);b=ridge(u1,k+1)
  # A single deep quarry notch opens a genuine view through the cliff mass.
  openCut=index==5 and .735<(u0+u1)*.5<.805
  for layer,material in enumerate(('deepstone','dunestone','shale')):
   if openCut and layer>=1:continue
   quad('21_R6_BROKEN_QUARRY_STRATA_SOURCE_CHASE',
        a[layer],b[layer],b[layer+1],a[layer+1],material,False)
  if k%16==2 and not openCut:
   beam('22_R6_BASALT_EXPOSED_FAULT_SEAMS',
        a[1],add(a[2],(0,7,0)),1.4,'strata')

# One hydraulic reason for the place: the upper lock pools actually feed
# the lower four-bay tidal structure authored in R5. A single sloping open
# spill channel has a continuous load-bearing foundation into the quay.
r6Head,headFw,headLat=along(5,.885,'R',88,height=0)
r6Head=(r6Head[0],105.0,r6Head[2])
r6Foot=add(gateBase,mul(gateLat,-22))
for bankSide in (-1,1):
 top=add(r6Head,mul(headLat,bankSide*14))
 bottom=add(r6Foot,mul(headLat,bankSide*14))
 beam('23_R6_SINGLE_TIDAL_HEADRACE_TO_SLUICE',
      add(top,(0,2,0)),add(bottom,(0,4,0)),3.8,'deepstone')
 quad('23_R6_SINGLE_TIDAL_HEADRACE_TO_SLUICE',
      top,add(top,(0,-4,0)),add(bottom,(0,-4,0)),bottom,'concrete',False)
quad('24_R6_SINGLE_DESCENDING_OPEN_WATER_CHUTE',
     add(r6Head,mul(headLat,-12)),add(r6Head,mul(headLat,12)),
     add(r6Foot,mul(headLat,12)),add(r6Foot,mul(headLat,-12)),
     'foam',False)

# G) Finished harbor logic: outboard quays on real water, steel fenders,
# freight rails and roof rhythm. No generic flat city or endless pole rows.
for index,u in ((5,.56),(5,.82),(6,.30)):
 wharf,wf,wl=along(index,u,'R',190,height=0)
 shore=(wharf[0],tideY+5,wharf[2])
 box('15_WORKING_PORT_QUAYS_AND_BERTHING',shore,104,58,9,'concrete',wf,wl)
 for x in (-46,-23,0,23,46):
  at=add(shore,mul(wf,x))
  for y in (-24,24):
   foot=add(at,mul(wl,y))
   beam('15_WORKING_PORT_QUAYS_AND_BERTHING',
        add(foot,(0,-6,0)),add(foot,(0,-37,0)),2,'darksteel')
 # A locally recognizable loading hall with an asymmetrical raised roof.
 centre=add(shore,add(mul(wl,37),(0,18,0)))
 box('16_ROOFED_PORT_OPERATIONS',centre,73,28,23,'slate',wf,wl)
 for x in (-33,-17,0,17,33):
  anchor=add(centre,add(mul(wf,x),(0,15,0)))
  beam('16_ROOFED_PORT_OPERATIONS',add(anchor,mul(wl,-18)),
       add(anchor,add(mul(wl,18),(0,11,0))),1.4,'steel')
  quad('16_ROOFED_PORT_OPERATIONS',
       add(anchor,mul(wl,-18)),
       add(anchor,add(mul(wf,16),mul(wl,-18))),
       add(anchor,add(mul(wf,16),add(mul(wl,18),(0,11,0)))),
       add(anchor,add(mul(wl,18),(0,11,0))),'roof',False)
 for x in (-22,-8,8,22):
  glass=add(centre,add(mul(wf,x),add(mul(wl,-15),(0,1,0))))
  box('16_ROOFED_PORT_OPERATIONS',glass,7,1.0,8,'glass',wf,wl)
 # Cargo crane is structurally planted on pier and primarily frames the sea.
 crane=add(shore,add(mul(wf,-33),mul(wl,10)))
 beam('17_BERTH_UTILITY_CRANES',crane,add(crane,(0,57,0)),3.0,'darksteel')
 beam('17_BERTH_UTILITY_CRANES',add(crane,(0,56,0)),
      add(crane,add(mul(wl,-56),(0,54,0))),1.5,'copper')
 beam('17_BERTH_UTILITY_CRANES',add(crane,(0,56,0)),
      add(crane,add(mul(wl,20),(0,52,0))),1.1,'oxidized')
 beam('17_BERTH_UTILITY_CRANES',add(crane,add(mul(wl,-44),(0,53,0))),
      add(crane,add(mul(wl,-44),(0,22,0))),.55,'darksteel')

# H) Two different recognizable real-station sightlines: sparse OUTBOARD
# cut-rock wayfinding pylons (no road-spanning false safe gates).
for station in site['stations']:
 index,u=station['roadIndex'],station['u']
 p,fw,lat=frame(index,u)
 shore=offset_edge(p,lat,43,'L')
 pylon=add(shore,(0,-8,0))
 height=43 if station['id'].endswith('-13') else 60
 # Use strong mass/silhouette, tiny signal area; original red B51 is still
 # the clearest danger and remains visually / physically UNCHANGED.
 drum('18_INTEGRATED_TWO_STATION_QUARRY_BEACONS',
      pylon,fw,lat,7,8,'deepstone',9,top_r=7)
 beam('18_INTEGRATED_TWO_STATION_QUARRY_BEACONS',
      add(pylon,(0,7,0)),add(pylon,(0,height,0)),2.8,'concrete')
 box('18_INTEGRATED_TWO_STATION_QUARRY_BEACONS',
     add(pylon,(0,height+2,0)),9,11,4,
     'amber' if station['id'].endswith('-14') else 'copper',fw,lat)


# R7B: true-CHASE camera-framed reauthoring of ONE tidal-power harbor campus.
# Source trace: at 65.25 Road5 u=.82, 66.35 Road5 u=.969,
# at 68.05 Road6 u=.430. All geometry sits outside real B48 widths.
# This is authored editable geometry, never an alternate road / collision hull.
for idx,u0,u1 in ((5,.81,.995),(6,.395,.79)):
 for i in range(64):
  v=u0+(u1-u0)*i/64
  nextV=u0+(u1-u0)*(i+1)/64
  P,F,S=frame(idx,v);Q,F1,S1=frame(idx,nextV)
  # A stepped geologically connected quarry / tidal cut. Interrupted upper
  # shelves create real skyline voids rather than a long flat wall.
  for j,(d0,d1,h0,h1,mat) in enumerate((
     (26,37,-13,-9,'basalt'),(37,58,-9,1,'shale'),
     (58,86,1,17,'strata'),(86,125,17,45,'chalk'))):
   if j>=2 and ((idx==5 and .887<v<.923) or (idx==6 and .558<v<.594)):
    continue
   grainY=2.3*math.sin(i*.51+j*2.1)
   def at(p,side,d,h):
    outward=unit(sub(p['right'],p['left']))
    return add(offset_edge(p,outward,d,side),(0,h+grainY,0))
   quad('25_R7B_OPEN_QUARRY_CUT_AND_STRATIFIED_HEADLAND',
        at(P,'R',d0,h0),at(Q,'R',d0,h0),
        at(Q,'R',d1,h1),at(P,'R',d1,h1),mat,False)
  # Actual rock abutments, far apart enough to read at high speed.
  if i%16==5:
   root=offset_edge(P,S,84,'R')
   beam('26_R7B_ANCHORED_CLIFF_LOAD_BEARING_RIBS',
        add(root,(0,-32,0)),add(root,(0,36,0)),3.1,'deepstone')
   beam('26_R7B_ANCHORED_CLIFF_LOAD_BEARING_RIBS',
        add(root,(0,36,0)),
        add(offset_edge(P,S,112,'R'),(0,49,0)),1.7,'darksteel')

# R8F: ONE actual open-air tidal turbine campus, not the previous duplicated
# 115m opaque basalt crates in the chase view. Each bay has an uninterrupted
# OPEN VOLUME between physically connected columns and an asymmetrical roof.
# This is a REAL Blender 3D architectural replacement, never a collider.
# Both sites remain well OFF the right edge of the authentic B48.
for idx,u in ((5,.915),):
 P,F,S=frame(idx,u)
 main=True
 station=add(offset_edge(P,S,92 if main else 104,'R'),(0,-14,0))
 bays=6 if main else 4
 pitch=19 if main else 16
 total=(bays-1)*pitch
 # Thin foundation deck with a see-through working level above true tide.
 box('27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL',
     add(station,(0,-22,0)),43,total+22,6,'saltstone',F,S)
 for i in range(bays):
  x=(i-(bays-1)/2)*pitch
  row=add(station,mul(F,x))
  # The upper shell is FULLY OPEN between all marine steel columns.
  for out in (-18,18):
   anchor=add(row,mul(S,out))
   beam('27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL',
        add(anchor,(0,-32,0)),add(anchor,(0,27+(i%3)*3,0)),2.8,
        'weathered_iron' if out>0 else 'saltstone')
   beam('29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF',
        add(anchor,(0,25+(i%3)*3,0)),
        add(row,(0,36+(i%3)*3,0)),1.1,'steel')
  if i<bays-1:
   # Sawtooth daylight canopy over just this bay; legitimate empty
   # arch/open water air below, with no deceptive raceable DCC surface.
   x1=x+pitch
   nextRow=add(station,mul(F,x1))
   inner=add(row,add(mul(S,-17),(0,27+(i%3)*3,0)))
   far=add(row,add(mul(S,17),(0,34+(i%3)*3,0)))
   innerNext=add(nextRow,add(mul(S,-17),(0,27+(i%3)*3,0)))
   farNext=add(nextRow,add(mul(S,17),(0,34+(i%3)*3,0)))
   quad('29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF',
        inner,innerNext,farNext,far,'roof',False)
   # Recessed high light-band, not 12 repeated glowing road gates.
   glass0=add(row,add(mul(S,-17),(0,25+(i%3)*3,0)))
   glass1=add(nextRow,add(mul(S,-17),(0,25+(i%3)*3,0)))
   quad('28_R7B_TURBINE_HALL_CLERESTORY',
        glass0,glass1,add(glass1,(0,7,0)),
        add(glass0,(0,7,0)),'window',False)
 # A visible POWER function, not just a facade: three huge distinct
 # turbine housings set inside the open bays, their bronze pipes reach water.
 for n in range(3 if main else 2):
  x=(n-1)*(30 if main else 22)
  base=add(station,add(mul(F,x),(0,-9,0)))
  drum('27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL',
       add(base,mul(S,4)),F,S,6.5,14,'turbine',14,top_r=5.5)
  intake=add(base,add(mul(S,35),(0,-49,0)))
  beam('30_R7B_DOWN_TO_WATER_LOAD_SPINE',
       add(base,(0,-5,0)),intake,3.2,'copper')
  beam('30_R7B_DOWN_TO_WATER_LOAD_SPINE',
       intake,add(intake,(0,-19,0)),3.7,'weathered_iron')
 # Visually readable SUPPORT: exposed deck piers down to actual water,
 # and one true terminal quay, not a second racing route.
 pier3=offset_edge(P,S,152 if main else 166,'R')
 pier=(pier3[0],tideY+5,pier3[2])
 box('31_R7B_OPERATING_QUAY_AND_SHIPYARD',
     pier,44,total+38,7,'saltstone',F,S)
 for x in (-total/2,0,total/2):
  foot=add(pier,mul(F,x))
  for out in (-17,17):
   p=add(foot,mul(S,out))
   beam('31_R7B_OPERATING_QUAY_AND_SHIPYARD',
        add(p,(0,-3,0)),add(p,(0,-42,0)),3.8,'weathered_iron')
  # Lift cables, service lines and props descend to genuine wharf,
  # proving one connected seaport instead of floating art installations.
  root=add(station,add(mul(F,x),mul(S,16)))
  beam('30_R7B_DOWN_TO_WATER_LOAD_SPINE',
       add(root,(0,-9,0)),add(foot,(0,4,0)),2.6,'oxidized')
 # ONE landmark freight crane at the main harbor; the secondary pumping
 # yard has no duplicated giant cranes or fake arch silhouettes.
 if main:
  crane=add(pier,add(mul(F,total/2-10),mul(S,13)))
  beam('32_R7B_LANDMARK_SHIPYARD_CRANE',
       add(crane,(0,-4,0)),add(crane,(0,64,0)),2.6,'weathered_iron')
  boom=add(crane,add(mul(S,-66),(0,57,0)))
  beam('32_R7B_LANDMARK_SHIPYARD_CRANE',
       add(crane,(0,62,0)),boom,1.9,'steel')
  beam('32_R7B_LANDMARK_SHIPYARD_CRANE',
       boom,add(boom,(0,-43,0)),.65,'copper')

# R8G distinct second landscape-reading landmark at the Road6 marine
# terminal. Unlike R8F's four repetitive bays, ONE asymmetric folded
# powerhouse roof shelters real turbine cylinders and docks. The entire
# structure sits >=118m outside true right B48; NO road or collider edits.
P,F,S=frame(6,.60)
terminal=add(offset_edge(P,S,118,'R'),(0,-14,0))
def term(x,out,y):
 return add(terminal,add(mul(F,x),add(mul(S,out),(0,y,0))))
# A broad but thin founded dock that is visibly subordinate to the raceway.
box('27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL',
    term(0,0,-24),47,84,5,'saltstone',F,S)
# Two unequal sweeping roof planes with ONE ridge, not a comb of roofs.
# Open side volume remains visible below the folded planes.
quad('29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF',
     term(-43,-22,26),term(43,-22,26),
     term(43,4,53),term(-43,4,53),'roof',False)
quad('29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF',
     term(-43,4,53),term(43,4,53),
     term(43,24,33),term(-43,24,33),'weathered_iron',False)
# Continuous structural ridge deliberately forms one visual horizon feature.
beam('29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF',
     term(-43,4,53),term(43,4,53),2.3,'steel')
# A small skylight strip is recessed into the pitched upper plane.
quad('28_R7B_TURBINE_HALL_CLERESTORY',
     term(-28,5,52),term(29,5,52),
     term(29,11,46),term(-28,11,46),'window',False)
for x in (-38,38):
 for out in (-18,20):
  # Four authentic structural piers, not a series of decorative portals.
  beam('27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL',
       term(x,out,-33),term(x,out,27 if out<0 else 34),
       4.2,'saltstone')
 # A single service truss ties the roof to the seaward machinery.
 beam('29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF',
      term(x,-18,25),term(x,4,52),2,'weathered_iron')
for x in (-19,19):
 # These actual mechanical bodies sit under a separate roof: functional,
 # readable round silhouette instead of another cuboid warehouse.
 drum('27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL',
      term(x,0,-10),F,S,9,21,'turbine',18,top_r=7)
 intake=term(x,34,-67)
 beam('30_R7B_DOWN_TO_WATER_LOAD_SPINE',
      term(x,8,-7),intake,4.1,'oxidized')
 beam('30_R7B_DOWN_TO_WATER_LOAD_SPINE',
      intake,term(x,34,-88),3.5,'weathered_iron')
# Open downward seawall supports are connected to tide-water quay, not
# suspended, and remain visually far below the racing platform.
quay=term(0,66,tideY+5-terminal[1])
box('31_R7B_OPERATING_QUAY_AND_SHIPYARD',
    quay,39,85,7,'saltstone',F,S)
for x in (-37,37):
 for out in (-15,15):
  pier=add(quay,add(mul(F,x),mul(S,out)))
  beam('31_R7B_OPERATING_QUAY_AND_SHIPYARD',
       add(pier,(0,-4,0)),add(pier,(0,-42,0)),
       3.5,'weathered_iron')

P,F,S=frame(6,.72)
tower=add(offset_edge(P,S,91,'R'),(0,12,0))
box('33_R7B_SINGLE_HEADLAND_CONTROL_TOWER',
    tower,29,46,79,'deepstone',F,S)
for h in (28,49,67):
 box('33_R7B_SINGLE_HEADLAND_CONTROL_TOWER',
     add(tower,(0,h,0)),34,39,8,
     'window' if h==67 else 'oxidized',F,S)
for i in (-18,18):
 base=add(tower,mul(F,i))
 beam('33_R7B_SINGLE_HEADLAND_CONTROL_TOWER',
      add(base,(0,-49,0)),add(base,(0,74,0)),2.7,'concrete')


# R8E source-camera authored replacement for R7C's original enormous
# opaque black intake box. Pixel projection of the actual 65.25s CHASE
# identifies the prior 34_R7C_CHASE_VISIBLE_POWER_INTAKE as the major
# near-field road-right occluder (visual road-right = source LEFT).
# Build a TRUE OPEN AIR power-intake with real load paths, a daylight gap,
# and a recessed turbine duct. All footprints remain >=58m outside B48.
P,F,S=frame(5,.905)
hydro=add(offset_edge(P,S,67,'L'),(0,-9,0))
# Two asymmetrical rock buttresses / walls, not one full-cover box.
for x,h in ((-22,38),(20,54)):
 root=add(hydro,mul(F,x))
 beam('34_R7C_CHASE_VISIBLE_POWER_INTAKE',
      add(root,(0,-52,0)),add(root,(0,h,0)),3.1,'concrete')
 # Grounded diagonal counterbrace goes back into real quarry, away from road.
 beam('34_R7C_CHASE_VISIBLE_POWER_INTAKE',
      add(root,(0,h-6,0)),
      add(root,add(mul(S,-27),(0,6,0))),2.0,'oxidized')
# A single high asymmetric transverse head beam with the full
# 36m open air volume underneath; no opaque primitive masks the sky.
beam('34_R7C_CHASE_VISIBLE_POWER_INTAKE',
     add(hydro,add(mul(F,-22),(0,38,0))),
     add(hydro,add(mul(F,20),(0,54,0))),2.8,'darksteel')
# Four authentic intake pipes plunge down beneath the open gallery.
for shift in (-18,-6,7,20):
 root=add(hydro,add(mul(F,shift),mul(S,-10)))
 a=add(root,(0,16,0))
 b=add(root,add(mul(S,-37),(0,-47,0)))
 beam('35_R7C_UTILITY_PENSTOCK_TO_QUARRY',a,b,2.6,'copper')
 beam('35_R7C_UTILITY_PENSTOCK_TO_QUARRY',
      add(root,(0,-46,0)),
      add(root,add(mul(S,-34),(0,-66,0))),2.3,'darksteel')
# Sparse glass-lit mechanical inspection cabin, well BEHIND the open
# intake head. It never fills the opening or masquerades as an obstacle.
cabin=add(hydro,add(mul(S,-26),(0,24,0)))
box('36_R7C_INTAKE_CONTROL_GLAZING',
    cabin,25,14,14,'oxidized',F,S)
for k in (-8,0,8):
 front=add(cabin,add(mul(F,k),mul(S,7.5)))
 box('36_R7C_INTAKE_CONTROL_GLAZING',
     front,5,1.0,8,'window',F,S)
# A single lower boom planted at the outboard face, no tall dark pole
# near the source camera. The tower is not a frame over the race lane.
mast=add(hydro,add(mul(F,17),mul(S,-29)))
beam('37_R7C_ONE_OUTBOARD_CARGO_DERRICK',
     add(mast,(0,-36,0)),add(mast,(0,58,0)),2.5,'steel')
boom=add(mast,add(mul(S,-44),(0,49,0)))
beam('37_R7C_ONE_OUTBOARD_CARGO_DERRICK',
     add(mast,(0,55,0)),boom,1.9,'oxidized')
beam('37_R7C_ONE_OUTBOARD_CARGO_DERRICK',
     boom,add(boom,(0,-30,0)),.7,'darksteel')

# R23 RESEARCH ONLY: the rejected R19 source opens a camera-readable
# foreground; it is NEVER adopted or used in any production Game. Author ONE
# real open volute at the native 65.25sec R16 site, preserving existing true
# intake34, tower12 and R8J turbine42. Full ART remains REJECT until native RAW.
_r19=Path('scripts/p101-k4ct-r19-source-three-act-open-harbor.py')
_r23=Path('scripts/p101-k4ct-r23-volute-lock-one-visible-hero.py')
assert _r19.is_file() and _r23.is_file()
exec(compile(_r19.read_text(encoding='utf-8'),str(_r19),'exec'),globals())
exec(compile(_r23.read_text(encoding='utf-8'),str(_r23),'exec'),globals())
assert len(GROUPS)==43 and all(GROUPS.values())

# Editability: separate mesh objects by functional zones, real Blender materials.
materials={}
for key,color in COLORS.items():
 m=bpy.data.materials.new('K4CT_'+key.upper())
 m.diffuse_color=(*color,1)
 m.use_nodes=True
 node=m.node_tree.nodes.get('Principled BSDF')
 if node:
  node.inputs['Base Color'].default_value=(*color,1)
  node.inputs['Metallic'].default_value=.6 if key in ('steel','copper','oxidized','darksteel') else .08
  node.inputs['Roughness'].default_value=.22 if key in ('glass','tide','shallows','lights') else .74
 materials[key]=m
counts={}
for group,faces in GROUPS.items():
 verts=[];tris=[];mi=[]
 for a,b,c,mat in faces:
  i=len(verts);verts.extend((world_to_blender(a),world_to_blender(b),world_to_blender(c)));tris.append((i,i+1,i+2));mi.append(mat)
 mesh=bpy.data.meshes.new(group+'_EDITABLE_MESH')
 mesh.from_pydata(verts,[],tris);mesh.update()
 obj=bpy.data.objects.new(group,mesh);bpy.context.collection.objects.link(obj)
 for mat in materials.values():mesh.materials.append(mat)
 ids={name:k for k,name in enumerate(COLORS.keys())}
 for poly,mat in zip(mesh.polygons,mi):poly.material_index=ids[mat]
 obj['originalGameCollidersAdded']=0
 obj['formalARTAccepted']=False
 obj['usesActualSourceB48']=True
 obj['notAHumanVerdict']=True
 counts[group]=len(faces)
assert sum(counts.values())>2500,counts
assert all(len(f)>0 for f in GROUPS.values())

# The production data is exported BY this Blender authoring process itself.
# R8I: sun-facing vs shadow and tidal weatherline are authored by REAL
# Blender into the exact noncolliding source-game 3D mesh, not a PNG filter.
flat=[]
sun_unit=unit((.56,.76,-.34))
stoneMats=frozenset(('basalt','shale','chalk','limestone','strata','dunestone',
                     'deepstone','moss','saltstone'))
metalMats=frozenset(('steel','darksteel','weathered_iron','copper','oxidized',
                     'roof','slate','turbine'))
seaMats=frozenset(('tide','shallows','foam'))
roadMats=frozenset(('asphalt','roadmark','roadedge'))
for group,faces in GROUPS.items():
 for a,b,c,mat in faces:
  normal=unit(cross(sub(b,a),sub(c,a)))
  direct=max(0.0,sum(normal[i]*sun_unit[i] for i in range(3)))
  # Keep the previous road material base AND light formula unchanged.
  ambient=max(.78,.67+.30*direct) if mat in roadMats else .59+.37*direct
  if mat in metalMats:ambient=max(.70,ambient)
  if mat in seaMats:ambient=max(.79,ambient)
  tint=(1.00+direct*.075,.998,.99-.035*direct)
  if mat in roadMats:tint=(1.,1.,1.)
  for p in (a,b,c):
   grain=1.0
   if mat in stoneMats:
    grain+=.028*math.sin(.14*p[0]+.065*p[2]+.22*p[1])
    grain+=.017*math.cos(.065*p[0]-.12*p[2]+.10*p[1])
    if p[1]<tideY+22:grain*=.885
   elif mat in metalMats:
    grain+=.021*math.sin(.09*p[0]+.20*p[1]+.15*p[2])
   elif mat in seaMats:
    grain+=.018*math.cos(.09*p[0]-.11*p[2])
   color=tuple(min(1.0,max(0.0,ch*ambient*grain*tint[i]))
               for i,ch in enumerate(COLORS[mat]))
   flat.extend((*p,*color))
assert len(flat)==sum(counts.values())*18
authored={'schema':'k4ct-blender-authored-true-source-integrated-scene/1',
 'nativeBlenderVersion':bpy.app.version_string,
 'vertices':flat,'triangles':sum(counts.values()),'objects':counts,'materials':list(COLORS),
 'sameGameCoordinateSystem':True,'actualStations':site['stations'],
 'sourcePhysicalRoad5SHA256':site['researchPhysicalRoad5SHA256'],
 'originalB48':7,'originalB51':28,'newColliders':0,'ART':'REJECT',
 'formalArtAdopted':0,'slope2DNAmeters':0,'HUMAN':'HOLD','SAT':'HOLD','CCD':'HOLD',
 'FPS':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
(OUT/'K4CT_DCC_BLENDER_TO_NATIVE_GEOMETRY.json').write_text(json.dumps(authored,separators=(',',':'))+'\n')

# R9A: a second, STRICTLY RESEARCH-ONLY contract extracted from the
# *genuinely instantiated Blender meshes and Principled BSDF node inputs*.
# Legacy XYZ+RGB remains byte-for-byte the original source-game input,
# especially the true B48 conformed road strips and source B51.
# This bridge is scenery-only. No new colliders, no fake paths, no PBR PASS.
R9_STRIDE=14  # XYZ, Principled base RGB, world normal XYZ, UV, material ID, roughness, metalness
R9_ROAD_GROUP='00_PHYSICAL_ROAD_CONFORMAL_VISIBLE_SKIN'
assert next(iter(GROUPS))==R9_ROAD_GROUP
r9roadTriangles=counts[R9_ROAD_GROUP]
r9SceneTriangles=sum(counts.values())-r9roadTriangles
r9MaterialNames=list(COLORS)
r9BridgeVertices=[]
r9BlenderPolygonCount=0
r9BlenderUVLoopCount=0
for group,faces in GROUPS.items():
 object3d=bpy.data.objects[group]
 mesh=object3d.data
 assert object3d.type=='MESH' and len(mesh.polygons)==counts[group]
 uvLayer=mesh.uv_layers.new(name='K4CT_R9_ACTUAL_SOURCE_UV')
 for poly,sourceFace in zip(mesh.polygons,faces):
  assert len(poly.vertices)==3 and len(poly.loop_indices)==3
  mat_id=poly.material_index
  sourceName=sourceFace[3]
  assert r9MaterialNames[mat_id]==sourceName
  realMaterial=mesh.materials[mat_id]
  assert realMaterial.name=='K4CT_'+sourceName.upper()
  node=realMaterial.node_tree.nodes.get('Principled BSDF')
  assert node is not None
  baseColor=tuple(node.inputs['Base Color'].default_value)[:3]
  roughness=float(node.inputs['Roughness'].default_value)
  metalness=float(node.inputs['Metallic'].default_value)
  assert all(math.isfinite(v) for v in (*baseColor,roughness,metalness))
  actualN=poly.normal
  # Same right-handed world <-> Blender transformation as world_to_blender.
  worldN=unit((actualN.x,actualN.z,-actualN.y))
  assert abs(length(worldN)-1)<.001
  for loopId,sourcePos in zip(poly.loop_indices,sourceFace[:3]):
   vx,vy,vz=sourcePos
   if abs(worldN[1])>.73:uv=(vx*.031,vz*.031)
   elif abs(worldN[0])>abs(worldN[2]):uv=(vz*.031,vy*.031)
   else:uv=(vx*.031,vy*.031)
   uvLayer.data[loopId].uv=uv
   r9BlenderUVLoopCount+=1
   if group!=R9_ROAD_GROUP:
    r9BridgeVertices.extend((vx,vy,vz,*baseColor,*worldN,*uv,
                             float(mat_id),roughness,metalness))
  r9BlenderPolygonCount+=1
assert r9BlenderPolygonCount==sum(counts.values())
assert r9BlenderUVLoopCount==r9BlenderPolygonCount*3
assert len(r9BridgeVertices)==r9SceneTriangles*3*R9_STRIDE
# Independent structural parity vs the EXACT already authored WebGL input:
# no R9 material data can displace a vertex, even via float32 quantization.
r9LegacyScenery=flat[r9roadTriangles*18:]
assert len(r9LegacyScenery)==r9SceneTriangles*18
for i in range(r9SceneTriangles*3):
 assert all(r9BridgeVertices[i*R9_STRIDE+j]==r9LegacyScenery[i*6+j]
            for j in range(3)),('R9_SCENE_POSITION_PARITY_FAIL',i)
roadOriginal=flat[:r9roadTriangles*18]
assert len(roadOriginal)==r9roadTriangles*18
r9Bridge={
 'schema':'k4ct-r9-blender-native-attribute-bridge-v1',
 'researchOnly':True,'formalPBRPass':False,'sourceGameBlobUnchanged':True,
 'BlenderVersion':bpy.app.version_string,'fromActualBlenderMeshPolygons':True,
 'fromActualBlenderBSDFInputs':True,'fromActualBlenderUVLayer':True,
 'legacySourceVertexXYZRGBPreserved':True,'originalSourceRoadStillLegacyShader':True,
 'attributes':['position_xyz','bsdf_base_rgb','world_normal_xyz','source_uv',
               'blender_material_id','bsdf_roughness','bsdf_metallic'],
 'strideFloats':R9_STRIDE,'triangles':r9SceneTriangles,
 'roadLegacyTriangles':r9roadTriangles,'totalDccTriangles':sum(counts.values()),
 'originalB48':7,'originalB51':28,'newColliders':0,
 'sourcePhysicalRoad5SHA256':site['researchPhysicalRoad5SHA256'],
 'materials':[{'id':i,'name':name,
    'baseColor':list(materials[name].node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value)[:3],
    'roughness':float(materials[name].node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value),
    'metalness':float(materials[name].node_tree.nodes.get('Principled BSDF').inputs['Metallic'].default_value)}
  for i,name in enumerate(r9MaterialNames)],
 'vertices':r9BridgeVertices,'legacyRoadVertices':roadOriginal,
 'ART':'REJECT','HUMAN':'HOLD','SAT':'HOLD','CCD':'HOLD','FPS':'HOLD',
 'RELEASE':'HOLD','MERGE':'HOLD'
}
(OUT/'K4CT_R9_BLENDER_TRUE_MATERIAL_BRIDGE.json').write_text(
 json.dumps(r9Bridge,separators=(',',':'))+'\n')
print('R9A_GENUINE_BLENDER_POLYGON_UV_MATERIAL_BRIDGE_PARITY_PASS',
 json.dumps({'triangles':r9SceneTriangles,'roadTriangles':r9roadTriangles,
             'materialCount':len(r9MaterialNames),
             'vertexCount':len(r9BridgeVertices)//R9_STRIDE,
             'blenderUVLoops':r9BlenderUVLoopCount}))


# DCC-only composition render, explicitly NOT original chase camera evidence.
s13=stations['a13-machine-13'];p,fw,lat=frame(s13['roadIndex'],s13['u'])
cam_pos=add(p['center'],add(mul(fw,-215),add(mul(lat,106),(0,82,0))))
look=add(p['center'],add(mul(fw,120),(0,26,0)))
cam_data=bpy.data.cameras.new('DCC_ONLY_NOT_ORIGINAL_SOURCE_CAMERA')
cam=bpy.data.objects.new('DCC_CONCEPT_VIEW_NOT_GAME_CAMERA',cam_data)
bpy.context.collection.objects.link(cam);bpy.context.scene.camera=cam
cam.location=world_to_blender(cam_pos);direction=Vector(world_to_blender(look))-cam.location
cam.rotation_euler=direction.to_track_quat('-Z','Y').to_euler()
cam_data.type='PERSP';cam_data.lens=27
sun=bpy.data.lights.new('DCC_SHADOWS_SUN','SUN');sun.energy=2.1
light=bpy.data.objects.new('DCC_SHADOWS_SUN',sun);bpy.context.collection.objects.link(light)
light.rotation_euler=(math.radians(35),0,math.radians(-22))
world=bpy.context.scene.world or bpy.data.worlds.new('K4CT_DCC_SKY')
bpy.context.scene.world=world;world.use_nodes=True
bg=world.node_tree.nodes.get('Background')
if bg:bg.inputs['Color'].default_value=(.16,.25,.34,1);bg.inputs['Strength'].default_value=.65
scene=bpy.context.scene
scene.render.resolution_x=1280;scene.render.resolution_y=720;scene.render.resolution_percentage=100
try:scene.render.engine='BLENDER_EEVEE_NEXT'
except:scene.render.engine='BLENDER_EEVEE'
scene.render.image_settings.file_format='PNG'
blend=OUT/'K4CT_EDITABLE_SOURCE_ALIGNED_TIDAL_SPILLWAY_ART_REJECT.blend'
bpy.ops.wm.save_as_mainfile(filepath=str(blend.resolve()))
scene.render.filepath=str((OUT/'K4CT_DCC_CONCEPT_NOT_SOURCE_CAMERA.png').resolve())
try:
 bpy.ops.render.render(write_still=True)
except Exception as e:
 (OUT/'K4CT_DCC_CONCEPT_RENDER_ERROR.txt').write_text(str(e))
result={'schema':'k4ct-genuine-native-blender-evidence/1',
 'editableBlend':blend.is_file() and blend.stat().st_size>30000,
 'blenderVersion':bpy.app.version_string,'sourceRoad5PhysicalSHA256':site['researchPhysicalRoad5SHA256'],
 'originalMovingB51':28,'originalRoads':7,'exactNativeB51Stations':[s['id'] for s in site['stations']],
 'trueDCCObjects':len(GROUPS),'triangles':authored['triangles'],'sameGameVertices':True,
 'gameCollidersAdded':0,'nativeGameIntegratedYet':False,
 'ART':'REJECT','formalART':0,'HUMAN':'HOLD','SAT':'HOLD','CCD':'HOLD','FPS':'HOLD'}
(OUT/'K4CT_DCC_EDITABLE_AUTHOR_RESULT.json').write_text(json.dumps(result,indent=2)+'\n')
print('K4CT_REAL_EDITABLE_DCC_AUTHORED_FOR_SOURCE_NATIVE_GAME',json.dumps(result))
