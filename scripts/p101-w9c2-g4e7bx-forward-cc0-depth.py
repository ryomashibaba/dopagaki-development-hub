# G4E-7BX / FORWARD CITY STUDY. Genuine manually produced CC0 module meshes.
# Scene arrangement script uses art-directed site coordinates, not procedural
# tower prisms. Kenney is human-authored CC0, not OpenAI-created source art.
# All renders are Blender studio, never gameplay / B48 / art acceptance proof.
import bpy, sys, os, math, json, hashlib, zipfile, random
from pathlib import Path
from mathutils import Vector
random.seed(9820)
argv=sys.argv[sys.argv.index('--')+1:]
def arg(k):
    return argv[argv.index(k)+1]
source=Path(arg('--source'))
archive=Path(arg('--archive'))
assetdir=Path(arg('--assetdir'))
output=Path(arg('--out'))
output.mkdir(parents=True,exist_ok=True)
if not source.is_file() or not archive.is_file():
    raise RuntimeError('Original BW-R3 source or CC0 pack was not downloaded')
sha=hashlib.sha256(archive.read_bytes()).hexdigest()
bpy.ops.wm.open_mainfile(filepath=str(source.resolve()))
scene=bpy.context.scene
scene.render.engine='CYCLES'
scene.cycles.samples=22
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
world=scene.world
world.use_nodes=True
world.node_tree.nodes['Background'].inputs['Color'].default_value=(.11,.18,.24,1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value=.9
lib=bpy.data.collections.new('CC0 HUMAN-MODELLED KENNEY CITY / EDITABLE STUDY')
scene.collection.children.link(lib)
models=sorted([p for p in assetdir.rglob('*.glb')
    if 'skyscraper' in p.stem.lower() or 'building' in p.stem.lower()])
if len(models)<7:
    raise RuntimeError('Downloaded human-made city kit has fewer than 7 building/skyscraper GLBs: '+repr([p.name for p in models]))
tall=[p for p in models if 'skyscraper' in p.stem.lower()]
others=[p for p in models if 'building' in p.stem.lower()]
chosen=(tall[:5]+others[:8])
if len(chosen)<8: raise RuntimeError('Too few unique modular architectural files')
print('KENNEY_CURATED_GLBS', json.dumps([p.name for p in chosen]))
# Read incoming glTF vertex geometry and preserve the original authored face
# triangulation, UV data/material slots and hierarchy by JOINing a mesh group.
# Each original file is imported exactly once; duplicate instances then share
# the true artists' mesh datablocks, not rebuilt cubes.
catalog=[]
for idx,path in enumerate(chosen):
    before=set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=str(path))
    imported=[o for o in bpy.data.objects if o not in before]
    meshes=[o for o in imported if o.type=='MESH']
    if not meshes:
        raise RuntimeError('GLB has no actual mesh: '+str(path))
    bpy.ops.object.select_all(action='DESELECT')
    for o in meshes:
        o.hide_set(False)
        o.select_set(True)
    active=meshes[0];bpy.context.view_layer.objects.active=active
    # Join has to work with parents / glTF transform nodes; preserve world transform.
    for o in meshes:
        o.matrix_world=o.matrix_world.copy()
    bpy.ops.object.join()
    combined=bpy.context.view_layer.objects.active
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    original_vertices=[v.co.copy() for v in combined.data.vertices]
    lo=Vector((min(v.x for v in original_vertices),
               min(v.y for v in original_vertices),
               min(v.z for v in original_vertices)))
    hi=Vector((max(v.x for v in original_vertices),
               max(v.y for v in original_vertices),
               max(v.z for v in original_vertices)))
    size=hi-lo
    if size.z<.01 or size.x<.01 or size.y<.01:
        raise RuntimeError('Degenerate human-modelled building '+str(path))
    # Preserve real 3D details and original materials, move origin to ground.
    center=Vector(((lo.x+hi.x)/2,(lo.y+hi.y)/2,lo.z))
    for v in combined.data.vertices:v.co-=center
    proto=combined.data
    # Import roots/empties no longer necessary after bmesh merge.
    for o in imported:
        if o.name in bpy.data.objects:
            bpy.data.objects.remove(o,do_unlink=True)
    catalog.append((path,proto,tuple(size)))
# These authored placements are the visual composition; they are not gameplay
# track segments. Columns: bank, forward Y metres, final height, depth row,
# source index, rotation. Heights are art-only and need human-scale review.
sites=[
 (-1,286,118,0,1,-9),(1,327,142,0,4,13),
 (-1,377,174,0,7,0),(1,412,212,0,3,7),
 (-1,493,249,0,0,-4),(1,517,185,0,6,9),
 (-1,612,288,0,2,5),(1,651,261,0,9,-7),
 (-1,739,333,0,8,11),(1,787,301,0,1,0),
 (-1,871,371,0,4,-4),(1,934,403,0,3,5),
 (-1,1035,421,0,2,2),(1,1107,448,0,0,-6),
 (-1,1220,491,0,8,8),(1,1259,468,0,7,-10),
 (-1,1383,520,0,4,-7),(1,1456,554,0,1,6),
 (-1,350,156,1,10,23),(1,379,179,1,5,-17),
 (-1,546,193,1,6,25),(1,586,240,1,11,8),
 (-1,755,302,1,3,13),(1,848,314,1,0,-11),
 (-1,964,368,1,4,0),(1,1050,337,1,6,3),
 (-1,1217,409,1,2,-18),(1,1338,425,1,9,20),
 (-1,1547,507,1,10,12),(1,1614,482,1,7,-10),
 (-1,557,211,2,9,-8),(1,704,284,2,8,10),
 (-1,1060,460,2,11,14),(1,1165,412,2,5,-12)]
