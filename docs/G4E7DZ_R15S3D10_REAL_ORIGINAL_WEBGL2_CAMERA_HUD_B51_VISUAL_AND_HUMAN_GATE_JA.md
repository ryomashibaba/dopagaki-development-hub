# DOPAGAKI SLOPE — R15S3D10 真正3D WebGL2統合・B51実位置警告・美術の批判的評価

**基準：2026-10-30 JST、Draft PR #46研究ブランチのみ。R15S3D9真正元Runner完走A案を使い、正規ゲームのWebGL2描画エンジン・カメラ・HUD・B51をPRIVATEへ接続した。原`web/drive3d.mjs`、元原本`web/p101-w9c2-g4e7ci-integrated-streetscape.mjs`、原Runner/CCD・P96/P94・B51元28基・`main`/Gold/P100/本番URLは直接変更していない。**

## 1. 実装した実ゲーム統合（単なる模型でも画像生成でもない）

`scripts/p101-r15s3d10-private-real-webgl-pack.mjs`は既存`npm run build:private`の後に、本物の`dist-private/drive3d`を**別の`dist-private/r15s3d10/`へ複製**。複製物だけに元`WebGL2`・`Runner`・HUD・追従カメラを保持したR15S3D9の勝ち形状を登録。原段階の真正元B48道路7本・B51 28基・元最終中心座標を出力し、PRIVATE 2元世界`R15S3D10-TRUE-PINCH`と`R15S3D10-PINCH-SWITCH`で利用する。

- **元240Hz**：実ブラウザの`drive3d`が元`p101Step`と元`Runner`を240Hzで動かし、デモ時だけP96 early-soft（0〜21.5秒、入力÷4.8）、以後P94 corrective、正規A13 forward scale／OVERDRIVEを使用。自動操舵を「人間が操作した」とは呼ばない。画面右下の手動操作は従来UIを保持、ただし人間の真の完走試験は未実行。
- **実描画**：元`web/drive3d.mjs`のGLSL WebGL2・本物の`buildVisual`・`drive3d-camera.mjs`・球・B48表面・B51モデル・元HUDを使用。別製の2D線画や単なるフレーム貼付けは行わない。
- **隔離**：通常`dist-private/drive3d`にも登録せず、原Webソースにも登録せず、ループバック`localhost/127.0.0.1`＋URL`?r15s3d10=on`でのみ試験ステージが表示。公開版ビルド・デプロイ・マージは行わない。
- **人間のための起動**：Windowsの`scripts/R15S3D10_PRIVATE_WEBGL_ONE_CLICK.cmd`は、このブランチがローカルにある場合、依存導入→PRIVATEビルド→隔離追加→`localhost:4373`起動とブラウザ表示を一括実行する。公開アクセスや外注はない。

## 2. 真正CI・実画面証拠

