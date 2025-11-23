import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AuthCodeErrorPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const error = params.error as string;
    const errorCode = params.error_code as string;
    const errorDescription = params.error_description as string;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <h1 className="mb-4 text-2xl font-bold text-destructive">Authentication Error</h1>
            <p className="mb-2 text-muted-foreground">
                We encountered an issue while signing you in.
            </p>

            {(error || errorCode) && (
                <div className="mb-6 rounded-md bg-destructive/10 p-4 text-left text-sm text-destructive">
                    <p><strong>Error:</strong> {error}</p>
                    <p><strong>Code:</strong> {errorCode}</p>
                    <p><strong>Description:</strong> {errorDescription}</p>
                </div>
            )}

            <div className="flex gap-4">
                <Button asChild variant="outline">
                    <Link href="/login">Back to Login</Link>
                </Button>
            </div>
        </div>
    );
}
