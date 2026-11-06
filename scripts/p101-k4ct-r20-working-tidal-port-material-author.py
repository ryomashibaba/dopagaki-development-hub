"""R20 genuine Blender BSDF/mesh water + working port prototype.

Research only: R19 unadopted open-view terrain is re-used as A/B scaffold,
NOT accepted. Actual 65.25 / 66.35 / 68.05 source-camera three-hero
story remains original intake34 -> tower12 -> source R8J wheel41/42.
No road, moving B51, camera, 240Hz source, collision or production edits.
"""
import json,math
from pathlib import Path

c=json.loads(Path(
 'research-evidence/k4ct/K4CT_R20_WORKING_TIDAL_PORT_MATERIAL_FORM_ART_CONTRACT_20261107.json'
).read_text())
assert c['schema']=='k4ct-r20-working-tidal-port-water-shore-hall-art-brief-v1'
assert c['technical']['strictProtectedOriginalGameGitBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert site['researchPhysicalRoad5SHA256']==c['technical']['strictRoad5PhysicalSHA256']
assert len(GROUPS)==43 and site['originalB48Count']==7 and site['originalB51Count']==28
protectedNames=(
 '00_PHYSICAL_ROAD_CONFORMAL_VISIBLE_SKIN',
 '12_SINGLE_TIDAL_LIFT_AND_CONTROL_TOWER',
 '13_CONTROL_FLOOR_GLAZING',
 '19_R6_SOURCE_FRAMED_UPPER_TIDAL_FOREBAY',
 '34_R7C_CHASE_VISIBLE_POWER_INTAKE',
 '41_R8J_COASTAL_TIDAL_TURBINE_CROWN',
 '42_R8J_QUARRY_ANCHORED_TURBINE_PENSTOCK'
)
protectCounts={g:len(GROUPS[g]) for g in protectedNames}
targetNames=(
 '03_CLIFF_TO_WORKING_TIDAL_BASIN',
 '04_MARITIME_CONCRETE_SPILLWAY_BUTTRESSES',
 '05_WATER_TURBULENCE_AND_FOAM',
 '15_WORKING_PORT_QUAYS_AND_BERTHING',
 '16_ROOFED_PORT_OPERATIONS',
 '17_BERTH_UTILITY_CRANES'
)
assert all(len(GROUPS[g]) for g in targetNames)
for g in targetNames:GROUPS[g].clear()
# New true Principled BSDF materials, exported by unchanged genuine Blender
# polygon+normal+UV+roughness pipeline. NOT certified physical PBR.
marineColors={
 'harbor_abyss':(.110,.278,.321),
 'harbor_tidal_steel':(.154,.331,.366),
 'harbor_swell':(.183,.370,.391),
 'harbor_wet_rock':(.272,.344,.352),
 'harbor_foam_silver':(.400,.552,.551),
 'harbor_salt_concrete':(.495,.538,.531),
 'harbor_laminate':(.295,.357,.362),
 'harbor_green_iron':(.264,.415,.400),
 'harbor_aged_copper':(.542,.394,.276),
 'harbor_crane_gold':(.617,.472,.267),
 'harbor_ship_hull':(.188,.285,.303),
 'harbor_window':(.365,.554,.600)
}
for key,rgb in marineColors.items():
 assert key not in COLORS
 COLORS[key]=rgb

# Water topography is a genuine 3D maritime plane with subdued low
# wave relief, NOT broad planar cyan slabs, stripes or a fake road.
def R20_shore(p,d,h):
 lat=unit(sub(p['right'],p['left']))
 a=offset_edge(p,lat,d,'R')
 return (a[0],h,a[2])
def R20_watersurface(idx,p,u,d):
 h=tideY+.22*math.sin(21*u+0.031*d+idx)+.15*math.cos(31*u-.055*d)
 return R20_shore(p,d,h)
for idx in (5,6):
 for j in range(144):
  u=j/144
  v=(j+1)/144
  p=sample(idx,u);q=sample(idx,v)
  coastA=(
    R20_shore(p,24,p['right'][1]-9),
    R20_shore(p,43,p['right'][1]-25),
    R20_shore(p,69,tideY+9),
    R20_shore(p,97,tideY+.6))
  coastB=(
    R20_shore(q,24,q['right'][1]-9),
    R20_shore(q,43,q['right'][1]-25),
    R20_shore(q,69,tideY+9),
    R20_shore(q,97,tideY+.6))
  for layer,material in enumerate((
     'harbor_wet_rock','harbor_salt_concrete','harbor_green_iron')):
   quad('03_CLIFF_TO_WORKING_TIDAL_BASIN',
        coastA[layer],coastB[layer],coastB[layer+1],
        coastA[layer+1],material,False)
  # Uniformed meshes are OPEN under original road, and 9 true water cells
  # extend seaward. The mixed palette varies at FACE scale, not stripes.
  dist=(97,119,141,174,213,261,319,392,485,545)
  for layer,(d0,d1) in enumerate(zip(dist,dist[1:])):
   a=R20_watersurface(idx,p,u,d0)
   b=R20_watersurface(idx,q,v,d0)
   c=R20_watersurface(idx,q,v,d1)
   d=R20_watersurface(idx,p,u,d1)
   hash0=(j*17+layer*29+idx*13)%31
   material=('harbor_abyss' if hash0<14 else
             'harbor_tidal_steel' if hash0<25 else
             'harbor_swell')
   quad('03_CLIFF_TO_WORKING_TIDAL_BASIN',
        a,b,c,d,material,False)
  # Not dozens of identical poles: a few distinctive genuine buttresses
  # physically carry the upper seaward road rock towards the wet shore.
  if j in (17,56,97,132):
   base=R20_shore(p,67,tideY+6)
   crest=R20_shore(p,36,p['right'][1]-17)
   beam('04_MARITIME_CONCRETE_SPILLWAY_BUTTRESSES',
        add(base,(0,-43,0)),crest,4.6,'harbor_salt_concrete')
   beam('04_MARITIME_CONCRETE_SPILLWAY_BUTTRESSES',
        add(base,(0,-7,0)),add(crest,(0,-12,0)),2.2,'harbor_green_iron')
  # Sparse shoreline foam facets with real polygon winding and no
  # impossible waves in midair; reserve most water as quiet dark sea.
  if j%13==4:
   da=98+(j%4)*3
   a=R20_shore(p,da,tideY+.85)
   b=R20_shore(q,da+4,tideY+.85)
   c=R20_shore(p,da+18,tideY+.90)
   tri('05_WATER_TURBULENCE_AND_FOAM',a,b,c,'harbor_foam_silver')
   tri('05_WATER_TURBULENCE_AND_FOAM',
       b,R20_shore(q,da+20,tideY+.90),c,'harbor_swell')

# One source-grounded major berth on Road5. The industrial program is
# visible: land-rooted 3D machine hall -> real load crane -> service ship
# -> deep sea, with one small subordinate outfall beyond Road6.
P,F,S=frame(5,.90)
R20_origin=offset_edge(P,S,156,'R')
origin=(R20_origin[0],tideY+8,R20_origin[2])
def harbour(x,d,h):
 return add(origin,add(mul(F,x),add(mul(S,d),(0,h,0))))
# A 165m raised wet port dock, with a MASSIVE genuine marine foundation.
quayGroup='15_WORKING_PORT_QUAYS_AND_BERTHING'
box(quayGroup,harbour(0,0,-1),58,162,11,
    'harbor_salt_concrete',F,S)
for x in (-68,-29,29,68):
 for across in (-23,23):
  anchor=harbour(x,across,-6)
  beam(quayGroup,add(anchor,(0,-44,0)),harbour(x,across,4),
       5.2,'harbor_wet_rock')
# A rock-founded working breakwater follows real coast and visibly
# protects the ship: two solid OUTBOARD aligned segments, no road bridge.
for x0,x1 in ((-79,-9),(13,82)):
 beam(quayGroup,harbour(x0,-39,-1),harbour(x1,-39,-1),
      6.8,'harbor_wet_rock')
# A single true 3D moored service barge, not a fake road or second skyline.
# Hull sides taper to a blunt working bow: roughly 135 x 32 x 18 metres.
def ship(x,a,h):return harbour(x,60+a,h)
stern=[ship(-62,-17,-10),ship(-62,17,-10)]
bow=[ship(55,-17,-10),ship(55,17,-10)]
topS=[ship(-67,-21,5),ship(-67,21,5)]
topB=[ship(58,-21,5),ship(58,21,5)]
nose=ship(76,0,1)
quad(quayGroup,stern[0],bow[0],topB[0],topS[0],'harbor_ship_hull',False)
quad(quayGroup,bow[1],stern[1],topS[1],topB[1],'harbor_ship_hull',False)
quad(quayGroup,topS[0],topB[0],topB[1],topS[1],'harbor_laminate',False)
tri(quayGroup,topB[0],nose,topB[1],'harbor_ship_hull')
tri(quayGroup,bow[0],bow[1],nose,'harbor_aged_copper')
quad(quayGroup,stern[1],stern[0],topS[0],topS[1],'harbor_ship_hull',False)
# Only three meaningful cargo holds, not dozens of little boxes.
for x in (-35,0,35):
 box(quayGroup,ship(x,0,11),31,28,11,'harbor_green_iron',F,S)
# True docking bollards and one long credible ship mooring line.
for x in (-53,54):
 root=harbour(x,16,6)
 beam(quayGroup,root,add(root,(0,7,0)),2.3,'harbor_crane_gold')
 beam(quayGroup,add(root,(0,6,0)),ship(x,25,5),.85,'harbor_aged_copper')

# Landward working cargo shed, carved INTO the source right-bank geology.
# A faceted vertical working bay remains OPEN to seaward, not a big
# duplicated rectangular roof or hollow decorative port facade.
hallGroup='16_ROOFED_PORT_OPERATIONS'
back=offset_edge(P,S,108,'R')
shed=(back[0],P['right'][1]-41,back[2])
def hall(x,d,h):return add(shed,add(mul(F,x),add(mul(S,d),(0,h,0))))
for x in (-64,-21,21,64):
 for d in (-13,17):
  foot=hall(x,d,-36)
  beam(hallGroup,foot,hall(x,d,42),4.5,'harbor_salt_concrete')
  if d<0:
   beam(hallGroup,hall(x,d,31),hall(x,17,48),3.1,'harbor_green_iron')
# Massive open roof cut with long coherent asymmetric slopes.
for a,b in ((-73,-12),(12,73)):
 quad(hallGroup,hall(a,-15,41),hall(b,-15,41),
      hall(b,8,63),hall(a,8,63),'harbor_laminate',False)
 quad(hallGroup,hall(a,8,63),hall(b,8,63),
      hall(b,29,48),hall(a,29,48),'harbor_aged_copper',False)
# The 24m ridge opening is real empty SKY with one inset glazing bridge.
quad(hallGroup,hall(-11,-10,46),hall(11,-10,46),
     hall(11,1,56),hall(-11,1,56),'harbor_window',False)
for x in (-52,-19,19,52):
 beam(hallGroup,hall(x,-16,5),hall(x,27,5),
      1.3,'harbor_crane_gold')
# Hydraulic cargo conveyor physically joins the industrial shed and ship.
beam(hallGroup,hall(0,24,10),harbour(0,-22,16),
     3.5,'harbor_green_iron')
beam(hallGroup,harbour(0,-22,16),harbour(0,19,17),
     2.5,'harbor_crane_gold')

# One genuinely large, planted 3D gantry sits in the quarry PORT, entirely
# outside actual B48. Strong whole silhouette at 65.25, subservient later.
craneGroup='17_BERTH_UTILITY_CRANES'
for x in (-34,34):
 beam(craneGroup,harbour(x,-10,-47),harbour(x,-10,78),
      4.7,'harbor_green_iron')
 beam(craneGroup,harbour(x,-10,78),harbour(x,35,68),
      2.2,'harbor_crane_gold')
beam(craneGroup,harbour(-38,-10,78),harbour(38,-10,78),
     4.0,'harbor_green_iron')
for x in (-31,31):
 beam(craneGroup,harbour(x,-10,56),harbour(-x,-10,78),
      1.6,'harbor_laminate')
# One coherent outreach boom extending seaward from the gantry.
beam(craneGroup,harbour(0,-8,83),harbour(0,73,65),
     3.3,'harbor_crane_gold')
beam(craneGroup,harbour(0,73,65),harbour(0,73,11),
     1.0,'harbor_aged_copper')

# Quieter low-water road6 discharge: no second tall hero near the
# existing actual group41/42 R8J wheel and original red moving B51.
p6,f6,s6=frame(6,.79)
a6=offset_edge(p6,s6,166,'R')
dock6=(a6[0],tideY+5,a6[2])
def outer(x,d,h):return add(dock6,add(mul(f6,x),add(mul(s6,d),(0,h,0))))
box(quayGroup,outer(0,0,-1),34,109,7,'harbor_salt_concrete',f6,s6)
for x in (-45,45):
 for d in (-12,12):
  beam(quayGroup,outer(x,d,-47),outer(x,d,4),
       3.7,'harbor_wet_rock')
box(hallGroup,outer(0,-18,9),25,61,10,'harbor_green_iron',f6,s6)
for x in (-26,26):
 beam(hallGroup,outer(x,-18,13),outer(x,-3,20),
      2.0,'harbor_aged_copper')

# Crucial nonadoption and actual original iconography invariants.
assert len(GROUPS)==43 and all(GROUPS[g] for g in targetNames)
assert all(len(GROUPS[k])==v for k,v in protectCounts.items())
assert len(COLORS)>=len(marineColors)+27
assert sum(len(GROUPS[g]) for g in targetNames)>3000
assert all(g in GROUPS for g in protectedNames)
print('R20_GENUINE_BLENDER_TIDAL_PORT_MATERIAL_HARBOR_PREFLIGHT',
 json.dumps({'protectedLandmarkFaces':protectCounts,
  'marineAuthorGroups':{g:len(GROUPS[g]) for g in targetNames},
  'BSDFMarineMaterials':list(marineColors),
  'formalARTAdopted':0,'originalB48':site['originalB48Count'],
  'originalB51':site['originalB51Count'],'newColliders':0}))

