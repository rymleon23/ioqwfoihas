import { AssetLibrary } from '@/components/assets/asset-library';

interface AssetsPageProps {
   params: Promise<{
      orgId: string;
   }>;
}

export default async function AssetsPage({ params }: AssetsPageProps) {
   const resolvedParams = await params;
   const { orgId } = resolvedParams;

   return (
      <div className="container mx-auto py-6">
         <AssetLibrary orgId={orgId} />
      </div>
   );
}
