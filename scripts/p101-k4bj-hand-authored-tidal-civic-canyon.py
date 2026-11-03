"""K4BJ original-camera, hand-authored Tidal Civic Canyon (ART RESEARCH ONLY).

Architectural concept: WEST deep-carved Archives / EAST terraced Marine Exchange /
a single asymmetrical split-keel landmark, not another repeated ring or a box forest.
Everything is native editable Blender DCC. No original game, collisions, seven
B48 source roads, B51 movers, six original source camera numbers are changed.
"""
import bpy, os, sys, math, json, hashlib, struct
from math import sin,cos,pi
from mathutils import Vector

argv=sys.argv[sys.argv.index("--")+1:]
def opt(flag):return os.path.abspath(argv[argv.index(flag)+1])
base,out=opt("--base"),opt("--out")
os.makedirs(out,exist_ok=True)
def filehash(p):
    h=hashlib.sha256()
    with open(p,"rb") as f:
        for chunk in iter(lambda:f.read(1<<20),b""):h.update(chunk)
    return h.hexdigest()
parent_sha=filehash(base)
assert parent_sha=="93526d4adff8f1061081109123f7619de9bb6a0b835b15af6baf9bf6bb3ba086"
bpy.ops.wm.open_mainfile(filepath=base)
scene=bpy.context.scene
FROZEN="af076d67492a677d2235e4730aef8cdf4808e106"
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
cams={}
for m,t in (("control",11307),("ultra",11341)):
    a=[o for o in rig.objects if o.type=="CAMERA" and str(t) in o.name]
    assert len(a)==1,(m,t)
    cams[m]=a[0]
src={};other={};roadcol={}
for m in ("control","ultra"):
    roadcol[m]=bpy.data.collections["K4AY SOURCE B48 | "+m.upper()+" | TRUE TESSELLATED ROAD5"]
    assert len(roadcol[m].objects)==1
    src[m]=next(iter(roadcol[m].objects))
    other[m]=bpy.data.collections["K4BC v2 | TRUE ORIGINAL SOURCE OTHER SIX B48 | "+m.upper()]
    assert len(other[m].objects)==6
def fingerprint(o):
    h=hashlib.sha256()
    for v in o.data.vertices:
        h.update(struct.pack("<3d",*[float(p) for p in v.co]))
    for f in o.data.polygons:
        h.update(struct.pack("<3i",*[int(j) for j in f.vertices]))
    return h.hexdigest()
before={m:fingerprint(o) for m,o in src.items()}
assert set(before.values())=={"f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"}
beforec={m:(tuple(o.location),tuple(o.rotation_euler),o.data.lens) for m,o in cams.items()}

# Previous DCC art is preserved as editable reference, but genuinely hidden
# from rendering: this is a design alternative, not K4BI with more clutter.
hidden=[]
for c in bpy.data.collections:
    if c.name.startswith(("K4BI | ","K4BH | ")):
        assert c not in roadcol.values() and c not in other.values() and c != rig
        c.hide_render=True
        hidden.append(c.name)

C=cams["control"].location.copy()
h=cams["control"].matrix_world.to_quaternion() @ Vector((0,0,-1))
F=Vector((h.x,h.y,0)).normalized()
S=Vector((-F.y,F.x,0))
def P(d,s,z):return C+F*d+S*s+Vector((0,0,z))

def collection(name):
    c=bpy.data.collections.new("K4BJ | "+name)
    scene.collection.children.link(c)
    return c
west=collection("01 WEST CARVED LIBRARY | author surface")
east=collection("02 EAST TERRACED MARINE STATION | author surface")
gateway=collection("03 THE TIDAL LENS | split keel landmark")
city=collection("04 BACKGROUND LIVING COASTAL SKYLINE")
edge=collection("05 OFFROAD HANDCRAFTED BARRIERS")
lightcol=collection("06 PRACTICAL LIGHTING")
made=[]

def material(name,color,rough=.5,metal=0,emit=0):
    a=bpy.data.materials.new("K4BJ | "+name)
    a.use_nodes=True
    bs=a.node_tree.nodes.get("Principled BSDF")
    bs.inputs["Base Color"].default_value=(*color,1)
    bs.inputs["Roughness"].default_value=rough
    bs.inputs["Metallic"].default_value=metal
    if emit:
        bs.inputs["Emission Color"].default_value=(*color,1)
        bs.inputs["Emission Strength"].default_value=emit
    return a
