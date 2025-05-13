
import React from 'react';
import { Card, CardContent } from './ui/card';
import { CircleCheck, CircleAlert, Loader } from 'lucide-react';

interface SystemStatusProps {
  isConnected: boolean;
  lastUpdate: string | null;
  ticksReceived: number;
  averageLatency: number | null;
}

const SystemStatus: React.FC<SystemStatusProps> = ({ 
  isConnected, 
  lastUpdate, 
  ticksReceived, 
  averageLatency 
}) => {
  return (
    <Card>
      <CardContent className="py-3">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <CircleCheck className="h-4 w-4 text-green-500" />
            ) : (
              <CircleAlert className="h-4 w-4 text-red-500" />
            )}
            <span className="font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {isConnected && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Loader className="h-3 w-3 animate-spin" />
                <span>Ticks: {ticksReceived}</span>
              </div>
              
              {averageLatency !== null && (
                <div>
                  Avg. Latency: {averageLatency.toFixed(2)}ms
                </div>
              )}
              
              {lastUpdate && (
                <div className="text-muted-foreground">
                  Last: {new Date(lastUpdate).toLocaleTimeString()}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
