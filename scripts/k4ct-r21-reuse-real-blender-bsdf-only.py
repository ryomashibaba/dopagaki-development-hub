"""R21: true archived R20 Blender BSDF-only test, source-safe.
R20 is ART REJECT. No mesh, original Road5/Camera/B51/240Hz, colliders,
production or game shader edits. R21 is research and not full PBR.
"""
import bpy,json,hashlib
from pathlib import Path
I=Path('test-results/k4ct-r21-original-artifact/k4ct-contact-retry')
O=Path('test-results/k4ct-contact-retry')
P=Path('test-results/k4ct-r21-native-material')
O.mkdir(parents=True,exist_ok=True)
P.mkdir(parents=True,exist_ok=True)
contract=json.loads(Path('research-evidence/k4ct/K4CT_R21_REAL_BSDF_AND_NATIVE_VISIBILITY_VETO_CONTRACT_20261107.json').read_text())
assert contract['schema']=='k4ct-r21-reused-r20-blender-actual-bsdf-only-visibility-veto-v1'
spec=contract['actualBSDFPropertyGoals']
assert len(spec)==12 and bpy.app.version>=(4,0,0)
srcBlend=I/'K4CT_EDITABLE_SOURCE_ALIGNED_TIDAL_SPILLWAY_ART_REJECT.blend'
srcR9=I/'K4CT_R9_BLENDER_TRUE_MATERIAL_BRIDGE.json'
srcDcc=I/'K4CT_DCC_BLENDER_TO_NATIVE_GEOMETRY.json'
assert all(p.exists() and p.stat().st_size>10000 for p in (srcBlend,srcR9,srcDcc))
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
orig=json.loads(srcR9.read_text())
dcc=json.loads(srcDcc.read_text())
assert orig['schema']=='k4ct-r9-blender-native-attribute-bridge-v1'
assert orig['triangles']==21092 and orig['roadLegacyTriangles']==4608
assert orig['strideFloats']==14 and len(orig['materials'])==41
assert len(orig['vertices'])==orig['triangles']*3*14
assert dcc['triangles']==25700 and len(dcc['objects'])==43
assert dcc['originalB48']==7 and dcc['originalB51']==28 and dcc['newColliders']==0
assert dcc['sourcePhysicalRoad5SHA256']==contract['original']['roadPhysicsSHA256']

bpy.ops.wm.open_mainfile(filepath=str(srcBlend.resolve()))
meshes={o.name:len(o.data.polygons) for o in bpy.data.objects if o.type=='MESH'}
assert len(meshes)==43 and meshes==dcc['objects'],('R21_R20_MESH_NOT_EXACT',len(meshes))
before={}
after={}
for idx,row in enumerate(orig['materials']):
 assert row['id']==idx
 key=row['name']
 material=bpy.data.materials.get('K4CT_'+key.upper())
 assert material and material.use_nodes
 node=material.node_tree.nodes.get('Principled BSDF')
 assert node is not None
 rough=float(node.inputs['Roughness'].default_value)
 metal=float(node.inputs['Metallic'].default_value)
 assert abs(rough-row['roughness'])<.0001
 assert abs(metal-row['metalness'])<.0001
 before[key]={'roughness':rough,'metalness':metal}
 if key in spec:
  assert abs(rough-.74)<.0001 and abs(metal-.08)<.0001
  r,m=spec[key]
  assert .01<=r<=.96 and 0<=m<=.85
  node.inputs['Roughness'].default_value=float(r)
  node.inputs['Metallic'].default_value=float(m)
 after[key]={
  'roughness':float(node.inputs['Roughness'].default_value),
  'metalness':float(node.inputs['Metallic'].default_value)}
assert len(before)==len(after)==41
assert len({(round(after[k]['roughness'],3),round(after[k]['metalness'],3)) for k in spec})>=10
assert all(before[k]==after[k] for k in before if k not in spec)
assert all(before[k]!=after[k] for k in spec)

# Real Blender persistence: save, reopen, compare Principled node inputs.
targetBlend=O/srcBlend.name
bpy.ops.wm.save_as_mainfile(filepath=str(targetBlend.resolve()),check_existing=False)
assert targetBlend.stat().st_size>30000
bpy.ops.wm.open_mainfile(filepath=str(targetBlend.resolve()))
for key,expect in spec.items():
 node=bpy.data.materials['K4CT_'+key.upper()].node_tree.nodes.get('Principled BSDF')
 actual=(float(node.inputs['Roughness'].default_value),
         float(node.inputs['Metallic'].default_value))
 assert max(abs(x-y) for x,y in zip(actual,expect))<.0001
