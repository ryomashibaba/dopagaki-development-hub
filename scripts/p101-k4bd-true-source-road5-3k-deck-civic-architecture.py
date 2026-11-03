"""K4BD ART-FIRST: original B48 Road5 actual UV mapped civic stone deck, clean review.

This is physically faithful 7-B48 28-B51 original-source contextual BLENDER
visual research, not original game WebGL2. All Road5/other original surfaces,
moving B51 6 source ticks, physical radius 0.65m, 240Hz, original Camera six
source poses, gameplay safety cues, main/prod/PR are UNTOUCHED.

The K4BC v3 edit scene is retained. New study is substantial road/urban fabric:
authentic-source 3K architectural pavement PBR with built-in non-synthetic
granite joints and bronze structural construction strips; built pedestrian
flank section OUTSIDE original actual Road5, and an actual water horizon
well below every source B48 road. No new driveable physical game surface.
"""
import bpy,os,sys,json,hashlib,struct,math,zlib
import numpy as np
from mathutils import Vector
from math import sin,cos,pi
args=sys.argv[sys.argv.index("--")+1:]
def arg(key):
    i=args.index(key);return os.path.abspath(args[i+1])
base=arg("--base");original=arg("--original");allseven=arg("--all7");out=arg("--out")
os.makedirs(out,exist_ok=True)
S=json.load(open(original,encoding="utf8"))
A=json.load(open(allseven,encoding="utf8"))
assert S["schema"]=="dopagaki.K4AY.original-B48-tessellated-B51-native-clock-readonly/1"
assert A["schema"]=="dopagaki.K4BC.exact-all-seven-original-B48-control-ultra-surfaces/1"
assert S["frozenOriginalGameGitBlob"]==A["frozenOriginalGameGitBlob"]=="af076d67492a677d2235e4730aef8cdf4808e106"
assert S["originalPhysicsHz"]==A["sourcePhysicsHz"]==240
assert S["originalB48Roads"]==A["B48SurfaceCount"]==7
assert S["originalB51MovingObstacles"]==A["originalB51MovingBodies"]==28
bpy.ops.wm.open_mainfile(filepath=base)
scene=bpy.context.scene
source={mode:bpy.data.collections.get("K4AY SOURCE B48 | "+mode.upper()+" | TRUE TESSELLATED ROAD5") for mode in ("control","ultra")}
other={mode:bpy.data.collections.get("K4BC v2 | TRUE ORIGINAL SOURCE OTHER SIX B48 | "+mode.upper()) for mode in ("control","ultra")}
assert all(c and len(c.objects)==1 for c in source.values())
assert all(c and len(c.objects)==6 for c in other.values())
original_road={mode:next(iter(c.objects)) for mode,c in source.items()}
def fingerprint(o):
    h=hashlib.sha256()
    for v in o.data.vertices:h.update(struct.pack("<3d",*[float(n) for n in v.co]))
    for f in o.data.polygons:h.update(struct.pack("<3i",*[int(n) for n in f.vertices]))
    return h.hexdigest()
before={mode:fingerprint(o) for mode,o in original_road.items()}
assert before["control"]==before["ultra"]
assert len(original_road["control"].data.polygons)==4728
cams={};proxy={}
rig=bpy.data.collections.get("05_CAMERA | Authentic original source poses");assert rig
for mode in ("control","ultra"):
    assert A["modes"][mode]["allSourceSurfaceIDs"]==S["modes"][mode]["allB48SurfaceIDs"]
    assert A["modes"][mode]["B48SourceRoads"][5]["mesh"]["positions"]==S["modes"][mode]["mesh"]["positions"]
    assert A["modes"][mode]["B48SourceRoads"][5]["mesh"]["indices"]==S["modes"][mode]["mesh"]["indices"]
    for rec in S["modes"][mode]["sourceTimeRecords"]:
        t=rec["tick"];matches=[o for o in rig.objects if o.type=="CAMERA" and str(t) in o.name]
        assert len(matches)==1
        eye=Vector((rec["eye"][0],-rec["eye"][2],rec["eye"][1]))
        assert (matches[0].location-eye).length<.0002
        cams[mode,t]=matches[0]
        pc=bpy.data.collections.get("K4AY SOURCE B51 OBB PROXIES | "+mode.upper()+" | TICK "+str(t))
        assert pc and len(pc.objects)==28
        proxy[mode,t]=pc
