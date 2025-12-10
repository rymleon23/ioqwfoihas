'use client';

import { useState } from 'react';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ScheduleModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   defaultContent?: string;
}

export function ScheduleModal({ open, onOpenChange, defaultContent }: ScheduleModalProps) {
   const [platform, setPlatform] = useState('twitter');
   const [content, setContent] = useState(defaultContent || '');
   const [date, setDate] = useState<Date | undefined>(new Date());
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleSchedule = async () => {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
         `Scheduled for ${platform} on ${date ? format(date, 'MMM d') : 'selected date'}`
      );
      setIsSubmitting(false);
      onOpenChange(false);
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>Schedule to Social Media</DialogTitle>
               <DialogDescription>Create a post based on this task.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="space-y-2">
                  <label className="text-sm font-medium">Platform</label>
                  <Select value={platform} onValueChange={setPlatform}>
                     <SelectTrigger>
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="twitter">Twitter / X</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                     </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                     value={content}
                     onChange={(e) => setContent(e.target.value)}
                     className="h-32"
                     placeholder="Write your post..."
                  />
                  <div className="text-xs text-muted-foreground text-right">
                     {content.length} characters
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium">Schedule for</label>
                  <Popover>
                     <PopoverTrigger asChild>
                        <Button
                           variant={'outline'}
                           className="w-full justify-start text-left font-normal"
                        >
                           <CalendarIcon className="mr-2 h-4 w-4" />
                           {date ? format(date, 'PPP') : <span>Pick a date</span>}
                        </Button>
                     </PopoverTrigger>
                     <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                     </PopoverContent>
                  </Popover>
               </div>
            </div>
            <DialogFooter>
               <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
               </Button>
               <Button onClick={handleSchedule} disabled={isSubmitting}>
                  {isSubmitting ? 'Scheduling...' : 'Schedule Post'}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
