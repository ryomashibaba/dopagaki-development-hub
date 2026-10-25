# G4E-7CI — 近景/中景/遠景をゲーム自体の実WebGLへ統合する小区間の美術試験

2026-10-26 JST。過去BX/BY/BZ/CA/CG/CHの失敗を受け、単体GLBと独立three.jsではなく、**本物のゲームB48道路と元240Hzカメラを含むPRIVATE実WebGL**で評価する。

- 近景：路肩から18～48mの店舗・開いたアーケード・公共交通デッキ・灯・看板。黒い全面壁と閉鎖した箱を避ける。
- 中景：路肩約83～130m、非対称の段丘状2翼と実際に開いた公共空間。窓・通路・生活階層を組み合わせる。
- 遠景：路肩185m以遠、空の大きな抜けを持つ高さ182m以上の非対称都市冠部・断続的な都市稜線。
- 確定した城・アーチ禁止ルールを増やさない。価値のある建築形は自由だが旧試作の安直な箱量産に戻らない。

**実装**: web/p101-w9c2-g4e7ci-integrated-streetscape.mjs。既存のg4e7bg 240Hzフレームを採用し、PRIVATEローカルのg4e7al=manual&g4e7be=roll-deck&g4e7bg=inspect&g4e7bgFrame=hold&g4e7ci=streetscapeでだけ有効。

**QA**: tests/p101-w9c2-g4e7ci-integrated-streetscape.test.mjs で実B48×7、B51-C×28、gap52、Stage JSON完全不変、元カメラ6を確認。scripts/p101-w9c2-g4e7ci-real-game-capture.mjs と専用CIでtrue-pinch/pinch-switch×15/17/18.5秒の6点をBASELINE/新案の同一元カメラで合計12枚を取得。初期設計のテストが成功した後は画像を目視し、中心進路の遮蔽と質を評価する。これは**実ゲームCanvas**であり、以前の「元ゲームと別のWebGLシーン」ではない。ただしフレームは脚本入力であり人間試走とは違う。

保護：240Hzの速度/操舵/跳躍/相対カメラ、B48実道路7・B51-C動体28・gap52、A13、main/Gold、原作再現、公開2サイトは一切変更しない。新規の衝突面・道路・障害物0。PR#46 Draft未マージ、ART/HUMAN/READY/PUBLISH/MERGEはHOLD、正式Slope2=0m、Work未使用。CI実測と画像審査完了前には美術PASSを出さない。

## G4E-7CJ 実ゲーム画像QAの精度修正（2026-10-26 JST）

前回のG4E-7CI Actions #40236394164は実行待ち（queued）。保存されていない画像を完成扱いしない。GitHub Actionsの最新確認時点ではリポジトリ全体で34件queued、4件in_progress。新たなWork/ユーザー操作なしでこの状況を確認。

G4E-7CJでは旧景観と統合案を同一**実ゲームWebGL Canvas**で比較する際、各フレームのカメラ原本フレームID、撮影時刻、速度、物理道路名、Canvasピクセルサイズを厳格照合する。全12枚を生成後、ブラウザ標準PNG復号で**同じ実画面の6対の変更ピクセル率と中心進路領域の変更率**を解析し、閾値による視認警告を残す。別three.js独立シーンやAABB角点のみに頼らない。一切の変更割合をART PASSの証拠にしない。エラーがあればCIはFAIL、正式Slope2 0m、ART/HUMAN/READY/PUBLISH/MERGE HOLD。元物理240Hz/B48×7/B51-C×28/gap52、元カメラ/操舵/自然ジャンプ/本番二サイトと原作は不変。
