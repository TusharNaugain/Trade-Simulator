
import { OrderBook, ProcessedOrderBook } from "../types/trade";

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private url: string;
  private onMessageCallback: ((data: ProcessedOrderBook) => void) | null = null;

  constructor(url: string) {
    this.url = url;
  }

  connect(onMessage: (data: ProcessedOrderBook) => void) {
    this.onMessageCallback = onMessage;
    
    try {
      this.socket = new WebSocket(this.url);
      
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data: OrderBook = JSON.parse(event.data);
          const processedData = this.processOrderBook(data);
          if (this.onMessageCallback) {
            this.onMessageCallback(processedData);
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };
      
      this.socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        this.reconnect();
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.socket?.close();
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.reconnect();
    }
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.onMessageCallback) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect(this.onMessageCallback!);
      }, this.reconnectDelay);
    } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached. Please refresh the page.');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private processOrderBook(data: OrderBook): ProcessedOrderBook {
    // Convert the raw OrderBook data into a more usable format
    return {
      asks: data.asks.map(([price, size]) => ({ price, size })),
      bids: data.bids.map(([price, size]) => ({ price, size })),
      timestamp: data.timestamp,
      exchange: data.exchange,
      symbol: data.symbol
    };
  }
}

export default WebSocketService;
