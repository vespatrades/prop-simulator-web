import { useState, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimulatedForm } from './SimulatedForm';
import { HistoricalForm } from './HistoricalForm';
import { SimulationResults } from './SimulationResults';
import type { SimulationConfig, SimulationResults as SimulationResultsType } from '@/types';
import type { PropSimulatorProps } from './types';

export function PropSimulator({ onSimulationComplete, initialConfig }: PropSimulatorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SimulationResultsType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const defaultConfig: Partial<SimulationConfig> = {
    iterations: 10000,
    max_simulation_days: 365,
    max_payouts: 12,
    multiplier: 20,
    round_trip_cost: 0,
    histogram: true,
    condition_end_state: 'All',
    ...initialConfig
  };

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData();

    try {
      const config: SimulationConfig = {
        iterations: parseInt((form.iterations as HTMLInputElement).value),
        max_simulation_days: parseInt((form.maxDays as HTMLInputElement).value),
        account_type: (form.accountType as HTMLSelectElement).value,
        multiplier: parseFloat((form.multiplier as HTMLInputElement).value),
        histogram: true,
        condition_end_state: (form.endState as HTMLSelectElement).value,
        max_payouts: defaultConfig.max_payouts!,
        round_trip_cost: parseFloat((form.roundTripCost as HTMLInputElement).value),
      };

      if (form.dataset.mode === 'simulated') {
        // Validate required fields for simulated mode
        const requiredFields = ['avgTradesPerDay', 'stopLoss', 'takeProfit', 'winPercentage'];
        for (const field of requiredFields) {
          const input = form[field] as HTMLInputElement;
          if (!input?.value) {
            throw new Error(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
          }
        }

        config.avg_trades_per_day = parseFloat((form.avgTradesPerDay as HTMLInputElement).value);
        config.stop_loss = parseFloat((form.stopLoss as HTMLInputElement).value);
        config.take_profit = parseFloat((form.takeProfit as HTMLInputElement).value);
        config.win_percentage = parseFloat((form.winPercentage as HTMLInputElement).value);

        // Validate ranges
        if (config.win_percentage < 0 || config.win_percentage > 100) {
          throw new Error('Win percentage must be between 0 and 100');
        }
        if (config.avg_trades_per_day <= 0) {
          throw new Error('Average trades per day must be positive');
        }
      } else {
        const csvInput = form.csvFile as HTMLInputElement;
        if (!csvInput?.files?.[0]) {
          throw new Error('Please select a CSV file');
        }
        formData.append('csv_file', csvInput.files[0]);
      }

      formData.append('config', JSON.stringify(config));

      const response = await fetch('/simulate', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Simulation failed');
      }

      const data = await response.json();
      if (!data) {
        throw new Error('No data received from simulation');
      }

      setResults(data);
      onSimulationComplete?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during simulation');
    } finally {
      setIsLoading(false);
    }
  }, [onSimulationComplete, defaultConfig.max_payouts]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Prop Trading Account Simulator
        </h1>

        <Tabs defaultValue="simulated" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="simulated">Simulated Parameters</TabsTrigger>
            <TabsTrigger value="historical">Historical Data</TabsTrigger>
          </TabsList>

          <TabsContent value="simulated">
            <SimulatedForm 
              onSubmit={handleSubmit}
              isLoading={isLoading}
              defaultConfig={defaultConfig}
            />
          </TabsContent>

          <TabsContent value="historical">
            <HistoricalForm 
              onSubmit={handleSubmit}
              isLoading={isLoading}
              defaultConfig={defaultConfig}
            />
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {results && <SimulationResults results={results} />}
      </div>
    </div>
  );
}

export default PropSimulator;
