"""K4BT read-only native Blender projection audit of K4BS real CC0 pine instances.

DCC research only. The projected bounding rectangle is NOT a visible
silhouette, rendered pixel count, occlusion test, game FPS or ART pass.
This script deliberately performs zero renders and zero .blend saves.
"""
import bpy
import hashlib
import json
import struct
import sys
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

argv = sys.argv[sys.argv.index("--") + 1:]
def option(name):
    return Path(argv[argv.index(name) + 1]).resolve()

base = option("--base")
parent_audit = option("--parent-audit")
output = option("--out")
output.mkdir(parents=True, exist_ok=True)

SOURCE_BLEND = "156e56ce373b731f1f0c8f96278a11977ac93d491973c2e8ef796ec1ea7795de"
SOURCE_ROAD = "f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
SOURCE_GAME = "af076d67492a677d2235e4730aef8cdf4808e106"

def digest(path):
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()

assert digest(base) == SOURCE_BLEND, "Native K4BS .blend does not match immutable parent"
prior = json.loads(parent_audit.read_text(encoding="utf-8"))
assert prior["sourceGameImmutableBlob"] == SOURCE_GAME
assert prior["sourceB48Road5VertexFacePreserved"] is True
assert prior["originalSixSourceCamerasNumericallyUnchanged"] is True
assert prior["bothResearchCamerasNumericallyUnchanged"] is True
assert prior["actualImportedRealPineGLTFTriangles"] == 398144
assert prior["actualImportedMeshCount"] == 3
assert prior["researchTreeSharedGeometryInstances"] == 8
assert prior["formalArtAccepted"] == 0 and prior["formalSlope2DNAMetres"] == 0

bpy.ops.wm.open_mainfile(filepath=str(base))
scene = bpy.context.scene
original_rig = bpy.data.collections["05_CAMERA | Authentic original source poses"]
def camera_poses():
    return {
        ob.name: {
            "location": list(ob.location),
            "rotation": list(ob.rotation_euler),
            "lensMm": float(ob.data.lens),
        }
        for ob in original_rig.objects if ob.type == "CAMERA"
    }
poses_before = camera_poses()
assert len(poses_before) >= 6

def fingerprint(obj):
    h = hashlib.sha256()
    for vertex in obj.data.vertices:
        h.update(struct.pack("<3d", *(float(v) for v in vertex.co)))
    for poly in obj.data.polygons:
        h.update(struct.pack("<3i", *(int(v) for v in poly.vertices)))
    return h.hexdigest()

roads = {}
for mode in ("control", "ultra"):
    collection = bpy.data.collections["K4AY SOURCE B48 | " + mode.upper() + " | TRUE TESSELLATED ROAD5"]
    assert len(collection.objects) == 1
    roads[mode] = next(iter(collection.objects))
road_before = {key: fingerprint(obj) for key, obj in roads.items()}
assert set(road_before.values()) == {SOURCE_ROAD}

camera_matches = [
    obj for obj in bpy.data.objects
    if obj.type == "CAMERA" and obj.name.startswith(
        "K4BP | EXPERIMENT CAMERA | CHASE_NARROW |"
    )
]
assert len(camera_matches) == 1, "Cannot identify the frozen genuine research CHASE"
camera = camera_matches[0]
camera_state = (tuple(camera.location), tuple(camera.rotation_euler), float(camera.data.lens))
assert scene.render.resolution_x == 1280 and scene.render.resolution_y == 800
W, H = scene.render.resolution_x, scene.render.resolution_y

trees = sorted(
    (obj for obj in bpy.data.objects if obj.name.startswith("K4BS | genuine CC0 scanned pine tree ")),
    key=lambda ob: ob.name
)
assert len(trees) == 8
assert all(ob.instance_type == "COLLECTION" and ob.instance_collection for ob in trees)
template = trees[0].instance_collection
assert all(ob.instance_collection == template for ob in trees)
mesh_sources = [obj for obj in template.objects if obj.type == "MESH"]
assert len(mesh_sources) == 3, [o.name for o in mesh_sources]
triangles = sum(len(p.vertices) - 2 for ob in mesh_sources for p in ob.data.polygons)
assert triangles == 398144, triangles

# Evaluated depsgraph instance matrices include the nested native glTF
# transforms and the collection instancer transforms. Using just the
# instancer origin would miss the real canopy size and position.
corners = {tree.name: [] for tree in trees}
parts = {tree.name: 0 for tree in trees}
depsgraph = bpy.context.evaluated_depsgraph_get()
for item in depsgraph.object_instances:
    if not item.is_instance or item.parent is None or item.object.type != "MESH":
        continue
    parent = item.parent.original
    if parent.name not in corners:
        continue
    parts[parent.name] += 1
    corners[parent.name].extend(item.matrix_world @ Vector(vertex) for vertex in item.object.bound_box)

# If Blender omitted any instance from its evaluated scene, FAIL CLOSED.
# This is a source-visibility diagnostic, NOT an assumption of rendering.
assert all(parts[name] >= 3 and len(corners[name]) >= 24 for name in corners), parts

