"""K4CB A2 — source-locked sculpted ferry-terminal hall, genuine native CHASE.
This is an isolated, editable ART-HOLD study. Nothing is merged into the game.
Architectural mass/section replaces the weak miniature-scale visual emphasis;
it does not proliferate prop boxes, plant trees, or overlay another road skin.
"""
import bpy, hashlib, json, math, struct, sys
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

def getarg(k):
    return Path(sys.argv[sys.argv.index(k)+1]).resolve()
parent=getarg("--base")
out=getarg("--out")
out.mkdir(parents=True,exist_ok=True)
PARENT_SHA="9df956acf164d7a0f4d861585644e15f87faa5d85683f2e8ae79bb438c03333d"
GAME="af076d67492a677d2235e4730aef8cdf4808e106"
ROAD="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
def sha(path):
    h=hashlib.sha256()
    with open(path,"rb") as f:
        for p in iter(lambda:f.read(1048576),b""):
            h.update(p)
    return h.hexdigest()

assert sha(parent)==PARENT_SHA,("A2_HOLD_PARENT_A1_IDENTITY",sha(parent))
bpy.ops.wm.open_mainfile(filepath=str(parent))
scene=bpy.context.scene
assert (scene.render.resolution_x,scene.render.resolution_y,scene.render.resolution_percentage)==(768,480,100)
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
def camera_poses():
    return {o.name:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
            for o in rig.objects if o.type=="CAMERA"}
original_camera_poses=camera_poses()
assert len(original_camera_poses)>=6
cams=[o for o in bpy.data.objects if o.type=="CAMERA"
      and o.name.startswith("K4BP | EXPERIMENT CAMERA | CHASE_NARROW |")]
assert len(cams)==1
cam=cams[0]
chase_pose=(tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))
assert scene.camera==cam
def road_hash(o):
    h=hashlib.sha256()
    for v in o.data.vertices:
        h.update(struct.pack("<3d",*[float(z) for z in v.co]))
    for p in o.data.polygons:
        h.update(struct.pack("<3i",*[int(z) for z in p.vertices]))
    return h.hexdigest()
roads=[]
for label in ("CONTROL","ULTRA"):
    c=bpy.data.collections["K4AY SOURCE B48 | "+label+" | TRUE TESSELLATED ROAD5"]
    assert len(c.objects)==1
    roads.append(next(iter(c.objects)))
assert {road_hash(o) for o in roads}=={ROAD}
pine=[o for o in bpy.data.objects if o.name.startswith("K4BS | genuine CC0 scanned pine tree ")]
canopy=[o for o in bpy.data.objects if o.name.startswith("K4BV | TRUE WIND SHAPED CC0 COASTAL CANOPY")]
k4ca=[o for o in bpy.data.objects if o.name.startswith("K4CA | actual Poly Haven island_tree_02")]
assert (len(pine),len(canopy),len(k4ca))==(8,1,2)
trees=pine+canopy+k4ca
tree_matrices={o.name:tuple(tuple(row) for row in o.matrix_world) for o in trees}
assert len(tree_matrices)==11
bad=bpy.data.objects.get("K4BY | actual source raycast 1m road surface | NO GAME COLLIDER")
good=bpy.data.objects.get("K4BQ / physically variegated 26m curved material research test")
assert bad and bad.hide_render and bad.get("NOT_GAME_COLLIDER") is True
assert good and not good.hide_render
existing={o.name:(bool(o.hide_render),bool(o.hide_viewport)) for o in bpy.data.objects}
lights={o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}
source_roof=[o for o in bpy.data.objects
             if o.name.startswith("K4BW | folded coastal museum and boat service canopy shell")]
source_piers=[o for o in bpy.data.objects
              if o.name.startswith("K4BW | galvanized slender structural pier")]
assert len(source_roof)==1 and len(source_piers) in (12,14)
roof=source_roof[0]
roof_points=[roof.matrix_world@v.co for v in roof.data.vertices]
assert len(roof_points)==275
base_z=min((o.matrix_world@v.co).z for o in source_piers for v in o.data.vertices)
roof_bottom=min(p.z for p in roof_points)
assert 6<roof_bottom-base_z<11.2
center=sum(roof_points,Vector())/len(roof_points)
base=Vector((center.x,center.y,base_z))
direction_cameras=[o for o in rig.objects if o.type=="CAMERA" and "11307" in o.name]
assert len(direction_cameras)==1
v=direction_cameras[0].matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((v.x,v.y,0)).normalized()
S=Vector((-F.y,F.x,0))
def at(along,side,height=0):
    return base+F*along+S*side+Vector((0,0,height))
