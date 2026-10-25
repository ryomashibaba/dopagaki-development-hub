# G4E-7CG — 原本形状のみを本物のChromium WebGLでレンダリング（ゲーム本体のWebGLではない）

ユーザーの無登録優先とQUALITY-FIRST/ART-FIRSTを維持。Spectra Cities Source City Toolkitの形状は公開CC0。Textures.com由来の第三者テクスチャには例外がある。そこで原本Market_Day.glbを一時的にロードし、**描画前に全メッシュのマテリアルを一律の独立した無地素材に置換**する。元の写真テクスチャは表示せず、元GLB自体もリポジトリ・Artifactに配布しない。

上流固定commit 4db7cf1aecba9bbc011d153d6d923a0cb4ac9d9d／17,786,532 bytes／Git blob ee3334d9f13f63e38a1f813eee8eb9e7c720b4e1／SHA256 6137dfaf678785a2f4e4226d0cddc3032086f68a99e2c2793491058d64291c57 を再確認。既存G4E-7BGの真正240Hz由来の6カメラ姿勢とCBの仮位置計算を使い、200m/320mの2配置（計12枚）で真正WebGLラスタ画像と非表示時との差分画素数を計測する。

**限界：元ゲーム画面ではない。** レンダラは隔離したthree.js・真のChrome GPU WebGLだが、元ゲームの道路・移動障害物・表示材質・実走行は描いていない。真のゲーム用HUD・地形/道路遮蔽や視認性、品質は未証明。原本の一部画像/意匠の利用権が未解決なのでゲーム本体への取り込みは禁止。CIが成功してもTECH実WebGLのみ、ART/HUMAN/PUBLISH/READY/MERGEはHOLD。

資料 https://github.com/SpectraStudios/SourceCityToolkit_glb と https://www.textures.com/support/faq-license に基づく。原240Hz/B48×7/B51-C×28/gap52/速度・操舵・自然跳躍・カメラ・A13/main/Gold/原作/本番サイト未変更。PR #46 OPEN/Draft、正式Slope2 0m、Work未使用。

## 実測・目視判定（CI成功後の追記）

- [CI #40198872340 SUCCESS](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40198872340) / [Chromium12画像+実画素JSON](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40198872340/artifacts/12601685349)（7日保持）。GLBは原SHA256のまま取得。原ファイル/元テクスチャはGitHub保存・公開していない。
- glTF mesh定義数13、WebGL draw Mesh数46。**元G4E-7BG 240Hzの6カメラ**× 200m/320m で12枚。200m実描画変化画素は6視点0.678%〜6.192%（中央値1.4305%）、320m0.452%〜1.791%（中央値0.739%）。6視点のすべてを検査、資料に最大値だけで合格判定しない。
- **目視画像判断**：平たい住宅状の長箱が暗い空間に孤立している印象が強い。近景でも奥行き方向の連続した巨大未来都市を表現できない。320m時には極小。**この単独遠景・この2配置に限定して主役級SILHOUETTE REJECT。** ただし元テクスチャとB48道路が無い独立WebGLであり、元モデル全体の本来の美術品質や実ゲームを審査したわけではない。
- **費用対効果による停止**：Spectra素材のTextures.comライセンス追跡や単体のPBR詳細調整に進まない。巨大全景への変換手段が乏しいため、G4E-7CHは権利安全・高い道路視点画素占有・深い都市景観の完成アセット1件を選んで早期実WebGLテストする。追加の箱・薄板量産は不可。ゲーム・公開・マージはHOLD。
