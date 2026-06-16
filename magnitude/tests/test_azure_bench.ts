import { Magnitude } from "../src/magnitude";

async function testAzureBenchmarks() {
  const magnitude = new Magnitude();
  console.log("🚀 Starting Azure LLM Orchestration Benchmark...");
  
  const result = await magnitude.benchmarkLLM();
  console.log(result);
  
  // Also run a regressive learning step using the latency as a parameter
  console.log("\n📊 Magnitude Statistics:");
  const stats = await magnitude.stats();
  console.log(stats);
}

testAzureBenchmarks().catch(console.error);
