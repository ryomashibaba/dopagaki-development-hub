"""R44 research-only, ONE true Blender candidate from vetted R43_A compact concept.

SOURCE: R12A author + R36 rejected + R39 rejected used as isolated substrate;
this script reauthors their nonprotected local geometry and writes a real
underbank conduit's shell, three continuous solids for flow surfaces, support
banks and one anchored mechanical gate. No real fluid simulation, collision,
original protected 8, Game/Road/Camera/240Hz, production, or PR edits.
"""
import json as R44_json
from pathlib import Path as R44_Path
import math as R44_math
R44_PROTECTED={n:list(GROUPS[n]) for n in GROUPS if n[:2] in ('00','12','13','19','34','35','41','42')}
assert len(R44_PROTECTED)==8 and len(GROUPS)==43
assert all(GROUPS[n]==value for n,value in R44_PROTECTED.items())
R44_PREVIOUS={id:len(GROUPS[R36_N[id]]) for id in ('15','16','17','23','24')}
assert R44_PREVIOUS['24']==526 and R44_PREVIOUS['23']==576
R44_WATER_HEIGHTS=[92.6,92.45,92.24,92.03,91.78,91.38,91.0,80.0,79.5]
assert all(a>b for a,b in zip(R44_WATER_HEIGHTS,R44_WATER_HEIGHTS[1:]))
# Dedicated research groups only; old rejected R39 gate and fall discarded.
for R44_ID in ('15','16','17','23','24'):
    GROUPS[R36_N[R44_ID]].clear()
# Localized cut for the physically open receiving bench, NEVER touching source
# water19 or road00; record removal counts rather than overclear full scenery.
R44_CUTS={}
for R44_ID in ('03','20','21','25','26'):
    R44_NAME=R36_N[R44_ID]
    R44_KEEP=[]
    for R44_TRI in GROUPS[R44_NAME]:
        R44_LOCAL=[R39_DTX(v) for v in R44_TRI[:3]]
        R44_REMOVE=any(114.<=d<=195. and 88.<=t<=162. and
                       v[1]<103. for v,(d,t) in zip(R44_TRI[:3],R44_LOCAL))
        if not R44_REMOVE:R44_KEEP.append(R44_TRI)
    R44_CUTS[R44_ID]=len(GROUPS[R44_NAME])-len(R44_KEEP)
    GROUPS[R44_NAME][:]=R44_KEEP
# Research coordinates are source original Road6 U~.15 side/outboard in m.
R44_TMIN,R44_TMAX=102.5,147.5
R44_DSTART,R44_DEND=100.,190.
R44_STAGE_EVAL_BEFORE=len(R39_DCC_EVALUATED)
COLORS.update({
    'r44_water_inlet':(.21,.63,.64),
    'r44_turbulent_gravity_face':(.62,.84,.76),
    'r44_deep_receiver':(.13,.47,.51),
    'r44_bank_cut_stone':(.36,.44,.41),
    'r44_bonded_wet_limestone':(.23,.35,.37),
    'r44_gate_bronze':(.59,.47,.30),
    'r44_gate_patina':(.21,.47,.42)
})
R44_BOX_FACES=[(0,1,2,3),(4,7,6,5),(0,4,5,1),
              (1,5,6,2),(2,6,7,3),(3,7,4,0)]
def R44_BOX(name,group,d0,d1,t0,t1,y0,y1,material,bevel=.24):
    assert d0<d1 and t0<t1 and y0<y1
    pts=[R36_AT(d0,y0,t0),R36_AT(d1,y0,t0),
         R36_AT(d1,y1,t0),R36_AT(d0,y1,t0),
         R36_AT(d0,y0,t1),R36_AT(d1,y0,t1),
         R36_AT(d1,y1,t1),R36_AT(d0,y1,t1)]
    R36_BEVEL(name,group,pts,R44_BOX_FACES,material,None,bevel)
def R44_SHEET(name,group,profile,material,thickness):
    assert all(profile[i][0]<=profile[i+1][0] for i in range(len(profile)-1))
    ts=[R44_TMIN+(R44_TMAX-R44_TMIN)*i/16 for i in range(17)]
    verts=[R36_AT(d,y,t) for d,y in profile for t in ts]
    faces=[]
    for j in range(len(profile)-1):
        for k in range(len(ts)-1):
            a=j*len(ts)+k
            faces.append((a,a+len(ts),a+len(ts)+1,a+1))
    R39_EDITABLE_SURFACE(name,group,verts,faces,material,thickness)
    return len(faces)
R44_HEAD=[
 (100.,92.60),(105.,92.45),(112.,92.24),(115.,92.03),
 (122.,91.78),(140.,91.38),(155.,91.00)]
R44_FALL=[
 (155.,91.0),(155.,89.2),(155.,87.4),(155.,85.6),
 (155.,83.8),(155.,82.0),(155.,80.0)]
R44_RECEIVER=[
 (155.,80.0),(162.,79.9),(169.,79.8),
 (177.75,79.65),(190.,79.50)]
