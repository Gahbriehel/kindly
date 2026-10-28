export interface ISubscriptionPlan {
  id: string;
  name: string;
  displayName: string;
  price: string;
  priceAmount: number;
  billingInterval: string;
  /**
   * Client limit for this plan.
   * NOTE: Set to 5 for Basic currently; update to 20 (or management decision)
   * when reconciling frontend and backend. Set to null for unlimited.
   */
  clientLimit: number | null;
  description: string;
  features: string[];
  notIncluded: string[];
  color: string;
  buttonColor: "outline" | "primary" | "gradient";
  popular?: boolean;
}

export const SUBSCRIPTION_PLANS: ISubscriptionPlan[] = [
  {
    id: "BASIC",
    name: "BASIC",
    displayName: "Basic",
    price: "$0",
    priceAmount: 0,
    billingInterval: "/month",
    clientLimit: 5, // Easily editable here when reconciling with backend (e.g. change to 20)
    description: "Ideal for creators getting started.",
    features: [
      "Up to 5 clients",
      "Personal template library",
      "Full dashboard access",
    ],
    notIncluded: ["Unlimited client management", "Dedicated account manager"],
    color:
      "border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/40",
    buttonColor: "outline",
  },
  {
    id: "PREMIUM",
    name: "PREMIUM",
    displayName: "Premium",
    price: "$19",
    priceAmount: 19,
    billingInterval: "/month",
    clientLimit: null, // Unlimited
    description: "Perfect for growing professionals.",
    features: [
      "More than 5 clients (Unlimited)",
      "Personal template library",
      "Full dashboard access",
      "Priority email support",
    ],
    notIncluded: ["Dedicated account manager"],
    color:
      "border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/40",
    buttonColor: "primary",
  },
  {
    id: "PLATINUM",
    name: "PLATINUM",
    displayName: "Platinum",
    price: "$40",
    priceAmount: 40,
    billingInterval: "/month",
    clientLimit: null, // Unlimited
    description: "Ultimate power for teams and enterprises.",
    features: [
      "Unlimited clients",
      "Dedicated account manager",
      "Early access to new features",
    ],
    notIncluded: [],
    color:
      "border-theme-primary ring-2 ring-theme-primary/30 bg-theme-primary/5 dark:bg-theme-primary/10 shadow-lg shadow-theme-primary/5",
    buttonColor: "gradient",
    popular: true,
  },
];

export const getSubscriptionPlan = (tier?: string): ISubscriptionPlan => {
  const match = SUBSCRIPTION_PLANS.find(
    (p) => p.name.toUpperCase() === tier?.toUpperCase(),
  );
  return match || SUBSCRIPTION_PLANS[0];
};

export const getNextUpgradePlan = (currentTier?: string): ISubscriptionPlan => {
  const upper = currentTier?.toUpperCase();
  if (upper === "BASIC") {
    return (
      SUBSCRIPTION_PLANS.find((p) => p.name === "PREMIUM") ||
      SUBSCRIPTION_PLANS[1]
    );
  }
  return (
    SUBSCRIPTION_PLANS.find((p) => p.name === "PLATINUM") ||
    SUBSCRIPTION_PLANS[2]
  );
};
