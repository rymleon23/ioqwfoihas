import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

interface UpdateTaskVariables {
   taskId: string;
   description?: string;
   // Add other fields as needed
}

export function useUpdateTask() {
   const queryClient = useQueryClient();
   const supabase = createClient();

   return useMutation({
      mutationFn: async ({ taskId, description }: UpdateTaskVariables) => {
         const updates: any = {};
         if (description !== undefined) updates.description = description;

         const { data, error } = await supabase
            .from('task')
            .update(updates)
            .eq('id', taskId)
            .select()
            .single();

         if (error) throw error;
         return data;
      },
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] });
         toast.success('Task updated');
      },
      onError: (error) => {
         toast.error(`Failed to update task: ${error.message}`);
      },
   });
}
