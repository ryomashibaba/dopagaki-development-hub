# G4E-7BT / RIFTBOUND MEGACITY
# 100% original scripted Blender 3D architecture and self-generated texture.
# ART/HUMAN/PUBLISH HOLD. This is neither hand-sculpted nor actual gameplay.
import bpy,math,os,sys,random,json
from mathutils import Vector
from math import sin,cos,pi
random.seed(7561)
argv=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
out=argv[argv.index('--out')+1] if '--out' in argv else '/tmp/g4e7bu'
os.makedirs(out,exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
scene.unit_settings.system='METRIC'
scene.render.engine='CYCLES'
scene.cycles.samples=22
# Ubuntu Blender is built without OpenImageDenoiser; BR established this gate.
scene.cycles.use_denoising=False
scene.view_layers[0].cycles.use_denoising=False
scene.render.threads_mode='FIXED'
scene.render.threads=4
scene.render.resolution_x=1440
scene.render.resolution_y=900
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.view_settings.view_transform='Filmic'
scene.view_settings.look='Medium High Contrast'
scene.world.use_nodes=True
bg=scene.world.node_tree.nodes.get('Background')
bg.inputs['Color'].default_value=(.065,.105,.17,1)
bg.inputs['Strength'].default_value=.8
art=bpy.data.collections.new('RIFTBOUND MEGACITY / 1.9km inhabited canyon')
scene.collection.children.link(art)

def mat(name,col,metal=0,rough=.45,emit=None):
    m=bpy.data.materials.new(name);m.diffuse_color=(*col,1);m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*col,1)
    p.inputs['Metallic'].default_value=metal
    p.inputs['Roughness'].default_value=rough
    if emit is not None:
        e=p.inputs.get('Emission Color') or p.inputs.get('Emission')
        if e:e.default_value=(*emit,1)
        v=p.inputs.get('Emission Strength')
        if v:v.default_value=1.6
    return m
mats=[
 mat('Porcelain limestone inhabited city shell',(.47,.61,.60),.4),
 mat('Pale cut ceramic edge',(.72,.8,.77),.25),
 mat('Shadowed inhabited underside',(.03,.06,.09),.75),
 mat('Deep structural titanium',(.12,.20,.26),.7),
 mat('Elevated public copper plazas',(.34,.38,.35),.48),
 mat('Blue glass occupied district',(.07,.18,.28),.35),
 mat('Warm city windows',(.90,.52,.19),.13,emit=(1,.48,.14)),
 mat('Cold skyrail windows',(.12,.50,.58),.2,emit=(.06,.80,1)),
 mat('Inhabited elevated gardens',(.10,.27,.19),.1,.85),
 mat('Pale structural fold backbone',(.55,.63,.65),.64)]
