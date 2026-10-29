# DOPAGAKI SLOPE — R15K→R15K2 真正元CX面・元カメラ・B51視界保護の総括（2026-10-29 JST）

## 結論と判定境界

R15K最終真正GitHub Actions #40791002177 SUCCESS／Artifact #12861582490。R15K2軽量独立Actions #40791769661 SUCCESS／Artifact #12861692868。

R15I4の8未施工研究候補は元CX着地点完全一致4点、15m空間クラスタでは3地区。実CXポリゴンを三角分割した内部点・元R1 13時点×両道路の非遮蔽を照合し、上向きCX連結面を2.5秒連続して見られる元着地点3か所が残り、最終的に**中盤と後半の2独立地区**となる。これは建築・美術・荷重・人間通行・実WebGLの認証ではなく、次に検討できる研究区域2か所だけを意味する。

元ゲームCX18／B48実物理7／B51実動体28／R1 240Hz正規カメラの原ソースblob af076d67492a677d2235e4730aef8cdf4808e106 は不変。新ゲームコライダー0、正式ART採用0件、Slope2正式認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、PR #46 Draft・未マージ、main/Gold/P100/本番変更禁止。

## 地形の真正面積近似と視野

| 元CX実着地点XYZ | 元CXメッシュ | 上向き連結面積の元メッシュ近似 | 元面内サンプル数 | 両道路で2点以上非遮蔽の連続時点 | 研究 |
|---|---|---:|---:|---|---|
| (-106.8602,105.3425,-735.4758) | 02 roadbank-promenade None | 840㎡ | 15 | t12.5〜t15.0・6連続標本 | KEEP |
| (-85.9385,91.1614,-544.6877) | 04 roadbank-promenade None | 216㎡ | 15 | t14.5〜t17.0・6連続標本 | KEEP |
| (-85.8986,91.1614,-539.6735) | 04 roadbank-promenade None | 216㎡ | 15 | t14.5〜t17.0・6連続標本 | KEEP、直上行と5.014mで同一区域 |
| (-253.1522,113.413,-856.5842) | 00 roadbank-inhabited None | 92㎡ | 9 | 無し | 当該視点条件では対象外 |

KEEPはR15K研究継続のみ。元CX面積は元メッシュポリゴン面積近似で、支持地盤・人間歩行可能面積ではない。上の元選択面法線Yは順に+1,+1,+1,-1。最後の区画の周辺すべてが利用不能と断定しない。

元中盤の840㎡CXは**1枚の大ポリゴン**で、初回 #40789997365 は「1ポリゴンの中心1点しか検査しない」のに「2点以上の非遮蔽」を要求する偽陰性だった。途中修正版 #40790739202/#40790756010 もBlender 4.xの tessellate_polygon 戻り値が三角形の元頂点インデックスであることを誤読して FAIL。**最終 #40791002177 のみ採用**。実元ポリゴンの頂点インデックス→ワールドXYZ三角形→内部標本へ修正し、元CX840㎡では15点の真正標本。t12.5でtrue-pinch 8点、pinch-switch 15点、t13〜t15は両道路15点が見える。後半216㎡の各地点でも15点サンプルからt14.5〜t17の両道路6連続視認が確認された。独立QAは8種類の偽ART・偽人間・偽面積・偽連続時点等の注入を拒否。

## R15K2：元B51の基準投影を保護

半径15mの地理的クラスタ統合によってKEEP3座標→2独立地区。元B51の当該カメラに映る実動体中心の基準投影を保存し、直線距離／元速度≦2.3秒を「先行研究で要注意とする中心位置」として抽出した。

| 独立研究地区 | 元視界保護対象 |
|---|---|
| 中盤 02 roadbank-promenade | a13-machine-03 |
| 後半 04 roadbank-promenade | p95-hazard-02、a13-machine-04 |

元CX実面サンプルの画面包囲矩形と元B51の元カメラ中心投影を同時刻で比較した。矩形の重なりは将来の都市設計時に視界を壊し得る研究上の注意であり、元物体の全シルエット、実衝突の余裕時間、人間の反応時間、元WebGL2の回避公平性を証明しない。R15K2軽量CIは元ゲームも新建築も制作・編集せず成功。

## 次R15Lで着手する条件

1. 中盤・後半2地区で実B48路肩→元CX地形の現実的な全幅連続接続を測り、実面交差・段差・接合隙間・避難動線を検査。上向き面・可視15点だけで「人間が歩ける入口」と言わない。
2. R15K2で特定した3つの元B51基準危険中心だけでなく、**実障害物の全幅投影、元カメラでの初視認、240Hzの速度・操作、回避ルート**を評価し、未来都市で覆ってよい画面ではないことを明確化。
3. 入口→公共広場→主空洞→交通・居住層という一体の空間機能が成立する設計だけ、編集可能Blenderによる少数の真正造形へ進める。空中箱・二翼ロフト・細い庇・反復門の延命禁止。元CX干渉や実支持が未成立ならBUILD HOLD。
4. 元R1ソース画像での初ヒット率は美術PASSではない。実WebGL2、HUMAN、ARTは独立審査のままHOLDを維持する。

## 真正ソース

- R15K最終CI https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40791002177 （Artifact #12861582490）
- R15K2軽量CI https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40791769661 （Artifact #12861692868）
- 初回R15K誤判定の原因 https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40789997365
- R15J二案ART REJECT https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40780029723

ART HOLD／SOURCE READONLY TECH PASS／GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。Chat主体、Workは未承認のため不使用。
