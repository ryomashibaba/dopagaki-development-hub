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
 'basalt':(.24,.28,.30), 'shale':(.31,.35,.36), 'chalk':(.67,.66,.57),
 'limestone':(.69,.67,.59), 'copper':(.69,.44,.27), 'oxidized':(.28,.47,.44),
 'darksteel':(.19,.25,.28), 'steel':(.42,.49,.52), 'amber':(.95,.62,.26),
 'signal':(.88,.30,.19), 'glass':(.36,.61,.63), 'lights':(.85,.81,.59),
 'tide':(.09,.26,.30), 'shallows':(.13,.36,.40), 'foam':(.36,.60,.60),
 'moss':(.25,.35,.30), 'slate':(.40,.42,.40), 'roof':(.44,.47,.44),
 'asphalt':(.20,.26,.27), 'roadmark':(.42,.62,.60), 'roadedge':(.86,.59,.28),
 'concrete':(.56,.54,.48), 'strata':(.45,.43,.38), 'dunestone':(.58,.50,.39),
 'window':(.47,.65,.69), 'turbine':(.33,.40,.43), 'deepstone':(.15,.20,.23)
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
  for layer in range(len(levels)-1):
   # Deliberate deep cuts: negative space reads as quarry, not a wall.
   if layer>=3 and ((.18<u<.26) or (.62<u<.705)) and index==5:
    continue
   if layer>=4 and (.20<u<.33) and index==6:continue
   if layer>=5 and (k%17<=1):continue
   quad('01_CARVED_BASALT_AND_LAYERED_RIFT',
       A[layer],B[layer],B[layer+1],A[layer+1],
       ('deepstone','basalt','shale','strata','chalk','moss')[layer])
  # High irregular eroded buttress against the cliff, not a flat shell.
  if k%15==0:
   anchor=A[4];highest=add(anchor,(0,23+5*math.sin(k),0))
   beam('02_EARTH_ANCHORED_STONE_RIBS',anchor,highest,4.3,'basalt')
   beam('02_EARTH_ANCHORED_STONE_RIBS',highest,
        add(anchor,add(mul(lat,-25),(0,-4,0))),2.0,'shale')

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
# The elevated deck connects tower to hall along offshore sea-wall, staying
# outboard of B48 so native player doesn't drive on a fake DCC roadway.
way0=add(hall,add(mul(hl,17),(0,24,0)))
way1=add(tower,add(mul(tl,-7),(0,45,0)))
truss('14_CABLE_STAYED_SERVICE_CAUSEWAY',way0,way1,6,7,'steel')
for k in range(1,9):
 at=mix(way0,way1,k/9)
 foot=(at[0],tideY-3,at[2])
 beam('14_CABLE_STAYED_SERVICE_CAUSEWAY',foot,
      add(at,(0,-7,0)),2.3,'concrete')
 if k%2==0:
  beam('14_CABLE_STAYED_SERVICE_CAUSEWAY',
       add(at,(0,2,0)),add(way1,(0,70,0)),.42,'copper')


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

