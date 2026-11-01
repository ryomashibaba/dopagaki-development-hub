# DOPAGAKI SLOPE — R19 A6 P4 R2E-C 実装候補・HOLD

2026-11-01 JST。正本はDraft PR #46の開発ブランチ、R2E-B原本は維持。

## 今回の技術変更
- Source B48道路1の実アンカーに基づき、既存3地区の間に**実3Dの分節された公共街路と高さ・奥行きの変わる中低層街区**を追加。道路0では住宅と市場それぞれの局所街路だけを作り、対岸へ橋を架けない。
- 5地区、22プログラム、各36mの屋外中庭と12分割環状歩廊、R2E-Bの壁と支持造形を維持。道路本体、物理、GLB原本、現行本番には触れない。
- 新しい舗装モジュールの実3D共有断面を記録。ただし**地形・実道路メッシュとの接地や人体が歩けることは未検証**。変形道路の衝突判定、真の画素遮蔽を数値と見た目の推定だけで証明したとは扱わない。
- 開発専用のBlender生成、GPU変換、元のWebGL2真正12画面、元B51 2881tick×全28×2幅＝161,336離散時刻のSAT専用QAを独立させた。**未実行状態ではTECH PASSではない。**

## 次の審査
1. GitHub Actionsの新規R2E-Cワークフローで新BLEND/GLBと12真正PNG・新SATログを取得。元R2E-B結果は代用不可。
2. Road0 4.404s/Road1 8.004s,11.504sの原カメラを旧R2E-Bと並べ、**一体の都市に見えるか**を厳格判定。形状が弱い場合はR2E-Cの同じBlender案を再編集し、安易な同型群増殖はしない。
3. B51実画素、プレイヤーの速度感・狭路の視認、人間走行/Windows・iPhone FPS、地形支持、連続時刻の静的衝突は独立実証までHOLD。

元ゲームblob `af076d67492a677d2235e4730aef8cdf4808e106`、240Hz、7B48、28B51、カメラ/HUD/採点、main／Gold／P100／W9-X／B5／2本番サイトは変更禁止。正式ART採用0件、Slope2 DNA正式認定0/2912m、GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。PR #46はDraftのまま。

[上位R2E-C計画](R19_A6P4_R2E_C_SOURCE_CAMERA_URBAN_CONTINUITY_CONSTRUCTION_PLAN_JA.md)
