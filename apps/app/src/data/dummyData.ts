export interface ApiClientPerson {
  id?: string;
  name: string;
  phoneNumber: string;
  email: string;
  birthDate: string;
}

export interface ApiClient {
  id: string;
  name: string;
  eventName: string;
  type: "Individual" | "multiple";
  eventDate: string;
  individual?: ApiClientPerson;
  multiple?: ApiClientPerson[];
}

export const clientsList: ApiClient[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    eventName: "Birthday",
    type: "Individual",
    eventDate: "2026-03-12",
    individual: {
      id: "ind_1",
      name: "Sarah Johnson",
      phoneNumber: "+1 234 567 8900",
      email: "sarah.j@email.com",
      birthDate: "1990-03-12",
    },
  },
  {
    id: "2",
    name: "The Chen Family",
    eventName: "Wedding Anniversary",
    type: "multiple",
    eventDate: "2026-04-05",
    multiple: [
      {
        id: "ind_2",
        name: "Michael Chen",
        phoneNumber: "+1 234 567 8901",
        email: "michael.c@email.com",
        birthDate: "1988-11-20",
      },
      {
        id: "ind_3",
        name: "Lisa Chen",
        phoneNumber: "+1 234 567 8902",
        email: "lisa.c@email.com",
        birthDate: "1992-05-18",
      },
    ],
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    eventName: "Birthday",
    type: "Individual",
    eventDate: "2026-05-18",
    individual: {
      id: "ind_4",
      name: "Emma Rodriguez",
      phoneNumber: "+1 234 567 8903",
      email: "emma.r@email.com",
      birthDate: "1995-05-18",
    },
  },
];

export interface DashboardEvent {
  id: string;
  clientName: string;
  eventType: string;
  dateInfo?: string;
  isToday?: boolean;
}

export const dashboardTodayEvents: DashboardEvent[] = [
  {
    id: "1",
    clientName: "Sarah Johnson",
    eventType: "Birthday",
    isToday: true,
  },
  {
    id: "2",
    clientName: "The Chen Family",
    eventType: "Anniversary",
    isToday: true,
  },
];

export const dashboardUpcomingEvents: DashboardEvent[] = [
  {
    id: "3",
    clientName: "Emma Rodriguez",
    eventType: "Birthday",
    dateInfo: "Tomorrow",
  },
];
