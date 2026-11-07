"""R25 RESEARCH ONLY: camera-anchor-gated one-piece tidal-port relief.
This file is injected into a TEMPORARY copy of verified R12A Blender author.
There is no permanent modification to source author, original game, camera,
B48 road, 28 B51 movers, 240Hz physics, PR, Gold, or formal QA.
No geometry or screenshots are ART approval. Camera decides after native GL RAW.
The visual hypothesis is an excavated shoreline and ONE load-bearing hydraulic
harbor, not a second isolated turbine, repeating slab water, barge or fake lane.
"""
import math, json
from pathlib import Path
assert site['sourceGameBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert site['researchPhysicalRoad5SHA256']=='4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b'
assert site['originalB48Count']==7 and site['originalB51Count']==28
assert len(GROUPS)==43
protected_names=(
 '00_PHYSICAL_ROAD_CONFORMAL_VISIBLE_SKIN',
 '12_SINGLE_TIDAL_LIFT_AND_CONTROL_TOWER',
 '13_CONTROL_FLOOR_GLAZING',
 '19_R6_SOURCE_FRAMED_UPPER_TIDAL_FOREBAY',
 '34_R7C_CHASE_VISIBLE_POWER_INTAKE',
 '35_R7C_UTILITY_PENSTOCK_TO_QUARRY',
 '41_R8J_COASTAL_TIDAL_TURBINE_CROWN',
 '42_R8J_QUARRY_ANCHORED_TURBINE_PENSTOCK'
)
protected={k:len(GROUPS[k]) for k in protected_names}
assert all(protected.values())
names={k[:2]:k for k in GROUPS}
rework_ids=('03','04','05','06','07','08','15','16','17',
            '21','25','26','27','28','29','30','31','32','33')
rework={names[k] for k in rework_ids}
assert not (rework & set(protected))
for k in rework: GROUPS[k].clear()
G=lambda k:names[k]
def bp(idx,u,d,up=0,bank='R'):
 p,F,S=frame(idx,max(0,min(1,u)))
 return add(offset_edge(p,S,d,bank),(0,up,0))
def loc(idx,u,alongM,outM,yOffset,bank='R'):
 p,F,S=frame(idx,u)
 return add(bp(idx,u,outM,yOffset,bank),mul(F,alongM))
def rockpatch(group,idx,u,bank,dist,span,width,peak,seed):
 p,F,S=frame(idx,u)
 O=S if bank=='R' else mul(S,-1)
 centre=offset_edge(p,S,dist,bank)
 # Nine genuinely non-planar eroded sectors with a single asymmetric peak.
 lower=[];upper=[]
 for i in range(9):
  a=2*math.pi*i/9
  irregular=1+.19*math.sin(a*3+seed)+.11*math.cos(a*5-seed*.4)
  offset=add(mul(F,span*.5*math.cos(a)*irregular),
             mul(O,width*.5*math.sin(a)*irregular))
  foot=add(centre,add(offset,(0,-29,0)))
  height=peak*(.72+.23*math.sin(a*2.4+seed))+.6*math.sin(a*5+seed)
  top=add(centre,add(mul(offset,.79),(0,height-18,0)))
  lower.append(foot);upper.append(top)
 for i in range(9):
  j=(i+1)%9
  quad(group,lower[i],lower[j],upper[j],upper[i],
       ('basalt','shale','deepstone','dunestone')[(i+seed)%4],False)
 # Irregular organic stone summit, triangulated to an offset spine.
 topcentre=add(centre,add(mul(F,span*.09),(0,peak-12,0)))
 for i in range(9):tri(group,topcentre,upper[i],upper[(i+1)%9],'shale')
 return centre
# All big old roof/hall strips and far-off ships are deliberately removed.
# Source geometry remains a meaningful rock/water watershed with breathable sky.
for idx in (5,6):
 n=38
 for i in range(n):
  a=i/n;b=(i+1)/n;mid=(a+b)*.5
  # Slow-varying cross-section. Low-frequency irregular bays, no repeating tile grid.
  def section(t):
   P,_,S=frame(idx,t)
   edge=P['right']
   drift=7*math.sin(t*5.4+idx*.6)+3*math.sin(t*13.2+1.7)
   level=max(tideY+19.0,edge[1]-25.0)
   return [
    bp(idx,t,33,-12),
    bp(idx,t,53,-20+1.5*math.sin(t*10+idx)),
    bp(idx,t,82,level-edge[1]+11),
    bp(idx,t,109+drift,level-edge[1]),
    bp(idx,t,140+drift*.7,tideY+4-edge[1]),
    bp(idx,t,217+drift,tideY+1.2-edge[1]),
    bp(idx,t,398+drift,tideY-edge[1])
   ]
  A=section(a);B=section(b)
  for j,mat in enumerate(('basalt','shale','saltstone','shallows','tide','tide')):
   # Diagonal organic surface edges, sparse very broad meshes, NOT 144 water bands.
   quad(G('03'),A[j],B[j],B[j+1],A[j+1],mat,False)
  # Deep scored erosion reveals real volume only where bank changes direction.
  if idx==5 and i in (9,25) or idx==6 and i in (13,31):
   shore=bp(idx,mid,76,-32)
   crest=bp(idx,mid,103,2)
   beam(G('04'),shore,crest,3.4,'shale')
# Carved headlands are spaced, sculpted volumes (no long opaque left-hand wall).
for row in ((5,.18,'L',103,1),(5,.64,'L',89,2),
            (6,.39,'L',91,3),(6,.89,'L',99,4)):
 rockpatch(G('21'),row[0],row[1],row[2],row[3],32,44,29,row[4])
for row in ((5,.22,'R',93,5),(5,.68,'R',101,6),
            (6,.36,'R',97,7),(6,.83,'R',104,8)):
 anchor=rockpatch(G('25'),row[0],row[1],row[2],row[3],48,52,24,row[4])
 below=add(anchor,(0,-42,0))
 beam(G('26'),below,add(anchor,(0,3,0)),3.6,'basalt')
# Real 3D unit of port architecture; upper reservoir lip comes near SOURCE
# Road5 right bank at .92, avoiding R24's invisible outboard-125m gate.
p,fw,lat=frame(5,.923)
upper=max(tideY+19,p['right'][1]-25)
lip=bp(5,.923,72,upper-p['right'][1])
basin=bp(5,.923,106,tideY+8-p['right'][1])
# 06: ONE short vaulted concrete water intake, not a 190m gray lintel.
# The sculpted 26m saddle rises directly from the rocky bank.
for i in range(16):
 a=-1.08+2.16*i/16;b=-1.08+2.16*(i+1)/16
 def vault(t,r,y,d=0):
  return add(lip,add(mul(fw,r*math.sin(t)),
   add(mul(lat,d),(0,y+r*.56*math.cos(t),0))))
 quad(G('06'),vault(a,23,-13,0),vault(b,23,-13,0),
      vault(b,23,-13,7),vault(a,23,-13,7),'saltstone',False)
 quad(G('06'),vault(a,18,-13,-1),vault(b,18,-13,-1),
      vault(b,23,-13,0),vault(a,23,-13,0),'weathered_iron',False)
# Feet plunge below waterline and meet actual rock, NOT floating lintels.
for x in (-21,21):
 foot=add(lip,mul(fw,x))
 beam(G('06'),add(foot,(0,-47,0)),add(foot,(0,4,0)),3.4,'basalt')
 # 07: Two separate open flood leaves flank the live water throat.
 beam(G('07'),add(foot,(0,2,0)),
      add(foot,add(mul(lat,10),(0,19,0))),2.0,'oxidized')
# 08: one visible in-ground operating piston, no extra decorative wheel.
body=add(lip,add(mul(fw,-15),mul(lat,6)))
beam(G('08'),add(body,(0,-17,0)),add(body,(0,20,0)),2.2,'darksteel')
beam(G('08'),add(body,(0,19,0)),add(lip,(0,8,0)),1.6,'copper')
# 05: explicitly joined gravity water sheet from upper lip to low-tide
# receiving basin. Irregular in width and vertical fold; not flat cyan sea.
for j in range(15):
 x0=-18+36*j/15;x1=-18+36*(j+1)/15
 curl=.6*math.sin(j*1.73)
 a=add(lip,add(mul(fw,x0),(0,3+curl,0)))
 b=add(lip,add(mul(fw,x1),(0,3-curl,0)))
 c=add(basin,add(mul(fw,x1+1),(0,-5,0)))
 d=add(basin,add(mul(fw,x0-1),(0,-5,0)))
 quad(G('05'),a,b,c,d,'foam' if j%5 else 'shallows',False)
# One load-bearing coastal caisson that contains the intake and water.
for i in range(17):
 t0=-1.25+2.50*i/17;t1=-1.25+2.50*(i+1)/17
 def caisson(t,y,r):
  return add(basin,add(mul(fw,r*math.sin(t)),
   add(mul(lat,r*.73*math.cos(t)),(0,y,0))))
 quad(G('27'),caisson(t0,-37,34),caisson(t1,-37,34),
      caisson(t1,8,34),caisson(t0,8,34),'deepstone',False)
 quad(G('27'),caisson(t0,7,34),caisson(t1,7,34),
      caisson(t1,7,30),caisson(t0,7,30),'saltstone',False)
# 28: light cut-outs are between concrete supports, not an opaque roof.
for x in (-16,0,16):
 pane=add(basin,add(mul(fw,x),(0,13,0)))
 quad(G('28'),add(pane,mul(lat,24)),add(pane,add(mul(lat,29),(0,5,0))),
      add(pane,add(mul(lat,29),(0,13,0))),
      add(pane,add(mul(lat,24),(0,8,0))),'window',False)
# 29: asymmetric founded force arch to bank, no repetitive sawtooth slabs.
for x in (-29,29):
 root=add(basin,mul(fw,x))
 crown=add(lip,add(mul(fw,x*.85),(0,6,0)))
 beam(G('29'),add(root,(0,-19,0)),crown,2.9,'weathered_iron')
beam(G('29'),add(basin,(0,19,0)),add(lip,(0,23,0)),2.6,'oxidized')
# 30: a continuous mechanical discharge PENSTOCK OUTBOARD, not a road.
from_head=add(lip,add(mul(lat,4),(0,-8,0)))
into_basin=add(basin,add(mul(lat,23),(0,-16,0)))
beam(G('30'),from_head,into_basin,3.4,'copper')
beam(G('30'),into_basin,add(into_basin,(0,-23,0)),3.0,'oxidized')
# 31: singular founded quay follows caisson and stops, rather than a tiled deck.
dock=add(basin,add(mul(lat,62),(0,-3,0)))
box(G('31'),dock,29,58,5,'saltstone',fw,lat)
for x in (-24,24):
 foot=add(dock,mul(fw,x))
 beam(G('31'),add(foot,(0,-32,0)),add(foot,(0,3,0)),2.8,'basalt')
# 15/16/17: ONE subordinate operative loading apron, not 3 faraway roofed ports.
stage=add(dock,add(mul(lat,23),(0,6,0)))
box(G('15'),stage,23,30,3,'concrete',fw,lat)
tip=add(stage,add(mul(fw,-8),(0,28,0)))
beam(G('16'),add(tip,mul(lat,-8)),add(tip,mul(lat,9)),1.8,'weathered_iron')
quad(G('16'),add(tip,mul(lat,-8)),add(tip,mul(lat,9)),
     add(tip,add(mul(lat,9),mul(fw,17))),
     add(tip,add(mul(lat,-8),mul(fw,17))),'oxidized',False)
boom=add(stage,add(mul(fw,9),(0,3,0)))
beam(G('17'),add(boom,(0,-9,0)),add(boom,(0,29,0)),1.9,'darksteel')
beam(G('17'),add(boom,(0,26,0)),
     add(boom,add(mul(lat,-22),(0,17,0))),1.5,'steel')
# 32: active-looking but STATIC shore-side structural arm (no false B51).
base=add(dock,add(mul(fw,15),(0,0,0)))
beam(G('32'),add(base,(0,-21,0)),add(base,(0,27,0)),1.9,'steel')
beam(G('32'),add(base,(0,24,0)),
     add(base,add(mul(lat,-19),(0,15,0))),1.3,'weathered_iron')
# 33: restrained harbor control signal, BELOW authentic landmark tower12.
marker=add(dock,add(mul(fw,-12),(0,-2,0)))
beam(G('33'),add(marker,(0,-13,0)),add(marker,(0,25,0)),1.6,'oxidized')
drum(G('33'),add(marker,(0,22,0)),fw,lat,3.8,4.0,'glass',12,top_r=2.6)
assert len(GROUPS)==43
assert all(len(GROUPS[g])>0 for g in rework)
assert all(len(GROUPS[g])==n for g,n in protected.items())
assert site['newColliders']==0
print('R25_TEMPORARY_INTEGRATED_TIDAL_PORT_REAL_EDITABLE_GROUPS',
 json.dumps({'rewritten':{g[:2]:len(GROUPS[g]) for g in sorted(rework)},
 'protected':protected,'gateSiteRoad5U':.923,'shorebank':'R',
 'mainNativeB48':7,'mainNativeB51':28,'newColliders':0,
 'formalArt':0,'slope2DNAmeters':0,'needsOriginalNativeGLArtReview':True}))
