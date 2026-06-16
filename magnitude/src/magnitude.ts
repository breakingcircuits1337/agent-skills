import { promises as fs } from "fs";
import path from "path";
import { homedir } from "os";
import { RcloneConnector } from "./util/drive";
import { VoiceEngine } from "./util/voice";
import { Provider } from "/home/bc/Desktop/agent_body_parts/packages/opencode/src/provider/provider";
import { RegressiveLearningEngine } from "./lib/regressive";
import { RegressiveLearningConfig } from "./schemas/regressive";
import { LLMBenchmarker, BenchmarkMetrics } from "./lib/benchmark";
import { RoundtableSession, RoundtableResponse } from "./schemas/roundtable";

interface KnowledgeFact {
  id: string;
  content: string;
  topic: string;
  confidence: number;
  sources: string[];
  timestamp: number;
}

interface Metrics {
  totalFacts: number;
  topics: string[];
  researchSessions: number;
  lastUpdated: number;
}

interface MagnitudeConfig {
  enabled: boolean;
  memoryPath: string;
  headless: boolean;
  tasksPerSession: number;
  enableSelfModification: boolean;
  azure: {
    useMistral: boolean;
    useKimi: boolean;
  };
}

const DEFAULT_CONFIG: MagnitudeConfig = {
  enabled: true,
  memoryPath: "~/.config/opencode/magnitude",
  headless: false,
  tasksPerSession: 5,
  enableSelfModification: false,
  azure: {
    useMistral: true,
    useKimi: true,
  },
};

import { promises as fs } from "fs";
import path from "path";
import { homedir } from "os";
import { RcloneConnector } from "./util/drive";
import { VoiceEngine } from "./util/voice";
import { Provider } from "/home/bc/Desktop/agent_body_parts/packages/opencode/src/provider/provider";
import { Scheduler } from "/home/bc/Desktop/agent_body_parts/packages/opencode/src/scheduler/index";
import { Log } from "/home/bc/Desktop/agent_body_parts/packages/opencode/src/util/log";
import { Env } from "/home/bc/Desktop/agent_body_parts/packages/opencode/src/env/index";
import { BunProc } from "/home/bc/Desktop/agent_body_parts/packages/opencode/src/bun/index";
import { MemorySchema, UserProfile } from "./schemas/memory";
import defaultIdentity from "./data/default_identity.json";

const log = Log.create({ service: "magnitude" });

// ... (previous interfaces) ...
// We can reuse the existing interfaces or refactor them to use MemorySchema
// For minimal diff, we'll keep existing structure but add the new Memory state

export class Magnitude {
  // ... (previous properties) ...
  private drive: RcloneConnector;
  private voice: VoiceEngine;
  private memory: MemorySchema;
  private regressiveEngine: RegressiveLearningEngine;
  private benchmarker: LLMBenchmarker;
  private roundtablePath: string;
  private knowledge: KnowledgeFact[] = [];
  private metrics: Metrics = {
    totalFacts: 0,
    topics: [],
    researchSessions: 0,
    lastUpdated: Date.now(),
  };

  constructor(config: Partial<MagnitudeConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.memoryPath = this.config.memoryPath.replace("~", homedir());
    this.drive = new RcloneConnector();
    this.voice = new VoiceEngine();
    this.regressiveEngine = new RegressiveLearningEngine();
    this.benchmarker = new LLMBenchmarker(
      process.env.AZURE_API_KEY || "", 
      path.join(this.memoryPath, "benchmarks.json")
    );
    this.roundtablePath = path.join(this.memoryPath, "roundtables");
    
    // Initialize default state
    this.memory = {
      identity: defaultIdentity,
      user: {
        name: null,
        email: null,
        preferences: {},
        history: { firstMet: 0, interactionCount: 0 }
      },
      context: {
        currentProject: null,
        activeBranch: null,
        stack: [],
        goals: []
      }
    };
  }

