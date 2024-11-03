import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from './FormField';
import { CoreParameters } from './CoreParameters';
import type { SimulationFormProps } from './types';

export function SimulatedForm({ onSubmit, isLoading, defaultConfig }: SimulationFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulate with Strategy Parameters</CardTitle>
        <CardDescription>
          Enter your trading strategy parameters for the simulation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} data-mode="simulated" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              label="Average Trades per Day"
              name="avgTradesPerDay"
              type="number"
              defaultValue="10"
              step="0.1"
              min="0.1"
              required
            />
            <FormField
              label="Stop Loss (Ticks)"
              name="stopLoss"
              type="number"
              defaultValue="40"
              min="1"
              required
            />
            <FormField
              label="Take Profit (Ticks)"
              name="takeProfit"
              type="number"
              defaultValue="40"
              min="1"
              required
            />
            <FormField
              label="Win Percentage"
              name="winPercentage"
              type="number"
              defaultValue="50"
              min="0"
              max="100"
              required
            />
          </div>
          <CoreParameters isLoading={isLoading} defaultConfig={defaultConfig} />
        </form>
      </CardContent>
    </Card>
  );
}
