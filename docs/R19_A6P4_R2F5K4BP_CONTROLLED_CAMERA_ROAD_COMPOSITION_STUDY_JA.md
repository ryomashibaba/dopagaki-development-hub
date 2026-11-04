# K4BP — 正真正銘の元Cameraと別カメラ・別道路コンセプトを厳格に区別したBlender構図研究

更新日：2026-11-04 JST。隔離研究ブランチ：`research/k4bp-camera-and-road-composition-study-20261104`。

## 固定目的と前工程の事実

DOPAGAKI SLOPE — HYPER RUSHを世界水準の超高速3Dレースゲームとして完成させること、**美術評価は実画像と本人の基準で行い、CIやオブジェクト数をART PASSとしない**ことを厳守。前工程K4BOの[正本](R19_A6P4_R2F5K4BO_CAMERA_FRUSTUM_RACING_ART_JA.md)、[実native CI #41779198031](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41779198031) completed/SUCCESS、[Artifact #13298312331](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41779198031/artifacts/13298312331) から完全継承する。編集可能Blender真正原本 `K4BO_EDITABLE_GROUND_TRUTHED_VELOCITY_DCC_HOLD.blend` のSHA256 `b546174d5ae5186015981f2d6b5ee40f823cb7a4f2f9ba33f07c2bbda84264e6`（41,838,860B）を固定。実Control11307/Ultra11341元画像とSHA、元Game Blob、元Road5頂点/面fingerprintを全照合する。

K4BOで発覚した本質：正真正銘の元Camera Control11307で、Road5中央のd70mの画面高さbottom-upY=0.60698、d170mでも0.63893で、前方100mが画面高さの約**3.195%**に圧縮される。再現性のある実Camera/実Source Road5/Blender `world_to_camera_view`で確認されている。既存の巨大なRoad5とカメラ構図に、単純な塗装・壁・柱・建築模型を大量に増やしても世界水準の美術にならなかった。ART正式採用0件／Slope2 DNA 0m。

## K4BP実制作と比較の設計

**変更していいのは独立した研究用Blenderシーン・研究用カメラ複製・非ゲーム美術メッシュのみ**。元ゲーム・元Camera・公式Road5を変更してゲームの成功を偽装しない。

`scripts/p101-k4bp-authentic-camera-composition-study.py` は真正K4BO原本を読込み、真正元Source Control11307を参照した次の4画像を**明確な別条件**として区別する。

1. **ORIGINAL B48 / ORIGINAL CONTROL11307**：K4BO真正元Camera画像を、親Artifactの全SHA検証後に比較表左上の元正本として再利用。カメラ位置・レンズ・道路は一切変更なし。
2. **CHASE_OBLIQUE_LOW**：元Cameraの複製（元本体変更禁止）を元Camera位置から後方8m／横4m／上2.8mに移動し、Source Road5の前方72m地点を向け、レンズ38mmで撮影。元B48 7RoadのSource DCC可視、Road5元Geometryを変更せず、元ゲームとは異なる研究用の映画的追従視点。
3. **HARBOR_3QUARTER**：別Camera複製を前方18m／横53m／高さ12mに配置し、前方105mの本物Road5中央を望む30mmの斜め俯瞰構図。元Road5の形状は変更しない。アート・土地用途の読みやすさを検証。これもゲームCameraではない。
4. **NARROW_FIXED_ORIGINAL_POSE**：元Control11307のCameraを**数値が完全に同じ状態で複製**。同一Camera視点のまま元B48道路メッシュを**研究画像でだけ非表示**とし、元Source中央線の実Raycastによる道路高低差を沿った新規独立の26.2m幅の道路美術コンセプトを表示。幅13.1m×2＋3.3m×2の路肩と、道路外沿岸の地形を手作り断面で追加。元B48は削除・改造しておらず、研究専用オブジェクトとして.blend内の別コレクションに保存する。**実ゲームで走れるという証拠も本物のRoad5/安全なコースという意味もない。** Road5元Camera/元Geometryを改変しないまま道路幅の美術的影響だけを実験する。

**確実な比較**：元Control11307元Road5画像と上記3つの研究画像を、2×2のPNGにして同時に見られるようにする。研究Cameraの比較を「元CameraでARTが合格した」と誤称することは絶対禁止。

**真正定量測定**：元Road5のd5〜170mの実中央線の画面Y値をそれぞれの研究Cameraで`world_to_camera_view`し、d70m〜170mの画面高さ差と実フレーム内サンプル数を独立JSONに記録。Cameraが被写体を見失った場合は画像が見栄え良くてもその事実を隠さない。元rig全カメラの位置・回転・レンズは制作前後で完全一致、元Road5 Control/Ultra両方の全頂点/面fingerprintも再照合。

**素材/美術の位置付け**：研究別道路の足場、ダークグラファイト舗装、元K4BO作者塗装のshader、低い沿岸の大地の断面は独立編集可能なBlender .blendに保存する。元Source Road5の道路ネットワーク、28個B51動体、240Hz、球0.65m、アートの実ゲーム統合、公式のウェブサイト、PRを一切編集しない。

## 作業実行と安全ゲート

[実K4BP CI #41780866652](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41780866652)で元原本SHA／固定源ゲームBlobとNode source tests、Ubuntu24.04真正Blender EEVEE/Xvfb実レンダリング、3つの比較画像、完全別名保存.blend、2×2比較PNG、全SHA、実Camera数値を検証し、画像＋JSONだけをこの隔離研究ブランチへGitHub保存する。初回執筆時点ではCI最終結果・実画像・美術の合否は未判定。エラーは失敗として残す。

**変更禁止**：game Git blob `af076d67492a677d2235e4730aef8cdf4808e106`／Road5 vertex-face fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`／元Camera全6／B48 7実道路／B51 28個実移動体／240Hz／球半径0.65m／元ゲームの安全UI・制御・カメラ／main・公式`p101-velocity-overdrive-native-trial`・Draft PR#46・本番URL2つ。Work/Computer Use開始には事前承認。ユーザーWindows操作不要。正式ART採用0件、Slope2DNA0m、HUMAN／SAT／CCD／FPS／RELEASE／MERGEは全部HOLD。

**ART評価は各画像を実見して判定する**。撮影条件や仮道路の見た目が改善しても「実ゲーム美術の正式採用」にはならない。外観が低質なら世界水準のARTはREJECT、次工程へ限定的な研究証拠のみ継承する。
