"""K4CA: authentic, source-locked, one-frame coastal landscape author revision.

Start from K4BZ R2 *actual* corrected 271 MB editable Blender scene:
never reintroduce the source-raycast PBR wedge or move Road5, cameras, lights,
real old pines, existing CC0 canopy, game collider or protected web source.
Use existing vendor-verified/packed genuine CC0 island_tree_02 asset for
TWO separated wind-pruned coastal canopy instances, never painted cutouts.
Condition the existing rendered inland cut-rock slope *material* in-place
in the isolated research copy, never create another massive land triangle.
Blender EEVEE same CHASE 768x480. No false ART/production claims.
"""
import bpy,math,sys,json,hashlib,struct
from pathlib import Path
from mathutils import Vector,Matrix
from bpy_extras.object_utils import world_to_camera_view

args=sys.argv[sys.argv.index("--")+1:]
def get(k):return Path(args[args.index(k)+1]).resolve()
BASE=get("--base");OUT=get("--out");OUT.mkdir(parents=True,exist_ok=True)
BASE_SHA="162a7baaf7594b36a134457bee817bd7dcf0ef1b3e581419d6561efa92e45382"
ROAD_SHA="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
GAME_BLOB="af076d67492a677d2235e4730aef8cdf4808e106"
def sha(p):
 h=hashlib.sha256()
 with open(p,"rb") as f:
  for b in iter(lambda:f.read(1<<20),b""):h.update(b)
 return h.hexdigest()
assert sha(BASE)==BASE_SHA,("WRONG_K4BZ_R2_SOURCE",sha(BASE))
bpy.ops.wm.open_mainfile(filepath=str(BASE))
sc=bpy.context.scene
assert (sc.render.resolution_x,sc.render.resolution_y,sc.render.resolution_percentage)==(768,480,100)
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
def poses():
 return {o.name:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
         for o in rig.objects if o.type=="CAMERA"}
orig=poses();assert len(orig)>=6
cs=[o for o in bpy.data.objects if o.type=="CAMERA" and o.name.startswith("K4BP | EXPERIMENT CAMERA | CHASE_NARROW |")]
assert len(cs)==1
cam=cs[0];startcam=(tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))
assert sc.camera==cam
roads=[]
for k in ("CONTROL","ULTRA"):
 c=bpy.data.collections["K4AY SOURCE B48 | "+k+" | TRUE TESSELLATED ROAD5"]
 assert len(c.objects)==1
 roads.append(next(iter(c.objects)))
def facehash(ob):
 h=hashlib.sha256()
 for v in ob.data.vertices:h.update(struct.pack("<3d",*[float(x) for x in v.co]))
 for p in ob.data.polygons:h.update(struct.pack("<3i",*[int(x) for x in p.vertices]))
 return h.hexdigest()
assert {facehash(x) for x in roads}=={ROAD_SHA}
pine=[o for o in bpy.data.objects if o.name.startswith("K4BS | genuine CC0 scanned pine tree ")]
old_canopy=[o for o in bpy.data.objects if o.name.startswith("K4BV | TRUE WIND SHAPED CC0 COASTAL CANOPY")]
assert len(pine)==8 and len(old_canopy)==1
oldmat={o.name:tuple(tuple(row) for row in o.matrix_world) for o in pine+old_canopy}
oldhero=old_canopy[0]
assert oldhero.instance_type=="COLLECTION" and oldhero.instance_collection
assert oldhero.get("VENDOR_CC0")=="https://polyhaven.com/a/island_tree_02"
master=oldhero.instance_collection
vendor_meshes=[o for o in master.objects if o.type=="MESH"]
assert vendor_meshes
assert len([x for x in bpy.data.images if x.packed_file])>=9
bad=bpy.data.objects.get("K4BY | actual source raycast 1m road surface | NO GAME COLLIDER")
assert bad and bad.hide_render and bad.get('NOT_GAME_COLLIDER') is True
good=bpy.data.objects.get("K4BQ / physically variegated 26m curved material research test")
assert good and good.type=="MESH" and not good.hide_render
lights={o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}

