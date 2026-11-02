# R18 P1 — 5つの元カメラ時刻から構築した単一連続3D巨大都市（PRIVATE研究）

**2026-10-30 JST。R18P0元カメラ座標の方針に従う制作実装。SOURCE TECH:検証中／ART:HOLD／GAMEPLAY・HUMAN・PERFORMANCE・RELEASE・MERGE:HOLD。**

## 方針と本物の入力

- R17A/Bの旧2地点＋類似箱を詳細化する方式を停止。R18P0の2世界に共通する本物のGLSL/RAW 240Hzカメラ投影候補5地点を、形状制作の局所座標起点に使用。54秒 road5/u=.18/right+240/up+100、58秒 road5/u=.48/right-120/up+100、61秒 road5/u=.91/right-120/up+100、64秒 road6/u=.30/right-240/up+100、67秒 road6/u=.78/right-120/up+100。
- **絶対座標系を保護**：`sample(surface,u,.5)`の前方差分をXZ面で正規化し、R15S3D15と一致する `right=[-forward.z,0,forward.x]`で横の符号を決める。従来R17の`sample(...v=0)`辺方向とは混同しない。
- 新生成器 `scripts/p101-r18p1-temporal-inhabited-city-architecture.mjs`。模式図でなく正規`sample`由来の世界XYZ+RGB三角形メッシュ。元Stage docはJSON全体比較で不変検査。**新ゲーム当たり判定ゼロ**。
- 2案は構造体系自体を変える。`A_CIVIC_RIBBON_CONCOURSE`：非対称立体ヴォールト、都市の入口・細分化ファサード、開放広場、環境を横断する細い空中交通骨格。`B_TERRACED_COURT_NETWORK`：本物の穴を保つ公共中庭群、段状に重なる居住棟、片側の上昇する駅街区スパイン。屋根で原路面を覆う偽のゲーム道路や壁の峡谷にはしない。
- 五時刻に対して`54=入口,`58=街の予告,`61=都市心部,`64=公共交通,`67=次の地平`という機能的な違い。離れた孤立オブジェクトとならないよう、近接世界座標同士だけ低密度の細い交通リンクで結ぶ。端点間が不自然に離れていればリンク生成は停止して統計に残す。**歩行可能/接続された都市が証明されたという意味ではない**。
- 隔離PACK `scripts/p101-r18p1-private-original-webgl2-city-pack.mjs`。真正元D11ランナー/元カメラをPRIVATE `dist-private/r18p1`に複製、対照D15R1・元Gold/P100/本番はいずれも手を加えない。PNGは元`#view` Canvasからハッシュを含め取得。
- Windowsで実際に起動するための `scripts/R18P1_PRIVATE_FIVE_TIME_CITY_ONE_CLICK.cmd`も別途追加。利用者のGPUでの操作テスト結果はまだ持っていない。

## 正式真正試験と既知の修正

- [R18P1 Actionsワークフロー](https://github.com/ryomashibaba/dopagaki-development-hub/actions/workflows/p101-r18p1-true-original-webgl2-continuous-city.yml)：旧D15R1対照×2世界＋新A/B×2世界の最低6条件。54/58/61/64/67秒の元240Hz生tick＋本来の`finish`を検証。36枚の真Canvas PNG（全時刻+各終端）をbyte SHA256/サイズ/寸法で独立QA、10種の偽証拠を強制拒否。SOURCE TECH PASSでも`ART`承認は出さない。
- 初回 Actions [#41074370616](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41074370616)は新3D生成テストでFAIL。private交通回廊`connectDistricts`の`[0,height]`が3DのZ成分を欠くために`NaN`となり、0長さbeamの検査が拒否。物理ソースではない。
- 曲線の振幅を37m→8mに下げただけでは原因を解決せず、詳細ログで`[425.5,160,null]`のZ非有限値を特定。**正因の修正**：空中経路の高さ変位を`[0,height,0]`の3要素へ変更（コミット`65b1b0f5019b44f8e2d35c83e732b0cba4c43ac2`）。正常な3D頂点を捨ててテスト合格したということはない。
- 修正版の真正CIが完了していない段階では、実WebGL2描画・完走・性能・美術の合格を宣言しない。実Canvas画像と独立検査を直接読んでから次の結果記録を作る。

## 不変保護・拒否基準

元Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、元240Hz CCD＋r.65m、B48物理道路7・B51移動体28・合法操舵とRAWカメラ/HUD、main/Gold/P100・本番URL・PR#46 Draftを厳格保護。非衝突メッシュは路面上のゲーム機能を付け足さない。見えない安全床、磁石、オート操舵、テレポート、偽finish、画面差のみのART認定は不可。

正式採用ART0件／Slope2認定0m。人間実GPU・手動回避・原B51の視認・実FPSはまだHOLD。**新R18の実画像が不十分ならA/BともART REJECTを明確に行うこと**。
