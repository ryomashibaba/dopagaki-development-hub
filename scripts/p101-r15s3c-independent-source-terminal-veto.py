#!/usr/bin/env python3
"""Independent original B48 34s prefix and 50s genuine terminal/source-QA."""
import argparse,json,copy,math
from pathlib import Path
SHA="af076d67492a677d2235e4730aef8cdf4808e106"
def check(d,ref):
    assert d["sourceBlob"]==ref["sourceGameBlob"]==SHA
    assert d["sourcePhysicsHz"]==240
    assert d["fullActualNativeContinuationTrials"]==2
    assert d["comparisonR15S3BRunId"]==40866341059
    assert d["originalCourseAndCameraUnmodified"] and d["originalB51Preserved"]
    assert d["sourceNewColliders"]==0 and d["standardP94LegalInputOnly"]
    assert d["source34SecondsRunningNotFinish"] is True
    assert d["webGLRendered"] is False and d["humanOrArtCertified"] is False
    assert d["officialArt"]==d["officialSlope2Meters"]==0
    assert all(d[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
    assert set(d["cases"])=={"true-pinch","pinch-switch"}
    out=[]
    for world,r in d["cases"].items():
        baseline=ref["actualCases"][world]["E_BANKED_LANDING"]["P94_FULL_AFTER_21P5"]
        assert baseline["originalSourceStatus"]==r["source34sPreviousStatus"]=="running"
        assert baseline["trueTerminalSeconds"]==34
        assert r["source34sPrefixChecks"]==len(baseline["checkpointAndQuarterSecondSourceTrajectory"])
        assert r["sourceFullActualRunner"] and r["originalGameCodeEdited"] is False
        assert r["realTerminalStatus"] in ("finished","running","failed")
        assert r["trueFinished"]==(r["realTerminalStatus"]=="finished")
        assert r["simulatedEndpointIsAuthoritative"]==(r["realTerminalStatus"]!="running")
        assert 34<=r["realTerminalSeconds"]<=50.000002
        assert r["lastActualRoadGrounding"] is not None
        assert r["lastActualRoadGrounding"]["timeSeconds"]<=r["realTerminalSeconds"]
        assert r["actualGroundedTicksAfter34"]>=0
        assert isinstance(r["original28B51MovingContactEvents"],list)
        assert isinstance(r["actuallyVisitedRealGroundedRoads"],list)
        assert isinstance(r["actualNativeTracePost34"],list)
        if r["realTerminalStatus"]=="failed":
            assert isinstance(r["nativeFailureReason"],str) and r["nativeFailureReason"]
        out.append({"world":world,"nativeStatus":r["realTerminalStatus"],
             "terminal":r["realTerminalSeconds"],"lastGrounded":r["lastActualRoadGrounding"]["timeSeconds"],
             "post34GroundedSeconds":r["actualGroundedTicksAfter34"]/240,
             "realGroundedRoads":r["actuallyVisitedRealGroundedRoads"]})
    return out
def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--result",required=True);ap.add_argument("--reference",required=True);ap.add_argument("--out",required=True)
    a=ap.parse_args()
    d=json.loads(Path(a.result).read_text())
    ref=json.loads(Path(a.reference).read_text())
    observations=check(d,ref)
    rejected=[]
    for name,mutation in (
      ("fake_webgl",lambda x:x.update(webGLRendered=True)),
      ("fake_art",lambda x:x.update(officialArt=1)),
      ("fake_slope2",lambda x:x.update(officialSlope2Meters=10)),
      ("fake_34_finish",lambda x:x.update(source34SecondsRunningNotFinish=False)),
      ("fake_engine",lambda x:x.update(sourcePhysicsHz=60)),
      ("fake_hidden_colliders",lambda x:x.update(sourceNewColliders=2)),
      ("fake_human",lambda x:x.update(humanOrArtCertified=True)),
      ("fake_original_match",lambda x:x["cases"]["true-pinch"].update(source34sPrefixChecks=1)),
      ("fake_gameplay",lambda x:x.update(GAMEPLAY="PASS")),
      ("fake_B51",lambda x:x.update(originalB51Preserved=False))
    ):
        f=copy.deepcopy(d);mutation(f)
        try:check(f,ref)
        except (AssertionError,TypeError,ValueError,KeyError): rejected.append(name)
        else:raise AssertionError("forged R15S3C official source claim passed "+name)
    result={"schema":"dopagaki.r15s3c-independent-real-34s-prefix-and-terminal-qa/1",
      "originalGameBlob":SHA,"sourceTrials":2,"observedRealNativeTerminal":observations,
      "rejectedForgedSourceOrGameplayClaims":rejected,
      "officialArt":0,"officialSlope2Meters":0,"humanOrArtCertified":False}
    Path(a.out).mkdir(parents=True,exist_ok=True)
    Path(a.out,"R15S3C_INDEPENDENT_34S_PREFIX_TRUE_TERMINAL_QA.json").write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n")
    print("R15S3C_TRUE_SOURCE_34S_PARITY_TERMINAL_QA_PASS",json.dumps(result,ensure_ascii=False))
if __name__=="__main__": main()
