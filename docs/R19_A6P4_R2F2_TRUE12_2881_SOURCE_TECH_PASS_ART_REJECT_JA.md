# DOPAGAKI SLOPE R2F2 — 真正元ゲームの技術・美術独立監査

**基準日2026-11-01 JST。結論はSOURCE TECH限定PASS／ART REJECT。正式美術採用0件・Slope2 DNA認定0/2912m。**

## 実装・検証の事実

- [コミット6562825ca90e](https://github.com/ryomashibaba/dopagaki-development-hub/commit/6562825ca90eb9a18e0d12c7ff0a221d44ae9a95)：旧R2F1Dの153個の分断地盤片と細柱列を廃止。Road1地区1/2/3で、元カメラが選んだ主役を「厚い非対称複合建築2棟・連続する曲面公共地盤4体・入口側の大構造2体」へ変換。実5地区・22用途・36m開放中庭・元12分割歩廊と元Road1側街路の形状を維持。前モデルの旧Blenderスクリプト保護、専用R2F2スクリプトに分離。既存GitHub Actionsを再ターゲットし追加Workflow0件。
- [GitHub Actions #41275836322](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41275836322)：**全19工程SUCCESS**。本当のBlender 4.0.2でBLENDとGLB出力、独立COLOR0 GPUデコード、元ソース240Hz真12WebGL2画像（14/28m×元6時刻）、B51全tick離散SAT、元カメラ投影と画像SHA検査まで成功。
- [Artifact #13071502142](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41275836322/artifacts/13071502142)：6,129,486 bytes／ZIP SHA256 **`0c94bd6d70b46ea373496d9fd311a6a3c1cd0d516f92a98b1733b99c6086d820`**。ダウンロードZIPのSHAを照合し、BLEND、GLB、元PNG等全32ファイルを確認。**Blender 20,800 faces／GPU 41,792 triangles**。
- 原動的B51全28基×2881tick×2道路幅＝**161,336離散時刻のBroadphase+triangular-rotating OBB SATで交差0**。元ゲームGit blob `af076d67492a677d2235e4730aef8cdf4808e106`不変、新コライダー0。元B48実道路7・B51 28・240Hz・球・左右操舵・自然ジャンプ・カメラ・HUD/スコア、main/Gold/P100/W9-X/B5/本番サイト変更なし。

## 同一元カメラの真正画像比較

旧R2F1-Dと新R2F2の各1013×698真正PNGのSHAを両renderレポートへ照合した後、RGBの最大チャンネル差が36を超える画素率を計算。**変化率は美術の点数・B51可視率ではない。** 中央ROIはx202..808・y140..318。

| 元時刻 | 14m全画面 | 14m中央ROI | 28m全画面 | 28m中央ROI |
|---|---:|---:|---:|---:|
| 4.404秒 (1057tick) | 0.999% | 5.939% | 1.006% | 5.965% |
| 8.004秒 (1921tick) | 1.236% | 7.498% | 1.234% | 7.536% |
| 11.504秒 (2761tick) | **4.141%** | **21.884%** | **4.357%** | **22.210%** |

**独立美術評価：** 4.404秒は中遠景の波型屋根が少し変化。8.004秒の道路左に大きな青緑壁が残り、都市入口や公共広場は見えない。11.504秒では前R2F1-Dの黄色い細柱列は確かに解消したが、今度は大きい紫灰色の単純な曲面外壁になり、観客に公共広場・建築内部・人の活動が伝わらない。壁を細柱にしたり、細柱を壁へ戻すだけの反復は失敗。**ART REJECT**。GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。

## 次の厳格な方針

元8.004/11.504秒の2画面で、**どの公共空間を道路から見るかを先に美術設計する**。巨大外壁の角度・高さ・ポリゴン数は増やさない。地上の人間規模の入口、開いた市場/駅の内部、階段や屋根に支配されない明瞭な広場、背景へ連続する都市基盤を、編集可能な少数の実3D建築として設計し、まずその真正画面2枚でART早期判断。ART改善が明確な案だけフル元12画面＋B51 QAへ進む。

**未検証：** 元静的B48実道路との干渉、時刻間swept CCD、建築の本当の支持地盤、歩行可能性・避難動線、元B51の画像ピクセル遮蔽、手動での人間高速操舵、Windows/iPhone FPS。SOURCE TECH PASSはそれらを保証しない。PR #46 OPEN/Draft・未マージ、正式採用0件、Slope2 DNA認定0/2,912mを保持する。
