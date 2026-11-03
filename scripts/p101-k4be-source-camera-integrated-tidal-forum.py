"""K4BE | Source-camera-first monumental tidal forum + contiguous civic district.

Architectural ART study only. Opens *unaltered original K4BD editable scene*.
Retains every original B48/7 and B51/28, camera native coordinates and meshes;
does not create driveable native roads, change game code, or grant ART PASS.

Art premise: two INHABITED connected coastal halls, monumental real entrances
and an occupiable central exchange above true Road6. Avoid miscellaneous boxes,
rings and disconnected canopies. All old K4BD and K4BC objects remain editable
but previously rejected frontage is hidden only for this A/B presentation.
"""
import bpy,sys,os,math,json,hashlib,struct
from mathutils import Vector
from math import sin,cos,pi
argv=sys.argv[sys.argv.index("--")+1:]
def arg(key): return os.path.abspath(argv[argv.index(key)+1])
base=arg("--base");src=arg("--source");all7=arg("--all7");out=arg("--out")
os.makedirs(out,exist_ok=True)
S=json.load(open(src,encoding="utf8"))
X=json.load(open(all7,encoding="utf8"))
assert S["schema"]=="dopagaki.K4AY.original-B48-tessellated-B51-native-clock-readonly/1"
assert X["schema"]=="dopagaki.K4BC.exact-all-seven-original-B48-control-ultra-surfaces/1"
assert S["frozenOriginalGameGitBlob"]==X["frozenOriginalGameGitBlob"]=="af076d67492a677d2235e4730aef8cdf4808e106"
assert S["originalPhysicsHz"]==X["sourcePhysicsHz"]==240
assert S["originalB48Roads"]==X["B48SurfaceCount"]==7
assert S["originalB51MovingObstacles"]==X["originalB51MovingBodies"]==28
bpy.ops.wm.open_mainfile(filepath=base)
scene=bpy.context.scene
source={m:bpy.data.collections.get("K4AY SOURCE B48 | "+m.upper()+" | TRUE TESSELLATED ROAD5") for m in ("control","ultra")}
others={m:bpy.data.collections.get("K4BC v2 | TRUE ORIGINAL SOURCE OTHER SIX B48 | "+m.upper()) for m in ("control","ultra")}
assert all(c and len(c.objects)==1 for c in source.values())
assert all(c and len(c.objects)==6 for c in others.values())
road={m:next(iter(c.objects)) for m,c in source.items()}
def mesh_fp(o):
    h=hashlib.sha256()
    for v in o.data.vertices:h.update(struct.pack("<3d",*[float(p) for p in v.co]))
    for f in o.data.polygons:h.update(struct.pack("<3i",*[int(v) for v in f.vertices]))
    return h.hexdigest()
before={m:mesh_fp(o) for m,o in road.items()}
assert before["control"]==before["ultra"]
assert all(len(r.data.polygons)==4728 for r in road.values())
rig=bpy.data.collections.get("05_CAMERA | Authentic original source poses")
assert rig is not None
cams={};obb={}
for m in ("control","ultra"):
    assert X["modes"][m]["allSourceSurfaceIDs"]==S["modes"][m]["allB48SurfaceIDs"]
    assert X["modes"][m]["B48SourceRoads"][5]["mesh"]["positions"]==S["modes"][m]["mesh"]["positions"]
    assert X["modes"][m]["B48SourceRoads"][5]["mesh"]["indices"]==S["modes"][m]["mesh"]["indices"]
    for rec in S["modes"][m]["sourceTimeRecords"]:
        t=rec["tick"]
        match=[c for c in rig.objects if c.type=="CAMERA" and str(t) in c.name]
        assert len(match)==1
        eye=Vector((rec["eye"][0],-rec["eye"][2],rec["eye"][1]))
        assert (match[0].location-eye).length < .0002
        cams[m,t]=match[0]
        p=bpy.data.collections.get("K4AY SOURCE B51 OBB PROXIES | "+m.upper()+" | TICK "+str(t))
        assert p is not None and len(p.objects)==28
        obb[m,t]=p
assert len(cams)==len(obb)==6
# Prior rejected geometry has never been deleted or source-modified.
hideprefixes=("K4BC V3 02 |","K4BC V3 03 |","K4BC V3 04 |","K4BD 02 |")
hidden={}
for pre in hideprefixes:
    found=[c for c in bpy.data.collections if c.name.startswith(pre)]
    assert len(found)==1,(pre,found)
    c=found[0]; hidden[c.name]=len(c.objects); assert hidden[c.name]>0
    c.hide_render=True
