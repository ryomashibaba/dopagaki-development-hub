# DOPAGAKI SLOPE — R2F4-B 真正内部市場直接改修／元B48高密度3D検査／独立ART REJECT

**2026-11-01 JST。非本番研究、`p101-velocity-overdrive-native-trial`、PR #46 OPEN/Draft・未マージ。**

**結論：SOURCE TECH限定PASS、ART REJECT。正式ART採用0件、Slope2 DNA正式0/2,912m。HUMAN/GAMEPLAY/PERFORMANCE/RELEASE/MERGE HOLD。**

## 1. どの形状を変え、何を保護したか

旧R2F4 [コミット`4f94b07`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/4f94b07d93e019c38e34fbafba06ff6c1560ef6e)、[旧真正元画像/GLB Artifact #13072421208](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41278482489/artifacts/13072421208)は保持。今回は[直接美術改修コミット `836269a`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/836269ac7b6dc4e9e44057f2ce1f36779a816831)で、元Road1左端から35m、`u=.100`と`u=.350`の2小公共施設**だけ**を修正した。

- 従来の左右の充填された8点ロフト「塊」を、左右それぞれ独立した**厚い基壇・外側支持壁・曲面屋根・後端の支持面**へ分解。屋根の下に実GLBにポリゴンがない空間がある。元カメラを向く入口中央18mに掛かっていた幅24mの横断屋根を削除。
- 中央奥には高さの異なる**3つの店頭カウンターと薄くない屋根**、ひとつの低い公共後方デッキを実立体で制作。左右の入口縁だけに支持フレームを残す。各施設の今回の実3D追加領域の頂点数は1,080（旧568）。
- 原ロード1高低差・世界地形に対する**実地盤支持**、人間通行・避難経路、商品/店舗内機能、PBR素材は**未証明**。5地区・22用途・遠景R2F3都市、元球・操舵・自然ジャンプ・元HUD/RAW camera/得点・240Hz・B48×7・B51×28、main/Gold/P100/W9-X/B5・本番2URLは不変。元ソースGit blob `af076d67492a677d2235e4730aef8cdf4808e106`不変。

## 2. 本物の独立CIとGLB証拠

[GitHub Actions #41279367644](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41279367644)：**全21工程SUCCESS**。実Blender 4.0.2、新BLEND/GLB、GLB COLOR0独立読み戻し、元B48/B51検査、元14/28m×6tick真正WebGL2×12画像、元カメラでのBlender形状投影＋PNG SHAを成功。

[Artifact #13072192904](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41279367644/artifacts/13072192904)：6,258,387 bytes、ZIP SHA256 **`dc8830fcb816416e9edff0fbd2a4e2809a3bc580aabb6793cca7098fdcbe6488`**。実ダウンロードZIPのSHA256と原本内部34ファイルを確認。
- 実Blenderのfaces **22,164**／WebGL2 GPU triangles **44,512**、5地区・22プログラム、新collider0。
- 元B51動体28×元tick0..2880の2,881×両幅2＝**161,336離散動体時刻・新GLB三角形/回転OBB SAT交差0**。あくまで離散時刻、swept CCDではない。
- **今回初めて全B48×7道路の静的三角形サンプル照合を実施。** 元物理と同じ`sample()`から道路1本あたり320×12×2＝7,680枚、計53,760枚を両幅別々に再構成し、新GLB全44,512 GPU三角形と3D格子広域判定。**道路のサンプル三角形との接触0件。3D AABBが交差する候補0組、詳細三角形SAT実行0組**。これは空間分離を強く示すが、**元エンジンでの真のB48メッシュ全三角形・数学的厳密クリアランスの検証ではない**。未サンプル形状は不明、静的B48正式認定は引き続きHOLD。PBR/人間歩行/B51ラスタ遮蔽/時刻間CCD/FPSも未認定。

## 3. 旧R2F4→B、同一真正カメラ画像の独立比較

旧新の真正PNG各1013×698の同一元240Hz tick・同一道路幅に対し、**各画素RGB最大チャネル差が36超**の割合を算出。左側ROI x0..369、y200..479。画素変化率は美術点数・障害物可視率ではない。

| 元時刻 | 14m全画面 | 14m左ROI | 28m全画面 | 28m左ROI |
|---|---:|---:|---:|---:|
| 8.004秒 / tick1921 | 1.329% | 8.817% | 1.310% | 8.671% |
| 11.504秒 / tick2761 | 1.501% | 10.243% | 1.897% | 12.948% |

**厳格美術判定：ART REJECT。** 元8秒では旧の玄関を覆っていた大きな横屋根が減り、新しい左右の明色の屋根・間の空洞が本物の走行画面に映った。11.5秒でも手前に開放した新館の断面が入る。しかしどちらも**水色の低い屋根と単調な箱状建築**に見え、魅力的な「人のいる未来的市場」「奥行きのある複合都市」には届かない。プログラムで市場3店を定義しただけで画面に市場として読めるとは認定しない。

## 4. 次の独立研究ゲート — 形状ループを止め、素材と明暗を検査

**重要な技術原因を確認**：GLB読み戻し原本`scripts/p101-r19a6p1-read-blender-glb.mjs`は、COLOR_0を含むXYZRGB float32のみを既存WebGL2レンダラへ渡し、先頭コメントでも**PBR/material rendering is NOT implemented**と明記。現状の見栄えは物理ベース反射・実ガラス透過・法線ベースの陰影・細部の質感を表現するパイプラインとしては設計されていない。したがって**美術品質を上げるために単に穴・屋根・面数を増やす試行は停止する**。

次は元ゲーム側に何も変更せず、**既存非本番private rendererだけを隔離**して、素材の明暗/法線/色の階調を検証できるか調査する。最初に重要な元8秒・11.5秒の真正画像を2枚で比較し、本当に綺麗に見える候補のみ元12枚/B51全tickへ。元の操舵・球・障害物可視を退化させる照明/眩しさは不採用。新レンダラの元shader・vertex layout互換性を厳密に確認し、無根拠なPBR導入宣言はしない。

なお元B48厳密、実地盤接地・人体アクセス/B51本物画素遮蔽・人間実走とモバイルFPSの独立ゲートは保護して継続。ART正式採用0件、正式Slope2 DNA 0/2912m、PR #46 Draft・未マージ。
