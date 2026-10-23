# G4E-7AG — OPEN CITADEL / 中央視野を解放する実曲線巨大建築の独立研究

2026-10-23 JST。Draft PR #46、原本/B48/物理/元カメラ/本番/Goldは保護。正式Slope2距離0m、美術・人間・公開HOLD。

## 7AFの実画像から得た不合格理由

[7AF実WebGL CI成功](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39951739693)。同一実カメラのAF対AE画像差分（最大RGB差15超）は3.15/3.65/4.15/4.50秒で**30.40%/24.62%/18.40%/13.55%**。ただし中央視野は**12.88%/9.43%/7.94%/4.43%**しか変わらない。旧い両側の暗い壁の印象を減らせず、美術REJECT/HOLD。画素比は美的合否を自動認定しない。

## OPEN CITADEL / 形態の設計

壁をさらに細分化しない。実路肩から最低85m以上外側、独立した5基の曲線巨大建築を実3Dメッシュで制作。曲線の内側はGPUポリゴンが存在しない真正の視覚空洞で、透け演出ではない。15の非衝突の細長い浮遊都市層、斜めの自立支柱、発光稜線を統合する。建築を道路を跨いで置かず、中央の空に開放感を作る。高さ・幅・傾きと左右位置は5基で変える。これは正式美術採用ではなく独立した比較実験。

## 比較対象・試験

- 実B48 `approach-arc`、7道路、28移動障害物、真欠損cell52、元の240Hz start00 P96非人間カメラは同一。
- localhost/private限定 `g4e7ad=on&g4e7adFrame=hold&g4e7ae=on&g4e7ag=on&g4e7agScene=open`。AF景観との新旧切替で旧メッシュは重ねない。
- 3.15/3.65/4.15/4.50秒×AF/AGの実WebGL画像8枚をCIで記録。同カメラ・同物理と、全画面/中央/上部RGB画像差分を監査。真B48と都市レイの遮蔽は別のゲートで検査。
- ショットが生成できても、人間の先読み・景観の魅力・実操舵・公開は認定しない。正式Slope2 DNA 0m、全てHOLD。

## 実装と検証経路

- 独立研究スクリプト `web/p101-w9c2-g4e7ag-open-citadel.mjs` と物理原本不変のテスト。AF/AE/旧門を重ねずに研究用シーンで置き換える。
- [AG native WebGL CI #39956862190](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39956862190) に8枚画像、元カメラ同一性・画面全体/中央/上部の画素差・公開隔離。
- [AG real B48/中空建築レイテスト #39957016831](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39957016831) に正規240Hz走行の道路三角面と新建築三角面への視線測定を記録。
- 2026-10-23現在、上記AGのCIは未完了・未判定。正式美術認定・人間QA・公開HOLD、Slope2 DNA正式認定0m。7AFの美術品質が不十分だったことを解決したかは画像審査前に決めない。
