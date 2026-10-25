# G4E-7CG — 原本形状のみを本物のChromium WebGLでレンダリング（ゲーム本体のWebGLではない）

ユーザーの無登録優先とQUALITY-FIRST/ART-FIRSTを維持。Spectra Cities Source City Toolkitの形状は公開CC0。Textures.com由来の第三者テクスチャには例外がある。そこで原本Market_Day.glbを一時的にロードし、**描画前に全メッシュのマテリアルを一律の独立した無地素材に置換**する。元の写真テクスチャは表示せず、元GLB自体もリポジトリ・Artifactに配布しない。

上流固定commit 4db7cf1aecba9bbc011d153d6d923a0cb4ac9d9d／17,786,532 bytes／Git blob ee3334d9f13f63e38a1f813eee8eb9e7c720b4e1／SHA256 6137dfaf678785a2f4e4226d0cddc3032086f68a99e2c2793491058d64291c57 を再確認。既存G4E-7BGの真正240Hz由来の6カメラ姿勢とCBの仮位置計算を使い、200m/320mの2配置（計12枚）で真正WebGLラスタ画像と非表示時との差分画素数を計測する。

**限界：元ゲーム画面ではない。** レンダラは隔離したthree.js・真のChrome GPU WebGLだが、元ゲームの道路・移動障害物・表示材質・実走行は描いていない。真のゲーム用HUD・地形/道路遮蔽や視認性、品質は未証明。原本の一部画像/意匠の利用権が未解決なのでゲーム本体への取り込みは禁止。CIが成功してもTECH実WebGLのみ、ART/HUMAN/PUBLISH/READY/MERGEはHOLD。

資料 https://github.com/SpectraStudios/SourceCityToolkit_glb と https://www.textures.com/support/faq-license に基づく。原240Hz/B48×7/B51-C×28/gap52/速度・操舵・自然跳躍・カメラ・A13/main/Gold/原作/本番サイト未変更。PR #46 OPEN/Draft、正式Slope2 0m、Work未使用。
