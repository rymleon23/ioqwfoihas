            </p >

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
        </div >
    );
}
