# DOPAGAKI SLOPE — K4AC-S 同一描画フレーム内GPU深度取得の研究

記録日：2026-11-02 JST。**新研究ブランチ限定／実GPU結果待ち／ART HOLD。**

- GitHub正本：`ryomashibaba/dopagaki-development-hub`
- この研究：`research/k4ac-synchronous-depth-provenance-20261102`（元継続ブランチ `p101-velocity-overdrive-native-trial` の確定HEAD `19d3a32d525c0c2a67082cba646898fab8f2b60f` から分岐）
- 元継続ブランチCI：[#41453572178](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41453572178)（確認時 `pending`、上書き・取消・結果捏造禁止）
- 新K4AC-S研究CI：[#41455050342](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41455050342)（登録確認、実完走未確認）
- Draft PR #46：OPEN/Draft、未マージ。main、本番URL、元sourceは変更禁止。

## 今回判明した根本的な真正性リスク

元 `web/drive3d.mjs` は `canvas.getContext('webgl2',{antialias:true,alpha:false})` を使用し、`preserveDrawingBuffer` の指定がない。WebGL仕様では既定でfalseとなり、合成後の描画バッファと深度バッファの内容が消える場合がある。既存K4ACのPlaywright `#view.screenshot()` の**後**で `page.evaluate()` によって深度を読む試みは、GPUの真正な前景の深度を保証できない。**非全背景値を取得できても、元フレームを読んだ証明にはならない。**

規範参考：Khronos WebGL Specification「The Drawing Buffer」 https://registry.khronos.org/webgl/specs/latest/1.0/ 。WebGL2 `blitFramebuffer` API：https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/blitFramebuffer 。

`preserveDrawingBuffer:true` に勝手に変更すると元ゲームのGPU挙動/性能を変えるため、正本は変更しない。

## 追加した本物の研究実装

1. [プライベート描画直後フック](../scripts/p101-r19a6p4r2f5k4acsync-private-render-capture.mjs)：既存K4AB privateレンダラーを読み取り専用で複製する。**元 `render(frameSeconds)` の描画終了直後、同じJavaScript描画関数の内部**で深度読み出しを起動。実元描画をする`gl`を使用し、表示中の元球/障害物/道路/カメラ/240Hz物理を変更しない。元の読出し関数の本体を抽出し、別の偽の深度生成関数に置換しない。
2. [真正Road5ブラウザ計測](../scripts/p101-r19a6p4r2f5k4acsync-true-road5-render-depth.mjs)：K4Zに既存する元Road5の7tick=44.5〜47.5秒×14m/28m＝**14真正シーン**で`window.__k4acSyncCapture`を設定。取得するJSONは`INSIDE_NATIVE_RENDER_AFTER_DRAWS_BEFORE_FRAME_PRESENT`というフック経路・tick・mask・元Road ID・元B48/51を記録。元46.0秒にK4AB由来の6群×2幅＝12研究用サブトラクティブ表示条件を同一球/カメラ/物理tickで計測。マスク後の元画面への復元も検査する。
3. [独立SHA・画像・深度の監査](../scripts/p101-r19a6p4r2f5k4acsync-independent-depth-audit.py)：元K4Z Artifactの**82元PNGすべてのSHA**検算、今回元画面14枚の原K4ZとのHUD外完全ピクセル一致、非表示12条件の出力、元表示への復元、元の深度と復元後のサンプル一致、および3D領域の画素改ざん負例を検査。深度取得不可ならその原因を保存し**DEPTH HOLD**。
4. [専用CI](../.github/workflows/p101-r19a6p4r2f5k4acsync-render-depth-research.yml)：新研究ブランチでのみ起動。元ゲームSource Git blob `af076d67492a677d2235e4730aef8cdf4808e106` /元K3Bピン留め、従来MockGL6条件、真正Chromium、独立監査、Artifactを実行。元継続ブランチの待機CIに影響しない別concurrency group。

## 未解決・合格禁止

- 実Chromium WebGL2デフォルト深度が非同期画面合成前でもdepth-only `blitFramebuffer`・`readPixels(DEPTH_COMPONENT,...)`に対応しているかは**未検証**。非対応なら`DEPTH_UNAVAILABLE_OR_INCOMPLETE_HOLD`。同一フレーム内読み出しでも、GPU API未対応を突破できるとは限らない。
- 生成されたコードの構文はJavaScript独立パーサで2ファイルPASS。ただし、GitHub Actions本番のNode/Chromium/Blender系実行・Python全監査・Artifact検証は**CI完了まで未認定**。
- 元ゲームSource `af076d67492a677d2235e4730aef8cdf4808e106`、元球/カメラ/240Hz/B48×7/B51×28/Gold/P100/W9-X/B5/main/本番2URL変更0。新造形0/新コライダー0。旧K4/K4R/K4U独立ART REJECT、正式採用0件、Slope2 DNA認定0mを維持。
- 取得できるものは**非線形GPU深度サンプルの技術的候補**に過ぎず、正確な物体ID/空洞の可読性/歩行可能床/人体/可視秒数/B48全SAT/B51全CCD/FPS/RELEASE/MERGEは未検証・HOLD。画像と差分だけでART合格としない。

## 次工程の優先順位

まずこの独立研究CIのjobを監視し、元真正PNGと実深度のArtifactを独立SHA/CRCで検証。失敗したら**ログ上の最初の真正なエラー**を再現して最小修正する。真深度が得られない場合はソース画素の真実性と別の可視性測定を分け、未測定を合格扱いせず次の方式へ移行。真GPU深度が証明された場合にのみ、手前・奥の構図条件の研究へ進む。建築新候補の制作や本番への変更は依然不可。

**運用：** Chat+GitHub正本のみで継続、Work事前許可、ユーザーにZIP再提出・PC実行を要求しない。次チャットはこのブランチの報告から引き継ぎ可能。
