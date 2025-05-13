
import React from 'react';
import { SimulationInputs } from '../types/trade';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface InputFormProps {
  inputs: SimulationInputs;
  onInputChange: (newInputs: SimulationInputs) => void;
}

const InputForm: React.FC<InputFormProps> = ({ inputs, onInputChange }) => {
  const handleInputChange = (field: keyof SimulationInputs, value: string | number) => {
    onInputChange({ ...inputs, [field]: value });
  };

  const feeTiers = ['VIP1', 'VIP2', 'VIP3', 'VIP4', 'VIP5'];
  const spotAssets = ['BTC-USDT', 'ETH-USDT', 'SOL-USDT', 'XRP-USDT', 'BNB-USDT'];

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Input Parameters</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="exchange">Exchange</Label>
          <Input 
            id="exchange" 
            value={inputs.exchange} 
            onChange={(e) => handleInputChange('exchange', e.target.value)}
            disabled
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="spotAsset">Spot Asset</Label>
          <Select 
            value={inputs.spotAsset} 
            onValueChange={(value) => handleInputChange('spotAsset', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Asset" />
            </SelectTrigger>
            <SelectContent>
              {spotAssets.map((asset) => (
                <SelectItem key={asset} value={asset}>{asset}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="orderType">Order Type</Label>
          <Input 
            id="orderType" 
            value={inputs.orderType} 
            onChange={(e) => handleInputChange('orderType', e.target.value as 'market')}
            disabled
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity (USD)</Label>
          <Input 
            id="quantity" 
            type="number"
            min="1" 
            value={inputs.quantity} 
            onChange={(e) => handleInputChange('quantity', parseFloat(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="volatility">Volatility (%)</Label>
          <Input 
            id="volatility" 
            type="number"
            min="0.01"
            max="100"
            step="0.01"
            value={inputs.volatility} 
            onChange={(e) => handleInputChange('volatility', parseFloat(e.target.value))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="feeTier">Fee Tier</Label>
          <Select 
            value={inputs.feeTier} 
            onValueChange={(value) => handleInputChange('feeTier', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Fee Tier" />
            </SelectTrigger>
            <SelectContent>
              {feeTiers.map((tier) => (
                <SelectItem key={tier} value={tier}>{tier}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button className="w-full" variant="outline">
          Reset to Default
        </Button>
      </CardContent>
    </Card>
  );
};

export default InputForm;
