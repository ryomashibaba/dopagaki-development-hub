# DOPAGAKI SLOPE — R2F4 路線近傍の正規座標最適化・初の手前公共施設・真正QA

**2026-11-01 JST／研究専用のDraft PR #46（OPEN/未マージ）。**
**結論：R2F4の配置候補探索と実Blender＋元ソース真正QAは限定PASS。独立美術はART REJECT。** ART正式採用0件、Slope2 DNA 0/2912m、RELEASE/MERGE HOLD。

## 1. なぜ今まで公共建築が見えなかったか

R2F3までの各地区の外壁/空洞/広場は元走行道路から遠く、近くへ寄せるだけでも不足した。R2F4 Phase 0では元B48道路左端から25/35/45mの3地区×2道路幅=18候補を、**実B48全7道路のU320×V12＝29,211ポイントの表面サンプル、元B51全0..2880tickのOBB保守的XZ円包絡、元240Hz真カメラ**で測った。初期18候補全てがこの**予備条件のみ**を満たしたが、従来の地区位置に沿った仮の16×14×19m施設では元8/11.5秒画面の投影領域は431〜952px²しかなく、主因が**進行方向に数百m遠いこと**と判明。

そこで道路1上の**32地点（U=.025〜.800、.025刻み）×左端から25/35/45m**を真tick1921(8.004秒)・tick2761(11.504秒)、ultra(14m)・control(28m)のそれぞれについて同時探索した。384ケースをスコアリングし、画面中央を避ける近景の候補を抽出。実道路の未標本三角形との接触・建物の実テクスチャ表示は未証明。

### 元カメラに届く実際の候補（Road1左側35m）

| タイミング | U | 元カメラ深度 ultra | 16×14mプローブの画面投影 ultra | 28mモード投影 | 保守的B51 XZ余裕 | B48高密度サンプルXZ余裕 |
|---|---|---:|---:|---:|---:|---:|
| 8.004秒／tick1921 | .100 | 108m | 8,702px² | 9,366px² | 193.9m | 25.8m |
| 11.504秒／tick2761 | .350 | 107m | 8,191px² | 10,041px² | 119.9m | 25.8m |

以前の431〜952px²より**約9〜20倍**の投影面積を確保できる位置。数値は真正元カメラへの仮の立体枠投影であり、実ラスタ遮蔽は**未評価**。なお同Uで横距離45mの候補は投影面積やB48サンプル余裕が若干上だが、道路側の都市と関係を作る試作として35mを選択した（最高スコアを正式採用したわけではない）。