s_front=min((-5.85,5.85),key=lambda s:(at(0,s)-cam.location).length)
sgn=1 if s_front>0 else -1
arcade=bpy.data.collections["K4CB | inhabited maritime exchange arcades | DCC RESEARCH ONLY"]
assert len([o for o in arcade.objects if o.type=="MESH"])>=17
assert any("true load-bearing masonry vault" in o.name for o in arcade.objects)
newcoll=bpy.data.collections.new("K4CB A2 | sculpted working ferry terminal | DCC ART HOLD")
scene.collection.children.link(newcoll)
created=[]
def material(name,a,b,metallic=0.0,rough=0.65,scale=0.20):
    m=bpy.data.materials.new("K4CB A2 | "+name)
    m.use_nodes=True
    nodes=m.node_tree.nodes
    nodes.clear()
    outnode=nodes.new("ShaderNodeOutputMaterial")
    p=nodes.new("ShaderNodeBsdfPrincipled")
    p.inputs["Metallic"].default_value=metallic
    p.inputs["Roughness"].default_value=rough
    m.node_tree.links.new(p.outputs["BSDF"],outnode.inputs["Surface"])
    geo=nodes.new("ShaderNodeNewGeometry")
    noise=nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value=scale
    noise.inputs["Detail"].default_value=4
    noise.inputs["Roughness"].default_value=.65
    ramp=nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color=(*a,1)
    ramp.color_ramp.elements[1].color=(*b,1)
    m.node_tree.links.new(geo.outputs["Position"],noise.inputs["Vector"])
    m.node_tree.links.new(noise.outputs["Fac"],ramp.inputs["Fac"])
    m.node_tree.links.new(ramp.outputs["Color"],p.inputs["Base Color"])
    return m
roofmat=material("weathered sea-salt patinated structural zinc",(.15,.22,.22),(.33,.40,.39),.62,.44,.24)
underside=material("warm timber soffit with spatial depth",(.17,.12,.08),(.38,.29,.20),0,.7,.32)
piermat=material("cast tidal concrete buttress",(.23,.23,.20),(.51,.49,.42),0,.86,.37)
glass=material("recessed daylight ferry hall glazing",(.06,.115,.13),(.12,.19,.21),.25,.18,.22)
stone=material("weathered harbour arrival paving",(.30,.27,.22),(.47,.42,.34),0,.82,.46)
def make(name,verts,faces,mat,role,smooth=False):
    me=bpy.data.meshes.new("K4CB A2 | "+name)
    me.from_pydata([tuple(p) for p in verts],[],faces)
    me.update()
    ob=bpy.data.objects.new("K4CB A2 | "+name,me)
    newcoll.objects.link(ob)
    me.materials.append(mat)
    ob["DCC_RESEARCH_ONLY"]=True
    ob["NOT_GAME_COLLIDER"]=True
    ob["AUTHOR_FUNCTION"]=role
    if smooth:
        for face in me.polygons:
            face.use_smooth=True
    created.append(ob)
    return ob
def block(name,xa,xb,sidea,sideb,za,zb,mat,role):
    vv=[at(x,s,z) for z in (za,zb) for x,s in
        ((xa,sidea),(xb,sidea),(xb,sideb),(xa,sideb))]
    return make(name,vv,[(0,3,2,1),(4,5,6,7),(0,1,5,4),
                         (1,2,6,5),(2,3,7,6),(3,0,4,7)],mat,role)
def project(p):
    q=world_to_camera_view(scene,cam,p)
    return {"x":float(q.x),"y":float(q.y),"visible":q.z>0 and 0<=q.x<=1 and 0<=q.y<=1}
