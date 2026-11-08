"""DOPAGAKI R73: local-only, owner-scoped research trial launcher.

Starts one own in-process stdlib HTTP server on a free loopback port,
verifies the archived original-240Hz game kit, then opens the browser.
No upload, third-party requests, installation, admin or persistent service.
Browser/manual game results are not HUMAN/ART certification.
"""
from __future__ import annotations

import hashlib
import json
import sys
import threading
import urllib.error
import urllib.request
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent
GAME_PATH = "/k4ct/?k4ct=on&stage=K4CT-TWO-REAL-B51-CHOICE"
REQUIRED = (
    "k4ct/index.html",
    "k4ct/drive3d.mjs",
    "k4ct/r72-one-click-human-trial.mjs",
    "reference_only/director/collision.js",
    "reference_only/director/game-fixtures.js",
    "reference_only/director/moving/moving-obstacles.mjs",
    "reference_only/director/physics.js",
    "reference_only/director/surface.js",
    "generated/K4CT_TWO_REAL_B51_NATIVE_CHOICE_PRIVATE.json",
)


def verify_files() -> dict:
    """Fail closed before opening a port or changing any local files."""
    manifest_path = ROOT / "R73_PACKAGE_MANIFEST.json"
    data = json.loads(manifest_path.read_text(encoding="utf-8"))
    assert data["nativeSourceGameBlob"] == "af076d67492a677d2235e4730aef8cdf4808e106"
    assert data["originalBlenderAuthorBlob"] == "096fffbc1627915eb0122224955bb02cfba6b3ae"
    assert data["trueOriginal240HzStage"] == "K4CT-TWO-REAL-B51-CHOICE"
    assert (data["originalB48"], data["originalB51"], data["newColliders"]) == (7, 28, 0)
    assert data["autoNetworkUpload"] is False
    assert data["launchTestedOnWindows"] is False
    assert data["serverBind"] == "127.0.0.1"
    for item in REQUIRED:
        full = ROOT / item
        assert full.is_file() and full.stat().st_size > 0, f"Missing actual local game module: {item}"
    for name, item in (
        ("launcherSHA256", "R73_DOPAGAKI_LOCAL_TRIAL.cmd"),
        ("UIAddonSHA256", "k4ct/r72-one-click-human-trial.mjs"),
    ):
        actual = hashlib.sha256((ROOT / item).read_bytes()).hexdigest()
        assert actual == data[name], f"Integrity check failed: {item}"
    # Manifest cannot attest to its own standalone launcher Python checksum;
    # that value is recorded in the build record, not asserted circularly.
    return data


class LocalOnlyHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def _request_is_allowed(self) -> bool:
        request_path = unquote(urlsplit(self.path).path)
        if request_path == "/":
            self.send_response(302)
            self.send_header("Location", GAME_PATH)
            self.end_headers()
            return False
        # A mere startswith('/k4ct/') is NOT enough: it would allow
        # /k4ct/../R73_PACKAGE_MANIFEST.json to expose the manifest.
        parts = request_path.strip("/").split("/")
        if (any(x in (".", "..", "") or "\\" in x for x in parts)
                or parts[0] not in ("k4ct", "reference_only", "generated")):
            self.send_error(404, "The local research server only exposes game assets")
            return False
        allowed_root = (ROOT / parts[0]).resolve()
        requested = (ROOT.joinpath(*parts)).resolve()
        if not requested.is_relative_to(allowed_root):
            self.send_error(404, "The local research server only exposes game assets")
            return False
        return True

    def handle(self):
        try:
            super().handle()
        except (BrokenPipeError, ConnectionResetError):
            # Browsers may cancel old requests during navigation. It is not
            # a source-physics or gameplay failure; suppress server traceback.
            pass

    def do_GET(self):  # noqa: N802
        if self._request_is_allowed():
            super().do_GET()

    def do_HEAD(self):  # noqa: N802
        if self._request_is_allowed():
            super().do_HEAD()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

    def log_message(self, fmt, *args):
        # Minimal local diagnostics; do not print gameplay results or private JSON.
        if args and str(args[1] if len(args) > 1 else "") in ("404", "500"):
            print("[R73 HTTP]", fmt % args, flush=True)


def main(argv: list[str]) -> int:
    try:
        verify_files()
    except (AssertionError, OSError, ValueError, KeyError) as ex:
        print(f"[R73 HOLD] Local kit integrity check failed: {ex}", flush=True)
        return 3
    print("[R73] Original 240Hz/B51 archived kit integrity: PASS; human trial NOT certified.", flush=True)
    if "--self-check" in argv:
        print("[R73 SELF-CHECK PASS] No server opened.", flush=True)
        return 0
    # A port of 0 asks Windows to pick an available port. Crucially, no stale
    # or unrelated service is reused, and no port/security setting is changed.
    try:
        server = ThreadingHTTPServer(("127.0.0.1", 0), LocalOnlyHandler)
    except OSError as ex:
        print(f"[R73 HOLD] Cannot bind loopback HTTP: {ex}", flush=True)
        return 4
    server.daemon_threads = True
    thread = threading.Thread(target=server.serve_forever, name="R73-local-http", daemon=True)
    try:
        thread.start()
        port = server.server_address[1]
        origin = f"http://127.0.0.1:{port}"
        # Internal first-party readiness: browser is opened only after the
        # actual game HTML can be read from this exact owned server.
        try:
            opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
            with opener.open(origin + GAME_PATH, timeout=3) as response:
                if response.status != 200 or b"<html" not in response.read(150000).lower():
                    raise ValueError("Unexpected local HTML response")
        except (urllib.error.URLError, OSError, ValueError) as ex:
            print(f"[R73 HOLD] HTTP readiness failed: {ex}", flush=True)
            return 5
        print("[R73] LOCAL ONLY:", origin + GAME_PATH, flush=True)
        print("[R73] Close this console / press Ctrl+C to stop the owned server.", flush=True)
        if "--check-http-only" in argv:
            print("[R73 HTTP SMOKE PASS] No browser opened.", flush=True)
            return 0
        try:
            opened = webbrowser.open_new_tab(origin + GAME_PATH)
            if not opened:
                print("[R73] Browser did not launch automatically. Paste the LOCAL URL above.", flush=True)
        except Exception as ex:
            print(f"[R73] Browser launch did not complete: {ex}; use LOCAL URL above.", flush=True)
        while thread.is_alive():
            thread.join(timeout=0.4)
        return 0
    except KeyboardInterrupt:
        print("\n[R73] Stopping own local server.", flush=True)
        return 0
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=2)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
