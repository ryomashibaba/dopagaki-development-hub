"""
K4AX — AUTHORED Blender civic exchange, one art-first Road5 HERO district.

This is a true, independently editable DCC source file and non-game preview.
It is NOT a native 240Hz game frame, not collision-safe, and NOT ART PASS.
Cameras come from SHA-grounded actual Road5 ball-lock source (K4AV Artifact).
Blender axes use (webX,-webZ,webY), original perspective vertical 1.35.
"""
import bpy, sys, json, os, math, hashlib
from math import sin,cos,pi
from mathutils import Vector

args=sys.argv[sys.argv.index("--")+1:]
def arg(name):
    i=args.index(name)
    return args[i+1]
ref_path=os.path.abspath(arg("--cameras"))
out=os.path.abspath(arg("--output"))
os.makedirs(out,exist_ok=True)
data=json.load(open(ref_path,encoding="utf8"))
assert data["schema"]=="dopagaki.K4AX.source-true-road5-camera-reference/1"
assert data["evidenceSource"]["sourceBlob"]=="af076d67492a677d2235e4730aef8cdf4808e106"
assert data["evidenceSource"]["originalB48Roads"]==7
assert data["evidenceSource"]["originalB51MovingObstacles"]==28
assert data["evidenceSource"]["gamePhysicsHz"]==240
shots=[r for r in data["records"] if r["mode"]=="control"]
assert [s["tick"] for s in shots]==[11259,11278,11307]

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
for material in list(bpy.data.materials):
    bpy.data.materials.remove(material)
scene=bpy.context.scene
scene.render.engine="CYCLES"
scene.cycles.samples=18
scene.cycles.use_denoising=True
scene.render.resolution_x=1013
scene.render.resolution_y=698
scene.render.resolution_percentage=88
scene.render.image_settings.file_format="PNG"
scene.render.film_transparent=False
try:scene.view_settings.view_transform="AgX"
except Exception:scene.view_settings.view_transform="Filmic"
scene.view_settings.look="Medium High Contrast" if "Medium High Contrast" in [
 e.identifier for e in scene.view_settings.bl_rna.properties["look"].enum_items] else "Medium High Contrast"
scene.render.image_settings.color_mode='RGBA'

def collection(name):
    c=bpy.data.collections.new(name)
    scene.collection.children.link(c)
    return c
hero=collection("01_HERO | Tidal Exchange Hall - editable architecture")
site=collection("02_SITE | Source-camera context, NOT original collision")
detail=collection("03_DETAIL | Human-scale public uses")
city=collection("04_DISTANT | Distinctive single skyline anchor")
rig=collection("05_CAMERA | Authentic original source poses")
lightcollection=collection("06_LIGHT | Physically authored studio lighting")

def material(name,rgb,metal=0.0,rough=.55,glass=0.0,emission=None,texture=0):
    m=bpy.data.materials.new(name);m.use_nodes=True
    m.diffuse_color=(*rgb,1)
    p=m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value=(*rgb,1)
    p.inputs["Metallic"].default_value=metal
    p.inputs["Roughness"].default_value=rough
    if glass:
        for key in ("Transmission Weight","Transmission"):
            if key in p.inputs:p.inputs[key].default_value=glass
        p.inputs["IOR"].default_value=1.48
    if emission:
        for key in ("Emission Color","Emission"):
            if key in p.inputs and key=="Emission Color":p.inputs[key].default_value=(*emission[:3],1)
            elif key in p.inputs and key=="Emission":p.inputs[key].default_value=(*emission[:3],1)
        if "Emission Strength" in p.inputs:p.inputs["Emission Strength"].default_value=emission[3]
    if texture:
        nodes=m.node_tree.nodes;links=m.node_tree.links
        tex=nodes.new("ShaderNodeTexNoise")
        tex.inputs["Scale"].default_value=texture
        tex.inputs["Detail"].default_value=3.0
        bump=nodes.new("ShaderNodeBump")
        bump.inputs["Strength"].default_value=.17
        bump.inputs["Distance"].default_value=.018
        links.new(tex.outputs["Fac"],bump.inputs["Height"])
        links.new(bump.outputs["Normal"],p.inputs["Normal"])
    return m
