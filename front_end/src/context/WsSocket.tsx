// "use client";
// import { useRouter } from "next/navigation";
// import {
//   createContext,
//   Dispatch,
//   SetStateAction,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// export type ConversationsType = {
//   id: string;
//   userId: string;
//   receiverId: string;
//   senderId: string;
//   active: boolean;
//   name: string;
//   time: string;
//   online: boolean;
//   unread: number;
//   studyMaterial: string;
//   lastMessage: string;
// };

// export type MessageType = {
//   id: string;
//   senderId: string;
//   receiverId: string;
//   conversationId: string;
//   isRead: boolean;
//   content: string;
//   time: string;
//   createdAt: string;
// };

// type ValueType = {
//   setOpenChat: Dispatch<SetStateAction<string>>;
//   openChat: string;
//   senderId: string | null;
//   setSenderId: Dispatch<SetStateAction<string | null>>;
//   AllOnline: Set<string>;
//   setAllOnline: Dispatch<SetStateAction<Set<string>>>;
//   socket: WebSocket | null;
//   conversations: ConversationsType[];
//   setConversations: Dispatch<SetStateAction<ConversationsType[]>>;
//   dataHeader: ConversationsType | null;
//   setDataHeader: Dispatch<SetStateAction<ConversationsType | null>>;
// };

// const SocketContext = createContext<ValueType | null>(null);

// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (!context)
//     throw new Error("useSocket must be used within a SocketProvider");
//   return context;
// };

// const WsSocket = ({ children }: { children: React.ReactNode }) => {
//   const [openChat, setOpenChat] = useState<string>("");
//   const [dataHeader, setDataHeader] = useState<ConversationsType | null>(null);
//   const [senderId, setSenderId] = useState<string | null>(null);
//   const [AllOnline, setAllOnline] = useState<Set<string>>(new Set());
//   const [conversations, setConversations] = useState<ConversationsType[]>([]);
//   const [socket, setSocket] = useState<WebSocket | null>(null);
//   const Router = useRouter();

//   useEffect(() => {
//     setSenderId(localStorage.getItem("userId"));
//   }, []);

//   useEffect(() => {
//     if (
//       socket?.readyState === WebSocket.OPEN &&
//       conversations.length > 0 &&
//       senderId
//     ) {
//       socket?.send(
//         JSON.stringify({
//           type: "init_conversations",
//           payload: conversations.map((c) => ({
//             conversationId: c.id,
//             receiverId: c.senderId === senderId ? c.receiverId : c.senderId,
//           })),
//         }),
//       );
//     }
//   }, [socket, conversations, senderId]);

//   useEffect(() => {
//     if (!senderId) return;

//     const ws = new WebSocket(
//       `${process.env.NEXT_PUBLIC_WS_URL}${senderId || ""}`,
//     );
//     // const ws = new WebSocket(
//     //   `ws://localhost:3001/api/v1/ws?userId=${senderId}`,
//     // );
//     setSocket(ws);

//     ws.onopen = () => {
//       console.log("✅ Socket Connected");
//     };

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);

//       switch (data.type) {
//         case "AllPresence": {
//           const targetId = data.payload.receiverId;
//           const isOnline = data.payload.isOnline;

//           if (data.payload.senderId === senderId) {
//             setAllOnline((prevSet) => {
//               const newSet = new Set(prevSet);
//               if (isOnline) {
//                 newSet.add(targetId);
//               } else {
//                 newSet.delete(targetId);
//               }
//               return newSet;
//             });
//           }
//           break;
//         }
//         case "presence": {
//           const targetId = data.payload.senderId;
//           const isOnline = data.payload.isOnline;

//           console.log("====================================");
//           console.log("targetId", targetId);
//           console.log("isOnline", isOnline);
//           console.log("====================================");
//           if (data.payload.receiverId === senderId) {
//             setAllOnline((prevSet) => {
//               const newSet = new Set(prevSet);
//               if (isOnline) {
//                 newSet.add(targetId);
//               } else {
//                 newSet.delete(targetId);
//               }
//               return newSet;
//             });
//           }
//           break;
//         }
//       }
//     };

//     ws.onclose = () => {
//       setTimeout(() => {
//         Router.refresh();
//       }, 30000);
//     };
//     return () => {
//       ws.close();
//     };
//   }, [senderId]);

//   const value: ValueType = {
//     setOpenChat,
//     senderId,
//     AllOnline,
//     setAllOnline,
//     socket,
//     setSenderId,
//     openChat,
//     conversations,
//     setConversations,
//     dataHeader,
//     setDataHeader,
//   };

//   return (
//     <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
//   );
// };

