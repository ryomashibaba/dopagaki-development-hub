## 【K4AC追補：2026-11-02 GPU不要の再現可能なGL状態復元テスト6/6 PASS／実GPU未確認】

- [実際のK4AC深度計測コード](../scripts/p101-r19a6p4r2f5k4ac-native-depth-probe.mjs)を動的に読み出して、その`page.evaluate`深度読出し部分自体を実行する[Mock WebGL2回帰テスト](../tests/k4ac-gl-state-restoration.mock.mjs)を追加した。別物の簡略化ロジックを試しただけではない。
- **全6条件で独立実行PASS**：成功（通常active texture unit、TEXTURE0 active）、DEPTH blit GL error、depth readPixels GL error、FBO incomplete、元framebuffer depth missing。READ/DRAW FBO、両テクスチャバインド、active texture unit、PACK_ALIGNMENTの復元と、default framebufferへの不適切なreadBuffer操作0を照合した。成功模擬では8px刻み256モック深度サンプル（128×128）を回収。
- **これは本物のWebGL2のGPU検証ではなく模擬エンジンの回帰テスト**。実ロード5の画素/深度、真の物体ID/見通しの計測、ART合格、FPS、人体通行・SAT/CCDの達成は主張しない。ローカル独立環境のChromiumで真WebGL2を起動できず、localhostブラウザ経路も制限されたため、実GPU段階はGitHub Actionsが唯一の検証経路。
- この6件はK4AC専用Workflowの**最初のSource freeze / syntax step**へ組み込み済み。[新版 GitHub Actions #41453572178](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41453572178)を登録。旧#41452389126はconcurrencyでcancelled。現時点の新版はpending/未実行、実Artifactなし。**K4AC native depth=UNKNOWN/HOLD**、K4AB SOURCE TECH限定PASSは維持。
- 機能上の保護：Source blob `af076d67492a677d2235e4730aef8cdf4808e106`、元球・240Hz/カメラ/B48 7/B51 28、main/本番2URL/Gold/P100/W9-X/B5無変更、候補新モデル/コライダー0、正式ART採用0・Slope2 DNA0m、候補SAT/CCD/歩行/HUMAN/FPS/RELEASE/MERGE HOLD、PR#46 Draft未マージ。

---

# DOPAGAKI SLOPE K4AC — 真正Road5 WebGL2深度読出し可否・原3D画素不変監査

2026-11-02 JST。**研究コード実装済み／CI結果待ち。ART採用不可、SOURCE TECHの新規PASS未認定。**

## 現在の固定結果と停止ゲート

- 最終確定した前段はK4AB（Actions #41448066954、Artifact #13144320278、真正描画群差分SOURCE TECH限定PASS）。この事実は変更しない。
- 継続先は `ryomashibaba/dopagaki-development-hub` の `p101-velocity-overdrive-native-trial`、Draft PR #46（未マージ）。元ゲームGit blob `af076d67492a677d2235e4730aef8cdf4808e106`、240Hz、球半径0.65m、原カメラ、B48 7道路、B51動体28基を保存する。
- K4ACは研究用 `dist-private/r19a6p4r2f5k4ab` を再構築して**本物の合法操舵のRoad5**を再走行させるだけで、ゲーム正本・Gold/P100/W9-X/B5・main・本番2URLを変更しない。
- 新建築0／新コライダー0。旧K4/K4R/K4UのART REJECT、正式ART採用0件、Slope2 DNA認定0mを維持。SAT/CCD/歩行/HUMAN/FPS/RELEASE/MERGEはHOLD。

## 今回GitHubに実装した内容

1. [K4AC WebGL2深度読出し試験](../scripts/p101-r19a6p4r2f5k4ac-native-depth-probe.mjs)：元K4Z 82真正PNGに紐づくRoad5の7tick（10680〜11400、44.5〜47.5秒）×14m/28mの**14元画像**を改めて取得。球XYZ・速度・CameraEye/Front・元road ID照合。元46.0秒の同一元シーンで、K4AB由来の真描画群6種×2幅の研究用一時マスク12条件と深度差分を比較する。マスクはプライベートな表示のみに作用、元描画に復元。
2. **深度が読めると決めつけない。** WebGL2の既定フレームバッファから一時FBOへdepth-only blitし、8px間隔の非線形深度サンプルを取得できるか、実際のドライバ応答を記録する。GPUエラー・FBO不完全・全背景値・読出し非対応なら `DEPTH_UNAVAILABLE_OR_UNVALIDATED_HOLD`。これはSOURCEの深度取得可能性の実測であり、物体ID、道路の衝突面、空き敷地、公共空洞の可読性の証明ではない。
3. [独立Python監査](../scripts/p101-r19a6p4r2f5k4ac-audit-native-depth.py)：元K4Z 82PNG SHA、今回14PNGのフルSHAとP74本物のCSS `NEAR MISS` 領域（x200..809,y418..589）**外の3D各ピクセル完全一致**を検査。深度比較の changed/farther/nearer を独立再計算し、偽の3D画素変更・深度変化の負例を検査。
4. [専用GitHub Actions](../.github/workflows/p101-r19a6p4r2f5k4ac-native-depth-probe.yml)：元ソースのGit blobピン留め、Chromium真正WebGL2、独立画素監査、研究Artifact保存。**CI成功でも深度未対応ならDEPTH HOLD。** 自動的にART合格や本番公開に進めない。

## 【2026-11-02 K4AC追補：WebGL2状態復元の誤りを修正・新しい実CIを起動】

最初のK4AC source auditに対して独立静的査読を実施した結果、読み出し専用コードの**GL READ framebufferを束縛しないまま `gl.readBuffer(gl.NONE)` を呼ぶ問題**、**アクティブなテクスチャユニットとTEXTURE0のバインド復元を混同する問題**を発見して修正した。コンテキストロスト時の無限エラーループも上限12回に変更した。元Sourceやカメラ／物理コード自体の変更ではなく、隔離研究用GLの状態復元修正。

さらに**深度プローブの前後に同一pause native tickの真正Source PNGを取得する二重検査**を追加した。幅14m/28m×Road5 7tick=14対のbefore/after画像を、元K4Z保存画像とともに独立Python監査する。元CSS P74 0.24秒アニメの実ROI(x200..809,y418..589)以外、**afterの全3Dピクセルが元画像およびbeforeに完全一致**しなければCI FAIL。GL操作が元ゲームの表示を壊す場合を見逃さない。新たな改ざん許容領域や緩い画素差閾値は導入しない。

最終の検証対象コミット `46f9b8c3b362eebedce3053730006c4812ec32e5`、[K4AC新Actions #41452389126](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41452389126)。最初の #41450761768 は新しいコミットによってキャンセルされたため、これをK4AC最終実行と扱わない。**上記新CIの深度取得・原PNG全一致・Artifactの成否は未判定**。SOURCE TECH合格の新規宣言不可。旧K4AB最終SOURCE TECH限定PASS、旧K4/K4R/K4U独立ART REJECT、正式ART採用0、Slope2 DNA0m、元ゲーム・本番・main保護、SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLDを厳守する。

---

## CIと採否の現状

- 初回K4AC Actions: [#41450761768](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41450761768)（登録を確認、実行・結論は未検証）。
- したがって現時点で `K4AC SOURCE TECH=HOLD_PENDING_CI`、`GPU_DEPTH=UNKNOWN`、`ART=NOT_TESTED_HOLD`。
- CI完了後は**実ジョブ結論、生成JSON、原PNG一致、深度復元差分、サンプリング方法、実Artifact SHA/CRC**を独立監査して初めて段階判定する。
- もし読出し不可なら外形モデルを大量生成せず、元の可視フレーム間の連続画面と有効な可視性測定方法を再選定。深度が読めてもそれだけで建築候補を認定しない。

## 開発運用

GitHub正本とDraft PR #46から直接再開する。ファイル再添付、手動ローカル実行、Workへの無断移行を要求しない。新建築を造る前に、高速の元カメラで入口・中間・奥の立体的連関と公共用途が理解できる構図を**候補1件ずつ**ART-FIRST審査する。低い市場屋根の再生産、透明床、磁力、テレポート、見せかけの速度や安全性は禁止。
