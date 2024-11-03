import { AccountTypes } from './types';

export const ACCOUNT_TYPES: AccountTypes = {
  ftt: {
    label: "Fast Track Trading",
    accounts: [
      { value: "ftt:Rally", label: "Rally ($1,250 DD)" },
      { value: "ftt:Daytona", label: "Daytona ($2,500 DD)" },
      { value: "ftt:GT", label: "GT ($7,500 DD)" },
      { value: "ftt:LeMans", label: "LeMans ($15,000 DD)" }
    ]
  },
  topstep: {
    label: "Topstep",
    accounts: [
      { value: "topstep:Fifty", label: "50K Account" },
      { value: "topstep:OneHundred", label: "100K Account" },
      { value: "topstep:OneFifty", label: "150K Account" }
    ]
  }
};
