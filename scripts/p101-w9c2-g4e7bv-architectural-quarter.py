# G4E-7BT / THE ARCHITECTURAL QUARTER
# 100% original scripted Blender 3D architecture and self-generated texture.
# ART/HUMAN/PUBLISH HOLD. This is neither hand-sculpted nor actual gameplay.
import bpy,math,os,sys,random,json
from mathutils import Vector
from math import sin,cos,pi
random.seed(7561)
argv=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
out=argv[argv.index('--out')+1] if '--out' in argv else '/tmp/g4e7bv'
os.makedirs(out,exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
scene.unit_settings.system='METRIC'
scene.render.engine='CYCLES'
scene.cycles.samples=28
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
art=bpy.data.collections.new('THE ARCHITECTURAL QUARTER / 1.9km inhabited canyon')
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
im.filepath_raw=os.path.join(out,'G4E7BV_ORIGINAL_FACADE_ATLAS.png')
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

# G4E-7BV ARCHITECTURE FIRST: the city is built from the inhabited rooms,
# structural frames, courtyards, ramps, train platforms and relief facades.
# This 700m interconnected architectural quarter is NOT a full city.
# There is no background world-sized slab, bowl, ring or giant empty shell.
def bar(name,a,b,width,depth,mi):
    a=Vector(a);b=Vector(b);d=b-a
    ob=cube(name,tuple((a+b)*.5),(width,depth,d.length),mi)
    ob.rotation_euler=d.to_track_quat('Z','Y').to_euler()
    return ob
def extrude_plan(name,xy,low,high,mi,side_mi=None):
    n=len(xy)
    v=[(x,y,low) for x,y in xy]+[(x,y,high) for x,y in xy]
    f=[tuple(reversed(range(n))),tuple(range(n,2*n))]
    ids=[2,mi]
    for j in range(n):
        f.append((j,(j+1)%n,(j+1)%n+n,j+n))
        ids.append(mi if side_mi is None else side_mi)
    return mesh(name,v,f,ids)
def arc_strip(name,center,rad1,rad2,a0,a1,z0,z1,material,segments=44):
    # Beamed slabs curve in plan AND rise in section; never a flat floor ring.
    x0,y0=center
    v=[];f=[];ids=[]
    for i in range(segments+1):
        t=i/segments;angle=a0+(a1-a0)*t;zz=z0+(z1-z0)*t+3*sin(pi*t)
        v.extend([(x0+rad1*cos(angle),y0+rad1*sin(angle),zz),
                  (x0+rad2*cos(angle),y0+rad2*sin(angle),zz),
                  (x0+rad2*cos(angle),y0+rad2*sin(angle),zz-7),
                  (x0+rad1*cos(angle),y0+rad1*sin(angle),zz-7)])
    for i in range(segments):
        k=i*4;b=k+4
        for j in range(4):
            f.append((k+j,b+j,b+(j+1)%4,k+(j+1)%4))
            ids.append([material,3,9,1][j])
    return mesh(name,v,f,ids)
def facade(name,x,y0,y1,z0,z1,mi=10,floors=1):
    # The full wall is a real 3D aperture grid, never one painted sprite.
    v=[];f=[];ids=[]
    nf=max(1,int((y1-y0)/6.5))
    nz=max(1,int((z1-z0)/7.0))
    for iy in range(nf):
        for iz in range(nz):
            if (iy*7+iz*3)%19==0:continue
            y=y0+(iy+.12)*(y1-y0)/nf
            yb=y0+(iy+.85)*(y1-y0)/nf
            z=z0+(iz+.18)*(z1-z0)/nz
            zb=z0+(iz+.77)*(z1-z0)/nz
            q=len(v)
            v.extend([(x,y,z),(x,yb,z),(x,yb,zb),(x,y,zb)])
            f.append((q,q+1,q+2,q+3))
            ids.append(10 if (iy+iz)%7 else 6)
    return mesh(name,v,f,ids,True)
def glazed_curved_facade(name,center,radius,angles,lower,upper):
    # Shared urban glazing follows genuine curved wall edges; 6m bays.
    v=[];f=[];ids=[]
    angles=list(angles)
    for i in range(len(angles)-1):
        a=angles[i];b=angles[i+1]
        for level in range(max(1,int((upper-lower)/7))):
            z=lower+level*7+.75
            x0=center[0]+radius*cos(a);y0=center[1]+radius*sin(a)
            x1=center[0]+radius*cos(b);y1=center[1]+radius*sin(b)
            k=len(v)
            v.extend([(x0,y0,z),(x1,y1,z),(x1,y1,z+5.1),(x0,y0,z+5.1)])
            f.append((k,k+1,k+2,k+3))
            ids.append(10 if (i+level)%6 else 6)
    return mesh(name,v,f,ids,True)

# SITING / 720m along the high-speed player's forward Y sightline.
# The route itself is NEVER modelled in this art study: no fake roadway.
# Open 110m corridor along x=0, toward the 300m-high landmark.
# ARCH 1: West civic railway concourse, open-air podium & vaulted roof.
for floor,(lo,hi,width) in enumerate([(18,29,178),(52,63,165),(88,100,138)]):
    plan=[(-318,-320),(-155,-340),(-138,-120),
          (-162,-92),(-293,-105),(-330,-180)]
    plan=[(-233+(x+233)*width/178,y) for x,y in plan]
    extrude_plan('Transit concourse / inhabited stepped platform L'+str(floor),
                 plan,lo,hi,4 if floor%2 else 1,3)
    # Elevated public terraces facing into the open axis.
    arc_strip('Occupied concourse promenade / '+str(floor),
              (-211,-190),81-floor*5,112-floor*3,
              -1.3,1.35,hi+1,hi+8,9 if floor%2==0 else 4)
# Tapered hollow station roof: two layered curved wind-catching eaves.
for k in range(2):
    arc_strip('Civic transit vault roof / long copper glass canopy '+str(k),
              (-223,-195),105+k*15,131+k*17,
              .06,2.98,136+22*k,170+13*k,1 if k==0 else 3)
# Terminal atrium columns between true lower station and upper roof.
for j,ang in enumerate([.28,.76,1.36,1.95,2.50,2.84]):
    x=-223+119*cos(ang);y=-195+119*sin(ang)
    bar('Structural station roof support / %d'%j,
        (x,y,19),(x-8*cos(ang),y-8*sin(ang),146),7,8,9)
# Interior train halls, visible glowing platform canopies and boarding bays.
for i in range(3):
    y=-306+i*73
    box=cube('Transit glass enclosed platform hall / %d'%i,
            (-234,y,40+i*19),(78,41,42),5)
    cube('Occupied boarding strip / %d'%i,(-189,y,34+i*19),(4,32,9),7)
for i in range(27):
    y=-319+i*8
    facade('Station inward occupied glazing / %d'%i,-151,y,y+6.2,32,108)

# ARCH 2: West vertical terraced arcology: genuine polygonal plan geometry,
# offset occupied quarters, massive cut-away atrium and a stepped skyline.
# This is 400m high and has a specific architectural section, unlike prism tower.
profiles=[
 (116,165,[(-347,35),(-187,23),(-154,116),(-211,179),(-344,145)]),
 (167,223,[(-330,55),(-206,36),(-177,106),(-238,162),(-343,145)]),
 (227,278,[(-320,88),(-210,65),(-183,118),(-267,171),(-347,148)]),
 (283,335,[(-307,109),(-221,82),(-183,134),(-252,188),(-340,156)]),
 (339,392,[(-289,122),(-228,103),(-175,152),(-247,198),(-321,178)])]
for level,(z0,z1,plan) in enumerate(profiles):
    extrude_plan('Arcology wing A / architecturally occupied layer %d'%level,
                 plan,z0,z1,0 if level%2 else 5,3)
    if level<4:
        # True connecting public terraces and planted civic decks.
        extrude_plan('Arcology stepped city roof park / %d'%level,
                     [(x*.98,y*.98) for x,y in plan],
                     z1+1,z1+7,8,4)
    # Structural pull-back and 5-7m rhythm along the visible axis.
    if level<4:
        s=plan[2];e=plan[3]
        for bay in range(8):
            t=bay/8
            x=s[0]*(1-t)+e[0]*t
            y=s[1]*(1-t)+e[1]*t
            bar('Civic arcade supporting vertical rib / %d-%d'%(level,bay),
                (x,y,z0),(x-4,y+4,z1+6),2.8,3.3,9)
# A real split landmark. Twin connected counter-leaning tower segments.
bar('Arcology civic observatory / diagonal suspension truss',
    (-233,103,375),(-185,159,502),19,22,1)
bar('Counter-leaning glazed lift tower',(-302,139,312),(-362,208,474),13,16,3)
# Atrium carved through volumes as a physically OPEN space between two
# staggered plans (not a fake punched black plane).
for i in range(5):
    z=156+i*53
    bar('Real transverse connected public skybridge / %d'%i,
        (-274,84,z),(-195,134,z+5),11,9,4)

# ARCH 3: EAST CULTURAL / AQUATIC FORUM. Large curved inhabited halls,
# deliberately lower and wider than the arcology.
cx,cy=247,-12
for tier,rr in enumerate([(70,124),(66,110),(60,91)]):
    lo,hi=rr
    zbase=39+tier*48
    arc_strip('Waterfront occupied curved civic deck / %d'%tier,
              (cx,cy),lo,hi,-1.4,2.0,zbase,zbase+11,4)
    angles=[-1.35+j*3.28/34 for j in range(35)]
    glazed_curved_facade('Original curved civic aquarium halls / glazing %d'%tier,
                        (cx,cy),hi-4,angles,zbase+10,zbase+56)
    for j in range(5):
        ang=-1.2+j*.73
        x=cx+(hi+3)*cos(ang);y=cy+(hi+3)*sin(ang)
        bar('Civic forum buttress / %d-%d'%(tier,j),
            (x,y,zbase-25),(x-13*cos(ang),y-13*sin(ang),zbase+60),
            5.5,8.5,0)
# Public curved roof has an actual accessible raised terminal wing.
arc_strip('A single large sculptural civic canopy / not a background ring',
          (cx,cy),80,143,-1.48,1.67,209,232,1,58)
# Hollow monument: sculpted pairs of inhabited inclined frames across river.
bar('EAST landmark leaning observation needle',
    (267,84,166),(337,115,371),25,27,1)
bar('Central observation spine shoulder',
    (307,65,179),(335,112,359),9,18,3)
cube('Public skylight crown and civic overlook',(338,115,375),(73,39,19),9)

# ARCH 4: EAST southern high-density residential school and culture block.
# Three offset masses define clear courtyards, not a scalar loop of towers.
residential=[
 (137,-330,162,92,172),
 (330,-317,111,154,144),
 (196,-182,155,84,264)]
for i,(x,y,w,d,h) in enumerate(residential):
    pxy=[(x-w*.52,y-d*.48),(x+w*.40,y-d*.53),
         (x+w*.54,y+d*.16),(x+w*.11,y+d*.54),(x-w*.49,y+d*.41)]
    extrude_plan('Resident/cultural school built quad %d'%i,pxy,18,18+h,0 if i%2 else 3,5)
    extrude_plan('Integrated roof commons and tree deck / %d'%i,
                 [(x*.994,y*.994) for x,y in pxy],
                 19+h,25+h,8,4)
    # Defining different facades, including shader atlas, glass, and lines.
    for floor in range(int(h/8)):
        zz=22+floor*8
        start=x-w*.39;end=x+w*.39
        for bay in range(9):
            xx=start+(end-start)*bay/9
            cube('Residential occupied setback window / %d-%d-%d'%(i,floor,bay),
                 (xx,y-d*.51,zz),(w*.055,1.7,4.8),
                 6 if (i*7+floor+bay)%7<2 else 5)
# Main elevated road-to-pedestrian separation: design is non-collision.
# Independent promenade and balcony below sightline, no physical B48 edits.
bar('PUBLIC elevated pedestrian link from station to civic forum',
    (-150,-171,149),(132,-89,165),14,13,4)
bar('Second diagonal public urban-connection bridge',
    (-179,111,220),(139,59,208),14,16,3)
# The gap in the center remains open. 60+ m of empty air for the actual
# game's future road; no invisible floor, not even a mock collision surface.
# Each skyline piece contains occupied space, arches or transit links.

# ARCHITECTURAL MICRO SCALE: actual 4m and 8m structural elements.
# These are clearly secondary details, not the geometry of the city itself.
for i in range(24):
    y=-298+i*13
    bar('Fine transit-viaduct trestle / %d'%i,
        (-113,y,42),(-133,y+3,92+7*sin(i*.4)),2.2,2.8,9)
for i in range(14):
    y=-130+i*19
    cube('Civic planted suspended skycourt module / %d'%i,
         (118+16*sin(i*.9),y,67+2*(i%3)),
         (16,13,6),8)
    if i%2==0:
        bar('Inhabited urban sunshade support / %d'%i,
            (120,y,66),(125,y+7,95),2,2.8,9)

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
 ('OBLIQUE',(-890,-1060,675),(0,-65,170),42),
 ('FRONT',(0,-1100,340),(0,-60,180),41),
 ('SIDE',(1050,-240,575),(0,-70,190),44),
 ('AERIAL',(750,860,1150),(0,-80,155),45),
 ('APPROACH',(0,-550,52),(0,65,160),49)]
