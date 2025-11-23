// src/config/plans.ts

// Usa os mesmos valores dos seus enums locais de SubscriptionName
export type PlanId =
  | "STUDENT_FREE"
  | "STUDENT_PREMIUM"
  | "STUDENT_ELITE"
  | "TEACHER_FREE"
  | "TEACHER_PREMIUM";

type PlanType = "student" | "teacher";

export type PlanConfig = {
  id: PlanId;
  label: string;
  description: string;
  type: PlanType;
  monthlyPrice: number | null; // null = grátis
  highlight?: boolean;
};

export const PLANS: PlanConfig[] = [
  {
    id: "STUDENT_FREE",
    label: "Plano Free (Aluno)",
    description: "Acesso limitado às questões e sem IA. Ideal para testar a plataforma.",
    type: "student",
    monthlyPrice: null,
  },
  {
    id: "STUDENT_PREMIUM",
    label: "Plano Premium (Aluno)",
    description:
      "Questões ilimitadas, IA básica e um número limitado de redações corrigidas por mês.",
    type: "student",
    monthlyPrice: 19.9,
  },
  {
    id: "STUDENT_ELITE",
    label: "Plano Elite (Aluno)",
    description:
      "Tudo do Premium + mais redações corrigidas, IA avançada e estatísticas detalhadas.",
    type: "student",
    monthlyPrice: 39.9,
    highlight: true,
  },
  {
    id: "TEACHER_FREE",
    label: "Plano Free (Professor)",
    description:
      "Ferramentas básicas para professores criarem listas e simulados simples.",
    type: "teacher",
    monthlyPrice: null,
  },
  {
    id: "TEACHER_PREMIUM",
    label: "Plano Premium (Professor)",
    description:
      "Simulados ilimitados, turmas, relatórios e recursos avançados para professores.",
    type: "teacher",
    monthlyPrice: 24.9,
  },
];
