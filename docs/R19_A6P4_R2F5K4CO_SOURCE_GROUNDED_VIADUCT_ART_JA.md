# K4CO R2 最終確定 — 真正Blender TECH PASS／直接ART REJECT（2026-11-05 JST）

**この節を本ファイルの最新判定とする。下段のR1未確認やCI実行待ちは過去の時点の記録。**

- **最終真正[Actions #42012187718](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42012187718) はcompleted/SUCCESS。** 入力作者R2 commit [e956f46e7f280e63c7f4f45f085a99f66d65992f](https://github.com/ryomashibaba/dopagaki-development-hub/commit/e956f46e7f280e63c7f4f45f085a99f66d65992f)。K4CN R2可編集真正親SHA `f66531d8596e67a19f4c6f2debcf2521efbae54d9fc5ac911f94963dd6a45156` から元SOURCE Road5/元CHASE/元Game/240Hz物理・木11・全ライト・親Mesh形状と行列を不変に、道路の遠景実地形へ実95m港湾貨物連絡高架を新編集可能MeshとしてBlender4.0.2 EEVEEで制作した。橋デッキ、アーチ、ハンガー、地盤接続を実立体で生成。**新ゲームCollider 0、旧Game改変0**。
- **真正Artifact [#13408380356](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42012187718/artifacts/13408380356)**をGitHubから独立再取得。ZIP **127,282,138 B**、SHA256 **`4b6eb3dfbad73b8256d0fac77d7b5cddf818d8f3f6d234566a15f5b79cbd9736`**、全ZIPメンバー読取CRC PASS。真編集可能`K4CO_TRUE_SOURCE_LOCKED_FREIGHT_VIADUCT_EDITABLE_ART_HOLD.blend` **283,834,548 B**、SHA256 `9574e6f49865cf962280caa073f2c5583cf1a3ed1ae41a9efb2a4167d6ed3c91`。真CHASE PNG **522,452 B**、SHA256 `d176d88ff1b0f3bc0323f8926bec6b0b0e6cca95ab311429d16330617b6e3b65`。独立照合でBlender/Pngの実サイズ・SHAが監査JSONと完全一致。
- **[K4CO R2とK4CN R2の真CHASE同画面比較](research-evidence/k4co/K4CO_VS_K4CN_TRUE_SOURCE_CHASE_ART_REVIEW.png)**、[独立監査JSON](research-evidence/k4co/K4CO_REAL_NATIVE_AUDIT.json)、[CI確定実run JSON](research-evidence/k4co/K4CO_CI_LATEST.json)。真R2では道路遠景方向へ架橋位置をSOURCE沿い約60m移す実作者修正（道路source前方d=94→154m）により、上部構造が画面内へ収まり、橋による元道路中央の画像差は前R1の**1,482px→R2 24px**に低減。独立固定ゲート**120px未満**を閾値変更なしにPASS。遠景ランドマーク差**8,804px**。真正SOURCE横断面9地点測量、最小道路上クリアランス**26.4016m**、アーチ式貨物高架95m／940頂点740面／真地形接続橋脚4本。これらはいずれも**技術確認でありART評価点ではない**。
- **元画像を直接開いて独立ART評価：K4CO R2もART REJECT。** R1の橋影が交通車線を覆い、上部アーチが上端で切れていた問題は解消した。R2は遠景に実在感ある連続高架が入ったが、高架1基だけでは、前景の広すぎる直線ロード、左の三角尖塔的な地質、右の港が独立の薄い模型/骨組みに見える欠陥を解消していない。進行方向の高速走行感・生活/港湾機能・海水面と街/地質の奥行き・劇的な走行体験の総合水準は未達。色替え・橋小物・繰り返しQAでART PASS扱い禁止。**本番実装・実WebGL2/Chromium・人間走行・FPS・SAT/CCD未実施**。
- **旧R1失敗を保存**：[Actions #42011378602](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42011378602) は元SOURCE保護・真Blender出力・親認証まで成功、ただし画像独立ゲートで`ORIGINAL_GAME_ROAD5_VISUAL_CORRIDOR_CHANGED,1482`のためFAILURE。ART未判定。過去のCANCELLED runs #42008835265などもR2成功と混同しない。K4CO R2は元道路やQA閾値を改変するのではなく、真3D橋のSOURCE軸上の位置を変えて解消した。
- **次工程方針（既存ART-FIRST/QUALITY-FIRSTの継承）**：K4COの幾何・ソース・画像ゲートを再試行せず、局所的な桁/手すり/小屋等の増殖を止める。最重要は本当に遊びたい世界水準の高速3Dゲーム。次は**ゲームの走行方向と地形/水面/港の用途が一体で読み取れる全画面の芸術的な走行空間**を1つの統合垂直スライスとして再設計する。元Road5/Camera固定のSOURCEが前景の幅を占める制約を認め、道幅を偽装/狭くするなどの基準すり替えをしない。作者が具体的な全画面構図を定義できなければ、追加DCC模型を作らず現状ART HOLDで停止。ARTと実ゲームの別々のゲートを通るまでは正式採用・公開しない。
- **不変ロック**：main、公式P101、Draft PR #46、Gold/原作Slope、本番2サイト、元Game git blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5 SHA `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、240Hz物理/6Camera/CHASE/木11・全ライト。**正式ART採用0件、Slope2 DNA認定0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD**。追加課金原則0円。Work/Computer Use・main/公式P101・公開・merge・正式採用は個別事前承認。ユーザー操作最小。

---

## 2026-11-05 CI実測補足：旧コードrunはCANCELLEDであり、K4CO最終成功ではない

- [真正Actions #42008835265](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42008835265)：GitHub APIの実ジョブ結果で`completed/cancelled`。元Gameチェック、Python構文、K4CN R2親Artifact取得と実SHA認証は成功。Blenderインストールでcancelled、実制作・画像独立QA・研究Artifactはスキップ。**TECH PASS/ART PASSとして数えない**。
- このrunの`workflowSourceCommit=425e5f30465fa96cb39502206b9374f7b8967bc8`。後続で真正Road5の9地点（3×3）標高ray検証、最小実道路クリアランス20m超を厳格化した別コミット`4ce63d5fa03e11d412f6d38cc70b78a4f48318c1`とその独立CI変更`bdf3efb394a2fd67b6c0a35a6cde0497ad76d8ce`が存在する。**旧runのキャンセルJSONを最新実装の検証結果に取り違えない**。
- 最新コードに対して独立Blenderの完走runと真正PNG・別取得ZIP全CRC/SHA・直接ART判定が必要であり、記録がない間はHOLD。

---

## 2026-11-05 K4CO接地実装と実行状態の自動保存（結果は未確認）

- 研究高架橋の橋脚について、当初は元地形の座標から高さのみを引用し、平面上の端点位置が真の地形頂点に一致していなかった。この構造矛盾を修正した。**計4本の支持バットレスをK4CN R2親岩盤・岸壁の真正頂点に下端接続**し、接続の位置と道路外側をコード上で確認する。元研究親の全頂点・行列は不変。修正したのはK4CO専用追加Meshのみ。
- 独立Workflowに `realSourceVertexAnchoredButtressCount==4` を追加。SOURCE保護・道路中央・画像品質閾値の緩和なし。
- 今後実CIの最終判定が得られれば `docs/research-evidence/k4co/K4CO_CI_LATEST.json` をActions内の最後の `if: always()` 段階で作成する。実run ID、実際の `job.status`、親SOURCE commit、独立native画像ゲートの完走証拠を格納し、後続チャットからGitHub上で取得する。GitHub原本ファイルを変更しない。**未生成／読み取り不能なら未確認のまま。成功と推定しない。**
- 本記録の段階では真正Blenderの実出力・GitHub Actionsの実run ID・実ZIP CRC/個別SHA・画像直接ART評価はなお未確認。したがって**TECH PASS / ART PASSのいずれも新規認定しない**。

---

# K4CO｜真SOURCE固定の95m港湾連絡高架ランドマーク — 実制作コード・真正検証待ち

作成日：2026-11-05 JST。これは確定済みの方針の継続であり、新たな公式ART認定ではない。

## 継承した確定事実

- 前工程K4CN R2 [Actions #42003004167](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42003004167)は真正Blender TECH PASSだが、真CHASE直接観察で**ART REJECT**。左の鋭角な山塊、右の板と骨組みの港、直線道路が画面を支配する現構図を小調整する方法は打ち切る。
- 親は真正K4CN R2 [Artifact #13403680959](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42003004167/artifacts/13403680959)の編集可能BlenderをSH256 `f66531d8596e67a19f4c6f2debcf2521efbae54d9fc5ac911f94963dd6a45156`で固定。親データ本体は改変・上書き禁止。
- K4CM R3は真正TECH PASS/ART REJECT。K4CN R2はTECH PASS/ART REJECT。**正式ART採用0件・Slope2 DNA認定0m**、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLDを継続。

## 今回実装した単一の大規模3D作者変更

研究枝：`research/k4co-source-locked-freight-viaduct-landmark-20261105`。

- コード：`scripts/p101-k4co-native-freight-viaduct-landmark.py`
- 研究CI：`.github/workflows/p101-k4co-native-freight-viaduct-landmark-art.yml`
- 父の左198m断層岩盤・右港湾土木を原形状で保持し、**約95mの道路横断貨物高架**を新規編集可能な1研究Meshとして造形。左右の橋脚は研究親の実岩・実港の頂点座標から近接アンカーを選択し、既存Road5の真の高さを読み取って道路上に25m以上のモデル上の空間的余裕を設ける。
- 走行方向の遠景に意味ある港湾インフラのランドマークを成立させる狙い。単なる小物、抽象ドーム、スクリーン用絵・偽Game Cameraではない。ただし**真の画像で効果を確認するまではART UNJUDGED/HOLD**。
- 橋の上面・鋼製上部アーチ・ハンガー・地盤支持橋脚はひとつの3D施工研究対象で、港湾の作業連絡という目的を持つ。**ゲームへのCollider追加0**。この研究物体がゲーム内で走行可能・実際に使用可能であるとは宣言しない。

## 独立試験と停止条件

1. GitHubで親Artifact全ファイルbytes/SHAを独立確認し、元Game git blob `af076d67492a677d2235e4730aef8cdf4808e106`、Road5全頂点面SHA `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`を固定。
2. 真正Blender4.0.2で非破壊の1可編集研究Meshを制作し、`K4CO_TRUE_SOURCE_LOCKED_FREIGHT_VIADUCT_EDITABLE_ART_HOLD.blend`と元CHASE 768×480 `K4CO_TRUE_SOURCE_CHASE_FREIGHT_VIADUCT_NOT_GAME.png`を別名保存。
3. 元6Camera/CHASE、元11本の木、全ライト、継承全Meshの頂点と面/Transform、SOURCE ROAD5/元物理/元Gameを完全保持。橋の実高度、左右の実地盤近接アンカーを検証。真正比較は遠景ランドマーク・道路中央それぞれ別領域で確認する。保護試験の閾値を下げてPASSにしない。
4. TECH成功が実証できた場合も元画像と真正K4CO画像を**直接開いてART判断**。編集可能.blendとPNGの実Artifactの独立全CRC/SHA検証はまだ未実施。実WebGL2・240Hz人間プレイ・FPS/HUMAN/CCD/SATは別ゲートでHOLD。
5. もし真正CI FAIL、画像差が不足、またはART REJECTなら正式採用しない。小さな橋材やQAを反復せず、ゲーム体験と全画面構図の根本障害として再評価する。

## 現在の実行状況

新研究ブランチへの作者コード・Actionsワークフローの**GitHub保存は完了**。GitHubの実Actions最終run番号・完了/成功・実.blend・PNG・ART・実ZIP CRCは**未確認**。**TECH PASSとは言わない**。作品完成・正式採用・実プレイの認定を禁止。

main、公式P101、Draft PR#46、原Slope、Gold、元SOURCE、元Road5、240Hz物理・Camera、本番2サイトは変更禁止。Work/Computer Use・追加課金・正式採用・merge・本番公開は事前承認。ユーザー操作最小。
