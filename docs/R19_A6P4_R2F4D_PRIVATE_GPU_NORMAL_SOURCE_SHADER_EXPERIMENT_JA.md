# R2F4-D — Private GPU normal shader research gate

**2026-11-01 JST.** R2F4-CのCPU静的面色bakeは元8/11.5秒でほとんど見た目が変わらずART REJECT。今度は元WebGL2の実shaderをread-only検証した上で、**privateコピーだけ**に法線属性とGPU照明コードを追加。

原コード`web/drive3d.mjs`の`mesh(v)`は6float `XYZRGB`、`draw()`はstride24、shaderは`layout(location=0) vec3 p`,`location=1 color`で`shade=color`をfogと混合するだけ。元のrendererは球、B48×7道路、B51×28も共通shaderを使うため、**本番/旧privateの変更は禁止**。

R2F4-DではGLBを展開した元XYZRGBに実面法線(NxNyNz)を追加して9float stride36のバッファを独立生成。元XYZRGBをbit単位で完全一致、三角形数/形状/物理当たり判定不変。private専用clone `dist-private/r19a6p4r2f4gpu`だけでlocation2の法線属性を追加し、original shared shaderと同じ制服uniform/位置変換を維持。render関数は`m.r2dLit`のときにだけ実法線Lambert/ambient/fill明暗を適用し、全道路・障害物・球・HUDは無効化して元色を保持。**PBR、透明ガラス、実反射・シャドウマップは実装しない**。

1つの既存GitHub Actionsへ元12枚＋旧CPU bake4枚＋GPU lighting4枚のsource-native WebGL2撮影と、原B48サンプル三角形・全2881tick B51 SAT、元source blob SHA `af076d67492a677d2235e4730aef8cdf4808e106`の不変検査を統合。元8.004秒/11.504秒・14m/28mの4真正PNGで**建築の面陰影とゲーム視認性が改善したか**を独立評価。どれほど大きな色差でもART自動PASS禁止。元ゲーム物理・旧private・main/Gold/P100/W9-X/B5・2本番サイト・元カメラ/HUD不変。

未検証の正規静的B48エンジンメッシュ精密接触、地盤支持/人間動線、B51 pixel遮蔽、tick間sweptCCD、FPS、人間実走は独立HOLD。PR#46 Draft／未マージ、正式ART0件、Slope2 DNA正式0/2,912m。
