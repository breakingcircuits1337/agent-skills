import { Magnitude } from "../src/magnitude";

async function runBrainstorm() {
  const magnitude = new Magnitude();
  // Get topic from command line arguments, or use default
  const topic = process.argv.slice(2).join(" ") || "3D Live Video Avatar Framework using Proxmox and Azure";
  
  console.log(`🚀 Dispatching Multi-Agent Brainstorm: ${topic}...`);
  
  const result = await magnitude.multiAgentBrainstorm(topic);
  console.log(result);
}

runBrainstorm().catch(console.error);
