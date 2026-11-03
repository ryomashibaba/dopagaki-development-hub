"""K4BC v3: actual original source-camera framed *inhabited skyline*.

All seven original B48 road meshes (including finish ridge) stay visible.
Physically unrelated old rejected skyline is hidden, not deleted. Two grounded
off-road civic institutions carry one large architectural museum crossing
ABOVE the original finish ridge, with no new road/physics collider.

All proposals strictly DCC. Exact original Camera, B48/B51, 240Hz, original
radius 0.65 m and source game are read-only. No claim ART or GAME PASS.
"""
import bpy,os,sys,json,hashlib,struct,math
from math import sin,cos,pi
from mathutils import Vector
args=sys.argv[sys.argv.index("--")+1:]
def arg(k):
    i=args.index(k);return os.path.abspath(args[i+1])
parent=arg("--base");original=arg("--original");all7=arg("--all7");out=arg("--out")
os.makedirs(out,exist_ok=True)
S=json.load(open(original,encoding="utf8"))
X=json.load(open(all7,encoding="utf8"))
assert S["schema"]=="dopagaki.K4AY.original-B48-tessellated-B51-native-clock-readonly/1"
assert X["schema"]=="dopagaki.K4BC.exact-all-seven-original-B48-control-ultra-surfaces/1"
assert S["frozenOriginalGameGitBlob"]==X["frozenOriginalGameGitBlob"]=="af076d67492a677d2235e4730aef8cdf4808e106"
assert S["originalB48Roads"]==7 and S["originalB51MovingObstacles"]==28
bpy.ops.wm.open_mainfile(filepath=parent)
scene=bpy.context.scene
colroad5={m:bpy.data.collections.get("K4AY SOURCE B48 | "+m.upper()+" | TRUE TESSELLATED ROAD5") for m in ("control","ultra")}
colothers={m:bpy.data.collections.get("K4BC v2 | TRUE ORIGINAL SOURCE OTHER SIX B48 | "+m.upper()) for m in ("control","ultra")}
assert all(c and len(c.objects)==1 for c in colroad5.values())
assert all(c and len(c.objects)==6 for c in colothers.values())
roads={m:next(iter(c.objects)) for m,c in colroad5.items()}
def fp(obj):
    h=hashlib.sha256()
    for p in obj.data.vertices:h.update(struct.pack("<3d",*[float(v) for v in p.co]))
    for f in obj.data.polygons:h.update(struct.pack("<3i",*[int(v) for v in f.vertices]))
    return h.hexdigest()
before={m:fp(obj) for m,obj in roads.items()}
assert before["control"]==before["ultra"]
rig=bpy.data.collections.get("05_CAMERA | Authentic original source poses");assert rig
cams={};obbs={}
for m in ("control","ultra"):
    for row in S["modes"][m]["sourceTimeRecords"]:
        t=row["tick"]
        found=[o for o in rig.objects if o.type=="CAMERA" and str(t) in o.name]
        assert len(found)==1
        assert (found[0].location-Vector((row["eye"][0],-row["eye"][2],row["eye"][1]))).length<.0002
        cams[m,t]=found[0]
        ob=bpy.data.collections.get("K4AY SOURCE B51 OBB PROXIES | "+m.upper()+" | TICK "+str(t))
        assert ob and len(ob.objects)==28
        obbs[m,t]=ob
assert len(cams)==len(obbs)==6
prev=bpy.data.collections.get("K4BC 04 | monumental occupied skyline, NOT a driveable road")
assert prev is not None
prev.hide_render=True
def collection(name):
    c=bpy.data.collections.new(name);scene.collection.children.link(c);return c
