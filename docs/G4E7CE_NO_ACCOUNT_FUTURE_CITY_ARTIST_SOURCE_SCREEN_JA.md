# G4E-7CE — アカウント不要の正規建築原本ルート・美術事前審査（2026-10-25 JST）

## 到達結果と未達境界

**NO-ACCOUNT SOURCE DISCOVERED / SOURCE-LISTING AND PUBLISHED RENDER INSPECTED / LEGITIMATE DOWNLOAD PATH VERIFIED ON OFFICIAL PURCHASE PAGE / ZIP BYTES NOT ACQUIRED / GLB NOT INSPECTED / ORIGINAL SHA256 UNKNOWN / SOURCE TEXTURES UNINSPECTED / ART HOLD / NATIVE CAMERA AND REAL WEBGL NOT RUN / HUMAN HOLD / PUBLISH, READY, MERGE HOLD.**

ユーザーの明示した「新しいEpic/Sketchfabアカウントをいくつも作りたくない」という負担制約を反映する。ユーザーの承認なく新たなサービス登録を前提にしない。G4E-7CCの認証必須候補が検証不能なら無登録候補へ切り替えるが、**低品質なものを権利の簡単さで採用しない**。

## 第一の無登録**検証候補**：Dreamloft3D《Tron Gothic City》

- 制作者の正規配布: https://dreamloft3d.itch.io/tron-gothic-city
- 通常の無料配布フロー: https://dreamloft3d.itch.io/tron-gothic-city/purchase
  - 公開購入画面は **"No thanks, just take me to the downloads"** を表示、寄付なしでダウンロードに進める旨を明記している。**公式ダウンロードの完了や原本取得をこちらでは確認できていない**。メール/アカウント作成を必須と断定しない。
- itch.io公開ページの作者名: Dreamloft3D。本人は、**Sketchfabでの2021年3月初公開モデルを移転掲載した**と説明。これにより、閲覧元はSketchfabでも、作者による別の公開配布経路がある。
- 公開ライセンス表示: **Creative Commons Attribution 4.0 International**（作者表記が必要。作者本人はコメントで通常用途はクレジットでよいと説明）。配布ZIP内のクレジット/LICENSEを再照合し、**特定作品『Tron: Legacy』とのデザイン類似、図案・商標・第三者IPへの権利リスクは別ゲート**。CC BY表示は第三者の著作権まで保証しない。
- 作者申告: Blender制作、94k+ triangles, 47k+ vertices, 8 PBR materials, **6 textures**, `.blend`, `.fbx`, `.glb`, `.obj`、ZIP **6.6MB**。公開ページは「No generative AI was used」と表示する。これらは作者ページ記載値であり**実ファイル内容の検証値ではない**。
- 公開レンダリングからの限定的な所見（**配布モデル実画素とは独立検証していない**）:
  - 強み: ゴシック塔と通り沿いの厚い外殻、明確な遠近方向、青い発光要素により、既存の四角い箱の散布/薄板だけよりも造形上の候補価値がある。
  - **大きなリスク**: 低い実ゲームカメラでは左右の黒く広い壁、道路側の店舗・生活のディテール不足、均質な発光模様になりやすい。中心の大通りが既存B48ゲーム道路と合うか不明。高品質な**人の生活感ある巨大都市**の達成、実PBR見え、メッシュ・テクスチャ・実画面上の品質は不明。
- **結論: 未採択。美術研究/技術検証に使う一つの候補**。主役級未来都市の確定採用ではない。既存のtomato3《Futuristic Buildings》と同等以上だと断定しない。

## 無登録ルート比較（候補の追加量産はしない）