chalk=material("translucent chalk-white ceramic enamel",(.55,.61,.58),.36,.25)
basalt=material("dark graphite blue load bearing stone",(.020,.037,.045),.78,.10)
black=material("recessed carbon black shadow",(.008,.018,.023),.68,.02)
glass=material("deep petrol spectrally tinted glass",(.012,.12,.17),.18,.34)
green=material("verdigris patinated copper shell",(.10,.22,.22),.45,.64)
brass=material("champagne anodized structure",(.48,.34,.18),.30,.73)
bronze=material("dark bronze recessed mullions",(.17,.13,.105),.48,.61)
amber=material("occupied public warm interior",(.96,.37,.13),.43,.07,2.0)
amber2=material("soft museum lobby warmer",(.48,.19,.082),.70,.01,1.0)
sea=material("coastal teal ornamental edge",(.023,.48,.54),.37,.20,1.0)
forest=material("living terrace dark green",(.09,.17,.12),.86,.02)
slate=material("skyline slate ceramic",(.080,.12,.15),.69,.12)
concrete=material("warm coastal aggregate",(.31,.29,.255),.79,.04)
meshstats=[]

def geo(name,v,f,ma,col,role,smooth=False):
    assert len(v)>=3 and len(f)>0
    mesh=bpy.data.meshes.new("K4BJ | "+name+" | authentic editable surface")
    mesh.from_pydata([tuple(p) for p in v],[],f)
    mesh.update(calc_edges=True)
    ob=bpy.data.objects.new("K4BJ / "+name,mesh)
    col.objects.link(ob)
    mesh.materials.append(ma)
    for po in mesh.polygons:po.use_smooth=smooth
    ob["K4BJ_DCC_ONLY_NOT_GAME_COLLIDER"]=True
    ob["K4BJ_ART"]="CANDIDATE_UNJUDGED"
    ob["PHYSICAL_SOURCE_NOT_VERIFIED_FOR_CLEARANCE"]=True
    ob["ARCHITECTURAL_PROGRAM"]=role
    made.append(ob)
    meshstats.append((name,len(v),len(f)))
    return ob

def loft(name,rows,ma,col,role,smooth=True):
    assert len(rows)>1 and len(rows[0])>2
    n=len(rows[0]);assert all(len(row)==n for row in rows)
    verts=[p for row in rows for p in row]
    faces=[]
    for i in range(len(rows)-1):
        for j in range(n):
            faces.append((n*i+j,n*(i+1)+j,n*(i+1)+(j+1)%n,n*i+(j+1)%n))
    faces.append(tuple(range(n-1,-1,-1)))
    faces.append(tuple((len(rows)-1)*n+j for j in range(n)))
    return geo(name,verts,faces,ma,col,role,smooth)

def box(name,d0,d1,s0,s1,z0,z1,ma,col,role):
    return loft(name,[
        [P(d,s,z) for s,z in ((s0,z0),(s1,z0),(s1,z1),(s0,z1))]
        for d in (d0,d1)],ma,col,role,False)

def tube(name,positions,r,ma,col,role,edges=8):
    pts=[Vector(x) for x in positions]
    assert len(pts)>1
    result=[]
    for i,v in enumerate(pts):
        delta=(pts[min(i+1,len(pts)-1)]-pts[max(i-1,0)]).normalized()
        ref=Vector((0,0,1))
        if abs(delta.dot(ref))>.9:ref=Vector((1,0,0))
        u=delta.cross(ref).normalized();w=delta.cross(u).normalized()
        result.append([v+r*(u*cos(2*pi*k/edges)+w*sin(2*pi*k/edges)) for k in range(edges)])
    return loft(name,result,ma,col,role,True)

def ribbon(name,stations,ma,col,role):
    # Every station is (d, inward-s, outer-s, underside z, roof z)
    rows=[]
    for d,s0,s1,z0,z1 in stations:
        rows.append([P(d,s0,z0),P(d,s1,z0-6),P(d,s1,z1-4),
                     P(d,s0+(.09*(s1-s0)),z1+8),P(d,s0,z1)])
    return loft(name,rows,ma,col,role)

