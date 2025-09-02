import { ContentEditor } from '@/components/content/content-editor';

interface ContentPageProps {
   params: {
      orgId: string;
   };
}

export default function ContentPage({ params }: ContentPageProps) {
   const { orgId } = params;

   return (
      <div className="container mx-auto py-6">
         <ContentEditor orgId={orgId} />
      </div>
   );
}
