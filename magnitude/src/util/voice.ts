import { Log } from "/home/bc/Desktop/agent_body_parts/packages/opencode/src/util/log";
import { BunProc } from "/home/bc/Desktop/agent_body_parts/packages/opencode/src/bun/index";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

const log = Log.create({ service: "magnitude:voice" });

export class VoiceEngine {
  private enabled: boolean = true;

  async speak(text: string): Promise<void> {
    if (!this.enabled) return;

    log.info("speaking", { text });
    
    try {
      // Use the new high-fidelity Azure neural voice script
      const scriptPath = "/home/bc/Desktop/agent_body_parts/azure-speak.sh";
      
      // Ensure the script is executable
      await Bun.spawn(["chmod", "+x", scriptPath]).exited;
      
      // Run the script with the provided text
      await Bun.spawn(["bash", scriptPath, text]).exited;
      
    } catch (error) {
      log.error("Azure TTS failed", { error });
    }
  }
}
