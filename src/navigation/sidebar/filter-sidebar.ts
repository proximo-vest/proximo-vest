import {
  hasRole,
  hasPermission,
  type AuthProfile,
  type RoleName,
  type PermissionKey,
} from "@/utils/access-core";
import type { NavGroup, NavMainItem, NavSubItem } from "./sidebar-items";

type Restrictable = {
  requiredRoles?: RoleName[];
  requiredPerms?: PermissionKey[];
};

function canSee(profile: AuthProfile, item?: Restrictable): boolean {
  if (!item) return true;

  if (item.requiredRoles && item.requiredRoles.length > 0) {
    if (!hasRole(profile, item.requiredRoles)) return false;
  }

  if (item.requiredPerms && item.requiredPerms.length > 0) {
    if (!hasPermission(profile, item.requiredPerms)) return false;
  }

  return true;
}

export function filterSidebar(profile: AuthProfile, groups: NavGroup[]): NavGroup[] {
  return groups
    .map<NavGroup | null>((group) => {
      if (!canSee(profile, group)) return null;

      const items: NavMainItem[] = group.items
        .filter((item) => canSee(profile, item))
        .map((item) => {
          const subItems: NavSubItem[] | undefined = item.subItems
            ?.filter((sub) => canSee(profile, sub));

          return { ...item, subItems };
        })
        .filter((item) => {
          if (!item.subItems) return true;
          return item.subItems.length > 0;
        });

      if (items.length === 0) return null;

      return { ...group, items };
    })
    .filter((g): g is NavGroup => g !== null);
}
