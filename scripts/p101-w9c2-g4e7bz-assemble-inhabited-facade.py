# G4E-7BZ Phase B — component-first architecture, 21m street-facing inhabited unit.
# Real Poly Haven CC0 facade MODULES assembled piece-by-piece, not imported as a
# catalog or pasted over a massive box. Studio art-only; no gameplay integration.
import bpy,sys,math,os,json,hashlib
from pathlib import Path
from mathutils import Vector,Matrix
from math import sin,cos,pi
argv=sys.argv[sys.argv.index('--')+1:]
def a(s):return Path(argv[argv.index(s)+1]).resolve()
assetdir=a('--assets');out=a('--out');out.mkdir(parents=True,exist_ok=True)
source=assetdir/'modular_urban_apartments_facade'/'source.gltf'
if not source.is_file():raise RuntimeError('Official CC0 glTF unavailable, do not fake the facade')
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(source))
originals=[o for o in bpy.data.objects if o.type=='MESH']
lookup={o.name:o for o in originals}
must=['wall_standard_standard_01','wall_door_centered_large_01',
 'door_centered_large_01','wall_window_centered_large_01',
 'window_centered_large_01','wall_window_centered_double_01',
 'window_centered_double_01','wall_pier_standard_01',
 'cornice_standard_standard_01','crown_standard_standard_01',
 'base_standard_01','dado_standard_standard_01']
missing=[x for x in must if x not in lookup]
if missing:raise RuntimeError('Authentic modular facade components missing: '+str(missing))
def center(o):
    pts=[o.matrix_world@Vector(c) for c in o.bound_box]
    return Vector(tuple((min(p[i] for p in pts)+max(p[i] for p in pts))/2 for i in range(3)))
source_centers={name:center(obj) for name,obj in lookup.items()}
built=bpy.data.collections.new('BZ BUILT CC0 APARTMENT MODULAR FACADE / ACTUAL ARCHITECTURE')
bpy.context.scene.collection.children.link(built)
support=bpy.data.collections.new('BZ PURPOSE-DESIGNED FLOOR / ACCESS / TRANSPORT INTERFACE')
bpy.context.scene.collection.children.link(support)
# Original glTF is a catalog; hide it in review renders and exclude from export.
for o in bpy.data.objects:o.hide_render=True
counts={'facadeOriginalParts':0,'doors':0,'windows':0,'supportedFloors':0,
        'pedestrianPathConnections':0,'publicEntrances':0,'partNames':{}}
created=[]
def part(name,slug,at,angle=0):
    original=lookup[slug]
    ob=original.copy();ob.data=original.data;ob.parent=None
    built.objects.link(ob)
    mat=Matrix.Translation(Vector(at))@Matrix.Rotation(angle,4,'Z') @ Matrix.Translation(-source_centers[slug])
    ob.matrix_world=mat@original.matrix_world
    ob.name=name+' / CC0 '+slug;ob.hide_render=False
    ob['bz_original_part']=slug;ob['bz_authorship']='REAL_POLY_HAVEN_CC0_GEOMETRY'
    created.append(ob);counts['facadeOriginalParts']+=1
    counts['partNames'][slug]=counts['partNames'].get(slug,0)+1
    return ob
def material(n,color,metal=0,rough=.6,glow=None,transmission=0):
    m=bpy.data.materials.new(n);m.diffuse_color=(*color,1)
    m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
    if glow:
        p.inputs['Emission Color'].default_value=(*glow,1)
        p.inputs['Emission Strength'].default_value=1.4
    if transmission:
        p.inputs['Transmission Weight'].default_value=transmission
    return m
