"""R15 research-only genuine Blender authoring: integrate the actual visible
forebay, cut-rock coast, landmark generator and working quay into ONE scene.

This is deliberately invoked from the existing real B48/B51-aligned Blender
author AFTER the actual source site has been loaded and BEFORE meshes are
created. Not a rendered-image edit, proxy camera, physics or collider.
R14-style negative-space group21/25 is ONLY a rejected research substrate.
Human/ART/SAT/CCD/FPS/RELEASE/MERGE always HOLD until independently approved.
"""
R15_REPLACE=(
 '03_CLIFF_TO_WORKING_TIDAL_BASIN',
 '04_MARITIME_CONCRETE_SPILLWAY_BUTTRESSES',
 '05_WATER_TURBULENCE_AND_FOAM',
 '19_R6_SOURCE_FRAMED_UPPER_TIDAL_FOREBAY',
 '20_R6_REAL_RETAINING_LOAD_PATHS',
 '27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL',
 '28_R7B_TURBINE_HALL_CLERESTORY',
 '29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF',
 '30_R7B_DOWN_TO_WATER_LOAD_SPINE',
 '31_R7B_OPERATING_QUAY_AND_SHIPYARD',
 '32_R7B_LANDMARK_SHIPYARD_CRANE',
 '33_R7B_SINGLE_HEADLAND_CONTROL_TOWER'
)
assert all(GROUPS.get(k) for k in R15_REPLACE), 'R15_SOURCE_MISSING_TARGET'
assert len(GROUPS)==43,('R15_START_GROUP_COUNT',len(GROUPS))
for k in R15_REPLACE:
 GROUPS.pop(k)

# Source-aligned river estuary: no continuous staircase of slate/concrete.
# The original 7 B48 and 28 animated B51 remain elsewhere untouched.
def R15_at_water(p,dist,y,bank='R'):
 lateral=unit(sub(p['right'],p['left']))
 edge=offset_edge(p,lateral,dist,bank)
 return (edge[0],y,edge[2])
for idx in (5,6):
 for i in range(144):
  u=i/144
  p=sample(idx,u);q=sample(idx,(i+1)/144)
  left=p['right'][1]-17;left2=q['right'][1]-17
  opened=(idx==5 and .69<u<.972) or (idx==6 and .30<u<.76)
  near=R15_at_water(p,26,left)
  near2=R15_at_water(q,26,left2)
  ankle=R15_at_water(p,45,tideY+11)
  ankle2=R15_at_water(q,45,tideY+11)
  if not opened:
   quad('03_CLIFF_TO_WORKING_TIDAL_BASIN',
        near,near2,ankle2,ankle,'basalt',False)
  else:
   # Grounded underwater foundation only; open the CAMERA to real sea.
   toe=R15_at_water(p,39,tideY+9)
   toe2=R15_at_water(q,39,tideY+9)
   quad('03_CLIFF_TO_WORKING_TIDAL_BASIN',
        toe,toe2,ankle2,ankle,'shale',False)
  bed=R15_at_water(p,80,tideY)
  bed2=R15_at_water(q,80,tideY)
  far=R15_at_water(p,440,tideY)
  far2=R15_at_water(q,440,tideY)
  quad('03_CLIFF_TO_WORKING_TIDAL_BASIN',
       ankle,ankle2,bed2,bed,'dunestone',False)
  quad('03_CLIFF_TO_WORKING_TIDAL_BASIN',
       bed,bed2,far2,far,'tide',False)
  if i in (32,79,128):
   foot=R15_at_water(p,50,tideY-35)
   top=R15_at_water(p,50,tideY+15)
   beam('04_MARITIME_CONCRETE_SPILLWAY_BUTTRESSES',
        foot,top,3.8,'saltstone')
  if i in (25,60,103,135):
   a=R15_at_water(p,78,tideY+.22)
   b=R15_at_water(q,78,tideY+.22)
   c=R15_at_water(q,92,tideY+.22)
   d=R15_at_water(p,92,tideY+.22)
   quad('05_WATER_TURBULENCE_AND_FOAM',a,b,c,d,'foam',False)

