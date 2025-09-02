import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createCampaignSchema } from '@/lib/schemas';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';

export async function GET(request: NextRequest, { params }: { params: { orgId: string } }) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { orgId } = params;

      // Check if user has access to the org (at least CREATOR)
      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_CONTENT);

      const campaigns = await prisma.campaign.findMany({
         where: { organizationId: orgId },
         include: {
            contents: true,
            schedules: true,
         },
      });

      return NextResponse.json(campaigns);
   } catch (error) {
      console.error('Error fetching campaigns:', error);
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

      // Require BRAND_OWNER or ADMIN to create campaigns
      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_CAMPAIGNS);

      const body = await request.json();
      const validatedData = createCampaignSchema.parse(body);

      const campaign = await prisma.campaign.create({
         data: {
            ...validatedData,
            organizationId: orgId,
         },
      });

      return NextResponse.json(campaign, { status: 201 });
   } catch (error) {
      console.error('Error creating campaign:', error);
      if (error instanceof Error && error.message === 'Insufficient permissions') {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}