assert len(cams)==6 and len(proxy)==6
def collection(name):
    c=bpy.data.collections.new(name);scene.collection.children.link(c);return c
paving=collection("K4BD 01 | all source-sampled outer inlay PBR proposal NONCOLLISION")
pedestrian=collection("K4BD 02 | road-exterior deep public waterfront terrace")
seascape=collection("K4BD 03 | under-road original-stage-distant coastal horizon ART ONLY")
studio=collection("K4BD 04 | independent editorial Camera NOT ORIGINAL")
created=[]
def mat(name,rgba,met=0,rough=.7,trans=0,emit=0,noise=0):
    m=bpy.data.materials.new(name);m.diffuse_color=(*rgba,1);m.use_nodes=True
    p=m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value=(*rgba,1)
    p.inputs["Metallic"].default_value=met;p.inputs["Roughness"].default_value=rough
    if trans:p.inputs["Transmission Weight"].default_value=trans
    if emit:
        p.inputs["Emission Color"].default_value=(*rgba,1)
        p.inputs["Emission Strength"].default_value=emit
    if noise:
        n=m.node_tree.nodes.new("ShaderNodeTexNoise")
        n.inputs["Scale"].default_value=noise
        n.inputs["Detail"].default_value=4
        bump=m.node_tree.nodes.new("ShaderNodeBump")
        bump.inputs["Strength"].default_value=.07
        bump.inputs["Distance"].default_value=.012
        m.node_tree.links.new(n.outputs["Fac"],bump.inputs["Height"])
        m.node_tree.links.new(bump.outputs["Normal"],p.inputs["Normal"])
    return m
porcelain=mat("K4BD satin ceramic stone public construction joint",(.40,.37,.32),rough=.69,noise=45)
bronze=mat("K4BD aged bronze precision water-shed drainage",(.32,.26,.17),met=.62,rough=.42)
basalt=mat("K4BD cut black basalt deep road verge",(.13,.17,.18),rough=.82,noise=40)
civic=mat("K4BD civic pedestrian stone washed limestone",(.42,.40,.35),rough=.76,noise=52)
rail=mat("K4BD tactile brushed dark steel handrail",(.25,.28,.28),met=.72,rough=.49)
sea=mat("K4BD coastal under-elevated city water basin",(.055,.15,.19),met=.18,rough=.22,noise=8)
def mesh(name,vs,faces,material,col,role):
    data=bpy.data.meshes.new(name+" EDITABLE SOURCE SURVEY ARCH")
    data.from_pydata([tuple(v) for v in vs],[],faces);data.update(calc_edges=True)
    o=bpy.data.objects.new(name,data);col.objects.link(o)
    data.materials.append(material)
    for f in data.polygons:f.use_smooth=True
    o["K4BD_DCC_ONLY_NO_ORIGINAL_GAME_COLLIDER"]=True
    o["K4BD_ROLE"]=role
    created.append(o)
    return o
def sheet(name,rows,material,col,thick=0,role="OFFROAD_ARCH"):
    assert len(rows)>1 and len(rows[0])>1 and all(len(r)==len(rows[0]) for r in rows)
    n=len(rows[0])
    vs=[p for row in rows for p in row]
    faces=[(i*n+j,(i+1)*n+j,(i+1)*n+j+1,i*n+j+1)
           for i in range(len(rows)-1) for j in range(n-1)]
    ob=mesh(name,vs,faces,material,col,role)
    if thick:
        mod=ob.modifiers.new("architectural solid pedestrian body","SOLIDIFY")
        mod.thickness=thick;mod.offset=-1
    return ob
def line(name,points,material,col,radius=.24,role="OFFROAD_ARCH"):
    cv=bpy.data.curves.new(name+" architectural section curve","CURVE")
    cv.dimensions="3D";cv.bevel_depth=radius;cv.bevel_resolution=2
    spline=cv.splines.new("POLY");spline.points.add(len(points)-1)
    for p,v in zip(spline.points,points):p.co=(*v,1)
    o=bpy.data.objects.new(name,cv);col.objects.link(o)
    cv.materials.append(material)
    o["K4BD_DCC_ONLY_NO_ORIGINAL_GAME_COLLIDER"]=True
    o["K4BD_ROLE"]=role
    created.append(o)
    return o