camera('Hero review camera',*views[0][1:])
blend=os.path.join(out,'G4E7BV_ARCHITECTURAL_QUARTER_SOURCE.blend')
bpy.ops.wm.save_as_mainfile(filepath=blend)
# Render first: Blender 4.0.2/Linux crashes in Cycles BVH if its original
# generated/packed texture data are passed through the GLB exporter first.
# This is a testable crash-isolation change, not yet proven root causality.
for name,position,target,lens in views:
    camera('Review '+name,position,target,lens)
    scene.render.filepath=os.path.join(out,'G4E7BV_'+name+'_REAL_BLENDER_RENDER.png')
    bpy.ops.render.render(write_still=True)
# Binary export is independent of the studio cameras/render result.
bpy.ops.object.select_all(action='DESELECT')
for ob in scene.objects:
    if ob.type=='MESH' and not ob.get('exclude_glb',False):ob.select_set(True)
bpy.context.view_layer.objects.active=next(o for o in bpy.context.selected_objects)
glb=os.path.join(out,'G4E7BV_ARCHITECTURAL_QUARTER_ART_ONLY.glb')
bpy.ops.export_scene.gltf(filepath=glb,export_format='GLB',
                          use_selection=True,export_yup=True)
bpy.ops.object.select_all(action='DESELECT')
report={
 'schema':'dopagaki-g4e7bv-original-blender-art-study-v1',
 'authorship':'SCRIPTED_BPY_MODELLING_NOT_HAND_SCULPTED',
 'model':'THE ARCHITECTURAL QUARTER',
 'atlas':'ORIGINAL_GENERATED_PNG_PACKED_IN_GLB',
 'units':'METERS_BLENDER_Z_UP_GLTF_Y_UP',
 'urbanTypology':'FOUR_ARCHITECTURE_FIRST_BUILDINGS_WITH_PUBLIC_CONNECTIONS',
 'gameplayIntegration':'NOT_YET_DONE',
 'artReview':'HOLD','humanPlay':'HOLD','publish':'FORBIDDEN',
 'officiallyCertifiedSlope2Meters':0}
with open(os.path.join(out,'G4E7BV_PROVENANCE.json'),'w') as f:
    json.dump(report,f,indent=2)
print('G4E7BV original art production',json.dumps(report))
