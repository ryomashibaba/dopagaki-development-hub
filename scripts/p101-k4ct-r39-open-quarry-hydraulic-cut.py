"""R39 ONE research-only real Blender DCC open-cut tidal sluice candidate.
Follows R37A+R38 original-source WebGL2 occlusion diagnosis, never rewrites
protected source water19, original B48/B51 road/Camera/240Hz, production or PR.
The original R12A and R36 authors are read-only. NO fluid simulation claim.
"""
import bmesh as R39_bmesh
import math as R39_math
import json as R39_json
from pathlib import Path as R39_Path
R39_LOCKED={n:list(GROUPS[n]) for n in GROUPS if n[:2] in ('00','12','13','19','34','35','41','42')}
assert len(R39_LOCKED)==8 and len(GROUPS)==43
assert len(GROUPS[R36_N['15']])==672
assert len(GROUPS[R36_N['16']])==376
assert len(GROUPS[R36_N['17']])==428
assert len(GROUPS[R36_N['23']])==160
assert len(GROUPS[R36_N['24']])==83
R39_CUT_COUNTS={}
R39_EDGE=offset_edge(P36,S36,0,'R')
def R39_DTX(p):
    v=(p[0]-R39_EDGE[0],0,p[2]-R39_EDGE[2])
    return (v[0]*S36[0]+v[2]*S36[2],v[0]*F36[0]+v[2]*F36[2])
# Open only this Road6 outboard water corridor; untouched physical roadway,
# source water19 and other seven protected scene groups. This is the
# alternate test, not a change to canonical scenery.
for R39_ID in ('03','20','21','25','26'):
    R39_NAME=R36_N[R39_ID]
    R39_KEEP=[]
    for R39_TRI in GROUPS[R39_NAME]:
        R39_LOCAL=[R39_DTX(p) for p in R39_TRI[:3]]
        R39_REMOVE=any(70.<=d<=169. and abs(t)<54. for d,t in R39_LOCAL)
        if not R39_REMOVE:R39_KEEP.append(R39_TRI)
    R39_CUT_COUNTS[R39_ID]=len(GROUPS[R39_NAME])-len(R39_KEEP)
    GROUPS[R39_NAME][:]=R39_KEEP
assert R39_CUT_COUNTS['03']>0 and R39_CUT_COUNTS['20']>0
# Remove the previously rejected isolated gray polygonal arch and
# disconnected high supports; author one lower, open and mechanically
# integrated 3D morphology at the same actually verified Road6 location.
for R39_ID in ('15','16','17'):
    R39_CUT_COUNTS[R39_ID]=len(GROUPS[R36_N[R39_ID]])
    GROUPS[R36_N[R39_ID]].clear()