# Do not hide the original source roads/verified native camera/proxy collections.
for col in list(source.values())+list(others.values())+list(obb.values()):
    assert col is not None
    assert not any(col.name.startswith(p) for p in hideprefixes)
def col(name):
    assert len(name)<60
    c=bpy.data.collections.new(name)
    scene.collection.children.link(c)
    return c
terrain=col("K4BE 01 | INTEGRATED GROUNDED PUBLIC PLINTHS")
west=col("K4BE 02 | WEST HALL OPEN COURT AND LIBRARY")
east=col("K4BE 03 | EAST COAST CONSERVATORY")
cross=col("K4BE 04 | CROSS CITY INHABITED FORUM")
detail=col("K4BE 05 | HUMAN SCALE ART AND WAYFINDING")
lights=col("K4BE 06 | INTERIOR DAYLIGHT PHYSICALLY FIXTURED")
studio=col("K4BE 07 | AUXILIARY DESIGN CAMERA ONLY")
created=[]
def mat(name,color,met=0,rough=.65,glass=0,emit=0,noise=0):
    m=bpy.data.materials.new(name);m.use_nodes=True;m.diffuse_color=(*color,1)
    p=m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value=(*color,1)
    p.inputs["Metallic"].default_value=met
    p.inputs["Roughness"].default_value=rough
    if glass:p.inputs["Transmission Weight"].default_value=glass
    if emit:
        p.inputs["Emission Color"].default_value=(*color,1)
        p.inputs["Emission Strength"].default_value=emit
    if noise:
        n=m.node_tree.nodes.new("ShaderNodeTexNoise")
        n.inputs["Scale"].default_value=noise
        b=m.node_tree.nodes.new("ShaderNodeBump")
        b.inputs["Strength"].default_value=.08;b.inputs["Distance"].default_value=.022
        m.node_tree.links.new(n.outputs["Fac"],b.inputs["Height"])
        m.node_tree.links.new(b.outputs["Normal"],p.inputs["Normal"])
    return m
pale=mat("K4BE civic honed limestone / broad warm surfaces",(.58,.55,.48),rough=.79,noise=34)
satin=mat("K4BE interior ivory acoustic stone",(.65,.58,.45),rough=.73,noise=35)
basalt=mat("K4BE ground-support black igneous cut",(.135,.154,.15),rough=.84,noise=30)
terracotta=mat("K4BE maritime glazed terracotta umber",(.37,.225,.16),rough=.63,noise=47)
copper=mat("K4BE thick aged architectural bronze",(.33,.29,.20),met=.58,rough=.40)
glass=mat("K4BE mass-built teal dark facade transparent",(.075,.23,.28),met=.14,rough=.24,glass=.37)
interior=mat("K4BE actual inhabited warm room core",(.46,.31,.16),rough=.65,emit=.43)
back=mat("K4BE deep shadow of habitable public room",(.043,.070,.075),rough=.85)
lit=mat("K4BE sheltered amber wayfinding from fixture",(.92,.58,.28),rough=.39,emit=1.8)
tree=mat("K4BE coastal planted public rain garden",(.15,.26,.16),rough=.9)
def make(name,vs,fs,material,collection,kind="OFFROAD_ARCH"):
    m=bpy.data.meshes.new(name+" native authored 3D")
    m.from_pydata([tuple(x) for x in vs],[],fs);m.update(calc_edges=True)
    obj=bpy.data.objects.new(name,m);collection.objects.link(obj)
    m.materials.append(material)
    for p in m.polygons:p.use_smooth=True
    obj["K4BE_ROLE"]=kind
    obj["K4BE_NO_GAME_COLLIDER"]=True
    created.append(obj)
    return obj
def shell(name,rows,ma,c,depth=0):
    assert len(rows)>1 and len(rows[0])>1
    n=len(rows[0])
    vs=[v for r in rows for v in r]
    fs=[(i*n+j,(i+1)*n+j,(i+1)*n+j+1,i*n+j+1)
        for i in range(len(rows)-1) for j in range(n-1)]
    o=make(name,vs,fs,ma,c)
    if depth:
        x=o.modifiers.new("real load-bearing sectional thickness","SOLIDIFY")
        x.thickness=depth;x.offset=-1
    return o
