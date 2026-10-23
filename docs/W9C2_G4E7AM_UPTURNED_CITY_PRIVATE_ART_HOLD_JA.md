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

**AM R1の新設技術検証は [Actions #40028777111](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40028777111) ですべてSUCCESS。** 実WebGL画像artifact #12534985530 を読み取り、旧背景・AM TRUE-PINCH・PINCH-SWITCHを比較。NodeとChromiumや研究JSONの隔離はPASS。しかし実画像は巨大な左右の連続壁に見え、シルエットの複雑さ／空の開放感／都市の多層性に不足。**美術としてHOLD/再設計対象**。さらにPINCH-SWITCHは画面スクロール位置の影響で撮影画角からWebGLキャンバスが外れ、黒い画像になっていた。実コースが黒く描画されたと断定せずスクリーンショットの収集不備として分類。

次工程：Actionsで実画像を取得した後、多視点で実見た目・道路の先読みを評価。良くなければAMを採用せず別の3D形態候補を設計する。人間の実試走ログが来るまでは既存7AJ実衝突配置を改変しない。

## G4E-7AM R2 — SKY BREACH 実形状修正（2026-10-24 JST）

- R1の「左右大きな面＝一本の巨大な壁」問題を初回CIの**実画像**で確認。単純な0.1m位置変更ではなく建築自体を再設計。
- 外殻の最小道路外側離隔を左128→**222m**、右142→**255m**へ。高さ係数を570→650m、895→980mに引き上げ、高空ほど外側へせり出す非線形断面を強化（構造の高度は頂部位置の近似でありMinecraft施工高さではない）。
- 左右を互い違いのリズムで縦断する**完全な空スロット**を形成。5×5pxの黒い穴テクスチャではなく、該当区画の表裏の**実GPU三角形をそもそも生成しない**。本研究スクリプトの区画計算では全空洞246メッシュ区画、うち上層まで連続するマクロ空スロット176区画。独自の巨大都市テラスや外殻の棘も保持。
- 技術試験で `negativeSpaceBays >= 210`、`macroSkyOpenings >= 150`、最小外側離隔222m、AJ元JSON完全一致、衝突0・追加B51 0・正式DNA 0mを検証する。
- Playwright画像を `page.screenshot()` から**実WebGLキャンバス `#view.screenshot()`** に変更。特に第2コース遷移時、Nextボタンでページが下へスクロールしてもキャンバス自体を撮影する。変更後PNGの**視覚評価は別判定**。
- 修正版専用 [Actions #40037992309](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40037992309) の最新結果／PNG artifactを次担当が直接取得し確認する。記入時点ではQueuedで、合格とは報告しない。旧AM R1の実画像artifactは参照物として保持。
- **決して合格扱いしないゲート**：遠景巨大都市の美術完成度／初見走行の公平性／VRAM・GPUの実機負荷／正式A13 40％認定／本番・Gold・原作の更新。ここではすべてHOLD。
