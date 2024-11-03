import { RefreshCw } from 'lucide-react';
import type { SubmitButtonProps } from './types';

export function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
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
  );
}
