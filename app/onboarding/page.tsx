'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function OnboardingPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl space-y-8"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome to Circle</h1>
                    <p className="text-muted-foreground">
                        To get started, please create a new workspace or join an existing one.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <Link href="/onboarding/create" className="block h-full">
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <CardTitle>Create a new Workspace</CardTitle>
                                <CardDescription>
                                    Set up a new workspace for your organization or team.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full" variant="secondary">
                                    Create Workspace
                                </Button>
                            </CardContent>
                        </Link>
                    </Card>

                    <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <Link href="/onboarding/join" className="block h-full">
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Users className="h-6 w-6" />
                                </div>
                                <CardTitle>Join an existing Workspace</CardTitle>
                                <CardDescription>
                                    Accept an invitation or find your team's workspace.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full" variant="secondary">
                                    Join Workspace
                                </Button>
                            </CardContent>
                        </Link>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
}