coll=bpy.data.collections.new("K4CA | grounded authentic coastal wind canopy and natural inland rock | research only")
sc.collection.children.link(coll)
def actual_ray(px,py):
 frame=cam.data.view_frame(scene=sc)
 x0=min(v.x for v in frame);x1=max(v.x for v in frame)
 y0=min(v.y for v in frame);y1=max(v.y for v in frame)
 z=sum(v.z for v in frame)/len(frame)
 nx=(px+.5)/768.;ny=1-(py+.5)/480.
 v=Vector((x0+(x1-x0)*nx,y0+(y1-y0)*ny,z))
 origin=cam.matrix_world.translation.copy()
 direction=(cam.matrix_world.to_quaternion()@v).normalized()
 hit,loc,normal,index,ob,matrix=sc.ray_cast(bpy.context.evaluated_depsgraph_get(),origin,direction,distance=1600)
 if not hit:return None
 return {"screen":[px,py],"object":ob,"point":loc.copy(),"normal":normal.copy(),
         "face":int(index),"material":ob.data.materials[0].name if ob.type=="MESH" and ob.data.materials else None}
left_pixels=[(67,265),(113,255),(151,254),(202,274),(87,325),(156,333)]
samples=[x for x in (actual_ray(*pt) for pt in left_pixels) if x]
assert len(samples)>=5,("K4CA_HOLD_CANNOT_SAMPLE_TRUE_LEFT_LAND",samples)
for v in samples:
 name=v["object"].name
 assert v["object"].type=="MESH",(name,v["screen"])
 assert "SOURCE PHYSICAL ROAD5" not in name and "raycast 1m road" not in name
 assert not v["object"].hide_render
# From the source image sampled visible slope, choose largest physically
# identical surface among actual LEFT terrain hits. Material rework only.
from collections import Counter
counts=Counter(x["object"].name for x in samples)
slope_name,slope_n=counts.most_common(1)[0]
assert slope_n>=3,("K4CA_INCONSISTENT_LEFT_HILLSIDE_GEOMETRY",dict(counts))
slope=bpy.data.objects[slope_name]
assert slope not in roads and slope!=bad and slope!=good
assert slope.type=="MESH" and not slope.hide_render
old_slope_materials=[m.name for m in slope.data.materials]
def terrain_fingerprint(o):
 h=hashlib.sha256()
 for v in o.data.vertices:h.update(struct.pack("<3d",*[float(x) for x in v.co]))
 for p in o.data.polygons:
  h.update(struct.pack("<I",len(p.vertices)))
  for vid in p.vertices:h.update(struct.pack("<I",int(vid)))
 return h.hexdigest()
old_slope_geometry=terrain_fingerprint(slope)
# Do NOT change any mesh vertex/face or source game geometry. If the
# selected slope shares a Blender Mesh datablock, isolate it first.
slope.data=slope.data.copy()
assert terrain_fingerprint(slope)==old_slope_geometry
# Create a genuinely broad-scale weathered maritime lithology shader
# directly on the EXISTING terrain surface. Do not use camera-aligned
# polygon billboards, extra cliffs, giant boxes, stripes or rows.
rock=bpy.data.materials.new("K4CA | coastal wind-weathered calcareous sandstone scrub natural PBR")
rock.use_nodes=True
ns=rock.node_tree.nodes;ns.clear();links=rock.node_tree.links
out=ns.new("ShaderNodeOutputMaterial");pr=ns.new("ShaderNodeBsdfPrincipled")
pr.inputs["Roughness"].default_value=.93;pr.inputs["Metallic"].default_value=0.
links.new(pr.outputs["BSDF"],out.inputs["Surface"])
geom=ns.new("ShaderNodeTexCoord")
tex=ns.new("ShaderNodeTexNoise");tex.inputs["Scale"].default_value=.105
tex.inputs["Detail"].default_value=5.2;tex.inputs["Roughness"].default_value=.7
links.new(geom.outputs["Generated"],tex.inputs["Vector"]) if False else None
# World-space TextureCoordinate.Generated on huge terrain creates
# mushy stretch. Geometry Position is measured in real world metres.
xyz=ns.new("ShaderNodeNewGeometry")
links.new(xyz.outputs["Position"],tex.inputs["Vector"])
ramp=ns.new("ShaderNodeValToRGB")
ramp.color_ramp.elements.remove(ramp.color_ramp.elements[1])
for pos,color in [
 (.14,(.18,.20,.17,1)),(.32,(.26,.27,.22,1)),
 (.52,(.36,.35,.28,1)),(.69,(.48,.45,.35,1)),
 (.85,(.56,.53,.43,1))
]:
 elem=ramp.color_ramp.elements[0] if pos==.14 else ramp.color_ramp.elements.new(pos)
 elem.position=pos;elem.color=color
