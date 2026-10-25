# G4E-7BT / THE INHABITED TIDAL FOLD
# 100% original scripted Blender 3D architecture and self-generated texture.
# ART/HUMAN/PUBLISH HOLD. This is neither hand-sculpted nor actual gameplay.
import bpy,math,os,sys,random,json
from mathutils import Vector
from math import sin,cos,pi
random.seed(7561)
argv=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
out=argv[argv.index('--out')+1] if '--out' in argv else '/tmp/g4e7bt'
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
art=bpy.data.collections.new('ONE INHABITED FOLD / TRUE GEOMETRY')
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
im.filepath_raw=os.path.join(out,'G4E7BT_ORIGINAL_FACADE_ATLAS.png')
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

# Primary silhouette: ONE 1150m C-shaped, 200m-deep continuous inhabited
# megamass, not a group of separate islands, no false collision platform.
count=168
a=-pi/2+.22;b=3*pi/2-.22
v=[];f=[];mi=[]
for k in range(count+1):
    t=a+(b-a)*k/count;h=height(t)
    v+= [at(t,1.16,h),at(t,.59,h-15),
         at(t,.59,-43+12*sin(2*t)),at(t,1.16,-85+18*sin(t))]
for k in range(count):
    x=4*k;y=x+4
    f+= [(x,y,y+1,x+1),(x+1,y+1,y+2,x+2),
          (x,y,y+3,x+3),(x+3,x+2,y+2,y+3)]
    mi += [1 if k%6 else 4,5 if k%6 else 3,0 if k%7 else 9,2]
f += [(0,1,2,3),tuple(reversed(range(4*count,4*count+4)))]
mi += [9,9]
mesh('CENTRAL INHABITED CITY FOLD | one connected 1.15km volume',v,f,mi)

# Continuous below-roof terraces and long residential strata.
for layer in range(4):
    vv=[];ff=[]
    for k in range(count+1):
        t=a+(b-a)*k/count;z=height(t)-28-layer*33
        vv.extend([at(t,1.09-layer*.01,z),at(t,.63+layer*.02,z)])
    for k in range(count):ff.append((2*k,2*(k+1),2*(k+1)+1,2*k+1))
    mesh('Integrated inhabited strata tier '+str(layer),vv,ff,
         [3 if layer%2 else 4]*count)

# Civic bridges over a real empty central public void.
def bridge(name,pa,pb,width,rise):
    va=[];fa=[];ids=[]
    p=Vector(pa);q=Vector(pb)
    for i in range(33):
        t=i/32;point=p.lerp(q,t);point.z+=rise*sin(pi*t)
        va.extend([(point.x,point.y-width/2,point.z),
                   (point.x,point.y+width/2,point.z),
                   (point.x,point.y+width/2,point.z-12),
                   (point.x,point.y-width/2,point.z-12)])
    for i in range(32):
        j=i*4;k=j+4
        fa.extend([(j,k,k+1,j+1),(j+1,k+1,k+2,j+2),
                   (j+2,k+2,k+3,j+3),(j+3,k+3,k,j)])
        ids.extend([4,3,2,1])
    mesh(name,va,fa,ids)
bridge('Transit artery: occupied 600m cross-void skybridge',
       (-305,55,173),(325,55,194),28,59)
bridge('Deep public exchange across hollow canyon',
       (-284,-65,44),(283,-65,73),25,-17)
cube('Central public council suspended above skyrail',(0,55,225),(158,55,24),1)
cube('Elevated terraced botanical city court',(0,55,241),(115,35,7),8)

# Genuine urban neighborhoods attached all across three radial strata.
for sector in range(92):
    t=a+(b-a)*(sector+.5)/92
    if sector%11==0:continue
    for rad in range(3):
        fac=.69+.143*rad;x,y,_=at(t,fac)
        z=height(t)+9+6*((sector*7+rad)%5)
        ht=27+13*((sector*3+rad*5)%5)
        wid=17+6*(sector%3);dep=16+5*((sector+rad)%4)
        o=cube('Distinct inhabited urban block %d / level %d'%(sector,rad),
               (x,y,z+ht/2),(wid,dep,ht),5 if sector%4 else 0)
        o.rotation_euler[2]=t+pi/2
        if sector%3==0:
            cube('Green communal roof %d %d'%(sector,rad),(x,y,z+ht+2),
                 (wid*.80,dep*.78,4),8)
        if sector%4 in (0,1):
            cube('Visible apartment tier %d %d'%(sector,rad),
                 (x,y,z+ht*.68),(wid*.8,dep*.9,6),
                 6 if sector%4==0 else 7)

