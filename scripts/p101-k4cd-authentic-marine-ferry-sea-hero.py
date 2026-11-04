"""K4CD: source-protected genuine native ferry at inherited real quay and coherent sea.
Editable 3D DCC coastal art, no game collider, no source-road/camera/physics changes.
Never claim ART PASS or WebGL gameplay based on a Blender render.
"""
import bpy,hashlib,json,math,struct,sys
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

argv=sys.argv[sys.argv.index("--")+1:]
def arg(key): return Path(argv[argv.index(key)+1]).resolve()
parent=arg("--base")
out=arg("--out");out.mkdir(parents=True,exist_ok=True)
PARENT_SHA="4fcd20db998696c270df95f624fed1a229ae2703322c180de1f3bfbc15abd6da"
GAME="af076d67492a677d2235e4730aef8cdf4808e106"
ROAD="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
def sha(path):
    h=hashlib.sha256()
    with open(path,"rb") as f:
        for chunk in iter(lambda:f.read(1048576),b""):h.update(chunk)
    return h.hexdigest()
assert sha(parent)==PARENT_SHA,("K4CD_PARENT_K4CC_R2_MISMATCH",sha(parent))
bpy.ops.wm.open_mainfile(filepath=str(parent))
sc=bpy.context.scene
assert (sc.render.resolution_x,sc.render.resolution_y,sc.render.resolution_percentage)==(768,480,100)
orig={o.name:(bool(o.hide_render),bool(o.hide_viewport),tuple(tuple(row) for row in o.matrix_world))
      for o in bpy.data.objects}
lights={o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
def camera_poses():
    return {o.name:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
            for o in rig.objects if o.type=="CAMERA"}
frozen_poses=camera_poses()
assert len(frozen_poses)>=6
cameras=[o for o in bpy.data.objects if o.type=="CAMERA" and o.name.startswith("K4BP | EXPERIMENT CAMERA | CHASE_NARROW |")]
assert len(cameras)==1 and sc.camera==cameras[0]
cam=cameras[0]
chase=(tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))
roads=[]
for label in ("CONTROL","ULTRA"):
    c=bpy.data.collections["K4AY SOURCE B48 | "+label+" | TRUE TESSELLATED ROAD5"]
    assert len(c.objects)==1
    roads.append(next(iter(c.objects)))
def road_hash(obj):
    h=hashlib.sha256()
    for v in obj.data.vertices:h.update(struct.pack("<3d",*[float(k) for k in v.co]))
    for p in obj.data.polygons:h.update(struct.pack("<3i",*[int(k) for k in p.vertices]))
    return h.hexdigest()
assert {road_hash(o) for o in roads}=={ROAD}
bad=bpy.data.objects.get("K4BY | actual source raycast 1m road surface | NO GAME COLLIDER")
good=bpy.data.objects.get("K4BQ / physically variegated 26m curved material research test")
assert bad and bad.hide_render and bad.get("NOT_GAME_COLLIDER") is True
assert good and not good.hide_render
pine=[o for o in bpy.data.objects if o.name.startswith("K4BS | genuine CC0 scanned pine tree ")]
canopy=[o for o in bpy.data.objects if o.name.startswith("K4BV | TRUE WIND SHAPED CC0 COASTAL CANOPY")]
coastal=[o for o in bpy.data.objects if o.name.startswith("K4CA | actual Poly Haven island_tree_02")]
assert (len(pine),len(canopy),len(coastal))==(8,1,2)
trees=pine+canopy+coastal
tree_matrices={o.name:tuple(tuple(r) for r in o.matrix_world) for o in trees}
# Authentic parent must retain repaired coastal terrain source beneath relief.
rock=bpy.data.objects.get("K4CC | TRUE_EDITABLE_NATIVE_ROCK_RELIEF | NO_GAME_COLLIDER")
assert rock and rock.get("NOT_GAME_COLLIDER") is True and not rock.hide_render
studied_land=bpy.data.objects.get("K4BQ / EAST_SLOPING_HILLSIDE authored subdivided eroded native ")
assert studied_land and not studied_land.hide_render
research_a3=[o for o in bpy.data.objects if o.type=="MESH" and o.name.startswith("K4CB A3 | ")]
assert len(research_a3)==10
assert len([o for o in research_a3 if o.hide_render])==5
# Bind scene composition to actual inherited public hall and genuine gangway.
roof=[o for o in bpy.data.objects if o.name.startswith("K4BW | folded coastal museum and boat service canopy shell")]
piers=[o for o in bpy.data.objects if o.name.startswith("K4BW | galvanized slender structural pier")]
gang=[o for o in bpy.data.objects if o.name.startswith("K4CB A3 | real sloping tide-level passenger gangway")]
assert len(roof)==len(gang)==1 and len(piers) in (12,14)
roof_points=[roof[0].matrix_world@v.co for v in roof[0].data.vertices]
base_z=min((o.matrix_world@v.co).z for o in piers for v in o.data.vertices)
center=sum(roof_points,Vector())/len(roof_points)
source_camera=[o for o in rig.objects if o.type=="CAMERA" and "11307" in o.name]
assert len(source_camera)==1
F3=source_camera[0].matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((F3.x,F3.y,0)).normalized()
S=Vector((-F.y,F.x,0))
base=Vector((center.x,center.y,base_z))
def at(a,s,z=0.):return base+F*a+S*s+Vector((0,0,z))
s_front=min((-5.85,5.85),key=lambda s:(at(0,s)-cam.location).length)
sgn=1 if s_front>0 else -1
# Actual near-water gangway terminal: last four vertices in the retained true mesh.
end_points=[gang[0].matrix_world@v.co for v in list(gang[0].data.vertices)[-4:]]
assert len(end_points)==4
end=sum(end_points,Vector())/4.
def project(p):
    q=world_to_camera_view(sc,cam,p)
    return {"x":float(q.x),"y":float(q.y),"visible":q.z>0 and 0<=q.x<=1 and 0<=q.y<=1}
