import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createScheduleSchema } from '@/lib/schemas';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';

export async function GET(request: NextRequest, { params }: { params: { orgId: string } }) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { orgId } = params;
      const { searchParams } = new URL(request.url);
      const campaignId = searchParams.get('campaignId');

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_SCHEDULES);

      const where = campaignId
         ? { campaign: { organizationId: orgId }, campaignId }
         : { campaign: { organizationId: orgId } };

      const schedules = await prisma.schedule.findMany({
         where,
         include: {
            campaign: true,
            content: true,
         },
      });

      return NextResponse.json(schedules);
   } catch (error) {
      console.error('Error fetching schedules:', error);
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}

export async function POST(request: NextRequest, { params }: { params: { orgId: string } }) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { orgId } = params;

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_SCHEDULES);

      const body = await request.json();
      const validatedData = createScheduleSchema.parse(body);

      // Verify campaign belongs to org
      const campaign = await prisma.campaign.findFirst({
         where: { id: validatedData.campaignId, organizationId: orgId },
      });
      if (!campaign) {
         return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
      }

      const schedule = await prisma.schedule.create({
         data: validatedData,
         include: {
            campaign: true,
         },
      });

      return NextResponse.json(schedule, { status: 201 });
   } catch (error) {
      console.error('Error creating schedule:', error);
      if (error instanceof Error && error.message === 'Insufficient permissions') {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}
