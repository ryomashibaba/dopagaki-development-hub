"""K4BF source-camera ART pilot: road material craft + one sculpted civic gateway.

Read-only game; no WebGL2, B48 source mesh, camera or B51 physics change.
The authored meshes are OFFROAD/OVERHEAD DCC-only candidates, NOT colliders.
No ART, CCD, FPS, human, release or safety approval is implied.
"""
import bpy, math, os, sys, json, hashlib, struct
from math import sin, pi
from mathutils import Vector

args=sys.argv[sys.argv.index("--")+1:]
def opt(k): return os.path.abspath(args[args.index(k)+1])
base,out=opt("--base"),opt("--out")
os.makedirs(out,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=base)
scene=bpy.context.scene
FROZEN="af076d67492a677d2235e4730aef8cdf4808e106"
rig=bpy.data.collections.get("05_CAMERA | Authentic original source poses")
assert rig is not None
cams={}
for mode,t in (("control",11307),("ultra",11341)):
    match=[o for o in rig.objects if o.type=="CAMERA" and str(t) in o.name]
    assert len(match)==1,(mode,t)
    cams[mode,t]=match[0]
src={}
other={}
for mode in ("control","ultra"):
    c=bpy.data.collections.get("K4AY SOURCE B48 | "+mode.upper()+" | TRUE TESSELLATED ROAD5")
    d=bpy.data.collections.get("K4BC v2 | TRUE ORIGINAL SOURCE OTHER SIX B48 | "+mode.upper())
    assert c and len(c.objects)==1 and d and len(d.objects)==6
    src[mode]=next(iter(c.objects))
    other[mode]=d
    assert len(src[mode].data.polygons)==4728
def fp(o):
    h=hashlib.sha256()
    for v in o.data.vertices: h.update(struct.pack("<3d",*[float(p) for p in v.co]))
    for f in o.data.polygons: h.update(struct.pack("<3i",*[int(p) for p in f.vertices]))
    return h.hexdigest()
before={m:fp(o) for m,o in src.items()}
assert len(set(before.values()))==1 and list(before.values())[0]=="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
# Keep old rejected assets fully editable and comparable, but do not show
# the distracting elevated aquarium in the new source-camera pilot.
hidden={}
for prefix in ("K4BE 04 |","K4BE 05 |","K4BE 06 |"):
    found=[c for c in bpy.data.collections if c.name.startswith(prefix)]
    assert len(found)==1, (prefix,[c.name for c in found])
    found[0].hide_render=True
    hidden[found[0].name]=len(found[0].objects)

# Road is EXACT original geometry; only its proposal material is upgraded.
# Micro-aggregate + mineral striation break up the toy-tiling/flat color.
def mineral_road():
    m=bpy.data.materials.new("K4BF | engineered honed volcanic aggregate DCC only")
    m.use_nodes=True
    n=m.node_tree.nodes;l=m.node_tree.links
    p=n.get("Principled BSDF")
    p.inputs["Metallic"].default_value=.14
    p.inputs["Roughness"].default_value=.71
    geometry=n.new("ShaderNodeNewGeometry")
    broad=n.new("ShaderNodeTexNoise")
    broad.inputs["Scale"].default_value=.087
    broad.inputs["Detail"].default_value=4.0
    broad.inputs["Roughness"].default_value=.72
    l.new(geometry.outputs["Position"],broad.inputs["Vector"])
    grain=n.new("ShaderNodeTexNoise")
    grain.inputs["Scale"].default_value=2.6
    grain.inputs["Detail"].default_value=3
    l.new(geometry.outputs["Position"],grain.inputs["Vector"])
    micro=n.new("ShaderNodeTexNoise")
    micro.inputs["Scale"].default_value=19
    micro.inputs["Detail"].default_value=2
    l.new(geometry.outputs["Position"],micro.inputs["Vector"])
    tint=n.new("ShaderNodeValToRGB")
    tint.color_ramp.elements[0].position=.17
    tint.color_ramp.elements[0].color=(.069,.087,.094,1)
    tint.color_ramp.elements[1].position=.85
    tint.color_ramp.elements[1].color=(.22,.243,.232,1)
    l.new(broad.outputs["Fac"],tint.inputs["Fac"])
    l.new(tint.outputs["Color"],p.inputs["Base Color"])
    bump=n.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value=.16
    bump.inputs["Distance"].default_value=.022
    l.new(micro.outputs["Fac"],bump.inputs["Height"])
    l.new(bump.outputs["Normal"],p.inputs["Normal"])
    rough=n.new("ShaderNodeMapRange")
    rough.inputs["From Min"].default_value=0
    rough.inputs["From Max"].default_value=1
    rough.inputs["To Min"].default_value=.55
    rough.inputs["To Max"].default_value=.84
    l.new(grain.outputs["Fac"],rough.inputs["Value"])
    l.new(rough.outputs["Result"],p.inputs["Roughness"])
    return m