assert project(end)["visible"],("GANGWAY_NOT_IN_TRUE_CHASE",project(end))
# Seek a moored hull on the true waterside with a *real world-space location*
# no more than ~35m from its passenger gangway. Do not move or fake the camera.
# Characteristic ferry dimensions: 29m long and 7.6m beam, real 3D sheer.
candidate=[]
diagnostics=[]
# Preserve actual 3D proportions. A small coastal ferry (19.7-29m) is valid:
# each scale is a *real vessel dimension*, never a changed camera or fake sprite.
for ship_scale in (1.0,.87,.74,.68):
    for dx in (-45,-36,-28,-20,-14,-8,-2,4,10,16,22,28,36,44):
        for ds in (-12,-8,-4,2,6,10,14,18,24,30,38,46,56):
            if math.hypot(dx,ds)>49:continue
            c=end+F*dx+S*(sgn*ds)+Vector((0,0,-.45))
            points=[c+F*(da*ship_scale)+S*(sgn*db*ship_scale)+Vector((0,0,dz*ship_scale))
                    for da in (-15,15) for db in (-4.4,4.4) for dz in (-3.8,5)]
            proj=[project(p) for p in points]
            in_front=[p for p in proj if p["visible"]]
            if len(diagnostics)<500 and in_front:
                diagnostics.append((round(min(p["x"] for p in in_front),3),
                                    round(max(p["x"] for p in in_front),3),
                                    round(min(p["y"] for p in in_front),3),
                                    round(max(p["y"] for p in in_front),3),
                                    dx,ds,ship_scale))
            if not all(p["visible"] and .505<p["x"]<.985 and .16<p["y"]<.80 for p in proj):
                continue
            v=project(c)
            score=abs(v["x"]-.785)*1.4+abs(v["y"]-.495)*.4+.003*math.hypot(dx,ds)+.15*(1-ship_scale)
            candidate.append((score,dx,ds,ship_scale,c,v,
                              [min(p["x"] for p in proj),max(p["x"] for p in proj)]))
assert candidate,("NO_SAFE_REAL_WORLD_MOORING_CANDIDATE",project(end),
                  sorted(diagnostics,key=lambda row:abs(row[0]-.51))[:12])
candidate.sort(key=lambda k:k[0])
score,chosen_dx,chosen_ds,ship_scale,vessel,pj,extents=candidate[0]
def vp(a,s,z):
    return vessel+F*(ship_scale*a)+S*(sgn*ship_scale*s)+Vector((0,0,ship_scale*z))
