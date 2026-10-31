# G4E-7CD — 高品質都市の正規原本調達ゲート（2026-10-25 JST）

## 結論（誤認禁止）
**SOURCE RECHECK COMPLETED / ORIGINAL 3D BINARY 0 / VERIFIED TEXTURE ARCHIVE 0 / NATIVE GLB PREFLIGHT NOT RUN ON NEW ART / TRUE WEBGL NOT RUN / ART NOT TESTED / HUMAN HOLD / RELEASE-READY-MERGE FORBIDDEN。**
既存G4E-7CCの素材取得状態を偽って更新しない。新たな美術合格・ゲーム内品質向上・Slope2距離を主張しない。Sourceページだけで採択しない。

## 優先候補と代替
1. **第一候補を据え置く** — tomato3《Futuristic Buildings》
   - https://sketchfab.com/3d-models/futuristic-buildings-adf97f38cda44e67a44994fff1cb4d58
   - 2026-10-25時点の公開情報：作者tomato3、CC Attribution表示、約121.4k tris、Blender→GLB、街角の複数建築・屋上テラス・店舗・看板・信号・地下道路入口（後者は作者の説明）。原本中身、実テクスチャ品質、人間による手作業の程度、第三者素材権利、ゲーム適性は未検証。
2. **比較用の追加代替、未登録・未採択** — Pasha《Cyberpunk city》
   - https://sketchfab.com/3d-models/cyberpunk-city-f2c503f53e0a425bade4bff5786ef420
   - 公開情報：CC Attribution表示、約295k tris、作者は「SketchUp制作・high quality textures・game ready・no ai」と説明。**いずれも作者申告であり真正な権利/品質/GLB実物の独立証拠ではない**。三角形数が高いことは優秀な街路画質の証拠ではない。**第一候補を変更せず、正式なG4E7CC機械レジストリ（候補3件固定）にも追加しない**。
3. **高品質主建築として採用せず** — 3DAssets.devのCC0直接DL可能な cyberpunk apartment/props packs。配布ページはAI使用を明記し、開放型室内・多数のモジュール/小物のセット。以前のBX/BYのモジュール量産失敗を再現する危険が高い。ライセンスと取得の容易さ**だけ**で建築の質を認定しない。
   - https://3dassets.dev/packs/cyberpunk-apartment-and-neon-block
   - https://3dassets.dev/docs

## 正規入手方法と厳格な権利ゲート
- Sketchfab公式Download APIはユーザー認証とダウンロードリクエストが必要。公開サムネイル/ビューアキャッシュ/開発者ツールからの抽出や認証回避を行わない。
  - https://sketchfab.com/developers/download-api/downloading-models
  - https://sketchfab.com/developers/download-api/guidelines
- 最短の正当な方法：ユーザー本人がSketchfabでログインし、上記**第一候補の配布ページ**から「Download 3D Model」を選び、提供される**オリジナルのglTF/GLB ZIP一式**を入手。素材はアーカイブ原形（原本/manifest/texture/license/readme）を維持し、次チャットに添付してもらう。ログイン情報、OAuthトークン、Cookieは共有・コミットしない。
- ZIPの存在、ZIP全内容、作者、元URL、当該ライセンスの**正確な版数**、第三者PBRテクスチャ・看板・商標の権利、クレジットに必要な情報を先に検査する。単にページにCC BYと書かれているだけで埋め込み素材まで許諾済みとは結論しない。
- 手元のZIPから得た元ファイルごとのSHA256/バイト数/ファイル数/テクスチャ種別と出典を記録。glTF→GLB変換が必要なら**元アーカイブ保存＋派生GLBの別SHA**に分離する。出典を偽って旧CA-R2 GLBを新素材として流用しない。
- 正規配布元のクレジット要件に従う。権利に疑義があるときは**非公開の権利調査で停止**、作品の本番/GitHub公開ブランチへの素材再配布は別途検証する。

## 実バイナリ入手後のみ行う検査
1. G4E-7CC既存ゲート `scripts/p101-w9c2-g4e7cc-vetted-artist-source.mjs` でSHA/作者/原本アーカイブを照合。これは現在**node API受入**であり「資料だけで合格」はしない。
2. 既存 `scripts/p101-w9c2-g4e7cb-native-asset-preflight.mjs` はGLB 2.0/Y-up・scene root・POSITION AABBが必要。必要な派生GLBは原本とは別に記録。**真正BG START00 240Hz/P96の6カメラ**で、660mの従来固定配置に加え、別の安全な奥行/横位置の複数仮配置を同じ投影手法で比較。これはAABB角点の投影のみであり、遮蔽・透明・テクスチャ・描画画素・道路クリアランスの保証ではない。
3. 目安のフレーム横占有率と道路干渉警告を見て小さすぎる/視野外なら**高コストのレンダリング前に停止**。合格候補のみ、元240Hz B48ゲームと同じWebGLカメラ・同条件の真正Playwright画素で未導入旧画面と差分比較。主張するなら**実スクリーンショットと人間による美術判定**を要する。**数値ゲートのPASSはART PASSではない**。
4. 主建築の美術合格後に限り100〜150m PRIVATE垂直スライスへ。大量複製はしない。human play/楽しいか/衝突/物理、ゲームFPS、公開・マージは独立した未承認ゲート。

## 効率・保護・次の一手
**今回は正規GLBがまだないため、新しいBlender生成やChromium/WebGLレンダリング、不要なCIを作らない。** インターフェース/物理/障害物も一切編集しない。物理240Hz、B48実道路7、B51-C動体28、gap52、速度・操舵・自然ジャンプ・カメラ、A13の方向性、main・Gold・原作Slope再現・本番2サイトを厳重保護。PR #46 OPEN/Draft/未マージ、正式Slope2=0m、ART/HUMAN/READY/PUBLISH/MERGE HOLD。Work未使用。

**次工程G4E-7CEの解除条件は「許諾され、実ファイルとテクスチャが揃った完成建築素材1件」。** それまでは調達に専念し、低品質代替を数で補う方向へ逃げない。恒久引き継ぎ入口は上位 `PROJECT_STATE.md` の固定URL。