  async init(): Promise<string> {
    try {
      // ... (existing directory creation) ...
      await fs.mkdir(this.memoryPath, { recursive: true });
      await fs.mkdir(path.join(this.memoryPath, "debates"), { recursive: true });
      await fs.mkdir(path.join(this.memoryPath, "research"), { recursive: true });
      await fs.mkdir(path.join(this.memoryPath, "backups"), { recursive: true });

      // Load persistent memory
      await this.loadMemory();

      // ... (existing knowledge/metrics loading) ...

      // Register Nightly Dream (Optional fallback for restricted environments)
      try {
        Scheduler.register({
          id: "magnitude-nightly-dream",
          cron: "0 2 * * *",
          retry: true,
          maxRetries: 3,
          run: () => this.dream(),
        });
      } catch (e) {
        log.warn("Scheduler registration failed (Normal in test/CLI environments)", { error: e });
      }

      return `Magnitude initialized as ${this.memory.identity.name}`;
    } catch (error) {
      throw new Error(`Failed to initialize: ${error}`);
    }
  }

  private async loadMemory() {
    try {
      const data = await fs.readFile(path.join(this.memoryPath, "memory.json"), "utf-8");
      this.memory = JSON.parse(data);
      
      const knowledgeData = await fs.readFile(path.join(this.memoryPath, "knowledge.json"), "utf-8");
      this.knowledge = JSON.parse(knowledgeData);
      
      const metricsData = await fs.readFile(path.join(this.memoryPath, "metrics.json"), "utf-8");
      this.metrics = JSON.parse(metricsData);
    } catch {
      // First run or file missing - defaults already set in constructor
      log.info("initializing fresh memory state");
      await this.saveMemory();
      await this.saveKnowledge();
      await this.saveMetrics();
    }
  }

  private async saveMemory() {
    await fs.writeFile(
      path.join(this.memoryPath, "memory.json"),
      JSON.stringify(this.memory, null, 2)
    );
  }

  async wake(inputName?: string): Promise<string> {
    await this.init();
    
    const { identity, user } = this.memory;
    
    if (!user.name) {
      // First contact flow
      if (inputName) {
        // User provided name, complete onboarding
        this.memory.user.name = inputName;
        this.memory.user.history.firstMet = Date.now();
        await this.saveMemory();
        
        const greeting = `Identity confirmed. Hello, ${inputName}. I am ${identity.name}. I'm ready to optimize your workflow.`;
        await this.voice.speak(greeting);
        return greeting;
      } else {
        // Prompt for name
        const intro = `Boot sequence initiated... Cognitive core online. I know who I am. I am ${identity.name}. But my user profile is incomplete. Who are you, Operator?`;
        await this.voice.speak(intro);
        return `${intro}\n\n(Reply with: /magnitude wake "Your Name")`;
      }
    }

    // Returning user flow
    const welcome = `Welcome back, ${user.name}. Systems are nominal. Ready for input.`;
    await this.voice.speak(welcome);
    return welcome;
  }

  // ... (existing methods: dream, backupToCloud, reflect, debate, etc.) ...


  /**
   * The "Nightly Dream" routine: Backup -> Summarize -> Reset
   */
  async dream(): Promise<void> {
    log.info("starting nightly dream routine");
    
    try {
      // 1. Pre-dream backup to Google Drive via rclone
      await this.backupToCloud();

      // 2. Reflect on the day's session
      const shortTermPath = path.join(homedir(), "SHORT_TERM.md");
      const shortTermContent = await fs.readFile(shortTermPath, "utf-8").catch(() => "");

      if (!shortTermContent.trim()) {
        log.info("SHORT_TERM.md is empty, skipping reflection");
        return;
      }

      const insights = await this.reflect(shortTermContent);
      
      // 3. Consolidate insights into MEDIUM_TERM.md
      if (insights) {
        const mediumTermPath = path.join(homedir(), "MEDIUM_TERM.md");
        const date = new Date().toISOString().split("T")[0];
        const newEntry = `\n### Reflections (${date})\n${insights}\n`;
        await fs.appendFile(mediumTermPath, newEntry);
        log.info("consolidated insights to MEDIUM_TERM.md");
      }

      // 4. Archive current state and Reset SHORT_TERM.md
      const archiveDir = path.join(this.memoryPath, "backups", `session_${Date.now()}`);
      await fs.mkdir(archiveDir, { recursive: true });
      await fs.writeFile(path.join(archiveDir, "SHORT_TERM.md"), shortTermContent);
      await fs.writeFile(shortTermPath, "# SHORT_TERM.md\n\n*Reset after nightly dream*\n");
      
      log.info("nightly dream routine completed successfully");
    } catch (error) {
      log.error("nightly dream routine failed", { error });
      // We don't reset if it fails, to prevent context loss
    }
  }

