"""R26 research-only TRUE Blender marker-probe for the candidate site's OWN depth visibility.
Injected into an isolated copy of the verified R12A Blender author. These amber
silhouettes are diagnostic measuring instruments, NOT proposed game art.
NEVER promote them to Game, road, collision, ART, or production.
"""
import json
from pathlib import Path
assert site['sourceGameBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert site['researchPhysicalRoad5SHA256']=='4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b'
assert site['originalB48Count']==7 and site['originalB51Count']==28 and site['newColliders']==0
assert len(GROUPS)==43
R26_PROTECTED_IDS=('00','12','13','19','34','35','41','42')
R26_PROTECTED={key:len(mesh) for key,mesh in GROUPS.items() if key[:2] in R26_PROTECTED_IDS}
assert len(R26_PROTECTED)==len(R26_PROTECTED_IDS) and all(R26_PROTECTED.values())
R26_NAMES={name[:2]:name for name in GROUPS}
# THREE genuinely different sites in road-source coordinates; not analytic NDC claims.
# 15: earlier RH shoreline, 16: midway opposite bank, 17: late RH shoreline.
R26_SITES=(
 ('15',5,.89,'R',36.0,13.0),
 ('16',6,.39,'L',48.0,18.0),
 ('17',6,.79,'R',46.0,17.0),
)
R26_PROBES=[]
for ident,idx,u,bank,offset,height in R26_SITES:
    group=R26_NAMES[ident]
    GROUPS[group].clear()
    roadpoint,forward,lateral=frame(idx,u)
    edge=offset_edge(roadpoint,lateral,offset,bank)
    centre=add(edge,(0,height,0))
    # Real, sealed, large 3D Blender silhouette. Off-road; no collider. One
    # unique source group per site makes native GL leave-one-out attributable.
    box(group,centre,26,15,32,'amber',forward,lateral)
    base=add(centre,(0,-19,0))
    beam(group,base,add(centre,(0,24,0)),2.4,'weathered_iron')
    beam(group,add(centre,(0,21,0)),add(centre,(0,30,0)),3.0,'lights')
    R26_PROBES.append(dict(id=ident,road=idx,u=u,bank=bank,
        outboardM=offset,heightOffsetM=height,worldXYZ=centre,
        triangles=len(GROUPS[group]),name=group))
assert all(len(GROUPS[R26_NAMES[i]])>0 for i,*_ in R26_SITES)
assert all(len(GROUPS[key])==n for key,n in R26_PROTECTED.items())
assert len(GROUPS)==43 and site['newColliders']==0
output=Path('test-results/k4ct-r26-site-probe')
output.mkdir(parents=True,exist_ok=True)
(output/'R26_THREE_REAL_DCC_SITE_COORDINATES.json').write_text(
    json.dumps(dict(schema='k4ct-r26-real-blender-site-probe-v1',sites=R26_PROBES,
      diagnosticsOnly=True,originalGameAndCameraUnmodified=True,
      originalB48=7,originalB51=28,newColliders=0,
      ART='HOLD',formalARTAdopted=0,slope2DNAmeters=0),indent=2)+'\n')
print('R26_TEMP_REAL_BLENDER_THREE_SITES_CREATED_NOT_ART',
      json.dumps(R26_PROBES,ensure_ascii=False))