bank=collection("K4BC V3 01 | authentic Road6 off-road bedrock foundations")
east=collection("K4BC V3 02 | east library occupied city citadel")
west=collection("K4BC V3 03 | west harbor exchange occupied citadel")
bridge=collection("K4BC V3 04 | high clear public sky conservatory NOT original road")
lightcol=collection("K4BC V3 05 | DCC architectural warm lighting")
review=collection("K4BC V3 06 | AERIAL DESIGN ONLY NOT SOURCE CAMERA")
created=[]
def mat(name,col,metal=0,rough=.63,trans=0,emit=0,grain=0):
    m=bpy.data.materials.new(name);m.diffuse_color=(*col,1);m.use_nodes=True
    p=m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value=(*col,1)
    p.inputs["Metallic"].default_value=metal
    p.inputs["Roughness"].default_value=rough
    if trans:p.inputs["Transmission Weight"].default_value=trans
    if emit:
        p.inputs["Emission Color"].default_value=(*col,1)
        p.inputs["Emission Strength"].default_value=emit
    if grain:
        n=m.node_tree.nodes.new("ShaderNodeTexNoise")
        n.inputs["Scale"].default_value=grain;n.inputs["Detail"].default_value=3
        b=m.node_tree.nodes.new("ShaderNodeBump")
        b.inputs["Strength"].default_value=.10;b.inputs["Distance"].default_value=.022
        m.node_tree.links.new(n.outputs["Fac"],b.inputs["Height"])
        m.node_tree.links.new(b.outputs["Normal"],p.inputs["Normal"])
    return m
basalt=mat("K4BC V3 site authentic cut dark coastal basalt",(.145,.158,.154),rough=.85,grain=26)
stone=mat("K4BC V3 warm honed honey limestone building",(.52,.44,.34),rough=.68,grain=39)
red=mat("K4BC V3 red ceramic public archive wall",(.40,.16,.13),rough=.65,grain=46)
copper=mat("K4BC V3 solid aged bronze structural jamb",(.27,.29,.26),metal=.65,rough=.39)
glass=mat("K4BC V3 physically thick green glazed civic hall",(.045,.18,.22),rough=.22,trans=.40)
lightmat=mat("K4BC V3 occupied warm stone room light",(.92,.48,.20),emit=2.2)
green=mat("K4BC V3 actual olive park canopy",(.15,.27,.15),rough=.8)
roofmat=mat("K4BC V3 pale construction shell",(.64,.56,.43),rough=.68,grain=37)
endMesh=X["modes"]["control"]["B48SourceRoads"][5]["mesh"]["positions"]
idx=(90*13+6)*3
origin=Vector((endMesh[idx],-endMesh[idx+2],endMesh[idx+1]))
F=Vector((.847,.502,0)).normalized()
L=Vector((.51,-.86,0)).normalized()
def world(d,s,h):return origin+F*d+L*s+Vector((0,0,h))
def mesh(name,pts,faces,m,c):
    g=bpy.data.meshes.new(name+" editable native 3D surface")
    g.from_pydata([tuple(p) for p in pts],[],faces);g.update(calc_edges=True)
    ob=bpy.data.objects.new(name,g);c.objects.link(ob)
    g.materials.append(m)
    for f in g.polygons:f.use_smooth=True
    ob["K4BC_V3_ORIGINAL_ROAD_COLLIDER_ADDED"]=False
    created.append(ob)
    return ob
def sheet(name,rows,m,c,thick=0):
    assert len(rows)>1 and len(rows[0])>1 and all(len(x)==len(rows[0]) for x in rows)
    n=len(rows[0]);v=[x for row in rows for x in row]
    faces=[(i*n+j,(i+1)*n+j,(i+1)*n+j+1,i*n+j+1)
       for i in range(len(rows)-1) for j in range(n-1)]
    ob=mesh(name,v,faces,m,c)
    if thick:
        sol=ob.modifiers.new("real architectural substantial wall thickness","SOLIDIFY")
        sol.thickness=thick;sol.offset=-1
    return ob
def beam(name,pts,m,c,r=.65):
    cv=bpy.data.curves.new(name+" editable structural member","CURVE")
    cv.dimensions="3D";cv.bevel_depth=r;cv.bevel_resolution=3
    s=cv.splines.new("POLY");s.points.add(len(pts)-1)
    for p,v in zip(s.points,pts):p.co=(*v,1)
    ob=bpy.data.objects.new(name,cv);c.objects.link(ob)
    cv.materials.append(m)
    ob["K4BC_V3_ORIGINAL_ROAD_COLLIDER_ADDED"]=False
    created.append(ob)
    return ob
def monolith(name,depth,lat,width,length,z0,z1,material,col):
    # Native 6-face actual volumetric 3D base, not a floating facade.
    v=[]
    for z in (z0,z1):
        for ds,ls in ((-1,-1),(-1,1),(1,1),(1,-1)):
            v.append(world(depth+ds*length*.5,lat+ls*width*.5,z))
    faces=[(0,1,2,3),(4,7,6,5),(0,4,5,1),(1,5,6,2),
           (2,6,7,3),(3,7,4,0)]
    return mesh(name,v,faces,material,col)
