# K4CB A2 — 真正Blender CHASE実レンダーの直接評価／ART REJECT

検証日：2026-11-05 JST。研究専用。既存K4CB A1のアーチが小さすぎたART REJECTを受け、同CHASEの港湾施設の支配的なシルエットを真の編集可能Blender内で検証した。

## 真正GitHub技術結果

- 初回[Actions #41914127494](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41914127494)は**FAILURE／安全停止**。A1文書に書かれたBlender SHA `9df956acf164d7a0f4d861585644e15f87faa5d85683f2e8ae79bb438c03333d` は、実際の最新A1 Artifact内の厳格監査JSON・真バイトSHA `ea0cadc1db9dde9b01faac17d1cddc7b81c4d6c011eae2ea3c8bf68e90ec5b5d` と不一致。ブラインドなSHAスキップは禁止。真正Artifactを親として固定し直したコミット `e6b48d66bae91117d56a9910980cbfb05d470190`。
- 修正後[Actions #41914599116](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41914599116) は **completed/SUCCESS、全段階SUCCESS**。元Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`、Road5全頂点/面 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元6 Camera・研究CHASE・木11本の姿勢・光源・元屋根/柱・既存全表示・K4BZ bad研究舗装のhide_render保持を実ASSERT。K4BZ/K4CA再発試験SUCCESS。
- K4CB A1真編集可能.blendを元に、研究用オブジェクト11個の曲面屋根シェル・太い構造支持・公共床・ガラス採光・曲げ構造を制作。**ゲームCollider追加0、元Game/原本オブジェクト変更0**。元CHASE／Blender EEVEE／768×480を実行。
- 新真正編集可能.blend **272,243,520 bytes／監査SHA256 `5f57d64654ff8df6b6ecd852699432cda50f1afc1af3723779170ccb4cbed5b1`**。
- [A2真同CHASE画像](research-evidence/k4cb-a2/K4CB_A2_TRUE_SAME_CHASE_SCULPTED_TERMINAL_NOT_GAME.png) **480,154 bytes／SHA256 `dc633bc0a89a14cdd85b7de48c18c115bfad0a4c374eb6471196cd98cd8496d1`**。
- [A1対A2の真同カメラ比較画像](research-evidence/k4cb-a2/K4CB_A2_VS_A1_TRUE_SAME_CHASE_SCULPTED_TERMINAL_ART_REVIEW_NOT_GAME.png) **SHA256 `09d9ae06064dfe91e9a36e7ff738b9999bc0f6b9b7d9e5a60b57b5e38cb493ca`**。
- [固定原本指紋・幾何と画像の独立監査JSON](research-evidence/k4cb-a2/K4CB_A2_REAL_NATIVE_AUDIT.json)。右港領域で実際に変わった画素数10,277（**美術スコアではない**）。既知の黒い路面筋6組のコントラストはA1とA2で一致し再発なし。屋根の実CHASE投影bbox x=0.6201〜0.8413、y=0.5493〜0.6667（Blender正規化、下原点）。
- 真.blend・PNG・監査・実Blenderログの [GitHub Artifact #13363873298](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41914599116/artifacts/13363873298) は122,708,994 bytes、GitHub記録のZIP digest `sha256:242ccecd0f6d22c47aa5399be063d99ab18da4acdd18e061600555b9869288f9`、有効期限2026-11-25 UTC。**ZIP原バイトをこの会話で別途再ダウンロードして独立CRC確認したとは主張しない。** CI内の個別ファイルSHAは検証済み。

## 直接開いた真CHASEの全画面ART評価

**TECH PASS／ART REJECT。正式ART採用0件／Slope2 DNA0m。**

- 明確な局所前進：A1の小さい3連アーチより、右港湾に大きな曲面の屋根シルエットと奥行きのある屋根下空間が見えるようになった。これは形状・投影の真正変化。
- しかし現画像では曲面屋根が**ツヤの強い孤立した金属シェル／巨大な仮設テント**のように見え、実際の港湾建築の厚い立面・用途・多層的な内部・屋根と基礎の納まり・既存公共ホールとの連続性が十分読み取れない。あくまで世界水準の建築景観には未達。
- 他の港湾施設は薄い模型状のまま。左側の斜面は単調な灰色地質、地平線は平板。画面中央の道路が広く、起伏と速度感・世界のスケールが不足。全画面の根本問題は解決していない。
- 11メッシュ追加・10,277画素差・CI全PASSは美術合格の根拠にならない。本物のゲームWebGL2、FPS、人間走行の結果でもない。

## 次のK4CB作者品質ゲート

A2の屋根をさらに大きくする／同じ屋根を増殖する／色だけ変える試行をしない。まず、**右港の建築が港のどの機能（乗船、荷役、歩行、公共広場）をどの床・出入口・屋根で実現するか**を視点から読み取れるよう作者再設計し、既存実港の地形・岸壁・建物を一体の空間として編集可能DCCで完成度を高める。屋根自体を主役にしすぎず、周辺の実素材・道路外側の段差・岩層と海面の関係も同一CHASEで実測比較する。

この段階で有料ゲーム水準を達成したと認定しない。次に同種の少数メッシュや画像差だけを重ねるより、**素材・建築断面・地形と画面構図の統合的な作者工程**へ移る。Camera・Road5物理・K4BZ非表示・本番Colliderは凍結。元Game、main、正式P101、Draft PR #46、本番2サイト、W7F Gold、凍結原本は全保護。Work/Computer Useは事前承認、追加有料API0円。SAT/CCD/FPS/HUMAN/RELEASE/MERGE HOLD。
