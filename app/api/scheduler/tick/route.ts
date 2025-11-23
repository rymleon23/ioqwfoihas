import { NextResponse } from 'next/server';

// Placeholder cron handler; replace with scheduler orchestration when social posting backend is ready.
export const runtime = 'nodejs';

type CronResponse = {
   status: 'ok';
   receivedAt: string;
};

const respond = (): CronResponse => ({
   status: 'ok',
   receivedAt: new Date().toISOString(),
});

export async function GET() {
   return NextResponse.json(respond());
}

export async function POST() {
   return NextResponse.json(respond());
}
