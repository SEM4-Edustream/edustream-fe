"use client";

import { useEffect, useRef, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '@/context/AuthContext';

export const useWebsocket = (topic: string, onMessage: (message: any) => void) => {
  const { user, isAuthenticated } = useAuth();
  const stompClient = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/ws`);
    
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        if (process.env.NODE_ENV === 'development') console.log('WS Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      setConnected(true);
      console.log('WS Connected:', frame);
      
      // Subscribe to the topic
      // Note: for user-specific topics, Spring's setUserDestinationPrefix handles the /user prefix
      client.subscribe(topic, (message: IMessage) => {
        if (message.body) {
          const data = JSON.parse(message.body);
          onMessage(data);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('WS Stomp Error:', frame.headers['message']);
      console.error('WS Additional details:', frame.body);
    };

    client.onDisconnect = () => {
      setConnected(false);
      console.log('WS Disconnected');
    };

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [isAuthenticated, user?.username, topic]);

  return { connected };
};
