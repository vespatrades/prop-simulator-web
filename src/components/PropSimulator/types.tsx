import type { SimulationConfig, SimulationResults } from '@/types';

export interface FormMode {
  mode: 'simulated' | 'historical';
}

export interface CoreParametersProps {
  defaultConfig: Partial<SimulationConfig>;
  isLoading: boolean;
}

export interface SubmitButtonProps {
  isLoading: boolean;
}

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  type: string;
  defaultValue?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface ResultSectionProps {
  title: string;
  items: Array<{ label: string; value: string }>;
}

export interface SimulationResultsProps {
  results: SimulationResults;
}

export interface PropSimulatorProps {
  onSimulationComplete?: (results: SimulationResults) => void;
  initialConfig?: Partial<SimulationConfig>;
}

export interface SimulationFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  defaultConfig: Partial<SimulationConfig>;
}

export interface MultiplierSelectProps {
  defaultValue?: number;
  onChange?: (value: number) => void;
  name: string;
}
