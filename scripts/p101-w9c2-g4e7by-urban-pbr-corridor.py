# G4E-7BY. PRIVATE art research: architecture-and-transit urban corridor.
# Camera-controlled Blender studio views; NOT game camera or a playable road.
# Source Poly Haven models CC0; assembly is scripted, not hand sculpted.
import bpy, os, sys, json, math, hashlib
from math import sin,pi
from pathlib import Path
from mathutils import Vector

args=sys.argv[sys.argv.index('--')+1:]
def value(flag): return Path(args[args.index(flag)+1]).resolve()
assets=value('--assets'); out=value('--out')
out.mkdir(parents=True,exist_ok=True)
sources=[assets/'modular_urban_apartments_facade'/'source.gltf',
         assets/'modular_factory_facade'/'source.gltf']
if not all(p.is_file() for p in sources):
    raise RuntimeError('Authentic Poly Haven glTF dependencies missing; no box fallback permitted')

bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
scene.render.engine='CYCLES'
scene.cycles.samples=20
scene.cycles.use_denoising=True
scene.render.threads_mode='FIXED';scene.render.threads=4
scene.render.resolution_x=1440;scene.render.resolution_y=900
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.view_settings.view_transform='Filmic'
scene.view_settings.look='Medium High Contrast'
world=bpy.data.worlds.new('Dusk cinematic sky') if not bpy.data.worlds else bpy.data.worlds[0]
scene.world=world;world.use_nodes=True
world.node_tree.nodes['Background'].inputs['Color'].default_value=(.13,.23,.37,1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value=.9
def material(name,color,metal=0,rough=.5,emission=None):
    m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
    bs=m.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value=(*color,1)
    bs.inputs['Metallic'].default_value=metal
    bs.inputs['Roughness'].default_value=rough
    if emission:
        bs.inputs['Emission Color'].default_value=(*emission,1)
        bs.inputs['Emission Strength'].default_value=1.2
    return m
M=[
material('Warm glazed terrazzo',(.32,.36,.42),.28,.35),
material('Dark urban titanium',(.035,.07,.093),.7,.31),
material('Light ceramic exterior',(.54,.63,.68),.19,.42),
material('Public transport brushed aluminium',(.31,.37,.4),.65,.3),
material('Copper architectural soffits',(.43,.29,.16),.6,.29),
material('Deep glazed inhabited cavities',(.013,.036,.064),.3,.2),
material('Warm occupied lower level lights',(0.95,.45,.18),.15,.35,(.95,.39,.14)),
material('Cyan transit route light',(.05,.61,.85),.22,.21,(.06,.55,.93)),
material('Transit platform texture',(.16,.2,.23),.4,.64),
material('Distant blue mega-structure',(.12,.19,.29),.27,.5)]
def block(name,point,size,mat,bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1,location=point)
    o=bpy.context.object;o.name=name
    o.dimensions=size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    o.data.materials.append(M[mat])
    if bevel:
        md=o.modifiers.new('Catchlight softened real edge','BEVEL')
        md.width=bevel;md.segments=2
        o.modifiers.new('Weighted face normals','WEIGHTED_NORMAL')
    return o
def beam(name,a,b,thickness,mat):
    mid=(Vector(a)+Vector(b))*.5
    delta=Vector(b)-Vector(a)
    ob=block(name,tuple(mid),(thickness,thickness,delta.length),mat,min(.7,thickness*.11))
    ob.rotation_euler=delta.to_track_quat('Z','Y').to_euler()
    return ob
def curve_line(name,coordinates,radius,mat):
    cv=bpy.data.curves.new(name,'CURVE');cv.dimensions='3D'
    cv.resolution_u=16;cv.bevel_depth=radius;cv.bevel_resolution=2
    sp=cv.splines.new('POLY');sp.points.add(len(coordinates)-1)
    for p,co in zip(sp.points,coordinates):p.co=(*co,1)
    ob=bpy.data.objects.new(name,cv);scene.collection.objects.link(ob)
    ob.data.materials.append(M[mat])
    return ob
# Urban morphology originates in the approach camera looking +Y.
# Road clearance is a STUDIO COMPOSITION ONLY. No B48 road mesh or collision.
block('STUDIO ONLY asphalt visual horizon',(0,525,-22),(740,2200,5),8)
for x in [-37,37]:
    block('Continuous transit terrace / not road', (x,550,-13),(13,1690,3),0,1)
    curve_line('Continuous luminous transit edge',
        [(x,yy,-10.7) for yy in range(-250,1351,40)],.27,7)
# Four diverse inhabited anchor buildings with compound nested architecture,
# NOT a repeated tower cuboid array; facades/crossings connect these locations.
anchors=[
 ('WEST civic garden',-165,62,150,82,138,2),
 ('EAST gateway and station',173,166,188,112,168,0),
 ('WEST occupied basalt cliff',-226,510,272,152,246,1),
 ('EAST arcology campus',238,584,312,153,214,2),
 ('WEST remote inhabited crown',-310,1020,460,178,282,9),
 ('EAST remote command terrace',337,1120,418,177,307,9)]
for name,x,y,h,w,depth,tone in anchors:
    # Buildings consist of interlocked vertically offset blocks, courts and
    # outward-facing inhabited terraces. External surface reads at 3 distances.
    sign=-1 if x<0 else 1
    block(name+' load-bearing core',(x,y,h*.45-18),(w*.52,depth*.6,h*.9),tone,6)
    block(name+' lower inhabited expansion',(x-sign*w*.32,y-depth*.15,h*.21-12),
          (w*.67,depth*.64,h*.41),2,5)
    block(name+' raised long civic strata',(x+sign*w*.12,y+depth*.29,h*.61-12),
          (w*.84,depth*.31,h*.13),0,3)
    block(name+' upper offset occupied wing',(x+sign*w*.18,y-depth*.22,h*.81-12),
          (w*.61,depth*.43,h*.34),tone,5)
    # A deep, non-opaque entrance reveals inner decks, actual building lives.
    for level,z in enumerate([23,45,72,107]):
        if z>h-17:continue
        block(name+' accessible interior floor %d'%level,
              (x-sign*w*.18,y-depth*.35,z-12),(w*.49,depth*.12,2.4),8,0)
        block(name+' continuous lit atrium reveal %d'%level,
              (x-sign*w*.18,y-depth*.414,z-8),(w*.41,1.5,3),6,0)
    for lev in range(3):
        z=h*.32+lev*h*.18
        block(name+' occupied balcony %d'%lev,
              (x-sign*w*.37,y+depth*.05,z-15),(w*.32,depth*.46,2),3,1)
        block(name+' illuminated balconies glass %d'%lev,
              (x-sign*w*.37,y-depth*.181,z-12),(w*.3,1.2,4),5,0)
# One city-wide public rail network actually lands in transit stations.
for side in [-1,1]:
    path=[(side*(77+17*sin(yy/220)),yy,36+12*sin(yy/320)) for yy in range(-190,1501,19)]
    curve_line('Transit network / continuous elevated alignment '+str(side),path,3.0,3)
    curve_line('Rail route emissive guide '+str(side),
               [(x,yy,z+4) for x,yy,z in path],.42,7)
    for yy in range(-120,1350,110):
        x=side*(77+17*sin(yy/220));z=36+12*sin(yy/320)
        beam('Load bearing transit pier',(x,yy,-18),(x,yy,z),3.5,1)
    for station_y in [80,370,810,1230]:
        z=36+12*sin(station_y/320);x=side*(77+17*sin(station_y/220))
        block('Rail station real boarding deck',(x+side*18,station_y,z-3),
              (34,52,3),2,1.5)
        block('Rail station glazed platform arcade',(x+side*20,station_y,z+7),
              (27,48,9),5,2)
        block('Rail station public platform lighting',(x+side*19,station_y-24,z+13),
              (25,1.5,1),6,0)
# Important crossings carry spatial depth without walling off the sightline.
for y,z in [(265,77),(675,97),(1080,124)]:
    line=[(-100+200*t/25,y+11*sin(pi*t/25),z+9*sin(pi*t/25)) for t in range(26)]
    curve_line('Connected interdistrict civic transfer bridge',line,3.8,2)
    curve_line('Civic bridge people-facing glazing',[(x,yy,zz+4.7) for x,yy,zz in line],.45,7)
    for x in [-100,100]:
        beam('Transfer vertical lift structure',(x,y,-15),(x,y,z),4,4)
# Far landmark: hollow sky-permeable infrastructure, NOT a solid giant lid.
for x in [-140,140]:
    beam('Terminal inhabited vertical pylon',(x,1290,-13),(x*.76,1300,325),22,9)
    block('Distant station occupied service bridges',(x*.88,1291,230),(75,60,18),3,3)
curve_line('Horizon train connection',[(x,1303,297+10*sin(pi*(x+120)/240))
    for x in range(-120,121,12)],3.0,7)
# License-confirmed original scanned architectural facade surfaces.
# Preserve ALL authentic meshes and PBR source materials. Position as
# scarce near/mid landmark DETAILS, not array-spawned low-poly boxes.
imported_register=[]
for index,path in enumerate(sources):
    old=set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=str(path))
    new=[o for o in bpy.data.objects if o not in old]
    meshes=[o for o in new if o.type=='MESH']
    if not meshes:raise RuntimeError('Poly Haven original glTF has no actual meshes '+str(path))
    # Keep hierarchy/materials and original physically meaningful relative
    # transforms. Parent a COLLECTION INSTANCE, not destructively join props.
    col=bpy.data.collections.new('Poly Haven CC0 1K '+path.parent.name)
    scene.collection.children.link(col)
    roots=[o for o in new if o.parent not in new]
    for o in new:
        for oldcol in list(o.users_collection):oldcol.objects.unlink(o)
        col.objects.link(o)
    # Imported bounds are a kit inventory; do not turn it into a 400m tower.
    # Its hand-authored original pieces are kept as a complete model for review.
    points=[o.matrix_world @ Vector(c) for o in meshes for c in o.bound_box]
    lo=Vector([min(p[i] for p in points) for i in range(3)])
    hi=Vector([max(p[i] for p in points) for i in range(3)])
    size=hi-lo
    if min(size)<=.001:raise RuntimeError('Degenerate original CC0 model')
    origin=Vector(((lo.x+hi.x)/2,(lo.y+hi.y)/2,lo.z))
    # 1.0 scale retains actual asset size; reviewer sees native modeling.
    for placement,(px,py,pz) in enumerate(
          ([(-105,125,14),(106,445,16)] if index==0
          else [(108,235,7),(-151,733,11)])):
        anchor=bpy.data.objects.new('Poly Haven physically sized facade placement',None)
        scene.collection.objects.link(anchor)
        anchor.location=Vector((px,py,pz))-origin
        copies={}
        # Copy complete original node hierarchy, materials and local transform.
        for original in new:
            dupe=original.copy()
            if original.type=='MESH':dupe.data=original.data
            scene.collection.objects.link(dupe)
            copies[original]=dupe
        for original,dupe in copies.items():
            dupe.parent=copies.get(original.parent,anchor)
            dupe.matrix_parent_inverse=original.matrix_parent_inverse.copy()
            dupe.matrix_basis=original.matrix_basis.copy()
        imported_register.append(dict(asset=path.parent.name,placement=[px,py,pz],
                                      bounds=[round(v,3) for v in size],
                                      meshes=len(meshes)))
    # Original importer collection is a model library, not a second city
    # at origin. Unlink source nodes only after every shared mesh instance.
    for original in new:
        bpy.data.objects.remove(original,do_unlink=True)
    bpy.data.collections.remove(col)