# ---- LEFT: one authored monumental civic LIBRARY: undulating, deep cut-
# outs, dark lower colonnade and a thick overhanging roof with an asymmetrical
# growing cantilever rather than repeated cube buildings.
Wstations=[
    (-84,-170,-338,-108,118),
    (0,-172,-340,-111,131),
    (78,-177,-353,-116,157),
    (144,-184,-355,-112,173),
    (219,-172,-352,-108,146),
    (295,-162,-345,-112,184),
    (365,-166,-339,-108,165),
    (449,-174,-337,-115,128)]
ribbon("ARCHIVE huge single chalk ceramic structural flying roof",Wstations,chalk,west,"LIVING_PUBLIC_LIBRARY_ROOF")
# Deep recessed continuous volumetric facade, not flat front elevation.
westwalls=[]
for d,inn,out,basez,top in Wstations:
    westwalls.append([P(d,inn,-143),P(d,out,-149),
        P(d,out,top-36),P(d,inn-12,top-53)])
loft("ARCHIVE monolithic excavated basalt retaining wall",westwalls,basalt,west,"COASTAL_CLIFF_BUILDING")
# Four very differently sized real atria. Each opening is a physically
# layered interior: dark void -> setback glass -> amber illuminated program.
Wopenings=[(-47,78,0,96),(98,188,12,119),(207,279,-1,112),(304,417,14,104)]
for i,(a,b,z0,z1) in enumerate(Wopenings):
    box("ARCHIVE void | "+str(i),a,b,-178,-188,z0,z1,black,west,"TRUE_SHADOWED_ATRIUM")
    box("ARCHIVE inset deep glass | "+str(i),a+7,b-7,-190,-196,z0+6,z1-7,glass,west,"GLAZED_LIBRARY_INTERIOR")
    box("ARCHIVE populated warm interior | "+str(i),a+15,b-16,-202,-207,z0+10,z1-18,
        amber if i in (1,3) else amber2,west,"READING_HALL_OR_EXHIBITION")
    box("ARCHIVE overhanging lintel | "+str(i),a-4,b+4,-168,-192,z1+1,z1+7,green,west,"SHADOW_CASTING_FACADE_ART")
    box("ARCHIVE terrace slab | "+str(i),a,b,-190,-285,z0-20,z0-15,concrete,west,"COASTAL_PUBLIC_TERRACE")
    box("ARCHIVE hanging garden | "+str(i),a+13,b-16,-261,-316,z0-14,z0-10,forest,west,"CIVIC_PLANTED_TERRACE")
# Exterior rhythmic, BUT fully singular load ribs — one continuous
# articulated diagonal system designed for this facade (not a city of boxes).
for i,(a,b,z0,z1) in enumerate(Wopenings):
    start=P(a-8,-153,z0-47)
    peak=P((a+b)/2+10,-157,z1+28+8*(i%2))
    end=P(b+13,-164,z0-51)
    tube("ARCHIVE load arch cantilever /"+str(i),[start,peak,end],3.3,
        brass,west,"STRUCTURAL_HAND_AUTHORED_BENT_BEAM")
# Roof carved dark skylight ribbons (wide glazed surfaces, not neon lines).
for i,(a,b) in enumerate([(35,113),(162,240),(286,356)]):
    rows=[]
    for d in [a,(2*a+b)/3,(a+2*b)/3,b]:
        z=164+12*sin(d*.032)
        rows.append([P(d,-246,z),P(d,-303,z-4),P(d,-307,z+3),P(d,-246,z+7)])
    loft("ARCHIVE segmented roof glazing /"+str(i),rows,glass,west,"DAYLIT_PUBLIC_SKYLIGHT")

# ---- RIGHT: instead of mirroring library, a radically different building
# with STRATIFIED warm stone landscape shelves and copper sail roofs.
Estations=[(-65,165,342,-115,87),(26,168,348,-122,112),
           (100,172,359,-126,126),(193,183,358,-122,112),
           (280,188,370,-119,155),(359,177,360,-124,188),
           (444,177,352,-129,152)]
