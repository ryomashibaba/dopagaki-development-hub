# G4E-7DR — 正規のB48道路実形状・B51動体の3D美術審査環境

**2026-10-27 JST。正式ART 0／HUMAN・READY・PUBLISH・MERGE HOLD／PR#46 Draft・未マージ。**

DPは巨大リボン、DQは詳細建築の右側重複でART REJECT。DO〜DQの編集可能Blender画像は、本物のCX景観と元240Hzカメラを持つ一方、**元ゲームの実走路面と動体を描かず、非物理のガイド線21本だけ**だった。道路込みの景観・危険物の視認性・立体都市の奥行きを審査するには不足。

DRは新しい都市建築を**一個も追加しない**。元BC rollDeck道路７面を既存ゲームの正規関数 \`tessellate(s)\` で生成し、道路表裏・側壁・断崖・**真のギャップセル52が存在しない物理メッシュ**をIEEE754 float64とUint32のバイナリに損失なく記録。先頭道路のtop三角形にslot52が存在しないこと、両隣の51/53が存在することを検査。元stage JSONは不変更でSHA監査。

元B51-C全28動体を \`movingObstaclePose(ob, shot.tick*DT)\` で計算する。**同じ本物の非人間240Hz**スタート00 / P96 操舵、15・15.5・16・16.5・17秒の撮影時刻を使い、各OBBの位置・ヨー・半寸法を一致。Blenderでは5つの正規フレームに28個の実物理衝突箱をそのままキーフレーム化。これは**衝突体積の正確な位置参照**であり、元ゲーム障害物の本来のアート外形・色・エフェクトではない。道路材質や照明、霧、機体、HUDも真正ゲームWebGLとは異なる。

同じDOの元CX18ソース/22,920三角・正規カメラ5台とあわせ、両道路の編集可能な.blend２個、真正Blender比較PNG20枚（DO参照10＋DR実物理付き10）、実道路バイナリ／監査JSONをCI artifactで保存。**技術的レンダー成功をART PASSと呼ばず、既存CXの都市美術0件採用HOLD**。元B48×7/B51×28/gap52/240Hz/物理・操作・カメラ・main/Gold/公開コードは変更しない。真のゲームWebGL画像と人間操作公平性の最終認定は別途必要。

## 実際に取得した最終結果（2026-10-27 JST）

[DR CI #40469650772](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40469650772) **SUCCESS**、[Artifact #12717668295](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40469650772/artifacts/12717668295) ダウンロード・実ZIP検証。全32ファイル、４編集可能.blend（元DO参照２・実B48+B51のDR２）、真正Blender画像20枚（元CXのみ10＋元道路/動体を追加した10）、f64メッシュバイナリ２、物理・カメラ監査等。両道路：B48７面合計**33,092三角形**（表面、裏面、側面・端面）、28個B51 collision-OBB×５実240Hz時刻、ギャップcell52物理空洞を反映。元CX18ソース、オリジナルB48/B51 JSON/SHA保護。Blender内部f32精度の最大丸め誤差はtrue-pinch 5.336432e-5m、pinch-switch 5.950872e-5m。値は元float64の姿勢データと一致する最も近いBlender float32に強制検査。

初回CI #40469220277はf64座標とf32 Blenderオブジェクトを直接比較する不適切なパリティ検査でFAIL。元バイナリを64ビット無損失保持したまま、f32丸めを明示的にモデル化する修正を実施し最終PASS。技術的には**DR制作審査基盤PASS**。実Blender画像では道路が元DO線ガイドと異なり巨大な物理的占有面として現れ、既存の景観断絶は解消されない。新美術候補0・**ART総合HOLD／正式採用0件**。物理OBBとゲーム本来の障害物外観、Blender表示色と元ゲームWebGL材質は違う。元ゲーム真正WebGLや人間操作性/FPSは未検証。

---

