"""K4BB Road5: PBR atlas and *inhabited* civic space. Blender DCC-only.

K4BA editorial art remains editable but previous research pieces are not
deleted. This script never changes original source B48 geometry, original B51
collision, 240Hz simulation, camera numerics, or gameplay indicators.
The shared original B48 road gets ONLY Blender UV+material previews.
"""
import bpy,math,os,sys,json,hashlib,struct
from math import sin,cos,pi
from mathutils import Vector
try:
    import numpy as np
except Exception as ex:
    raise RuntimeError("K4BB requires numpy for deterministic PBR image atlas") from ex
argv=sys.argv[sys.argv.index("--")+1:]
def opt(key):
    return os.path.abspath(argv[argv.index(key)+1])
base=opt("--base"); source=opt("--source"); out=opt("--out")
os.makedirs(out,exist_ok=True)
S=json.load(open(source,encoding="utf8"))
assert S["schema"]=="dopagaki.K4AY.original-B48-tessellated-B51-native-clock-readonly/1"
assert S["frozenOriginalGameGitBlob"]=="af076d67492a677d2235e4730aef8cdf4808e106"
assert S["originalPhysicsHz"]==240 and S["originalB48Roads"]==7 and S["originalB51MovingObstacles"]==28
bpy.ops.wm.open_mainfile(filepath=base)
scene=bpy.context.scene
roads={mode:bpy.data.collections.get("K4AY SOURCE B48 | "+mode.upper()+" | TRUE TESSELLATED ROAD5") for mode in ("control","ultra")}
assert all(c is not None and len(c.objects)==1 for c in roads.values())
objs={mode:next(iter(c.objects)) for mode,c in roads.items()}
def digest(obj):
    h=hashlib.sha256()
    for p in obj.data.vertices:
        h.update(struct.pack("<3d",*[float(z) for z in p.co]))
    for f in obj.data.polygons:
        h.update(struct.pack("<3i",*[int(i) for i in f.vertices]))
    return h.hexdigest()
before={mode:digest(obj) for mode,obj in objs.items()}
assert before["control"]==before["ultra"]
assert len(objs["control"].data.polygons)==4728
# Keep genuine camera poses exactly numerically identical to original source.
rig=bpy.data.collections.get("05_CAMERA | Authentic original source poses")
assert rig
cams={};proxies={}
for mode in ("control","ultra"):
    for rec in S["modes"][mode]["sourceTimeRecords"]:
        tick=rec["tick"]
        cam=[x for x in rig.objects if x.type=="CAMERA" and str(tick) in x.name]
        assert len(cam)==1
        cam=cam[0]
        eye=Vector((rec["eye"][0],-rec["eye"][2],rec["eye"][1]))
        assert (cam.location-eye).length<.0002
        cams[(mode,tick)]=cam
        c=bpy.data.collections.get("K4AY SOURCE B51 OBB PROXIES | "+mode.upper()+" | TICK "+str(tick))
        assert c is not None and len(c.objects)==28
        proxies[(mode,tick)]=c
assert len(cams)==len(proxies)==6
# The K4BA v2 architecture is preserved as an independently editable original.
def collection(name):
    c=bpy.data.collections.new(name);scene.collection.children.link(c);return c