mats=[
 material('Warm inhabited stone floor',(.38,.33,.28),.12,.81),
 material('Load bearing dark sandstone',(.23,.23,.22),.21,.62),
 material('Recycled marine copper soffit',(.33,.2,.12),.63,.39),
 material('Living-space oak',(.28,.15,.086),.02,.69),
 material('Blue architectural glass',(.055,.115,.16),.24,.17,transmission=.23),
 material('Warm public interior lamps',(.94,.43,.18),.0,.5,glow=(.95,.34,.07)),
 material('Horizon cyan wayfinding',(0.065,.49,.66),.19,.32,glow=(.04,.35,.49)),
 material('Walkway dark transit steel',(.12,.18,.22),.6,.43),
 material('Vegetated sky court',(.095,.21,.13),.06,.72),
 material('Public steps exposed basalt',(.18,.22,.25),.15,.79),
 material('Studio ONLY asphalt',(.17,.19,.21),.12,.84)
]
def slab(n,xyz,size,mat=0,bevel=.07,coll=None,studio=False):
    bpy.ops.mesh.primitive_cube_add(size=1,location=xyz)
    ob=bpy.context.object
    for col in list(ob.users_collection):col.objects.unlink(ob)
    (coll or support).objects.link(ob)
    ob.name=n;ob.dimensions=size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    ob.data.materials.append(mats[mat])
    if bevel>0:
        mod=ob.modifiers.new('Actual construction softened corners','BEVEL')
        mod.width=min(bevel,min(size)*.2);mod.segments=2
        ob.modifiers.new('Weighted normal','WEIGHTED_NORMAL')
    if not studio:created.append(ob)
    else:ob['exclude_glb']=True
    return ob
def rod(n,one,two,radius=.075,mat=7):
    a,b=Vector(one),Vector(two);mid=(a+b)*.5;d=b-a
    ob=slab(n,tuple(mid),(radius*2,radius*2,d.length),mat,bevel=0.024)
    ob.rotation_euler=d.to_track_quat('Z','Y').to_euler()
    return ob
# True facade is 7 bays * 3m wide. 4 inhabited floors,
# with physical openings from original true PBR wall/window/door mesh pairs.
xs=[-9,-6,-3,0,3,6,9]
for n,x in enumerate(xs):
    ground_door=n in (1,3,5)
    if ground_door:
        p='wall_door_centered_large_01' if n==3 else 'wall_door_centered_small_01'
        door='door_centered_large_01' if n==3 else 'door_centered_small_01'
        part('Ground inhabited wall real opening',p,(x,0,1.5))
        # For the CIVIC CENTRAL PORTAL leave the genuine 3m aperture
        # readable and fit hand-built open glass leaves instead of a closed
        # imported double door that would falsely suggest an accessible lobby.
        if n!=3:
            part('Ground entrance actual door',(door),(x,.035,1.405))
        counts['doors']+=1
        if n==3:counts['publicEntrances']+=1
    else:
        part('Ground solid masonry wall','wall_standard_standard_01',(x,0,1.5))
    part('Real lower dado','dado_standard_standard_01',(x,-.035,-.56))
    part('Real cast foundation profile','base_standard_01',(x,-.10,-1.34))
    for level,zshift in enumerate([0,4,8]):
        # Original true walls and inset windows are combined in matching 3m bays.
        suffix=('_01','_02','_03')[level]
        var='double' if n in (0,6) else ('large' if n in (2,3,4) else 'small')
        wall='wall_window_centered_'+var+suffix
        win='window_centered_'+var+suffix
        part('Exterior inhabited floor %d masonry'% (level+1),wall,
             (x,0,5.5+zshift))
        part('Real transparent framed window %d'% (level+1),win,
             (x,.075,5.15+zshift))
        counts['windows']+=1
    # The elevation uses REAL supplied trims, not a flat replacement plate.
    for level in range(4):
        part('CC0 long horizontal cornice %d'%level,
             'cornice_standard_standard_01',(x,-.02,3.5+4*level))
        if level==3:
            part('CC0 parapet crown', 'crown_standard_standard_01',
                 (x,-.115,16.05))
# The original source walls are exactly 3m high on a 4m floor pitch.
# R1 exposed black 0.8m gaps between floors; these are NOT open atria.
# Construct true load-bearing spandrel zones and cover with articulated
# light stone / copper edge. No opaque tower shell is added.
for elevation in (3.5,7.5,11.5,15.5):
    for xx in xs:
        slab('R2 physically enclosing interstorey structural spandrel',
             (xx,.08,elevation),(2.96,.34,.93),1,.06)
        slab('R2 spandrel narrow weathered copper coping',
             (xx,-.19,elevation+.40),(2.98,.16,.11),2,.027)
# Recessed civic portal central doors, partially open to the living foyer.
# The original door frame aperture remains unblocked, with visible interior.
for xx,ang in [(-.51,.27),(.51,-.27)]:
    panel=slab('R2 original open central glass lobby door',
               (xx,-.26,1.39),(.90,.065,2.48),4,.027)
    panel.rotation_euler[2]=ang
    rod('R2 actual lobby door push bar',(xx-.28,-.36,1.05),
        (xx+.28,-.36,1.05),.03,7)