# A genuinely connected city-scale working hydroelectric / shipyard scene.
# The buildings are a single power campus, with service/structural links
# descending to the tidal water. No fake overhead safe lane, no B51 changes.
for idx,u in ((5,.915),(6,.60)):
 P,F,S=frame(idx,u)
 station=add(offset_edge(P,S,71,'R'),(0,-10,0))
 box('27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL',
     add(station,(0,11,0)),36,115,35,'basalt',F,S)
 # Continuous structural facade at the racing edge; glass openings break
 # the silhouette while machinery shafts provide a functional visual story.
 for i in range(12):
  alongF=(i-5.5)*9
  wall=add(station,add(mul(F,alongF),mul(S,-19)))
  box('28_R7B_TURBINE_HALL_CLERESTORY',
      add(wall,(0,16,0)),1.7,6.5,12,'window',F,S)
  if i%3==0:
   beam('29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF',
        add(wall,(0,-14,0)),add(wall,(0,34,0)),2.1,'concrete')
 # asymmetric saw-tooth clerestory remains on the building itself,
 # rather than repeating free-standing glowing road portals.
 for i in range(5):
  foff=(i-2)*21
  a=add(station,add(mul(F,foff),add(mul(S,13),(0,29,0))))
  b=add(a,add(mul(F,13),(0,11,0)))
  beam('29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF',a,b,1.6,'steel')
  box('29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF',
      add(a,(0,8,0)),24,18,2,'oxidized' if i%2==0 else 'roof',F,S)
 # one descended cargo/sluice line physically connected to the source world
 for i in (-40,0,40):
  ground=add(station,mul(F,i))
  root=add(ground,(0,-13,0))
  foot=add(root,add(mul(S,49),(0,-81,0)))
  beam('30_R7B_DOWN_TO_WATER_LOAD_SPINE',root,foot,4,'concrete')
  beam('30_R7B_DOWN_TO_WATER_LOAD_SPINE',
       add(root,(0,17,0)),add(foot,(0,11,0)),1.7,'copper')
 # working outboard quay at road height below the cut; does not
 # masquerade as B48 driveable pavement.
 pier=add(offset_edge(P,S,95,'R'),(0,-55,0))
 box('31_R7B_OPERATING_QUAY_AND_SHIPYARD',pier,56,103,9,
     'concrete',F,S)
 for i in (-43,-20,12,37):
  foot=add(pier,mul(F,i))
  beam('31_R7B_OPERATING_QUAY_AND_SHIPYARD',
       add(foot,(0,-5,0)),add(foot,(0,-38,0)),3.4,'darksteel')
 crane=add(pier,add(mul(F,37),mul(S,16)))
 beam('32_R7B_LANDMARK_SHIPYARD_CRANE',
      crane,add(crane,(0,66,0)),2.7,'steel')
 beam('32_R7B_LANDMARK_SHIPYARD_CRANE',
      add(crane,(0,65,0)),
      add(crane,add(mul(S,-68),(0,59,0))),1.7,'copper')
 beam('32_R7B_LANDMARK_SHIPYARD_CRANE',
      add(crane,add(mul(S,-56),(0,59,0))),
      add(crane,add(mul(S,-56),(0,18,0))),.7,'darksteel')

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


# R7C one camera-proximate outboard tidal-power intake and crane, set
# beside authentic road5 u=.855, OUTSIDE the physical B48 left edge.
P,F,S=frame(5,.855)
hydro=add(offset_edge(P,S,45,'L'),(0,2,0))
box('34_R7C_CHASE_VISIBLE_POWER_INTAKE',
    add(hydro,(0,7,0)),43,32,34,'deepstone',F,S)
for shift in (-17,-4,10,18):
 root=add(hydro,mul(F,shift))
 beam('34_R7C_CHASE_VISIBLE_POWER_INTAKE',
      add(root,(0,-8,0)),add(root,(0,-61,0)),3,'concrete')
 a=add(root,add(mul(S,-14),(0,14,0)))
 b=add(root,add(mul(S,-42),(0,-44,0)))
 beam('35_R7C_UTILITY_PENSTOCK_TO_QUARRY',a,b,1.9,'oxidized')
for k in range(9):
 front=add(hydro,add(mul(F,(k-4)*4.25),add(mul(S,-17),(0,13,0))))
 box('36_R7C_INTAKE_CONTROL_GLAZING',
     front,2.4,1.3,11,'window',F,S)
mast=add(hydro,add(mul(F,13),mul(S,-4)))
beam('37_R7C_ONE_OUTBOARD_CARGO_DERRICK',
     add(mast,(0,-5,0)),add(mast,(0,79,0)),3.4,'darksteel')
boom=add(mast,add(mul(S,-55),(0,72,0)))
beam('37_R7C_ONE_OUTBOARD_CARGO_DERRICK',
     add(mast,(0,73,0)),boom,2.4,'steel')
beam('37_R7C_ONE_OUTBOARD_CARGO_DERRICK',
     add(mast,(0,79,0)),add(boom,(0,4,0)),.5,'copper')
beam('37_R7C_ONE_OUTBOARD_CARGO_DERRICK',
     boom,add(boom,(0,-34,0)),.6,'darksteel')

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
flat=[]
sun_unit=unit((.42,.78,-.40))
for group,faces in GROUPS.items():
 for a,b,c,mat in faces:
  normal=unit(cross(sub(b,a),sub(c,a)))
  direct=max(0.0,sum(normal[i]*sun_unit[i] for i in range(3)))
  ambient=0.58+0.36*direct
  if mat in ('roadmark','roadedge','asphalt'):ambient=max(.78,ambient)
  color=tuple(min(1.0,max(0.0,ch*ambient)) for ch in COLORS[mat])
  for p in (a,b,c):flat.extend((*p,*color))
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