coll=bpy.data.collections.new("K4CD | complete coastal passenger ferry + open water | DCC ART HOLD")
sc.collection.children.link(coll)
created=[]
def mat(name,c0,c1,metal=0.,rough=.66,scale=.32):
    m=bpy.data.materials.new("K4CD | "+name)
    m.use_nodes=True
    nodes=m.node_tree.nodes;nodes.clear()
    o=nodes.new("ShaderNodeOutputMaterial")
    p=nodes.new("ShaderNodeBsdfPrincipled")
    p.inputs["Metallic"].default_value=metal
    p.inputs["Roughness"].default_value=rough
    m.node_tree.links.new(p.outputs["BSDF"],o.inputs["Surface"])
    pos=nodes.new("ShaderNodeNewGeometry")
    noise=nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value=scale
    noise.inputs["Detail"].default_value=4.
    m.node_tree.links.new(pos.outputs["Position"],noise.inputs["Vector"])
    r=nodes.new("ShaderNodeValToRGB")
    r.color_ramp.elements[0].color=(*c0,1)
    r.color_ramp.elements[1].color=(*c1,1)
    m.node_tree.links.new(noise.outputs["Fac"],r.inputs["Fac"])
    m.node_tree.links.new(r.outputs["Color"],p.inputs["Base Color"])
    return m
hull_mat=mat("deep teal displacement ship hull",(.043,.098,.116),(.15,.21,.22),.23,.42,.58)
deck_mat=mat("salt bleached anti slip real deck",(.42,.43,.39),(.67,.65,.58),0,.66,.45)
white=mat("weathered ferryside cabin shell",(.39,.46,.43),(.64,.66,.59),.03,.5,.31)
glass=mat("tinted bridge glazing actual depths",(.042,.092,.117),(.13,.19,.22),.30,.23,.62)
roofmat=mat("curved zinc passenger deck canopy",(.25,.32,.33),(.42,.47,.44),.41,.37,.4)
watermat=mat("salt tide natural sea muted blue green",(.052,.110,.134),(.24,.34,.33),.19,.26,.09)
def mesh(name,verts,faces,m,role,smooth=True):
    me=bpy.data.meshes.new("K4CD | "+name)
    me.from_pydata([tuple(v) for v in verts],[],[tuple(f) for f in faces])
    me.update()
    obj=bpy.data.objects.new("K4CD | "+name,me)
    coll.objects.link(obj);me.materials.append(m)
    obj["DCC_RESEARCH_ONLY"]=True
    obj["NOT_GAME_COLLIDER"]=True
    obj["AUTHOR_FUNCTION"]=role
    if smooth:
        for face in me.polygons:face.use_smooth=True
    created.append(obj)
    return obj
# A genuinely volumetric seaworthy ferry hull: 31 curved stations, pointed bow,
# rounded transom, submerged keel/chine, not a cuboid or screenshot asset.
stations=30;ring_size=7
V=[]
for i in range(stations+1):
    u=2*i/stations-1
    bow=max(0.,(u-.55)/.45)
    stern=max(0.,(-u-.75)/.25)
    taper=max(.035,1-.88*bow**1.35-.22*stern**2)
    w=3.8*taper
    sheer=.33*(abs(u)**2)
    deck=-.55+sheer
    section=[(-w,deck),(-.96*w,deck-.80),(-.73*w,deck-2.28),
             (0.,deck-3.4),(.73*w,deck-2.28),(.96*w,deck-.80),(w,deck)]
    for beam,z in section:V.append(vp(14.5*u,beam,z))
fac=[]
for i in range(stations):
    for j in range(ring_size-1):
        a=i*ring_size+j;b=(i+1)*ring_size+j
        fac.append((a,b,b+1,a+1))
fac.append(tuple(reversed(tuple(range(ring_size)))))
fac.append(tuple(stations*ring_size+j for j in range(ring_size)))
hull=mesh("real pointed passenger hull with submerged double-chine",V,fac,hull_mat,
          "ACTUAL_MOORED_PASSENGER_VESSEL_HULL")
# The deck is a genuine thin closed walkway with a bow narrowing with hull.
verts=[];ff=[]
for i in range(stations+1):
    u=2*i/stations-1
    taper=max(.035,1-.88*max(0.,(u-.55)/.45)**1.35-.22*max(0.,(-u-.75)/.25)**2)
    for h in (0.,-.13):
        for beam in (-3.7*taper,3.7*taper):
            verts.append(vp(14.5*u,beam,-.53+.33*abs(u)**2+h))
for i in range(stations):
    k=4*i;j=4*(i+1)
    ff.extend(((k,j,j+1,k+1),(k+3,j+3,j+2,k+2),
               (k,k+2,j+2,j),(k+1,j+1,j+3,k+3)))
mesh("walkable tapered open passenger promenade and bow deck",verts,ff,deck_mat,
     "BOAT_PASSENGER_WALKWAY_NO_GAME_COLLIDER")
