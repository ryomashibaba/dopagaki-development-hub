# K4BH 2026-11-04 — 真正Camera/真Road5に基づく、画面全体の美術再制作

## 固定方針と継承
- K4BG最終HEAD `7e047eb73b0fb41e379776c509b239e20b05167b` から新研究枝を分離。K4BG修正版 [Actions #41726814278](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41726814278) は **SOURCE/DCC TECH限定SUCCESS、ART REJECT**。真正Artifact #13274862071、親Blender SHA256 `b665c84a88d719c4615638cfeb95ab5fe92a84a3a07d3ebe096dd540dd749b2f`。
- 正式ART採用0件、Slope2 DNA認定0m。既存7 B48／28 B51、Camera6／240Hz物理／球0.65m、凍結元WebGL2 blob `af076d67492a677d2235e4730aef8cdf4808e106`、その他元P100/B5安全表示・controls・scoreを変更しない。main・公式p101・Draft PR#46・本番サイトは変更/merge禁止。Work事前承認、ユーザー側ローカル操作ゼロ。
- 現状の実画像問題：旧K4BGはカメラ最前景の道路が単調で、左右は大まかな壁+細い屋根線、上部中央は輪郭だけ、遠景は灰色の広い空白。路面の面積が大きいにもかかわらず近距離の材料・ディテールと光影が無い。単なる色変更・同型box量産・TECH計測の反復を最終成果としない。

## K4BHで実装した一方向のART-FIRST候補
- [真のBlender制作器](../scripts/p101-k4bh-source-camera-art-directed-civic-corridor.py) は元K4BG真正 `.blend` を開き、**旧K4BE 01／旧K4BD 02-03／旧K4BG 9コレクションをrender OFFにし、採用されなかった建物を重ねない**。元の道路、その他6道路、元カメラ、B51位置は読み取り専用保持。
- 元Road5の各頂点を読み、現在のSource Camera実位置・実前方向から離れた場所に道路縁を求める**元B48投影に基づく道路外建築**を構築。前の固定座標で建物が遠くに消える問題に対応。ただし本物の全B51時間的・球半径距離BVH/SAT/CCD確認はまだ無い。
- **道路前景**：形状・当たり判定は一切不変、DCC内に限って多層ノイズ/鉱物粒/細粒/bump/roughnessからなる陰影と汚れを持つPBR見え方を制作。これは元ゲームの道路マテリアルではなく、ゲームの安全表示を無断置換するものではない。
- **建築全体**：道路両側の一続きの重厚な地層・曲面の分厚いセラミック屋根・実使用する大きな窓と居室（暖色灯り）、実源道路縁から離れた歩行テラス／緑化を制作。大断面の巨構造で特徴的な中央の開放感を作る。各要素が物理道路ではなくDCC研究のみ。
- **遠景**：同じ箱を並べず、不規則輪郭と高さを持つねじり塔群、建築用昼光・物理スカイによって黒/灰空白を再設計。元Camera 2 tick = control11307 + ultra11341 に写るか実RGBのまま判定。遠景の写りが不明な段階で成功宣言は禁止。
- 完成した形状は独立Blenderオブジェクトとして編集可能であり、Sourceゲーム用WebGL2の直接置換ではない。

## 実証条件／HOLD
1. [K4BH専用Workflow](../.github/workflows/p101-k4bh-source-camera-civic-corridor-art.yml)で元source blob、不変の原B48幾何fingerprint、Source camera numeric不変を検証し、K4BG本物の親Artifactの各SHAを検証。
2. 元Cameraの本物のDCCレンダリング**2PNG**と、K4BG不合格画像との同ポーズA/B、編集可能 `.blend`、SHA/可視位置数値を保存する。出来た画像を直接開いて批判的に見るまではART UNJUDGED。技術的な成功＝美術合格ではない。
3. 2視点のスクリーン全体が十分高水準になるまで他4 source ticks／他6 B48道路へ自動拡大しない。真正WebGL2ゲームの画面差、球の実走行、全B51 collision時間/SAT/CCD/HUMAN/FPS/RELEASE/MERGEは**全部HOLD**。

**現在**：実コードとCI定義の保存は実施。最新run/jobs/Artifactの状況と本当に生成した画像の判定は必ず最新GitHubで照合する。CI成功の見込み等を成功と報告しない。