# Real upstream feed: one broad reservoir bordered by genuine retaining
# cheeks, not a repeated cyan/white staircase.
for idx,u0,u1,waterY in ((5,.60,.94,105.0),(6,.025,.36,93.0)):
 for i in range(72):
  u=u0+(u1-u0)*i/72
  v=u0+(u1-u0)*(i+1)/72
  P=sample(idx,u);Q=sample(idx,v)
  def wp(p,d,h):return R15_at_water(p,d,h)
  for da,db,mat in ((40,49,'deepstone'),(114,125,'saltstone')):
   quad('19_R6_SOURCE_FRAMED_UPPER_TIDAL_FOREBAY',
        wp(P,da,waterY+3),wp(Q,da,waterY+3),
        wp(Q,db,waterY),wp(P,db,waterY),mat,False)
  quad('19_R6_SOURCE_FRAMED_UPPER_TIDAL_FOREBAY',
       wp(P,49,waterY),wp(Q,49,waterY),
       wp(Q,114,waterY),wp(P,114,waterY),'tide',False)
  if i in (6,36,66):
   for d in (45,120):
    beam('20_R6_REAL_RETAINING_LOAD_PATHS',
         wp(P,d,waterY-40),wp(P,d,waterY+5),
         4.0,'basalt')

# An unmistakable, SOURCE-ALIGNED working tidal exchange anchored to the
# real Road5 shoreline and connected to existing R6 headrace and R5 gate.
P,F,S=frame(5,.927)
edge=offset_edge(P,S,114,'R')
origin=(edge[0],tideY+19,edge[2])
def R15_exchange(x,out,up):
 return add(origin,add(mul(F,x),add(mul(S,out),(0,up,0))))
# Only 4 heavy rock-founded bents, not the old white repeated 6-bay roof.
for x,height in ((-50,69),(44,85)):
 for out in (-14,34):
  beam('27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL',
       R15_exchange(x,out,-62),R15_exchange(x,out,height),
       5.2,'basalt' if out>0 else 'saltstone')
 beam('27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL',
      R15_exchange(x,34,6),R15_exchange(x,11,height+7),
      4.0,'weathered_iron')
# Low sheltered operating floor; all visible space above is OPEN.
box('27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL',
    R15_exchange(0,9,-12),98,69,5.5,'saltstone',F,S)
for x in (-24,24):
 # Two actual editable turbine-generator bodies.
 drum('27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL',
      R15_exchange(x,5,-9),F,S,11.5,27,'turbine',24,top_r=9.5)
 intake=R15_exchange(x,47,-38)
 beam('30_R7B_DOWN_TO_WATER_LOAD_SPINE',
      R15_exchange(x,12,9),intake,6.0,'oxidized')
 beam('30_R7B_DOWN_TO_WATER_LOAD_SPINE',
      intake,R15_exchange(x,66,tideY-31-origin[1]),
      4.6,'weathered_iron')
# Two unequal roof wings separated by a truly empty 35m sky aperture.
for xmin,xmax in ((-54,-18),(17,52)):
 a=R15_exchange(xmin,-16,59)
 b=R15_exchange(xmax,-16,59)
 c=R15_exchange(xmax,11,91)
 d=R15_exchange(xmin,11,91)
 quad('29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF',a,b,c,d,'roof',False)
 quad('29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF',
      d,c,R15_exchange(xmax,41,72),
      R15_exchange(xmin,41,72),'weathered_iron',False)
 for x in (xmin,xmax):
  beam('29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF',
       R15_exchange(x,-17,58),R15_exchange(x,12,91),
       1.8,'steel')
quad('28_R7B_TURBINE_HALL_CLERESTORY',
     R15_exchange(-18,10,87),R15_exchange(17,10,87),
     R15_exchange(17,32,74),R15_exchange(-18,32,74),
     'window',False)
