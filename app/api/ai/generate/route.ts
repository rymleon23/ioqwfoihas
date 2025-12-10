import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
   const supabase = await createClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }

   try {
      const { prompt, tone = 'professional' } = await request.json();

      if (!prompt) {
         return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
      }

      // TODO: Replace with actual call to OpenAI or Gemini
      // For now, we simulate a response
      const mockResponse = `[AI Generated - ${tone} tone]\n\nBased on your request: "${prompt}"\n\nHere is a draft response that addresses the key points. This content is generated to be clear, concise, and aligned with your specified tone.\n\n1. First point covering the main objective.\n2. Second point providing supporting details.\n3. Call to action or next steps.`;

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return NextResponse.json({ content: mockResponse });
   } catch (error) {
      console.error('AI Generate Error:', error);
      return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
   }
}