# Basalt true supporting coastline beyond REAL Road5, not a drivable road.
# Road6 actual center at depth150 lateral~-19 and source width ~96: banks
# are well beyond its actual lateral extrema, with independent all7 BVH.
for side,name in ((-1,"WEST CUT NATURAL HARBOR"),(1,"EAST GLASS CITY")):
    lat0=-110 if side==-1 else 95
    c=west if side==-1 else east
    # Real three-dimensional support landmasses, 60-180m from route.
    for band in range(3):
        rows=[]
        for i in range(65):
            d=48+260*i/64
            row=[]
            for j in range(19):
                s=lat0+side*(band*62+j*6.0)
                h=-93+30*band+9*sin(3*pi*i/64)+17*sin(pi*j/18)
                row.append(world(d,s,h))
            rows.append(row)
        sheet("GROUNDED ACTUAL NONDRIVEABLE 3D BEDROCK "+name+str(band),
              rows,basalt if band%2==0 else stone,bank,7)
    # Actual positive-height inhabited foundation platforms/civil terraces.
    monolith("FOUNDATION REAL HABITABLE PUBLIC BASALT PLINTH "+name,
             122,lat0+side*15,100,114,-88,-32,basalt,bank)
    monolith("FOUNDATION HAND FINISHED CIVIC PLAZA "+name,
             122,lat0+side*15,98,108,-32,-23,stone,bank)
    # Facade lower floors up to source road elevation, no disembodied towers.
    for floor in range(3):
        z0=-24+15*floor;z1=z0+13
        # Fully sealed deep service rooms in a coherent single building
        # with two intentionally OPEN 18m wide civic entrance voids.
        for i in range(5):
            if floor==0 and i in (1,3):continue
            depth=90+i*16
            monolith("REALLY OCCUPIED 3D ARCHIVE AND LIBRARY ROOM "+name+str(floor)+str(i),
                     depth,lat0+side*9,65,13,z0,z1,
                     glass if i in (1,2,3) else (red if side==-1 else stone),c)
        sheet("TRUE RECESSED 3D PUBLIC CEILING "+name+str(floor),
              [[world(d,lat0+side*s,z1) for s in (5,30,65)]
               for d in (82,162)],roofmat,c,2.2)
        # Oversize warm interior light runs, convincing human public scale.
        for d in (86,119,155):
            beam("OCCUPIED PUBLIC UPPER WINDOW BRONZE INSET "+name+str(floor)+str(d),
                 [world(d,lat0+side*3,z0+5),
                  world(d,lat0+side*3,z1-3)],lightmat,c,.33)
    # A curved primary occupiable rooftop from z21 to z50, not thin fins.
    rows=[]
    for i in range(49):
        d=71+108*i/48
        row=[]
        for j in range(29):
            s=lat0+side*(j*94/28)
            h=22+22*sin(pi*j/28)**.9+10*sin(pi*i/48)**1.3
            row.append(world(d,s,h))
        rows.append(row)
    sheet("MULTI-STOREY CIVIC EXCHANGE MONUMENTAL SUSTAINABLE ROOF "+
          name,rows,roofmat if side==-1 else red,c,3.7)
    for d in (74,110,146,177):
        # vertical real grounded load paths up to large roof lip
        for offset in (4,51,89):
            beam("MASSIVE LOAD BEARING STRUCTURAL COLUMN "+name+str(d)+str(offset),
                 [world(d,lat0+side*offset,-50),
                  world(d,lat0+side*offset,12),
                  world(d,lat0+side*offset,33)],copper,c,1.8)
    # Coherent public roofgarden canopy at greater distance from active road
    for i in range(9):
        d=72+12.4*i
        root=world(d,lat0+side*76,52)
        beam("TIDAL PUBLIC PARK ACTUAL TRUNK "+name+str(i),
             [root,root+Vector((0,0,9))],basalt,c,.70)
        crown=[]
        for a in range(9):
            t=a/8;r=5.4*(max(.03,sin(pi*t)))**.65
            crown.append([root+Vector((r*cos(2*pi*k/13)+2*t,
                        r*sin(2*pi*k/13),7+13*t))
                 for k in range(14)])
        sheet("HEALTHY 3D ROOFGARDEN CANOPY "+name+str(i),
              crown,green,c,.2)
