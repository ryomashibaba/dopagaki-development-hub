# G4E-7CF — 実GitHub配布GLBの正規240Hzカメラ受入検証

- 無登録優先の既定方針を継続。配布元 SpectraStudios/SourceCityToolkit_glb の正規git commit 4db7cf1aecba9bbc011d153d6d923a0cb4ac9d9d にある Market_Day.glb（17,786,532 bytes、blob ee3334d9f13f63e38a1f813eee8eb9e7c720b4e1）を一回だけCI一時領域へ取得する。
- 公式紹介: https://www.spectracities.com/source-city-toolkit/ 。公式GitHub: https://github.com/SpectraStudios/SourceCityToolkit_glb 。元のGit Blob SHAとサイズを厳格に検査する。
- **ライセンス保留:** 公開表記はCC0だが、textures.com写真を使用した一部テクスチャには再配布の例外がある。GLB内部の画像権利と作者資料を確認するまではゲーム組込・原本再配布・正式出版を許可しない。
- 既存 scripts/p101-w9c2-g4e7cb-native-asset-preflight.mjs と scripts/p101-w9c2-g4e7bg-native-visual-frames.mjs の**元B48/B51-C/240Hzカメラ**を流用。正規の6視点について深度200/320/450/660mと左右の5つの仮配置を投影する。AABB角点の占有率は実際のポリゴン画素・閉塞・PBR・レンダリング品質ではない。
- Workflow: .github/workflows/p101-w9c2-g4e7cf-source-proof.yml 。検証スクリプト scripts/p101-w9c2-g4e7cf-spectra-source-preflight.mjs 。元バイナリをGitHub開発リポジトリや外部Artifactへ配布しない。CI JSONの数値証拠のみ7日間保存。
- **判定:** CIの実行結果を確認するまではTECHの合否不明。たとえTECH PASSでもART/HUMAN/WEBGL/PUBLISH/READY/MERGEはHOLD。UI、道路、速度、自然ジャンプ、カメラや本番サイトを一切編集しない。
- **次工程:** 真のゲームWebGL視点と人間による画質比較、第三者テクスチャ権利の解決が必要。高品質でなければ切り捨て、低品質の大量複製をしない。正式Slope2認定0m、PR #46 Draft未マージ、Work不使用。