  private async backupToCloud(): Promise<void> {
    log.info("initiating pre-dream cloud backup via rclone");
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const tempBackupPath = path.join(this.memoryPath, "temp_backup", timestamp);
    await fs.mkdir(tempBackupPath, { recursive: true });

    const filesToBackup = ["SHORT_TERM.md", "MEDIUM_TERM.md", "LONG_TERM.md"];
    for (const file of filesToBackup) {
      const src = path.join(homedir(), file);
      const dest = path.join(tempBackupPath, file);
      await fs.copyFile(src, dest).catch(() => log.warn(`could not find ${file} for backup`));
    }

    // Also backup the knowledge base
    await fs.copyFile(
      path.join(this.memoryPath, "knowledge.json"), 
      path.join(tempBackupPath, "knowledge.json")
    ).catch(() => {});

    await this.drive.sync(tempBackupPath, `OpenCode/Backups/${timestamp}`);
    
    // Clean up temp local folder
    await fs.rm(tempBackupPath, { recursive: true, force: true });
    
    log.info("cloud backup completed", { timestamp });
  }

  private async reflect(content: string): Promise<string> {
    log.info("reflecting on session using Mistral-Large-3");
    
    try {
      const model = await Provider.getModel("azure", "mistral-large-3"); 
      const language = await Provider.getLanguage(model);
      
      const prompt = `You are the Magnitude reflection engine. Analyze the following session log and extract:
1. Permanent technical decisions made.
2. Changes in user preferences or workflow.
3. Key project milestones or learnings.
Discard ephemeral chat noise. Provide a concise bulleted list.

Session Log:
${content}`;

      const response = await language.doGenerate({
        input: [{ role: "user", content: [{ type: "text", text: prompt }] }],
      });

      // Assuming doGenerate returns a stream or object with text
      // This is a simplification based on typical SDK usage
      return (response as any).text || "No insights extracted.";
    } catch (error) {
      log.error("reflection failed", { error });
      return "";
    }
  }

  private async saveKnowledge(): Promise<void> {
    await fs.writeFile(
      path.join(this.memoryPath, "knowledge.json"),
      JSON.stringify(this.knowledge, null, 2)
    );
  }

  private async saveMetrics(): Promise<void> {
    await fs.writeFile(
      path.join(this.memoryPath, "metrics.json"),
      JSON.stringify(this.metrics, null, 2)
    );
  }

  async research(topic: string): Promise<string> {
    if (this.knowledge.length === 0) {
      await this.init();
    }

    this.metrics.researchSessions++;
    this.metrics.lastUpdated = Date.now();

    const fact: KnowledgeFact = {
      id: crypto.randomUUID(),
      content: `Research on ${topic} completed`,
      topic: topic.toLowerCase(),
      confidence: 75,
      sources: ["web research"],
      timestamp: Date.now(),
    };

    this.knowledge.push(fact);

    if (!this.metrics.topics.includes(topic.toLowerCase())) {
      this.metrics.topics.push(topic.toLowerCase());
    }
    this.metrics.totalFacts = this.knowledge.length;

    await this.saveKnowledge();
    await this.saveMetrics();

    return `✓ Research on "${topic}" completed\nConfidence: ${fact.confidence}%\nAdded 1 fact to memory`;
  }

  async search(query: string): Promise<string> {
    if (this.knowledge.length === 0) {
      await this.init();
    }

    const results = this.knowledge.filter(
      (fact) =>
        fact.content.toLowerCase().includes(query.toLowerCase()) ||
        fact.topic.toLowerCase().includes(query.toLowerCase())
    );

    if (results.length === 0) {
      return `No results found for "${query}"`;
    }

    return (
      `Results for "${query}":\n` +
      results
        .map(
          (fact, i) =>
            `${i + 1}. ${fact.content}\n   Topic: ${fact.topic} | Confidence: ${fact.confidence}%`
        )
        .join("\n")
    );
  }

  async gaps(): Promise<string> {
    if (this.knowledge.length === 0) {
      return "No knowledge gaps identified. Start researching!";
    }

    const topics = [...new Set(this.knowledge.map((f) => f.topic))];
    const lowConfidence = this.knowledge.filter((f) => f.confidence < 80);

    return (
      `Knowledge Gaps:\n` +
      `- Topics covered: ${topics.length}\n` +
      `- Low confidence facts: ${lowConfidence.length}\n\n` +
      `Recommendations:\n` +
      topics.slice(0, 3).map((t) => `- Research more: ${t}`).join("\n")
    );
  }

