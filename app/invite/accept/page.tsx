'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

export default function InviteAcceptPage() {
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const handleAcceptInvite = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            // Update user profile (password and metadata)
            const { error } = await supabase.auth.updateUser({
                password: password,
                data: {
                    full_name: fullName,
                    display_name: fullName,
                },
            });

            if (error) {
                toast.error('Error accepting invitation', {
                    description: error.message,
                });
            } else {
                toast.success('Invitation accepted!');
                router.push('/'); // Redirect to dashboard/onboarding
            }
        } catch {
            toast.error('Something went wrong. Please try again.');
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
                className="w-full max-w-sm space-y-8"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">Accept Invitation</h1>
                    <p className="text-sm text-muted-foreground">
                        Set up your account to join the workspace
                    </p>
                </div>

                <form onSubmit={handleAcceptInvite} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            id="fullName"
                            placeholder="John Doe"
                            type="text"
                            autoCapitalize="words"
                            autoComplete="name"
                            autoCorrect="off"
                            disabled={isLoading}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="h-11 bg-background"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            placeholder="••••••••"
                            type="password"
                            autoComplete="new-password"
                            disabled={isLoading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11 bg-background"
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            placeholder="••••••••"
                            type="password"
                            autoComplete="new-password"
                            disabled={isLoading}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-11 bg-background"
                            required
                            minLength={6}
                        />
                    </div>
                    <Button disabled={isLoading} className="h-11 w-full">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Accept & Join
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}