interiors=collection("K4BB 01 | Deep inhabited civic interiors - editable rooms")
structure=collection("K4BB 02 | True civic service atria and supports")
detail=collection("K4BB 03 | Function and human-scale furnishings")
lamps=collection("K4BB 04 | Inhabited light and facade hierarchy")
art=collection("K4BB 05 | Studio only human-eye architectural review")
# Critical frozen source original B48 mesh: change material and UV layers only.
def material(name,base,metal=.0,rough=.65,emission=0,glass=0,grain=0):
    m=bpy.data.materials.new(name);m.diffuse_color=(*base,1)
    m.use_nodes=True
    p=m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value=(*base,1)
    p.inputs["Metallic"].default_value=metal
    p.inputs["Roughness"].default_value=rough
    if emission:
        p.inputs["Emission Color"].default_value=(*base,1)
        p.inputs["Emission Strength"].default_value=emission
    if glass:p.inputs["Transmission Weight"].default_value=glass
    if grain:
        n=m.node_tree.nodes.new("ShaderNodeTexNoise")
        n.inputs["Scale"].default_value=grain;n.inputs["Detail"].default_value=4
        b=m.node_tree.nodes.new("ShaderNodeBump")
        b.inputs["Strength"].default_value=.09;b.inputs["Distance"].default_value=.012
        m.node_tree.links.new(n.outputs["Fac"],b.inputs["Height"])
        m.node_tree.links.new(b.outputs["Normal"],p.inputs["Normal"])
    return m
stone=material("K4BB | matte pale travertine wall",(.59,.52,.43),.05,.7,grain=36)
copper=material("K4BB | weathered copper roof fins",(.27,.31,.31),.57,.38,grain=40)
bronze=material("K4BB | handrail brushed brass",(.47,.33,.17),.66,.39)
wood=material("K4BB | oak acoustic louvers",(.35,.19,.095),.08,.68,grain=65)
shadow=material("K4BB | deep recessed room and acoustic backplane",(.045,.075,.083),.07,.81)
glazing=material("K4BB | blue-green dark occupied glazed facade",(.06,.23,.25),.21,.17,glass=.42)
amber=material("K4BB | indoor public light",(.94,.56,.24),.06,.37,emission=2.4)
green=material("K4BB | coastal olive-green interior",(.12,.26,.14),0,.75)
glow_calm=material("K4BB | gallery white directional lighting",(.85,.73,.51),.08,.32,emission=1.25)

# Spatially coherent world-scale tectonic PBR atlas: stone/granite construction,
# joints, veins, aggregate, controlled weathering and variation by individual
# slabs. This is a DCC atlas, not a source-game safety paint replacement.
W,H=2048,1024
Y,X=np.mgrid[0:H,0:W]
u=X/(W-1);v=Y/(H-1)
rng=np.random.default_rng(20261103)
# Aligned to actual B48 longitudinal/lateral coordinates, not camera UV fiction.
joints_u=61;joints_v=29
gx=u*joints_u+.16*np.sin(v*24*pi)
gy=v*joints_v+.12*np.sin(u*19*pi)
tx=np.floor(gx).astype("int32")%joints_u
ty=np.floor(gy).astype("int32")%joints_v
tone=rng.uniform(-.125,.13,(joints_u,joints_v))[tx,ty]
vein=(.37*np.sin(X*.11+6*np.sin(Y*.021))+.16*np.sin(X*.54+Y*.21))
aggregate=rng.normal(0,.031,(H,W))
# Irregular low relief mortar joints; avoid luminous false safety signage.
fracx=np.abs((gx-np.floor(gx))-.5)
fracy=np.abs((gy-np.floor(gy))-.5)
mortar=np.clip((fracx-.472)*32,0,1)+np.clip((fracy-.47)*32,0,1)
mortar=np.clip(mortar,0,1)
shoulder=np.where((v<.12)|(v>.88),1.0,0.0)
center_inset=np.where((v>.36)&(v<.64),1.0,0.0)
# Four distinct construction finishes: a neutral granite center, volcanic
# aggregate shoulders and warm porcelain inlaid flank zones. NO traffic cues.
basis=np.stack((
  .17+.031*vein+tone*.060+aggregate,
  .212+.023*vein+tone*.046+aggregate*.78,
  .226+.027*vein+tone*.055+aggregate*.65),axis=-1)