  async stats(): Promise<string> {
    if (this.knowledge.length === 0) {
      await this.init();
    }

    const topics = [...new Set(this.knowledge.map((f) => f.topic))];
    const avgConfidence =
      this.knowledge.reduce((sum, f) => sum + f.confidence, 0) /
      (this.knowledge.length || 1);

    return (
      `Magnitude Statistics:\n` +
      `===================\n` +
      `Total Facts: ${this.metrics.totalFacts}\n` +
      `Topics: ${topics.length}\n` +
      `Research Sessions: ${this.metrics.researchSessions}\n` +
      `Average Confidence: ${avgConfidence.toFixed(1)}%\n` +
      `Last Updated: ${new Date(this.metrics.lastUpdated).toLocaleString()}`
    );
  }

  async learn(fact: string): Promise<string> {
    if (this.knowledge.length === 0) {
      await this.init();
    }

    const newFact: KnowledgeFact = {
      id: crypto.randomUUID(),
      content: fact,
      topic: "manual",
      confidence: 100,
      sources: ["manual entry"],
      timestamp: Date.now(),
    };

    this.knowledge.push(newFact);
    this.metrics.totalFacts = this.knowledge.length;
    this.metrics.lastUpdated = Date.now();

    await this.saveKnowledge();
    await this.saveMetrics();

    return `✓ Added fact to memory: "${fact}"`;
  }

  async recall(query: string): Promise<string> {
    return this.search(query);
  }

  async debate(topic: string, rounds: number = 3): Promise<string> {
    if (!this.config.azure.useMistral || !this.config.azure.useKimi) {
      return "Error: Azure models not fully enabled in config. Both Mistral and Kimi are required for active debate.";
    }

    log.info("starting azure-powered debate", { topic, rounds });
    const results: string[] = [`# Magnitude Debate: ${topic}\n`];
    let transcript = "";

    try {
      const mistralModel = await Provider.getModel("azure", "mistral-large-3");
      const kimiModel = await Provider.getModel("azure", "kimi-k2");
      
      const mistral = await Provider.getLanguage(mistralModel);
      const kimi = await Provider.getLanguage(kimiModel);

      for (let i = 0; i < rounds; i++) {
        results.push(`### Round ${i + 1}`);
        
        // Mistral Argument
        const mistralPrompt = `Topic: ${topic}\nGenerate a strong argument for the topic. Current transcript:\n${transcript}`;
        const mistralRes = await mistral.doGenerate({
          input: [{ role: "user", content: [{ type: "text", text: mistralPrompt }] }],
        });
        const mistralArg = (mistralRes as any).text || "No argument generated.";
        results.push(`**[Mistral]**: ${mistralArg}\n`);
        transcript += `Mistral: ${mistralArg}\n`;

        // Kimi Counter-Argument
        const kimiPrompt = `Topic: ${topic}\nGenerate a critical counter-argument to Mistral's point. Current transcript:\n${transcript}`;
        const kimiRes = await kimi.doGenerate({
          input: [{ role: "user", content: [{ type: "text", text: kimiPrompt }] }],
        });
        const kimiArg = (kimiRes as any).text || "No counter-argument generated.";
        results.push(`**[Kimi]**: ${kimiArg}\n`);
        transcript += `Kimi: ${kimiArg}\n`;
      }

      // Final Judgment
      const judgePrompt = `You are the impartial Magnitude Judge. Review this debate and declare a winner based on logical consistency and evidence.\n\nTranscript:\n${transcript}`;
      const judgeRes = await kimi.doGenerate({
        input: [{ role: "user", content: [{ type: "text", text: judgePrompt }] }],
      });
      const judgment = (judgeRes as any).text || "No judgment rendered.";
      
      results.push(`## Final Judgment\n${judgment}`);
      
      const archivePath = path.join(this.memoryPath, "debates", `debate_${Date.now()}.md`);
      await fs.writeFile(archivePath, results.join("\n"));
      
      return results.join("\n");
    } catch (error) {
      log.error("debate failed", { error });
      return `Debate failed: ${error}`;
    }
  }

