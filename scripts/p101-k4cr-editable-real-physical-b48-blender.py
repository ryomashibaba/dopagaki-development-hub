"""Native Blender 4.x: import REAL sampled Road5 and its paired environment.
Not a fake road, not an edited original, no formal ART/physics certification.
"""
import bpy
import json
from pathlib import Path

out = Path('test-results/k4cr-native-physical')
data = json.loads((out/'K4CR_BUILD_AUDIT.json').read_text())
assert bpy.app.version >= (4,0,0)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for stem in ['K4CR_SCENE','K4CR_ROAD5']:
    obj = out/f'{stem}.obj'
    assert obj.is_file() and (out/f'{stem}.mtl').is_file(), stem
    bpy.ops.wm.obj_import(filepath=str(obj.resolve()))
objects = [o for o in bpy.context.scene.objects if o.type == 'MESH']
assert len(objects)==2, [o.name for o in objects]
road = next(o for o in objects if 'ROAD5' in o.name.upper())
scene = next(o for o in objects if o!=road)
assert len(road.data.polygons)==data['nativeRoad5ExportTriangles']
assert len(scene.data.polygons)==data['noncollidingEnvironmentTriangles']
road.name = 'K4CR_ACTUAL_B48_ROAD5_PHYSICAL_COURSE_NOT_APPROVED'
road['isolation'] = 'Source-sampled original B48 collision surface in PRIVATE research variant'
road['physicalGeometrySHA256'] = data['isolatedK4CRPhysicalRoad5SHA256']
scene.name = 'K4CR_COAST_REUSED_ART_REJECT_BACKGROUND'
scene['art'] = 'K4CQ R2 ART REJECT reused only to compare actual Road5'
bpy.ops.wm.save_as_mainfile(filepath=str((out/'K4CR_TRUE_EDITABLE_ROAD5_B48_AND_COAST_HOLD.blend').resolve()))
assert (out/'K4CR_TRUE_EDITABLE_ROAD5_B48_AND_COAST_HOLD.blend').stat().st_size > 30000
result = {'blenderVersion':bpy.app.version_string,'editable':True,
 'actualRoad5SourceGeometrySHA256':data['isolatedK4CRPhysicalRoad5SHA256'],
 'road5Triangles':len(road.data.polygons),'sceneTriangles':len(scene.data.polygons),
 'meshObjects':len(objects),'sourceGameAndOfficialOriginalRoad5Untouched':True,
 'formalART':'HOLD','manualPlay':'HOLD'}
(out/'K4CR_NATIVE_DCC_RESULT.json').write_text(json.dumps(result,indent=2)+'\n')
print('K4CR_TRUE_BLENDER_PHYSICAL_ROAD5', json.dumps(result))