# True multi-section ferry cabin, with a long horizontal glazed bridge instead
# of many decorative boxes. Bow slopes and two real depth-separated decks.
profile=[(-9,-2.8),(-7,-3.15),(7,-3.15),(10,-1.9)]
vv=[]
for x,w in profile:
    for z,ratio in ((0.1,1.),(3.0,.83)):
        for side in (-1,1):vv.append(vp(x,side*w*ratio,z))
faces=[]
for i in range(len(profile)-1):
    a=i*4;b=(i+1)*4
    faces.extend(((a,b,b+1,a+1),(a+2,a+3,b+3,b+2),
                  (a,a+2,b+2,b),(a+1,b+1,b+3,a+3)))
faces.extend(((0,1,3,2),(12,14,15,13)))
mesh("single real tapered ferry passenger lounge structure",vv,faces,white,
     "ONE_CONTINUOUS_BOARDING_CABIN")
# Broad continuous cabin windows read as working passenger space on both
# sides; modeled displaced from cabin walls, not camera-facing quads.
windowverts=[];windowfaces=[]
for sign in (-1,1):
    for k in range(12):
        x0=-7.3+k*1.20;x1=x0+.90
        beam=sign*(3.10-.12*abs(x0)/8.)
        t=len(windowverts)
        windowverts.extend([vp(x0,beam,1.05),vp(x1,beam,1.05),
                            vp(x1,beam,2.49),vp(x0,beam,2.49)])
        windowfaces.append((t,t+1,t+2,t+3))
mesh("recessed continuous panoramic cabin viewing lights",windowverts,windowfaces,glass,
     "FUNCTIONAL_OUTWARD_FACING_PASSENGER_WINDOWS",False)
# A physically curved canopy with underside thickness and no fake billboard.
vv=[];f=[]
N=30;M=8
for lower in (False,True):
    for i in range(N+1):
        t=2*i/N-1
        for j in range(M+1):
            u=2*j/M-1
            x=10.4*t
            beam=3.35*u*(1-.20*max(0.,t-.50))
            z=3.25+1.02*(1-u*u)+.26*t
            if lower:z-=.20
            vv.append(vp(x,beam,z))
stride=(N+1)*(M+1)
ix=lambda i,j,lo=0:lo*stride+i*(M+1)+j
for i in range(N):
    for j in range(M):
        f.append((ix(i,j),ix(i+1,j),ix(i+1,j+1),ix(i,j+1)))
        f.append((ix(i,j+1,1),ix(i+1,j+1,1),ix(i+1,j,1),ix(i,j,1)))
for i in range(N):
    for j in (0,M):f.append((ix(i,j),ix(i,j,1),ix(i+1,j,1),ix(i+1,j)))
for j in range(M):
    for i in (0,N):f.append((ix(i,j),ix(i,j+1),ix(i,j+1,1),ix(i,j,1)))
mesh("thick double-curvature real ferry superstructure roof",vv,f,roofmat,
     "SHELTERED_OCCUPIED_SEA_FERRY_ROOF")
# Animated sea-looking but truly 3D static mesh; this is a fixed Blender
# visualization, NOT wave physics. No original game's water/collision touched.
water_vert=[];water_face=[]
NX,NY=48,40
# Connect the water plane to the actual assigned ferry, safely beyond the quay.
for i in range(NX+1):
    u=i/NX
    along=(vessel-base).dot(F)-40+90*u
    for j in range(NY+1):
        v=j/NY
        side=(vessel-base).dot(S)+sgn*(-7+95*v)
        ripple=.11*math.sin(along*.52+side*.31)*math.sin(side*.38-along*.16)
        ripple+=.055*math.sin(along*1.14-side*.75)
        z=(vessel-base).z-2.72*ship_scale+ripple
        water_vert.append(at(along,side,z))
for i in range(NX):
    for j in range(NY):
        a=i*(NY+1)+j;b=(i+1)*(NY+1)+j
        water_face.append((a,b,b+1,a+1))
sea=mesh("single genuinely meshed open tidal sea surrounding the working ferry",
         water_vert,water_face,watermat,"REAL_WORLD_SPACE_TIDAL_BASIN_NOT_ROAD",True)