# Preserve original R12A 23/24 off-site geometry but replace all of R36
# appended water ribbons with one new actual Blender-authored continuous
# descending surface and asymmetric receiving basin. No fake RGB-only water.
del GROUPS[R36_N['23']][52:]
del GROUPS[R36_N['24']][2:]
COLORS.update({
 'r39_weathered_limestone':(.43,.47,.43),
 'r39_wet_recess':(.12,.23,.25),
 'r39_dark_cut_rock':(.19,.30,.31),
 'r39_patinated_gate':(.19,.49,.46),
 'r39_tension_copper':(.73,.55,.32),
 'r39_water_lit':(.34,.74,.70),
 'r39_water_shadow':(.12,.45,.50),
 'r39_white_thrust':(.74,.86,.78)
})
R39_DCC_EVALUATED=[]
def R39_EDITABLE_SURFACE(name,group,verts,faces,material,thickness):
    # Original Blender mesh polygons + a real evaluated Solidify modifier.
    R39_MESH=bpy.data.meshes.new('R39_'+name+'_EDITABLE_SOURCE_MESH')
    R39_MESH.from_pydata([world_to_blender(v) for v in verts],[],faces)
    R39_MESH.update()
    R39_OB=bpy.data.objects.new('R39_'+name+'_EDITABLE',R39_MESH)
    bpy.context.collection.objects.link(R39_OB)
    R39_MOD=R39_OB.modifiers.new('R39_REAL_WATER_SECTION_THICKNESS','SOLIDIFY')
    R39_MOD.thickness=thickness
    R39_MOD.offset=-.5
    bpy.context.view_layer.update()
    R39_OBJ=R39_OB.evaluated_get(bpy.context.evaluated_depsgraph_get())
    R39_EV=R39_OBJ.to_mesh()
    R39_BM=R39_bmesh.new()
    R39_BM.from_mesh(R39_EV)
    R39_bmesh.ops.triangulate(R39_BM,faces=list(R39_BM.faces))
    R39_COUNT=0
    for R39_FACE in R39_BM.faces:
        R39_V=[(float(p.co.x),float(p.co.z),float(-p.co.y)) for p in R39_FACE.verts]
        if len(R39_V)!=3:raise AssertionError('R39_REAL_MESH_TRIANGULATION_FAILED')
        tri(R36_N[group],R39_V[0],R39_V[1],R39_V[2],material)
        R39_COUNT+=1
    R39_BM.free()
    R39_OBJ.to_mesh_clear()
    bpy.data.objects.remove(R39_OB,do_unlink=True)
    assert R39_COUNT>=50
    R39_DCC_EVALUATED.append({'name':name,'group':group,'polygonsFromRealEvaluatedBlender':R39_COUNT})
# A gently asymmetrical single surface, source crest y93 remains adjoining
# protected Road6 water19; downcast to actual open outlet y54 beyond R102.
R39_KNOTS=[(94.,93.35),(99.,93.1),(103.,91.0),
           (109.,82.5),(118.,68.5),(128.,56.7),(138.,54.0)]
R39_T_W=32
R39_VERTS=[]
for R39_D,R39_Y in R39_KNOTS:
    for R39_K in range(R39_T_W+1):
        R39_T=-20.+40.*R39_K/R39_T_W
        R39_RIDGE=(.8*R39_math.sin(.8*R39_K+.23*R39_D)
              +.28*R39_math.sin(1.37*R39_K-.31*R39_D))
        R39_VERTS.append(R36_AT(R39_D,R39_Y+R39_RIDGE,R39_T))
R39_NX=R39_T_W+1
R39_FACES=[]
for R39_K in range(len(R39_KNOTS)-1):
    for R39_J in range(R39_T_W):
        R39_A=R39_K*R39_NX+R39_J
        R39_FACES.append((R39_A,R39_A+1,R39_A+R39_NX+1,R39_A+R39_NX))
# Evaluate two connected true solid-water segments to preserve group23/24
# native draw provenance, not a flat cyan sheet or floating fake foam.
R39_SPLIT=3*R39_T_W
R39_EDITABLE_SURFACE('CONTINUOUS_HEADRACE_WET_CREST','23',
    R39_VERTS,R39_FACES[:R39_SPLIT],'r39_water_lit',.42)
R39_EDITABLE_SURFACE('DESCENDING_VENTED_OPEN_SPILLWAY','24',
    R39_VERTS,R39_FACES[R39_SPLIT:],'r39_water_shadow',.64)
# Split the structural banks along the water’s two edges, never an arch:
# retained low, asymmetric load-path shelves and a sloping toe pad.
def R39_BANK(name,group,t0,t1,raised):
    R39_POINTS=[
      R36_AT(75.,95.+raised,t0),R36_AT(98.,95.+raised,t0),
      R36_AT(119.,70.+raised,t0),R36_AT(139.,57.+raised,t0),
      R36_AT(75.,90.,t1),R36_AT(98.,88.,t1),
      R36_AT(119.,60.,t1),R36_AT(139.,49.,t1)]
    R39_FACESBANK=[(0,1,5,4),(1,2,6,5),(2,3,7,6),
        (0,4,7,3),(0,3,2,1),(4,5,6,7)]
    R36_BEVEL(name,group,R39_POINTS,R39_FACESBANK,
       'r39_weathered_limestone','r39_dark_cut_rock',.85)
