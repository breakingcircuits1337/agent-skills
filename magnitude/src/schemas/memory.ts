export interface UserProfile {
  name: string | null;
  email: string | null;
  preferences: {
    communicationStyle?: "verbose" | "concise";
    technicalLevel?: "novice" | "expert";
    theme?: string;
  };
  history: {
    firstMet: number;
    interactionCount: number;
  };
}

export interface ProjectContext {
  currentProject: string | null;
  activeBranch: string | null;
  stack: string[];
  goals: string[];
}

export interface MemorySchema {
  identity: typeof import("../data/default_identity.json");
  user: UserProfile;
  context: ProjectContext;
}
