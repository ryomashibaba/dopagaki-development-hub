# G4E-7AM — UPTURNED CITY / 反転する巨大都市外殻（非公開・美術HOLD）

2026-10-24 JST。従来のG4E-7AF/7AGで「巨大なのに反復アーチに見える」「都市の面が主役でない」という課題があり、技術監査だけでなく実際の見た目を変える独立候補を作成。**正式コース採用、公開、人間の公平性を宣言する文書ではない**。

## 発想と実制作
- 1本の象徴的な全長外形：細い実B48道路の**左右外側に、互いに形も高さも違う二枚の巨大な都市大陸がめくれ上がる**。通行する道路自体は描画用の見せかけではなくG4E-7AJの正規B48。
- 左都市外殻：高さ係数570mの折り上がる質量。右外殻：895m級の上昇係数、より大きな前後流れ。単一の反復門ではなく連続する不規則な面と非線形の断面曲げ。
- 穴は裏面込みで**三角形を生成しない実際の空洞**。都市を埋める偽の黒い矩形ではない。8段の張り出し都市テラス、6本の不規則な巨大外殻棘、内外で異なる素材階層。最低でも道路端から128m離し、障害物の目の前に縦壁を被せない。
- フォトリアル・美術合格とは断定しない。断面や都市としての密度、人間の高速視認、規模感は実レンダリングの確認対象。看板・HUD・コース操作の変更なし。

## 実装箇所

- `web/p101-w9c2-g4e7am-upturned-city.mjs`: 正規7AJ reanchor/B48/28機出典を実行時検査して、**GPU用だけ**XYZ+RGBの三角形リストを作る。doc JSONを変更しない。候補生成に `sample` の実B48曲線を使う。
- `web/drive3d.mjs`: 明示的なループバック `?g4e7al=manual&g4e7am=continent` の組み合わせだけで旧箱・反復門背景を **置換**。通常のAL手動試走は旧景観のまま。実道路、A/D、240Hz CCD、動体28基、カメラ、ジャンプ挙動、自己ベストはすべてそのまま。
- `scripts/build.mjs`: レンダラーにJSモジュールを同梱するが、研究用7AJステージJSONは従来どおりprivate + `DOPAGAKI_G4E7AK_VISUAL=1` だけ。公開/public-safeへの未採択ステージ漏洩を禁止。
- `tests/p101-w9c2-g4e7am-art.test.mjs`: 左右2コースの原ステージbyte同一、真正28基・空洞・大質量・描画負荷・未採択0m、元生成を検査。
- `tests/browser/p101-w9c2-g4e7am-art.spec.mjs`: Chromiumの実WebGLで旧背景とAM 2コースを撮影し、画面属性で3D実生成、物理HOLD/28機、安全なopt-inを検査。自動キーボードは人間QAの代用にならない。
- `.github/workflows/p101-w9c2-g4e7al-manual.yml`: 7ALの回帰テストと同じrunnerで7AMのNode/Chromium実画面を検証し、PNGを**GitHub Actions artifact**へ保存。ユーザーによるZIPアップロードや手動転送不要。

## A/Bの開き方（privateのローカルサーバーのみ）

従来版：`http://127.0.0.1:4373/drive3d/?g4e7al=manual`

UPTURNED CITY候補：`http://127.0.0.1:4373/drive3d/?g4e7al=manual&g4e7am=continent`

ローカル起動には依然として非公開privateビルドが必要。両本番サイトをこのパラメータで更新することは一切許可しない。

## 検証と境界

G4E-7AL単独の技術ゲートは [Actions #40026772361](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40026772361) で **SUCCESS**。Node、実Chromiumの2候補操作／失敗→JSON保存、公開/public-safe隔離が全PASS。

**AM候補自身の新設検証は [Actions #40028777111](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40028777111) の結論待ち。** WebGLスクリーンショット、GPUの重さ・カメラ画角での大きさ、実際に道路と障害物が認識できるかは結果なしにPASSを宣言しない。成功時にも**美術品質/人間QA/正式DNA認定0m/公開HOLD**。

次工程：Actionsで実画像を取得した後、多視点で実見た目・道路の先読みを評価。良くなければAMを採用せず別の3D形態候補を設計する。人間の実試走ログが来るまでは既存7AJ実衝突配置を改変しない。