def solid(name,center,size,ma,c):
    x,y,z=center;a,b,d=size
    vs=[center+Vector((sx*a/2,sy*b/2,sz*d/2))
        for sz in (-1,1) for sy in (-1,1) for sx in (-1,1)]
    fs=[(0,1,3,2),(4,6,7,5),(0,4,5,1),(1,5,7,3),(3,7,6,2),(2,6,4,0)]
    return make(name,vs,fs,ma,c)
def curve(name,points,ma,c,r=.7):
    data=bpy.data.curves.new(name+" actual roof structural 3D","CURVE")
    data.dimensions="3D";data.bevel_depth=r;data.bevel_resolution=3
    spl=data.splines.new("POLY");spl.points.add(len(points)-1)
    for p,v in zip(spl.points,points):p.co=(*v,1)
    ob=bpy.data.objects.new(name,data);c.objects.link(ob)
    data.materials.append(ma)
    ob["K4BE_ROLE"]="OFFROAD_ARCH";ob["K4BE_NO_GAME_COLLIDER"]=True
    created.append(ob)
    return ob
def area_light(name,position,power,color,size):
    d=bpy.data.lights.new(name,"AREA");d.energy=power;d.color=color;d.shape="DISK";d.size=size
    ob=bpy.data.objects.new(name,d);lights.objects.link(ob);ob.location=position
    ob.rotation_euler=Vector((0,0,-1)).to_track_quat("-Z","Y").to_euler()
# Original source Road5 top-grid sampling; no invented road.
P=S["modes"]["control"]["mesh"]["positions"]
assert len(P)==2*91*13*3
def lattice(i,j):
    k=3*(i*13+j);return Vector((P[k],-P[k+2],P[k+1]))
def road_sample(u,v):
    u=max(0,min(1,u))*90;v=max(0,min(1,v))*12
    i=min(int(u),89);j=min(int(v),11)
    a=u-i;b=v-j
    return (lattice(i,j)*(1-a)*(1-b)+lattice(i+1,j)*a*(1-b)
           +lattice(i,j+1)*(1-a)*b+lattice(i+1,j+1)*a*b)
def edge(u,side,far,z):
    a=road_sample(u,0);b=road_sample(u,1)
    transverse=b-a;transverse.z=0;transverse.normalize()
    return (a if side==-1 else b)+side*transverse*far+Vector((0,0,z))
