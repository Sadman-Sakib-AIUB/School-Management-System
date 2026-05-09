import { ROLES } from "./roles";

/**
 * @description Maps each role to its default dashboard route after login.
 */
export const ROLE_ROUTES = {
  [ROLES.PRINCIPAL]: "/dashboard/principal",
  [ROLES.ADMIN]: "/dashboard/admin",
  [ROLES.TEACHER]: "/dashboard/teacher",
  [ROLES.STUDENT]: "/dashboard/student",
  [ROLES.GUARDIAN]: "/dashboard/parent",
  [ROLES.STAFF]: "/dashboard/staff",
};

/**
 * @description Maps each protected route prefix to the roles allowed to access it.
 * Used by Next.js middleware for strict role-to-route enforcement.
 */
export const ROUTE_ROLE_MAP = {
  "/dashboard/principal": [ROLES.PRINCIPAL],
  "/dashboard/admin": [ROLES.ADMIN],
  "/dashboard/teacher": [ROLES.TEACHER],
  "/dashboard/student": [ROLES.STUDENT],
  "/dashboard/parent": [ROLES.GUARDIAN],
  "/dashboard/staff": [ROLES.STAFF],
};

export const PUBLIC_ROUTES = ["/login", "/unauthorized"];
export const LOGIN_ROUTE = "/login";
export const UNAUTHORIZED_ROUTE = "/unauthorized";