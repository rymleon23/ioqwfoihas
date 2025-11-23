import { useCurrentUser } from './use-current-user';
import { useTeamMembers } from './use-team-members';

export type Action =
   | 'manage_team'
   | 'manage_members'
   | 'create_task'
   | 'edit_task'
   | 'delete_task'
   | 'view_reports';
export type Role = 'owner' | 'admin' | 'member' | 'guest';

const ROLE_PERMISSIONS: Record<Role, Action[]> = {
   owner: [
      'manage_team',
      'manage_members',
      'create_task',
      'edit_task',
      'delete_task',
      'view_reports',
   ],
   admin: [
      'manage_team',
      'manage_members',
      'create_task',
      'edit_task',
      'delete_task',
      'view_reports',
   ],
   member: ['create_task', 'edit_task', 'view_reports'],
   guest: ['view_reports'], // Guest can only view and comment (comment permission implied by view for now)
};

export function usePermission(teamId?: string) {
   const { data: currentUser } = useCurrentUser();
   const { data: teamMembers } = useTeamMembers(teamId);

   const checkPermission = (action: Action): boolean => {
      if (!currentUser || !teamId || !teamMembers) return false;

      // 1. Check if user is workspace admin (optional, if workspace roles override team roles)
      // For now, we stick to team-level roles as per requirements.

      // 2. Find user's role in the team
      const memberRecord = teamMembers.find((m) => m.user_id === currentUser.id);
      if (!memberRecord) return false;

      const userRole = memberRecord.role;
      const allowedActions = ROLE_PERMISSIONS[userRole] || [];

      return allowedActions.includes(action);
   };

   return {
      can: checkPermission,
      role: teamMembers?.find((m) => m.user_id === currentUser?.id)?.role,
      isLoading: !currentUser || (!!teamId && !teamMembers),
   };
}
