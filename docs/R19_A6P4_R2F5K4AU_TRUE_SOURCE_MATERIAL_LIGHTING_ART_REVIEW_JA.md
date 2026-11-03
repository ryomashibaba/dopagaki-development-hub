# DOPAGAKI SLOPE — K4AU 実カメラ立体街区から道路・B51実材質へ

更新：2026-11-03 JST。最優先は最終世界水準の画面であり、単なるTECH pass数の増加ではない。**正式ART採用0件、Slope2 DNA認定0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD**。

## 1. K4ATを正式不採用とする真の根拠

- 元真正Chromium native 240Hz WebGL2のK4AT vs K4AS [Actions #41596692908](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41596692908) は completed/SUCCESS。
- 元Artifact #13212149720 = **12 genuine PNG**＋原撮影レポート＋独立SHA監査＋アトラス、ZIP SHA256 `25398cffbb8757a879ff11bba7191e9bb5e9a3e2ed44b7cc6d80beedd2e4b446`、15 ZIP member/CRC PASS。
- 真camera同source native pose 6一致、240Hz、B48 7路面、B51実28体、元source Git blob `af076d67492a677d2235e4730aef8cdf4808e106`。6元camera時点（ultra11320／11341／11369、control11259／11278／11307）でK4ATとK4ASの実RGB Luma差が9超の数値はそれぞれ **143201／0／158819／146624／156118／158901**（画像面積707400px）。ultra tick11341は実B51がほぼ画面を覆い、元新画像SHA完全一致。
- **ART評価：K4ATもART REJECT。** 両側に大きな曲面シェルは追加されるが、元cameraでは鋭い傾斜梁が画面上方から降りる「巨大な道路設備」に近く、世界的都市に必要な公共の用途・人が使うスケール・照明・路面/機械のリアリティを十分に感じられない。B51中央機械は依然として黒紫色のほぼ平らな箱。道路は広い青灰色の平坦面、ピンクの線と大きな色三角形。空は黒く、視界の半分以上が未設計の大面積。素材・画面全体の改善が必要。美術採用に必要なART/HUMAN/SAT/CCD/FPSの証拠はない。
- 真原画比較 [K4AT Artifacts](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41596692908/artifacts/13212149720) の `K4AT_GENUINE_CAMERA_12_AB_ATLAS.png` を直後の美術作業の基準にする。K4ATの世界観を無条件採用せず、「旧K4AQ箱塔より見える立体量は増えた」という限定技術成果にとどめる。

## 2. K4AU実装：元の実在するゲームマテリアルそのものを描く

研究枝：`research/k4au-road5-genuine-material-lighting-20261103`。K4ATの研究HEAD `5b07b6841c337743301820455b83edb7e7c8f335` から隔離。正式本番/PR#46/mainに一切反映しない。

1. `web/p101-k4au-original-native-material-lighting.mjs`：新しいWebGL2頂点＋フラグメントシェーダー。**元B48のXYZ/RGBの24byte頂点バッファをそのまま**コピーではなく本来のGPU bufferに対して入力参照。元カメラのeye/right/up/front、元と同一の透視投影式。路面はGPU導関数によるbanked本物の面法線、低彩度のアスファルト質、world XYZの高周波細かいノイズ、薄いパネル継ぎ目と反射。危険・報酬fixtureの色はソース分類に基づいて保持し、通れる／通れないの意味を作り直さない。
2. **元B51 movingObstaclePoseをそのまま**使い、元のP73/A13実頂点を本来のcenter・halfSize×2・yawRadiansでGPUに掛ける。鋼板の面ごとの陰影、ヘアライン風微細テクスチャとハイライト、fail赤／bounce琥珀／push紫の警告色を保つ。元の当たり判定／機体の不透明物理箱は維持。偽の通路開口や物理外へ突き出す演出はしない。
3. `scripts/p101-r19a6p4r2f5k4au-private-native-lit-road5-pack.mjs`：元R19A1→K4AD→K4AQ→K4AS→K4ATの独立真正WebGL2ルートをコピーし、localhost明示 `k4aq=on&k4as=materials&k4at=on&k4au=on` の時だけライト材質レンダーに差替える。他の6道路での導入や元source物理の変更なし。描画後は元sourceのshader program／bufferを復元。
4. `tests/p101-r19a6p4r2f5k4au-genuine-material-lighting.test.mjs` は、source元GPU VBOと描画トライアングル数、元Native movingPoseのcenter/halfSize/yawの不変、危険種別のGPU uniform分離、不正入力の拒否、source shader-state復元をモックで検証。**モックは実GPUの証明ではない。**
5. `scripts/p101-r19a6p4r2f5k4au-genuine-native-material-ab.mjs`：元240Hz Road5実カメラ6tick×K4AT（新曲面街区、元静的路面機械）／K4AU（同じ街区＋原ゲームの路面とB51表面だけGPU陰影）＝12真正WebGL2画像A/B。元camera/ball/Road5/B51 28/source元監査を1つでも破ればFAIL CLOSED。
6. `scripts/p101-r19a6p4r2f5k4au-independent-native-material-audit.py`：真正PNG SHAとcanvas画素値を独立照合、2列×6画像の無加工アトラスとソースモードSOURCE TECH限定結果を生成。単なる画素差や輝度差は、ART合格の根拠ではない。
7. `.github/workflows/p101-r19a6p4r2f5k4au-original-native-lit-materials.yml`：GitHub独立CIで元source blobを再チェック、unit tests、実Chromium shaderコンパイル、原camera撮影／独立SHA。新CI [#41598855479](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41598855479) は起動時 **QUEUED**。実画像未取得、shaderが実GPUで成功したとはまだ言えない。

## 3. 絶対に維持する方針

Gold/P100/W9-X/B5/240Hz球半径0.65m、元7道路28動体、原Camera、元source Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、元ゲーム衝突と危険性、main、本番、PR#46未変更。旧K4/K4R/K4U、K4AS、K4ATのART不採用を上書きしない。撮影成功でもHUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。正式ART採用0件。

**優先次工程**：#41598855479 の現在のstatus/jobs/log/Artifactを照合。シェーダーが実Chromiumで失敗したら、**真ログのGLSLコンパイルメッセージ**で原因を切り分けてから修正し、合格条件を弱めない。成功なら生12PNG＋SHA＋新画像の実目視で、元の粗いフラット色面・都市・質感が十分改善したか独立ART判断を行う。改善不足ならK4AUもART REJECTし、より抜本的な美術制作に進む。ユーザー側PC操作不要、Work事前承認制。
