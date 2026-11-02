## 【追補：2026-11-02 K4AD Chromium実測・独立エラー監査・修正CI待ち】

### 先行CI #41458103800 の事実（CI FAIL、しかしRGBA depth読み出しは技術的に成立）
- [先行CIとArtifact #13148042343](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41458103800) の生成ログ：Chromium真正Road5で元source GPUメッシュ72drawsに対して、**14/14元画面 + 12/12 source-maskにてRGBA8 depth24サンプル取得**、両幅でマスク解除後の深度サンプル差0。Artifact ZIP SHA256 `e575e020666f7d30a01d1c0a882329eaa80cf9afcfa48c87acd35741f20fa46a`、3,651,051 bytes、全29エントリCRC良好。ZIPをChat作業環境へ直接取得・独立解析済み。
- 検証データは各画面で11,176深度サンプル、14画面で色深度の非一様値（元GPU頂点シェーダーと元メッシュの再描画）。旧K4AC `DEPTH_BLIT_ERROR_1282` は使用せず、RGBA readPixelsが実行された。ただし正しい全画素depthと原画素の同時真正性を独立認定するにはPNG監査が必要。
- **CI FAILの原因は深度API失敗ではなく、元PNG画素厳格監査**。K4Z SHA82画像に対して新14画像を差分比較したところ、`control` native tick 11280 だけ合計79,688 RGB差画素。うち79,685は元からアニメ変動が確認されていたP74 NEAR MISS CSS ROI (200,418,810,590) 内、残り3は (x545,y33〜35) の**上部UI**（元 `web/drive3d.html` の `#chapterHud.chapter`、position:absolute;left:50%;top:20px）にある文字`PRISM SKY CREST`の青RGB 222→223の1階調差。3Dオブジェクトの移動ではないことを元画像・HTML/CSS位置と併せて確認。K4Z元PNGを無条件に置換したり元画素監査を無効にしない。

### 厳格な独立修正
- [真正Road5捕捉スクリプト](../scripts/p101-r19a6p4r2f5k4ad-true-road5-original-mesh-depth.mjs)で、各frameの**実`#chapterHud`要素のDOM bounding rect、id/className/position/pointerEvents/text**を記録し元elementが本物であることを先行確認。
- [新しい独立Python監査](../scripts/p101-r19a6p4r2f5k4ad-independent-rgba-depth-audit.py)は、本物の画面上部HUD位置（x300〜720 / y18〜90の既存HTML由来範囲、さらに実rectとサイズ固定制約）で**最大3画素かつ1 RGB階調以内**のみを例外として識別。その他すべての**非HUD画素差0**は絶対維持。上部HUD領域内でも4画素以上、2階調以上を厳しくFAIL。非HUDで単独1画素偽装する負例もFAIL。P74既存HUD ROI以外を不当に緩めない。
- 元GPUメッシュSource censusも新たに固定：2幅とも元描画72件。mask無しepic除去0件、mega 1件、frames 1件、B48 skin 1件、B51 28件、road optics 4件。再描画記録の件数がそれぞれ72,71,71,71,44,68にならなければ監査FAIL。マスク除去が**新たな近距離depthを生み出さない（farther-only）**こと、描画した群の除去がサンプルdepthに反映すること（元画面と比較）、epic未描画でdepth差が0であることを負例付きで必須化。上記は取得済み先行Artifact上の全12条件で実測一致。
- 修正版の [Actions #41463872981](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41463872981) は更新スクリプトを受けて起動。**完走・新Artifactの再検証まではK4AD正式SOURCE TECH判定をHOLD**。旧runの「CI FAIL」を成功扱いしない。

### 維持するSTOP条件
元Source Blob `af076d67492a677d2235e4730aef8cdf4808e106`/240Hz/原カメラ/球/B48 7/B51 28/Gold/P100/W9-X/B5/main/本番不変更、研究用別ブランチ限定。K4/K4R/K4U独立ART REJECT、正式ART0・Slope2 DNA0m、人体・SAT/CCD/FPS未検証、公開・MERGE HOLD。深度が真に成立しても、物体ID/安全な空地/人の連続視認のART合否と直接同一視しない。

---

# DOPAGAKI SLOPE K4AD — 元GPUメッシュ再描画によるRGBA8深度検証

2026-11-02 JST。**ART HOLD / Source TECH 研究専用 / 本番・main不変更**

## なぜK4ADか：K4ACの独立した実測を先に確認

K4AC-S [CI #41455050342](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41455050342) は実行終了 **success**。元Road5 2幅×7tickの14真正画面について、K4Z元82 PNG全SHA照合、P74 HUD既定領域以外の3D画素差0、元240Hz/source/camera/B48 7/B51 28不変更、サブトラクティブ12マスク、元表示復元、独立監査もPASS。しかし**真正GPU深度は0/14フレーム、0/12マスク成功**で、全14+12+復元の両幅で例外 `DEPTH_BLIT_ERROR_1282`（WebGL2 INVALID_OPERATION）。同一描画フレーム内へ移動しても、既定framebufferからDepth-only FBOへのGPU depth blitはこのChromium環境で認められず、**K4AC-S depth TECH HOLD**。

- CI artifact ID **13145664936**, ZIPサイズ **2,802,699 bytes**, ZIP SHA256 **`8d8fc9200f9a486a6bc6fc2e1f4d8a8079c9a5638d8300e8db8442e600f9f5b3`**。チャット側へZIPを取得しSHA、ZIP全30ファイルのCRCと2 JSONの `nativeDepth`/各 `depth.reason` を直接照合済み。
- 旧K4AC [CI #41453572178](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41453572178) は **failure**。同じ `DEPTH_BLIT_ERROR_1282`、別のbefore/after画像監査は既定CSS領域外の差を検出しFAIL。artifact ID **13147245711**、ZIP SHA256 **`5d7ff338446b44ca6566ba61d23ea02e31cf411f0ffd00049fc70160d5d49fc3`**。ZIP29ファイルCRC正常。差分を直接ピクセル照合したところ control・tick11280・座標 (545,33),(545,34),(545,35)、RGB [135,246,222] → [135,246,223] の3画素。**この画素位置は画面上部であり、真の3D世界のドリフトと断定しない**。既存独立監査は境界例外を認めずFAIL維持。これを任意の既定UI ROI拡張で隠蔽しない。

## K4AD実装

前段`research/k4ac-synchronous-depth-provenance-20261102`から、K4AD独立研究ブランチ`research/k4ad-original-mesh-rgba-depth-20261102`へ分岐。K4AC-Sや継続ブランチは変更しない。

1. [本物の元GPUメッシュ再描画研究ビルダー](../scripts/p101-r19a6p4r2f5k4ad-private-original-mesh-depth-replay.mjs)：SOURCE元blobを厳密確認後、既存K4AB私用コピーのみ改造。実元描画の`draw`通過時のGPU BUFFER・元draw primitive・元transformを記録し、元元頂点シェーダーそのものを再使用して、隔離FBO（RGBA8 color+DEPTH_COMPONENT24）へ全元描画命令をリプレイ。別の断片シェーダーで`gl_FragCoord.z`を**24bitのRGBA値**に符号化し、`gl.readPixels(RGBA, UNSIGNED_BYTE)`で取得。失敗済みのDepth-only `gl.blitFramebuffer`/非対応な`readPixels(DEPTH_COMPONENT)`を**一切使用しない**。実描画画面（default framebuffer）とは別のFBO。GPUの元FB/元VAO/プログラム、バッファ、viewport、clearColor、深度、ブレンド等GL状態はfinallyで復元する。
2. [本物Road5クロック固定再現](../scripts/p101-r19a6p4r2f5k4ad-true-road5-original-mesh-depth.mjs)：元K4Z真正14画像と2幅×7tick、同一真元描画ステップのサブトラクティブマスク12条件、元戻し画面を取得。独立撮影前に`k4adCapture` の内部証拠（seq, 元240Hz tick, 元road, mask, source Blob, orig B48/51, depth method）を検証。
3. [独立監査](../scripts/p101-r19a6p4r2f5k4ad-independent-rgba-depth-audit.py)：全82元K4Z PNG SHA、真元14画像のCSS P74外画素完全一致、6 mask×2幅、深度値の非単一性・同じ時刻への復元・`method='ORIGINAL_GPU_MESH_RGBA8_DEPTH24_REPLAY'`を検証し、非対応や値の欠損は**HOLD**。
4. [K4AD専用CI #41457632488](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41457632488)：GitHub Ubuntu+Chromium SwiftShader genuine WebGL2で独立実行、artifactを別保存。旧K4AC-S CIの成功をK4ADの成功扱いしない。

## 研究上の制約・STOP条件

- RGBA8符号化で取得できるのは24bit非線形深度の**描画再実行計測候補**のみ。元メッシュソース、カメラ姿勢、描画順、DepthTest/遮蔽が一致して初めて特定の見通し議論に使える。深度は**物体IDを自動提供せず、空地・安全床・視認性認定の証拠にはならない**。
- 元Source blob `af076d67492a677d2235e4730aef8cdf4808e106` /元240Hz/球/Camera/B48 7/B51 28、Gold/P100/W9-X/B5、main・本番URL不変更。K4/K4R/K4U独立ART REJECT、正式採用ART0件、Slope2 DNA0m。候補のSAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。
- 試験コードの保存および専用CIキュー投入は成立したが、**K4ADの真正GPU成功/新Depth TECH PASSはCI実測待ち**。完走結果は次工程で必ず確認。保護されたPR#46を自動マージ・改変しない。
- 次の手順：#41457632488 job全ステップの成功/失敗とArtifact ZIP SHA/CRC/14 PNG/12 masks/depth samplesを独立照合する。失敗ならログ上の根本原因と観測不能条件を残し、合格基準を下げず最小修正する。人間ARTは別審査。Workは事前承認必須、ユーザーのローカル操作なし。
