"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/**
 * WebSocket hook for real-time price updates
 * Mocks WebSocket behavior for development
 */
export function useWebSocket<T = unknown>(
  url: string,
  options?: {
    onMessage?: (data: T) => void;
    onError?: (error: Event) => void;
    onOpen?: () => void;
    onClose?: () => void;
    reconnectInterval?: number;
    enabled?: boolean;
  }
) {
  const {
    onMessage,
    onError,
    onOpen,
    onClose,
    reconnectInterval = 3000,
    enabled = true,
  } = options || {};

  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);

  // Keep refs updated
  useEffect(() => {
    onMessageRef.current = onMessage;
    onErrorRef.current = onError;
    onOpenRef.current = onOpen;
    onCloseRef.current = onClose;
  }, [onMessage, onError, onOpen, onClose]);

  const connect = useCallback(() => {
    if (!enabled) return;

    try {
      // In production, use real WebSocket
      // For mock, we'll simulate with setInterval
      if (typeof window !== "undefined" && "WebSocket" in window) {
        // Try real WebSocket first
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
          onOpenRef.current?.();
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as T;
            onMessageRef.current?.(data);
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
          }
        };

        ws.onerror = (error) => {
          onErrorRef.current?.(error);
        };

        ws.onclose = () => {
          setIsConnected(false);
          onCloseRef.current?.();
          // Attempt to reconnect
          if (enabled) {
            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, reconnectInterval);
          }
        };
      } else {
        // Fallback: simulate connection
        setIsConnected(true);
        onOpenRef.current?.();
      }
    } catch (error) {
      console.error("WebSocket connection error:", error);
      onErrorRef.current?.(error as Event);
    }
  }, [url, enabled, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const send = useCallback((data: unknown) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  return {
    isConnected,
    connect,
    disconnect,
    send,
  };
}

/**
 * Mock WebSocket hook for price updates
 * Simulates real-time price changes
 */
export function useMockWebSocket(
  onPriceUpdate: (updates: Record<string, { price: number; previousPrice: number }>) => void,
  enabled = true
) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(onPriceUpdate);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = onPriceUpdate;
  }, [onPriceUpdate]);

  useEffect(() => {
    if (!enabled) return;

    // Delay WebSocket initialization to improve initial load performance
    const timeout = setTimeout(() => {
      // Simulate price updates every 1-3 seconds
      const updatePrices = () => {
        const updates: Record<string, { price: number; previousPrice: number }> = {};
        
        // Generate random price updates for demo
        // In real app, this would come from WebSocket
        const tokenIds = Array.from({ length: 10 }, (_, i) => `token-${i + 1}`);
        
        tokenIds.forEach((id) => {
          const previousPrice = Math.random() * 100;
          const changePercent = (Math.random() - 0.5) * 0.1; // ±5% change
          const price = previousPrice * (1 + changePercent);
          
          updates[id] = {
            price: Number(price.toFixed(6)),
            previousPrice: Number(previousPrice.toFixed(6)),
          };
        });

        // Use ref to avoid dependency issues
        callbackRef.current(updates);
      };

      // Initial update
      updatePrices();

      // Set up interval - use fixed interval to prevent recreation
      const interval = setInterval(updatePrices, 2000);
      intervalRef.current = interval;
    }, 2000); // Delay 2 seconds for better initial load performance

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled]); // Only depend on enabled, not onPriceUpdate

  return {
    isConnected: enabled,
  };
}

