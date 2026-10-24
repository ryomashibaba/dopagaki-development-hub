# G4E-7U — 2026-10-23 JST — authentic ONE-CELL early-gap causal / native research (HOLD)

R2 lower landing experiments were ALL invalid: even the no-gap comparator failed to leave road I at 7.317sec. Abandon the lower-road slope deformation and retain G4E-7T SOLID, which finished 7/7 start00 in 53.300sec. The prior R1 two-cell (13.79/13.507m) open cuts cause extra air (34/33 240Hz frames while both trials are running) but hit a nonrideable static triangle during attempted landing at 5.071/5.529 seconds. We cannot call this an acceptable jump.

G4E-7U tests NINE independent **single missing physical B48 longitudinal cells** at first road u=0.5–0.722, plus an identical uncut SOLID baseline. Physical centerline and 13.6m early neck are byte-identical to G4E-7T SOLID; 28 machines, 7 roads and native 240Hz all unchanged. The candidate is causal only if the intact stage is grounded when the cut stage is airborne while BOTH statuses are RUNNING. Landing requires native grounded on the same real first B48 road after the physical cut. Full native scripted completion requires all 7 roads in order. Human-facing interpretation is separately HOLD. None are published or officially recognized.

G4E-7T first private WebGL experiment failed in A13 general manual-audit allowlist before taking screenshots; G4E-7U fix excludes private T stages from normal B5/A13 audit, without broadening the whitelist. WebGL rerun still required.


## G4E-7U 実測・判定 — 2026-10-23 JST

### 正規スタート00 240Hz / P96補助操舵は研究だけ

- 第1回 10条件: [Actions #39854477099](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39854477099) SUCCESS。SOLID 7/7 53.300秒、ONE53 7/7 62.408秒、ONE63 7/7 53.283秒、ONE65 7/7 53.279秒。残る候補は自動FAIL。SUCCESSは検証ソフトの成功であって美術/人間プレイ合格ではない。
- 拡張16条件: [Actions #39855105176](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39855105176) SUCCESS。追加ONE64 7/7 56.788秒。踏切の実物理幅 ONE52=15.76m (第III路面の動体事故でFAIL)、ONE53=14.06m (全7道路完走だが+9.108秒)、ONE54=13.60m (落下FAIL)、ONE63=48.22m (完走するも非常に広い)、ONE64=47.40m、ONE65=44.52m。**10–16m級の狭さと正規7/7を両立する唯一の研究候補はONE53**。ONE63/64/65は広い踏切であることを隠して評価しない。
- ONE53: ギャップ実長6.973m、接地状態の対照との空中差139tick、再接地地点は第一道路 u≈0.84033、7.94583秒・63.445m/s。正規走行全体62.4083秒、最大192.41m/s。ここでの139tickは「両Runnerがrunningのとき、切断部近傍の一定u区間で対照が接地し切断側が空中だった時間」であり、ギャップ7mの単体飛行時間ではない。人間のジャンプ成功率と同一視不可。
- G4E-7T private real WebGL [Actions #39854170767](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39854170767) SUCCESS。先行CI #39802154253 はG4E-7Tを一般A13手動監査allowlistに誤投入する読込バグでFAIL。修正コミット `e4f6d7e...` により研究用だけ排除。6視点の実B48静止確認と public/site 不混入を回復。ただし画面は検査spawnの初速52m/sであり高速時の公平な視認性証明ではない。背景・幾何構造は依然美術HOLD。

### 小規模上下形状の反証

[Actions #39855904924](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39855904924) SUCCESS：元のONE53と、実B48路面u=.56–.70の制御行に最大±0.8/1.6/2.4mの微小な上下勾配を付与した7案の正規240Hz比較。

| 研究候補 | 7道路 | 自動完走時間 / 失敗 | 初回路面再接地 |
|---|---|---|---|
| zero（保護されたONE53） | 7/7 | 62.4083秒 | 7.94583秒 |
| down08 | FAIL | 52.6958秒に赤い動体へ衝突（第V道路） | 7.80417秒 |
| down16 / down24 | FAIL | 9.8333 / 9.7833秒に第一道路から落下 | なし |
| up08 | 7/7 | 62.6083秒 | 8.0375秒 |
| up16 | FAIL | 53.225秒に赤い動体へ衝突（第V道路） | 8.125秒 |
| up24 | 7/7 | 63.9750秒 | 8.17917秒 |

**今回の小高さ変化はONE53を改善できない。** R2の12–18m全面垂直変化は既にno-gap対照すら落下させており却下。上記変更も独立研究のみで元のONE53 / T / R / Q / Goldは書き換えていない。

### 根本の速度損失を固定物理の観測から特定

[Actions #39856524755](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39856524755) SUCCESS：RADIUS/240Hz/物理CCDは非改変、研究入力P96/4.8からの衝突前後速度と実イベントのみを観察。

ONE53 t=4.99583秒、ギャップ出口 u≈0.5986 付近の1固定接触で速度87.7045→56.2817m/s（31.42287m/s減）。鉛直速度 -26.831→+29.998m/s。接触時イベント列にmoving-contactなし。近傍三角形は第一B48路面の edge（非rideable）とtop（rideable）双方を含む。記録された近傍距離/法線から **実CCDで選択されたのがedgeかtopかは断定できない**。したがって、固定B48路面近傍の急峻な接触法線・側縁・実三角面を次の専用診断対象とする。単にギャップ存在を証明しただけで爽快な自然跳躍だとは認めない。

### 次段階 G4E-7V

ONE53を独立研究ベースラインとして保護し、実CCDが衝突したtop/edgeの確定判定と、高速走行体から見た予見可能な着地線、元の約14mの路幅を維持した接触法線の局所調整を検討。違反すべきでない要件：隠し橋・隠し床・ジャンプボタン・速度リセット・カメラ過追随・危険機械削減・自動操舵の通常ゲーム混入・強制中央安全線。すべてHOLD、PR #46 Draft、7本B48/28動体/240Hz維持、公式Slope 2 DNA 0m。
