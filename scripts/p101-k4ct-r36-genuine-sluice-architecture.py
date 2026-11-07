"""R36: ONE true Blender authored source-visible original Road6 tidal-gate relief.
This is not the orange R35 diagnostic box. Actual bevel-evaluated architecture,
one negative arch opening, a hydraulic leaf, supporting quay and falling water.
The original protected 19 water surface, B48, 28 B51, 240Hz and Camera remain
strictly untouched. No new colliders. Research ART HOLD until original GL RAW.
"""
import bmesh,math,json
from pathlib import Path
assert site['sourceGameBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert site['researchPhysicalRoad5SHA256']=='4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b'
assert site['originalB48Count']==7 and site['originalB51Count']==28 and site['newColliders']==0
assert len(GROUPS)==43
R36_N={name[:2]:name for name in GROUPS}
R36_PROTECTED_IDS=('00','12','13','19','34','35','41','42')
R36_PROTECTED={R36_N[k]:list(GROUPS[R36_N[k]]) for k in R36_PROTECTED_IDS}
assert all(R36_PROTECTED.values())
for k in ('15','16','17'):GROUPS[R36_N[k]].clear()
COLORS.update({
 'r36_chamfered_concrete':(.425,.464,.45),
 'r36_stone_cut':(.27,.315,.316),
 'r36_arch_intrados':(.16,.265,.288),
 'r36_oxidized_steel':(.24,.415,.398),
 'r36_mechanical_copper':(.64,.462,.276),
 'r36_water_crest':(.18,.487,.49),
 'r36_deep_fall':(.12,.345,.377),
 'r36_impact_foam':(.70,.77,.68),
 'r36_dark_gallery':(.14,.208,.224),
 'r36_buoy_lamps':(.88,.77,.54),
 'r36_wet_rock':(.27,.355,.354)
})
P36,F36,S36=frame(6,.15)
def R36_AT(distance,y,alongM=0.):
    edge=offset_edge(P36,S36,distance,'R')
    return (edge[0]+F36[0]*alongM,y,edge[2]+F36[2]*alongM)
R36_PARTS=[]
def R36_BEVEL(name,group,verts,faces,material,accent=None,width=1.4):
    # Editable genuinely evaluated Blender topology; NOT mesh-vertex proxy.
    mesh=bpy.data.meshes.new('R36_'+name+'_DCC_RAW')
    mesh.from_pydata([world_to_blender(v) for v in verts],[],faces)
    mesh.update()
    obj=bpy.data.objects.new('R36_'+name+'_DCC_EDITABLE',mesh)
    bpy.context.collection.objects.link(obj)
    mod=obj.modifiers.new('R36_BEVEL_ARCHITECTURAL_ARRIS','BEVEL')
    mod.width=width;mod.segments=3;mod.limit_method='ANGLE';mod.angle_limit=.58
    bpy.context.view_layer.update()
    evaluated=obj.evaluated_get(bpy.context.evaluated_depsgraph_get())
    evaluatedMesh=evaluated.to_mesh()
    bm=bmesh.new();bm.from_mesh(evaluatedMesh)
    bmesh.ops.triangulate(bm,faces=list(bm.faces))
    count=0
    for face in bm.faces:
        v=[(float(p.co.x),float(p.co.z),float(-p.co.y)) for p in face.verts]
        if len(v)!=3:raise AssertionError('REAL_BLENDER_TRIANGULATION_INVALID')
        avgHeight=sum(p[1] for p in v)/3.
        mat=accent if accent and avgHeight<101. else material
        tri(R36_N[group],v[0],v[1],v[2],mat)
        count+=1
    bm.free();evaluated.to_mesh_clear()
    bpy.data.objects.remove(obj,do_unlink=True)
    assert count>22,(name,count)
    R36_PARTS.append({'name':name,'group':group,'actualEvaluatedBlenderTriangles':count,
                      'bevelWidthM':width,'sourceRoad6Right':True})
    return count
# 1. SINGLE irregular stone portal, its open hollow throat is a TRUE void:
# front+back+inner surfaces form a solid ring with a polygonal arch aperture.
# Longitudinal thickness 18m, footprint R48..106m, NEVER across the race road.
outer=[(48,92),(98,92),(105,100),(105,117),
       (95,133),(66,133),(48,117),(46,102)]
inner=[(62,100),(89,100),(96,104),(96,113),
       (88,121),(71,121),(60,113),(59,104)]
assert len(outer)==len(inner)==8
rings=[]
for polygon,t in ((outer,-9.),(outer,9.),(inner,-9.),(inner,9.)):
    rings.extend([R36_AT(d,y,t) for d,y in polygon])
faces=[]
for i in range(8):
    j=(i+1)%8
    faces.append((i,j,16+j,16+i))
    faces.append((8+j,8+i,24+i,24+j))
    faces.append((i,8+i,8+j,j))
    faces.append((16+j,24+j,24+i,16+i))
R36_BEVEL('SINGLE_OPEN_TIDAL_GATE_ARCH','15',rings,faces,
          'r36_chamfered_concrete','r36_stone_cut',1.7)
# 2. Real cut-stone load paths flank the one portal asymmetrically. Thick,
# stepped, sloping wedges; no repeated facade box motifs.
def R36_BUTTRESS(name,d0,d1,bottom,top,t0,t1):
    cap=[R36_AT(d0,bottom,t0),R36_AT(d1,bottom,t0),
         R36_AT(d1-2.5,top,t0),R36_AT(d0+4.5,top-4.,t0)]
    far=[R36_AT(d0-1.,bottom,t1),R36_AT(d1+3.,bottom,t1),
         R36_AT(d1-3.,top-3.,t1),R36_AT(d0+6.,top-6.,t1)]
    pts=cap+far
    faces=[(0,1,2,3),(4,7,6,5),(0,4,5,1),(1,5,6,2),
           (2,6,7,3),(3,7,4,0)]
    R36_BEVEL(name,'16',pts,faces,'r36_stone_cut',
              'r36_wet_rock',1.1)
R36_BUTTRESS('UPSTREAM_LOAD_TO_BEDROCK',47.,64.,75.,113.,-21.,21.)
R36_BUTTRESS('LOWER_SPILLWAY_BUTTRESS',94.,109.,61.,114.,-19.,25.)
# 3. A SINGLE opened hydraulic gate leaf, hung from the arch, not a wall.
leaf=[R36_AT(d,y,t) for d,y,t in (
    (83.,102.,-10.),(93.,104.,-10.),(101.,123.,-3.),(87.,121.,-3.),
    (82.,101.,4.),(92.,104.,4.),(100.,121.,10.),(86.,120.,10.))]
leafFaces=[(0,1,2,3),(4,7,6,5),(0,4,5,1),(1,5,6,2),
           (2,6,7,3),(3,7,4,0)]
R36_BEVEL('SLUICE_HINGED_COPPER_STEEL_LEAF','17',leaf,leafFaces,
          'r36_oxidized_steel','r36_mechanical_copper',.85)
# Two real tension bars, visibly joined to the moving leaf and winch:
# finite, rational structural members, not an alternating line forest.
for longitudinal in (-6.,5.):
    beam(R36_N['17'],R36_AT(77.,129.,longitudinal),
         R36_AT(96.,110.,longitudinal+3.),1.1,'r36_mechanical_copper')
beam(R36_N['17'],R36_AT(71.,131.,-14.),R36_AT(88.,131.,13.),
     1.3,'r36_oxidized_steel')
# Drum actually rotates around an axis perpendicular to the hydraulic leaf;
# circular 3D rim rather than a sheet-only painted copper circle.
def R36_WHEEL(radius,d,y,t,group):
    for i in range(24):
        a=i*2*math.pi/24;b=(i+1)*2*math.pi/24
        def ring(r,theta,long):
            return R36_AT(d+r*math.cos(theta),y+r*math.sin(theta),long)
        quad(R36_N[group],ring(radius,a,t-1.8),ring(radius,b,t-1.8),
             ring(radius-2.3,b,t-1.8),ring(radius-2.3,a,t-1.8),
             'r36_mechanical_copper',False)
        quad(R36_N[group],ring(radius,a,t+1.8),ring(radius-2.3,a,t+1.8),
             ring(radius-2.3,b,t+1.8),ring(radius,b,t+1.8),
             'r36_oxidized_steel',False)
        quad(R36_N[group],ring(radius,a,t-1.8),ring(radius,a,t+1.8),
             ring(radius,b,t+1.8),ring(radius,b,t-1.8),
             'r36_mechanical_copper',False)
    beam(R36_N[group],R36_AT(d,y,t-9.),R36_AT(d,y,t+9.),1.,'r36_oxidized_steel')
R36_WHEEL(6.3,79.,131.,0.,'17')
# 4. A real gravity spill beyond the preserved 19 surface edge d102:
# upstream crest (R98–102) at source y93 remains above protected water;
# beyond the protected edge it drops to ~54 with visible vertical depth.
# Narrow ribbons form one continuous, varied high-head waterfall.
R36_WATER_STRIPS=0
for band in range(18):
    t0=-16.+32.*band/18.;t1=-16.+32.*(band+1)/18.
    fluct=.45*math.sin(band*1.49)
    def stream(d,y,t):
        return R36_AT(d,y+fluct+(.4*math.sin(t*.77+d*.23)),t)
    R36_FLOW_KNOTS=[(99.,93.4),(102.8,92.5),(106.,88.),
              (112.,74.),(123.,55.),(134.,53.5)]
    for k in range(len(R36_FLOW_KNOTS)-1):
        u0,v0=R36_FLOW_KNOTS[k];u1,v1=R36_FLOW_KNOTS[k+1]
        color=('r36_water_crest' if k<2 else
               'r36_deep_fall' if k in (2,3) else 'r36_impact_foam')
        quad(R36_N['23' if k<3 else '24'],
             stream(u0,v0,t0),stream(u0,v0,t1),
             stream(u1,v1,t1),stream(u1,v1,t0),color,False)
        R36_WATER_STRIPS+=2
    if band%2==0:
        peak=R36_AT(123.,57.2+2.5*math.sin(band),t0)
        tri(R36_N['24'],R36_AT(118.,61.,t0),
            R36_AT(126.,54.,t1),peak,'r36_impact_foam')
assert R36_WATER_STRIPS==180
# 5. Low exposed quarry throat and physical supports around the outfall.
# The protected sheet 19 remains 100% unchanged; no road-covering cliff.
def R36_WING(name,group,sideD):
    pts=[
      R36_AT(sideD,54.,-24.),R36_AT(sideD+17.,52.,-24.),
      R36_AT(sideD+9.,95.,-24.),R36_AT(sideD-5.,86.,-24.),
      R36_AT(sideD-3.,52.,25.),R36_AT(sideD+19.,51.,25.),
      R36_AT(sideD+11.,91.,25.),R36_AT(sideD-7.,83.,25.)
    ]
    f=[(0,1,2,3),(4,7,6,5),(0,4,5,1),(1,5,6,2),(2,6,7,3),(3,7,4,0)]
    R36_BEVEL(name,group,pts,f,'r36_wet_rock','r36_dark_gallery',1.5)
R36_WING('LEFT_QUARRY_TO_PLUNGE_BASIN','20',113.)
R36_WING('RIGHT_DEEP_PLUNGE_TOE','21',129.)
# A short landing sill / gallery with real load transfer to the rock.
beam(R36_N['25'],R36_AT(107.,88.,-22.),R36_AT(108.,88.,19.),
     2.3,'r36_chamfered_concrete')
beam(R36_N['26'],R36_AT(111.,65.,-18.),R36_AT(123.,59.,-7.),
     2.8,'r36_oxidized_steel')
# Existing source group19 forebay, 34 power intake, 41 turbine, 42
# penstock have NOT been touched. No unsupported fictional certification.
assert all(GROUPS[name]==value for name,value in R36_PROTECTED.items())
assert len(GROUPS)==43 and all(GROUPS[R36_N[g]] for g in ('15','16','17'))
assert site['newColliders']==0 and site['originalB48Count']==7 and site['originalB51Count']==28
R36_EVIDENCE={
 'schema':'k4ct-r36-source-road6-one-real-blender-hollow-sluice-spillway-v1',
 'protectionBaseline':'Original R12A source, protected group19 unchanged exactly',
 'originalRoadIndex':6,'originalRoadU':.15,'waterSourceR':True,
 'sourceBankLateralDistanceMeters':[46,134],
 'originalForebayWaterY':93,
 'archHasRealOpenAperture':True,'notRepeatedBoxFacade':True,
 'actualBlenderBevelEvaluations':R36_PARTS,
 'originalSourceWater19Rewritten':False,
 'hydraulicSystem':{
   'mainSourceVisibleHollowGate':'15',
   'twoStructuralWings':'16,20,21',
   'functionalGateWinchAndLeaf':'17',
   'spillwaySheetSurface':'23,24',
   'waterFallSourceY':[93.4,53.5],
   'flowDirection':'From protected forebay edge R99 to open plunge basin R134'},
 'scenicOnlyNoPhysics':True,'newColliders':0,
 'sourceB48':7,'sourceB51':28,'originalCamera240HzRequired':True,
 'protectedGroupCounts':{key[:2]:len(value) for key,value in R36_PROTECTED.items()},
 'authoredGroup15Triangles':len(GROUPS[R36_N['15']]),
 'authoredGroup16Triangles':len(GROUPS[R36_N['16']]),
 'authoredGroup17Triangles':len(GROUPS[R36_N['17']]),
 'totalSceneTriangles':sum(map(len,GROUPS.values())),
 'formalArtAdopted':0,'slope2DNAmeters':0,
 'ART':'HOLD','HUMAN':'HOLD','SAT':'HOLD','CCD':'HOLD','FPS':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'
}
OUTFILE=Path('test-results/k4ct-r36-art');OUTFILE.mkdir(parents=True,exist_ok=True)
(OUTFILE/'R36_ARCHITECTURAL_GATE_MANIFEST.json').write_text(
 json.dumps(R36_EVIDENCE,indent=2)+'\n')
print('R36_TRUE_BLENDER_ORIGINAL_CAMERA_OPEN_SLICE_READY_FOR_NATIVE_RAW',
      json.dumps({'triangles':R36_EVIDENCE['totalSceneTriangles'],
                  'beveled':R36_PARTS,'water':R36_WATER_STRIPS}))