roadmat=mineral_road()
for o in src.values():
    o.data.materials.clear()
    o.data.materials.append(roadmat)
# K4BD preexisting noncollision inlays stay unchanged for this controlled
# same-camera comparison, to avoid changing many independent variables.

def mat(name,rgb,rough=.65,metal=0,emit=0):
    m=bpy.data.materials.new("K4BF | "+name);m.use_nodes=True
    p=m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value=(*rgb,1)
    p.inputs["Roughness"].default_value=rough
    p.inputs["Metallic"].default_value=metal
    if emit:
        p.inputs["Emission Color"].default_value=(*rgb,1)
        p.inputs["Emission Strength"].default_value=emit
    return m
stone=mat("warm stratified limestone structural",(.59,.515,.404),.79)
dark=mat("cut deep green igneous counterfort",(.071,.11,.113),.74)
metal=mat("brushed warm bronze welded steel",(.43,.28,.15),.39,.63)
glass=mat("recessed dark sapphire glazing",(.072,.23,.32),.28,.26)
lamp=mat("inhabited amber gallery light",(.9,.49,.17),.4,.08,2.7)
green=mat("planted tier substrate",(.14,.29,.17),.88)
cols={}
def collection(k):
    c=bpy.data.collections.new("K4BF "+k)
    scene.collection.children.link(c);cols[k]=c;return c
mon=collection("01 | FACETED COAST GATE LOAD BEARING")
gallery=collection("02 | OCCUPIED BRIDGE VOID")
public=collection("03 | HUMAN CIVIC TERRACES")
lighting=collection("04 | PRACTICAL LIGHTS")
authored=[]
def mesh(name,v,f,m,c):
    assert len(v)>=3 and len(f)>0
    d=bpy.data.meshes.new("K4BF editable "+name)
    d.from_pydata(v,[],f);d.update(calc_edges=True)
    o=bpy.data.objects.new("K4BF "+name,d);c.objects.link(o)
    d.materials.append(m)
    o["K4BF_DCC_ONLY_NO_GAME_COLLIDER"]=True
    o["K4BF_ROLE"]="PROPOSED_CIVIC_ARCHITECTURE"
    authored.append(o)
    for polygon in d.polygons:polygon.use_smooth=False
    return o
# The shared world basis is copied exactly from original K4BE construction.
# It is not a new road or source camera.
O=Vector((0,0,0))
src_positions=[tuple(v.co) for v in src["control"].data.vertices]
# K4BE original source-coordinate road5 terminal origin is preserved in
# custom source coordinates for this scene, not inferred from the camera.
# Original B48 Road5 mesh has vertices stored as Blender (x,-sourceZ,sourceY).
# Known source grid 91x13 per side; terminal center top grid #90*13+6.
O=Vector(src_positions[90*13+6])
F=Vector((.847,.502,0)).normalized()
L=Vector((.51,-.86,0)).normalized()
def W(d,s,h):return O+F*d+L*s+Vector((0,0,h))
def heavy(name,sections,m,c):
    # Each section = polygonal architectural cross-section at one d.
    # Mesh explicitly closes both ends and all sidewalls for real thickness.
    N=len(sections[0]);assert len(sections)>=2 and all(len(s)==N for s in sections)
    v=[tuple(x) for sec in sections for x in sec]
    faces=[]
    for i in range(len(sections)-1):
        for j in range(N):
            a=i*N+j;b=(i+1)*N+j
            faces.append((a,b,(i+1)*N+(j+1)%N,i*N+(j+1)%N))
    faces.extend([tuple(reversed(tuple(range(N)))),tuple((len(sections)-1)*N+j for j in range(N))])
    return mesh(name,v,faces,m,c)
def block(name,d0,d1,s0,s1,z0,z1,m,c):
    return heavy(name,
        [[W(d,s,z) for s,z in ((s0,z0),(s1,z0),(s1,z1),(s0,z1))]
            for d in (d0,d1)],m,c)