# An authored 128x128 PNG atlas, packed and embedded in GLB.
im=bpy.data.images.new('ORIGINAL_CITY_FACADE_PBR_ATLAS',width=128,height=128,alpha=True)
pixels=[]
for y in range(128):
    for x in range(128):
        joint=(x%8==0 or y%11==0)
        lit=(x//8+3*(y//11))%7 in (0,2,3)
        noise=((x*37+y*13)%23)/900
        c=(.035,.065,.095) if joint else ((.65,.34,.14) if lit else (.06,.14,.20))
        pixels.extend((c[0]+noise,c[1]+noise,c[2]+noise,1))
im.pixels[:]=pixels
im.filepath_raw=os.path.join(out,'G4E7BU_ORIGINAL_FACADE_ATLAS.png')
im.file_format='PNG';im.save();im.pack()
texture=mat('Original embedded glTF urban PBR facade',(.3,.3,.3),.3)
node=texture.node_tree.nodes.new('ShaderNodeTexImage')
node.image=im
texture.node_tree.links.new(node.outputs['Color'],texture.node_tree.nodes['Principled BSDF'].inputs['Base Color'])
mats.append(texture)

def mesh(name,v,f,material_ids=None,textured=False):
    d=bpy.data.meshes.new(name+'_mesh')
    d.from_pydata(v,[],f);d.update()
    ob=bpy.data.objects.new(name,d);art.objects.link(ob)
    for m in mats:d.materials.append(m)
    if material_ids:
        for p,i in zip(d.polygons,material_ids):p.material_index=i
    if textured:
        uv=d.uv_layers.new(name='Building facade UV')
        for p in d.polygons:
            for k,idx in enumerate(p.loop_indices):
                uv.data[idx].uv=[(0,0),(1,0),(1,1),(0,1)][k%4]
    return ob

def cube(name,position,dimensions,ma):
    bpy.ops.mesh.primitive_cube_add(size=1,location=position)
    o=bpy.context.object;o.name=name;o.dimensions=dimensions
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    for col in list(o.users_collection):col.objects.unlink(o)
    art.objects.link(o);o.data.materials.append(mats[ma])
    return o

def at(t,f,z=0):
    wave=1+.08*sin(3*t)+.035*sin(7*t)
    return (460*f*cos(t)*wave,365*f*sin(t)*(1+.09*sin(2*t+.7)),z)
def height(t):return 164+48*sin(t+.35)+29*cos(2*t-.8)+16*sin(5*t)

# MAJOR FORM RESET: not a ring, dish, separated model towers or island.
# 1.9km-long metropolitan canyon between interconnected tectonic city cliffs.
# Geometry is authored for independent aesthetic review; NO physical tracks.
N=96
def yy(i):return -950+1900*i/N
def canyon(side,y):
    return side*(185+47*sin(y/260+side*.3)+23*sin(y/108))
def rim(side,y):
    return side*(790+70*sin(y/420+.9)+45*sin(y/160))
def summit(side,y):
    return (660 if side<0 else 435)+73*sin(y/430+side*.3)+24*sin(y/135)
# Thick contiguous city masses with open top. Six closed longitudinal
# profiles follow 1900m of geometry, unlike a platform or empty circular rim.
for side,title,levels in [(-1,'WEST / ascending continuous inhabited metropolis',7),
                          (1,'EAST / infrastructural residential escarpment',6)]:
    v=[];f=[];ids=[]
    for i in range(N+1):
        y=yy(i);x=canyon(side,y);o=rim(side,y);z=summit(side,y)
        v.extend([(o,y,z-10),(x+side*75,y,z+30),
                  (x,y,z-70),(x+side*42,y,-37),
                  (o-side*80,y,-150)])
    for i in range(N):
        a=5*i;b=a+5
        for j in range(4):
            f.append((a+j,b+j,b+j+1,a+j+1))
            ids.append([0,1,5,3][j] if i%9 else [9,1,5,2][j])
    f.extend([tuple(range(4,-1,-1)),tuple(range(5*N,5*N+5))])
    ids.extend([2,2])
    mesh('MONUMENTAL CONNECTED tectonic-inhabited mass '+title,v,f,ids)
    # Attached deck-and-spine system, not floating roads or decorative strips.
    for level in range(levels):
        vv=[];ff=[];mm=[]
        for i in range(N+1):
            y=yy(i);z=summit(side,y)-60-67*level
            inn=canyon(side,y)+side*(15+8*(level%3))
            back=rim(side,y)-side*(95+8*level)
            vv.extend([(inn,y,z),(back,y,z-10),
                       (back,y,z-32),(inn,y,z-27)])
        for i in range(N):
            a=4*i;b=a+4
            for j in range(4):
                ff.append((a+j,b+j,b+(j+1)%4,a+(j+1)%4))
                mm.append([4 if level%2 else 9,2,3,1][j])
        mesh('URBAN LONGITUDINAL LAYER '+title+' / '+str(level),vv,ff,mm)
# Two visibly anchored city-to-city civic spans leave open public sky below.
def span(name,starty,endy,z,width,arch):
    v=[];f=[];ids=[]
    left=canyon(-1,starty)-55;right=canyon(1,endy)+55
    for i in range(57):
        t=i/56
        x=left+(right-left)*t
        y=starty+(endy-starty)*t+22*sin(pi*t)
        h=z+arch*sin(pi*t)
        v.extend([(x,y-width/2,h),(x,y+width/2,h),
                  (x,y+width/2,h-15),(x,y-width/2,h-15)])
    for i in range(56):
        a=4*i;b=a+4
        for j in range(4):
            f.append((a+j,b+j,b+(j+1)%4,a+(j+1)%4))
            ids.append([1,3,2,9][j])
    mesh(name,v,f,ids)
span('CANONICAL CITY SPAN / long civic elevated interchange',-280,-250,260,38,72)
span('Distant cross-void inhabited skyline connection',560,530,354,18,-20)
span('Lower community transit connection',-700,-710,87,21,18)
cube('Suspended central district civic theatre',(0,-245,335),(115,85,40),1)
# Two nonidentical thick curved monumental uplifts woven into adjacent
# continuous metropolitan cliffs: their mass starts INSIDE the city wall.
def uplift(title,side,starty,rise,forward,angle):
    rows=[]
    for i in range(39):
        t=i/38
        y=starty+forward*t+72*sin(pi*t*1.4)
        x=canyon(side,y)+side*(48+56*t*t)
        z=summit(side,starty)-35+rise*t*t
        wd=(212-100*t)*(1+.16*sin(pi*t))
        deep=120-55*t
        rows.append([(x,y-wd/2,z),(x,y+wd/2,z),
                     (x+side*deep,y+wd/2,z-38),
                     (x+side*deep,y-wd/2,z-38)])
    v=[p for row in rows for p in row];f=[];mi=[]
    for i in range(38):
        for j in range(4):
            f.append((4*i+j,4*(i+1)+j,4*(i+1)+(j+1)%4,4*i+(j+1)%4))
            mi.append([0,1,9,3][j])
    f.extend([(3,2,1,0),tuple(range(152,156))]);mi.extend([2,1])
    mesh(title,v,f,mi)
uplift('WEST uplift / 880m total height continuous cliff',-1,200,330,370,1)
uplift('EAST cantilever / irregular free-cut architectural ridge',1,-500,310,-270,-1)
# Occupied urban volumes physically attached to the longitudinal terraces.
# Great variation in density, depth and roof line, plus deliberate voids.
for side,tag in [(-1,'W'),(1,'E')]:
    for quarter in range(48):
        y=-910+quarter*38.5
        for level in range(6 if side>0 else 7):
            if (quarter+level*3)%13==0:continue
            x=canyon(side,y)+side*(102+14*((quarter+level)%3))
            z=summit(side,y)-65-level*67+10
            h=25+11*((quarter*7+level*5)%5)
            wid=20+8*((quarter+level)%4)
            dep=21+8*((quarter+2*level)%4)
            o=cube('Connected inhabited city quarter '+tag+'/'+str(quarter)+'/'+str(level),
                   (x,y,z+h/2),(wid,dep,h),5 if quarter%4 else 3)
            o.rotation_euler[2]=side*.10*sin(quarter*.5)
            if quarter%5==0 and level%2==0:
                cube('Community roof and planted living district '+tag+'/'+str(quarter)+'/'+str(level),
                     (x,y,z+h+2),(wid*.95,dep*.84,5),8)
# Thousands of real facade quads, not only one giant primitive color slab.
verts=[];faces=[];mats_idx=[]
for side in (-1,1):
  for i in range(155):
    y=-930+i*12
    for floor in range(34):
      z=-20+floor*19
      if z>summit(side,y)-25 or (i+floor)%10==0:continue
      x=canyon(side,y)+side*(1.5+7*sin(i*.1)**2)
      k=len(verts)
      verts.extend([(x,y,z),(x,y+8.5,z),
                    (x,y+8.5,z+11),(x,y,z+11)])
      faces.append((k,k+1,k+2,k+3))
      mats_idx.append(10 if (floor+i)%7 else 6)
mesh('Genuine metropolitan curtain wall / thousands of occupied facade panels',
     verts,faces,mats_idx,True)
# Real geometry for multiple continuous deep-perspective transit veins.
for side in (-1,1):
    for z in (75,170,280):
        verts=[];faces=[];ids=[]
        for i in range(N+1):
            y=yy(i);x=canyon(side,y)+side*9
            h=z+21*sin(y/320)
            verts.extend([(x,y,h),(x,y,h+6)])
        for i in range(N):
            faces.append((2*i,2*(i+1),2*(i+1)+1,2*i+1))
            ids.append(7 if i%12 in (0,1) else 9)
        mesh('Canyon-side integrated commuter spine '+str(side)+'/'+str(z),
             verts,faces,ids)
# Studio only / lighting.
floor=cube('STUDIO-ONLY no GLB export',(0,0,-260),(4000,4000,7),2)
floor['exclude_glb']=True
def light(name,typ,pos,power,color,area=900):
    d=bpy.data.lights.new(name,typ);d.energy=power;d.color=color
    if typ=='AREA':d.shape='DISK';d.size=area
    o=bpy.data.objects.new(name,d);scene.collection.objects.link(o);o.location=pos
    if typ=='AREA':
        o.rotation_euler=(Vector((0,0,190))-o.location).to_track_quat('-Z','Y').to_euler()
    return o
sun=light('Warm city key sun','SUN',(0,0,1000),2.0,(1,.83,.69))
sun.rotation_euler=(math.radians(30),math.radians(-20),math.radians(-39))
light('Enormous cool skyline bounce','AREA',(-1100,-850,990),1120000,(.62,.82,1),1200)
light('Public void blue illumination','AREA',(760,650,1050),1230000,(.36,.76,1),1050)
def camera(name,position,target,lens):
    d=bpy.data.cameras.new(name)
    o=bpy.data.objects.new(name,d)
    scene.collection.objects.link(o);o.location=position
    o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
    d.lens=lens;d.clip_end=16000;scene.camera=o
views=[
 ('OBLIQUE',(-1740,-2190,1080),(0,30,340),38),
 ('FRONT',(0,-2310,740),(0,0,290),44),
 ('SIDE',(2300,-290,1040),(0,0,320),42),
 ('AERIAL',(1440,1320,2300),(0,0,290),46)]
camera('Hero review camera',*views[0][1:])
blend=os.path.join(out,'G4E7BU_RIFTBOUND_MEGACITY_SOURCE.blend')
bpy.ops.wm.save_as_mainfile(filepath=blend)
# Render first: Blender 4.0.2/Linux crashes in Cycles BVH if its original
# generated/packed texture data are passed through the GLB exporter first.
# This is a testable crash-isolation change, not yet proven root causality.
for name,position,target,lens in views:
    camera('Review '+name,position,target,lens)
    scene.render.filepath=os.path.join(out,'G4E7BU_'+name+'_REAL_BLENDER_RENDER.png')
    bpy.ops.render.render(write_still=True)
# Binary export is independent of the studio cameras/render result.
bpy.ops.object.select_all(action='DESELECT')
for ob in scene.objects:
    if ob.type=='MESH' and not ob.get('exclude_glb',False):ob.select_set(True)
bpy.context.view_layer.objects.active=next(o for o in bpy.context.selected_objects)
glb=os.path.join(out,'G4E7BU_RIFTBOUND_MEGACITY_ART_ONLY.glb')
bpy.ops.export_scene.gltf(filepath=glb,export_format='GLB',
                          use_selection=True,export_yup=True)
bpy.ops.object.select_all(action='DESELECT')
report={
 'schema':'dopagaki-g4e7bu-original-blender-art-study-v1',
 'authorship':'SCRIPTED_BPY_MODELLING_NOT_HAND_SCULPTED',
 'model':'RIFTBOUND MEGACITY',
 'atlas':'ORIGINAL_GENERATED_PNG_PACKED_IN_GLB',
 'units':'METERS_BLENDER_Z_UP_GLTF_Y_UP',
 'urbanTypology':'ASYMMETRIC_CONTINUOUS_TECTONIC_CANYON',
 'gameplayIntegration':'NOT_YET_DONE',
 'artReview':'HOLD','humanPlay':'HOLD','publish':'FORBIDDEN',
 'officiallyCertifiedSlope2Meters':0}
with open(os.path.join(out,'G4E7BU_PROVENANCE.json'),'w') as f:
    json.dump(report,f,indent=2)
print('G4E7BU original art production',json.dumps(report))
