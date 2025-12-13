import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { phaseSchema, validateIncludeParam, handleAPIError } from '@/lib/schemas/api';
import { APIError } from '@/lib/api-utils';

// Validation schemas
const updatePhaseSchema = phaseSchema.partial();

const getPhaseSchema = z.object({
   include: z.string().optional(),
});

// Include relations for phases
const PHASE_INCLUDE_RELATIONS = ['objective', 'projects', 'tasks', 'activities', 'createdBy'];

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ orgId: string; id: string }> }
) {
   try {
      const { orgId, id } = await params;
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_UNAUTHORIZED', message: 'Unauthorized' },
            },
            { status: 401 }
         );
      }

      const { searchParams } = new URL(request.url);
      const query = getPhaseSchema.parse({
         include: searchParams.get('include'),
      });

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
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_ACCESS_DENIED', message: 'Access denied' },
            },
            { status: 403 }
         );
      }

      // Parse include relationships
      const includeRelations = query.include
         ? validateIncludeParam(query.include, PHASE_INCLUDE_RELATIONS)
         : { objective: true, projects: true, createdBy: true };

      // Build include object for Prisma
      const include: any = {};

      // Add relationships based on include parameter
      if (includeRelations.objective) {
         include.objective = {
            select: { id: true, title: true, status: true, priority: true },
         };
      }

      if (includeRelations.projects) {
         include.projects = {
            select: { id: true, name: true, status: true, priority: true, health: true },
         };
      }

      if (includeRelations.tasks) {
         include.tasks = {
            select: { id: true, title: true, status: true, priority: true },
         };
      }

      if (includeRelations.createdBy) {
         include.createdBy = {
            select: { id: true, name: true, email: true, image: true },
         };
      }

      if (includeRelations.activities) {
         include.activities = {
            select: { id: true, type: true, description: true, createdAt: true },
         };
      }

      // Get phase
      const phase = await prisma.phase.findFirst({
         where: {
            id,
            organizationId: orgId,
         },
         include,
      });

      if (!phase) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_NOT_FOUND', message: 'Phase not found' },
            },
            { status: 404 }
         );
      }

      return NextResponse.json({
         ok: true,
         data: phase,
      });
   } catch (error) {
      console.error('Error fetching phase:', error);
      return handleAPIError(error);
   }
}

export async function PUT(
   request: NextRequest,
   { params }: { params: Promise<{ orgId: string; id: string }> }
) {
   try {
      const { orgId, id } = await params;
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_UNAUTHORIZED', message: 'Unauthorized' },
            },
            { status: 401 }
         );
      }

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
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_ACCESS_DENIED', message: 'Access denied' },
            },
            { status: 403 }
         );
      }

      // Only ADMIN and BRAND_OWNER can update phases
      if (!['ADMIN', 'BRAND_OWNER'].includes(membership.role)) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_INSUFFICIENT_PERMISSIONS', message: 'Insufficient permissions' },
            },
            { status: 403 }
         );
      }

      // Check if phase exists
      const existingPhase = await prisma.phase.findFirst({
         where: {
            id,
            organizationId: orgId,
         },
      });

      if (!existingPhase) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_NOT_FOUND', message: 'Phase not found' },
            },
            { status: 404 }
         );
      }

      const body = await request.json();
      const validatedData = updatePhaseSchema.parse(body);

      // Validate objective exists if provided
      if (validatedData.objectiveId) {
         const objective = await prisma.objective.findFirst({
            where: {
               id: validatedData.objectiveId,
               organizationId: orgId,
            },
         });
         if (!objective) {
            throw new APIError('Objective not found', 404, 'OBJECTIVE_NOT_FOUND');
         }
      }

      // Update phase
      const phase = await prisma.phase.update({
         where: { id },
         data: validatedData,
         include: {
            objective: {
               select: { id: true, title: true, status: true, priority: true },
            },
            projects: {
               select: { id: true, name: true, status: true, priority: true, health: true },
            },
            createdBy: {
               select: { id: true, name: true, email: true, image: true },
            },
         },
      });

      return NextResponse.json({
         ok: true,
         data: phase,
      });
   } catch (error) {
      console.error('Error updating phase:', error);
      return handleAPIError(error);
   }
}

export async function DELETE(
   request: NextRequest,
   { params }: { params: Promise<{ orgId: string; id: string }> }
) {
   try {
      const { orgId, id } = await params;
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_UNAUTHORIZED', message: 'Unauthorized' },
            },
            { status: 401 }
         );
      }

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
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_ACCESS_DENIED', message: 'Access denied' },
            },
            { status: 403 }
         );
      }

      // Only ADMIN can delete phases
      if (membership.role !== 'ADMIN') {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_INSUFFICIENT_PERMISSIONS', message: 'Insufficient permissions' },
            },
            { status: 403 }
         );
      }

      // Check if phase exists
      const existingPhase = await prisma.phase.findFirst({
         where: {
            id,
            organizationId: orgId,
         },
      });

      if (!existingPhase) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_NOT_FOUND', message: 'Phase not found' },
            },
            { status: 404 }
         );
      }

      // Check if phase has associated projects
      const associatedProjects = await prisma.project.count({
         where: {
            phaseId: id,
         },
      });

      if (associatedProjects > 0) {
         return NextResponse.json(
            {
               ok: false,
               error: {
                  code: 'E_CONFLICT',
                  message: 'Cannot delete phase with associated projects',
               },
            },
            { status: 409 }
         );
      }

      // Delete phase
      await prisma.phase.delete({
         where: { id },
      });

      return NextResponse.json({
         ok: true,
         data: { message: 'Phase deleted successfully' },
      });
   } catch (error) {
      console.error('Error deleting phase:', error);
      return handleAPIError(error);
   }
}
