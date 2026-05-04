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
    name: "Gabriel Solomon",
    eventName: "Birthday",
    type: "Individual",
    eventDate: "2026-03-12",
    individual: {
      id: "ind_1",
      name: "Gabriel Solomon",
      phoneNumber: "+251 900 000 000",
      email: "babatise002@gmail.com",
      birthDate: "2000-01-01",
    },
  },
  {
    id: "2",
    name: "The Afolabi Family",
    eventName: "Wedding Anniversary",
    type: "multiple",
    eventDate: "2026-04-05",
    multiple: [
      {
        id: "ind_2",
        name: "Michael Afolabi",
        phoneNumber: "+1 234 567 8901",
        email: "michaelafolabi534@gmail.com",
        birthDate: "1988-11-20",
      },
      {
        id: "ind_3",
        name: "Tofunmi Afolabi",
        phoneNumber: "+1 234 567 8902",
        email: "tofunmiafolabi270@gmail.com",
        birthDate: "1992-05-18",
      },
    ],
  },
  {
    id: "3",
    name: "Tobi Bakre",
    eventName: "Birthday",
    type: "Individual",
    eventDate: "2026-05-18",
    individual: {
      id: "ind_4",
      name: "Tobi Bakre",
      phoneNumber: "+234 812 345 6789",
      email: "tobi123@gmail.com",
      birthDate: "2000-01-01",
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
    clientName: "Gabriel Solomon",
    eventType: "Birthday",
    isToday: true,
  },
  {
    id: "2",
    clientName: "The Afolabi Family",
    eventType: "Wedding Anniversary",
    isToday: true,
  },
];

export const dashboardUpcomingEvents: DashboardEvent[] = [
  {
    id: "3",
    clientName: "Tobi Bakre",
    eventType: "Birthday",
    dateInfo: "Tomorrow",
  },
];