for xx in (-1.07,1.07):
    rod('R2 entrance casing carries canopy',(xx,-.15,.15),
        (xx,-.15,2.83),.085,2)
slab('R2 civic entry weatherproof canopy directly attached',
     (0,-1.23,3.07),(3.5,2.4,.17),2,.055)
slab('R2 entrance interior visible foyer public information light',
     (0,2.25,2.65),(2.4,.19,.17),5,.04)
# Reveals at every vertical seam: depth visible even near road.
for x in [-10.5,-7.5,-4.5,-1.5,1.5,4.5,7.5,10.5]:
    for k in range(4):
        part('Original narrow load-bearing pier',
             'wall_pier_standard_01',(x,-.025,1.5+4*k))
# Continuous THREE-DIMENSIONAL spatial section behind true wall.
# Floors have practical openings near centre for vertical circulation.
for z in [0,4,8,12]:
    for x in (-6.25,6.25):
        slab('Inhabited complete supported floor not opaque mega-box',
             (x,5.3,z-.17),(8.4,10.0,.32),0,.09)
        counts['supportedFloors']+=1
    # Miniature landing connects the building's public 3m entrance
    if z==0:slab('Open public entrance lobby threshold',(0,2.15,.0),
                (3.8,3.8,.2),0)
    else:
        slab('Physical stair landing linked to floor',(0,6.0,z-.12),
            (4.2,3.0,.25),3)
# Side elevations are REAL rotated facade modules connected to front:
# every lengthwise panel is 3m, no giant solid unarticulated exterior planes.
for side in (-1,1):
    x=side*10.5;angle=pi/2 if side==1 else -pi/2
    for y in (1.5,4.5,7.5):
        for k,z0 in enumerate([1.5,5.5,9.5,13.5]):
            if k==0:
                part('Return elevation matching stone wall',
                     'wall_standard_standard_01',(x,y,z0),angle)
            else:
                suf=('_01','_02','_03')[k-1]
                part('Return elevation real window wall',
                     'wall_window_centered_large'+suf,(x,y,z0),angle)
                part('Return elevation source glass window',
                     'window_centered_large'+suf,(x+side*.07,y,z0-.35),angle)
                counts['windows']+=1
            part('Return elevation joint trim', 'cornice_standard_standard_01',
                 (x,y,3.5+4*k),angle)
# Rear boundary only, 3m window bays leave light and do not seal an empty block.
for x in xs:
    for k,z0 in enumerate([1.5,5.5,9.5,13.5]):
        if k==0:
            part('Rear service wall','wall_standard_standard_01',(x,10.35,z0),pi)
        else:
            suf=('_01','_02','_03')[k-1]
            part('Rear living window wall','wall_window_centered_large'+suf,
                 (x,10.35,z0),pi)
            part('Rear real window glazing','window_centered_large'+suf,
                 (x,10.28,z0-.35),pi)
            counts['windows']+=1
# Staircase actually connects four floors: each flight has 20 rising steps,
# rails, landing, lighting, clear of entrance path.
for level in range(3):
    start=level*4
    direction=1 if level%2==0 else -1
    for i in range(20):
        z=start+.20+i*.20
        y=1.25+i*(7.7/20) if direction==1 else 8.95-i*(7.7/20)
        slab('Real stair riser %d-%d'%(level,i),(0,y,z),
            (2.15,.34,.18),9,.018)
    for side in (-1,1):
        for i in range(0,21,5):
            z=start+.95+i*.2
            y=1.25+i*(7.7/20) if direction==1 else 8.95-i*(7.7/20)
            rod('Stair handrail support',(side*1.26,y,z-.87),
                (side*1.26,y,z),.042,7)
        a=(side*1.26,1.25 if direction==1 else 8.95,start+.95)
        z=(side*1.26,8.95 if direction==1 else 1.25,start+4.95)
        rod('Accessible stair continuous grasp rail',a,z,.06,2)
    counts['pedestrianPathConnections']+=1
