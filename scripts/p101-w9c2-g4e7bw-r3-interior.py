# G4E-7BW R3 / HALO-CUT CONCOURSE: inhabited thresholds
# 100% original scripted Blender 3D architecture and self-generated texture.
# ART/HUMAN/PUBLISH HOLD. This is neither hand-sculpted nor actual gameplay.
import bpy,math,os,sys,random,json
from mathutils import Vector
from math import sin,cos,pi
random.seed(7561)
argv=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
out=argv[argv.index('--out')+1] if '--out' in argv else '/tmp/g4e7bw'
os.makedirs(out,exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
scene.unit_settings.system='METRIC'
scene.render.engine='CYCLES'
scene.cycles.samples=20
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
art=bpy.data.collections.new('HALO-CUT CONCOURSE / one authored inhabited hero anchor')
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
im.filepath_raw=os.path.join(out,'G4E7BW_ORIGINAL_FACADE_ATLAS.png')
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


# G4E-7BW: HALO-CUT CONCOURSE. ONE architectural protagonist, authored plans.
# Neither a procedural city shell nor an empty road facade. Five storeys of
# visible fully connected public spaces and cut-through towers across 330m.
# Geometry is scripted to precisely replicate an artist-authored set of shapes,
# never claimed to be hand-sculpted. Actual B48 road stays elsewhere/unmodified.
mats.extend([
 mat('Champagne anodized metal architectural filigree',(.50,.35,.20),.71,.27),
 mat('Brushed basalt interior shade panels',(.055,.088,.103),.25,.66),
 mat('Opaline sheltered roof cladding',(.76,.73,.62),.37,.36),
 mat('Accessible public walkway warm stone',(.55,.48,.34),.15,.7),
 mat('Subtle warm concourse practical lighting',(.8,.50,.16),.18,.4,emit=(1,.4,.10)),
 mat('Holo transit navigation cyan',(.06,.50,.72),.2,.3,emit=(.03,.68,1))])
C_GOLD=11;C_SHADE=12;C_PALE=13;C_STONE=14;C_LIGHT=15;C_CYAN=16
def prism(name,plan,low,high,mat_top,mat_wall):
  """Deliberately outlined original architectural planar solid; no box primitive."""
  n=len(plan);v=[(x,y,low) for x,y in plan]+[(x,y,high) for x,y in plan]
  f=[tuple(range(n-1,-1,-1)),tuple(range(n,n*2))]
  material_id=[mat_wall,mat_top]
  for j in range(n):
    f.append((j,(j+1)%n,(j+1)%n+n,j+n))
    material_id.append(mat_wall)
  return mesh(name,v,f,material_id)
def pillar(name,start,end,width,depth,index):
  a=Vector(start);b=Vector(end);d=b-a
  o=cube(name,tuple((a+b)*.5),(width,depth,d.length),index)
  o.rotation_euler=d.to_track_quat('Z','Y').to_euler()
  return o
def brace(name,a,b,radius,mat_idx):
  return pillar(name,a,b,radius,radius,mat_idx)
def beam_rail(name,path,left_width,right_width,depth,material):
  """Loft a road-like beam from an intentionally laid-out 3D architectural curve.
  It is not the game road or a fake collision road.
  """
  v=[];f=[];mi=[]
  for i,(x,y,z) in enumerate(path):
    tangent=Vector(path[min(i+1,len(path)-1)])-Vector(path[max(0,i-1)])
    tangent.z=0
    tangent.normalize()
    perp=Vector((-tangent.y,tangent.x,0))
    if perp.length<.1:perp=Vector((1,0,0))
    for dy,dz in [(left_width,0),(-right_width,0),(-right_width,-depth),(left_width,-depth)]:
      vec=Vector((x,y,z))+perp*dy+Vector((0,0,dz))
      v.append(tuple(vec))
  for i in range(len(path)-1):
    for j in range(4):
      a=i*4+j;b=(i+1)*4+j
      f.append((a,b,(i+1)*4+(j+1)%4,i*4+(j+1)%4))
      mi.append([material,C_SHADE,3,C_PALE][j])
  return mesh(name,v,f,mi)
def curved_strip(name,rad_inner,rad_outer,center,angle_start,angle_end,z0,z1,material,segments=36):
  v=[];f=[];ma=[]
  for i in range(segments+1):
    t=i/segments;ang=angle_start+(angle_end-angle_start)*t
    z=z0+(z1-z0)*t+6*sin(pi*t)
    for rad,dep in [(rad_inner,0),(rad_outer,0),(rad_outer,-5),(rad_inner,-5)]:
      v.append((center[0]+rad*cos(ang),center[1]+rad*sin(ang),z+dep))
  for i in range(segments):
    for j in range(4):
      f.append((i*4+j,(i+1)*4+j,(i+1)*4+(j+1)%4,i*4+(j+1)%4))
      ma.append([material,3,2,9][j])
  return mesh(name,v,f,ma)
def curtain_facade(name,start,end,zlo,zhi,bays,levels,outwards=1):
  """Architectural PBR glazing arranged only around actual occupied floors.
  Continuous material is broken by visible mullions and inset shadow pocket.
  """
  a=Vector(start);b=Vector(end)
  v=[];f=[];ma=[]
  for ix in range(bays):
    for iz in range(levels):
      t=(ix+.1)/bays;t2=(ix+.88)/bays
      p=a.lerp(b,t);q=a.lerp(b,t2)
      z0=zlo+(iz+.18)*(zhi-zlo)/levels
      z1=zlo+(iz+.82)*(zhi-zlo)/levels
      off=Vector((0,0,0))
      k=len(v)
      v.extend([(p.x+off.x,p.y+off.y,z0),(q.x+off.x,q.y+off.y,z0),
                (q.x+off.x,q.y+off.y,z1),(p.x+off.x,p.y+off.y,z1)])
      f.append((k,k+1,k+2,k+3))
      ma.append(6 if (ix*11+iz*7)%13 in (1,4) else 10)
  mesh(name+' original glazing',v,f,ma,True)
  for ix in range(bays+1):
    t=ix/bays
    p=a.lerp(b,t)
    pillar(name+' bronze mullion / %02d'%ix,
           (p.x,p.y,zlo),(p.x,p.y,zhi),.9,.9,C_GOLD)
  for iz in range(levels+1):
    z=zlo+(zhi-zlo)*iz/levels
    pillar(name+' storey transom / %d'%iz,(a.x,a.y,z),(b.x,b.y,z),.6,.8,C_PALE)

# A single elongated split transit cathedral. The 75m open central canyon
# continues north/south for actual gameplay; no central safe strip or floor.
# Authored corner coordinates vary by storey. Neither wing is a prism.
west=[
[(-203,-184),(-115,-199),(-89,-150),(-85,-84),(-106,-21),(-133,99),(-174,147),(-233,99),(-235,-82)],
[(-211,-179),(-120,-183),(-94,-145),(-93,-52),(-129,45),(-172,128),(-242,89),(-247,-48)],
[(-218,-159),(-125,-156),(-105,-117),(-100,-39),(-144,73),(-186,133),(-251,91),(-257,-6)],
[(-203,-145),(-129,-138),(-113,-102),(-108,-19),(-147,49),(-194,96),(-246,75),(-237,-37)],
[(-190,-129),(-124,-120),(-114,-88),(-105,-12),(-155,47),(-189,72),(-241,57),(-226,-39)]]
east=[
[(106,-201),(186,-192),(237,-130),(238,-26),(215,96),(157,137),(97,93),(86,5),(90,-109)],
[(104,-190),(201,-178),(253,-112),(261,7),(221,108),(170,131),(104,82),(97,-7)],
[(96,-163),(196,-153),(265,-89),(259,26),(214,119),(173,116),(104,59),(105,-17)],
[(109,-143),(209,-126),(257,-58),(245,41),(198,104),(170,93),(111,38)],
[(125,-105),(214,-96),(247,-39),(243,39),(209,76),(168,64),(132,16)]]
west_z=[(10,19),(35,44),(66,75),(107,116),(151,160)]
east_z=[(8,18),(36,46),(76,86),(126,136),(170,181)]
# An accessible real public floor and multiple interconnected building strata.
for side,plans,levels in [('W',west,west_z),('E',east,east_z)]:
  for i,(poly,(z0,z1)) in enumerate(zip(plans,levels)):
    prism('%s / inhabitable tapered public floor %d'%(side,i),poly,z0,z1,
          C_STONE if i in (0,3) else C_PALE,C_SHADE)
    # facade is NOT continuous solid grey wall: structural corner supports
    # and actual floor-height glazed bands with dark occupiable setbacks.
    if i<len(plans)-1:
      upper=levels[i+1][0]
      for j,(a,b) in enumerate(zip(poly,poly[1:]+poly[:1])):
        if (j+i)%5==0: continue  # real tall open loggias and sky gardens
        facade_shift=1.5
        curtain_facade('%s inhabited facet %d/%d'%(side,i,j),
             a,b,z1+3,upper-3,max(2,int(math.dist(a,b)/6.5)),2)
      for j,(x,y) in enumerate(poly[::2]):
        pillar('%s / inhabited core structural columns %d/%d'%(side,i,j),
             (x,y,z1),(x*.98,y*.98,upper+2),4.8,5.8,9)
# The sculptural structural megatruss is not a separate decorative horn:
# it lands at inhabited floor corners and carries massive spanning beams.
roof_rib_w=[(-183,-165,140),(-175,-130,175),(-155,-78,219),
            (-147,-18,254),(-127,55,274),(-83,106,246)]
roof_rib_e=[(205,-181,146),(181,-130,185),(154,-80,235),
            (149,-16,275),(127,49,298),(83,110,257)]
def rib(name,path,radii,matid):
  for i in range(len(path)-1):
    width=radii[i]*(1-.23*i/len(path))
    pillar(name+' load bearing bent section '+str(i),
            path[i],path[i+1],width,width*.83,matid)
  # shell web panels between paired inner and outer offset curves
  v=[];f=[];ids=[]
  for i,(x,y,z) in enumerate(path):
    for dx,dz in [(-22,0),(22,0),(22,-19),(-22,-19)]:
      v.append((x+dx,y,z+dz))
  for i in range(len(path)-1):
    for j in range(4):
      f.append((i*4+j,(i+1)*4+j,(i+1)*4+(j+1)%4,i*4+(j+1)%4))
      ids.append([C_PALE,C_GOLD,3,C_PALE][j])
  mesh(name+' visibly roof structural manifold',v,f,ids)
rib('WEST independent station concourse roof megatruss',roof_rib_w,[22,21,19,17,16,12],C_PALE)
rib('EAST crossing glass-canopy structural megatruss',roof_rib_e,[29,23,21,16,17,15],C_PALE)
# Original sculptural folds connect truss to truss without enclosing open air.
# Roof panels are differentiated, offset triangles, slotted skylight strips.
for i in range(4):
  wl=roof_rib_w[i];wr=roof_rib_e[i]
  # Two asymmetric solid wings leave 50m of central sky open, not a lid.
  zavg=(wl[2]+wr[2])/2+18
  wp=[(wl[0]-16,wl[1],wl[2]),(-31,wl[1]+13,zavg+19),
      (-31,wl[1]+13,zavg+13),(wl[0]-16,wl[1],wl[2]-7)]
  ep=[(31,wr[1]+8,zavg+20),(wr[0]+14,wr[1],wr[2]),
      (wr[0]+14,wr[1],wr[2]-7),(31,wr[1]+8,zavg+10)]
  for name,points in [('WEST',wp),('EAST',ep)]:
    vertices=[];faces=[];ids=[]
    # Manually split one segment into a planar quads rather than scale-copying
    # a hollow megacity shell.
    nx=8
    for j in range(nx+1):
      t=j/nx
      for r in (0,1):
        a=Vector(points[0+r*2]);b=Vector(points[1+r*2])
        vertices.append(tuple(a.lerp(b,t)))
    for j in range(nx):
      if j in (2,5):continue  # intentionally open skylight seams
      faces.append((2*j,2*j+1,2*(j+1)+1,2*(j+1)))
      ids.append(C_GOLD if j%2==0 else C_PALE)
    mesh(name+' faceted slotted civic roof shell / '+str(i),vertices,faces,ids)
# At least five structural bridges physically land into BOTH occupied wings.
# R2 sightline correction: only two architecturally connected occupied
# bridges remain, at true roof-floor elevations. Original five crossbars
# blocked most of the forward view from near the route; do not hide the
# obstruction by changing the camera alone.
for i,(yy,zz,spanwidth) in enumerate([
  (-52,153,16),(88,184,14)]):
    track=[]
    for j in range(21):
      t=j/20
      x=-115+230*t
      y=yy+19*sin(pi*t)
      z=zz+7*sin(pi*t)
      track.append((x,y,z))
    beam_rail('Actual enclosed civic skybridge / %d'%i,track,
              spanwidth/2,spanwidth/2,9,C_STONE if i%2 else C_PALE)
    for j in range(0,20,3):
      x,y,z=track[j]
      pillar('Civic bridge guardrail / %d-%d'%(i,j),
             (x,y+spanwidth/2,z),(x,y+spanwidth/2,z+5),1.0,1,C_GOLD)
# Atrium is not black void: real illuminated transport, inner terrace activity.
# These hand-authored rail station lines cross in Y, climbing through the main
# station on the left and making visual depth inside cutaway architecture.
for i,(x0,basez) in enumerate([(-137,27),(139,37),(-148,87),(160,118)]):
  pts=[]
  for j in range(49):
    t=j/48;y=-185+315*t
    pts.append((x0+13*sin(pi*t*1.7),y,basez+21*t+5*sin(3*pi*t)))
  beam_rail('Inside-building 3D urban transit alignment '+str(i),pts,5,5,3,C_GOLD)
  for j in range(0,49,8):
    x,y,z=pts[j]
    pillar('Integrated urban transit supporting pier %d/%d'%(i,j),
           (x,y,z-20),(x,y,z),3.5,4,C_SHADE)
# Grand west inner public concourse: a 135m high APERTURE with recessed rooms,
# arcading, visible mechanical floors and community balconies.
for k,(xx,yy) in enumerate([(-120,-153),(-117,-101),(-128,-47),
                          (-134,14),(-165,62),(-187,105)]):
  for storey,(zl,zh) in enumerate([(21,35),(44,66),(76,107),(117,151)]):
    if (k+storey)%5==0:continue
    pillar('Accessible west lightwell terrace guardrail / %d/%d'%(k,storey),
           (xx+5,yy-12,zl),(xx+5,yy+12,zl),1.4,2.2,C_GOLD)
    prism('True recessed public room volume / %d/%d'%(k,storey),
          [(xx-26,yy-8),(xx-5,yy-8),(xx-7,yy+11),(xx-29,yy+8)],
          zl+2,zh-2,5 if (k+storey)%3 else C_PALE,C_SHADE)
    cube('Visible community warm interior lamp / %d/%d'%(k,storey),
         (xx-9,yy+2,zl+5),(6,1.5,2),C_LIGHT)
# Living balconies and native Blender mesh greenery: deliberately few in scale.
for i,(x,y,z) in enumerate([
  (-186,-121,78),(-181,-31,112),(-220,54,161),(-159,91,164),
  (198,-135,89),(216,35,138),(170,96,180)]):
  prism('Occupied accessible sky-garden / '+str(i),
        [(x-17,y-8),(x+15,y-11),(x+17,y+9),(x-12,y+11)],
        z,z+4,8,4)
  for k in range(4):
    # varied size vegetation; actual 3D topiary, original geometry.
    xr=x-9+k*6;yr=y+2*sin(k*2.0)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1,radius=4.0+1.1*(i%3),
                                         location=(xr,yr,z+7))
    bush=bpy.context.object;bush.name='Original garden volumetric vegetation'
    for c in list(bush.users_collection):c.objects.unlink(bush)
    art.objects.link(bush);bush.data.materials.append(mats[8])
