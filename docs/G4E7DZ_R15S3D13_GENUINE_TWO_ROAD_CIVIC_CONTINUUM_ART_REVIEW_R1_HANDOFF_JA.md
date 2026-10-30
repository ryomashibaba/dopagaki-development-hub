# DOPAGAKI SLOPE — R15S3D13／R1 連続巨大都市の真正WebGL2制作・美術審査

**2026-10-30 JST。研究ブランチ `p101-velocity-overdrive-native-trial`、Draft PR #46。全改変はPRIVATE非衝突美術。元ゲーム保護 Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、元7 B48・28 B51、元Runner 240Hz/CCD、P96/P94/A13、元カメラ/HUD、本番/main/Gold/P100変更なし。正式ART採用0、Slope2認定0m。**

## R15S3D13 は実制作したが、実画像で美術REJECT

- `scripts/p101-r15s3d13-real-continuous-civic-spine-3d.mjs`：元の真正道路5/6の物理面から直接XYZをサンプリングし、2道路にわたる曲線都市帯をA・Bの2仮説として**XYZ/RGB実三角形**で生成。4層の公共デッキ、近接上下層、深い下面、物理的に空いた大スパンアトリウムを設け、以前のD12のバラバラな浮遊破片と箱置きを止めた。前景・背景3Dは非コライダー。元球/路面/動体を一切修正しない。
- A_CIVIC_MANTLE：**10,556三角形**／連続スパン247／上面開放81／空き壁面414／公共デッキ981／下層スパン328／最高上昇307.47m（基準路面からのデザイン値）。
- B_OPEN_CALDERA：**8,888三角形**／連続スパン211／上面開放117／空き壁面594／公共デッキ804／下層スパン328／最高上昇267.73m。
- 真正 [Actions #41015677226](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41015677226) **SUCCESS**／[Artifact #12959673348](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41015677226/artifacts/12959673348)。PRIVATEで元ゲームの本物のWebGL2 GPUシェーダーとHUD/カメラを起動し、**旧景観×1、前D12 A比較×2、新D13 2案×2世界=4、合計7セッション／27枚の実画像**。同じ元Runnerを0秒から実走、58秒13920tick、64秒15360tick、67秒16080tickで停止。RAW元カメラ方向、元7道路と28移動障害物を保持したまま、全新ART×2世界**真正finish 4/4**、元最終実B48`p93-FINISH_RIDGE-01`で接地、元`finish`イベント各1。独立QAで10件の偽証拠を拒否。人間手動操作・Windows本体FPS・障害物真正可視性は未認定。

**重大美術観察（元のPNGを直接確認）**：D13 A/Bは確かに真正3Dで全体が連続するが、**道路の左右に巨大な垂直壁と連続天井が立ち、暗く圧迫的な直線状トンネル/都市峡谷になっている**。快適な青空、視界、未来都市の複数公共空洞・曲面の主造形が弱い。道路中央には光の走行感があるが、見たい都市が遠方に繋がるより、巨大な一様壁が画面を占拠。Bは穴の数を増やしただけで同じ構造問題が残る。**A ART REJECT／B ART REJECT（どちらも正式採用禁止）**。成功した技術を美術PASSとは呼ばない。

## R15S3D13R1：実画像を受けた構造変更、検証前の仮説

別ブランチではなく同じDraft PR上、元D13は証拠として不変に残したまま、`scripts/p101-r15s3d13r1-open-sky-continuous-civic-spine.mjs`を新規作成。

- **道路の左右壁を物理的に遠ざける**：直近の巨大壁を撤去し、実B48縁からの最小横距離を旧38m級から新**68m以上**へ。もう片方の街区は83〜98m追加奥行き。上空の開放穴をさらに拡張。
- **しかし都市が再びバラバラに砕けないこと**を狙い、道路5から道路6へ途切れない外側の巨大リムと中層構造の2つの連続ロードパスを新設。真正B48を横断しない非衝突外側建築。
- 新2案 **A_SKY_OPEN_CONTINUUM** と **B_ASYMMETRIC_FREE_EDGE**。最上位基準は「街区全体の統一・主造形の迫力・広い空・路面と実障害物の見通し」であってポリゴンや開口の件数ではない。
- 証拠契約：実前D12 Aの2世界と失敗D13 Aの1世界、新R1 2案×2世界を、**実元ゲームWebGL2・同じ時刻・同RAW元カメラ**で比較。外観が明確に改善しない、道路が読めなくなる、形の統一感が弱い場合、技術PASSでもART HOLD/REJECTとする。
- 専用再実行 [Actions #41017020585](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41017020585)。**本書記載時点ではR1 CI実行待ち／R1本物のWebGL描画・元finishは未認定**。結果が届き次第、失敗・成功、実スクリーンショット枚数、必要なR2再設計を追記すること。

## 今後の美術・ゲーム品質ゲート

独立した美術とゲームの壁は未突破。舗装幅10〜16mのSlope2 DNAへの本物の移行、元球合法手動での回避意思決定、約170〜200m/sの速度感、実機Windows FPS、元B51 28基との視認性、巨大都市の接近→内部通過→離脱の時間構成を同じ実カメラで検査する。継ぎ足した装飾・暗い箱・反復する柱だけの修正はART合格ではない。

[Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46)はOPEN/Draft/未マージ。WindowsのPRIVATE比較は`scripts/R15S3D13R1_PRIVATE_OPEN_SKY_CITY_ONE_CLICK.cmd`を使用可能（ローカルPC実機での人間試走は未実行）。公開・マージ・生産向け原ソース編集はユーザーの別承認まで禁止。
