import {
  ShoppingBag,
  Forklift,
  Mail,
  MessageSquare,
  Calendar,
  Kanban,
  ReceiptText,
  Users,
  Lock,
  Fingerprint,
  SquareArrowUpRight,
  LayoutDashboard,
  ChartBar,
  Banknote,
  Gauge,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Administrator",
    items: [
      {
        title: "Provas",
        url: "/dashboard/provas-questoes",
        icon: SquareArrowUpRight,
        comingSoon: false,
      },
      {
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
        comingSoon: false,
      },
      {
        title: "Roles",
        url: "/dashboard/roles",
        icon: Lock,
        comingSoon: false,
      },
      {
        title: "Permissions",
        url: "/dashboard/permissions",
        icon: Fingerprint,
        comingSoon: false,
        isNew: true,
      },
      {
        title: "Planos",
        url: "/dashboard/planos",
        icon: Fingerprint,
        comingSoon: false,
        isNew: true,
      },
      {
        title: "Assinaturas",
        url: "/dashboard/subscriptions",
        icon: Fingerprint,
        comingSoon: false,
        isNew: true,
      },
      {
        title: "Cupoms",
        url: "/dashboard/coupons",
        icon: Fingerprint,
        comingSoon: false,
        isNew: true,
      },
    ],
  },
  {
    id: 2,
    label: "Dashboards",
    items: [
      {
        title: "Default",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        title: "CRM",
        url: "/dashboard/crm",
        icon: ChartBar,
      },
      {
        title: "Finance",
        url: "/dashboard/finance",
        icon: Banknote,
      },
    ],
  },
];
