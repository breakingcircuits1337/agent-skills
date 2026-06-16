import { Env } from "/home/bc/Desktop/agent_body_parts/packages/opencode/src/env/index";
import { Log } from "/home/bc/Desktop/agent_body_parts/packages/opencode/src/util/log";
import { BunProc } from "/home/bc/Desktop/agent_body_parts/packages/opencode/src/bun/index";

const log = Log.create({ service: "magnitude:rclone" });

export class RcloneConnector {
  /**
   * Syncs a local path to a Google Drive folder using rclone.
   * Assumes an rclone remote named 'opencode' is configured, 
   * or config is provided via env vars.
   */
  async sync(localPath: string, remoteFolder: string = "OpenCode/Backups"): Promise<void> {
    const email = Env.get("OPENCODE_BACKUP_EMAIL");
    if (!email) {
      throw new Error("OPENCODE_BACKUP_EMAIL not set. Backup aborted.");
    }

    log.info("starting cloud sync via rclone", { localPath, remoteFolder, email });

    try {
      // Use 'rclone copy' to upload new backups without deleting old ones
      const proc = await BunProc.run([
        "rclone",
        "copy",
        localPath,
        `opencode:${remoteFolder}`,
        "--drive-use-trash=false",
        "--quiet"
      ]);

      if (proc.exitCode !== 0) {
        throw new Error(`rclone failed with exit code ${proc.exitCode}: ${proc.stderr}`);
      }

      log.info("cloud sync completed successfully");
    } catch (error) {
      log.error("rclone sync failed", { error });
      throw error;
    }
  }
}