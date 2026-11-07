"""R24 genuine Blender: make an actual gradient-driven stepped tidal basin.

The source RAW shows a flat cyan ocean left of the ORIGINAL Road5/6 and
a long grey horizontal slab above it. This replaces 03/04/05 SEA and the
original 06/07/08 four-bay gate with ONE physically founded open two-gate
sluice. It is not a proxy road, a PBR shader, repeated floating bridges,
a new decorative wheel, a fake safe lane or an accepted ART candidate.
R19 rejected low skyline is a research substrate ONLY; original 34 intake,
12 control tower, 41/42 authentic wheel, source Game/7 B48/28 B51/Camera
remain unchanged.
"""
import json,math
from pathlib import Path
r24=json.loads(Path('research-evidence/k4ct/K4CT_R24_TRUE_SOURCE_GRAVITY_TIDAL_SHORELINE_ART_CONTRACT_20261107.json').read_text())
assert r24['schema']=='k4ct-r24-functional-gravity-estuary-source-five-frame-v1'
assert r24['basedOn']['sourceGameBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert site['researchPhysicalRoad5SHA256']==r24['safety']['roadPhysicalSHA256']
assert site['originalB48Count']==7 and site['originalB51Count']==28
assert len(GROUPS)==43
rework={
 '03_CLIFF_TO_WORKING_TIDAL_BASIN',
 '04_MARITIME_CONCRETE_SPILLWAY_BUTTRESSES',
 '05_WATER_TURBULENCE_AND_FOAM',
 '06_ANCHORED_4_BAY_TIDAL_LOCK_AND_SLUICE',
 '07_SLUICE_ARCH_SPILLGATES',
 '08_WORKING_HYDRAULICS_AND_SERVICE'
}
preserve={
 '00_PHYSICAL_ROAD_CONFORMAL_VISIBLE_SKIN',
 '12_SINGLE_TIDAL_LIFT_AND_CONTROL_TOWER',
 '13_CONTROL_FLOOR_GLAZING',
 '19_R6_SOURCE_FRAMED_UPPER_TIDAL_FOREBAY',
 '34_R7C_CHASE_VISIBLE_POWER_INTAKE',
 '41_R8J_COASTAL_TIDAL_TURBINE_CROWN',
 '42_R8J_QUARRY_ANCHORED_TURBINE_PENSTOCK'
}
assert rework.issubset(GROUPS.keys()) and preserve.issubset(GROUPS.keys())
protected={g:len(GROUPS[g]) for g in preserve}
assert all(v>0 for v in protected.values())
for g in rework:GROUPS[g].clear()

# A genuine 3D profiled estuary. This is not a series of six grey flat
# "strata" ribbons: each longitudinal sample has rising road-grade geology,
# an elevated enclosed headrace, narrow aerated water drop, then broad calm
# tide. Gradients are longitudinally continuous (no disconnected pools).
def r24_foothold(p,side,d,y):
 right=p['right']
 return add(offset_edge(p,side,d,'R'),(0,y-right[1],0))
def r24_profile(index,u,p,side):
 rootY=p['right'][1]
 swell=1.10*math.sin(u*13.1+index*.8)+.55*math.sin(u*29.0-index)
 lateral=2.5*math.sin(u*8.3+index*1.2)
 headY=tideY+23.5+0.6*swell
 lowerY=tideY+.65+.20*math.sin(u*17.0+index)
 # Opening's upper bank is closer to source R B48 than active sea,
 # but no art crosses the road and the nearest mesh is 24m outboard.
 pairs=[
  (24,rootY-12), (43,rootY-31),
  (61,tideY+39+1.1*swell),
  (79+lateral*.45,headY+9),
  (100+lateral,headY),
  (122+lateral,headY-.5),
  (140+lateral*.5,tideY+11),
  (159-lateral*.3,lowerY+1),
  (213+lateral,lowerY),
  (440,tideY)
 ]
 return [r24_foothold(p,side,d,y) for d,y in pairs]

for idx in (5,6):
 segments=132
 for k in range(segments):
  u=k/segments;v=(k+1)/segments
  P=sample(idx,u);Q=sample(idx,v)
  _,F,S=frame(idx,(u+v)*.5)
  A=r24_profile(idx,u,P,S)
  B=r24_profile(idx,v,Q,S)
  fallWindow=(idx==5 and .80<u<.995) or (idx==6 and .33<u<.55)
  faces=[
   'basalt','shale','saltstone', 'concrete',
   'shallows', 'foam' if fallWindow else 'slate',
   'shallows' if fallWindow else 'basalt',
   'tide','tide'
  ]
  for layer,mat in enumerate(faces):
   quad('03_CLIFF_TO_WORKING_TIDAL_BASIN',
        A[layer],B[layer],B[layer+1],A[layer+1],mat,False)
  # Only a few fractured natural point bars; no rows of roof teeth.
  if idx==6 and k in (29,49,74,113):
   base=r24_foothold(P,S,172,tideY-.3)
   head=r24_foothold(P,S,163,tideY+4.5)
   beam('04_MARITIME_CONCRETE_SPILLWAY_BUTTRESSES',
        add(base,(0,-19,0)),head,3.1,'shale')

# Four physical structural piers instead of R8's every-eleventh-sample
# pole array; each pier is actually embedded in the bank and floodplain.
for idx,u,d in ((5,.756,71),(5,.920,89),(6,.322,78),(6,.706,76)):
 P,F,S=frame(idx,u)
 coast=r24_foothold(P,S,d,tideY+23)
 seaward=r24_foothold(P,S,d+53,tideY+4)
 beam('04_MARITIME_CONCRETE_SPILLWAY_BUTTRESSES',
      add(coast,(0,-46,0)),coast,4.3,'deepstone')
 beam('04_MARITIME_CONCRETE_SPILLWAY_BUTTRESSES',
      coast,add(seaward,(0,3,0)),2.5,'saltstone')
 beam('04_MARITIME_CONCRETE_SPILLWAY_BUTTRESSES',
      add(seaward,(0,-21,0)),add(seaward,(0,3,0)),3.0,'basalt')

# A single high-head lock, exactly outboard of source Road5 near real
# upstream 34 intake. NO long 190m slab or repeated overhead racing gates.
p,F,S=frame(5,.915)
bank=r24_foothold(p,S,125,tideY+9)
gate="06_ANCHORED_4_BAY_TIDAL_LOCK_AND_SLUICE"
leaves="07_SLUICE_ARCH_SPILLGATES"
hydraulics="08_WORKING_HYDRAULICS_AND_SERVICE"
# Short founded lock basin, 66m along road and 16m outboard width.
box(gate,add(bank,(0,-10,0)),17,67,12,'deepstone',F,S)
# THREE single load-bearing piers form TWO genuine voids; no long lintel
# across the top. Lower water-level remains visible between piers.
for alongM in (-31,0,31):
 at=add(bank,mul(F,alongM))
 beam(gate,add(at,(0,-46,0)),add(at,(0,31,0)),4.8,'saltstone')
 beam(gate,add(at,(0,21,0)),add(at,add(mul(S,-16),(0,32,0))),
      2.1,'weathered_iron')
# One headrace hydraulic dark hatch and two partially raised flood-leaves.
for alongM in (-15.4,15.4):
 A=add(bank,add(mul(F,alongM),(0,0,0)))
 # Gate leaf is a very explicit THICK VOLUME (not a texture) and is
 # 60% raised, with true bright water negative-space beneath.
 box(leaves,add(A,(0,16,-.35)),8.1,25,13,'oxidized',F,S)
 # Mechanical guides retain a visible true hole under the moving leaf.
 for dx in (-10,10):
  root=add(A,add(mul(F,dx),(0,3,0)))
  beam(leaves,root,add(root,(0,32,0)),1.8,'weathered_iron')
 cyl=add(A,(0,31,1))
 beam(hydraulics,add(cyl,(0,-10,0)),add(cyl,(0,24,0)),
      2.3,'steel')
 drum(hydraulics,add(cyl,(0,20,0)),F,S,5.1,8,'copper',12,top_r=3.4)
# One source-to-sluice supply. Outboard path only: no physical race cross.
assert 'r6Head' in globals()
upper=add(r6Head,(0,6,0))
plug=add(bank,add(mul(S,-21),(0,15,0)))
beam(hydraulics,upper,plug,4.3,'oxidized')
beam(hydraulics,plug,add(bank,(0,9,0)),3.9,'weathered_iron')

# Actual transparent-water-free gravity discharge is physically in front
# of the gate: high foaming headrace => 19m lower tide. Never use fake
# shader-only "waterfall", glass opacity, or a static color bar.
fall="05_WATER_TURBULENCE_AND_FOAM"
for i in range(14):
 x0=-29+58*i/14
 x1=-29+58*(i+1)/14
 # Real 3D irregular downward fold. R9 shader will receive real normals.
 wob=.75*math.sin(i*1.9)
 top0=add(bank,add(mul(F,x0),mul(S,8)))
 top1=add(bank,add(mul(F,x1),mul(S,8)))
 upper0=add(top0,(0,8+wob,0));upper1=add(top1,(0,8-wob,0))
 lower0=add(bank,add(mul(F,x0),add(mul(S,33),(0,tideY+1.2-bank[1],0))))
 lower1=add(bank,add(mul(F,x1),add(mul(S,33),(0,tideY+1.2-bank[1],0))))
 quad(fall,upper0,upper1,lower1,lower0,
      'foam' if i%3 else 'shallows',False)
 # Visible foam at actual receiving basin, broken rather than striped.
 if i%2==0:
  a=add(lower0,(0,.34,0))
  b=add(lower1,(0,.34,0))
  quad(fall,a,b,add(b,mul(S,7)),add(a,mul(S,7)),
       'foam',False)

assert len(GROUPS)==43 and all(len(GROUPS[g])>0 for g in rework)
assert all(len(GROUPS[g])==v for g,v in protected.items())
assert sum(len(GROUPS[g]) for g in rework)>3100
assert site['newColliders']==0
print('R24_TRUE_GRAVITY_Estuary_BLENDER_ACTUAL_GROUPS_READY',
 json.dumps({'rewrittenTriangles':{k:len(GROUPS[k]) for k in sorted(rework)},
 'originalProtectedGroups':protected,'originalB48':7,'originalMovingB51':28,
 'seaLevelSourceY':tideY,'upperBasinY':tideY+23.5,'lowerBasinY':tideY,
 'heightDeltaM':23.5,'noOriginalGameOrCameraEdits':True,
 'formalArtAdopted':0,'newColliders':0}))
