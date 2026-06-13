export type PayoutType = 'annual' | 'compounded';

export interface BaseInput {
  principal: number;
  rate: number;
  inflationEnabled?: boolean;
  inflationRate?: number;
}

export interface TBondInput extends BaseInput {
  taxRate: number;
  bankFee: number;
  bankFeeFrequency: number; // e.g., 4 for quarterly
  tenor: 5 | 10;
}

export interface MP2Input extends BaseInput {
  payoutType: PayoutType;
  monthlyContribution: number;
  mode: 'one-time' | 'monthly';
  tenor: 5 | 10;
}

export interface SavedCalculation {
  id: string;
  name: string;
  type: 'tbond' | 'mp2';
  tbondInput?: TBondInput;
  mp2Input?: MP2Input;
  createdAt: string;
}

export interface AppState {
  saved: SavedCalculation[];
  darkMode: boolean;
  introSeen: boolean;
}
