import React, { useState, useEffect, useCallback } from 'react';
import { ProcessedOrderBook, SimulationInputs, SimulationOutputs } from '../types/trade';
import WebSocketService from '../services/websocket.service';
import SimulatorService from '../services/simulator.service';
import InputForm from '../components/InputForm';
import OutputDisplay from '../components/OutputDisplay';
import OrderBook from '../components/OrderBook';
import SystemStatus from '../components/SystemStatus';
import { useToast } from '@/hooks/use-toast';

// Default simulation inputs
const defaultInputs: SimulationInputs = {
  exchange: 'OKX',
  spotAsset: 'BTC-USDT',
  orderType: 'market',
  quantity: 100,
  volatility: 2.5, // 2.5%
  feeTier: 'VIP1'
};

const Index = () => {
  // State for WebSocket connection
  const [isConnected, setIsConnected] = useState(false);
  const [orderBook, setOrderBook] = useState<ProcessedOrderBook | null>(null);
  const [ticksReceived, setTicksReceived] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  
  // State for simulation
  const [inputs, setInputs] = useState<SimulationInputs>(defaultInputs);
  const [outputs, setOutputs] = useState<SimulationOutputs | null>(null);
  const [latencies, setLatencies] = useState<number[]>([]);
  
  const simulator = React.useMemo(() => new SimulatorService(), []);
  const { toast } = useToast();
  
  // Calculate average latency
  const averageLatency = latencies.length > 0
    ? latencies.reduce((sum, val) => sum + val, 0) / latencies.length
    : null;
  
  // Handle incoming orderbook updates
  const handleOrderBookUpdate = useCallback((data: ProcessedOrderBook) => {
    setOrderBook(data);
    setIsConnected(true);
    setLastUpdate(data.timestamp);
    setTicksReceived(prev => prev + 1);
    
    // Run simulation with new data
    const simulationResults = simulator.processOrderBookUpdate(data, inputs);
    setOutputs(simulationResults);
    
    // Track latencies (keep last 50 values)
    setLatencies(prev => {
      const updated = [...prev, simulationResults.internalLatency].slice(-50);
      return updated;
    });
  }, [simulator, inputs]);
  
  // Initialize WebSocket connection
  useEffect(() => {
    const wsEndpoint = 'wss://ws.gomarket-cpp.goquant.io/ws/l2-orderbook/okx/BTC-USDT-SWAP';
    const wsService = new WebSocketService(wsEndpoint);
    
    toast({
      title: 'Connecting to market data...',
      description: 'Establishing WebSocket connection to OKX',
    });
    
    wsService.connect(handleOrderBookUpdate);
    
    // Clean up on unmount
    return () => {
      wsService.disconnect();
    };
  }, [handleOrderBookUpdate, toast]);
  
  // Handle input changes
  const handleInputChange = (newInputs: SimulationInputs) => {
    setInputs(newInputs);
    
    // If we have orderbook data, recalculate outputs with new inputs
    if (orderBook) {
      const simulationResults = simulator.processOrderBookUpdate(orderBook, newInputs);
      setOutputs(simulationResults);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Trade Simulator</h1>
          <p className="text-muted-foreground">Real-time market impact and cost simulation</p>
        </header>
        
        <SystemStatus 
          isConnected={isConnected} 
          lastUpdate={lastUpdate} 
          ticksReceived={ticksReceived}
          averageLatency={averageLatency}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-1">
            <InputForm 
              inputs={inputs} 
              onInputChange={handleInputChange}
            />
          </div>
          
          <div className="lg:col-span-1">
            <OutputDisplay outputs={outputs} />
          </div>
          
          <div className="lg:col-span-1">
            <OrderBook orderBook={orderBook} maxLevels={15} />
          </div>
        </div>
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Market data provided by OKX Exchange. This is a simulation tool for educational purposes only.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
