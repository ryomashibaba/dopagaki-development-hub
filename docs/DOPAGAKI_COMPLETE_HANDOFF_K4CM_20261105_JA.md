# DOPAGAKI SLOPE — HYPER RUSH｜2026-11-05 K4CM最終・完全統合引き継ぎ正本

**新チャットでそのまま継承して実開発を続行するための正本。** 継承基準：2026-11-05 JST。これは新しい開発計画や方針再審議ではない。新チャットはこのファイル・ルートSTART_HERE・最新のGitHub HEAD/CI/Artifacts/PRを読み、完了済み工程のやり直しを避け、**実ゲーム完成と実画面のART品質改善**を優先すること。

**リポジトリ**：https://github.com/ryomashibaba/dopagaki-development-hub  
**研究ブランチ**：research/k4cm-integrated-coastal-road-port-20261105  
**最新の確定R3実Blender Actions**：https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41991682479 — completed/SUCCESS、12/12工程  
**R3真Artifact**：https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41991682479/artifacts/13397694820  
**真比較画像**：docs/research-evidence/k4cm/K4CM_VS_K4CL_TRUE_SOURCE_CHASE_WHOLE_FRAME_ART_REVIEW.png  
**R3監査JSON**：docs/research-evidence/k4cm/K4CM_REAL_NATIVE_AUDIT.json  
**K4CM研究コード**：scripts/p101-k4cm-native-integrated-coast-road-port.py  
**K4CM真正ワークフロー**：.github/workflows/p101-k4cm-native-integrated-coast-port-art.yml  
**K4CM工程文書**：docs/R19_A6P4_R2F5K4CM_INTEGRATED_COAST_PORT_ART_JA.md

> 最終R3 TECH PASSは事実。しかし正式ART採用0件、Slope2 DNA認定0m、実ゲームプレイHOLDである。成功したCIと「見た目・楽しさの合格」を絶対に混同しない。

---

## 1. 最上位の完成目標と開発思想

- **最上位は「実際に人間が遊んで面白く、世界水準の見た目と迫力を持つ、本当に完成した高速3Dブラウザレーシング／サバイバルゲーム」**。理想は有料インディーゲーム級、巨大なSF都市・海岸・空中構造のなかを高速度のエネルギーボールが走る、危険と爽快感、操作性と視認性が一体化した作品。
- QUALITY-FIRST / ART-FIRST / INTEGRATED VERTICAL SLICE / DCC-FIRST。**最上位の遊びの完成と面白さを犠牲にしてARTやQAだけを目的化しない**。ただし現状の支配的ボトルネックは「コースと周囲の本物の画面全体の美術が低品質」であり、当面は1区間の真正美術完成を優先。小さなCI・プロンプト・工程数の増殖より、視覚的に大きな、実プレイで意味のある変更が必要。
- 完成済みの物理・元道路・操作性を勝手に作り直さない。SOURCEの真正画面/カメラで評価し、ゲームプレイ以外の研究DCC画像を「ゲームの実プレイ」に偽装しない。真のBlender編集可能な.blendが要る。画像は実際に開いて美術評価する。
- 長期的には約7,280m級、約52秒、約195–200m/s級という歴史上の高速走行を継承。Slope2の目標は危険だが制御可能な狭路、急降下、空中道路、急カーブ等をコース約40%に統合すること。ただし現在の正式Slope2 DNA認定は0m。新たに狭路・跳躍などを正式SOURCEへ変更・認定してはいけない。
- 本番は既存のDOPAGAKIサイト。GitHub Pagesは開発・検証用途のまま。本番環境/旧サイトを無断変更しない。

## 2. 不可変更の安全条件・原本ロック

**厳守する凍結物：**

