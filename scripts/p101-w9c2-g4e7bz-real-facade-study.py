# G4E-7BZ / PHASE A: inspect unassembled REAL CC0 facade kit before architecture.
# These are original Poly Haven geometry, not a built or playable city.
import bpy,sys,os,json,hashlib,math
from pathlib import Path
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:]
def argument(name):return Path(args[args.index(name)+1]).resolve()
asset_dir=argument('--assets')
dest=argument('--out');dest.mkdir(parents=True,exist_ok=True)
sources=[('apartments','modular_urban_apartments_facade'),('factory','modular_factory_facade')]
scene=bpy.context.scene
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
collection=bpy.data.collections.new('OFFICIAL POLY HAVEN CC0 UNASSEMBLED MODULE CATALOG')
scene.collection.children.link(collection)
scans=[]
for kind,slug in sources:
    path=asset_dir/slug/'source.gltf'
    if not path.is_file():raise RuntimeError('Official glTF source missing: '+str(path))
    before=set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=str(path))
    imported=[ob for ob in bpy.data.objects if ob not in before]
    mesh_objs=[ob for ob in imported if ob.type=='MESH']
    if len(mesh_objs)<10:raise RuntimeError('Unexpected low authentic part count '+kind)
    bpy.context.view_layer.update()
    meshes=[]
    for ob in mesh_objs:
        pts=[ob.matrix_world@Vector(c) for c in ob.bound_box]
        lo=[min(p[i] for p in pts) for i in range(3)]
        hi=[max(p[i] for p in pts) for i in range(3)]
        meshes.append(dict(name=ob.name,
            center=[round((lo[i]+hi[i])/2,3) for i in range(3)],
            min=[round(q,3) for q in lo],max=[round(q,3) for q in hi],
            size=[round(hi[i]-lo[i],3) for i in range(3)],
            tris=sum(len(poly.vertices)-2 for poly in ob.data.polygons),
            materials=[m.name for m in ob.data.materials if m]))
    lo=[min(obj['min'][i] for obj in meshes) for i in range(3)]
    hi=[max(obj['max'][i] for obj in meshes) for i in range(3)]
    scans.append(dict(kind=kind,slug=slug,glTFSha256=hashlib.sha256(path.read_bytes()).hexdigest(),
        sourcePartCount=len(meshes),sourceBounds=[round(hi[i]-lo[i],3) for i in range(3)],
        boundingMin=lo,boundingMax=hi,parts=meshes))
    # Show the apartment OR factory catalog, never one arbitrary huge block.
    for ob in imported:
        if ob.type=='MESH' and ob not in collection.objects.values():
            for co in list(ob.users_collection):co.objects.unlink(ob)
            collection.objects.link(ob)
        ob.hide_render=(kind!='apartments')
        ob.hide_set(False)
print('AUTHENTIC_CC0_COMPONENT_DIMENSIONS',json.dumps(
 [{k:v for k,v in scan.items() if k!='parts'} for scan in scans],ensure_ascii=False))
for scan in scans:
    parts=sorted(scan['parts'],key=lambda x:(-x['size'][0]*x['size'][2],x['name']))
    print('CC0_LARGEST_ARCHITECTURE_PARTS',scan['kind'],
          json.dumps(parts[:26],ensure_ascii=False))
dest.joinpath('G4E7BZ_SOURCE_COMPONENT_INVENTORY.json').write_text(
    json.dumps({'schema':'g4e7bz-real-pbr-unassembled-source/1',
    'review':'SOURCE INSPECTION ONLY / ART UNJUDGED',
    'originals':'Poly Haven / James Ray Cock CC0',
    'assets':scans,'notGameplay':True,'certifiedSlope2Meters':0,
    'release':'FORBIDDEN'},indent=2,ensure_ascii=False))
apt=scans[0]
low=apt['boundingMin']; high=apt['boundingMax']
origin=[(low[i]+high[i])/2 for i in range(3)]
# Avoid hiding the real originals behind a giant black/glossy plane.
def shader(name,rgba):
    mat=bpy.data.materials.new(name);mat.diffuse_color=rgba;mat.use_nodes=True
    bs=mat.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value=rgba;bs.inputs['Roughness'].default_value=.9
    return mat
bpy.ops.mesh.primitive_plane_add(size=1,location=(origin[0],origin[1],low[2]-.10))
floor=bpy.context.object;floor.name='STUDIO ONLY ground no GLB'
floor.scale=(100,45,1);floor.data.materials.append(shader('Studio floor',(.23,.27,.32,1)))
world=bpy.data.worlds.new('Studio blue grey') if not bpy.data.worlds else bpy.data.worlds[0]
scene.world=world;world.use_nodes=True
world.node_tree.nodes['Background'].inputs['Color'].default_value=(.34,.42,.51,1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value=.9
sun=bpy.data.lights.new('Glancing soft afternoon light','SUN');sun.energy=2
o=bpy.data.objects.new('Glancing soft afternoon light',sun);scene.collection.objects.link(o)
o.rotation_euler=(math.radians(35),math.radians(-24),math.radians(-28))
def camera(name,xyz,target,orthoscale):
    c=bpy.data.cameras.new(name);c.type='ORTHO';c.ortho_scale=orthoscale
    o=bpy.data.objects.new(name,c);scene.collection.objects.link(o)
    o.location=xyz;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
    scene.camera=o
scene.render.engine='CYCLES';scene.cycles.samples=24;scene.cycles.use_denoising=False
scene.view_layers[0].cycles.use_denoising=False
scene.render.resolution_x=1440;scene.render.resolution_y=900
scene.render.resolution_percentage=100
scene.render.threads_mode='FIXED';scene.render.threads=4
scene.render.image_settings.file_format='PNG'
views=[('FRONT',(origin[0],origin[1]-78,origin[2]+6),origin,67),
       ('OBLIQUE',(origin[0]+54,origin[1]-71,origin[2]+37),origin,77)]
for name,pos,target,scale in views:
    camera('Actual CC0 source parts '+name,pos,target,scale)
    scene.render.filepath=str(dest/('G4E7BZ_SOURCE_'+name+'_TRUE_CYCLES.png'))
    bpy.ops.render.render(write_still=True)
bpy.ops.wm.save_as_mainfile(filepath=str(dest/'G4E7BZ_SOURCE_INSPECTION_EDITABLE.blend'))
print('G4E7BZ_CC0_SOURCE_INVENTORY_DONE_NOT_ART_PASS')
