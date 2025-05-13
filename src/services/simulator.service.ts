
import { ProcessedOrderBook, SimulationInputs, SimulationOutputs } from "../types/trade";

class SimulatorService {
  private latencyStartTime: number | null = null;
  private orderBook: ProcessedOrderBook | null = null;
  
  // Process new orderbook data and calculate metrics
  processOrderBookUpdate(orderBook: ProcessedOrderBook, inputs: SimulationInputs): SimulationOutputs {
    this.latencyStartTime = performance.now();
    this.orderBook = orderBook;
    
    // Calculate all required metrics
    const expectedSlippage = this.calculateSlippage(inputs);
    const expectedFees = this.calculateFees(inputs);
    const expectedMarketImpact = this.calculateMarketImpact(inputs);
    const makerTakerProportion = this.calculateMakerTakerProportion(inputs);
    const internalLatency = this.calculateLatency();
    
    const netCost = expectedSlippage + expectedFees + expectedMarketImpact;
    
    return {
      expectedSlippage,
      expectedFees,
      expectedMarketImpact,
      netCost,
      makerTakerProportion,
      internalLatency
    };
  }
  
  // Calculate expected slippage based on order book depth and quantity
  private calculateSlippage(inputs: SimulationInputs): number {
    if (!this.orderBook) return 0;
    
    const { quantity } = inputs;
    const orderBook = this.orderBook;
    
    // Simple slippage calculation based on quantity and orderbook depth
    // For a more sophisticated model, implement linear or quantile regression
    let remainingQuantity = quantity;
    let slippage = 0;
    
    // Mid price as reference
    const midPrice = this.calculateMidPrice();
    if (!midPrice) return 0;
    
    // For market buy orders, we walk up the ask side
    for (const level of orderBook.asks) {
      const levelPrice = parseFloat(level.price);
      const levelSize = parseFloat(level.size);
      
      if (remainingQuantity <= 0) break;
      
      const fillSize = Math.min(remainingQuantity, levelSize);
      slippage += (levelPrice - midPrice) * fillSize;
      remainingQuantity -= fillSize;
    }
    
    // Return slippage as a percentage of order value
    return (slippage / (midPrice * quantity)) * 100;
  }
  
  // Calculate expected fees based on fee tier
  private calculateFees(inputs: SimulationInputs): number {
    const { quantity, feeTier } = inputs;
    
    // Fee structure based on OKX documentation
    // Values would be replaced with actual fee tiers from exchange
    const feeRates: { [key: string]: number } = {
      'VIP1': 0.08,
      'VIP2': 0.06,
      'VIP3': 0.04,
      'VIP4': 0.02,
      'VIP5': 0.01
    };
    
    const feeRate = feeRates[feeTier] || 0.1; // Default to highest fee if tier not found
    
    // Calculate fee as a percentage of the total order value
    return (feeRate / 100) * quantity;
  }
  
  // Calculate market impact using simplified Almgren-Chriss model
  private calculateMarketImpact(inputs: SimulationInputs): number {
    if (!this.orderBook) return 0;
    
    const { quantity, volatility } = inputs;
    const orderBook = this.orderBook;
    
    // Simplified Almgren-Chriss model parameters
    // For a complete implementation, these would be calibrated from market data
    const sigma = volatility / 100; // Volatility parameter
    const gamma = 0.1; // Permanent impact parameter
    const eta = 0.2; // Temporary impact parameter
    
    // Calculate average daily volume (ADV) from order book
    // This is a simplification - real ADV would come from historical data
    const totalVolume = orderBook.asks.reduce((sum, level) => sum + parseFloat(level.size), 0) + 
                       orderBook.bids.reduce((sum, level) => sum + parseFloat(level.size), 0);
    
    // Market impact calculation based on Almgren-Chriss
    // MI = sigma * sqrt(gamma/eta) * sqrt(quantity/ADV)
    const marketImpact = sigma * Math.sqrt(gamma / eta) * Math.sqrt(quantity / totalVolume);
    
    // Return market impact as a percentage of order value
    return marketImpact * 100;
  }
  
  // Calculate maker/taker proportion
  private calculateMakerTakerProportion(inputs: SimulationInputs): number {
    // For market orders, the taker proportion is 100%
    if (inputs.orderType === 'market') {
      return 0; // 0% maker, 100% taker
    }
    
    // For other order types, this would calculate based on price and order book
    return 0; // Simplified version
  }
  
  // Calculate internal latency (time to process this update)
  private calculateLatency(): number {
    if (this.latencyStartTime === null) return 0;
    return performance.now() - this.latencyStartTime;
  }
  
  // Helper to calculate mid price from order book
  private calculateMidPrice(): number | null {
    if (!this.orderBook || !this.orderBook.asks.length || !this.orderBook.bids.length) {
      return null;
    }
    
    const bestAsk = parseFloat(this.orderBook.asks[0].price);
    const bestBid = parseFloat(this.orderBook.bids[0].price);
    
    return (bestAsk + bestBid) / 2;
  }
}

export default SimulatorService;