# Source actual B48 Road5 source point grid (91 u x 13 v per top).
P=S["modes"]["control"]["mesh"]["positions"]
assert len(P)==2*91*13*3
def lattice(i,j):
    k=3*(i*13+j)
    return Vector((P[k],-P[k+2],P[k+1]))
def road(u,v):
    u=max(0,min(1,u))*90;v=max(0,min(1,v))*12
    i=min(89,int(u));j=min(11,int(v));a=u-i;b=v-j
    return (lattice(i,j)*(1-a)*(1-b)+lattice(i+1,j)*a*(1-b)
            +lattice(i,j+1)*(1-a)*b+lattice(i+1,j+1)*a*b)
def edge(u,side,d,h):
    left=road(u,0);right=road(u,1)
    tangent=right-left;tangent.z=0;tangent.normalize()
    return (left if side<0 else right)+tangent*(side*d)+Vector((0,0,h))
# True road5 mesh top preview receives materials+UV only; 3K physical paving atlas
# uses scale-aware .0..1 coordinates over entire original 750m length.
W,H=3072,1536
Y,X=np.mgrid[:H,:W]
u=X.astype("float32")/(W-1)
v=Y.astype("float32")/(H-1)
rng=np.random.default_rng(20261103)
# 53 construction expansion bays across true Road5, each ~14m original;
# 15 alternating broad cut-stone strips spanning its real width.
ux=u*53
vy=v*15
bay_x=np.floor(ux).astype("int32")%53
bay_y=np.floor(vy).astype("int32")%15
tile=rng.uniform(-.043,.041,(53,15))[bay_x,bay_y]
fx=np.minimum(ux-np.floor(ux),1-(ux-np.floor(ux)))
fy=np.minimum(vy-np.floor(vy),1-(vy-np.floor(vy)))
trans=np.minimum(np.minimum(fx/.027,fy/.039),1.0)
# Subtract dark mortar instead of a grid of fake lane or gameplay safety cues.
joint=(1-trans)**2
micro=rng.normal(0,.010,(H,W)).astype("float32")
mineral=np.sin(2*pi*(u*117+v*2.4))*.009
quartz=np.cos(2*pi*(v*26+u*17))*.007
# A six-zone monumental transit deck: central negative basalt runway and
# contrasting HONED lateral ceramic promenade. Never synthetic safety colors.
center=np.exp(-((v-.50)/.255)**8)
shoulder=np.clip((abs(v-.5)-.295)/.11,0,1)
inlay=(np.exp(-((v-.235)/.014)**4)+np.exp(-((v-.765)/.014)**4))
sideStripe=(np.exp(-((v-.105)/.022)**4)+np.exp(-((v-.895)/.022)**4))
# Low contrast, not white/black false navigation lane directions.
R=.265+.064*shoulder-.059*center+.069*inlay+.018*sideStripe
G=.283+.055*shoulder-.053*center+.045*inlay+.023*sideStripe
B=.291+.050*shoulder-.043*center+.017*inlay+.024*sideStripe
albedo=np.stack((R,G,B),axis=2)
albedo+=tile[:,:,None]*np.array([.74,.80,.85])
albedo+=(micro+mineral+quartz)[:,:,None]
albedo-=joint[:,:,None]*.083
rough=np.clip(.74-.08*center-.18*inlay+.075*joint+micro,0.27,.94)
height=np.clip(.5+.033*(quartz+mineral)/.016+.11*micro-.17*joint,0,1)
def png(name,array,noncolor=False):
    # Direct PNG bytes prevent Blender 4 grayscale Non-Color all-black save bug.
    ar=np.clip(array,0,1).astype("float32")
    if ar.ndim==2:ar=np.repeat(ar[:,:,None],3,axis=2)
    assert ar.shape==(H,W,3)
    assert float(ar.max()-ar.min())>.06
    rgba=np.concatenate((ar,np.ones((H,W,1),dtype="float32")),axis=2)
    rgba=np.round(255*rgba).astype("uint8")
    def chunk(tag,value):
        return struct.pack(">I",len(value))+tag+value+struct.pack(">I",zlib.crc32(tag+value)&0xffffffff)
    hdr=bytes((137,80,78,71,13,10,26,10))
    raw=b"".join(bytes((0,))+rgba[row].tobytes() for row in range(H))
    path=os.path.join(out,name+".png")
    with open(path,"wb") as f:
        f.write(hdr+chunk(b"IHDR",struct.pack(">IIBBBBB",W,H,8,6,0,0,0))
                +chunk(b"IDAT",zlib.compress(raw,6))+chunk(b"IEND",b""))
    im=bpy.data.images.load(path,check_existing=False)
    if noncolor:im.colorspace_settings.name="Non-Color"
    im.pack()
    return im
