> **公開チャネル (2026-10-17 確定)**: 最終本番は [DOPAGAKI SLOPE](https://dopagaki-slope.sora-110029.chatgpt.site/) です。ここで自動公開される [GitHub Pages](https://ryomashibaba.github.io/dopagaki-development-hub/drive3d/) は**開発・検証専用**であり、本番サイトへ自動反映する仕組みは確認されていません。P98では実際のChromium画像を確認し、VOID BREAKERの視界を塞いでいた巨大な装飾柱を実道路端から26m外側へ移し、7区間の門型建築を70→42基に整理、実B48路肩リフレクターを追加しました。設定パネルの冗長な履歴は折りたたみ、観戦開始時にゲーム画面へ自動スクロールします。240Hz物理・12障害物・全編完走実証は変更せず、人間の難易度評価はHOLDです。以下のP64に関する説明は開発当時の記録です。詳細: [公開チャネル方針](docs/RELEASE_CHANNEL_POLICY_JA.md)。

# DOPAGAKI Development Hub — P64 Public Preview

2026-10-16 / 4 P62 stages / 24 moving obstacles / public QA-gated site.

## Site

Once **Settings → Pages → Build and deployment → Source: GitHub Actions** is enabled, every `main` push runs:
1. SHA256 / B48 / B45 fixed physics / historical run evidence checks.
2. Deterministic regeneration of all four P62 JSON stage files.
3. HTTP smoke tests including old P62 JSON 404 regression.
4. Real Chromium inspector UI test with all 4 stage selections.
5. **Only after both jobs succeed**, publish `dist-site` via GitHub Pages. Failed checks preserve the last successful deployment.

Expected fixed website after Pages is enabled: https://ryomashibaba.github.io/dopagaki-development-hub/

This is a **read-only overhead 2D stage inspector**, not a playable 3D DOPAGAKI SLOPE game. Physics reference is unchanged and its preview does not simulate actual contacts. Existing P62 24/24 machine run evidence is archival; these checks are not a new 24-run simulation.

## Local commands

- `npm run test:core`
- `npm run test:repro`
- `npm run build:site`
- `DOPAGAKI_BUILD_DIR=dist-site npm run smoke` (Linux CI; PowerShell: `$env:DOPAGAKI_BUILD_DIR='dist-site'; npm run smoke`)
- `npm install && npx playwright install chromium && npm run test:browser` with `DOPAGAKI_BUILD_DIR=dist-site`.
- `node scripts/serve.mjs dist-site 4373` serves the built site locally.

## Public release policy

Stage JSON, generated previews and source code are now owner-approved for public publication. Never commit tokens, credentials, private user data, or environment secrets. The old private-only Cloudflare Access requirement is **not used** for public site deployment. GitHub Pages uses a short-lived GitHub Actions token and Pages OIDC; no Cloudflare API token is required.

Cloudflare Pages may be connected later for a shorter `.pages.dev` hostname, but **do not connect its production branch directly to `main` without an equivalent QA gate**, since independent Cloudflare builds can race ahead of the browser checks. Current official Moving Lab, STAGE FORGE and DOPAGAKI game deployments remain unchanged.

## Provenance and limitations

- `private/stages/`: frozen P62 actual B48 stage data.
- `private/source_p61/` + `private/generate_p62.mjs`: reproducible stage generation.
- `private/reference_only/`: immutable B48 physical reference from Moving Lab.
- `private/reports/P62_FULL_RUN_MATRIX.json`: archived P62 guided run outcomes.
- `web/inspector.html`: public 2D overhead preview.
- `scripts/build.mjs`: explicitly separate `private`, `public`, and `public-safe` outputs.
- `.github/workflows/private-stage-preview.yml`: renamed internally to P64 public QA-gated deployment (filename retained to preserve CI continuity).

The original P63 commit remains available in Git history. Publishing the site does not modify the original game or Moving Lab.


## P65 experimental 3D Drive Lab

`/drive3d/` adds a **separate** 3D WebGL2 preview. It loads the exact frozen P62 stage JSON and runs the reference-only B48 `compile` + `Runner` at `DT=1/240`, including B51-C moving collision. Basic steering, start selection, pause, reset and fixed ball-relative camera are provided. GPU-visible surfaces are simplified render meshes, not evidence of final asset quality. Human playtesting and full four-stage realtime FPS acceptance remain unverified. The existing `/web/` P64 2D inspector and all reference physics modules are preserved.

`verify-public` runs after successful Pages deployment and checks public HTTP 200 for home, build-info, 2D and 3D previews, plus 4 actual JSONs and that deployment build SHA matches the current `main` push. If it fails, do not claim live HTTP verification; inspect its logs before accepting the release.