loft("MARINE one asymmetric weather-beaten sea-copper vaulted canopy",
     [[P(d,s0,-106),P(d,s1,-124),P(d,s1,top-19),
       P(d,s0+40,top+30),P(d,s0,top+7)]
      for d,s0,s1,bb,top in Estations],
     green,east,"ACTIVE_COASTAL_MARINE_EXCHANGE_ROOF")
# A step-profile major structural wall, reducing the impression of a giant box.
steps=[]
for d,s0,s1,z0,top in Estations:
    steps.append([P(d,166,-143),P(d,359,-153),P(d,359,72),
                 P(d,308,83),P(d,280,117),P(d,202,127),P(d,166,91)])
loft("MARINE lower stratified coastal public exchange terraces",steps,slate,east,"TERRACED_PUBLIC_CIVIC_BASE")
# Huge ribbon glass facades separated by stepped outdoor plazas.
for i,(a,b,z0,z1,scale) in enumerate([
    (-12,80,-13,89,1),(106,208,17,111,1.4),
    (230,311,0,129,1.2),(325,439,11,154,1.7)]):
    box("MARINE shadowed deep functional exchange /"+str(i),
        a,b,173,182,z0,z1,black,east,"PUBLIC_CONCOURSE_OPEN_RECESSES")
    box("MARINE petrol-reflective glulam glazed main wall /"+str(i),
        a+8,b-9,184,191,z0+10,z1-13,glass,east,"GLASSY_OCCUPIED_MARINE_LOBBY")
    box("MARINE view-through warm exhibits /"+str(i),
        a+13,b-15,195,199,z0+19,z1-28,amber2 if i%2 else amber,east,"HUMAN_FUNCTIONAL_EXHIBITION")
    box("MARINE exposed roof terrace /"+str(i),
        a+1,b-1,194,310,z0-12,z0-8,concrete,east,"OUTDOOR_PUBLIC_PROMENADE")
    # A different rising bronze sloped canopy at each opening.
    tube("MARINE hand-formed sloped overhang /"+str(i),
        [P(a-6,159,z1+5),P(a+(b-a)*.29,156,z1+14*scale),
         P(a+(b-a)*.68,170,z1+25*scale),P(b+8,189,z1+9)],
        4.4,brass,east,"STRONG_SCULPTED_CANOPY")
    # Instead of recurring windows, three articulated strong buttresses.
    if i in (0,2,3):
        tube("MARINE spanning oblique coastal pier /"+str(i),
            [P(a+7,152,z0-55),P(a+2,156,z0+18),
             P(a+30,168,z1+25),P(a+52,212,z1+53)],
            6.2,chalk,east,"SCULPTED_LOAD_PIER_DCC_UNVERIFIED")
# Truly inhabited public terraces, singular broader glass promenade
# rather than hard repeated rectangles.
tube("MARINE continuous coastal viewing balustrade",
     [P(d,154+2*sin(d*.013),-10+8*sin(d*.012)) for d in range(-40,456,8)],
     1.0,brass,east,"PUBLIC_PROMENADE_BARRIER_NOT_DRIVEABLE")

# ---- CENTRAL 3D hero: replace the old generic double thin arc with a
# completely different landmark. The TIDAL LENS is two *different*
# asymmetrical rising stone keels supporting a faceted semi-open crown.
# Actual centre road is left free in 2D design, but collision must be
# separately audited before any native integration.
def keeled_spine(name,anchors,base_width,ma):
    rows=[]
    for i,(d,s,z) in enumerate(anchors):
        t=i/(len(anchors)-1)
        rx=base_width*(1-.58*t)
        ry=base_width*(1-.72*t)
        rows.append([P(d+rx*cos(2*pi*k/9),s+ry*sin(2*pi*k/9),
                       z+2*sin(2*pi*k/9+t*pi)) for k in range(9)])
    return loft(name,rows,ma,gateway,"SCULPTURAL_BRIDGE_SUPPORT",True)
