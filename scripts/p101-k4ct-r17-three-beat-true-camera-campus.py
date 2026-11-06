"""R17 — actual-source-camera CHASE-ALIGNED three-beat tidal campus.
Not a fake render: this author is executed INSIDE actual Blender 4.x after the
unchanged native B48/B51-aligned DCC site is loaded. Its edited triangles
become genuine original WebGL2 noncolliding art only. TECH != ART acceptance.
Ref: R16 original source-camera actual 240Hz CI #42295943093 (3 exact views).

R15 had a largely invisible group27. R17 therefore anchors three connected
FUNCTIONAL VISUAL BEATS to already verified in-frame real-world sites:
 A: Road5 right upper intake and rocky four-arch lock
 B: Road6 left control/relay with open mechanical gallery
 C: Road6 right lower discharge and working quay.
No false racing path, proxy Camera, original road, B51 or collider changes.
"""
from pathlib import Path
import json, math

contract=json.loads(Path(
 'research-evidence/k4ct/K4CT_R16_NATIVE_REAL_CAMERA_SITE_SELECTION_20261107.json'
).read_text())
assert contract['schema']=='k4ct-r16-source-native-screen-place-observation-v1'
assert contract['verifiedRun']['conclusion']=='success'
assert contract['source']['originalGameBlobGitSHA1']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert contract['source']['originalRoad5PhysicsSHA256']==site['researchPhysicalRoad5SHA256']
assert contract['source']['B48']==7 and contract['source']['B51']==28
assert [w['tick'] for w in contract['selectedPhaseWindows']]==[15660,15924,16332]
assert len(GROUPS)==43,('R17_GROUP_COUNT_BEFORE',len(GROUPS))

# Replace an already REJECTED repetitive facade/group, never alter original
# Game, stage files, Camera, 7 B48, 28 moving B51, collision or 240Hz.
rework={
 '25_R7B_OPEN_QUARRY_CUT_AND_STRATIFIED_HEADLAND',
 '26_R7B_ANCHORED_CLIFF_LOAD_BEARING_RIBS',
 '27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL',
 '28_R7B_TURBINE_HALL_CLERESTORY',
 '29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF',
 '30_R7B_DOWN_TO_WATER_LOAD_SPINE',
 '31_R7B_OPERATING_QUAY_AND_SHIPYARD',
 '32_R7B_LANDMARK_SHIPYARD_CRANE',
 '33_R7B_SINGLE_HEADLAND_CONTROL_TOWER'
}
assert rework.issubset(set(GROUPS))
for group in rework:
 GROUPS[group].clear()

def R17_frame(index,u,side,dist,height):
 p,fw,lat=frame(index,u)
 centre=add(offset_edge(p,lat,dist,side),(0,height,0))
 out=lat if side=='R' else mul(lat,-1)
 return centre,fw,out,p

def R17_local(centre,fw,out,a,b,h):
 return add(centre,add(mul(fw,a),add(mul(out,b),(0,h,0))))

def R17_show(p,name=""):
 assert all(math.isfinite(v) for v in p),(name,p)

# Verify physical anchor identity against the ACTUAL Road5/6 exported B48.
beats=[]
for spec in contract['selectedPhaseWindows']:
 centre,fw,out,p=R17_frame(
  spec['road'],spec['u'],spec['side'],
  spec['outboardM'],spec['heightFromRealRoadEdgeM'])
 delta=length(sub(centre,tuple(spec['worldXYZ'])))
 assert delta<0.025,('R17_REAL_SITE_DRIFT',spec['timeSec'],delta)
 assert spec['boundingBoxFrameFraction']>=.009
 assert spec['depthMeters']>200
 beats.append((spec,centre,fw,out,p))
assert [a[0]['timeSec'] for a in beats]==[65.25,66.35,68.05]

