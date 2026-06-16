import { Magnitude } from "../src/magnitude";

async function testRoundtableSession() {
  const magnitude = new Magnitude();
  
  console.log("🚀 Testing Roundtable Session Management...");
  
  // 1. Run a new brainstorm
  const topic = "Integration of Proxmox VMs with Azure AI Vision";
  console.log("\n--- Starting Brainstorm ---");
  await magnitude.multiAgentBrainstorm(topic, ["infrastructure", "avatar"]);
  
  // 2. List roundtables
  console.log("\n--- Listing Sessions ---");
  const list = await magnitude.listRoundtables();
  console.log(list);
  
  // 3. Extract a session ID from the list and load it
  const sessionId = list.match(/session_\d+/)?.[0];
  if (sessionId) {
    console.log(`\n--- Loading Session: ${sessionId} ---`);
    const details = await magnitude.getRoundtable(sessionId);
    console.log(details.substring(0, 500) + "..."); // Show first 500 chars
  } else {
    console.log("❌ No session ID found in list.");
  }
}

testRoundtableSession().catch(console.error);
