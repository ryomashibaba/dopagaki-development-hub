"""R22 proof-preserving reuse of genuine R21 Blender material bridge.
R21 true saved/reopened Blender node changes are verified in its CI artifact.
Re-create ONLY material stride indices 12/13 using that proven record and
the ORIGINAL true R20 scene. Reproduction must have EXACT prior R21 SHA256.
NO geometry edits, no new Blender run, no original source Game writes.
"""
import json,hashlib,pathlib,shutil
R20=pathlib.Path('test-results/k4ct-r22-source-r20/k4ct-contact-retry')
R21=pathlib.Path('test-results/k4ct-r22-source-r21')
OUT=pathlib.Path('test-results/k4ct-contact-retry')
PROOF=pathlib.Path('test-results/k4ct-r22-proofs')
OUT.mkdir(parents=True,exist_ok=True);PROOF.mkdir(parents=True,exist_ok=True)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
a=R20/'K4CT_R9_BLENDER_TRUE_MATERIAL_BRIDGE.json'
d=R20/'K4CT_DCC_BLENDER_TO_NATIVE_GEOMETRY.json'
blend=R21/'k4ct-contact-retry/K4CT_EDITABLE_SOURCE_ALIGNED_TIDAL_SPILLWAY_ART_REJECT.blend'
p=R21/'k4ct-r21-native-material/K4CT_R21_GENUINE_BLENDER_MARINE_BSDF_PROOF.json'
assert all(x.exists() and x.stat().st_size>100 for x in (a,d,blend,p))
original=json.loads(a.read_text());proof=json.loads(p.read_text())
geodata=json.loads(d.read_text())
assert proof['schema']=='k4ct-r21-actual-blender-archive-reopen-bsdf-marine-node-bridge-v1'
assert proof['realSavedAndReopenedPrincipledNodes'] and proof['originalDccByteIdentical']
assert sha(a)==proof['sourceR9Sha256']
assert sha(d)==proof['originalDccSha256']==proof['outputDccSha256']
assert sha(blend)==proof['outputBlendSha256']
assert len(geodata['objects'])==43 and geodata['triangles']==25700
assert original['triangles']==21092 and original['roadLegacyTriangles']==4608
assert original['strideFloats']==14 and len(original['materials'])==41
assert geodata['originalB48']==7 and geodata['originalB51']==28 and geodata['newColliders']==0
m=proof['marineMaterialChanges'];origOther=proof['originalMaterialNodeValuesUnchanged']
assert len(m)==12 and len(origOther)==29
after={k:val['after'] for k,val in m.items()}
after.update(origOther)
assert len(after)==41
for name,r in m.items():
 assert r['before']!=r['after'] and r['trueMeshAttributeVertexCount']>0
 assert abs(r['before']['roughness']-.74)<.0001
 assert abs(r['before']['metalness']-.08)<.0001
new=dict(original)
new['materials']=[dict(row,roughness=after[row['name']]['roughness'],
                       metalness=after[row['name']]['metalness'])
                  for row in original['materials']]
verts=original['vertices'];v=list(verts)
trueCounts={k:0 for k in m}
for i in range(0,len(v),14):
 mid=v[i+11]
 assert float(mid).is_integer() and 0<=mid<len(new['materials'])
 name=new['materials'][int(mid)]['name']
 originalEntry=original['materials'][int(mid)]
 assert abs(v[i+12]-originalEntry['roughness'])<.0001
 assert abs(v[i+13]-originalEntry['metalness'])<.0001
 v[i+12]=after[name]['roughness']
 v[i+13]=after[name]['metalness']
 if name in trueCounts:trueCounts[name]+=1
 assert v[i:i+12]==verts[i:i+12]
assert all(trueCounts[k]==m[k]['trueMeshAttributeVertexCount'] for k in m)
assert original['legacyRoadVertices']==new['legacyRoadVertices']
new['vertices']=v
new['r21ActualBlenderNodeSemanticsProven']=True
new['r21OriginalXYZRGBNormalsUVIDsUnchanged']=True
new['ART']='REJECT'
outR9=OUT/a.name
outR9.write_text(json.dumps(new,separators=(',',':'))+'\n')
assert sha(outR9)==proof['outputR9Sha256'],('FAIL_CANNOT_REPRODUCE_PRIOR_R21_TRUE_BLENDER_BRIDGE',sha(outR9),proof['outputR9Sha256'])
for file,target in ((d,OUT/d.name),(blend,OUT/blend.name)):
 shutil.copyfile(file,target)
assert sha(OUT/d.name)==sha(d)
assert sha(OUT/blend.name)==sha(blend)
audit={
 'schema':'k4ct-r22-true-r21-blender-node-bridge-byte-identical-reuse-v1',
 'R20SourceRun':42307252065,'R21MaterialTrueBlenderRun':42309755398,
 'actualOriginalR21BlenderBlendReused':True,
 'R21GenuineOutputBlendSha256':sha(blend),
 'R21GenuineBridgeSha256':proof['outputR9Sha256'],
 'reconstructedR9Sha256':sha(outR9),
 'reconstructedTrueR21BridgeExactlyByteIdentical':True,
 'R20BlenderMeshGeometrySHA256':sha(d),
 'allSourceGeometryUnchanged':True,
 'originalB48':7,'originalB51':28,'newColliders':0,'meshes':43,
 'triangles':25700,'newMeshAuthoring':False,'additionalBlenderRun':False,
 'all41MaterialsFromVerifiedTrueBlenderNodeEvidence':True,
 'changed12Marine':{k:{'roughness':after[k]['roughness'],
                       'metalness':after[k]['metalness'],'vertices':trueCounts[k]} for k in m},
 'ART':'REJECT','formalARTAdopted':0,'slope2DNAmeters':0,
 'HUMAN':'HOLD','SAT':'HOLD','CCD':'HOLD','FPS':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'
}
(PROOF/'K4CT_R22_REAL_R21_BLENDER_BRIDGE_SHA256_PROVENANCE.json').write_text(
 json.dumps(audit,indent=2)+'\n')
print('R22_REUSE_R21_BSDF_TRUE_BLENDER_BRIDGE_BYTE_EXACT_PASS',
      json.dumps({'sha256':sha(outR9),'materials':len(after),'triangles':25700,'newMesh':False}))