basis+=shoulder[:,:,None]*np.array([-.06,-.051,-.043])
basis+=center_inset[:,:,None]*np.array([.022,.028,.029])
basis-=mortar[:,:,None]*.055
# Travertine/inlaid texture is restrained and matte, not neon geometry.
warm_bands=((v>.17)&(v<.215))|((v>.785)&(v<.83))
basis[warm_bands,:]+=[.046,.028,.005]
basis=np.clip(basis,.025,.82)
# Directionally anisotropic micro-roughness and slab seams, physically subtle.
rough=np.clip(.72+.10*aggregate+.07*vein+.10*mortar-.13*center_inset,.25,1)
height=(vein*.038+aggregate*.04-.14*mortar).astype("float32")
# Image writes are explicit RGBA for reproducible image SHA and packed .blend.
def img(name,array,noncolor=False):
    ar=np.clip(array,0,1).astype("float32")
    if ar.ndim==2:
        ar=np.stack((ar,ar,ar),axis=-1)
    rgba=np.concatenate((ar,np.ones((H,W,1),dtype="float32")),axis=2)
    image=bpy.data.images.new(name,width=W,height=H,alpha=True,float_buffer=False)
    image.pixels.foreach_set(rgba.ravel())
    if noncolor:
        try:image.colorspace_settings.name="Non-Color"
        except Exception:pass
    image.filepath_raw=os.path.join(out,name+".png")
    image.file_format="PNG";image.save()
    image.pack()
    return image
albedo_img=img("K4BB_2K_ORIGINAL_ROAD_MATERIAL_CANDIDATE_ALBEDO",basis)
rough_img=img("K4BB_2K_ORIGINAL_ROAD_MATERIAL_CANDIDATE_ROUGHNESS",rough,True)
height_img=img("K4BB_2K_ORIGINAL_ROAD_MATERIAL_CANDIDATE_HEIGHT",np.clip(.5+height,0,1),True)
roadmat=material("K4BB | TRUE SOURCE ROAD5 2K UV PBR study; not game",(.18,.22,.24),.06,.69)
nodes=roadmat.node_tree.nodes;links=roadmat.node_tree.links
p=nodes.get("Principled BSDF")
UV=nodes.new("ShaderNodeUVMap");UV.uv_map="K4BB_TRUE_ORIGINAL_B48_DCC_UV"
def tex(im):
    n=nodes.new("ShaderNodeTexImage");n.image=im;n.interpolation="Linear"
    links.new(UV.outputs["UV"],n.inputs["Vector"])
    return n
