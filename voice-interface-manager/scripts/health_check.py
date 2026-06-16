import sys
import subprocess
import os
from pathlib import Path

def check_command(cmd):
    try:
        subprocess.run(["which", cmd], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except subprocess.CalledProcessError:
        return False

def check_file(path):
    return Path(path).expanduser().exists()

def check_python_lib(lib):
    try:
        __import__(lib)
        return True
    except ImportError:
        return False

def main():
    print("🔍 SARAH Voice Interface Health Check
")
    
    checks = {
        "CLI Tools": {
            "arecord (Recording)": check_command("arecord"),
            "aplay (Playback)": check_command("aplay"),
            "jq (JSON Parsing)": check_command("jq"),
            "curl (Web Requests)": check_command("curl"),
        },
        "Configuration": {
            "Gemini API Key (~/.gemini/api_key)": check_file("~/.gemini/api_key"),
            "Interface Dir (~/.voice-interface)": check_file("~/.voice-interface"),
        },
        "Python Libraries": {
            "tkinter (UI)": check_python_lib("tkinter"),
            "pyaudio (Advanced Audio)": check_python_lib("pyaudio"),
        }
    }
    
    all_passed = True
    for category, items in checks.items():
        print(f"[{category}]")
        for name, passed in items.items():
            status = "✅ PASS" if passed else "❌ FAIL"
            print(f"  {name:40} {status}")
            if not passed:
                all_passed = False
        print()
        
    if all_passed:
        print("🚀 System is ready for Voice Interface operations.")
    else:
        print("⚠️ Some checks failed. Please resolve them before running SARAH.")
        sys.exit(1)

if __name__ == "__main__":
    main()