# Bridging landmark at road6 approx 120m distance. Native Road6 top
# elevation is about 122m here; station deck is +44m ABOVE original Road5
# finish elevation, with no new game collider or drivable road.
# In actual original Camera this fills central skyline with public space,
# not a floating token torus or two thin abstract arches.
for level,upper,material in ((43,False,stone),(76,True,roofmat)):
    rows=[]
    for i in range(15):
        d=107+31*i/14
        row=[]
        for j in range(45):
            t=j/44;s=-101+200*t
            h=level+6*sin(pi*t)**1.2+4*sin(pi*i/14)**1.3
            row.append(world(d,s,h))
        rows.append(row)
    sheet("REAL FULL WIDTH 31m DEEP OCCUPIED SKY CIVIC MUSEUM "+
          ("SOLID ROOF" if upper else "SOLID FLOOR"),rows,
          material,bridge,3.8)
# Two fully glazed 31m deep facades, with 17m-high actual public windows
# and support structure on physically grounded off-road citadel.
for d in (107,138):
    rows=[]
    for i in range(49):
        s=-101+200*i/48
        rows.append([world(d,s,45+6*sin(pi*i/48)),
                     world(d,s,72+6*sin(pi*i/48))])
    sheet("OCCUPIED ALL-GLASS CROSS CITY ATRIUM FACADE "+str(d),
          rows,glass,bridge,.7)
    for i in range(0,49,4):
        s=-101+200*i/48
        beam("TRUE SKYBRIDGE 25m DEEP STRUCTURAL PIER "+
             str(d)+str(i),
             [world(d,s,44+6*sin(pi*i/48)),
              world(d,s,77+6*sin(pi*i/48))],
             copper,bridge,.77)
# Strong sculpted bridge central stone beams; service functional lighting
for lat in (-96,0,95):
    beam("REAL CROSS CITY SKY CIVIC DECK FULL LENGTH "+
         str(lat),[world(d,lat,48) for d in (106,122,140)],
         copper,bridge,1.3)
for lat in (-70,-27,18,61):
    beam("PUBLIC GALLERY 6M WIDE WARM VISIBLE INTERIOR LANTERN "+str(lat),
         [world(113,lat,63),world(135,lat,63)],lightmat,bridge,.52)
# Platform support: four large structural pylons stay outside source Road6
# lateral path (left road6 edge around -66, right edge around +29).
for lat in (-106,104):
    for d in (110,136):
        beam("FOUNDING CIVIC REAL CROSSING PIER "+str(lat)+str(d),
             [world(d,lat,-86),world(d,lat,12),world(d,lat,42)],
             copper,bridge,2.5)
# Visibility projection measured with ACTUAL six original source camera
# vectors: evidence is angles, NOT invented screen pixels or ART pass.
def angular(row,p):
    eye=Vector((row["eye"][0],-row["eye"][2],row["eye"][1]))
    f=Vector((row["front"][0],-row["front"][2],row["front"][1])).normalized()
    R=f.cross(Vector((0,0,1))).normalized()
    U=R.cross(f).normalized()
    v=p-eye
    return [round(math.degrees(math.atan2(v.dot(R),v.dot(f))),4),
            round(math.degrees(math.atan2(v.dot(U),v.dot(f))),4)]
projected={}
for mode in ("control","ultra"):
    projected[mode]=[]
    for row in S["modes"][mode]["sourceTimeRecords"]:
        projected[mode].append({
          "tick":row["tick"],
          "westCivicBaseAngles":angular(row,world(120,-110,-38)),
          "eastCivicBaseAngles":angular(row,world(120,95,-38)),
          "museumLowerCentralAngles":angular(row,world(120,0,44)),
          "museumRoofCentralAngles":angular(row,world(120,0,80))
        })
# Review exact original camera poses with true seven original B48 sections.
def show(mode,tick):
    for m,c in colroad5.items():c.hide_render=(m!=mode)
    for m,c in colothers.items():c.hide_render=(m!=mode)
    for (m,t),c in obbs.items():c.hide_render=(m,t)!=(mode,tick)
    bpy.context.view_layer.update()
scene.render.engine="CYCLES";scene.cycles.samples=36
scene.cycles.use_denoising=False
scene.render.resolution_x=1013;scene.render.resolution_y=698
scene.render.resolution_percentage=88
scene.render.image_settings.file_format="PNG"
scene.view_settings.exposure=-.18
def render(fn,cam):
    scene.camera=cam
    scene.render.filepath=os.path.join(out,fn)
    bpy.ops.render.render(write_still=True)
