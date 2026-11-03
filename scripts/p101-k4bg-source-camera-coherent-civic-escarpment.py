"""K4BG source-camera ART pilot: road material craft + one sculpted civic gateway.

Read-only game; no WebGL2, B48 source mesh, camera or B51 physics change.
The original road MATERIAL and geometry are both untouched. Newly sculpted OFFROAD/OVERHEAD DCC-only candidates are NOT colliders.
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
for prefix in ("K4BE 02 |","K4BE 03 |","K4BE 04 |","K4BE 05 |","K4BE 06 |"):
    found=[c for c in bpy.data.collections if c.name.startswith(prefix)]
    assert len(found)==1, (prefix,[c.name for c in found])
    found[0].hide_render=True
    hidden[found[0].name]=len(found[0].objects)

# Road is EXACT original geometry; only its proposal material is upgraded.
# Micro-aggregate + mineral striation break up the toy-tiling/flat color.
def mineral_road():
    m=bpy.data.materials.new("K4BG | engineered honed volcanic aggregate DCC only")
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
# K4BF changed the authentic road appearance in a way which proved unacceptable
# in the ultra source-camera pilot. In this one-variable ART rescue preserve the
# parent's actual original B48 geometry AND original material binding.
road_material_ids_before={m:tuple(x.name for x in o.data.materials) for m,o in src.items()}
assert all(road_material_ids_before.values())
# No assignment to src.data.materials is authorized in K4BG.
# K4BD preexisting noncollision inlays stay unchanged for this controlled
# same-camera comparison, to avoid changing many independent variables.

def mat(name,rgb,rough=.65,metal=0,emit=0):
    m=bpy.data.materials.new("K4BG | "+name);m.use_nodes=True
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
    c=bpy.data.collections.new("K4BG "+k)
    scene.collection.children.link(c);cols[k]=c;return c
mon=collection("01 | FACETED COAST GATE LOAD BEARING")
gallery=collection("02 | OCCUPIED BRIDGE VOID")
public=collection("03 | HUMAN CIVIC TERRACES")
lighting=collection("04 | PRACTICAL LIGHTS")
authored=[]
def mesh(name,v,f,m,c):
    assert len(v)>=3 and len(f)>0
    d=bpy.data.meshes.new("K4BG editable "+name)
    d.from_pydata(v,[],f);d.update(calc_edges=True)
    o=bpy.data.objects.new("K4BG "+name,d);c.objects.link(o)
    d.materials.append(m)
    o["K4BG_DCC_ONLY_NO_GAME_COLLIDER"]=True
    o["K4BG_ROLE"]="PROPOSED_CIVIC_ARCHITECTURE"
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
# K4BG — deliberately authored ONE cohesive coastal urban escarpment.
# Completely replaces the K4BE/K4BF paper-roof, repeated facade and floating
# aquarium composition in this DCC study. The old source DCC collections
# remain editable (render-off). No shape below is a new playable game road.
# Architectural basis: exposed continuous rock, layered inhabited public
# rooms, voids that are OPEN, large curved civic roof and one skyline landmark.
# Do not count polygons or RGB differences as ART approval.
from math import cos
limestone=mat("sea-weathered porcelain limestone",(.43,.405,.325),.75)
basalt=mat("stratified black volcanic foundation",(.072,.091,.100),.85)
bronze=mat("oxidized bronze warm perimeter",(.36,.235,.137),.42,.72)
deepglass=mat("deep-set translucent estuary sapphire",(.042,.19,.245),.18,.23)
sunlit=mat("warm inhabited civic interior",(.85,.47,.16),.52,.12,1.75)
moss=mat("rain garden planted roofs",(.076,.19,.133),.84)
pale=mat("indirect polished pale ceiling",(.64,.62,.53),.63,.05)
district=collection("05 | LONG CONTINUOUS CIVIC ESCARPMENT")
inhabited=collection("06 | DEEP OPERABLE GLAZING AND INTERIORS")
gardens=collection("07 | HUMAN PUBLIC TERRACES AND RAIN GARDENS")
roof=collection("08 | EXPOSED THICK CANTILEVERED CIVIC ROOF")
skyline=collection("09 | SINGULAR COASTAL LANDMARK")
# The recovered K4BE coordinate reference is a display-only coordinate
# system; geom is anchored to Road5 mesh, not an invented road polygon.
def signside(sign,s):return sign*s
for sign,name in ((-1,"WEST LIBRARY ESTUARY"),(1,"EAST CONSERVATORY FORESHORE")):
    def ss(v):return sign*v
    stations=list(range(-290,281,19))
    # Hundreds of metres of continuous tectonic built frontage. One whole
    # sculpted civic section instead of dozens of independent block facades.
    lower=[]; cornice=[]; roofline=[]
    for d in stations:
        wave=sin(d*.014+(.6 if sign<0 else 1.3))
        turn=cos(d*.022+.7*sign)
        inside=157+7*wave
        outer=245+14*turn
        h=58+(22 if sign<0 else 10)*wave+14*turn
        lower.append([
            W(d,ss(inside),-76), W(d,ss(outer),-76),
            W(d,ss(outer+7),0), W(d,ss(outer-16),12+3*wave),
            W(d,ss(inside),8)
        ])
        cornice.append([
            W(d,ss(inside),h-10),W(d,ss(outer+22),h-10),
            W(d,ss(outer+20),h),W(d,ss(inside-7),h+7)
        ])
        roofline.append([
            W(d,ss(inside-9),h+12),
            W(d,ss(outer+15),h+19+11*wave),
            W(d,ss(outer+11),h+27+8*wave),
            W(d,ss(inside-15),h+19)
        ])
    heavy(name+" single carved load-bearing public river wall",lower,basalt,district)
    heavy(name+" continuous stone upper occupiable datum",cornice,limestone,district)
    heavy(name+" fully thick curved and asymmetric museum crest",roofline,bronze,roof)
    # Readable large inhabited glazing is deeply set BETWEEN stone bays.
    # Each group has actual dark shadow behind its glass and a warm room.
    bays=[(-244,-197),(-151,-98),(-54,-1),(43,102),(153,213)]
    for i,(da,db) in enumerate(bays):
        variation=4*sin(i*1.47+(1 if sign<0 else 0))
        block(name+" carved deep window well "+str(i),
              da,db,ss(249),ss(253),13+variation,34+variation,basalt,inhabited)
        block(name+" clear glass wall behind masonry section "+str(i),
              da+3,db-3,ss(257),ss(259),15+variation,34+variation,deepglass,inhabited)
        block(name+" actual luminous room ceiling "+str(i),
              da+6,db-6,ss(263),ss(268),31+variation,32+variation,sunlit,inhabited)
        # Offroad public terrace is in a large accessible continuous zone.
        block(name+" inhabited garden promenade "+str(i),
              da,db,ss(258),ss(284),2+variation,4+variation,limestone,gardens)
        block(name+" planted windbreak "+str(i),
              da+9,db-8,ss(270),ss(283),5+variation,8+variation,moss,gardens)
    # A pair of really massive recessed reading rooms in the roof volume.
    for i,(da,db) in enumerate(((-103,-21),(52,155))):
        block(name+" elevated colonnade floor "+str(i),
              da,db,ss(192),ss(229),46,49,limestone,inhabited)
        block(name+" glazed double-height library void "+str(i),
              da+6,db-6,ss(216),ss(219),50,67,deepglass,inhabited)
        block(name+" interior occupancy amber strip "+str(i),
              da+8,db-8,ss(223),ss(227),61,62,sunlit,inhabited)
# One clear source-camera hero: a tectonic public gateway between two real
# city fronts, NOT a continuous floating rectangular habitable aquarium.
# The center remains OPEN to reveal the true B48 road and hazardous horizon.
for side,name in ((-1,"WEST PINNED PLATE"),(1,"EAST THICK FOLDED PLATE")):
    def ss(v):return side*v
    sections=[]
    for d in (85,102,124,151,178,195):
        t=(d-85)/110
        uplift=17*sin(pi*t)
        sections.append([
          W(d,ss(132),88+uplift),
          W(d,ss(183),102+uplift),
          W(d,ss(189),119+uplift+8*side),
          W(d,ss(168),128+uplift+6*side),
          W(d,ss(128),112+uplift)
        ])
    heavy(name+" colossal angled sectional civic canopy",sections,limestone,roof)
    # Lit inhabited interiors physically stacked behind the roof perimeter.
    for i,(da,db) in enumerate(((94,118),(145,171))):
        block(name+" public mezzanine behind structural lip "+str(i),
              da,db,ss(170),ss(184),65,69,bronze,inhabited)
        block(name+" recessed amphitheatre interior "+str(i),
              da+1,db-1,ss(180),ss(188),69,97,deepglass,inhabited)
        block(name+" actual warm-lit seating hall "+str(i),
              da+4,db-4,ss(189),ss(193),84,86,sunlit,inhabited)
    # Foundation, not free-floating thin cantilevers.
    heavy(name+" solid ground-rooted limestone pier",[
      [W(d,ss(160),-80),W(d,ss(200),-80),W(d,ss(195),105),W(d,ss(165),102)]
      for d in (87,112)],basalt,district)
# Remote monument: one sculpted irregular/tapered civic beacon rather than
# repeated cuboid towers. The beacon is far offroad and noninteractive.
cx,cs=385,-315
ringN=11; vertices=[];faces=[]
for layer in range(19):
    z=-45+layer*20
    frac=layer/18
    radius=(53*(1-frac)**.9)+10
    twist=.65*frac+sin(frac*pi)*.13
    for j in range(ringN):
        a=2*pi*j/ringN+twist
        r=radius*(.7+.22*cos(3*a+frac*5))
        vertices.append(tuple(W(cx+13*sin(frac*pi),cs,0)+Vector((cos(a)*r,sin(a)*r,z))))
for k in range(18):
    for j in range(ringN):
        j2=(j+1)%ringN
        faces.append((k*ringN+j,k*ringN+j2,(k+1)*ringN+j2,(k+1)*ringN+j))
faces+=[tuple(range(ringN-1,-1,-1)),tuple((18*ringN)+i for i in range(ringN))]
mesh("COASTAL MEMORY single twisted civic horizon beacon",vertices,faces,bronze,skyline)
# Add a second inhabitable element: a real terraced sea-level cloister
# beside the city and off the physical route.
for i,(da,db) in enumerate(((-220,-160),(-74,-6),(88,168))):
    height=(10,17,24)[i]
    heavy("CIVIC SHORE sculpted nonrepeat public stone stair "+str(i),[
        [W(d,s,z) for s,z in ((-318,-25),(-249,-25),(-249,height),(-318,height))]
        for d in (da,db)],limestone,gardens)
# Material light and sun, not emissive sky glow pretending to be structure.
world=scene.world
if world:
    world.use_nodes=True
    bg=world.node_tree.nodes.get("Background")
    if bg:
        bg.inputs["Color"].default_value=(.49,.66,.77,1)
        bg.inputs["Strength"].default_value=.72
sun=bpy.data.lights.new("K4BG authentic directional sun and cast shadows","SUN")
sun.energy=2.4
sun.angle=math.radians(8)
sun_o=bpy.data.objects.new("K4BG warm side daylight",sun)
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
assert all(tuple(x.name for x in src[m].data.materials)==road_material_ids_before[m] for m in ("control","ultra"))
def show(mode):
    # K4BE parent was saved after show("control"), so the ULTRA
    # COLLECTION—not just its individual object—starts render-hidden.
    # Restore the actual original source layer per mode. Never change
    # original B48 mesh positions, materials or camera numerics.
    for m,o in src.items():
        c=bpy.data.collections.get("K4AY SOURCE B48 | "+m.upper()+" | TRUE TESSELLATED ROAD5")
        assert c is not None and o.name in {x.name for x in c.objects}
        c.hide_render=(m!=mode)
        o.hide_render=False
    for m,c in other.items():c.hide_render=(m!=mode)
    assert not bpy.data.collections["K4AY SOURCE B48 | "+mode.upper()+" | TRUE TESSELLATED ROAD5"].hide_render
    for c in bpy.data.collections:
        if "K4AY SOURCE B51 OBB PROXIES" in c.name:c.hide_render=True
    bpy.context.view_layer.update()
shots=[]
for mode,tick in (("control",11307),("ultra",11341)):
    show(mode)
    fn="K4BG_"+mode.upper()+"_"+str(tick)+"_SOURCE_CAMERA_DCC_ART_UNJUDGED.png"
    scene.camera=cams[mode,tick]
    scene.render.filepath=os.path.join(out,fn)
    bpy.ops.render.render(write_still=True)
    shots.append({"mode":mode,"tick":tick,"file":fn})
show("control")
scene.camera=cams["control",11307]
filename="K4BG_CIVIC_ESCARPMENT_EDITABLE_DCC_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,filename))
files=[filename]+[r["file"] for r in shots]
hashes={}
for f in files:
    data=open(os.path.join(out,f),"rb").read()
    assert len(data)>4096
    hashes[f]={"sha256":hashlib.sha256(data).hexdigest(),"bytes":len(data)}
report={
 "schema":"dopagaki.K4BG.one-coherent-civic-escarpment-two-authentic-source-cameras/1",
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
 "originalRoad5MaterialBindingUnchanged":True,
 "restoredOriginalSourceCollectionVisibilityForEachMode":True,"ART":"UNJUDGED_HOLD","formalArtAccepted":0,"slope2DNAMetres":0,
 "CCD":"HOLD","HUMAN":"HOLD","SAT":"HOLD","FPS":"HOLD",
 "RELEASE":"HOLD","MERGE":"HOLD","files":hashes}
with open(os.path.join(out,"K4BG_CAMERA_ART_PILOT_PROVENANCE.json"),"w") as f:
    json.dump(report,f,indent=2)
print("K4BG_EDITABLE_ART_PILOT_COMPLETE_NOT_ART_APPROVAL",json.dumps({
 "roadFingerprintUnchanged":before==after,"newEditables":len(authored),
 "cameraFrames":len(shots),"ART":report["ART"]}))
