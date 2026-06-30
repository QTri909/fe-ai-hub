export const PERMISSIONS = {
  READ_PROJECTS: 'read:projects',
  CREATE_PROJECTS: 'create:projects',
  DELETE_PROJECTS: 'delete:projects',
  MANAGE_USERS: 'manage:users',
} as const;

export type PermissionType = typeof PERMISSIONS[keyof typeof PERMISSIONS];
