import { Magnitude } from "../src/magnitude";

async function testRegressiveLearning() {
  const magnitude = new Magnitude();
  const result = await magnitude.regressiveLearning(
    { alpha: 0.1, weight: 0.5 },
    { loss: [1.0], accuracy: [0.1] }
  );
  console.log(result);
}

testRegressiveLearning();
