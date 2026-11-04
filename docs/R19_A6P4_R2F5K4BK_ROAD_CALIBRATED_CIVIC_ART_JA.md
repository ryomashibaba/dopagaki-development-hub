# K4BK — 実Road5測量を第一原理にした都市景観の再建

更新：2026-11-04。研究隔離ブランチ `research/k4bk-ground-truthed-civic-roadside-20261104`。

## 1. 前工程K4BJで発見された深刻な原因

K4BJの実2DCC原カメラ画像は、SOURCE/DCC 技術PASS、**ART REJECT**。旧来のCity生成では前方550m、Road5左右±160〜360mに大規模建築を置いていた。一方[実物のRoad5測量JSON](research-evidence/k4bj/K4BJ_REAL_SOURCE_ROAD_CAMERA_SCALE_SURVEY.json)で前方0〜25mの道路頂点は横−39.162〜＋53.261m、100〜150mで−38.821〜＋69.255m。Road5元Camera前方の最大到達は188.774m。この食い違いが、路側の造形が実道路と接地せず、相対的に模型のような風景を生んだ原因の一部と確定。ただし道路頂点分布は安全に走れる幅を意味しない。

## 2. 本工程の制約

- プロジェクトの最上位方針：世界水準の超高速3Dレーシングゲームにおける**コース全体の美術完成**。まず1つのRoad5の真Camera構図を人間的に美術完成させてから他6Roadへ展開。品質が低いまま既存のプリミティブ箱・窓・細いリングを反復生産しない。
- 元ゲーム `web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` git blob `af076d67492a677d2235e4730aef8cdf4808e106` を不変とする。元実B48 7Road／B51 28 movers／240Hz／球半径0.65m／元Camera6・ゲーム速度・CCD/安全案内・操縦系に一切変更なし。
- main・公式 `p101-velocity-overdrive-native-trial`・Draft PR #46・本番2サイトは保護。Work開始には個別承認。ユーザーWindows/ローカルBlenderの操作は不要。
- 全美術は**編集可能な真Blender DCCの研究形状**である。ゲームで使える衝突体・安全な路側物・実WebGL2で表示される建物を証明しない。人間プレイ、B51全時刻の実物SAT/CCD、FPS、RELEASE、MERGEはすべてHOLD。

## 3. K4BKで制作するもの

- `scripts/p101-k4bk-true-road-civic-corridor.py`：K4BJ真正Source Camera DCC原本のSHA256 `36d6508d431cb10c2f085707658af556a8a311fd12506567d0276bff8769081a` を固定取得。旧K4BJ/BI/BHの美術RenderをOFF、削除はしない。
- 元Source control11307/ultra11341カメラ座標と実Road5 4728ポリゴンの頂点・面指紋 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`を維持。
- カメラ前方d=-25〜170mの9地点で実Road5メッシュへの鉛直Raycastを実施し、左右境界・道路高さをBlender実原本からサンプル。存在しない点では施工を止める。左右境界の外にDCC用の路側土留・街路灯帯・階段庭園・人間スケールの歩行者用レールを設計する。実ゲームColliderは追加しない。
- 西側：Source Camera道路に接近した陶板屋根の公共図書館・交流所。実際に奥に室内がある3つの異寸法の吹抜け、ブロンズ柱、歩行者デッキ、植栽。
- 東側：西と同形状を複製しない、複数の曲面銅屋根を持つ港湾公共ターミナルとテラス、暖色の旅客待合室。
- 中央：実Road5のd≈132〜157mに合わせたガラスの空中駅／連絡ロビー。従来のd≈550mの模型的な二重リングを停止する。
- 既存Road5原メッシュは全く編集せず、Source DCC上のみ道路の濃色PBR表面、測量した幅に対応する狭い中心・車線塗装、微小凹凸を調整。実ゲーム素材更新として扱わない。
- CyclesのOIDNはUbuntu用Blenderに実装されていないため明示OFF。真control11307／ultra11341 2枚のDCC画像および編集可能.blendを実生成。旧K4BJ画像と同Camera比較。生PNG・SHA256・形状指紋・Raycast結果を別に検証する。

## 4. 初回技術実行と判定待ち

[専用Actions K4BK](https://github.com/ryomashibaba/dopagaki-development-hub/actions/workflows/p101-k4bk-true-road-camera-civic-art.yml) を起動。今回の記録作成時点ではCI/レンダリング結果・Blender Art/正本SHAの最終状態をまだ認定していない。

**ART正式採用0件／Slope2 DNA正式認定0m**を引き継ぎ、SOURCE/DCC技術PASSと「ユーザーが認める美術世界水準」を決して混同しない。新しい画像を必ず実見し、低品質ならART REJECTを明記する。ゲーム統合と横展開はしない。


## 初回K4BKの本物の実行・美術評価と修正版

- [初回CI #41747047424](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41747047424)は **completed/SUCCESS**。親K4BJ .blend SHA、凍結ゲームGit blob、Python・元Source Node tests、B48 Road5元頂点と面 fingerprint、元Camera control11307/ultra11341数値、編集可能真Blender原本、同Camera2PNG、独立PNG RGB＋SHA、GitHub研究ブランチ内画像保存まで成功。**SOURCE/DCC技術限定PASS**。
- [実Artifact #13284710962](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41747047424/artifacts/13284710962)、ZIP SHA256 `5b74d4e2fca3aa4f0162c7c178b4898aea003f631baf14e75539df801c561a42`、CRC異常なし。BLEND 34,602,396B、control PNG 1,820,268B、ultra PNG 1,789,717B、AB PNG 3,887,659B、検証JSON。独立実バイトSHA全件一致。新編集可能Blender研究形状70件。数値は美術価値の証明ではない。
- **元Road5の実ロード上のRaycastが9地点全てで成立**：カメラ前方d=-25,0,25,50,75,100,125,150,170mにて、実ポリゴンの左端と右端は以下のとおり。`(-37,+49),(-37,+51),(-39,+53),(-39,+55),(-39,+59),(-37,+63),(-37,+65),(-35,+69),(-33,+71)`m。これは2m間隔の実Raycast推定路面端であり、安全通行幅でもゲーム衝突検査でもない。**初回の道路/建物の尺度不整合は大きく是正**。
- しかし**初回の実control/ultra画像の美術判定：ART REJECT**。左右屋根の大部分が巨大な無地の淡色/緑の壁のように投影され、中央ガラス連絡路は太い梁として画面上部を塞ぎ、道路と空白も広い。内部の使い勝手や公共施設の奥行きが見えず、極めて人工的で模型の延長。道路の実寸に合わせた事実はTECH成果だが、美術全体の完成は達成していない。**正式ART採用0件、Slope2 DNA0m**。
- **改修**：この失敗を受けて研究ブランチのPython制作コードを修正（commit `d45c86cdafb7beec6bedd6c544fdd668c756df39`）。西側屋根・東側銅屋根を大きな塊から薄い断面に作り直す。中央ガラス連絡路も源道路のd=152〜169mの薄い意匠へ位置と断面を改め、独立した実寸のダークガラス玄関・室内・ブロンズ枠・見通しのある開口を道路外端に設計。露出調整。旧Blender原本／元B48／元カメラ／原ゲームは不変。修正版[CI #41747761082](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41747761082)の実結果は**成功推定禁止、要再照合**。
- 修正版でも世界品質に届かなければART REJECTを維持し、設計方法そのもの（メッシュの巨大な一体壁と貧弱なカメラの遠景）を見直す。追加課金/Workなし。メイン・公式・PR・本番・物理原本は厳重保護。
