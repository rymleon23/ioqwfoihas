import { PostgrestError } from '@supabase/supabase-js';
import { getGraphqlSupabaseAdmin } from '@/lib/supabase/admin-client';
import type { AiAgentProfile, AiPanelData, AiSourceOption, WorkspaceSummary } from '@/lib/ai/types';

interface AiAgentRow {
   id: string;
   workspace_id: string;
   name: string;
   description: string | null;
   prompt: string;
   default_sources: string[] | null;
}

interface TeamRow {
   id: string;
   workspace_id: string;
   name: string;
   key: string | null;
   color: string | null;
   icon: string | null;
}

interface ProjectRow {
   id: string;
   workspace_id: string;
   team_id: string | null;
   name: string;
   status: string | null;
   health: string | null;
   description: string | null;
}

interface DriveFolderRow {
   id: string;
   workspace_id: string;
   external_id: string | null;
   name: string;
   parent_id: string | null;
   path: string | null;
}

interface DriveFileRow {
   id: string;
   workspace_id: string;
   folder_id: string | null;
   external_id: string | null;
   name: string;
   mime_type: string | null;
   size: number | null;
   version: string | null;
}

function throwIfError(error: PostgrestError | null, context: string): asserts error is null {
   if (error) {
      throw new Error(`${context}: ${error.message}`);
   }
}

function createWorkspaceSource(workspace: WorkspaceSummary): AiSourceOption {
   return {
      id: workspace.id,
      type: 'workspace',
      name: workspace.name,
   };
}

function mapAgentRow(row: AiAgentRow): AiAgentProfile {
   return {
      id: row.id,
      name: row.name,
      description: row.description,
      prompt: row.prompt,
      defaultSources: Array.isArray(row.default_sources) ? row.default_sources : [],
   };
}

function mapTeamRow(row: TeamRow): AiSourceOption {
   return {
      id: row.id,
      type: 'team',
      name: row.name,
      metadata: {
         key: row.key,
         color: row.color,
         icon: row.icon,
      },
   };
}

function mapProjectRow(row: ProjectRow): AiSourceOption {
   return {
      id: row.id,
      type: 'project',
      name: row.name,
      metadata: {
         teamId: row.team_id,
         status: row.status,
         health: row.health,
      },
   };
}

function mapDriveFolderRow(row: DriveFolderRow): AiSourceOption {
   return {
      id: row.id,
      type: 'drive_folder',
      name: row.name,
      parentId: row.parent_id,
      metadata: {
         externalId: row.external_id,
         path: row.path,
      },
   } satisfies AiSourceOption;
}

function mapDriveFileRow(row: DriveFileRow): AiSourceOption {
   return {
      id: row.id,
      type: 'drive_file',
      name: row.name,
      parentId: row.folder_id,
      metadata: {
         externalId: row.external_id,
         mimeType: row.mime_type,
         size: row.size,
         version: row.version,
      },
   } satisfies AiSourceOption;
}

export async function fetchAiPanelData(workspaceSlug: string): Promise<AiPanelData> {
   if (!workspaceSlug) {
      throw new Error('Workspace slug is required to fetch AI panel data.');
   }

   const supabase = getGraphqlSupabaseAdmin();

   const { data: workspaceData, error: workspaceError } = await supabase
      .from('workspace')
      .select('id, name, slug, description')
      .eq('slug', workspaceSlug)
      .maybeSingle();

   throwIfError(workspaceError, 'Failed to load workspace');

   const workspaceRow = (workspaceData ?? null) as WorkspaceSummary | null;

   if (!workspaceRow) {
      throw new Error(`Workspace with slug "${workspaceSlug}" was not found.`);
   }

   const [agentsResult, teamsResult, projectsResult, foldersResult, filesResult] =
      await Promise.all([
         supabase
            .from('ai_agent_profile')
            .select('id, workspace_id, name, description, prompt, default_sources')
            .eq('workspace_id', workspaceRow.id),
         supabase
            .from('team')
            .select('id, workspace_id, name, key, color, icon')
            .eq('workspace_id', workspaceRow.id),
         supabase
            .from('project')
            .select('id, workspace_id, team_id, name, status, health, description')
            .eq('workspace_id', workspaceRow.id),
         supabase
            .from('drive_folder')
            .select('id, workspace_id, external_id, name, parent_id, path')
            .eq('workspace_id', workspaceRow.id),
         supabase
            .from('drive_file')
            .select('id, workspace_id, folder_id, external_id, name, mime_type, size, version')
            .eq('workspace_id', workspaceRow.id),
      ]);

   throwIfError(agentsResult.error, 'Failed to load AI agent profiles');
   throwIfError(teamsResult.error, 'Failed to load teams');
   throwIfError(projectsResult.error, 'Failed to load projects');
   throwIfError(foldersResult.error, 'Failed to load drive folders');
   throwIfError(filesResult.error, 'Failed to load drive files');

   const agentRows = (agentsResult.data ?? []) as AiAgentRow[];
   const teamRows = (teamsResult.data ?? []) as TeamRow[];
   const projectRows = (projectsResult.data ?? []) as ProjectRow[];
   const folderRows = (foldersResult.data ?? []) as DriveFolderRow[];
   const fileRows = (filesResult.data ?? []) as DriveFileRow[];

   const agents = agentRows.map(mapAgentRow);
   const teams = teamRows.map(mapTeamRow);
   const projects = projectRows.map(mapProjectRow);
   const driveFolders = folderRows.map(mapDriveFolderRow);
   const driveFiles = fileRows.map(mapDriveFileRow);

   return {
      workspace: workspaceRow,
      agents,
      sources: {
         workspace: createWorkspaceSource(workspaceRow),
         teams,
         projects,
         driveFolders,
         driveFiles,
      },
   } satisfies AiPanelData;
}
