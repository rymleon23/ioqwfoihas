import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ orgId: string }> }
) {
   try {
      const { orgId } = await params;
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      await requirePermission(session.user.id, orgId, PERMISSIONS.VIEW_ANALYTICS);

      // Get metrics for the org - count events by type
      const eventCounts = await prisma.analyticsEvent.groupBy({
         by: ['event'],
         where: { organizationId: orgId },
         _count: {
            event: true,
         },
      });

      // Get campaign-specific metrics
      const campaignMetrics = await prisma.project.findMany({
         where: { organizationId: orgId },
         include: {
            contents: true,
         },
      });

      // Calculate aggregated metrics
      const totalImpressions = eventCounts.find((e) => e.event === 'impression')?._count.event || 0;
      const totalClicks = eventCounts.find((e) => e.event === 'click')?._count.event || 0;
      const totalViews = eventCounts.find((e) => e.event === 'view')?._count.event || 0;

      const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

      // Calculate ROI (simplified - assuming some conversion value)
      const conversions = eventCounts.find((e) => e.event === 'conversion')?._count.event || 0;
      const roi = conversions > 0 ? ((conversions * 100) / totalClicks) * 100 : 0; // Assuming $100 per conversion

      const metrics = {
         totalEvents: eventCounts.reduce((sum, item) => sum + item._count.event, 0),
         eventsByType: eventCounts.reduce(
            (acc, item) => {
               acc[item.event] = item._count.event;
               return acc;
            },
            {} as Record<string, number>
         ),
         impressions: totalImpressions,
         clicks: totalClicks,
         views: totalViews,
         ctr: ctr,
         roi: roi,
         campaignMetrics: campaignMetrics.map((campaign) => ({
            id: campaign.id,
            name: campaign.name,
            totalEvents: 0, // Project doesn't have direct analyticsEvents
            contentCount: campaign.contents?.length || 0,
            contentMetrics:
               campaign.contents?.map((content: any) => ({
                  id: content.id,
                  title: content.title,
                  events: 0, // No direct analytics events on content
                  impressions: 0,
                  clicks: 0,
                  views: 0,
               })) || [],
         })),
      };

      return NextResponse.json(metrics);
   } catch (error) {
      console.error('Error fetching analytics metrics:', error);
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}