1. main（照合HEAD：d402801f271f43163ad85d9303abe9773d3958bd）、公式 P101 ブランチ p101-velocity-overdrive-native-trial（照合HEAD：19d3a32d525c0c2a67082cba646898fab8f2b60f）、原作Slope、Gold/凍結原本、既存2本番URL、正式QA、Draft PR #46（2026-11-05時点 Open/Draft/未merge）を無承認変更・merge・公開禁止。
2. **元Game Git blob：af076d67492a677d2235e4730aef8cdf4808e106**。元Road5メッシュ全頂点・面SHA256：**f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2**。研究用DCCのRoad5が意図せず変更されたら即STOP。
3. 既存240Hz真正物理、ボール半径0.65m、重力など既存仕様、B48の全7本の元道路、B51の28移動障害物、元Road5/6、元Cameraと追従/操作/衝突判定/速度/ジャンプ/相対位置/ゲームスコア・UI等は不変。ゲームの高速性やテストを、偽物・代替の安全コース・代理カメラ・代理物理で置き換えない。
4. R19研究DCCの元SOURCE 6Camera/CHASE、木11本、灯光、既存研究親のMesh・行列は研究の複製／表示だけを許容し、破壊や原本上書きは禁止。研究レイヤーの非衝突新オブジェクトは許容できるが**ゲームにColliderを追加しない**。
5. mainへのpush、公式P101、Draft PR #46のmerge/正式QA上書き、本番公開、元Game/Gold原本の破壊、追加課金、Work/Computer Use開始には**都度、ユーザーの個別事前承認**。研究ブランチに限定したコード・Blender/CI証拠・START_HERE更新等の作業は許容。追加有料API原則0円。
6. 公式ART採用 **0件**、Slope2 DNA認定 **0m** を固定。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。SOURCE TECH、DCC TECH、ART、実WebGL2、実240Hz物理、SAT/CCD、実人間プレイ、FPS、公開承認を**別々のゲート**として扱う。TECH PASSでART PASSに昇格禁止。

## 3. 成功判定と検証の厳密さ

- **TECH**：真のBlender4.0.2/EEVEE（必要ならCycles）、編集可能Meshと元.blendの別名保存、同じ元CHASE 768×480実PNG、元SOURCE/親原本のSHA一致、既存Road5/CAMERA/木11/ライト・研究原本の座標と不可変、真GitHub Actions全工程SUCCESS、Artifactの**別途ダウンロードとZIP CRC・各ファイルバイト数/SHA256独立一致**。最終run番号・source SHAを記録。
- **ART**：必ず真PNGを直接開く。写真風の合成・手描き修正・架空スクリーンショットは不採用。全体構図、街・港の実在感、壮大さ、近景～遠景の密度、スケール、左右の世界のつながり、道路からの進行視線、建築の用途、自然な材質・照明、速度感、プレイ中の視認性を人間の視点で評価。可視差分画素は**表示されるTECH証拠**で美術点数ではない。
- **PLAY**：現在の静的Blenderアートは実ブラウザゲームに実装されていない。真WebGL2/Chromium、既存240Hzの合法な走行、操作・ジャンプ・物理・衝突・フレームレート、実人間操作や公開可否は**未確認/HOLD**。ゲーム統合前に一連のゲートが必要。
- 失敗したrunは失敗として保存。個別コードの途中修正でキャンセルになった旧runを成功扱いしない。正本先頭の最新項目を優先し、下段の「最新」「queued」等は当時の履歴として扱う。

## 4. プロジェクトの技術と歴史上の到達点

### R1–R19 / K4 系列の要旨

