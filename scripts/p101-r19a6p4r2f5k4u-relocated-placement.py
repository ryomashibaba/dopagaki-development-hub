"""K4U K4R geometry exactly unchanged, relocated source Road0 u=.85 on ORIGINAL A5 city.
No rejected B/F/G2/I architecture is reintroduced. Blender and GLB are
research-only; original source physics, collision, and camera remain immutable.
"""
import bpy,sys,os,json,math,hashlib
from pathlib import Path
from mathutils import Vector
from importlib.util import spec_from_file_location,module_from_spec

def arg(key):
    a=sys.argv[sys.argv.index("--")+1:]
    return a[a.index(key)+1]
def sha(filename):
    with open(filename,"rb") as stream:return hashlib.sha256(stream.read()).hexdigest()
src,out,blend,rep,anchors,cameras=[os.path.abspath(arg(k)) for k in
 ("--source","--output","--blend","--report","--anchors","--cameras")]
mode=arg("--mode")
assert mode in ("ultra","control")
os.makedirs(os.path.dirname(out),exist_ok=True)
roads=json.load(open(anchors,encoding="utf8"))
archive=json.load(open(cameras,encoding="utf8"))
SOURCE="af076d67492a677d2235e4730aef8cdf4808e106"
assert roads["mode"]==mode and roads["sourceBlob"]==SOURCE
assert roads["roadCount"]==7 and roads["realB51"]==28
assert archive["origin"]["originalGitBlob"]==SOURCE
assert sorted(x["tick"] for x in archive["frames"] if x["mode"]==mode)==[265,721,1057,1249,1921,2761]

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=src)
objects=sorted([o for o in bpy.context.scene.objects if o.type=="MESH"],key=lambda x:x.name)
assert len(objects)==5
original_faces=sum(len(o.data.polygons) for o in objects)
assert original_faces==10566
obj=objects[-1]
old_mesh=obj.data
inverse=obj.matrix_world.inverted()
old_attr=old_mesh.color_attributes.get("COLOR_0")
if old_attr is None:
    assert len(old_mesh.color_attributes)==1,[
        (attr.name,attr.domain) for attr in old_mesh.color_attributes]
    old_attr=old_mesh.color_attributes[0]
assert old_attr.domain in ("CORNER","POINT"),(old_attr.name,old_attr.domain)
base_vertices=[tuple(v.co) for v in old_mesh.vertices]
vertices=list(base_vertices)
faces=[tuple(poly.vertices) for poly in old_mesh.polygons]
colors=[]
for polygon in old_mesh.polygons:
    for index in polygon.loop_indices:
        source_index=index if old_attr.domain=="CORNER" else old_mesh.loops[index].vertex_index
        colors.append(tuple(old_attr.data[source_index].color))
assert len(colors)==len(old_mesh.loops)
candidate_face_count=0
palette=[(.20,.41,.51,1),(.61,.70,.64,1),(.12,.26,.35,1),
         (.88,.69,.44,1),(.69,.47,.33,1)]
def addloft(rings,color):
    global candidate_face_count
    assert len(rings)>=2
    n=len(rings[0]);assert n==4
    start=len(vertices)
    for ring in rings:
        assert len(ring)==n
        for v in ring:
            assert all(math.isfinite(z) and abs(z)<1e6 for z in v)
            vertices.append(tuple(inverse@v))
    candidate_faces=[]
    for i in range(len(rings)-1):
        for k in range(n):
            candidate_faces.append((start+i*n+k,start+i*n+(k+1)%n,
              start+(i+1)*n+(k+1)%n,start+(i+1)*n+k))
    candidate_faces.append(tuple(start+k for k in reversed(range(n))))
    candidate_faces.append(tuple(start+(len(rings)-1)*n+k for k in range(n)))
    for f in candidate_faces:
        faces.append(f)
        colors.extend([palette[color%len(palette)]]*len(f))
    candidate_face_count+=len(candidate_faces)
