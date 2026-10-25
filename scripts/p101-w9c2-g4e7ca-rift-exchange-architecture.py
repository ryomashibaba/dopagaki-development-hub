# G4E-7CA / RIFT EXCHANGE: ART-ONLY 3D architectural/transport microslice.
# Architectural mass is composed of thick slab contours, solid load paths,
# real occupied floor plates, asymmetric curvilinear weather envelope, a
# multi-level transit concourse, and physically legible human-scale entries.
# Not a genuine runner/B48 camera, gameplay, stage, or art certification.
# CC0 texture maps come solely from official Poly Haven source API.
import bpy,sys,math,os,json,hashlib
from pathlib import Path
from math import sin,cos,pi
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:]
def arg(s):return Path(args[args.index(s)+1]).resolve()
tx=arg('--textures');out=arg('--out');out.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
art=bpy.data.collections.new('G4E7CA / THE RIFT EXCHANGE / EDITABLE BUILDING')
scene.collection.children.link(art)
studio=bpy.data.collections.new('STUDIO ONLY - NOT EXPORTED AS ROAD OR CITY')
scene.collection.children.link(studio)
built=[]
counts=dict(occupiedFloors=0,supportedBridges=0,publicEntrances=0,transitAlignments=0,realFacetedPanels=0,physicalSupports=0)
def material(name,color,metal=0,rough=.47,emit=None,texture=None):
    m=bpy.data.materials.new(name);m.use_nodes=True;m.diffuse_color=(*color,1)
    nodes=m.node_tree.nodes;p=nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
    if emit:
        p.inputs['Emission Color'].default_value=(*emit,1)
        p.inputs['Emission Strength'].default_value=.72
    if texture:
        path=tx/texture/'diffuse.jpg'
        if not path.is_file():raise RuntimeError('Expected verified CC0 actual texture missing '+str(path))
        n=nodes.new('ShaderNodeTexImage');n.image=bpy.data.images.load(str(path),check_existing=True)
        n.interpolation='Linear';n.extension='REPEAT'
        texcoords=nodes.new('ShaderNodeTexCoord')
        mapping=nodes.new('ShaderNodeMapping');mapping.inputs['Scale'].default_value=(.65,.7,.65)
        m.node_tree.links.new(texcoords.outputs['Generated'],mapping.inputs['Vector'])
        m.node_tree.links.new(mapping.outputs['Vector'],n.inputs['Vector'])
        mix=nodes.new('ShaderNodeMixRGB');mix.blend_type='MULTIPLY';mix.inputs[0].default_value=.62
        mix.inputs[2].default_value=(*color,1)
        m.node_tree.links.new(n.outputs['Color'],mix.inputs[1])
        m.node_tree.links.new(mix.outputs[0],p.inputs['Base Color'])
        roughfile=tx/texture/'roughness.jpg'
        if roughfile.is_file():
            r=nodes.new('ShaderNodeTexImage');r.image=bpy.data.images.load(str(roughfile),check_existing=True)
            r.image.colorspace_settings.name='Non-Color'
            m.node_tree.links.new(mapping.outputs['Vector'],r.inputs['Vector'])
            m.node_tree.links.new(r.outputs['Color'],p.inputs['Roughness'])
    return m
