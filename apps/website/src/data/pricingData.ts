export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number | string;
    yearly: number | string;
    period?: string;
  };
  isPopular?: boolean;
  popularBadge?: string;
  includedHeader?: string;
  features: string[];
  cta: {
    text: string;
    href: string;
    variant: "primary" | "outline";
  };
}

export interface PricingSectionData {
  badge: string;
  title: string;
  subtitle: string;
  billingToggle: {
    monthlyLabel: string;
    yearlyLabel: string;
    discountBadge: string;
  };
  plans: PricingPlan[];
  footerNote: string;
}

export const pricingData: PricingSectionData = {
  badge: "Pricing",
  title: "Start free, pay when your list grows",
  subtitle:
    "Every plan keeps your clients, milestones and message history. Move up only when you run out of room.",
  billingToggle: {
    monthlyLabel: "monthly",
    yearlyLabel: "yearly",
    discountBadge: "-20%",
  },
  plans: [
    {
      id: "starter",
      name: "Starter",
      description: "Everything you need to stay in touch",
      price: {
        monthly: "Free",
        yearly: "Free",
      },
      features: [
        "Up to 5 clients",
        "3 message templates",
        "Email reminders",
        "Birthday and anniversary tracking",
      ],
      cta: {
        text: "Current plan",
        href: "/register",
        variant: "outline",
      },
    },
    {
      id: "plus",
      name: "Plus",
      description: "For a growing list and a small team",
      price: {
        monthly: "$20",
        yearly: "$16",
        period: "/ Monthly",
      },
      isPopular: true,
      popularBadge: "Most Popular",
      includedHeader: "Starterpackage included +",
      features: [
        "Up to 50 clients",
        "3 staff seats",
        "Unlimited templates",
        "SMS and WhatsApp sending",
        "Group clients and households",
      ],
      cta: {
        text: "Get started",
        href: "/register",
        variant: "primary",
      },
    },
    {
      id: "platinum",
      name: "Platinum",
      description: "For teams who never miss a milestone",
      price: {
        monthly: "$40",
        yearly: "$32",
        period: "/ Monthly",
      },
      includedHeader: "Pluspackage included +",
      features: [
        "Unlimited clients",
        "Unlimited staff seats",
        "Shared templates and approvals",
        "Custom milestone types",
        "Priority support",
      ],
      cta: {
        text: "Upgrade now",
        href: "/register",
        variant: "outline",
      },
    },
  ],
  footerNote: "Cancel any time. Your clients and message history stay yours.",
};
