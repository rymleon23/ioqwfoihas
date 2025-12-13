import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateTaskSchema } from '@/lib/schemas';
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

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_TASKS);

      const body = await request.json();
      const validatedData = generateTaskSchema.parse(body);

      // Verify project belongs to org
      const project = await prisma.project.findFirst({
         where: { id: validatedData.projectId, organizationId: orgId },
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

      const task = await prisma.task.create({
         data: {
            title: `AI Generated: ${validatedData.prompt.slice(0, 50)}...`,
            body: generatedBody,
            projectId: validatedData.projectId,
            status: 'TODO',
            priority: 'MEDIUM',
         },
         include: {
            project: true,
            phase: true,
            assignee: true,
            assets: true,
         },
      });

      return NextResponse.json(task, { status: 201 });
   } catch (error) {
      console.error('Error generating task:', error);
      if (error instanceof Error && error.message === 'Insufficient permissions') {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}