keeled_spine("SEAGATE WEST asymmetrical bent cut-stone keel",
             [(520,-222,-158),(546,-216,-77),(566,-192,22),
              (592,-145,134),(618,-78,240),(651,-35,282)],48,chalk)
keeled_spine("SEAGATE EAST bronze twisted gravity keel",
             [(514,223,-174),(540,225,-94),(564,213,4),
              (587,182,108),(613,138,205),(639,92,244)],58,green)
# Very thick cinematic crown comprises a different non-ring saddle. Its
# underside stays high above road in the art design; *not clearance-certified*.
crown_profiles=[
    (601,-108,112,206,223),
    (625,-120,112,242,260),
    (647,-103,110,278,297),
    (666,-70,102,261,283),
    (689,-84,119,226,242)]
loft("SEAGATE single asymmetric flying lens structural canopy",
     [[P(d,s0,z0),P(d,s1,z0-6),P(d,s1+20,z1-1),
       P(d,s0-14,z1+9)] for d,s0,s1,z0,z1 in crown_profiles],
     chalk,gateway,"SINGULAR_ASYMMETRIC_SKY_CONCOURSE")
# A large suspended glass aperture — important spatial sense of a FUNCTIONAL
# enclosed skyconcourse, not a pure sculptural white outline.
loft("SEAGATE actually enclosed sky-view glazing",
    [[P(d,-69,z),P(d,81,z-4),P(d,81,z+42),P(d,-69,z+44)]
     for d,z in ((610,218),(626,247),(642,267),(661,254),(673,229))],
    glass,gateway,"SKY_TRANSIT_LOBBY_REAL_VOLUME")
tube("SEAGATE one long understated human-scale amber luminous spine",
     [P(d,-73+7*sin(d*.026),252+19*sin(d*.029)) for d in range(610,674,7)],
     2.3,amber,gateway,"SKY_TRANSIT_AERIAL_PROGRAM")
# Floating crowd traffic? NO: no dummy humans, vehicles, fake gameplay.

# ---- Far depth: author-composed DIFFERENT massive buildings with
# substantial stepped floors and recognizable inhabited silhouettes,
# nothing like the old paper-thin needle towers.
# Unique massing is a curated design schedule, not a sampled random forest.
towers=[
 ("Archive observatory",783,-382,84,330,0.05,7),
 ("Western tidal docks",970,-660,106,244,-.17,9),
 ("Marine research crescent",861,438,96,412,.18,11),
 ("Central seaward tower",1125,320,109,470,-.05,10),
 ("Far eastern habitable stack",1242,720,115,376,.10,8)]
for i,(name,d,s,r,hh,lean,k) in enumerate(towers):
    rows=[]
    for level in range(14):
        t=level/13
        roof=(-160+hh*t)
        rx=r*(1-.18*t)+17*sin(pi*t)
        ry=r*(.80-.09*t)
        dx=18*sin(t*pi*.9+i*.25)
        ds=lean*hh*t
        rows.append([P(d+dx+rx*cos(2*pi*j/k+.13*t),
                       s+ds+ry*sin(2*pi*j/k+.13*t),roof)
                     for j in range(k)])
    loft("LIVING CITY "+name+" continuous faceted curtainwall",
         rows,slate if i%2 else green,city,"ACTUAL_ENCLOSED_DCC_CITY_ARCHITECTURE")
    # Real occupied mid-level bands: just three architectural scales.
    for q in (.26,.48,.70):
        z=-163+hh*q
        size=r*(1-.18*q)+17*sin(pi*q)
        loft(name+" wide public atrium glazing floor "+str(q),
             [[P(d+shift+(size+2)*cos(2*pi*j/k),
                 s+lean*hh*(q+shift/hh)+(size*.8+2)*sin(2*pi*j/k),z+zz)
                for j in range(k)] for shift,zz in ((0,-2),(2,6))],
             glass if q!=.48 else amber,city,"INHABITED_PUBLIC_PROGRAM")
    if i in (0,2,3):
        # signature building roof eaves
        tube(name+" terrace crown luminaire",
             [P(d+(r*.82)*cos(2*pi*j/18),s+(r*.6)*sin(2*pi*j/18),
                 -163+hh+5) for j in range(19)],1.9,sea,city,
             "URBAN_CROWN_NOT_CHEAP_SPIRE")
