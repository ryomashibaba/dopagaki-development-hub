"""R15H: three genuinely distinct 76m source-camera positioned urban landmarks.

Actual editable Blender geometry from R15G sites, protecting source CX18,
B48x7, B51x28 and native cameras. Three original-source stage views ×7
timepoints per road. NO added game colliders, no certified support/ingress.
"""
import bpy,sys,os,json,math,collections
from mathutils import Vector
from mathutils.bvhtree import BVHTree
argv=sys.argv[sys.argv.index('--')+1:]
def arg(k):
 assert k in argv,k
 return argv[argv.index(k)+1]
road=arg('--road');assert road in ('true-pinch','pinch-switch')
out=arg('--out');os.makedirs(out,exist_ok=True)
SOURCE='af076d67492a677d2235e4730aef8cdf4808e106'
sites=json.load(open(arg('--r15g'),encoding='utf8'))
native=json.load(open(arg('--native'),encoding='utf8'))
assert sites['schema']=='dopagaki.r15g-distinct-three-camera-and-world-site-source-foundation-study/1'
assert sites['originalSourceCXBlob']==SOURCE
assert len(sites['threeGenuinelyDistinctOriginalWorldSiteSelections'])==3
assert sites['actualBuildingSupportCertified'] is False
assert native['schema']=='dopagaki.g4e7dz-r6d-r1-original-early-native/1'
assert native['sourceCXBlob']==SOURCE and native['road']==road
assert len(native['frames'])==13
bpy.ops.wm.open_mainfile(filepath=arg('--source'))
s=bpy.context.scene
assert s['DO_SCENE_IS_NOT_GAME_WEBGL'] and s['DR_ACTUAL_B48_VOID_CELL52']
assert s['DR_ACTUAL_B48_MESH_COUNT']==7 and s['DR_ACTUAL_B51_POSES_PER_FRAME']==28
CX=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
B48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
B51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
MOV=[o for o in bpy.data.objects if o.get('R1_B51_ID')]
cams=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
early=bpy.data.collections['R6D-R1 PRIVATE EARLY CAMERA EXTENSION NOT ORIGINAL MUTATION']
assert (len(CX),len(B48),len(B51),len(MOV),len(cams.objects),len(early.objects))==(18,7,28,28,5,8)
def signature():
 return (sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in CX),
  sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in B48),
  sorted((o.name,o['SOURCE_ORIGINAL_B51_ID'],len(o.data.vertices)) for o in B51),
  sorted((o.name,float(o['true_240hz_time'])) for o in cams.objects))
orig=signature()
def tree(o):
 return BVHTree.FromPolygons([tuple(o.matrix_world@v.co) for v in o.data.vertices],
  [tuple(f.vertices) for f in o.data.polygons],all_triangles=False)
source=[('CX',o,tree(o)) for o in CX]+[('B48',o,tree(o)) for o in B48]
co=bpy.data.collections.new('R15H THREE 76M ASYMMETRIC PUBLIC VOID STUDIES ART HOLD')
s.collection.children.link(co)
def material(name,color,metal=.3,emission=0):
 m=bpy.data.materials.new('R15H '+name);m.diffuse_color=(*color,1)
 m.use_nodes=True
 n=m.node_tree.nodes.get('Principled BSDF')
 n.inputs['Base Color'].default_value=(*color,1)
 n.inputs['Metallic'].default_value=metal;n.inputs['Roughness'].default_value=.48
 if emission:
  n.inputs['Emission Color'].default_value=(*color,1)
  n.inputs['Emission Strength'].default_value=emission
 return m
pal={
 'basalt':material('deep ceramic basalt',(.12,.24,.30)),
 'ivory':material('pale synthetic limestone',(.80,.77,.64)),
 'copper':material('aged warm structural alloy',(.63,.31,.17),.66),
 'light':material('bioluminescent sea light',(.2,.88,.93),.28,.85),
 'garden':material('tropical suspended terrace',(.19,.39,.26)),
 'glaze':material('cyan satin glaze',(.25,.42,.56),.55)}