ceramic=material("01 | Sunlit glazed ceramic / fine grit",(.65,.64,.57),.16,.43,texture=14)
travertine=material("02 | Honed ivory structural stone",(.68,.63,.55),.05,.64,texture=12)
copper=material("03 | Satin weathered bronze",(.48,.305,.20),.77,.33,texture=18)
glass=material("04 | Deep blue green glazed interior",(.12,.24,.27),.08,.13,glass=.78)
dark=material("05 | Anodized dark titanium",(.16,.21,.24),.62,.42,texture=15)
interior=material("06 | Warm inhabited civic interior",(.59,.38,.205),.09,.59,
                  emission=(.95,.56,.28,.26))
green=material("07 | Living evergreen planting",(.12,.23,.135),.0,.91,texture=15)
soil=material("08 | Landscape stone and rough aggregate",(.30,.345,.315),.0,.87,texture=28)
lightmat=material("09 | Recessed warm luminaires",(.90,.61,.29),.1,.24,
                  emission=(1.,.72,.41,2.0))
water=material("10 | Dark reflective basin",(.09,.22,.24),.12,.12)
wood=material("11 | Natural ash benches and rail",(.46,.31,.18),.02,.53,texture=32)
asphalt=material("12 | Survey ONLY muted lane",(.21,.285,.29),0,.9)

def bvec(web):
    return Vector((web[0],-web[2],web[1]))
first=shots[0]
p0=Vector(first["ball"])
front=Vector(first["front"])
forward=Vector((front.x,0,front.z)).normalized()
right=Vector((-forward.z,0,forward.x)).normalized()
def P(s,l,h):
    w=p0+forward*s+right*l+Vector((0,h,0))
    return bvec(w)
def mesh(name,points,faces,mat,col=hero):
    geom=bpy.data.meshes.new(name+"_mesh")
    geom.from_pydata([tuple(v) for v in points],[],faces)
    geom.update(calc_edges=True)
    obj=bpy.data.objects.new(name,geom)
    col.objects.link(obj)
    if mat:obj.data.materials.append(mat)
    for face in obj.data.polygons:face.use_smooth=True
    return obj
def cuboid(name,s,l,h,ds,dl,dh,mat,col=detail,bevel=0.0):
    u,v,w=ds*.5,dl*.5,dh*.5
    points=[P(s+a*u,l+b*v,h+c*w) for a,b,c in
      [(-1,-1,-1),(1,-1,-1),(1,1,-1),(-1,1,-1),
       (-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1)]]
    faces=[(0,1,2,3),(4,7,6,5),(0,4,5,1),
           (1,5,6,2),(2,6,7,3),(3,7,4,0)]
    obj=mesh(name,points,faces,mat,col)
    if bevel:
        m=obj.modifiers.new("Hand-finished eased edges","BEVEL")
        m.width=bevel;m.segments=3
        m.limit_method='ANGLE'
        obj.modifiers.new("Weighted face normals","WEIGHTED_NORMAL")
    return obj
def polyline(name,points,radius,mat,col=hero):
    curve=bpy.data.curves.new(name,"CURVE")
    curve.dimensions="3D";curve.resolution_u=12
    curve.bevel_depth=radius;curve.bevel_resolution=3
    spline=curve.splines.new("POLY")
    spline.points.add(len(points)-1)
    for v,loc in zip(spline.points,points):
        v.co=(*loc,1)
    obj=bpy.data.objects.new(name,curve);col.objects.link(obj)
    obj.data.materials.append(mat)
    return obj
