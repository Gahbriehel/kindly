export interface IClientCountOption {
  label: string;
  value: string;
}

export const CLIENT_COUNT_OPTIONS: IClientCountOption[] = [
  { label: "1 - 5 clients", value: "5" },
  { label: "6 - 15 clients", value: "15" },
  { label: "16 - 50 clients", value: "50" },
  { label: "51 - 100 clients", value: "100" },
  { label: "100+ clients", value: "200" },
];
