'use client';

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Send, Check, RefreshCw, Wand2, Copy, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AiPanelProps {
   taskId: string;
   className?: string;
   onInsertDescription?: (content: string) => void;
   onPostComment?: (content: string) => void;
}

type AiState = 'idle' | 'generating' | 'review' | 'error';

export function AiPanel({ taskId, className, onInsertDescription, onPostComment }: AiPanelProps) {
   const [state, setState] = useState<AiState>('idle');
   const [prompt, setPrompt] = useState('');
   const [generatedContent, setGeneratedContent] = useState('');
   const [activeTab, setActiveTab] = useState('generate');
   const [tone, setTone] = useState('professional');

   const handleGenerate = async () => {
      if (!prompt.trim()) return;

      setState('generating');

      try {
         const response = await fetch('/api/ai/generate', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               prompt,
               tone,
            }),
         });

         if (!response.ok) {
            throw new Error('Failed to generate content');
         }

         const data = await response.json();

         setGeneratedContent(data.content);
         setState('review');
         setActiveTab('review');
         toast.success('Content generated successfully');
      } catch (error) {
         setState('error');
         toast.error('Failed to generate content');
      }
   };

   const handleInsert = () => {
      if (onInsertDescription) {
         onInsertDescription(generatedContent);
         toast.success('Added to task description');
      }
   };

   const handleComment = () => {
      if (onPostComment) {
         onPostComment(generatedContent);
         toast.success('Posted as comment');
      }
   };

   return (
      <div className={`flex h-full flex-col border-l bg-background ${className}`}>
         <div className="flex items-center gap-2 border-b p-4">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="font-semibold">AI Studio</span>
         </div>

         <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-4 pt-2">
               <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="generate" disabled={state === 'generating'}>
                     Generate
                  </TabsTrigger>
                  <TabsTrigger value="review" disabled={state === 'idle' || state === 'generating'}>
                     Review
                  </TabsTrigger>
                  <TabsTrigger value="submit" disabled={state !== 'review'}>
                     Submit
                  </TabsTrigger>
               </TabsList>
            </div>

            <div className="flex-1 overflow-hidden p-4">
               {/* GENERATE TAB */}
               <TabsContent
                  value="generate"
                  className="h-full mt-0 data-[state=active]:flex flex-col gap-4"
               >
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Goal</label>
                        <Textarea
                           placeholder="What do you want to write? (e.g. 'Draft a launch tweet', 'Summarize meeting notes')"
                           className="h-32 resize-none"
                           value={prompt}
                           onChange={(e) => setPrompt(e.target.value)}
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-medium">Tone</label>
                        <Select value={tone} onValueChange={setTone}>
                           <SelectTrigger>
                              <SelectValue placeholder="Select tone" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="casual">Casual</SelectItem>
                              <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                              <SelectItem value="concise">Concise</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                  </div>

                  <div className="mt-auto">
                     <Button
                        className="w-full gap-2"
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || state === 'generating'}
                     >
                        {state === 'generating' ? (
                           <>
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              Generating...
                           </>
                        ) : (
                           <>
                              <Wand2 className="h-4 w-4" />
                              Generate Draft
                           </>
                        )}
                     </Button>
                  </div>
               </TabsContent>

               {/* REVIEW TAB */}
               <TabsContent
                  value="review"
                  className="h-full mt-0 data-[state=active]:flex flex-col gap-4"
               >
                  <div className="flex-1 relative">
                     <Textarea
                        className="h-full resize-none p-4 font-mono text-sm leading-relaxed"
                        value={generatedContent}
                        onChange={(e) => setGeneratedContent(e.target.value)}
                     />
                     <Badge
                        variant="secondary"
                        className="absolute top-2 right-2 text-xs opacity-50 pointer-events-none"
                     >
                        Editable
                     </Badge>
                  </div>

                  <div className="flex gap-2">
                     <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => setActiveTab('generate')}
                     >
                        <RefreshCw className="h-4 w-4" />
                        Refine
                     </Button>
                     <Button className="flex-1 gap-2" onClick={() => setActiveTab('submit')}>
                        <Check className="h-4 w-4" />
                        Approve
                     </Button>
                  </div>
               </TabsContent>

               {/* SUBMIT TAB */}
               <TabsContent
                  value="submit"
                  className="h-full mt-0 data-[state=active]:flex flex-col gap-4"
               >
                  <div className="space-y-4">
                     <Card>
                        <CardHeader className="pb-2">
                           <CardTitle className="text-sm font-medium">Action</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           <Button
                              variant="secondary"
                              className="w-full justify-start gap-2"
                              onClick={handleInsert}
                           >
                              <Copy className="h-4 w-4" />
                              Insert to Description
                           </Button>
                           <Button
                              variant="secondary"
                              className="w-full justify-start gap-2"
                              onClick={handleComment}
                           >
                              <Send className="h-4 w-4" />
                              Post as Comment
                           </Button>
                        </CardContent>
                     </Card>

                     <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900/50 dark:bg-yellow-900/20">
                        <div className="flex gap-2">
                           <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                           <p className="text-xs text-yellow-800 dark:text-yellow-400">
                              Review the content one last time before publishing. AI can make
                              mistakes.
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="mt-auto">
                     <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => setActiveTab('review')}
                     >
                        Back to Review
                     </Button>
                  </div>
               </TabsContent>
            </div>
         </Tabs>
      </div>
   );
}