def face_strip(name,rows,mat,col=hero,solid=None):
    n=len(rows[0]);assert n>=2
    assert all(len(r)==n for r in rows)
    vertices=[v for row in rows for v in row]
    faces=[(i*n+j,(i+1)*n+j,(i+1)*n+j+1,i*n+j+1)
           for i in range(len(rows)-1) for j in range(n-1)]
    obj=mesh(name,vertices,faces,mat,col)
    if solid is not None:
        sol=obj.modifiers.new("True structural section","SOLIDIFY")
        sol.thickness=solid
        sol.offset=0
    return obj
def leaf_sculpture(name,s,l,height,radius,mat,col=detail):
    points=[];faces=[]
    # shaped trunk or dense foliage is a proper 3D mesh, not a cross billboard
    rings=11;edges=9
    for j in range(rings+1):
        t=j/rings
        z=height*t
        rr=radius*(sin(pi*t)**.72)*(.9+.1*sin(3*pi*t))
        for i in range(edges):
            a=2*pi*i/edges
            points.append(P(s+rr*cos(a)+2.5*t*t,l+rr*sin(a),z))
    for j in range(rings):
        for i in range(edges):
            k=j*edges+i,n=j*edges+(i+1)%edges
            faces.append((k,n,n+edges,k+edges))
    return mesh(name,points,faces,mat,col)
def annular_deck(name,s,l,z,outerS,outerL,innerS,innerL,mat):
    n=52
    vertices=[]
    for a,b in [(outerS,outerL),(innerS,innerL)]:
        for i in range(n):
            t=i*2*pi/n
            vertices.append(P(s+a*cos(t),l+b*sin(t),z))
    faces=[(i,(i+1)%n,n+(i+1)%n,n+i) for i in range(n)]
    obj=mesh(name,vertices,faces,mat,hero)
    thick=obj.modifiers.new("Civic floor genuine depth","SOLIDIFY")
    thick.thickness=1.8
    thick.offset=-1
    return obj

# One huge but OPEN civic room at the shoulder; false "floor contact" is not certified.
central_s,central_l=185,-115
annular_deck("PUBLIC COURT | one actual open-hole stone floor",
             central_s,central_l,23.8,79,50,31,19,travertine)
annular_deck("BASIN | water instead of fake black atrium",
             central_s,central_l,16.0,28,17,11,6,water)
# Curved continuous double-curvature shell, not a row of diagonal bars.
N,M=72,28
def roof(su,sv):
    s=96+167*su
    l=-63-106*sv+4.0*sin(2*pi*su)*sin(pi*sv)
    h=51+0.13*s+20*(sin(pi*su)**.75)*(1-.27*sv)
    h+=11*sin(pi*sv)*(0.45+.55*su)+3.8*sin(3*pi*su)*sin(pi*sv)
    return P(s,l,h)
rows=[[roof(i/N,j/M) for j in range(M+1)] for i in range(N+1)]
roof_obj=face_strip("HERO | one authored double-curved floating ceramic hall roof",
                    rows,ceramic,hero,solid=2.25)
bevel=roof_obj.modifiers.new("Precision softened ceramic lip","BEVEL")
bevel.width=.72;bevel.segments=2
roof_obj.modifiers.new("Weighted structural normals","WEIGHTED_NORMAL")
# Real bronze edge and internal coffers follow canopy curvature, never span the lane.
for v in (.0,1.0):
    polyline("Copper continuous eave | side "+str(v),
             [roof(i/92,v)+Vector((0,0,-.25)) for i in range(93)],
             .70,copper)
for i in range(1,22):
    u=i/22
    polyline("Individual underside timber/bronze crossrib %02d"%i,
             [roof(u,j/22)-Vector((0,0,3.2)) for j in range(23)],
             .29,copper)
