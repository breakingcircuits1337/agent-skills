import subprocess
import sys
import os
import argparse

def set_volume(level):
    """Set system volume using amixer."""
    try:
        # Try Master channel first
        subprocess.run(["amixer", "set", "Master", f"{level}%"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print(f"✅ Volume set to {level}%")
    except Exception as e:
        print(f"❌ Failed to set volume: {e}")

def normalize_audio():
    """Reset volume to a standard 70% level."""
    set_volume(70)

def remote_trigger(command, text=None):
    """Trigger voice scripts remotely."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    if command == "listen":
        script_path = os.path.join(script_dir, "voice-input.sh")
        print(f"🎙️ Triggering {script_path}...")
        subprocess.Popen(["bash", script_path])
    elif command == "speak" and text:
        script_path = os.path.join(script_dir, "speak.sh")
        print(f"💬 Triggering {script_path} with: {text}")
        subprocess.Popen(["bash", script_path, text])
    else:
        print("❌ Invalid remote command")

def main():
    parser = argparse.ArgumentParser(description="SARAH Audio Control & Remote")
    parser.add_argument("--volume", type=int, help="Set volume level (0-100)")
    parser.add_argument("--normalize", action="store_true", help="Normalize volume to 70%")
    parser.add_argument("--trigger", choices=["listen", "speak"], help="Trigger a voice action")
    parser.add_argument("--text", help="Text to speak for 'speak' trigger")
    
    args = parser.parse_args()
    
    if args.normalize:
        normalize_audio()
    elif args.volume is not None:
        set_volume(args.volume)
        
    if args.trigger:
        remote_trigger(args.trigger, args.text)

if __name__ == "__main__":
    main()
