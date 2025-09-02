import prisma from '@/lib/prisma';

async function main() {
   console.log('Seeding database...');

   // Default organization
   const org = await prisma.organization.upsert({
      where: { id: 'org_default_seed' },
      update: {},
      create: { id: 'org_default_seed', name: 'Circle Dev Org' },
   });

   // LNDev UI organization (the one user was trying to access)
   const lndevOrg = await prisma.organization.upsert({
      where: { id: 'lndev-ui' },
      update: {},
      create: { id: 'lndev-ui', name: 'LNDev UI' },
   });

   // Users
   const admin = await prisma.user.upsert({
      where: { email: 'admin@aim.local' },
      update: {},
      create: { email: 'admin@aim.local', name: 'Admin' },
   });
   const creatorUser = await prisma.user.upsert({
      where: { email: 'creator@aim.local' },
      update: {},
      create: { email: 'creator@aim.local', name: 'Creator' },
   });

   // Add the user that's currently logged in
   const rymleonUser = await prisma.user.upsert({
      where: { email: 'rymleon24@gmail.com' },
      update: {},
      create: { email: 'rymleon24@gmail.com', name: 'rymleon24' },
   });

   // Memberships for default org
   await prisma.membership.upsert({
      where: { userId_organizationId: { userId: admin.id, organizationId: org.id } },
      update: { role: 'ADMIN' },
      create: { userId: admin.id, organizationId: org.id, role: 'ADMIN' },
   });
   await prisma.membership.upsert({
      where: { userId_organizationId: { userId: creatorUser.id, organizationId: org.id } },
      update: { role: 'CREATOR' },
      create: { userId: creatorUser.id, organizationId: org.id, role: 'CREATOR' },
   });

   // Add membership for rymleon24 in default org
   await prisma.membership.upsert({
      where: { userId_organizationId: { userId: rymleonUser.id, organizationId: org.id } },
      update: { role: 'ADMIN' },
      create: { userId: rymleonUser.id, organizationId: org.id, role: 'ADMIN' },
   });

   // Add membership for rymleon24 in LNDev UI org
   await prisma.membership.upsert({
      where: { userId_organizationId: { userId: rymleonUser.id, organizationId: lndevOrg.id } },
      update: { role: 'ADMIN' },
      create: { userId: rymleonUser.id, organizationId: lndevOrg.id, role: 'ADMIN' },
   });

   // Demo campaign
   const campaign = await prisma.campaign.upsert({
      where: { id: 'campaign_default_seed' },
      update: {},
      create: {
         id: 'campaign_default_seed',
         name: 'Demo Campaign',
         description: 'A sample campaign for testing',
         organizationId: org.id,
      },
   });

   // Demo content
   await prisma.content.upsert({
      where: { id: 'content_default_seed' },
      update: {},
      create: {
         id: 'content_default_seed',
         title: 'Welcome to AiM',
         body: 'This is your first content piece. Start creating amazing campaigns!',
         campaignId: campaign.id,
      },
   });

   console.log('Seed complete.');
}

main()
   .catch((e) => {
      console.error(e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
