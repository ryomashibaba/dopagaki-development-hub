"""R2F source-camera-first, read-only Blender geometry diagnostic.
This only projects mesh VERTICES; it does not prove actual visible pixels,
static road clearance, walkability, artistic quality or gameplay fairness.
Run with: blender -b SOURCE.blend --python THIS_FILE -- --mode ultra
  --cameras docs/...json --report r19-evidence/.../R2F_ultra_camera.json
"""
import bpy,sys,json,math,os
from mathutils import Vector
from mathutils.kdtree import KDTree

def args():
    a=sys.argv[sys.argv.index("--")+1:]
    def value(k):
        return a[a.index(k)+1]
    return value("--mode"),value("--cameras"),value("--report")
mode,camera_path,output=args()
assert mode in ("ultra","control")
cams=json.load(open(camera_path,encoding="utf-8"))
assert cams["origin"]["originalGitBlob"]=="af076d67492a677d2235e4730aef8cdf4808e106"
frames=sorted((x for x in cams["frames"] if x["mode"]==mode),key=lambda x:x["tick"])
assert [x["tick"] for x in frames]==[265,721,1057,1249,1921,2761]
objects=sorted((x for x in bpy.context.scene.objects if x.type=="MESH"),key=lambda x:x.name)
assert len(objects)==5
points=[]
for obj in objects:
    values=[]
    for vert in obj.data.vertices:
        w=obj.matrix_world @ vert.co
        xyz=Vector((w.x,w.z,-w.y)) # Blender Z-up to original WebGL2 Y-up
        assert all(math.isfinite(float(v)) and abs(float(v))<1e6 for v in xyz)
        values.append(xyz)
    assert len(values)>1000
    points.append(values)
def projection(frame,xyz):
    eye=Vector(frame["eye"])
    forward=Vector(frame["front"]).normalized()
    right=forward.cross(Vector((0,1,0))).normalized()
    up=right.cross(forward).normalized()
    v=xyz-eye
    z=v.dot(forward)
    if z<=.66:return None
    xn=1.35*v.dot(right)/(1013/698)/z
    yn=1.35*v.dot(up)/z
    if abs(xn)>=1 or abs(yn)>=1:return None
    return ((xn+1)*1013/2,(1-yn)*698/2,z)

results=[]
for shot in frames:
    ds=[]
    for i,vertices in enumerate(points):
        projected=[p for v in vertices if (p:=projection(shot,v)) is not None]
        ds.append({
            "district":i+1,
            "insideFrustumVertexCount":len(projected),
            "screenBoundPx":[round(min(p[0] for p in projected),2),
                             round(min(p[1] for p in projected),2),
                             round(max(p[0] for p in projected),2),
                             round(max(p[1] for p in projected),2)] if projected else None,
            "meanDepthM":round(sum(p[2] for p in projected)/len(projected),2) if projected else None
        })
    results.append({"mode":mode,"tick":shot["tick"],"timeS":round(shot["tick"]/240,6),"districts":ds})
separations=[]
for i in (0,1):
    kd=KDTree(len(points[i+1]))
    for k,v in enumerate(points[i+1]):kd.insert(v,k)
    kd.balance()
    gap=min(kd.find(v)[2] for v in points[i])
    separations.append({
        "districtPair":[i+1,i+2],
        "minimumVertexDistanceM":round(gap,6),
        "meaning":"vertex sampling only; not connected surfaces nor clearance certification"
    })
payload={
 "schema":"dopagaki.r2f-original-camera-project-mesh-vertices/1",
 "mode":mode,
 "sourceGitBlob":"af076d67492a677d2235e4730aef8cdf4808e106",
 "originalCameraFrames":6,
 "districts":5,
 "siteVertexCounts":[len(x) for x in points],
 "adjacentMeshVertexGaps":separations,
 "frames":results,
 "notCertified":["actualPixelVisibility","B51Occlusion","collisionWithOriginalRoad",
   "terrainSupport","humanPedestrianAccess","artisticQuality","manualRacing","FPS"],
 "ART":"HOLD","HUMAN":"HOLD","GAMEPLAY":"HOLD","PERFORMANCE":"HOLD",
 "RELEASE":"HOLD","MERGE":"HOLD"
}
os.makedirs(os.path.dirname(os.path.abspath(output)),exist_ok=True)
with open(output,"w",encoding="utf-8") as f:json.dump(payload,f,ensure_ascii=False,indent=2)
print("R2F_CAMERA_FIRST_READONLY",json.dumps({
 "mode":mode,"frames":[x["tick"] for x in results],
 "siteVertices":[len(x) for x in points],
 "meshVertexSeparations":separations,"ART":"HOLD"}))
