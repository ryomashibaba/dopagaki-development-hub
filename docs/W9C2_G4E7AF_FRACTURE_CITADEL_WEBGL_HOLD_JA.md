# G4E-7AF — FRACTURE CITADEL / 独立美術研究

2026-10-23 JST。DOPAGAKI SLOPE — HYPER RUSH のDraft PR #46、非公開研究のみ。7AEで旧門の反復を撤去し画像変更率約25〜42%になったが、暗い連続壁の美術品質がREJECTになったことを受け、**独立した都市造形案**を実装。

新案は第I実B48道路の両側に8つの不均一な都市外殻を離して配置する。大きな抜け空洞、斜めの外殻稜線、裏面のある厚い断面、青白・琥珀の対照的な発光縁、上昇する非対称シルエットを重視する。連続の箱壁や反復門を流用しない。AFの表示ではAEと旧建築を同時に重ねない。

選択はlocalhost/privateだけの `g4e7ad=on&g4e7adFrame=hold&g4e7ae=on&g4e7af=on&g4e7afScene=citadel`。同じR2 approach-arc実B48/28動体/元の240Hz実カメラのt315/t365/t415/t450を、AEのrift景観と8画面比較。全て非衝突・物理不変更。公開siteとpublic-safeは実R2研究用JSONを出さない。

Chromium CI greenは画像生成と不変条件のみであり、**人間品質や美術品質の合格ではない**。現在は未検証・HOLD。正式Slope2 DNA 0m。旧7AE原本・Gold/main/本番サイト/原作再現は保護。

## 2026-10-23 確定実WebGL・美術審査

[G4E-7AF専用CI #39951739693](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39951739693) **SUCCESS**。7/7道路・28動体・元の実B48 gap cell52・240Hz記録カメラの同一性、8枚の実Chromium WebGLと2公開ビルド隔離PASS。画像はActions artifact #12501515944（14日保持）。CI greenは美術成功の意味ではない。

実画像を確認すると8地区という内部生成構造とは別に、プレイヤーからは**左右の暗い巨大壁が続く構図**のままで、都市の奥行き・規模の変化、巨大空洞や印象に残る主役建築が不足。**美術REJECT/HOLD**、人間QA/公開HOLD。

| 実240Hz時刻 | AEからAFへ差分が生じた全画面割合（RGB最大差15超） | 画面中央30〜70%での差分 |
|---|---:|---:|
| 3.15s | 30.40% | 12.88% |
| 3.65s | 24.62% | 9.43% |
| 4.15s | 18.40% | 7.94% |
| 4.50s | 13.55% | 4.43% |

数値はPython/PillowでCIの画像ペアから直接計算。人間の美術評価の代替ではない。次G4E-7AGは壁の多角形化をやめ、空を開放する完全中空の巨大曲線建築、分離した浮遊都市層と対照的な発光稜線を独立研究する。AFの原本は保存。