R39_BANK('UPSTREAM_CONTOUR_SUPPORTED_LEFT_SHELF','15',-35.,-26.,2.)
R39_BANK('LOWER_ASYMMETRIC_GROUTED_RIGHT_BANK','16',24.,35.,0.)
# One genuinely hinged, supported vertical sector gate and counterweighted
# actuator at upstream lip, no independent decorative ring or tall gray wall.
R39_BLADE=[
 R36_AT(83.,92.,-14.),R36_AT(94.,93.,-14.),
 R36_AT(94.,109.,-11.),R36_AT(83.,108.,-11.),
 R36_AT(83.,92.,-10.),R36_AT(94.,93.,-10.),
 R36_AT(94.,109.,-7.),R36_AT(83.,108.,-7.)]
R39_BEAM_FACES=[(0,1,2,3),(4,7,6,5),(0,4,5,1),
    (1,5,6,2),(2,6,7,3),(3,7,4,0)]
R36_BEVEL('SINGLE_INCLINED_COPPER_SLIDE_GATE','17',
    R39_BLADE,R39_BEAM_FACES,'r39_patinated_gate','r39_tension_copper',.75)
beam(R36_N['17'],R36_AT(80.,108.,-12.),
     R36_AT(89.,117.,-22.),1.45,'r39_tension_copper')
beam(R36_N['17'],R36_AT(89.,117.,-22.),
     R36_AT(86.,99.,-32.),1.35,'r39_dark_cut_rock')
# One low, grounded forebay-to-slide thrust shoulder
R39_SHOULDER=[
 R36_AT(82.,94.,-42.),R36_AT(92.,94.,-42.),
 R36_AT(96.,111.,-35.),R36_AT(81.,109.,-35.),
 R36_AT(82.,87.,-29.),R36_AT(94.,87.,-29.),
 R36_AT(97.,101.,-27.),R36_AT(82.,101.,-27.)]
R36_BEVEL('UNEQUAL_LOAD_BEARING_HEADRACE_THROAT','15',
    R39_SHOULDER,R39_BEAM_FACES,'r39_dark_cut_rock','r39_weathered_limestone',.75)
assert len(GROUPS)==43
assert all(GROUPS[n]==v for n,v in R39_LOCKED.items())
R39_EVIDENCE={
 'schema':'k4ct-r39-source-road6-single-open-cut-real-blender-integrated-water-v1',
 'site':'original Road6 U .15 source right R75..138; water19 unchanged',
 'r38Evidence':'true WebGL2 visibility recovered by hiding surrounding nonprotected groups, source19 alone ineffective',
 'sourceGroup19Untouched':True,'openCutNoClosedArch':True,
 'r36ArchGroupsReauthored':['15','16','17'],
 'waterR36StripsReauthored':['23','24'],
 'localNonprotectedCutCounts':R39_CUT_COUNTS,
 'realEvaluatedBlenderWaterMeshes':R39_DCC_EVALUATED,
 'originalProtectedEightXYZRGBExactBeforeExport':True,
 'totalSceneTriangles':sum(map(len,GROUPS.values())),
 'originalB48':7,'originalB51':28,'newColliders':0,
 'originalSourceCameraAnd240HzUntouched':True,
 'noncollidingStaticSceneryNotFluidSimulation':True,
 'formalArtAdopted':0,'slope2DNAmeters':0,
 'ART':'HOLD','HUMAN':'HOLD','SAT':'HOLD','CCD':'HOLD',
 'FPS':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'
}
R39_P=R39_Path('test-results/k4ct-r39-art')
R39_P.mkdir(parents=True,exist_ok=True)
(R39_P/'R39_OPEN_QUARRY_SOURCE_MANIFEST.json').write_text(R39_json.dumps(R39_EVIDENCE,indent=2)+'\n')
print('R39_ONE_TRUE_BLENDER_OPEN_CUT_READY',R39_json.dumps(
 {'totalTriangles':R39_EVIDENCE['totalSceneTriangles'],
  'cutGroups':R39_CUT_COUNTS,
  'realWaterMeshes':R39_DCC_EVALUATED}))
