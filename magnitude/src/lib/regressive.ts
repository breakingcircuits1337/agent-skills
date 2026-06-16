import { RegressiveLearningConfig, RegressiveLearningMetrics, RegressiveLearningState } from "../schemas/regressive";

export class RegressiveLearningEngine {
  private config: RegressiveLearningConfig;
  private state: RegressiveLearningState;

  constructor(config: Partial<RegressiveLearningConfig> = {}) {
    this.config = {
      alpha: 0.01,
      epsilon: 1e-6,
      maxIterations: 1000,
      ...config
    };
    
    this.state = {
      parameters: {},
      metrics: {
        loss: [],
        accuracy: [],
        convergenceTime: 0,
        lastIteration: 0
      },
      history: []
    };
  }

  /**
   * Defines parameters for the learning task.
   */
  defineParameters(params: Record<string, any>): void {
    this.state.parameters = { ...this.state.parameters, ...params };
  }

  /**
   * Establishes initial metrics for the learning task.
   */
  establishMetrics(initialMetrics: Partial<RegressiveLearningMetrics>): void {
    this.state.metrics = { ...this.state.metrics, ...initialMetrics };
  }

  /**
   * Implements the feedback loop logic.
   * This is a generic implementation that simulates a regressive step.
   */
  async feedbackLoop(
    data: any, 
    evaluator: (params: any, data: any) => Promise<{ loss: number, accuracy: number }>
  ): Promise<void> {
    const startTime = Date.now();
    
    for (let i = 0; i < this.config.maxIterations; i++) {
      const { loss, accuracy } = await evaluator(this.state.parameters, data);
      
      this.state.metrics.loss.push(loss);
      this.state.metrics.accuracy.push(accuracy);
      this.state.metrics.lastIteration = i;
      
      this.state.history.push({
        timestamp: Date.now(),
        parameters: { ...this.state.parameters },
        loss
      });

      if (this.validateConvergence(loss)) {
        this.state.metrics.convergenceTime = Math.max(1, Date.now() - startTime);
        return; // Exit loop on convergence
      }
    }
  }

  /**
   * Validates if the learning has converged based on loss and epsilon.
   */
  validateConvergence(currentLoss: number): boolean {
    const history = this.state.metrics.loss;
    if (history.length < 2) return false;
    
    const prevLoss = history[history.length - 2];
    const diff = Math.abs(currentLoss - prevLoss);
    
    return diff < this.config.epsilon;
  }

  getState(): RegressiveLearningState {
    return this.state;
  }
}
