# K4BL — COASTAL HARBOR ART-FIRST : 真正Road5スケールの全面美術再設計

2026-11-04 JST。開発元：`ryomashibaba/dopagaki-development-hub`。新隔離研究ブランチ：`research/k4bl-harbor-atmosphere-art-reconstruction-20261104`。

## 固定された上位方針・真実の前工程

DOPAGAKI SLOPE — HYPER RUSHは世界水準の超高速3Dレースゲームとして**全コースの美術を完成**させる。美術の価値は実画面を見て評価する。**施工・CI・ポリゴン数・アセット数・SOURCE整合性PASSをART PASSと認定しない**。K4BKは本物のRoad5測量9断面・ネイティブBlender DCC技術のPASSを達成しても真control11307/ultra11341画像が安っぽい巨大壁・路面・橋に見えたためART REJECT。正式ART採用0件・Slope2 DNA認定0m。

前工程K4BK確定CI [#41747761082](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41747761082)、真正Blender Artifact [#13284094495](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41747761082/artifacts/13284094495)、`K4BK_GROUND_TRUTHED_CIVIC_ROADSIDE_EDITABLE_ART_HOLD.blend` 35,000,624 bytes、SHA256 `8874f09c868218879bcc6a346303819b17f38ffda11177c44555e022167a1c9c`。Road5元mesh元camera不変を次工程でも引き継ぐ。元真正SourceCamera road survey d=-25〜170mで左右境界・高さを測定済み。これは安全に走れる幅ではない。

## K4BL 今回の美術方針と実制作

**今までの近景巨大側壁や道路横断太い橋を積み増さない。** 美術の出発点を港・公共図書館・フェリー乗り場・海と風にさらされた段状地形という読み取れる街の用途に戻し、真のCameraから近景／中景／遠景が分かれるフレームを制作する。

- `scripts/p101-k4bl-authored-harbor-cinematic-roadscape.py`：真Blender原本を開く。元Road5の元Camera 2視点におけるmesh fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2` を前後照合。元Camera数値を前後比較し完全不変とする。旧K4BK/BJ/BI/BH研究ARTモデルは削除せず**Render OFF**。
- 近景 d=-25〜約60m：真道路Raycastに合わせた低い石積み・自生松・海岸植栽・精密な低いガードレールで自然と道路の間を表現。両脇に巨大無地壁を置かない。
- 中景 d≈60〜178m：西に一体型の低層図書館＋図書室、東に独自曲面の銅屋根を持つ港湾旅客ターミナル＋実ガラス・照明・船着き場。どちらも元Road5左右の数値に基づく道路外の位置。
- 遠景 d≈195〜430m：海沿いの実用途のある公共施設、観測塔、港湾クレーン、海、地層の沿岸地形で白く空虚だった水平線を埋める。Road5の実物RoadはCamera前方最大188.774mなので、d195m以遠の人工施設や景観は**非走行用のDCC背景**、安全道路だと認定しない。
- Road5 source mesh本体の頂点／面は不変。DCC専用の低光沢暗色の舗装層と細い車線／路端グラフィックをshaderとして構築。従来の目立ちすぎる白線・灰色の広い道路を抑え、シンプルな海辺の配色に統一。
- 夕景のNishita天空と現地公共空間の暖色照明。従来のCycles無デノイズ粒子ノイズの反省から、まずBlender 4.0.2の`BLENDER_EEVEE`で描画を試みる。これは美術的PASSの代わりではない。結果を直接見て判断する。
- 真Camera control11307 + ultra11341の2枚、編集可能なBlender原本、旧K4BKと同フレームの中立A/B比較、各SHAを必須。研究ブランチとActions Artifact保存。

## 禁止事項・境界

- 元ゲーム `web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` Git blob `af076d67492a677d2235e4730aef8cdf4808e106` を不変。元B48全7道路／B51全28移動体／240Hz／球半径0.65m／元Camera全6・実操縦・安全UI・FPS・SAT・CCDを変更しない。元ゲーム内のCollider追加0。
- `main`、公式`p101-velocity-overdrive-native-trial`、Draft PR #46（未マージ）と本番サイトを変更しない。Work/Computer Useは別途許可が必要。ユーザーWindows操作なし。
- DCCの真正Camera数値で描画しても**実ゲームWebGL2画面ではない**。ゲームB51可走クリアランスや人体安全・性能を証明しない。HUMAN／SAT／CCD／FPS／ART／RELEASE／MERGEは全HOLD。
- ARTが真正画像で拒否されたら、正式ART採用0件／Slope2 DNA0mのまま維持。他6道路への展開やゲーム反映は行わない。

## 実行ログ
- K4BLの独立研究ブランチ作成、Blender制作ソース保存、[実GitHub Actions #41749501857](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41749501857) 起動済み。
- この文書執筆時点では CI最後の結果・原本の実生成・画像審査は**未確認**。成功や美術合格を捏造しない。ログ／Artifact／RGBは後段に追記する。


## EEVEE初回CI実機制約と復旧処理（2026-11-04）

- 最初の[CI #41749501857](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41749501857)は **completed/FAILURE**。元Game SHA、Node sourceテスト、Blender親K4BK.blend SHAはPASSだが、ヘッドレスUbuntuの`libEGL.so.1`が見つからずBlender起動時にcore dumped（exit134）。Eevee画像、.blend、比較PNG、ART合格は**一切出ていない**。ゲーム元原本は未変更。
- 修正 `6706372e3ad56d211efa31fad92e9770c4fb46de`：Blender制作スクリプトに描画エンジン明示引数`--renderer eevee|cycles`を加え、Cycles 72sample（OIDN OFF）を安全な退避経路として組み込む。次のCI #41749843377 は新CIへの移行で**cancelled**、最終成果ではない。
- 修正 `f9951e528c828cb2c23ac22f1aeb12cb84f28d95`：専用workflowに`xvfb`, `libegl1`, Mesa系の必要なLinuxソフトウェア・グラフィックスライブラリを導入し、`LIBGL_ALWAYS_SOFTWARE`/XvfbでEEVEEにチャレンジ。GPU/GL環境により失敗した場合は出力残骸を消去し、確立済みのCPU Cyclesで**その場で再レンダリング**、依然ダメなら正しいFAILURE。成功前に前回の失敗をなかったことにしない。
- [最新再試験CI #41749970400](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41749970400) は状態、各画像、元B48 geometry/Camera fingerprints、ベンダ由来renderer事実、Artifactを実照合する。**まだTECH・ARTの最終成功宣言はできない**。
