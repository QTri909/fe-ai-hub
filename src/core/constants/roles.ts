export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  GUEST: 'GUEST',
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];
