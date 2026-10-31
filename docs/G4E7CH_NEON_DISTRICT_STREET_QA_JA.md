# G4E-7CH 完成街路の無登録GLBを高速カメラで評価

2026-10-26 JST。前工程では完成GLBでも高速ゲームカメラで小さな箱にしか見えずSILHOUETTE REJECT。次は孤立遠景ではなく著作者がBlenderで制作した連続街路区画を検査する。

- 作者出典：Bill Chan / Neon Zenith。正本 https://github.com/billpwchan/neon-zenith 。上流commit 27ad04ef04aa9e1e1366fccc63e15a379b999f01。対象 public/district/district.glb、8,040,396バイト、git blob 92e2ed214034c9cd7bed5248991924d3af9a6d24。
- ライセンス：コードのみMIT。元3Dモデルは複数の作者のCC BY 4.0（abhayexe、udayjeet等）、出典 https://github.com/billpwchan/neon-zenith/blob/main/CREDITS.md 。正式利用前に作者名/モデル/改変クレジットと素材由来を点検。CC BY素材をCC0やMITとして扱わない。
- Neon Zenith全都市はBlenderの一街区と手続き的な9,373棟近中遠景、シェーダ等の組合せ。この対象GLBを単独で都市丸ごとと偽らない。
- 今回は上流原本を一時CIにのみダウンロードし、サイズとgit hash-object一致を厳格検証。EXT_meshopt_compressionをデコードした本物のGLBジオメトリのみ、元マテリアル・テクスチャを独立の無地材質に全交換して表示する。
- 前工程と同じ真正BG 240Hzの6スクリプトカメラ（15/17/18.5秒×2道路）と同じ928x540 Chromium/WebGL2で、街路形状をカメラ前100m/240mに仮配置した12枚の画素差分画像を取得する。
- 近景の交通/入口/壁面がゲーム視点から見えるかを目視で評価する。真のB48道路/動体/高速手動プレイは表示せず、本番ゲームのスクリーンショットと偽らない。道路遮蔽・当たり判定・元PBRは未検証。
- 不採用なら箱の大量増殖や薄板・柱の再制作に戻らない。モデル単体の画素占有は都市景観美術の十分条件ではない。

維持：元240Hz B48道路7/B51-C動体28/gap52、速度/操舵/自然ジャンプ/カメラ、A13、main/Gold/原作Slope再現、本番2サイト不変更。正式Slope2 0m。Draft PR #46未マージ、ART/HUMAN/READY/PUBLISH/MERGE HOLD。Work不使用。
## 実行済み真正WebGL2の12画像判定（2026-10-26 JST）

- [CI #40234897063](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40234897063) は原本バイナリ取得とGit blob検査・Meshopt glTF読込・12枚の本物のChromium WebGL2をSUCCESS。192描画メッシュ。SHA256 f59104c101642527b0e15db64820c4584f41e465b1fa019ee8a52b520de1c660。
- [画素レポートと12枚の元PNG](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40234897063/artifacts/12614657186)は7日保存。100m実ピクセル変化率6視点1.082～35.086%（中央値2.8035%）、240mは0.628～3.905%（中央値1.064%）。それはモデルによって色が変わった画素の割合であり、画質・シルエット魅力度・運転中の障害物視認性の十分条件ではない。
- 目視：15sでは両距離とも遠くの細長い街区、18.5sでは100m配置の大きな角柱/屋上が画面前景を占める。精細な独立の都市大景観、中央道路への繋がりや人間の生活感を表現できていない。**このモデル単独・この2配置は主役級都市のSILHOUETTE REJECT/HOLD。** 著作者モデルの元PBR・照明・都市全体構成の評価はこの試験の対象外。
- G4E-7CIは素材1本探しを繰り返さず、元ゲーム道路に直結する近景・中景・遠景を設計統合する方式へ研究重点を移す。既存QAで落とした単純箱/薄板/梁の大量配置を再開しない。権利・元モデル再配布・Game WebGL/ART/HUMAN/READY/PUBLISH/MERGEはHOLD。