# Both asymmetrically folded pylons have a real footprint OUTSIDE
# the roadway corridor. No new driveable surface or game collider.
# Each authored extrusion has coherent cross-sections, not disconnected boxes.
for sign,label,height in ((-1,"LIBRARY-FOUNDED WEST",173),(1,"MARITIME EAST",148)):
    def side(a):return sign*a
    sections=[]
    for d in (90,104,117,134,151,164):
        swell=sin(pi*(d-90)/74)
        crest=height+12*swell if sign==-1 else height+6*swell
        sections.append([
            W(d,side(124),-82),W(d,side(176),-82),
            W(d,side(164+9*swell),crest-18),
            W(d,side(142+16*swell),crest),
            W(d,side(123),crest-33)])
    heavy(label+" carved asymmetric full-depth cliff counterfort",sections,stone,mon)
    # Carved entry / real section is through exterior dressed recess.
    for i,(d0,d1,h0,h1) in enumerate(((104,115,5,31),(126,145,9,39))):
        # Bronze threshold, recessed sapphire, a warm-lit habitable layer
        # set against the 50m deep massive stone structure.
        block(label+" deep occupied foyer recessed window "+str(i),
              d0,d1,side(179),side(181),h0,h1,glass,gallery)
        block(label+" internal gallery illuminated upper volume "+str(i),
              d0,d1,side(182),side(184),h1-10,h1-4,lamp,gallery)
    # Wide public terracing is one connected tectonic landscape
    for idx,(d0,d1,z,outer) in enumerate(((92,115,-1,204),(115,139,8,222),(139,161,17,211))):
        heavy(label+" occupiable stepped waterfront court "+str(idx),
              [[W(d,side(s),zz) for s,zz in ((174,z-7),(outer,z-7),(outer,z),(174,z))]
               for d in (d0,d1)],stone,public)
    # Fixed deep wall-recess lintels and stair-height accent marks.
    for i in range(4):
        block(label+" structural horizontal reveal "+str(i),
              105+i*12,113+i*12,side(175),side(178),43+i*15,47+i*15,dark,mon)
    heavy(label+" windward planted terrace",
          [[W(d,side(s),z) for s,z in ((177,29),(220,29),(220,31),(177,31))]
           for d in (112,148)],green,public)
# One unmistakable cross-city *inhabited bridge* with two wide public
# vaulted windows instead of a thin suspended aquarium. The camera-visible
# occupied volume remains in K4BE 48-90m envelope, not offscreen sky.
# 10m+ deep masonry bridge spine; interrupted by three open light voids.
for bay,(s0,s1) in enumerate(((-118,-82),(-77,-27),(-22,27),(32,83),(88,119))):
    if bay==2:
        # The central 49m void keeps the roadway/horizon legible.
        continue
    q=(s0+s1)*.5
    h=78+8*sin(pi*(q+115)/230)
    block("SKY EXCHANGE true upper floor / "+str(bay),107,153,s0,s1,49,55,stone,gallery)
    block("SKY EXCHANGE cantilever occupied rear wall / "+str(bay),145,153,s0,s1,55,h+10,dark,gallery)
    block("SKY EXCHANGE deep stone spandrel with actual aperture / "+str(bay),
          106,112,s0,s1,h-4,h+14,stone,gallery)
    # A deeply recessed lit interior, not a full-front glass box.
    block("SKY EXCHANGE warmly lit room behind front / "+str(bay),
          114,117,s0+4,s1-4,55,h+1,glass,gallery)
    block("SKY EXCHANGE ceiling under practical luminaire / "+str(bay),
          117,121,s0+8,s1-8,h-2,h-1,lamp,gallery)
# Expressive folded *roof as a fully closed thick volume*, not paper canopy.
# One large chamfered, asymmetric wave with cut-open central oculus.
for left,right,name in ((-119,-22,"WEST WING"),(25,120,"EAST WING")):
    slices=[]
    for d in (103,114,129,145,162):
        fold=3.5*sin(pi*(d-103)/59)
        heights=[96+fold+21*sin((s+119)/242*pi)+
                 (15 if s<0 else -5)*sin(pi*(d-103)/59)
                 for s in (left,(left+right)/2,right)]
        slices.append([
          W(d,left,heights[0]-9),W(d,right,heights[2]-9),
          W(d,right,heights[2]),W(d,(left+right)/2,heights[1]+5),
          W(d,left,heights[0])])
    heavy("SKY EXCHANGE thick inhabited sculpted roof "+name,slices,metal,mon)
