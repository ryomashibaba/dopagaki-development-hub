# K4BJ — Tidal Civic Canyon：真正Source Cameraによる大構図全面作り直し

更新：2026年11月4日 JST。K4BIの[確定SOURCE/DCC技術PASS・美術REJECT正本](R19_A6P4_R2F5K4BI_ORIGINAL_CAMERA_ROAD_PBR_CIVIC_FACADE_JA.md)を継承。研究継続 `research/k4bj-hand-authored-hero-civic-canyon-20261104`。

## 0. 最優先目的（変更不可）

DOPAGAKI SLOPE — HYPER RUSHを世界水準の高速3Dレーシングゲームとして全コースの美術を完成する。過去K4AT〜K4BIで積み重ねた技術的成功と**ART REJECT**を混同しない。正式ART採用0件、Slope2 DNA正式認定0mを維持。

K4BJは Road5実物メッシュを編集せず、元のcontrol tick11307／ultra tick11341の数値に固定した1 Hero都市構図をBlender DCCで比較し、**画面全体の美術基準を達成できるか判断する隔離試験**。他6Roadの水平展開は不許可。CI成功、メッシュ数、画像生成数、走行カメラの正確性はART合格の証明ではない。

## 1. 変更してはならないもの

- 凍結game source blob `af076d67492a677d2235e4730aef8cdf4808e106`、240 Hz、球半径0.65m、B48元7道路、B51元28移動体、元Camera全6の座標と向き、原速度・CCD・SAT・安全案内。
- main／公式 `p101-velocity-overdrive-native-trial`／Draft PR #46／2本番URLは不変。公開・merge・ゲームへ直接反映しない。
- 元Road5 tessellationのfingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`。元Source Camera control11307とultra11341の値は絶対保持。
- Work事前承認、ユーザーのWindows／Blender操作要求なし。HUMAN/SAT/CCD/FPS/ART/RELEASE/MERGE全HOLD。

## 2. 前工程の反省とK4BJで実装した美術制作

K4BI [Actions #41740606366](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41740606366)はSOURCE DCC PASS、ART REJECT。路面の平らな面積、反復窓、細い中央アーチ、薄い都市奥行き、Cyclesノイズが問題。

新たな`scripts/p101-k4bj-hand-authored-tidal-civic-canyon.py`は、`K4BI_ROAD_MATERIAL_ARCHITECTURAL_DETAIL_EDITABLE_DCC_HOLD.blend`（親SHA256 `93526d4adff8f1061081109123f7619de9bb6a0b835b15af6baf9bf6bb3ba086`）を**独立したBlenderネイティブ原本**として開く。

- 過去K4BH/K4BIの模型的なロング壁と旧薄いリング、同型窓の重なりは削除せずRenderOFFにし、**ゼロから構図の主役を変える**。旧コレクションは編集可能で保持。
- 西側：海食崖内の一体型大規模公立図書館。手で決めた異なる長さの大開口、実奥行きのある暗いロビーと暖色内装、深く庇の張り出した湾曲屋根・斜め柱・屋上広場・屋上採光。
- 東側：同じ建築を鏡写しせず、階段状の海洋研究・公共交流センター。銅色の曲面大屋根、異寸法の大開口、アシンメトリー庇、テラスに実物の室内光。
- 中央：既存の単純な2重リングではなく、**非対称の二つの構造物と、空間を抱く厚みのあるSky Lobby**を1つのランドマークとしてモデル化。立体物の負空間、躍動感、使える室内を優先。
- 遠方：細い針塔ではなく、5棟の異なる大断面の実装容積・水平に居住公共空間が入った都市スカイライン。背景の深度を優先して一棟ずつ断面寸法を作者指定。
- 道路端：真正B48 Road5に直接Raycastし、地表が存在する箇所に限りカメラ側の路側景観をプロポーズ。道路原メッシュや新ゲームcolliderには変更しない。Raycast命中率と生成数を証拠に保存。交差・運転クリアランスは未保証。
- 素材と光：旧の灰色路面の面積比を踏まえ、既存Road5源にのみDCCマテリアルの暗色化を適用。Nishitaの夕景・天然光・室内灯でメタル／陶板／暖色居住内部の実素材差を出す。外見での安全性や本番GPUコストは未検証。
- Blender固有のOpenImageDenoise未実装を踏まえ、Cyclesネイティブ48サンプル、OIDN OFF。本段階は元カメラ生PNGを正本とする。ノイズが残ればQUALITY上の欠点として評価。
- 目視不合格時はART REJECTとし、同じ小物追加型の試行を漫然と継続しない。

## 3. CI検証と判定規則

[専用K4BJ Actions](https://github.com/ryomashibaba/dopagaki-development-hub/actions/workflows/p101-k4bj-native-tidal-civic-canyon-art.yml) は、確定した親Artifact #13281034575を取得し、元Game Blob/Nodeテスト、親DCC SHA256/元Camera/B48元道路/B51物体数・生Blender、元Camera 2生PNG、独立PNG差分、全SHA JSON、GitHub研究ブランチへの証拠保存を行う。真正Artifactが作られてからそれを解凍して**生画像を直接目視判定**し、その判定をここに追記する。

初回執筆時点ではCI success、真Blender結果、ART評価は**未確定**。前工程と同じSOURCE/DCC技術成功をART合格へ読み替えない。旧K4BI ART REJECTと正式採用0件／Slope2 DNA0mを維持。実WebGL2画面は1枚も撮影していない。B51全時刻クリアランス、CCD・SAT、180Hz/240Hz真実走行、安全、FPS、人間プレーは新美術について未検証。

