import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { updateCampaignSchema } from '@/lib/schemas';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';

export async function GET(
   request: NextRequest,
   { params }: { params: { orgId: string; id: string } }
) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { orgId, id } = params;

      // Check access
      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_CONTENT);

      const campaign = await prisma.campaign.findFirst({
         where: { id, organizationId: orgId },
         include: {
            contents: true,
            schedules: true,
         },
      });

      if (!campaign) {
         return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
      }

      return NextResponse.json(campaign);
   } catch (error) {
      console.error('Error fetching campaign:', error);
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}

export async function PUT(
   request: NextRequest,
   { params }: { params: { orgId: string; id: string } }
) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { orgId, id } = params;

      // Require permission
      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_CAMPAIGNS);

      const body = await request.json();
      const validatedData = updateCampaignSchema.parse(body);

      const campaign = await prisma.campaign.update({
         where: { id },
         data: validatedData,
      });

      return NextResponse.json(campaign);
   } catch (error) {
      console.error('Error updating campaign:', error);
      if (error instanceof Error && error.message === 'Insufficient permissions') {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}

export async function DELETE(
   request: NextRequest,
   { params }: { params: { orgId: string; id: string } }
) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { orgId, id } = params;

      // Require permission
      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_CAMPAIGNS);

      await prisma.campaign.delete({
         where: { id },
      });

      return NextResponse.json({ message: 'Campaign deleted' });
   } catch (error) {
      console.error('Error deleting campaign:', error);
      if (error instanceof Error && error.message === 'Insufficient permissions') {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}
