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