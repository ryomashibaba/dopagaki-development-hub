# G4E-7DZ R6C: REAL DR source obstacle-04 sampled keep-out study.
# A spatial design aid, NOT a new city, NOT continuous-time safety certification.
import bpy
import json
import math
import os
import sys
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

argv = sys.argv[sys.argv.index("--")+1:]
def arg(name):
    assert name in argv, name
    return argv[argv.index(name)+1]
road = arg("--road")
assert road in ("true-pinch", "pinch-switch")
out = arg("--out")
os.makedirs(out, exist_ok=True)

bpy.ops.wm.open_mainfile(filepath=arg("--source"))
scene = bpy.context.scene
assert scene.get("DO_SCENE_IS_NOT_GAME_WEBGL") is True
assert scene.get("DR_ACTUAL_B48_MESH_COUNT") == 7
assert scene.get("DR_ACTUAL_B51_POSES_PER_FRAME") == 28
assert scene.get("DR_ACTUAL_B48_VOID_CELL52") is True
cx = [o for o in bpy.data.objects if o.get("game_world_xyz_unmodified")]
b48 = [o for o in bpy.data.objects if o.get("MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER")]
b51 = [o for o in bpy.data.objects if o.get("SOURCE_ORIGINAL_B51_ID")]
cams = bpy.data.collections["DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION"]
assert (len(cx), len(b48), len(b51), len(cams.objects)) == (18,7,28,5)
matches = [o for o in b51 if o["SOURCE_ORIGINAL_B51_ID"] == "a13-machine-04"]
assert len(matches) == 1, [o.get("SOURCE_ORIGINAL_B51_ID") for o in b51]
machine = matches[0]

def provenance():
    return {
      "CX": sorted((o.name, o["source_sha256"], len(o.data.polygons)) for o in cx),
      "B48": sorted((o.name, o["ORIGINAL_GAME_B48_SHA256"], len(o.data.polygons)) for o in b48),
      "B51": sorted((o.name, o["SOURCE_ORIGINAL_B51_ID"]) for o in b51),
      "cameras": sorted((o.name, float(o["true_240hz_time"])) for o in cams.objects),
    }
before = provenance()
times = ("t1550", "t1600", "t1650", "t1700")
def bounds(vertices):
    assert vertices
    cols = list(zip(*vertices))
    assert all(math.isfinite(v) for col in cols for v in col)
    return {"min": [min(c) for c in cols], "max": [max(c) for c in cols]}

frame_bounds = {}
all_points = []
for fi, key in enumerate(times, 2):
    scene.frame_set(fi)
    bpy.context.view_layer.update()
    vertices = [tuple(machine.matrix_world @ v.co) for v in machine.data.vertices]
    assert len(vertices) >= 3
    frame_bounds[key] = bounds(vertices)
    all_points.extend(vertices)
envelope = bounds(all_points)
# This is NOT collision clearance; it is only a visual planning setback.
margin = 2.0
expanded = {"min": [x-margin for x in envelope["min"]],
            "max": [x+margin for x in envelope["max"]]}
assert all(expanded["min"][k] < expanded["max"][k] for k in range(3))

collection = bpy.data.collections.new("R6C PRIVATE B51-04 SAMPLED ENVELOPE / NO CITY ART")
scene.collection.children.link(collection)
def line_material(name, rgba):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nodes = m.node_tree.nodes
    nodes.clear()
    emission = nodes.new("ShaderNodeEmission")
    emission.inputs["Color"].default_value = rgba
    emission.inputs["Strength"].default_value = 2.8
    output = nodes.new("ShaderNodeOutputMaterial")
    m.node_tree.links.new(emission.outputs["Emission"], output.inputs["Surface"])
    m.diffuse_color = rgba
    return m

sample_mat = line_material("R6C amber sampled frame (NOT safe)", (1.0,0.46,0.04,1))
union_mat = line_material("R6C cyan union (NOT swept motion)", (0.03,0.9,0.9,1))
def corners(aabb):
    lo, hi = aabb["min"], aabb["max"]
    return [(lo[0] if i & 1 == 0 else hi[0],
             lo[1] if i & 2 == 0 else hi[1],
             lo[2] if i & 4 == 0 else hi[2]) for i in range(8)]
edges = [(0,1),(2,3),(4,5),(6,7),
         (0,2),(1,3),(4,6),(5,7),
         (0,4),(1,5),(2,6),(3,7)]
