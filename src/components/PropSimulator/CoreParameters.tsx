import { ACCOUNT_TYPES } from '@/constants';
import { FormField } from './FormField';
import { MultiplierSelect } from './MultiplierSelect';
import { SubmitButton } from './SubmitButton';
import type { CoreParametersProps } from './types';

export function CoreParameters({ isLoading, defaultConfig }: CoreParametersProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Account Type</label>
          <select
            name="accountType"
            className="w-full p-2 border rounded bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500"
            defaultValue={defaultConfig.account_type || "ftt:GT"}
          >
            {Object.entries(ACCOUNT_TYPES).map(([provider, info]) => (
              <optgroup key={provider} label={info.label}>
                {info.accounts.map(account => (
                  <option key={account.value} value={account.value}>
                    {account.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <FormField
          label="Round Trip Cost"
          name="roundTripCost"
          type="number"
          defaultValue={defaultConfig.round_trip_cost?.toString()}
          step="0.01"
          min="0"
        />

	<MultiplierSelect
          name="multiplier"
          defaultValue={defaultConfig.multiplier}
	/>

        <FormField
          label="Iterations"
          name="iterations"
          type="number"
          defaultValue={defaultConfig.iterations?.toString()}
          min="1000"
          required
        />

        <FormField
          label="Max Days"
          name="maxDays"
          type="number"
          defaultValue={defaultConfig.max_simulation_days?.toString()}
          min="1"
          required
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">End State Filter</label>
          <select
            name="endState"
            className="w-full p-2 border rounded bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500"
            defaultValue={defaultConfig.condition_end_state || "All"}
          >
            <option value="All">All Outcomes</option>
            <option value="Busted">Busted Only</option>
            <option value="TimeOut">Timeout Only</option>
            <option value="MaxPayouts">Max Payouts Only</option>
          </select>
        </div>
      </div>

      <SubmitButton isLoading={isLoading} />
    </>
  );
}