- 原作の本物の高速ゲーム・道路・動体・Camera・原物理の継承を最重視。正式認定前は既存SOURCEを作り直さない。Gold・本番サイトと公式P101は凍結したまま研究ブランチ上で検証。
- 原道路7区間の正規ソースカメラ撮影、K4Zの元真正WebGL2 82PNG、K4AA/ABの元画面描画群差の実検証、K4AF–AJのGPU遮蔽/元B51と元240Hz連続測定、K4AYの真正SOURCE Road5スケールと元6Camera安全研究が後のART研究の基礎。**実GPU遮蔽・非表示物体の反事実BVH・物理接近距離はそれぞれ別物**。どれも人間ART/PASSを証明しない。
- 初期K4B–K4CAの未来都市、市場・巨大建築・殻・都市空洞・海岸アート試作は**TECH PASSでもART REJECT**が多数。箱状・低密度・目立たない・目的が不明な屋根・雑な配色・薄い平板地形・視界に現れない巨大作品・道路と切り離された模型が主要な失敗。屋内施設や超巨大都市を自動大量生成しても良い作品にならない。
- **K4BZ**：本物の重複道路による黒い路面三角筋を診断し、研究表示の危険な重複道路だけを非表示にする成功経路。Road5原形状・元Cameraは不変。既知黒筋6対/元Road5中央5画素を独立回帰する。
- **K4CA**：元CC0樹木（Poly Haven等）の本物の3D、海岸木2本と左斜面の改善があっても、全画面の品質はART REJECT。元木11・光源保護が継続。次K4CBから、1画面全体の構成を根本的に改善する方向へ移行。

### K4CB–K4CH：港・岩盤の実制作

