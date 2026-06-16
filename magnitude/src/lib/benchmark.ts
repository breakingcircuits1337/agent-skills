import { Log } from "/home/bc/Desktop/agent_body_parts/packages/opencode/src/util/log";
import { BunProc } from "/home/bc/Desktop/agent_body_parts/packages/opencode/src/bun/index";
import { promises as fs } from "fs";
import path from "path";

const log = Log.create({ service: "magnitude:benchmark" });

export interface BenchmarkMetrics {
  latencyMs: number;
  tokensPerSec: number;
  status: "success" | "failure";
}

export class LLMBenchmarker {
  private azureKey: string;
  private benchmarksPath: string;

  constructor(azureKey: string, benchmarksPath: string) {
    this.azureKey = azureKey;
    this.benchmarksPath = benchmarksPath;
  }

  async runBenchmark(modelName: string, endpoint: string): Promise<BenchmarkMetrics> {
    const startTime = Date.now();
    log.info(`Benchmarking ${modelName}...`);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": this.azureKey
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Say 'PONG' in exactly one word." }],
          max_tokens: 10
        })
      });

      const endTime = Date.now();
      const latencyMs = endTime - startTime;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      const text = data.choices[0].message.content || "";
      const tokens = text.length / 4; // Rough estimate: 4 chars per token
      const tokensPerSec = tokens / (latencyMs / 1000);

      log.info(`${modelName} benchmark completed: ${latencyMs}ms, ${tokensPerSec.toFixed(2)} tokens/sec`);
      
      return { latencyMs, tokensPerSec, status: "success" };

    } catch (error) {
      log.error(`${modelName} benchmark failed`, { error });
      return { latencyMs: 0, tokensPerSec: 0, status: "failure" };
    }
  }

  async updateBenchmarks(results: Record<string, BenchmarkMetrics>) {
    try {
      const data = JSON.parse(await fs.readFile(this.benchmarksPath, "utf-8"));
      
      for (const benchmark of data.benchmarks) {
        const result = results[benchmark.model];
        if (result && result.status === "success") {
          benchmark.metrics.successfulRequests++;
          benchmark.metrics.avgLatencyMs = 
            (benchmark.metrics.avgLatencyMs * (benchmark.metrics.successfulRequests - 1) + result.latencyMs) 
            / benchmark.metrics.successfulRequests;
          benchmark.metrics.avgTokensPerSec = 
            (benchmark.metrics.avgTokensPerSec * (benchmark.metrics.successfulRequests - 1) + result.tokensPerSec) 
            / benchmark.metrics.successfulRequests;
        } else if (result && result.status === "failure") {
          benchmark.metrics.failedRequests++;
        }
      }

      data.lastUpdated = Date.now();
      await fs.writeFile(this.benchmarksPath, JSON.stringify(data, null, 2));
    } catch (error) {
      log.error("Failed to update benchmarks.json", { error });
    }
  }
}