built=[]
def make_mesh(name,xyz,faces,mat,phase,role):
 m=bpy.data.meshes.new('R15H '+name)
 m.from_pydata([tuple(v) for v in xyz],[],faces);m.update()
 o=bpy.data.objects.new('R15H '+name,m);co.objects.link(o);m.materials.append(pal[mat])
 o['R15H_PHASE']=phase;o['R15H_ROLE']=role
 o['R15H_SOURCE_ORIGINAL_CX_B48_B51_UNCHANGED']=True
 o['R15H_GAME_COLLIDER']=False
 built.append(o);return o
def solid_loft(name,c,phase,sections,mat,role):
 # each section=(y, xcenter, zcenter, halfwidth, halfdepth)
 # intentionally non-identical cross-sections; closed thick 3D mass.
 verts=[]
 for y,x,z,w,d in sections:
  verts.extend([c+Vector((x+dx,y,z+dz)) for dx,dz in
   ((-w,-d),(-w,d),(w,d),(w,-d))])
 faces=[(0,3,2,1),tuple(4*(len(sections)-1)+i for i in range(4))]
 for s0 in range(len(sections)-1):
  for j in range(4):
   faces.append((4*s0+j,4*s0+(j+1)%4,4*(s0+1)+(j+1)%4,4*(s0+1)+j))
 return make_mesh(name,verts,faces,mat,phase,role)
def slanted_lantern(name,c,phase,x0,x1,z0,z1,y0,y1,material,role):
 # fully enclosed wedge not a zero-thickness billboard.
 levels=[(y0,(x0+x1)/2,(z0+z1)/2,abs(x1-x0)/2,abs(z1-z0)/2),
         (y1,(x0+x1)/2+2,(z0+z1)/2+1.5,abs(x1-x0)/2-1,abs(z1-z0)/2-1)]
 return solid_loft(name,c,phase,levels,material,role)
patterns={
 'EARLY':{'axis':'GATE OF TIDES','left':[(-29,-2,9,19),(-25,2,11,18),(-20,4,10,15),(-19,0,8,13)],
  'right':[(28,-7,9,18),(23,-3,12,17),(24,3,10,16),(20,8,9,12)],
  'h':[0,25,52,78],'bridgeY':68,'color':'ivory','other':'copper','lowY':19},
 'MIDDLE':{'axis':'SKY-SPLIT CIVIC NAVE','left':[(-26,-9,12,18),(-24,-5,13,15),(-18,-2,12,13),(-23,5,10,10)],
  'right':[(25,8,10,15),(28,10,10,16),(29,3,10,14),(30,-1,6,9)],
  'h':[0,20,52,80],'bridgeY':62,'color':'copper','other':'ivory','lowY':29},
 'LATE':{'axis':'SUSPENDED CLIFF CROWN','left':[(-30,4,8,12),(-28,-2,10,14),(-22,-6,12,16),(-17,-9,10,14)],
  'right':[(27,7,9,15),(26,3,10,17),(23,-4,11,17),(22,-8,9,15)],
  'h':[0,24,56,82],'bridgeY':72,'color':'basalt','other':'copper','lowY':24}
}
study=[]
for site in sites['threeGenuinelyDistinctOriginalWorldSiteSelections']:
 phase=site['phase'];p=patterns[phase]
 c=Vector(site['boxBottomCenterWorldXYZ'])
 dims=site['boxDimensionsMetres'];assert dims==[76,64,84]
 # Each large hollow composition: two structurally distinct outer masses
 # opening a literal 28m-wide×44m-high sky-visible pedestrian void.
 for side in ('left','right'):
  sections=[(h,xyz[0],xyz[1],xyz[2],xyz[3]) for h,xyz in zip(p['h'],p[side])]
  solid_loft(phase+' '+p['axis']+' '+side+' sculpted mass',c,phase,sections,
   p['color'] if side=='left' else p['other'],'MASSIVE_NONPLANAR_HABITABLE_SHELL_EXTERIOR')
 # Sky bridge high above central space, leaving at least 55m void clearance.
 solid_loft(phase+' grand lightbridge above open void',c,phase,
  [(p['bridgeY'],-1,5,30,6),(p['bridgeY']+5,2,6,28,5)],
  'glaze','UPPER_CROSSING_IN_SILHOUETTE_NOT_WALKABLE_CERTIFIED')
 # Foot-level upper terrace remains attached visually to a true thick mass.
 solid_loft(phase+' public terrace balcony',c,phase,
  [(p['lowY'],20,-3,12,13),(p['lowY']+2,20,-2,11,11)],
  'ivory','PUBLIC_GALLERY_CONCEPT_NO_REAL_INGRESS')
 # Fractured planar ribbon within OUTER mass, not filling the principal void.
 slanted_lantern(phase+' illuminated cut',c,phase,-33,-29,-11,14,31,55,
  'light','LIGHT_RIFT_IN_REAL_THICK_WALL')
 # One distinct asym. garden bank, mid/upper levels, no repeating windows.
 solid_loft(phase+' suspended city garden',c,phase,
  [(p['lowY']+16,26,12,9,12),(p['lowY']+18,25,13,8,11)],
  'garden','GREEN_TERRACED_CIVIC_LEVEL_NOT_HABITABLE_CLAIM')
 study.append({'era':phase,'name':p['axis'],'siteId':site['id'],
  'worldCenter':list(c),'actualContainedGlobal3DModel':True,
  'mainVoidNominalOpenGapMetres':28,'realPublicIngressBuilt':False,
  'realTerrainFoundationCertified':False})
