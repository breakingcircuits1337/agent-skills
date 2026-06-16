import { RegressiveLearningEngine } from "../src/lib/regressive";

async function testRegressiveEngine() {
  const engine = new RegressiveLearningEngine({ epsilon: 0.1, maxIterations: 10 });
  
  // 1. Define Parameters
  engine.defineParameters({ alpha: 0.05, baseWeight: 1.0 });
  
  // 2. Establish Metrics
  engine.establishMetrics({ loss: [1.0], accuracy: [0.0] });
  
  // 3. Implement Feedback Loop & 4. Validate Convergence
  const evaluator = async (params: any, data: any) => {
    const lastLoss = engine.getState().metrics.loss.slice(-1)[0];
    return {
      loss: lastLoss * 0.5, // Simulate geometric convergence
      accuracy: 0.5 + (0.05 * engine.getState().metrics.lastIteration)
    };
  };

  console.log("Starting Regressive Learning feedback loop...");
  await engine.feedbackLoop({}, evaluator);
  
  const state = engine.getState();
  console.log("Final State:", JSON.stringify(state, null, 2));
  
  if (state.metrics.convergenceTime > 0) {
    console.log(`✓ Convergence validated in ${state.metrics.convergenceTime}ms`);
  } else {
    console.log("✗ Failed to converge");
  }
}

testRegressiveEngine().catch(console.error);
