'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function JoinWorkspacePage() {
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
                    <h1 className="text-2xl font-semibold tracking-tight">Join a Workspace</h1>
                    <p className="text-sm text-muted-foreground">
                        Check your email for an invitation link from your administrator.
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/10">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                        If you haven't received an invite, please contact your workspace administrator to send you one.
                    </p>
                </div>

                <div className="text-center">
                    <Button variant="outline" asChild>
                        <Link href="/login">Back to Login</Link>
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