record=[]
for i,(side,y,height,row,which,rotation) in enumerate(sites):
    path,proto,size=catalog[which%len(catalog)]
    scale=height/size[2]
    horizontal=max(30,size[0]*scale)
    # Anchor inner facades outside the 70m open visual corridor; no false road.
    x=side*(75+horizontal*.52+row*120)
    o=bpy.data.objects.new('Kenney original '+path.stem+' / articulated site '+str(i),proto)
    lib.objects.link(o)
    o.location=(x,y,-12 if row==0 else -17)
    o.scale=(scale,scale,scale)
    o.rotation_euler[2]=math.radians(rotation)
    record.append({'source':path.name,'position':[round(x,3),y,o.location.z],
                   'heightMeters':height,'row':row,'sourceMeshMeters':list(size)})
# Night/blue-hour city reading: giant area lights reduce crude flat silhouettes.
def area(name,loc,power,color,span,target):
    data=bpy.data.lights.new(name,'AREA');data.energy=power;data.color=color
    data.shape='DISK';data.size=span
    ob=bpy.data.objects.new(name,data);scene.collection.objects.link(ob)
    ob.location=loc
    ob.rotation_euler=(Vector(target)-ob.location).to_track_quat('-Z','Y').to_euler()
area('Forward city amber reflection',(680,1100,780),2200000,(1,.77,.52),
     1250,(0,750,180))
area('Forward city blue sky fill',(-650,820,1100),2000000,(.45,.72,1),
     1250,(0,900,170))
# A physical studio stage avoids the fake endless void. It is specifically
# tagged render only, excluded from the GLB, not a fake playable ground.
for ob in scene.objects:
    if ob.type=='MESH' and ob.get('exclude_glb'):
        ob.location.y=650
        ob.location.z=-27
        ob.dimensions=(2400,3600,7)
        bpy.context.view_layer.objects.active=ob
        ob.select_set(True)
        bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
        ob.select_set(False)
# Independent cameras, five previous settings IDENTICAL, two new perspectives.
views=[
 ('OBLIQUE',(-570,-600,350),(0,-23,119),42),
 ('FRONT',(0,-585,235),(0,-13,145),45),
 ('SIDE',(560,-30,310),(0,-10,130),43),
 ('AERIAL',(390,440,590),(0,-22,135),46),
 ('APPROACH',(0,-330,8),(0,35,36),46),
 ('FORWARD_300',(0,300,15),(0,850,84),45),
 ('FORWARD_700',(0,700,18),(0,1250,125),49)]
def make_camera(label,pos,target,lens):
    data=bpy.data.cameras.new(label)
    obj=bpy.data.objects.new(label,data)
    scene.collection.objects.link(obj);obj.location=pos
    obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()
    data.lens=lens;data.clip_end=18000
    scene.camera=obj
# Source .blend retains all CC0 meshes and the original BW-R3 native authoring.
bl=os.path.join(output,'G4E7BX_FORWARD_CITY_EDITABLE.blend')
make_camera('G4E7BX principal artist camera',*views[0][1:])
bpy.ops.wm.save_as_mainfile(filepath=bl)
for label,pos,target,lens in views:
    make_camera('Native '+label,pos,target,lens)
    scene.render.filepath=str(output/('G4E7BX_'+label+'_TRUE_CYCLES.png'))
    bpy.ops.render.render(write_still=True)
# Export AFTER Cycles to avoid known Blender Linux packed texture crashes.
bpy.ops.object.select_all(action='DESELECT')
for o in scene.objects:
    if o.type=='MESH' and not o.get('exclude_glb',False):o.select_set(True)
bpy.context.view_layer.objects.active=next(iter(bpy.context.selected_objects))
bpy.ops.export_scene.gltf(filepath=str(output/'G4E7BX_CC0_URBAN_DEPTH_ONLY.glb'),
    export_format='GLB',use_selection=True,export_yup=True)
report={'schema':'g4e7bx-city-forward-cc0-intake-1',
 'method':'Artist-made CC0 modular Blender asset staging, no new fake road',
 'humanAuthoredThirdParty':'Kenney City Kit Commercial v2.1',
 'license':'CC0 1.0 Universal',
 'authorOriginalBW':'OpenAI scripted Blender authoring - no hand sculpt claim',
 'artistAssetSource':'https://kenney.nl/assets/city-kit-commercial',
 'sourceMirror':'https://opengameart.org/content/city-kit-commercial',
 'originalPackSHA256':sha,'modelSources':[p.name for p in chosen],
 'placements':record,'roadPhysics':'UNTOUCHED',
 'studioViews':'ACTUAL_BLENDER_CYCLES_NOT_GAMEPLAY',
 'humanApproval':'HOLD','officialSlope2Meters':0,'publicRelease':'FORBIDDEN'}
(output/'G4E7BX_CC0_PROVENANCE.json').write_text(json.dumps(report,indent=2))
print('CITY_PACK_CC0_ORIGINAL_ART_WORKFLOW_COMPLETE',
      json.dumps({'selected':len(chosen),'placements':len(record),'sha256':sha,
       'views':len(views),'approval':'HOLD'}))
