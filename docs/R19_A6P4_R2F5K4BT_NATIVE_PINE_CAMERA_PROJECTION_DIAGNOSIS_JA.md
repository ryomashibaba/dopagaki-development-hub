# K4BT — K4BS真正松木のカメラ投影診断（研究隔離・ART REJECT）

2026-11-04 JST。研究枝：`research/k4bt-native-pine-camera-projection-gate-20261104`。親K4BS SHA `eaf69fedef96bc0794eaffbddd353c3873cde6be`。

## 最上位目的と原因仮説

DOPAGAKI SLOPE — HYPER RUSHは世界水準の高速3Dレーシングゲームの**画面全体の美術品質**が最上位目標。K4BS最終CI [#41795056558](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41795056558) はPoly Haven CC0連続地表と398,144tri実松8本の本物の編集可能Native Blender原本に関して技術PASS。しかし実CHASE研究カメラでは木がほぼ見えず、人工物非表示により海辺の空白が増大し、**ART REJECT**、正式ART採用0件、Slope2 DNA0m。データの三角形数と映像上の認識可能性を混同したことが課題。

K4BTは元K4BS真正原本（SHA256 `156e56ce373b731f1f0c8f96278a11977ac93d491973c2e8ef796ec1ea7795de`）を読み取るだけの工程。「実松が画面に読めない」原因を、**当該カメラの位置から見た実ジオメトリの投影**に絞って診断し、原因が分からないのに他の高価なアセット・画面・QAを追加しない。

## K4BT実装

- `scripts/p101-k4bt-native-pine-screen-projection.py`：元K4BS Artifactから保存済み真正.blendと監査JSONをSHA再照合。GlTFの真3メッシュ398,144triと8つの元共有Collection instanceを見つける。**depsgraph評価済みの実Mesh object_instance.matrix_world × 全bound_box頂点**をK4BP真正研究`CHASE_NARROW` Cameraへ`world_to_camera_view`で投影。ツリーごとにワールド範囲・樹高・カメラ前後・元画像1280×800に対する幾何学的bboxの幅/高さ/画面積率・視野内外を記録。元B48 Road5の頂点面フィンガープリント・元6Camera・研究Camera・元原本SHAを再確認。
- `scripts/p101-k4bt-native-pine-bbox-overlay.py`：K4BS最終CIで**既に本当にレンダリングされた**同カメラPNG（SHA256 `be95187ce5fba724547a0333bcca261b8c300ee0bb9316edd23cfc18ca85ba3f`）に各木の測定bboxのみ重ね、研究資料にする。**新しい本物のゲーム・画像レンダリングではない**。幾何学的な投影矩形≠葉っぱの実画素≠不透明度≠遮蔽≠FPS。「Visible」「ART PASS」と誤称しない。
- `.github/workflows/p101-k4bt-native-pine-screen-projection.yml`：旧K4BS成功Artifactを再利用し、**新しいCC0外部ダウンロードなし・Blender書込0・フルレンダリング0**の短時間診断を独立GitHub Actionsで実行。研究枝にJSON＋小型の診断オーバーレイPNGだけを保存。失敗時はHOLDで原因を記録、緑CIでもART合格にしない。

## 結果による次の実作者工程への分岐

1. 投影bboxが視野外・極小・カメラ背面なら、**K4BUは既存実松の変換/スケール/画面近景配置のみ**を根拠付きで最小編集し、元CHASEの小型実Blender画像一枚と比較する。既存実アセット以外のモデル増殖・重い2視点フルレンダリング禁止。
2. bboxは十分だが実画像に読めないなら、alpha、glTFの透明材質、インスタンス描画有効状態、木のオクルージョン/枝色、背景コントラストを小さな独立確認から絞る。bboxの面積だけで視認性証明はしない。
3. 木のシルエットが実画面で認識できるようになってから、空白の海辺に使われる港湾機能・地形・自然・公共空間・視線導線を**1画面の作者美術**として再構築。箱・円錐木・簡易屋根・単調反復物量を主経路に戻さない。他6Roadへの展開はART実合格後。

## 不変保護／主張の境界

元ゲーム `web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、B48 Road5元頂点面 fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、7本B48/28体B51/240Hz/球0.65m/元Rig6Cameraを一切変更しない。main、公式`p101-velocity-overdrive-native-trial`、Draft PR #46（OPEN/Draft/未merge）、本番2サイトを保護。実ゲームCollider0、新ゲーム統合0、Windows手順0、追加有料API0。Work/Computer Useは個別事前承認。**ART REJECT・正式採用0件・DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD**のまま。Blender研究画像はゲームWebGL2や実可走B48道路ではない。

## 実行状態

初回GitHub Actions: [#41799311517](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41799311517)。**本記載時点ではCI実行結果は未確定**。完了後の成功/失敗・実測値・原SHA・Artifactを独立照合した事実だけを追加する。
