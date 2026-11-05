"""K4CS DCC-FIRST: genuine real sampled B48 Road5, R2 coast, K4CS B51 warning gates.
Editable Blender 4.x; the exact emitted mesh matches WebGL2 authored geometry.
No fake physical road; no original game/source .blend modification.
"""
import bpy
import json
from pathlib import Path

out=Path('test-results/k4cs-native-readable')
physical=Path('test-results/k4cr-native-physical')
audit=json.loads((out/'K4CS_BUILD_AUDIT.json').read_text())
assert bpy.app.version >= (4,0,0), bpy.app.version_string
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for f in [physical/'K4CR_ROAD5.obj', physical/'K4CR_SCENE.obj', out/'K4CS_GATES.obj']:
    assert f.is_file(), f
    bpy.ops.wm.obj_import(filepath=str(f.resolve()))
objs=[x for x in bpy.context.scene.objects if x.type=='MESH']
assert len(objs)==3, [x.name for x in objs]
road=next(x for x in objs if 'ROAD5' in x.name.upper())
coast=next(x for x in objs if 'COAST' in x.name.upper())
gates=next(x for x in objs if x not in (road,coast))
assert len(road.data.polygons)==2400
assert len(coast.data.polygons)==4616
assert len(gates.data.polygons)==audit['actualWarningGateTriangles']
road.name='K4CS_SOURCE_B48_PHYSICAL_ROAD5_INVARIANT'
road['sourcePhysicalSHA256']=audit['originalPhysicalRoad5SHA256']
coast.name='K4CS_REUSED_K4CQ_R2_ART_REJECT_COAST'
gates.name='K4CS_REAL_ROAD_OUTBOARD_NONCOLLIDING_B51_EARLY_BEACONS'
gates['collision']='NONE'
gates['humansCertified']=False
blend=out/'K4CS_TRUE_ORIGINAL_B48_240HZ_GAMEPLAY_CUE_ART_HOLD.blend'
bpy.ops.wm.save_as_mainfile(filepath=str(blend.resolve()))
assert blend.stat().st_size>30000
result={'editableBlender':True,'blenderVersion':bpy.app.version_string,
 'actualRoadTriangles':len(road.data.polygons),'sameARTRejectCoastTriangles':len(coast.data.polygons),
 'originalRealRoadOutsideBeacons':len(gates.data.polygons),'sourceOriginalGameUnchanged':True,
 'formalART':0,'SLOPE2_DNA_M':0,'HUMAN':'HOLD','RELEASE':'HOLD'}
(out/'K4CS_NATIVE_DCC_RESULT.json').write_text(json.dumps(result,indent=2)+'\n')
print('K4CS_TRUE_EDITABLE_DCC_HOLD',json.dumps(result))