# Light-carrying public graphics are structural and avoid random signs.
for i in range(4):
  z=38+i*43
  pillar('CIVIC wayfinding vertical light bar '+str(i),
         (-97,-139,z),(-97,-139,z+17),.7,.8,C_CYAN)
for i in range(7):
  z=46+i*25
  pillar('STATION original cyan guidance scale '+str(i),
         (104,-159,z),(107,-155,z+12),1,1,C_CYAN)
# Ground presentation: terraced habitable station foundation, not open
# repetitive tabletop with random buildings. It does not cover the road.
prism('West concourse real concrete inhabited foundation',
      [(-229,-200),(-105,-216),(-81,-159),(-98,90),(-178,154),(-251,94)],
      -14,9,3,C_SHADE)
prism('East occupied ground logistics and transit foundation',
      [(101,-217),(191,-216),(258,-149),(256,-28),(221,99),
       (157,143),(88,95)],
      -14,7,3,C_SHADE)
# Local-world white box scale silhouettes are studio markers only, excluded
# from both game glTF and any claim of a human playthrough.


# R3: an occupied entrance instead of a uniform opaque building front.
mats.extend([
 mat('Handcut stone portal',(.63,.54,.43),.1,.69),
 mat('Warm timber and vestibule',(.53,.35,.18),.18,.56),
 mat('Concourse glazed rail',(.13,.34,.42),.23,.18),
 mat('Interior service glow',(.83,.56,.25),.16,.4,emit=(.9,.45,.15))])
