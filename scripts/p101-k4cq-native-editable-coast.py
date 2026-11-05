"""Import the very same triangulated 3D K4CQ WebGL2 scene as editable native Blender.
No original .blend or original game data opened, saved, or mutated.
"""
import bpy
import json
from pathlib import Path

out = Path('test-results/k4cq-integrated')
obj = out / 'K4CQ_COAST.obj'
assert obj.is_file() and (out/'K4CQ_COAST.mtl').is_file(), 'K4CQ authored mesh missing'
assert bpy.app.version >= (4, 0, 0), 'Native Blender 4.x required'
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.ops.wm.obj_import(filepath=str(obj.resolve()))
objects = [o for o in bpy.context.scene.objects if o.type == 'MESH']
assert objects, 'Native OBJ import generated no editable mesh'
vertices = sum(len(o.data.vertices) for o in objects)
triangles = sum(len(o.data.polygons) for o in objects)
audit = json.loads((out/'K4CQ_BUILD_AUDIT.json').read_text())
assert triangles == audit['sceneTriangles'], (triangles, audit['sceneTriangles'])
assert vertices > 1000, (vertices, triangles)
for o in objects:
    o.name = 'K4CQ_NATIVE_EDITABLE_' + o.name
    o['purpose'] = 'PRIVATE 3D art / physical road NOT included'
    o['source'] = 'K4CQ real Road5 sampled world coordinates'
blend = out / 'K4CQ_EDITABLE_TRUE_SOURCE_COORDINATE_COAST_ART_HOLD.blend'
bpy.ops.wm.save_as_mainfile(filepath=str(blend.resolve()))
assert blend.is_file() and blend.stat().st_size > 30000
result = {'blenderVersion': bpy.app.version_string, 'editable': True,
          'meshObjects': len(objects), 'vertices': vertices, 'triangles': triangles,
          'originalSourceGameEdited': False, 'originalRoad5Edited': False,
          'formalART': 'HOLD', 'humanPLAY': 'HOLD'}
(out/'K4CQ_NATIVE_DCC_RESULT.json').write_text(json.dumps(result, indent=2)+'\n')
print('K4CQ_TRUE_NATIVE_EDITABLE_BLENDER', json.dumps(result))