# Actual 3D fenestration on INNER and OUTER city walls.
windows=[];quads=[];window_mats=[]
for side in ('outer','inner'):
    factor=1.164 if side=='outer' else .581
    for k in range(count):
        t0=a+(b-a)*(k+.16)/count
        t1=a+(b-a)*(k+.68)/count
        roof=min(height(t0),height(t1))
        bottom=-80 if side=='outer' else -42
        for level in range(13):
            zz=bottom+10+13.5*level
            if zz+6>roof-8 or (k+level)%9==0:continue
            x0,y0,_=at(t0,factor)
            x1,y1,_=at(t1,factor)
            n=len(windows)
            windows.extend([(x0,y0,zz),(x1,y1,zz),
                            (x1,y1,zz+6),(x0,y0,zz+6)])
            quads.append((n,n+1,n+2,n+3))
            window_mats.append(6 if (k*3+level)%9==1 else 10)
mesh('True embedded glazed urban facade / fine window rhythm',
     windows,quads,window_mats,True)

# Two non-identical thick sculptural mantles CONNECTED to the city mass.
def fin(label,theta,reach,rise,turn):
    rows=[]
    for i in range(31):
        u=i/30;t=theta+turn*.26*u+.09*sin(pi*u)
        x,y,_=at(t,1.03-.17*u);z=height(theta)-18+rise*u
        tang=Vector((-sin(t),cos(t),0))
        norm=Vector((cos(t),sin(t),0))
        center=Vector((x,y,z))
        width=reach*(1-.55*u)
        rows.append([tuple(center-tang*width*.5),
                     tuple(center+tang*width*.5),
                     tuple(center+tang*width*.5+norm*(62-25*u)+Vector((0,0,-20))),
                     tuple(center-tang*width*.5+norm*(62-25*u)+Vector((0,0,-20)))])
    vv=[p for row in rows for p in row];ff=[];ids=[]
    for i in range(30):
        for j in range(4):
            ff.append((i*4+j,i*4+(j+1)%4,(i+1)*4+(j+1)%4,(i+1)*4+j))
            ids.append([0,1,9,3][j])
    ff.extend([(0,1,2,3),tuple(range(120,124))]);ids.extend([2,1])
    mesh(label,vv,ff,ids)
fin('West inhabited uplifting folded mantle / hero silhouette',pi*.68,205,530,1)
fin('East fractured residential counter-mantle',pi*.12,170,424,-1)

# Long visible light-rail integrated all along the ring exterior.
vv=[];ff=[]
for k in range(count+1):
    t=a+(b-a)*k/count;x,y,_=at(t,1.21)
    vv.extend([(x,y,height(t)-52),(x,y,height(t)-66)])
for k in range(count):ff.append((2*k,2*(k+1),2*(k+1)+1,2*k+1))
mesh('Permanent physically modelled orbital rail on inhabited wall',
     vv,ff,[7 if k%12<3 else 9 for k in range(count)])

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
 ('OBLIQUE',(-1550,-1410,965),(0,0,170),41),
 ('FRONT',(0,-1720,720),(0,0,175),44),
 ('SIDE',(1660,-210,810),(0,0,170),43),
 ('AERIAL',(1150,1250,1970),(0,0,130),45)]
camera('Hero review camera',*views[0][1:])
blend=os.path.join(out,'G4E7BT_INHABITED_TIDAL_FOLD_SOURCE.blend')
bpy.ops.wm.save_as_mainfile(filepath=blend)
bpy.ops.object.select_all(action='DESELECT')
for ob in scene.objects:
    if ob.type=='MESH' and not ob.get('exclude_glb',False):ob.select_set(True)
bpy.context.view_layer.objects.active=next(o for o in bpy.context.selected_objects)
glb=os.path.join(out,'G4E7BT_INHABITED_TIDAL_FOLD_ART_ONLY.glb')
bpy.ops.export_scene.gltf(filepath=glb,export_format='GLB',
                          use_selection=True,export_yup=True)
bpy.ops.object.select_all(action='DESELECT')
for name,position,target,lens in views:
    camera('Review '+name,position,target,lens)
    scene.render.filepath=os.path.join(out,'G4E7BT_'+name+'_REAL_BLENDER_RENDER.png')
    bpy.ops.render.render(write_still=True)
report={
 'schema':'dopagaki-g4e7bt-original-blender-art-study-v1',
 'authorship':'SCRIPTED_BPY_MODELLING_NOT_HAND_SCULPTED',
 'model':'THE INHABITED TIDAL FOLD',
 'atlas':'ORIGINAL_GENERATED_PNG_PACKED_IN_GLB',
 'units':'METERS_BLENDER_Z_UP_GLTF_Y_UP',
 'centralRealEmptyVoid':True,'continuousCityShell':True,
 'gameplayIntegration':'NOT_YET_DONE',
 'artReview':'HOLD','humanPlay':'HOLD','publish':'FORBIDDEN',
 'officiallyCertifiedSlope2Meters':0}
with open(os.path.join(out,'G4E7BT_PROVENANCE.json'),'w') as f:
    json.dump(report,f,indent=2)
print('G4E7BT original art production',json.dumps(report))
