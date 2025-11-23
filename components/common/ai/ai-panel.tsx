'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AiAgentProfile, AiPanelData, AiSourceOption } from '@/lib/ai/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Check, Loader2, Sparkles, X } from 'lucide-react';

type FetchStatus = 'idle' | 'loading' | 'error' | 'ready';

interface AiPanelProps {
   workspaceSlug: string;
   taskIdentifier?: string;
   className?: string;
}

interface SourceWithKey extends AiSourceOption {
   key: string;
}

interface SourceGroups {
   groups: Array<{ key: string; label: string; items: SourceWithKey[] }>;
   map: Map<string, SourceWithKey>;
   workspaceKey: string | null;
}

const SOURCE_GROUP_LABELS: Record<string, string> = {
   workspace: 'Workspace',
   teams: 'Teams',
   projects: 'Projects',
   driveFolders: 'Drive Folders',
   driveFiles: 'Drive Files',
};

async function fetchPanelData(workspaceSlug: string): Promise<AiPanelData> {
   const response = await fetch(`/api/ai/panel?workspace=${encodeURIComponent(workspaceSlug)}`);
   if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      const message =
         typeof payload.error === 'string' ? payload.error : 'Unable to load AI panel data.';
      throw new Error(message);
   }

   return response.json();
}

function buildSourceGroups(data: AiPanelData | null): SourceGroups {
   if (!data) {
      return { groups: [], map: new Map(), workspaceKey: null };
   }

   const map = new Map<string, SourceWithKey>();

   const register = (option: AiSourceOption): SourceWithKey => {
      const key = `${option.type}:${option.id}`;
      const entry: SourceWithKey = { ...option, key };
      map.set(key, entry);
      return entry;
   };

   const workspace = register(data.sources.workspace);
   const teams = data.sources.teams.map(register);
   const projects = data.sources.projects.map(register);
   const driveFolders = data.sources.driveFolders.map(register);
   const driveFiles = data.sources.driveFiles.map(register);

   const groups = [
      { key: 'workspace', label: SOURCE_GROUP_LABELS.workspace, items: [workspace] },
      { key: 'teams', label: SOURCE_GROUP_LABELS.teams, items: teams },
      { key: 'projects', label: SOURCE_GROUP_LABELS.projects, items: projects },
      { key: 'driveFolders', label: SOURCE_GROUP_LABELS.driveFolders, items: driveFolders },
      { key: 'driveFiles', label: SOURCE_GROUP_LABELS.driveFiles, items: driveFiles },
   ].filter((group) => group.items.length > 0);

   return { groups, map, workspaceKey: workspace.key };
}

