export interface RegressiveLearningConfig {
  alpha: number; // Learning rate
  epsilon: number; // Tolerance for convergence
  maxIterations: number;
}

export interface RegressiveLearningMetrics {
  loss: number[];
  accuracy: number[];
  convergenceTime: number;
  lastIteration: number;
}

export interface RegressiveLearningState {
  parameters: Record<string, any>;
  metrics: RegressiveLearningMetrics;
  history: Array<{
    timestamp: number;
    parameters: Record<string, any>;
    loss: number;
  }>;
}
