# G4E-7CF — 実GitHub配布GLBの正規240Hzカメラ受入検証

- 無登録優先の既定方針を継続。配布元 SpectraStudios/SourceCityToolkit_glb の正規git commit 4db7cf1aecba9bbc011d153d6d923a0cb4ac9d9d にある Market_Day.glb（17,786,532 bytes、blob ee3334d9f13f63e38a1f813eee8eb9e7c720b4e1）を一回だけCI一時領域へ取得する。
- 公式紹介: https://www.spectracities.com/source-city-toolkit/ 。公式GitHub: https://github.com/SpectraStudios/SourceCityToolkit_glb 。元のGit Blob SHAとサイズを厳格に検査する。
- **ライセンス保留:** 公開表記はCC0だが、textures.com写真を使用した一部テクスチャには再配布の例外がある。GLB内部の画像権利と作者資料を確認するまではゲーム組込・原本再配布・正式出版を許可しない。
- 既存 scripts/p101-w9c2-g4e7cb-native-asset-preflight.mjs と scripts/p101-w9c2-g4e7bg-native-visual-frames.mjs の**元B48/B51-C/240Hzカメラ**を流用。正規の6視点について深度200/320/450/660mと左右の5つの仮配置を投影する。AABB角点の占有率は実際のポリゴン画素・閉塞・PBR・レンダリング品質ではない。
- Workflow: .github/workflows/p101-w9c2-g4e7cf-source-proof.yml 。検証スクリプト scripts/p101-w9c2-g4e7cf-spectra-source-preflight.mjs 。元バイナリをGitHub開発リポジトリや外部Artifactへ配布しない。CI JSONの数値証拠のみ7日間保存。
- **判定:** CIの実行結果を確認するまではTECHの合否不明。たとえTECH PASSでもART/HUMAN/WEBGL/PUBLISH/READY/MERGEはHOLD。UI、道路、速度、自然ジャンプ、カメラや本番サイトを一切編集しない。
- **次工程:** 真のゲームWebGL視点と人間による画質比較、第三者テクスチャ権利の解決が必要。高品質でなければ切り捨て、低品質の大量複製をしない。正式Slope2認定0m、PR #46 Draft未マージ、Work不使用。

## 実行結果（上流バイナリと真正240Hzカメラ実測）

[GitHub Actions #40197574426](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40197574426) **SUCCESS**。Download stepは、正規の17,786,532byte・上流Git blob hash照合をPASS。sourceSHA256は **6137dfaf678785a2f4e4226d0cddc3032086f68a99e2c2793491058d64291c57**。GLBに13meshあり、既存CBでの5通りの仮配置はすべて投影完走（Node JSON出力でGEOMETRY_PROJECTED_ONLY_NOT_ART_PASS）。数値証拠は[CI Artifact #12600598103](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40197574426/artifacts/12600598103)に7日間保存。元GLBそのものは配布/公開GitHub保存しない。

| 仮の設置距離と方位 | 6つの実240Hzカメラ中の最大横幅占有率 | 代表するリスク |
|---|---:|---|
| 200m・左 -0.65 | 35.08% | 画面外接面積が小さい/一部道路領域干渉 |
| 320m・左 -0.55 | 18.50% | 6視点中4以上が小さく見える警告 |
| 450m・左 -0.55 | 12.34% | 小面積/小横幅、道路中心干渉の可能性 |
| 660m・左 -0.55 | 8.26% | 過去と同じ遠景の小シルエット |
| 320m・右 +0.70 | 18.50% | 距離は同じでも左右位置で視認条件変化 |

**全体審査：原本取得・ハッシュ・幾何・カメラ投影のTECH PASS。しかし原本PBR/画像ライセンスのうちtextures.comが含まれるかは未検証、WebGLゲーム内真画素は未作成、ART PASSではない。** 高価なレンダリングや無許諾の本番モデル統合は行わない。次のG4E-7CGは本物の画角と権利に重点、評価で採用不適切なら素直にREJECT。ソース/テスト以外の既存ゲームは未変更。
