# R2F5-K3 元物理の全7区間への到達を合法操舵で調べる試験

- K2元カメラは元のP96/4.8自動操舵でRoad0〜3のみ、37秒台落下。Road4〜6の元真カメラは**未観測**。この欠落を埋めずに未来のカメラを合成して美術審査に使わない。
- Road0の14m/28m物理差を保持した元W9C1 B48 7区間・B51 28・球半径.65m・240Hz・元P101 OVERDRIVEにより、スタート0／52m/sから自律操舵だけを変えて16試行。**32秒までの完全に同じ物理軌跡**を検証してから後半のみP96/P94の標準[-1,+1]入力の倍率・profileを変更。速度/地面/位置/CCD/衝突器やカメラを操作せず、ゴールしていないものはゴール未達として記録。
- このK3は**ネイティブ物理比較**であり、ブラウザの真カメラではない。実到達できた案だけブラウザと同じ操舵ポリシーをprivate版に限って加えて元真カメラを追試する。生成がない場合はRoad4〜6未観測を継続。
- ART0件、Slope2認定0m、B48/51新建築衝突、安全/CCD、人間走行/FPS、本番/mergeすべてHOLD。PR#46 OPEN Draft、Gold/P100/W9-X/B5、main、両本番、コース元物理保護。

## 2026-11-01：元240Hz物理16試行の実結果（CI成功）

- [元K3 Actions #41314887466](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41314887466)：**全ジョブSUCCESS**。Artifact [#13086649501](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41314887466/artifacts/13086649501)、ZIP **10,115 bytes**、SHA-256 `102079ddf56435a54769da34d3d1dbd999751a52c673b77a6f0d12504047704f`。元14/28m×後半8入力方式＝16真正Native物理走行、最初の32秒は入力/位置/速度を同じ元軌跡に保つ検証PASS。真正ソースblob `af076d67492a677d2235e4730aef8cdf4808e106`。
- 元P96÷4.8：14m `failed 37.475s`、28m `failed 37.195833s`、観測Road0〜3。倍率変更P96×6通りは全てRoad4未到達。
- `P94 corrective ÷3`：14m **`finished 51.525s`**、28m **`finished 51.270833s`**、両幅とも元の物理路面Road0〜6を実際に訪問。原倍率P94：14m **`finished 51.3625s`**、28m **`finished 51.05s`**、同じく全7区間訪問。
- つまり **16試行中4試行＝元Source W9C1 native 240Hzで実際に全7道路区間完走**。透明な追加床/テレポート/球半径変更/地面変形/コライダー追加/瞬間速度書換はゼロ。人間操舵の証拠ではない。
- [次K3Bの非公開ブラウザ再生コード`8826730b`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/8826730bcd08a7841ac211ea16213ef9314090ff)：P94/3の1方式のみを採用し、元32秒まではP96/4.8、後はP94/3の本物のユーザー操舵値に切替。**元のA1 Chromium真カメラで28枚撮影し、旧アーカイブ12カメラ・K3 nativeの記録軌跡との独立一致**を行う。現時点でK3BのCI成功は未認定。新Private copy以外のゲームに実装しない。
- 道路4/5/6の景観に巨大モデルを配置してよい証明にはまだならない。多時刻原カメラ→最小の異なる1建築→真正WebGL2のARTゲートを経てから、モデル固有B48/B51/CCD/HUMAN/FPSを進める。正式ART0・Slope2 DNA0m／PR#46 OPEN Draft／main・2本番変更なし。