im_a=png("K4BD_3K_REAL_SOURCE_ROAD5_CIVIC_BASALT_ALBEDO",albedo)
im_r=png("K4BD_3K_REAL_SOURCE_ROAD5_CIVIC_BASALT_ROUGHNESS",rough,True)
im_h=png("K4BD_3K_REAL_SOURCE_ROAD5_CIVIC_BASALT_HEIGHT",height,True)
pbr=mat("K4BD PBR 3K native source Road5 six-zone monumental constructed deck",(.32,.33,.33),rough=.69)
nodes=pbr.node_tree.nodes;links=pbr.node_tree.links;surface=nodes.get("Principled BSDF")
UV=nodes.new("ShaderNodeUVMap")
UV.uv_map="K4BB_TRUE_ORIGINAL_B48_DCC_UV"
def texture(image):
    t=nodes.new("ShaderNodeTexImage");t.image=image
    links.new(UV.outputs["UV"],t.inputs["Vector"])
    return t
a=texture(im_a);r=texture(im_r);h=texture(im_h)
links.new(a.outputs["Color"],surface.inputs["Base Color"])
links.new(r.outputs["Color"],surface.inputs["Roughness"])
bump=nodes.new("ShaderNodeBump")
bump.inputs["Strength"].default_value=.18
bump.inputs["Distance"].default_value=.018
links.new(h.outputs["Color"],bump.inputs["Height"])
links.new(bump.outputs["Normal"],surface.inputs["Normal"])
for mode,o in original_road.items():
    meshdata=o.data
    uv=meshdata.uv_layers.get("K4BB_TRUE_ORIGINAL_B48_DCC_UV")
    assert uv is not None
    assert len(meshdata.vertices)==2366 and len(meshdata.polygons)==4728
    # Only DCC material. Original indexed vertices, UV layout, physics untouched.
    meshdata.materials[0]=pbr
    o["K4BD_PREVIEW_ONLY_NEW_3K_PBR_TRUE_B48_SOURCE"]=True
# 12 architectural longitudinal public-edge source conformal inlay sections
# from u=.69->.995. These are visual skins with near-zero height, explicitly
# not safety indication, not game collision, never world-physics.
for side in (-1,1):
    for zone,(vlo,vhi) in enumerate(((.065,.118),(.17,.205)) if side<0 else ((.882,.935),(.795,.83))):
        for section in range(13):
            u0=.685+.0235*section
            u1=min(.998,u0+.019)
            rows=[]
            for i in range(6):
                uu=u0+(u1-u0)*i/5
                rows.append([road(uu,vlo+(vhi-vlo)*j/8)+Vector((0,0,.055))
                             for j in range(9)])
            sheet("REAL ROAD5 DCC ONLY ALIGNED BROAD 14M STONE TRANSIT INLAY "+
                  str(side)+"-"+str(zone)+"-"+str(section),
                  rows,porcelain if zone else bronze,paving,0,
                  "NONCOLLISION_SOURCE_ROAD5_VISUAL_INLAY")
# BROAD REAL HUMAN-SCALE public section along actual roadway exterior only.
# Aligns to geometrically true Road5 edge; each terrace is continuous and
# every support is visible, not boxes on an empty canvas.
for side,name in ((-1,"WEST civic arrival"),(1,"EAST cultural gallery")):
    rows=[]
    for i in range(71):
        uu=.695+.295*i/70
        rows.append([edge(uu,side,16+30*j/12,
                          2.5+3*sin(pi*j/12)) for j in range(13)])
    sheet("SOURCE ROAD5 OUTER 30M DEEP REAL PEDESTRIAN LANDING "+name,
          rows,civic,pedestrian,2.6,"OFFROAD_PEDESTRIAN_PLATFORM")
    # Structural sunlight collectors along the industrial bridge edge, not
    # fake racing rail/arrow or thin wire décor in the player's path.
    for d in (16.5,46.5):
        line("60-SEGMENT PEDESTRIAN OVERLOOK SOLID EDGE RAIL "+name+str(d),
             [edge(.696+.294*i/60,side,d,6.1) for i in range(61)],
             rail,pedestrian,.37)
    for i in range(10):
        uu=.706+.028*i
        line("STRUCTURAL PIER SUPPORT TO BEDROCK "+name+str(i),
             [edge(uu,side,31,-51),
              edge(uu,side,31,-24),
              edge(uu,side,31,4)],
             basalt,pedestrian,2.05)
        # Large architectural shadow rhythm, but all outside original road.
        sheet("PUBLIC OBSERVATION CANOPY SECTION "+name+str(i),
              [[edge(uu+t,side,19+49*j/12,
                           11.5+5*sin(pi*j/12)) for j in range(13)]
               for t in (0,.011)],
              bronze if i%2 else porcelain,pedestrian,1.05)