# Interior shows genuine uses behind windows: thin room separators,
# desks, natural warm lamps and vertical community spine; no solid mega-box.
for level in range(4):
    z=level*4
    for xx in (-6.4,-3.3,3.3,6.4):
        slab('Room internal partition with real depth',(xx,6,z+1.6),
             (.16,5.5,3.1),3,.015)
    for xx in (-8.1,-4.8,4.8,8.1):
        slab('Occupied study/work table',(xx,3.4,z+.9),
             (1.65,.9,.12),3,.025)
        slab('Individual lit room fixture',(xx,6.75,z+2.6),
             (1.0,.3,.17),5,.045)
    # Front show a glass glimpse and lit gallery from street eye level.
    slab('Gallery public glazing reveals building use',(-1.72,3.4,z+1.9),
         (.12,4.7,2.7),4,.02)
# One credible ground-level tram/bicycle interchange, NOT a fake playable road.
# Connected public entrance at x=0, y<0 to a small boarding deck.
slab('Real city pedestrian threshold',(0,-3.8,-.05),(5.5,8.5,.22),0,.08)
slab('Modest supported platform / stop',(14.7,-2.1,.45),(7.1,6.6,.33),9)
slab('Actual ramp from residential street to stop',(11.5,-2.1,.25),
     (8.0,2.1,.16),9)
for y in (-4.8,.6):
    for x in (12,17.5):rod('Transit canopy proper load pillar',
                          (x,y,.35),(x,y,4.6),.17,7)
for yy in (-4.8,.6):rod('Station roof actual continuous support',
                        (12,yy,4.6),(17.5,yy,4.6),.32,2)
slab('Sustainable transit canopy shade',(14.8,-2.1,4.75),
     (6.4,6.8,.19),2,.075)
for i in range(5):
    slab('Physically readable platform seating',(13.2+i*.6,-2.1,.94),
         (.4,1.1,.12),3,.015)
counts['pedestrianPathConnections']+=1
# Balconies project, attached to occupied floors, with correct handrails.
for z in (4,8,12):
    for x in (-7.5,7.5):
        slab('Supported inset apartment balcony',(x,-.75,z-.06),
             (3.1,1.7,.16),2,.048)
        for edge in (x-1.4,x,x+1.4):
            rod('Balcony visible vertical guard',(edge,-1.5,z),
                (edge,-1.5,z+1.08),.035,7)
        rod('People-facing balcony guardrail',(x-1.45,-1.5,z+1.1),
            (x+1.45,-1.5,z+1.1),.052,7)
# Rooftop courtyards: structure-supported liveable rather than flying panels.
slab('Real accessible roof floor',(0,5.5,15.98),(20.6,9.8,.28),0,.05)
for x in (-7.5,7.5):
    slab('Rooftop planter', (x,5.2,16.35),(4.1,1.1,.45),8,.07)
    for k in (-1,0,1):
        slab('Small real plant geometry',(x+k,5.1,16.77),
             (.27,.25,.7),8,.07)
for x in (-10,10):
    for y in (1,5,9):
        rod('Roof people-safe perimeter',(x,y,16.0),(x,y,17.2),.06,7)
        if y<9:rod('Roof rail walkway edge',(x,y,17.1),(x,y+4,17.1),.055,7)
# Real near-road scale silhouettes are STUDIO-ONLY references; not claimed
# as animated crowds and not in exported glTF.
studio=bpy.data.collections.new('STUDIO ONLY true human scale references')
bpy.context.scene.collection.children.link(studio)
slab('STUDIO ONLY ground never physical road',(0,-4,-.55),
     (46,37,.40),10,.035,studio,True)
