export interface AudienceTab {
  id: string;
  label: string;
  stat: string;
  tracking: string;
  headline: string;
  image: string;
  alt: string;
}

export const whoItsForData = {
  badge: "Who it's for",
  title: "If your work depends on people coming back, this is for you",
  tabs: [
    {
      id: "event-planner",
      label: "Event planners",
      stat: "Manage clients",
      tracking: "Tracking 180 clients",
      headline:
        "The event ends, but the relationship doesn't have to. A note before their next big day is how you stay the planner they call first.",
      image: "/images/persona-event-planner.jpg",
      alt: "An elegantly set event table with a colourful floral centrepiece",
    },
    {
      id: "wedding-photographers",
      label: "Wedding photographers",
      stat: "Wedding anniversary",
      tracking: "Tracking 310 couples",
      headline:
        "You were there for the first year. A note on the anniversary is how you're there for the tenth, the vow renewal, and the referral.",
      image: "/images/persona-wedding-photographer.jpg",
      alt: "A newly engaged couple laughing together outdoors at golden hour",
    },
    {
      id: "small-agencies",
      label: "Small agencies",
      stat: "Shared history",
      tracking: "Tracking 190 client relationships",
      headline:
        "Every client has a history, when they started, what you've built together. Remembering it is how small agencies compete with big ones.",
      image: "/images/persona-small-agency.jpg",
      alt: "A small team of Black professionals collaborating around a table in their office",
    },
    {
      id: "real-estate",
      label: "Real estate agents",
      stat: "Move-in anniversary",
      tracking: "Tracking 420 households",
      headline:
        "The year a family moved in matters more than the day you closed. A note on their move-in anniversary is how you get the next listing.",
      image: "/images/persona-real-estate.jpg",
      alt: "A couple celebrating with keys and moving boxes in their new home",
    },
    {
      id: "financial-advisors",
      label: "Financial advisors",
      stat: "Renewal date",
      tracking: "Tracking 260 client relationships",
      headline:
        "Portfolios get reviewed once a year, at most. A message before the renewal date is what makes a client renew with you, not a competitor.",
      image: "/images/persona-financial-advisor.jpg",
      alt: "A Black couple reviewing financial paperwork together at their kitchen table",
    },
    {
      id: "salons-clinics",
      label: "Salons & clinics",
      stat: "Birthday",
      tracking: "Tracking 650 regulars",
      headline:
        "A birthday message beats a discount code. Clients rebook with the person who remembered, not the business that emailed everyone.",
      image: "/images/persona-salon.jpg",
      alt: "A stylist working with a client inside a salon",
    },
    {
      id: "recruiters",
      label: "Recruiters & consultants",
      stat: "Work anniversary",
      tracking: "Tracking 540 candidates",
      headline:
        "Today's placement is tomorrow's referral. A work anniversary note keeps you top of mind for when they're ready to move again.",
      image: "/images/persona-recruiter.jpg",
      alt: "Two Black professionals shaking hands after a successful placement",
    },
  ] satisfies AudienceTab[],
};