export function AiPanel({ workspaceSlug, taskIdentifier, className }: AiPanelProps) {
   const [status, setStatus] = useState<FetchStatus>('loading');
   const [reloadToken, setReloadToken] = useState(0);
   const [errorMessage, setErrorMessage] = useState<string | null>(null);
   const [data, setData] = useState<AiPanelData | null>(null);
   const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
   const [selectedSourceKeys, setSelectedSourceKeys] = useState<Set<string>>(new Set());
   const [isSourcePickerOpen, setIsSourcePickerOpen] = useState(false);

   useEffect(() => {
      let cancelled = false;

      setStatus('loading');
      setErrorMessage(null);
      setSelectedAgentId(null);
      setSelectedSourceKeys(new Set());

      fetchPanelData(workspaceSlug)
         .then((payload) => {
            if (cancelled) return;
            setData(payload);
            setStatus('ready');
         })
         .catch((error: unknown) => {
            if (cancelled) return;
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Unexpected error.');
         });

      return () => {
         cancelled = true;
      };
   }, [workspaceSlug, reloadToken]);

   const sourceGroups = useMemo(() => buildSourceGroups(data), [data]);

   const resolveDefaultSources = useCallback(
      (defaults: string[]) => {
         const resolved = new Set<string>();

         defaults.forEach((ref) => {
            if (!ref) return;

            if (sourceGroups.map.has(ref)) {
               resolved.add(ref);
               return;
            }

            const colonIndex = ref.indexOf(':');
            let candidateId = ref;

            if (colonIndex > -1) {
               const candidateType = ref.slice(0, colonIndex);
               candidateId = ref.slice(colonIndex + 1);
               const candidateKey = `${candidateType}:${candidateId}`;
               if (sourceGroups.map.has(candidateKey)) {
                  resolved.add(candidateKey);
                  return;
               }
            }

            if (sourceGroups.workspaceKey) {
               if (ref === 'workspace' || candidateId === data?.workspace.id) {
                  resolved.add(sourceGroups.workspaceKey);
                  return;
               }
            }

            for (const entry of sourceGroups.map.values()) {
               if (entry.id === candidateId || entry.id === ref) {
                  resolved.add(entry.key);
                  break;
               }
            }
         });

         if (resolved.size === 0 && sourceGroups.workspaceKey) {
            resolved.add(sourceGroups.workspaceKey);
         }

         return resolved;
      },
      [data?.workspace.id, sourceGroups.map, sourceGroups.workspaceKey]
   );

   useEffect(() => {
      if (!data) return;

      if (data.agents.length === 0) {
         if (sourceGroups.workspaceKey && selectedSourceKeys.size === 0) {
            setSelectedSourceKeys(new Set([sourceGroups.workspaceKey]));
         }
         return;
      }

      const existing = data.agents.find((agent) => agent.id === selectedAgentId);
      if (existing) {
         return;
      }

      const fallback = data.agents[0];
      setSelectedAgentId(fallback.id);
      setSelectedSourceKeys(resolveDefaultSources(fallback.defaultSources));
   }, [
      data,
      resolveDefaultSources,
      selectedAgentId,
      selectedSourceKeys.size,
      sourceGroups.workspaceKey,
   ]);

   const selectedAgent: AiAgentProfile | null = useMemo(() => {
      if (!data || !selectedAgentId) {
         return null;
      }
      return data.agents.find((agent) => agent.id === selectedAgentId) ?? null;
   }, [data, selectedAgentId]);

   const selectedSources = useMemo(() => {
      if (!sourceGroups.map.size || selectedSourceKeys.size === 0) {
         return [] as SourceWithKey[];
      }

      return Array.from(selectedSourceKeys)
         .map((key) => sourceGroups.map.get(key))
         .filter((value): value is SourceWithKey => Boolean(value));
   }, [selectedSourceKeys, sourceGroups.map]);

   const toggleSource = useCallback((key: string) => {
      setSelectedSourceKeys((prev) => {
         const next = new Set(prev);
         if (next.has(key)) {
            next.delete(key);
         } else {
            next.add(key);
         }
         return next;
      });
   }, []);

   const handleAgentChange = useCallback(
      (agentId: string) => {
         if (!data) return;
         const nextAgent = data.agents.find((agent) => agent.id === agentId);
         setSelectedAgentId(agentId);
         if (nextAgent) {
            setSelectedSourceKeys(resolveDefaultSources(nextAgent.defaultSources));
         }
      },
      [data, resolveDefaultSources]
   );

   const removeSource = useCallback((key: string) => {
      setSelectedSourceKeys((prev) => {
         if (!prev.has(key)) return prev;
         const next = new Set(prev);
         next.delete(key);
         return next;
      });
   }, []);

   const handleRetry = useCallback(() => {
      setStatus('loading');
      setReloadToken((value) => value + 1);
   }, []);

   if (status === 'loading') {
      return (
         <div className={cn('space-y-6 rounded-lg border p-6', className)}>
            <div className="flex items-center gap-2 text-muted-foreground">
               <Loader2 className="size-4 animate-spin" />
               Loading AI panel...
            </div>
            <div className="space-y-3">
               <Skeleton className="h-10 w-full" />
               <Skeleton className="h-10 w-full" />
               <Skeleton className="h-32 w-full" />
            </div>
         </div>
      );
   }

   if (status === 'error') {
      return (
         <div
            className={cn(
               'space-y-4 rounded-lg border border-destructive/40 bg-destructive/5 p-6',
               className
            )}
         >
            <div className="font-semibold text-destructive">Unable to load AI Studio</div>
            <p className="text-sm text-destructive/80">{errorMessage}</p>
            <Button variant="outline" size="sm" onClick={handleRetry}>
               Retry
            </Button>
         </div>
      );
   }

   return (
      <div className={cn('space-y-6 rounded-lg border p-6', className)}>
         <header className="space-y-1">
            <div className="flex items-center gap-2">
               <Sparkles className="size-4 text-primary" />
               <span className="text-sm font-medium uppercase tracking-wide text-primary">
                  AI Studio
               </span>
            </div>
            <h2 className="text-lg font-semibold">Generate with workspace context</h2>
            {taskIdentifier && (
               <p className="text-sm text-muted-foreground">Task: {taskIdentifier}</p>
            )}
         </header>

         <section className="space-y-3">
            <div className="flex items-center justify-between">
               <span className="text-sm font-medium">Agent</span>
               {selectedAgent && (
                  <Badge variant="secondary">
                     {selectedAgent.defaultSources.length} default sources
                  </Badge>
               )}
            </div>
            <Select value={selectedAgentId ?? undefined} onValueChange={handleAgentChange}>
               <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an agent" />
               </SelectTrigger>
               <SelectContent>
                  {data?.agents.map((agent) => (
                     <SelectItem key={agent.id} value={agent.id}>
                        <div className="flex flex-col">
                           <span className="font-medium">{agent.name}</span>
                           {agent.description && (
                              <span className="text-xs text-muted-foreground">
                                 {agent.description}
                              </span>
                           )}
                        </div>
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
            {selectedAgent?.description && (
               <p className="text-sm text-muted-foreground">{selectedAgent.description}</p>
            )}
         </section>

         <section className="space-y-3">
            <div className="flex items-center justify-between">
               <span className="text-sm font-medium">Context Sources</span>
               <Button variant="outline" size="sm" onClick={() => setSelectedSourceKeys(new Set())}>
                  Clear
               </Button>
            </div>

            <Popover open={isSourcePickerOpen} onOpenChange={setIsSourcePickerOpen}>
               <PopoverTrigger asChild>
                  <Button type="button" variant="secondary" className="w-full justify-between">
                     <span>{selectedSources.length > 0 ? 'Edit sources' : 'Add sources'}</span>
                     <span className="text-xs text-muted-foreground">
                        {selectedSources.length} selected
                     </span>
                  </Button>
               </PopoverTrigger>
               <PopoverContent className="w-[320px] p-0" align="start">
                  <Command>
                     <CommandInput placeholder="Search sources..." />
                     <CommandList>
                        <CommandEmpty>No sources found.</CommandEmpty>
                        {sourceGroups.groups.map((group) => (
                           <CommandGroup key={group.key} heading={group.label}>
                              {group.items.map((item) => {
                                 const isActive = selectedSourceKeys.has(item.key);
                                 return (
                                    <CommandItem
                                       key={item.key}
                                       value={item.key}
                                       onSelect={() => toggleSource(item.key)}
                                    >
                                       <Check
                                          className={cn(
                                             'mr-2 size-4',
                                             isActive ? 'opacity-100' : 'opacity-0'
                                          )}
                                       />
                                       <span className="flex-1 text-sm">{item.name}</span>
                                       <span className="text-xs uppercase text-muted-foreground">
                                          {SOURCE_GROUP_LABELS[group.key] ?? group.label}
                                       </span>
                                    </CommandItem>
                                 );
                              })}
                           </CommandGroup>
                        ))}
                     </CommandList>
                  </Command>
               </PopoverContent>
            </Popover>

            <div className="flex flex-wrap gap-2">
               {selectedSources.length === 0 && (
                  <span className="text-xs text-muted-foreground">No sources selected.</span>
               )}
               {selectedSources.map((source) => (
                  <Badge key={source.key} variant="outline" className="flex items-center gap-1">
                     <span>{source.name}</span>
                     <button
                        type="button"
                        className="text-muted-foreground/80 hover:text-foreground"
                        onClick={() => removeSource(source.key)}
                     >
                        <X className="size-3" />
                     </button>
                  </Badge>
               ))}
            </div>
         </section>

         <footer className="flex flex-col gap-3">
            <Button className="gap-2">
               <Sparkles className="size-4" />
               Generate draft
            </Button>
            <p className="text-xs text-muted-foreground">
               Selected sources guide retrieval for this task. Agent defaults are applied
               automatically and can be customised per request.
            </p>
         </footer>
      </div>
   );
}
