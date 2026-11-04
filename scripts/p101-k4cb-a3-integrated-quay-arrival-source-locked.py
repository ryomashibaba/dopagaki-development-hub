"""K4CB A3 — source-locked sculpted ferry-terminal hall, genuine native CHASE.
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
PARENT_SHA="5f57d64654ff8df6b6ecd852699432cda50f1afc1af3723779170ccb4cbed5b1"
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
newcoll=bpy.data.collections.new("K4CB A3 | sculpted working ferry terminal | DCC ART HOLD")
scene.collection.children.link(newcoll)
created=[]
def material(name,a,b,metallic=0.0,rough=0.65,scale=0.20):
    m=bpy.data.materials.new("K4CB A3 | "+name)
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
    me=bpy.data.meshes.new("K4CB A3 | "+name)
    me.from_pydata([tuple(p) for p in verts],[],faces)
    me.update()
    ob=bpy.data.objects.new("K4CB A3 | "+name,me)
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
# K4CB A3: one coherent maritime arrival section, not repeated prop boxes.
# All geometry is genuine 3D, tied to the existing 52m terminal and historic
# load-bearing pier datum.  The original visual slope, Road5 and physics stay frozen.
a2=[o for o in bpy.data.objects if o.name.startswith("K4CB A2 | ")]
assert len(a2)==11,("A3_HOLD_A2_PARENT_MESH_COUNT",len(a2))
a2_identity={o.name:(tuple(tuple(row) for row in o.matrix_world),len(o.data.vertices))
             for o in a2 if o.type=="MESH"}
newcoll.name="K4CB A3 | inhabitable quay-to-terminal arrival section | DCC ART HOLD"
# The A2 roof provides the canopy.  Build a legible entrance underneath it.
# A single wide vaulted public entrance faces the actual research chase camera:
# substantial stone supports, curved lintel, a recessed depth plane and a
# functionally connected access ramp, not a cluster of miniature arches.
s0=s_front+sgn*4.20
s1=s_front+sgn*7.50
facade_top=min(8.9,roof_bottom-base_z+.28)
assert facade_top>6.3
wallstone=material("coastal limestone load-bearing portal",(.31,.29,.25),(.51,.47,.38),0,.81,.21)
interior=material("shaded boat terminal public interior",(.034,.041,.038),(.10,.12,.12),.03,.92,.31)
bronze=material("salt aged structural bronze edge",(.14,.15,.13),(.37,.31,.22),.38,.66,.49)
quayrock=material("tidal escarpment weathered limestone",(.26,.26,.23),(.48,.43,.35),0,.91,.14)
# One 26m-wide arched central opening with 0.8m structural depth.
def make_vault_ring(name):
    n=36
    vv=[]
    for s in (s0,s1):
        for outer in (False,True):
            for k in range(n+1):
                t=-1+2*k/n
                x=12.0*t
                arch=4.75+2.00*math.sqrt(max(0.0,1-t*t))
                z=arch+(1.10 if outer else 0.0)
                vv.append(at(x,s,z))
    stride=n+1
    fc=[]
    for k in range(n):
        fc.extend(((k,k+1,stride+k+1,stride+k),
                   (2*stride+k,3*stride+k,3*stride+k+1,2*stride+k+1),
                   (k,2*stride+k,2*stride+k+1,k+1),
                   (stride+k,stride+k+1,3*stride+k+1,3*stride+k)))
    for q in (0,n):
        fc.append((q,stride+q,3*stride+q,2*stride+q))
    return make(name,vv,fc,wallstone,"ONE_DEEP_PUBLIC_DEPARTURE_PORTAL",True)
portal=make_vault_ring("single 26m structural ferry arrival threshold")
# Thick tapered jambs connect the vaulted opening to the quay foundation.
def prism(name,x0,x1,s_a,s_b,z0,z1,mat,role):
    return block(name,x0,x1,min(s_a,s_b),max(s_a,s_b),z0,z1,mat,role)
for side in (-1,1):
    x=side*12.9
    prism("monolithic entrance shoulder %s"%side,x-1.22,x+1.22,
          s0,s1,.0,5.55,wallstone,"QUAY_FOUNDATION_TO_TERMINAL_PORTAL")
# The wall is *recessed* rather than painted onto the road.  A broad
# glass departure hall sits 3.3m behind the portal, with one readable open
# route into the public concourse.  Never a camera-facing fake billboard.
back=s_front+sgn*10.8
prism("deep boat service hall western sidewall",-26,-15.4,s0,back,.08,facade_top,
      wallstone,"FULL_DEPTH_OCCUPIED_PASSENGER_SERVICE")
prism("deep boat service hall eastern sidewall",15.4,26,s0,back,.08,facade_top,
      wallstone,"FULL_DEPTH_OCCUPIED_PASSENGER_SERVICE")
prism("single continuous monumental head beam",-16.1,16.1,s0,back,
      facade_top-.65,facade_top+.05,wallstone,"PHYSICAL_ROOF_AND_WALL_JOINERY")
# Inside the aperture, broad dark recess and angled clear-glass entrance:
# separated depth gives actual parallax and human-readable occupation.
gl_s=s_front+sgn*9.55
make("recessed three-dimensional waiting hall glazing",
     [at(-11.0,gl_s,.85),at(11.0,gl_s,.85),
      at(11.0,gl_s,5.05),at(-11.0,gl_s,5.05)],
     [(0,1,2,3)],glass,"ACTUAL_PASSENGER_LOUNGE_BEHIND_ENTRY")
# A low plinth merges the inherited public floor into the outer quayside.
# This is never a physics/road object; the existing race surface stays pristine.
q0=s_front+sgn*10.85
q1=s_front+sgn*17.4
prism("one quayside ferry forecourt continuous stone deck",-25.5,25.5,
      q0,q1,-.42,.01,stone,"PASSENGER_ARRIVAL_QUAY_NOT_GAME_ROAD")
# One wide sloping gangway continues away from road to an actual berth.
# Its tapered sides and underside are spatially modeled, not decal stripes.
def gangway():
    n=20
    V=[]
    for k in range(n+1):
        t=k/n
        along=12.5+5.0*t+1.4*math.sin(math.pi*t)
        side=s_front+sgn*(17.25+19.0*t)
        h=-.16-1.55*t
        half=2.15-.35*t
        for zoff in (0,-.30):
            for dx in (-half,half):
                V.append(at(along+dx,side,h+zoff))
    f=[]
    for k in range(n):
        a=4*k;b=4*(k+1)
        f.extend(((a,b,b+1,a+1),(a+3,b+3,b+2,a+2),
                  (a,a+2,b+2,b),(a+1,b+1,b+3,a+3)))
    f.extend(((0,1,3,2),(4*n,4*n+2,4*n+3,4*n+1)))
    return make("real sloping tide-level passenger gangway",V,f,bronze,
                "PHYSICAL_EMBARKATION_FROM_CONCOURSE_TO_BERTH")
gangway_obj=gangway()
# Sculpt a single heterogeneous tidal rock shelf directly below the berth.
# Its varying coastline and vertical relief avoid repeated box facades.
def coast_shelf():
    nx,ny=40,8
    verts=[]
    for i in range(nx+1):
        u=i/nx
        along=-16.0+49.0*u
        for j in range(ny+1):
            v=j/ny
            side=s_front+sgn*(17.8+11.5*v
                 +.75*math.sin(u*14.1)+.55*math.sin(u*29.4+v*3))
            h=-.5-4.8*v+(.36*math.sin(18*u+2*v)+
                       .22*math.sin(41*u-5*v))*math.sin(math.pi*v)
            verts.append(at(along,side,h))
    face=[]
    for i in range(nx):
        for j in range(ny):
            a=i*(ny+1)+j
            b=(i+1)*(ny+1)+j
            face.append((a,b,b+1,a+1))
    return make("single erosional three-dimensional berth shoreline",verts,
                face,quayrock,"TIDAL_ROCK_AND_QUAY_CONTINUOUS_GROUND",False)
coast=coast_shelf()
# A camera-visible but *not camera-aligned* human circulation threshold.
# Reserve road-centered visual focus; evidence includes exact projection.
projected_new=[project(o.matrix_world@v.co) for o in created for v in o.data.vertices]
projected_visible=[p for p in projected_new if p["visible"]]
assert len(projected_visible)>35,("A3_NO_REAL_CHASE_VISIBILITY",len(projected_visible))
projected_extents={o.name:min((p["x"] for p in (project(o.matrix_world@v.co) for v in o.data.vertices) if p["visible"]),default=1.0) for o in created}
assert all(p["x"]>.49 for p in projected_visible),("A3_RACING_VIEW_OBSTRUCTED",
    sorted(projected_extents.items(),key=lambda item:item[1])[:5])
assert {o.name:(tuple(tuple(row) for row in o.matrix_world),len(o.data.vertices))
        for o in a2 if o.type=="MESH"}==a2_identity
# True original CHASE camera visibility audit; if the architecture is not
# visible at a significant scale, fail safely rather than claim ART progress.
samples=projected_new
visible=[p for p in samples if p["visible"]]
assert len(visible)>30,("K4CB_A3_HOLD_NOT_IN_REAL_CHASE",len(visible))
bbox=[min(p["x"] for p in visible),min(p["y"] for p in visible),
      max(p["x"] for p in visible),max(p["y"] for p in visible)]
area=(bbox[2]-bbox[0])*(bbox[3]-bbox[1])
assert area>.003,("K4CB_A3_HOLD_TOO_SMALL_REAL_CHASE",bbox,area)
assert sum(p["x"]<.49 for p in visible)==0,("K4CB_A3_HOLD_RACE_FOCUS_OCCLUDED",bbox)
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
blend=out/"K4CB_A3_INTEGRATED_QUAY_ARRIVAL_EDITABLE_NATIVE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(blend))
png=out/"K4CB_A3_TRUE_SAME_CHASE_INTEGRATED_QUAY_ARRIVAL_NOT_GAME.png"
scene.render.filepath=str(png)
bpy.ops.render.render(write_still=True)
assert blend.stat().st_size>230_000_000 and png.stat().st_size>30000
audit={
 "schema":"dopagaki.k4cb-a3.integrated-quay-arrival/1",
 "parentK4CB_A2_exact_sha256":PARENT_SHA,
 "originalGameGitBlob":GAME,"originalRoad5FullVertexFaceSHA256":ROAD,
 "originalSixCameraPosesUnchanged":True,"originalCHASEUnchanged":True,
 "originalElevenTreeTransformsUnchanged":True,"originalLightsUnchanged":True,
 "K4BZ_bad_duplicate_road_hidden":True,"allOriginalObjectVisibilityUnchanged":True,
 "originalRoofAndPiersUnmodified":True,"sourceGameEdited":False,
 "sourcePhysicsEdited":False,"newGameColliders":0,
 "noExtraRoadSurfaceAdded":True,
 "genuineDCCNewObjects":len(created),
 "sourceA2ObjectsUnchanged":True,
 "singlePortGatewayAndTidalShelfNotGame":True,
 "actualCHASENewArrivalProjectionBBox":bbox,
 "visibleScreenAreaBoxNotArtScore":area,
 "originalChase768x480":True,"renderEngine":"BLENDER_EEVEE",
 "materialClaims":"Author-created procedural materials only; no new photo-scan or AI-generated image claims.",
 "ART":"UNJUDGED_HOLD","formalARTAccepted":0,"formalSlope2DNAMetres":0,
 "SAT":"HOLD","CCD":"HOLD","HUMAN":"HOLD","FPS":"HOLD",
 "RELEASE":"HOLD","MERGE":"HOLD",
 "files":{p.name:{"bytes":p.stat().st_size,"sha256":sha(p)} for p in (blend,png)}
}
(out/"K4CB_A3_REAL_NATIVE_AUDIT.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n")
print("K4CB_A3_TRUE_NATIVE_RENDER_COMPLETE_ART_UNJUDGED",json.dumps(
 {"newResearchMeshes":len(created),"bbox":bbox,"screenBoxAreaNotArtScore":area}))
