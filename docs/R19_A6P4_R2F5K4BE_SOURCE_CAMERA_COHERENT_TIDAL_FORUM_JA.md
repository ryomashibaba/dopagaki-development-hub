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