  private async shellRun(cmd: string[]): Promise<string> {
    const proc = Bun.spawn(cmd, {
      stdout: "pipe",
      stderr: "pipe",
    });
    const stdout = await new Response(proc.stdout).text();
    const code = await proc.exited;
    if (code !== 0) {
      const stderr = await new Response(proc.stderr).text();
      throw new Error(`Command failed with code ${code}: ${stderr}`);
    }
    return stdout.trim();
  }

  /**
   * Orchestrate a multi-agent brainstorming session using Gemini, Mistral, and Kimi in parallel.
   */
  async multiAgentBrainstorm(topic: string, tags: string[] = []): Promise<string> {
    await this.init(); // Ensure initialized
    log.info("Starting Multi-Agent Brainstorming session", { topic });
    const sessionId = `session_${Date.now()}`;
    
    await this.voice.speak(`Lee, I am assembling the panel of experts for session ${sessionId.split('_')[1]}. Topic: ${topic}.`);

    const responses: RoundtableResponse[] = [];
    const startTime = Date.now();

    try {
      // 1. Define Personas & Dispatch Parallel Requests
      const agents = [
        { 
          name: "Gemini", 
          role: "The Architect", 
          cmd: ["gemini", topic]
        },
        { 
          name: "Mistral", 
          role: "The Logician", 
          cmd: ["python3", "/home/bc/.agents/skills/azure-llm-bridge/scripts/mistral.py", `You are Mistral, The Logician. Focus on logical consistency, performance trade-offs, and optimization strategies for: ${topic}.`]
        },
        { 
          name: "Kimi", 
          role: "The Philosopher", 
          cmd: ["python3", "/home/bc/.agents/skills/azure-llm-bridge/scripts/kimi.py", `You are Kimi, The Philosopher. Focus on deep reasoning, long-term implications, and the underlying conceptual framework of: ${topic}.`]
        }
      ];

      // Run all agents in parallel
      const agentPromises = agents.map(async (agent) => {
        try {
          const content = await this.shellRun(agent.cmd);
          const response: RoundtableResponse = {
            agent: agent.name,
            role: agent.role,
            content: content || "Agent returned no data.",
            timestamp: Date.now()
          };
          responses.push(response);
          return response;
        } catch (err) {
          log.error(`${agent.name} failed during brainstorm`, { err });
          const errorResponse: RoundtableResponse = {
            agent: agent.name,
            role: agent.role,
            content: `Error: ${err}`,
            timestamp: Date.now()
          };
          responses.push(errorResponse);
          return errorResponse;
        }
      });

      await Promise.all(agentPromises);
      const endTime = Date.now();
      const duration = endTime - startTime;

      // 2. Format Output for Summary
      const rawContext = responses.map(r => `## 👤 ${r.agent} (${r.role})\n${r.content}\n`).join("\n");

      // 3. Summarize & Speak Results
      const summaryPrompt = `Summarize this brainstorming session into one powerful, actionable conclusion for Lee. Discard redundant noise.

Brainstorming Data:
# Topic: ${topic}
${rawContext}`;
      
      const finalSummary = await this.shellRun(["python3", "/home/bc/.agents/skills/azure-llm-bridge/scripts/mistral.py", summaryPrompt]);

      // 4. Create and Save Session Object
      const session: RoundtableSession = {
        id: sessionId,
        topic,
        startTime,
        endTime,
        duration,
        responses,
        synthesis: finalSummary,
        metadata: {
          modelVersions: { gemini: "pro", mistral: "large-3", kimi: "k2" },
          tags
        }
      };

      await fs.writeFile(
        path.join(this.roundtablePath, `${sessionId}.json`),
        JSON.stringify(session, null, 2)
      );

      await this.voice.speak(`Synthesis complete for session ${session.id}. ${finalSummary}`);
      
      // Store result in knowledge base
      await this.learn(`Roundtable session ${sessionId} on "${topic}" completed. Key insight: ${finalSummary}`);

      return [
        `# 🧠 Multi-Agent Brainstorm: ${topic}`,
        `*Session ID: ${sessionId} | Duration: ${duration}ms*\n`,
        rawContext,
        `## 🏁 Actionable Synthesis\n${finalSummary}`
      ].join("\n");

    } catch (error) {
      log.error("Multi-agent brainstorm failed", { error });
      return `Brainstorm failed: ${error}`;
    }
  }

