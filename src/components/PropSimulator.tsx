import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Upload, RefreshCw } from 'lucide-react';
import { ACCOUNT_TYPES } from '@/constants';
import type { SimulationConfig, SimulationResults } from '@/types';

export default function PropSimulator() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData();

    try {
      // Create base config
      const config: SimulationConfig = {
        iterations: parseInt((form.iterations as HTMLInputElement).value),
        max_simulation_days: parseInt((form.maxDays as HTMLInputElement).value),
        account_type: (form.accountType as HTMLSelectElement).value,
        multiplier: parseFloat((form.multiplier as HTMLInputElement).value),
        histogram: true,
        condition_end_state: (form.endState as HTMLSelectElement).value,
        max_payouts: 12,
        round_trip_cost: parseFloat((form.roundTripCost as HTMLInputElement).value),
      };

      // Add simulation parameters only if in simulated mode
      if (form.dataset.mode === 'simulated') {
        config.avg_trades_per_day = parseFloat((form.avgTradesPerDay as HTMLInputElement).value);
        config.stop_loss = parseFloat((form.stopLoss as HTMLInputElement).value);
        config.take_profit = parseFloat((form.takeProfit as HTMLInputElement).value);
        config.win_percentage = parseFloat((form.winPercentage as HTMLInputElement).value);
      } else {
        const csvInput = form.csvFile as HTMLInputElement;
        if (csvInput && csvInput.files && csvInput.files[0]) {
          formData.append('csv_file', csvInput.files[0]);
        } else {
          throw new Error('Please select a CSV file');
        }
      }

      // Add config to formData
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during simulation');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCoreParameters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Account Type</label>
        <select
          name="accountType"
          className="w-full p-2 border rounded bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

      <div className="space-y-2">
        <label className="text-sm font-medium">Round Trip Cost</label>
        <input
          type="number"
          name="roundTripCost"
          defaultValue="4.10"
          step="0.01"
          className="w-full p-2 border rounded bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&::-webkit-inner-spin-button]:opacity-25 [&::-webkit-outer-spin-button]:opacity-25"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Point Multiplier</label>
        <input
          type="number"
          name="multiplier"
          defaultValue="20"
          className="w-full p-2 border rounded bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&::-webkit-inner-spin-button]:opacity-25 [&::-webkit-outer-spin-button]:opacity-25"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Iterations</label>
        <input
          type="number"
          name="iterations"
          defaultValue="10000"
          className="w-full p-2 border rounded bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&::-webkit-inner-spin-button]:opacity-25 [&::-webkit-outer-spin-button]:opacity-25"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Max Days</label>
        <input
          type="number"
          name="maxDays"
          defaultValue="365"
          className="w-full p-2 border rounded bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&::-webkit-inner-spin-button]:opacity-25 [&::-webkit-outer-spin-button]:opacity-25"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">End State Filter</label>
        <select
          name="endState"
          className="w-full p-2 border rounded bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="All">All Outcomes</option>
          <option value="Busted">Busted Only</option>
          <option value="TimeOut">Timeout Only</option>
          <option value="MaxPayouts">Max Payouts Only</option>
        </select>
      </div>
    </div>
  );

  const renderSimulationParameters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Average Trades per Day</label>
        <input
          type="number"
          name="avgTradesPerDay"
          defaultValue="10"
          step="0.1"
          className="w-full p-2 border rounded bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&::-webkit-inner-spin-button]:opacity-25 [&::-webkit-outer-spin-button]:opacity-25"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Stop Loss (Ticks)</label>
        <input
          type="number"
          name="stopLoss"
          defaultValue="40"
          className="w-full p-2 border rounded bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&::-webkit-inner-spin-button]:opacity-25 [&::-webkit-outer-spin-button]:opacity-25"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Take Profit (Ticks)</label>
        <input
          type="number"
          name="takeProfit"
          defaultValue="40"
          className="w-full p-2 border rounded bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&::-webkit-inner-spin-button]:opacity-25 [&::-webkit-outer-spin-button]:opacity-25"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Win Percentage</label>
        <input
          type="number"
          name="winPercentage"
          defaultValue="50"
          min="0"
          max="100"
          className="w-full p-2 border rounded bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&::-webkit-inner-spin-button]:opacity-25 [&::-webkit-outer-spin-button]:opacity-25"
        />
      </div>
    </div>
  );

  const renderResults = () => {
    if (!results) return null;

    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Simulation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Balance Statistics</h3>
              <ul className="space-y-1">
                <li>Mean: ${results.mean_balance.toFixed(2)}</li>
                <li>Median: ${results.median_balance.toFixed(2)}</li>
                <li>Standard Deviation: ${results.std_dev.toFixed(2)}</li>
                <li>Positive Balance: {results.positive_balance_percentage.toFixed(1)}%</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Simulation Statistics</h3>
              <ul className="space-y-1">
                <li>Mean Days: {results.mean_days.toFixed(1)}</li>
                <li>MAD: ${results.mad.toFixed(2)}</li>
                <li>IQR: ${results.iqr.toFixed(2)}</li>
                <li>MAD Median: ${results.mad_median.toFixed(2)}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">End States</h3>
              <ul className="space-y-1">
                {Object.entries(results.end_state_percentages).map(([state, percentage]) => (
                  <li key={state}>{state}: {percentage.toFixed(1)}%</li>
                ))}
              </ul>
            </div>
          </div>

          {results.histogram_image_base64 && (
            <div className="mt-8">
              <h3 className="font-semibold mb-2">Distribution of Final Account Balances</h3>
              <div className="mt-4">
                <img
                  src={`data:image/png;base64,${results.histogram_image_base64}`}
                  alt="Distribution of Final Account Balances"
                  className="max-w-full h-auto mx-auto"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Prop Trading Account Simulator</h1>

        <Tabs defaultValue="simulated" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="simulated">Simulated Parameters</TabsTrigger>
            <TabsTrigger value="historical">Historical Data</TabsTrigger>
          </TabsList>

          <TabsContent value="simulated">
            <Card>
              <CardHeader>
                <CardTitle>Simulate with Strategy Parameters</CardTitle>
                <CardDescription>
                  Enter your trading strategy parameters for the simulation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} data-mode="simulated" className="space-y-6">
                  {renderSimulationParameters()}
                  {renderCoreParameters()}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <><RefreshCw className="animate-spin mr-2" size={16} /> Running Simulation...</>
                    ) : (
                      'Run Simulation'
                    )}
                  </button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historical">
            <Card>
              <CardHeader>
                <CardTitle>Simulate with Historical Data</CardTitle>
                <CardDescription>
                  Upload your historical trading data in CSV format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} data-mode="historical" className="space-y-6" encType="multipart/form-data">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CSV File</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        name="csvFile"
                        accept=".csv"
                        required
                        className="w-full p-2 border rounded"
                      />
                      <Upload size={20} className="text-gray-500" />
                    </div>
                  </div>

                  {renderCoreParameters()}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <><RefreshCw className="animate-spin mr-2" size={16} /> Running Simulation...</>
                    ) : (
                      'Run Simulation'
                    )}
                  </button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {renderResults()}
      </div>
    </div>
  );
}