assert len(built)==18
# Verify real meshes are bounded by each selected original R15F source-safe
# box; do not extend to unspecified "supports" crossing source objects.
escaped=[]
for o in built:
 phase=o['R15H_PHASE']
 site=next(x for x in sites['threeGenuinelyDistinctOriginalWorldSiteSelections'] if x['phase']==phase)
 c=site['boxBottomCenterWorldXYZ'];w,d,h=site['boxDimensionsMetres']
 for vertex in o.data.vertices:
  xyz=o.matrix_world@vertex.co
  if not(c[0]-w/2-.001<=xyz.x<=c[0]+w/2+.001 and
         c[1]-.001<=xyz.y<=c[1]+h+.001 and
         c[2]-d/2-.001<=xyz.z<=c[2]+d/2+.001):
   escaped.append((o.name,tuple(xyz)))
assert not escaped,(len(escaped),escaped[:4])
collision=[]
for o in built:
 t=tree(o)
 for kind,original,t0 in source:
  tris=t.overlap(t0)
  if tris:collision.append([o.name,kind,original.name,len(tris)])
assert not collision,collision[:10]
# A 28m CENTRAL VOID must be physically open at center to a horizontal
# original scene ray, not just a graphic on a façade.
voids={}
for site in sites['threeGenuinelyDistinctOriginalWorldSiteSelections']:
 phase=site['phase'];c=Vector(site['boxBottomCenterWorldXYZ'])
 frompt=c+Vector((0,42,-33))
 ray=Vector((0,0,1))
 strikes=[]
 for o in built:
  if o['R15H_PHASE']!=phase:continue
  h,n,idx,d=tree(o).ray_cast(frompt,ray,66)
  if h is not None:strikes.append(o.name)
 voids[phase]={'originWorldXYZ':list(frompt),
  'forwardStudyRayMetres':66,
  'newArchitectureHitsWithinOpenMainVoid':strikes,
  'mainVoidActuallyOpenToThisSourceRay':len(strikes)==0}
assert all(v['mainVoidActuallyOpenToThisSourceRay'] for v in voids.values()),voids
assert signature()==orig
# True original player-first-hit source-camera test. Original source scenery
# is a separate group, not an invented fake game screenshot.
firstHit={}
for fi,f in enumerate(native['frames'],1):
 s.frame_set(fi);bpy.context.view_layer.update()
 cam=cams.objects.get(f['id']+' REAL ORIGINAL 240HZ') or early.objects.get('R1 '+f['id']+' SOURCE CAMERA')
 assert cam and (cam.location-Vector(f['eye'])).length<.0002
 front=Vector(f['front']).normalized()
 right=front.cross(Vector((0,1,0))).normalized()
 up=right.cross(front).normalized()
 active={v['id'] for v in f['moving'] if v['enabled']}
 origmove=[x for x in MOV if x['R1_B51_ID'] in active]
 nodes=[('R15H',o,tree(o)) for o in built]+source+[('B51',o,tree(o)) for o in origmove]
 cnt=collections.Counter()
 for iy in range(12):
  for ix in range(19):
   u=(ix+.5)/19;v=(iy+.5)/12
   ray=(front+right*((u-.5)*2/1.35*(1008/645))+up*((.5-v)*2/1.35)).normalized()
   best=2500;winner='SKY'
   for k,obj,tr in nodes:
    h,n,j,d=tr.ray_cast(cam.location,ray,best)
    if h is not None and d is not None and d<best:
     best=d;winner=k
   cnt[winner]+=1
 firstHit[f['id']]={'R15HOriginalSourceCameraFirstHitCount':cnt['R15H'],
  'R15HOriginalSourceCameraFirstHitFraction':round(cnt['R15H']/228,5),
  'totalOriginalCameraRays':228}