- **K4CB**：海岸・港の建築や材料を単一の意味ある機能として作り始めたが、玩具的な配色・箱の羅列を克服できずART REJECT。小物の種類増加を目的化しない反省。
- **K4CC**：左の実3D岩盤を追加し、元SOURCEの道路・Camera保持のもと地形に重量感を付けた。実レンダーTECH PASSでも自然な巨大地質との連続や港のスケール感が弱くART REJECT。
- **K4CD/K4CE**：実潮汐水面・本物のフェリー船体・港との実接続で研究上可編集な港を制作。K4CE [Actions #41935099728](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41935099728) TECH PASS。初回はフェリーが隠れて画素不足→真Blenderレイ遮蔽を用い、船が実CHASEに見える位置へ修正した。しかし画面全体は路面が巨大で港が小さくART REJECT。
- **K4CF/K4CG/K4CH**：造形対象を船や小屋から大きな港湾・沿岸の形へ移行。K4CH [Actions #41957682964](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41957682964) TECH PASS/ART REJECT。塩害材や本物の銅屋根・フェリー駅支持部が親となるが、岩盤の白い平板・港の玩具性・中心路面の広さが未解決。

### K4CI–K4CM：最新までの実制作と確定ART評価

| 工程 | 真正Actions最終結果 | 実制作の主眼 | 技術/美術の確定結論 |
|---|---|---|---|
| **K4CI** | [#41966161805](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41966161805) SUCCESS | 幅56m/高さ44mの一体型港荷役ガントリー、研究Mesh640頂点480面。初回QAが右港2104px不足、荷役デッキ・横断トラス増設 | TECH PASS、**ART REJECT**。港の高さは出たが道路との関係が弱い |
| **K4CJ R2** | [#41968702663](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41968702663) SUCCESS | Road5 SOURCE標高から198m/100地点×11断面、岩盤1100頂点・風防10区間、親研究岩2件を非破壊コピー | TECH PASS、**ART REJECT**。三角風防が浮き規則的で模型的 |
| **K4CK** | [#41980948992](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41980948992) SUCCESS | K4CJ三角風防を研究上だけ隠す。A：波蝕岩盤＋低連続擁壁。B：より自然侵食の岩盤。両方別の編集可能Mesh | TECH PASS、**両方ART REJECT**。Aは比較基準としてBよりましだが採石場のよう |
| **K4CL** | [#41985567281](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41985567281) SUCCESS | 原K4BQ研究用道路の本物のメッシュを非衝突複製。A：暗い粗粒グラファイト路面＋標示46面、B：明るい鉱物舗装＋標示26面 | TECH PASS、**両方ART REJECT**。Aは道路の進行方向を改善し、現在の研究比較基準 |
| **K4CM R3** | [#41991682479](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41991682479) SUCCESS | 約198mの実岩盤褶曲、右港200m連続盛土、実フェリーへの18.10m歩行デッキ、実ガントリー/屋根を原本保持コピーで再形状化 | **TECH PASS、直接ART REJECT**。左と港の色調は改善したが、大きな単調道路と模型的景観が未解決 |

**工程成功の連続は本番ゲーム完成ではない。K4CMが現時点で最新の正規研究工程。K4CNはまだ開始していない。**

## 5. K4CM最終R3の完全な証拠

- [Actions #41991682479](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41991682479) ：**completed/SUCCESS、全12工程SUCCESS**。
- [Artifact #13397694820](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41991682479/artifacts/13397694820)：ZIP **126,862,764 bytes**、SHA256 **b9aa9aff8d5bb711b6e3f6a2e99eefa4a933e7043f19555120b460a340529a32**。GitHubから別取得した実ZIPの**全CRC PASS**。
- 編集可能K4CM.blend：**283,002,044 bytes**、SHA256 **273c6ab1ec334ff8b2524c43c611da43831aaef3374056f3ab02352e3e914aab**。個別ファイル実バイトSHAと監査JSON一致。
- 真CHASE 768×480 PNG：**516,379 bytes**、SHA256 **a62ced1d6fe80ea999683e5aac3f40fc023fb780fb4246ddf1c0939b1ada221d**。三者ではなくK4CL親（左）とK4CM R3（右）の比較PNG SHA256 **8c45825cef0d2239a933855ab0f1de855a8959b6c14d17c492c1b40113aaf77b**。
- 真K4CM R3：左連続海岸褶曲Mesh **1600頂点／2970面**、元海岸から最大高さ変位約10.289m。右港の約198m連続盛土 **737頂点／1320面**。実フェリー支柱へ物理的に接続する長さ**18.100m**、傾斜**2.18%**の歩行通路 **476頂点／366面**。既存の荷役ガントリー640頂点とフェリー屋根858頂点の研究Meshを**非破壊コピーで編集可能な2件**に再形状化。新研究Mesh計5件。
- 右港に変更された本物の画面領域 **2922画素**、左自然地質 **23364画素**、元Road5中央視界 **0画素差**。元Game/Road5全頂点面SHA、CHASEカメラ、木11・灯光、K4CL研究ロード、既存港元Meshと全Transform保護PASS、ゲームCollider追加0。
- 真正画像をこの引継ぎ作成時に直接開いて判断。褶曲によって左に高低差が出て、港のガントリーは以前の明るい黄・青緑から落ち着いた鋼色になった。しかし**前景の道路は相変わらず大きな単調面積**、岩と道路の関係は自然だが巨大世界の迫力不足、港の建築は現状なお小さく模型的、空中・湾岸の壮大さ、視線を導くコース体験、生活感と機能性が不十分。**独立TECH PASSだが正式ART REJECTを確定**（公式採用0件、DNA0m）。

### K4CMの失敗と修正履歴

- **R1 [#41989715487](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41989715487) FAILURE**：左褶曲・右土木・18.1m実接続は真Blenderレンダーまで実行。右港の新構造が既存建物に隠れ、右港画像差**85px**で固定最低**2400px**に不足。真画像を直接見て、意味ある可視構造へ主対象を変更。
- **R2 [#41990838846](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41990838846) FAILURE**：原本研究ガントリーと屋根を別Meshで作者修正し、右港差**2922px**と画像基準を満たした。だが歩行通路は**348ポリゴン**で独立品質条件**350面超**を満たさず安全停止。
- **R3 [#41991682479](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41991682479) SUCCESS**：既存デッキの下面を接続する実物横補強梁3本（追加18面）を追加し**366面**に改善。検査の閾値緩和、Game/物理、道路/Camera変更なく全真正QA完走。中間run #41990795105は旧HEADで**CANCELLED**、R3成功と取り違え禁止。

## 6. 全期間を通した主な反省点・今後禁止する失敗

1. **小さな改善を進捗の中心にしない**：1本の手すり、数枚の岩材、シェーダーのちょっとした彩度、CI1回SUCCESSといった進捗が実画面全体に効かなければ主工程としない。
2. **TECH品質とART品質を混同しない**：頂点数、ポリゴン数、画像差分、CRC、元Source保護のPASSは制作・検証の条件であり、世界水準の絵・面白いプレイ・ゲーム完成ではない。
3. **視界に実在しない形を作らない**：大きくても建物に隠れて画面に見えなければ効果ゼロ。スクリーン投影だけでなく実Blenderの遮蔽（ray_cast/元CHASE）を確認し、可視形状はゲーム世界として意味があること。
4. **安易に同じ見た目を量産しない**：三角風防・箱建築・巨大ドーム・殻・飾りだけのトラス、色違い低密度の地質などの失敗を再発しない。大きな地形と都市/港の用途、自然なシルエット、道路のスピード感の全体構図を作家設計する。
5. **物理的世界の矛盾を避ける**：岸壁や施設は実港に接続、歩行通路は実支柱まで達すること。描画だけの空中橋/入口なし建物/行き止まりはやめる。道路へのメッシュ侵入、遮蔽、木/ライトの変更を避ける。
6. **間違った安全ゲートの適用を避ける**：地形・港を変更する工程ならRoad5画面中央ピクセル0を守る。K4CLのように**研究用舗装の見た目を意図的に変える工程では道路画素差0を要求せず、元ゲームRoad5のジオメトリSHA/物理を厳格固定**する。テストを実際の意図と同時に定義。
7. **ゲーム完成までの道を短くする**：技術監査のための新工程、巨大ファイル配布、モデルを小刻みに替える、1工程ごとの「続けて」や数え切れない小QAを増やす運用は非効率。安全な研究ブランチで、できる限り**作者設計→真正生成→視覚評価→実検証→GitHub保存を1回で**実施する。
8. **GitHubが引き継ぎの正本**：手作業で長文を毎回貼り直す、毎回ZIPを添付する、ユーザーのPCで細かく操作させることは避ける。新チャットでGitHubの最新START_HEREとこの統合正本を読めば、手動添付なしで再開できるようにする。
9. **実ユーザー承認が必要な操作は例外**：本番公開・main/PR merge・Work/Computer Use開始・有料API・原本改変等は必ず個別承認。それ以外の隔離研究内の安全な修正・コミット・CIを細かくユーザー承認待ちにせず進める。

## 7. 現在の未解決課題と次工程（K4CNまたは全体構図再計画）

**K4CMで実証済み**：大きな左地質・右港建築の可視性、凍結した元道路・カメラ、実ポリゴン・真正Blender・ZIP全SHAとCI。これらのTECHをもう一度やり直さない。

**本当の未解決**：画面中央に大きすぎる単調な直線的路面、地質の平板さ、港が玩具や模型に見えること、街・湾岸の地理、進行方向のスケール、実走行の速さを感じるランドマーク/路肩の連続性、路面～港のリアリティ、ゲーム内での正式実装・人間の走行体験未評価。

**次にやる順番**：

1. 最新の研究HEAD/CI/Artifact/PRを照合し、K4CM真PNGを**直接開く**。K4CMはTECH PASS/ART REJECTという前提から出発し、旧K4CM R1/R2失敗を再試行しない。
2. **K4CNは小QAや目立たない小物ではなく、画面全体の構図を根本的に変える明確な大規模作者変更1件を優先**。元SOURCE Road5・Cameraは凍結したまま、実地形・港・ロードの意味ある遠近スケールを作る。具体的には、単なる直線道路+左右の単調壁から離れた、地質の層・港の働き・海の位置・高架走行路脇の見せ方を、実寸とSOURCEカメラの見え方を軸に設計する。**完成イメージが描けず可視性も弱い場合、小物増殖で妥協しない**。
3. 真Blender作者原本をK4CM保存版と別にし、複製研究Meshに限定した大規模改修を実行。元Road5/Camera・木・灯光・親MeshのSHAを保護。比較PNGを真CHASEで撮影し、A/Bなどの比較が画面改善に資するなら限定して実行する。
4. **真画像を直接開きART判断→独立検証→研究GitHub保存**。ART未達なら公式認定・本番統合をHOLDし、次の進め方を根本再検討。ゲーム全体の完成優先で長期のBlender試作ループを無限に続けない。
5. ART十分であれば次段階に移り、正式なゲームへの安全な候補統合・元真正WebGL2/Chromiumと240Hz走行・人間プレイ・SAT/CCD/FPS評価を**承認された適切な範囲**で進める。未承認のmain merge/本番公開はしない。
6. 他6道路への横展開/正式Slope2 DNA認定/公開は、1区間でARTと実プレイと物理が認定されるまで行わない。

## 8. 再開時の情報優先順位と正本リンク

1. [ルートSTART_HERE.md](../START_HERE.md)（最新TOP。下段の過去情報より優先）。
2. **この完全統合引き継ぎ正本**（安全・思想・工程・反省・未完）。
3. [K4CM工程文書](R19_A6P4_R2F5K4CM_INTEGRATED_COAST_PORT_ART_JA.md)と[直接ART比較PNG](research-evidence/k4cm/K4CM_VS_K4CL_TRUE_SOURCE_CHASE_WHOLE_FRAME_ART_REVIEW.png)・[監査JSON](research-evidence/k4cm/K4CM_REAL_NATIVE_AUDIT.json)。
4. K4CL、K4CK、K4CJ、K4CIの個別工程正本、根本SOURCE/長期憲章の文書。**PROJECT_STATE.md / DOPAGAKI_LIVE_HANDOFF.mdには古い「最新」が多数あるため、必ず最新のSTART_HEREと照合する。**
5. GitHub APIの研究ブランチ最新HEADと未完CI/Artifacts、main/公式P101/PR #46の実現状。HEADはこのドキュメントの保存で更新されるので、新チャット側で必ず読み直す。

## 9. 新チャット冒頭に貼る短い開始文

> DOPAGAKI SLOPE — HYPER RUSH の継続開発です。GitHubリポジトリ ryomashibaba/dopagaki-development-hub の研究ブランチ research/k4cm-integrated-coastal-road-port-20261105 にある START_HERE.md と docs/DOPAGAKI_COMPLETE_HANDOFF_K4CM_20261105_JA.md を全文読み、過去の最上位目標・方針・反省・R19/K4CI～K4CM実装成果・安全条件を完全継承してください。K4CM R3は Actions #41991682479 TECH PASS ですが、直接ART REJECT、正式ART採用0件・Slope2 DNA0mです。最新HEAD・CI・Artifacts・PR46を照合し、同じ小QAや見た目の弱い小物量産を繰り返さず、真正のBlender作者制作→実画像直接ART評価→独立検証→GitHub研究枝保存まで可能な限り進めてください。最優先は本当に遊んで面白い高品質高速3Dレーシングゲームの完成。main・元Road5/Camera/240Hz物理・Gold/原作Slope・公式P101・Draft PR#46・本番サイトを保護し、Work/Computer Use/追加課金・正式採用・merge・公開は事前承認としてください。私の操作は最小限にしてください。

---
**整合性の鉄則**：この文書は完成済みK4CM R3の事実と未完成ARTを両方引き継ぐ。「過去の調査を要約するだけ」ではなく、新しいチャットは**現在の安全な次工程で実制作を進める**。ただし完成・ART PASS・実プレイPASS・新しい権限付与は証拠なく宣言しない。