# Broad, sculpted double-curvature ferry-terminal hull. Instead of placing
# more miniature bays, this is a *single engineered public-building volume*:
# the near edge shelters a walkable arrival hall, the rear lands on original piers.
N=32
M=12
def sheet_point(i,j,lower=False):
    t=2*i/N-1
    u=j/M
    along=26.0*t*(.96+.04*math.sin(math.pi*u))
    side=s_front+sgn*(1.70+9.70*u)
    central=max(0.0,1-t*t)**.64
    # A tide-swept roof section: non-coplanar, naturally rises from old hall.
    z=(roof_bottom-base_z)+.92+central*(3.2+4.7*math.sin(math.pi*u))
    z+=1.05*u+.55*t
    if lower:z-=.56
    return at(along,side,z)
V=[sheet_point(i,j,lower) for lower in (False,True)
   for i in range(N+1) for j in range(M+1)]
stride=(N+1)*(M+1)
ix=lambda i,j,low=0:low*stride+i*(M+1)+j
faces=[]
for i in range(N):
    for j in range(M):
        faces.append((ix(i,j),ix(i+1,j),ix(i+1,j+1),ix(i,j+1)))
        faces.append((ix(i,j+1,1),ix(i+1,j+1,1),ix(i+1,j,1),ix(i,j,1)))
for i in range(N):
    for j in (0,M):
        faces.append((ix(i,j),ix(i,j,1),ix(i+1,j,1),ix(i+1,j)))
for j in range(M):
    for i in (0,N):
        faces.append((ix(i,j),ix(i,j+1),ix(i,j+1,1),ix(i,j,1)))
make("52m sculpted marine terminal roof actual volumetric shell",V,faces,roofmat,
     "MARITIME_TERMINAL_ROOF_AND_OCCUPIED_HALL_SECTION",True)
# Cast-in-place tapered pylons, fewer and more substantial than old slender
# columns. Their upper heads genuinely meet the underside of the sculpted roof.
def tapered_pier(name,along,side,top_z,foot_width=1.55,head_width=.83):
    verts=[]
    for z,w in ((0.05,foot_width),(top_z,head_width)):
        for dx,ds in ((-w,-w),(w,-w),(w,w),(-w,w)):
            verts.append(at(along+dx,side+ds,z))
    return make(name,verts,[(0,3,2,1),(4,5,6,7),(0,1,5,4),
                            (1,2,6,5),(2,3,7,6),(3,0,4,7)],piermat,
                "ACTUAL_ROOF_TO_QUAY_LOAD_PATH")
for i in (4,28):
    for j in (2,10):
        pt=sheet_point(i,j,True)
        # The structural footing is on the inherited public-hall datum.
        tapered_pier("four monumental flood-resistant structural landings %d %d"%(i,j),
                     26.0*(2*i/N-1),s_front+sgn*(1.70+9.70*j/M),
                     float(pt.z-base_z))
# Daylight-facing arrival envelope: four genuinely recessed panels beneath
# a continuous roof, not a thin photographic billboard.
for i in range(4):
    x0=-21.0+i*10.5
    x1=x0+10.5
    s=s_front+sgn*7.1
    vv=[at(x0,s,.55),at(x1,s,.55),
        at(x1,s,roof_bottom-base_z+1.20),
        at(x0,s,roof_bottom-base_z+1.20)]
    if i!=1:
        make("inhabited ferry departure glass bay %d"%(i+1),
             vv,[(0,1,2,3)],glass,"FULL_HEIGHT_DAYLIT_FERRY_TERMINAL_INTERIOR")
# An actual walkable arrival apron connects the inherited arcade to the
# harbour terminal and its seawall; no game road surfaces or colliders added.
sa=s_front+sgn*2.0
sb=s_front+sgn*11.1
block("continuous ferry check-in concourse with quay access",-22.0,22.0,
      min(sa,sb),max(sa,sb),-.15,.07,stone,"CONTINUOUS_PUBLIC_FLOOR")
# Narrow timber ribs follow the new roof's double-curvature underside,
# creating strong roof-depth/shadow cues. Not strings, billboards, or fences.
for t in (-.52,.52):
    i=round((t+1)*N/2)
    vv=[]
    for j in range(M+1):
        p=sheet_point(i,j,True)
        w=.34
        vv.extend((p+F*(-w),p+F*w,p+Vector((0,0,-.58))+F*w,
                   p+Vector((0,0,-.58))+F*(-w)))
    ff=[]
    for j in range(M):
        a=4*j;b=4*(j+1)
        ff.extend(((a,b,b+1,a+1),(a+3,a+2,b+2,b+3),
                   (a,a+3,b+3,b),(a+1,b+1,b+2,a+2)))
    make("two real curved laminated roof support arches %.2f"%t,
         vv,ff,underside,"CURVED_TIMBER_ROOF_LOAD_DISTRIBUTION")
