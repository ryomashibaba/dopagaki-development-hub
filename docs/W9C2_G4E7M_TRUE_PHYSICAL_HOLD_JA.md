# W9-C2 G4E-7M / Real narrow B48 roads (HOLD)

Separate true-physics experiment based on the already proven G4E-7F GLIDE (seven surfaces and 28 moving obstacles). The frozen Gold branch and all legacy gap candidates remain unchanged. Unlike the G4E-7L visual architecture, this stage changes real B48 collision control points and the physical route centerline, never the camera, speed, steering or extra floors.

Two independent options are tested. THREAD targets width 15.4m, vertical descent up to 4.8m and sideways arc 1.2m; PRECIPICE targets 13.1m, -11.5m and arc 3.5m. The narrow physical cores are 114m in SKYLINE and 108m in CROWN (222m nominal total), with smooth entry and exit ramps. This is NOT a claim that 222m are human-playable or officially adopted.

A four-way independent original-start 240Hz P96 script checks Gold, GLIDE, THREAD, and PRECIPICE, preserving failures. Only Gold and GLIDE are required to reproduce their known full-seven-road proof; experimental failures are explicitly reported, never waved away as successful. Gold, G5-C1, the 28 real machines and default game are protected. Officially accepted DNA: 0m; human fairness: HOLD. PR #46 remains Draft.

## 2026-10-22 JST — 最終計測・実物理だけの評価 (G4E-7M)

**段階的にPASSした事実**
- 正規B48物理・幅・Gold保持と4-wayスクリプト： [専用240Hz CI #39766246120](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39766246120) SUCCESS。独立成果物 `g4e7m-real-physical-native-39766246120`、artifact ID `12419828752`。元W7F Gold 7/7・53.275s・最高203.59m/s、従来GLIDE 7/7・51.817s・206.85m/s。
- **THREAD（目標15.4m）自動失敗**：正規開始点から10.121秒で「衝突専用面へ衝突」、訪問実路面2区間、最大111.15m/s。人間での可否は当然未検証。失敗結果を消したりゴール扱いしない。
- **PRECIPICE（目標13.1m）自動完走**：正規開始点から7/7走破・52.679秒・最高204.30m/s。GLIDE基準より+0.862秒、Goldより-0.596秒。ただしP96 early-soft /4.8スクリプト操舵であり、人間運転の完走を証明しない。人間が楽しめる/公平かはHOLD。
- 私用WebGL／公開分離： [専用Chromium CI #39767733467](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39767733467) SUCCESS。Node単体3/3・実Chromium2/2 PASS。private99・public96・public-safe5ファイルのビルド。意図的に両研究フラグをONにしても、公開2種類の出力に未承認GLIDE/THREAD/PRECIPICE JSONが**存在しない**ことを検証した。G4E-7Mのプライベート選択はlocalhostのみ／通常モードで選べない。研究中は自己ベスト・区間ベストに記録されない。
- 同CI実画像アーティファクト `g4e7m-real-13m-B48-webgl-39767733467` (ID `12420513079`)、SKYLINE/CROWN×GLIDE/THREAD/PRECIPICE×HUDあり・純WebGLの**計12枚＋計測JSON**。物理時刻0秒・移動障害物28基・7つの実衝突路面は保持。ステージには従来G4E-7Gと同じ正規化u=.52（SKYLINE）/.15（CROWN）で追加2研究用スポーンを作った。各道路の世界座標／カメラ視線は異なるため、スクリーンショットの差は幅だけの効果ではない。

### 本物のB48サーフェイスをサンプル測量（m）

| 場所・正規化u | 従来GLIDE（実B48幅） | THREAD（実B48幅） | PRECIPICE（実B48幅） |
|---|---:|---:|---:|
| SKYLINE u=.52 | 70.141m | 15.548m | **13.868m** |
| CROWN u=.15 | 78.296m | 13.240m | **11.898m** |

- 同じ実道路サンプル点のY標高（m）、GLIDE→THREAD→PRECIPICE：SKYLINE **180.85→176.05→169.35**、CROWN **123.42→118.89→112.58**。既存GLIDEの上に本物の鉛直起伏を追加し、色線・カメラ演出だけではないことを示す。
- 狭路の公称コアはSKYLINE約114m／CROWN約108m、合計222m。幅の遷移帯は別に存在する。**数字はコリジョンの変更範囲であり人間向けの公式認定距離ではない。**
- 純WebGL画像のうちGLIDE→THREAD/PRECIPICEの変更画素率：SKYLINE **45.904% / 54.227%**、CROWN **46.586% / 50.417%**。これは実道路形状・プレイヤー視点の世界座標・カメラ姿勢の差をすべて含む単なる表示上のピクセル差であって、「走りやすさ50%改善」等は誤り。
- 暫定的にはCROWNの空中細道のスケール感は向上した。一方、SKYLINEには相変わらず大きなchevron模様と直方体フレームの連続が見える。G4E-7KのQUIET研究版やG4E-7Lの巨大非衝突景観との組み合わせはまだ審査しておらず、統合採用は行わない。

### Gateと次G4E-7N
- **技術判定**：PRECIPICEは真のB48狭路＋高低差＋240Hzスクリプト7/7の先行研究としてPASS。THREADは実物理幅条件のみPASS、SCRIPTED FAILUREのためHOLD。どちらも人間QA・美術採用・操作性・Windows実FPSはHOLD。
- Goldと以前の7/7 GLIDE、28 B51-C動体、G5-C1反発、G4E-7D手動4走は無変更。main、本番2サイト、既存原作Slope再現サイト未変更、PR #46 Draft未マージ。正式Slope 2要素認定・本番へ追加した区間はともに**0m**。
- 次G4E-7Nは、THREADのCROWN物理衝突の原因（狭路、カーブ、バンク、動体接触、リカバリー）を独立に分析し、PRECIPICEを狭いままでも高速で先読みできる路面装飾と動線で検証。人間試走に向けて操作負荷・公平性を最優先にし、40%目標を自動完走距離と混同しない。
