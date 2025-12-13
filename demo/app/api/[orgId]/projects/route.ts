import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import {
   projectSchema,
   paginationSchema,
   validateIncludeParam,
   PROJECT_INCLUDE_RELATIONS,
   handleAPIError,
   createPaginationResponse,
} from '@/lib/schemas/api';
import { APIError } from '@/lib/api-utils';

// Validation schemas
const createProjectSchema = projectSchema;

const getProjectsSchema = z.object({
   status: z.enum(['DRAFT', 'PLANNING', 'READY', 'DONE', 'CANCELED']).nullable().optional(),
   health: z.enum(['ON_TRACK', 'AT_RISK', 'OFF_TRACK']).nullable().optional(),
   priority: z.enum(['NO_PRIORITY', 'LOW', 'MEDIUM', 'HIGH', 'URGENT']).nullable().optional(),
   search: z.string().nullable().optional(),
   objectiveId: z.string().nullable().optional(),
   phaseId: z.string().nullable().optional(),
   include: z.string().optional(),
   page: z.coerce.number().min(1).default(1),
   limit: z.coerce.number().min(1).max(100).default(20),
});

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ orgId: string }> }
) {
   try {
      const { orgId } = await params;
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
      const query = getProjectsSchema.parse({
         status: searchParams.get('status'),
         health: searchParams.get('health'),
         priority: searchParams.get('priority'),
         search: searchParams.get('search'),
         objectiveId: searchParams.get('objectiveId'),
         phaseId: searchParams.get('phaseId'),
         include: searchParams.get('include'),
         page: searchParams.get('page'),
         limit: searchParams.get('limit'),
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
         ? validateIncludeParam(query.include, PROJECT_INCLUDE_RELATIONS)
         : { objective: true, phase: true, lead: true, members: true };

      // Build where clause
      const where: any = {
         organizationId: orgId,
      };

      if (query.status) {
         where.status = query.status;
      }

      if (query.health) {
         where.health = query.health;
      }

      if (query.priority) {
         where.priority = query.priority;
      }

      if (query.objectiveId) {
         where.objectiveId = query.objectiveId;
      }

      if (query.phaseId) {
         where.phaseId = query.phaseId;
      }

      if (query.search) {
         where.OR = [
            { name: { contains: query.search, mode: 'insensitive' } },
            { summary: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } },
         ];
      }

      // Get total count for pagination
      const total = await prisma.project.count({ where });

      // Build include object for Prisma
      const include: any = {
         // Existing relationships
         contents: true,
         schedules: true,
         tasks: {
            select: { id: true, title: true, status: true, priority: true },
         },
         labels: true,
         milestones: true,
         members: {
            include: {
               user: {
                  select: { id: true, name: true, email: true, image: true },
               },
            },
         },
         analyticsEvents: {
            select: { id: true, event: true, createdAt: true },
         },
      };

      // Add new relationships based on include parameter
      if (includeRelations.objective) {
         include.objective = {
            select: {
               id: true,
               title: true,
               description: true,
               status: true,
               priority: true,
               startDate: true,
               endDate: true,
               completedAt: true,
               createdAt: true,
            },
         };
      }

      if (includeRelations.phase) {
         include.phase = {
            select: {
               id: true,
               title: true,
               description: true,
               status: true,
               startDate: true,
               endDate: true,
               completedAt: true,
               createdAt: true,
            },
         };
      }

      if (includeRelations.lead) {
         include.lead = {
            select: { id: true, name: true, email: true, image: true },
         };
      }

      if (includeRelations.activities) {
         include.activities = {
            select: {
               id: true,
               type: true,
               description: true,
               metadata: true,
               createdAt: true,
               user: {
                  select: { id: true, name: true, email: true, image: true },
               },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
         };
      }

      // Add phases relationship for projects
      if (includeRelations.phases) {
         include.phases = {
            select: {
               id: true,
               title: true,
               description: true,
               status: true,
               startDate: true,
               endDate: true,
               completedAt: true,
               createdAt: true,
               tasks: {
                  select: {
                     id: true,
                     title: true,
                     status: true,
                     priority: true,
                     assignee: {
                        select: { id: true, name: true, email: true },
                     },
                  },
               },
            },
            orderBy: { createdAt: 'asc' },
         };
      }

      // Add social media posts relationship
      if (includeRelations.socialMediaPosts) {
         include.socialMediaPosts = {
            include: {
               socialMediaAccount: {
                  select: {
                     id: true,
                     platform: true,
                     username: true,
                     displayName: true,
                     avatarUrl: true,
                     isActive: true,
                  },
               },
               task: {
                  select: { id: true, title: true, status: true },
               },
            },
            orderBy: { scheduledAt: 'asc' },
         };
      }

      // Get projects with pagination
      const projects = await prisma.project.findMany({
         where,
         include,
         orderBy: { createdAt: 'desc' },
         skip: (query.page - 1) * query.limit,
         take: query.limit,
      });

      return createPaginationResponse(projects, query.page, query.limit, total);
   } catch (error) {
      console.error('Error fetching projects:', error);
      return handleAPIError(error);
   }
}

export async function POST(
   request: NextRequest,
   { params }: { params: Promise<{ orgId: string }> }
) {
   try {
      const { orgId } = await params;
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

      // Only ADMIN and BRAND_OWNER can create projects
      if (!['ADMIN', 'BRAND_OWNER'].includes(membership.role)) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_INSUFFICIENT_PERMISSIONS', message: 'Insufficient permissions' },
            },
            { status: 403 }
         );
      }

      const body = await request.json();
      const validatedData = createProjectSchema.parse(body);

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

      // Validate phase exists if provided
      if (validatedData.phaseId) {
         const phase = await prisma.phase.findFirst({
            where: {
               id: validatedData.phaseId,
               organizationId: orgId,
            },
         });
         if (!phase) {
            throw new APIError('Phase not found', 404, 'PHASE_NOT_FOUND');
         }
      }

      // Validate lead exists if provided
      if (validatedData.leadId) {
         const lead = await prisma.user.findUnique({
            where: { id: validatedData.leadId },
         });
         if (!lead) {
            throw new APIError('Lead user not found', 404, 'LEAD_NOT_FOUND');
         }
      }

      // Create project
      const project = await prisma.project.create({
         data: {
            ...validatedData,
            organizationId: orgId,
         },
         include: {
            contents: true,
            schedules: true,
            objective: {
               select: { id: true, title: true, status: true, priority: true },
            },
            phase: {
               select: { id: true, title: true, status: true },
            },
            lead: {
               select: { id: true, name: true, email: true, image: true },
            },
            members: {
               include: {
                  user: {
                     select: { id: true, name: true, email: true, image: true },
                  },
               },
            },
         },
      });

      // Add creator as project member with MEMBER role
      await prisma.projectMember.create({
         data: {
            projectId: project.id,
            userId: session.user.id,
            role: 'MEMBER',
         },
      });

      return NextResponse.json(
         {
            ok: true,
            data: project,
         },
         { status: 201 }
      );
   } catch (error) {
      console.error('Error creating project:', error);
      return handleAPIError(error);
   }
}