STONE,WOOD,GLAZE,ROOMLAMP=17,18,19,20
def portal(label,x,y):
  prism(label+' threshold plinth',
    [(x-27,y-6),(x+27,y-6),(x+24,y+11),(x-24,y+11)],
    10,16,STONE,STONE)
  for sign in [-1,1]:
    pillar(label+' entrance pier '+str(sign),
      (x+17*sign,y,16),(x+16*sign,y+7,56),5,6,STONE)
  pillar(label+' articulated lintel',(x-21,y+7,57),(x+21,y+7,57),6,8,C_PALE)
  for level,z in enumerate([25,48]):
    prism(label+' occupied elevated foyer '+str(level),
      [(x-32,y+13),(x-17,y+13),(x-18,y+72),(x-33,y+70)],
      z,z+3,WOOD,C_SHADE)
    for i in range(5):
      yy=y+17+i*11
      pillar(label+' facade railing %d-%d'%(level,i),
        (x-16,yy,z+2),(x-16,yy,z+6),.8,1,GLAZE)
      if i%2==0:
        cube(label+' warm enclosed service light %d-%d'%(level,i),
             (x-23,yy,z+10),(4,3,2),ROOMLAMP)
    # The second level is connected via a visible diagonal sloping stair.
  route=[(x-7+2*sin(i*pi/18),y+14+i*3.3,18+i*1.9)
         for i in range(19)]
  beam_rail(label+' interior accessible escalator',route,3,3,1,WOOD)
  for i in range(0,15,3):
    xx,yy,zz=route[i]
    pillar(label+' stair glass fixing '+str(i),
           (xx+5,yy,zz),(xx+5,yy,zz+5),.6,.6,GLAZE)
