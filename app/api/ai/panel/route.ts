import { NextRequest, NextResponse } from 'next/server';
import { fetchAiPanelData } from '@/lib/ai/panel-service';

export async function GET(request: NextRequest) {
   const workspaceSlug = request.nextUrl.searchParams.get('workspace');

   if (!workspaceSlug) {
      return NextResponse.json({ error: 'Missing "workspace" query parameter.' }, { status: 400 });
   }

   try {
      const payload = await fetchAiPanelData(workspaceSlug);
      return NextResponse.json(payload);
   } catch (error) {
      const message =
         error instanceof Error
            ? error.message
            : 'Unknown error occurred while resolving AI panel data.';
      return NextResponse.json({ error: message }, { status: 500 });
   }
}