# Organic structural columns are shoulder-local and connect below the real DCC roof.
for u in (.10,.24,.38,.52,.69,.84,.94):
    for v in (.08,.90):
        s=96+167*u
        l=-63-106*v
        upper=roof(u,v)-Vector((0,0,3.0))
        lower=P(s,l,18+.12*s)
        bend=P(s+3*sin(2*pi*u),l+(7 if v<.5 else -7),38+.1*s)
        polyline("Flared civic hall column %.2f %.2f"%(u,v),
             [lower,bend,upper],1.22,dark,hero)
        cuboid("Stone heel under support",s,l,17+.12*s,5.2,5.2,3.2,
               travertine,hero,bevel=.35)
# Transparent human scale glazing set back under the sculpture, and real doors.
for i in range(27):
    u0=i/27;u1=(i+1)/27
    s0=112+134*u0;s1=112+134*u1
    l=-139+10*sin(pi*u0)
    low=26+.13*s0
    height=20+4*sin(pi*u0)
    if i in (6,7,18,19):continue # accessible architectural door void, NOT GAME WALK PASS
    row0=[P(s0,l,low),P(s0,l,low+height)]
    row1=[P(s1,l+1.4*sin(2*pi*u1),low),P(s1,l+1.4*sin(2*pi*u1),low+height)]
    face_strip("Real recessed glass bay %02d"%i,[row0,row1],glass)
    polyline("Bronze load-bearing mullion %02d"%i,
         [row0[0],row0[1]],.24,copper)
    if i%4==0:
       cuboid("Gallery inside shop light %02d"%i,
          (s0+s1)*.5,l-3,low+8,3.7,.7,2.0,
          lightmat,detail,bevel=.17)
for i in range(2):
    # Distinctly located vestibules, visible as actual deep glass volumes.
    s=148+57*i
    cuboid("Deep open restaurant vestibule %d"%i,
       s,-144,32+.13*s,16,11,12,glass,detail,bevel=.9)
# Function: usable-scale benches, planter foliage and light pools around the OPEN courtyard.
for i in range(14):
    a=(i+.25)*2*pi/14
    s=central_s+65*cos(a);l=central_l+39*sin(a)
    h=25.0
    cuboid("Civic bench ash wood %02d"%i,
           s,l,h+1,4.8,1.4,.65,wood,detail,bevel=.26)
    if i%2==0:
        cuboid("Planted concrete terrace bed %02d"%i,
               s+4,l-2,h+.3,3.7,3.2,1.0,travertine,detail,bevel=.3)
        leaf_sculpture("Native tree foliage crown %02d"%i,
                s+4,l-2,8.6,4.3,green)
        polyline("Slim planter trunk %02d"%i,
                [P(s+4,l-2,h+1),P(s+4,l-2,h+5.4)],.22,wood)
# Pedestrian scale embedded warm lighting under the roof, not a giant neon stripe.
for i in range(12):
    s=118+i*10.8;l=-155+9*sin(i*.43)
    cuboid("Warm concealed lighting recess %02d"%i,
        s,l,46+.13*s,4.4,.55,.9,lightmat,detail,bevel=.08)
# Right shoulder: one lower civic garden, asymmetrical skyline counterpart.
annular_deck("RIGHT BANK | lifted public botanical terrace",237,108,
             19+.11*237,49,37,19,14,travertine)
for j in range(11):
    a=2*pi*j/11
    s=237+37*cos(a);l=108+27*sin(a)
    leaf_sculpture("Human scale west-bank planting %02d"%j,
       s,l,7.2,3.3,green,detail)
# ONE distant twisting faceted landmark; the rest of the skyline stays open.
tower_s,tower_l,tower_H=308,171,242
segments,edges=40,13
tower=[]
for j in range(segments+1):
    t=j/segments
    ang=t*1.08
    rad=25*(1-.41*t)+3*sin(2*pi*t)
    level=[]
    for k in range(edges):
        theta=2*pi*k/edges+ang
        elliptical=rad*(.94+.08*sin(3*theta+t))
        s=tower_s+elliptical*cos(theta)+16*t*t
        l=tower_l+elliptical*.78*sin(theta)-12*t*t
        h=20+tower_H*t
        level.append(P(s,l,h))
    tower.append(level)
