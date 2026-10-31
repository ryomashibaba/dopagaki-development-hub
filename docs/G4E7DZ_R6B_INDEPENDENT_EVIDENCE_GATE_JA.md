# G4E-7DZ R6B 独立安全性ゲート／R6C着手制約（PRIVATE・非採用）

2026-10-28 JST。R6B元DR真正Blender [Actions #40637504539](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40637504539) の Artifact **12794281741** を取得して両道路×4時点の真正PNG8枚・BLEND2個・監査JSON2個を点検した。元DR・R4・R5Bの同一時刻真正Blender画像も取得し、両道路別に4段階を視認比較した。新都市WebGL、人間操作、連続時刻全域、FPSの証拠ではない。

## 自動検査の盲点と追加したゲート

従来のR6B専用Actionsは元ソース保護・出力・JSONスキーマ等に成功しても、\`fourSnapshotB51Clear\` が **false** であることを失敗条件にしていなかった。結果として **Actions SUCCESSでありながら新建築が元B51動体と交差**した。ここをCI成功と安全合格で混同してはいけない。

追加した \`scripts/p101-w9c2-g4e7dz-r6b-evidence-gate.py\` は、2道路・4時刻・元CX blob・元B48/B51/カメラ/gap52・非統合条件を検証し、B48/B51との交差が一件でもあれば \`candidate_sampled_clearance: REJECT\` をJSONへ記録する。 \`--require-clear\` ではREJECTを終了コード2として返す。交差0でも \`PASS_SAMPLES_ONLY\` とし、連続時間安全性・美術・人間QAを昇格させない。R6B元モデルやゲームには何も変更を加えない。

ローカルPython unittest **4件PASS**（汚染元ソース、片道路欠落、サンプル時点欠落、動体衝突と偽PASSの防止）。実Artifact監査JSON2個に本スクリプトを適用し、両道路とも **REJECT**、\`--require-clear\` は終了コード2を確認。ただしこれは独立JSON後検査であり真正ゲーム走行ではない。

### 実物根拠の要点

| 観点 | true-pinch | pinch-switch |
|---|---:|---:|
| 元B48三角交差 | 0 | 0 |
| 元B51サンプル交差（15.5/16/16.5/17秒） | 5/3/2/2（12）| 5/3/2/3（13） |
| B51干渉対象 | a13-machine-04 | a13-machine-04 |
| CX原メッシュとの交差組 | 8 | 11 |
| 公共ターゲット通視 | 4/4 | 4/4 |
| 鉄道・居住・CX接触ターゲット通視 | いずれも0/4 | いずれも0/4 |

代表点のレイ判定は、対象を人間に理解できるかという美術評価ではない。実画像では近景の横長な塊・斜面・帯が主となり、R4と異なる高品質な生活都市の内部は成立しない。**R6B安全性FAIL／ART REJECT**。原世界保護は限定PASS。真正WebGL／HUMAN／PERFORMANCE／INTEGRATION／RELEASE／MERGE HOLD。正式ART0、Slope2認定0m。

## R6Cへの制約

R6Bの帯状押出し、R4斜面、R3門の直接変更・装飾追加は禁止。まず元カメラの**時間的経験**（進入→接近→内部→退出）を道路位置に結び、公共・交通・居住の機能が個別に判読できる「実空洞と都市生活の変化」を、押出し母体以前に最低限の真正画角で提示する。B51の4時点だけでなく将来は連続時刻を検証し、元CXとの構造・歩行接続を一点接触と混同しない。候補がR4/R6Bより魅力的と証明できない限り大量造形・ゲーム統合禁止。PR #46 Draft維持、main/Gold/P100/本番・物理・カメラ・B48/B51/CX変更禁止。