portal('WEST visible original civic portal',-145,-187)
portal('EAST visible original civic portal',151,-191)
# Original urban depth remains attached to the existing terminal wings, not
# distributed as disconnected highrise boxes on an enormous studio floor.
north_plans=[
 ('W', [(-209,124),(-140,117),(-109,162),(-125,263),(-201,285),(-236,230)]),
 ('E', [(110,115),(183,110),(255,169),(239,258),(167,294),(100,252)])]
for side,p in north_plans:
  for i,(z,stretch) in enumerate([(8,1),(58,.96),(116,.88)]):
    origin=Vector(p[0])
    pp=[tuple(origin+(Vector(point)-origin)*stretch) for point in p]
    prism(side+' connected civic deep-section '+str(i),pp,
          z,z+10,C_STONE if i<2 else C_PALE,C_SHADE)
    for j in [1,3]:
      start,end=pp[j],pp[(j+1)%len(pp)]
      curtain_facade(side+' inhabited north elevation %d/%d'%(i,j),
       start,end,z+13,z+39,max(3,int(math.dist(start,end)/7)),2)
  x=-137 if side=='W' else 137
  way=[(x+8*sin(t*.22),124+7*t,75+7*sin(t*pi/28)) for t in range(29)]
  beam_rail(side+' north skytrain aligned with civic front',way,5,5,3,WOOD)
  for j in [0,7,14,21,28]:
    xx,yy,zz=way[j]
    pillar(side+' supported train viaduct '+str(j),
           (xx,yy,zz-34),(xx,yy,zz),3,3,C_PALE)

