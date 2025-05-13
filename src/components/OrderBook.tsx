
import React from 'react';
import { ProcessedOrderBook } from '../types/trade';
import { Card, CardContent, CardHeader } from './ui/card';

interface OrderBookProps {
  orderBook: ProcessedOrderBook | null;
  maxLevels?: number;
}

const OrderBook: React.FC<OrderBookProps> = ({ orderBook, maxLevels = 10 }) => {
  if (!orderBook) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">Order Book</h3>
        </CardHeader>
        <CardContent className="text-center py-8">
          Waiting for order book data...
        </CardContent>
      </Card>
    );
  }
  
  // Calculate maximum size for depth visualization
  const maxSize = Math.max(
    ...orderBook.asks.slice(0, maxLevels).map(ask => parseFloat(ask.size)),
    ...orderBook.bids.slice(0, maxLevels).map(bid => parseFloat(bid.size))
  );
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Order Book</h3>
          <div className="text-xs text-muted-foreground">
            {orderBook.symbol} @ {new Date(orderBook.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-3 text-xs font-medium p-2 border-b">
          <div>Price</div>
          <div className="text-right">Size</div>
          <div className="text-right">Total</div>
        </div>
        
        {/* Ask rows (sell orders) - displayed in reverse order */}
        <div className="max-h-[200px] overflow-auto">
          {orderBook.asks.slice(0, maxLevels).map((ask, index) => {
            const size = parseFloat(ask.size);
            const depthPercentage = (size / maxSize) * 100;
            
            return (
              <div key={`ask-${index}`} className="orderbook-row ask-row relative">
                <span className="depth-bar ask-bar" style={{ width: `${depthPercentage}%` }} />
                <span className="ask-price relative z-10">{parseFloat(ask.price).toFixed(2)}</span>
                <span className="relative z-10">{parseFloat(ask.size).toFixed(4)}</span>
                <span className="relative z-10">
                  {orderBook.asks.slice(0, index + 1).reduce((total, a) => total + parseFloat(a.size), 0).toFixed(4)}
                </span>
              </div>
            );
          })}
          
          {/* Spread indicator */}
          <div className="orderbook-row py-1 text-xs text-center text-muted-foreground border-y">
            <span className="col-span-3 w-full">
              Spread: {(parseFloat(orderBook.asks[0].price) - parseFloat(orderBook.bids[0].price)).toFixed(2)}
              ({((parseFloat(orderBook.asks[0].price) / parseFloat(orderBook.bids[0].price) - 1) * 100).toFixed(3)}%)
            </span>
          </div>
          
          {/* Bid rows (buy orders) */}
          {orderBook.bids.slice(0, maxLevels).map((bid, index) => {
            const size = parseFloat(bid.size);
            const depthPercentage = (size / maxSize) * 100;
            
            return (
              <div key={`bid-${index}`} className="orderbook-row bid-row relative">
                <span className="depth-bar bid-bar" style={{ width: `${depthPercentage}%` }} />
                <span className="bid-price relative z-10">{parseFloat(bid.price).toFixed(2)}</span>
                <span className="relative z-10">{parseFloat(bid.size).toFixed(4)}</span>
                <span className="relative z-10">
                  {orderBook.bids.slice(0, index + 1).reduce((total, b) => total + parseFloat(b.size), 0).toFixed(4)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderBook;
