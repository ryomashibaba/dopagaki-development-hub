# R6D-R4 private: spatial diagnosis with unaltered DR/R1 actual Blender source.
# No new city art. This examines what the NATIVE gameplay camera can SEE:
# first-hit CX18 / B48×7 / sampled B51×28 / sky at 7 times per road.
# 28 B51 OBB envelopes were independently exported at 240 Hz in Node.
import bpy, math, os, sys, json, statistics
from mathutils import Vector
from mathutils.bvhtree import BVHTree
args=sys.argv[sys.argv.index('--')+1:]
def arg(key): assert key in args,key;return args[args.index(key)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
root=arg('--out');os.makedirs(root,exist_ok=True)
native=json.load(open(arg('--timeline'),encoding='utf-8'))
hazard=json.load(open(arg('--hazards'),encoding='utf-8'))
assert native['road']==hazard['road']==road
assert native['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert hazard['schema']=='dopagaki.g4e7dz-r6d-r4-all28-240hz-samples/1'
assert hazard['frames721']==721 and len(hazard['hazards'])==28
assert native['sourceCXBlob']==hazard['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
bpy.ops.wm.open_mainfile(filepath=arg('--source'))
s=bpy.context.scene
assert s['DO_SCENE_IS_NOT_GAME_WEBGL'] and s['DR_ACTUAL_B48_MESH_COUNT']==7
assert s['DR_ACTUAL_B51_POSES_PER_FRAME']==28 and s['DR_ACTUAL_B48_VOID_CELL52']
CX=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
B48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
B51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
MOVERS=[o for o in bpy.data.objects if o.get('R1_B51_ID')]
ORIGINAL=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
EARLY=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(CX),len(B48),len(B51),len(MOVERS),len(ORIGINAL.objects),len(EARLY.objects))==(18,7,28,28,5,8)
def frozen():
 return {'cx':sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in CX),
 'b48':sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in B48),
 'b51':sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in B51),
 'original_cameras':sorted((o.name,float(o['true_240hz_time']),tuple(round(float(v),4) for v in o.location)) for o in ORIGINAL.objects)}
before=frozen()
def tree(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
  [tuple(face.vertices) for face in o.data.polygons],all_triangles=False)
fixed=[('CX',o,tree(o)) for o in CX]+[('B48',o,tree(o)) for o in B48]
times=('t1400','t1450','t1500','t1550','t1600','t1650','t1700')
frames={f['id']:(i+1,f) for i,f in enumerate(native['frames'])}
assert all(k in frames for k in times)
W,H=25,15
views={}
mask_rows={}
for key in times:
 fi,f=frames[key]
 s.frame_set(fi);bpy.context.view_layer.update()
 c=ORIGINAL.objects.get(key+' REAL ORIGINAL 240HZ')
 if not c:c=EARLY.objects.get('R1 '+key+' SOURCE CAMERA')
 assert c
 eye=Vector(f['eye']);front=Vector(f['front']).normalized()
 assert (eye-c.location).length<.0002
 right=front.cross(Vector((0,1,0))).normalized()
 up=right.cross(front).normalized()
 assert (front-(c.matrix_world.to_quaternion()@Vector((0,0,-1)))).length<.0002
 activeIDs={m['id'] for m in f['moving'] if m['enabled']}
 active=[('B51',o,tree(o)) for o in MOVERS if o['R1_B51_ID'] in activeIDs]
 assert len(active)==len(activeIDs)
 candidates=fixed+active
 cats={'CX':0,'B48':0,'B51':0,'SKY':0};cx_hits={};nearest_d=[]
 grid=[]
 for j in range(H):
  rr=[]
  for i in range(W):
   u=(i+.5)/W;v=(j+.5)/H
   direction=(front+right*((u-.5)*2/1.35*(1008/645))+up*((.5-v)*2/1.35)).normalized()
   best=None
   for category,o,bvh in candidates:
    h,n,face,dist=bvh.ray_cast(eye,direction,2000)
    if h is not None and dist is not None and (best is None or dist<best[0]):
     best=(dist,category,o.name)
   if best is None:category='SKY'
   else:
    dist,category,name=best
    if category=='CX':
     cx_hits[name]=cx_hits.get(name,0)+1;nearest_d.append(dist)
   rr.append(category);cats[category]+=1
  grid.append(rr)
 assert sum(cats.values())==W*H
 player=Vector(f['playerPosition'])
 closest=[]
 for obj in CX:
  hit,normal,index,dist=tree(obj).find_nearest(player)
  if hit is not None:closest.append((dist,obj.name,[round(float(v),3) for v in hit]))
 closest.sort()
 # compare sampled 0.5s anchors from 28 independently calculated 240Hz poses
 for m in f['moving']:
  anchor=next(x for x in hazard['hazards'] if x['id']==m['id'])['anchors'][key]
  assert anchor['enabled']==m['enabled']
  assert max(abs(a-b) for a,b in zip(anchor['center'],m['center']))<1e-6
  assert max(abs(a-b) for a,b in zip(anchor['halfSize'],m['halfSize']))<1e-6
  assert abs(anchor['yawRadians']-m['yawRadians'])<1e-6
 views[key]={
  'seconds':f['seconds'],'tick':f['tick'],'grounded':f['grounded'],
  'physicalRoad':f['physicalRoad'],'actualCameraEye':[round(float(v),4) for v in eye],
  'actualPlayerPosition':[round(float(v),4) for v in player],
  'native7Frame28B51AnchorParity':'PASS',
  'sourceFirstHitGrid':cats,'gridCellCount':W*H,
  'sourceCXHitsByObject':cx_hits,'visibleUniqueCXObjects':len(cx_hits),
  'medianVisibleCXRayDistanceMetres':round(statistics.median(nearest_d),3) if nearest_d else None,
  'nearestExistingCXDistanceMetres':round(closest[0][0],3),
  'nearestExistingCXName':closest[0][1],
  'firstHitIsNotCityFunctionOrHumanLegibility':'TRUE'}
 mask_rows[key]=grid