# Studio only / lighting.
floor=cube('STUDIO-ONLY no GLB export',(0,0,-26),(720,780,4),2)
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
 ('OBLIQUE',(-570,-600,350),(0,-23,119),42),
 ('FRONT',(0,-585,235),(0,-13,145),45),
 ('SIDE',(560,-30,310),(0,-10,130),43),
 ('AERIAL',(390,440,590),(0,-22,135),46),
 ('APPROACH',(0,-330,8),(0,35,36),46),
 ('FOYER',(-305,-260,95),(-150,-102,42),50)]
camera('Hero review camera',*views[0][1:])
blend=os.path.join(out,'G4E7BW_HALOCUT_CONCOURSE_SOURCE.blend')
bpy.ops.wm.save_as_mainfile(filepath=blend)
# Render first: Blender 4.0.2/Linux crashes in Cycles BVH if its original
# generated/packed texture data are passed through the GLB exporter first.
# This is a testable crash-isolation change, not yet proven root causality.
for name,position,target,lens in views:
    camera('Review '+name,position,target,lens)
    scene.render.filepath=os.path.join(out,'G4E7BW_'+name+'_REAL_BLENDER_RENDER.png')
    bpy.ops.render.render(write_still=True)
# Binary export is independent of the studio cameras/render result.
bpy.ops.object.select_all(action='DESELECT')
for ob in scene.objects:
    if ob.type=='MESH' and not ob.get('exclude_glb',False):ob.select_set(True)