building=mesh("ONE urban landmark | truly tapered rotating triangular-plan civic tower",
 tower[0]+tower[-1],[],dark,city) # keep editable named survey reference
# Actual original detailed facade: loft sides in separate identified material bays.
for i in range(edges):
    strips=[[tower[j][i],tower[j][(i+1)%edges]]
        for j in range(segments+1)]
    face_strip("Civic landmark curved glass facet %02d"%i,strips,
      glass if i%4 else copper,city,solid=.55)
# Broken rather than repetitive facade: internal floors every 4 rings, real thickness.
for k in (4,9,15,22,30,37):
    level=k/segments
    s=tower_s+16*level*level
    l=tower_l-12*level*level
    radius=23*(1-.38*level)
    annular_deck("Skygarden separated floor %02d"%k,s,l,
       20+tower_H*level,radius,radius*.79,7,5,travertine)
# Terrain is deliberately BACKGROUND STUDIO geometry, not an invented road collider.
for sign in (-1,1):
    verts=[];faces=[]
    S=28;L=14
    for i in range(S+1):
        road_s=-60+i*(600/S)
        for j in range(L+1):
            lateral=sign*(55+j*(440/L))
            z=-37+road_s*.115 - .12*max(abs(lateral)-80,0)
            z+=7*sin(road_s*.024)*cos(lateral*.024)
            verts.append(P(road_s,lateral,z))
    for i in range(S):
        for j in range(L):
            k=i*(L+1)+j
            faces.append((k,k+L+1,k+L+2,k+1))
    mesh("NONPHYSICAL LANDSCAPE backdrop "+str(sign),
         verts,faces,soil,site)
# Empty objects record actual six original source positions; they NEVER render as obstacles.
for record in data["records"]:
    empty=bpy.data.objects.new(
       "CERTIFIED_NATIVE_BALL_%s_%s"%(record["mode"],record["tick"]),None)
    empty.empty_display_type='SPHERE';empty.empty_display_size=1.5
    empty.location=bvec(record["ball"])
    rig.objects.link(empty)

world=bpy.data.worlds.new("DCC studio daylight / not original game sky")
scene.world=world;world.use_nodes=True
world.node_tree.nodes["Background"].inputs["Color"].default_value=(.46,.56,.65,1)
world.node_tree.nodes["Background"].inputs["Strength"].default_value=.72
def lamp(name,light_type,location,energy,color,size=None):
    d=bpy.data.lights.new(name,light_type)
    d.energy=energy;d.color=color
    if size is not None and light_type=='AREA':d.shape='DISK';d.size=size
    obj=bpy.data.objects.new(name,d)
    lightcollection.objects.link(obj)
    obj.location=location
    if light_type=='AREA':
        direction=P(170,-115,25)-location
        obj.rotation_euler=direction.to_track_quat('-Z','Y').to_euler()
    return obj
sun=lamp("Warm directional afternoon sun", "SUN",P(-90,-160,460),3.4,(1.0,.79,.57))
sun.rotation_euler=(math.radians(28),math.radians(-31),math.radians(17))
sun.data.angle=math.radians(8.0)
for i in range(4):
    lamp("Real courtyard softbox %d"%i,'AREA',
       P(130+32*i,-113,104),2200,(1.,.77,.57),size=60)
for i in range(4):
    lamp("Real gallery area light %d"%i,'AREA',
       P(138+24*i,-154,53+22),1250,(1.,.80,.64),size=28)
cameras=[]
fov=2*math.atan(1./data["evidenceSource"]["webglVerticalPerspectiveMultiplier"])
for item in shots:
    cam=bpy.data.cameras.new("Source-controlled native original camera "+str(item["tick"]))
    cam.lens=21.6;cam.sensor_height=32;cam.sensor_fit='VERTICAL'
    cam.clip_start=.2;cam.clip_end=3500
    assert abs(2*math.atan((cam.sensor_height/(2*cam.lens)))-fov)<1e-6
    obj=bpy.data.objects.new("TRUE ORIGINAL SOURCE EYE "+str(item["tick"]),cam)
    rig.objects.link(obj);obj.location=bvec(item["eye"])
    obj.rotation_euler=bvec(item["front"]).normalized().to_track_quat('-Z','Y').to_euler()
    cameras.append((item["tick"],obj))
