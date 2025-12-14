import { redirect } from 'next/navigation';

interface OrgIdPageProps {
   params: Promise<{
      orgId: string;
   }>;
}

export default async function OrgIdPage({ params }: OrgIdPageProps) {
   const { orgId } = await params;

   // Redirect immediately to All Tasks view as requested by user
   redirect(`/${orgId}/all-tasks`);
}
