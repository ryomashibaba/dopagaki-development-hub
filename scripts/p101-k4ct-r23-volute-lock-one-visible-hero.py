"""R23 single original-camera-readable open VOLUTE LOCK, native Blender only.

One coherent visible Road5 right-bank machine from actual 65.25s R16 240Hz
projected site, NOT 3 repeated arcade gates, invisible barges, new sea shader,
additional collisions, or any replacement of original group34 upstream intake,
group12/13 control tower, group41/42 source wheel, Road5, source B51/Camera.
R19 is used as explicit REJECTED research-only clearance substrate; ART HOLD.
"""
import json,math
from pathlib import Path

r23=json.loads(Path(
 'research-evidence/k4ct/K4CT_R23_SOURCE_CAMERA_SINGLE_VOLUTE_INTAKE_ART_CONTRACT_20261107.json'
).read_text())
assert r23['schema']=='k4ct-r23-single-volute-open-intake-original-camera-five-frame-v1'
obs=r23['originalEvidence']['R16site']
assert obs['road']==5 and obs['bank']=='R' and obs['u']==.95
assert site['researchPhysicalRoad5SHA256']==r23['safety']['road5SHA256']
assert site['originalB48Count']==7 and site['originalB51Count']==28
assert len(GROUPS)==43
rework={
'27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL',
'28_R7B_TURBINE_HALL_CLERESTORY',
'29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF',
'30_R7B_DOWN_TO_WATER_LOAD_SPINE',
'31_R7B_OPERATING_QUAY_AND_SHIPYARD',
'32_R7B_LANDMARK_SHIPYARD_CRANE',
'33_R7B_SINGLE_HEADLAND_CONTROL_TOWER'
}
preserve=(
'00_PHYSICAL_ROAD_CONFORMAL_VISIBLE_SKIN',
'12_SINGLE_TIDAL_LIFT_AND_CONTROL_TOWER',
'13_CONTROL_FLOOR_GLAZING',
'19_R6_SOURCE_FRAMED_UPPER_TIDAL_FOREBAY',
'34_R7C_CHASE_VISIBLE_POWER_INTAKE',
'41_R8J_COASTAL_TIDAL_TURBINE_CROWN',
'42_R8J_QUARRY_ANCHORED_TURBINE_PENSTOCK'
)
assert all(k in GROUPS and len(GROUPS[k])>0 for k in rework)
origCount={k:len(GROUPS[k]) for k in preserve}
for key in rework:GROUPS[key].clear()
p,fw,side=frame(obs['road'],obs['u'])
originalSite=offset_edge(p,side,obs['outboardM'],obs['bank'])
assert length(sub(originalSite,obs['originalWorldXYZ']))<.04,(
 'SOURCE_R16_ANCHOR_DRIFT',originalSite,obs['originalWorldXYZ'])
# A TRUE camera-facing shallow industrial plane; not a camera modification.
sourceFront=unit((obs['originalViewFront'][0],0,obs['originalViewFront'][2]))
sourceRight=unit((-sourceFront[2],0,sourceFront[0]))
assert abs(sum(a*b for a,b in zip(sourceFront,sourceRight)))<1e-5
# All new geometry remains >100m outboard; radius never >39m.
volute=add(originalSite,(0,-8,0))
def local(x,y,d=0):
 return add(volute,add(mul(sourceRight,x),add((0,y,0),mul(sourceFront,d))))
def spiral(t,dr=0,depth=0):
 angle=-.27*math.pi+(2.75*math.pi*t)
 radius=39-26*t+dr
 return local(radius*math.cos(angle),radius*math.sin(angle),depth)
hero='27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL'
glazing='28_R7B_TURBINE_HALL_CLERESTORY'
frameGroup='29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF'
penstock='30_R7B_DOWN_TO_WATER_LOAD_SPINE'
quay='31_R7B_OPERATING_QUAY_AND_SHIPYARD'
lifting='32_R7B_LANDMARK_SHIPYARD_CRANE'
beacon='33_R7B_SINGLE_HEADLAND_CONTROL_TOWER'