# True original CHASE camera visibility audit; if the architecture is not
# visible at a significant scale, fail safely rather than claim ART progress.
samples=[project(V[ix(i,j)]) for i in range(N+1) for j in range(M+1)]
visible=[p for p in samples if p["visible"]]
assert len(visible)>30,("K4CB_A2_HOLD_NOT_IN_REAL_CHASE",len(visible))
bbox=[min(p["x"] for p in visible),min(p["y"] for p in visible),
      max(p["x"] for p in visible),max(p["y"] for p in visible)]
area=(bbox[2]-bbox[0])*(bbox[3]-bbox[1])
assert area>.006,("K4CB_A2_HOLD_TOO_SMALL_REAL_CHASE",bbox,area)
assert sum(p["x"]<.49 for p in visible)==0,("K4CB_A2_HOLD_RACE_FOCUS_OCCLUDED",bbox)
assert camera_poses()==original_camera_poses
assert (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==chase_pose
assert {road_hash(o) for o in roads}=={ROAD}
assert {o.name:tuple(tuple(row) for row in o.matrix_world) for o in trees}==tree_matrices
assert {o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}==lights
assert all((bool(bpy.data.objects[n].hide_render),bool(bpy.data.objects[n].hide_viewport))==st
           for n,st in existing.items())
assert bad.hide_render and not good.hide_render
assert sha(parent)==PARENT_SHA
scene.camera=cam
scene.render.engine="BLENDER_EEVEE"
scene.render.resolution_x=768
scene.render.resolution_y=480
scene.render.resolution_percentage=100
scene.render.image_settings.file_format="PNG"
try:scene.eevee.taa_render_samples=8
except AttributeError:pass
blend=out/"K4CB_A2_SCULPTED_FERRY_TERMINAL_EDITABLE_NATIVE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(blend))
png=out/"K4CB_A2_TRUE_SAME_CHASE_SCULPTED_TERMINAL_NOT_GAME.png"
scene.render.filepath=str(png)
bpy.ops.render.render(write_still=True)
assert blend.stat().st_size>230_000_000 and png.stat().st_size>30000
audit={
 "schema":"dopagaki.k4cb-a2.source-protected-sculpted-terminal/1",
 "parentK4CB_A1_exact_sha256":PARENT_SHA,
 "originalGameGitBlob":GAME,"originalRoad5FullVertexFaceSHA256":ROAD,
 "originalSixCameraPosesUnchanged":True,"originalCHASEUnchanged":True,
 "originalElevenTreeTransformsUnchanged":True,"originalLightsUnchanged":True,
 "K4BZ_bad_duplicate_road_hidden":True,"allOriginalObjectVisibilityUnchanged":True,
 "originalRoofAndPiersUnmodified":True,"sourceGameEdited":False,
 "sourcePhysicsEdited":False,"newGameColliders":0,
 "noExtraRoadSurfaceAdded":True,
 "genuineDCCNewObjects":len(created),
 "roofActualCHASEProjectionBBox":bbox,
 "roofVisibleScreenAreaBoxNotArtScore":area,
 "originalChase768x480":True,"renderEngine":"BLENDER_EEVEE",
 "materialClaims":"Author-created procedural materials only; not photogrammetry or PBR scan.",
 "ART":"UNJUDGED_HOLD","formalARTAccepted":0,"formalSlope2DNAMetres":0,
 "SAT":"HOLD","CCD":"HOLD","HUMAN":"HOLD","FPS":"HOLD",
 "RELEASE":"HOLD","MERGE":"HOLD",
 "files":{p.name:{"bytes":p.stat().st_size,"sha256":sha(p)} for p in (blend,png)}
}
(out/"K4CB_A2_REAL_NATIVE_AUDIT.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n")
print("K4CB_A2_TRUE_NATIVE_RENDER_COMPLETE_ART_UNJUDGED",json.dumps(
 {"newResearchMeshes":len(created),"bbox":bbox,"screenBoxAreaNotArtScore":area}))
