import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { objectiveSchema, validateIncludeParam, handleAPIError } from '@/lib/schemas/api';
import { APIError } from '@/lib/api-utils';

// Validation schemas
const updateObjectiveSchema = objectiveSchema.partial();

const getObjectiveSchema = z.object({
   include: z.string().optional(),
});

// Include relations for objectives
const OBJECTIVE_INCLUDE_RELATIONS = ['projects', 'phases', 'activities', 'createdBy'];

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
      const query = getObjectiveSchema.parse({
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
         ? validateIncludeParam(query.include, OBJECTIVE_INCLUDE_RELATIONS)
         : { projects: true, phases: true, createdBy: true };

      // Build include object for Prisma
      const include: any = {};

      // Add relationships based on include parameter
      if (includeRelations.projects) {
         include.projects = {
            select: { id: true, name: true, status: true, priority: true, health: true },
         };
      }

      if (includeRelations.phases) {
         include.phases = {
            select: { id: true, title: true, status: true },
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

      // Get objective
      const objective = await prisma.objective.findFirst({
         where: {
            id,
            organizationId: orgId,
         },
         include,
      });

      if (!objective) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_NOT_FOUND', message: 'Objective not found' },
            },
            { status: 404 }
         );
      }

      return NextResponse.json({
         ok: true,
         data: objective,
      });
   } catch (error) {
      console.error('Error fetching objective:', error);
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

      // Only ADMIN and BRAND_OWNER can update objectives
      if (!['ADMIN', 'BRAND_OWNER'].includes(membership.role)) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_INSUFFICIENT_PERMISSIONS', message: 'Insufficient permissions' },
            },
            { status: 403 }
         );
      }

      // Check if objective exists
      const existingObjective = await prisma.objective.findFirst({
         where: {
            id,
            organizationId: orgId,
         },
      });

      if (!existingObjective) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_NOT_FOUND', message: 'Objective not found' },
            },
            { status: 404 }
         );
      }

      const body = await request.json();
      const validatedData = updateObjectiveSchema.parse(body);

      // Update objective
      const objective = await prisma.objective.update({
         where: { id },
         data: validatedData,
         include: {
            projects: {
               select: { id: true, name: true, status: true, priority: true, health: true },
            },
            phases: {
               select: { id: true, title: true, status: true },
            },
            createdBy: {
               select: { id: true, name: true, email: true, image: true },
            },
         },
      });

      return NextResponse.json({
         ok: true,
         data: objective,
      });
   } catch (error) {
      console.error('Error updating objective:', error);
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

      // Only ADMIN can delete objectives
      if (membership.role !== 'ADMIN') {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_INSUFFICIENT_PERMISSIONS', message: 'Insufficient permissions' },
            },
            { status: 403 }
         );
      }

      // Check if objective exists
      const existingObjective = await prisma.objective.findFirst({
         where: {
            id,
            organizationId: orgId,
         },
      });

      if (!existingObjective) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_NOT_FOUND', message: 'Objective not found' },
            },
            { status: 404 }
         );
      }

      // Check if objective has associated projects
      const associatedProjects = await prisma.project.count({
         where: {
            objectiveId: id,
         },
      });

      if (associatedProjects > 0) {
         return NextResponse.json(
            {
               ok: false,
               error: {
                  code: 'E_CONFLICT',
                  message: 'Cannot delete objective with associated projects',
               },
            },
            { status: 409 }
         );
      }

      // Delete objective
      await prisma.objective.delete({
         where: { id },
      });

      return NextResponse.json({
         ok: true,
         data: { message: 'Objective deleted successfully' },
      });
   } catch (error) {
      console.error('Error deleting objective:', error);
      return handleAPIError(error);
   }
}
