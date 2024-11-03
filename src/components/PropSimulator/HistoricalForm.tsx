import { Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CoreParameters } from './CoreParameters';
import type { SimulationFormProps } from './types';

export function HistoricalForm({ onSubmit, isLoading, defaultConfig }: SimulationFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulate with Historical Data</CardTitle>
        <CardDescription>
          Upload your historical trading data in CSV format
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} data-mode="historical" className="space-y-6" encType="multipart/form-data">
          <div className="space-y-2">
            <label className="text-sm font-medium">CSV File</label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                name="csvFile"
                accept=".csv"
                required
                className="w-full p-2 border rounded bg-white text-gray-900"
              />
              <Upload size={20} className="text-gray-500" />
            </div>
            <p className="text-sm text-gray-500">
              CSV format: DateTime, Return, Max Opposite Excursion
            </p>
          </div>
          <CoreParameters isLoading={isLoading} defaultConfig={defaultConfig} />
        </form>
      </CardContent>
    </Card>
  );
}