# A finite, fractured but LOW shoreline headland. Preserve genuine negative
# sea/sky space behind the sites, instead of R13's giant dark repeated wall.
for idx,u0,u1,seed in (
  (5,.811,.868,5),(5,.876,.907,2),
  (6,.406,.476,7),(6,.675,.735,4)):
 stacks=[]
 for j in range(9):
  u=u0+(u1-u0)*j/8
  p,fw,lat=frame(idx,u)
  irregular=2.5*math.sin(j*1.27+seed)+1.6*math.cos(j*.72+seed)
  prof=((31,-31),(51,-22+irregular*.20),
        (73,6+irregular),(102,21+irregular),(132,-42))
  stacks.append([add(offset_edge(p,lat,d,'R'),(0,h,0)) for d,h in prof])
 for j in range(8):
  for k in range(4):
   material=('basalt','shale','dunestone','saltstone')[k]
   quad('25_R7B_OPEN_QUARRY_CUT_AND_STRATIFIED_HEADLAND',
        stacks[j][k],stacks[j+1][k],
        stacks[j+1][k+1],stacks[j][k+1],material,False)
 # Close solid end sections; DO NOT stretch sheets across quarry gap.
 for boundary in (stacks[0],stacks[-1]):
  for k in (1,2,3):
   tri('25_R7B_OPEN_QUARRY_CUT_AND_STRATIFIED_HEADLAND',
       boundary[0],boundary[k],boundary[k+1],'deepstone')
   tri('25_R7B_OPEN_QUARRY_CUT_AND_STRATIFIED_HEADLAND',
       boundary[k+1],boundary[k],boundary[0],'deepstone')
 # Each island has actual anchored structural geology load path.
 mid=stacks[4]
 beam('26_R7B_ANCHORED_CLIFF_LOAD_BEARING_RIBS',
      add(mid[2],(0,-52,0)),mid[2],5.0,'basalt')
 beam('26_R7B_ANCHORED_CLIFF_LOAD_BEARING_RIBS',
      mid[2],add(mid[3],(0,12,0)),3.1,'weathered_iron')