# Scene-safe architectural sun and global skylight, no fake glossy neon fog.
sun=bpy.data.lights.new('Urban dusk sun','SUN');sun.energy=1.7
so=bpy.data.objects.new('Urban dusk sun',sun);scene.collection.objects.link(so)
so.rotation_euler=(.65,-.3,-.42)
def camera(name,pos,target,lens):
    c=bpy.data.cameras.new(name);o=bpy.data.objects.new(name,c)
    scene.collection.objects.link(o);o.location=pos
    o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
    c.lens=lens;c.clip_end=16000;scene.camera=o
views=[
('OBLIQUE',(-570,-600,350),(0,-23,119),42),
('FRONT',(0,-585,235),(0,-13,145),45),
('SIDE',(560,-30,310),(0,-10,130),43),
('AERIAL',(390,440,590),(0,-22,135),46),
('APPROACH',(0,-330,8),(0,35,36),46),
('FORWARD_300',(0,300,15),(0,850,84),45),
('FORWARD_700',(0,700,18),(0,1250,125),49)]
camera('G4E7BY principal studio review',*views[0][1:])
blend=out/'G4E7BY_ARCHITECTURE_TRANSIT_EDITABLE.blend'
bpy.ops.wm.save_as_mainfile(filepath=str(blend))
for name,pos,target,lens in views:
    camera('G4E7BY native artist '+name,pos,target,lens)
    scene.render.filepath=str(out/('G4E7BY_'+name+'_TRUE_CYCLES.png'))
    bpy.ops.render.render(write_still=True)
