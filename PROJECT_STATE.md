# G4E-7DW 完了 — 実B48道路端2016候補×元240Hz両道路6視点×56012三角・28動体の入口選定、低い2m案を実Blenderで検証（2026-10-27 JST）

**DW開発・本物CI**：[初期実装 69a580b](https://github.com/ryomashibaba/dopagaki-development-hub/commit/69a580b580ead8c933736b331228971be57136f7)、[精密候補計算 CI #40498009759](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40498009759) **SUCCESS**、[Artifact #12730883340](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40498009759/artifacts/12730883340) ダウンロード・実監査JSON照合。元B48実道路上面の左右エッジを7面×元サーフェスuの9地点（0.12～0.92）×左右2×道路外方向4距離（12/24/42/64m）×高低差4（2/6/13/24m）で**2016元B48路肩起点の単一ワールド候補**生成。元ゲームの両道路それぞれ15.5/16/16.5秒、合計**正規カメラ6視点**で18×19m門型の画角投影を計算。全6視点で門の各基準点が画角に収まる候補**518**。上位と多様性を含む72候補を元CX22920＋元B48実物理33092＝**56012三角形/道路**および各正規フレームの元B51動体28ヨー付きOBBで、入口4基準点×6視点の遮蔽と、元B48路面端から入口への仮中心線の静的三角形交差を検査。コード・専用テスト・ActionsすべてPASS。**18px幅/16px高＋全遮蔽なしの最初の形式的閾値を全部満たしたのは72候補中1つ**：`B481_U62_V0_O42_H24`。幅18.04679px、高さ36.10px（6視点の最小）、元路面端から42m・高低差24m、直結斜度**57.14%**なので美術・歩行アクセス案として採用不可。閾値達成と都市機能成立は別。

**重要な同一路面端・低高低差の近傍案**：候補 `B481_U62_V0_O42_H2` は元物理サーフェス `p93-CROWN_REVERSAL-01` の元座標**(-120.714631,86.161367,-516.410140)** から道路外側42m、仮入口元世界位置**(-79.390153,88.161367,-508.907639)**。6視点全4入口点とも元CX+B48+B51遮蔽なし、参考中心線元静的三角交差なし、門幅18m・高さ19mの画面最小幅**17.984224px**・最小高さ約**34.95px**、直線上昇は**2m/42m＝4.7619%**。先のH24案の最小幅18.046789pxと**約0.063pxしか差がない**。従来の閾値18pxを約0.016pxだけ下回るからと却下して高低差を24mへ増やすのは、測定値を形式的に最大化する過適合。H6案も元レイ通過、17.973px・高低差6m。画像や人間体験前の候補は**正式採用0**。

**DW真正Blender実3D検証**：[低位入口の実制作 a671f8ad](https://github.com/ryomashibaba/dopagaki-development-hub/commit/a671f8ad6bdca6d1a722bffde9c799f11e05c4a5)、[専用CI #40498941217](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40498941217) **SUCCESS**、[Artifact #12732252401](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40498941217/artifacts/12732252401) 本物ZIPダウンロード／構成・実画像を確認。**39ファイル、26本物Blender PNG（元DO10+元DR10+DW入口6）・6編集可能.blend・JSON診断データ**。元B48正規Tessellation×7、元B51動体28、元CX18オブジェクト、元240Hzカメラ5保持。DU/DVと違い、画面内に小さいながら入口の位置が追跡でき、15.5～16.5秒に自然に近づいて見える。同じ物理で2道路とも確認。門はあくまで光る**薄いQA輪郭4オブジェクト**で、駅・居住街路・歩行床は制作していない。ART PASSEDと誤称せず、**DW TECH PASS、ART HOLD／正式採用0**。

**限界と次DX**：実道路上面の数式境界点を支持起点にすることは「安全な路肩」「ゲーム内の歩行可能接続」「手すりと実道路の衝突分離」「新街区の完全な幾何遮蔽」が成立したことを意味しない。門が幅18pxで見えるとしても、観察画像では依然小さい単純な線だけ。次DXは1か所に絞り、元道路・B51のフェアな走行視認性を守りながら、**道路の動線を邪魔しない近景・公共空間の実世界断面**を具体化。再び装飾や独立した巨大壁を乱造せず、実際に門の向こうの生活と街路が見える小さな代表実3D空間をつくり、Blenderと真正ゲームWebGLで別途判定する。ただしDXでも安全な道路交通は新規ゲームコライダーなしに推測しない。

元CX保護blob `af076d67492a677d2235e4730aef8cdf4808e106`、B48×7/B51×28/gap52/240Hz/操作/カメラ/HUD/Gold/main/本番/公開URL無変更。PR #46 OPEN/Draft/未マージ。ART/HUMAN/READY/PUBLISH/MERGE HOLD、公式Slope2認定0m。

---

# G4E-7DV 完了 — DU公共駅入口と元B48実道路は不接続。実路面最近接調査・昇降機アクセス3D実制作 → ART REJECT（2026-10-27 JST）

**原DUの通視帯はアクセスできる床ではなかった。**  DU可視通路 `x=-65,y=95,z=-475～-355` の近接元B48物理上面を、真の `tessellate` 全三角形を走査する正確な最近接点計算で2道路×6地点検証。[初回実装 989ff54](https://github.com/ryomashibaba/dopagaki-development-hub/commit/989ff54be60870982a47e43b221488294caadb7d)、[専用CI #40494337294 SUCCESS](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40494337294)、[原始診断 Artifact #12729707311](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40494337294/artifacts/12729707311)。2道路同一の入口中央から最寄り真正B48元物理`p93-CROWN_REVERSAL-01`まで**3D直線64.525249m、水平63.441325m、高さ差11.777355m**。直線勾配**18.5642%**（歩行しやすい駅アクセスと認定不可）。入口左右端の最近距離58.94 / 70.16m、中間地点86.58m、120m遠端105.58m。入口および通路に既存の歩行可能な床は実証されていない。元DUで視線が通ったことと交通アクセスの成立は全く別。

**DV第二段階：PRIVATE未採用アクセス建築一案を実制作・正規視点で審査**。[新3D造形・専用CI実装 532a4da](https://github.com/ryomashibaba/dopagaki-development-hub/commit/532a4da56ab73ab9972704bb589651711d145cf0) を [CI #40495483037](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40495483037) **SUCCESS**まで実行。[Artifact #12730083322](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40495483037/artifacts/12730083322) 実ダウンロード・ZIP展開・2道路各3画像目視・監査を実施。ZIP**40ファイル＝元DO10/DR10/DV6枚の真正Blender PNG26枚＋編集可能.blend6個＋上記診断・監査**。元B48真の最近接点から高さ95mまでの**昇降機**、水平約63.44mの実立体**高架歩行デッキ**、幅広の本当の空気開口を持つ駅入口の**14個のPRIVATEメッシュオブジェクト**をBlenderだけに作成。元ゲームB48×7・B51×28・CX×18・オリジナル240Hzカメラ5台を保全。直接の18.6%スロープは赤い不適合参照線に留める。**既存ゲームの車線・路肩と安全に結ばれたわけではない**：道路の上面最近接点が車線中央か路肩かは未検証、元CX/B51との3D新メッシュ交差、構造支持・安全な歩行幅・操作・HUD・真正ゲームWebGL・人間試走すべて未検証。元ゲームへの新道路/コライダー0、B48 gap52も維持。

**最終美術評価：DVアクセス模型 ART REJECT／全体ART HOLD／正式採用0**。元DR対DVの同じBlender原240Hz 2道路×15.5/16/16.5秒6画像を並べて比較すると、デッキは小さな遠景の横棒、入口はごく小さな灯った四角い門にしか見えない。都市内部へ入る人や広場は理解できず、見た目の設計突破にはならない。画面上部55%で、元DRからDVへの各ピクセルRGB最大絶対差が70（8bit）超となる画素比はtrue-pinch**0.257/0.333/0.615%**、pinch-switch**0.283/0.396/0.765%**（順に15.5/16/16.5秒）。レンダノイズを含む単純差なので品質値ではないが画角上の小ささと整合。小型建築の細部を増やしてもこの視野では見えないため作らない。

**次DWの実質課題**：DU〜DVで視線/実道路隔たりを証明した結果、現在の候補街路はカメラから遠く、建築主役になるための投影サイズと実路肩アクセス条件が両立していない。むやみに巨大化・塔量産はDS/DTの失敗を再発させる。次は**原ゲームカメラを固定したまま、想定街路入口の正規スクリーン寸法（px）・周辺の真正物理路面への離隔・路肩の位置・既存B51との遮蔽を同時に測り、見えて安全に接続し得る新配置を先に探す**。候補入口の比較選定に留め、採択前の巨大造形生成/公開改造禁止。ゲームボールは道路を超えて街を実際に歩くプレイではないため、PRIVATE未来都市背景アートの歩行連絡路と、プレイヤーが走行で実際に通るB48物理ルートを明確に分離する。

PR #46 OPEN/Draft/未マージ、CX source blob `af076d67492a677d2235e4730aef8cdf4808e106`・B48×7/B51×28/gap52/240Hz/カメラ/元操作/HUD/Gold/main/本番URL不変。ART/HUMAN/READY/PUBLISH/MERGE HOLD、公式Slope2 0m。

---

# G4E-7DU 完了 — 元物理全56012三角/28動体×正規240Hz 通視ゲート、Blender実6比較画像 PASS（2026-10-27 JST）

**前DTのART REJECTを維持し、新都市造形0件**。今回の対象は従来の「駅入口がカメラ視野に入る＝見える」という誤検証を根絶すること。 [実装 e38ff5bacf0c3b613d08459d191e17ebda9d9b20](https://github.com/ryomashibaba/dopagaki-development-hub/commit/e38ff5bacf0c3b613d08459d191e17ebda9d9b20) にて、元CX建築**22920三角形**＋元B48物理**33092三角形**＝**合計56012元三角形**への正確な3D線分交差と、各元240Hzフレームの**B51動体28個のヨーつき衝突OBB**に対する線分交差をPRIVATE導入。元ゲーム物理/カメラ/速度/操作/HUD/GLB/Gold/main/publicを変更しない。

**根拠を伴う新しい通視帯**：元世界絶対座標 **x=-65, y=95, z=-475～-355**、長さ120m×幅12m。原正規ゲームP96 start00スクリプト（**人間プレイではない**）の2道路×3時点（15.5/16/16.5秒）×左右端・中心の3列×13地点＝**234本**の線分全てが、元56012三角/B51全28衝突箱に遮蔽されず、両道路とも画角内。元三角形への経路中心/左右端の36線分/道路にも交差なし。**ただしこの結果は実際に道路から入れる歩行路・床材の支持・人間公平性・完全な３D建築の遮蔽不在ではない**。元の盲目駅入口 `[-18,90,-440]` を負対照で採用し、現実の元CX等に遮蔽される時刻はtrue-pinch **1/3**、pinch-switch **3/3**と検出。「中央に建物が映るだけ」では内部空間に入れるとは言えない。

[専用 CI #40487969893](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40487969893) **SUCCESS**。 [証拠 Artifact #12725892248](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40487969893/artifacts/12725892248) 実ダウンロード・ZIP構造/監査JSON/実画像目視を確認。合計**44ファイル**：真正Blenderレンダー**26PNG**（DO元景観10＋DR実道路/障害物10＋DU診断6）、編集可能.blend６個（各道路DO/DR/DU）・プランJSON２・物理データ等。実B48７・B51 28・元CX18・元カメラ５を維持、都市美術**新規0**、追加ゲームコライダー0。DU新規オブジェクトは**16個の診断マーカー**のみ。スクリーンの3門型は元CXの間、道路遠方に小さく見える。**現状では都市としての強い視覚的魅力・接近して入れる機能が全く成立しないため美術の採択をしない**。Blenderは元ゲームWebGLの外観と物理・人間プレイの証拠ではない。

**次DVの限定工程**：この通視帯を新しい巨大壁で覆わず、人が分かる駅への入口/公共空間の**横方向の寸法・手前の路肩からの交通接続・画面上の最低限の視認寸法**を検証。追加する造形は通視ゲートを通った後に限る。将来形が増えればDUの正確なレイ交差検査へその造形三角形を必ず入れ、修正前の元カメラ×３時点を維持する。未確認の路面導線や衝突公平性を「接続した」と言い換えない。PR#46 OPEN/Draft未マージ、正式都市美術採用0、ART/HUMAN/READY/PUBLISH/MERGE HOLD、認定Slope2 0m。

---

# G4E-7DT 完了 — 3居住断崖・29巨大部材 / 正規240Hz・実道路＋28動体Blender実画角 ART REJECT（2026-10-27 JST）

[PRIVATE新造形コミット db98d221](https://github.com/ryomashibaba/dopagaki-development-hub/commit/db98d2219769dfbcf970a4a15c0110d5f900b0e6) を実制作・検証。[専用 GitHub CI #40481138606](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40481138606) **SUCCESS**、[証拠Artifact #12723012609](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40481138606/artifacts/12723012609)。このArtifact実物ZIPをダウンロード・解凍・画像目視・監査JSON確認し**44ファイル：真正Blenderレンダー26PNG（DO原景観10＋DR実走路・障害物10＋DT新造形6）、.blend６個（DO/DR/DT各2道路）、実B48物理バイナリ・監査**を確認。元CX18メッシュ・元B48実物理7面・元B51移動OBB28個・元ゲームカメラ５台の証拠は不変、新規ゲームコライダー0。DT造形は計29メッシュ（実基壇から立つ地形的居住断崖18、広い公共テラス6、峡谷広場3、太い交通接続2）。窓・柱の大量反復を中止。一次造形候補1つ、2道路×15.5/16/16.5秒で評価。予定どおりCIは Blender実レンダーであり、元ゲームWebGLを再現したものではなくプレイヤー操作やFPSの認定もない。

**DT ART REJECT／正式都市美術採用０件**。2道路の同フレーム比較では、確かに15.5～16.5秒の中央都市的空白が減り、DSで問題だった細い柱に浮かぶ棟の集合は解消された。しかし新巨大造形は角張った基壇・塔状の壁として見え、内側実開口12ヶ所・6枚のテラス・広場は走行カメラからほとんど判読不能。16.5秒で左中景の巨大壁が画面の多くを占め、奥の元CXクレセントと街路の一体感を阻害。**29部材に減らしても、その配置に建築の人間的体験が現れなければただの巨大彫刻・背景壁になる**。このまま細密装飾しても改善の根拠がない。実画像はパネル毎に DR基準上、DT下で確認。

参考定量QA：真の元ゲームではなく同一条件のBlender画像DR/DTで、各RGBチャンネル絶対差の最大値が45（8bit）を超える画素割合を算出。画面上部53%の変化率はtrue-pinchで15.5/16/16.5秒**18.7/26.8/38.7%**、pinch-switchで**20.6/31.0/40.3%**。比較はレンダリングノイズや照明/遮蔽の影響を含む単純差であり、美術価値や安全性の評価値ではない。画角占有量が大きくなるほど構図悪化のリスクを示唆する定性的な補助としてのみ使う。

**次DUで設計方法を根本変更**：DPは薄い巨大リボン、DQは詳細資産が元クレセントと重複、DSは反復高層キオスク、DTは重量感のある巨大壁。多量装飾→少数大形状の双方が不採用なので、このままパラメトリック形状を変えた工程を無限に繰り返さない。次は実B48/B51カメラの**画面内で、街路への入口・背後の街区・横断連絡・公共生活が視認できる視線を先に設計**し、レンダ前に画角をブロッキングして前景・中景・遠景のレイヤーと遮蔽率を調べる。大形状の実幾何を増やすより、元の中央空白から左右の既存クレセントへつながる「通り」を可視化することが優先。元ブロック数などを品質指標にしない。人間に理解される美術・交通の方向性が成立するまで game GLB/本番統合禁止。DTモデルはPRIVATE研究候補のまま。

元CX blob `af076d67492a677d2235e4730aef8cdf4808e106`・B48×7/B51×28/ギャップ52/240Hz/操作/カメラ/HUD/Gold/main/公開URLに変更なし。PR#46 OPEN/Draft未マージ、ART/HUMAN/READY/PUBLISH/MERGE HOLD、公式Slope2認定0m。

---

# G4E-7DS 完了 — 正規実道路・全28動体の本物Blender都市画像30枚比較 / MERIDIAN FIVE ART REJECT（2026-10-27 JST）

[DS PRIVATE本造形コミット 63174d65](https://github.com/ryomashibaba/dopagaki-development-hub/commit/63174d65a128cde6d4088442c56a3743a02e894a) を実際にGitHub Actionsで [専用CI #40471912619](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40471912619) **SUCCESS**まで実施。[実本物Blender成果物 Artifact #12719920620](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40471912619/artifacts/12719920620)をダウンロード・ZIP展開・画像表示・監査JSON照合した。**48ファイル、真正Blender PNG30枚（元DO10＋実B48/B51 DR10＋新DS10）、編集可能.blend6個（各道路DO/DR/DS）、プラン・元B48 f64道路バイナリ・監査データ**。DS 2道路各709新都市オブジェクト、居住床80、実3D開口35、道路7物理面・全28動体・元CX18ソース・元カメラ5枚保持、正式ゲームコライダー追加0。元CX blob `af076d67492a677d2235e4730aef8cdf4808e106` 不変。5街区の中心は両道路で同じ世界位置、元B48全7道路のガイドから「街区半径+30m」以上離れ、すべての正規15/15.5/16/16.5/17秒視野内に基準点あり。ただしガイド離隔は全三角形との衝突不在保証ではなく、基準点が見えることと建築が見えることは異なる。

**本物Blender比較の美術判定：ART REJECT（正式採用０件）**。15.5〜16.5秒前方の街区密度はDRより増すが、同型の細い縦棟・高層キオスク群が反復し、下部に細い支柱が垂れる「浮いた施設」に見える。新居住階80や内部開口35は本当の3Dとして存在するが、実走行カメラからは公共生活・移動導線として読めず、単に形の密度が増えただけである。過去の箱ビル列・孤立オブジェクト失敗の再発。右側元CXクレセントとの都市設計的つながりも不十分。**数値やCI成功を美術成功と混同しない**。DSはアート移植しない。元ゲーム真正WebGL/HUMANプレイ未実施。元レンダラ、動体のビジュアルモデル、HUD、霧などはBlenderレビュー画像と非同一。画像差分は美術品質や公平性の証明ではない。

**次工程DTを設計し直す**。次は自動生成で数百の窓・棒・反復するフロアを作らない。必要な工程は、実道路＋正規カメラのまま**15.5 / 16.0 / 16.5秒の３画角だけに焦点を絞った**一次形状・大きな街路空間・非対称の住居群・巨大空隙・駅機能・人間スケールの構図研究。まずごく少数の一体造形メッシュ／空間を使って「連続する未来都市として魅力的か」を目視で通す。形が未成立なら細部装飾・オブジェクト709個生成・ゲーム統合へ進まない。高層キオスク、棒、板、巨大一発モニュメント、同形反復を明示禁止。現Blender制作基盤は技術PASSなので使い続けるが、ARTは何度でも厳格REJECTする。

PR #46 OPEN/Draft/未マージ、main/Gold/public/本番・元B48×7/B51×28/gap52/240Hz/操作/カメラ/自然ジャンプ/HUDに無変更。ART/HUMAN/READY/PUBLISH/MERGE HOLD、公式Slope2認定0m。

---

# G4E-7DR 完了 — 元ゲーム実B48×7/B51×28/240Hz可視審査Blender基盤 PASS・ART採択0（2026-10-27 JST）

[PRIVATE実装 db6b301f](https://github.com/ryomashibaba/dopagaki-development-hub/commit/db6b301f4daf2b549b100f3aa1d9c25bdc0227ff)、[Blender float32表現と元f64座標の丸め誤差監査修正 fe1f5575](https://github.com/ryomashibaba/dopagaki-development-hub/commit/fe1f5575bd00849e1a06aef6a7d2cd5141cdf7ac)、[最終専用CI #40469650772](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40469650772) **SUCCESS**、[全証拠Artifact #12717668295](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40469650772/artifacts/12717668295)。ZIPを実ダウンロード・展開して**32ファイル＝20PNG / 4.blend / 実道路f64バイナリ2個 / 物理監査2個 / オリジナルメタJSON2個 / DOカメラ監査2個**を確認。両道路の監査JSONで元B48物理サーフェス7・元B51動体28・元CX18ソース・全5元カメラ・真のギャップ52・物理変更なしを確認した。各道路の元B48の上面/裏面/側壁/切断面を合わせた合計**33,092三角形**を実Blenderにロード。元stageソースから生成したfloat64位置＋uint32索引のバイナリを SHA-256 証明。先頭roadのcell52は実走路TOP三角形0枚、51・53は存在。動体28全ての中心／回転／半寸法は元ゲーム`movingObstaclePose`で、同じ非人間P96 start00 240Hz shot.tick×DTの15/15.5/16/16.5/17秒で証明。Blenderの位置/キーフレームは内部float32の表現限界があり、**元f64→Blender f32最大丸め差 true-pinch=0.0000533643m、pinch-switch=0.0000595087m**。元64bitバイナリは無損失で保存し、Blender各時刻の位置はそのf32に一致することを自動検査。物理を捏造するための許容幅緩和は禁止。

初回[CI #40469220277](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40469220277) は元ゲーム物理抽出テストPASS、Blenderでfloat64との直比較をしたためfalse-failure。元座標のf32量子化チェックに正しく置換して再実行しSUCCESS。元ゲームレンダラ・道路/動体材質は**再現していない**。28個はcollision OBBの正確な形状・位置であり、障害物本来のアート外観ではない。プレイヤーボール・HUD/スコア・霧・高速演出も未再現。**Blender画像を真正ゲームWebGLと呼ばない**。元ゲーム主役CX形状は元blob `af076d67492a677d2235e4730aef8cdf4808e106` 不変、camもDOに合わせて不変。

**美術面の実画像判定**：元CXのみのBlender10画角と、新たに元道路・衝突動体を入れた10画角を目視。15〜17秒の手前画面は実際には巨大な物理道路面で占有され、旧DOの線ガイドのみの画面とは印象が大幅に異なる。道路中央の前方都市核が小さいまま、旧左クレセントが15.5〜16秒で退場する問題は一切解決していない。DR自体は新美術造形0なのでART PASS/REJECTではなく、**技術的な制作審査基盤のPASS／正式都市美術採択0件・総合ART HOLD**。数値や差分を美しさの評価点と呼ばない。次DSは、この実道路面＋全動体のPRIVATE参照シーンを設計の基準にして、正面15.5〜16.5秒の都市連続性を優先。建物の乱造や単一巨大アーチ・棚・リボンの再挑戦は禁止。最終審査には真正ゲームWebGLと人間操作性検証を別途要求。

B48×7/B51×28/gap52/240Hz/元操作/カメラ/HUD/Gold/main/publicとproduction URLsは変更なし、PR #46 OPEN/Draft/未マージ、ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2 0m。

---

# G4E-7DQ 最終実制作検証 — 既存BW R3細密3Dの実240Hzカメラ配置、ART REJECT（2026-10-27 JST）

[実装コミット abb81f8](https://github.com/ryomashibaba/dopagaki-development-hub/commit/abb81f8d5d9e8e2995f1d39164143c4effec7ae3) を [専用CI #40454837621](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40454837621) で実行し**SUCCESS**。真正Blenderの２道路×CX/DQ×15.0/15.5/16.0/16.5/17.0秒=**20PNG**、編集可能.blend４個（DO参照２・DQ候補２）、基準カメラ・DQ監査を含む [Artifact #12712420146](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40454837621/artifacts/12712420146) を実際にダウンロード、ZIPを展開して画像・監査JSONの存在を確認。BW R3元Blenderオブジェクト**1,493**を実座標へ読み込み、元CX**18**ソース／**22,920**三角形を保全、２道路とも元ゲーム240Hzカメラ５台。座標は元Blender Z-UP→ゲームY-UPを正確に変換。基準DOカメラ投影誤差最大約2.70435e-7。新しい道路・動体・コライダーは0、元物理不変更。

**実画像目視：DQ ART REJECT／正式採用０件**。DPの大きな板状屋根は消え、既存右クレセントに窓・階層・照明のような細部が現れる。しかし詳細BW R3が主に既存右側主役の視界位置に重なるため、15.5〜16.5秒の真正構図でプレイヤー前方の都市空白や機能的な公共動線は埋まらない。細部1,493個追加と都市の連続性改善は別問題である。真正ゲームWebGLの比較は**未実施**（低評価の候補を移植せず早期REJECT）。

**根本改善方針／次DR**：細密度／新形状を追加する前に正規道路・障害物と都市を同じ実3D舞台で評価する。現DO/DP/DQのBlender参照マスターは本物のB48走路を示す「７×３の非物理ガイド曲線」を置くのみで、**実ゲームと同じ道路三角形・動体28・道路材質・車体周辺のゲーム光学・描画状態を再現していない**。都市体験を判定するならまず重要な実走路・障害物がアート審査画面に含まれる必要がある。DRは変わらない元B48曲面の参照レンダーメッシュと指定時刻の実動体姿勢を読み取り、Blenderへ可視化するPRIVATE QA基盤へ焦点を絞る。ロード・コライダーを新規生成しない。Game WebGLとBlenderではレンダラが異なるため、最後は元ゲーム真正WebGL＋人間操作試験が必須。これが整う前の孤立した巨大物や規則的箱の再生成はしない。

[前DP CI #40447458670](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40447458670) は技術SUCCESSでもART REJECT済み。DO編集可能Blenderマスターは技術的に完成。main/Gold/本番/public・元B48×7/B51×28/gap52/240Hz/操作/カメラ/自然ジャンプに変更なし。元CX Git blob `af076d67492a677d2235e4730aef8cdf4808e106` 固定。PR#46 OPEN/Draft/unmerged、ART/HUMAN/READY/PUBLISH/MERGE HOLD、公式Slope2認定0m。

---

# G4E-7DQ 開始 — DP実画像を正式ART REJECT、既存本格Blender資産の元カメラ再配置を限定検証（2026-10-27 JST）

**DP最終審査**： [CI #40447458670](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40447458670) **SUCCESS**、[真正Blender画像20枚＋.blend4個 Artifact #12710006367](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40447458670/artifacts/12710006367)取得・目視。元DOとDPを２道路×5時点で比較すると、**DPの新造形は長い薄い屋根・空中の板・波状リボンにしか見えない**。特に16.5〜17秒に画面上部を占有、住民利用の内部・移動交通路が読めず、旧クレセントと遠景の機能的接続が改善しない。**DP ART REJECT／正式採用0**。検証はBlender参照画像であって真正ゲームWebGLではない。Blenderで門前払いできたため、低品質なDPをゲーム本体へ移植しない。

**DQ**：技術基盤DOで正規240Hzカメラを一致させたうえで、以前実Blender制作済みBW R3の**本当の階層・入口・内部交通を持つ細密3D元資産**がどう見えるかを世界座標で検証する。BW R3自体も正式美術採用0の研究資産。DQは新しい棒・箱・板を乱造せず、既存1案の再配置可否を先に判定。2道路×15〜17秒=10真正Blender比較画角を生成するPRIVATEスクリプトとCI。BWはBlender Z-up、ゲームY-upとして座標系を明確に変換する。正規カメラに映る位置でも、美術成功を主張しない。BW形状が孤立した神殿になり都市にならなければ即ART REJECT。GLB移植、ゲーム描画変更、物理変更なし。元CX blob `af076d67492a677d2235e4730aef8cdf4808e106` 固定。

PR #46 OPEN/Draft/未マージ、B48×7/B51×28/gap52/240Hz/元カメラ/操作/main/Gold/public変更禁止。ART/HUMAN/READY/PUBLISH/MERGE HOLD、Slope2公式認定0m。

---

# G4E-7DP 進行中 — 正規カメラ実証マスターの完成とSKYRIFT QUARTER PRIVATE一案制作（2026-10-27 JST）

[DO正式な技術CI #40446863995](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40446863995) は **SUCCESS**。 [Artifact #12708956774](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40446863995/artifacts/12708956774) をダウンロードし、**実編集可能.blend２個＋Blender正規視点PNG10枚＋カメラ検証JSON２個**をZIP内で確認。２道路ともCX元三角形22,920枚、ソース18個、元CX頂点SHA一致。Blender投影誤差は最大約2.70435e-7（正規化座標）。これは**Blenderの実参照レンダー**であり、元ゲーム真正WebGL/PBR/物理プレイを再現した証拠ではない。DOでついにBlender制作マスター基盤だけは技術的に成立。**都市美術採択0件**。

DP [PRIVATE実装 f2683bdd](https://github.com/ryomashibaba/dopagaki-development-hub/commit/f2683bddcb31669ad0e0d0a8a1f0202c51b75ab1) は《SKYRIFT QUARTER》の**単一共通世界**Blender造形試作。道路1の路肩から離れたstationインデックス30.5–42.7、曲面の居住断層２本・開放的な交通渓谷・接続する公共デッキ・少数の暖色/寒色居住帯を元CXそのままの編集可能な3D都市に重ねる。過去の箱・棒・孤立アーチ案の反復を避ける意図だが、**画面上で魅力的に見えることは未実証**。実世界配置の視野テスト（2道路×5時刻×5選定参照点）・Node保護テスト・Python形式チェックは [専用CI #40447458670](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40447458670) の第一段階で **PASS**。CIはこの文書記録時点でBlender導入中で、完成したDP Blenderの画像20枚・候補.blend２個・目視評価は**未確認**。CIが終わる前にART PASS/REJECTどちらも捏造しない。参照道路はDOの非物理ガイドであり、最終物理道路／動体をレンダーしていない。今後の承認には本物のゲームWebGLとプレイヤー公平性の実証が別途必要。

全変更は研究ブランチPRIVATEのみ、元B48道路７/B51動体28/gap52/240Hz/カメラ/操作/自然ジャンプ/HUD/Gold/main/本番を変更せず。元CX blob `af076d67492a677d2235e4730aef8cdf4808e106` に保護チェック。PR #46 OPEN/Draft/未マージ、ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2 0m。次の作業はDP CIの成否・成果物を実物確認し、10正規カメラの純Blender候補実画像を目視で採否判定すること。

---

# G4E-7DO 継続中：実240Hzカメラ→編集可能Blenderマスター初回生成、レンダーCIは未完了（2026-10-27 JST）

**完成認定はしない。** PRIVATE限定で、Blenderによる都市美術の本設計へ移るため、元CX景観の正確な三角形と２道路×15〜17秒の正規ゲーム240Hzカメラを完全一致のまま書き出す制作基盤を開発。[実装コミット 4453c2da](https://github.com/ryomashibaba/dopagaki-development-hub/commit/4453c2da7c10457eb04b700f5e14a969209f4e96)、[CLI修正 0a89f1f8](https://github.com/ryomashibaba/dopagaki-development-hub/commit/0a89f1f81daedae5e5ac1f4797ac3c2c96042238)、[重複240Hz演算の削減 9f86b90f](https://github.com/ryomashibaba/dopagaki-development-hub/commit/9f86b90feac5b2587ab96723897ce69365c4bfd5)、[Blenderカメラ行列更新 7573dde5](https://github.com/ryomashibaba/dopagaki-development-hub/commit/7573dde590d032920615edc40e7698dc859fa2ad)、[ヘッドレスCycles CPU修正 db945742](https://github.com/ryomashibaba/dopagaki-development-hub/commit/db945742125992605ab6a4e4dbb3ff3c395a2516)。

**検証済**：Node側元CX blob `af076d67492a677d2235e4730aef8cdf4808e106`完全一致、240Hzカメラ/ジオメトリ書き出し、B48道路7/動体28/gap52保護単体テスト成功。GitHub [CI #40442610016](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40442610016) ではBlender 4.0.2起動→カメラ投影チェックを通過し、**true-pinch用実Blender編集可能 .blend（約3.26MB）** を書き出し、[部分証拠 Artifact #12707061511](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40442610016/artifacts/12707061511) に保存。Eeveeレンダー時の `libEGL.so.1` 不在で**CI FAILURE**、Blender 10PNGは未実現、pinch-switch .blendも未保存。画像・美術認定は不可。

**最新版 [Cycles CPU CI #40442938522](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40442938522)**：ヘッドレス環境でEGL不要のCyclesレンダーへ切替。**この文書更新時点では結果未確定**。CIがSUCCESSになるまでは２道路×5真正Blender画像や双方の.blend完成を主張しない。※ Blender参照レンダーは本物のゲームWebGL framebufferではない。カメラの投影は照合可能でもゲームのシェーダ/FPS/フェアネスを保証しない。

**なぜこの方式か**：BW/BX既存大規模Blender/GLBは世界配置/node transform/ゲーム実視野未立証、BK限定GLBパーサーは汎用GLBを読めない。旧ART REJECTモデルを無検証で公開レンダへ持ち込まず、まず正規実道路・元CX・元カメラが重なる編集可能な制作マスターを作る。**DOは新都市候補0件／ART採用0件、元物理・コントロール・カメラ・main/Gold/public build非変更**。PR #46 OPEN/Draft未マージ、ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m。

---

# G4E-7DN 完了 — NEGATIVE-SPACE真正WebGL30枚、構図仮説不成立 / ART REJECT（2026-10-27 JST）

[DN PRIVATE実装 4461a318](https://github.com/ryomashibaba/dopagaki-development-hub/commit/4461a31889a3e0e8e0c900f59c9531c18e1781fa)、[証拠保存修正 53691337](https://github.com/ryomashibaba/dopagaki-development-hub/commit/536913370da7c85e6c0362978872db862ffffd86)、[最終真正WebGL CI #40436641309](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40436641309) **SUCCESS**、[本物の30枚・監査JSON Artifact #12703663917](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40436641309/artifacts/12703663917)（7日retention）、[独立物理 #40436070565](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40436070565) **2 jobs SUCCESS**。初回CI #40436070653はWebGL技術PASSだがArtifactアップロードのパスが誤っており証拠0（結果採用不可）、次コミットで修正し再撮影した。

**新建築0個・追加三角形0枚**。PRIVATE差替えだけで、元CX、CX主役2基、道路7面、動体28個、gap52、240Hz、ボール相対カメラ、自然ジャンプ、操作、shared build/main/Gold/本番に変更なし。正規２道路×15/15.5/16/16.5/17秒×CX/UNROOF/REVEAL=30枚撮影。CX元DJ PNG SHA **10/10完全一致**、同じカメラ・時刻・速度比較20対を検証。

- **UNROOF**：画素差合計10/10で **0.0000%**。この5時点では遠景折屋根の除去は最終描画に可視の変化をもたらさず、主要な断絶原因とする根拠がない（他物体への遮蔽・画角外など原因は未特定）。
- **REVEAL**：近景station2左公共歩道１ソースをさらに外した変化率はtrue-pinchの15→17秒順で **0.0814/0.1115/0.2073/0.5343/2.0718%**、pinch-switchで **0.0912/0.1378/0.2593/0.7695/1.8742%**。17秒の数％弱の差は実表示確認できたが、主役〜街区間の連続性や大きな内部空間は改善しない。
- 30枚をモンタージュにして人間目視。左既存クレセントは15.5秒で画角から退場、次の主役はまだ小さく、道路の占有感が強い。削除だけでは都市の内部生活・一体化した交通・中景から遠景への都市構造は出現しない。REVEALは公共歩道自体を取り去る診断であり完成景観として不適格。

**DNのアブレーションを正式美術としてART REJECT**。ただし原因切り分けの技術研究としては真正CI PASS。pixel delta≠美術改善、スクリーンショット≠人間操作性/FPS。次DOは「巨大モノリス増設」「規則的箱の再配置」「見えない屋根の微調整」を中止し、**世界の都市核・居住・交通が同じ造形言語で連なる単一の街づくりマスター構成**を先に設計。Blender/GLB等を利用するなら実視点に沿った都市断面・素材・実内部を全景として制作し、前景・中景・遠景が15〜17秒で機能的に連なることを証拠にする。まず絵になる都市の統合構図、次に実装／計測。正式美術採用0件、ART/HUMAN/READY/PUBLISH/MERGE HOLD、Slope2認定0m、PR #46 OPEN/Draft未マージ。

---

# G4E-7DM 完了：LIVING CONFLUENCE → **早期ART REJECT／真正WebGL CI FAIL**（2026-10-27 JST）

[PRIVATE実装 1d3a485e](https://github.com/ryomashibaba/dopagaki-development-hub/commit/1d3a485e7ec92a31fe82f7f6df85e1de7c0b6f6b)、[DM専用CI #40433597701](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40433597701) **FAILURE**、[不完全証拠Artifact #12702903731](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40433597701/artifacts/12702903731) 7枚（true-pinch 14.5/15/15.5秒各CX/DM、16秒CXだけ）、[独立物理 #40433597503](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40433597503) B5/A13 **2 jobs SUCCESS**。CX旧SHA 3/3一致後、16秒の元CX出力が旧画像と2画素±1 RGBで異なり strict SHA checkが停止。両道路24枚は未達、ハッシュゲートは緩めない。真正画像で新住区は単純な白い箱ビル列に見え、DGを再発。**DM ART REJECT／正式採用0**。不採用の早期確定につき完成24枚の再撮影や微調整はせず、失敗資料として凍結。次DNでは建築物追加より**連続視点の都市的構成と本物の内部の造形言語**を先に検討。[DM最終QA](docs/G4E7DM_LIVING_CONFLUENCE_PRIVATE_STUDY_JA.md)。元CX blob `af076d67492a677d2235e4730aef8cdf4808e106`、B48×7/B51×28/gap52/240Hz/カメラ/入力/main/Gold/本番不変更。PR #46 Draft未マージ、ART/HUMAN/READY/PUBLISH/MERGE HOLD、Slope2正式0m。

---

# G4E-7DL 完了：APERTURE CITY / 真正WebGL 24画角検証 — **ART REJECT**（2026-10-27 JST）

[PRIVATE実装 a5f14fe7](https://github.com/ryomashibaba/dopagaki-development-hub/commit/a5f14fe7022d9e6e09c78f75a379d1b034d20926)、[DL真正WebGL #40430724416](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40430724416) SUCCESS、[独立物理 #40430724261](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40430724261) **2 jobs SUCCESS**、[証拠Artifact #12702566144](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40430724416/artifacts/12702566144)。前DKの薄板・柱と遮蔽問題を改善するため、GLB既存基盤を調査しつつ無意味なレンダラ置換は避け、単一の厚い曲面大開口と奥に６個の実3D居住・交通区画を持つPRIVATE候補を制作。元２道路の正規カメラ５時点で10候補を比較して固定した世界座標に配置。2道路×6時刻×CX/DL=**24枚の本物の元ゲームWebGL**を取得し、元DJのCX12PNG SHA-256 **12/12完全一致**、ペア時刻/速度/カメラ一致。

しかし実画像では「巨大アーチの背後に小さな棚」でしかなく、公共都市の内部空間・街区・交通の一体感は生まれず、15.5〜16.5秒の構図断絶が継続。**DL ART REJECT／正式美術採用0件**。DLは凍結されたPRIVATE研究として保存。技術成功は美術成功・人間の公平性・FPSを保証しない。次は巨大な孤立形状の反復をやめ、15→17秒に同じ都市公共動線と居住の奥行きが読める連続画角の証拠を先に設計する。[詳細DL最終QA](docs/G4E7DL_APERTURE_CITY_PRIVATE_STUDY_JA.md)。CX blob `af076d67492a677d2235e4730aef8cdf4808e106`、B48×7/B51×28/gap52/240Hz/カメラ/操作/main/Gold/本番非変更。PR #46 OPEN/Draft未マージ、ART/HUMAN/READY/PUBLISH/MERGE HOLD、公式Slope2 0m。

---

# G4E-7DK 完了：CIVIC ESTUARYを真正240Hz 12対WebGLでART REJECT（2026-10-27 JST）

実装 [c3d5f0c8](https://github.com/ryomashibaba/dopagaki-development-hub/commit/c3d5f0c8a0c99d65738e579c4f6013e4cab59955)、[真正WebGL CI #40428018396](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40428018396) SUCCESS、[独立物理 #40428017965](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40428017965) SUCCESS、[証拠Artifact #12701191210](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40428018396/artifacts/12701191210)。DJで確認した15.5〜16.5秒の都市の断絶を、湾岸都市のひとつの母体で埋める狙いのPRIVATE実3D。2道路×14.5/15/15.5/16/16.5/17秒×CX/DK=24真正WebGL画面、カメラ・速度・日時が厳格一致。原CX12PNGはDJ真正WebGL12/12 SHA-256完全一致、元CX generator Git blob `af076d67492a677d2235e4730aef8cdf4808e106`不変。15.5→16.5秒では新規画面差が3.79→6.97%（true-pinch）、4.26→7.26%（pinch-switch）まで増加。ただし実画像は湾岸の住区・公共空洞ではなく、**巨大な縦の柱や薄い板**に見え、従来のDB棒／DA壁／クリップ失敗を再発。**DK個別ART REJECT、正式美術採用0件**。画素変化は美術成功・プレイ公平性の証明ではない。

次工程では大型建築を増やすことで中間画面を埋める方式を中止。正規視点で広大な内部／住区／交通が読み取れる構図を先に証明し、可視の都市体験と美術品位が成り立つ仮説だけを一案ずつPRIVATEで実制作。詳細は [DK専用QA](docs/G4E7DK_CIVIC_ESTUARY_TRUE_WEBGL_ART_REJECT_JA.md)。B48×7/B51-C×28/gap52/240Hz/カメラ/操作/スコア/main/Gold/本番不変更、PR #46 Draft未マージ、ART/HUMAN/READY/PUBLISH/MERGE HOLD、Slope2認定0m。

---

# G4E-7DJ 完了：正規240Hzの20実WebGL画角で15.5〜16.5秒の都市構図断絶を特定（2026-10-27 JST）

実装 [830ed1e8](https://github.com/ryomashibaba/dopagaki-development-hub/commit/830ed1e8ab76e18efa7b6a1845bef7cb83b6489e)＋専用ガード修正 [607030c](https://github.com/ryomashibaba/dopagaki-development-hub/commit/607030cc2ed5012218128ff13aa04955a0ca6d04)。[専用CI #40417051913](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40417051913) SUCCESS、[真正WebGL Artifact #12694559525](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40417051913/artifacts/12694559525)＝2道路×14〜18.5秒0.5秒刻み20PNG。元BGの15/17/18.5秒240HzカメラスナップショットはdeepEqual、前DIの正式CX 6PNGとのSHA-256は6/6完全一致（カメラ・CX画面改変なし）。新しい美術案を乱造せず、通常ゲーム外PRIVATE Playwrightの追加フレーム許可だけで実カメラ時系列を制作。**15.5秒に左巨大主役が裁断され16.0秒でほぼ消える一方、前方都市が小さいため、15.5〜16.5秒に都市の壮大さが途切れる根本問題が判明**。16.5〜17秒も街区・公共施設・主役が一体の都市として読めない。17.5秒以降の異常な走路構図および18.5秒off-roadは正式走行公平性として認定しない。

次DKは**その中間区間に現れる、都市の大きな輪郭・内部公共空洞・居住階層の同時構図**を一案だけPRIVATE実3D制作。単純な巨壁・棚・棒・箱・埋め込み・遠景追加の反復禁止。DJは美術案を新たに作っていないのでART正式採用0件、過去DI ART REJECT維持。[DJ詳細QA](docs/G4E7DJ_TRUE_NATIVE_SEQUENCE_QA_JA.md)に証拠・失敗・次工程の構図制約を記録。CX blob `af076d67492a677d2235e4730aef8cdf4808e106`、B48×7/B51-C×28/gap52/240Hz/カメラ/入力/main/Gold/本番変更なし、PR #46 Draft未マージ、ART/HUMAN/READY/PUBLISH/MERGE HOLD、Slope2正式0m。

---

# G4E-7DI 完了：SKY FJORD PRIVATE真正WebGL / ART REJECT（2026-10-27 JST）

実装 [c24f9ea7](https://github.com/ryomashibaba/dopagaki-development-hub/commit/c24f9ea7ae8f59094de44fb6c068a532c002a717)、[専用CI #40412675585](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40412675585) SUCCESS、[独立物理CI #40412675329](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40412675329) SUCCESS、[真正WebGL Artifact #12694960144](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40412675585/artifacts/12694960144)を保存。35PNG=baseline/CX12+CR2+CT3+凍結DG6+凍結DH6+新DI6。前DH証拠との比較では旧baseline/CX12/12 PNGと旧DG/DH12/12 PNGがSHA-256バイト一致。CX generator blob `af076d67492a677d2235e4730aef8cdf4808e106`、元道路7面/動体28/gap52/240Hz/カメラ/入力/main/Gold/本番を変更せず、PRIVATE専用の4ファイルだけ実装。Actions起動3件。

**都市構図仮説**：DG箱街区、DH内部充填の失敗を踏まえ、クレセント2基を完全に保ち、主役の向こうに扇状に開く左右の居住翼と中央の大峡谷空洞を作った。ただし2実道路×15/17/18.5s正規WebGLでは、15秒の追加物が棚・梁状の斜めの張り出しに見え、17秒は遠景へ0.90～0.99%の差分に圧縮、18.5秒は上部クリップ。峡谷の奥行き、居住の活動、巨大都市と主役の統合が高速走行画面で読み取れず **DI ART REJECT**。CX→DI変更画素率：true-pinch 2.9050/0.9035/3.2538%、pinch-switch 2.3545/0.9924/2.9507%（画素差は美術評価点・ゲーム公平性の証拠ではない）。

**次は絵コンテから**：距離を深めるだけでは視覚の奥行きにならない。15→17秒にプレイヤーが何を見るかを三幕の連続視点で設計し、統一都市として本当に見える大胆な構図だけをPRIVATE実WebGL試作。パーツ追加と自動診断だけを繰り返さない。証拠・反省の詳細は [DI専用QA](docs/G4E7DI_SKY_FJORD_TRUE_GAME_ART_REJECT_JA.md) に記録。正式都市美術採用0件、ART/HUMAN/READY/PUBLISH/MERGE HOLD、公式Slope2認定0m、PR #46 OPEN/Draft/未マージ。DIは研究保存のみ。

---

# G4E-7DH 完了：PRIVATE統合HARBOR CRESCENT真正WebGL・構図ART REJECT／効率改善（2026-10-27 JST）

**実装**：コミット [a2c5e4b](https://github.com/ryomashibaba/dopagaki-development-hub/commit/a2c5e4bc140a357f5074aa5e9c68abbc51f389df)。前DGの箱型ビルでCXの象徴的クレセントを失ったことを受け、CX元ランドマーク・公道バンク公共歩行空間・全オリジナル物理/カメラを保持。主役と同じ道路端/曲線profileから、左右非対称の湾曲した居住ギャラリー、実際の穴のある前後外壁、斜めの接続アバットメントを生成する小さなDH候補を実制作。新たなshaderや偽レンダではなく、**Playwright PRIVATE-only 既存DG試験モジュールURLを一画面だけ差し替え**、同じ実ゲームWebGL2 renderer/real 240Hz native cameraで撮影。DHモジュールはbuildにコピーせず、通常のCX・凍結DG・drive3d・scripts/buildの各ファイルは一切変更しない。PUBLISH禁止、正式Slope2=0m。

**テスト・エビデンス**：[専用PRIVATE CI #40406130250](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40406130250) SUCCESS、旧CIテスト10/10、DG 1/1、DH独立1/1、DF合成3/3 PASS、DEの凍結DA/DB/DC再現PASS、PRIVATEビルドPASS、真正WebGL **29 PNG**（既存baseline/integrated12+CR2+CT3+凍結DG6+新DH6）を保存。[Artifact #12690169687](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40406130250/artifacts/12690169687) に `G4E7CI_REAL_GAME_SCREENSHOT_AUDIT_HOLD.json` と元PNGを格納。前DG artifact #12689434708 と標準CX/baseline 12PNGのSHA-256を比較し **12/12バイト完全一致**。既知CX private GPU source-ID 17秒左近景 ROI 13,423/206,824=6.4901%（<18%）と壁0の既存回帰も保持。ただし DHの新付加建築の視界保護までGPUで認定した意味ではない。[独立物理CI #40406130272](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40406130272) SUCCESS（A13/B5 2 jobs）。

**DH/CX 真正WebGL画素差**：true-pinch 15s 2.9540%、17s 1.3100%、18.5s 2.4476%；pinch-switch 15s 3.4248%、17s 1.4601%、18.5s 1.3081%。2道路×3秒の画角、正規BG240Hzカメラと物理状態は完全に一致。指標は候補が画面に映った程度を示すだけで美術点数ではない。DHの15/17秒比較画像ではCXの特徴的巨大クレセント輪郭を残せたが、内部に追加された淡い青/白の構造が**大きな斜めの楔状不透明塊**となり、道路と街区の接続や奥行きが読み取れない。18.5秒も効果は乏しい。横長棚と箱ビルを避けても『建物の一部をふさいだだけ』という新しい失敗類型。**DH候補を美術ART REJECT、正式採用0件**とし、CX通常表示を維持。構図は装飾的追加では突破しない。

**効率改善は明確にPASS**：DG前工程は shared build / drive3d を変更して47 workflow runs発火。本DHは専用 `web/p101-w9c2-g4e7dh-harbor-crescent.mjs`、独立テスト、private capture、専用CIのみを変更し、同コミットでActions起動 **3件**（専用CI、B5 physics、P64 QA-gated preview）に限定。通常のshared build / game rendererを触らず真正WebGLまで到達した。PRIVATE一時差替えは評価専用で、公開ビルドのDGモードからDHへ自動切り替えるものではない。

**次工程の方針**：すでにDA/DB/DC/DG/DHをART REJECTしたため、**単純な形の差し替えをやめ、走行中に見える3D都市の主題・規模・居住導線を設計から再考すること**。キャプチャ上では都市より道路のカーブとHUDが支配的で、主役が近接フレームで消え/画角上部に切れがち。カメラをズルして変更するのではなく、どの高速視点でも主役が都市街区に接続した形を認識できる設計証拠が必要。巨大な楔/壁、孤立クレセント、箱ビル群、棒・薄板のいずれも禁止。既存2道路×15s/17s/18.5s画像＋可能なら連続走行の時間軸を主体に評価し、ART肯定例がない状態で数値閾値を正式採用条件にしない。

**固定ゲート**：ART/HUMAN/READY/PUBLISH/MERGE HOLD、公式Slope2 0m、CX generator blob `af076d67492a677d2235e4730aef8cdf4808e106`を維持、PR #46 Draft未マージ、main/Gold/本番/原作非変更。

---

# G4E-7DG 結果確定：CITY CANYON候補は真正WebGLでART REJECT（2026-10-27 JST）

**実制作**：[独立DG候補 3b14196](https://github.com/ryomashibaba/dopagaki-development-hub/commit/3b14196c3f2e558f79c10a9539f7cda2e9414c49) と [比較ゲーム接続 13a8633](https://github.com/ryomashibaba/dopagaki-development-hub/commit/13a8633f107bbe76fd3bf5a56fd44983e4f420e5) をPRIVATE研究用に保存。旧CX generator Git blob `af076d67492a677d2235e4730aef8cdf4808e106` は変更せず。凍結BG240HzカメラとB48×7/B51-C×28/gap52を利用し、既存2主役を一時的に三つの奥行き層の居住塊・抜けのある街路・公共進入路を持つ6体積×2地区に置き換える明示的ローカル比較モード `g4e7dg=canyon-city` を作成。ゲーム標準描画はCXのまま、新規道路・衝突床・動体・速度リセットなし。正式Slope2=0m。

**技術検証**：[PRIVATE真正WebGL CI #40402442774](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40402442774) **SUCCESS**、既存CI単体10/10・DG候補単体1/1・DF合成3/3 PASS、DE過去不採用再生PASS、PRIVATE build PASS。元ゲームbaseline/integrated計12PNG・CR source-ID2・CT source部分3PNGに加え、真正DG WebGL6PNG（2道路×15/17/18.5s）＝合計23PNG。[Artifact #12689434708](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40402442774/artifacts/12689434708) に画像と `G4E7CI_REAL_GAME_SCREENSHOT_AUDIT_HOLD.json` を格納。[独立物理fast CI #40402442748](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40402442748) SUCCESS。前DF artifact #12658309698 と普通のbaseline/integrated真正WebGL12PNG SHA-256を照合し **12/12バイト完全一致**。既知CX近景のprivate source-ID ROIは13423/206824=6.4901%（18%未満）、既知青緑壁ゼロを維持。ただしこれは**DG候補の全景観遮蔽保証ではなく、標準CX画面の既知回帰**である。

**実画面のCX→DG変更率**：true-pinchの15/17/18.5秒=9.9880%／3.5211%／5.7592%、pinch-switch=11.8280%／3.8604%／5.0957%。数値は同一カメラWebGL画素差であり、品質点数ではない。道路中央窓の変更量も小さいが人間の道路先読みや視認の合格判定には使えない。

**美術判定はART REJECT**：15秒で左の巨大街区が画角外へ切れ、主役クレセントの形状が箱型の直立ビル群に置き換わった。17秒では箱ビルの間の公共空間・居住奥行き・連続する街路が高速視点から読めず、従来の失敗類型「別個の箱を足しただけ」の再発になった。18.5秒でも巨大街区は上方で途切れた形として迫り、魅力的な都市のまとまりは成立しない。形状の差が大きいこと（15秒画角の約10～12%）は美術改善の証拠ではない。**新候補を正式採用せず、CX標準を維持**。DGコードはPRIVATEの未採用実験記録に限定し、公開・マージは行わない。

**工程効率上の失敗**：`scripts/build.mjs` に新しい静的コピーを追加したため、他工程と共有する多数のActions（同一コミットで47 workflow runs）が不要に起動してCI待ちを発生させた。次工程は専用評価基盤の隔離と既存ワークフローのwatch pathの影響調査を重視し、共有ビルドファイルを無闇に変更しない。新候補制作前には、まず2道路×連続視点の主役輪郭と構造的な空洞が一つの都市として読める設計図・比較構図の基準を作る。建築数やBOXのレイアウト微調整を進歩とみなさない。

**保護ゲート**：CXは安全比較基準でありART正式合格でない。ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m、Draft PR #46 OPEN/Draft/未マージ、main/Gold/本番/原作未変更。

---

# G4E-7DF 完了：17秒の主役形状と15→17秒変化の実測、真正WebGL保持（2026-10-26 JST）

**技術結果**：実装 [2abc765](https://github.com/ryomashibaba/dopagaki-development-hub/commit/2abc765083c8aa24ab13d69c98b561495c3fde11)／[専用CI #40340505043](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40340505043) **SUCCESS**／[独立P101物理CI #40340505090](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40340505090) **SUCCESS**。既存ゲーム側テスト10件PASS、新DF合成テスト3件PASS、CX・凍結DA/DB/DCの2道路×15/17秒＝16画角を正規BG240Hz CPU投影で再生。PRIVATEビルド、真正WebGL画像17枚（通常12、source-ID2、CT3）、同一正規カメラ6対、warnings0。[証拠Artifact #12658309698](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40340505043/artifacts/12658309698)に \`G4E7DF_HERO_MORPHOLOGY_HOLD.json\` と16枚のCPUシルエットSVG、真正WebGL17 PNGを保存。前DE成功時Artifact #12657063279 と普通のbaseline/integrated真正WebGL12 PNGのSHA-256比較を行い **12/12バイト完全同一**。CXジェネレータ blob \`af076d67492a677d2235e4730aef8cdf4808e106\`、元走路/動体/240Hz/カメラ/コントロール/本番には変更なし。

**新診断の範囲**：DDのCPUデプス格子48×30で、明示的オプション使用時にのみprivate描画source所有格子を返す。DFはauthored \`slot\` のある主役建築を抽出し、見えるセル数、形状外接箱充填率、連結成分、横断行の分断数、閉じた空洞セル、外接・画面端位置を記録。15秒から17秒まで同じslotを追い、画面内への出入りと指標変化を記録する。合成の密実板・穴のある輪郭・細い分断材を区別するが、良し悪しの正解ラベルを予測するモデルではない。格子を描いたSVGは **CPUによる所有推定** で、真正WebGL画素でも美術的なレンダリングでもない。

**17秒の実測（主役slot 2）**：true-pinch／pinch-switch順に、CXは27/31セル、外接箱充填率0.429/0.492、囲まれた空洞4/4セル。DAは45/52セル、充填率0.625/0.650、囲まれた空洞0/0セル。旧「巨大壁」の不採用形状が17秒では薄い帯警告に引っ掛からなくても、画面上の不透明な塊に寄っていることが定量的に確認できる。DBは24/25セル、充填率0.381/0.446、連結成分6/3（CXは3/2）で、薄い支持材と分離構造が画面上の断片化として残る傾向を示す。DCは26/30セルとCXの27/31セルに近く、slot 2の外形にも差が少ない。DC特有の非主役 \`inhabited-canyon-section\` はslot 2の形状指標だけでは対象外であり、**非主役の都市断面を診断できたと誤認してはいけない**。この制約は次の統合都市構図の評価に重要。

**本質的な校正上の教訓**：既知のDA/DB/DCは企画全体に対するART REJECTであり、全12カメラ画角それぞれを人が独立に「失敗」と判定したラベルではない。17秒に候補の失敗部分が視界外へ離れたり、低格子で小さくなったりすれば、警告が無くても診断の誤判定とは直ちにいえない。従来の17秒6画角0検出を恣意的な閾値で100%にすることは禁止。DFの数値で「検出率向上」「都市美術改善」「人間が楽しく遊べる」のいずれも認定しない。

**未解決**：DFはslot付き主役のみに特化し、DCのような公共施設・居住断面の非主役source全体について2Dの空隙・構造を評価できない。48×30 CPU所有格子はGPU最終色、物理的な奥行感、透過、遮蔽、人間の視認時間の代用ではない。新たな良質都市の独立肯定例も無い。DA/DB/DCはDF内で真正GPU再描画しておらず、過去のART REJECTはその当時の実WebGL評価に依拠する。DFの新たな主役形状分類はCPU仮説であり、WebGLで形態識別できたとの断言を禁ずる。

**次工程の方針**：これ以上過去12画角の検出率合わせを行わず、実ゲーム高速カメラで主役＋公共路＋居住地区のマクロ構図が成立する少数の統合都市案に戻る。次の制作前に①15/17秒だけでなく高速通過による連続視点、②主役以外の都市機能の読める奥行、③実際の道路と街区の接続感、④局所化した壁・棚・棒状失敗の回避を明示する。真正WebGLを制作後に比較し、美術が未達なら実験案のみ撤回。CXは安全な比較基準であってART採用ではない。**ART/HUMAN/READY/PUBLISH/MERGE HOLD、公式Slope2認定0m、Draft PR #46未マージ**を維持。

---

# G4E-7DE 最終確定：過去のART REJECT再現16件と監査の実際の弱点（2026-10-26 JST）

**正本と完成CI**：歴史的DA/DB/DC景観固定とCPU構図監査拡張 [fd0039a](https://github.com/ryomashibaba/dopagaki-development-hub/commit/fd0039a7e9af97a45c268f03306e1191239bc97e)、主役分類のバグ修正と暫定3指標 [47bb409](https://github.com/ryomashibaba/dopagaki-development-hub/commit/47bb409fddce0435ccbdc83a2875079bd708cc77)、専用CIの監視パス補完 [4f2aa22](https://github.com/ryomashibaba/dopagaki-development-hub/commit/4f2aa2276968cecf7c08ff9ced3373fe1794c88e)。[最終専用CI #40336577889](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40336577889) **SUCCESS**：従来BC/B48/B51/CI単体テストPASS、DA・DB・DC歴史的比較PASS、PRIVATEビルドPASS、真正元240Hz/WebGL17PNG＋同カメラ6対、warnings0。[証拠Artifact #12657063279](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40336577889/artifacts/12657063279) 内に G4E7DE_REJECT_CALIBRATION_HOLD.json、DD構図診断JSON、WebGL画像を保存。DE最初の実装コミット物理fast lane [#40334593020](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40334593020) SUCCESS。GPU近景ROIはCX既知の13,423/206,824＝6.49%（上限18%）、既知青緑壁0画素を維持。DEの最初の成功CIから最後のCIまで、元の通常WebGL12PNG（baseline/integrated各6）はバイトハッシュ完全一致。既存景観ジェネレータ、元物理、カメラ、走路操作を変更していない。

**本物の校正結果（2道路×15/17s×過去3案＝不採用12画角）**：従来DDの同一三角形/建築源/種類の30%以上水平連続帯および画面端大型占有警告は、**DA 0/4、DB 0/4、DC 0/4＝12/12を見逃した**。既存指標だけの採用判定は完全に不可。研究用に追加した既知失敗データ依存の3候補信号は、DA 2/4（15秒の上空占有急増）、DB 2/4（15秒の広い疎な形）、DC 2/4（15秒の上空増加＋画面幅77〜81%の低占有巨大断面）を拾い、**合計6/12＝50%**。17秒の6画角は全件見落とし。閾値は同じ12不採用画像に調整したもので、未知の美術品質への汎化、誤検出率、ART PASSの妥当性は未検証。自動ゲートに昇格禁止。

**診断バグ修正**：旧heroNotVisibleは 'anchored-civic-crescent' という種類名だけを数え、DA/DBの別主役2基を誤って不可視判定していた。現在はサイト固有の authored slot 属性を使用し、DA/DB/CX/DCすべてで15秒2基、17秒1基と正しく計測した。近平面未測定は完全後方・近裁断横断・近平面以下に分割して記録。これらも最終GPU可視性の代わりにはならない。

**次DFへ**：まず17秒で過去3案がすべて見逃された理由を調べ、単純な面積・水平帯の閾値よりも、画面投影された主役の形状・空洞・居住体積・フレーム間一貫性の指標を研究。静止4画角で人間走行体験は証明できない。正規WebGL画像を唯一の美術確認の証拠とし、これ以上失敗都市の小手先置換を繰り返さない。引き続き**ART/HUMAN/READY/PUBLISH/MERGE HOLD・公式Slope2 0m**。PR#46 Draft未マージ、main/Gold/本番/原作を保護。

# G4E-7DE CI trigger coverage and detector evaluation — 2026-10-26 JST

Initial DE replay (run #40334593002, SUCCESS) detected zero/12 previously REJECTed views with original >=30%-row-based single triangle/source/kind/composite warnings. Keeping this as a measured false-negative result, NOT a pass. Historical RGB examples indicate DA first 15s sky occupancy +53/+52 of 624 cells; DC +43/+44 and occupied source widths 0.77083/0.81250 with low area. DB 15s architecture widens by ~0.08-0.15 screen fraction without material rise in total occupancy, explaining why broad planar-band thresholds miss it. A proposed exploratory triad (sky expansion >=30 cells, mostly unfilled widened silhouette, wide low-area source mass) is recorded in JSON but is empirically tuned ONLY to prior rejections. Do not deploy as an ART gate before independent positive/success examples. DA/DB heroNotVisible was an invalid false positive caused by kind-string rename; changing to source.slot corrects that. DE commit 47bb409 adds unit test and exploratory findings; here CI workflow file-watching also includes the new audit, calibration script and historical fixtures so future changes cannot skip validation. Existing CX renderer and physical road never modified; ART/HUMAN/READY/PUBLISH/MERGE HOLD, official Slope2 0m, PR#46 Draft remains unmerged.

# G4E-7DE calibration corrections (2026-10-26 JST)

DE first successful CI #40334593002 used exact history and produced true 17-WebGL screenshot artifact #12656967603. The old long-horizontal-row warning detected ZERO of 12 known ART REJECT viewpoint cases: DA 0/4, DB 0/4, DC 0/4. This establishes an important FAIL for diagnostic recall, not an ART success; calibration is technically valid. Analyses show DA 15s sky occupancy +53/+52 cells of 624 vs CX, DC +43/+44, and DC's single 'inhabited-canyon-section' source visibly spans 77.083%/81.25% of screen width with only 3.75%/4.31% screen area. DB 15s widens its dominant structure but with little occupancy change; image shows spindly skeletons, not a large solid wall. Previously DD counted heroes only by source kind 'anchored-civic-crescent', erroneously labeling DA/DB renamed megastructures as absent. Corrected hero identification to authored immutable site 'slot' metadata, irrespective of kind; add one synthetic slot regression test. Experimental comparative warnings (excess sky, sparse widening, broad thin mass) appear in DE calibration JSON as research, NOT production ART gates and not validated on a positive corpus. Need positive/negative calibration and GPU provenance before any automatic rejection. CX mesh, physics, genuine camera, speed, natural jump, PR#46 Draft/main/Gold/production untouched. ART/HUMAN/READY/PUBLISH/MERGE HOLD, official Slope2=0m.

# G4E-7DE — Frozen historic DA/DB/DC calibration (2026-10-26 JST; CI pending)

Original ART REJECT historical generators have been frozen from commits DA 0158742, DB 63c58d6, DC 2be6997 as exact source fixtures. Replay CX+DA+DB+DC on both authentic B48/28 B51/gap52 roads using unchanged original 240Hz cameras at 15s/17s. Store 16 read-only CPU macro audits and 12 rejected-vs-CX pair comparisons alongside 17 genuine WebGL PNGs in existing CI artifact. DD audit now separates fully-behind from near-plane-crossing triangles, detects connected screen rows of the same kind or entire scenery in addition to single triangles/sources, and records per-source screen bounding boxes and cropping. Treat detection thresholds as provisional warning candidates, compare against the known subjective ART REJECT labels, never automatically certify artistic quality. Existing actual CX scenery generator, physics, renderer, controls, Gold/main/production and PR#46 draft are not altered; ART/HUMAN/READY/PUBLISH/MERGE HOLD, certified Slope2=0m.

# G4E-7DD — completed authentic camera composition QA, CX unchanged (2026-10-26 JST)

**Commits:** DD implementation 48a6682ce74f6727cadbca7cf8e7e0ea16502229; expectation correction 18a6660d0edf5922186cced69627b833dbdf2f64. Initial run https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40330851720 FAILED only one new synthetic wall test: 300m geometry is correctly classified as MID (125m..400m), not FAR (>400m). The 9 other tests passed. Corrected the assertion only; existing scenery, audit algorithm, camera, physics unchanged.

**Final CI:** https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40331574011 completed SUCCESS. 10/10 tests, PRIVATE build, genuine original BG240Hz 17 WebGL PNGs (12 ordinary + CR2 + CT3), six strictly matched camera pairs, warnings0, artifact ID 12654704411. DD source-aware read-only 48x30 CPU geometry audit saved as G4E7DD_CAMERA_COMPOSITION_HOLD.json in this artifact. B5 physical fast lane https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40330851918 SUCCESS. Genuine DD versus saved CX integrated screenshots: exact RGB match for both roads at 15s, 17s, 18.5s = all 6 normal screenshots, 0 changed pixels. CX source-ID ROI remains 13,423/206,824=6.49% (threshold 18%). Known blue-green wall returns 0 pixels.

**Actual 4-view CPU baseline:** true-pinch 15s 9.375% scenic screen occupancy and 2 visibly sampled hero sources; 17s 9.583% / 1 hero; pinch-switch 15s 11.528% / 2 heroes; 17s 9.444% / 1 hero. No source-level or triangle-level >=30%-wide row warning in CX. Synthetic wide planar wall check PASS. Central candidate scenic triangle occupancy 0/196 cells in all four shots, but this instrument does not measure the road itself: do NOT use as road/human play visibility proof.

**Limitations and DE next:** This is CPU authored triangles raster depth approximation, NOT final WebGL fragment ownership or artistic score. The conservative unknown-near bucket also includes triangles fully behind camera, so nearClipUnmeasured=true alone is not proof of a dangerous clipping incident; split all-behind versus near-plane-crossing next. Calibrate these candidate metrics against previous visual failures DA, DB, DC, quantify false positives before any automatic ART gates. This DD stage improved diagnostics only, made no new artistic geometry, and ART/HUMAN/READY/PUBLISH/MERGE remain HOLD; officially certified Slope2=0m. Main, Gold, production, original, physics, Draft PR#46 unmerged/protected.

# G4E-7DD CI test expectation fix — 2026-10-26 JST

Initial genuine WebGL CI run #40330851720 FAILED only the new synthetic wall test: the mock wall is at 300m depth and the diagnostic correctly bins 125m..400m as mid distance. The test incorrectly asserted far>0 (far starts at 400m). All 9 other unit tests passed including actual 4-camera geometry audit and CX physical protections; private build and screenshots were skipped. Fixed the synthetic test expectation to mid>0; no geometry, renderer, camera, physics or audit algorithm change. Re-run the original single workflow and inspect both JSON and unchanged genuine GPU frames before declaring success. ART/HUMAN/READY/PUBLISH/MERGE remain HOLD.

# G4E-7DD — read-only camera composition diagnostic implemented (2026-10-26 JST; CI pending)

Quality problem: failed DA/DB/DC city silhouettes passed the existing CX 125m near-screen veto while creating distant giant slabs, narrow shelves and clipped skyline buildings. DD does NOT generate a new city mesh. A new private diagnostic module performs depth-aware CPU triangle projection of ORIGINAL BG240Hz cameras at 15s and 17s for both roads, on the existing authored CX scenery. It records near/mid/far screen cells, central-driving-view occupancy, upper-sky occupancy, visible major hero source IDs, clipped-at-edge and unknown-near triangles, and longest continuous horizontal runs for both individual triangles and whole source buildings. A synthetic large far wall unit test checks detection. Every result is labeled NOT GPU / NOT ART; thresholds are warnings until calibrated against rejected images. The output G4E7DD_CAMERA_COMPOSITION_HOLD.json is bundled with the existing genuine 17-PNG / six-pair CI artifact, without modifying the camera or renderer. No artificial grade or visual pass is declared.

Protected: untouched existing CX generator/road/camera and WebGL renderer, B48=7, B51-C=28, gap52, 240Hz, natural jump/steering/speed/score, main/Gold/production/original, PR#46 remains draft and unmerged. ART/HUMAN/READY/PUBLISH/MERGE HOLD, certified Slope2 0m.

# G4E-7DC 完了 — 都市一体型断面は真正WebGLでART REJECT、CXへ安全復元（2026-10-26 JST）

**実験の証拠**：実制作 [2be6997](https://github.com/ryomashibaba/dopagaki-development-hub/commit/2be6997035a6dad8f884184bfa8129d058aabc3e) は主役クレセントを交換せず、既存公共通路に接続する3段・両岸計4候補の居住都市峡谷断面を設計。旧CPの孤立した遠景折屋根は置換し、厚い段床・左右荷重壁・透過でなく真正未作成三角形の開放ファサード・駅ランプを同一断面で生成。各候補は元15/17s正規カメラ2枚で125m/150点のCX近景視界監査（19点以上なら描画前棄却）を使用。

**真正CI結果**：[Run #40328424880](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40328424880) **completed/SUCCESS**、元BC道路/28動体/gap52/正規240Hz単体テストPASS、PRIVATEビルドPASS、元ゲームCanvas WebGL17枚・6組厳密同カメラ比較、warnings0。[Artifact #12655165175](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40328424880/artifacts/12655165175)。別の B5 物理CI #40328424907もSUCCESS。CX近景 source-ID magenta 13,423/206,824＝**6.49%**（上限18%以内）、true-pinch 17s C.glass 青緑RGB(41,135,163)は0画素。これはPRIVATE特定源ROIだけの回帰監査であり、新規追加された遠方の大面を安全承認するものではない。

**CX→DC 4画角真正WebGL RGB差分**（各1008×645、RGB差和>48）：true-pinch 15s 25,056px（3.854%）、17s 4,307px（0.662%）、pinch-switch 15s 26,484px（4.073%）、17s 4,659px（0.717%）。中央の固定走路ROIでの変更はそれぞれ0/9/27/0画素と小さく、走行の公平性・ゲーム性は未認定。

**美術ART REJECT**：実画像では15sの画面左から大きな青白い水平／斜めの連続面が張り出し、厚い居住都市ではなく巨大な低い浮遊板や高速道路外側の屋根に見える。17sでは新断面が遠く小さくなり、既存クレセント、近景街区との機能的な都市接続・用途・階層が視覚的にほぼ読めない。実装意図としては三角形未配置の開口と荷重壁があるものの、本物のゲーム視点ではCYの細い架構・DBの棚・DAの大面という失敗を解消できなかった。変更画素率やCI PASSをART PASSに転用しない。

**復元・次DDへ**：DCの履歴・真正CI/PNGは保持。活動中ブランチの景観ジェネレータと専用テストを前HEAD [a52e4ad](https://github.com/ryomashibaba/dopagaki-development-hub/commit/a52e4adae62a0de493a10939dae6677d440a2f3c) のCX Git blobと完全一致へ戻す。[skip ci]を指定し無意味な既知CXの再CIを増やさない。次DDはマクロメッシュをまた追加する前に、4つの元画角に対する各視認領域・道路可読領域の**画像設計基準を先に設け、低く巨大な横面を画角上で排除する**。都市の主役、居住、駅、断崖が各視点で自然に連続する構図を先に検証する。ローカル/公開メッシュ混用を避け、個別の棒/屋根/箱を足す反復もしない。

**絶対維持**：B48×7/B51-C×28/gap52/240Hz、速度、操舵、自然ジャンプ、相対カメラ、スコア、main/Gold/原作再現/本番二サイト未変更、PR#46 Draft未マージ、ART/HUMAN/READY/PUBLISH/MERGEすべてHOLD、正式Slope2認定0m。

# G4E-7DC — 近中遠の道路沿い都市断面一体化（実3D実装・真正WebGL未判定、2026-10-26 JST）

**問題と方針**：CY/CZ/DA/DBは主役2基の局所置換が失敗。DCは既存2クレセントとCXの近景12街区の視界保護を変更せず、孤立する遠景の細い折屋根の生成機構そのものを廃止し、元道路沿いの公共コンコースへ直結する3段の**厚い居住都市断面**へ置換。両岸2か所ずつ合計4候補。各断面は公共交通基壇(d78)→中景居住(d128)→奥側都市(d173-230)を一つの道路追従座標で建築。斜めの広い荷重壁・三角形のない連続空気開口・居住ギャラリー・階層をつなぐ公共スロープを同一マクロ構造に含める。近接125mの正規BG240Hz 15/17sカメラに本物の三角形が19/150グリッド以上投影された候補は、CXと同じ保護アルゴリズムで描画前棄却。単なる大量の細棒や独立巨大平面の追加ではない。

**保護**：B48道路7/B51-C動体28/gap52/正規240Hz/操舵/自然ジャンプ/カメラ/加速/スコア未変更、station2左近景とCR/CT識別機構不変更、新衝突・新道路0、main/Gold/原作/本番未変更、Draft PR #46未マージ。実ゲーム現物17 PNG/6同カメラ組の既存CIを再利用する。CX近景source-ID18%上限、青緑ベタ壁0を保持。**現時点はART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m**。単体テストや画素変化だけで芸術合格としない。失敗なら研究コミットと証拠を残し、景観/テストをCXへGit blob復元する。

# G4E-7DB 完了 — 開放段層スカイポート、真正WebGL美術ART REJECT／CX復元（2026-10-26 JST）

**研究と証拠**：DBの実装コミット [63c58d6](https://github.com/ryomashibaba/dopagaki-development-hub/commit/63c58d630d22915b5b5280b5f16e0bbd7e3f06d9)。旧DAの連続巨大垂直壁を破棄し、既存2主役を4段の公共交通/居住テラス、3つの連続した大きな空気の抜け、上下を支える6本の荷重/交通コア、低い公共広場へ全交換。体積より開口と各層の可読性を重視したが、デザインの成熟は実ゲーム画像で判定する。

**真正CI**：[G4E-7CI #40325893148](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40325893148) **completed/SUCCESS**。単体テストPASS、PRIVATE build PASS、B48道路7・B51-C動体28・gap52・正規240Hzの元ゲームWebGL17枚（12通常、2CR、3CT）・元同一カメラ6比較対、warnings0。[証拠artifact #12652025241](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40325893148/artifacts/12652025241)。DA時と同じCXのpinch-switch 17s PRIVATE magenta源ROIは13,423/206,824＝6.49%（18%上限を維持）、true-pinch 17s既知青緑RGB(41,135,163)は0画素。人間操作の成功ではない。

**CX→DB実画面RGB差分（4画角、各1008×645、RGB差和>48）**：true-pinch 15s 49,811px（7.661%）、17s 17,942px（2.760%）；pinch-switch 15s 59,624px（9.171%）、17s 20,033px（3.081%）。画面中央走路域の変化ピクセルはそれぞれ0/215/0/226と限定的で、走行視界の劇的改善とは扱わない。15sのDBは白い斜め巨大支持材＋薄いデッキが並び、17sは細い縦柱・平床の骨組みに圧縮される。都市主役の内部や用途、生活スケール、建築体積が読めない。これは旧CYの細い棒／CZの付属箱という失敗への逆戻りであり、**ART REJECT、CITY HERO不採用**。変更画素率とCI PASSは美術評価ではない。

**復元**：DBの研究と実画像はコミット・CI・artifactとして保持し、活動中の景観ジェネレータと専用単体テストを直前のCX復元コミット [4360a36](https://github.com/ryomashibaba/dopagaki-development-hub/commit/4360a36fe4d3967008b719a81845adf835ff2cc7)のGit blob SHAと完全一致へ戻す。[skip ci]で既に実証されたCXを無目的に再テストしない。開発正本にはこの失敗と次工程の指針を文書追加。

**次DCの設計原則**：同じ主役2基を「リング→壁→棒→棚」と置換する局所形態研究は一時停止。まず実240Hz 15/17sの4画角で、近景の走路・中景の居住街区・遠景の大建築・公共動線が最初から統合された **一枚の都市断面** として見える空間配置を研究。カメラに対し見えていないだけの内部機能を作り込まない。独立アーチ追加や細線支持の量産を避け、ゲームプレイヤーが道路の進路を予測できることと一体の宏観構造を両立させる。視認・負空間・断面階層を複数視点で事前予測してから実3D化する。B48×7/B51-C×28/gap52/240Hz/自然ジャンプ/速度/相対カメラ/操舵/main/Gold/本番/原作全保護。ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m、PR#46 Draft未マージ。

# G4E-7DB — 開いた居住段層スカイポート、真正WebGL判定待ち（2026-10-26 JST）

**解決対象**：DAの二分巨大居住断崖は17正規WebGLで鋭角のベタ壁に見え、15sでは上端が画面外に切れた（成功した物理CIと別にART REJECT）。DBはDA構造の小型化・微修正ではなく、連続した縦壁自体を廃止。既存主役2基を「4段の厚い居住/駅テラス＋各段を隔てる3つの空気の抜け＋上下連続する6本の交通・荷重コア＋低い公共駅前広場」の統合建築へ置換。飾りの線/リング増殖、道路越しのゲートをしない。すべてPRIVATE描画専用で、走行可能床の認定なし。旧アーチ向け粗い位置スコアに加え、DB自身の6代表実メッシュ点を本物の15s/17s元BG240Hzカメラへ投影して各主役の有効視界/上端欠けを dbSkyportQA に残す。これはGPUピクセルや美術合格の証明ではない。

**品質ゲート**：専用CIの17真正元ゲームWebGL PNG／6厳格同カメラ対を用い、2道路15s/17sの通常描画で近景道路・中景・奥の主役に用途と高度差が読めるか観察。18.5sはoff-road分離。近景CX の source-ID 割合<18%、青緑C.glass巨大壁再発なし。2基のいずれかが細い棚・浮き板・模様付き箱、遠景で消える断面、道路を圧迫する巨大屋根になるならART REJECT、検証済CXへ単体テストと景観ジェネレータをGit blob完全復元。テストPASSのみで採用しない。

**厳格保護**：B48×7/B51-C×28/gap52/正規240Hz・自然ジャンプ/操舵/速度/既存カメラ不変更、main/Gold/原作/本番二サイト不変更。正式Slope2=0m、ART/HUMAN/READY/PUBLISH/MERGEすべてHOLD、Draft PR #46 未マージ。

# G4E-7DA — 大断崖型都市の実WebGL美術審査ART REJECT、CXへ安全復元（2026-10-26 JST）

**実験コミット**：[0158742](https://github.com/ryomashibaba/dopagaki-development-hub/commit/0158742798af56193f3ec0225fac903472171194)。既存クレセント2基を二分居住断崖（中央37m空間、3段テラス、前後貫通開口、接地斜支持）へ置換し、単純な棒やアーチ内部の小箱追加とは異なる都市主役の輪郭を実制作。

**本物の検証**：[G4E-7CI 専用CI #40323003944](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40323003944) **completed/SUCCESS**。BC/B48/B51・景観単体テストPASS、PRIVATE build PASS、元ゲーム正規BG240Hzの真正WebGL 17PNG（12通常+2CR+3CT）/厳格同カメラ比較6対、warnings0。[証拠 Artifact #12649359854](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40323003944/artifacts/12649359854)（2026-11-02 12:37:24 UTC失効）。CXのprivate GPU source-ID近景ROIは13,423/206,824 = **6.49%**で18%上限を維持。既存の青緑ベタ板は正規画面での再登場を認めず、原物理B48×7/B51-C×28/gap52/240Hz/カメラ/操舵/自然ジャンプを改変していない。

**CX→DA真正WebGL RGB差分（同一1008x645画像・RGB差和>48）**：true-pinch 15s **49,453px/7.606%**、17s **18,015px/2.771%**。pinch-switch 15s **53,472px/8.224%**、17s **21,875px/3.365%**。変化は大きい主役の画面上端・側方へ集中し、中心走行帯の変更は極少。画素変更は美術点数ではない。

**目視美術審査＝ART REJECT**：新しい輪郭は旧リングと明確に異なるが、15sでは上端が画面外に切れ、大きな鋭角の不透明な断崖ファサードが目立つ。並列する二つの居住翼と中央37m空洞はゲーム画面で都市の公共空間・駅・居住の階層として十分読めず、巨大な装飾壁／尖った外殻に後退。17sでは建築の大きな輪郭変化が遠景に圧縮され、都市の近中遠連続・壮大な未来生活スケールの統合不足。CXの進路前方は大幅悪化していないが、CITY HERO採用不可。技術CI PASSをART PASSとしない。

**安全復元**：DAの失敗研究は上記commitと成功CI/Artifactに永久記録し、活動中ブランチの**景観ジェネレータと単体テストを検証済CXのGit blobへ完全復元**（DA撤去）。文書のみ追加し、[skip ci]で無意味な既知CXのCIを増やさない。次DBでは新たな巨壁・平坦外殻を避けるため、シルエット全体が同一元240Hzカメラに収まる主役立地と**中空の都市断面・居住体積が視認できる高低差**を設計段階で保証してから実装する。近中遠・負空間・走路予兆は引き続き統合審査。ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m、PR#46はDraft、main/Gold/本番/原作保護。

# G4E-7DA — 主役都市の二分居住断崖マクロ形態・実WebGL審査待ち（2026-10-26 JST）

**品質仮説**：CYの細い周辺骨格、CZの既存リング内の箱状積層はいずれも、都市の主役輪郭を変更できずART REJECT。DAでは既存の主役リング2基を直接再設計し、二つの分厚い居住断崖が幅37mの本物の空中裂け目を挟む大形態とした。実メッシュの上下3層公共テラス、前後の貫通開口、接地した6斜支持を同一建築体内に彫り込む。細い棒/独立リングの追加はしない。旧source名をsplit-rift-urban-massifに変更し従来のsource rangeと真のBG240Hz同カメラ検査を保つ。

**保護**：都市景観ジェネレータと専用単体テストのみを変更。道路B48×7/動体B51-C×28/gap52/原物理240Hz/カメラ/速度/自然ジャンプ/操作/Gold/main/原作再現/本番サイトは変更禁止。既存CXの個別街区開放ルールおよびGPU近景ROI上限18%と青緑壁0画素を維持。元15s/17s両道路の通常描画、および18.5s off-roadの扱いを区別する。ART/HUMAN/READY/PUBLISH/MERGE HOLD、Slope2正式0m、PR#46 Draft未マージ。

**検証状態**：この記述は実装時点の設計仮説。新たなGitHub Actionsの結果および真正WebGL PNGを評価する前に技術PASS/美術改善を宣言しない。外形が改善せず単なる板壁や小部品に見えればART REJECTとし、CXへコードを安全復元する。

# G4E-7CZ 実3D検証・ART REJECT／CXへ安全復元（2026-10-26 JST、最新）

**実装したもの**：[CZ実験30da6e2](https://github.com/ryomashibaba/dopagaki-development-hub/commit/30da6e2948c0cdf6c6651c95a059c88a57943a96) は既存巨大クレセント2基それぞれの内部へ、両岸6層の多層床、18の実開放ファサード区画、4接地脚、4内部スロープ、既存高さ48m公共広場への2連絡面を描画専用に追加。外周巨大リングと中央上部空洞は保持し、独立した紐状CY案からは生成原理を変更した。

**本物の結果**：[専用CI #40319395601](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40319395601) **completed/SUCCESS**、10/10テスト、PRIVATEビルドPASS、元ゲーム正規240Hz WebGL17枚・同一カメラ6比較対・warnings0。[Artifact #12648312766](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40319395601/artifacts/12648312766) 2026-11-02 12:08:58 UTCまで保持。元B48道路7・B51-C動体28・gap52・240Hzと操作/速度/カメラ/自然ジャンプ不変更。CXのGPU前景遮蔽13,423/206,824（6.49%）、再発禁止閾値18%を維持。青緑色RGB(41,135,163)の壁も0画素。これは自動正規カメラの成功で人間のプレイ試験ではない。

**4画角の真正WebGL画像による美術審査**：旧CX→CZの全画面RGB変更画素は1008×645=650,160画素に対し true-pinch 15s 13,205（2.031%）、17s 3,161（0.486%）、pinch-switch 15s 15,408（2.370%）、17s 3,400（0.523%）。15秒画角では巨大アーチの下層に四角い積層付属物・空中ガレージのような面が増え、17秒画角では遠景巨大建築に吸収され変化がほとんど判別不能。画面中央の重要な走行帯の変化は限定的で危険視認性が悪化していないが、巨大都市の全域接続・主役アーチの造形統一・機能的建築としての説得力は未達。**美術判定 ART REJECT／総合 ART HOLD / CITY HERO REJECT**。CAD的な「層数・窓の数・支持材数」だけでは美術品位は担保できない。

**安全な対応**：CZの元コードと追加単体テストを破棄せずCZコミット履歴へ保持したうえで、活動中ブランチの都市景観ジェネレータとテストを**検証済みCXのGit blob SHAと完全一致**させ復元。CIは [skip ci] のリバートコミットとし、直前の成功済みCX固有のコードを再テストせず維持する（[CZの最新CI](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40319395601) 自体は成功済）。新しい物理/公共サイト公開は絶対禁止。

**次G4E-7DA：方針転換**。同じ既存巨大リングに小さな層/棒/箱を足す連続マイクロ改善を停止。初めに4つの元240Hz視点に同一レベルで現れる「都市の主役、居住群、駅/交通、空洞、道路ガイド」を**全体の形態階層**として再設計する。大型構造は市街地全域の母体として作り、個々の街区がその構造に彫り込まれているように見えること、実用途が外形に現れること、道路側の巨大壁が再発しないことを同時要件とする。実装は全域の静的デザインシルエットをまず比較し、近・中・遠景の4画角で方向性がよければ初めて内部階層を増やす。既存CXのプライベート視界保護、B48×7/B51-C×28/gap52/240Hz、main/Gold/本番/原作とDraft PR#46は保護。

**公開ゲート** ART/HUMAN/READY/PUBLISH/MERGE HOLD・正式Slope2認定0m。人間のプレイ成功未確認。

# G4E-7CZ — 既存巨大クレセント内部の都市化研究（2026-10-26 JST、実3D実装・CI未評価）

**正本**：前工程CY [実験41b6340](https://github.com/ryomashibaba/dopagaki-development-hub/commit/41b6340ab9f8222b5879116e0e685214b2b750c2) は10/10テストと実WebGL CIを通ったが、4画角の描画差分0.13〜0.47%に留まり細い独立棒にしか見えないためART REJECT。以前の実証済みCXへ景観/テストを戻した [dd61e35](https://github.com/ryomashibaba/dopagaki-development-hub/commit/dd61e35c0ee2c51eecbf8593fb272b6494a32b85) をCZ基点とする。

**設計仮説**：既存の壮大なクレセント2基は真の15秒/17秒の正規カメラに大きく現れるため、周辺へ細い装飾を増やすのでなく、その内側の立体公共都市施設を設計すればスケール・用途・交通の統一感を増やせる。巨大アーチ外周と空は変更しない。リング内側に左右各3層の開放公共/居住テラス（計6層/施設）、各層の実空気抜きポータル18区画/施設、接地した支持材4本/施設、内側ランプ4本/施設、既存48m公共広場への連絡面2か所/施設を追加。中央上層空洞は実際に三角形を置かず保持。あくまで景観・見た目上の用途表現で、Minecraft施工や物理的に走行できる床の認定ではない。

**禁止と評価**：巨大な青緑ベタ板、道路内ゲート、画面を覆う黒い屋根、非接地薄板、紐状追加建築は不可。既存の真正B48×7/B51-C×28/gap52/240Hz速度・操作・カメラ・自然ジャンプ・本番/Gold/mainを変更しない。CX近景GPU源占有率6.49%と上限18%の回帰CI、青緑RGB(41,135,163) 0の回帰CIも引き継ぐ。実際の2道路15s/17s正規カメラで変化が見えるか、空の抜け・進路予兆・巨大構造との美術的統一が改善するかを確認してから採否。ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m、PR #46はDraft未マージ。

# G4E-7CY 完成審査：真正WebGL実測でART REJECT／景観をCX確定版へ差し戻し（2026-10-26 JST、最新）

**診断結果**：CYの「離れた都市クレセントと公共コンコースを繋ぐ建築骨格」はGitHub [実験コミット41b6340](https://github.com/ryomashibaba/dopagaki-development-hub/commit/41b6340ab9f8222b5879116e0e685214b2b750c2)に実制作。専用CI [#40316383653](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40316383653)は **SUCCESS**（10/10テスト・PRIVATEビルド・正規BG240Hzの元ゲーム真正WebGL17 PNG／6組の一致するカメラ／warnings0）。[Artifact #12646714580](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40316383653/artifacts/12646714580) 2026-11-02 11:44:06 UTC失効。体験の検証は非人間の固定スクリプトカメラによる。

**コンセプトの失敗原因**：正規15s/17sを使った候補絞り込みで意図の「左右に分布する最大3拠点」のうち、実際に生き残ったのは **u=.72/side=-1 と u=.92/side=-1 の左岸2拠点のみ**。左右バランスのある都市接続にはならなかった。さらに巨大クレセントの横に細い黄・青の骨格が数本増えただけで、公共都市施設にも大規模交通ネットワークにも読みづらい。路面先読みの妨げにはなっていないが、過去に失敗した「棒を追加する」段階から脱出できていない。

**本物の全画面RGBピクセル一致比較：CX→CY（1008×645=650,160画素/画像）**：true-pinch/t1500 843画素(0.130%)、true-pinch/t1700 2,816画素(0.433%)、pinch-switch/t1500 901画素(0.139%)、pinch-switch/t1700 3,040画素(0.468%)。CYによる差分は画像右の巨大クレセント周辺の狭い上方領域に集中（pinch-switch/t1700の差分bbox x558..867/y139..284）。中央走行ウィンドウの変化画素も少なく、安全改善としては主張できない。実画像比較の結論は「小装飾の追加」に留まり、**ART REJECT（総合ART HOLD、CITY HERO不採用）**。CI PASSや投影カメラへの表示は美術採用条件にしない。

**対応**：CY用の `civicEchelon` と選択関数・生成元タグ、追加テストを取り消し、景観モジュールと元テストを**CXの検証済みHEAD f22d838とバイト単位で同一内容へ復元**。元の成功済み近景視界保護とprivate GPU回帰ガードはそのまま維持し、負担の多い無目的なCI fanoutを避ける。実験コードは41b6340の履歴に残るため研究成果は失われない。

**次工程G4E-7CZ**：小さい装飾・紐状骨組みの量産は禁止。主役となる巨大都市形態を、広い居住空間・開口・歩行経路・接地・遠景シルエットをひとつの実3D都市施設として設計し、建築として成立する状態で実カメラへ持ち込む。第一候補は既存クレセントの「外周線」ではなく、クレセント間の実際の空き領域に用途を持つ多層都市施設を設ける統合案。その際、中心道路の先読み・CX近景GPU占有率<18%・青緑壁再発0を先に保護。1枚の静止画で美しくても15s/17s別道路の4画角で成立しない案は棄却。**HUMAN/READY/PUBLISH/MERGE HOLD・正式Slope2距離0m**。B48×7/B51-C×28/gap52/240Hz/自然ジャンプ/カメラ/操作/速度とmain/Gold/原作/本番二サイト不変、Draft PR #46未マージ。

# G4E-7CY — 進路の視認性を守った都市の主役骨格研究（2026-10-26 JST、CI検証前）

**統合した設計仮説**：CXによる112m/s付近での道路先読み改善を保持しながら、「2つの巨大クレセント＋細い公共廊＋分断された箱街区」を、街区と未来都市の巨大建築が連続する姿に接続する。飾り棒の乱立、大板の街路遮蔽、車線をまたぐ疑似ゲートは過去の失敗として繰り返さない。

**CY実装**：既存のB48実道路の沿道フレーム上で、正規BG240Hzの15s/17s二つの固定撮影カメラに見える街区点のみから、u間隔0.15超を維持して最大3か所の構造的都市インターチェンジ『civic-echelons』を自動選出。新しい形状は既存歩行者通路のd=78地点に接続する公共アプローチ（道路から77m以上外側）、2つの実接地基礎、6節の非対称V折れ立体支持材、背後の短い2段ギャラリー。大きな負空間は実際に三角形が存在しない開口で、道路を覆わず、景観だけで衝突なし。単に箱やネオン線を増やすのではなく既存の遠景シビックアーチに共通の構造言語を与える。生成元タグと`cySpineQA`（実カメラで視認できるフレーム数、u、side）を保存。

**検証**：既存専用G4E-7CI現物WebGL 17PNG/同一BG240Hz6対を再利用して、true-pinchとpinch-switchの15s/17sで街路視認性、スケール感、近中遠景の連結と空の抜け、CX防壁の再発0を確認。先にunit、private build/real Chromium CIを通す。ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2 0m、B48実道路7/B51-C障害物28/gap52/240Hz/自然ジャンプ/相対カメラ/速度/入力不変、main/Gold/本番/原作保護、PR#46はDraft維持。

# G4E-7CX 最終確定 — 近景の走行視界保護ルール＋実GPU再発防止CI SUCCESS（2026-10-26 JST）

**正本コミット [3919b25](https://github.com/ryomashibaba/dopagaki-development-hub/commit/3919b25feaf7a9b54f98d0313b9a5afb4b0cbb6a)** に対する [専用CI #40313417994](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40313417994) は **completed/SUCCESS**。9/9単体テストPASS、PRIVATEビルドPASS、正規240Hz元ゲームWebGL17 PNG、6組の完全同一カメラ比較、warnings0。[Artifact #12645429225](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40313417994/artifacts/12645429225)。

**事実の確定**：実際のpinch-switch 17s近景左岸 `roadbank-inhabited station2/u=.62/side=-1` は旧CPU4角中心の閾値では見落とされた巨大画面遮蔽。CXは各街区の実三角形を正規15s/17sカメラで投影する15×10・近距離125mの占有判定を追加し、150サンプル中42を占めた該当街区**だけ**を開放型に切替。true-pinch15s/17sのゲーム実PNGは1画素も変化せず。pinch-switch 15s約2.0%、17s約19.8%の画素に局所変化。直接画像を見た結果、左側巨大建築の圧迫が減り、前方の道路とカーブを読める空間が増加。

旧CWのPRIVATE GPU source-ID左近景ROI 206,824画素のマゼンタ建築ピクセルは109,914（53.14%）→CXで13,423（6.49%）。**新たに既存実WebGL CIへこの比率18%上限を設け、CI #40313417994で実画像を検証・PASS**。特定色だけのGPU識別診断であり、美術品質点数/人間プレイの証明ではない。B48道路7/B51-C動体28/gap52/物理240Hz/自然ジャンプ/速度/カメラ/入力は改変していない。

**批判的な総合評価**：視界保護の技術的・視覚的前進は有効。ただし新しい開放型街区自体は単調で、遠景の箱型反復と道路障害物の弱さ、ステージの美術一貫性とゲームの面白さは未解消。**ART HOLD/CITY HERO REJECT、HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m**。次のG4E-7CYは遠景/中景/近景の主役級美術と走路予兆をひとつの全体構想として検討し、単に箱の数を増やさず正規カメラで再検証する。main/Gold/本番二サイト/原作保護、PR#46 Draft/未マージ。

# G4E-7CX — 真正WebGLによる高速視界改善確定＋再発防止（2026-10-26 JST、次専用CI待ち）

**基準コード [20c8ead](https://github.com/ryomashibaba/dopagaki-development-hub/commit/20c8ead35f92fbc623ddd432eb865d9e65c6b161)** に対する [CI #40312047578](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40312047578) **SUCCESS**：9/9 tests、PRIVATEビルドPASS、正規BG240Hz WebGL17枚/同一カメラ6対・warnings0。[Artifact #12645830351](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40312047578/artifacts/12645830351)（期限はGitHubの現在のArtifact情報で確認）。

**視界ルールによる新しい救済対象はpinch-switch station2/u=.62/side=-1 のみ。** 150点中、正規17sで巨大 near-road 居住区が42点（28%）を占める一方、旧中心距離+4角投影は見逃し。CXは実 authored triangles の近距離125m未満の15×10プローブを使い、19格子以上で開放型へ切替。true-pinch station2は旧規則で既に救済対象、他の都市街区も保持した。`cxNearVisionQA` が各街区の判定根拠を保存。

**本物の旧CW画像と新CX画像を画素比較・目視**：pinch-switch t1700 128,734/650,160 (約19.8%)が変更、t1500 13,003(約2.0%)、true-pinch t1500/t1700は1画素も変更されず。巨大な左側居住棟がなくなり走行道路のカーブと遠景が見やすくなった。Private GPU source-ID `pinch-switch-t1700` の左近景ROI x0..501,y25..436にある正確RGB(255,0,255)の画素は旧CW **109,914→新CX 13,423**（約53.14%→6.49%）。真のジオメトリが空間を占有していた証拠であり、画面が無くなった=都市美術合格とはしない。

**CX小追補**：この真のGPU根拠に基づくCI画像再発防止を既存 capture に追加。正規 pinchswitch t1700 のPRIVATE source-ID RGB(255,0,255)画素割合が同ROIで18%以上ならFAIL（旧53%、新6.49%）。保存済み `cxOpenVisibility` はART得点ではなく、未来の大きな近景巨大壁の回帰防止。新ワークフローは作らず既存CIを再利用。数値以外の総合景観は前方遠景の箱状反復や開放型広場の単調さが残り、**ART HOLD/CITY HERO REJECT、HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2 0m**。

**次G4E-7CYの基準**：今回新しい建築の物量追加は見送る。必要な都市造形主役/奥行/走路誘導を一体で設計し、本物の2道路15/17s画像で確かめる。視界保護の画面占有ゲートを維持しつつ、大都市景観の構成を改善する。B48道路7/B51-C障害物28/gap52/正規240Hz・自然ジャンプ・カメラ・速度・入力、main/Gold/本番/原作とDraft PR#46は保護。

# G4E-7CX — 高速走行時の近景建築視界遮蔽を一般規則で防ぐ（2026-10-26 JST、専用CI未検証）

**全体方針**：前CWで視覚上の青緑ベタ板や日本語HUDは改善した一方、ゲームの本質は112m/s前後の実走時に次の道路を読めること。真正pinch-switch/t1700では左岸巨大街区が画面左半分近くを遮る。GPU source-ID (CR以降、station2/u=.62/side=-1 の roadbank-inhabited) はこの巨大な近距離面と一致、CPUトレースでも15/15候補の大半を占めた。これは物理障害物ではなく描画専用巨大街区だが、道路進路予測を妨げる。

**仮説**：カメラから離れた街区中心距離・コーナーだけで遮蔽を測る旧 `cameraCellIntrusion` は、細長い占有棟の一部がカメラ近傍に飛び込む時に過小評価する。CXでは各街区の既存の occupied 実メッシュを一時生成し、正規BG240Hzの15s・17sショットに投影。画面中央走行視界用15×10の格子で、125m以内に見える実三角形の覆域19サンプル以上なら従来と同じ低層 `authorPromenade` に切替。各セルの候補スコアと救済判定をJSON互換の `cxNearVisionQA` に記録。新しい図形・衝突物・道路はなし。形状を大きく弱める判断は機械的な画面覆域と既知GPU帰属に基づき、場当たり的な station2 例外ではない。

**検証条件**：`pinch-switch` t1700で問題の巨大建築が消え、正規15sでも道路先読みが悪化しないことを同一BG240Hz真正WebGLで目視。`true-pinch`の3枚のC.glass青緑壁の再発0画素、pinch-switchの通常居住都市が無意味に全消失しないこと、元B48道路7・B51-C障害物28・gap52・カメラと入力・速度・自然ジャンプは完全不変。専用CI既存ワークフローを再利用、12基準＋2CR+3CT＝17画像/6対を維持。人体操作・正式ARTの合格には使わない。ART/HUMAN/READY/PUBLISH/MERGE HOLD・Slope2認定0m・Draft PR #46未マージ・main/Gold/原作/本番保護。

# G4E-7CW — 実WebGL17枚・日本語HUD修復・支持材/屋根局所改善（2026-10-26 JST、最新確定）

専用CI [#40309248652](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40309248652) は **completed/SUCCESS**、実装HEAD [9d173db](https://github.com/ryomashibaba/dopagaki-development-hub/commit/9d173db4ce6f7ecf6fd69104132aee6c47911946)。**8/8 tests PASS、PRIVATE build PASS、正規BG240Hzの元ゲームWebGL17枚（12基準+CR2+CT3）/同一カメラ6対/warnings0**。[Artifact #12644191731](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40309248652/artifacts/12644191731)は2026-11-02 10:46:17 UTCまで。非人間固定スクリプト撮影、人間試走ではない。

**目視評価**：前CUはheadless-only Chromiumに日本語フォントがなくHUDが□表示だった。CWはfonts-ipafont-gothicだけ選択的追加し、真正15s/17s PNGで日本語が正常に描画されることを確認。巨大に映った白色斜柱2本を幅3.5m→1.6mの鋼色支持材にし、屋根2枚を20/19m→14/13mに短縮。左岸の視界と支持材の巨柱感は局所改善したが、近景都市の平板さ、暗い屋根の存在感、遠景の箱状物量感、ステージ面白さ・障害物の弱さなどの根幹課題は未達。

**正規17sのGPU識別色ROI（33,750画素）**：transit屋根/柱はCT 10,483→CU 4,825→CW 3,084画素、CWのfloor床4,152画素、左岸civic-concourse 536画素。既知青緑ベタ板RGB(41,135,163)はCWでも0画素。これらは画面上の占有範囲の測定であり、美術スコアではない。**総合ART HOLD / CITY HERO REJECT、HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m**。

**次G4E-7CX**：同じstation2の微細な寸法修正を無限に続けない。正規15/17sを含む6画角で近・中・遠景の建築のつながり、道路視認性、直方体状遠景、障害物とステージの面白さを再審査し、質の突破に直結する1仮説を優先実装する。変更は真正WebGLの新旧実画像で検証。B48道路7、B51-C動体28、gap52、240Hz物理/操舵/カメラ/自然ジャンプ、main/Gold/公開2サイト/原作とDraft PR #46未マージ保護。不要なワークフロー増殖とCI fanout回避。

# G4E-7CW — 真正CU美術審査から支持材/屋根比率と日本語描画を局所修正（2026-10-26 JST、CV CI成功→CW実画面待ち）

[CV専用CI #40307776332](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40307776332) は **SUCCESS**、8/8テスト、PRIVATEビルドPASS、正規BG240Hzの元ゲームWebGL **17画像（12基準+CR2+CT3）・6対、警告0**。[Artifact #12643920062](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40307776332/artifacts/12643920062)（2026-11-02 10:34:52 UTCまで）。18分タイムアウト原因だった `playwright install --with-deps` をheadless-onlyへ変更したことで撮影に成功。true-pinch17s ROIの既知青緑RGBは再発せず0。描画元識別はfloor 4,115画素/33,750（旧CT6,608）、transit 4,825（旧CT10,483）、left-concourse 487（旧CT351）。減少したのは識別対象の表示領域であり、美術合格ではない。

**本物の15s/17s画像を視覚審査**：6反復柱は消え左岸空間が開いたが、CUの白く太い2本の斜支柱は新たな単調な巨柱に見え、2枚の屋根も遠近投影では広い水平板に見える。さらに `--only-shell` CIではPlaywrightの全OS依存導入で提供されていた日本語フォントが無いため、HUDや警告の日本語が豆腐（□）に化けている。ART HOLD、現在のCUを美術PASSにしない。物理・カメラの不合格ではない。

**CW局所修正**：station2/u=.62/side=-1 の2屋根を横方向14m/13m程度へ短縮し、両者の投影ギャップを拡大。2本の斜め支持材を幅3.5m・C.pearl→幅1.6m・C.steelとし、支える構造を保ちながら白い塊を抑える。別道路、同駅以外、civic-concourse、物理・操舵・カメラ不変更。CIでは前工程と同じheadless-only Chromiumに、**fonts-ipafont-gothicだけを選択的追加**して日本語HUDの文字化けを予防。以前の巨大apt `--with-deps` には戻さない。真正15s/17sの新旧画像と日本語表示確認までは品質未判定。ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m、Draft PR #46未マージ、main/Gold/本番/原作保護。

# G4E-7CV — CU検証の18分タイムアウト対策（2026-10-26 JST、CI結果待ち）

CU [専用CI #40304256841](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40304256841) は **CANCELLED**（開始2026-10-26 10:02 UTC、取消10:20 UTC）。7? ではなくG4E-7CUの単体テスト工程は成功、しかしPRIVATEビルド工程の末尾で `npx playwright install --with-deps chromium` によるUbuntu全体のフォント/GUI依存パッケージをaptで取得中に18分上限でキャンセル。ゲーム描画・美術のFAILではない。CUの実WebGLスクリーンショットは一切生成されず、Artifactなし。美術改善は未検証。

CVは **CI準備だけ**修正。Ubuntu-24.04 GitHub標準runner上でPlaywright 1.56のヘッドレス撮影に必要なChromiumシェルを `npx playwright install --only-shell chromium` で取得。aptによる全OSパッケージの導入を省き、依存不足で起動が失敗した場合はその実ログから不足ライブラリだけ追加する（未確認のまま成功を宣言しない）。実ゲーム・景観・240Hzカメラ・B48×7/B51-C×28/gap52・プレイヤー入力は不変更。テストと12基準+2CR+3CT=17PNG、6対同一カメラ比較は変えない。ワークフローの画像名を実態に合わせて更新。

**状態**：CUの大床/6支柱→2広場+2斜支持案は候補のまま。CV CIで実17s/15s真正WebGLを確認してからART採否を決める。ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m、Draft PR #46未マージ、main/Gold/原作/本番保護。不要な追加WF・多重pushはしない。

# G4E-7CU — CT GPU実証に基づく第3ステーション左岸だけの公共広場改良（2026-10-26 JST、検証待ち）

直前CT [専用CI #40302982954](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40302982954) は completed/SUCCESS、7 tests PASS・FAIL0、PRIVATEビルドPASS、正規BG240Hz元ゲームWebGL**12コア+CR2+CT3=17枚**、warning0。[Artifact #12641322389](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40302982954/artifacts/12641322389)（2026-11-02 09:57:51 UTCまで）。真の17秒GPU独立識別色比較：roadbank station2/u=.62/side=-1 の promenade-floor=6,608画素/ROI33,750(19.5793%)、promenade-transit=10,483画素(31.0607%)、civic-concourse-left=351画素(1.04%)。数値は色IDが反映された面積であり美術点数ではない。真正画像目視で**巨大平床はpromenade-floor、長い屋根と6本の反復支柱はpromenade-transit**と一致。左岸全体のcivic-concourseは主原因ではなく不変更が適切。

G4E-7CU はこの確証を根拠に**この1街区だけ**の60×28m大平板を、段差をもつ2つの小公共広場＋細い連絡部へ変更。6本の垂直反復支持材・薄い長大屋根を、2つの非対称な折れ屋根＋各1基の厚い斜め支持構造へ置換。ほかのpromenade、pinch-switch居住街区、civic-concourse、折れ屋根遠景、主役建築は不変更。スクリーンショット診断17枚と元CIを再使用し、真の17秒と15秒画角で別の大きい遮蔽物が出ないことを見て採否決定する。自動テストとCI成功だけでART合格としない。

**全ゲート** ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2 0m。B48実道路7・B51-C動体28・gap52・正規物理240Hz・速度/操舵/カメラ/自然ジャンプ不変更。main/Gold/本番・原作再現不変更、Draft PR #46未マージ。新CI追加禁止、既存専用CI再利用。次はCI結果と真正PNG目視が最優先。

# G4E-7CT — 左岸残存暗色デッキの生成元を3分割してPRIVATE GPU検証（2026-10-26 JST、検証待ち）

直前のG4E-7CSは専用CI [#40298652277](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40298652277) completed/SUCCESS、6/6単体テスト、PRIVATE真正WebGL12+2画像。true-pinchの正規17s左岸ROIでC.glass RGB(41,135,163)は10,720→0となり、問題の3枚の青緑パネル撤去を確証。ただし暗い広いデッキ面と反復支持材が残り、街区の見通し・規模感は未達。ART HOLD/REJECT継続。

**CTは新しい景観形状を追加・削除しない診断専用**。既存 provenance 内の station2/u=.62/side=-1 roadbank-promenade を floor(4 triangles) と transit(canopies+grounded supports, 84 triangles) に分け、既存 civic-concourse の左岸側を第3候補とする。元のメッシュ、物理、色、カメラ、道路構造は通常描画では完全に同じ。true-pinch/t1700に3枚のPRIVATE色識別画像を既存WebGL CIへ追加し、同一カメラ/同一時刻の統合元画像とのROI差分と三角形数を監査する。撮影後は実画面で暗い面・支柱との対応を目視し、帰属が明白な面のみ次の小規模景観修正候補とする。単なるRGB差分はART合格証明ではない。既存12基準+2 CR source-ID、6比較ペアを維持。専用CIは既存G4E-7CIワークフローを再利用し増殖なし。

**安全**：B48×7/B51-C×28/cell52/正規240Hz、速度・操舵・相対カメラ・自然ジャンプ変更なし。ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m、Draft PR #46はマージ禁止。main/Gold/本番/原作再現保護。次工程での恒久造形採否は真正WebGL画像と局所性評価で決める。

# G4E-7CS 実WebGL完成検証／ART HOLD（2026-10-26 JST、最新確定）

**正本は Draft PR #46、景観修正 [c39d04d](https://github.com/ryomashibaba/dopagaki-development-hub/commit/c39d04d1c26f0fe907ea4472a412015113286a73)。** [専用CI #40298652277](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40298652277) は **completed / SUCCESS**、6 tests PASS・0 FAIL、PRIVATEビルドPASS、元ゲームWebGL画像 **12枚+識別色2枚、6組の正規BG240Hz固定カメラ**。警告0。[Artifact #12640073134](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40298652277/artifacts/12640073134) は2026-11-02 09:36:50 UTCまで。前工程でQUEUE/PENDINGと書かれた内容は当時の履歴。最新のCS実測を優先。

**GPU実描画で特定済みの3枚の青緑板を局所修正した結果**：true-pinch 17s画面左ROI x190..439, y205..339 の C.glass の正確RGB(41,135,163)は **10,720→0画素**。原因は station=2/u=.62/side=-1 の roadbank-promenade の不透明ガラス面3枚。ほかの建築や色を大量追加していない。

**CR→CSの実PNG RGB差分**（画像解像度1008×645、1チャネルでも違えば変更画素）：true-pinch 15s **483画素(0.074%)**、17s **13,797画素(2.122%)**、18.5s **0画素**。pinch-switch は15s/17s/18.5s全て **0画素**で同一。この数値は美術点数でなく変更局所性のみ。真正17s画像を直接目視すると板は消えたが、左側には大きな暗いデッキと繰り返し支持材が残り、近・中・遠景の街区連結感と都市規模感はまだ不十分。**ART HOLD / CITY HERO REJECT、HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m**。18.5sはphysicalRoad=offなので通常走行審査対象外。

**次G4E-7CT**：残る暗い左岸デッキ・支持材について真正15/17s画角と既存の三角形生成元タグを対応づけ、元凶を特定した面のみ変更。推測で別のデッキ・屋根を削らない。無目的な素材追加・CI増殖・繰り返しpushを避ける。B48実道路7、B51-C動体28、gap52、240Hz、速度、操舵、カメラ、自然ジャンプ、main/Gold/本番と原作再現を保護し、Draft PR #46未マージ維持。

# G4E-7CS — GPU特定済み青緑壁の3面を局所修正（2026-10-26 JST、専用CI検証待ち）

G4E-7CR初回run [#40297532117](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40297532117) は最終 FAILURE。ただしテストとPRIVATEビルドはPASS、14枚の真正WebGL画像は [Artifact #12639535527](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40297532117/artifacts/12639535527) に保存済み。固定17秒で第3ステーション左岸の三角形だけマゼンタ表示すると、true-pinchで問題の**3枚の青緑壁が一致して着色**した。ROI変更率61.2119%（28三角形）、pinch-switch居住街区79.8874%（2380三角形）。これはGPU実描画での出所確証だが美術評価ではない。

初回CI FAILUREは**撮影データの mode キーが元のカメラ状態によって上書きされる既存の落とし穴**で、14画像を12基準+2診断として数えられなかったことによる。キャプチャ時の captureMode を別途保持して修正。実画像撮影そのものは成功。

CSでは、正規17秒のtrue-pinchに出ていた authorPromenade の station=2/u=.62/side=-1 の**3枚だけ**を開放し、道路沿いに高さ11mの短い接地3D支持材6本で屋根を支える。ほかのステーション、pinch-switch居住街区、B48×7、B51-C×28、void52、正規240Hzカメラ/物理、本番は不変更。旧CQ実PNGのROIにはC.glassのRGB(41,135,163)が10,720画素あったため、修正後は真正同画角で1,500画素以下を最低回帰条件とする。低下が数値で認められてもARTは画像の実目視評価までHOLD、HUMAN/READY/PUBLISH/MERGEもHOLD、Slope2正式認定0m。

# G4E-7CR — 第3ステーション左岸GPU識別色 A/B（2026-10-26 JST、検証待ち）

CQ [CI #40294635351](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40294635351) は **completed / SUCCESS**、4/4 tests PASS、真正WebGL基準12画像・6組を確認。旧CQ欄の QUEUED は時点情報であり現在の状態ではない。[Artifact #12639060181](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40294635351/artifacts/12639060181) は2026-11-02 08:57 UTCまで保持。実画像ではtrue-pinch 17s左岸に大きな青緑の矩形3枚、pinch-switchには別の居住街区が確認できた。幾何学候補は両方 station=2 / u=.62 / side=-1 に集中したが GPU最終帰属は **未確定**。

G4E-7CRはこの候補範囲の**頂点色だけを蛍光マゼンタにするPRIVATE固定240Hzカメラ診断**を追加。景観構造や物理を変更せず、既存12枚に17秒時点の識別色画像2枚を追加し、同フレーム同カメラで元のゲーム画像とのROI画素差をJSONに記録する。CIの実画像で壁の位置・形状とマゼンタ領域が一致するまで、恒久的な建築修正・ART合格は宣言しない。G4E-7CR専用チェックが実際に成功したか確認すること。ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m、PR #46 Draft保留。main、Gold、本番、原作再現、B48×7/B51-C×28/gap52/240Hzは変更禁止。

# DOPAGAKI SLOPE — 新チャット継続入口（固定URL）

## G4E-7CQ — 実スクリーン画素→三角形出所の解析を追加（2026-10-26 JST、検証は QUEUED）

**コード [90acb053](https://github.com/ryomashibaba/dopagaki-development-hub/commit/90acb053580bd0a03ffafeeafdf4409f7a608083) で診断実装済みだが CI の結果/美術結果は未判定**。[専用CI #40294635351](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40294635351) queued、GitHub Actionsの同ブランチで多数のCIが同時発火し待ち行列を確認。PASSまたは実画像原因特定を宣言してはいけない。

**変更点**：真正PRIVATE BG 240Hzフレーム15s/17sのうち t1700 を用い、元WebGL2の頂点変換式・正規カメラを変えず、問題の画面 x220～380／y250～315 内15箇所について静的な景観三角形の射影・奥行とタグ（道路bank、公共通路、折屋根、アンカー建築）、元の三角形ID、色、3D座標を画面datasetと既存スクリーンショットJSONへ記録する読み取り専用CPU geometry candidate tracerを追加。元景観は三角形構成を含めて**一切変更していない**。ゲーム物理もカメラも無変更。CPU解析は街区メッシュ内の幾何候補でありGPUピッキングの証明ではない。他のオブジェクトによる遮蔽/fragment shading/antialias を検証するまでは原因と断定しない。単体テストに合成三角形の真ん中ヒットとオフスクリーンミス、生成元数え上げを追加。計測は既存のCIを使い追加専用ワークフローを作らない。

**次に必要な作業**：#40294635351 を確認し、失敗なら最小修正。成功なら実際の t1700 スクリーン画素と provenance 候補の色/3D位置/建築生成元を比較し、残存青緑壁の描画元を特定できた場合のみ該当する生成関数・三角形面を最小修正する。正式なART評価はWebGL旧新の画像を実際に確認してから。複数pushによるCI fanout問題を意識し、修正・テストを小さくまとめる。前工程 G4E-7CP のART HOLD/主役級REJECT、正式Slope2=0m、HUMAN/READY/PUBLISH/MERGE HOLD を継続。元B48×7、B51-C×28、gap52、240Hz、操舵、カメラ、main/Gold/本番と原作再現は保護。PR #46 Draft未マージ。


## G4E-7CP — 連続都市廊・非箱型屋根研究と現物WebGL反証（2026-10-26 JST）

**最終コード [826d355](https://github.com/ryomashibaba/dopagaki-development-hub/commit/826d3553e9147e049028f97e3d40c30a95e71127)、専用CI [#40293077968](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40293077968) SUCCESS、物理不変・形状の自動テスト3件PASS、PRIVATEビルドPASS。** 2道路×15秒/17秒/18.5秒×BASELINE/CP=12枚の**元ゲームWebGL2実画像**、6組の同一BG実240Hzカメラ比較あり。[最終PNG/JSON Artifacts #12637236643](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40293077968/artifacts/12637236643)。画像は非人間の固定スクリプト走行であり、ART PASSやHUMAN PASSを意味しない。18.5秒はBG physicalRoad=off、通常走行の画面とは区別。

**構築と真のQA反省**：初版 [afe978f](https://github.com/ryomashibaba/dopagaki-development-hub/commit/afe978f876a23c3ebf1e6bd4f973b57da6d204c7) で両岸の公共デッキを10区間接続し、稜線屋根10区間と建築背面の実開口を作成。初版CI [#40291431137](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40291431137) SUCCESSだったが、真の17秒画面に長い黒い屋根帯が被さり、前工程から視認性が悪化。2版 [bd05522](https://github.com/ryomashibaba/dopagaki-development-hub/commit/bd05522ee47738a1a46ac21c75668ab8441c4a7b) では連続屋根を短い部分屋根に分割、公共デッキを地表近くへ移し、CI [#40292302238](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40292302238) SUCCESS。3版 [826d355](https://github.com/ryomashibaba/dopagaki-development-hub/commit/826d3553e9147e049028f97e3d40c30a95e71127) では上下幅を広く占める屋根のカメラ投影を棄却、旧店舗の3枚の不透明な青緑のベタ面と推定した要素を撤去、実投影上6/10遠景屋根のみ採用。元の背景/物理は未変更。

**現物画像を目視した結果：ART HOLD / 主役景観REJECT（引き続き）**。上空の遮蔽帯は初版より減り、中央の物理道路は維持された。しかし真の17秒 true-pinch画像（およそ画面 x=190〜430, y=222〜323）に**3枚の大きな青緑色の平面がほぼ同じまま残存**する。CP3で削除した店舗パネルを出所と推定したのは誤り、原因は未特定。さらに数km級都市の奥行き・道路沿いの広域連続性と用途の読み取りも未達。**これ以上同一の見た目推測で部材を削るのは禁止**。次CQは **真正WebGL17秒の問題ピクセル位置を、出力メッシュ（発生関数/街区/三角形/色/3D位置）へ逆引きする診断**を最小限追加し、物理・カメラとスクリーンショットを不変のまま確定した箇所だけ修正する。画角比較は2道路×15/17秒を中心に、18.5秒 off-roadは分離評価。

**最終CIのBASELINE比較 RGB差和>48 の画素率**（美術点数ではない）：true-pinch 15s **13.1537%**／17s **19.8540%**／18.5s **20.7207%**、pinch-switch 15s **15.3012%**／17s **32.2714%**／18.5s **13.2880%**。CIは12枚/6ペア、warningsゼロ。描画メッシュの街区10連結、視覚専用遠景屋根6をログで確認。ART/HUMAN/READY/PUBLISH/MERGEは全HOLD、公式Slope2 **0m**。B48道路7、B51-C動体28、gap52、240Hz、カメラ、操舵、自然跳躍、A13方針変更なし。main/Gold/原作再現/本番サイト保護、PR #46 OPEN Draft未マージ。Work未使用。


## G4E-7CO — 旧CN巨大近景壁の遮蔽を修正、PRIVATEゲームWebGL12枚で美術HOLD判定（2026-10-26 JST）

**今回の実装と検証は完了。美術はなお ART HOLD / 最終採用不可。** コード [b9b1c44](https://github.com/ryomashibaba/dopagaki-development-hub/commit/b9b1c4452b6134b67bdea912f2c7d31734cbb6ec)、期待テスト文言修正 [0e560b6](https://github.com/ryomashibaba/dopagaki-development-hub/commit/0e560b660b302224715e53b90b0f34d0005c6530)。専用[CI #40289823039](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40289823039) SUCCESS、正規BC/B48/B51物理不変含む**3/3テストPASS**、PRIVATEビルドPASS、原ゲームWebGL2で2道路×3時点×旧新の**12枚**、6組の原BG240Hz同カメラ照合済み。[実画像/JSON Artifact #12635656344](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40289823039/artifacts/12635656344)（7日間保持）。初回CI #40289569552 の失敗はテスト期待文言の不一致（「CM requires…」対「CO requires…」）のみであり、期待文言修正後PASS。物理・本番コードには未影響。

**造形改善**：CNの手前で極端に大きかった無地青緑色の台形壁を抑制。近/中景の段状建築の高さを下げ、道路から奥へ設置。前面と道路側側面は実際に三角形が存在しない開口を持つ構造に変更し、平面テクスチャ窓だけで遮蔽を隠したのではない。15/17秒の両方の正規カメラに対する画面面積の危険判定で、視界を占有する近景は同じ道路沿いの低層・開放的な公共プロムナードに固定置換（人間プレイ中に切り替わらない）。実測：true-pinch **9街区フル維持/3低層化**、pinch-switch **10フル維持/2低層化**。主役2つは既存の物理路面0/1沿いの固定配置を維持。無意味な追加オブジェクトの大量増殖はしない。

| 変更RGB画素率・各旧ゲーム基準 | t15 | t17 | t18.5（BG physicalRoad=off） |
|---|---:|---:|---:|
| true-pinch CO vs BASELINE | 13.087% | 19.391% | 21.123% |
| pinch-switch CO vs BASELINE | 15.271% | 33.105% | 13.328% |
| true-pinch CO vs CN | 17.230% | 21.066% | 9.061% |
| pinch-switch CO vs CN | 16.749% | 20.921% | 6.436% |

CO/CN比較はArtifact同解像度の元ゲームPNGをRGB絶対差和48超で比較した画素比。**いずれも美術スコアではない。** 実画像を直接確認：CNより前景の巨大無地壁が目立たなくなり、クレセントなど主役建築や開口のある街区を読みやすい視点ができた。とはいえ17秒の道路左側には壁状の長い構造が残り、左街区と先の都市の連続性は弱い。空へ伸びる都市全体の稜線・遠景の層・数kmの規模感は不成立。18.5秒はそもそもBGのphysicalRoad offなので走行時と同一の美術比較をしない。**ART HOLD / CITY HERO REJECT**。人間操舵での視認性・公平性・完成品質は未認定。

次のCPは**見えている都市の建築関係と都市稜線の再構成**を優先。すでに改善した無地壁を再導入せず、過剰な箱/格子量産もしない。新しい素材巡回や無目的なテスト環境の増殖を避け、同じPRIVATE正規WebGL 12フレームで質を審査。元240Hz速度/操舵/カメラ/自然跳躍、B48道路7/B51-C動体28/gap52、A13規定、main/Gold/原作再現/本番サイト保護。正式Slope2=0m、PR#46 OPEN/Draft/未マージ。ART/HUMAN/READY/PUBLISH/MERGE全HOLD。Work未使用。

## G4E-7CN — 造形を持つ街区へ転換、真のPRIVATEゲーム画像12枚で再評価（2026-10-26 JST）

**コード [9d8f59e](https://github.com/ryomashibaba/dopagaki-development-hub/commit/9d8f59e05d56bf7735f63544fa9430ec88e0daf2) / [実ゲーム専用CI #40287595121](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40287595121) SUCCESS、テスト3 PASS・FAIL 0。** 2道路×3時点×BASELINE/CN=12枚の元ゲームCanvas WebGL2画像と6組の同一元BG240Hzカメラ比較を取得。[7日保持の真正画像とJSON artifact #12634718104](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40287595121/artifacts/12634718104)。元のB48道路7・B51-C動体28・gap52、速度・操舵・元カメラ・ジャンプを変更しない。

**実装変更**：CMで4基中2基のスコアが0～0.03／両時点視認0だったため、主役クレセント4基を2基へ絞り、15s/17sの実カメラの少なくとも片方で粗い全体投影が視認可能な候補だけ配置。12街区の近景では旧薄柱・細い浮梁を減らし、開口した店舗と屋根、二翼の段状建築、公共通路、階層のある厚みへ修正。**テストの投影スコアは美術合格基準ではない。** 残る2基はtrue-pinchで実投影score 1.160233（2視点）, 0.5（1視点）；pinch-switchで1.032176（2視点）, 0.5（1視点）。評価はスクリプト走行の固定視点であり人間の走行試験ではない。

**真正Canvas画像の定量情報（ベースラインからのRGB差＞48の画素割合、画質評価ではない）**：

| 視点 | 15s | 17s | 18.5s（原物理 off-road） |
|---|---:|---:|---:|
| true-pinch CN / baseline | 22.936% | 29.788% | 18.500% |
| pinch-switch CN / baseline | 22.975% | 35.606% | 10.670% |
| true-pinch CN / CM | 22.031% | 26.576% | 6.744% |
| pinch-switch CN / CM | 19.853% | 29.692% | 2.906% |

**実画像目視美術評価：ART HOLD / 主役級REJECTを維持。** 薄柱・空中梁の反復は相対的に減り、段状の建築質量が見える。ただし15～17sでは近景に大きく切れた無地の青緑ファサード/斜面壁が増えた。街区の規模・開口・用途の読み取りは十分でなく、遠景まで続く超未来都市の統一景観・数km級の印象は未達。数値の変更率や箱を厚くしただけでは合格ではない。18.5sの physicalRoad=off では従前同様景観が画面上方へ寄り、通常走行画面と分離評価する。**次COはサイズや個数の追加でなく、実カメラの近景巨大遮蔽を弱め、遠景と建物内の都市生活スケール・稜線を明瞭化し、2方向の15/17s実画像を美術採点する。** 旧初案の箱・新案の無地壁・無意味な細部増殖の反復は禁止。CIは成功したがART/HUMAN/PUBLISH/READY/MERGEは全HOLD、正式Slope2 0m、PR #46 Draft未マージ、保護本番・原作・Gold・main不変更、Work未使用。

## G4E-7CM — 実240Hz 15/17秒カメラ逆算・固定景観候補（2026-10-26 JST、検証待ち）

**実装は存在するが、専用CIと美術審査は未完了。** ブランチ上のコードコミット [1f432c9](https://github.com/ryomashibaba/dopagaki-development-hub/commit/1f432c9bc66714f6cc3869b90f4ff35f72a25922) で、G4E-7CI/CL既存16街区・主役4建築の配置を見直した。主役の高さと奥行を減らし、近景の単調な階数反復と中景箱塔の密度を軽減。主役4基は「15秒撮影用と17秒撮影用に別々の世界を作る」のではなく、**同じ既存物理B48道路0/1上で両方の実BG240Hzカメラの画角を評価してから固定配置**する。render関数・物理・カメラ・A13・入力・障害物は変更していない。テストは正規BG両時刻と位置スコアの記録を追加。3テストと真正WebGL旧新6対12枚の [CI #40285116236](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40285116236) は記録時 **QUEUED（未PASS）**。

**残るリスク：** 位置スコアは投影の工学的近似であり、美術的な巨大都市/用途/奥行きは証明しない。初期の近景セルは主に道路2沿いのままで、主役の選定候補には既存道路1/2も含む。街区連続性と物理道路との自然な関係、投影した主役の上端、15/17秒の視界と18.5秒 off-roadを、実画素の目視で必ず検証。CIで最低1基も見えない・部分欠け・単調な近景が残る場合は **ART HOLD/REJECT継続、配置を修正する**。原作再現/main/Gold/本番未変更、Draft PR #46未マージ、正式Slope2認定0m、ART/HUMAN/PUBLISH/READY/MERGE HOLD。Work未使用。

## G4E-7CL — 完成した二度目の真正実ゲームWebGL、美術HOLD/REJECT確定（2026-10-26 JST）

**CL第2案の専用CI [#40282742498](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40282742498) SUCCESS**。原本BC B48道路7/B51-C動体28/gap52、正規240Hz BGスクリプトカメラの同一視点でBASELINE対第2案の12枚の**真正ゲームWebGL画像**取得、3テストPASS。[実PNG/JSON Artifact #12632568264](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40282742498/artifacts/12632568264)。初案との写真ピクセル変化は約2.9～9.1%に留まり、近景・中景の箱状都市感は抜本解決しない。新しい曲面の主役クレセントも画面上方に大部分が切れ、18.5秒のBG physicalRoad=offの空虚さも続く。**人間の実走行の美術PASSではない。CL第2案もART HOLD/主役級不採用**。物理・カメラ変更なし。次CMは建物の再大量配置ではなく、実240Hzのカメラ**画角内に収まる主役建築の位置と都市の連続景観**を最初に再設計する。3本目の道路やoff-road視点の誤判定を防ぎ、明確な都市品質を比較。main/Gold/原作/B48/B51/本番2サイト保護、PR#46 OPEN/Draft/未マージ、正式Slope2 0m、ART/HUMAN/READY/PUBLISH/MERGE HOLD。詳細[CI/CL 実画面検証文書](docs/G4E7CI_INTEGRATED_GAME_VSLICE_QA_JA.md)。Work未使用。


## G4E-7CL — 実ゲーム12画像で初案美術REJECT→主役級公共建築の第2案（2026-10-26 JST）

[専用CI #40237934943](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40237934943) はSUCCESS。実ゲームCanvasにて既存B48道路7/B51-C動体28/gap52/240Hz固有カメラ6姿勢の旧新12枚・6ペアPNG差分を真正取得。画素変化率9〜30%でも新都市の美術品質は不十分。15/17秒では箱塔と細柱の反復、18.5秒ではBG物理road=offで道路/街区が画面上部へ移り暗い空間が大きい。初案は**ART HOLD/REJECT**。こちらは実プレイでなくスクリプトカメラである。

今回の第2案では路肩の近景階数を変化、同質の中景塔を間引く、遠景のフレーム反復を低減し、厚い湾曲外殻と開口・広場・支持を持つ大規模な公共建築クレセント4基をPRIVATEだけで制作。[G4E-7CI/CLレポート](docs/G4E7CI_INTEGRATED_GAME_VSLICE_QA_JA.md)。実画面の美術審査は次のCIまで未実施。既存240Hz/カメラ/操舵/自然跳躍/速度、main/Gold/原作サイト/本番2サイト維持、PR #46 Draft未マージ、公式Slope2=0m、ART/HUMAN/READY/PUBLISH/MERGE HOLD、Work未使用。

## G4E-7CK — PRIVATE実WebGLのCI起動障害を実測から修正（2026-10-26 JST）

実計測 [G4E-7CI/CJ CI #40237327203](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40237327203) で物理/生成景観テスト3件PASS。一方、`package-lock.json`なしのリポジトリに`npm ci`を使用したEUSAGEでPRIVATEビルドを開始できず画像はゼロ。G4E-7CKで専用CIの依存導入を`npm install --no-save --no-package-lock --no-audit --no-fund`に置き換える**最小修理**を適用。修正後CIによる実ゲームCanvasの画像12枚・6画素ペアが出るまでART/HUMAN/READY/PUBLISH/MERGE全HOLD。既存240Hz/B48×7/B51-C×28/gap52/元カメラ・操舵・自然ジャンプ、A13、main/Gold/原作サイト/本番2サイト未変更。PR #46 OPEN/Draft/未マージ、正式Slope2 0m。Work未使用。詳細：[G4E-7CK CI root cause](docs/G4E7CI_INTEGRATED_GAME_VSLICE_QA_JA.md)。

## G4E-7CJ — 実ゲーム画像の同一カメラ保証＋6画面ペアの実画素計測（2026-10-26 JST）

G4E-7CIのTRUE GAME WebGL CI #40236394164がqueuedで未実行、画像は未取得。このまま美術採用へ進まない。GH Actionsは確認時点で34件queued・4件in_progress、混雑による証拠取得遅れを別途記録。12枚のBASELINE/新案を撮影するとき、**撮影時刻・BG240Hz由来の速度・道路・カメラフレームID・Canvas寸法が同一**であることを自動照合し、**元ゲームCanvas PNGの6ペアそれぞれで実画素差分・道路中央領域の変化率**を追加計測する。小さすぎる/道路中心を覆う視覚変化は警告。検査のTECH成功や変更画素率を美術PASSと混同しない。元物理240Hz/B48×7/B51-C×28/gap52/速度・操舵・自然ジャンプ・カメラ、A13、main/Gold/原作・本番2サイトを変更せず、PR#46 OPEN Draft/未マージ、公式Slope2=0m、ART/HUMAN/PUBLISH/READY/MERGE HOLD。参照：[G4E7CIとCJのレビュー手順](docs/G4E7CI_INTEGRATED_GAME_VSLICE_QA_JA.md)。Work未使用。

## G4E-7CI — B48真正ゲーム画面に初めて近・中・遠の連続都市をPRIVATE実装（2026-10-26 JST）

**実装済み/審査待ち**。独立3Dの原本探し→本物のゲームWebGLへ移行。新しい`web/p101-w9c2-g4e7ci-integrated-streetscape.mjs`では実BC road2に近景開口店舗/公共庇、中景の段丘状住居・空いた翼間、遠景の非対称稜線を連続配置。B48×7・B51-C×28・gap52・240Hz/操舵/自然ジャンプ/元カメラを凍結し、PRIVATEのみ `g4e7ci=streetscape`。元BG 240Hzの6点×BASELINE/新案を**本物のゲームCanvas WebGL**で同条件比較するCIを実装。**CI実行前にART合格は出さない**。写真/外部3D著作権の導入なし。デフォルトOFF、main/Gold/原作再現/本番2サイト不変更。PR #46 OPEN/Draft/未マージ、正式Slope2 0m、ART/HUMAN/READY/PUBLISH/MERGE HOLD、Work未使用。 [手法・QA](docs/G4E7CI_INTEGRATED_GAME_VSLICE_QA_JA.md)。


## G4E-7CH — 原本街路GLB真正12WebGL画像によるSILHOUETTE審査（2026-10-26 JST）

**技術：PASS / 対象単独街路の主役級ゲームシルエット：HOLD（この2配置では不合格）/ 本番ゲーム画質：未検証。** [専用CI #40234897063](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40234897063) SUCCESS。真正上流8,040,396byte／Git blob SHA 92e2ed214034c9cd7bed5248991924d3af9a6d24を照合したうえで、MeshoptDecoderを使いglTFから**192描画メッシュ**を読込。元BGの真240Hz起点から得た6つの脚本カメラ×100m/240mの2提案配置の12枚の真正Chromium WebGL2画像と画素JSONを保存。[7日保持の画像とJSON](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40234897063/artifacts/12614657186)。原本SHA256 f59104c101642527b0e15db64820c4584f41e465b1fa019ee8a52b520de1c660。原モデル・元テクスチャはDOPAGAKI GitHubに保存せず、独立無地材質のみ。

- 実WebGL **ピクセル差分**：100m 6視点0.01082〜0.35086（中央値**2.8035%**）、240m 0.00628〜0.03905（中央値**1.064%**）。100mのtrue-pinch18.5sで17.774%、pinch-switch18.5sで35.086%。元G4E-7CGの200m中央値1.4305%から画角上の改善例が存在。ただし**距離・モデル・画角をそろえた公平な美術品質比較ではない**。また15sでは両配置とも約1%以下で、視界での存在感は強く変動。
- 12枚を目視：**二列の角張った高層/住宅ブロック、真正都市として連続した近中遠景・道路接続・看板/店舗・生活感はこの元材質なしの画角では成立していない。** 100mで大きく映る最終18.5sは屋根/壁の広面積が支配的で、旧G4E-7CG同様、画素面積を美術合格と誤認できない。**このモデル1件をその2仮配置で主役級の未来都市へ昇格させる案はSILHOUETTE HOLD/REJECT**。ただし素材から外された実PBRやNeon Zenith全都市レンダリングの美術品質まで否定しない。
- **品質・効率の方針転換**：単体GLBの探し直しで工程を費やし続けない。成功事例の本質は**元作者造形の近景街路＋適切な中景ファサード＋遠景の変化に富んだ都市質量＋照明・霧・道路方向の統合**。この方法を現在のDOPAGAKI本来のB48道路／カメラへART-FIRSTで合わせて評価する。プロシージャルでも「単純箱を大量複製して街に見せかける」方式だけ禁止、技法そのものを禁止しない。G4E-7CIでは最初から真正ゲーム画面の一つの短い垂直スライスの美術目標・権利経路・独立QAを具体化。適切な素材権利を解決する前のゲーム統合・公開は禁止。
- **保護**：B48×7/B51-C×28/gap52/240Hz、速度/操舵/自然ジャンプ/元カメラ、A13 40%・細道10〜16m、main/Gold/原作Slope再現/本番2サイト不変更。正式Slope2 0m、ART/HUMAN/PUBLISH/READY/MERGE HOLD。PR #46 OPEN/Draft未マージ、Work未使用。[検証詳細](docs/G4E7CH_NEON_DISTRICT_STREET_QA_JA.md)。

## G4E-7CG — 12真正WebGL画素を目視審査：主役都市としてのシルエット不合格（2026-10-25 JST）

**[専用CI #40198872340](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40198872340) SUCCESS。** 前工程の正規配布原本Market_Day.glb（同じSHA256）を一時取得し、全元テクスチャと元マテリアルを描画前に独立無地材質へ置き換えて、**本物のChromium WebGL2ラスタ**で12視点のスクリーンショットと画素差分を作成。G4E-7BGの本物の240Hz物理起点から得た2種×3時点=6カメラ姿勢、設置距離200mと320m。**これは本ゲームの道路・HUD・障害物・元PBRを含まない独立WebGLであり「実ゲームで画質向上」とは言わない。** [7日間の12枚画像とJSON artifact](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40198872340/artifacts/12601685349)。

- 元glTFメッシュ数13、WebGL描画メッシュ46（異なる集計対象）。いずれも真正GLBによるデータ。色が変わった**WebGL実画素比率**：200m 6視点で最小0.678%／中央値**1.4305%**／最大6.192%、320mは最小0.452%／中央値**0.739%**／最大1.791%。これらは「表示時と非表示時でRGB差があるピクセル」、面積/美術点数や遮蔽率そのものではない。先のCBのAABB横幅35.08%が本物の投影ピクセル占有を全く代表しない失敗を**定量的に再確認**できた。
- 12枚の実画像を目視：近い200mの終盤18.5sでも、**孤立した水平住宅状の長い箱/台座と大きな空虚な背景**に見える。320mの早期時点では遥か遠くの小塊。交通・住居・近中遠景の巨大SF街路景観を構成できていない。**「この単一資産をこの2配置で主役級遠景都市にする」方向はSILHOUETTE REJECT。** ただし元PBRや都市への立体配置は表示していないため、原作者のモデル全体を低品質と断定しない。
- よって**このモデルに追加のTextures.com権利精査・PBRレンダリング・ゲーム統合のコストを現段階ではかけない**。過去のBX/BY/BZ/CA小修正・箱増築/大量配置へ戻らない。新たな品質基準：「正式ゲーム内で見せるための都市の大質量・通り・遠近が、まず権利安全な真正WebGL画素で成立する」こと。次工程G4E-7CHでは登録不要で**形状そのものが巨大な未来都市として成立する完成建築**を1件に絞り、早期に本物の画素と道路方向を検証する。定量AABBゲートだけで合格させない。
- Spectra原本のCC0にはTextures.com由来画像の権利例外があり、**ゲームやGitHubへの元素材再配布は依然HOLD**。ART（実ゲーム）・HUMAN・PUBLISH・READY・MERGEいずれもHOLD。正式Slope2=0m。240Hz/B48実道路7/B51-C実動体28/gap52/高速操舵・自然ジャンプ/元カメラ/A13/main・Gold・原作Slope・本番2サイト不変更。PR #46 Draft未マージ。Work未使用。

## G4E-7CF — **正規無登録GLB取得・実物技術検査PASS、画面美術は未合格**（2026-10-25 JST）

**CI [#40197574426](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40197574426) SUCCESS。** GitHub公式Spectra Cities/SourceCityToolkit_glb のMarket_Day.glbを、コミット固定URLで一時ダウンロードし、17,786,532バイトと上流Git blob SHA ee3334d9f13f63e38a1f813eee8eb9e7c720b4e1 が完全一致した。GLB原本SHA256 **6137dfaf678785a2f4e4226d0cddc3032086f68a99e2c2793491058d64291c57**。実GLB 13 mesh。元G4E-7BGの正規240Hz/B48道路7・B51-C動体28/gap52の6カメラを使用した既存CB投影検査に5仮配置すべてが完走した。**今度こそ実ファイルに基づく技術測定。** ただしGLB原本自体は本リポジトリ/CI公開成果物に保存していない。監査数値JSONは[短期Artifact](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40197574426/artifacts/12600598103)（7日保持）。

- 距離200m（左 -0.65）で6カメラ中最大フレーム横幅35.08%、320m（左 -0.55）18.50%、450m（左 -0.55）12.34%、660m（左 -0.55）8.26%、320m（右 +0.70）18.50%。**最大値であり平均値やレンダリングされた実画素ではない**。200mでもAABB外接画面面積が小さすぎる警告、近配置で道路中央の視界干渉警告があり、特に遠方では過去の小シルエット問題が残る。つまり「配布原本の実在・GLB読込・投影 TECH PASS」であり「巨大未来都市として美術合格」とは全く言えない。
- 上流はCC0を主張するが、**textures.com由来の画像には著作権/再配布例外**がある。実3Dに含まれる第三者テクスチャの権利は独立確認できていないため、主役素材のゲーム統合・再配布は**権利HOLD**。最終IP・PBR・視認性・WebGL真正ゲーム描画・人間試走はいずれも未審査。**ART NOT TESTED / WEBGL NOT TESTED / HUMAN HOLD / PUBLISH READY MERGE HOLD、正式Slope2認定0m。**
- これは「アカウントを増やしたくない」というユーザーの条件を満たす、実際の無登録オリジナルGLB調達ルートの実証。ただし完成ゲームの画質は**未改善**。低品質の箱・遠景素材を大量に増やさず、次のG4E-7CGでは実際のスクリーンショットと、ライセンス問題のない主役級モデルに絞り込む。既存240Hz/B48×7/B51-C×28/gap52/高操舵/自然ジャンプ/カメラ・A13/main/Gold/原作Slope・本番2サイト不変更。PR #46 Draft未マージ。Work未使用。[詳細監査と数値](docs/G4E7CF_SPECTRA_CAMERA_SOURCE_AUDIT_JA.md)へ。

## G4E-7CE — 無登録で取得可能な実作者未来都市モデルを確認（2026-10-25 JST）

**確認済み：新規Epic/Sketchfab登録をせず作者正規配布元から無料のGLB入りZIPに進める導線を発見。ただしZIP実バイナリはこの環境の外部DNS不通により取得できていない。SOURCE-LISTING PASS（無登録候補発見）／ORIGINAL GLB 0／SHA UNKNOWN／NATIVE SIX-CAMERA NOT RUN／TRUE WEBGL NOT RUN／ART/HUMAN/PUBLISH/READY/MERGE HOLD。** 詳細とソース・失敗リスク・次の1回の原本QAは [G4E-7CE無登録建築原本・美術事前審査](docs/G4E7CE_NO_ACCOUNT_FUTURE_CITY_ARTIST_SOURCE_SCREEN_JA.md)。

- **有力な実物検証候補**：作者Dreamloft3D [Tron Gothic City](https://dreamloft3d.itch.io/tron-gothic-city)。作者は、かつてSketchfabで公開したモデルを自分のitch.ioに移したと説明。無料購入画面に **「No thanks, just take me to the downloads」** が存在。CC BY 4.0表示、ZIP6.6MB、GLB/BLEND/FBX/OBJとPBRテクスチャの掲載情報、作者制作の公開画像は確認したが**真正バイナリの実取得・権利完全検査・ゲーム画面美術PASSではない**。Tron由来の意匠が第三者IPを侵害しないことは不明、低い高速カメラでは暗い大壁面が目立つ可能性が高く、**まだ採用禁止**。tomato3元Sketchfab候補は参照として残し、登録を要求しない。
- **低適合を除外**：NVIDIA ORCA Amazon Lumberyard BistroはCC BY 4.0・実街路の高品質参照だが現代街かつ外装約283万三角形で重量が大きい。GrandWhis Neon Frontは無登録・104MB/153万三角形だがAI補助制作・平坦建築で主役級には不適。JadeRealms H-14は単なる単体回廊。数と出典の良さだけでART承認せず、BX/BY/BZ/CAの箱や薄板の大量生成に戻らない。
- **G4E-7CFの前提**：無登録6.6MB公式ZIPを適法取得できた場合のみ、原本/作者/license/テクスチャ/第三者IP/SHA256→真正BG 240Hz6視点への複数仮配置→**本物のPRIVATE WebGL画像**→人間の美術審査。元ゲームのB48×7/B51-C×28/gap52/240Hz、速度/操舵/自然ジャンプ/カメラ、A13のSlope2方針、main/Gold/原作Slope/本番2サイト、PR #46 OPEN Draftを保護。正式Slope2認定0m。新規ゲーム実装・巨大Blender/CI・マージ・公開なし。Work未使用。


## G4E-7CD — 正規建築原本の取得経路再確認・高品質代替スクリーニング（2026-10-25 JST）

**結果：SOURCE ACCESS RECHECK 完了、真正の新規都市GLB 0件・テクスチャ/著作権完全確認0件・ゲームWebGL新規映像0件・ART NOT TESTED。主役建築の美術改善は未実証。** 第一候補tomato3《Futuristic Buildings》（Sketchfab公開欄CC Attribution、約121.4k tris）は維持。作者主張に基づく有望候補だが**正規Sketchfabログインを要するため今回未取得**。代替Pasha《Cyberpunk city》（公開CC Attribution、約295k tris、作者主張ゲーム用・高品質テクスチャ）は参考のみで認証障壁も同じ。AI制作モジュール群をCC0だからと主役建築に流用せず、BX/BY/BZ/CAの劣化手法を再開しない。出典・権利・一度の正規取得と検証手順は [G4E-7CDアセット取得ゲート](docs/G4E7CD_AUTHORIZED_HERO_CITY_ACQUISITION_JA.md) に固定。

- **次の唯一の依存条件**：Sketchfab等から**作者/正規ライセンス/テクスチャを伴う正当なオリジナルZIP/GLB 1件**を手に入れた場合のみ、元原本と変換GLBを別SHAで記録し、既存CC権利ゲート→CBの6真正240Hzカメラ複数仮配置→真正PRIVATE WebGL比較→美術/人間審査の順。閲覧ページ/ポリゴン数/ダミー検査だけでART PASSは絶対に出さない。実原本未取得のため新規Blender/長時間Chromiumジョブを走らせない。
- **継続固定**：240Hz、B48実道路7、B51-C動体28、gap52、A13 Slope2方向性、元速度・操舵・カメラ・自然跳躍は未変更。main・Gold・原作再現・本番2サイト未変更。正式Slope2=0m。PR #46 OPEN/Draft未マージ。ART/HUMAN/PUBLISH/READY/MERGEすべてHOLD。Work未使用。G4E-7CEは実原本取得時のみ実体QAへ進める。


## G4E-7CC — 有料ゲームに使える完成建築原本の選定・権利ゲート（2026-10-25 JST）

**判断：主役級に近い「実在の作者がBlenderで制作した街路＋建物群」1候補を正式な次の調達先として選定。ただしSketchfabの認証なしで合法的に3Dファイルを取得できないため、モデルを入手・表示・技術PASS・美術PASSしたとは言わない。SOURCE RESEARCH 完了／ART NOT TESTED／ゲーム実WebGL未実施／HUMAN・PUBLIC・READY・MERGE HOLD。**

- **優先する本物の原本**：[Sketchfab tomato3《Futuristic Buildings》](https://sketchfab.com/3d-models/futuristic-buildings-adf97f38cda44e67a44994fff1cb4d58)。作者記述ではBlender制作・GLB形式・約121.4k三角形で、**屋上テラス、店舗、看板、交通信号、地下道路入口等を含む「建築・都市のまとまり」**が特徴。窓や構造部品だけでなく、人が建築/道路/生活を使う関係を最初から描いているため、BX→CAより方向性は適切。ただしこれは**作者の公開ページ上の説明**であってGLB実物・人間制作/第三者テクスチャ権利・ビジュアルの独立実証ではない。見た目の最終採択は未実施。
- **補助候補**：[Akshita_eb Dhaka《Cyberpunk Shop》](https://sketchfab.com/3d-models/cyberpunk-shop-4cfc925db2ec4634b6e31e550dabe17f) は制作者の説明でSubstance Painter PBR・ダクト・配管・看板を備える約32.3k三角形の**近景店舗**。 [nenkea《Sci-Fi Building 1》](https://sketchfab.com/3d-models/sci-fi-building-1-da4d7f4c35be49baa287af0782c2171b) はレースゲーム用に作ったと記述するガラス建築・エレベーター、約35.8k三角形。**建築の中心候補ではなく補助として控える**。いずれもCC Attributionの公開表示だが、正式版数・モデル中の第三者素材等は元アーカイブで再照合が必要。
- **重要なダウンロード制約**：[Sketchfab公式Download API](https://sketchfab.com/developers/download-api/downloading-models)によれば認証されたアカウントが必要。一般公開画像、表示用キャッシュ、開発者ツール等から抽出する回避は禁止。現在このチャットには正規のログイン権限と真のGLBファイルがないので、**GitHubに存在しないファイルを保存済みと主張しない**。実物未取得の段階で偽のレンダリングやモデル表示は作成しない。
- **候補出典・権利・使用適性を[機械可読レジストリ](docs/G4E7CC_VERIFIED_ARCHITECTURE_SOURCES.json)に記録**。全候補にオリジナルページ・作家名・CC Attributionの表示・説明/リスク・原本SHA未取得を明示。[source gate](scripts/p101-w9c2-g4e7cc-vetted-artist-source.mjs) + [安全テスト](tests/p101-w9c2-g4e7cc-vetted-artist-source.test.mjs)を既存の**BP軽量CI**に統合し、未取得素材・NC素材・古いCAのGLBを新しい原本と偽装して美術承認しない。今後真正ファイルを正当に入手した場合のみSHA256照合と[CB真正240HzカメラGLB事前検証](scripts/p101-w9c2-g4e7cb-native-asset-preflight.mjs)を実施する。実WebGLとアート審査はさらに別ゲート。
- **停止/効率**：Quaternius/Kenneyの低ポリ量産、BYの部品を箱に貼る、BZ茶住宅の大量複製、CAの薄い梁/曲面の微修正を再開しない。3D実物が手元になければ長いBlender/Chromium CIは回さない。調達先の品質、ライセンス、実建築・道路・人間スケールを優先。正式Slope2=0m。元240Hz/B48実道路7/B51-C動体28/gap52/原カメラ/操舵/速度・main・Gold・本番2サイト不変更。PR #46はOPEN Draft未マージ。Work未使用。

## G4E-7CB — 初めて「見えているだけ」を落とす実240HzカメラGLB事前審査 / TECH PASS（2026-10-25 JST）

**最新結論：新美術の合格・新道路の完成ではない。低コストのGLB受入/フレーム占有診断 TECH PASS。CA-R2の未来都市美術ART REJECTは維持、WebGL実描画・人間試走は未実施/HOLD、正式Slope2 0m、公開/READY/マージ禁止。**

- **過去の失敗からの工程転換**：BX=低ポリ模型市街、BY=高級CC0部品を箱に4個貼るだけ、BZ=普通の茶系集合住宅、CA=内部/ガラスと曲面に改善はあるが、低い高速カメラでは依然暗い面・都市の広がり不足。これ以上低価値な新箱/薄板/小修正＋長時間Blender CIを量産することを中止。新建築前に**実際の車載/ボール追尾カメラで見えるかをチェック**する。
- **既存の実際の物理カメラを再利用**：[G4E-7BG開始地点00からの正規240Hz/P96スクリプト軌道](scripts/p101-w9c2-g4e7bg-native-visual-frames.mjs)はB48実道路7/B51-C動体28/元gap52でtrue-pinch / pinch-switch の各15s/17s/18.5s＝**6視点**を固定。本物のゲームカメラの位置・方向・速度103〜126m/sを流用するが、**Playwrightの実描画画像ではない**、また人間操舵・遊びやすさを保証しない。
- **実装**：[G4E-7CB GLB native preflight](scripts/p101-w9c2-g4e7cb-native-asset-preflight.mjs)、[負例固定テスト](tests/p101-w9c2-g4e7cb-native-asset-preflight.test.mjs)。GLB 2.0実シーンノードのTRS/親子変換を含む世界座標AABB各8角を取り、既存BGの真正240Hzカメラに投影。画面内頂点率だけではなく**横幅・縦幅・外接面積・道路中央付近の角点・130m以内**を別々に診断。いずれも美術、実画素、閉塞率、当たり判定の承認根拠とはしない。外部ダウンロード、Blender、Playwright、実ゲーム修正不要の軽量Node試験。
- **実測/失敗の再現**：既存のART REJECT済[CA-R2 GLB](artifacts/private/g4e7ca-rift-exchange/G4E7CA_RIFT_EXCHANGE_ART_ONLY.glb)を意図的な負例とし、18.5秒true-pinchカメラ前方660m・視界左側の仮位置で6視点に投影。実モデル893メッシュインスタンス/7144 AABB角点、実GLB外接幅71.3268m・高さ59.6339m・奥行81.4m（Z-upではなく**glTF Y-up**）。**6/6視点で全AABB角点が画面内**でも、フレーム横幅占有わずか **3.79〜4.93%**、画面面積の外接矩形も **0.18〜0.33%**。つまり「100%画面内」に騙される従来判定は全く不十分。4つの診断フラグ、TINY 12%未満、2.5%未満の占有、頂点率偽陽性、路面領域への潜在干渉を出す。**あくまで一つの仮配置であり、CAの最適配置や実描画の実証ではない。**
- **QA証拠**：[再利用のBP intake GitHub CI #40189100352](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40189100352) **SUCCESS**。既存の軽量ワークフロー[artist GLB intake](.github/workflows/p101-w9c2-g4e7bp-artist-intake.yml)にCBを接続して新ワークフローなし。実行アーティファクト `g4e7cb-real240hz-camera-preflight-NOT-art-acceptance` に数値JSON保存。親ノード変換、回転、改ざん240Hz、実CA GLBと再現性を自動テスト。パフォーマンス指標/画面内率が高くてもART PASS禁止。
- **次の実制作ゲート**：新しい巨大都市モデルを機械的に何十回も生成しない。実際に建築的完成度が高く、出典と利用可能範囲が確認できる**本格的な人間制作3Dの一単位**（あるいは直接DCCで十分に完成させたもの）を選び、まずCBで実ゲーム視点の大きさ・位置・道路中央干渉の疑いを調べる。小さすぎれば高価なCycles撮影前に不採択。幾何の目安に通れば**元240Hzカメラでの真正WebGLスクリーンショットと人間による美術審査**、そこからのみ近・中・遠景を持つ100〜150m単一区間へ進む。作品全体の見た目だけでなく近景での細密さ、交通/公共生活、実路面への接続を確認。Poly Havenは素材/部品、QuaterniusのStylizedは補助候補であり、高品質な主要建築と取り違えない。Blender Studio Charge等の映画向けデータはライセンスとリアルタイム利用可否の個別確認なしにゲームへ取り込まない。
- **保護と効率**：元240Hz B48×7/B51-C×28/gap52/操作/速度/カメラ、main・Gold・原作Slope・本番2サイト不変更。CBはPrivate・READ-ONLYでエンジンに統合しない。既存スクリプト・CIの再利用で重複管理を避ける。Draft PR #46 OPEN/未マージ。正式Slope2=0m／ART HOLD・HUMAN HOLD・PUBLISH/READY/MERGE FORBIDDEN。Chat＋GitHubのみ、Work未使用。次回も最新HEADを再確認。

## G4E-7CA — 未来SF複合建築《RIFT EXCHANGE》実3D R1/R2・6視点比較（2026-10-25 JST）

**最終判断：真正Blender/GLB/CC0素材 TECH PASS、単体の建築美術R2は部分改善により研究ART HOLD、ゲーム用巨大未来SF都市としては明確にART REJECT。B48実カメラ・人間試走ともNOT TESTED/HOLD。正式Slope2認定0m。公開、PR Ready、merge 全禁止。**

- **開始点**：BZ-R2で原本147部品の3mグリッド組み立ては可能となったが、見た目は茶系集合住宅で巨大未来都市に遠い。単なる別の低ポリ街区や箱の大量複製は止め、50〜60m程度の都市公共交通を兼ねる非対称1建築《RIFT EXCHANGE》を新規に**独立Blender美術研究**。左右の実床・支持柱、内部公共吹抜け/昇降路、3連絡橋、1高架交通、ガラス面、厚い上昇屋根をモデル化。ただし施工・物理道路は一切作っていない。編集可能ソース：[CAオリジナルBlender Python](scripts/p101-w9c2-g4e7ca-rift-exchange-architecture.py)。
- **権利を検証したPBR**：Poly Haven公式CC0の[Concrete Tile Facade](https://polyhaven.com/a/concrete_tile_facade)と[Blue Metal Plate](https://polyhaven.com/a/blue_metal_plate)を公式APIから1K Diffuse/Roughness 4枚取得しSHA256と原本配布URLを記録。[真正編集可能BLEND・GLB・6 Cycles画角・PBR根拠・SHA256](artifacts/private/g4e7ca-rift-exchange)。配布元API利用表記は「Powered by Poly Haven」。幾何形状はOpenAIによるBlenderスクリプト造形であり、手モデリング/人間制作品とは主張しない。
- **R1制作**：まず屋根と大幅に開いた床だけで構成され、真正画像では窓ガラスが床外周から浮いている、室内が暗い、広いデッキが未完成に見えるなどが判明。**R1 ART REJECT**。初回 CI #40184941581 は6真正Cycles・GLB生成まで完了したが、短い有効JSONを「2000バイト未満＝欠落」と誤判断して失敗。改行修復も含め正規[CI #40185335466](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40185335466) SUCCESS。R1原版の画像/モデルはコミット `792d35103632af16c2cb39f3f9e33f55f0ba9bf4` で保存。**失敗したCIをPASSと偽装しない**。
- **R2修正**：中心の直方体を増やすのではなく、左右の実床に取り付く曲面沿いの連続側面ガラス、前方ガラス、階間の荷重/雨仕舞い帯、構造と接続する立体日除けを作り直した。上昇屋根の帯も厚く幅を持たせ、前版と同じ6視点で真正画像化。[R2真正CI #40186265646](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40186265646) **SUCCESS**。R2保管コミット `b045b0b8cb04746eff1d9100bc816a7a2bc0f7af`、保存済みJSONでは10階床プレート・3連絡橋・高架交通1・ガラス外面88・支持部材59。**数は技術確認用に限定し、美術/使用可否の代理にしない**。
- **[R1/R2 固定画角の真正Blender画像比較（PR #46）](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46#issuecomment-6396782288)**：R2のOBLIQUE/AERIALでは、空中に孤立していたガラス板の多くが連続した建築外面になり、一棟としてのまとまりは確かに前進。しかしSTREET_APPROACH / STREET_LEFT / ENTRANCEでは道路両側が暗い大面に見え、走る先の都市密度・人間活動・外装意匠の豊かさ・長距離の街路/交通接続がまだ著しく不足。巨大な上昇弧も高度な未来建築というよりシンプルな装飾弧の印象が残り、背面は未完成な階層。スタジオで見える改善は実際のプレイヤー視界のPASSではない。**R2でも商品級の巨大SF都市はART REJECT**。研究建築単位の連続性のみART HOLD。
- **効率上の反省・停止条件**：外見を同じ薄い板/輪/梁/窓で部分修正するR3反復を**原則停止**。Blenderに大量のCube/Curveを追加する工程数では品質が上がらない。より高品質な**人が設計した建築の本体メッシュ、意図的に仕上げた現代建築の外装と生活空間、または本格的な直接編集型の美術制作手法**を調査/検証し、**最初から低いゲーム進行方向のカメラ構図**と対応させる。外部アセットの権利確認、編集可能な真正3D、複数方向の同一条件比較は引き続き必須。近景で建築/都市が美術的に成立しない間は100〜150m街路の大量生成、500〜800m B48 Phase C PRIVATE統合、正式コース昇格をしない。実ゲームの正規240Hz/WebGL視認性と人間のプレイ体験は後で別々に審査。
- **永久保護**：このCAはPRIVATE Studio ART-ONLY、元のBW/BX/BY/BZ資産とB48実道路7・B51-C実動体28・gap52・正規240Hz・操作/速度/カメラ/自然跳躍を一切不変更。main、Gold、原作Slope再現、両本番サイトも不変更。Draft PR #46はOPEN/Draft/未マージ。正式Slope2認定0m、ART/人間QA/PUBLISH/READY/MERGEすべてHOLD/REJECT。Workは利用していない。**別チャットへの長文引き継ぎ再作成不要。次回も現行GitHub HEADを再取得すること。**

## G4E-7BZ — 3m原本モジュール組立・21m建築マイクロスライス R1/R2 真正5視点審査（2026-10-25 JST）

**確定判定：REAL CC0/Blender/GLB技術PASS／21m単体の建築的連続性はR2で改善・研究ART HOLD／有料インディー級の巨大未来SF都市としてART REJECT／B48真正240Hzゲームカメラ未実施／人間実試走HOLD／正式Slope2認定0m／公開・READY・MERGE禁止。**

- **根本原因の発見**：BYで取り込んだ[Poly Haven公式の住宅ファサード素材](https://polyhaven.com/a/modular_urban_apartments_facade)は完成した建物ではなく、実際には部品を横並びにした**147メッシュのモジュールカタログ**。これをそのまま拡大配置して都市に見せかける方法は成立しない。BW/BX/BYをさらに量産せず、最初に原本部品を実際の壁・窓・扉へ組み立てる方式に転換。
- **本物の原本調査**：[元部品の真正Blender 2画像・寸法/マテリアル台帳・原本PBR](artifacts/private/g4e7bz-facade-lab)を作成。[元部品の検査CI #40181970715](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40181970715) SUCCESS。住宅キット147メッシュ、元の幅51.53m×奥行6.665m×高さ17mという数値はキット展開の外接寸法であり、一棟の建築寸法とは違う。3m幅の壁・独立窓・扉・柱・軒飾り等をオリジナルCC0の真正ジオメトリ/PBRのまま利用。[元部品検査ソース](scripts/p101-w9c2-g4e7bz-real-facade-study.py)。
- **実制作**：[組立Blenderソース](scripts/p101-w9c2-g4e7bz-assemble-inhabited-facade.py)で21m×4層の《TIDAL PORTICO》住宅/公共入口試験を独立制作。真正な3mモジュールを実際に248枚程度ではなく**247個**組み立て、窓60カ所、出入口3カ所、内部床8スラブ、階段/歩行者接続4をモデル化。これはコンポーネント数の技術記録であって、室内歩行可能性や映像品質を証明しない。元BYの都市・物理本体は全く編集せず、一建築単位のスタジオ検査。
- **初版R1**：[制作CI #40182523342](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40182523342) SUCCESS、編集可能.blend・GLB・真正Cycles 5視点を保存。しかし真正画像では階間に広い黒い水平空洞、入口が閉じたまま、屋根や周辺が無表情で、建築美術HOLD。**R1を完成品と扱わない**。旧コミット `23afb00a9bf05677f6bfbf901fb55999ed8f6786` で証拠復元可能。
- **R2 修正**：元3m高さパネルの上下にできる約1mの水平欠落を専用の厚みある構造・外装帯で接続、中央実3m開口に少し開いたガラス戸＋支持庇＋奥のロビー照明を設け、模型的なスタジオ人型マーカーを削除し実人間アイレベルの全体構図も改善。初回 [CI #40183144814](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40183144814) はR2の真正5レンダリング・GLBまで完走後、`UNJUDGED_R2` と `UNJUDGED` の**メタデータ表記不一致**のみで失敗。表記を整合させた最終[CI #40183179370](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40183179370) **SUCCESS**。最終[編集可能Blender・本物のGLB・真正5視点＋SHA256](artifacts/private/g4e7bz-facade-lab)を保存。BlenderソースにはPBR画像をpackしている。初版とR2の真正画像は[PR #46の安定SHA付き画像比較コメント](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46#issuecomment-6396382250)から閲覧。
- **R2の本当の美術結論**：視点をそろえて目視し、階間の黒い隙間が構造帯になり建築の上下連続性が改善、中央入口も近景で見えるようになった。一方で繰り返す窓、普通の茶系集合住宅の意匠、薄いバルコニー、屋上の平板、弱い内部生活感、交通の孤立、周囲の未来都市・近中遠景が依然不在。**「建築部品の扱い」の技術検証としては価値があるが、近未来/巨大都市/ゲーム美術としてART REJECT。単体実建築の美術研究としてはHOLD。** 500〜800m統合や100〜150m街区への量産・正式道路上の表示を進めない。
- **次の制作・撤退ゲート**：この茶色い住宅ファサードを多数コピーして巨大都市を作るのは禁止。原本組立の技術は再利用しつつ、**適正ライセンスのモダン／未来SFに見える建築PBR/メッシュ部材**を別途実際に確認して、建築一単位の入口・人間の生活/交通・荷重支持・精密な外装を本当に目視で成立させる。形が成立するまで1kmの大量装飾へ戻らない。美術ゲート後にのみ代表する走行方向の100〜150m連続街区、次いでB48実道路の500〜800m PRIVATE統合を考える。正規240Hz/WebGL元カメラ・人間による高速プレイの視認性と面白さは依然未証明。Workは使わずChat＋GitHub、既存の工程表とQA分類を保持。
- **既存ゲームの保護・引き継ぎ**：B48実道路7・B51-C実動体28・gap52・240Hz・速度/操舵/自然跳躍/カメラ・main・Gold・本番2サイト・原作Slope再現は一切変更していない。PR #46 OPEN/DRAFT未マージ。正式Slope2=0m。Human/PUBLISH/READY/MERGE=HOLD。新チャットもこの固定URLと実HEADを最初に照合。日次引き継ぎ全文の作り直しは不要。

## G4E-7BY — 高精細CC0ファサード＋都市交通を試した真正Blender7視点 / 美術REJECT（2026-10-25 JST）

**結論：TRUE BLENDER/CC0 ORIGINAL FILE TECH PASS／ART REJECT（BXより後退）／AUTHENTIC GAME CAMERA NOT RUN／HUMAN HOLD／PUBLICATION FORBIDDEN。** 本節は画像を本当に目視した後の結果。工程増加そのものを進歩と扱わない。

- [真正制作CI #40180712675](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40180712675) **SUCCESS**。初回はジョブ-level `runner.temp` 不正でワークフロー失敗、2回目はBlender4マテリアル入力名、3回目はrunnerにOpenImageDenoiser非搭載で失敗。修正後、Poly Haven公式APIから **CC0 1.0** の `modular_urban_apartments_facade`（1K glTF、依存13）と `modular_factory_facade`（同16）を真正取得し、編集可能.blend／GLB／独立真正Cycles 7視点／SHA256マニフェストをPRIVATE開発ブランチへ保存。アセット原本自体は外部配布元に帰属し、ソースファイル・取得API・SHAと著作権表記は保存。Poly Haven API利用のため *Powered by Poly Haven* 表示を計画に含める。
- [BY実制作ソース](scripts/p101-w9c2-g4e7by-urban-pbr-corridor.py)、[BY真正7画像と編集可能3D](artifacts/private/g4e7by-urban-pbr-corridor)。ブランチの旧BW-R3・BXファイルは無変更。旧BXと**同じスタジオ画角**のAPPROACH／FORWARD_300／FORWARD_700／OBLIQUE／FRONT／AERIAL等を保存。ただしゲーム240Hz起点00の実走カメラで撮影したものではない。
- **具体的な失敗**：BYの実APPROACH/FRONTでは、シンプルな白い角柱・直方体の集合と細い発光軌道が画面を占め、建築内部・高密度街路・迫力ある背後景観に至らない。300m／700m先の視点でも疎な白箱と空白が支配。Poly Havenの高品質なオリジナルファサードは少数かつ場面に対して非常に小さく、都市全体の造形を改善しなかった。**BXのほうが実際の街並みとしてはまだ読める**。高級インディーゲーム級の美術としてBYを明確にREJECT、3Dの手法・素材取得TECH PASSと取り違えない。
- **根本原因**：第三者の高品質ファサードを4配置しただけで、主質量を旧来のスクリプト生成ボックスに依存した。連続ガイドレールは交通ネットワークの証明ではなく、都市生活・アクセス・公共空間を実際の建築として作れていない。**この方法の同一スケール反復、ボックス追加、CI目的の連続コミットは禁止**。

**次の制作ゲート・再転換（方針確定）**：最初に実際のソース3Dのモジュール寸法・階・屋内外・PBRを単体で独立確認し、10〜30mの**ひとつの納得できる外壁＋入口＋支持構造＋生活層**を本物の建築として構築する。巨大箱の外側に表面素材だけ貼る作り方はやめる。次にその高品質モジュールを配置する**近景100〜150mの実走行方向の代表断面**を1つ丁寧に制作・審査する。視覚的に建築品質が成立しない間は1km全体・建物数量への拡張をしない。ゲームのB48 500〜800m/Phase CへのPRIVATE統合も美術ゲートが成立するまで禁止。真正Cycles**だけでなく**最終採択前に正規240Hz/WebGL実カメラと人間テストが不可欠。素材出典・CC0ライセンス・原本SHAの追跡は必須。

**恒久保護**：B48実道路7／B51-C実動体28／gap52／正規240Hz／元操作・自然ジャンプ・カメラ・速度、main、Gold、原作Slope再現、本番2サイト不変更。PR #46はOPEN/DRAFT/未マージを維持。**正式Slope2=0m／ART REJECT／HUMAN HOLD／PUBLISH・READY・MERGE FORBIDDEN**。Work未承認のまま使用していない。次回も必ずGitHub現行HEADから開始。

## G4E-7BX — 人間制作CC0建築の取り込み・実7視点審査（2026-10-25 JST）

**確定証拠**：[Blender制作CI #40177368056](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40177368056) SUCCESS。最初のCI失敗はアセット解凍パスの不一致で、コミット9a89d9e6b2baa72ccac059193359710131ed9aa7で修復。Kenney公式[City Kit (Commercial) v2.1](https://kenney.nl/assets/city-kit-commercial)をCC0 1.0ライセンス原本として採用、[Kenney本人のOpenGameArt掲載](https://opengameart.org/content/city-kit-commercial)と一致。真正GLB 41点を取得、ZIP原本SHA-256 f8b09b081c2bb88bcc126e2dec1cb40fd0dad7e7e591b6c26aaefe96fb35276b。うち13種類を34地点に配置し、既存BW-R3ネイティブ.blendから独立BXモデルを制作。**新しい物理道路は作っていない**。

**[PR #46のBX実7視点画像付き審査](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46#issuecomment-6395590457)**：従来R3と同じ低いAPPROACH視点・前方300m・700mなど、真正Blender Cycles 7画像を直接目視。旧空白だった前方両側に3D建築が増え、真正な立体メッシュの取り込みが実証された。ただしKenney低ポリ建築の反復で**箱状の模型都市感が顕著であり、道路中心の奥は依然空白**。巨大未来都市の高品質美術としては **ART REJECT**。人間制作CC0資産であっても、映像品質の保証にはならない。**大量複製・ポリゴン増加で合格を偽装しないこと**。

保存先：[原本ZIP・ライセンス根拠・GLB・真正7画像・編集可能Blender・SHA256](artifacts/private/g4e7bx-licensed-urban-depth)／[独立BX Blender制作ソース](scripts/p101-w9c2-g4e7bx-forward-cc0-depth.py)。GLB二進検査は1,505 meshes/41,360三角形/29 materials/埋込画像2、技術PASS。元のBW-R3とそれ以前のBR～BW制作物はすべて無変更。

**次の方法転換**：低ポリ建物を大量に置く方法を反復しない。自分自身の高品質な美術目標を、走行路の近・中・遠景と都市公共空間・支持構造・交通接続・緻密な素材で一体設計し、本物の編集可能3Dとカメラ画像で審査。必要なら異なる制作ツール・アセット調達・アートディレクションを調査するが、未確認ライセンスの外部作品を採用しない。**美術未合格で正規B48 500～800m統合を無断進行しない**。main、Gold、両本番、原作Slope、240Hz B48×7/B51-C×28/gap52/既存物理とゲームカメラを不変更。PR #46 OPEN/DRAFT/未マージ。Slope2公式認定0m、人間QA/ART/PUBLISH/READY/MERGE全HOLD。


## G4E-7BW-R3 — 主役建築の入口・内部と北側の連続性実制作（2026-10-25 JST）

**毎回GitHub現行HEADを再取得すること。** [BW-R3 Blender制作CI #40175375668](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40175375668) **SUCCESS**。実際のBlender編集可能モデル、GLB、Blender Cycles 6視点（従来のOBLIQUE/FRONT/SIDE/AERIAL/APPROACH＋新FOYER）、SHA256を[PRIVATE原本保管](artifacts/private/g4e7bw-halocut-concourse-r3)へ保存した。[新しい独立R3制作ソース](scripts/p101-w9c2-g4e7bw-r3-interior.py)はR2の原本を不変更。旧制作CIを再利用し新ワークフローは増やさない。GLB 1,493メッシュ/23,592三角形/17マテリアル/埋込画像1は技術情報で美術PASSではない。

**[PR #46に本物のBlender画像 R2対R3同条件5視点とFOYERを掲載](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46#issuecomment-6395286936)。** R3では両建築翼に立体入口、中二階、手すり、室内照明、傾斜移動構造、北へつながる居住層と支持のある交通構造を実造形。従来の5方向のカメラ位置・画角は不変更なので適正比較可能。R3は近場の建築の階層・入口・FOYERでは改善が見られたが、**低いAPPROACH視点の奥は依然ほぼ空白であり、巨大都市疾走の景観は不成立**。硬く角張った白い屋根、反復窓・単調な素材も課題。技術PASS／美術HOLD（正式不採用）／実ゲームカメラ・人間試走未検証／公開禁止。

**次工程は同型Blender bpy簡易造形の追加反復を止め、近景・中景・遠景をつなぐ真の都市美術と高精細建築制作方法へ転換。** 目視審査で成立してからPRIVATE 240Hz B48本物の500～800m代表区間統合を検討。B48×7、B51-C×28、gap52、240Hz、main、Gold、本番2サイト、原作Slope再現不変更。PR #46 OPEN/DRAFT/未マージ。公式Slope2認定0m。ART/HUMAN/PUBLISH/READY/MERGE全HOLD。



## G4E-7BW / 主役建築を単体で制作・5視点×2バージョン真画像審査（2026-10-25 JST）

**最新成果**：[BW / HALO-CUT CONCOURSEの真のBlender画像付きDraft PR美術評価](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46#issuecomment-6395122703)にR1/R2の斜視・正面・側面・俯瞰・低いAPPROACH計10画像を直接掲載。真正.blend、実GLB、出典、独自埋込画像、SHA-256を[初回BW原本](artifacts/private/g4e7bw-halocut-concourse)・[前方視野改善版R2](artifacts/private/g4e7bw-halocut-concourse-r2)へ完全分離保存。[BW真正Blender CI #40173719487](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40173719487)・[R2真正Blender CI #40174244111](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40174244111) はいずれも **SUCCESS**。新ワークフローを増やさず既存のBlender美術制作CIを改修利用。

- **BV以前からの設計方法転換**：街や外殻を多数一括生成せず、主役となる**一棟の複合公共交通建築**を建築翼・中空アトリウム・構造屋根・実居住層と連絡橋・内部照明・細いファサード部材で一体化。[唯一のBW制作ソース](scripts/p101-w9c2-g4e7bw-halocut-concourse.py)はBlender bpyによる**作者指定の幾何学構成のスクリプト再現**であり、手作業彫刻や実ゲーム描画とは称さない。図的な一体感・居住階層はBVより改善。
- **初回BWの明白な欠陥**：手前からの低い\`APPROACH\`で5本の水平横断橋が前方空間を著しく遮る。単なる構図最適化で美術判定を誤魔化さず、R2では**実形状の橋を5本→2本へ**変更し、スタジオカメラの仰角と画角も見直した。改善画像の視界は前より開けたが**橋除去のみの純粋効果は測定していない**（カメラ設定も異なる）。
- **画像比較による厳格な結論**：R2は中央前方の重なりが減り、単一建築単位の構造的つながりは進歩。ただし屋根・大梁の外観の硬さ、未完成に見える浮遊細部、ガラス帯の繰り返し、暗い公共空間、前方に続く都市背景の欠落が残る。**BWを高級インディー水準の都市アートとしてART PASSにしない。技術PASS、ART HOLD、実B48カメラ・人間QA未試験。** R2を実道路に統合したという主張は禁止。検査はBW R2 GLB 1,241 mesh / 19,504三角形 / 13 material / PBR画像1で、建築品質の代理指標ではない。
- **次工程の品質焦点**：別の都市プロシージャルモデル量産を停止。BWを暫定**主役建築単体の研究素材**として保管し、外装・出入口・公共内部空間を本物の建築的意図で深く磨く。周辺の高密度な居住都市と都市交通が実カメラの進行方向に繋がる設計を必要とする。ライセンス未確認の他者3Dモデルは採用しない。**ART/ロード視界の実証を経ず500–800mのPhase C PRIVATE統合には進まない**。次の手段は細かい手作業のモデリングや制作環境の変更などを含むが、ユーザーが事前承認していないWorkを無断利用しない。
- **保護**：BR/BT/BU/BVのREJECT原本・BW R1原本を全て残した。main/Gold/本番2サイト/原作Slope実装・B48実路面7/B51-C実動体28/gap52/240Hz/元操舵とカメラ不変更。Draft PR #46はOPEN/DRAFT/未マージ。公式Slope2認定0m。ART/HUMAN/実ゲーム映像/PUBLISH/READY/MERGEはHOLD。



## G4E-7BV — 建築ファースト地区の実制作・実視点美術REJECT（2026-10-25 JST）

**最新確定証拠**：[BV Blender真正実制作CI #40172833140](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40172833140) SUCCESS。ネイティブBlenderソース、1.57MBのGLB、5方向の実Cycles（斜視・正面・側面・俯瞰・APPROACH）、独自GLB内テクスチャ1、SHA-256を[既存Draftブランチの証拠](artifacts/private/g4e7bv-architectural-quarter)へ保存した。821メッシュ・14,458三角形・11マテリアルは技術指標に過ぎない。[Draft PR #46の実画像付き独立美術審査](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46#issuecomment-6394934226)。

**制作方式**：[BVの編集可能Blender生成ソース](scripts/p101-w9c2-g4e7bv-architectural-quarter.py)はBUの巨大な空殻から抜け、約700mの地区に駅、段丘状アーコロジー、曲面文化施設、異なる住宅・学校街区、橋・テラスを個別に設計した。従来のBlender CIを再利用し新ワークフローは増やさず、5枚の画像を同一CIで搬出。追加APPROACHは**スタジオの擬似道路視点であり240Hz実ゲームカメラではない**。

**美術結論＝ART REJECT（BUILD/GLB技術PASSと区別）：** 真正5枚を直接目視。斜視・俯瞰は大きな空の地面の上に数個の箱型建築が並ぶジオラマに見える。広範囲の居住密度と都市街路・公共空間の連続性が欠け、複数の施設は疎らで外壁も平板。低いアプローチでは無地の壁と長い水平橋が視界を占領し、危険の予告に使える実道路風景になっていない。前のBR/BT/BUと同様に正式都市アセットへ採用しない。

**今後の最重要手法転換：** 「Blender bpyで小箱・円弧部材を一度に生成→シーン全体を大きくする」方法を**終了**する。次は**まず一つの建築的に説得力ある主役建築を本格制作・目視審査**（意図的な造形・繊細な多層ファサード・内部公共空間・4–8m生活スケール・実オリジナルPBR）。それから周辺の異種建築と街路・交通で本当に連続した都市街区を形成する。外部アセット使用時は商用可否等を根拠で確認し、未確認の権利物は使わない。単なるモデルのポリゴン数・CI本数増加は禁止。**美術PASSまでPRIVATE実ゲームへの統合なし**。アートの正式採否はユーザーの実画像評価を尊重。参考写真と実カメラの視認性を重視し、従来のものと異なる制作ソフト・方式の利用も認めるが、Work使用の新たな事前承認は維持する。

**保護とゲート：** BVの技術PASSはゲーム・人間・美術・公開PASSを意味しない。B48道路7、B51-C動体28、240Hz、Gold、gap52、main、原作Slope・両本番URLすべて維持。Draft PR #46 OPEN/Draft/未マージ。正式Slope2 0m、ART/HUMAN/PRIVATE-REAL-GAME/PUBLISH/READY/MERGE HOLD。過去のBVレンダリングはプロジェクト失敗学習の証拠として保存する。




## G4E-7BT/BU 真正4視点美術審査と手法転換（2026-10-25 JST）

**重要・前回の「BT美術HOLD」を上書きする後続審査結果：BR / BT / BU 全て美術REJECT。** [PR #46の独立BT対BU真正レンダリング4視点比較](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46#issuecomment-6394820834)。相対的な前進を芸術合格にすり替えない。

- **BT真正画像をGitHub CI経由で取り出して人間目視評価：** BRより建築量塊・窓・街区の連続性は改善したが、円形の玩具的都市と反復直方体の小塔に見える。現状では実ゲーム統合に値しない。**BT=ART REJECT**。
- **BU《RIFTBOUND MEGACITY》真正Blender実制作**：円形の器を捨て、2本の非対称で一体的な都市断崖、縦方向約1.9kmの深い開放峡谷、連続居住層と横断公共交通を、旧BTスクリプトとは別の[BU独立ソース](scripts/p101-w9c2-g4e7bu-riftbound-city.py)でモデル化。[Blender実制作CI #40172049902](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40172049902) **SUCCESS**、実.blend/GLB/4方向1440×900 Cycles PNG/埋込独自PNG画像/整合性SHA-256を[GitHub独立PRIVATE証拠](artifacts/private/g4e7bu-riftbound-megacity)へ保存。独立GLBバイナリ検査は668メッシュ・38,110三角形・11マテリアル・埋込み画像1。これらは美術合否に無関係な技術指標。
- **BUの真正画像目視判定=ART REJECT。** 円形ミニチュアの改善と規模シルエット強化はあるが、巨大な白い無地外殻、黒い平板の窪み、生活街区の視認性不足、単調な窓列、側面/斜視での直方体感という根本問題を残した。**「大きな外殻をプロシージャル生成→小箱街区を貼る」方式そのものが都市美術のボトルネック**であると認定。
- **方法論の変更（最上位QUALITY-FIRSTに準拠）：** 同じ欠点が複数候補で連続したため、BR→BT→BUのようなプログラム形状の同型微調整/反復を停止。次回は**建築・街区・公共空間・多層交通・居住痕跡を、意図あるアートディレクションによる3D建築として先に組み立てる**。作り込んだ差別化のある都市モジュール、真の建築的接続、地形と外装を貫く実住区、室内奥行と照明、建築スケールの階層を制作し、そこから巨大質量を統合する。Blenderのカーブ/メッシュ編集/ブーリアン/適度なGeometry Nodesは手段であり、無数の簡易柱、リング、舗装箱、窓だけで美術合格を捏造しない。外部3D資産の場合は本物の権利資料を要求し、使用可能性が未証明なら使わない。スクリプト制作を手彫りと称しない。
- **効率改善**：追加CIを新設せず、既存BSレビュー経路でBT対BR、BT対BUの真正画像をSHA照合した。次BU用に既存Blender制作CIへ4視点レビュー・アーティファクト出力を統合したため、毎回BSの別起動は不要。必要な節目検証のみ。
- **次の品質ゲート**：まず少数の高品質な都市建築モジュール＋人間の縮尺が読み取れる都市層の本物のBlender画像を組み合わせて審査。以前のように「大外殻を完成→小塔を埋める」のは禁止。**4視点でプレイヤー目線の美術が成立してから**PRIVATE専用glTF/PBRレンダリング検証と正規B48道路500～800m区間へ。まだ実ゲーム内の視界/楽しいレース/人間手動QAは未実施。
- **保護**：main・Gold・両本番・原作Slope再現・正規240Hz B48×7/B51-C×28/gap52/元物理・カメラは不変更。Draft PR #46 OPEN/DRAFT/未マージ。正式Slope2認定0m。Human / Art / Publish / PR Ready / Mergeは全HOLD。


## 最新BT美術制作・CI改善（2026-10-25 JST、Quality-first実行結果）

**最新確定HEAD（この記載時点）：** `2f1ce519668fb4e08c5922d3f1c5f3e0cf7adf88`。このSHAは固定最新とせず、次回GitHub HEADを再取得すること。[既存Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46) はOPEN/DRAFT/未マージのまま。

- **Phase A 限定CI改善実施：** コミット `14970618a78a1de93b71968cd84ab16f8e01f5f6` で毎回ジョブ0のまま失敗していたG4E-7F YAMLの未引用コロンを修復。[真正ワークフロー成功 #40170147094](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40170147094) を確認。B5重物理検証・handoff snapshotのpush条件を関連ファイルに限定、手動起動は残した。BT美術コードのコミットでは両ワークフローの不要起動が発生しなかった。従来の公開ゲートP64 PR QAは保護のため残した。CI起動削減とゲーム品質向上は別物。
- **Phase B 初回実制作：** 過去の[BR美術REJECT](docs/W9C2_G4E7BR_ACTUAL_BLENDER_ART_FOUR_VIEW_REJECT_JA.md)から、単なる塔/箱増殖をやめ、約1.15km級の**連続した中空都市大質量＋内外に密集した居住街区＋4層の居住断面＋立体交通と公共空間＋非対称の巨大立ち上がり**を、一つの[オリジナルBlender bpyソース](scripts/p101-w9c2-g4e7bt-blender-mass.py)に組み込んだ。手彫りではなくスクリプト制作と明示。
- **[BT真正Blender制作CI #40170836465](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40170836465) SUCCESS。** [PRIVATE開発証拠ディレクトリ](artifacts/private/g4e7bt-inhabited-tidal-fold)に真正.blend、GLB2、4方向独立Cycles 1440×900画像、オリジナルPBR画像アトラス、独立GLB intake、SHA-256を永久保存。469 mesh／17,136三角形／11 material／GLB内画像1点。初回はOpenImageDenoiser欠如で失敗、2回目はCyclesのsegfault、生成・GLB書出とレンダリングの順序を分離して3回目成功。旧BR制作物は原本保護。
- **実画像によるBTとBRの4方向比較は[PR #46のレビュー用コメント](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46#issuecomment-6394644464)。** 現時点で**技術PASS／美術HOLD（合格判定なし）／ゲーム内実WebGL HOLD／人間手動HOLD**。三角形数・素材点数・CI成功だけでは芸術向上を証明しない。もし連続量塊でも模型感を払拭できないなら、脚本的な小塔追加ではなく建築資料・モデリング方式・アートディレクションそのものを転換。
- **Phase C／Dは未開始：** ユーザーによるBT美術審査を経ずゲーム本体へ統合しない。次に合格した候補を正規起点00からの約500〜800m本物のB48狭路・CHASM・危険先読みと一体化し、100〜130m/s実WebGLの視野・路肩・自然ジャンプ・接地・再挑戦価値を確認する。現行旧BK GLBローダーは一般PBR/複数ノード・テクスチャ未対応であり、この技術負債を隠さない。
- **保護：** B48実道路7、B51-C動体28、gap52、240Hz、元操舵・カメラ／main／Gold／本番2サイト／原作Slope再現は未変更。公式Slope2認定0m、Human/Art/Publish/PR Ready/Mergeは全HOLD。


> **このファイルが引き継ぎの入口です。毎日、長文プロンプトを作り直す必要はありません。**
> 最新状態は *この文章の記載日* ではなく、GitHubの現行HEAD・コミット・最新監査・CIを照合して確定してください。

## 最初にすること（次のチャットに渡す指令）

あなたは新規制作者ではなく、既存 **DOPAGAKI SLOPE — HYPER RUSH** の継続開発担当です。

1. `ryomashibaba/dopagaki-development-hub` の `p101-velocity-overdrive-native-trial` 最新HEADを実際に取得する。
2. [Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46) のOPEN/Draft/未マージ状態を取得し、変わっていたら無断で進めず差分を確認する。
3. 最新コミット、`docs/` 内の最近変更された工程監査、関連するスクリプトとCIを読む。**このファイルの「確認済み基準」より新しい事実を優先**する。
4. 直前工程の合否・独立候補・公開隔離・人間QA保留を維持し、次の意味あるゲーム体験改善へ進む。単なる監査・HUD・0.1m単位の反復は最優先にしない。
5. 変更はこの開発ブランチと既存Draft PR #46内に限定し、**main / Gold / 旧候補 / 両本番サイト / 原作Slope再現を不変更**とする。PRのReady化・merge・正式採択・公開は明示承認までHOLD。
6. 作業後は新HEAD・結果・CI・技術/人間/美術/公開の別々の判断・次工程を簡潔に報告する。**毎日新しい完全引き継ぎ文書を書かない。**

この指令と以下の恒久憲章は、個別チャットの過去の途中状態より優先されます。追加の最新ユーザー指示はもちろん最優先です。

## 恒久憲章（要約）

- **目標**：人間が実際に遊んで面白い、有料インディー級の巨大SF都市を疾走する3Dブラウザゲーム。単純な箱・直方体・反復門・広い平坦路・しょぼい障害物を量産しない。
- **操作**：A/D・左右矢印の左右操舵。常時微加速、坂で自然速度変化、空中慣性、OVERDRIVE/HYPERを維持。ジャンプボタン・ブーストボタン・磁力吸着・速度リセット・中央固定安全帯は禁止。
- **物理**：実B48コライダー（240Hz、ボール半径0.65m）、主要7道路、B51-C実動体28基を保存。見た目だけのギャップ、ゴースト床、強制ジャンプ不可。P96の自動操舵は**試験専用で人間のプレイを証明しない**。
- **カメラ**：ボール相対固定＋小揺れを基本。過追随や速度に応じた自動引き禁止。坂→平地への復帰遅延を改善対象として残す。
- **難易度**：旧v5より少し遊びやすく、高速でも危険を先読みでき、ライン取り・回避に意味があること。
- **A13**：全7.28kmの約40%（目標2.912km）をSlope2 DNA（真の10〜16m級細道・破断・自然飛行・急降下・曲率・再接地・障害物）へ。**試験距離を正式距離に算入しない。**
- **美術**：NEON GRID / MEGACITY / PRISM RUSH / VOID BREAKER。大質量・曲面・非対称・立体交差・人工断崖・都市内部の走路を、実カメラの視認性と統合する。
- **スコア**：生存時間95%以上・補助5%以内。
- **BGM**：174BPM DNB×Trance、約2秒導入・5秒以内の6音フック・ボーカル無し。ただし最優先はコースの面白さ。
- **人間QA**：自動CI、物理7/7、実WebGL、実機手動の証拠を別扱い。ゲームオーバー画面からローカルJSON保存。無断アップロードしない。
- **運用**：Chat＋GitHub優先。Workは明確に有利な場合のみ事前承認。ユーザーのZIP解凍・CMD・認証反復を最小化。小〜中規模の意味ある差分と適切なテスト。

## 【最上位運用方針】QUALITY-FIRST / INTEGRATED VERTICAL SLICE（2026-10-25、ユーザー正式採用）

**本規約は直近737コミット・約680変更ファイルの総点検後にユーザーが正式採用した新方針であり、以下の過去の「次工程」文言より優先する。** 本プロジェクトは大量の技術テスト・分離試作は蓄積できたが、ゲームの面白さと巨大都市美術が依然として未達。工程番号、コミット数、GLB三角形数、CI PASSの数を完成度や進捗の代理指標にしない。**評価の主軸を人間が遊んで面白いこと・実カメラで美しく見えること・品質改善量/工数に変更する。**

### 1. 開発の新しい順序（ゲート制）

**Phase A — 小さく、即効性のあるCI・継続開発の効率化。**
- 約129ワークフロー、263テスト、185スクリプト（2026-10-25調査時）の依存関係と実際の起動条件を確認。常時発火・毎回失敗・大量キャンセル・無関係なChromium/Blender再実行を減らす。**修正するのは安全に対象を絞れるワークフローだけ**。旧証拠の削除、無差別停止、mainや本番への変更は禁止。
- 軽量ユニット/構文確認→関連した変更の統合テスト→節目の実Chromium/240Hz/Blender重検証に分ける。独立小実験ごとの新CI新文書は原則増やさず、既存の共通検証経路を再利用。**効率化研究だけで何十工程も消費しない**。

**Phase B — ART-FIRST、少数候補の独立美術制作。**
- BRの真Blenderソース＋GLB＋4方向画像を活用するが、**BRは美術REJECT**であり、そのまま「都市完成」としない。従来の疎らな塔/巨大無地床/筒状外殻/無意味な細い梁を大量に増やす路線を中止。
- 主役は**ひと目で1km級と分かる連続的な巨大建築量塊＋内部都市・高密度の街区＋深い中空の公共空間＋差別化された居住層**。素材、照明、都市交通、建築のつながりをセットで造形。Blender等の**編集可能な真正3D**、4方向の真正レンダリング、GLB/PBR素材・出典/権利情報を保存。手作業でないものは正直にスクリプト生成と記録。
- **美術ゲート：**まず複数角度の実画像で①壮大な量塊・規模感②街区密度と建築的連続性③シルエットと空洞④素材・照明⑤既存案との差分を目視比較。絵が悪い時はゲームへ統合しない。自動の投影率やポリゴン数で美術PASSを出さない。
- **同じ根本的欠点で2〜3候補続けて不合格なら、パラメータの微調整ではなくモデリング/レンダリング/アートディレクションの方式を見直す。** この判断はユーザーの実画像評価を尊重。

**Phase C — 代表コース区間への「ゲームとしての統合」**
- 美術の成立した**500〜800m程度の代表区間**を目安に、本物の狭い道路・曲率・自然跳躍・下り・復帰・回避障害物と都市風景を**一体で完成させる**（長さは目安で、品質を犠牲にして距離を稼がない）。都市アセットが既存GLB表示方式に未対応なら**PRIVATE限定の現実的なglTF/PBR対応**を設計・検証し、旧BKローダーの制限を隠さない。
- 正規起点00／240Hz B48実路面7本・B51実動体28基・gap52・元ゲームカメラを維持。外観だけの危険・偽足場・物理の無断変更は禁止。100〜130m/sの実WebGL画面で、都市が存在するだけでなく**道路の危険を先読みでき、かつ迫力がある**ことを確認。
- QAは実道路への接地・落下・視界・反発・カメラ復帰・再挑戦価値を同じ区間で検証。P96自動操舵の成功を人間QA成功と称しない。

**Phase D — 人間のプレイと品質確認後にだけ全長へ拡張。**
- 本当に遊べるPRIVATEプレビューを作り、ユーザーの**実機プレイとJSON保存**で難易度・操作感・ロードの楽しさを判定。人間が遊べると証明する前に大量のコースへ横展開しない。
- 代表区間が技術/美術/人間の各ゲートを満たして初めて、全長7.28kmとA13の40%=2.912km級Slope2 DNAへ展開。公式認定距離は現行**0m**。実験結果を認定距離へ無断加算しない。

### 2. 工程とコミットの運用ルール
- **1工程＝プレイヤーの体験を明確に改善する、検証可能な意味ある成果。** 変更は安全な範囲で関連機能をまとめ、重要な中間保存で適切にコミット。工程番号を増やすための極小差分・CI一本追加だけの反復を避ける。過剰な大規模改変や原本破壊も避ける。
- 毎回の作業開始時に「今回実際に改善する体験」「客観・視覚・人間の評価ゲート」「撤退/手法転換条件」を短く明記。結果はPASS/REJECT/HOLDで正直に報告。ユーザーが疑問を呈した品質問題から逸れない。
- **BUILD/UNIT PASS ≠ VISUAL PASS ≠ HUMAN PASS ≠ PUBLISH APPROVED。** REJECTの画像やGLBもGitHubのPRIVATE証拠として保存できるが、正式採用・遊べる状態・作品完成とは見なさない。
- 永続引き継ぎは**この`PROJECT_STATE.md`が唯一の入口**。古い履歴を丸ごと複製せず、最上位規約と最近の結論を短く更新。多量の個別ドキュメント・CI・手作業ZIP・毎日の新プロンプトは増やさない。
- 実装は原則Chat＋GitHubで効率的に。Workは明確な利点がある場合にのみユーザーの事前承認。既存成果を原本保護。PR #46はOPEN/DRAFT、main/Gold/本番2サイト/原作Slope再現不変更。**Human/Art/Publish/Ready/Mergeは明示承認・根拠が揃うまでHOLD**。

### 3. 新チャットの最初の具体的工程
1. GitHubの最新HEADとPR #46・現存する実証・この規約を取得する（この文書にある古いSHAを最新だと決めつけない）。
2. **CIの無駄な大量起動の主要因を限定的に修正**して、軽量経路と節目検証を分ける。改善前後の発火数と安全性を検証。余計な新ワークフローを作らない。
3. 同時に、**BRの美術REJECTを出発点とした「一体型巨大都市＋内部に住める高密度街区」の明確に異なる次候補**を、真正Blender/PBRと4実視点で制作する作業へ進む。**単なる監査だけで工程を終えない**。
4. 結果と失敗理由をユーザーへ画像中心に説明し、完成した次の代表コース体験につながるかで採否判断する。

## G4E-7BR / BS — Blenderによる本物の3D都市制作・4視点美術審査（2026-10-25 JST）

[BR実制作CI #40168751293](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40168751293) **SUCCESS**、[BSの出典・SHA-256画像検証CI #40169047717](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40169047717) **SUCCESS**。Blender4.0.2で独立した都市地区《THE FRACTURED TIDE CITADEL》を実際に生成、**ネイティブ.blend（約2.57MB）／GLB2（約1.82MB）／独立4方向1440×900の真のCycles画像／SHA-256／出典・素材検査**を[GitHub PRIVATE開発用フォルダ](artifacts/private/g4e7br-fractured-tide-citadel)へ恒久保存。**26,594三角形・219メッシュ・17GLBマテリアル・テクスチャ画像0点**。スクリプトをBlender内で実行した造形であり、手彫りの精密Blenderアートや実ゲーム内WebGL描画と偽らない。

実Blender4画像を目視評価。曲面断崖・二つの段状都市島・立体高架橋・光る居住面など従来より確かに立体構造へ前進したが、**巨大都市というよりミニチュアの疎らな模型**に見える。広い無地の床、無個性で反復した塔、都市の連続居住層と複雑な大質量不足、素材・ディテールの物足りなさが明白。**技術PASS／中央級巨大SF都市の美術候補としてREJECT、Human/Art/Publish/Ready/Merge HOLD**。実ゲームの正規起点00・240Hz・高速P96カメラ表示はまだ未実施、ゲーム画面改善を達成したとは言えない。[BR美術監査・次の質的転換](docs/W9C2_G4E7BR_ACTUAL_BLENDER_ART_FOUR_VIEW_REJECT_JA.md)。

次は同じコード生成の微調整で立方体を増やさず、**1km級に見える連続した都市大質量／深い開口／実居住街区／複雑な素材・テクスチャ**を一体で美術設計し、本物のBlender4視点審査後にのみゲーム統合へ。現存BK描画器はBlenderの複数ノード・インデックス・テクスチャに対応しないため、将来PRIVATE対応パスの別検証が必要。既存B48実道路7／B51-C実動体28／ギャップ52／240Hz不変更。main、Gold、2本の本番、原作Slope、PR #46 Draft維持。正式Slope2認定0m。

## G4E-7BQ — BOの監査用GLB・実WebGL画像を開発GitHubへ永続保存（2026-10-25 JST）

[専用保存CI #40167708533](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40167708533) **SUCCESS**、[PRIVATE開発ブランチの永続監査資料](artifacts/private/g4e7bo-native-20261025)に、元[BO CI #40166540111](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40166540111)の正規240Hz 3視点×BN/BOの**実PNG6枚とGLB2本、全8ファイルのSHA-256監査情報**を登録。B48 7本／B51動体28基／セル52、TRUE 122.9・SWITCH 112.2/125.8m/s、SCRIPTED NOT HUMAN。**Technical PASS／Art REJECT／Publish FORBIDDEN、PR #46はDraft**であり、公開デプロイではない。これで元GitHub Actionsの14日アーティファクト期限に依存しない。

[BP軽量CI #40167594463](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40167594463) は4/4 PASS。今後はBlender等の真の芸術制作物を入庫→独立美術審査→適合レンダラー検討→元240Hzカメラで可視確認する。**今工程で高品質新GLBを制作・実走行描画したと誤認しないこと**。本番・原作サイト・main・Goldは不変更。正式Slope2 0m、Human/Art/Publish/Ready/Merge HOLD。

## G4E-7BP — 技術PASS／美術REJECTとART-FIRST転換（2026-10-25 JST）

[BO CI #40166540111](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40166540111) は全PASS。正規240Hz起点00 P96非人間3視点、GLB2×2、実Chromium画像・PRIVATE/公開隔離成功。ただしBN→BOで都市は画面左端に小さく残り美術的向上はほぼないため**BO ART REJECT**。モデル移動は約X+4.6m／Y-27.7m／Z+23.7m、画面差分RGB平均2.49〜4.34/255。画面内頂点率・小改善スコアでは巨大都市の美術品質を証明できない。[証拠GLB/実画像](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40166540111/artifacts/12588778053)は14日で期限切れとなるため永続ではない。

同様の単調なプロシージャル形状の微修正を繰り返す方針を中止。**ART-FIRST / 質の高い外部制作3Dアセットと美術審査**へ移るため、BPで[実GLB2／PBR素材／埋込みテクスチャ／複数メッシュの入庫検査](scripts/p101-w9c2-g4e7bp-artist-asset-intake.mjs)、元制作物・権利宣言・Y-upメートル単位・強制HOLD・Node独立テスト・専用軽量CIを追加。詳細：[BO最終美術監査とBP運用方針](docs/W9C2_G4E7BP_ART_FIRST_ASSET_INTAKE_HOLD_JA.md)。これは**高品質GLB実制作やゲーム画面での検証完了を意味しない**。旧BK専用WebGL2描画は任意のリッチGLB対応ではないため、将来独立したPRIVATEレンダラー適合が必要。

`scripts/build.mjs` と `web/drive3d.mjs` は今回不変更（大量CI起動回避）。元物理B48 7本／動体B51 28基／gap52／240Hz、main/Gold/本番/原作サイト不変更。正式Slope2認定0m、Human/ART/PUBLISH/Ready/Merge HOLD。

## G4E-7BO — BN固有の都市全体を実カメラ内に再配置（2026-10-25 JST）

[BN専用CI #40165794276](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40165794276) は**SUCCESS**：正規240Hz実3視点、2本のGLB(各約246kB)、公開隔離PASS。BNはBMの単調な筒より塔・居住層・屋根形状が見えるが、**都市の大部分が画面左端に切れている**ため巨都市の美術目標は未達・ART HOLD。原因はBMの筒モデルに最適化した座標を、形状が異なるBNにそのまま転用したこと。

BOは**新しい建物を乱造せずBNと完全に同じ三角形を使用**し、BN元GLBの頂点とBG真正240Hz P96視線からモデル全体をフレーム内に再配置する。TRUE/SWITCH各道路の実カメラ3視点をスコア化、道路中央下部・近すぎる構造・B48近接を減点、元BNと同一条件のWebGL画像比較で判断する。Dedicated PRIVATE `g4e7bo=framed`、本番・main・Gold・原作サイト不変更。**数値PASS≠美術PASS**。施工や公開許可を意味しない。[BO監査](docs/W9C2_G4E7BO_BN_TRUE_CAMERA_FRAMING_HOLD_JA.md)。Human/Art/Publish/Ready/Merge HOLD、正式Slope2認定0m。

## G4E-7BN — BREAKWATER CITADEL：主役都市の造形そのものを改修（2026-10-25 JST）

BMの[CI #40164933668](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40164933668) は**SUCCESS**。実バイナリGLB（TRUE/SWITCH各約488kB、6,704三角形）、Chromium同一正規240Hz高速カメラでBK2/BL/BMの9枚比較、PRIVATE/public/public-safe隔離を確認。カメラ合わせによって画面内へ建築が復帰したが、外観は巨大な白い筒状構造に過ぎず、居住都市・奥行き・美術的独創性の目標から大幅未達。**BM技術PASS／美術REJECT**。[BM WebGL成果物](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40164933668/artifacts/12588690357)。

BNで旧筒状外殻を主役から外し、**1地区の建築形態を作り直す**：4枚の不規則な厚い都市基盤、真の抜けを持つ非対称2翼の大屋根、238m・302m・214mの異なる高層住宅塔＋小型2塔、実居住層のガラス面・採光部と立体的都市間接続。BMで確認した実P96カメラの固定ワールド座標補正を再利用し、別GLB候補としてPRIVATE隔離する。**まだ美術合格ではない。** モデリングはコード生成でBlender手作業とは称さない。[BN監査と実画像ゲート](docs/W9C2_G4E7BN_BREAKWATER_CITADEL_HOLD_JA.md)。B48道路7/実B51動体28/欠落セル52/240Hz/原本・公開隔離不変。正式Slope2 0m、Human/Art/Publish/Ready/Merge=HOLD。

## G4E-7BM — 実240Hzカメラ投影から建築配置を最適化（2026-10-25 JST）

BL最終[CI #40163689908](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40163689908) **SUCCESS**：2本の本物のGLB、独立正常ロード、実WebGL撮影、公開隔離PASS。ただし実保存画像ではTRUE 122.9m/s／SWITCH 112.2・125.8m/sの**すべてで新都市建築がほぼ見えない**。BK2は近い巨大な壁が見える。よって**BL技術PASS／美術REJECT**。単にGLB三角形数を増やす失敗を繰り返さない。

BMでは既存BLの同じ実3Dモデルを保持し、`g4e7bgNativeFrames()` の真正のP96起点00・240Hz非人間3カメラから eye/front/right/up を復元し、見通し角・建築投影率・遠近・道路中央下部の遮蔽・実B48車道との水平距離を加味した位置最適化を実装。これは**カメラ/物理変更ではなく、PRIVATE表示専用GLB頂点の固定ワールド座標変換のみ**。TRUE/SWITCH両道路GLB生成、元BK・不採用BL・BM三者を同一高速カメラで撮影する専用テストを追加。[BM専用CI #40164933668](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40164933668) はキュー入り。現物画像を見る前に美術PASSとはしない。

[BM独立監査](docs/W9C2_G4E7BM_CAMERA_PROJECTION_PRIVATE_HOLD_JA.md)。PRIVATEオプトイン `g4e7bm=registered`、生成フラグ `DOPAGAKI_G4E7BM_VISUAL=1`。Blender制作とは称さない。新B48/B51・偽道路・カメラ補正・速度変更無し。**正式Slope2=0m、Human/Art/Publish/PR Ready/Merge=HOLD**。main・Gold・本番2サイト不変更。

## G4E-7BL — OPEN CROWN ARCOLOGY / 単一主都市地区のPRIVATE実制作（2026-10-25 JST）

**現在は実制作コミット済み／CI実行待ち／美術HOLD。** BK V2の実GLB2＋6素材＋法線＋ライティング基盤を流用し、コードで造形する単一の中空都市地区へ転換した。曲面の二重外殻、真に穴の開いた天空中庭2つ、厚い居住テラス5つ、270m級の都市主塔、立体連結部材を造形。道路際の不透明壁を繰り返す代わりに、B48第2道路から離れた開いた都市断面を目指す。

PRIVATEビルドだけに生成するGLB2は TRUE/SWITCH両条件。フラグ `DOPAGAKI_G4E7BL_VISUAL=1` および `DOPAGAKI_G4E7BE_VISUAL=1`。PRIVATE走行プレビューの個別選択 `g4e7bl=open-crown`。BK2と同じP96非人間240Hzカメラの3条件（TRUE 122.936m/s、SWITCH 112.189/125.796m/s）で実Chromium画像A/Bを別途専用CIに実装。[CI #40163689908](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40163689908) は開始時点でQUEUED。確認前に結果をPASSと呼ばない。[BL監査と美術審査手順](docs/W9C2_G4E7BL_OPEN_CROWN_PRIVATE_HOLD_JA.md)。

**正直な制作方式**：実バイナリGLBだが造形はコード制作であり、Blenderモデル・テクスチャ・一般glTFモデルの完全互換ではない。見た目の改善は実WebGL画像を確認するまで未認定。**正式Slope2=0m、Human/Art/Publish/Ready/Merge=HOLD。** main/Gold/本番/原作は変更せず、既存ブランチとDraft PR #46のみ。

## G4E-7BK — PRIVATE実バイナリGLB・法線付き素材描画の検証完了（2026-10-25 JST）

**基盤技術成立**。従来の頂点色付き板・梁だけの景観から、独立GLB2（TRUE/SWITCH各約208KB、2,832三角形、6種類のglTF Metallic/Roughness/Emissive素材＋3D法線）と実WebGL2の独立照明・反射・発光・霧経路へ移行した。作者は**コード生成されたGLB**であってBlenderで精密に造形したと偽らない。既存B48道路・B51動体・本番シェーダーは不変更。第1案[CI #40159691780](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40159691780) **SUCCESS**、Chrome4/4。実画像はまだ黒い大壁が近過ぎて道路横の視認が悪かったため、上記技術合格でも美術は不合格。

**V2で大きな開口・外側距離・明るい素材調整**：連続外殻の約35%以上を実空隙にし、近過ぎる始点と路肩距離を修正。改修版[CI #40160159906](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40160159906) **SUCCESS**（Native GLB2検証両道路、Chromium4/4再試行なし、PRIVATE118／public114／public-safe5、BK私有GLB/BC路面/BGフレーム非公開隔離確認）。[実Chromium比較画像 #12586186814](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40160159906/artifacts/12586186814) を旧第1案画像と同じTRUE122.936m/s、SWITCH112.189/125.796m/sの240Hz非人間走行カメラで比較。見通しと建築の量塊・素材表現は初版より改善したが、屋根や窓の反復と画面右側の大質量が残り、独創的で密度ある巨大SF都市には依然届かない。**美術ART HOLD／人間QA HOLD／公開HOLD**。

**次BLの最優先課題**：GLB技術とコード生成された単調な都市造形を混同しない。GLBを本物の手の込んだアセット制作（例：Blenderの階層ノード・インデックス付きメッシュ・テクスチャ/法線/ラフネス）へ接続し、素材・地形・都市階層・構図を一体として作る。ただし現在のBKパーサーは単一ワールド座標・unindexed・6マテリアルのみの**実験的サブセット**であり、一般Blender GLB全てに対応したと主張しない。あくまで同一実カメラのスクリーンショットを採否基準にし、量産を避ける。[BK技術・美術監査](docs/W9C2_G4E7BK_REAL_GLB_MATERIAL_PRIVATE_HOLD_JA.md)。正式Slope2認定0m、Human/Art/Publish/PR Ready/Merge=HOLD、main/Gold/原作/本番不変。

**モデル本体も検証可能**：[最終BK成果物CI #40160600019](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40160600019) SUCCESS。Actionsの[成果物 #12586536198](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40160600019/artifacts/12586536198) にTRUE/SWITCH両条件の**実GLBバイナリ各約208KB**と対応WebGL画像を同時保存。現地ではなくGitHub Actionsアーティファクト（14日保存）、再生成するコードはGitHubで永続。技術成立／造形美術HOLDであることは不変。

## G4E-7BJ — 巨大SF都市の画面内描画確認／美術案REJECT（2026-10-25 JST）

BIまでの都市が上方向・左右に切れてゲームの実カメラに映らない問題へ、BJでは**道路側方・下方に都市の実質量を配置**。PR #46の現行PRIVATE BC rollDeckを不変更、正規起点00/240Hz・2種実道路・28基の動体とgap52を維持。非衝突GPUの4街区/32開放空間/176都市セル/48断崖底面/6304三角形で、画面内に本当に入るかを実物理カメラ投影テスト化。最終[CI #40158555150](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40158555150) SUCCESS：Native4/4・Chromium4/4再試行0、PRIVATE115・public113・public-safe5、公開にBC/BG実験JSON混入なし。TRUE 18.5秒122.936m/sで実表示面中心728三角形、SWITCH 18.5秒125.796m/sで中心614面。現物[WebGL画像成果物 #12585319182](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40158555150/artifacts/12585319182)。

**重要・美術はREJECT。** 物理的に画面に入ることは改善したが、現物は白色の柱と平板な水色/橙色/青色リボンが交差した仮設足場に見え、超未来居住都市の実質感・統一的建築形態・材質・ライティング・奥行き/ランドマークは目標から極端に遠い。技術的にPASSでも美術PASSはない。外積3成分目を欠く不具合が再発（初回CI失敗）したため明示的な3成分finite guardを追加して修正。

**全体方針変更：BF→BJで繰り返してきた独立小型頂点色メッシュの量産では目標品質を実現できない。** 次BKは既存走行カメラの本物の画像を構図基準にし、設計された建築の連続大質量・実開口・街区構造・素材・光・遠近を統合したアセット制作/表示方式を検証する。可能であればBlender/GLB等の本物のモデルと専用のマテリアル/ライト付きPRIVATEレンダーパスを比較し、既存の単一頂点色シェーダーから必要な範囲で脱却。**いきなり大量の単色板、細い梁、棒、リングを増設しない。** まず小さな範囲の本物の建築品質を作り込み、景観を一気に良くする方針。Gold・本番・原作再現・物理・カメラ・操作は不変更。認定Slope2=0m、人間QA/美術認定/公開/Ready/MergeすべてHOLD。[BJ監査](docs/W9C2_G4E7BJ_ABYSSAL_STRATA_REJECT_JA.md)。

## G4E-7BI — 実B48遠景多層都市・最終実WebGL審査（2026-10-25 JST）

**[修正版BI CI #40156775824](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40156775824) SUCCESS。** Native generator両道路・本物の起点00/240Hz/7実B48/28実B51、Chrome Chromiumの**4/4テスト再試行なしPASS**、PRIVATE 114ファイル／public 112ファイル／public-safe 5ファイルでBG/BC非公開JSON隔離PASS。[元の実画像・BHとBI同じカメラの比較 #12585330822](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40156775824/artifacts/12585330822)。

**失敗と修正**：最初のBI実装では3D梁メッシュの外積の第3成分が欠落し、4街区の各2268座標が不正になった。最初は道路区間外配置を疑って場所を調整したが、同数のエラーが続いたため各街区の診断で原因を特定。数学的外積3成分を修復し native CI PASS。旧BF/BH、道路・障害物・カメラの変更なし。

**写真に基づく美術判断：HOLD／現案は未採用**。TRUE 18.5秒・122.9m/sの実P96カメラでBHとBIは同一速度・位置。SWITCH 17秒・112.2m/sと18.5秒・125.8m/sも撮影。BIの中間都市テラスと発光リブが前方に現れ、旧BFの真っ黒な壁は戻らず、高速路面視認性が失われた様子はない。ただし主都市外骨格は画面上部の外に切れ、縦方向の都市密度・構造連結・数百m級規模感を走行視点では表現できない。**単なるメッシュ数・ユニットテスト・スクリーンショット生成を美術PASSと扱わない**。人間A/D公平性も未認定。

次 BJ では見せる建築を上空へさらに追加するのではなく、正規ボール相対カメラ視野内の**地平線近くから道路の下方/側方**まで、実スケールの空中都市の中間高さ・裏面・巨大人工断崖・入居可能な街区・立体連絡構造を豊かに設計し、同じBG高速カメラでビジュアル主役が画面内に明確に入るかを先に審査。路面・カメラ角度を無断で変更せず、全候補をPRIVATEの独立景観に保持する。正式認定Slope2距離0m、Human/Art/Publish/Ready/Merge=HOLD。詳細[BI監査](docs/W9C2_G4E7BI_PARALLAX_HOLD_JA.md)。

## G4E-7BH — OPEN HORIZON 実空間に抜ける4都市構造をPRIVATE制作（2026-10-25 JST）

**背景**：BG同一正規240Hz高速カメラは BF を大きな暗色壁として美術REJECT。BHは単なる色替えではなく、実路肩から165m以上外側の4都市主構造・大空洞8方向・高低差ある外側連結テラス16・明色の非反復3Dリブでスカイラインを大きく再設計。実7 B48、28動体B51、実欠落セル52、操作・カメラ、旧候補・Gold・本番は**完全保護**。BC rollDeck／正規240Hz／P96非人間カメラ t=17.0/18.5sec で元都市・不採用BF・BHを同位置比較する。通常BEから手動A/Dも引き続き動作。PRIVATEのみ URL パラメータ `g4e7bh=open-horizon` が追加。

専用CI [#40154982364](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40154982364) は**起動済みで結果確認待ち**。実WebGL撮影による視認性・都市としてのスケール/深さ確認前には**BHの美術PASSを主張しない**。正式Slope2=0m、人間QA・美術承認・Publish/PR Ready/Merge=HOLD。[BH監査](docs/W9C2_G4E7BH_OPEN_HORIZON_PRIVATE_HOLD_JA.md)。反復の効率は独立景観モジュールで上げる。

## G4E-7BG — BCの実高速240Hzカメラ・景観A/B検証完了（2026-10-25 JST）

**[専用実CI #40154087436](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40154087436) SUCCESS。** Native240Hz BC/起点00固定P96の観測テストPASS、Chromium Playwright **3/3初回PASS・再試行0**。PRIVATE 112ファイル、public 110ファイル、public-safe 5ファイルを検証。後二者にBG高速度フレームJSONまたはBC未採用路面JSONの混入なし。スクリーンショットは[Actions成果物 #12584250768](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40154087436/artifacts/12584250768)（閲覧可能期間14日）。BE手動A/Dと混同しない**SCRIPTED READ-ONLYフレーム**で、人間プレイの証拠ではない。

**実画像比較・美術判断：BF仮説REJECT。** 起点00から18.5秒のTRUE-PINCH 122.9m/s、PINCH-SWITCH 125.8m/s、SWITCH 17.0秒112.2m/sの高速実カメラで撮影。元景観は反復巨大ポール/門であり、BFへ交換すると暗色の巨大壁状メッシュが景観の大部分を占め、都市の階層感・空の抜け・100m/s超の道路先読みが改善しない。初期52m/sだけの検証と異なり中盤の本物のカメラで欠点を可視化できた。**技術CIが成功しても視覚的完成とは判断しない。**

次BHでは路面/操作を変更せず、同じ正規BG高速カメラで大きく空が抜ける本物の空隙、明暗と立体レイヤー、前方走行路の遮蔽軽減をねらった新景観を作る。数mの道路左右微調整や暗い箱の増築は禁止ではないが、この課題の主手段にはしない。GitHubの既存仕様/BE・BG操作導線/原作再現・Gold・本番不変更。人間の楽しさ・公平性は依然未評価、**正式Slope2=0m、Human QA/Art認定/公開/PR Ready/Merge=HOLD**。[BG監査](docs/W9C2_G4E7BG_REAL_SPEED_VISUAL_AUDIT_HOLD_JA.md)。

## G4E-7BF — SKY FRACTURE：BC実道路沿い巨大SF景観の独立PRIVATE制作（2026-10-25 JST）

BE修正版 [#40148567626](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40148567626) はChrome2/2再試行0、公開隔離PASS。**全体方針監査**：物理の微小改造・診断を繰り返して人間の楽しさ/遠景都市美術を後回しにしていた点は効率・目的ともに改善余地あり。そこでBFは道路を追加改造せず、BC rollDeckの正規7実B48・28実B51・gap52・手動A/D・240Hz・ボール相対カメラをそのまま使用し、実路面から外側140m超の独立した3つの**非直方体・実開口・非対称数百m級〜約900m巨大都市構造**を実GPUに構築する。PRIVATE opt-in `?g4e7al=manual&g4e7be=roll-deck&g4e7bf=sky-fracture`、通常BEは比較対照として維持。実Chromiumで有無比較・両道路・画面画像・性能を検査、結果が出るまで美術合否保留。技術CIは実験が成立する証拠であって人間の楽しさではない。

**恒久効率方針**：小〜中規模意味ある機能差分、既存BEランナー再利用、GitHub PROJECT_STATE自動継承、共通driver/build修正をまとめてCI乱発を抑制、1工程ごとにネイティブ/実WebGL/公開隔離を別々に確認。実験結果が悪ければ設計を棄却し、0.1mの微小調整反復に戻らない。正式Slope2=0m、Human/Art/Publish/PR Ready/Merge=HOLD。[BF監査](docs/W9C2_G4E7BF_SKY_FRACTURE_PRIVATE_HOLD_JA.md)。

## G4E-7BE — BC rollDeckを実Chromium PRIVATE手動WebGLへ接続（2026-10-25 JST）

BC rollDeck（直近の最良だが未採用実道路、第2道路最後の実接地u=.60434/.60473）の2道路を独立localhostだけにビルド。起動入口：`RUN_G4E7BE_MANUAL.cmd` → `http://127.0.0.1:4373/drive3d/?g4e7al=manual&g4e7be=roll-deck`。正規00出発52m/s、240Hz実B48道路7本・B51-C動体28基・実gap cell52、A/D／左右矢印の真手動、P96固定自動操舵を不使用。OVERDRIVE、標準ボール相対カメラ、ゲームオーバー直JSON保存・2道路比較・試走再記録を既存G4E7ALのPRIVATE UIと共有。新規BC ID/provenance不整合時は実ロード拒否。Gold・AY・BD・原作再現・2本番不変更。

**[初回BE本物のChromium検査CI #40148317936](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40148317936) はジョブSUCCESS。** Unit 2/2 PASS、PRIVATE BC 2生成PASS、Chrome/SwiftShader WebGLで明示ゲート・BC A/D・両道路切替・JSONダウンロードを実ブラウザで実行、public/public-safe両ビルド（BE環境変数が有効でも）BC候補JSON混入ゼロ確認PASS。自動写真2条件＋計測ログは同Actions artifact #12582505058に保存。ただし2番目のChromeテストは**初回1失敗、再試行でPASSのFLAKY**であったため無条件のクリーン合格とはしない。

原因の候補は、2道路目への`load()`が非同期中なのにテストが前道路のmodeフラグだけを読んで入力したこと。修正コミットではcanvasに実ロード済みBC実道路IDを追加し、2道路目の実ロードIDとmanual準備完了が両方成立するまで操作を待つ。[修正再検証CI #40148567626](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40148567626) **SUCCESS／Chrome 2/2テストを再試行ゼロでPASS**。実ロード済みBC道路IDを照合してから2条件目を操作し、ロード前入力の競合を除去。正規PRIVATE実路面生成・公開／public-safe隔離も再度PASS。手動人間プレイと美術品質はHOLD。

BEは本番公開も正式コース採用もしていない。テストによるWebGL起動確認と、人間が遊んで見やすい・楽しい・公平かの評価を厳格に区別する。実機手動、人間QA、都市造形の美術審査は未実施、**正式Slope2=0m、Human=HOLD、Art=HOLD、Publish/PR Ready/Merge=HOLD**。次工程は実機A/D＋画面/JSONを得るか、手元のprivate Chromiumフレームを検証して視認性・曲率・遠景の箱問題を具体的に直す。BE詳細：[監査](docs/W9C2_G4E7BE_BC_PRIVATE_MANUAL_HOLD_JA.md)。

## G4E-7BD — CHASM実路面診断・大区間再制作／2案REJECT（2026-10-25 JST）

**診断CI #40147227909 SUCCESS**：BC rollDeckは第2道路u≈.558で自然離地、0.34〜0.36秒後のu≈.582〜.584で自然に再接地。u≈.6046/.6050で路肩余裕-0.970m/-0.936m、約112m/sで最終離地。道路幅はu=.53の約86m→.60の約34m→.64の約14mに急収束。曲率も強い。路面/操舵の複合要因が疑われるが、因果寄与は未確定。
実B48第2道路u=.50〜.867を中心線・幅・バンク・縦断を含む10行の長半径リボンへまとまって再制作したlongArcとdescentSweepをPRIVATE検証。全7 B48、全28 B51-C（3基実路面へ再アンカー、他25凍結）、本物のギャップ52、残り5道路、正規物理240Hz、操作、本番隔離を維持。

**[実走比較CI #40147558159](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40147558159) SUCCESS（構造・ネイティブ試走完了）／走行結果は両BD案REJECT**。

| 同一P96固定操舵・第2道路最大実接地u | TRUE-PINCH | PINCH-SWITCH |
|---|---:|---:|
| AY bankedSweep 歴史的対照 | .35751 | .37892 |
| **BC rollDeck 最良未採用比較基準** | **.60434** | **.60473** |
| BD longArc | .59439 | .41916 |
| BD descentSweep | .59267 | .45012 |

全ケース訪問2/7道路で落下。動体衝突0、BD descentSweepのPINCH-SWITCHは致命的静的衝突1件。特に切替条件でu=.42〜.45へ悪化したため、未来の実道路形状やルートガイド変更が手前の固定P96操舵へ影響する可能性がある。人間操作での再現性は未確認。**BDの大きな中心線変更は不採用。BCを保持し、次BEはP96操舵／ルートガイド差と実道路作用を切り分けつつPRIVATE実WebGLの視認性・手動QAを優先する。**

正式Slope2認定0m、Human QA HOLD、Art/WebGL QA HOLD、Publish/PR Ready/Merge HOLD。[BD監査](docs/W9C2_G4E7BD_CHASM_PRIVATE_HOLD_JA.md)。

## G4E-7BC — CROWN実3Dバンク再制作：AYより大幅に実接地が進行（2026-10-25 JST）

前工程BB [実240Hzベクトル診断 #40143385126](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40143385126) がAY継続離地u≈.358（路肩余裕+0.93m、路面法線方向+0.81m/s）、BA早期離地u≈.324（路肩+7.30m、法線方向+1.17m/s）を確認。左右への道路移動ではなく、第2実B48道路u=.267〜.600の大きな横断バンクをなだらかに再制作。AYからのBC rollDeck（66%バンク緩和・追加縦断隆起なし）およびskylineSaddle（78%緩和＋実2.6m隆起）。本当の細道・ギャップ52・後半CHASM・他6道路・実28動体を保護。エンジン・操舵・非公開外サイト・Gold不変更。

**[BC真正240Hz物理CI #40143790098](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40143790098) SUCCESS：構造テスト・両条件AY対照の起点00固定P96非人間実物理比較PASS。** 第2道路の最大実接地位置：
- TRUE-PINCH：AY bankedSweep **u=.357514** → BC rollDeck **u=.604337**、BC skylineSaddle **u=.604365**。
- PINCH-SWITCH：AY bankedSweep **u=.378923** → BC rollDeck **u=.604734**、BC skylineSaddle **u=.604825**。
- 生存時間 TRUE/PINCH：AY 16.59167/16.65417秒 → BC rollDeck **19.58333/19.41250秒**、BC skylineSaddle **19.57500/19.40000秒**。
- 全条件の訪問実道路2/7、動体衝突0・致命的静的衝突0。まだ第2道路u≈.60以降で落下し、全7道路完走は未達。

**判断：BCは接地距離改善の有望な未採用PRIVATE候補。** 2案の実走差はごく小さく、物理的改変が比較的単純なrollDeckを次工程の研究基準に優先（品質の正式採用ではない）。AYは変更なしの歴史的対照として維持。法線速度・バンク・路面接触の寄与分離は完了しておらず、人間が安全に曲がれるとの判断もしていない。次BDではrollDeckのu≈.53〜.72の接地・路肩・自然飛行・曲率をベクトル診断してから、CHASMへの本物の道路断面接続を改善する。遠景都市の箱問題・実WebGL視認性も未評価。

正式Slope2認定0m、人間QA=HOLD、美術/WebGL QA=HOLD、公開・PR Ready・merge=HOLD。[BC監査](docs/W9C2_G4E7BC_CROWN_BANK_PRIVATE_HOLD_JA.md)を参照。

## G4E-7BB — 接地喪失の3Dベクトル解析（2026-10-25 JST、CI結果待ち）

BAの左右オフセットは実接地距離を縮めたため、推測に基づく連続なコース移動は停止する。AY bankedSweepとBA outerContourを同じ起点00・正規240Hz・固定P96入力で比較し、第2実B48道路u=.20〜.55の**3D速度・接線・法線・縦勾配・曲率・レーン余裕・接地断続**を読み取り専用で収集するBBを実装。単発非接地と継続非接地を区別し、曲率のv²κはあくまで幾何学的目安とする。[BB監査](docs/W9C2_G4E7BB_VECTOR_AUDIT_PRIVATE_HOLD_JA.md)。

**BBは診断工程であり路面の正式採用も性能改善も未主張。結果は専用CI実行後に確定する。正式Slope2=0m、人間/美術/公開/Ready/merge全HOLD。**

## G4E-7BA — 第2道路左キャッチメント実制作・正規240Hz REJECT（2026-10-25 JST）

AY bankedSweepから、第2道路u=.267〜.600の実B48 11行を左に連続的に再制作した（outerContour最大9m / cliffBowl最大13m）。実CROWN/CHASM細道・本物のギャップ52、全7本B48、実28基B51-C（2機再アンカー）、正規240Hz・原操作を維持。既存物理/生産ルート/main/本番を変更せずPRIVATE候補として実装。

**[BA真正240Hz実走CI #40142666494](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40142666494) SUCCESS：構造テストと起点00固定P96比較完走（非人間）。しかし改善はなし。** 第2道路の最大実接地u：
- TRUE-PINCH：AY **.35576**、AZ longGlide .35338、BA outerContour **.32110**、BA cliffBowl **.31084**。
- PINCH-SWITCH：AY **.37595**、AZ longGlide .35523、BA outerContour **.32342**、BA cliffBowl **.31270**。
- 生存秒：AY 16.59167/16.65417、BA outerContour 16.02083/15.87500、BA cliffBowl 15.79583/15.60417（TRUE/PINCH順）。
- 全候補2/7実道路で落下、動体接触0・致命的静的接触0。BAは第2道路u≈.29〜.32から既に接地が不安定で、左方向9〜13mの路面移動は逆効果。

**判定：BA outerContour / cliffBowl = 走行性能REJECT、PRIVATE保管のみ。AY bankedSweepが最良の未採用比較基準。** 技術CI=PASS、人間QA=未実施、美術QA=未実施、正式Slope2=0m、公開/PR Ready/merge=HOLD。

次工程は任意の左右オフセット試行を繰り返さない。100m/s直前の**ボール速度ベクトル・道路接線・路面法線・実接地/浮遊イベント**を同一座標系の240Hzトレースで確認し、カーブ・勾配・自然離陸と操舵の寄与を切り分けてから、見通しのあるCROWN→CHASM実コース区間をまとまって制作する。実WebGLの中盤視点・遠景都市の箱感も別途審査する。[BA監査](docs/W9C2_G4E7BA_LEFT_CATCHMENT_PRIVATE_HOLD_JA.md)。

## 最新G4E-7AY — 長半径の実B48「CROWN TANGENT BRIDGE」制作・試走確認（2026-10-24 JST）

AXで第2道路u≈.20までしか接地できなかったため、単純な数mの横移動ではなく、**第2道路CROWN中盤u≈.167〜.50の31×5実路面を長半径の接線連続橋へ再構築**。途中で本当に幅が狭くなるB48コアu≈.34〜.43（約14〜16m）と後半CHASM u≈.63〜.82を保持。AV第一道路・実ギャップcell52・第2道路CROWN入口とCHASM・残り5道路・全28 B51-C・操作／推進物理を保護。変形区間の実動体2基は新路面へ再アンカー、残26基を原データとして保持。不可視安全帯、磁力誘導、自動操舵、ブースト／ジャンプボタン、速度リセットは追加していない。

[AY真240HzネイティブCI #40101623682](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40101623682) **SUCCESS**。開始00・同一固定P96操舵で両道路を試験（非人間）：
- TRUE-PINCH：AX longLead **14.6667秒・第2道路最終接地u=.2057** → AY tangentDeck 16.5042秒・u=.3314 → **AY bankedSweep 16.5917秒・u=.3540**。
- PINCH-SWITCH：AX longLead **14.4000秒・u=.1991** → AY tangentDeck 16.3667秒・u=.3454 → **AY bankedSweep 16.6542秒・u=.3744**。
- bankedSweepは両道路で最も改善したが、**両方2/7道路で落下している**。実接地位置の改善は明確だが、全コース完走・人間の公平さ・見た目の合格を意味しない。
- [AY native JSON artifact #12563585098](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40101623682/artifacts/12563585098)。

最良の`bankedSweep`のみPRIVATE手動試走へ接続：`?g4e7al=manual&g4e7ay=banked-bridge`、Windows用`RUN_G4E7AY_MANUAL.cmd`。 [AY統合CI #40102058843](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40102058843) **全SUCCESS：実Chromium 28/28 PASS、PRIVATE生成、通常/public-safe両方AY生成物排除PASS**。[WebGL QA画像/artifact #12563447884](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40102058843/artifacts/12563447884)。実Windows端末での起動・人間長距離試走は未検証。

**判断：AY bankedSweepはPRIVATEの次期比較基準候補（正式昇格ではない）。** AV/AX旧候補・main・Gold・2本番は不変。人間QA、美術品質、正式Slope2認定=0m、公開、PR Ready、mergeは全HOLD。次工程AZでは、u≈.35〜.5からCHASMへつながる第2道路を区間設計として見直すと同時に、**高速度での道路視認性と箱状の都市景観を実ブラウザで評価**する。狭路の微小位置変更やテスト件数増加だけを目的にしない。[AY監査](docs/W9C2_G4E7AY_TANGENT_BRIDGE_PRIVATE_HOLD_JA.md)を参照。

## 最新G4E-7AX — LONG CROWN：高速度を前提とした第2道路入口の実B48リデザイン（2026-10-24 JST）

AWの細かい改変6案は全滅したため、第2道路CROWNを**30×4の物理セル群の制御点レベルで再構築**。AV lineSoftの第1道路・実ギャップcell52・7道路・28動体・他5道路・後半CHASMの全制御点を維持。既存の第2道路前半に、長い幅の収束（u≈.05〜.29）・緩曲率の中心線・S字と高さを持つ本物の衝突路面を置き、細道コアu≈.29〜.39・後半CHASMコアu≈.63〜.82を維持。該当路面の実B51-C2基を位置・軸・回転ごと追従。他26基を保護。**細い実道路と高速度、実ギャップを犠牲にせず、不可視サポート・ジャンプボタン・速度リセットは一切追加しない**。

[AX正規240Hz物理CI #40085562570](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40085562570) **SUCCESS**。非人間P96固定操舵・起点00でlineSoft対AXを比較：
- AV lineSoft：TRUE-PINCH 14.4958秒、第2道路最後の接地u=.1345／PINCH-SWITCH 14.4083秒・u=.1347
- **AX longLead：TRUE-PINCH 14.6667秒・u=.2057／PINCH-SWITCH 14.4000秒・u=.2006**。両方の第2道路実接地を先へ進めるが**2/7道路で落下し、全走破できず**。高速度の新しい入口として方向は有望だが人間の品質不明。
- AX wideArc：TRUE-PINCH 11.2708秒、PINCH-SWITCH 11.2542秒で静的衝突 → **採用禁止／HOLD**。
- [AX実JSON artifact #12557271039](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40085562570/artifacts/12557271039) を記録した。

longLeadだけを**PRIVATE/localhost手動A/D試走**へ接続（`?g4e7al=manual&g4e7ax=long-crown`）。`RUN_G4E7AX_MANUAL.cmd`から非公開buildと本物のWebGLで2道路を手動確認できる設計。JSONはゲームオーバー後にローカル保存可能で外部送信なし。既存AV/AU/AS、Gold、2本番URLは未変更。統合Chromium/公開隔離CI [#40085980811](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40085980811) は結果未確認のため**人間QA・WebGL最終合格はHOLD**。正式Slope2認定は厳格に0m。

次工程は**実ブラウザ画像と非人間連続トレース双方で、CROWNのu=.20以降の路肩逸脱を見直す**。小さな座標掃引を繰り返すのではなく、走りやすいコース全体の構成・見える前方の予告・巨大都市の造形へ戻す。人間が試した合格なしに正式採用・Ready化・merge・publishしない。[AX工程監査](docs/W9C2_G4E7AX_LONG_CROWN_PRIVATE_HOLD_JA.md)。

## G4E-7AW — 第2道路CROWN進入の実物理・詳細比較（2026-10-24 JST）

実B48第2道路の高低差・S字を減らした4案、および細道幅を拡大せず実路面を12m/18m移動した2案を独立実装。7本の実道路、28機のB51-C、真のギャップcell52、AV第1道路を保護し、実路面へ動体4基を追従させた。

**物理テスト3回ともSUCCESS、ただし改善なし**：
- [#40082792851](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40082792851)：flowSoft 14.292/14.196秒、flowOpen 14.117/14.021秒で落下。
- [#40083160854](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40083160854)：entryEase/flowClearは約11.3〜11.4秒に静的衝突。
- [#40083613700](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40083613700)：laneAlign12 14.275/14.175秒、laneAlign18 14.271/14.171秒で落下。

AV lineSoft比較基準14.496/14.408秒より延長できなかったため、**AWはすべて不採用/HOLD**。第2道路CROWN u≈.12〜.13の接地喪失後、u≈.14で右路肩を越える。後の14秒台落下は結果であり、真の出発点ではない。次AXは細道入口の長い予告・自然な曲率・高速で通過可能なレーンを再設計し、細かい数値掃引を繰り返さない。

別件：AV/AU実Chromium [#40081979873](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40081979873) FAIL。AVステージIDにLINE SOFT/LEVEL末尾が欠落、カメラ初期state nullからyaw参照エラー。修正コミット10ccf5fで対応したが[再検証CI #40084099231](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40084099231)結果未確認。正式Slope2=0m／Human/Art/Publish/PR-Ready/Merge=HOLD。

## 最新G4E-7AV — 実B48進入蛇行の緩和で第2道路に到達（2026-10-24 JST）

**AV長距離実測を追記**： [#40081842160](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40081842160) **SUCCESS**。[JSON artifact #12555371977](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40081842160/artifacts/12555371977)。AV lineSoft/lineLevel×TRUE-PINCH/PINCH-SWITCHの開始00固定P96非人間240Hz・最大38秒試験で全4ケースが第2道路に到達する一方、**第2道路走行中14.296〜14.538秒で再び落下。訪問2/7、動体接触0**。少なくとも第1道路の先行7秒落下は解消したが、全7道路走破・完全解決ではない。次G4E-7AWでは第2道路内の実曲率／高低差・レーン選択を改良し、実走行で検証する。最新ブラウザ統合検査は該当HEADのCIで合否を照合し、未完了ならHOLDのまま。**正式Slope2=0m、人間/美術/公開=HOLD**。


**開始00の落下原因を特定**。正規240Hzの第1道路離陸トレース [#40080678294](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40080678294) により真ギャップcell52より遥か手前、第1道路u≈.288／2.60秒で意図しない離脱。第1・第2道路の結合座標は正確に同じ。垂直上り勾配だけを和らげた3候補は全て未改善。そこで**第1道路の実B48中心線の過大な左右蛇行を緩めた**AVの2案（lineSoft/lineLevel）をAT原本を保持したPRIVATE候補として制作。 [AV正規240Hz比較 #40081219349](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40081219349) 全SUCCESS：原本ATはTRUE-PINCH 7.025s／PINCH-SWITCH 7.058sで落下、両AV候補は**2道路とも12秒走行継続し、lineSoft第2道路到達7.933s/7.858s、lineLevel 7.754s/7.821s**。本物の残り6道路・実動体28基（変更路面に実物01を追従）・実ギャップcell52は維持。これは非人間P96固定操舵であり、**全7/7・人間の公平性/面白さ・アートの合格ではない**。AVはlocal PRIVATE手動に `?g4e7al=manual&g4e7av=lines`（より穏当なlineSoft既定）／比較用 `&g4e7avGrade=level`。 [AV監査](docs/W9C2_G4E7AV_REAL_FIRST_ROAD_LINE_PRIVATE_HOLD_JA.md) を参照。正式Slope2距離0m、HUMAN/ART/PUBLISH/MERGE: HOLD。

## 最新G4E-7AU — 開始00から第2道路への連続到達性と実道路2チェックポイントの分離QA（2026-10-24 JST）

AU実240Hz長距離CI [#40078962476](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40078962476) SUCCESS。証拠 [artifact #12554531826](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40078962476/artifacts/12554531826)。
**開始00から非人間P96固定操舵では、ASもATも第1道路で7.025s（TRUE-PINCH）／7.05833s（PINCH-SWITCH）に落下。第2道路へ未到達（訪問1/7）。** 第2道路の孤立ネイティブ開始 u=.18/.70×105/165m/sは、105m/sで3.4s継続したが負の路肩マージン。165m/sでは障害物衝突／落下。**孤立開始の継続＝開始00からの到達でも人間の公平な走行でもない。** このブロッカーを見逃さず、AT原本不変更の独立AU PRIVATE「第2道路直接試走」候補を追加する。2つの追加QA開始点と実28障害物/全7道路/真ギャップは同じ物理。localhostのみ `?g4e7au=inspect&g4e7auPoint=crown|chasm&g4e7auSpeed=105|165`（チェックポイントはレース進行の救済機能ではない）。次の工程は第1道路で空中離脱する原因をレース本体の実B48形状と操作可能性で修正する。**正式Slope2=0m／Human/Art/Promotion/Publish/PR Ready/merge=HOLD**。 [AU監査](docs/W9C2_G4E7AU_CONTINUOUS_ROAD2_PRIVATE_HOLD_JA.md)。

## 最新G4E-7AT — CROWN THREAD＋CHASM SWEEP：真2道路の連続3Dコース制作（2026-10-24 JST）

**AT専用CI #40077679372 SUCCESS／ブラウザ統合CI [#40077944798](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40077944798) 全SUCCESS（Chromium19/19、PRIVATE build、公開/公開安全モード隔離PASS）**。 [画面artifact #12554380582](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40077944798/artifacts/12554380582)。`RUN_G4E7AT_MANUAL.cmd` を追加してWindows privateローカル起動を1操作化（人間QAの合格を意味しない）。多数の旧CIが共通ファイル変更で同時に起動する効率問題は未解決で、今後は対象別CI＋節目のフル回帰とする。人間/美術/認定/公開はHOLD。\n\n前工程ASの実WebGL写真では、スタート直後の道路が幅54〜55mで広く見え、直方体型景観の弱さも再認識した。診断を繰り返さずコース制作を加速するため、ASの真B48第1道路を保持し、**第2道路にさらに2つの独立した実3D狭路**（最大27m級S蛇行／高低差23m／横傾斜・衝突有効）を制作した。第2道路のP95/A13実障害物4基を路面位置と向きに追従し、他24機、全7道路、真ギャップcell52、原本ASを保護。専用CI [#40077679372](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40077679372) SUCCESS：CROWN_THREADの実細道長244.97m・幅12.10〜16.17m、CHASM_SWEEPの実細道長294.33m・幅13.80〜15.98m、**約539.30mは新規制作された実B48物理狭路長で、正式Slope2 DNA距離ではない**。240Hzの2.4秒×6条件PASSは7/7完走ではない。ブラウザ手動QAは `?g4e7al=manual&g4e7at=crown-chasm` でPRIVATE localhostのみ。Human/Art/Fairness/Publish/PR Ready/merge: HOLD。正式Slope2認定0m。 [AT技術監査](docs/W9C2_G4E7AT_CROWN_CHASM_PRIVATE_HOLD_JA.md) に詳細。

## 最新のG4E-7AS — 真のB48道路を改造したBANKED SERPENT制作・localhost限定QA（2026-10-24 JST）

先行AQ/ARの診断だけでは遊びの改善が進まないため、次は**具体的な3Dコース候補の実制作**へ転換。G4E-7APを保持した独立ASは、真11m B48第1道路の2区間を大きく左右へ曲げ、上り/下り起伏＋横傾斜を付けた2つの本物の物理道路。スライダー01とローター02を変更後の実道路へ追従、残り26障害物/6道路/実ギャップcell52/離陸着地を維持。初回CI #40075983957で前方u=.08–.13の道路が実幅106–111mと判明したため上り蛇行を真11m細道u=.24–.435へ移設。次CIで合否を再確認。従来のlocalhost 2道路手動A/D・ゲームオーバー直接JSON保存へ `?g4e7al=manual&g4e7as=bank` で明示参加。PRIVATE JSON・Node240Hz・Chromium画面・公開隔離CIは最新の当該HEADの結果を照合すること。**7/7完走も人間の回避/美術品質も未認定。正式Slope2=0m、公開/PR Ready・merge=HOLD**。 [G4E-7AS監査](docs/W9C2_G4E7AS_BANKED_SERPENT_PRIVATE_BUILD_HOLD_JA.md)。次ATはASの実プレイ試験から危険箇所・大区間設計の不足を評価し、一連の面白いコースとして規模を拡張。小幅修正やHUDで代替しない。

## 最新のG4E-7AR — 実ローター02接触反応と実細道左右操舵の分離検証（2026-10-24 JST）
 
**G4E-7AR 専用CI [#40074009266](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40074009266) 全SUCCESS**：Node/正規240Hz人工接触＆start00非人間操舵、Chromium15/15、private/public-safe隔離PASS。 [証拠artifact #12551629966](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40074009266/artifacts/12551629966)。AP02同じ幾何への制御接触ではpush逆方向速度反転0/各道路1件、bounce(.8)反転1/各道路1件。ただしAJ幾何はpushでも1/各道路2件の逆方向速度変化が生じるため形状依存。APの弱い早左固定入力は両道路で6.7s RUNNINGまで到達したが最小路肩投影マージン−0.87m/−1.04m。早右落下、遅右静的衝突はAJ/AP同一で未改善。**人間回避や正式美術を認定しない**。次は動体の時相と道路内で実際に到達できる左右軌跡の連続性の調査を重視。正式Slope2=0m／正式公開・採用HOLD。



本物のB51-C回転体02に人工初期位置から接触する240Hz Runner実験、実B51-OBB CCDに対する同一幾何のpush/bounce比較、真11m B48での固定A/D操舵・路肩距離を同時検証。従来のAQで早右落下がAJ/APとも同じだったため、障害物の衝突反応と道路端到達を独立測定する。**人工接触位置やP96固定操舵は人間のスタート00走行・成功の根拠ではない。** CI結果は該当HEADで確認。元7AJ/AP/Gold/main/本番を保存、正式Slope2=0m、Human/Art/Promotion/HOLD。 [G4E-7AR監査](docs/W9C2_G4E7AR_NATIVE_ROTOR_IMPACT_EDGE_PRIVATE_HOLD_JA.md)。

## 直近差分：G4E-7AQ 同じA/D時系列を再利用した真240HzのAJ/AP障害物比較（2026-10-24 JST）

**AQ専用CI [#40073189396](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40073189396) SUCCESS**（対象HEAD `1c8df3895929cab2f79733fb1a3b05600d125ce7`）。Node・真240Hz・実Chromium15/15・公開隔離までPASS。実結果：AP#01はB48中央のOBB遮蔽が0/121→36/121、#02は9/121→4/121。基準P96固定操舵は両案7.2秒継続だが、早左はAJ B51移動接触→AP静的衝突専用面失敗、早右はAJ/APとも同時刻に落下。**面白さ・公平性改善の証拠なし**。対象#02のpush接触は確認できず反発回復も未認定。実測JSON： [Actions artifact #12551693120](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40073189396/artifacts/12551693120)。次は接触後の運動や道路端の可達性を本物のRunnerで診断する。正式Slope2認定0m、人間/美術/採用=HOLD。


G4E-7APの専用CI [#40071849065](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40071849065) はNode/実Chromium15/15/非公開ステージ隔離すべてSUCCESS（人間QAはHOLD）。次のAQでは、実11m B48上の7AJ対7APを同じP96操舵履歴+早期左右A/D追加入力で非人間の240Hz比較。左右5点の動体OBB遮蔽、接触イベント、失敗・終了・速度を記録。**固定操舵による動作比較は人間の到達可能性や公平性の証明ではない。** JSON証拠はGitHub Actionsのg4e7aq-native-compare.jsonへ。結果は新HEADのCIを照合し、未確認の数字は報告しない。 [G4E-7AQ監査](docs/W9C2_G4E7AQ_240HZ_PHYSICAL_AB_PRIVATE_HOLD_JA.md)。既存物理・Gold・本番・PR#46 Draft維持。正式Slope2=0m、Human/Art/Promotion=HOLD。

## 直近差分：G4E-7AP 本物の障害物ライン選択・反発対策独立研究（2026-10-24 JST）

G4E-7AJ基準を一切上書きせず、実B51-C #01/#02の2基だけを再設計したAP候補。01は実横断slider、02は実push回転体。真11m級B48、7道路、ギャップcell52、他26動体、正規240Hzエンジンを維持。独立private JSONとlocalhost `?g4e7al=manual&g4e7ap=duel` 専用手動2コース比較へ接続。技術Node/Chromium/公開隔離検証は直近CIを必ず確認（コード追加＝PASSとは限らない）。手動の楽しさ/視認/反発解消未認定、正式Slope2 DNA=0m、公開/Gold/本番=HOLD。詳細：[G4E-7AP監査](docs/W9C2_G4E7AP_REAL_TEMPORAL_SLALOM_PRIVATE_HOLD_JA.md)。単なるマーカーの量産ではなく、試走した回避ラインと物理接触を比較して次を決める。

## 直近差分：G4E-7AO実障害物の早期認識研究（2026-10-24 JST）

**この節は当時のG4E-7AO記録です。最新の開発工程は上記G4E-7AQを参照してください。旧G4E-7AN美術履歴を現行工程として扱わないこと。** 開発ブランチ・Draft PR #46・主物理の保護条件は冒頭の憲章どおり。

- 7AJ `reanchor` の真11m B48先頭道路で、実B51-C動体01（u=.32）／02（u=.80）の**実道路中心線の弧長を逆算**し、手前150m／95m／45mの警告地点に、**路肩の13.5m外側**の非衝突V字型3Dマーカーを生成。`?g4e7al=manual&g4e7ao=on` のloopback明示時だけ表示。標準7AL・景観AM/AN・本番は不変。架空の安全レーン／強制誘導／早期衝突／幽霊床は作らない。
- **専用CI [#40068323822](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40068323822) 全ステップSUCCESS**：実弧長の独立720分割再測定、元ステージbyte同一、240Hz実Chromium A/D／手動QAの回帰、public/public-safeの研究ステージ非混入を確認。実Chrome3画面は[artifact #12550317586](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40068323822/artifacts/12550317586)を取得して目視済み。旧画面にはないV字警告がAO両コースでは路肩外に映る。
- 実際には警告は比較的小さく、既存HUDにも距離／残秒数の通知がある。**人間の回避・高速200m/s以上の認識余裕・面白さ・正式美術品質は未確認/HOLD**。技術PASSは本番採択ではない。元の28機／7道路／球・速度・操舵・カメラ・スコア・Goldは不変更。正式A13 Slope2 DNA=0m。
- 正式監査：[G4E-7AO 真B48/B51の距離算出警告・技術CI PASS・人間HOLD](docs/W9C2_G4E7AO_B51_TRUE_ARC_PREWARNING_PRIVATE_HOLD_JA.md)。**次はユーザーの実試走ログまたは厳密な認識猶予の根拠**を優先し、単なる新装飾やHUD量産でゲーム品質の不合格を隠さない。運用はChat＋GitHub、Workは事前承認、PR Ready/merge・本番公開禁止。

## 2026-10-24 JST 最終確認済み基準（**現在値とは限らない**）

| 項目 | 最後に確認した値 |
| --- | --- |
| Draft PR | #46：OPEN / Draft / 未マージ |
| ブランチ | `p101-velocity-overdrive-native-trial` |
| HEAD | GitHubの現行ブランチHEADを実際に取得（固定値を参照しない） |
| 確認済み工程 | G4E-7AK第1〜3ゲートの正規240Hz接触・実WebGL・真B48三角形×B51-C実OBB遮蔽・早い右入力の落下原因はCI PASS。7AJ全7道路2/2非人間自動完走を維持。**G4E-7AL：非公開手動A/D 2候補比較、実Runner240Hz記録・ゲームオーバーJSON保存・Windowsワンクリック起動を実装。順序強制、Rリトライ履歴最大12件、2走完了後の再開禁止、未走行の次候補移行禁止を反映。補助B51距離計測のみ毎ステップ240Hzから20Hzへ削減し、正規CCD/実接触イベントは240Hzを維持。初回Chromium CI #40026339519の手動入力区別漏れを修正し、G4E-7AL再試験 #40026772361 が SUCCESS（Node・private・Chromium・public/public-safe隔離すべてPASS）。さらにG4E-7AM巨大都市外殻／2連続する非対称都市大陸のGPU専用景観候補を実装。実WebGL・旧景観比較3画像 Actions #40028777111 は全SUCCESS。GitHub artifact #12534985530の実画像を審査し、R1は巨大な左右の壁に見え美術HOLD。G4E-7AM R2では左右外殻を222m/255m以上道路から離し、実メッシュ空穴246区画／大きな空スロット176区画とした。2コース目のPNGがスクロールによりキャンバス外を撮った問題を是正し、WebGLキャンバス自体を直接撮る方式へ。R2 CI #40037992309は全SUCCESS・WebGLキャンバス3枚を確認（artifact #12537044928）。2コース目の黒画像/スクロール不備は解消。ただし両コースの実画面で右に巨大な平面壁、左は空白が多く、**R2景観は美術未達・REJECT/HOLD**。次工程で**G4E-7AN SKY ARCHIPELAGO**の独立4巨大造形（裂けた巨大中空冠・双尖ねじれた都市・3層空中都市棚・分岐高空巨大構造）を実コードで制作。7AJ真B48の左右と前後の異なる位置に置き、旧壁景観は重ねない。Node/Chromium/2コース実WebGLの初回 [#40039374208](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40039374208) は技術全PASS（artifact #12539380888）だが、実画像では黒い空と一部の斜材しか見えず美術REJECT。正面向き中空冠＋遠近再配置R2 [#40049868810](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40049868810) も技術全PASS（artifact #12542808485、開始／走行後の実5画面）だが右の巨大な暗い平面壁が再発し美術REJECT/HOLD。4構造を独立描画するlocalhost WebGL診断 [#40050280820](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40050280820) は技術全PASS（artifact #12543187621）。巨大壁の原因は主に閉鎖した `citadel` の多角面と特定。R3で大部分を開放格子へ変え、冠／棚／分岐構造の視点内高さも調整。[R3 #40050904186](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40050904186) はNode/Chromium/公開隔離全SUCCESS（実画像artifact #12543641160）。**R3では右側大壁は減り路面視認性が改善したが、都市としての完成度はまだ未達で美術HOLD。**** 人間実試走・美術・正式認定HOLD。 |
| 次の計画 | **G4E-7AL技術ゲートPASS→G4E-7AM実景観研究中**：[#40026772361](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40026772361) 全ステップSUCCESS。非公開GPU候補G4E-7AM《UPTURNED CITY》R1 [#40028777111](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40028777111) 全PASS（**美術は壁状のためHOLD**）。R2景観のマクロスロット＋離隔修正の [Actions #40037992309](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40037992309) はNode/実Chromium/公開隔離すべてSUCCESS。実画像3枚は右の長い壁と左の空白で美術REJECT/HOLD。**G4E-7ANのR1/R2とも実Node/Chromium/公開隔離CIは全PASSだが、美術はREJECT/HOLD**。R1では建築が画角にほぼ入らず、R2では右の巨大壁が再発。 [#40050280820](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40050280820) の単体4画像でcitadel閉鎖面を原因特定。修正版 [R3 #40050904186](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40050904186) も技術全PASS・右の大壁は改善。ただし美術はHOLD。**次は実A/D操作・先読み・真の細道と障害物の質を重視**し、格子塔の単純な追加や数値微調整は最優先にしない。単純な小刻み位置調整、建築数だけの量産、物理やカメラの勝手な改造は行わない。CI合格と美術合格は別。美術・人間QA・正式採用・公開はHOLD。CIの失敗は修正し再実行、成功しても「実Chromiumでの自動A/D」＝「人間の手動QA合格」としない。実機の2道路比較JSON・感想が得られた後、判明した視認／操舵不公平を改善する別の本物の3D道路・動体候補を検討。Workは事前承認、公開/mergeは不可。 |
| Slope2 DNA正式認定 | 0m |
| 美術・人間品質・公開 | HOLD |
| 凍結比較基準 | G4E-7AA `landing-soft α=.70` |


**G4E-7AK第1/2ゲート CI**：[固定A/D実240Hz #39968223375](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39968223375) SUCCESS（artifact 12507972133）。[reanchor実Chromium WebGL10画面 #39969621809](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39969621809) SUCCESS（artifact 12509130409、public/public-safe研究用JSON非混入PASS）。人間の視認・操作/美術/正式採択/公開はHOLD。

**G4E-7AL 最終技術PASS**：[修正版 #40026772361](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40026772361) のNode/native・実Chromium操作/ゲームオーバー直接JSON保存・public/public-safe隔離は全SUCCESS。**新G4E-7AM R1 CI**：[#40028777111](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40028777111) はSUCCESS、ただし実画像から壁状と評価し美術HOLD。**R2技術成功・美術REJECT/HOLD**：[#40037992309](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40037992309) 全SUCCESS、実WebGLスクリーンショット artifact #12537044928 を目視。次は多層奥行き建築へ転換。人間QAは実ユーザー試走証拠なしでHOLD。

**G4E-7AK第3ゲート CI**：[実B48/B51-C遮蔽・接地喪失 #39976900377](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39976900377) SUCCESS。画面サイズ換算は近似であり人間の反応猶予は未認定。記録は最新監査を参照。

7AAは、本物の欠損B48セルによる走行因果性と全7道路240Hz自動完走（56.2292秒）を記録。ただし美術・人間プレイは未認定。7ABでは0.15〜0.60mの進入微調整候補が全て7道路完走に失敗し、視界改善も実証できなかった。**7AC R2で実ジャンプ維持の大型カーブが全編240Hz完走。その後7AHで細道＋S字まで実B48化し、7AIで同じ元の走行カメラを使うWebGLと視線遮蔽の検査が成功。ただし人間の遊びやすさと見た目は未認定。**

- [G4E-7AN SKY ARCHIPELAGO R1〜R3実Chromium全PASS・R3右大壁改善・美術/人間QA HOLD](docs/W9C2_G4E7AN_SKY_ARCHIPELAGO_PRIVATE_ART_HOLD_JA.md)
- [G4E-7AM UPTURNED CITY R1/R2 実WebGL技術PASS・右壁/左空白の美術REJECT/HOLD](docs/W9C2_G4E7AM_UPTURNED_CITY_PRIVATE_ART_HOLD_JA.md)
- [G4E-7AL 真11m細道×実B51-C手動QA・リトライ履歴＋ローカルJSON・技術CI PASS](docs/W9C2_G4E7AL_LOCAL_MANUAL_QA_HOLD_JA.md)
- [G4E-7AK 第3ゲート 実B48三角形×B51-C動体遮蔽・早い右入力の無支持落下／人間HOLD](docs/W9C2_G4E7AK_G3_PHYSICAL_VISIBILITY_FALL_HOLD_JA.md)
- [G4E-7AK 第1/2ゲート 実240Hz固定A/D 10条件＋実Chromium WebGL10枚・人間/HOLD](docs/W9C2_G4E7AK_B51_FIXED_KEYS_NATIVE_GATE1_HOLD_JA.md)
- [G4E-7AJ 真のB51-C2/28基再配置・実240Hz全7道路完走・人間HOLD](docs/W9C2_G4E7AJ_REAL_B51_LANE_REANCHOR_HOLD_JA.md)
- [G4E-7AI 実11m細道WebGL15枚・正規240Hz視線遮蔽・公開隔離PASS](docs/W9C2_G4E7AI_TRUE_NARROW_B48_WEBGL_HOLD_JA.md)
- [G4E-7AH 真のB48細道2案・実240Hz全編7/7・非人間HOLD](docs/W9C2_G4E7AH_TRUE_B48_NARROW_PLAYABILITY_HOLD_JA.md)
- [G4E-7AG OPEN CITADEL 実WebGL/実遮蔽PASS・美術REJECT/HOLD](docs/W9C2_G4E7AG_OPEN_CITADEL_WEBGL_HOLD_JA.md)
- [G4E-7AF FRACTURE CITADEL 8画像検証・美術REJECT](docs/W9C2_G4E7AF_FRACTURE_CITADEL_WEBGL_HOLD_JA.md)
- [G4E-7AE SPLIT HORIZON 旧景観置換・実物理視界研究](docs/W9C2_G4E7AE_SPLIT_HORIZON_WEBGL_HOLD_JA.md)
- [G4E-7AD実視界研究とHOLD](docs/W9C2_G4E7AD_TRUE_NATIVE_WEBGL_ART_HOLD_JA.md)
- [G4E-7AC真の物理実験](docs/W9C2_G4E7AC_MACRO_PHYSICAL_PILOT_HOLD_JA.md)
- [G4E-7AB最終REJECT原本](docs/W9C2_G4E7AB_SUBMETER_TRUE_B48_FULLRUN_REJECT_JA.md)
- [G4E-7AA比較基準](docs/W9C2_G4E7AA_TRUE_B48_CONTOUR_NATIVE_HOLD_JA.md)
- [G4E-7W真のギャップ基礎](docs/W9C2_G4E7W_GROUNDED_REAL_15M_GAP_HOLD_JA.md)
- [旧G4E-7O実機QA](docs/W9C2_G4E7O_TRUE_B48_HUMAN_QA_HOLD_JA.md)
- [公開チャネル方針](docs/RELEASE_CHANNEL_POLICY_JA.md)

## 引き継ぎ自動化（GitHub上で完結）

- `scripts/generate-handoff.mjs` は**読み取り専用**。現在のGit HEAD、直近コミット、最近更新された `docs/*.md`、工程監査の内容をGitから抽出して、Markdownを標準出力へ出します。外部AI・外部サービス・APIトークン・個人情報は不要。
- `.github/workflows/handoff-snapshot.yml` はこの開発ブランチへのpushで軽量実行。生成物を**Actions artifactだけに保存**し、コミットやデプロイはしません。手動実行も可能です。過去のartifactは期限切れになり得るため、必要なら常にGitHub HEADから再生成できます。
- この固定URLを毎回新チャットへ渡せば十分です。**生成されたスナップショットは補助資料**であり、その時点のPR状態、ユーザー承認、人間QAを自動認定しません。
- 最新のdocsが古い、Git HEADと一致しない、PRの状態が違う場合は、最近のコードとCIを直接読む。新規追加資料の欠落を「存在しない」と断定しないこと。

**コピペは1行だけ：**「https://github.com/ryomashibaba/dopagaki-development-hub/blob/p101-velocity-overdrive-native-trial/PROJECT_STATE.mdを開き、GitHubの最新HEADとPR #46、最近の工程監査を照合してDOPAGAKIの次工程を進めて。正式公開・mergeは禁止。」

## 保護するURL

- [正式DOPAGAKI本番](https://dopagaki-slope.sora-110029.chatgpt.site/) — 無承認変更禁止
- [原作Slope再現](https://slope-neon-ryoma.sora-110029.chatgpt.site/) — **絶対変更禁止**
- [Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46)