links.new(tex.outputs["Fac"],ramp.inputs["Fac"])
detail=ns.new("ShaderNodeTexNoise");detail.inputs["Scale"].default_value=2.8
detail.inputs["Detail"].default_value=2.2
links.new(xyz.outputs["Position"],detail.inputs["Vector"])
rough_bump=ns.new("ShaderNodeBump")
rough_bump.inputs["Strength"].default_value=.115
rough_bump.inputs["Distance"].default_value=.055
links.new(detail.outputs["Fac"],rough_bump.inputs["Height"])
links.new(rough_bump.outputs["Normal"],pr.inputs["Normal"])
links.new(ramp.outputs["Color"],pr.inputs["Base Color"])
slope.data.materials.clear();slope.data.materials.append(rock)
assert terrain_fingerprint(slope)==old_slope_geometry
# This does not certify physical geology. It is an authored research
# natural-surface treatment checked by one true native camera render.

# Real source master objects carry the genuine packed CC0 vendor PBR
# maps. Link the existing VERIFIED collection instance for only two
# nonuniform, separated plantings, instead of polygonal placeholder trees.
oldorigin=oldhero.matrix_world.translation.copy()
old_m=oldhero.matrix_world.copy()
local_corners=[old_m@o.matrix_world@Vector(c) for o in vendor_meshes for c in o.bound_box]
assert local_corners
old_base_offset=min(p.z for p in local_corners)-oldorigin.z
plant_pixels=[(113,255),(202,274)]
plant_yaws=(0.41,-.57)
plant_scale=(.97,.77)
placements=[]
for k,(px,py) in enumerate(plant_pixels):
 hit=actual_ray(px,py)
 assert hit and hit["object"].name==slope_name,(k,px,py,hit["object"].name if hit else "NO_HIT",slope_name)
 assert hit["normal"].z>.53,(k,"too steep for a tree",tuple(hit["normal"]))
 f=plant_scale[k];theta=plant_yaws[k]
 base=hit["point"]+Vector((0,0,.10-f*old_base_offset))
 M=(Matrix.Translation(base)@Matrix.Rotation(theta,4,"Z")@
    Matrix.Scale(f,4)@Matrix.Translation(-oldorigin)@old_m)
 obj=bpy.data.objects.new("K4CA | actual Poly Haven island_tree_02 original CC0 coastal tree "+str(k),None)
 coll.objects.link(obj);obj.instance_type="COLLECTION";obj.instance_collection=master
 obj.matrix_world=M
 obj["VENDOR_CC0"]="https://polyhaven.com/a/island_tree_02"
 obj["TRUE_VENDOR_GEOMETRY_NOT_BILLBOARD"]=True
 obj["NOT_GAME_COLLIDER"]=True
 obj["DCC_RESEARCH_ONLY"]=True
 # Original retained intact, new visible planting assets small count.
 w=world_to_camera_view(sc,cam,hit["point"]+Vector((0,0,4*f)))
 assert w.z>0 and .04<w.x<.53 and .20<w.y<.80
 placements.append({"sourcePixel":[px,py],"groundObject":slope_name,
                    "originalGeometry":"actual packed CC0 island_tree_02",
                    "groundWorld":[round(v,4) for v in hit["point"]],
                    "scaleRelativeToVerifiedTree":f,
                    "yawRadians":theta,
                    "projectedTreeCentre":[round(float(w.x),4),round(float(w.y),4)]})

