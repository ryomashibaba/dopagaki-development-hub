"""R61: read-only source-water to native moving-B51 causal-site engineering gate.
Inputs are R49 real Blender-generated DCC JSON and R60 actual Chromium/WebGL2
camera+moving B51 pose JSON. This generates an unapproved candidate site, not art,
collision safety, working water physics or gameplay changes.
Run: python scripts/k4ct-r61-source-site-gate.py <R49_DCC.json> <R60_NATIVE.json> <out.json>
"""
from __future__ import annotations
import json,math,sys
from pathlib import Path
SOURCE_ROAD_SHA='4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b'
ORIGIN=(1157.592,0.,-494.670)
SIDE=(-.3907528,0.,-.92049565)
FORWARD=(.92049565,0.,-.3907528)
def add(a,b):return tuple(x+y for x,y in zip(a,b))
def sub(a,b):return tuple(x-y for x,y in zip(a,b))
def mul(a,s):return tuple(x*s for x in a)
def dot(a,b):return sum(x*y for x,y in zip(a,b))
def norm(a):return math.sqrt(dot(a,a))
def dist(a,b):return norm(sub(a,b))
def cross(a,b):return (a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])
def loc(d,t,y):return add(add(ORIGIN,mul(SIDE,d)),add(mul(FORWARD,t),(0.,y,0.)))
def local(p):return (dot(sub(p,ORIGIN),SIDE),dot(sub(p,ORIGIN),FORWARD),p[1])
def project(world,camera,width=1014,height=699,offsetx=18,offsety=0):
 eye,front,right,up=(camera[i:i+3] for i in (0,3,6,9))
 delta=sub(world,eye);z=dot(delta,front)
 if z<=.3:return None
 x=offsetx+width/2+width*.675*dot(delta,right)/(width/height*z)
 y=offsety+height/2-height*.675*dot(delta,up)/z
 return {'x':round(x,2),'y':round(y,2),'depthM':round(z,2),
         'insideOriginalCanvas':offsetx<=x<offsetx+width and offsety<=y<offsety+height}
def segment_crosses_triangle(a,b,v0,v1,v2,eps=1e-9):
 # Group 00 is the protected VISIBLE road mesh, not the original B48 collider.
 e1=sub(v1,v0);e2=sub(v2,v0);direction=sub(b,a)
 h=cross(direction,e2);det=dot(e1,h)
 if abs(det)<eps:return False
 inv=1/det;s=sub(a,v0);u=inv*dot(s,h)
 if u<-eps or u>1+eps:return False
 q=cross(s,e1);v=inv*dot(direction,q)
 if v<-eps or u+v>1+eps:return False
 return eps<inv*dot(e2,q)<1-eps
def grouped_positions(dcc):
 result={};offset=0;vertices=dcc['vertices']
 for name,n in dcc['objects'].items():
  if name[:2] in {'00','19'}:
   result[name[:2]]=[
    tuple(float(x) for x in vertices[i*6:i*6+3])
    for i in range(offset,offset+n*3)]
  offset+=n*3
 assert offset*6==len(vertices)
 return result