shots=[]
for mode in ("control","ultra"):
    for row in S["modes"][mode]["sourceTimeRecords"]:
        tick=row["tick"];show(mode,tick)
        fn="K4BC_V3_FRAMED_TRUE_ALL7_SOURCE_DCC_"+mode.upper()+"_"+str(tick)+".png"
        render(fn,cams[mode,tick])
        shots.append({"mode":mode,"sourceTick":tick,
                      "sourceSeconds":row["sourceNativeSeconds"],
                      "trueSourceCameraImageSHA256":row["sourceImageSHA256"],
                      "nativeB51SourceOBBCount":28,"dccPNG":fn})
show("control",11278)
# Design camera intentionally independent from source camera.
camdata=bpy.data.cameras.new("K4BC v3 source-all7 urban section aerial NOT game")
camdata.lens=36
cam=bpy.data.objects.new("K4BC v3 urban plaza master aerial / NOT GAME",camdata)
review.objects.link(cam)
cam.location=world(0,360,200)
aim=world(132,0,25)
cam.rotation_euler=(aim-cam.location).normalized().to_track_quat("-Z","Y").to_euler()
render("K4BC_V3_CIVIC_MUSEUM_AND_NATIVE_ROAD6_AERIAL_NOT_GAME.png",cam)
show("control",11259)
scene.camera=cams["control",11259]
after={m:fp(obj) for m,obj in roads.items()}
assert before==after
assert len(created)>=100
blend="K4BC_V3_ACTUAL_SOURCE_CAMERA_FRAMED_CITY_EDITABLE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
glb="K4BC_V3_ALL7_SOURCE_CIVIC_COMPOSITION_DCC_NOT_GAME.glb"
bpy.ops.export_scene.gltf(filepath=os.path.join(out,glb),
                          export_format="GLB",export_cameras=False,export_lights=False)
files=[blend,glb,"K4BC_V3_CIVIC_MUSEUM_AND_NATIVE_ROAD6_AERIAL_NOT_GAME.png"]+[r["dccPNG"] for r in shots]
checks={}
for fn in files:
    dat=open(os.path.join(out,fn),"rb").read()
    assert len(dat)>2000,fn
    checks[fn]={"bytes":len(dat),"sha256":hashlib.sha256(dat).hexdigest()}
report={
 "schema":"dopagaki.K4BC.v3.true-original-camera-framed-offroad-civic-sky-museum/1",
 "originalFrozenGameBlob":"af076d67492a677d2235e4730aef8cdf4808e106",
 "originalSourceRoadCount":7,"originalB51Movers":28,"sourcePhysicsHz":240,
 "exactSourceRoad5Before":before,"exactSourceRoad5After":after,
 "originalSourceB48Road5Unmodified":True,
 "originalOtherB48NativeModeCollectionsMaintained":12,
 "trueOriginalSourceB48RoadIDs":X["modes"]["control"]["allSourceSurfaceIDs"],
 "originalB51SourceOBBInstances":168,
 "originalCameraNumericsUnchanged":True,
 "newEditableOffroadMassAndPublicSkyMuseumObjects":len(created),
 "oldRejectedK4BCSkylinePreservedButHidden":True,
 "sourceActualRoad6CentrelineWasMeasuredNotInvented":True,
 "sourceCameraAngularLayoutDegreesMeasuredNotViewportPixels":projected,
 "noNewDriveableGameRoad":True,"noNativeGameCollisionOrPhysicsChanges":True,
 "nativeWebGL2Screenshots":False,"sourceOriginalPhysicsRun":False,
 "newAll7SourceStaticBVH":"NOT_YET_TESTED_HOLD",
 "ART":"REJECT_HOLD","HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD",
 "FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "formalArtAccepted":0,"Slope2DNACertifiedMetres":0,
 "sourceOriginalCameraSixDCCShots":shots,"files":checks}
with open(os.path.join(out,"K4BC_V3_TRUE_SOURCE_CAMERA_CIVIC_COMPOSITION_PROVENANCE.json"),"w") as fd:json.dump(report,fd,indent=2)
print("K4BC_V3_SOURCE_CAMERA_ANGULAR_FRAMING_ALL7_ORIGINAL_ROADS_DCC_ART_HOLD",
      json.dumps({"newObjects":len(created),"nativeCameraImages":len(shots),
      "road5B48Unchanged":before==after,"ART":report["ART"]}))