def bvec(p):return Vector((p[0],-p[2],p[1]))
def lerp(a,b,f):return Vector(a).lerp(Vector(b),f)
def frame(site,u):
    r=roads["roads"][site["road"]]["stations"]
    t=min(80.0,max(0.0,80*u));i=min(79,int(t));frac=t-i
    center=lerp(r[i]["center"],r[i+1]["center"],frac)
    edge_name="left" if site["side"]<0 else "right"
    edge=lerp(r[i][edge_name],r[i+1][edge_name],frac)
    forward=lerp(r[i]["forward"],r[i+1]["forward"],frac)
    forward.y=0.;forward.normalize()
    outward=edge-center;outward.y=0.
    outward-=forward*outward.dot(forward)
    outward.normalize()
    assert abs(outward.dot(forward))<.015
    return bvec(edge),bvec(outward),bvec(forward),bvec((0,1,0))

# K4U does NOT create another architecture: use EXACT frozen K4R 34-module geometry.
# Only replace the real native Road0 edge anchor from u=.75 to u=.85.
market_path=Path(__file__).with_name("p101-r19a6p4r2f5k4r-open-market.py")
# The source geometry blob is independently pinned by K4U GitHub Actions.
spec=spec_from_file_location("k4u_native_market",market_path)
model=module_from_spec(spec);spec.loader.exec_module(model)
def relocation_frame(site,u):
    assert site=={"road":0,"side":1} and abs(u-.75)<1e-10
    return frame(site,.85)
candidate=model.add_open_market(addloft,relocation_frame)
assert candidate["meshModules"]==34 and candidate_face_count==668
assert candidate["originalRoad"]==0 and candidate["originalRoadU"]==.75
assert candidate["side"]=="right" and candidate["offsetFromOriginalEdgeM"]==70
candidate["relocatedFromRoadU"]=.75
candidate["originalRoadU"]=.85
candidate["originalArtworkSource"]="EXACT_FROZEN_K4R_34_MODULES_668_FACES"
candidate["noArchitecturalGeometryRedesign"]=True
assert candidate_face_count>180 and len(vertices)>len(base_vertices)+150
mesh=bpy.data.meshes.new("K4U exact K4R sculptural geometry repositioned from u=.75 to u=.85")
mesh.from_pydata(vertices,[],faces)
mesh.update()
assert len(mesh.loops)==len(colors),(len(mesh.loops),len(colors))
attr=mesh.color_attributes.new(name="COLOR_0",type="FLOAT_COLOR",domain="CORNER")
for i,rgba in enumerate(colors):
    attr.data[i].color=rgba
obj.data=mesh
if old_mesh.users==0:bpy.data.meshes.remove(old_mesh)
assert len([o for o in bpy.context.scene.objects if o.type=="MESH"])==5
new_faces=sum(len(o.data.polygons) for o in objects)
assert new_faces==original_faces+candidate_face_count
assert new_faces<30000
bpy.ops.wm.save_as_mainfile(filepath=blend)
bpy.ops.export_scene.gltf(filepath=out,export_format="GLB",use_selection=False)
assert os.stat(out).st_size>100000
report={
 "schema":"dopagaki.r2f5k4u-source-original-only-native-market/1",
 "mode":mode,"originalSourceBlob":SOURCE,
 "source_glb_sha256":sha(src),"edited_glb_sha256":sha(out),
 "blend_sha256":sha(blend),"source_anchors_sha256":sha(anchors),
 "archived_A1_12_camera_sha256":sha(cameras),
 "source_faces":original_faces,"edited_faces":new_faces,
 "added_faces":candidate_face_count,"editable_districts":5,
 "new_colliders":0,"globalB48B51ClearanceVerified":False,
 "k4uBaselineMode":"DIRECT_ORIGINAL_A5_NO_HISTORICAL_REJECTED_ART",
 "k4uSingleCandidate":candidate,"k4uOfficialArtAcceptance":False,
 "k4uSlope2DNARecognizedM":0,"realBlender":bpy.app.version_string,
 "ART":"HOLD","HUMAN":"HOLD","GAMEPLAY":"HOLD",
 "PERFORMANCE":"HOLD","RELEASE":"HOLD","MERGE":"HOLD"}
with open(rep,"w",encoding="utf8") as handle:
    json.dump(report,handle,ensure_ascii=False,indent=2)
print("R2F5K4U_ORIGINAL_ONLY_BLENDER_NATIVE_MARKET",json.dumps({
 "mode":mode,"sourceFaces":original_faces,"nativeAddedFaces":candidate_face_count,
 "editedFaces":new_faces,"marketModules":candidate["meshModules"],"ART":"HOLD"}))
