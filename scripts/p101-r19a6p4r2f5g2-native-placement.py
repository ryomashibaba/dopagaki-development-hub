"""R2F5-E isolated native replacement of the D camera-aligned facility.
Uses immutable B base, D location, one new genuine Blender architectural model.
No physical game, main, production or historical R2F5-B/D mutation.
"""
from pathlib import Path
import hashlib
archived=Path(__file__).with_name("p101-r19a6p4r2f5b-native-support-hall.py")
raw=archived.read_bytes()
sha=hashlib.sha1(b"blob "+str(len(raw)).encode()+b"\0"+raw).hexdigest()
assert sha=="a6ee111319a81c7e83b1a85664d0b1c4da40bbcb","Archived R2F5-B content changed"
source=raw.decode("utf-8")
replacements={
 "roadU=.100 if index==0 else .350":"roadU=.125 if index==0 else .350",
 "roadsideCentre=roadEdge+roadOut*35":"roadsideCentre=roadEdge+roadOut*(45 if index==0 else 35)",
 '"offsetFromOriginalRoadEdgeM":35,':'"offsetFromOriginalRoadEdgeM":45 if index==0 else 35,',
}
for old,new in replacements.items():
 assert source.count(old)==1,("Archived B position drift",old)
 source=source.replace(old,new)
begin="  if index==0:\n   from mathutils import Matrix\n"
end="  else:\n    # R2F5-A CAMERA-FIRST RECONCEPTION"
assert source.count(begin)==1 and source.count(end)==1
start=source.index(begin)
stop=source.index(end,start)
replacement="""  if index==0:
   from mathutils import Matrix
   from pathlib import Path
   import importlib.util
   hall_script=Path(__file__).with_name("p101-r19a6p4r2f5g2-native-hall.py")
   spec=importlib.util.spec_from_file_location("r2f5g2_native_hall",hall_script)
   module=importlib.util.module_from_spec(spec)
   spec.loader.exec_module(module)
   new=module.build_hall(bpy,Vector,Matrix,pg,up,lat,toward,palette)
   nativeParts=new["nativeParts"]
   nativeWorld=new["nativeWorld"]
   nativeCount=new["nativeCount"]
   nativeSupportError=new["nativeSupportError"]
   interiorOpenGalleries=new["interiorOpenGalleries"]
   marketBays=new["marketBays"]
   retailBaseZ=new["retailBaseZ"]
   venueKind=new["venueKind"]
"""
assert "   station=" not in replacement, "global road station() must remain a function"
source=source[:start]+replacement+source[stop:]
source=source.replace("r2f5b","r2f5g2").replace("R2F5B","R2F5G2")
exec(compile(source,str(archived),"exec"),{"__name__":"__main__","__file__":str(archived)})
