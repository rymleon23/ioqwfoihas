import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import type { InternalRole } from '@prisma/client';
import { auth } from '@/lib/auth';

const bodySchema = z.object({
   brandName: z.string().min(2).max(100),
   inviteCreatorEmail: z.string().email().optional(),
   internalRole: z
      .union([
         z.literal('DESIGNER'),
         z.literal('CONTENT'),
         z.literal('ACCOUNT'),
         z.literal('MANAGER'),
      ])
      .nullish(),
});

export async function POST(req: Request) {
   const session = await auth();
   if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   const userId = session.user.id;

   const json = await req.json().catch(() => ({}));
   const parsed = bodySchema.safeParse(json);
   if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
   }
   const { brandName, inviteCreatorEmail, internalRole } = parsed.data;

   // Resolve or create default organization
   const existingMembership = await prisma.membership.findFirst({ where: { userId } });
   let organizationId: string;
   if (existingMembership) {
      organizationId = existingMembership.organizationId;
   } else {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const org = await prisma.organization.create({
         data: { name: `Workspace for ${user?.name || user?.email || 'user'}` },
      });
      organizationId = org.id;
   }

   const brand = await prisma.brand.create({ data: { name: brandName, organizationId } });

   // Ensure membership for current user as BRAND_OWNER
   await prisma.membership.upsert({
      where: { userId_organizationId: { userId, organizationId } },
      update: { role: 'BRAND_OWNER', internalRole: (internalRole as InternalRole | null) ?? null },
      create: {
         userId,
         organizationId,
         role: 'BRAND_OWNER',
         internalRole: (internalRole as InternalRole | null) ?? null,
      },
   });

   if (inviteCreatorEmail) {
      // Create or find creator user
      let invited = await prisma.user.findUnique({ where: { email: inviteCreatorEmail } });
      if (!invited) {
         invited = await prisma.user.create({
            data: { email: inviteCreatorEmail, name: inviteCreatorEmail.split('@')[0] },
         });
      }
      // Ensure creator profile
      const creator = await prisma.creatorProfile.upsert({
         where: { userId: invited.id },
         update: {},
         create: { userId: invited.id },
      });
      // Ensure membership of invited creator to org
      await prisma.membership.upsert({
         where: { userId_organizationId: { userId: invited.id, organizationId } },
         update: { role: 'CREATOR' },
         create: { userId: invited.id, organizationId, role: 'CREATOR' },
      });
      // Link creator to brand
      await prisma.creatorBrand.upsert({
         where: { brandId_creatorProfileId: { brandId: brand.id, creatorProfileId: creator.id } },
         update: {},
         create: { brandId: brand.id, creatorProfileId: creator.id },
      });
   }

   return NextResponse.json({ ok: true, organizationId });
}