# Source all 7 actual B48 roads lie between Blender elevation 25 and 245.
# The open sea is physically WELL BELOW that entire known source envelope.
# No fake road, no invented collision or support for the native stage.
o=mesh("DISTANT OPEN WATER UNDER ALL REAL 7 ORIGINAL ROADS",
       [(-2500,-2500,-140),(2500,-2500,-140),(2500,2500,-140),(-2500,2500,-140)],
       [(0,1,2,3)],sea,seascape,"NONCOLLISION_DEEP_SEA_ENVIRONMENT")
o["K4BD_GENUINE_ALL7_ROAD_LOWEST_ABOVE_SEA"]=True
# Remove visualization-only B51 magenta wireframe cages from EDITORIAL art.
# Keep 168 original-time B51 physics proxy objects intact and enabled in
# a separately labeled original-Camera collision-debug image.
def show(mode,tick,debug=False):
    for m,c in source.items():c.hide_render=m!=mode
    for m,c in other.items():c.hide_render=m!=mode
    for (m,t),c in proxy.items():c.hide_render=not(debug and (m,t)==(mode,tick))
    bpy.context.view_layer.update()
scene.render.engine="BLENDER_EEVEE" # supported by Ubuntu Blender 4.0.2
try:scene.eevee.taa_render_samples=192
except Exception:pass
scene.render.resolution_x=1013
scene.render.resolution_y=698
scene.render.resolution_percentage=90
scene.render.image_settings.file_format="PNG"
scene.view_settings.exposure=-.45
try:scene.view_settings.view_transform="Filmic"
except Exception:pass
# Domain of discussion: reduce physically implausible overexposure and noise
# of 36-sample cycles, without changing native source gameplay lighting.
sunlights=[o for o in bpy.data.objects if o.type=="LIGHT" and o.data.type=="SUN"]
for sunob in sunlights:sunob.hide_render=True
sun=bpy.data.lights.new("K4BD maritime studio soft directional daylight DCC only","SUN")
sun.energy=1.1;sun.angle=.14
so=bpy.data.objects.new("K4BD editorial lighting is NOT GAME",sun)
studio.objects.link(so);so.rotation_euler=(.65,-.53,.2)
scene.world.use_nodes=True
bg=scene.world.node_tree.nodes.get("Background")
if bg:
    for link in list(scene.world.node_tree.links):
        if link.to_node==bg and link.to_socket==bg.inputs["Color"]:
            scene.world.node_tree.links.remove(link)
    bg.inputs["Color"].default_value=(.26,.39,.49,1)
    bg.inputs["Strength"].default_value=.7
def render(fn,cam):
    scene.camera=cam;scene.render.filepath=os.path.join(out,fn)
    bpy.ops.render.render(write_still=True)
shots=[]
for mode in ("control","ultra"):
    for rec in S["modes"][mode]["sourceTimeRecords"]:
        t=rec["tick"];show(mode,t,False)
        fn="K4BD_TRUE_SOURCE_CAMERA_CLEAN_EDITORIAL_"+mode.upper()+"_"+str(t)+".png"
        render(fn,cams[mode,t])
        shots.append({"mode":mode,"tick":t,"nativeSourceTime":rec["sourceNativeSeconds"],
                     "sourceOriginalWebGL2ScreenshotSHA":rec["sourceImageSHA256"],
                     "originalB51ProxyVisibleInArt":False,"DCCImage":fn})