# Aggregate per-variant: original city visible persistently, not manually placed targets.
summaries={}
for k in ('CX','B48','B51','SKY'):
 samples=[views[t]['sourceFirstHitGrid'][k]/(W*H) for t in times]
 summaries[k]={'perFrameFractions':[round(x,4) for x in samples],
  'meanSampledFraction':round(statistics.mean(samples),4)}
cx_continuity=[views[t]['visibleUniqueCXObjects'] for t in times]
# Clearance scope: 28 times 721 OBB samples, all existing original source, but
# no new planned architecture exists so cannot certify a new design.
# Draw private reference path and annotated 0.5 s positions in another collection.
col=bpy.data.collections.new('R4 SOURCE ONLY DIAGNOSTIC ROUTE / NOT GAME GEOMETRY')
s.collection.children.link(col)
def mkmat(n,color):
 m=bpy.data.materials.new(n);m.diffuse_color=(*color,1);m.use_nodes=True
 b=m.node_tree.nodes.get('Principled BSDF')
 b.inputs['Base Color'].default_value=(*color,1)
 return m
route_mat=mkmat('R4 original 240Hz true source route cyan',(.02,.88,.90))
marker_mat=mkmat('R4 selected fixed script player marker warm',(.95,.45,.1))
hazard_mat=mkmat('R4 sample union B51 not swept certified',(.9,.16,.23))
def poly(name,pts,ma,bevel=1.1,closed=False):
 cu=bpy.data.curves.new(name,'CURVE');cu.dimensions='3D'
 spline=cu.splines.new('POLY')
 spline.points.add(len(pts)-1)
 for point,v in zip(spline.points,pts):point.co=(*v,1)
 spline.use_cyclic_u=closed
 cu.bevel_depth=bevel;cu.resolution_u=2;cu.bevel_resolution=1
 o=bpy.data.objects.new(name,cu);col.objects.link(o);cu.materials.append(ma)
 o['R4_SOURCE_REFERENCE_ONLY']=True
 return o
pts=[Vector(frames[t][1]['playerPosition']) for t in times]
poly('R4 original native 14-17s 7 frame reference route',pts,route_mat,1.6)
for k,p in zip(times,pts):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=12,ring_count=8,radius=2.4,location=p)
 ob=bpy.context.object;ob.name='R4 '+k+' native sample'
 for cc in list(ob.users_collection):cc.objects.unlink(ob)
 col.objects.link(ob);ob.data.materials.append(marker_mat)
 ob['R4_SOURCE_MARKER_NOT_GAME_COLLIDER']=True
# Display ONLY the 6 source B51 240Hz envelopes nearest to the original route
# for map legibility, but store all 28 in audit evidence.
def distancebox(p,b):
 return math.sqrt(sum(max(b['min'][i]-p[i],0,p[i]-b['max'][i])**2 for i in range(3)))
valid=[x for x in hazard['hazards'] if x['sampledAabb']]
nearest=sorted(valid,key=lambda o:min(distancebox(p,o['sampledAabb']) for p in pts))[:6]
for h in nearest:
 box=h['sampledAabb'];mn=box['min'];mx=box['max']
 corners=[(x,y,z) for x in (mn[0],mx[0]) for y in (mn[1],mx[1]) for z in (mn[2],mx[2])]
 edges=((0,1),(0,2),(0,4),(1,3),(1,5),(2,3),(2,6),
        (3,7),(4,5),(4,6),(5,7),(6,7))
 for a,b in edges:
  poly('R4 sample-only 240Hz OBB AABB '+h['id'],[corners[a],corners[b]],hazard_mat,.32)
# Orthographic SOURCE map renders. They are NOT views from the actual in-game camera.
# Render original geometry and diagnostic curves, with camera(s) in private collection.
mid=sum(pts,Vector())/len(pts)
def camera(name,offset,up,scale):
 d=bpy.data.cameras.new(name);d.type='ORTHO';d.ortho_scale=scale;d.clip_end=4000
 obj=bpy.data.objects.new(name,d);col.objects.link(obj)
 obj.location=mid+Vector(offset)
 obj.rotation_euler=(mid-obj.location).to_track_quat('-Z',up).to_euler()
 return obj