// export default WsSocket;

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
  socketConnected: boolean;

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

  const [openChat, setOpenChat] = useState("");

  const [dataHeader, setDataHeader] = useState<ConversationsType | null>(null);

  const [AllOnline, setAllOnline] = useState<Set<string>>(new Set());

  const [conversations, setConversations] = useState<ConversationsType[]>([]);

  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [socketConnected, setSocketConnected] = useState(false);

  // ================= CONNECTION =================

  useEffect(() => {
    const userId = user?.id;

    if (!userId) {
      setSocket(null);
      setSocketConnected(false);
      setAllOnline(new Set());
      return;
    }

    const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL;

    if (!wsBaseUrl) {
      console.error("NEXT_PUBLIC_WS_URL is missing");
      return;
    }

    let ws: WebSocket;

    try {
      const wsUrl = new URL(wsBaseUrl);

      // Backend expects: ?userId=...
      wsUrl.searchParams.set("userId", String(userId));

      ws = new WebSocket(wsUrl.toString());
    } catch {
      return;
    }

    setSocket(ws);
    setSocketConnected(false);

    console.log("🔄 Connecting WebSocket:", ws.url);

    // ================= OPEN =================

    ws.onopen = () => {
      console.log("✅ Socket Connected:", userId);
      setSocketConnected(true);
    };

    // ================= MESSAGE =================

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "AllPresence": {
            const targetId = String(data.payload.receiverId);
            const isOnline = data.payload.isOnline;

            if (String(data.payload.senderId) === String(userId)) {
              setAllOnline((prev) => {
                const updated = new Set(prev);

                if (isOnline) {
                  updated.add(targetId);
                } else {
                  updated.delete(targetId);
                }

                return updated;
              });
            }

            break;
          }

          case "presence": {
            const targetId = String(data.payload.senderId);
            const isOnline = data.payload.isOnline;

            if (String(data.payload.receiverId) === String(userId)) {
              setAllOnline((prev) => {
                const updated = new Set(prev);

                if (isOnline) {
                  updated.add(targetId);
                } else {
                  updated.delete(targetId);
                }

                return updated;
              });
            }

            break;
          }

          case "error": {
            // console.error("WebSocket server error:", data.payload);
            break;
          }

          default:
            break;
        }
      } catch (error) {
        console.error("WebSocket message parsing error:", error);
      }
    };

    // ================= ERROR =================

    ws.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
    };

    // ================= CLOSE =================

    ws.onclose = () => {
      console.log("🔴 Socket Disconnected:", userId);

      setSocketConnected(false);

      setSocket((current) => (current === ws ? null : current));
    };

    // ================= CLEANUP =================

    return () => {
      ws.onopen = null;
      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null;

      if (
        ws.readyState === WebSocket.CONNECTING ||
        ws.readyState === WebSocket.OPEN
      ) {
        ws.close();
      }

      setSocket((current) => (current === ws ? null : current));
      setSocketConnected(false);
    };
  }, [user?.id]);

  // ================= PROVIDER =================

  const value: ValueType = {
    setOpenChat,
    openChat,

    AllOnline,
    setAllOnline,

    socket,
    socketConnected,

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

// "use client";

// import {
//   createContext,
//   Dispatch,
//   SetStateAction,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import { useUserContext } from "./MyState";

// export type ConversationsType = {
//   id: string;
//   userId: string;
//   receiverId: string;
//   senderId: string;
//   active: boolean;
//   name: string;
//   time: string;
//   online: boolean;
//   unread: number;
//   studyMaterial: string;
//   lastMessage: string;
// };

// export type MessageType = {
//   id: string;
//   senderId: string;
//   receiverId: string;
//   conversationId: string;
//   isRead: boolean;
//   content: string;
//   time: string;
//   createdAt: string;
// };

// type ValueType = {
//   setOpenChat: Dispatch<SetStateAction<string>>;
//   openChat: string;
//   // senderId: string | null;
//   // setSenderId: Dispatch<SetStateAction<string | null>>;
//   AllOnline: Set<string>;
//   setAllOnline: Dispatch<SetStateAction<Set<string>>>;
//   socket: WebSocket | null;
//   conversations: ConversationsType[];
//   setConversations: Dispatch<SetStateAction<ConversationsType[]>>;
//   dataHeader: ConversationsType | null;
//   setDataHeader: Dispatch<SetStateAction<ConversationsType | null>>;
// };

// const SocketContext = createContext<ValueType | null>(null);

// export const useSocket = () => {
//   const context = useContext(SocketContext);

//   if (!context) {
//     throw new Error("useSocket must be used within a SocketProvider");
//   }

//   return context;
// };

// const WsSocket = ({ children }: { children: React.ReactNode }) => {
//   const { user } = useUserContext();
//   const [openChat, setOpenChat] = useState<string>("");
//   const [dataHeader, setDataHeader] = useState<ConversationsType | null>(null);

//   // const [senderId, setSenderId] = useState<string | null>(null);

//   const [AllOnline, setAllOnline] = useState<Set<string>>(new Set());

//   const [conversations, setConversations] = useState<ConversationsType[]>([]);

//   const [socket, setSocket] = useState<WebSocket | null>(null);

//   const [socketConnected, setSocketConnected] = useState(false);

//   // 1. Get userId when the application starts
//   // useEffect(() => {
//   // const userId = localStorage.getItem("userId");

//   // if (userId) {
//   //   setSenderId(userId);
//   // }
//   // }, []);

//   // 2. Connect / Disconnect WebSocket based on authentication
//   useEffect(() => {
//     const senderId = user?.id || null;
//     // if (!senderId) {
//     if (!senderId) {
//       setSocket(null);
//       setSocketConnected(false);
//       setAllOnline(new Set());
//       return;
//     }
//     // if (!senderId) {
//     //   setSocket(null);
//     //   setAllOnline(new Set());
//     //   return;
//     // }

//     const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}${senderId}`);

//     setSocket(ws);

//     ws.onopen = () => {
//       console.log("✅ Socket Connected:", senderId);
//       setSocketConnected(true);
//     };
//     // ws.onopen = () => {
//     //   console.log("✅ Socket Connected:", senderId);
//     // };

//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);

//         switch (data.type) {
//           case "AllPresence": {
//             const targetId = data.payload.receiverId;
//             const isOnline = data.payload.isOnline;

//             if (data.payload.senderId === senderId) {
//               setAllOnline((prevSet) => {
//                 const newSet = new Set(prevSet);

//                 if (isOnline) {
//                   newSet.add(targetId);
//                 } else {
//                   newSet.delete(targetId);
//                 }

//                 return newSet;
//               });
//             }

//             break;
//           }

//           case "presence": {
//             const targetId = data.payload.senderId;
//             const isOnline = data.payload.isOnline;

//             if (data.payload.receiverId === senderId) {
//               setAllOnline((prevSet) => {
//                 const newSet = new Set(prevSet);

//                 if (isOnline) {
//                   newSet.add(targetId);
//                 } else {
//                   newSet.delete(targetId);
//                 }

//                 return newSet;
//               });
//             }

//             break;
//           }
//         }
//       } catch (error) {
//         console.error("WebSocket message error:", error);
//       }
//     };

//     ws.onerror = (error) => {
//       console.error("❌ WebSocket Error:", error);
//     };

//     ws.onclose = () => {
//       console.log("🔴 Socket Disconnected:", senderId);

//       setSocketConnected(false);

//       setSocket((current) => (current === ws ? null : current));
//     };
//     // ws.onclose = () => {
//     //   console.log("🔴 Socket Disconnected:", senderId);

//     //   setSocket((current) => (current === ws ? null : current));
//     // };

//     return () => {
//       if (
//         ws.readyState === WebSocket.CONNECTING ||
//         ws.readyState === WebSocket.OPEN
//       ) {
//         ws.close();
//       }

//       setSocket((current) => (current === ws ? null : current));
//     };
//   }, [user]);

//   // 3. Initialize conversations after connection
//   useEffect(() => {
//     const senderId = user?.id;
//     if (socket && socketConnected && conversations.length > 0 && senderId) {
//       socket.send(
//         JSON.stringify({
//           type: "init_conversations",
//           payload: conversations.map((c) => ({
//             conversationId: c.id,
//             receiverId: c.senderId === senderId ? c.receiverId : c.senderId,
//           })),
//         }),
//       );
//     }
//   }, [socket, socketConnected, conversations, user]);
//   // useEffect(() => {
//   //   if (
//   //     socket?.readyState === WebSocket.OPEN &&
//   //     conversations.length > 0 &&
//   //     senderId
//   //   ) {
//   //     socket.send(
//   //       JSON.stringify({
//   //         type: "init_conversations",
//   //         payload: conversations.map((c) => ({
//   //           conversationId: c.id,
//   //           receiverId: c.senderId === senderId ? c.receiverId : c.senderId,
//   //         })),
//   //       }),
//   //     );
//   //   }
//   // }, [socket, conversations, senderId]);

//   const value: ValueType = {
//     setOpenChat,
//     // senderId,
//     AllOnline,
//     setAllOnline,
//     socket,
//     // setSenderId,
//     openChat,
//     conversations,
//     setConversations,
//     dataHeader,
//     setDataHeader,
//   };

//   return (
//     <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
//   );
// };

// export default WsSocket;