def compute(dcc,native):
 assert dcc['triangles']==32004 and dcc['sourcePhysicalRoad5SHA256']==SOURCE_ROAD_SHA
 assert dcc['originalB48']==7 and dcc['originalB51']==28 and dcc['newColliders']==0
 frames=native['frames']
 assert [f['tick'] for f in frames]==[15660,15744,15924],'real native source 240Hz tick mismatch'
 assert all(len(f['trueSourceCamera'])==12 and f['nativeWebGL2'] and f['originalB51']==28 for f in frames)
 assert all(f['realNativeB51Poses'][0]['id']=='a13-machine-14' for f in frames)
 group=grouped_positions(dcc)
 b51=frames[0]['realNativeB51Poses'][0]['centre']
 water=[p for p in group['19'] if abs(p[1]-93.)<.03]
 bank=[p for p in group['19'] if abs(p[1]-93.8)<.03]
 assert len(water)>100 and len(bank)>100
 nearestWater=min(water,key=lambda p:dist(p,b51))
 nearestBank=min(bank,key=lambda p:dist(p,b51))
 # Existing real water group 19 ENDS near t=-39.8, not through a protected bank.
 sourceEnd=min(water,key=lambda p:abs(local(p)[0]-70)+2*abs(local(p)[1]+39.8))
 d,t,y=local(sourceEnd)
 assert abs(y-93)<.03 and 30<d<105 and -45<t<-35
 # Candidate virtual source-end overflow, lower turbine and BELOW-road cable.
 # NO 3D is created and no actual aperture/flow/power is claimed.
 lip=loc(d,t-4,92.4);turbine=loc(d,t-32,77.0)
 rightBuried=loc(-37,20,77.0);motorBase=loc(-37,20,113.)
 pivot=loc(-37,20,140.)
 route=[lip,turbine,loc(d,20,77),rightBuried,motorBase]
 originalRoad=[tuple(group['00'][i:i+3]) for i in range(0,len(group['00']),3)]
 collisions=[sum(1 for tri in originalRoad if segment_crosses_triangle(a,b,*tri))
             for a,b in zip(route,route[1:])]
 assert collisions==[0,0,0,0],collisions
 yaw=[f['realNativeB51Poses'][0]['yawRadians'] for f in frames]
 velocities=[(yaw[i+1]-yaw[i])/((frames[i+1]['tick']-frames[i]['tick'])/240)
             for i in range(2)]
 assert all(math.isfinite(x) and abs(x)<10 for x in velocities)
 views=[]
 for f in frames:
  cam=f['trueSourceCamera'];ob=f['realNativeB51Poses'][0]
  views.append({
   'nativeTick':f['tick'],'seconds':f['tick']/240,
   'originalMovingB51CentreXYZ':ob['centre'],
   'originalB51YawRadians':ob['yawRadians'],
   'relativeArtDrivenAngleRadians':round(ob['yawRadians']-yaw[0],6),
   'sourceWaterBoundaryScreen':project(sourceEnd,cam),
   'proposedOutflowScreen':project(lip,cam),
   'proposedTurbineScreen':project(turbine,cam),
   'proposedRightMotorPivotScreen':project(pivot,cam),
   'actualOriginalB51Screen':project(ob['centre'],cam)})
 return {
 'schema':'dopagaki-k4ct-r61-one-readonly-forebay-to-native-B51-causal-site-feasibility-v1',
 'evidenceType':'R49 REAL Blender mesh + R60 actual original 240Hz Chromium cameras and moving B51; coordinate-only site',
 'originalSource':{'R49OriginalDCCTriangles':dcc['triangles'],
   'protectedGroup19Untouched':True,'physicalRoadSourceSHA256':SOURCE_ROAD_SHA,
   'originalB48':7,'originalB51':28,'newColliders':0},
 'physicalObservations':{
   'firstB51CentreXYZ':b51,'nearestProtected19ActualWaterSurfaceY93XYZ':nearestWater,
   'nearestActualWaterSurfaceDistanceM':round(dist(b51,nearestWater),3),
   'nearestProtected19BankCrestY93point8XYZ':nearestBank,
   'nearestBankCrestDistanceM':round(dist(b51,nearestBank),3),
   'B51HeightAboveWaterSurfaceM':round(b51[1]-nearestWater[1],3),
   'sourceBoundaryActualWaterXYZ':sourceEnd,
   'sourceBoundaryLocalDTY':[round(x,3) for x in (d,t,y)],
   'intakeNotCarvedInProtectedBank':True},
 'proposedResearchSite_NOT_AUTHORING':{
   'physicalSystem':'Source water natural end -> lower outflow -> turbine below road -> buried electrical busduct -> outboard actuator visualization',
   'sourceBoundaryXYZ':sourceEnd,'outflowXYZ':lip,'turbineXYZ':turbine,
   'belowRoadCablePolylineXYZ':route,'motorBaseXYZ':motorBase,'motorPivotXYZ':pivot,
   'outflowDropM':round(lip[1]-turbine[1],2),
   'roadMeshSegmentIntersections':collisions,
   'roadMeshIntersectionCheckScope':'Original group00 triangle skin only. Not formal B48 clearance or object collision QA.',
   'visualLinkAcrossRoadProven':False,'realFluidFlowOrElectricalPowerProven':False,
   'originalB51KinematicActuationProven':False},
 'sourceMotion':{'sourceYawRadians':yaw,'sourceYawRatesRadPerSecond':velocities,
   'relativeDisplacementM':[round(dist(f['realNativeB51Poses'][0]['centre'],b51),4) for f in frames],
   'allowResearchVisualFollowerOnly':True},
 'trueSourceCameraScreenProjections_NOT_NativeCandidateArt':views,
 'conclusion':{
   'SITE_GEOMETRY':'BOUNDED_PREFLIGHT_PASS_NONCOLLIDING_PROPOSED_ROUTE_NOT_DESIGN_APPROVED',
   'ART':'HOLD',
   'reason':'A source-end fall and buried route not intersecting original group00 skin appear possible; original B51 motion observed. Actual turbine, 3D, flow, motor coupling, human readability and physical collision remain unproven.',
   'next':'One real Blender integrated candidate only when source-end fall/foundation and synchronized motor can be visually recognized in true original WebGL2 at 65.25/65.60/66.35 without false collision/safe lane.',
   'formalArtAdopted':0,'slope2DNAmeters':0,'HUMAN':'HOLD','SAT':'HOLD','CCD':'HOLD','FPS':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'},
 'safety':{'modifiesSource':False,'newBlenderRuns':0,'newGithubActionsRuns':0,'newPaidAPIJPY':0}}
def main():
 assert len(sys.argv)==4, 'usage: site-gate.py R49_DCC.json R60_NATIVE.json OUT.json'
 result=compute(json.loads(Path(sys.argv[1]).read_text()),json.loads(Path(sys.argv[2]).read_text()))
 dst=Path(sys.argv[3]);dst.parent.mkdir(parents=True,exist_ok=True)
 dst.write_text(json.dumps(result,indent=2)+'\n')
 print(json.dumps({'status':result['conclusion']['SITE_GEOMETRY'],
   'waterDistanceM':result['physicalObservations']['nearestActualWaterSurfaceDistanceM'],
   'bankDistanceM':result['physicalObservations']['nearestBankCrestDistanceM'],
   'yawVelocity':result['sourceMotion']['sourceYawRatesRadPerSecond'],
   'roadSkinLineHits':result['proposedResearchSite_NOT_AUTHORING']['roadMeshSegmentIntersections'],
   'ART':'HOLD'}))
if __name__=='__main__':main()