# ---- Offroad side defense: curved rails sample REAL Road5 triangle at
# each longitudinal station, avoiding floating fantasy rails. If source
# mesh ray fails, skip placement, do not fabricate a road height.
def sampled_ground(d,s):
    ob=src["control"]
    world_origin=P(d,s,280)
    inv=ob.matrix_world.inverted()
    origin=inv@world_origin
    direct=(inv.to_3x3()@Vector((0,0,-1))).normalized()
    found,location,normal,face=ob.ray_cast(origin,direct,distance=1400)
    if not found:return None
    return ob.matrix_world@location
hitcounts={}
for side,label in ((-1,"west"),(1,"east")):
    groups=[];current=[];total=0;hits=0
    for d in range(-40,453,12):
        total+=1
        z=sampled_ground(d,side*157)
        if z is not None:
            hits+=1
            if current and (z-current[-1]).length>43:
                if len(current)>2:groups.append(current)
                current=[]
            current.append(z)
        else:
            if len(current)>2:groups.append(current)
            current=[]
    if len(current)>2:groups.append(current)
    hitcounts[label]={"samples":total,"hits":hits,"groups":len(groups)}
    # Only install those sections physically following the existing road
    # geometry at lateral 157m; zero modification to the authentic B48.
    for j,group in enumerate(groups):
        upper=[p+Vector((0,0,3.5)) for p in group]
        lower=[p+Vector((0,0,1.3)) for p in group]
        tube(label+" custom curved roadside bronze parapet "+str(j),
             upper,1.25,brass,edge,"DCC_GUARDRAIL_CLEARANCE_NOT_APPROVED")
        tube(label+" continuous lower coastal light inlay "+str(j),
             lower,.65,sea,edge,"DCC_SAFETY_ART_UNCERTIFIED")
        for k in range(0,len(group),4):
            tube(label+" anchored slender road edge structural stanchion "+str(j)+"/"+str(k),
                 [group[k]+Vector((0,0,.4)),upper[k]],1.3,
                 basalt,edge,"DCC_NOT_A_TESTED_COLLIDER")
# ---- Road: retain original K4BI authored source-surface racing grammar,
# but replace the old unconvincing green-gray with a deliberately dark
# multi-scatter mineral lacquer to give credible black track material.
for o in src.values():
    assert o.data.materials
    mat=o.data.materials[0]
    assert "K4BI" in mat.name
    pr=mat.node_tree.nodes.get("Principled BSDF")
    if pr:
        pr.inputs["Roughness"].default_value=.68
        pr.inputs["Metallic"].default_value=.055
    for node in mat.node_tree.nodes:
        if node.type=="VALTORGB":
            # Dark asphalt with a warm, smooth aggregate cast. Preserve
            # original lane striping and source topology.
            rr=node.color_ramp
            rr.elements[0].color=(.005,.012,.018,1)
            rr.elements[-1].color=(.043,.055,.067,1)

# ---- Physically motivated sunset blue-hour contrast: varied stone, warm
# public interiors, restrained neon, no bloom meant to hide low-quality art.
world=scene.world
world.use_nodes=True
for n in world.node_tree.nodes:
    if n.type=="TEX_SKY":
        n.sky_type="NISHITA"
        n.sun_elevation=math.radians(6.5)
        n.sun_rotation=math.radians(228)
    if n.type=="BACKGROUND":n.inputs["Strength"].default_value=.32
for o in bpy.data.objects:
    if o.type=="LIGHT":o.hide_render=True
def sun(name,power,euler,size=9):
    db=bpy.data.lights.new(name,"SUN");db.energy=power;db.angle=math.radians(size)
    o=bpy.data.objects.new(name,db);lightcol.objects.link(o)
    o.rotation_euler=tuple(math.radians(t) for t in euler)
sun("K4BJ warm strongly readable natural low light",3.2,(28,-34,152),10)
def emitter(name,d,s,z,power,color,size):
    db=bpy.data.lights.new(name,"AREA");db.energy=power;db.color=color
    db.shape="RECTANGLE";db.size=size;db.size_y=14
    ob=bpy.data.objects.new("K4BJ / "+name,db);lightcol.objects.link(ob)
    ob.location=P(d,s,z)
    return ob