def draw_box(name, aabb, material, thickness):
    verts = corners(aabb)
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 1
    curve.bevel_depth = thickness
    curve.resolution_u = 1
    curve.bevel_resolution = 2
    for a,b in edges:
        spline = curve.splines.new("POLY")
        spline.points.add(1)
        spline.points[0].co = (*verts[a], 1)
        spline.points[1].co = (*verts[b], 1)
    obj = bpy.data.objects.new(name, curve)
    collection.objects.link(obj)
    obj.data.materials.append(material)
    obj["R6C_UNADOPTED_DIAGNOSTIC"] = True
    obj["R6C_NEW_GAME_COLLIDER"] = False
    return obj

# Render a single globally sampled union + four source sampled poses.
for key,box in frame_bounds.items():
    draw_box("R6C B51-04 sample "+key,box,sample_mat,0.10)
draw_box("R6C B51-04 four-sample union + 2m", expanded, union_mat, 0.18)
after = provenance()
assert before == after

per_camera = {}
for fi,key in enumerate(times,2):
    scene.frame_set(fi)
    bpy.context.view_layer.update()
    cam = cams.objects.get(key+" REAL ORIGINAL 240HZ")
    assert cam is not None and cam.type == "CAMERA"
    ndc = [world_to_camera_view(scene, cam, Vector(p)) for p in corners(expanded)]
    front = [p for p in ndc if p.z > 0]
    per_camera[key] = {
       "cornerInFrameCount": sum(p.z > 0 and 0 <= p.x <= 1 and 0 <= p.y <= 1 for p in ndc),
       "allCornersInFront": len(front) == 8,
       "visibleCornerBoundsNdcIfInFront": (
         {"min":[min(p.x for p in front),min(p.y for p in front)],
          "max":[max(p.x for p in front),max(p.y for p in front)]} if front else None),
       "NOT": "a rendered new city or an occlusion-safe envelope"
    }

scene["R6C_PRIVATE_SOURCE_ENVELOPE"] = True
scene["R6C_NEW_GAME_COLLIDERS"] = 0
scene["R6C_ART"] = "HOLD"
scene["R6C_RELEASE"] = "HOLD"
scene.cycles.device = "CPU"
scene.cycles.samples = 6
scene.cycles.use_denoising = False
scene.render.threads_mode = "FIXED"
scene.render.threads = 2
scene.render.image_settings.file_format = "PNG"
scene.frame_set(2)
blend = "R6C_"+road+"_B51_04_SAMPLED_ENVELOPE_EDITABLE_PRIVATE.blend"
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
renders = []
for fi,key in enumerate(times,2):
    scene.frame_set(fi)
    scene.camera = cams.objects.get(key+" REAL ORIGINAL 240HZ")
    img = "R6C_"+road+"_"+key+"_TRUE_BLENDER_GUIDE_NOT_CITY.png"
    scene.render.filepath = os.path.join(out,img)
    bpy.ops.render.render(write_still=True)
    renders.append(img)
audit = {
  "schema":"dopagaki.g4e7dz-r6c-sampled-machine-keepout/1",
  "road":road,"machine":"a13-machine-04",
  "originalCXBlob":"af076d67492a677d2235e4730aef8cdf4808e106",
  "sourceCX":len(cx),"sourceB48":len(b48),"sourceB51":len(b51),
  "sourceCameras":len(cams.objects),"gap52":True,
  "sourceIdentityPreserved":before==after,
  "frameWorldAabb":frame_bounds,"fourSampleUnionAabb":envelope,
  "planningSetbackMetres":margin,"expandedPlanningBoxAabb":expanded,
  "cameraGuide":per_camera,"newDiagnosticCurves":len(collection.objects),
  "newCityMeshes":0,"newGameColliders":0,
  "sourceGameChanged":False,"originalBlenderSource":arg("--source"),
  "editableGuideBlend":blend,"trueBlenderGuidePngs":renders,
  "motionBetweenSnapshots":"UNKNOWN","futureSafeSpace":"NOT_CERTIFIED",
  "solidIntersections":"NOT_TESTED_FOR_NEW_CITY",
  "newCityWebGL":"NOT_RENDERED","humanPlay":"NOT_RUN",
  "functionLegibility":"NOT_TESTED","originalCXConnected":"NOT_TESTED",
  "officialArt":0,"officialSlope2Meters":0,
  "TECH":"SOURCE_VISUAL_GUIDE_ONLY","ART":"HOLD","GAMEPLAY":"HOLD",
  "PERFORMANCE":"HOLD","INTEGRATION":"HOLD","RELEASE":"HOLD","MERGE":"HOLD"
}
with open(os.path.join(out,"R6C_"+road+"_AUDIT.json"),"w",encoding="utf-8") as f:
    json.dump(audit,f,indent=2,ensure_ascii=False)
print("R6C_SOURCE_KEEP_OUT_GUIDE_ONLY",road,"machine",machine.name,
      "poses",len(frame_bounds),"new city",0,"source preserved",before==after)