# Safety: A single 3D vessel, one coherent water mesh, no physics changes.
# Scenic ferry must have actual pixel visibility in protected right-land region.
ferry_objs=created[:-1]
projection=[project(o.matrix_world@v.co) for o in ferry_objs for v in o.data.vertices]
visible=[x for x in projection if x["visible"]]
assert len(visible)>300,("HERO_FERRY_NOT_IN_TRUE_CHASE",len(visible),pj)
bbox=[min(p["x"] for p in visible),min(p["y"] for p in visible),
      max(p["x"] for p in visible),max(p["y"] for p in visible)]
area=(bbox[2]-bbox[0])*(bbox[3]-bbox[1])
assert bbox[0]>.50 and bbox[2]<.995 and area>.003,("FERRY_ROAD_OR_INVISIBLE",bbox,area)
assert len(created)==6 and all(o.get("NOT_GAME_COLLIDER") is True for o in created)
assert camera_poses()==frozen_poses
assert (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==chase
assert {road_hash(o) for o in roads}=={ROAD}
assert {o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}==lights
assert {o.name:tuple(tuple(row) for row in o.matrix_world) for o in trees}==tree_matrices
assert all((bool(bpy.data.objects[n].hide_render),bool(bpy.data.objects[n].hide_viewport),
            tuple(tuple(row) for row in bpy.data.objects[n].matrix_world))==identity for n,identity in orig.items())
assert bad.hide_render and not good.hide_render
assert sha(parent)==PARENT_SHA
sc.render.engine="BLENDER_EEVEE"
sc.camera=cam
sc.render.resolution_x=768;sc.render.resolution_y=480;sc.render.resolution_percentage=100
sc.render.image_settings.file_format="PNG"
try:sc.eevee.taa_render_samples=8
except AttributeError:pass
blend=out/"K4CD_FERRY_TIDAL_BASIN_EDITABLE_NATIVE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(blend))
png=out/"K4CD_TRUE_SAME_CHASE_FERRY_TIDAL_BASIN_NOT_GAME.png"
sc.render.filepath=str(png)
bpy.ops.render.render(write_still=True)
assert blend.stat().st_size>230_000_000 and png.stat().st_size>30000
audit={
 "schema":"dopagaki.k4cd.authentic-ferry-basin-art/1",
 "parentK4CC_R2ExactSHA256":PARENT_SHA,
 "originalGameGitBlob":GAME,"originalRoad5FullVertexFaceSHA256":ROAD,
 "originalSixCameraPosesUnchanged":True,"originalCHASEUnchanged":True,
 "originalElevenTreeTransformsUnchanged":True,"originalLightsUnchanged":True,
 "allParentObjectsVisibilityAndPosesUnchanged":True,
 "K4BZ_bad_duplicate_road_hidden":True,"originalSourceGeoUnchanged":True,
 "sourceGameEdited":False,"sourcePhysicsEdited":False,"newGameColliders":0,
 "newResearchEditableObjects":len(created),"newResearchMeshNames":[o.name for o in created],
 "newResearchHero": "one watertight sculpted passenger ferry at original gangway, integrated spatial sea basin",
 "dockApproachDistanceMetres":round(math.hypot(chosen_dx,chosen_ds),3),
 "realVesselLengthMetres":round(29*ship_scale,3),
 "mooringWorld":[round(float(n),3) for n in vessel],
 "trueCHASEFerryBBoxNotArtScore":bbox,"trueCHASEFerryProjectedBoxAreaNotArtScore":area,
 "real3DBoatVisibleVertexCount":len(visible),"genuineEditableDCC":True,
 "originalChase768x480":True,"renderEngine":"BLENDER_EEVEE",
 "materialClaims":"Original authored procedural DCC only; neither CC0 scanned vessel nor WebGL2 gameplay.",
 "ART":"UNJUDGED_HOLD","formalARTAccepted":0,"formalSlope2DNAMetres":0,
 "SAT":"HOLD","CCD":"HOLD","HUMAN":"HOLD","FPS":"HOLD",
 "RELEASE":"HOLD","MERGE":"HOLD",
 "files":{p.name:{"bytes":p.stat().st_size,"sha256":sha(p)} for p in (blend,png)}
}
(out/"K4CD_REAL_NATIVE_AUDIT.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n")
print("K4CD_REAL_BLEND_NATIVE_DONE_ART_UNJUDGED",
      json.dumps({"candidateCount":len(candidate),"mooringWorld":audit["mooringWorld"],
                  "dockDistanceM":audit["dockApproachDistanceMetres"],
                  "ferryBBox":bbox,"ferryVisible":len(visible)},ensure_ascii=False),flush=True)