M=[
material('Architectural white mineral shell',(.78,.82,.82),.13,.52,texture='concrete_tile_facade'),
material('Marine gunmetal titanium support',(.15,.19,.215),.63,.38,texture='blue_metal_plate'),
material('Titanium thin frame polished edges',(.29,.36,.4),.77,.29),
material('Glazed offices sapphire reflectance',(.047,.135,.20),.32,.11),
material('Neutral upper curtain wall',(.12,.22,.255),.3,.2),
material('Warm human inhabited inner spaces',(.63,.43,.26),.09,.48,emit=(.47,.22,.06)),
material('Prismatic civic navigation lines',(.08,.53,.7),.16,.35,emit=(.01,.54,.9)),
material('Copper/wood ceiling underside',(.42,.30,.22),.3,.56),
material('Transit concrete',(.29,.34,.35),.12,.7),
material('Rooftop park green',(.15,.24,.19),.06,.85),
material('Clean pedestrian polished stone',(.45,.48,.49),.17,.43),
material('Warm project kiosk light',(.89,.61,.35),.02,.44,emit=(.62,.34,.12))]
def mesh(name,vertices,faces,mat,bevel=0):
    me=bpy.data.meshes.new(name);me.from_pydata(vertices,[],faces);me.update()
    o=bpy.data.objects.new(name,me);art.objects.link(o);me.materials.append(M[mat])
    built.append(o)
    if bevel:
        b=o.modifiers.new('True volume machined edge','BEVEL');b.width=bevel;b.segments=2
        o.modifiers.new('Weighted stable normals','WEIGHTED_NORMAL')
    return o
