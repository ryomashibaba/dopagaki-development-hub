# K4BE — 真の高速Cameraに映るTidal Forum公共建築の再構成

2026-11-03 JST。K4BD完了HEAD 702805d4b58d7ff8f6bf99157dd25a02d3fc83e9から隔離した研究工程。正式ART採用0件・Slope2 DNA認定0mを固定。

## 方針の継承

最新の[完全統合K4BD正本](continuity/HANDOFF_20261103_K4BD_TO_NEW_CHAT_COMPLETE_JA.md)と[元Camera実画像](research-evidence/k4bd/K4BD_PILOT_TWO_SOURCE_CAMERA_AB_ART_REJECT.png)を継承。K4BD制作CI #41649107682、独立全7道路/B51静的検査 #41653236842、証拠画像保存CI #41650256585は全成功。ただし巨大な道路、建物の模型感、空虚な都市風景はART REJECT。色替え・粗い箱/棒/薄い屋根を量産することで認定しない。

## 今回実制作する美術構成

- [K4BE Blender実制作器](../scripts/p101-k4be-source-camera-integrated-tidal-forum.py)はK4BD編集可能Blender原本を開き、既存の左右旧建築・中央旧Cross Museum・旧路外デッキを削除せず、研究DCC画面上で表示OFFにして比較可能な原本を保持する。
- 元Road5実格子91×13に沿う外側に、左右の長い公共図書ホールと沿岸科学温室を一体設計。両側の地盤に結び付いた実3D基壇、開口付き2層ホール、段状広場、上下の居室床、湾曲した本格的な構造厚の屋根、太い支持柱、内部照明と屋内用途であることが読める意匠を新たに造形。公共室が実Cameraでどれだけ読めるか審査。
- 真のRoad5終端と既存Road6のsource方向を基準とする中央Tidal Forum。実際に地盤で支える両岸の支柱と、元Road6上空に余裕を確保する大きな市民ギャラリー、正面にある公共ホールの実大入口、温かい内部の光、正面外壁への施設名。ゲームの走行道路や物理colliderは追加しない。
- K4BDのRoad5 3K PBR路面・元source B48全7道路×control/ultra=14枚66,192三角形・元6ticksの28 B51=168物理collision OBBは読み取り専用のまま。元ゲーム凍結blob af076d67492a677d2235e4730aef8cdf4808e106。240Hz、半径0.65m、操作、真正Camera、速度、危険表示、WebGL2コード変更禁止。
- [2本の元CameraのパイロットCI](../.github/workflows/p101-k4be-original-two-camera-urban-art-pilot.yml)：control tick11307とultra tick11341、元Camera数値を変更せずK4BD同pose A/B。別の非ゲーム航空カメラは補助のみ。編集可能Blender・GLB・image＋各SHA原本を保存。ARTが十分でないうちに高負荷6視点へ無条件で進まない。
- [独立全7 B48/B51静的BVH](../research/k4be/independent_all7_B48_168_B51_new_urban_forum_bvh.py)：真source JSONから14道路と168OBBを別実装で再構築し、旧先行建築＋新K4BE 4建築コレクションを静的BVHで評価。元Road5に密着する52枚のDCC-only road visual inlayと海面は物理collliderではなく、明示的に除外。三角形静的表面交差0件であっても球半径0.65mの余裕、CCD、全B51時間、人間操作、FPS、ARTの安全合格ではない。

## 実行結果の記録・不正確な成功報告の禁止

- 初回Actions #41656920221：FAIL。元source testは成功したが、artifact参照時のgithub-token文字列に誤ってバックスラッシュがありBad credentialsで停止。Blender未起動。初回失敗を新建築の成果だと扱わない。
- 原本取得のトークン3workflowを修正し、修正版Actions #41657612279を制作・検証の基準とする。これがSUCCESSになるまでは新K4BE DCC成功を主張しない。独立BVH／GitHub画像保存は修正版制作runのSUCCESSを条件とする。
- 実画像を得た後、元Cameraにおける道路の画面占有、建築の用途、形状の説得力、遠景の空白、見た目の素材品質を厳しく審査。改善が弱ければ即ART REJECTを維持する。

## 恒久的な保護

main、公式開発branch p101-velocity-overdrive-native-trial、Draft PR #46、production/元Slopeサイト、全元game physicsを変更しない。Workは明示的な事前承認制、Chat＋GitHubのみ。ZIPダウンロードやローカルWindows操作をユーザーに要求しない。

正式ART採用0件、Slope2 DNA認定0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。ゲーム画面とBlender DCC画像を混同しない。

## K4BE最終実証・本当の視覚評価（2026-11-03）

**K4BE編集可能DCC＋元source保護検証は成立したが、ARTは明確にREJECT。** 以下は全て実GitHub Actionsと本物の生成ファイルを検証した結果。

### 中間失敗を隠さず再利用して余計なレンダリングを削減