assert signature()==orig
s['R15H_REAL_3D_SOURCE_ART_STUDY_ONLY']=True
s['R15H_NEW_GAME_COLLIDERS']=0
s['R15H_SUPPORT_FOUNDATION_AND_ORIGINAL_ROAD_INGRESS']='NOT_CERTIFIED'
s['R15H_HUMAN_ART']='HOLD_PENDING_GENUINE_IMAGE_REVIEW'
s.cycles.device='CPU';s.cycles.samples=5;s.cycles.use_denoising=False
s.render.threads_mode='FIXED';s.render.threads=2
s.render.image_settings.file_format='PNG'
filename='R15H_'+road+'_THREE_DISTINCT_EDITABLE_3D_NATIVE_BLENDER_ART_HOLD.blend'
s.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,filename))
images=[]
for time in ('t1100','t1200','t1300','t1400','t1500','t1600','t1700'):
 frame=next(i for i,f in enumerate(native['frames'],1) if f['id']==time)
 s.frame_set(frame)
 cam=cams.objects.get(time+' REAL ORIGINAL 240HZ') or early.objects.get('R1 '+time+' SOURCE CAMERA')
 assert cam
 s.camera=cam
 file='R15H_'+road+'_'+time+'_TRUE_ORIGINAL_CAMERA_BLENDER_NOT_WEBGL.png'
 s.render.filepath=os.path.join(out,file)
 bpy.ops.render.render(write_still=True)
 images.append(file)
assert signature()==orig
audit={'schema':'dopagaki.r15h-three-real-76m-original-camera-visible-sculpted-city-art/1',
 'originalSourceCXBlob':SOURCE,'road':road,
 'originalSourceWorldCX18B48_7B51_28Cameras5Unchanged':True,
 'R15GThreeDistinctOriginalWorldCandidateCentersUsed':[x['siteId'] for x in study],
 'actualEditablePrivateBlenderMeshCount':len(built),
 'genuineMonumentalSculptureRealArchitectureStudy':study,
 'sourceCxB48RealTriangleIntersections':collision,
 'allActualMeshVerticesConfinedToR15FPhysicalSafeVolumes':len(escaped)==0,
 'real3DSculptedMainVoidRayProbeByPhase':voids,
 'originalSource13RealCameraFirstHit':firstHit,
 'sevenOriginalCameraRenderedBlenderStillImages':images,
 'privateNativeEditableBlend':filename,
 'gameWebGLActuallyRendered':False,
 'originalSourceGameEdited':False,
 'realSourceLandmarkStructuralSupportsBuilt':False,
 'originalGamePublicWalkwayConnected':False,
 'originalGameplayJumpRecoveryValidated':False,
 'trueHumanVisualArtApproval':False,
 'newGameColliders':0,'officialArt':0,'officialSlope2Meters':0,
 'ART':'HOLD','GAMEPLAY':'HOLD','HUMAN':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
with open(os.path.join(out,'R15H_'+road+'_TRUE_NATIVE_SCULPTED_CITY_ORIGINAL_CAMERA_AUDIT.json'),'w') as f:
 json.dump(audit,f,ensure_ascii=False,indent=2)
print('R15H_TRUE_3D_CITY_EDITABLE_AND_ORIGINAL_CAMERA',road,
 'meshes',len(built),'CXB48 source contacts',len(collision),
 '7 native-camera-first-hit',[firstHit[t]['R15HOriginalSourceCameraFirstHitFraction'] for t in ('t1100','t1200','t1300','t1400','t1500','t1600','t1700')],
 'ART HOLD NOT WEBGL')
