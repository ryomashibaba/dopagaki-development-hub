# DOPAGAKI 公開チャネル方針 — 2026-10-17 確定

## 目的と優先順位
- **最終本番（プレイヤー向け）**: https://dopagaki-slope.sora-110029.chatgpt.site/
- **開発・検証（公開アクセス可能なステージング）**: https://ryomashibaba.github.io/dopagaki-development-hub/drive3d/
- **変更禁止の原作再現サイト**: https://slope-neon-ryoma.sora-110029.chatgpt.site/

本ファイルはユーザーが2026-10-17に明示確定した公開先Aの運用契約。GitHub Pagesの開発版が公開アクセス可能でも、最終本番版と同義ではない。

## 正本と現状
- Development Hub `main` は実験・統合用のコード正本。2026-10-17の確認基準: P90 / `6e3d1a64a0d0db6341458cf4d49d60aa4326bdab`。
- `.github/workflows/private-stage-preview.yml` は `qa -> browser -> publish (GitHub Pages) -> verify-public` を行う。GitHub Pagesへ反映しても**本番サイトが更新されたことにはならない**。
- 2026-10-17時点、このrepoから本番 `*.chatgpt.site` へ自動デプロイする方法・本番ソースとの同一性は**確認できていない**。未確認なのに「本番反映完了」と書かない。
- 物理正本 `dopagaki-track-director-cloud` のPR #1（P97）は Draft/HOLD。正式採用まで統合しない。STAGE FORGEの未採用PRも独断で取り込まない。凍結P62原本・B45仕様は保護する。

## 安全な更新フロー
1. 最新main、未統合PR、現在のページ表示、対象機能の既存実装を確認。重複実装を防ぐ。
2. 対象を限定したブランチで実装。単体/回帰・実240Hz Runner・Chromiumテストを機能に応じて行う。
3. PRのQA成功とレビュー条件を確認後mainへ統合。GitHub Actionsで`qa/browser/publish/verify-public`をすべて確認し、Pages上の`build-info.json`とコミットSHAを照合。
4. この時点では**開発・検証版の完成**。本番版更新済みとは報告しない。
5. 本番へ移す前に、現行本番サイトのソース・デプロイ経路・復元方法、ステージングと本番の差分、手動プレイの品質を確認。転送可能な形と権限が実証されて初めて、本番に対する限定した公開工程を進める。
6. 本番公開後は、本番URL自体で実装内容・操作感・主要機能・版の照合を行い、差異や不具合があれば元の本番へ戻せる手順を確保する。

**禁止**: GitHub Pages成功だけで本番更新済みと宣言すること、未検証PRの自動本番取り込み、原作再現サイト編集、P62原本改変、HOLD物理コードの無断採用、シークレットや非公開資料の公開、存在未確認のChatGPT Site自動配信APIを推測で利用すること。

## 使い分けと成果報告
- `STAGING VERIFIED`: GitHub PagesのCI・HTTP・SHA確認が終わった状態
- `PRODUCTION VERIFIED`: 本番サイト自身の更新と動作を検証し、ユーザー向け版として認定した状態
- `HOLD`: テスト/実体/承認が足りない。理由と次の解除条件を明記
- 自動Runner完走と人間の実プレイ品質は別証拠。実機未検証は未検証と書く。
- 基本はChatからGitHubを操作し、Workは明確な優位がある場合にのみユーザーへ事前相談する。Windows操作は原則ゼロを目標とする。
- 1工程はゲーム体験を高めるまとまりで実装する。監査レポートやP番号だけを目的化しない。

## 次の本質的なブロッカー
本番サイトのソースと配信経路（編集権限・更新方法・ロールバック）、Development Hubとの差分を特定する。確証が得られるまで、GitHub Pagesの自動デプロイを本番サイトへ流用しない。