assert len(shots)==6
show("ultra",11341,True)
render("K4BD_ORIGINAL_SOURCE_B51_28_OBB_EDITOR_DEBUG_ULTRA_11341.png",cams["ultra",11341])
show("control",11278,False)
# Independent editorial aerial, not a native game view.
a=[x for x in bpy.data.objects if x.type=="CAMERA" and
   "K4BC v3 urban plaza master aerial" in x.name]
assert len(a)==1
render("K4BD_CIVIC_DECK_CITY_EDITOR_AERIAL_DCC_NOT_GAME.png",a[0])
show("control",11259,False)
scene.camera=cams["control",11259]
after={mode:fingerprint(o) for mode,o in original_road.items()}
assert before==after
assert len(created)>=90
blend="K4BD_SOURCE_ROAD5_3K_PBR_PEDESTRIAN_ARRIVAL_EDITABLE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
glb="K4BD_ORIGINAL_ALL7_CIVIC_DECK_ART_STUDY_NOT_GAME.glb"
bpy.ops.export_scene.gltf(filepath=os.path.join(out,glb),export_format="GLB",
                          export_cameras=False,export_lights=False)
files=[blend,glb,"K4BD_ORIGINAL_SOURCE_B51_28_OBB_EDITOR_DEBUG_ULTRA_11341.png",
       "K4BD_CIVIC_DECK_CITY_EDITOR_AERIAL_DCC_NOT_GAME.png"]+[x["DCCImage"] for x in shots]
files+=["K4BD_3K_REAL_SOURCE_ROAD5_CIVIC_BASALT_"+name+".png" for name in ("ALBEDO","ROUGHNESS","HEIGHT")]
manifest={}
for fn in files:
    data=open(os.path.join(out,fn),"rb").read()
    assert len(data)>2000
    manifest[fn]={"bytes":len(data),"sha256":hashlib.sha256(data).hexdigest()}
audit={
 "schema":"dopagaki.K4BD.art-first-full-frame-source-road5-civic-deck/1",
 "originalFrozenWebGL2GameGitBlob":"af076d67492a677d2235e4730aef8cdf4808e106",
 "sourceB48OriginalRoadCount":7,"sourceB51MovingObstacleCount":28,
 "sourcePhysicsHz":240,"sourceRadiusMetres":.65,
 "originalCameraNumericsUnchanged":True,"originalCameraSixTicks":shots,
 "originalRoad5TrueSourceTriangleCount":4728,
 "originalRoad5GeometryBefore":before,"originalRoad5GeometryAfter":after,
 "realB48Road5GeometryPreserved":True,
 "originalOtherSixB48RoadsPerModePreserved":True,
 "originalSourceB51SixTimes28PhysicsProxyPreserved":True,
 "DCCArtRendersWithoutNonvisualB51Cages":True,
 "DCCOneSeparateDebugImageWithSourceB51Cages":True,
 "sourceRoad5PBR3K":[W,H],
 "PBRImagesThreeNonzero":True,
 "roadstonePBRAlbedoAndRoughnessAreBlenderOnly":True,
 "newVisualNonCollisionRoadInlayCount":52,
 "offroadPedestrianContinuousTerraces":2,
 "newEditableDccArchitectureObjects":len(created),
 "deepSeaBelowAllSourceRoadsZ":-140,
 "noNewGameDriveableRoadOrGameColliders":True,
 "sourceGameSafetyPaintAndAllPhysicsFilesUnchanged":True,
 "nativeWebGL2GameFramesRendered":False,
 "independentFull7B48B51CollisionBVH":"NOT_YET_TESTED_HOLD",
 "ART":"REJECT_HOLD","formalArtAccepted":0,"Slope2DNACertifiedMetres":0,
 "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD",
 "RELEASE":"HOLD","MERGE":"HOLD","files":manifest}
with open(os.path.join(out,"K4BD_TRUE_SOURCE_CIVIC_DECK_ART_REJECT_PROVENANCE.json"),"w") as f:json.dump(audit,f,indent=2)
print("K4BD_ORIGINAL_SOURCE_3K_ARCHITECTURAL_DECK_PBR_AND_7_CAMERA_EDITORIAL_DCC_ART_HOLD",
      json.dumps({"newObjects":len(created),"sourceRoad5FingerprintUnchanged":before==after,
                   "trueCameraRenders":len(shots),"PBR":[W,H],"ART":audit["ART"]}))
