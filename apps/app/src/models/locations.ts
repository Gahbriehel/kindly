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
