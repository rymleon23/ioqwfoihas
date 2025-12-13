import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateContentSchema } from '@/lib/schemas';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';
import { generateContent } from '@/lib/openai';

export async function POST(
   request: NextRequest,
   { params }: { params: Promise<{ orgId: string }> }
) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const resolvedParams = await params;
      const { orgId } = resolvedParams;

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_CONTENT);

      const body = await request.json();
      const validatedData = generateContentSchema.parse(body);

      // Verify campaign belongs to org
      const project = await prisma.project.findFirst({
         where: { id: validatedData.campaignId, organizationId: orgId },
      });
      if (!project) {
         return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      // Generate content using OpenAI
      const generatedBody = await generateContent({
         prompt: validatedData.prompt,
         type: 'general',
         tone: 'professional',
         length: 'medium',
      });

      const content = await prisma.content.create({
         data: {
            title: `AI Generated: ${validatedData.prompt.slice(0, 50)}...`,
            body: generatedBody,
            type: 'SOCIAL_MEDIA',
            projectId: validatedData.campaignId,
         },
         include: {
            project: true,
            assets: true,
         },
      });

      return NextResponse.json(content, { status: 201 });
   } catch (error) {
      console.error('Error generating content:', error);
      if (error instanceof Error && error.message === 'Insufficient permissions') {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}