# True source ownership and paid API protections. No scene geometry
# modifications for any road, vendor model or original pine/canopy.
assert poses()==orig
assert (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==startcam
assert {facehash(x) for x in roads}=={ROAD_SHA}
assert all(tuple(tuple(row) for row in o.matrix_world)==oldmat[o.name] for o in pine+old_canopy)
assert bad.hide_render and good.hide_render is False
assert {o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}==lights
assert terrain_fingerprint(slope)==old_slope_geometry
assert sha(BASE)==BASE_SHA

sc.camera=cam;sc.render.engine="BLENDER_EEVEE"
sc.render.resolution_x=768;sc.render.resolution_y=480;sc.render.resolution_percentage=100
sc.render.image_settings.file_format="PNG"
try:sc.eevee.taa_render_samples=8
except AttributeError:pass
blend=OUT/"K4CA_COASTAL_SLOPE_PHOTO_CANOPY_EDITABLE_NATIVE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(blend))
png=OUT/"K4CA_SAME_CHASE_TWO_REAL_CC0_COASTAL_TREES_WEATHERED_HILLSIDE_NOT_GAME.png"
sc.render.filepath=str(png);bpy.ops.render.render(write_still=True)
assert blend.stat().st_size>230_000_000
assert png.stat().st_size>30_000
audit={
 "schema":"dopagaki.k4ca.real-CC0-two-plantings-authored-rock-slope-native-art/1",
 "canonicalParentBlenderSHA256":BASE_SHA,
 "canonicalGameBlob":GAME_BLOB,"trueOriginalRoad5VertexFaceFingerprint":ROAD_SHA,
 "fixedOriginalSixSourceCameraPoses":True,"fixedExperimentChase":True,
 "fixedNineOriginalTreesTransforms":True,
 "fixedSunAndAreaLights":True,"originalGameSourceEdited":False,
 "originalRoad5GeometryEdited":False,"addedGameColliders":0,
 "K4BZProvenBlackWedgeOverlayRemainsHidden":True,
 "vendor":"https://polyhaven.com/a/island_tree_02",
 "vendorLicense":"CC0","genuinePackedVendorPhotosRemainInNative":True,
 "slopeMaterialAlterationOnly":slope_name,
 "slopeOriginalMeshFingerprint":old_slope_geometry,
 "oldTerrainMaterialNames":old_slope_materials,
 "newTerrainPBRMaterial":rock.name,
 "leftActualVisibleSurfaceRaycastSamples":[{
  "pixel":x["screen"],"object":x["object"].name,
  "faceIndex":x["face"],"normalZ":round(float(x["normal"].z),4),
  "oldMaterial":x["material"]} for x in samples],
 "plantings":placements,
 "newCC0FullCollectionTreeInstances":len(placements),
 "researchOnly":True,"realNativeEEVEEImage":[768,480],
 "ART":"UNJUDGED_HOLD","formalArtAccepted":0,"formalSlope2DNAMetres":0,
 "SAT":"HOLD","CCD":"HOLD","HUMAN":"HOLD","FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "files":{p.name:{"bytes":p.stat().st_size,"sha256":sha(p)} for p in (blend,png)}
}
(OUT/"K4CA_TRUE_NATIVE_SLOPE_CC0_CANOPY_AUDIT.json").write_text(
 json.dumps(audit,indent=2,ensure_ascii=False),encoding="utf-8")
print("K4CA_TRUE_SOURCE_PROTECTED_ONE_CHASE_SLOPE_ART_UNJUDGED",
 json.dumps({"slope":slope_name,"plantings":placements,"terrainRayObjects":dict(counts)},
 ensure_ascii=False),flush=True)
