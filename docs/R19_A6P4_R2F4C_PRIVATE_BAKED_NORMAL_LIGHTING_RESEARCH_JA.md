# DOPAGAKI SLOPE R2F4-C — 非本番・非PBRの実法線焼き込み比較研究

**2026-11-01 JST。PR #46 OPEN/Draft・未マージ。ART正式採用0件。**

R2F4-Bの制作は実Blenderの空洞/公共市場を持つが、元WebGL2のGLB読み戻しは位置XYZ＋色RGBの6floatのみを扱い、法線やPBR材質の表示は未対応。そこで元のWebGL2シェーダーを一切変更せず、**オリジナルXYZRGBを保持した研究用flat normal-based baked lighting**を作成した。

元Blender GLB 5地区×14/28m、元ジオメトリ/物理/カメラ/HUD/得点/B48×7/B51×28を保持して、GLBから展開された実GPU三角形法線をCPUで計算、2方向照明・両面絶対法線による均一な面明暗と控えめな色温度を頂点RGBへ焼き込む。すべてのXYZ float32バイトは不変、GPU buffer byteLength・三角形数も一致。**これはPBRではなく静的フラットシェーディング**。ガラスの透過、環境反射、物理ベース材質、リアルタイム影はない。

元`dist-private/r19a6p4r2f4`は元のflat vertex colorを保存し、完全に分離された`dist-private/r19a6p4r2f4shade`で比較。shaded buildだけの読み込みURLとstatusを明示。元R2F4-Bの真14/28m×6時刻12画像を同じCIで再撮影後、重要な8.004秒・11.504秒×両道路幅の**4枚の真正WebGL2法線比較候補PNG**を作る。同一元240Hz・同一路線・同一物理/cameraのPNG差を独立レビューし、色の濃淡が明らかな美術改善や読みやすさにつながらなければART REJECT。通常色の画像だけでの判断と混同しない。

CI新規Workflowは作らず、既存ワークフローへコントラクトテストと4真画像stepを追加。B51全2881tick離散SAT、元B48×7表面サンプル接触0も既存stepを再検証する。原ゲームblob `af076d67492a677d2235e4730aef8cdf4808e106`、main/Gold/P100/W9-X/B5・2本番URL・前研究スクリプト等の変更禁止。これは**研究中・ART/HUMAN/GAMEPLAY/PERFORMANCE/RELEASE/MERGE HOLD**。実地盤支持/人間の内部通行/障害物画素の視認/iPhone FPS/時刻間CCDは未証明。