ortho=camera('R4 TRUE SOURCE WORLD TOP-DOWN DIAGNOSTIC', (0,700,100), 'Y',550)
iso=camera('R4 TRUE SOURCE WORLD ISOMETRIC DIAGNOSTIC', (300,450,350), 'Y',540)
s.cycles.device='CPU';s.cycles.samples=4;s.cycles.use_denoising=False
s.render.threads_mode='FIXED';s.render.threads=2
s.render.image_settings.file_format='PNG'
s.render.resolution_x=1100;s.render.resolution_y=720;s.render.resolution_percentage=100
s['R4_SOURCE_ORIGINAL_UNMODIFIED']=True
s['R4_NEW_CITY_ART_MESHES']=0
s['R4_GAME_COLLIDERS_NEW']=0
s['R4_FULL_MOVING_SAFETY']='NOT_CERTIFIED'
s['R4_ART']=s['R4_HUMAN']=s['R4_RELEASE']='HOLD'
s.frame_set(frames['t1500'][0]);s.camera=iso
blend='R4_'+road+'_ORIGINAL_WORLD_DIAGNOSTIC_NOT_NEW_CITY.blend'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(root,blend))
rendered=[]
for cam,label in ((ortho,'TOP_DOWN'),(iso,'ISOMETRIC')):
 s.camera=cam;s.render.filepath=os.path.join(root,'R4_'+road+'_'+label+'_ACTUAL_SOURCE_BLENDER.png')
 bpy.ops.render.render(write_still=True);rendered.append(os.path.basename(s.render.filepath))
# Pixel-wise source ray classification masks are derived analytically, not Blender CGI.
from mathutils import Color
palette={'CX':(.19,.78,.76,1),'B48':(.35,.43,.52,1),
         'B51':(.95,.38,.20,1),'SKY':(.045,.075,.13,1)}
ww=700;hh=420
for key in times:
 arr=[0.]*(ww*hh*4)
 g=mask_rows[key]
 for iy in range(hh):
  row=g[min(H-1,int(iy*H/hh))]
  for ix in range(ww):
   color=palette[row[min(W-1,int(ix*W/ww))]]
   ind=4*((hh-1-iy)*ww+ix);arr[ind:ind+4]=color
 img=bpy.data.images.new('R4_SOURCE_RAY_CLASSIFICATION_'+key,width=ww,height=hh,alpha=True)
 img.pixels[:]=arr
 img.filepath_raw=os.path.join(root,'R4_'+road+'_'+key+'_SOURCE_RAYCAST_FIRSTHIT.png')
 img.file_format='PNG';img.save()
 assert os.path.isfile(img.filepath_raw)
assert before==frozen()
audit={
 'schema':'dopagaki.g4e7dz-r6d-r4-original-spatial-audit/1',
 'road':road,'sourceCXBlob':hazard['sourceCXBlob'],
 'originalCX':18,'originalB48':7,'originalB51':28,
 'originalCameras':5,'gap52':True,'sourceUnchanged':True,
 'scope':'14_17_SECONDS_SEVEN_SCRIPTED_240HZ_CAMERA_SAMPLES',
 'nativeCameraRayGrid':{'width':W,'height':H,'cellsPerFrame':W*H},
 'views':views,'sourceFirstHitSummary':summaries,
 'uniqueSourceCxVisibilityByFrame':cx_continuity,
 'hazards28At240HzSampledTicks':721,
 'independentHazardAnchorParity':'28/28_AT_SEVEN_SOURCE_FRAMES',
 'sourceMovingB51FullIntervalConservativeAabbAvailable':True,
 'hazardsShownOnMap':len(nearest),
 'hazardShownIDs':[x['id'] for x in nearest],
 'continuousTimeCollisionAndFairness':'NOT_CERTIFIED',
 'connectedCityTransitFunction':'NOT_CERTIFIED',
 'actualNewCityMeshes':0,'gameNewColliders':0,'sourceGameChanged':False,
 'actualGameWebGL':'NOT_RENDERED',
 'mapsAreOrthographicNonGameplayViews':rendered,
 'sevenSourceFirstHitMaskPNGs':7,
 'editableBlender':blend,
 'officialArt':0,'officialSlope2Metres':0,
 'TECH':'SOURCE_3D_MAPPING_AND_SAMPLED_DYNAMIC_BOUNDARIES_ONLY',
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD',
 'PERFORMANCE':'HOLD','INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(root,'R4_'+road+'_SOURCE_SPATIAL_AUDIT.json'),'w',encoding='utf-8') as f:
 json.dump(audit,f,indent=2,ensure_ascii=False)
print('R4_TRUE_SOURCE_RAY_AND_3D_MAP',road,
 'CX fractions',summaries['CX']['perFrameFractions'],
 'CX objects',cx_continuity,
 'images',len(rendered)+7,'art HOLD')