# glTF export is ART ONLY, explicitly exclude studio stage and lights.
bpy.ops.object.select_all(action='DESELECT')
for o in scene.objects:
    if o.type=='MESH' and not o.name.startswith('STUDIO ONLY'):
        o.hide_set(False);o.select_set(True)
if bpy.context.selected_objects:
    bpy.context.view_layer.objects.active=bpy.context.selected_objects[0]
    bpy.ops.export_scene.gltf(filepath=str(out/'G4E7BY_CITY_ART_ONLY.glb'),
           export_format='GLB',use_selection=True,export_yup=True)
provenance={'schema':'g4e7by-architecture-transit-original/1',
'claim':'ARTIST-STAGED-MODELS-AND-SCRIPTED-CITY-NOT-HAND-SCULPTED',
'thirdPartySources':[{'name':p.parent.name,'url':'https://polyhaven.com/a/'+p.parent.name,
'license':'CC0 1.0','sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
for p in sources],
'publicApiCredit':'Powered by Poly Haven',
'editedBlender':blend.name,'views':[r[0] for r in views],
'actualNativeGameCamera':'NOT_TESTED','humanGameplay':'HOLD',
'urbanArtQuality':'UNJUDGED','publication':'FORBIDDEN',
'officialSlope2Meters':0,'studioOnlyNotCollidable':True,
'originalAssetInstances':imported_register}
(out/'G4E7BY_PROVENANCE.json').write_text(json.dumps(provenance,indent=2))
print('G4E7BY_DRAFT_FOR_ART_REVIEW',json.dumps({'views':len(views),'PBRmodels':len(sources),
'instances':len(imported_register),'noPublish':True}))
