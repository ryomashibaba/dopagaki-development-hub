# DOPAGAKI K4AN — 真正K4AJ ArtifactからK4AK/K4ALを実適用するART-FIRST原画審査アトラス

**2026-11-03 JST。SOURCE GPU TECH限定PASS／ART正式採用0件／Slope2 DNA認定0m／公開HOLD。**

## この工程の狙い

これまでのK4/K4R/K4U造形が「中庭はモデル内部にあるが、高速真正カメラから公共空洞と判読できない」ためART REJECTだった根本反省を継承。**新建築を増やす代わりに、既存の本物の元WebGL2画面上でRoad5をどこまで読めるかを可視化する**。元B51を研究用に一時非表示とした比較は原因分離のためだけに使用し、元ゲームのB51・collision・Cameraを**決して変更しない**。

## 入力と堅牢な証拠鎖

1. K4AJ [成功CI #41566784540](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41566784540)の真正 Artifact ID `13201661563` をGitHub APIから実ZIP再取得。SHA-256は**`60aab331d8881b5f8f456539c00566837a2b061a96ab0725ce7c17ea91ed8efb`**、11,959,523bytes、CRC正常28メンバーの実検証を必須にする。既存のSOURCE TECH成功がない場合に偽成功を生成しない。
2. [K4AK既存の保護されたART-review packet generator](../scripts/p101-r19a6p4r2f5k4ak-art-first-review-packet.py)を、K4AJ実独立JSON＋100行CSVで実行。15時点の真計測マスク寄与数値を持つ**未制作候補用の撮影要求リスト**を作る（新候補作成・人間認知検証ではない）。
3. [K4AL既存RGB出所ガード](../scripts/p101-r19a6p4r2f5k4al-true-rgb-coverage-audit.py)を、同じ本物のK4AJ生GPU JSON・24元PNG・K4AK packetに適用。元PNG SHA・bytes・100ケース元/mask/復元深度の照合を行い、15要求中元RGBを**撮影済み6／未撮影9／別撮影2**に分類。
4. [K4AN真正元RGBアトラス生成コード](../scripts/p101-r19a6p4r2f5k4an-original-rgb-review-sheets.py)で、元source本来のPNG8＋同native tickの`B51_BODY_ALL_28`一時非表示8＋復元8、**全24実画像を再度SHA/bytes照合**。元/復元RGBバイト一致、11,176深度格子の元/復元完全一致、非表示深度単調、CSVの同tick深度変化値一致を要求。元sourceの超高速走行画像を二幅それぞれ4対ずつ横並び比較するレビュー画像2枚とメタJSON1件を生成。

## GitHubへの成果物保存と可視性

[K4AN専用Actions](../.github/workflows/p101-r19a6p4r2f5k4an-pinned-real-gpu-to-art-review.yml) は独立`concurrency`、`cancel-in-progress:false`。K4AJ・K4AK・K4AMの既存ジョブをキャンセルしない。全審査PASS時だけ、**現研究ブランチの `docs/research-evidence/k4an/`** に元PNG比較シート2件、K4AK packet、K4AL report、K4AN indexを保存する。これは**本番公開でもmainマージでもない**。Artifact ZIP（14日保持予定）も別途作成。ブラウザから直接画像比較できる研究成果を残す。

- 14m：11280／11320／11341／11369 の4元画面 vs group mask。
- 28m：11259／11278／11280／11307 の4元画面 vs group mask。
- source保存済み画像8tickのうちK4AKの独立ART要求との共通は6tick。残り9tickはK4AMの本物のCI結果が確認されるまで**不足/HOLD**。元/source B51無効化画像のみで真の新都市造形を表現しない。
- 14m tick11341の元WebGL2画像では紫色系のB51視覚形状が広い範囲を覆うが、これは**単一時点の元画面画像の事実**。K4AJで最大11,176/11,176点の深度変化はtick11339であり、`11341`と時点を取り違えない。持続する人間視界遮蔽を認定しない。

## この工程で決して達成扱いしないもの

候補新モデル/Collider0、ART正式採用0件、Slope2 DNA認定0m。継続するRoad5《斜裂公共峡谷》構想は未制作。**元source RGB比較8点**は候補形状の同カメラA/Bにあたらない。3層公共空洞の人間的可読性、道路との実床支持、原B51の操作/視認手掛かり、ゲーム人間試遊、B48/B51 SAT/CCD、Windows/iPhone FPS、RELEASE/MERGEは全HOLD。旧K4/K4R/K4U ART REJECTを覆さず、元source Git blob `af076d67492a677d2235e4730aef8cdf4808e106`／240Hz球・カメラ・道路／本番URL／main／Draft PR#46は無変更。

**当初状態**：本工程の解析コードと独立CIは研究ブランチに保存。新規CI [#41572736850](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41572736850)は作成時点 queued。**GitHub Actionsの実成功と研究ブランチ上の画像保存は実照会するまで未確認**。ローカルで取得済みK4AJ真正Artifactを用いた同等の画像8対の生成はPASS（真正元PNG SHAと深度比較済み）。K4AK/K4ALをGitHub Actions上で本物の生Artifactへ適用する工程は新CIの結果待ち。