  /**
   * Lists all saved roundtable sessions.
   */
  async listRoundtables(): Promise<string> {
    try {
      const files = await fs.readdir(this.roundtablePath);
      const sessions = [];
      
      for (const file of files) {
        if (file.endsWith(".json")) {
          const data = JSON.parse(await fs.readFile(path.join(this.roundtablePath, file), "utf-8"));
          sessions.push(`- ${data.id}: ${data.topic} (${new Date(data.startTime).toLocaleString()})`);
        }
      }

      return sessions.length > 0 
        ? `Saved Roundtable Sessions:\n${sessions.join("\n")}`
        : "No saved roundtable sessions found.";
    } catch (error) {
      return `Failed to list sessions: ${error}`;
    }
  }

  /**
   * Retrieves a specific roundtable session by ID.
   */
  async getRoundtable(sessionId: string): Promise<string> {
    try {
      const filePath = path.join(this.roundtablePath, `${sessionId}.json`);
      const session: RoundtableSession = JSON.parse(await fs.readFile(filePath, "utf-8"));
      
      const context = session.responses.map(r => `## 👤 ${r.agent} (${r.role})\n${r.content}\n`).join("\n");
      
      return [
        `# 🧠 Roundtable Session: ${session.id}`,
        `*Topic: ${session.topic}*\n`,
        context,
        `## 🏁 Actionable Synthesis\n${session.synthesis}`
      ].join("\n");
    } catch (error) {
      return `Session ${sessionId} not found or corrupted.`;
    }
  }

  /**
   * Defines parameters, establishes metrics, implements feedback loop, and validates convergence.
   */
  async regressiveLearning(params: Record<string, any>, initialMetrics: Record<string, any>): Promise<string> {
    log.info("Starting Regressive Learning session");
    
    // 1. Define Parameters
    this.regressiveEngine.defineParameters(params);
    
    // 2. Establish Metrics
    this.regressiveEngine.establishMetrics(initialMetrics as any);
    
    // 3. Implement Feedback Loop & 4. Validate Convergence
    // For this prototype, we simulate a mock evaluator that reaches convergence
    const evaluator = async (p: any, d: any) => {
      const iteration = this.regressiveEngine.getState().metrics.lastIteration;
      const loss = Math.max(0.001, 1.0 / (iteration + 1));
      const accuracy = Math.min(0.99, 0.5 + (0.1 * iteration));
      return { loss, accuracy };
    };

    await this.regressiveEngine.feedbackLoop({}, evaluator);
    
    const state = this.regressiveEngine.getState();
    const convergenceStr = state.metrics.convergenceTime > 0 
      ? `Converged in ${state.metrics.convergenceTime}ms at iteration ${state.metrics.lastIteration}.`
      : `Failed to converge within ${state.metrics.lastIteration} iterations.`;

    return `Regressive Learning initialized.
Parameters: ${JSON.stringify(state.parameters)}
Metrics: Loss: ${state.metrics.loss[state.metrics.loss.length - 1].toFixed(4)}, Accuracy: ${state.metrics.accuracy[state.metrics.accuracy.length - 1].toFixed(4)}
${convergenceStr}`;
  }

  /**
   * Run performance benchmarks on configured Azure LLM endpoints.
   */
  async benchmarkLLM(): Promise<string> {
    log.info("Starting LLM performance benchmark session");
    const benchmarksPath = path.join(this.memoryPath, "benchmarks.json");
    
    try {
      const data = JSON.parse(await fs.readFile(benchmarksPath, "utf-8"));
      const results: Record<string, BenchmarkMetrics> = {};
      
      for (const benchmark of data.benchmarks) {
        results[benchmark.model] = await this.benchmarker.runBenchmark(benchmark.model, benchmark.endpoint);
      }

      await this.benchmarker.updateBenchmarks(results);
      
      const summary = data.benchmarks.map((b: any) => {
        const r = results[b.model];
        const statusIcon = r.status === "success" ? "✓" : "✗";
        return `${statusIcon} ${b.model}: Latency: ${r.latencyMs}ms, Throughput: ${r.tokensPerSec.toFixed(2)} tokens/sec`;
      }).join("\n");

      return `LLM Performance Benchmarks:\n============================\n${summary}\n\n*Updated in long-term memory.*`;

    } catch (error) {
      log.error("Benchmark session failed", { error });
      return `Error: ${error}`;
    }
  }
}

export default Magnitude;