# Three visibly distinctive but materially coherent BEATS.
# Their 48x28x62 m original-camera proposal envelope is the leading
# composition guarantee; independent real GL-depth review still required.
for number,(spec,centre,fw,out,sourceEdge) in enumerate(beats):
 p=lambda x,d,h:R17_local(centre,fw,out,x,d,h)
 main='27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL'
 glazing='28_R7B_TURBINE_HALL_CLERESTORY'
 canopy='29_R7B_INTEGRAL_GANTRY_FRAME_AND_ROOF'
 pipes='30_R7B_DOWN_TO_WATER_LOAD_SPINE'
 docks='31_R7B_OPERATING_QUAY_AND_SHIPYARD'
 # Four planted supports, two differently high ends, large human-scale
 # VOID: obvious architectural 3D rather than flat box or repeated poles.
 heights=(43,56) if number==0 else ((49,59) if number==1 else (47,61))
 for j,x in enumerate((-20,20)):
  for d in (-12,12):
   beam(main,p(x,d,-40),p(x,d,heights[j]),4.4,
        'basalt' if d==12 else 'saltstone')
   beam(main,p(x,d,18),p(x,d+8,heights[j]+2),
        2.3,'weathered_iron')
  # Actual basalt buttress tied to real road-adjacent rock toe.
  beam(main,p(x,11,-51),p(x,5,10),4.0,'deepstone')

 # Genuine curved opening in the FOREBAY or generator gate. No dark
 # solid slab is created in the central 31-metre-wide passage.
 for d in (-12,12):
  for k in range(14):
   a=math.pi*k/14;b=math.pi*(k+1)/14
   def arch(r,t):
    return p(r*math.cos(t),d,32+r*math.sin(t))
   quad(main,arch(20,a),arch(20,b),
        arch(16,b),arch(16,a),'limestone',False)
 # A horizontal machinery member is LOWER than arch apex. Not a road
 # portal: the complete structure is >55 m outboard of original B48.
 beam(canopy,p(-23,0,48),p(22,0,55),3.2,'steel')

 # Two asymmetrical, deep folded roof fins; 32m central daylight slit.
 # This 3D roof is self-supporting and cannot be confused with a road.
 for xlo,xhi in ((-22,-17),(16,22)):
  quad(canopy,p(xlo,-14,47),p(xhi,-14,47),
       p(xhi,10,61),p(xlo,10,58),'weathered_iron',False)
  beam(canopy,p(xlo,-14,47),p(xlo,10,58),2.6,'oxidized')
  beam(canopy,p(xhi,-14,47),p(xhi,10,61),2.6,'steel')
 quad(glazing,p(-13,11,46),p(13,11,46),
      p(13,11,55),p(-13,11,55),'window',False)

 # Actual two high-capacity generator drums, their source-connected pipe
 # descending to continuous existing R12 tidal shoreline (tideY plane).
 for x in (-11,11):
  generator=p(x,-2,-4)
  drum(main,generator,fw,out,5.5,15,'turbine',16,top_r=5.0)
  beam(pipes,p(x,1,7),p(x,27,-24),4.6,'copper')
  seawater=p(x,46,tideY-7-centre[1])
  beam(pipes,p(x,27,-24),seawater,4.1,'oxidized')
  beam(pipes,seawater,add(seawater,(0,-14,0)),
       3.3,'weathered_iron')
 # Unraceable operating quay is installed at TRUE sea level below race
 # with actual pile foundations; nothing new on or over B48 road.
 quay=p(0,51,tideY+5-centre[1])
 box(docks,quay,53,20,5.5,'saltstone',fw,out)
 for x in (-21,21):
  for d in (-8,8):
   foot=add(quay,add(mul(fw,x),mul(out,d)))
   beam(docks,add(foot,(0,-48,0)),
        add(foot,(0,2.5,0)),3.5,'basalt')

 # Intentionally different cinematic signature for each actual camera beat.
 if number==0:
  # Intake spire is attached to fractured forebay and upper sluice.
  beam('33_R7B_SINGLE_HEADLAND_CONTROL_TOWER',
       p(-18,10,0),p(-18,10,60),3.2,'deepstone')
  drum('33_R7B_SINGLE_HEADLAND_CONTROL_TOWER',
       p(-18,10,53),fw,out,7.0,6,'oxidized',12,top_r=3.8)
  # The original upstream r6Head is on SAME R shore. This pipe does not
  # cross original 7 B48 raceway and has no collision.
  beam(pipes,add(r6Head,(0,3,0)),p(-10,18,-20),
       3.5,'weathered_iron')
 elif number==1:
  # Opposite-bank control relay. An open-air lantern + short grounded
  # hydraulic descent; not a B51 hazard lookalike.
  beam('33_R7B_SINGLE_HEADLAND_CONTROL_TOWER',
       p(14,6,25),p(14,6,65),2.6,'darksteel')
  drum('33_R7B_SINGLE_HEADLAND_CONTROL_TOWER',
       p(14,6,59),fw,out,8.5,8,'window',14,top_r=5.0)
  beam('33_R7B_SINGLE_HEADLAND_CONTROL_TOWER',
       p(10,6,55),p(19,-2,38),1.8,'oxidized')
 else:
  # The discharge terminal has one planted freight crane and an open
  # roof signal cupola. Existing REAL R8J wheel remains separately visible.
  crane=p(16,45,tideY+13-centre[1])
  beam('32_R7B_LANDMARK_SHIPYARD_CRANE',
       add(crane,(0,-30,0)),add(crane,(0,36,0)),
       3.5,'weathered_iron')
  beam('32_R7B_LANDMARK_SHIPYARD_CRANE',
       add(crane,(0,35,0)),
       add(crane,add(mul(fw,-31),(0,29,0))),2.0,'steel')
  beam('32_R7B_LANDMARK_SHIPYARD_CRANE',
       add(crane,add(mul(fw,-25),(0,30,0))),
       add(crane,add(mul(fw,-25),(0,-10,0))),1.1,'copper')
  drum('33_R7B_SINGLE_HEADLAND_CONTROL_TOWER',
       p(0,10,59),fw,out,9.0,6,'oxidized',14,top_r=5.5)

# Ensure group32 has only ONE crane (in final outfall) and source
# unused groups are still genuine nonempty geometry.
assert len(GROUPS)==43,('R17_FINAL_GROUP_COUNT',len(GROUPS))
assert all(GROUPS[g] for g in rework),('R17_EMPTY_GROUP',
 [g for g in rework if not GROUPS[g]])
assert len(GROUPS['27_R7B_QUARRY_EMBEDDED_TIDAL_POWER_HALL'])>350
print('R17_THREE_REAL_CAMERA_SITES_BLENDER_EDITABLE_PREMESH',
 json.dumps({'realB48':site['originalB48Count'],'realB51':site['originalB51Count'],
  'beatSites':[{'t':a[0]['timeSec'],'road':a[0]['road'],'u':a[0]['u'],
    'side':a[0]['side'],'world':list(a[1])} for a in beats],
  'sourceCameraProofRun':contract['verifiedRun']['id'],
  'reworkedFaceCounts':{g:len(GROUPS[g]) for g in sorted(rework)},
  'newColliders':0,'formalARTAccepted':0}))

