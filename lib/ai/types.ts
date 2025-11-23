export type AiSourceType = 'workspace' | 'team' | 'project' | 'drive_folder' | 'drive_file';

export interface WorkspaceSummary {
   id: string;
   name: string;
   slug: string;
   description: string | null;
}

export interface AiAgentProfile {
   id: string;
   name: string;
   description: string | null;
   prompt: string;
   defaultSources: string[];
}

export interface AiSourceOption {
   id: string;
   type: AiSourceType;
   name: string;
   parentId?: string | null;
   metadata?: Record<string, unknown> | null;
}

export interface AiPanelData {
   workspace: WorkspaceSummary;
   agents: AiAgentProfile[];
   sources: {
      workspace: AiSourceOption;
      teams: AiSourceOption[];
      projects: AiSourceOption[];
      driveFolders: AiSourceOption[];
      driveFiles: AiSourceOption[];
   };
}