A=tex(albedo_img);R=tex(rough_img);Hn=tex(height_img)
links.new(A.outputs["Color"],p.inputs["Base Color"])
links.new(R.outputs["Color"],p.inputs["Roughness"])
bump=nodes.new("ShaderNodeBump")
bump.inputs["Strength"].default_value=.22
bump.inputs["Distance"].default_value=.018
links.new(Hn.outputs["Color"],bump.inputs["Height"])
links.new(bump.outputs["Normal"],p.inputs["Normal"])
# The source road is 91x13 top grid and 91x13 underside grid.
# Building a BLENDER UV island does not touch original vertices/index/physics.
topverts=91*13
for mode,obj in objs.items():
    g=obj.data
    assert len(g.vertices)==2*topverts and len(g.polygons)==4728
    uv=g.uv_layers.get("K4BB_TRUE_ORIGINAL_B48_DCC_UV")
    if uv is None:uv=g.uv_layers.new(name="K4BB_TRUE_ORIGINAL_B48_DCC_UV")
    for poly in g.polygons:
        for li in poly.loop_indices:
            vi=g.loops[li].vertex_index%topverts
            uv.data[li].uv=(float(vi//13)/90,float(vi%13)/12)
    assert len(g.materials)>=2
    g.materials[0]=roadmat
    obj["K4BB_SOURCE_VERTEX_UNTOUCHED_UV_AND_PBR_PREVIEW_ONLY"]=True

# Reconstruct actual Road5 coordinates from source tris to anchor architecture.
P=S["modes"]["control"]["mesh"]["positions"]
assert len(P)//3==2*topverts
def lattice(i,j):
    k=3*(i*13+j)
    return Vector((P[k],-P[k+2],P[k+1]))
def sample(u,v):
    u=max(0,min(1,u))*90;v=max(0,min(1,v))*12
    i=min(89,int(u));j=min(11,int(v));a=u-i;b=v-j
    return lattice(i,j)*(1-a)*(1-b)+lattice(i+1,j)*a*(1-b)+lattice(i,j+1)*(1-a)*b+lattice(i+1,j+1)*a*b
def edge(u,side,d,height):
    assert side in (-1,1)
    a=sample(u,0);b=sample(u,1)
    e=(b-a).copy();e.z=0;e.normalize()
    return (a if side==-1 else b)+e*side*d+Vector((0,0,height))
created=[]
def mesh(name,pts,faces,m,coll,role="OFFROAD_ARCH"):
    data=bpy.data.meshes.new(name+" mesh")
    data.from_pydata([tuple(p) for p in pts],[],faces);data.update(calc_edges=True)
    ob=bpy.data.objects.new(name,data);coll.objects.link(ob)
    data.materials.append(m);ob["K4BB_SURVEY_ROLE"]=role;created.append(ob)
    for face in data.polygons:face.use_smooth=True
    return ob
def surface(name,rows,m,coll,thick=0):
    assert len(rows)>1 and len(rows[0])>1 and all(len(x)==len(rows[0]) for x in rows)
    nc=len(rows[0])
    pts=[p for row in rows for p in row]
    fs=[(i*nc+j,(i+1)*nc+j,(i+1)*nc+j+1,i*nc+j+1)
        for i in range(len(rows)-1) for j in range(nc-1)]
    ob=mesh(name,pts,fs,m,coll)
    if thick:
        mod=ob.modifiers.new("architectural section thickness","SOLIDIFY")
        mod.thickness=thick;mod.offset=-1
    return ob
def line(name,pts,m,coll,r=.24):
    c=bpy.data.curves.new(name+" source curve","CURVE")
    c.dimensions="3D";c.bevel_depth=r;c.bevel_resolution=3
    spl=c.splines.new("POLY");spl.points.add(len(pts)-1)
    for p,v in zip(spl.points,pts):p.co=(*v,1)
    ob=bpy.data.objects.new(name,c);coll.objects.link(ob)
    c.materials.append(m);ob["K4BB_SURVEY_ROLE"]="OFFROAD_ARCH";created.append(ob)
    return ob
def lamp(name,pos,power,color,size):
    dat=bpy.data.lights.new(name,"AREA")
    dat.energy=power;dat.color=color;dat.shape="DISK";dat.size=size
    ob=bpy.data.objects.new(name,dat);lamps.objects.link(ob)
    ob.location=pos;ob.rotation_euler=(Vector((0,0,-1))).to_track_quat("-Z","Y").to_euler()
    return ob

# UNIQUE readable public programs rather than another infinite arcade of boxes.
# Each large open lobby is a genuine recessed space with different use:
# MAKERS' MARKET, READING HALL, CIVIC TRANSIT and BOTANICAL EXCHANGE.
# Existing roof is retained, each composition is on actual B48 bank geometry.
programmes=[
  ("MARITIME FOOD HALL",-.86,-1,.726,.794,68,bronze),
  ("READING EXCHANGE",.73,1,.782,.859,69,wood),
  ("PUBLIC MOBILITY GALLERY",.56,-1,.855,.925,70,copper),
  ("BOTANICAL WATER GARDEN",-.41,1,.908,.982,72,green),
]
def programme(name,side,u0,u1,d,feature,design):
    # Outer cavern retains an open front facing the road, not a glazed solid box.
    # True occupied recess with deep walls & THREE real depth planes.
    zbase=4
    open_width=u1-u0
    for u in (u0,u1):
        surface(name+" actual END WALL architectural volume "+str(u),
                [[edge(u,side,d+14,z) for z in (4,11,23,35)],
                 [edge(u,side,d+48,z) for z in (4,11,23,35)]],
                stone,interiors,1.7)
    # Back face is deeply recessed in shadow, nested within K4BA existing podium
    surface(name+" / real deep acoustic back wall",
            [[edge(u0,side,d+48,z) for z in (5,14,31)],
             [edge(u1,side,d+48,z) for z in (5,14,31)]],
            shadow,interiors,1.5)
    # Floor and roof form a visible habitable room, no claim of playable city.
    for z,mat,t in ((4,stone,1.7),(33,copper,2.0)):
        surface(name+" / real architectural "+("floor" if z==4 else "acoustic roof"),
                [[edge(u,side,d+14+(34*j/13),z+2*sin(pi*j/13) if z==33 else z)
                  for j in range(14)]
                 for u in (u0,u1)],mat,interiors,t)
    # Wide entry with substantial frame and distinct street canopy.
    for u in (u0,u0+open_width*.32,u0+open_width*.68,u1):
        line(name+" / open entrance service pier "+str(u),
             [edge(u,side,d+12,4),edge(u,side,d+12,21),
              edge(u,side,d+16,30)],bronze,structure,.9)
    surface(name+" / architectural illuminated canopy with deep facade section",
            [[edge(u,side,d+4+25*j/12,29+8*sin(pi*j/12))
              for j in range(13)]
             for u in (u0-.003,u0,u1,u1+.003)],
            stone,structure,2.3)
    # Four unique service bays with deliberate passage openings.
    for idx in range(10):
        u=u0+(u1-u0)*(idx+.5)/10
        if idx in (2,3,7):continue # CLEAR entrance voids
        line(name+" / true floor-to-ceiling extruded timber sunscreen "+
             str(idx),
             [edge(u,side,d+18,6),edge(u,side,d+18,25)],
             wood,interiors,.48)
        if idx%2:
            line(name+" / illuminated occupation floor line "+str(idx),
                 [edge(u-.001,side,d+31,8),
                  edge(u+.001,side,d+31,8)],amber,interiors,.43)
    # Interior furnishings built as designed 3D systems, not texture-only facades.
    for i in range(5):
        u=u0+open_width*(i+.5)/5
        if design=="MARITIME FOOD HALL":
            # 5 unique countertop food stalls with suspended exhaust canopy.
            surface(name+" / real sculpted counter "+str(i),
                    [[edge(u-.002,side,d+17+j*2.3,10)
                      for j in range(8)],
                     [edge(u+.002,side,d+17+j*2.3,10)
                      for j in range(8)]],wood,detail,1.1)
            line(name+" / suspended warm cooking light "+str(i),
                 [edge(u-.002,side,d+23,23),edge(u+.002,side,d+23,23)],
                 amber,detail,.46)
        elif design=="READING EXCHANGE":
            # tall shelves with actual staggered open niches, not wall texture
            for level in range(3):
                for x in (d+23,d+36):
                    line(name+" / oak open-stack shelf "+str(i)+str(level)+str(x),
                         [edge(u-.002,side,x,7+level*5.2),
                          edge(u+.002,side,x,7+level*5.2)],
                         wood,detail,.34)
            line(name+" / calm open reading table "+str(i),
                 [edge(u,side,d+22,10),edge(u,side,d+34,10)],
                 stone,detail,.54)
        elif design=="PUBLIC MOBILITY GALLERY":
            # floor-level route concierge pods with non-fake traffic markings
            surface(name+" / display accessible transit concourse "+str(i),
                    [[edge(u-.003,side,d+28,z) for z in (11,22)],
                     [edge(u+.003,side,d+28,z) for z in (11,22)]],
                    glazing,detail,.2)
            line(name+" / gold wayfinding architectural fixture "+str(i),
                 [edge(u-.003,side,d+24,25),edge(u+.003,side,d+24,25)],
                 glow_calm,detail,.44)
        else:
            # interior reflecting basins + deep green planters, clearly domestic
            surface(name+" / inhabited botanical planter "+str(i),
                    [[edge(u-.002,side,d+24+2*j,7) for j in range(7)],
                     [edge(u+.002,side,d+24+2*j,7) for j in range(7)]],
                    green,detail,1.1)
            line(name+" / fern exhibit floor lighting "+str(i),
                 [edge(u,side,d+24,10),edge(u,side,d+36,10)],
                 amber,detail,.26)
    # Real warm interior wall wash creates depth from high-speed native Camera.
    for u in (u0+open_width*.19,u0+open_width*.80):
        lamp(name+" / indoor light "+str(u),
             edge(u,side,d+34,28),1250,(1,.75,.50),14)
    return name
for programme in programmes:programme(*programme)
# Separate nonrepeating high visibility architectural moments: giant
# book-lined atrium vs coastal trade hall, not 50 identical prefab shop units.
for side,u,d,level in ((-1,.746,83,53),(1,.824,88,55)):
    rows=[]
    for i in range(37):
        U=u-.022+.044*i/36
        rows.append([edge(U,side,d+40*j/18,
                           level+13*sin(pi*j/18)*sin(pi*i/36))
                     for j in range(19)])
    surface("K4BB SIGNATURE / INHABITED ATRIUM luminous internal acoustic canopy "+
            str(side),rows,wood,structure,1.35)
    for i in (0,8,18,28,36):
        U=u-.022+.044*i/36
        line("K4BB SIGNATURE / amber giant human-scale facade lantern "+str(side)+str(i),
             [edge(U,side,d+4,12),
              edge(U,side,d+4,37),
              edge(U,side,d+12,level+10)],
             bronze,structure,.92)
        line("K4BB SIGNATURE / real amber fixture "+str(side)+str(i),
             [edge(U,side,d+9,33),edge(U,side,d+13,33)],
             amber,structure,.39)

# DCC-only lighting: sun from K4BA stays; slightly cooler outdoor / warmer
# interiors for nighttime city continuity, never replacement for native scene.
world=scene.world
assert world and world.use_nodes
scene.cycles.samples=56
scene.cycles.use_denoising=False
scene.render.resolution_x=1013
scene.render.resolution_y=698
scene.render.resolution_percentage=88
scene.view_settings.exposure=-.12
# Disable expensive source-incompatible studio hidden B51 wireframe falsehood?
# No: preserve all time-exact B51 28 source OBB wire cages, as in K4BA.
def show(mode,tick):
    for k,c in roads.items():c.hide_render=(k!=mode)
    for k,c in proxies.items():c.hide_render=(k!=(mode,tick))
    bpy.context.view_layer.update()
def render(name,camera):
    scene.camera=camera
    scene.render.filepath=os.path.join(out,name)
    bpy.ops.render.render(write_still=True)
shots=[]
for mode in ("control","ultra"):
    for row in S["modes"][mode]["sourceTimeRecords"]:
        tick=row["tick"];show(mode,tick)
        name="K4BB_SOURCE_NUMERIC_DCC_"+mode.upper()+"_"+str(tick)+".png"
        render(name,cams[(mode,tick)])
        shots.append({"mode":mode,"tick":tick,"sourceNativeSeconds":row["sourceNativeSeconds"],
                      "originalSourceScreenshotSHA":row["sourceImageSHA256"],
                      "nativeB51PhysicalOBBCount":28,"dccPNG":name})
assert len(shots)==6
show("control",11278)
# Extra DESIGN CAMERA is deliberately not masquerading as original source camera.
camdata=bpy.data.cameras.new("K4BB interior / human eye non-game")
camdata.lens=27
camera=bpy.data.objects.new("K4BB DESIGN ONLY / civic atrium human-eye",camdata)
art.objects.link(camera)
camera.location=edge(.835,1,51,15)
aim=edge(.833,1,91,20)
camera.rotation_euler=(aim-camera.location).normalized().to_track_quat("-Z","Y").to_euler()
render("K4BB_CIVIC_INTERIOR_HUMAN_EYE_DCC_NOT_GAME.png",camera)
# Preserve prior K4BA artist camera, but it is marked studio not original.
artist=[obj for obj in rig.objects if obj.type=="CAMERA" and "city aerial" in obj.name.lower()]
assert len(artist)==1
render("K4BB_CIVIC_HARBOR_AERIAL_DCC_NOT_GAME.png",artist[0])
show("control",11259)
scene.camera=cams[("control",11259)]
after={mode:digest(obj) for mode,obj in objs.items()}
assert before==after,"TRUE B48 SOURCE GEOMETRY NOT PRESERVED"
assert len(created)>=100,"K4BB did not actually create public interiors"
blend="K4BB_SOURCE_ROAD5_PBR_CIVIC_INTERIORS_EDITABLE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
glb="K4BB_SOURCE_ROAD5_VISUAL_STUDY_DCC_NOT_GAME.glb"
bpy.ops.export_scene.gltf(filepath=os.path.join(out,glb),
                          export_format="GLB",export_cameras=False,export_lights=False)
names=[blend,glb,"K4BB_CIVIC_INTERIOR_HUMAN_EYE_DCC_NOT_GAME.png",
       "K4BB_CIVIC_HARBOR_AERIAL_DCC_NOT_GAME.png"]+[s["dccPNG"] for s in shots]
names+=["K4BB_2K_ORIGINAL_ROAD_MATERIAL_CANDIDATE_"+x+".png" for x in
        ("ALBEDO","ROUGHNESS","HEIGHT")]
checks={}
for fn in names:
    contents=open(os.path.join(out,fn),"rb").read()
    assert len(contents)>1024,fn
    checks[fn]={"bytes":len(contents),"sha256":hashlib.sha256(contents).hexdigest()}
report={
  "schema":"dopagaki.K4BB.original-B48-UV-PBR-inhabited-public-DCC-only/1",
  "originalFrozenGameSourceBlob":"af076d67492a677d2235e4730aef8cdf4808e106",
  "sourceRoadID":"p93-PRISM_CREST-01","sourceRoad5Triangles":4728,
  "sourceRoad5SourcePointsSHA":S["modes"]["control"]["originalRoadSourcePointsSHA256"],
  "originalB48PhysicalRoads":7,"originalB51PhysicalMovers":28,"originalPhysicsHz":240,
  "originalSourceRoadGeometryBefore":before,"originalSourceRoadGeometryAfter":after,
  "sourceB48VerticesAndTopologyUnchanged":True,
  "roadUVAndPBRAreDCCOnlyNotPhysicalSource":True,
  "UVRealTopGridResolution":[91,13],"PBRAtlasPixels":[W,H],
  "sourceB51OriginalOBBSnapshotInstances":168,
  "originalCameraNumericsUnchanged":True,"sourceNumericDCCShots":shots,
  "editableNewPublicObjects":len(created),
  "revisedNewProgrammeNames":[p[0] for p in programmes],
  "roadSourceGameplaySafetyPaintUpdated":False,
  "nativeGameWebGL2Rendered":False,"otherSixB48RoadCollisionClearance":"NOT_TESTED_HOLD",
  "sourceB51VsArchitectureBVH":"NOT_TESTED_HOLD",
  "CCD":"HOLD","HUMAN":"HOLD","FPS":"HOLD","SAT":"HOLD",
  "RELEASE":"HOLD","MERGE":"HOLD",
  "ART":"REJECT_HOLD","formalARTApproved":0,"Slope2DNACertifiedMetres":0,
  "allFiles":checks
}
with open(os.path.join(out,"K4BB_SOURCE_PBR_CIVIC_PROVENANCE.json"),"w") as f:json.dump(report,f,indent=2)
print("K4BB_SOURCE_B48_UV_PBR_NO_PHYSICS_CHANGE_DCC_ONLY_ART_REJECT",json.dumps(
 {"createdPublicObjects":len(created),"PBR":[W,H],"trueCameraRenders":len(shots),"originalSourceProtected":before==after}))