scene.camera=cameras[0][1]
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,"K4AX_TIDAL_EXCHANGE_EDITABLE.blend"))
for tick,cam in cameras:
    scene.camera=cam
    scene.render.filepath=os.path.join(out,"K4AX_DCC_ONLY_SOURCE_POSE_"+str(tick)+".png")
    bpy.ops.render.render(write_still=True)
# Return first camera when reopening the editable Blender project.
scene.camera=cameras[0][1]
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,"K4AX_TIDAL_EXCHANGE_EDITABLE.blend"))
bpy.ops.export_scene.gltf(filepath=os.path.join(out,"K4AX_TIDAL_EXCHANGE_EDITABLE.glb"),
                          export_format='GLB',export_cameras=False,export_lights=False)
files=[
 "K4AX_TIDAL_EXCHANGE_EDITABLE.blend",
 "K4AX_TIDAL_EXCHANGE_EDITABLE.glb",
]+["K4AX_DCC_ONLY_SOURCE_POSE_"+str(t)+".png" for t,_ in cameras]
for f in files:
    p=os.path.join(out,f)
    assert os.path.isfile(p) and os.path.getsize(p)>2000,(f,'not generated')
report={
 "schema":"dopagaki.K4AX.native-pose-editable-blender-art-studio/1",
 "sourceBlob":data["evidenceSource"]["sourceBlob"],
 "actualOriginalCameraTicks":[t for t,_ in cameras],
 "actualRoad5SourceImagesSHA256":[r["sourceImageSHA256"] for r in shots],
 "cameraIsOriginalNumericPose":True,
 "renderedFramesAreOriginalGameScreenshots":False,
 "renderedFramesAreIndependentBlenderArtPreviews":True,
 "originalB48CollisionMeshImported":False,
 "originalB51MovingHazardsImported":False,
 "roadCenterlineFromThreeBallSamplesNotSourceSurface":"NOT_USED_TO_CERTIFY_CLEARANCE",
 "sourceTerrainAndPublicWalkability":"NOT_TESTED",
 "sourceHUDIncluded":False,
 "sourceOriginalPhysicsOrCameraChanged":False,
 "editableBlenderSourceTrue":True,
 "meshObjects":sum(o.type=='MESH' for o in bpy.data.objects),
 "physicalMaterialNodeSets":len(bpy.data.materials),
 "cameras":len(cameras),
 "publicArtDirection":"SINGLE CURVED CERAMIC CIVIC HALL / OPEN COURTYARD / REAL GLASS / WARM OCCUPIED INTERIORS / ASYMMETRIC LANDMARK",
 "ART":"NOT_TESTED_HOLD","HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD",
 "FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "formalArtAccepted":0,"slope2DNAMetres":0
}
report["files"]={name:{"bytes":os.path.getsize(os.path.join(out,name)),
 "sha256":hashlib.sha256(open(os.path.join(out,name),"rb").read()).hexdigest()}
 for name in files}
with open(os.path.join(out,"K4AX_BLENDER_STUDIO_PROVENANCE.json"),"w",encoding="utf8") as f:
 json.dump(report,f,ensure_ascii=False,indent=2)
print("K4AX_DCC_EDITABLE_ART_STUDIO_RENDERED_NOT_ORIGINAL_GAME_ART_HOLD",
      json.dumps({"objects":report["meshObjects"],"materials":report["physicalMaterialNodeSets"],
       "originalSourceCameraTicks":report["actualOriginalCameraTicks"],
       "renderedGameFrames":0,"art":report["ART"]}))