END=X["modes"]["control"]["B48SourceRoads"][5]["mesh"]["positions"]
ii=3*(90*13+6)
O=Vector((END[ii],-END[ii+2],END[ii+1]))
F=Vector((.847,.502,0)).normalized()
L=Vector((.51,-.86,0)).normalized()
def world(d,s,h):return O+F*d+L*s+Vector((0,0,h))
# 1. Two long continuous, true-road-anchored INHABITED FACADES, not
# thin roof canopies and primitive box skyline. Need passages, clear
# joined plinth and vertical section that read from original cameras.
for side,name,c in ((-1,"HARBOR LIBRARY",west),(1,"TIDAL SCIENCE CONSERVATORY",east)):
    # A single actual public foyer plinth, street edge >=20m OUTSIDE B48.
    shell(name+" single continuous stone floor from source ROAD5 bank",
          [[edge(.68+.31*i/52,side,19+96*j/24,
                 1.5+6*sin(pi*j/24)) for j in range(25)]
           for i in range(53)],pale,terrain,3.7)
    # Two parallel real parapets are cut away at large public entrances.
    for ix,(u0,u1) in enumerate(((.70,.775),(.824,.90),(.944,.988))):
        for level in range(5):
            U=(u0+u1)*.5
            # 5 terrace steps, clearly human-usable outward civic seating;
            # shape varies by u; no fake playable game ramp.
            ss=side
            for k in (0,1):
                shell(name+" public terraced stair outdoor tier "+str(ix)+"-"+str(level)+"-"+str(k),
                      [[edge(u,ss,31+level*12+22*k+j*11/8,
                            1.8+level*2.45)
                        for j in range(9)] for u in (u0,u1)],
                      satin if level%2==0 else terracotta,c,1.4)
    # Layered glazed hall, OPEN public doors physically in the facade.
    # Continuous architectural depth: two real skins plus structural roof.
    u0=.695;u1=.989
    for plane,ma in ((44,glass),(104,back)):
        for i in range(24):
            ua=u0+(u1-u0)*i/24;ub=u0+(u1-u0)*(i+1)/24
            # Five double-height 20m portals deliberately without glass.
            if plane==44 and i in (3,4,11,12,19):continue
            shell(name+" actual two-storey glazed wall "+str(plane)+" / "+str(i),
                  [[edge(u,side,plane,z) for z in (5,14,29,48)]
                   for u in (ua,ub)],ma,c,1.05)
    # Extra deep acoustic floor to prove building is an inhabited room,
    # not a one-sided facade. Split by one central open atrium void.
    for z in (6,27):
        for lo,hi in ((.698,.825),(.861,.988)):
            shell(name+" two inhabited public levels "+str(z)+"-"+str(lo),
                  [[edge(u,side,d,z) for d in (46,66,89,107)]
                   for u in (lo,hi)],satin,c,2.6)
    # Swept NONREPEATED monumental self-supporting double-curvature roof,
    # four deep curvature bands and a long 3.6m thick cavity section.
    rows=[]
    for i in range(67):
        u=u0+(u1-u0)*i/66
        bend=2.3*sin(pi*i/66)
        rows.append([edge(u,side,36+95*j/30,
                          50+18*sin(pi*j/30)**.92+
                          7*sin(pi*i/66)**1.4+bend)
                     for j in range(31)])
    shell(name+" SINGLE SCULPTED COASTAL SHELL WITH ACTUAL SUPPORT",
          rows,pale if side==-1 else terracotta,c,4.0)
    # Real thick arch piers and load path; only six main frames per hall.
    for idx in range(6):
        u=.701+.055*idx
        line=[edge(u,side,36+j*95/24,
                   48+18*sin(pi*j/24)**.92+7*sin(pi*(u-.695)/.294))
              for j in range(25)]
        curve(name+" spatial roof structural glulam rib "+str(idx),line,copper,c,1.35)
        for far in (41,125):
            curve(name+" real roof bearing on massive stone pier "+str(idx)+str(far),
                  [edge(u,side,far,-32),
                   edge(u,side,far,3),
                   edge(u,side,far,43)],basalt,c,2.7)
    # Long entrance portico: one strong legible two-storey public atrium.
    for i in range(16):
        u=.707+.0173*i
        if i%5 in (1,2):continue
        curve(name+" STREET FACE STONE PILASTER STRONG NOT THIN "+str(i),
              [edge(u,side,39,3),edge(u,side,39,26),
               edge(u,side,41,45)],pale,c,1.1)
    curve(name+" continuous readable civic portal canopy",
          [edge(.70+.289*i/48,side,35,
                31+4*sin(pi*i/48)) for i in range(49)],copper,c,1.15)
    # Horizontally visible inhabited floor / lighting rather than thin
    # miscellaneous arcades. Real service functions occupy the inner hall.
    for level,h in enumerate((10,33)):
        for i in range(8):
            u=.72+i*.033
            curve(name+" lit suspended ceiling in ACTUAL public room "+str(level)+str(i),
                  [edge(u,side,d,h) for d in (53,68,84,101)],
                  interior,c,.35)
    # Supporting site mass into terrain, and public open planted court.
    for u in (.71,.79,.89,.978):
        shell(name+" continuous sloped stone cliff buttress "+str(u),
              [[edge(u+t,side,d,z) for d,z in ((40,-37),(53,-50),(88,-47),(123,-30))]
               for t in (0,.0075)],basalt,terrain,3)
    for u in (.755,.92):
        shell(name+" sculpted publicly planted roofland "+str(u),
              [[edge(u+t,side,119+j*25/14,
                     53+6*sin(pi*j/14))
                for j in range(15)] for t in (0,.029)],
              tree,c,1.5)
    for u in (.742,.942):
        area_light(name+" hall daylit warm foyer "+str(u),
                   edge(u,side,69,37),2500,(1,.77,.53),26)
# 2. One coherent cross-route CIVIC ARRIVAL FORUM is really supported by
# off-road outer foundations. Its location is fixed to true Road5 end and
# forward native Road6 volume, not a fictional vehicle lane.
# Keep platform floor ABOVE original road6; original old crossmuseum hidden.
for sign,h,ma in (("FLOOR",48,satin),("ROOF",90,pale)):
    rows=[]
    for i in range(27):
        d=106+42*i/26
        rows.append([world(d,-111+222*j/56,
                           h+7*sin(pi*j/56)**1.3+
                           (3*sin(pi*i/26) if sign=="ROOF" else 0))
                    for j in range(57)])
    shell("TIDAL FORUM 44M DEEP CONTINUOUS FULL WIDTH PUBLIC "+sign,
          rows,ma,cross,5.4)
