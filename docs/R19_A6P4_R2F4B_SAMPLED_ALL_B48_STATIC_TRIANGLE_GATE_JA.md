# R2F4-B 元B48全7道路の静的交差検査：どこまで証明できるか

`scripts/p101-r19a6p4r2f4-b48-sampled-static-triangle-sat.mjs` は元物理ソースと同じ`sample(surface,u,v)`を使い、元B48×7道路を各U=320区間/V=12区間に分けて三角形へ再構成（各道路7680三角形、全53,760三角形）。実GLBを独立デコードしたGPU頂点から実都市メッシュの約4万三角形を読み、広域空間ハッシュ・3D AABB・三角形同士のSATを使って**近似サンプル道路と実GLB**の静的交差を全7道路・両幅で検証する。

これは従来の距離サンプリング（頂点/中心のみ）よりも強いが、**実ゲームが描画/衝突するB48の厳密な同一三角形ではない**。したがって仮に交差0でも`sourceB48OriginalExactMeshClearance`や`realGameplayCollisionClearance`はPASSとは言えない。ステージ不変確認／元source SHA `af076d67492a677d2235e4730aef8cdf4808e106`／元GLB GPU読み込みに加え、三角形SAT単体テストを実行。交差を1件でも検出すればCIは失敗で拒否する。近似検査成功は正式ART採用、地盤接地、B51時刻間CCD、元B51実画素可視、実人間通行・FPSを保証しない。

新Workflowの作成は禁止し、既存R2F4の本物BLEND/GLB・B51 2881tick×2・元12真正WebGL2 PNGと同じActionsで一回の採択ゲートに統合する。PR #46 OPEN/Draft/未マージ、main/Gold/P100/W9-X/B5/2本番URL不変、RELEASE/MERGE HOLD。
