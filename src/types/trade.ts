
export interface OrderBookEntry {
  price: string;
  size: string;
}

export interface OrderBook {
  timestamp: string;
  exchange: string;
  symbol: string;
  asks: [string, string][];
  bids: [string, string][];
}

export interface ProcessedOrderBook {
  asks: OrderBookEntry[];
  bids: OrderBookEntry[];
  timestamp: string;
  exchange: string;
  symbol: string;
}

export interface SimulationInputs {
  exchange: string;
  spotAsset: string;
  orderType: 'market';
  quantity: number;
  volatility: number;
  feeTier: string;
}

export interface SimulationOutputs {
  expectedSlippage: number;
  expectedFees: number;
  expectedMarketImpact: number;
  netCost: number;
  makerTakerProportion: number;
  internalLatency: number;
}