# A thick open involute at true SOURCE Road5 site. Not a flat sign: 4m
# wide tapered metal ribbon with 12m actual solid depth, bevel-like
# weathered front ridge and open negative-space centre. One VOLUTE,
# not multiple repeated racetrack arch/portal shapes.
sections=70
for j in range(sections):
 t0=j/sections;t1=(j+1)/sections
 for material,depth,width in (
   ('oxidized',-6,3.6),('weathered_iron',6,3.6)):
  quad(hero,spiral(t0,-width/2,depth),spiral(t1,-width/2,depth),
       spiral(t1,width/2,depth),spiral(t0,width/2,depth),
       material,False)
 for width,mat in ((-1.8,'darksteel'),(1.8,'copper')):
  quad(hero,spiral(t0,width,-6),spiral(t1,width,-6),
       spiral(t1,width,6),spiral(t0,width,6),mat,False)
 # Thin physically connected non-neon corrosion inlay near outer 65% only.
 if j%4==0 and t0<.66:
  quad(glazing,spiral(t0,-1.0,-6.45),
       spiral(min(t0+.025,1),-1.0,-6.45),
       spiral(min(t0+.025,1),.15,-6.45),
       spiral(t0,.15,-6.45),'steel',False)

# A physically massive, below-road-edge axial housing to explain the volute.
box(hero,local(1,-6,9),15,14,12,'darksteel',sourceFront,sourceRight)
drum(hero,local(1,-7,8),sourceRight,sourceFront,7.7,8,'turbine',16,top_r=6.4)
# Two heavy piers support the actual spiral; these are BELOW the opening
# and separate from the native road (no false race arches).
for x in (-31,31):
 base=local(x,-35,1)
 beam(frameGroup,add(base,(0,-41,0)),local(x,-21,1),5.8,'basalt')
 beam(frameGroup,local(x,-21,1),local(x,-14,3),3.2,'saltstone')
# A single slanted seismic bearing and asymmetric check-tension:
beam(frameGroup,local(-30,-19,6),local(7,22,8),2.8,'weathered_iron')
beam(frameGroup,local(30,-22,6),local(26,-1,10),2.1,'steel')
# Actual original source Road5 headrace is ~88m outboard and connected by
# ONE supply branch at 155m outboard. It never crosses source B48.
assert 'r6Head' in globals()
inlet=add(r6Head,(0,6,0))
port=local(-23,-18,18)
beam(penstock,inlet,port,4.3,'oxidized')
beam(penstock,port,local(-17,-10,14),3.6,'copper')
# Drain into true tide-level below, with a local geometric open chute.
discharge=local(22,tideY-5-volute[1],17)
beam(penstock,local(19,-12,14),discharge,4.7,'oxidized')
a=local(16,-22,18);b=local(31,-22,18)
c=local(31,tideY+2-volute[1],40)
d=local(16,tideY+2-volute[1],40)
quad(penstock,a,b,c,d,'tide',False)
# One SMALL grounded maintenance terrace, without giant hall or roof slab.
terrace=local(17,tideY+5-volute[1],30)
box(quay,terrace,24,16,5,'saltstone',sourceFront,sourceRight)
for x in (-8,8):
 for depth in (24,35):
  top=local(17+x,tideY+7-volute[1],depth)
  beam(quay,add(top,(0,-25,0)),top,2.5,'basalt')
# A single functional hydraulic actuator: no unrelated sky crane.
cylBase=local(-18,-30,11);cylHead=local(-10,0,8)
beam(lifting,cylBase,cylHead,2.2,'weathered_iron')
beam(lifting,local(-13,-10,10),local(-8,3,9),1.2,'copper')
# A compact lighthouse-scale signal (not a red B51 lookalike), integrated
# into volute centre, much smaller than original 66.35s control tower.
signal=local(0,10,-10)
beam(beacon,local(0,-9,-10),local(0,13,-10),2.0,'darksteel')
drum(beacon,signal,sourceFront,sourceRight,4.8,5,'oxidized',10,top_r=3.0)
# One tiny structural glass inlay rather than an opaque screen-wide window.
quad(glazing,local(-6,3,-7),local(-2,6,-7),local(-1,12,-7),
     local(-5,10,-7),'window',False)

assert len(GROUPS)==43 and all(GROUPS[k] for k in rework)
assert all(len(GROUPS[k])==v for k,v in origCount.items())
assert all(k.startswith(('27_','28_','29_','30_','31_','32_','33_')) for k in rework)
assert sum(len(GROUPS[k]) for k in rework)>370
# In the authoring model the local machine never covers the road from
# above: source selected lateral outboard 155m; radius at most 39m.
assert obs['outboardM']>3*39
print('R23_ORIGINAL_CAMERA_SINGLE_TRUE_VOLUTE_BLENDER_AUTHOR_READY',
 json.dumps({'nativeSourceR16Site':originalSite,'viewFront':sourceFront,
  'sourceProtectedBlenderFaces':origCount,
  'singleVoluteReplacedFaces':{k:len(GROUPS[k]) for k in sorted(rework)},
  'realRoadB48':site['originalB48Count'],
  'actualMovingB51':site['originalB51Count'],
  'newColliders':0,'formalART':0,'slope2DNAmeters':0}))
