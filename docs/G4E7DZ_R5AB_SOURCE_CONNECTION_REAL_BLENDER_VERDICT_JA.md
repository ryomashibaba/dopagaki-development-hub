# G4E-7DZ R5A → R5B 実結果（2026-10-28 JST）

## 原物とActions

- R5A 接続候補監査: [#40635016206](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40635016206) SUCCESS、[Artifact #12793336478](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40635016206/artifacts/12793336478) JSON2。
- R5B 最小実Blender: [#40635313787](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40635313787) SUCCESS、[Artifact #12792424367](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40635313787/artifacts/12792424367) PNG8／編集可能BLEND2／監査JSON2。両道路とも新メッシュ2個、ゲーム新コライダー0。
- 元CX18、B48 7、B51 28、正規カメラ5、gap52、元CX保護blobは保持。元B48静的三角交差0、B51の4サンプル時点重なり0。これは完全連続時間安全性ではない。

## R5A接続候補

- true-pinch: 128候補から暫定幾何条件6件。最有力は元CX「04 roadbank-promenade None」への25.270m、端点4/4時点画角内、概算勾配4.11%。
- pinch-switch: 128候補から7件。最有力は同じCXへの7.087m、端点3/4時点画角内、概算勾配7.37%。
- 元道路端からの幅員確保、連続歩行アクセス、元CXとの構造接合は未認証。単一の参照レイとポリゴン最近接では正式な都市接続を証明できない。

## R5B真正画像美術判定：ART REJECT

元DRの真正Blender世界で最有力CX接点とB48路肩側の短い連絡床、CX側に延びる公共床を実モデル化した。R3巨大門・R4巨大斜面は流用していない。しかし遠景ではほぼ認識できず、近景は薄い床板・短い橋に見えるだけ。公共／鉄道／居住がつながる巨大都市内部を走り抜ける体験には達していない。接続位置の精度を建築美術の成功に読み替えない。

**最終区分：R5A/R5B の原ソースに基づく検査とBlender作成は限定TECH PASS、R5B ART REJECT。GAMEPLAY・HUMAN・PERFORMANCE・INTEGRATION・RELEASE HOLD、正式美術採用0、Slope2正式認定0m。**

## 次工程の必要条件

短い床を長くしたり、棚・門・地形の個数を増やしてはならない。次は上記接続候補と既存CX全体の関係を含め、公共／交通／居住を用途・支持・内外動線・走行時の前後視界から再設計する。単一の通路や公共床だけを「都市の内部」と呼ばない。正規ゲームカメラと安全性を守り、真正Blender構図が元DRより明確に優れる最小の実モデルが立つまで、大量生産・ゲーム導入を禁止する。main/Gold/P100/本番/240Hz/操作/カメラ/元CX/B48/B51の変更なし。PR #46 Draft未マージ継続。
