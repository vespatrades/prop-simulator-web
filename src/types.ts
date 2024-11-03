export type AccountProvider = {
  label: string;
  accounts: {
    value: string;
    label: string;
  }[];
};

export type AccountTypes = {
  [key: string]: AccountProvider;
};

export interface SimulationConfig {
  iterations: number;
  max_simulation_days: number;
  account_type: string;
  multiplier: number;
  histogram: boolean;
  condition_end_state: string;
  max_payouts: number;
  avg_trades_per_day?: number;
  stop_loss?: number;
  take_profit?: number;
  win_percentage?: number;
  round_trip_cost?: number;
}

export interface SimulationResults {
  mean_balance: number;
  median_balance: number;
  std_dev: number;
  mad: number;
  iqr: number;
  mad_median: number;
  mean_days: number;
  end_state_percentages: Record<string, number>;
  positive_balance_percentage: number;
  histogram_image_base64?: string;
}
