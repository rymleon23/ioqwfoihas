'use client';

import { InboxItem } from '@/mock-data/inbox';
import { useNotificationsStore } from '@/store/notifications-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { renderStatusIcon } from '@/lib/status-utils';
import { getNotificationIcon } from '@/lib/notification-utils';
import { Button } from '@/components/ui/button';
import { NotificationBox } from './icons/motification-box';
import { Check } from 'lucide-react';

interface IssuePreviewProps {
   notification?: InboxItem;
   onMarkAsRead?: (id: string) => void;
}

export default function IssuePreview({ notification, onMarkAsRead }: IssuePreviewProps) {
   const { getUnreadCount } = useNotificationsStore();

   if (!notification) {
      const unreadCount = getUnreadCount();

      return (
         <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <NotificationBox className="w-16 h-16 mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
               {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
               Select a notification from the list to view its details and take action.
            </p>
         </div>
      );
   }

   return (
      <div className="flex flex-col h-full">
         <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
               <div className="relative">
                  <Avatar className="size-10">
                     <AvatarImage src={notification.user.avatarUrl} alt={notification.user.name} />
                     <AvatarFallback className="text-sm">
                        {notification.user.name
                           .split(' ')
                           .map((n) => n[0])
                           .join('')}
                     </AvatarFallback>
                  </Avatar>

                  <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-background border-2 border-background flex items-center justify-center">
                     {getNotificationIcon(notification.type, 'size-3')}
                  </div>
               </div>

               <div>
                  <h2 className="font-semibold text-foreground">{notification.user.name}</h2>
                  <p className="text-sm text-muted-foreground">{notification.timestamp}</p>
               </div>
            </div>

            <div className="flex items-center gap-2">
               {!notification.read && onMarkAsRead && (
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => onMarkAsRead(notification.id)}
                     className="gap-2"
                  >
                     <Check className="size-4" />
                     Mark as read
                  </Button>
               )}
            </div>
         </div>

         <div className="flex-1 p-6 space-y-4">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
               <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                     {notification.identifier}
                  </span>

                  <div className="shrink-0">{renderStatusIcon(notification.status.id)}</div>
               </div>
            </div>

            <div>
               <h3 className="text-xl font-semibold text-foreground mb-2">{notification.title}</h3>
            </div>

            <div className="prose prose-sm max-w-none">
               <p className="text-foreground leading-relaxed">{notification.content}</p>
            </div>
         </div>
      </div>
   );
}