data = []
for ob in trees:
    world = corners[ob.name]
    low = [min(v[k] for v in world) for k in range(3)]
    high = [max(v[k] for v in world) for k in range(3)]
    projected = [world_to_camera_view(scene, camera, v) for v in world]
    in_front = [v for v in projected if v.z > 0]
    all_behind = len(in_front) == 0
    if in_front:
        # Corner-based projected envelope, not actual visible leaf pixels.
        xs = [p.x * W for p in in_front]
        ys = [(1.0 - p.y) * H for p in in_front]
        raw = [min(xs), min(ys), max(xs), max(ys)]
        clipped = [
            max(0, min(W, raw[0])), max(0, min(H, raw[1])),
            max(0, min(W, raw[2])), max(0, min(H, raw[3]))
        ]
        clipped_w = max(0, clipped[2] - clipped[0])
        clipped_h = max(0, clipped[3] - clipped[1])
        area_pct = clipped_w * clipped_h * 100.0 / (W * H)
    else:
        raw, clipped, clipped_w, clipped_h, area_pct = None, None, 0, 0, 0
    data.append({
        "object": ob.name,
        "sourceRoadStationM": ob.get("source_road_station_d"),
        "geometryPartsInEvaluatedDepsgraph": parts[ob.name],
        "sourceTriangleCountPerTree": triangles,
        "worldBoundsM": {"min": [round(x, 5) for x in low], "max": [round(x, 5) for x in high]},
        "actualWorldBoundingHeightM": round(high[2] - low[2], 5),
        "allBoundingCornersBehindCamera": all_behind,
        "anyBoundingCornerInFront": bool(in_front),
        "someBoundingCornersBehind": len(in_front) < len(projected),
        "rawProjectedEnvelopePixels": None if raw is None else [round(x, 2) for x in raw],
        "clippedProjectedEnvelopePixels": None if clipped is None else [round(x, 2) for x in clipped],
        "clippedEnvelopeWidthPx": round(clipped_w, 2),
        "clippedEnvelopeHeightPx": round(clipped_h, 2),
        "clippedEnvelopeAreaPercentOfFrame": round(area_pct, 5),
        "intersectsFrameByBoundingEnvelope": area_pct > 0,
        "instancerHiddenFromRender": bool(ob.hide_render),
        "templateCollectionHiddenFromRender": bool(template.hide_render),
        "notes": "Projection envelope only: does not prove leaves actually render, alpha, occlusion or visibility."
    })

assert poses_before == camera_poses(), "Source camera changed"
assert road_before == {key: fingerprint(obj) for key, obj in roads.items()}, "Source Road5 changed"
assert camera_state == (tuple(camera.location), tuple(camera.rotation_euler), float(camera.data.lens))
assert digest(base) == SOURCE_BLEND, "K4BS original changed during read-only audit"

summary = {
    "trees": len(trees),
    "trianglesPerTree": triangles,
    "inFrameEnvelopes": sum(bool(x["intersectsFrameByBoundingEnvelope"]) for x in data),
    "fullyBehind": sum(bool(x["allBoundingCornersBehindCamera"]) for x in data),
    "outOfFrame": sum(not x["intersectsFrameByBoundingEnvelope"] for x in data),
    "pixelEnvelopeDoesNotProveSilhouette": True,
    "alphaAndOcclusionNotMeasured": True,
}
audit = {
    "schema": "dopagaki.K4BT.native-K4BS-pine-screen-space-projection-audit/1",
    "originK4BSNativeBlendSHA256": SOURCE_BLEND,
    "originK4BSAuditSHA256": digest(parent_audit),
    "sourceGameImmutableBlob": SOURCE_GAME,
    "sourceB48Road5VertexFacePreserved": True,
    "originalSixCameraPosesUnchanged": True,
    "sameFrozenResearchChasePoseUnchanged": True,
    "camera": camera.name,
    "imageSizePixels": [W, H],
    "thisIsOriginalK4BSResearchCameraNotWebGLGame": True,
    "renderPerformed": False,
    "blendFileWritten": False,
    "geometryProjectionIsNotActualVisiblePixelMask": True,
    "treeInstances": data,
    "summary": summary,
    "ART": "REJECT_UNCHANGED",
    "formalArtAccepted": 0,
    "formalSlope2DNAMetres": 0,
    "realGameCollidersAdded": 0,
    "realGameSourceChanged": False,
    "sourcePhysicsHz": 240,
    "sourceBallRadiusM": .65,
    "sourceB48RoadCount": 7,
    "sourceB51MoverCount": 28,
    "HUMAN": "HOLD", "SAT": "HOLD", "CCD": "HOLD",
    "FPS": "HOLD", "RELEASE": "HOLD", "MERGE": "HOLD"
}
path = output / "K4BT_NATIVE_PINE_PROJECTION_RESEARCH_ONLY.json"
path.write_text(json.dumps(audit, ensure_ascii=False, indent=2), encoding="utf-8")
print("K4BT_READONLY_NATIVE_SCREEN_PROJECTION_COMPLETE", json.dumps(summary))