| 検証 | 出典 | 確認事実 |
|---|---|---|
| 元のままの実ゲームWebGL2 2世界・各5実画面 | [Actions #40994589547](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40994589547)／[Artifact #12950203398](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40994589547/artifacts/12950203398) | **SUCCESS**、真正Chromium WebGL2／元HUD・camera／元物理。true-pinch 69.83s、pinch-switch 70.52sそれぞれ`finished`＋元`finish`イベント1件、最終B48上で接地。10 PNG保存。 |
| 元28基B51の実軌道との立体接近 | [Actions #40994708979](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40994708979)／[Artifact #12949689963](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40994708979/artifacts/12949689963) | **SUCCESS**、真正R15S3D9 240Hz走行の保存された10Hz＋路面切替時刻を使い元B51位相を再現。28基中30m以内に近づいたのは**3基/両世界**。最小球表面距離**4.367585m／4.239973m**、元動体との接触0件。 |
| 日本語フォント＋正しいB51距離のHUDを追加した二度目の本物のWebGL2 | [Actions #40995166967](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40995166967)／[Artifact #12950903128](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40995166967/artifacts/12950903128) | **SUCCESS**、元2世界の`finished`＋`finish`再現、実画面各5枚・計10枚。日本語フォント導入でHUDの□表示が改善。元B51の物理OBBとの真空間分離を測定し、根拠のない旧「0m・0.0秒」予告を排除。空の空間では「近接動体なし」と明示。単体テスト4/4成功。 |

2度目の本物のWebGL2スクリーンショットを同条件で目視比較：高速道路・球・HUDは描画されたが、街区の建築は柱状の塊やワイヤー状フレームが支配し、独自の巨大な未来都市としての物量・造形・接近/通過/退出の豊かな変化はまだ達成していない。**ART正式合格0件／ART REJECT・HOLD。** 原ゲームは見た目上「遊べる」ボタンを備えるが、**本人の手動走行・回復公平性・予告と判断時間・遊びの楽しさは未認定**。

初回実WebGL CIのヘッドレスSwiftShaderサンプルFPS約11〜32、フォント導入後は約30〜52（代表時刻HUD値）。これはGitHub CIのソフトウェアGPU環境であり、ユーザーのRTXノート等の実機性能の証明ではない。**PERFORMANCE HOLD**。

## 3. B51の「数は28、迫力は未達」を実測で確認

元28基は本物の動体として保持したが、最小距離30m以内になったものは3基。最接近は以下。

| 機械ID | true-pinch球表面からの最小距離 | 最接近の元時刻 |
|---|---:|---:|
| `a13-machine-15` | 4.37m | 67.3秒 |
| `a13-machine-05` | 9.09m | 23.5秒 |
| `p95-hazard-12` | 18.32m | 65.3秒 |
| `a13-machine-14` | 32.47m | 64.9秒 |

旧HUDは元`route`に沿った先読み予告であり、新しい道路5/6と`route`が一致しない場合に、物理実距離と合わない「0m・0.0秒」などを表示する。その誤認を防ぐため、`scripts/p101-r15s3d10-physical-b51-hud-cue.mjs`をPRIVATEコピーへ組み込み、元`movingObstaclePose`と`sphereBoxSeparation`で**真の時刻における球面～動体箱の距離**を計測する。正規カメラで前方・視界内と推定した動体のみ表示し、根拠のない衝突予報秒は表示しない。**カメラの遮蔽・真の画素サイズ・次瞬間の経路予測は測定していない**ので「視認できた」「回避可能」と誤認させない。

ただし、一時刻につき正面視野内かつ120m以内という厳しい選択は近接物体の見逃しを起こし得る。そこで走行全体の代表5地点だけでなく**最接近時23.5/65.3/67.3〜67.9秒の実ゲーム追加撮影**をR15S3D10追加ゲートに含める。結果で警告が見逃すなら、HUDのアートや操作性はHOLDのまま見直す。

## 4. 美術・構成の現時点の厳格評価

既存都市候補の精緻さは圧倒的な10km級超未来都市の要求水準に達していない。WebGLで撮影した17/34/48/60/70秒の実ショットでは、大きな矩形構造・空中の線状ゲート・広い単色面／暗い空隙が支配。実表面接地と速度は保証できても、「地面の裏がある都市」「大空洞が支配する都市」「人間の暮らす共有断面」「巨大非対称ランドマーク」は今の画面では弱い。現行景観を小ディテールだけで磨く路線は禁止し、**後続工程で主構造・断面・高低差・シルエット・接近～退出の時間的構成を一度で再設計**する。

車線色が目立つことだけではSlope2 DNAの完成と認定できない。次のハードルは、ユーザー視点で**幅10〜16m・速度200m/s級・予告・カーブ・分岐・安全に説明可能な失敗・ギャップの正直な表示**が実際に揃うかどうか。実ゲーム映像と最終元`finished`をセットで審査する。

## 5. R15S3D11の次工程方針（目的に直結する実制作）

1. **B51実コース再設計**：現行元B51全28を保存した上で、PRIVATE候補の複数の実障害物を真の車線・経路・速度に再配置する案を別のデータレイヤーで試す。28基という数合わせではなく、前方視認→判断→回避→通過が成立するか、原Runner/CCD/元動体位相で2世界の真正走行・非成功比較で検証する。原元ステージに無断上書き禁止。**自然な回避可能性**を持たない単なる致命的壁化もREJECT。
2. **偽警告0・警告見逃し診断**：単なる中心点カメラ投影でなく、動体の実サイズ／遮蔽／近接・後方・側方を区別したUI＋原ゲーム画面の数値と画像。衝突予測に関しては断定表現を避ける。
3. **真のゲーム都市美術再制作**：既存CITY景観の繰返す柱・箱・浮いた骨組みから決別する。道路5/6の印象的な区間に、住まい・公共空洞・複数階街路・厚い曲面骨格・世界スケールの多層空間を**実3Dで制作**し、全く同じ元カメラ・画角で5〜8視点比較する。TRUE SOURCE GAME WebGL上の画面をART審査の正本とする。
4. **人間の元手動操作**：PRIVATEローカルゲームの通常手動モードで、視界・回避・旋回・ジャンプを人間がプレイした証拠を明示的に得る。自動走行やAPI完走は代用禁止。
5. **採用境界**：`main`/Gold/P100/本番サイトと保護元blobを変更しない。Draft PR #46を保ったまま、レビュー・批准・正式公開は別承認があるまでHOLD。

**正式判定：SOURCE-NATIVE FINISH2/2 PASS、REAL WEBGL2 ORIGINAL RENDERER INTEGRATION TECH LIMITED PASS、HUD/B51 SOURCE TEST限定PASS。GAMEPLAY/ART/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD、正式ART0件、Slope2認定0m。**

## 6. 240Hz厳密同時刻・B51警告の実画面比較（追加実施）

[Actions #40996000955](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40996000955) **SUCCESS**。PRIVATEの元ゲーム画面だけに、Playwrightから明示された場合に限り、`Runner.time`が所定時刻に到達した**その240Hz tick**で画面を凍結する検査を追加した。普通のゲーム／手動試走でこの変数は設定されず、一時停止はしない。

真正ソース画面 **true-pinch 8枚＋pinch-switch 9枚、計17PNG**。17.000/23.500/34.000/48.000/60.000/65.300/67.300〜67.900/70.000秒の元`Runner`時刻が`nativeTicks==時刻×240`で実一致。true-pinchは元16759 tick／69.83s`finished`、pinch-switchは元16924 tick／70.52s`finished`を**途中凍結後も再現**。UI表示と物理時計を偽装することなく同じ瞬間を撮影可能になった。

**発見された明確な不具合**：true-pinch 67.3sで、元10Hz実走行の`a13-machine-15`は実球表面から4.367585mに接近していたのに、画面内/前方優先の警告が「進行方向の近接動体なし」だった。pinch-switch 67.9sでは同B51 4.239973mをHUDに表示。これは単なる0m ETAの是正だけでは不十分で、側方・後方・画面外の真正近接を落としていたことを示す。

**R15S3D10近接補修（別候補）**：物理OBB真分離が25m以内なら、画面前方に該当する候補が無くても「近接B51・現在の実距離・後方/側方/画面外・遮蔽は未判定」を明記する。衝突予言秒・人間の回避保証は加えない。元B51正本/物理/通常版には触れない。`scripts/p101-r15s3d10-physical-b51-hud-cue.mjs`で実装。`tests/p101-r15s3d10-source-b51-hud-cue.test.mjs`に側方・後方の見逃しを拒否するテストを追加。

**診断失敗履歴も保持**：[Actions #40996383282](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40996383282)で、変更したHUD文言に対する旧テストの正規表現`/近接動体なし/`が古く、単体テストのみFAIL。これはHUD物理動作や本番の失敗と別。その後テスト文言を修正したが、**後続の真正Actionsで成功が確認されるまで補修の合格認定を行わない**。

追加試験を含め、SOURCE-GAME WEBGL2真正完走2/2という既存の実証は維持。ただしB51近接警告の品質は補修QA HOLD、正式GAMEPLAY/HUMAN/ART/PERFORMANCE/RELEASEはHOLDのまま。スクリーンが写ったこと、元Runnerが完走したこと、ユーザーが楽しめることを混同しない。

