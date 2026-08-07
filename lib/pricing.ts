import { allCategories, type Category, type ToolStatus } from "@/lib/categories";

export type PlanId = "free" | "pro" | "studio" | "business";
export type BillingCycle = "monthly" | "annual";

export interface PricingPlan {
  id: PlanId;
  name: string;
  monthlyPriceUsd: number;
  annualPriceUsd: number;
  description: string;
  accent: string;
  ctaByCycle: Record<BillingCycle, string>;
  targetUser: string;
  isMostPopular?: boolean;
  features: string[];
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    monthlyPriceUsd: 0,
    annualPriceUsd: 0,
    description: "Start with the public prompt studio and core app navigation.",
    accent: "#0ea5e9",
    targetUser: "Creators validating ideas",
    ctaByCycle: {
      monthly: "/",
      annual: "/",
    },
    features: [
      "Story-to-scene prompt generation",
      "Public AI tools hub",
      "Quick tools and calculators",
      "Workspace and profile pages",
      "Free tools marked in the catalog",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPriceUsd: 29,
    annualPriceUsd: 278,
    description: "Unlock premium image, audio, and video workflows for solo professionals.",
    accent: "#7c5df6",
    targetUser: "Freelancers and solo creators",
    isMostPopular: true,
    ctaByCycle: {
      monthly: "/api/billing/checkout?plan=pro&cycle=monthly",
      annual: "/api/billing/checkout?plan=pro&cycle=annual",
    },
    features: [
      "Premium AI image generation",
      "Voiceover and dubbing workflows",
      "Video generation and editing tools",
      "Advanced prompt and export features",
      "Priority access to paid catalog items",
    ],
  },
  {
    id: "studio",
    name: "Studio",
    monthlyPriceUsd: 79,
    annualPriceUsd: 758,
    description: "Higher monthly capacity for agencies, production teams, and multi-project pipelines.",
    accent: "#f59e0b",
    targetUser: "Agencies and small teams",
    ctaByCycle: {
      monthly: "/api/billing/checkout?plan=studio&cycle=monthly",
      annual: "/api/billing/checkout?plan=studio&cycle=annual",
    },
    features: [
      "Everything in Pro",
      "Team production workflow access",
      "Higher generation capacity",
      "Faster processing priority",
      "Advanced operational support",
    ],
  },
  {
    id: "business",
    name: "Business",
    monthlyPriceUsd: 199,
    annualPriceUsd: 1910,
    description: "Enterprise-ready plan with top-tier throughput and account support.",
    accent: "#22c55e",
    targetUser: "Scaling businesses and high-volume teams",
    ctaByCycle: {
      monthly: "/api/billing/checkout?plan=business&cycle=monthly",
      annual: "/api/billing/checkout?plan=business&cycle=annual",
    },
    features: [
      "Everything in Studio",
      "Maximum generation throughput",
      "Operational priority and SLA alignment",
      "Centralized billing workflow",
      "Launch and migration support",
    ],
  },
];

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getPlanCyclePrice(plan: PricingPlan, cycle: BillingCycle) {
  return cycle === "monthly" ? plan.monthlyPriceUsd : plan.annualPriceUsd;
}

export function getPlanCycleLabel(cycle: BillingCycle) {
  return cycle === "monthly" ? "per month" : "per year";
}

export function getAnnualMonthlyEquivalent(plan: PricingPlan) {
  if (plan.annualPriceUsd <= 0) return 0;
  return plan.annualPriceUsd / 12;
}

export function getAnnualSavingsPercent(plan: PricingPlan) {
  if (plan.monthlyPriceUsd <= 0) return 0;
  const fullYearAtMonthly = plan.monthlyPriceUsd * 12;
  const savings = fullYearAtMonthly - plan.annualPriceUsd;
  if (savings <= 0) return 0;
  return Math.round((savings / fullYearAtMonthly) * 100);
}

export function getPlanCtaLabel(plan: PricingPlan, cycle: BillingCycle) {
  if (plan.id === "free") return "Start Free";
  return cycle === "annual" ? `Choose ${plan.name} Annual` : `Choose ${plan.name} Monthly`;
}

export function getToolPlanLabel(status: ToolStatus) {
  if (status === "free") return "Free";
  if (status === "pro") return "Pro";
  return "Coming soon";
}

export function summarizeCategoryAccess(category: Category) {
  const counts = category.tools.reduce(
    (accumulator, tool) => {
      accumulator[tool.status] += 1;
      return accumulator;
    },
    { free: 0, pro: 0, soon: 0 } as Record<ToolStatus, number>
  );

  const labelParts = [
    counts.free ? `${counts.free} Free` : "",
    counts.pro ? `${counts.pro} Pro` : "",
    counts.soon ? `${counts.soon} Soon` : "",
  ].filter(Boolean);

  return {
    label: labelParts.length > 0 ? labelParts.join(" + ") : "Unavailable",
    detail:
      counts.pro > 0 && counts.free > 0
        ? `${counts.free} free tools and ${counts.pro} pro tools`
        : counts.pro > 0
          ? `${counts.pro} pro tools`
          : `${counts.free} free tools`,
    counts,
  };
}

export const publicFeatureSteps = allCategories.map((category, index) => ({
  step: index + 1,
  category,
  access: summarizeCategoryAccess(category),
}));