# Continuous plumbing from actual high lock to generator / real lower gate.
beam('30_R7B_DOWN_TO_WATER_LOAD_SPINE',
     add(r6Head,(0,-7,0)),R15_exchange(-24,13,20),
     5.2,'copper')
beam('30_R7B_DOWN_TO_WATER_LOAD_SPINE',
     R15_exchange(24,61,-36),add(gateBase,(0,6,0)),
     4.2,'oxidized')
quay=R15_exchange(0,89,tideY+4-origin[1])
box('31_R7B_OPERATING_QUAY_AND_SHIPYARD',
    quay,72,28,6,'saltstone',F,S)
for x in (-31,31):
 for out in (-10,10):
  p=add(quay,add(mul(F,x),mul(S,out)))
  beam('31_R7B_OPERATING_QUAY_AND_SHIPYARD',
       add(p,(0,-46,0)),add(p,(0,4,0)),3.8,'basalt')
crane=R15_exchange(43,94,tideY+13-origin[1])
beam('32_R7B_LANDMARK_SHIPYARD_CRANE',
     add(crane,(0,-22,0)),add(crane,(0,38,0)),
     2.7,'darksteel')
beam('32_R7B_LANDMARK_SHIPYARD_CRANE',
     add(crane,(0,36,0)),
     add(crane,add(mul(S,-29),(0,29,0))),1.5,'copper')

# Road6 is already served by the TRUE R8J turbine rotor. Remove giant
# repeated roof and make a subordinate seaward witness terrace, not a fake
# gate or another centerpiece competing with the moving red B51.
P,F,S=frame(6,.604)
edge=offset_edge(P,S,124,'R')
annex=(edge[0],tideY+14,edge[2])
def R15_witness(x,out,up):
 return add(annex,add(mul(F,x),add(mul(S,out),(0,up,0))))
box('27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL',
    R15_witness(0,0,-9),45,19,5,'basalt',F,S)
for x in (-18,18):
 beam('27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL',
      R15_witness(x,-7,-51),R15_witness(x,-7,28),
      3.7,'saltstone')
 beam('30_R7B_DOWN_TO_WATER_LOAD_SPINE',
      R15_witness(x,1,0),R15_witness(x,34,-35),
      3.0,'oxidized')
quad('28_R7B_TURBINE_HALL_CLERESTORY',
     R15_witness(-13,-7,20),R15_witness(13,-7,20),
     R15_witness(13,-7,27),R15_witness(-13,-7,27),
     'window',False)
beam('29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF',
     R15_witness(-20,5,30),R15_witness(20,5,30),
     1.7,'steel')
box('31_R7B_OPERATING_QUAY_AND_SHIPYARD',
    R15_witness(0,38,-11),37,25,5,'saltstone',F,S)

# One genuinely founded slender observation lantern, not the previous
# opaque black cuboid that competed with B51 and the visible R8J rotor.
P,F,S=frame(6,.72)
edge=offset_edge(P,S,102,'R')
tower=(edge[0],tideY+16,edge[2])
for x,out in ((-16,-11),(-16,11),(16,-11),(16,11)):
 p=add(tower,add(mul(F,x),mul(S,out)))
 beam('33_R7B_SINGLE_HEADLAND_CONTROL_TOWER',
      add(p,(0,-47,0)),add(p,(0,83,0)),3.2,'deepstone')
drum('33_R7B_SINGLE_HEADLAND_CONTROL_TOWER',
     add(tower,(0,77,0)),F,S,20,12,'oxidized',16,top_r=13)
drum('33_R7B_SINGLE_HEADLAND_CONTROL_TOWER',
     add(tower,(0,90,0)),F,S,13,8,'window',16,top_r=9)

assert len(GROUPS)==43,('R15_FINAL_GROUP_COUNT',len(GROUPS))
assert all(GROUPS[k] for k in R15_REPLACE)
print('R15_NATIVE_REAL_BLENDER_REAUTHOR_PREMESH',
      {k:len(GROUPS[k]) for k in R15_REPLACE})

