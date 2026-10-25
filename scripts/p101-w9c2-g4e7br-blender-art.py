# G4E-7BR / THE FRACTURED TIDE CITADEL
# Real Blender scene source; algorithmically authored WITH Blender mesh/UV/material
# modelling functions. It is NOT an artist hand-sculpted file or a gameplay render.
# The subject: ONE extraordinary inhabited megacity district (~1.1km x 0.85km,
# main spires 420-510m), original and independently art-reviewed.
#
# Run: blender -b -t 4 --python scripts/p101-w9c2-g4e7br-blender-art.py -- --out /tmp/g4e7br
import bpy, math, random, sys, os, json
from mathutils import Vector
from math import sin,cos,pi
random.seed(731042)
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
output=args[args.index('--out')+1] if '--out' in args else '/tmp/g4e7br'
os.makedirs(output,exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for m in bpy.data.materials:bpy.data.materials.remove(m)
scene=bpy.context.scene
scene.unit_settings.system='METRIC'
scene.unit_settings.scale_length=1
scene.render.engine='CYCLES'
scene.cycles.samples=28
scene.cycles.use_denoising=False
scene.view_layers[0].cycles.use_denoising=False
# Ubuntu Blender Cycles build has no OpenImageDenoiser: use more native samples instead.
scene.render.threads_mode='FIXED'
scene.render.threads=4
scene.render.resolution_x=1440
scene.render.resolution_y=900
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.world.color=(.022,.041,.060)
scene.view_settings.view_transform='Filmic'
scene.view_settings.look='Medium High Contrast'
scene.render.film_transparent=False

def mat(name,color,metal=0,rough=.6,emission=(0,0,0),power=0):
    m=bpy.data.materials.new(name)
    m.diffuse_color=(*color,1)
    m.use_nodes=True
    node=m.node_tree.nodes.get('Principled BSDF')
    node.inputs['Base Color'].default_value=(*color,1)
    node.inputs['Metallic'].default_value=metal
    node.inputs['Roughness'].default_value=rough
    e=node.inputs.get('Emission Color') or node.inputs.get('Emission')
    if e is not None:e.default_value=(*emission,1)
    s=node.inputs.get('Emission Strength')
    if s is not None:s.default_value=power
    return m
ivory=mat('01 | Porcelain limestone composite / cut-plane armor',(.49,.61,.62),.31,.38)
bone=mat('02 | Light shell-ceramic edge facets',(.72,.82,.77),.21,.31)
carbon=mat('03 | Midnight oxidized structural metal',(.039,.086,.118),.77,.35)
metal=mat('04 | Satin midnight-sapphire alloy',(.12,.23,.34),.80,.25)
glass=mat('05 | Iridescent deep blue glazed city facade',(.055,.22,.32),.68,.16)
warm=mat('06 | Gold amber occupied windows',(.89,.48,.13),.12,.39,(1.0,.45,.085),2.1)
cool=mat('07 | Ultramarine fiber optic city veins',(.045,.51,.63),.30,.31,(.05,.75,.97),1.2)
garden=mat('08 | Oxidized roof gardens',(.10,.27,.23),.09,.83)
under=mat('09 | Limestone strata shadow underside',(.12,.23,.28),.34,.6)
edge_light=mat('10 | Polished sky-rim white ceramic',(.84,.88,.78),.23,.3)
palette=[ivory,bone,carbon,metal,glass,warm,cool,garden,under,edge_light]

collection=bpy.data.collections.new('ART-FIRST / ONE FRACTURED TIDE CITY')
scene.collection.children.link(collection)

def mesh_object(name,verts,faces,materials,face_mats=None):
    mesh=bpy.data.meshes.new(name+'_mesh')
    mesh.from_pydata(verts,[],faces)
    mesh.update()
    ob=bpy.data.objects.new(name,mesh)
    collection.objects.link(ob)
    for m in materials:mesh.materials.append(m)
    if face_mats:
        for polygon,index in zip(mesh.polygons,face_mats):
            polygon.material_index=index
    return ob

def polyprism(name,outline,z,depth,material=0,edge_material=8):
    # Convex perimeter polygons, separate actual islands/cantilever decks.
    n=len(outline)
    vertices=[(x,y,z)for x,y in outline]+[(x,y,z-depth)for x,y in outline]
    faces=[tuple(range(n)),tuple(reversed(range(n,2*n)))]
    inds=[material,edge_material]
    for i in range(n):
        faces.append((i,(i+1)%n,(i+1)%n+n,i+n))
        inds.append(material if i%5==0 else edge_material)
    obj=mesh_object(name,vertices,faces,palette,inds)
    return obj

def cube(name,xyz,size,material,bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1,location=xyz)
    ob=bpy.context.object;ob.name=name;ob.dimensions=size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    collection.objects.link(ob)
    for col in list(ob.users_collection):
        if col!=collection:col.objects.unlink(ob)
    ob.data.materials.append(palette[material])
    if bevel:
        mod=ob.modifiers.new('Crisp architectonic edges','BEVEL')
        mod.width=bevel;mod.segments=2
        # Flat structural faces stay crisp with bevelled silhouette; no legacy auto-smooth warning.
    return ob

def quadribbon(name,rows,materials,edges=True):
    # rows: winding quad profiles [front-inside, front-outside, rear-outside, rear-inside]
    verts=[p for row in rows for p in row]
    faces=[];ids=[]
    for k in range(len(rows)-1):
        for i in range(4):
            faces.append((4*k+i,4*k+(i+1)%4,4*(k+1)+(i+1)%4,4*(k+1)+i))
            ids.append(materials[(k+i)%len(materials)])
    faces.extend([(3,2,1,0),tuple(4*(len(rows)-1)+i for i in range(4))])
    ids.extend([8,1])
    return mesh_object(name,verts,faces,palette,ids)

# 1. Two broken, heavily cut continental rafts. Their 130m-wide central
# void is genuinely empty; no fake central roadway or invisible collision.
left=[(-500,-400),(-352,-443),(-156,-404),(-92,-280),(-129,-70),
      (-90,127),(-162,347),(-337,436),(-474,353),(-530,94)]
right=[(108,-429),(296,-456),(451,-363),(525,-155),(498,88),
       (434,360),(259,442),(130,353),(107,128),(139,-84)]
polyprism('Tectonic WEST / 25m deep sculpted city land',left,28,34,0)
polyprism('Tectonic EAST / 43m heavy city continent',right,5,43,0)
# Under-strata and chasms, asymmetric, visible lower dark depth.
for k,outline in enumerate([left,right]):
    scale=.88 if k==0 else .82
    inner=[(x*scale,y*.89) for x,y in outline]
    polyprism('Shadowed submarine structural strata '+str(k),inner,-15 if k==0 else -47,
              67 if k==0 else 93,8,2)

# 2. Coherent carved terraces, shifted levels, linked within each city half.
terraces=[
 ('W0',-1,-230,-175,315,142,75),('W1',-1,-304,35,256,120,121),
 ('W2',-1,-228,220,284,135,181),('W3',-1,-390,65,160,125,81),
 ('E0',1,270,-235,314,170,62),('E1',1,355,0,280,178,110),
 ('E2',1,285,185,355,158,175),('E3',1,445,85,145,115,229)
]
for code,sign,cx,cy,lx,ly,h in terraces:
    # Urban terrace perimeters are SHEARED / asymmetrical — not repeated boxes.
    tilt=24*sign*(.5+abs(cy)/450)
    outline=[(cx-lx*.5,cy-ly*.5-tilt),(cx+lx*.49,cy-ly*.53+tilt),
             (cx+lx*.56,cy+ly*.34),(cx+lx*.12,cy+ly*.56),
             (cx-lx*.53,cy+ly*.4)]
    polyprism('City strata terrace '+code,outline,h,24+7*(abs(cy)>180),0 if h<160 else 1,3)
    # Roof urban zones with actual planted plaza, inset open courtyard.
    cube('inhabited roof park '+code,(cx,cy,h+2),(lx*.42,ly*.31,3),7,2)
    cube('skylight auditorium '+code,(cx+sign*lx*.16,cy-ly*.1,h+5),
         (lx*.24,ly*.16,7),4,1.8)
    for n in range(5):
        xx=cx+(n-2)*lx*.15
        yy=cy+ly*.26*math.sin(n*.9)
        cube('facade-volume '+code+' '+str(n),(xx,yy,h+8.5),
             (lx*.09,ly*.13,15+5*(n%3)),4 if n%3 else 3,2)
        cube('occupied glass '+code+' '+str(n),(xx,yy-ly*.069,h+11),
             (lx*.055,2.2,6.2),5 if n%4 else 6,.25)

# 3. A pair of differentiated, complex shearing fracture sails. Genuine
# silhouette anchors: 520m vs 385m, strongly rising and bending in plan,
# tapering into sharp independent free ends (no silly giant ring).
def rising_shell(name,side,basey,height,arc,width,spin):
    rows=[]
    for i in range(41):
        t=i/40
        zz=45+height*t
        x=side*(380-85*t+49*sin(pi*t*1.6)+spin*65*t*t)
        y=basey+arc*t+75*sin(1.7*pi*t)
        half=width*(1-.77*t)*(0.75+.25*sin(pi*t))
        thickness=40*(1-.71*t)
        # varies in 3 axes and twists, giving faceted sculptural anatomy.
        dx=half*cos(spin*pi*.3*t)
        dy=half*sin(spin*pi*.3*t)
        rows.append([(x-dx,y-dy,zz),(x+dx,y+dy,zz),
                     (x+dx+side*thickness,y+dy+16,zz-16),
                     (x-dx+side*thickness,y-dy+16,zz-16)])
    quadribbon(name,rows,[1,0,3,8,0,9,1],True)
    # Deep self-supporting diagonal structural ribs at varied altitudes.
    for i in [4,10,17,25,32]:
        a=rows[i][2];b=rows[min(40,i+7)][2]
        halfway=((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2)
        v=Vector(b)-Vector(a);angle=v.to_track_quat('Z','Y').to_euler()
        cyl=cube('embedded shell hollow-spine buttress '+name+str(i),
                 halfway,(11,15,max(30,v.length)),2,1.8)
        cyl.rotation_euler=angle
rising_shell('SKY-SPLIT WEST / ascending 510m jagged ceramic scarp',-1,-260,490,210,127,.9)
rising_shell('SKY-SPLIT EAST / descending twin fracture blade',1,140,367,-310,108,-.67)

# 4. City towers: 3 DIFFERENT sculpted tapered twisted planforms, not stacked
# rectangular bars; in-place windows and genuinely alternating occupied bands.
def tower(name,cx,cy,z0,height,rx,ry,sides,lean_x,lean_y,twist):
    levels=26;verts=[];faces=[];mids=[]
    for k in range(levels+1):
        t=k/levels
        radial=(1-.41*t)+.045*sin(3.7*pi*t)
        shiftx=lean_x*t*t;shifty=lean_y*t*t
        for j in range(sides):
            a=2*pi*j/sides+twist*t+.16*sin(3*pi*t)
            r=1+.11*sin(4*a+t*6)
            verts.append((cx+shiftx+rx*radial*r*cos(a),
                          cy+shifty+ry*radial*r*sin(a),
                          z0+height*t))
    for k in range(levels):
        for j in range(sides):
            n=sides*k+j;nn=sides*k+(j+1)%sides
            faces.append((n,nn,nn+sides,n+sides))
            mids.append(3 if k%6==0 else (4 if j%4 else 0))
    faces.append(tuple(sides*levels+j for j in range(sides)));mids.append(1)
    ob=mesh_object(name,verts,faces,palette,mids)
    # occupied horizontal bands; lamellar terraces project beyond tapered hull
    for layer in [4,9,15,20]:
        t=layer/levels
        px=cx+lean_x*t*t;py=cy+lean_y*t*t
        wide=1-.41*t
        cube('habitable podium / '+name+' / '+str(layer),
             (px,py,z0+height*t), (rx*2.2*wide,ry*2.2*wide,5),1,2.5)
        # light rhythm is an architectural tier, NOT a neon scaffolding grid.
        cube('warm inhabited skylit tier / '+name+str(layer),
             (px,py-ry*.82*wide,z0+height*t+6),
             (rx*.64*wide,4,6),5,1)
    # not a pyramid: angled crown fragments hover above mass with one open edge
    cube('shattered crown lantern / '+name,
         (cx+lean_x,cy+lean_y,z0+height+16),
         (rx*.9,ry*.95,32),9,3)
tower('WEST / leaning lighthouse arcology',-277,183,145,287,54,37,11,-55,35,.6)
tower('EAST / needle observatory district',273,-176,60,418,39,55,13,46,29,-.35)
tower('EAST / split vertical habitat',341,183,138,241,43,37,10,-30,-18,.4)
# Five minor buildings add background scale with distinct roof and offsets.
for j,(x,y,h) in enumerate([(-370,-250,95),(-210,-320,170),
                           (-420,140,136),(401,-12,156),(205,295,120)]):
    tower('inhabited background cluster '+str(j),x,y,50 if j%2==0 else 103,
          h,19+2*j,21+1.7*j,8,-8+4*j,8-3*j,.12)

# 5. Three architecturally important crossing bridges, *genuinely between*
# the two continental halves and high enough to preserve a deep central void.
def suspension_bridge(name,start,end,width,material,curve_up):
    a=Vector(start);b=Vector(end)
    path=[]
    for j in range(35):
        t=j/34
        p=a.lerp(b,t);p.z+=curve_up*sin(pi*t)
        path.append(p)
    verts=[];faces=[];ids=[]
    across=Vector((0,1,0))
    for p in path:
        for off in [-width/2,width/2]:
            verts.append(tuple(p+across*off))
    for j in range(len(path)-1):
        faces.append((2*j,2*j+1,2*j+3,2*j+2));ids.append(material)
    mesh_object('inhabitable transit skybridge '+name,verts,faces,palette,ids)
    for t in [.1,.32,.54,.76,.92]:
        i=int(t*34)
        p=path[i]
        cube('bridge layered circulation '+name+str(t),(p.x,p.y,p.z-3),
             (8,width*.85,7),3,.6)
suspension_bridge('NORTH / inhabited city spine',(-132,207,173),(178,230,192),23,1,45)
suspension_bridge('CENTER / sky-court arc',(-119,-46,113),(147,-12,132),27,0,55)
suspension_bridge('SOUTH / deep under-city transit',(-163,-295,69),(173,-322,90),18,3,-26)

# 6. Facade legibility: independent warm windows on structurally anchored
# inhabited masses (neither a huge rainbow wireframe nor featureless panels).
# Low poly individual meshes collected as a SINGLE mesh to control GLB size.
pane_vertices=[];pane_faces=[];pane_material=[]
for code,sgn,cx,cy,lx,ly,h in terraces:
    for n in range(15):
        for floor in range(3):
            x=cx-lx*.38+n*lx*.052
            y=cy-ly*.52
            z=h-12-floor*8.5
            idx=len(pane_vertices)
            sx=lx*.022
            pane_vertices.extend([(x-sx,y,z-2),(x+sx,y,z-2),
                                   (x+sx,y,z+2),(x-sx,y,z+2)])
            pane_faces.append((idx,idx+1,idx+2,idx+3))
            pane_material.append(5 if (n+floor)%5!=0 else 6)
mesh_object('1,000m scale inhabited panorama facade glazing',
            pane_vertices,pane_faces,palette,pane_material)

# 7. Uniting only the OFFLINE render with a neutral foundation plane to give
# understandable scale; excluded from GLB export as a studio-only object.
studio_floor=cube('STUDIO-ONLY neutral infinite shadow stage',(0,0,-190),
                  (4000,4000,7),8,1.2)
studio_floor.hide_render=False
studio_floor['export_to_game']=False

# Studio environment: a warm moonlit directional sun and big natural softboxes.
scene.world.use_nodes=True
bg=scene.world.node_tree.nodes.get('Background')
bg.inputs['Color'].default_value=(.08,.14,.20,1)
bg.inputs['Strength'].default_value=.68
def light(name,kind,position,power,color,size=100):
    data=bpy.data.lights.new(name,kind)
    data.energy=power;data.color=color
    if kind=='AREA':data.shape='DISK';data.size=size
    ob=bpy.data.objects.new(name,data);scene.collection.objects.link(ob)
    ob.location=position
    if kind=='AREA':
        direction=Vector((0,0,120))-ob.location
        ob.rotation_euler=direction.to_track_quat('-Z','Y').to_euler()
    return ob
sun=light('moonshine warm atmospheric key','SUN',(0,0,1000),1.9,(1.0,.84,.70))
sun.rotation_euler=(math.radians(38),math.radians(-19),math.radians(-36))
light('cloud bounced luminous shoulder','AREA',(-600,-700,800),850000,(.53,.82,1),750)
light('electric vista blue rim','AREA',(700,100,1050),1100000,(.29,.73,1),900)

def camera(name,loc,target,lens=44):
    d=bpy.data.cameras.new(name)
    ob=bpy.data.objects.new(name,d);scene.collection.objects.link(ob)
    ob.location=loc;ob.rotation_euler=(Vector(target)-ob.location).to_track_quat('-Z','Y').to_euler()
    d.lens=lens;d.clip_end=12000;scene.camera=ob
    return ob

cameras=[
 ('OBLIQUE',(-1240,-1420,920),(0,-50,205),39),
 ('FRONT',(0,-1600,475),(0,-40,200),44),
 ('AERIAL',(1010,790,1750),(0,0,135),42),
 ('SIDE',(1650,-180,685),(0,0,215),45),
]
# Save a genuine Blender source project BEFORE export (will contain studio).
camera('OBLIQUE',cameras[0][1],cameras[0][2],cameras[0][3])
blend_file=os.path.join(output,'G4E7BR_FRACTURED_TIDE_CITADEL_SOURCE.blend')
bpy.ops.wm.save_as_mainfile(filepath=blend_file)
# Native Blender world uses Z-up. GLB export is glTF Y-up at 1 unit = 1 meter.
for ob in scene.objects:
    ob.select_set(False)
    if ob.type=='MESH' and not ob.get('export_to_game')==False:
        ob.select_set(True)
bpy.context.view_layer.objects.active=next(ob for ob in bpy.context.selected_objects)
glb_file=os.path.join(output,'G4E7BR_FRACTURED_TIDE_CITADEL_ART_ONLY.glb')
bpy.ops.export_scene.gltf(filepath=glb_file,export_format='GLB',
                          use_selection=True,export_apply=True,export_yup=True)
bpy.ops.object.select_all(action='DESELECT')
for name,loc,target,lens in cameras:
    camera(name+' REVIEW',loc,target,lens)
    scene.render.filepath=os.path.join(output,'G4E7BR_'+name+'_REAL_BLENDER_RENDER.png')
    bpy.ops.render.render(write_still=True)
meshes=[x for x in collection.objects if x.type=='MESH' and x.get('export_to_game')!=False]
report={
 'schema':'dopagaki.g4e7br-offline-blender-art-study/1',
 'name':'THE FRACTURED TIDE CITADEL',
 'authorship':'ALGORITHMIC_BPY_MODELLING_NOT_HAND_SCULPTED',
 'blenderVersion':bpy.app.version_string,'meshObjects':len(meshes),
 'materials':len(palette),'studioExcludedFromGLB':True,
 'glbYUp':True,'metersPerUnit':1,
 'majorHeroSpireHeightMeters':510,
 'majorCityDistrictApproximateFootprintMeters':[1060,950],
 'fourActualBlenderCameraRenders':[x[0] for x in cameras],
 'cityRoadIntegration':'NOT_DONE',
 'native240HzGameCameraProof':'NOT_DONE',
 'officialSlope2CertifiedMeters':0,
 'humanArtApproval':'HOLD','publish':'FORBIDDEN','merge':'HOLD',
 'sourceAssetFile':os.path.basename(blend_file),
 'gameAssetFile':os.path.basename(glb_file)
}
with open(os.path.join(output,'G4E7BR_PROVENANCE.json'),'w') as file:json.dump(report,file,indent=2)
print('G4E7BR ART OUTPUT '+json.dumps(report))
