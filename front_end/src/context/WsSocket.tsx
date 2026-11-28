"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUserContext } from "./MyState";

export type ConversationsType = {
  id: string;
  userId: string;
  receiverId: string;
  senderId: string;
  active: boolean;
  name: string;
  time: string;
  online: boolean;
  unread: number;
  studyMaterial: string;
  lastMessage: string;
};

export type MessageType = {
  id: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  isRead: boolean;
  content: string;
  time: string;
  createdAt: string;
};

type ValueType = {
  setOpenChat: Dispatch<SetStateAction<string>>;
  openChat: string;
  AllOnline: Set<string>;
  setAllOnline: Dispatch<SetStateAction<Set<string>>>;
  socket: WebSocket | null;
  conversations: ConversationsType[];
  setConversations: Dispatch<SetStateAction<ConversationsType[]>>;
  dataHeader: ConversationsType | null;
  setDataHeader: Dispatch<SetStateAction<ConversationsType | null>>;
};

const SocketContext = createContext<ValueType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};
const WsSocket = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserContext();
  const [openChat, setOpenChat] = useState<string>("");
  const [dataHeader, setDataHeader] = useState<ConversationsType | null>(null);

  const [AllOnline, setAllOnline] = useState<Set<string>>(new Set());

  const [conversations, setConversations] = useState<ConversationsType[]>([]);

  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [socketConnected, setSocketConnected] = useState(false);
  useEffect(() => {
    const senderId = user?.id || null;
    if (!senderId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSocket(null);
      setSocketConnected(false);
      setAllOnline(new Set());
      return;
    }
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}${senderId}`);

    setSocket(ws);

    ws.onopen = () => {
      setSocketConnected(true);
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "AllPresence": {
            const targetId = data.payload.receiverId;
            const isOnline = data.payload.isOnline;

            if (data.payload.senderId === senderId) {
              setAllOnline((prevSet) => {
                const newSet = new Set(prevSet);

                if (isOnline) {
                  newSet.add(targetId);
                } else {
                  newSet.delete(targetId);
                }

                return newSet;
              });
            }

            break;
          }

          case "presence": {
            const targetId = data.payload.senderId;
            const isOnline = data.payload.isOnline;

            if (data.payload.receiverId === senderId) {
              setAllOnline((prevSet) => {
                const newSet = new Set(prevSet);

                if (isOnline) {
                  newSet.add(targetId);
                } else {
                  newSet.delete(targetId);
                }

                return newSet;
              });
            }

            break;
          }
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };

    ws.onerror = () => {};

    ws.onclose = () => {
      setSocketConnected(false);
      setSocket((current) => (current === ws ? null : current));
    };
    return () => {
      if (
        ws.readyState === WebSocket.CONNECTING ||
        ws.readyState === WebSocket.OPEN
      ) {
        ws.close();
      }

      setSocket((current) => (current === ws ? null : current));
    };
  }, [user]);

  useEffect(() => {
    const senderId = user?.id;
    if (socket && socketConnected && conversations.length > 0 && senderId) {
      socket.send(
        JSON.stringify({
          type: "init_conversations",
          payload: conversations.map((c) => ({
            conversationId: c.id,
            receiverId: c.senderId === senderId ? c.receiverId : c.senderId,
          })),
        }),
      );
    }
  }, [socket, socketConnected, conversations, user]);
  const value: ValueType = {
    setOpenChat,
    AllOnline,
    setAllOnline,
    socket,
    openChat,
    conversations,
    setConversations,
    dataHeader,
    setDataHeader,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export default WsSocket;
