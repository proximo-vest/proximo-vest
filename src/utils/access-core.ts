// src/utils/access-core.ts

export type RoleName = string;      // ex.: "Admin"
export type PermissionKey = string; // ex.: "exam.publish"

export type AuthProfile = {
  emailVerified: boolean;
  status: "active" | "suspended" | "deleted";
  roles: RoleName[];
  perms: PermissionKey[];
};

export function hasRole(profile: AuthProfile, role: RoleName | RoleName[]) {
  if (Array.isArray(role)) {
    // OR: basta ter um
    return role.some((r) => profile.roles.includes(r));
  }
  return profile.roles.includes(role);
}

export function hasPermission(
  profile: AuthProfile,
  perm: PermissionKey | PermissionKey[]
) {
  if (Array.isArray(perm)) {
    // OR: basta ter uma perm
    return perm.some((p) => profile.perms.includes(p));
  }
  return profile.perms.includes(perm);
}

export function can(
  profile: AuthProfile,
  opts?: { role?: RoleName | RoleName[]; perm?: PermissionKey | PermissionKey[] }
) {
  if (!opts) return true;

  const roleOk = opts.role ? hasRole(profile, opts.role) : true;
  const permOk = opts.perm ? hasPermission(profile, opts.perm) : true;

  return roleOk && permOk;
}
