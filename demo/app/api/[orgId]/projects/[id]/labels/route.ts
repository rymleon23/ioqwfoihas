import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const createLabelSchema = z.object({
   name: z.string().min(1).max(50),
   color: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i)
      .default('#3B82F6'),
});

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ orgId: string; id: string }> }
) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const resolvedParams = await params;
      const { orgId, id } = resolvedParams;

      // Check if user has access to this organization
      const membership = await prisma.membership.findUnique({
         where: {
            userId_organizationId: {
               userId: session.user.id,
               organizationId: orgId,
            },
         },
      });

      if (!membership) {
         return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }

      // Get project labels
      const labels = await prisma.projectLabel.findMany({
         where: {
            projectId: id,
         },
         orderBy: [{ name: 'asc' }],
      });

      return NextResponse.json(labels);
   } catch (error) {
      console.error('Error fetching project labels:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}

export async function POST(
   request: NextRequest,
   { params }: { params: Promise<{ orgId: string; id: string }> }
) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const resolvedParams = await params;
      const { orgId, id } = resolvedParams;

      // Check if user has access to this organization
      const membership = await prisma.membership.findUnique({
         where: {
            userId_organizationId: {
               userId: session.user.id,
               organizationId: orgId,
            },
         },
      });

      if (!membership) {
         return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }

      // Check if user is project member with edit permissions
      const projectMember = await prisma.projectMember.findUnique({
         where: {
            projectId_userId: {
               projectId: id,
               userId: session.user.id,
            },
         },
      });

      if (!projectMember || !['OWNER', 'MANAGER'].includes(projectMember.role)) {
         return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
      }

      const body = await request.json();
      const validatedData = createLabelSchema.parse(body);

      // Check if label name already exists for this project
      const existingLabel = await prisma.projectLabel.findUnique({
         where: {
            projectId_name: {
               projectId: id,
               name: validatedData.name,
            },
         },
      });

      if (existingLabel) {
         return NextResponse.json(
            { error: 'Label with this name already exists' },
            { status: 400 }
         );
      }

      // Create label
      const label = await prisma.projectLabel.create({
         data: {
            ...validatedData,
            projectId: id,
         },
      });

      return NextResponse.json(label, { status: 201 });
   } catch (error) {
      console.error('Error creating project label:', error);

      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { error: 'Invalid request data', details: error.errors },
            { status: 400 }
         );
      }

      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}
