# DOPAGAKI K4AT — 真正原Road5カメラで審査する立体公共峡谷の制作

基準日：2026-11-03 JST。K4ASから継承。ART-FIRST / QUALITY-FIRST、正式ART採用0件／Slope2 DNA認定0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。

## 1. 初めて取得したK4ASの確かな画面と実判定

前工程のK4AS真正元カメラ24枚 CI [#41594250729](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41594250729) は、静的検査・ビルド・撮影・独立PNG SHA画素監査の各job stepがSUCCESS。Artifact **#13211991425**、ZIP CRC全件PASS、27件のZIP内ファイル中24枚が生Chromium WebGL2 screenshot。独立報告のSOURCE SCREEN MATERIAL RGB TECH限定PASS：6時点の新素材vs新素材なしの輝度差9超が **332,689～639,918px／707,400px** の範囲。これは新道路素材が実画面に映ったことだけであり、美術合格でない。

元Cameraの6tick：ultra11320／11341／11369、control11259／11278／11307。元B51 28基、元B48 7道路、ball/eye/front一致。14m ultra tick11341 はB51が画面全体の大部分を覆い、元／天空／都市の3群の画像バイトが完全一致（RGB差0）。これは巨大B51の原画の実例で、建築による改善はその場に表示されていないことを示す。

**真正スクリーンショットのART審査：K4AS不採用（ART REJECT）。** おとなしい配色にはなったが、路面の広大な単色面、ピンク等の残存鋭角ロード模様、照明の乏しさ、空のほぼ黒い無情報域、右側だけに薄く並ぶ同型の直方体建築が依然として画面を支配。『公共空間』『実在しそうな未来都市』『独創的な建築』としては成立していない。RGB差の大きさは美的品質ではない。過去K4/K4R/K4Uの不採用も不変。元原画の危険B51を一時的に消して美術をよく見せる行為は禁止。

画像の元Artifact [#13211991425](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41594250729/artifacts/13211991425) の K4AS_AUTHENTIC_FOUR_WAY_ROAD5_CONTACT.png を人間レビュー基準に固定。

## 2. 今回の一方向・実3Dの改修

研究枝：research/k4at-road5-civic-canyon-sculpted-architecture-20261103。K4AS終端HEAD f1bf5e5af071c9c7b28076853915a4884cd88fe2 から独立作成。main・本番・PR #46に一切反映しない。

1. web/p101-k4at-road5-sculpted-civic-canyon.mjs: K4AS真正Road5のnative ball XYZを根拠に、元B48 Road5 surfaceサンプルから最接近uを求め、左右の実道路端と接線の数学的フレームに位置を固定。繰返しの「直方体11棟」ではなく、厚みのある大規模凹曲面の市民シェル・**実3Dに空洞が抜けた**アトリウム・5層の深い回廊テラス・奥まった実GLASS＋暖色内装空間・左右非対称のねじれた細塔を組み合わせる。危険なB51の上へ大量の門を重ねる案は不採用。
2. sourceの滑らかなBanked B48実道路上だけ、元source normalの接線に0.10m浮かせたvisual-only舗装目地／石材縁ライン／細密な道路パネルを構成。元B48 void cellを跨がず描画。衝突体を加えたり、新しい通行床を宣言しない。
3. scripts/p101-r19a6p4r2f5k4at-private-source-civic-canyon-pack.mjs: K4AS研究用ネイティブcloneをさらに複製、明示localhost opt-in k4at=onで、旧K4AQ都市の**同時表示をやめ、代わりにK4ATの新形態1候補**だけ表示。元K4AQ sky＋真B48/B51球描画継続。元sourceゲーム内の物理/カメラは変更しない。
4. scripts/p101-r19a6p4r2f5k4at-genuine-native-sculpture-ab.mjs: genuine Chromium WebGL2 native 240Hz、同元Camera/ball/B51 6tick×**K4AS旧都市 vs K4AT新公共峡谷**で計12 PNG。equalityが破れたらfail closed。14m tick11341はB51覆いを含む審査ポイントで、新都市がそこで見える必要条件ではない。
5. scripts/p101-r19a6p4r2f5k4at-independent-true-camera-art-audit.py：真正PNG SHA-256と12枚を独立監査、現実に取れた生画面2列×6行の無加工の比較コンタクトシートを生成。画素差の閾値は「新アートが画面に実在するか」のTECH確認だけ。これでART評価を自動PASSしない。
6. 5本の負例を含む unit tests／独立専用CI [.github/workflows/p101-r19a6p4r2f5k4at-native-sculpted-canyon-ab.yml](../.github/workflows/p101-r19a6p4r2f5k4at-native-sculpted-canyon-ab.yml)。

## 3. 凍結契約

source `web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` Git blob af076d67492a677d2235e4730aef8cdf4808e106。元240Hz、球半径0.65m、B48 7道路、B51実動体28、元camera、元B5/P100/Gold/W9-Xの演算と当たり判定、元本番URLと元再現版URLを無改変に保つ。K4ATは目視用の**非衝突**彫刻的建築で、見えるテラスが歩行可能とは証明していない。mainと本番とDraft PR#46を変更しない。Workは事前承認。

## 4. ARTゲートと次工程

K4AT初回Actions [#41595951481](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41595951481) は作成時QUEUED。**本物の12PNGをまだ目視していないのでK4AT ART NOT_TESTED_HOLD**。まず今のCI status／原因別の実ログ／Artifactを照合。真の新しい模型が元カメラに映らない、元道路安全に干渉、起動失敗であれば元証拠を根拠に1回の修正へ絞る。真PNG取得時は実スクリーンショットを直接見て美術批評。強い立体・曲面・密度・素材・光・人が使う奥行き・高速度で読める都市と見えないならART REJECTとして大胆に再設計。元B51覆いによる視界問題を都市デザイン採用に利用しない。成功してもHUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD、正式ART0件。

## 5. 研究運用

新CI実行中のworkflow対象ファイルへの無用なpush禁止。先に結果を読む。Chat＋GitHubで作業し、ZIP・PowerShell等のユーザー側操作を求めない。GitHub START_HEREが次の唯一の入口であり旧チャット長文を再貼り付けさせない。
