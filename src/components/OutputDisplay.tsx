
import React from 'react';
import { SimulationOutputs } from '../types/trade';
import { Card, CardContent, CardHeader } from './ui/card';
import { Progress } from './ui/progress';

interface OutputDisplayProps {
  outputs: SimulationOutputs | null;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ outputs }) => {
  if (!outputs) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">Output Parameters</h3>
        </CardHeader>
        <CardContent className="text-center py-8">
          Waiting for simulation data...
        </CardContent>
      </Card>
    );
  }

  const formatValue = (value: number, suffix: string = '', precision: number = 4) => {
    return `${value.toFixed(precision)}${suffix}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  // Helpers for determining color
  const getSlippageColor = (value: number) => {
    if (value < 0.05) return 'text-green-500';
    if (value < 0.2) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getFeeColor = (value: number) => {
    if (value < 0.05) return 'text-green-500';
    if (value < 0.15) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMarketImpactColor = (value: number) => {
    if (value < 0.1) return 'text-green-500';
    if (value < 0.3) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getLatencyColor = (value: number) => {
    if (value < 5) return 'text-green-500';
    if (value < 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Output Parameters</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm font-medium">Expected Slippage:</div>
          <div className={`text-sm font-bold text-right ${getSlippageColor(outputs.expectedSlippage)}`}>
            {formatPercentage(outputs.expectedSlippage)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm font-medium">Expected Fees:</div>
          <div className={`text-sm font-bold text-right ${getFeeColor(outputs.expectedFees)}`}>
            {formatPercentage(outputs.expectedFees)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm font-medium">Market Impact:</div>
          <div className={`text-sm font-bold text-right ${getMarketImpactColor(outputs.expectedMarketImpact)}`}>
            {formatPercentage(outputs.expectedMarketImpact)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm font-medium">Net Cost:</div>
          <div className="text-sm font-bold text-right">
            {formatPercentage(outputs.netCost)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium">Maker/Taker:</div>
            <div className="text-sm font-bold text-right">
              {formatPercentage(outputs.makerTakerProportion)} / {formatPercentage(100 - outputs.makerTakerProportion)}
            </div>
          </div>
          <Progress value={100 - outputs.makerTakerProportion} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Maker</span>
            <span>Taker</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm font-medium">Internal Latency:</div>
          <div className={`text-sm font-bold text-right ${getLatencyColor(outputs.internalLatency)}`}>
            {formatValue(outputs.internalLatency, 'ms')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutputDisplay;