| 資産 | 権利/配布元での実情 | 判断 |
|---|---|---|
| Dreamloft3D Tron Gothic City | 作者itch.io無料配布、CC BY 4.0、6.6MB、GLB+BLEND+6 textures掲載 | **唯一の次回小容量GLB実物検査優先**、ART HOLD。Tron意匠との第三者IP懸念も解消が必要 |
| Amazon Lumberyard Bistro Exterior | NVIDIA ORCA公式CC BY 4.0、FBX + Falcor、2,832,120 tris | **高精細・街路生活感の参照ベンチマーク**。現代パリ街で未来都市に一致せず、ゲーム最初のGLB候補には重量・変換コスト大きすぎる。https://developer.nvidia.com/orca/amazon-lumberyard-bistro |
| GrandWhis Neon Front | itch.io無料、FBX約104MB・1,534,700 triangles、AI-assisted Rhino + Meshy、建築面は基本フラット、LODなし | **主役級ART候補として不採択**。精密な完成建築と質が違う。https://grandwhis.itch.io/neon-front |
| JadeRealms ORBITAL H-14 | 登録不要GLB/BLEND、112.7k tris、3 textures、single-object curved habitat corridor | **都市建築主役に不適合**。街角/ビル群ではない。https://3dmodelhub.io/styles/scifi/ |
| 無料低ポリCyberpunkモジュール素材 | 直接DL可能だが部材/単純箱が主体 | **過去BX/BYの反復を拒否** |

## 実GLBが得られた場合の一度だけの検査順

1. **オリジナルZIPそのもの**を保存。ダウンロード元URL、クレジット、ライセンス文書、6テクスチャ実数、FBX/BLEND/GLB各ファイル有無、バイト数とSHA256を記録。入手前はハッシュ欄を `null`、状態を `NOT_ACQUIRED` に保つ。アーカイブに怪しい実行ファイルがあれば実行禁止。
2. ソースモデルの権利・第三者IP・PBR内容・独立面構造を確認。疑義があれば研究用途でHOLDし本番素材にしない。README、配布条件の遵守が必要。
3. 既存 `scripts/p101-w9c2-g4e7cb-native-asset-preflight.mjs` の6真正240Hz/B48カメラ（true-pinch・pinch-switch、15/17/18.5s）へ原本GLBを投影。従来の660m固定のほか、複数の**提案だけの**距離/横オフセットを試し、tiny/falsely visible/road occlusion候補を診断。**AABB数値はレンダリング画質を保証しない**。
4. 残す価値があると分かった場合に**private**真のゲームWebGL画像を旧/新同条件で比較。大壁面、通りの密度、近中遠景、進行方向の読解、障害物視認性を人間が判定する。必要ならプリプロダクション画面で質が落ちることを理由に候補を捨てる。
5. **ART PASS でない限り都市コピー・100-150m垂直スライス・正式ゲーム統合・publish をしない**。ユーザーの人間試走と運転の楽しさは別承認。

## 今回の実作業/通信ブロック

- ユーザーにEpic/Sketchfabへの新規登録は依頼しなかった。
- itch.io作者ページと公開購入画面の無料無登録導線、クレジット、ファイル収録の申告内容を確認した。
- GitHub以外の実ファイルダウンロードをローカルで試したが**実行環境が外部DNSを解決できず**、ZIP実データを取得できなかった。購入/無料取得フローをスクレイプや認証回避で解消しない。**GLB/WebGLやSHAを捏造せず停止**。
- 今回のコミットは文書・権利ゲートのみ。前回のCC 3件レジストリや既存のテスト・CI、ゲームコードには触らない。新規のコストのかかるワークフローを作らない。

## 恒久保護と継続

B48実道路7、B51-C実動体28、gap52、正規240Hz物理、速度/高操舵/自然ジャンプ/カメラ固定相対、A13のSlope2 40%方針と10–16m細道、main/Gold/原作再現/本番2サイト **不変更**。正式Slope2 **0m**、PR #46 **OPEN/Draft/未マージ**、ART/HUMAN/READY/PUBLISH/MERGE **HOLD**、Work**未使用**。

**次のG4E-7CF**: まず正規の原本GLB1件の検証を実現する。購入や新規登録、追加の大量候補探し、繰り返しの手作り低ポリ生成を必須にしない。認証不要の公式6.6MB ZIPがユーザーのブラウザから入手できるなら、単にZIPをチャットへ添付してもらう（これは登録とは別）。取得できなければ引き続き少数の無登録候補のみ検討する。