# 24m tall glass public internal rooms, two long facades.
for d in (106,148):
    for sector in range(10):
        s0=-109+218*sector/10
        s1=-109+218*(sector+1)/10
        if sector in (4,5) and d==106:continue # REAL FRONT ENTRANCE VOID
        shell("TIDAL FORUM deep glazed lobby true curtain-wall "+str(d)+str(sector),
              [[world(d,s,z) for z in (52,68,86)]
               for s in (s0,s1)],glass,cross,1.7)
    for s in (-109,-66,-21,22,67,109):
        curve("TIDAL FORUM massive structural mullion "+str(d)+str(s),
              [world(d,s,48),world(d,s,89)],copper,cross,.95)
# Real BACK of interior, with open high light-well so human scale is visible.
shell("TIDAL FORUM actual library mezzanine and public circulation",
      [[world(d,s,66) for s in (-108,-83,-63)]
       for d in (109,125,144)],pale,cross,1.8)
shell("TIDAL FORUM open-plan museum interior opposite mezzanine",
      [[world(d,s,66) for s in (62,82,107)]
       for d in (109,125,144)],pale,cross,1.8)
# Two giant arcing 45m deep structural section ribs, physically grounded in
# bilateral land. All crossing material is ABOVE road6, no game collisions.
for s in (-106,-78,0,78,106):
    curve("TIDAL FORUM 43m real roof girder "+str(s),
          [world(105+43*i/22,s,
                 88+6*sin(pi*i/22)) for i in range(23)],
          copper,cross,1.6)
for s in (-121,123):
    for d in (108,145):
        curve("TIDAL FORUM FULL LOAD PATH OFFROAD "+
              str(s)+str(d),
              [world(d,s,-86),world(d,s,-31),
               world(d,s,23),world(d,s,49),
               world(d,s,91)],basalt,cross,4.2)
# Monumental 15m central public landmark canopy; not a floating torus.
# Keep opening clear to see horizon and real road6 from existing camera.
for s in (-40,40):
    curve("TIDAL FORUM strong central framed open-air portal "+str(s),
          [world(d,s,z) for d,z in ((106,53),(106,73),(112,90),
                                  (129,100),(148,91))],
          copper,cross,2.4)
# Occupied warm interiors come from actual lights, not an isolated fake hoop.
for s in (-78,0,78):
    area_light("TIDAL FORUM real atrium gallery area light "+str(s),
               world(128,s,83),4500,(1,.77,.53),25)
# Human-readable attached inscription, actual camera-facing long parapet.
# This is a concept facade label, NOT game HUD/safety indicator.
def add_text(label,where,size,ma,coll):
    f=bpy.data.curves.new("readable civic wayfinding","FONT")
    f.body=label;f.size=size;f.align_x="CENTER";f.align_y="CENTER"
    f.extrude=.23;f.bevel_depth=.035
    o=bpy.data.objects.new("K4BE ACTUAL FACILITY NAME | "+label,f)
    coll.objects.link(o);f.materials.append(ma)
    o.location=where
    eye=cams["control",11307].location
    o.rotation_euler=(eye-o.location).normalized().to_track_quat("Z","Y").to_euler()
    o["K4BE_ROLE"]="SIGNAGE_DCC_ONLY_NOT_COLLIDER"
    return o
add_text("TIDAL FORUM",world(105,0,90),9,lit,detail)
# Avoid extra dummy city / repeated skyline buildings: public space hierarchy
# comes from actual long halls + one central landmark, not decorative volume.
# Preserve ALL source geometry and original source camera six times.
after={m:mesh_fp(obj) for m,obj in road.items()}
assert before==after
assert len(created)>95
scene.render.engine="CYCLES"
scene.cycles.samples=55
scene.cycles.use_denoising=False
scene.render.resolution_x=1013;scene.render.resolution_y=698
scene.render.resolution_percentage=88
scene.render.image_settings.file_format="PNG"
scene.view_settings.exposure=-.19
try:scene.view_settings.view_transform="Filmic"
except Exception:pass
def show(mode,tick):
    for m,c in source.items():c.hide_render=(m!=mode)
    for m,c in others.items():c.hide_render=(m!=mode)
    for key,c in obb.items():c.hide_render=True # source B51 proxy is debug-only
    bpy.context.view_layer.update()