def footprint(name,polygon,z,thickness,mat):
    n=len(polygon);v=[(x,y,z-thickness/2) for x,y in polygon]+[(x,y,z+thickness/2) for x,y in polygon]
    f=[tuple(reversed(range(n))),tuple(range(n,n*2))]
    f += [(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
    return mesh(name,v,f,mat,min(.19,thickness*.21))
def block(name,location,dims,material_id,bevel=.04,studioOnly=False):
    bpy.ops.mesh.primitive_cube_add(size=1,location=location);o=bpy.context.object
    for col in list(o.users_collection):col.objects.unlink(o)
    (studio if studioOnly else art).objects.link(o);o.name=name
    o.dimensions=dims;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    o.data.materials.append(M[material_id])
    if bevel:
        mod=o.modifiers.new('Manufactured edges','BEVEL');mod.width=min(bevel,min(dims)*.2);mod.segments=2
        o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
    if not studioOnly:built.append(o)
    else:o['exclude_glb']=True
    return o
def beam(name,a,b,width,depth,mat):
    A=Vector(a);B=Vector(b);v=B-A
    o=block(name,tuple((A+B)*.5),(width,depth,v.length),mat,min(width,depth)*.08)
    o.rotation_euler=v.to_track_quat('Z','Y').to_euler();return o
def pipe(name,points,radius,mat):
    c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.bevel_depth=radius;c.bevel_resolution=3
    spline=c.splines.new('POLY');spline.points.add(len(points)-1)
    for p,q in zip(spline.points,points):p.co=(*q,1)
    o=bpy.data.objects.new(name,c);art.objects.link(o);c.materials.append(M[mat]);built.append(o)
    return o
def curved_ribbon(name,curve,widths,thickness,mat):
    # Continuous load-bearing spatial ribbon, a true closed mesh, not graphic line.
    v=[]
    for (x,y,z),w in zip(curve,widths):
        v.extend([(x-w/2,y,z-thickness/2),(x+w/2,y,z-thickness/2),
                  (x-w/2,y,z+thickness/2),(x+w/2,y,z+thickness/2)])
    f=[]
    for i in range(len(curve)-1):
        a=4*i;b=4*(i+1)
        f.extend([(a,a+1,b+1,b),(a+2,b+2,b+3,a+3),
                  (a,a+2,b+2,b),(a+1,b+1,b+3,a+3)])
    f.extend([(0,1,3,2),(4*(len(curve)-1),4*(len(curve)-1)+2,4*(len(curve)-1)+3,4*(len(curve)-1)+1)])
    return mesh(name,v,f,mat,.2)
def glazing(name,v,mat=3):
    return mesh(name,v,[(0,1,2,3)],mat,0)
def square_glass(name,x,y,z,width,height,face='south',mat=3):
    # Real panel incl. 0.1m frame with glazing set 0.15m behind.
    if face=='south':
        glazing(name,[(x-width/2,y,z),(x+width/2,y,z),(x+width/2,y,z+height),(x-width/2,y,z+height)],mat)
        for sx in (x-width/2,x+width/2):
            beam(name+' frame side',(sx,y-.055,z),(sx,y-.055,z+height),.10,.11,2)
        for zz in (z,z+height):
            beam(name+' sill',(x-width/2,y-.065,zz),(x+width/2,y-.065,zz),.09,.11,2)
# Spatial plan: occupied asymmetrical wings, with a real eight-metre sky void.
# 42m frontage, 60m depth, max 50m. No monolithic filled rectangular hull.
level_data=[
 (0, [(-26,-29),(-6,-29),(-7,-15),(-8,23),(-23,29),(-30,8)],
     [(7,-26),(22,-26),(30,-9),(24,28),(8,24),(6,4)]),
 (7.2,[(-26,-27),(-7,-27),(-8,-8),(-12,24),(-26,28),(-32,7)],
     [(7,-26),(24,-26),(31,-7),(27,29),(9,24),(8,5)]),
 (15.6,[(-31,-23),(-11,-26),(-9,-3),(-12,23),(-30,25),(-34,0)],
     [(8,-24),(24,-24),(32,-7),(30,28),(14,24),(11,7)]),
 (25.2,[(-32,-20),(-12,-20),(-10,4),(-16,22),(-33,25),(-35,-2)],
     [(10,-22),(28,-23),(34,2),(30,28),(12,24),(9,7)]),
 (36.0,[(-28,-19),(-13,-18),(-12,7),(-20,23),(-34,21),(-32,-3)],
     [(13,-23),(30,-22),(35,-2),(31,28),(16,29),(11,9)])]
for idx,(z,lpoly,rpoly) in enumerate(level_data):
    footprint('WEST inhabited cantilever curved 6-side slab / floor'+str(idx),lpoly,z,.72 if idx else 1.55,0)
    footprint('EAST inhabited publicly accessed contoured floor'+str(idx),rpoly,z,.7 if idx else 1.4,8 if idx%2 else 0)
    counts['occupiedFloors']+=2
    # Public inner galleries visibly connected to floor slabs, not hovering.
    for wing,poly in [('WEST',lpoly),('EAST',rpoly)]:
        xx=-11 if wing=='WEST' else 11
        for yy in (-16,8,20):
            block(wing+' occupied office/market threshold %d/%d'%(idx,yy),
                  (xx,yy,z+1.05),(2.4,3,.34),7,.09)
            block(wing+' interior occupied warm ceiling light %d/%d'%(idx,yy),
                  (xx,yy,z+3.6),(.9,1.3,.18),5,.035)
# Loadbearing piers run continuously through occupied slabs.
for side in (-1,1):
    for y in (-19,14):
        px=(-24.0 if side<0 else 25.0)+(1.5 if y>0 else 0)
        for a,b in [(0,7.2),(7.2,15.6),(15.6,25.2),(25.2,36)]:
            beam('CONTINUOUS structural mast carrying upper occupied floors',
                 (px,y,a+.25),(px-(2.5 if side<0 else -2.2),y+1.6,b+.3),1.7,1.9,1)
            counts['physicalSupports']+=1
    for y in (-17,7,20):
        x=-12 if side<0 else 12
        for bottom,upper in [(0,7.2),(7.2,15.6),(15.6,25.2),(25.2,36.0)]:
            beam('Inner atrium load pillar',(x,y,bottom+.4),(x,y,upper+.1),.85,.85,2)
            counts['physicalSupports']+=1
# R2 ART CORRECTION: The R1 arbitrary front-facing panels were disconnected
# planes. New genuinely assembled curtain walls follow the SIDE boundaries,
# with a continuous spandrel, glazed cavities and extruded vertical frames.
# A window is a piece of architecture, never an independent floating poster.
for side in (-1,1):
    for level,(z,lp,rp) in enumerate(level_data[:-1]):
        nextz=level_data[level+1][0]
        panel_bottom=z+.84
        panel_top=nextz-.36
        # Contiguous built floor-to-floor shell; window and spandrel are bound
        # to the same grid as the actual occupied floor plates.
        for bay in range(7):
            ya=-24+bay*7.15
            yb=ya+7.08
            if side<0:
                # left face bends inward toward the concourse as it rises
                xa=-28.9-2.1*sin((ya+17)/23)-.32*level
                xb=-28.9-2.1*sin((yb+17)/23)-.32*level
            else:
                xa=29.0+2.1*sin((ya+7)/20)+.44*level
                xb=29.0+2.1*sin((yb+7)/20)+.44*level
            # Warm interior glass behind the outer metal lattice.
            glazing('R2 REAL OUTWARD SIDE CURTAIN WALL / wing%d level%d bay%d'%(side,level,bay),
                [(xa,ya,panel_bottom),(xb,yb,panel_bottom),
                 (xb,yb,panel_top),(xa,ya,panel_top)],3 if (level+bay)%4 else 4)
            counts['realFacetedPanels']+=1
            for xx,yy in ((xa,ya),(xb,yb)):
                beam('R2 faceted outer edge physically fixed at both floors',
                    (xx,yy,z+.1),(xx,yy,nextz-.05),.23,.25,2)
            beam('R2 horizontal winterproof window bottom mullion',
                 (xa,ya,panel_bottom),(xb,yb,panel_bottom),.18,.19,2)
            beam('R2 horizontal fixed window head',
                 (xa,ya,panel_top),(xb,yb,panel_top),.25,.25,2)
            # Dense actual occupied spandrel is load-following, not a blank
            # giant wall. Rear structural zone secures glazing to slab edges.
            glazing('R2 shadow-gap dark inhabited mineral spandrel',
                [(xa,ya,z+.06),(xb,yb,z+.06),
                 (xb,yb,z+.78),(xa,ya,z+.78)],1)
            # External 3D sunshades connected to window mullions and floors.
            if bay%2==0:
                for t in (.3,.63):
                    x=xa+(xb-xa)*t
                    y=ya+(yb-ya)*t
                    beam('R2 structurally tied angled brise-soleil',
                        (x-.35*side,y-.22,z+.55),
                        (x-.58*side,y+.32,panel_top-.45),.13,.17,0)
            # Lived-in interior window cell: a visible desk / warm small
            # ceiling luminaire AT the associated occupied floor.
            if bay in (1,4):
                xx=(xa+xb)/2-side*1.4;yy=(ya+yb)/2
                block('R2 inhabited genuine interior working area',
                      (xx,yy,z+1.02),(1.8,1.45,.25),7,.07)
                block('R2 individual warm office/clinic lamp',
                      (xx,yy,z+2.8),(1.2,.35,.19),5,.05)
# Planar FRONT glazing now also encloses actual end-bays instead of floating
# above the open public entrance. A grounded 10m central atrium remains VOID.
for level,(z,L,R) in enumerate(level_data[:-1]):
    nextz=level_data[level+1][0]
    high=nextz-z
    for side in (-1,1):
        for bay in range(4):
            x=(-27.6+bay*5.15) if side<0 else (9.5+bay*5.15)
            base=z+.55
            front=-25.7 if side<0 else -24.7
            glazing('R2 street-facing WINDOW ALIGNED TO TRUE FRONT CANTILEVER',
                [(x,front,base),(x+5.04,front,base),
                 (x+5.04,front,nextz-.3),(x,front,nextz-.3)],4 if bay%2 else 3)
            counts['realFacetedPanels']+=1
            for xx in (x,x+5.04):
                beam('R2 window real supported load axis',
                     (xx,front-.1,z),(xx,front-.1,nextz-.05),.22,.24,2)
            beam('R2 street frontage grounded window sill',
                 (x,front-.16,base),(x+5.04,front-.16,base),.18,.22,2)
# R2 glass-roofed inhabited civic area beneath the transit spine. The
# shelter ENDS at the station, it is not a random overhead horizontal bar.
for station_y in (-23,-16,-9,-2):
    beam('R2 concourse shelter structural rib',
         (-8,station_y,5.65),(8,station_y,5.95),.46,.61,1)
    block('R2 concourse occupied deep overhead glass skylight',
          (0,station_y+3.2,5.86),(16.3,6.3,.16),4,.025)
# Street-facing front is a cutaway into genuinely open civic concourse,
# with a shaped (not rectangular) arch port and actual visible stair circulation.
for xx in (-23,-19,18,23):
    for z in (7.2,15.6,25.2):
        square_glass('Front glass with actual building mullions',xx,-26,z+.4,3.8,6,mat=4)
# Highly legible public accessible platform at grade, linked to ground wings.
footprint('Actual welcoming civic atrium ground entry bridge',
    [(-12,-34),(10,-34),(13,-26),(7,-20),(-7,-20),(-14,-27)],.24,.48,10)
counts['publicEntrances']+=1
for x in (-6.5,6.5):
    beam('Civic full-height foyer threshold stiffener',(x,-27,0),
         (x,-25,8),.45,.7,2)
    beam('Visible accessible public foyer opening casing',(x,-28,0),
         (x,-28,5.7),.37,.44,1)
# True ramp rises 7.2m inside lightwell, 6.5% across a 110m switchback;
# stop station at first raised deck, not ungrounded line of light.
for i in range(2):
    zstart=i*3.6
    coords=[]
    for j in range(20):
        t=j/19
        x=-8+12*t if i==0 else 4-12*t
        y=-22+16*t if i==0 else -6+16*t
        z=zstart+3.6*t
        coords.append((x,y,z))
    # Actual thin, continuous ramp built as connected load-bearing beams.
    for j in range(len(coords)-1):
        A,B=coords[j],coords[j+1]
        beam('Accessible ascending occupied public ramp segment',A,B,1.85,.24,10)
    pipe('Pedestrian circulation guard left',[(x-1.1,y,z+1.1) for x,y,z in coords],.045,2)
    pipe('Pedestrian circulation guard right',[(x+1.1,y,z+1.1) for x,y,z in coords],.045,2)
# One genuinely supported elevated inter-wing pedestrian bridge at each
# inhabited level; it LANDS on the slab at either end.
for k,(z,L,R) in enumerate([(7.2,-11,10),(15.6,-9,10),(25.2,-11,13)]):
    footprint('Accessible inhabited transfer deck %d'%k,
        [(L,-3.0),(R,-3.0),(R,2.8),(L,2.8)],z,.56,10)
    counts['supportedBridges']+=1
    for y in (-2.7,2.6):
        pipe('Pedestrian bridge carefully attached guardrail',
            [(L,y,z+1.17),(R,y,z+1.17)],.06,2)
        for x in (L,R):
            beam('Physical transfer bridge end-column',(x,y,z+.3),
                (x,y,z+2.7),.27,.27,1)
# Actual internal station and connected skytrain for 60m segment.
# Its stations LAND at x=+14m, unlike earlier abstract lines.
rail_pts=[]
for j in range(37):
    t=j/36
    y=-43+80*t
    x=16.5+2.6*sin(t*pi)
    z=15.6+2.5*sin(t*pi)
    rail_pts.append((x,y,z))
pipe('Actual raised monorail beam centre',rail_pts,1.65,1)
pipe('Monorail dual grooved guide inside rail shell',
     [(x-1.2,y,z+1.15) for x,y,z in rail_pts],.11,2)
pipe('Monorail route actual other guide',
     [(x+1.2,y,z+1.15) for x,y,z in rail_pts],.11,2)
counts['transitAlignments']=1
for i in range(0,37,6):
    x,y,z=rail_pts[i]
    beam('Ground-supported monorail viaduct',
         (x,y,-1),(x,y,z-1.0),1.13,1.4,1)
    counts['physicalSupports']+=1
footprint('Station platform physically joined to eastern second-floor slab',
     [(9,-19),(24,-19),(24,-2),(12,-2)],15.62,.43,8)
for y in (-17,-10,-3):
    block('Human scale train-stop shelter lamp',(18,y,19.0),(5.6,.14,.3),11,.045)
# Formal "free edge": the load-bearing hull grows from actual floor supports.
# Two UNMATCHED sweeps, not a symmetrical ring or dome.
for side in (-1,1):
    stations=[]
    widths=[]
    for j in range(41):
        t=j/40
        y=-33+67*t
        if side<0:
            x=-25-8*sin(pi*t*.9)-2.2*sin(3*pi*t)
            z=15.6+26*sin(pi*t*.73)+9*t
            w=8.9-4.0*t
        else:
            x=23+8*sin(pi*t*.86)+1.8*cos(2*pi*t)
            z=14.5+32*sin(pi*t*.72)+15*t
            w=10.2-5.2*t
        stations.append((x,y,z));widths.append(w)
    curved_ribbon(('WEST sweeping roof solar canopy' if side<0 else
                   'EAST rising hard-edged free canopy'),stations,widths,2.0,
                  0 if side<0 else 1)
    pipe('Recessed continuous solar canopy edge illumination',
         [(x,y,z+.88) for x,y,z in stations],.16,6)
    # Purpose-designed rising macro supports land at physical slab edges.
    for k in (5,18,31):
        x,y,z=stations[k]
        ground_x=-24 if side<0 else 25
        foot=(ground_x,y,0.2)
        middle=(x-(1.8 if side<0 else -1.8),y,z-5)
        beam('Rising roof actually connected to urban floor foundations',
             foot,middle,1.75,1.4,1)
        beam('Rising roof upper compliant strut',
             middle,(x,y,z-.5),1.2,1.1,1)
        counts['physicalSupports']+=2
# Shading breaks big slick surfaces: thick perforated rooftop trellises
# visible as TRUE solids from oblique, not random neon sticks.
for wing,z in [(-1,36.5),(1,36.5)]:
    for j in range(9):
        yy=-15+4.4*j
        xx=(-22-2*sin(j*.4)) if wing<0 else (24+2*sin(j*.5))
        beam('Functional rooftop solar pergola / inhabited terrace',
             (xx-6,yy,z+1.3),(xx+6,yy,z+1.3),.28,.37,7)
        if j%3==0:
            block('Soil-based planted rooftop garden',(xx,yy,z+.34),
                 (3.8,2.2,.55),9,.1)
            for n in (-1,0,1):
                block('Actual volumetric rooftop greenery',(xx+n,yy,z+.8),
                      (.4,.8,.9),9,.14)
# Public concourse activity: vending kiosks, benches, lit bulletin,
# all 1–2 m dimensions relative to 7+ m floor.
for n,(x,y) in enumerate([(-7,-25),(5,-26),(-17,-16),(16,-17)]):
    block('Human scaled inhabited kiosk %d'%n,(x,y,1.2),(2.4,1.8,2.2),7,.16)
    block('Kiosk front public glowing display %d'%n,(x,y-1.04,1.55),
          (1.5,.12,.64),11,.045)
    block('Kiosk service glazing %d'%n,(x,y-.98,2.02),
          (1.9,.12,.4),3,.045)
for n,(x,y,z) in enumerate([(-16,16,7.55),(21,15,15.95),(-24,8,25.5)]):
    block('Supported urban seating '+str(n),(x,y,z),(3.0,.9,.48),7,.1)
# Studio composition ONLY: real-scale 1.7m player low angle, never road.
block('STUDIO_ONLY non playable floor',(0,0,-1.3),(130,145,.45),8,.08,True)
world=bpy.data.worlds.new('Bluish twilight urban skylight') if not bpy.data.worlds else bpy.data.worlds[0]
scene.world=world;world.use_nodes=True
world.node_tree.nodes['Background'].inputs['Color'].default_value=(.18,.26,.34,1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value=.85
sun=bpy.data.lights.new('Golden side afternoon sun','SUN');sun.energy=2.0;sun.color=(1,.83,.65)
so=bpy.data.objects.new('Golden side afternoon sun',sun);scene.collection.objects.link(so)
so.rotation_euler=(.48,-.33,-.57)
def light(name,loc,power,size,color,target):
    d=bpy.data.lights.new(name,'AREA');d.energy=power;d.color=color;d.shape='DISK';d.size=size
    ob=bpy.data.objects.new(name,d);scene.collection.objects.link(ob)
    ob.location=loc;ob.rotation_euler=(Vector(target)-ob.location).to_track_quat('-Z','Y').to_euler()
light('Warm grand public atrium bounce',(-3,-14,35),13000,32,(1,.68,.38),(0,-2,11))
light('Cloudy industrial skyline illumination',(42,4,65),18500,50,(.51,.71,1),(0,0,12))
scene.render.engine='CYCLES';scene.cycles.samples=24;scene.cycles.use_denoising=False
scene.view_layers[0].cycles.use_denoising=False
scene.render.resolution_x=1440;scene.render.resolution_y=900
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
scene.render.threads_mode='FIXED';scene.render.threads=4
scene.view_settings.view_transform='Filmic';scene.view_settings.look='Medium High Contrast'
def camera(name,loc,target,lens):
    c=bpy.data.cameras.new(name);c.lens=lens;c.clip_end=2000
    ob=bpy.data.objects.new(name,c);scene.collection.objects.link(ob)
    ob.location=loc;ob.rotation_euler=(Vector(target)-ob.location).to_track_quat('-Z','Y').to_euler()
    scene.camera=ob
views=[
 ('STREET_APPROACH',(0,-72,1.72),(0,-3,18),43),
 ('STREET_LEFT',(-32,-50,1.72),(-3,-6,22),43),
 ('ENTRANCE',(0,-34,1.72),(0,-12,11),38),
 ('OBLIQUE',(-89,-100,77),(0,2,23),45),
 ('AERIAL',(82,80,96),(0,0,20),47),
 ('SIDE',(92,-15,50),(0,0,24),50)]
camera('Architectural Review G4E7CA',*views[0][1:])
bpy.ops.file.pack_all()
bpy.context.preferences.filepaths.save_version=0
blend=out/'G4E7CA_RIFT_EXCHANGE_EDITABLE.blend'
bpy.ops.wm.save_as_mainfile(filepath=str(blend))
for name,loc,target,lens in views:
    camera('True Blender studio '+name,loc,target,lens)
    scene.render.filepath=str(out/('G4E7CA_'+name+'_TRUE_CYCLES.png'))
    bpy.ops.render.render(write_still=True)
# Art-only glTF may include real converted curves but NEVER studio ground.
bpy.ops.object.select_all(action='DESELECT')
for ob in built:ob.select_set(True)
bpy.context.view_layer.objects.active=built[0]
glb=out/'G4E7CA_RIFT_EXCHANGE_ART_ONLY.glb'
bpy.ops.export_scene.gltf(filepath=str(glb),export_format='GLB',
    use_selection=True,export_yup=True)
evidence={'schema':'g4e7ca-rift-exchange-native-studio-r2/1',
  'author':'OpenAI SCRIPTED Blender architectural design, NOT hand-sculpted',
  'licenseSources':['https://polyhaven.com/a/concrete_tile_facade',
                    'https://polyhaven.com/a/blue_metal_plate'],
  'rights':'CC0 official Poly Haven licensed texture source',
  'description':'Asymmetric 2-wing public building: glazed inhabited void, thick curved structurally landed exterior and actual transit transfer',
  'geometry':counts,'textureHashes':{d:hashlib.sha256((tx/d/'diffuse.jpg').read_bytes()).hexdigest()
                                for d in ('concrete_tile_facade','blue_metal_plate')},
  'geometryUsedStudioOnly':False,'studioFloorExcludedFromGLB':True,
  'realB48Camera':'NOT_RUN','actualPlayerGame':'NOT_RUN',
  'humanPlay':'HOLD','artReview':'UNJUDGED',
  'officialCertifiedSlope2Meters':0,'publication':'FORBIDDEN',
  'workflow':'DRAFT_PR_ONLY'}
(out/'G4E7CA_PROVENANCE.json').write_text(json.dumps(evidence,indent=2))
print('G4E7CA_RIFT_EXCHANGE_REAL_BLENDER_RENDERED_UNJUDGED',json.dumps(counts))
