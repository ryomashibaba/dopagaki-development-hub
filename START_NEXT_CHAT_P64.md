# DOPAGAKI — P63開発自動化引継ぎ / P64入口

P63のローカル初期パイプラインを実装。`P63_DOPAGAKI_DEV_PIPELINE_BOOTSTRAP` ディレクトリがGitHub新Privateリポジトリのソース正本候補です。P62 404固定版の実JSON4作品・Moving Lab B51-C/B48読み取り専用参照・24完走の過去ログを含む。新規物理走行を実行したわけではない。

コマンド：`node --test tests/core.test.mjs && node scripts/build.mjs private && node scripts/smoke-http.mjs && node scripts/build.mjs public-safe`。GitHub ActionsはQA→Playwright Chromium→Cloudflare Access事前条件→配信の順。SecretsとVarsを設定しない限りデプロイ禁止。公開STAGE FORGE/Moving Lab/正式ゲームは変更なし。

**未完**：新Privateリポジトリ作成・push（GitHub connectorにrepo createがないのでユーザーのGitHub CLI一回実行または手動作成が必要）、Cloudflare Pages新プロジェクト・Access本人認証・Secrets設定（ユーザー操作）、Actions実クラウドQA、Windows実Chrome確認。すべて未完の状態で「公開完了」と報告しないこと。

次はGitHub登録完了報告を受けたら実Privateリポジトリの差分を確認、Actions失敗時は修正、Cloudflare Accessを確認してからデプロイを有効化。その間ステージ制作自体はP63/P64で並行可能。P62巨大ZIP原本は従来のサンドボックスに保持。Moving Lab正本に機能重複を追加しない。
