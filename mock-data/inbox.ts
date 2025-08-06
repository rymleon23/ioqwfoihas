import { User, users } from './users';
import { Status, status } from './status';

export type NotificationType =
   | 'comment'
   | 'mention'
   | 'assignment'
   | 'status'
   | 'reopened'
   | 'closed'
   | 'edited'
   | 'created'
   | 'upload';

export interface InboxItem {
   id: string;
   identifier: string;
   title: string;
   content: string;
   type: NotificationType;
   user: User;
   timestamp: string;
   read: boolean;
   status: Status;
}

export const inboxItems: InboxItem[] = [
   {
      id: '1',
      identifier: 'LNUI-101',
      title: 'Refactor Button component for full accessibility compliance',
      content: "I've attached the new design mockup",
      type: 'comment',
      user: users[0],
      timestamp: '10h',
      read: false,
      status: status[0],
   },
   {
      id: '2',
      identifier: 'LNUI-204',
      title: 'Optimize animations for smoother UI transitions',
      content: 'Section renamed from Animations to UI Transitions',
      type: 'comment',
      user: users[1],
      timestamp: '4d',
      read: false,
      status: status[1],
   },
   {
      id: '3',
      identifier: 'LNUI-309',
      title: 'Implement dark mode toggle with system preferences support',
      content: 'Reopened by GitHub',
      type: 'reopened',
      user: users[2],
      timestamp: '6d',
      read: true,
      status: status[2],
   },
   {
      id: '4',
      identifier: 'LNUI-415',
      title: 'Design new modal system with focus trapping',
      content: 'https://github.com/ln-dev7/circle',
      type: 'comment',
      user: users[3],
      timestamp: '13d',
      read: false,
      status: status[3],
   },
   {
      id: '5',
      identifier: 'LNUI-501',
      title: 'Enhance responsiveness of Navbar',
      content: 'Retested on mobile and it works perfectly now',
      type: 'comment',
      user: users[4],
      timestamp: '18d',
      read: true,
      status: status[4],
   },
   {
      id: '6',
      identifier: 'LNUI-502',
      title: 'Optimize loading time of Footer',
      content: 'Updated performance metrics in the documentation',
      type: 'edited',
      user: users[4],
      timestamp: '18d',
      read: false,
      status: status[5],
   },
   {
      id: '7',
      identifier: 'LNUI-503',
      title: 'Refactor Sidebar for better accessibility',
      content: 'Closed by Linear',
      type: 'closed',
      user: users[2],
      timestamp: '4w',
      read: true,
      status: status[3],
   },
   {
      id: '8',
      identifier: 'LNUI-504',
      title: 'Implement new Card component design',
      content: 'Closed by Linear',
      type: 'closed',
      user: users[2],
      timestamp: '4w',
      read: true,
      status: status[1],
   },
   {
      id: '9',
      identifier: 'LNUI-505',
      title: 'Improve Tooltip interactivity',
      content: 'Closed by Linear',
      type: 'closed',
      user: users[2],
      timestamp: '4w',
      read: true,
      status: status[5],
   },
   {
      id: '10',
      identifier: 'LNUI-506',
      title: 'Fix Dropdown menu positioning',
      content:
         'Bug not reproducible on my Firefox mobile. Either it was a temporary issue or a cache problem.',
      type: 'comment',
      user: users[0],
      timestamp: '1mo',
      read: false,
      status: status[2],
   },
   {
      id: '11',
      identifier: 'LNUI-507',
      title: 'Implement annotation tools for PDF viewer',
      content: 'Marked as completed by idriss.ben',
      type: 'status',
      user: users[1],
      timestamp: '5w',
      read: false,
      status: status[3],
   },
   {
      id: '12',
      identifier: 'LNUI-508',
      title: 'Restore previous editor interface',
      content: 'I finished reviewing PR #839 | Review summary: Positive points',
      type: 'comment',
      user: users[5],
      timestamp: '5w',
      read: true,
      status: status[0],
   },
   {
      id: '13',
      identifier: 'LNUI-509',
      title: 'Revamp Button states and interactions',
      content: '🔍 Review completed for PR #808! I did a complete review of your PR',
      type: 'comment',
      user: users[5],
      timestamp: '5w',
      read: true,
      status: status[5],
   },
   {
      id: '14',
      identifier: 'LNUI-510',
      title: 'Dashboard: adapt breadcrumb text in feature view',
      content: 'Reopened by GitHub',
      type: 'reopened',
      user: users[2],
      timestamp: '6w',
      read: false,
      status: status[2],
   },
   {
      id: '15',
      identifier: 'LNUI-511',
      title: 'Fix audio file upload from mobile devices',
      content:
         "@in now that it's in production, I've tested it and don't have the issue anymore; we can close this ticket",
      type: 'mention',
      user: users[4],
      timestamp: '6w',
      read: false,
      status: status[1],
   },
   {
      id: '16',
      identifier: 'LNUI-512',
      title: 'Show transcription preview',
      content: 'leo.samu assigned the issue to you',
      type: 'assignment',
      user: users[6],
      timestamp: '7w',
      read: true,
      status: status[4],
   },
   {
      id: '17',
      identifier: 'LNUI-513',
      title: 'Improve Tooltip interactivity',
      content: 'Marked as completed by samuel.baudry',
      type: 'status',
      user: users[2],
      timestamp: '7w',
      read: true,
      status: status[3],
   },
];

export const filterByReadStatus = (items: InboxItem[], isRead: boolean): InboxItem[] => {
   return items.filter((item) => item.read === isRead);
};

export const filterByType = (items: InboxItem[], type: NotificationType): InboxItem[] => {
   return items.filter((item) => item.type === type);
};

export const filterByUser = (items: InboxItem[], userId: string): InboxItem[] => {
   return items.filter((item) => item.user.id === userId);
};

export const markAsRead = (items: InboxItem[], itemId: string): InboxItem[] => {
   return items.map((item) => (item.id === itemId ? { ...item, read: true } : item));
};

export const markAllAsRead = (items: InboxItem[]): InboxItem[] => {
   return items.map((item) => ({ ...item, read: true }));
};