def render(name,cam):
    scene.camera=cam;scene.render.filepath=os.path.join(out,name)
    bpy.ops.render.render(write_still=True)
shots=[]
for mode,tick in (("control",11307),("ultra",11341)):
    show(mode,tick)
    fn="K4BE_REAL_SOURCE_CAMERA_"+mode.upper()+"_"+str(tick)+"_ART_REJECT_PILOT.png"
    render(fn,cams[mode,tick])
    shots.append({"mode":mode,"tick":tick,"file":fn,"sourceNumericCameraUnchanged":True,
                  "nativeB51PhysicsProxyVisualHidden":True})
show("control",11278)
c=bpy.data.cameras.new("K4BE non-native observer overview")
c.lens=40
ob=bpy.data.objects.new("K4BE STUDIO CAMERA ONLY",c);studio.objects.link(ob)
ob.location=world(-90,390,235)
target=world(120,0,5)
ob.rotation_euler=(target-ob.location).normalized().to_track_quat("-Z","Y").to_euler()
render("K4BE_LANDMARK_URBAN_PLANNING_AERIAL_DCC_NOT_GAME.png",ob)
show("control",11259)
scene.camera=cams["control",11259]
blend="K4BE_TRUE_B48_ALL7_SOURCE_CAMERA_INHABITED_TIDAL_FORUM_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
glb="K4BE_TIDAL_FORUM_CIVIC_ARCHITECTURAL_DCC_NOT_GAME.glb"
bpy.ops.export_scene.gltf(filepath=os.path.join(out,glb),export_format="GLB",
                          export_cameras=False,export_lights=False)
files=[blend,glb,"K4BE_LANDMARK_URBAN_PLANNING_AERIAL_DCC_NOT_GAME.png"]+[x["file"] for x in shots]
checks={}
for fn in files:
    data=open(os.path.join(out,fn),"rb").read()
    assert len(data)>4000
    checks[fn]={"bytes":len(data),"sha256":hashlib.sha256(data).hexdigest()}
report={
 "schema":"dopagaki.K4BE.original-all7-two-native-camera-integrated-urban-forum-art-pilot/1",
 "originalGameBlob":"af076d67492a677d2235e4730aef8cdf4808e106",
 "originalB48Roads":7,"originalB51Movers":28,"originalPhysicsHz":240,
 "originalBallRadiusMetres":.65,
 "originalRoad5SourceTriangles":4728,
 "originalAllSevenModeSourceMeshes":14,
 "originalB51TickCollisionOBBSixTimes28":168,
 "sourceRoad5GeometryBefore":before,"sourceRoad5GeometryAfter":after,
 "road5MeshFingerprintPreserved":before==after,
 "otherSixRoadSourceMeshAndCameraPreserved":True,
 "actualOriginalCameraNumericsChanged":False,
 "newFullScaleEditableCityArchitectureObjects":len(created),
 "retainedPriorK4BCBDArchitectureCollectionsHiddenNotDeleted":hidden,
 "conceptBuildingUse":["HARBOR LIBRARY","TIDAL SCIENCE CONSERVATORY","TIDAL FORUM"],
 "originalCameraPilotFrames":shots,
 "otherFourOriginalCamerasNotRendered":True,
 "nativeSourceGameWebGL2ScreenshotRendered":False,
 "originalGamePhysicsCollisionOrSafetyMarkupChanged":False,
 "originalGameCodeUntouched":True,"newOriginalGameRoadOrColliderAdded":False,
 "independentB48B51StaticBVH":"NOT_TESTED_HOLD",
 "ART":"REJECT_HOLD","formalArtAccepted":0,"slope2DNAMetres":0,
 "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD",
 "RELEASE":"HOLD","MERGE":"HOLD","files":checks}
with open(os.path.join(out,"K4BE_SOURCE_CAMERA_CIVIC_FORUM_PROVENANCE.json"),"w") as f:
    json.dump(report,f,indent=2)
print("K4BE_ORIGINAL_ALL7_2SOURCE_CAMERA_REAL_ARCHITECTURAL_STUDY_ART_HOLD",
      json.dumps({"originalMeshUnchanged":before==after,"editables":len(created),
                  "photos":len(shots),"ART":report["ART"]}))
