import { IBaseResponse } from "./base";

export interface ICountry {
  name: string;
  phoneCode: string;
  capital: string;
  currency: string;
  stateCount: number;
}

export interface ICountriesResponse extends IBaseResponse {
  data: {
    countries: ICountry[];
  };
}
