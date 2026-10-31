# W9-C2 G4E-7P｜13〜16m級の真のB48細道に対する内側GPU装飾削減A/B（HOLD）

2026-10-22 JST。Draft PR #46の非公開研究。Gold、A13/B5基準、G4E-7O手動QA、main、両本番サイトは維持。

## 目的
G4E-7Kの静かな路面は、幅約70mのGLIDE第I道路でのみ検証済みだった。G4E-7MのTHREAD/PRECIPICEではSKYLINEとCROWNの実B48コリジョン道路が約12〜16mまで狭くなる一方、もとの巨大内側chevronが路肩・カーブ・高低差を隠す可能性がある。そこで道路自体と対応した非公開の差分描画を2道路に限定して比較する。

## 実装
- ローカルの `?g4e7m=on&g4e7p=quiet` を明示したTHREAD/PRECIPICEだけ、もとのA13装飾メッシュの中心・内側模様を省く。外周の物理路肩模様は残す。
- 対象は既存G4E-7M実物理変更の包絡窓だけ：第I SKYLINE u=.31–.735、第II CROWN u=.055–.305。
- 第III〜VII道路、B48実道路の形状、28基のB51-C動体、物理240Hz、52m/s、G5-C1反発、カメラ、スコア、AI操舵は無変更。
- G4E-7O手動2走モードと重ねない。研究用UIやJSONを通常ゲーム・public・public-safeに混入させない。
- G4E-7KのGLIDE用QUIET研究とは合成せず、2研究は別条件として維持。

## QA計画
Nodeで元Gold/W8描画が不変であること、両道路で実GPU内側面だけが削られること、元のB48生成文書が不変であることを検証。Chromium実WebGLでTHREAD/PRECIPICE×SKYLINE/CROWN×BASELINE/QUIETの8条件を、同じ物理時刻0秒と同じ実路面uで撮影し、JSONと画像をCI artifactへ保存。公有物への漏出も検査する。

画像が違っただけでは人間の視認性や楽しさはPASSではない。正式Slope2認定0m・Windows手動実機／美術採用／公開すべてHOLD。次工程では画像と可能ならユーザー実機JSONを評価し、単なるHUD試作に戻らず実ギャップ・急降下・障害物・大型建築の改良を優先する。
