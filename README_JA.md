# DOPAGAKI P63 — PRIVATE DEVELOPMENT HUB BOOTSTRAP

**2026-10-16｜実装済み／GitHub未登録／Cloudflare未公開。**

## 目的
- 毎回のZIP・解凍・CMD起動を廃止し、今後はGitHubの変更→自動QA→固定URLを更新する。
- 公開 STAGE FORGE `main`、Moving Lab `cloud-live`、正式ゲームは触らない。
- P62の4ステージ・24基の移動障害物・既存の完走記録を、Private GitHubに初期登録する。
- 404を再発させないため、実JSON4本のHTTP読み込みと実Chromium上のステージ切り替えを検証する。
- **未公開ステージのデータを認証なしのPagesへ絶対に配信しない。**

## 現在の確認結果
`npm run test:core` はP62凍結SHA256、B48構文、移動体3種・24基、B45固定値、既存走行ログ24件の集計を検証する。ログの読み取りであり、24条件の再試走ではない。`npm run build:private && npm run smoke` は10 HTTPルートを確認し、旧誤記による404を検出する。`npm run build:public-safe` ではPrivate JSON・物理参照コードを一切コピーしない。

## 今のWindowsで何も登録せず試す
`START_LOCAL_PREVIEW.cmd` をダブルクリック（Node.js 22以降）。`http://127.0.0.1:4373/` のHubから4作品の上面アニメーション確認ページへ移動。これは表示検査用で、3Dゲームプレイとは異なる。

## 初回のGitHub Private登録（1回だけ）
**最少操作案：** このフォルダーの `SETUP_ONCE_PRIVATE_GITHUB.cmd` をダブルクリック。`git`/`gh` の導入と `gh auth login` が済んでいれば、Private `ryomashibaba/dopagaki-development-hub` を新設し、初期コード・JSONをpushする。既存リポジトリがPublicだった場合、処理は即停止する。既存のSTAGE FORGE/Moving Labには書き込まない。

`gh` が未導入の場合は、[GitHubの新規リポジトリ画面](https://github.com/new)から **Repository name: `dopagaki-development-hub` / Private / README・.gitignore・ライセンスは追加しない** を選び、新設だけ済ませる。以後このCMDを実行すればコードをpushできる（`gh` CLIは必要）。GitHubのトークンやパスワードはこのチャットに貼らない。

GitHub URL：`https://github.com/ryomashibaba/dopagaki-development-hub`（**作成完了後**に有効）。

## 初回 Cloudflare Pages（本人の認証が必要）
**重要：認証付きの本番・プレビューURLになるまで、実ステージは配信しない。**

1. Cloudflare Workers & Pagesで、**開発用の新規Pagesプロジェクト**（推奨名 `dopagaki-dev-hub`）を用意する。既存の`dopagaki-moving-lab`は使用・変更しない。Direct Upload方式が適切。新規プロジェクト名やURLはまだ存在しないため、作成後に実名を確認する。
2. Cloudflare Zero Trust → Access → Applicationsで、Pages本番 `PROJECT.pages.dev` **だけでなくプレビューデプロイの別名も含めて**本人のみ許可するアクセス保護を設定する。URLを知らない人にも開ける状態のままならPrivateステージは配信しない。初回は中身が無害なpublic-safeページのみ使ってアクセス制御を設定してよい。
3. Cloudflareの最小権限Pages Write APIトークンを作る。GitHub新Privateリポジトリ→Settings→Secrets and variables→ActionsにSecret `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID` を登録。**値をChatGPTへ貼らない。**
4. 同じ画面の Variablesで `CLOUDFLARE_PROJECT_NAME`（実際のPagesプロジェクト名）、`DOPAGAKI_PROTECTED_SITE_URL`（例ではなく実際の `https://...pages.dev/`）を設定。未設定のままは安全側へ停止。
5. Accessにより未認証アクセスがCloudflareのログインへリダイレクトされることを確認してから、Variables `DOPAGAKI_ACCESS_CONFIRMED=true` と `DOPAGAKI_DEPLOY_ENABLED=true` を設定。
6. `main`への更新とGitHub Actionsの `qa`・`browser` PASS後のみ、`deploy`で新しい固定URLへ公開される。`verify-protected-site.mjs` がリダイレクトを見つけなければ配信前に停止。**プレビュー別名までAccessで保護されているかは管理画面でも確認すること。**

CI workflow：`.github/workflows/private-stage-preview.yml`。上記4変数/2シークレットが未設定ならデプロイしない。

## 日常運用（初期登録後）
1. ChatGPTでP64以降の制作・修正を依頼する。
2. 非公開GitHubへ差分を反映し、CIのJSON・HTTP・Chromiumチェックを実行。無変更ステージの再生成や巨大ZIP作成はしない。
3. 合格後、Cloudflareの同じURLでページをリロードして確認する。失敗時は前の検証済みサイトを維持。
4. 人間の手動試遊が重要な場面に限り、フィードバックを依頼する。

## ファイルの役割
- `private/stages/` — P62 4作品B48 JSON（フリーズした入力SHAあり）
- `private/source_p61/`, `private/generate_p62.mjs` — 元の決定論的生成素材
- `private/reference_only/` — Moving LabのB48物理参照。正本は **Moving Lab** で、こちらでは改造禁止
- `private/reports/P62_FULL_RUN_MATRIX.json` — 既存24条件の機械走行結果。**新規再試走ではない**
- `web/inspector.html` — P62 404修正済みの表示専用インスペクター
- `scripts/build.mjs` — Private出力とPublic-safe出力を分離
- `scripts/smoke-http.mjs` — JSON等のローカルHTTP 200検証
- `tests/browser` — Playwright実Chromeテスト。CI環境で実行（このローカル環境は未実証）

## 現時点の境界
実際のCloudflareサイト、GitHub新リポジトリ、Windows実ブラウザテストはセットアップ完了前なので**未作成・未実施**。GitHub Actionsの正常実行も未確認。P31は未入手。今後B48物理・B45固定値は無断変更しない。
