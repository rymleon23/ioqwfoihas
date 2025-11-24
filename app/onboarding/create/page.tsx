'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateWorkspacePage() {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    // Auto-generate slug from name
    useEffect(() => {
        const generatedSlug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        setSlug(generatedSlug);
    }, [name]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                toast.error('You must be logged in to create a workspace');
                router.push('/login');
                return;
            }

            // 1. Create Workspace
            const { data: workspace, error: workspaceError } = await supabase
                .from('workspace')
                .insert({
                    name,
                    slug,
                })
                .select()
                .single();

            if (workspaceError) {
                if (workspaceError.code === '23505') {
                    toast.error('This URL is already taken. Please choose another one.');
                } else {
                    toast.error('Error creating workspace', {
                        description: workspaceError.message,
                    });
                }
                return;
            }

            // 2. Update User (Assign to Workspace)
            const { error: userError } = await supabase
                .from('users')
                .update({
                    workspace_id: workspace.id,
                })
                .eq('id', user.id);

            if (userError) {
                toast.error('Error updating user profile', {
                    description: userError.message,
                });
                return;
            }

            toast.success('Workspace created successfully!');
            router.push(`/app/${workspace.id}`);
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-8"
            >
                <div className="flex items-center mb-6">
                    <Link
                        href="/onboarding"
                        className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </div>

                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">Create a new Workspace</h1>
                    <p className="text-sm text-muted-foreground">
                        Give your workspace a name and a unique URL.
                    </p>
                </div>

                <form onSubmit={handleCreate} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Workspace Name</Label>
                            <Input
                                id="name"
                                placeholder="Acme Corp"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Workspace URL</Label>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">app.aim.com/</span>
                                <Input
                                    id="slug"
                                    placeholder="acme-corp"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    <Button className="w-full" disabled={isLoading || !name || !slug}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Workspace
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}