- 最初の制作CI #41656920221 はartifact tokenの誤エスケープでFAIL。元source回帰testのみ通過。
- 修正した2視点実制作CI [#41657612279](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41657612279)：3つの元source原本/SHA検査→Blender DCCで **control11307、ultra11341、独立studio航空の計3画像と編集可能blendを実生成**。しかしUbuntu BlenderのGLB exporterでPython numpyが未インストール、ModuleNotFoundErrorにより**最終CIはFAIL**。この失敗は美術や元コース交差ではなくGLB出力の環境不備。オリジナルrunを成功に読み替えてはいけない。
- 費用を抑え、実画像を確認すると走行画面の広範囲は依然単調な路面、中央施設は小さな窓と途切れた文字に見え、左右も模型感が強かった。**ART REJECT**。大きく良くなる見込みがない同案の6視点再描画を停止。
- 真の既描画3画像/.blendを保持したまま、numpy付きBlenderで原source SHA照合・GLBのみ出力する [追加描画なし救済Actions #41659005101](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41659005101) **completed SUCCESS**。成果Artifact #13240733042。ZIP SHA256 d2473ae0b2e61f48e34115200bad4e149b52940db76283e0a91863ce9aa0be3a、40,927,628 bytes、CRCエラー0。実7ファイル、manifest内全SHA一致。Blender原本のRoad5 control/ultra source geometry fingerprint 両方 f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2。新しいK4BEの編集可能路外・上空建築 **305メッシュ/カーブ**。元Camera6時刻を全保護、**2時刻のみ実画像**、残り4時刻は未描画。source元WebGL2ゲームは未実行・未変更。

### 元7 B48と元B51の独立BVHの確定成果

- [独立BVH Actions #41659267726](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41659267726) **completed SUCCESS**。保存Artifact #13240119880、ZIP SHA256 2044f351a740e98add8024b89e26fd7a3ff734540afa971debfbefa278156eef。
- **元7道路×control/ultra＝14 B48 source mesh／66,192源三角面＋元6tick×B51 28 collision OBB＝168件**。K4BE新築305件を含むK4BC・K4BD・K4BEの**826評価済オブジェクト、151,796評価面**を真sourceから再構築した独立BVHで調査。元B48静的三角形表面交差**0件**、B51静的三角形交差**0件**。旧K4BD Road5非衝突DCC路面inlay52件と深海背景は除外。これは球0.65mの距離余裕、source B51全時間、SAT/CCD、fps、人間操作・gameplay/art safetyを一切保証しない。
- 最初の静的BVH run #41659125297 は独立Blender上の計算が道路0/B51 0、826件を完走したが、最後の報告schema項目名が誤って formalARTApproved を参照したため **CI FAIL**。正式なsourceBVH PASSは修正版の #41659267726 のみ。

### GitHub直接確認できる元Camera画像

[永続画像保存 Actions #41659255835](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41659255835) **completed SUCCESS**：

- [K4BDとK4BE 2真正Camera同pose比較](research-evidence/k4be/K4BE_TWO_ORIGINAL_CAMERA_K4BD_VS_CITY_ART_REJECT.png)
- [K4BE control11307 原元Camera DCC](research-evidence/k4be/K4BE_CONTROL_11307_TRUE_SOURCE_CAMERA_ART_REJECT.png)
- [K4BE ultra11341 原元Camera DCC](research-evidence/k4be/K4BE_ULTRA_11341_TRUE_SOURCE_CAMERA_ART_REJECT.png)
- [独立航空構成 DCC—not real game](research-evidence/k4be/K4BE_INTEGRATED_CIVIC_HALL_AERIAL_DCC_NOT_GAME.png)
- [Source SHA](research-evidence/k4be/K4BE_ORIGINAL_SOURCE_B48_B51_SHA_ART_REJECT.json)

### 美術上の厳しい判定と次段階

本物の元Cameraの高さと視線のため、Road5の巨大な前景は変わらない。中央施設はK4BDから形状・照明・実3D床の構成は変わったが、道路を越えた都市が実際に読める密度や人の居場所を作れていない。航空DCCでも単純な薄い白屋根・直立支持棒・透明な箱として見え、建築の実体に世界レベルの造形精度がない。施設名の文字も部分的に見切れ、高速Cameraで用途を明瞭に伝えられない。**新規造形数305という数字は美術の評価基準にならない**。

K4BF以後は**無計画なprocedural hallの反復を停止**。まず元Cameraの実画面をアンカーに、見えている道路・構造・空白の占有率と建築が認識できる部位を検証する。道路真の物理は変更せず、2Cameraに映る巨大な部分から、熟慮された独立の建築シルエット、施工的な素材/外装、都市街区の奥行きと路面の自然なcivil textureまで**制作手法そのもの**を見直す。まず1つの顔になる場所をハイディテールで制作し、source Cameraで実際に良く見えない限り6Camera・ゲーム統合へ進めない。

**最終判断**：SOURCE/DCC editability・真正2 source camera・SHA・全7 B48/B51有限静的BVH・GitHub保存＝技術限定SUCCESS。ART REJECT、正式ART採用0件、Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。main・正式継続branch・本番・Draft PR #46・元240Hz/球0.65m/B48/B51/camera/ゲーム安全表示には変更なし。