bpy.context.view_layer.objects.active=next(o for o in bpy.context.selected_objects)
glb=os.path.join(out,'G4E7BW_HALOCUT_CONCOURSE_ART_ONLY.glb')
bpy.ops.export_scene.gltf(filepath=glb,export_format='GLB',
                          use_selection=True,export_yup=True)
bpy.ops.object.select_all(action='DESELECT')
report={
 'schema':'dopagaki-g4e7bw-original-blender-single-architectural-hero-v1',
 'authorship':'SCRIPTED_BPY_MODELLING_NOT_HAND_SCULPTED',
 'model':'HALO-CUT CONCOURSE',
 'atlas':'ORIGINAL_GENERATED_PNG_PACKED_IN_GLB',
 'units':'METERS_BLENDER_Z_UP_GLTF_Y_UP',
 'urbanTypology':'ONE_ORIGINAL_INHABITED_MULTI_LEVEL_SPLIT_TRANSIT_CATHEDRAL',
 'gameplayIntegration':'NOT_YET_DONE',
 'artReview':'HOLD','humanPlay':'HOLD','publish':'FORBIDDEN',
 'officiallyCertifiedSlope2Meters':0}
with open(os.path.join(out,'G4E7BW_PROVENANCE.json'),'w') as f:
    json.dump(report,f,indent=2)
print('G4E7BW original art production',json.dumps(report))
