"""K4 isolated native Blender injection into a SHA-pinned historical B builder.
Do not edit history/source. B outputs five editable meshes as before.
K4 is an ART-HOLD visual candidate, NOT integrated gameplay.
"""
from pathlib import Path
import json,hashlib
base=Path(__file__).with_name("p101-r19a6p4r2f5b-native-support-hall.py")
raw=base.read_bytes()
digest=hashlib.sha1(b"blob "+str(len(raw)).encode()+b"\0"+raw).hexdigest()
assert digest=="a6ee111319a81c7e83b1a85664d0b1c4da40bbcb",digest
source=raw.decode("utf8")
marker=" # R2F5B: two source-camera-VERIFIED near-road public halls, NOT\n"
assert source.count(marker)==1
injection=''' # K4: add exactly ONE native Road0 market candidate to the Road0 mesh.
 if index==4:
  from importlib.util import spec_from_file_location,module_from_spec
  from pathlib import Path
  k4path=Path(__file__).with_name("p101-r19a6p4r2f5k4-open-market.py")
  k4spec=spec_from_file_location("r2f5k4_market",k4path)
  k4mod=module_from_spec(k4spec)
  k4spec.loader.exec_module(k4mod)
  k4CandidateInfo=k4mod.add_open_market(addloft,frame)
'''
source=source.replace(marker,injection+marker)
scope={"__name__":"__main__","__file__":str(base)}
exec(compile(source,str(base),"exec"),scope)
assert "k4CandidateInfo" in scope
# The original builder has already exported actual native BLEND/GLB.
report_path=Path(scope["rep"])
report=json.loads(report_path.read_text(encoding="utf8"))
report["k4SingleCandidate"]=scope["k4CandidateInfo"]
report["k4OriginalBuilderGitBlob"]=digest
report["k4OfficialArtAcceptance"]=False
report["k4Slope2DNARecognizedM"]=0
report_path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
assert Path(scope["out"]).is_file() and Path(scope["blend"]).is_file()
print("R2F5K4_NATIVE_SINGLE_OPEN_MARKET_GENERATED_ART_HOLD",report["k4SingleCandidate"])