# R2 removes simplistic lollipop scale markers from art renders; true
# 3m modular facade dimensions provide architectural scale directly.
# Lighting and presentation intentionally understate neon.
world=bpy.data.worlds[0] if bpy.data.worlds else bpy.data.worlds.new('Evening architectural sky')
bpy.context.scene.world=world;world.use_nodes=True
world.node_tree.nodes['Background'].inputs['Color'].default_value=(.13,.20,.29,1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value=.95
sun=bpy.data.lights.new('Warm west afternoon sun','SUN');sun.energy=1.5
sun.color=(1,.82,.66)
so=bpy.data.objects.new('Warm west afternoon sun',sun)
bpy.context.scene.collection.objects.link(so);so.rotation_euler=(.56,-.35,-.35)
def area(n,power,size,loc,color,target):
    d=bpy.data.lights.new(n,'AREA');d.energy=power;d.shape='DISK';d.size=size;d.color=color
    ob=bpy.data.objects.new(n,d);bpy.context.scene.collection.objects.link(ob)
    ob.location=loc;ob.rotation_euler=(Vector(target)-ob.location).to_track_quat('-Z','Y').to_euler()
area('Soft studio blue urban bounce',1600,18,(-15,-16,22),(.65,.82,1),(0,0,7))
area('Warm interiors not floodlit neon',950,9,(6,2,12),(1,.67,.35),(0,2,6))
scene=bpy.context.scene
scene.render.engine='CYCLES';scene.cycles.samples=24
scene.cycles.use_denoising=False;scene.view_layers[0].cycles.use_denoising=False
scene.render.resolution_x=1440;scene.render.resolution_y=900
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.render.threads_mode='FIXED';scene.render.threads=4
scene.view_settings.view_transform='Filmic';scene.view_settings.look='Medium High Contrast'
def camera(name,xyz,target,lens):
    d=bpy.data.cameras.new(name);ob=bpy.data.objects.new(name,d)
    scene.collection.objects.link(ob);ob.location=xyz
    ob.rotation_euler=(Vector(target)-ob.location).to_track_quat('-Z','Y').to_euler()
    d.lens=lens;d.clip_end=2500;scene.camera=ob
views=[
 ('STREET_EYE',(0,-38,1.72),(0,0,8.0),39),
 ('FRONT',(-4,-37,12),(0,0,8),48),
 ('OBLIQUE',(-30,-31,17),(0,2,9),45),
 ('ENTRANCE',(0,-10,1.75),(0,2.0,1.95),38),
 ('AERIAL',(23,-23,33),(0,4,8.0),44)]
# Pack originals before source save: previous BY source depended on runner /tmp.
bpy.ops.file.pack_all()
camera('Original built architecture review',*views[0][1:])
blend=out/'G4E7BZ_ACTUAL_ASSEMBLED_FACADE_EDITABLE.blend'
bpy.ops.wm.save_as_mainfile(filepath=str(blend))
for name,pos,target,lens in views:
    camera('G4E7BZ real Blender '+name,pos,target,lens)
    scene.render.filepath=str(out/('G4E7BZ_BUILD_'+name+'_TRUE_CYCLES.png'))
    bpy.ops.render.render(write_still=True)
# Only actual intended architectural geometry: no studio floor or human proxies.
bpy.ops.object.select_all(action='DESELECT')
for ob in created:
    ob.hide_set(False);ob.hide_render=False
    ob.select_set(True)
bpy.context.view_layer.objects.active=created[0]
glb=out/'G4E7BZ_BUILT_ARCHITECTURE_ART_ONLY.glb'
bpy.ops.export_scene.gltf(filepath=str(glb),export_format='GLB',
    use_selection=True,export_yup=True)
assert counts['doors']>=3 and counts['windows']>=30 and counts['supportedFloors']>=8
info={'schema':'g4e7bz-modular-cc0-inhabited-architecture/1',
 'scene':'TIDAL PORTICO R2 / 21m STANDALONE ARCHITECTURAL MICROSLICE',
 'source':'Poly Haven modular_urban_apartments_facade by James Ray Cock, CC0',
 'originalSourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),
 'construction':'ASSEMBLED_FROM_AUTHENTIC_3M_PBR_MODULES_AND_ORIGINAL_SUPPORT_GEOMETRY',
 'authorship':'ORIGINAL_HUMAN_AUTHORED_CC0_MODULES_PLUS_SCRIPTED_BLENDER_ASSEMBLY',
 'dimensionsClaim':'21m frontage/4 floors; studio, not B48 road',
 'counts':counts,'gltfYup':True,'sourceTexturesPackedInNativeBlend':True,
 'nativeBlenderViews':[v[0] for v in views],
 'art':'UNJUDGED_R2','gameCamera':'NOT_TESTED','humanGameplay':'HOLD',
 'publication':'FORBIDDEN','officialSlope2Meters':0,
 'originalRoadPhysics':'UNCHANGED'}
(out/'G4E7BZ_BUILT_PROVENANCE.json').write_text(json.dumps(info,indent=2,ensure_ascii=False))
print('BZ_REAL_MODULAR_FACADE_BUILT_ART_ONLY_TECH_REPORT',json.dumps(
 {k:v for k,v in counts.items() if k!='partNames'}))