- Phase0実装GitHub [`7f5fad321dbc`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/7f5fad321dbc554872bec870f66e71953d69730a)、Phase0進行方向探索追加 [`0c4fe482be65`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/0c4fe482be65eec9a6286fa1e1c0e160d923b6d2)。
- 真正[Actions #41277512269](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41277512269)、[Artifact #13071034747](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41277512269/artifacts/13071034747)、ZIP SHA256 `484adb322c50c78c6d33617f7f1089cba57c2e299e7bffb8fba4931263d572cf`。原本JSONを独立で確認。
- [Actions #41277994082](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41277994082)全20工程成功、[Artifact #13071877837](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41277994082/artifacts/13071877837)、ZIP SHA256 `0b3ae8326b184519c60faa89217c0a28633a8ff472bdaf68b9f7502c72945989`。選択Uと元カメラ画素投影・全B51の記録を再度独立照合。

## 2. Phase 1 本物の3D試作

[実造形コミット `4f94b07d93e0`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/4f94b07d93e019c38e34fbafba06ff6c1560ef6e)で旧R2F3スクリプト・GLB/BLEND証拠を保全し、R2F4独立Blender作成コード6本と同じ既存QA Workflowを構成。Road1左端`u=.100`と`u=.350`から外35m、各元カメラに正面を向けて**厚い不規則公共地盤、左右の低層で高さの違う2翼、後方の交易館・本物の開口と広場・屋根、少数の彫刻**を実頂点メッシュとして追加。元ゲームの道路上へ新物理床、架橋、マグネット/テレポートは追加しない。新建物は5つの既存Blender districtメッシュの最初の2地区に統合され、既存遠景地区/公共利用22プログラムは保持。**2施設ともそれぞれ568個の独立新3D頂点**。

## 3. 真正新モデルQA

[GitHub Actions #41278482489](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41278482489) **全20工程SUCCESS**。新BLEND/GLB生成、独立GLB COLOR0/GPU検査、元WebGL2の14m/28m×6時刻=**12真正PNG**、元全2881tick B51回転OBBとの独立離散三角形SAT、実元カメラ投影とSHAの監督PNG。

[Artifact #13072421208](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41278482489/artifacts/13072421208) ZIP **6,108,363 bytes**／SHA256 **`a03d9113ffb8211158d6cfcc01738d863a27e75e9d3ea363bd54be71c5654c29`**、真正33ファイルのZIP原本を独立確認。
- Blender実poly faces: **21,176**／元game GPU triangle count: **42,568**
- 独立元B51 28動体×2,881tick×2道路幅＝**161,336時刻で交差0**（動体サンプル時刻のSAT判定、時刻間CCDではない）。
- 追加物理Collider：**0**。元ゲームGit blob `af076d67492a677d2235e4730aef8cdf4808e106`のSHA一致を真正CIと最新GitHub blob再読みで確認。
- 追加実建築の元カメラ頂点投影矩形：tick1921 ultra **33,950px²**、tick2761 ultra **34,173px²**。これはスクリーン矩形面積であり、**実際の美術画素・内部可視を保証しない**。

### 真正RGB画素比較（旧R2F3→R2F4）

同じ元1013×698 WebGL2フレーム、同じ元240Hzカメラ、両ZIPのPNGをmanifest上のSHA256と照合。各画素の最大RGB差が**36を超える**比率を測定。ROI左側はx0..369／y200..479。**画素差は美術点数ではない。**

| 時刻 | ultra全画面変化 | ultra左側ROI変化 | control全画面変化 | control左側ROI変化 |
|---|---:|---:|---:|---:|
| 4.404秒 | 0.243% | 1.517% | 0.240% | 1.498% |
| 8.004秒 | **2.092%** | **14.093%** | 2.031% | 13.670% |
| 11.504秒 | **2.407%** | **16.425%** | 2.941% | 20.070% |

**実画像の美術評価**：8秒と11.5秒に**実際に前景左側の屋根・側壁・入口風の建築**が増え、旧遠景では小さすぎた低層公共施設の可視性は改善した。元レーシング道路・HUDの大勢は不変。だが入口は巨大な単純色のくぼみ・四角い屋根や壁として描かれ、内部公共広場と人の居る本物の都市空間には見えない。**芸術的な採用を認めずART REJECT。** モデル生成・画像差・配置成功のみでART PASSにしない。

## 4. 次の工程に引き継ぐ実装・未確認の境界

**成果：** 初めて実道路から安全側距離を保った候補を**縦横両方で計測**してから公共建築を置き、画面に確実な建築の出現を得た。「道路から100m以上離れた広場」から前進。

**次のR2F4 Phase 2：** 今回の2つの近景建物のみ対象に、元8.004秒／11.504秒の真画面で入口の奥が見える**実低層市場・交通館の内部断面**を少数造形で直接改善する。テクスチャだけや多量の小物ではなく、実メッシュの自然な吹き抜けと歩廊・内部の立体階層を優先。背景遠景の重複モデルや巨大壁の再量産は禁止する。

**必須追加安全ゲート：** Phase0のB48は実道路表面の**密なサンプルとの水平距離のみ**であり、**新R2F4実建物の静的B48三角形との厳密交差ではない**。元B48をサンプリングした三角形と新建物ポリゴンの交差、地盤接地・実歩行/避難・真B51画素遮蔽・時刻間連続CCD、実人間高速操作・Windows/iPhone FPSは別々に未検証。建築完成前のこれらをPASSとは記録しない。

PR #46 Draft OPEN／未マージ。main/Gold/P100/W9-X/B5・2本番、元240Hz/7B48/28B51/操舵・自然ジャンプ・HUD・カメラ・得点不変。ART正式採用0件、Slope2 DNA正式0/2912m。GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。
