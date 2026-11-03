# DOPAGAKI K4AL — 真正元RGBの取得計画・証拠SHA・ART審査要求の突合（ART HOLD）

2026-11-03 JST。**K4AJ/K4AKを変更せず、研究ブランチだけに実装**。新モデル0、元球・Camera・240Hz・B48×7/B51×28・source・main・PR#46・本番URLには変更なし。公式ART採用0件／Slope2 DNA認定0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。

## 今回の発見：K4AJの「真正GPU深度100ケース」と「真正RGB画像」は別の個数

- K4AJは**100個の元GPU depth、100個のB51 BODY群除去GPU depth、100個の元復元depth**を計画（K4AJ CIが成功するまで未確定）。
- しかし同CIの元RGB画面PNGは、コードで明示した **14m ultra: tick11280,11320,11341,11369／28m control: tick11259,11278,11280,11307** の **8時点**のみ。各時点で「元画面／B51全28体の視覚mask／元復元」の3画像（計24枚）を保存する**予定**。
- K4AKのART-FIRST真正同一カメラRGB審査要求は、14mで8tick、28mで7tick＝**15時点**。**計画上の共通部分は6時点、K4AKに必要だが元RGB撮影予定がない時点は9、K4AJ撮影予定だがK4AK未要求の時点は2**。
- これは**ソースコードに基づく撮影計画の静的照合**であり、画像24枚の取得成功、真GPU遮蔽率、計測時間、ART判断を意味しない。「100 GPUケース=100枚の真正RGB」と誤報しない。

## 実装・検証

- [RGB証拠突合プログラム](../scripts/p101-r19a6p4r2f5k4al-true-rgb-coverage-audit.py)：K4AJ真正生JSONとそのPNG実ファイル、K4AKレビュー要求JSONを受け取る。元source blob、B48/B51、元Camera状態、99＋参照tickの全100ケース、元/mask/復元depth全11,176点、元depth復元、mask深度単調、8時点×3 PNGファイルの実bytes/SHA256/寸法、ART/HUMAN HOLD、候補未制作、15要求時点を照合。8撮影時点の証拠リンクと9未撮影時点の不足を**機械読取可能なJSON**に出力する。
- [synthetic end-to-end再現テスト](../tests/p101-r19a6p4r2f5k4al-rgb-coverage.test.py)：100 source/mask/recovery深度組＋8時点×3のテストPNGを作って完走、5個の不正（虚偽候補、審査時点欠落、maskで近いdepth、復元破壊、PNGバイト改ざん）を拒否。加えて本体 `--self-test` は静的8/15/6/9/2計数、PNG SHA/bytes/パストラバーサル拒否を確認。
- **ローカル隔離テスト結果**：`python -m py_compile` PASS、本体 `--self-test` PASS、合成100frame E2E PASS、5負例拒否PASS。GitHub保存した両PythonのGit blob SHA-1をローカルと一致照合。**真正GitHub Actions / 真ArtifactでのK4AL実走は未実施**。
- K4AJ `#41566784540` とK4AK `#41568787273` がqueuedの間に不要な専用workflowを起動しない。K4AJ/K4AKスクリプト／workflowのpaths filter外の新規K4ALファイルに隔離した。

### 真Artifactができたときだけ実行する手順

```bash
python3 scripts/p101-r19a6p4r2f5k4al-true-rgb-coverage-audit.py --self-test
python3 tests/p101-r19a6p4r2f5k4al-rgb-coverage.test.py

# 先にK4AJ真Artifact ZIPのSHA256/CRCと生深度の独立監査、およびK4AK packetの実生成を行う。
python3 scripts/p101-r19a6p4r2f5k4al-true-rgb-coverage-audit.py \
  --raw r19-evidence/r19a6p4r2f5k4aj/K4AJ_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json \
  --packet r19-evidence/r19a6p4r2f5k4ak/K4AK_ART_FIRST_REVIEW_PACKET.json \
  --root r19-evidence/r19a6p4r2f5k4aj \
  --out r19-evidence/r19a6p4r2f5k4al/K4AL_TRUE_SOURCE_RGB_COVERAGE_REPORT.json
```

## 正当な次工程とアート方針

1. **K4AJ真正GPU CI完了の実測を優先**。SUCCESS時のみ生Artifact SHA-256・CRC・100 GPU組・元K4AFアンカーを独立監査。FAILなら最初の原因を根拠に最小修正し、連続pushによるキャンセルを防ぐ。
2. K4AJ独立PASS時に限り、K4AKを**実Artifactに適用**。次にK4ALで既存の真正RGB時点の可用性・原PNG SHAを検査。未撮影9tickは**未撮影として残す**。見栄えで補間しない。
3. Road5《斜裂公共峡谷》のART-FIRST一方向は**未制作**。本物のCamera/源道路/B51と公共空洞の入口・中間・奥の可読性を成立させる設計へ進むときも、合否は独立ART/HUMAN検証。元真正RGB・新候補同一pose A/Bがない間は採用しない。
4. **CIとARTを無意味に増やさない**。元ゲーム改変禁止、main/本番/PR#46不変更、Work事前承認、SOURCE TECHと正式ART判定を混同しない。

**K4AL 現時点判定：静的計画照合および合成E2E検証PASS／真正GPU・元PNG実Artifact適用HOLD／ART採用0件／Slope2 DNA認定0m。**
