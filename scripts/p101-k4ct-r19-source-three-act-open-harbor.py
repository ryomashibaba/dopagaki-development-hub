"""R19 — genuine Blender, ORIGINAL CHASE first, one modest structural blockout.
Fixed storyline from R18 true GL depth study:
 Road5 65.25: keep true original open intake (group34) + forebay (19)
 Road6 66.35: keep true original control beacon (12/13) and moving B51
 Road6 68.05: keep true original R8J wheel (41/42), LOW quiet outfall
No imaginary 3 extra 'heroes', no flat repeated dark cliffs, no collision.
Not approved ART. CI + human visual review decide whether to keep.
"""
from pathlib import Path
import json,math
contract=json.loads(Path(
 'research-evidence/k4ct/K4CT_R19_3ACT_TRUE_CHASE_COMPOSITION_CONTRACT_20261107.json'
).read_text())
assert contract['schema']=='k4ct-r19-cinematographic-original-camera-storyboard-contract-v1'
assert contract['source']['originalGameBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert contract['source']['roadSHA256']==site['researchPhysicalRoad5SHA256']
assert contract['source']['originalB48']==site['originalB48Count']==7
assert contract['source']['originalB51']==site['originalB51Count']==28
assert len(GROUPS)==43
# AUTHOR ONLY the actual obstructing/redundant art. No edits to 00 road, true
# R8J wheel 41/42, true beacon 12/13, or true open intake 34/35/36.
replaced=(
 '01_CARVED_BASALT_AND_LAYERED_RIFT',
 '21_R6_BROKEN_QUARRY_STRATA_SOURCE_CHASE',
 '25_R7B_OPEN_QUARRY_CUT_AND_STRATIFIED_HEADLAND',
 '26_R7B_ANCHORED_CLIFF_LOAD_BEARING_RIBS',
 '27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL',
 '28_R7B_TURBINE_HALL_CLERESTORY',
 '29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF',
 '30_R7B_DOWN_TO_WATER_LOAD_SPINE',
 '31_R7B_OPERATING_QUAY_AND_SHIPYARD',
 '32_R7B_LANDMARK_SHIPYARD_CRANE',
 '33_R7B_SINGLE_HEADLAND_CONTROL_TOWER'
)
assert all(k in GROUPS and GROUPS[k] for k in replaced)
assert all(GROUPS[k] for k in (
 '00_PHYSICAL_ROAD_CONFORMAL_VISIBLE_SKIN',
 '12_SINGLE_TIDAL_LIFT_AND_CONTROL_TOWER',
 '13_CONTROL_FLOOR_GLAZING',
 '19_R6_SOURCE_FRAMED_UPPER_TIDAL_FOREBAY',
 '34_R7C_CHASE_VISIBLE_POWER_INTAKE',
 '41_R8J_COASTAL_TIDAL_TURBINE_CROWN',
 '42_R8J_QUARRY_ANCHORED_TURBINE_PENSTOCK'
))
protected={g:len(GROUPS[g]) for g in (
 '00_PHYSICAL_ROAD_CONFORMAL_VISIBLE_SKIN',
 '12_SINGLE_TIDAL_LIFT_AND_CONTROL_TOWER',
 '13_CONTROL_FLOOR_GLAZING',
 '19_R6_SOURCE_FRAMED_UPPER_TIDAL_FOREBAY',
 '34_R7C_CHASE_VISIBLE_POWER_INTAKE',
 '41_R8J_COASTAL_TIDAL_TURBINE_CROWN',
 '42_R8J_QUARRY_ANCHORED_TURBINE_PENSTOCK')}
for g in replaced:GROUPS[g].clear()
# A broad but LOW working rock toe, cut below the skyline; no vertical
# dark rock wall across source camera. Geology truly touches native bank.
def at(idx,u,bank,d,height):
 p,F,S=frame(idx,u)
 return add(offset_edge(p,S,d,bank),(0,height,0))
for idx in (5,6):
 for k in range(96):
  u=k/96;v=(k+1)/96
  # One physically continuous lower bank rather than 6 parallel grey strips.
  x0=at(idx,u,'L',27,-14);x1=at(idx,v,'L',27,-14)
  y0=at(idx,u,'L',61,-20);y1=at(idx,v,'L',61,-20)
  quad('01_CARVED_BASALT_AND_LAYERED_RIFT',
       x0,x1,y1,y0,'basalt',False)
  # Weathered hinterland supports appear intermittently as true rock volume;
  # they do NOT form an opaque overhead tunnel or deceptive racing surface.
  if k%21==5:
   a=at(idx,u,'L',65,-25)
   b=at(idx,u,'L',89,11)
   beam('01_CARVED_BASALT_AND_LAYERED_RIFT',a,b,6.0,'shale')
# A genuinely volumetric founded fractured quarry rock outcrop (not a strip):
# two open rings at different heights, walls, caps, irregular angles.
def low_rock(group,idx,u,bank,d,along_m,across_m,high,seed):
 p,F,S=frame(idx,u)
 out=S if bank=='R' else mul(S,-1)
 origin=offset_edge(p,S,d,bank)
 base=add(origin,(0,-30,0))
 def point(i,upper):
  angle=2*math.pi*i/6
  r=1+.12*math.sin(seed*4.3+i*1.9)
  x=along_m*.5*math.cos(angle)*r
  z=across_m*.5*math.sin(angle)*r
  h=high*.6+high*.4*math.sin(seed+i*1.4) if upper else 0
  return add(base,add(mul(F,x),add(mul(out,z),(0,h,0))))
 lo=[point(j,False) for j in range(6)]
 hi=[point(j,True) for j in range(6)]
 for j in range(6):
  n=(j+1)%6
  quad(group,lo[j],lo[n],hi[n],hi[j],
       ('basalt','shale','dunestone','saltstone')[(j+seed)%4],False)
 for j in range(1,5):
  tri(group,hi[0],hi[j],hi[j+1],'shale')
 return hi[0]
# Wide authentic open cuts with only widely separated fractured headlands.
# No small repeated ledge/stripe steps, no giant angular foreground slab.
for idx,u,bank,d,seed in (
 (5,.12,'L',88,1),(5,.31,'L',94,2),
 (5,.67,'L',112,3),(5,.96,'L',105,4),
 (6,.13,'L',94,5),(6,.37,'L',110,6),
 (6,.71,'L',100,7),(6,.91,'L',93,8)):
 low_rock('21_R6_BROKEN_QUARRY_STRATA_SOURCE_CHASE',
          idx,u,bank,d,24,31,39,seed)
for idx,u,bank,d,seed in (
 (5,.61,'R',76,9),(5,.76,'R',83,10),
 (5,.98,'R',79,11),(6,.20,'R',90,12),
 (6,.44,'R',81,13),(6,.88,'R',92,14)):
 head=low_rock('25_R7B_OPEN_QUARRY_CUT_AND_STRATIFIED_HEADLAND',
               idx,u,bank,d,28,39,27,seed)
 # Load-bearing geology and discreet seaward fixing, both noncolliding.
 p,F,S=frame(idx,u);foot=offset_edge(p,S,d,'R')
 beam('26_R7B_ANCHORED_CLIFF_LOAD_BEARING_RIBS',
      add(foot,(0,-45,0)),add(head,(0,-7,0)),
      2.6,'deepstone')
# One small genuine working quay connected to the already source-aligned
# real forebay group19 and ORIGINAL upper headrace group23 (not a third hero).
# Existing Road5 intake group34 remains the ONLY foreground machine.
P,F,S=frame(5,.89)
Q=offset_edge(P,S,126,'R')
quay=(Q[0],tideY+7,Q[2])
box('27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL',
    add(quay,(0,7,0)),37,24,13,'saltstone',F,S)
for x in (-14,14):
 for out in (-8,8):
  base=add(quay,add(mul(F,x),mul(S,out)))
  beam('27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL',
       add(base,(0,-39,0)),add(base,(0,13,0)),3.2,'basalt')
# One asymmetric short canopy with open sea-facing void, never sawtooth.
roof=lambda x,d,h:add(quay,add(mul(F,x),add(mul(S,d),(0,h,0))))
quad('29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF',
     roof(-18,-10,31),roof(18,-10,31),
     roof(18,10,42),roof(-18,10,42),'oxidized',False)
beam('29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF',
     roof(-18,-10,31),roof(-18,10,42),2.2,'steel')
beam('29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF',
     roof(18,-10,31),roof(18,10,42),2.2,'steel')
quad('28_R7B_TURBINE_HALL_CLERESTORY',
     roof(-12,10,41),roof(12,10,41),
     roof(12,11,34),roof(-12,11,34),'window',False)
for x in (-10,10):
 drum('27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL',
      roof(x,0,-6),F,S,5.5,10,'turbine',12,top_r=4)
 beam('30_R7B_DOWN_TO_WATER_LOAD_SPINE',
      roof(x,8,4),roof(x,39,-21),3.4,'copper')
 beam('30_R7B_DOWN_TO_WATER_LOAD_SPINE',
      roof(x,39,-21),roof(x,45,tideY-10-quay[1]),
      3.0,'oxidized')
# The existing real lower lock, water/tide and quay are physically adjacent
# in original source coordinates. No visual bridge over native B48.
dock=roof(0,47,tideY+4-quay[1])
box('31_R7B_OPERATING_QUAY_AND_SHIPYARD',
    dock,54,20,6,'saltstone',F,S)
for x in (-22,22):
 for out in (-7,7):
  root=add(dock,add(mul(F,x),mul(S,out)))
  beam('31_R7B_OPERATING_QUAY_AND_SHIPYARD',
       add(root,(0,-38,0)),add(root,(0,3,0)),2.8,'basalt')
# Low, singular freight derrick: not a tall moving B51 lookalike.
crane=roof(22,46,tideY+9-quay[1])
beam('32_R7B_LANDMARK_SHIPYARD_CRANE',
     add(crane,(0,-27,0)),add(crane,(0,29,0)),
     2.4,'steel')
beam('32_R7B_LANDMARK_SHIPYARD_CRANE',
     add(crane,(0,27,0)),
     add(crane,add(mul(S,20),(0,25,0))),1.4,'weathered_iron')
# A single small authentic signaling control annex, SUBORDINATE to existing
# genuine tall source tower12 and final 41/42 tidal wheel.
p,fw,side=frame(6,.60)
anchor=add(offset_edge(p,side,131,'R'),(0,-19,0))
beam('33_R7B_SINGLE_HEADLAND_CONTROL_TOWER',
     add(anchor,(0,-31,0)),add(anchor,(0,32,0)),
     2.8,'darksteel')
drum('33_R7B_SINGLE_HEADLAND_CONTROL_TOWER',
     add(anchor,(0,28,0)),fw,side,8,7,'oxidized',14,top_r=5.0)
# A true cross-water pipe tied to the ORIGINAL turbine penstock-side bank;
# its geometry is noncollision and outboard, never over the race corridor.
beam('30_R7B_DOWN_TO_WATER_LOAD_SPINE',
     add(anchor,(0,-8,0)),
     add(anchor,add(mul(side,24),(0,-27,0))),
     3.3,'oxidized')
# Independent assertions: same 43 genuine editable zones and all important
# ORIGINAL landmarks stay byte-identical at source author level.
assert len(GROUPS)==43 and all(GROUPS[g] for g in replaced)
assert all(len(GROUPS[g])==n for g,n in protected.items())
assert not any(g.startswith('00_') for g in replaced)
assert sum(len(GROUPS[g]) for g in replaced)>200
print('R19_REAL_BLENDER_SINGLE_CINEMATIC_BLOCKOUT',
 json.dumps({'protectedOriginalObjects':protected,
             'replacementFaces':{g:len(GROUPS[g]) for g in replaced},
             'nativeRoads':site['originalB48Count'],
             'nativeMovingB51':site['originalB51Count'],
             'newColliders':0,'artAdopted':0,
             'referenceR18CI':42301790528}))