# Three deep retaining walls in place of decorative vertical sticks.
for side in (-1,1):
    for d in (106,147):
        block("SKY EXCHANGE west/east real pier "+str(side)+"/"+str(d),
              d,d+10,side*121,side*143,-81,101,dark,mon)
# Material light and sun, not emissive sky glow pretending to be structure.
world=scene.world
if world:
    world.use_nodes=True
    bg=world.node_tree.nodes.get("Background")
    if bg:
        bg.inputs["Color"].default_value=(.49,.66,.77,1)
        bg.inputs["Strength"].default_value=.72
sun=bpy.data.lights.new("K4BF authentic directional sun and cast shadows","SUN")
sun.energy=2.4
sun.angle=math.radians(8)
sun_o=bpy.data.objects.new("K4BF warm side daylight",sun)
lighting.objects.link(sun_o)
sun_o.rotation_euler=(math.radians(35),math.radians(-28),math.radians(130))
scene.render.engine="CYCLES"
scene.cycles.samples=48
scene.cycles.use_denoising=False
scene.render.resolution_x=1013
scene.render.resolution_y=698
scene.render.resolution_percentage=88
scene.render.image_settings.file_format="PNG"
try: scene.view_settings.view_transform="AgX"
except Exception:pass
scene.view_settings.exposure=.12
# The entire known original six-camera rig is left untouched.
after={m:fp(o) for m,o in src.items()}
assert before==after and len(authored)>=30
def show(mode):
    for m,o in src.items():o.hide_render=(m!=mode)
    for m,c in other.items():c.hide_render=(m!=mode)
    for c in bpy.data.collections:
        if "K4AY SOURCE B51 OBB PROXIES" in c.name:c.hide_render=True
    bpy.context.view_layer.update()
shots=[]
for mode,tick in (("control",11307),("ultra",11341)):
    show(mode)
    fn="K4BF_"+mode.upper()+"_"+str(tick)+"_SOURCE_CAMERA_DCC_ART_UNJUDGED.png"
    scene.camera=cams[mode,tick]
    scene.render.filepath=os.path.join(out,fn)
    bpy.ops.render.render(write_still=True)
    shots.append({"mode":mode,"tick":tick,"file":fn})
show("control")
scene.camera=cams["control",11307]
filename="K4BF_GROUND_AND_CIVIC_MONOLITH_EDITABLE_DCC_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,filename))
files=[filename]+[r["file"] for r in shots]
hashes={}
for f in files:
    data=open(os.path.join(out,f),"rb").read()
    assert len(data)>4096
    hashes[f]={"sha256":hashlib.sha256(data).hexdigest(),"bytes":len(data)}
report={
 "schema":"dopagaki.K4BF.original-two-camera-road-material-one-sculptural-gateway/1",
 "sourceParent":"K4BE salvaged authentic editable DCC",
 "frozenOriginalGameGitBlob":FROZEN,
 "originalRoad5FingerprintBefore":before,
 "originalRoad5FingerprintAfter":after,
 "sourceRoad5GeometryUnchanged":before==after,
 "originalB48Roads":7,"originalB51Bodies":28,
 "sourcePhysicsHz":240,"ballRadiusMetres":.65,
 "sourceCameraNumericsModified":False,
 "renderedTwoOfSixSourceCameraTicks":shots,
 "newDCCOnlyEditableObjects":len(authored),
 "oldRejectedCentralForumRetainedHidden":hidden,
 "nativeWebGL2GameRendered":False,
 "newGameDriveableRoadOrCollider":False,
 "independentAllSevenB48B51BVH":"NOT_RUN_HOLD",
 "ART":"UNJUDGED_HOLD","formalArtAccepted":0,"slope2DNAMetres":0,
 "CCD":"HOLD","HUMAN":"HOLD","SAT":"HOLD","FPS":"HOLD",
 "RELEASE":"HOLD","MERGE":"HOLD","files":hashes}
with open(os.path.join(out,"K4BF_CAMERA_ART_PILOT_PROVENANCE.json"),"w") as f:
    json.dump(report,f,indent=2)
print("K4BF_EDITABLE_ART_PILOT_COMPLETE_NOT_ART_APPROVAL",json.dumps({
 "roadFingerprintUnchanged":before==after,"newEditables":len(authored),
 "cameraFrames":len(shots),"ART":report["ART"]}))
