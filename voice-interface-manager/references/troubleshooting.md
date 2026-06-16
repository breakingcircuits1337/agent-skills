# Troubleshooting SARAH Voice Interface

### 1. "arecord: command not found"
**Cause:** ALSA utilities not installed.
**Fix:** Run `sudo apt-get install alsa-utils`.

### 2. "❌ No audio response"
**Cause:** Gemini API key is invalid or quota exceeded.
**Check:** Verify `~/.gemini/api_key` and try a manual `curl` to the Gemini API.

### 3. "Permission denied for /dev/snd/..."
**Cause:** User is not in the `audio` group.
**Fix:** Run `sudo usermod -aG audio $USER` and log out/in.

### 4. "Recording is silent"
**Cause:** Wrong input device selected in `amixer`.
**Fix:** Run `alsamixer`, press F6 to select card, and F5 to check Capture levels. Ensure 'Capture' is enabled (shows 'CAPTUR' in red).

### 5. "UI window won't open"
**Cause:** Missing `python3-tk`.
**Fix:** Run `sudo apt-get install python3-tk`.
