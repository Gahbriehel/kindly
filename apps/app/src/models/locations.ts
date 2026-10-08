import { IBaseResponse } from "./base";

export interface ICountry {
  name: string;
  phoneCode: string;
  capital?: string;
  currency?: string;
  stateCount?: number;
}

export interface ICountriesResponse extends IBaseResponse {
  data: {
    countries: ICountry[];
  };
}

export const FALLBACK_COUNTRIES: ICountry[] = [
  { name: "Nigeria", phoneCode: "234" },
  { name: "United States", phoneCode: "1" },
  { name: "United Kingdom", phoneCode: "44" },
  { name: "Canada", phoneCode: "1" },
  { name: "South Africa", phoneCode: "27" },
  { name: "Kenya", phoneCode: "254" },
  { name: "Ghana", phoneCode: "233" },
  { name: "Australia", phoneCode: "61" },
  { name: "Germany", phoneCode: "49" },
  { name: "France", phoneCode: "33" },
  { name: "United Arab Emirates", phoneCode: "971" },
  { name: "India", phoneCode: "91" },
];

export interface IIndustry {
  code: string;
  name: string;
  category: string;
}

export interface IIndustriesResponse extends IBaseResponse {
  data: {
    categories: string[];
    industries: IIndustry[];
  };
}

export const FALLBACK_INDUSTRIES: IIndustry[] = [
  { code: "EVENTS", name: "Events", category: "Events" },
  { code: "PHOTOGRAPHY", name: "Photography", category: "Creative" },
  { code: "VIDEOGRAPHY", name: "Videography", category: "Creative" },
  { code: "AGENCY", name: "Agency", category: "Marketing" },
  { code: "MARKETING", name: "Marketing", category: "Marketing" },
  { code: "DESIGN", name: "Design", category: "Creative" },
  { code: "REALTY", name: "Realty", category: "Realestate" },
  { code: "FINANCE", name: "Finance", category: "Finance" },
  { code: "ACCOUNTING", name: "Accounting", category: "Finance" },
  { code: "LEGAL", name: "Legal", category: "Legal" },
  { code: "SALON", name: "Salon", category: "Wellness" },
  { code: "CLINIC", name: "Clinic", category: "Healthcare" },
  { code: "FITNESS", name: "Fitness", category: "Wellness" },
  { code: "RECRUITING", name: "Recruiting", category: "Consulting" },
  { code: "CONSULTING", name: "Consulting", category: "Consulting" },
  { code: "COACHING", name: "Coaching", category: "Consulting" },
  { code: "SOFTWARE", name: "Software", category: "Technology" },
  { code: "OTHER", name: "Other", category: "Other" },
];
