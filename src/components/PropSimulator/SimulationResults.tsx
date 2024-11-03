import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ResultSectionProps, SimulationResultsProps } from './types';

function ResultSection({ title, items }: ResultSectionProps) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <ul className="space-y-1">
        {items.map(({ label, value }) => (
          <li key={label}>{label}: {value}</li>
        ))}
      </ul>
    </div>
  );
}

export function SimulationResults({ results }: SimulationResultsProps) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Simulation Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ResultSection
            title="Balance Statistics"
            items={[
              { label: "Mean", value: `$${results.mean_balance.toFixed(2)}` },
              { label: "Median", value: `$${results.median_balance.toFixed(2)}` },
              { label: "Standard Deviation", value: `$${results.std_dev.toFixed(2)}` },
              { label: "Positive Balance", value: `${results.positive_balance_percentage.toFixed(1)}%` }
            ]}
          />

          <ResultSection
            title="Simulation Statistics"
            items={[
              { label: "Mean Days", value: results.mean_days.toFixed(1) },
              { label: "MAD", value: `$${results.mad.toFixed(2)}` },
              { label: "IQR", value: `$${results.iqr.toFixed(2)}` },
              { label: "MAD Median", value: `$${results.mad_median.toFixed(2)}` }
            ]}
          />

          <ResultSection
            title="End States"
            items={Object.entries(results.end_state_percentages).map(([state, percentage]) => ({
              label: state,
              value: `${percentage.toFixed(1)}%`
            }))}
          />
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
}
