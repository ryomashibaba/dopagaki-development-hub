# DOPAGAKI SLOPE — 新チャット継続入口（固定URL）

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