# Exact common end vertices across the three true evaluated Blender meshes;
# 524+ water polygons, not a fake RGB-only waterfall or flat infinite sea.
R44_FACE_COUNTS={
 'headrace':R44_SHEET('R44_SOURCE_TO_EXPOSED_HEADRACE','23',R44_HEAD,'r44_water_inlet',.22),
 'gravity':R44_SHEET('R44_TRUE_VERTICAL_GRAVITY_WATER','24',R44_FALL,'r44_turbulent_gravity_face',.36),
 'receiver':R44_SHEET('R44_LOWER_RECEIVING_CHANNEL','24',R44_RECEIVER,'r44_deep_receiver',.27)
}
assert R44_HEAD[-1]==R44_FALL[0] and R44_FALL[-1]==R44_RECEIVER[0]
# Protected forebay19 y93 lies over inlet at y92.60 at side-distance R100.
# Culvert TOP is below the immutable water surface and bank top (93.8).
# It's a modeled static submerged aperture below bank, not an actual hole cut
# in protected19 or a claim that a real fluid solver now exists.
R44_SHELL_ROOF_Y=92.95
assert 92.6<R44_SHELL_ROOF_Y<93.0<93.8
R44_BOX('SUBMERGED_BANK_CONDUIT_ROOF','15',
        100.,115.,R44_TMIN-1.,R44_TMAX+1.,
        92.86,R44_SHELL_ROOF_Y,'r44_bonded_wet_limestone',.13)
for side in (R44_TMIN-1.8,R44_TMAX+.9):
    R44_BOX('GROUTED_SUBMERGED_BANK_CONDUIT_SIDE','15',
            100.,115.,side,side+.9,89.6,92.94,
            'r44_bank_cut_stone',.12)
# Unequal, low load-bearing banks follow the continuous gravity section,
# meeting the protected bank without inventing an above-water stone wall.
R44_BOX('HEADRACE_LOWER_LEFT_BUTTRESS','16',
        115.,152.,R44_TMIN-3.5,R44_TMIN-1.2,
        83.,93.2,'r44_bank_cut_stone',.50)
R44_BOX('HEADRACE_STEPPED_RIGHT_BUTTRESS','16',
        120.,154.,R44_TMAX+1.,R44_TMAX+4.2,
        84.,94.1,'r44_bonded_wet_limestone',.48)
R44_BOX('RECEIVER_LEFT_GROUNDED_LEDGE','16',
        157.,190.,R44_TMIN-6.,R44_TMIN-1.,
        69.,81.6,'r44_bank_cut_stone',.55)
R44_BOX('RECEIVER_RIGHT_TOE_AND_FOUNDATION','16',
        160.,188.,R44_TMAX+1.,R44_TMAX+6.5,
        68.,81.,'r44_bonded_wet_limestone',.62)
# A mechanically legible pivoted sector, one side of the real fall, with
# torque reaction taken by the low right bank. Never form a floating gray
# arch or a disconnected decorative wheel.
R44_BOX('HINGED_SLIDE_AT_HEADRACE_RIGHT_LIP','17',
        149.,153.2,129.,145.,
        90.8,100.2,'r44_gate_patina',.40)
R44_BOX('ANCHOR_BLOCK_AT_SUPPORTED_RIGHT_BANK','17',
        145.5,152.,145.2,153.,
        86.1,94.,'r44_bank_cut_stone',.48)
beam(R36_N['17'],R36_AT(150.,99.,144.),
     R36_AT(145.,104.5,151.),1.35,'r44_gate_bronze')
beam(R36_N['17'],R36_AT(145.,104.5,151.),
     R36_AT(146.,92.5,151.),1.30,'r44_gate_bronze')
R44_NEW_EVAL=R39_DCC_EVALUATED[R44_STAGE_EVAL_BEFORE:]
assert len(R44_NEW_EVAL)==3 and all(x['polygonsFromRealEvaluatedBlender']>50 for x in R44_NEW_EVAL)
assert len(GROUPS)==43 and all(GROUPS[n]==v for n,v in R44_PROTECTED.items())
assert min(R44_CUTS.values())>=0
# An intake near each source water19 row is horizontal evidence, not
# a watertightness result. No claim of actual hidden portal or simulation.
R44_MANIFEST={
 'schema':'k4ct-r44-source-road6-r43-a-underbank-real-blender-conduit-three-stage-v1',
 'scope':'one small genuine Blender research DCC candidate from R43_A only',
 'protectedEightExactBeforeExport':True,
 'sourceGroup19Untouched':True,
 'sourceBankWaterY93':93.0,'sourceBankCrestY93_8':93.8,
 'sourceIntakeSubmergedY':92.6,'culvertRoofY':R44_SHELL_ROOF_Y,
 'forebayToCulvertStaticHydraulicPlausibilityOnly':True,
 'buriedHydraulicVolumeNotTrueFluidSolver':True,
 'allThreeStageSharedBoundaryCoordinates':True,
 'faceCounts':R44_FACE_COUNTS,
 'realEvaluatedBlenderWaterMeshes':R44_NEW_EVAL,
 'retiredRejectedR39NonprotectedGroupCounts':R44_PREVIOUS,
 'localizedNonprotectedNewCuts':R44_CUTS,
 'totalSceneTriangles':sum(len(v) for v in GROUPS.values()),
 'originalB48':7,'originalB51':28,'newColliders':0,
 'originalCameraAnd240HzUnchanged':True,
 'formalArtAdopted':0,'slope2DNAmeters':0,
 'ART':'HOLD','HUMAN':'HOLD','SAT':'HOLD','CCD':'HOLD',
 'FPS':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'
}
R44_OUT=R44_Path('test-results/k4ct-r44-art')
R44_OUT.mkdir(parents=True,exist_ok=True)
(R44_OUT/'R44_SOURCE_UNDERBANK_CONDUIT_MANIFEST.json').write_text(
 R44_json.dumps(R44_MANIFEST,indent=2)+'\n')
print('R44_TRUE_BLENDER_ONE_SOURCE_CONNECTED_CANDIDATE_TECH_READY',
      R44_json.dumps({'triangles':R44_MANIFEST['totalSceneTriangles'],
                      'water':R44_FACE_COUNTS,'cut':R44_CUTS}))