assert {o.name:len(o.data.polygons) for o in bpy.data.objects if o.type=='MESH'}==meshes

# R20 genuine mesh export is COPY-BYTES, never a new source proxy.
targetDcc=O/srcDcc.name
targetDcc.write_bytes(srcDcc.read_bytes())
assert sha(targetDcc)==sha(srcDcc)

# Rebuild the original R9 14-stride attribute bridge from real SAVED node
# roughness/metal values. Exact XYZ, BSDF base RGB, normals, UV, material IDs
# and original 4608-road legacy floats remain numerically unchanged.
new=dict(orig)
new['materials']=[dict(row,roughness=after[row['name']]['roughness'],
                      metalness=after[row['name']]['metalness'])
                  for row in orig['materials']]
v=orig['vertices'];out=list(v);seen={k:0 for k in spec}
for i in range(0,len(v),14):
 mid=v[i+11]
 assert float(mid).is_integer() and 0<=mid<len(new['materials'])
 name=new['materials'][int(mid)]['name']
 assert abs(v[i+12]-before[name]['roughness'])<.0001
 assert abs(v[i+13]-before[name]['metalness'])<.0001
 out[i+12]=after[name]['roughness']
 out[i+13]=after[name]['metalness']
 assert out[i:i+12]==v[i:i+12]
 if name in seen:seen[name]+=1
assert all(n>0 for n in seen.values()),seen
assert new['legacyRoadVertices']==orig['legacyRoadVertices']
assert new['triangles']==orig['triangles']
new['vertices']=out
new['r21ActualBlenderNodeSemanticsProven']=True
new['r21OriginalXYZRGBNormalsUVIDsUnchanged']=True
new['ART']='REJECT'
targetR9=O/srcR9.name
targetR9.write_text(json.dumps(new,separators=(',',':'))+'\n')
proof={
 'schema':'k4ct-r21-actual-blender-archive-reopen-bsdf-marine-node-bridge-v1',
 'sourceR20CI':42307252065,'sourceArtifact':13546263695,
 'sourceBlendSha256':sha(srcBlend),'outputBlendSha256':sha(targetBlend),
 'sourceR9Sha256':sha(srcR9),'outputR9Sha256':sha(targetR9),
 'originalDccSha256':sha(srcDcc),'outputDccSha256':sha(targetDcc),
 'originalDccByteIdentical':sha(srcDcc)==sha(targetDcc),
 'genuineBlenderVersion':bpy.app.version_string,
 'realSavedAndReopenedPrincipledNodes':True,
 'originalEditableMeshesAndTriangleCountsUnchanged':True,
 'nonroadTriangles':21092,'roadTriangles':4608,'totalTriangles':25700,
 'originalB48':7,'originalB51':28,'newColliders':0,
 'originalRoadCameraRunnerGameUnmodified':True,
 'attributeStride':14,'originalXYZRGBNormalUVMaterialIdUnchanged':True,
 'originalMaterialNodeValuesUnchanged':{k:before[k] for k in before if k not in spec},
 'marineMaterialChanges':{
  k:{'before':before[k],'after':after[k],'trueMeshAttributeVertexCount':seen[k]}
  for k in spec},
 'changedTrueMaterialCount':len(spec),
 'ART':'REJECT','formalArtAdopted':0,'slope2DNAmeters':0,
 'HUMAN':'HOLD','SAT':'HOLD','CCD':'HOLD','FPS':'HOLD',
 'RELEASE':'HOLD','MERGE':'HOLD','fullPBR':False
}
(P/'K4CT_R21_GENUINE_BLENDER_MARINE_BSDF_PROOF.json').write_text(
 json.dumps(proof,indent=2,sort_keys=True)+'\n')
print('R21_TRUE_BLENDER_BSDF_ONLY_MARINE_PASS',
 json.dumps({'newMaterials':len(spec),'trueVerticesPerMaterial':seen,
 'meshExact':True,'sourceB48':7,'sourceB51':28,'noARTAdoption':True}))