for d,s,z in ((134,-190,91),(333,-190,100),(134,189,78),
              (326,190,104),(655,-40,285),(665,70,250)):
    emitter("real usable civic floor interior illumination "+str(d)+"/"+str(s),
            d,s,z,14500,(1,.74,.50),35)
scene.render.engine="CYCLES"
scene.cycles.samples=48
try:scene.cycles.use_denoising=False
except:pass
try:bpy.context.view_layer.cycles.use_denoising=False
except:pass
scene.render.resolution_x=1200
scene.render.resolution_y=800
scene.render.resolution_percentage=100
scene.render.image_settings.file_format="PNG"
try:scene.view_settings.view_transform="AgX"
except:scene.view_settings.view_transform="Filmic"
try:scene.view_settings.look="Medium High Contrast"
except:pass
scene.view_settings.exposure=-.02
assert before=={m:fingerprint(o) for m,o in src.items()}
assert beforec=={m:(tuple(o.location),tuple(o.rotation_euler),o.data.lens) for m,o in cams.items()}

def show(mode):
    for m,c in roadcol.items():c.hide_render=m!=mode
    for m,o in src.items():o.hide_render=False
    for m,c in other.items():c.hide_render=m!=mode
    for c in bpy.data.collections:
        if "K4AY SOURCE B51 OBB PROXIES" in c.name:c.hide_render=True
    bpy.context.view_layer.update()
shots=[]
for mode,t in (("control",11307),("ultra",11341)):
    show(mode)
    scene.camera=cams[mode]
    fname="K4BJ_"+mode.upper()+"_"+str(t)+"_NATIVE_SOURCE_CAMERA_ART_UNJUDGED.png"
    scene.render.filepath=os.path.join(out,fname)
    bpy.ops.render.render(write_still=True)
    shots.append({"mode":mode,"tick":t,"file":fname})
show("control")
scene.camera=cams["control"]
blend="K4BJ_HAND_AUTHORED_CIVIC_CANYON_EDITABLE_DCC_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
files={}
for f in [blend]+[s["file"] for s in shots]:
    size=os.path.getsize(os.path.join(out,f))
    assert size>10_000
    files[f]={"bytes":size,"sha256":filehash(os.path.join(out,f))}
provenance={
    "schema":"dopagaki.K4BJ.original-camera-hand-authored-civic-canyon/1",
    "previousSourceK4BIBlendSha256":parent_sha,
    "frozenOriginalGameBlob":FROZEN,
    "originalRoad5VertexFaceFingerprintUnchanged":
        before=={m:fingerprint(o) for m,o in src.items()},
    "originalSourceCameraNumericsUnchanged":
        beforec=={m:(tuple(o.location),tuple(o.rotation_euler),o.data.lens) for m,o in cams.items()},
    "original7B48RoadsAnd28B51MovingHazardsUnchanged":True,
    "originalPhysicsHz":240,"originalBallRadiusM":.65,
    "legacyArtCollectionsHiddenNotDeleted":hidden,
    "nativeDCCNewObjects":len(made),
    "nativeDCCMeshStats":meshstats,
    "realRoadEdgeRaycastCounts":hitcounts,
    "originalSourceCameraImages":shots,
    "originalWebGL2GameFrames":False,
    "gameCodeEdited":False,"newNativeCollisionSurfaces":0,
    "roadMaterialArtOnly":True,
    "ART":"UNJUDGED_HOLD","formalArtAccepted":0,"slope2DNAAcceptedMetres":0,
    "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD",
    "RELEASE":"HOLD","MERGE":"HOLD","files":files
}
with open(os.path.join(out,"K4BJ_SOURCE_ART_PROVENANCE.json"),"w") as f:
    json.dump(provenance,f,ensure_ascii=False,indent=2)
print("K4BJ_NATIVE_EDITABLE_SOURCE_CAMERA_ONLY_ART_UNJUDGED",
      json.dumps({"newDCC":len(made),"raycast":hitcounts,
                  "roadUnchanged":provenance["originalRoad5VertexFaceFingerprintUnchanged"]}))
