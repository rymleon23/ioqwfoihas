import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createContentSchema } from '@/lib/schemas';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ orgId: string }> }
) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json(
            { ok: false, error: { code: 'E_UNAUTHORIZED', message: 'Unauthorized' } },
            { status: 401 }
         );
      }

      const resolvedParams = await params;
      const { orgId } = resolvedParams;
      const { searchParams } = new URL(request.url);
      const projectId = searchParams.get('projectId');
      const status = searchParams.get('status');

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_CONTENT);

      const where: any = {
         project: { organizationId: orgId },
      };

      if (projectId) {
         where.projectId = projectId;
      }

      if (status) {
         where.status = status;
      }

      const contents = await prisma.content.findMany({
         where,
         include: {
            project: true,
            assets: true,
         },
         orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ ok: true, data: contents });
   } catch (error) {
      console.error('Error fetching contents:', error);
      return NextResponse.json(
         { ok: false, error: { code: 'E_INTERNAL', message: 'Internal server error' } },
         { status: 500 }
      );
   }
}

export async function POST(
   request: NextRequest,
   { params }: { params: Promise<{ orgId: string }> }
) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json(
            { ok: false, error: { code: 'E_UNAUTHORIZED', message: 'Unauthorized' } },
            { status: 401 }
         );
      }

      const { orgId } = await params;

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_CONTENT);

      const body = await request.json();
      const validatedData = createContentSchema.parse(body);

      // Verify campaign belongs to org
      const project = await prisma.project.findFirst({
         where: { id: validatedData.campaignId, organizationId: orgId },
      });
      if (!project) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_NOT_FOUND', message: 'Project not found' },
            },
            { status: 404 }
         );
      }

      const content = await prisma.content.create({
         data: {
            ...validatedData,
            type: 'SOCIAL_MEDIA',
            projectId: validatedData.campaignId,
         },
         include: {
            project: true,
            assets: true,
         },
      });

      return NextResponse.json({ ok: true, data: content }, { status: 201 });
   } catch (error) {
      console.error('Error creating content:', error);
      if (error instanceof Error && error.message === 'Insufficient permissions') {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_FORBIDDEN', message: 'Forbidden' },
            },
            { status: 403 }
         );
      }
      return NextResponse.json(
         { ok: false, error: { code: 'E_INTERNAL', message: 'Internal server error' } },
         { status: 500 }
      );
   }
}
