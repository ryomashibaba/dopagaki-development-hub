"""R2F5-D genuine Native Blender art-only relocation of one Road1 facility.
Byte-exact R2F5-B is preserved; 11.504s control and original game unchanged.
All source B48/B51, ground support, real play and ART certification remain HOLD.
"""
from pathlib import Path
import hashlib
archived=Path(__file__).with_name("p101-r19a6p4r2f5b-native-support-hall.py")
raw=archived.read_bytes()
sha=hashlib.sha1(b"blob "+str(len(raw)).encode()+b"\0"+raw).hexdigest()
assert sha=="a6ee111319a81c7e83b1a85664d0b1c4da40bbcb","R2F5-B source unexpectedly changed"
source=raw.decode("utf-8")
replacements={
 "roadU=.100 if index==0 else .350":"roadU=.125 if index==0 else .350",
 "roadsideCentre=roadEdge+roadOut*35":"roadsideCentre=roadEdge+roadOut*(45 if index==0 else 35)",
 '"offsetFromOriginalRoadEdgeM":35,':'"offsetFromOriginalRoadEdgeM":45 if index==0 else 35,',
}
for a,c in replacements.items():
 assert source.count(a)==1,("Archived R2F5-B structure changed",a)
 source=source.replace(a,c)
source=source.replace("r2f5b","r2f5d").replace("R2F5B","R2F5D")
exec(compile(source,str(archived),"exec"),{"__name__":"__main__","__file__":str(archived)})
