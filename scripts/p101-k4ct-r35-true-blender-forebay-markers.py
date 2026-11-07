"""R35 research-only TRUE Blender marker-probe for the candidate site's OWN depth visibility.
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
R35_PROTECTED_IDS=('00','12','13','19','34','35','41','42')
R35_PROTECTED={key:list(mesh) for key,mesh in GROUPS.items() if key[:2] in R35_PROTECTED_IDS}
assert len(R35_PROTECTED)==len(R35_PROTECTED_IDS) and all(R35_PROTECTED.values())
R35_NAMES={name[:2]:name for name in GROUPS}
# THREE genuinely different sites in road-source coordinates; not analytic NDC claims.
# All 3 are co-located in source Road6 U=0.15, varying only RIGHT-bank distance.
R35_SITES=(
 ('15',6,.150,'R',55.0,100.5),
 ('16',6,.150,'R',75.0,100.5),
 ('17',6,.150,'R',95.0,100.5),
)
# R35: All three diagnostic sites are at one actual Road6 cross-section.
# The immutable source forebay group19 is on Road6 RIGHT d=42..102m
# and world Y=93m, so all markers occupy its true 3D footprint.
# The prototype is intentionally amber and conspicuous; it is a measuring
# instrument, not proposed scenery or a certification.
R35_PROBES=[]
for ident,idx,u,bank,offset,worldY in R35_SITES:
    group=R35_NAMES[ident]
    GROUPS[group].clear()
    roadpoint,forward,lateral=frame(idx,u)
    edge=offset_edge(roadpoint,lateral,offset,bank)
    centre=(edge[0],worldY,edge[2])
    # Original Blender authored mesh: a small sealed source-aligned solid
    # with 10m vertical span, centred 7.5m above protected Road6 sea level.
    box(group,centre,12.,10.,16.,'amber',forward,lateral)
    beam(group,add(centre,(0,0,0)),add(centre,(0,9.,0)),1.7,'lights')
    R35_PROBES.append(dict(id=ident,road=idx,u=u,bank=bank,
        forebayGroup19Protected=True,forebaySurfaceWorldY=93.,
        outboardM=offset,centerWorldY=worldY,
        baseWorldYAtBoxCenterMinus5=worldY-5.,
        worldXYZ=centre,triangles=len(GROUPS[group]),name=group))
assert all(len(GROUPS[R35_NAMES[i]])>0 for i,*_ in R35_SITES)
assert all(GROUPS[key]==triangles for key,triangles in R35_PROTECTED.items())
assert len(GROUPS)==43 and site['newColliders']==0
output=Path('test-results/k4ct-r35-site-probe')
output.mkdir(parents=True,exist_ok=True)
(output/'R35_THREE_REAL_DCC_SITE_COORDINATES.json').write_text(
    json.dumps(dict(schema='k4ct-r35-real-blender-site-probe-v1',sites=R35_PROBES,
      diagnosticsOnly=True,originalGameAndCameraUnmodified=True,
      originalB48=7,originalB51=28,newColliders=0,
      ART='HOLD',formalARTAdopted=0,slope2DNAmeters=0),indent=2)+'\n')
print('R35_TEMP_REAL_BLENDER_THREE_SITES_CREATED_NOT_ART',
      json.dumps(R35_PROBES,ensure_ascii=False))
