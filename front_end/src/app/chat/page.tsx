// "use client";
// import { useState, useEffect } from "react";
// import { MessageType, useSocket } from "@/context/WsSocket";
// import ChatMessages from "@/app/components/chat/ChatMessages";
// import ChatSidebar from "@/app/components/chat/SideBarChat";
// import { useUserContext } from "@/context/MyState";

// export default function PureWSChat() {
//   const { user } = useUserContext();
//   const {
//     dataHeader,
//     setDataHeader,
//     // senderId,
//     conversations,
//     setConversations,
//     setAllOnline,
//     socket,
//   } = useSocket();

//   const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
//   const [AllMessages, setAllMessages] = useState<Record<string, MessageType[]>>(
//     {},
//   );

//   useEffect(() => {
//     if (socket?.readyState === WebSocket.OPEN && conversations?.length > 0) {
//       socket?.send(
//         JSON.stringify({
//           type: "init_conversations",
//           payload: conversations.map((c: any) => ({
//             conversationId: c.id,
//             receiverId: user?.id === c.senderId ? c.receiverId : c.senderId,
//           })),
//         }),
//       );
//     }
//   }, [conversations, socket, user]);

//   useEffect(() => {
//     if (!socket) return;
//     const handleMessage = (event: MessageEvent) => {
//       const data = JSON.parse(event.data);
//       switch (data.type) {
//         case "AllPresence": {
//           const targetId = data.payload.receiverId;
//           const isOnline = data.payload.isOnline;
//           if (data.payload.senderId === user?.id) {
//             setAllOnline((prevSet: any) => {
//               const newSet = new Set(prevSet);
//               isOnline ? newSet.add(targetId) : newSet.delete(targetId);
//               return newSet;
//             });
//           }
//           break;
//         }
//         case "presence": {
//           const targetId = data.payload.senderId;
//           const isOnline = data.payload.isOnline;
//           if (data.payload.receiverId === user?.id) {
//             setAllOnline((prevSet: any) => {
//               const newSet = new Set(prevSet);
//               isOnline ? newSet.add(targetId) : newSet.delete(targetId);
//               return newSet;
//             });
//           }
//           break;
//         }
//         case "new_message": {
//           const { conversationId } = data.payload;
//           setAllMessages((prev) => {
//             const oldMessages = prev[conversationId] || [];
//             return {
//               ...prev,
//               [conversationId]: [...oldMessages, data.payload],
//             };
//           });
//           setConversations((prev: any[]) => {
//             const updated = prev.map((conv) => {
//               if (conv.id !== conversationId) return conv;
//               return {
//                 ...conv,
//                 lastMessage: data.payload.content,
//                 lastMessageAt: new Date().toISOString(),
//               };
//             });
//             return updated.sort(
//               (a, b) =>
//                 new Date(b.lastMessageAt).getTime() -
//                 new Date(a.lastMessageAt).getTime(),
//             );
//           });
//           break;
//         }
//         case "typing": {
//           const { receiverId, isTyping: typing } = data.payload;
//           setIsTyping((prev) => ({ ...prev, [receiverId]: typing }));
//           break;
//         }
//       }
//     };
//     socket.addEventListener("message", handleMessage);
//     return () => socket.removeEventListener("message", handleMessage);
//   }, [socket, setAllOnline, setConversations, user?.id]);

//   return (
//     <div
//       className="no-scrollbar flex h-[100vh] md:h-[90vh] bg-[#F0F2F5] p-0 md:p-8 font-sans"
//       dir="rtl"
//     >
//       <div className="max-w-7xl mx-auto w-full flex bg-white md:rounded-3xl shadow-2xl overflow-hidden border border-white/50 relative">
//         <div
//           className={`w-full md:w-[350px] lg:w-[400px] border-l border-gray-100 ${dataHeader ? "hidden md:block" : "block"}`}
//         >
//           <ChatSidebar isTyping={isTyping} />
//         </div>

//         <div
//           className={`flex-1 flex flex-col bg-gray-50 ${!dataHeader ? "hidden md:flex" : "flex"}`}
//         >
//           {!dataHeader ? (
//             <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
//               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
//                 <svg
//                   className="w-10 h-10 text-gray-300"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="1.5"
//                     d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
//                   />
//                 </svg>
//               </div>
//               <p className="text-lg font-medium">اختر محادثة لبدء المراسلة</p>
//             </div>
//           ) : (
//             <div className="flex-1 flex flex-col relative h-full">
//               <div className="md:hidden absolute top-4 right-4 z-50">
//                 <button
//                   onClick={() => setDataHeader(null)}
//                   className="p-2 bg-white/80 backdrop-blur rounded-full shadow-md text-[#204658]"
//                 >
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M15 19l-7-7 7-7"
//                     />
//                   </svg>
//                 </button>
//               </div>

//               <ChatMessages
//                 setAllMessages={setAllMessages}
//                 isTyping={isTyping}
//                 AllMessages={AllMessages}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";

// import { MessageType, useSocket } from "@/context/WsSocket";

// import ChatMessages from "@/app/components/chat/ChatMessages";
// import ChatSidebar from "@/app/components/chat/SideBarChat";

// import { useUserContext } from "@/context/MyState";

// export default function PureWSChat() {
//   const { user } = useUserContext();

//   const {
//     dataHeader,
//     setDataHeader,

//     conversations,
//     setConversations,

//     socket,
//     socketConnected,
//   } = useSocket();

//   const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});

//   const [AllMessages, setAllMessages] = useState<Record<string, MessageType[]>>(
//     {},
//   );

//   // ================= INITIALIZE CONVERSATIONS =================

//   useEffect(() => {
//     if (
//       !socket ||
//       !socketConnected ||
//       socket.readyState !== WebSocket.OPEN ||
//       !user?.id ||
//       !conversations.length
//     ) {
//       return;
//     }

//     const payload = conversations.map((conversation) => ({
//       conversationId: String(conversation.id),

//       receiverId: String(
//         String(conversation.senderId) === String(user.id)
//           ? conversation.receiverId
//           : conversation.senderId,
//       ),
//     }));

//     console.log("📤 Initializing conversations:", payload);

//     socket.send(
//       JSON.stringify({
//         type: "init_conversations",
//         payload,
//       }),
//     );
//   }, [socket, socketConnected, conversations, user?.id]);

//   // ================= RECEIVE WEBSOCKET EVENTS =================

//   useEffect(() => {
//     if (!socket) return;

//     const handleMessage = (event: MessageEvent) => {
//       try {
//         const data = JSON.parse(event.data);

//         switch (data.type) {
//           // ================= NEW MESSAGE =================

//           case "new_message": {
//             const message = data.payload;

//             const conversationId = String(message.conversationId);

//             setAllMessages((prev) => {
//               const currentMessages = prev[conversationId] || [];

//               // منع إضافة الرسالة مرتين
//               if (
//                 message.id &&
//                 currentMessages.some((item) => item.id === message.id)
//               ) {
//                 return prev;
//               }

//               return {
//                 ...prev,
//                 [conversationId]: [...currentMessages, message],
//               };
//             });

//             setConversations((prev: any[]) => {
//               const updated = prev.map((conversation) => {
//                 if (String(conversation.id) !== conversationId) {
//                   return conversation;
//                 }

//                 return {
//                   ...conversation,
//                   lastMessage: message.content,
//                   lastMessageAt: new Date().toISOString(),
//                 };
//               });

//               return updated.sort(
//                 (a, b) =>
//                   new Date(b.lastMessageAt || b.time).getTime() -
//                   new Date(a.lastMessageAt || a.time).getTime(),
//               );
//             });

//             break;
//           }

//           // ================= TYPING =================

//           case "typing": {
//             const {
//               receiverId,
//               conversationId,
//               isTyping: typing,
//             } = data.payload;

//             if (!receiverId || !conversationId) {
//               break;
//             }

//             console.log("⌨️ Typing event received:", {
//               receiverId,
//               conversationId,
//               typing,
//             });

//             setIsTyping((prev) => ({
//               ...prev,
//               [String(receiverId)]: typing,
//             }));

//             break;
//           }

//           // ================= ERROR =================

//           case "error": {
//             console.error("WebSocket server error:", data.payload);
//             break;
//           }

//           default:
//             break;
//         }
//       } catch (error) {
//         console.error("WebSocket message error:", error);
//       }
//     };

//     socket.addEventListener("message", handleMessage);

//     return () => {
//       socket.removeEventListener("message", handleMessage);
//     };
//   }, [socket, setConversations]);

//   // ================= UI =================

//   return (
//     <div
//       className="no-scrollbar flex h-[100vh] md:h-[90vh] bg-[#F0F2F5] p-0 md:p-8 font-sans"
//       dir="rtl"
//     >
//       <div className="max-w-7xl mx-auto w-full flex bg-white md:rounded-3xl shadow-2xl overflow-hidden border border-white/50 relative">
//         {/* SIDEBAR */}

//         <div
//           className={`w-full md:w-[350px] lg:w-[400px] border-l border-gray-100 ${
//             dataHeader ? "hidden md:block" : "block"
//           }`}
//         >
//           <ChatSidebar isTyping={isTyping} />
//         </div>

//         {/* CHAT CONTENT */}

//         <div
//           className={`flex-1 flex flex-col bg-gray-50 ${
//             !dataHeader ? "hidden md:flex" : "flex"
//           }`}
//         >
//           {!dataHeader ? (
//             <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
//               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
//                 <svg
//                   className="w-10 h-10 text-gray-300"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="1.5"
//                     d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
//                   />
//                 </svg>
//               </div>

//               <p className="text-lg font-medium">اختر محادثة لبدء المراسلة</p>
//             </div>
//           ) : (
//             <div className="flex-1 flex flex-col relative h-full">
//               {/* MOBILE BACK BUTTON */}

//               <div className="md:hidden absolute top-4 right-4 z-50">
//                 <button
//                   onClick={() => setDataHeader(null)}
//                   className="p-2 bg-white/80 backdrop-blur rounded-full shadow-md text-[#204658]"
//                 >
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M15 19l-7-7 7-7"
//                     />
//                   </svg>
//                 </button>
//               </div>

//               <ChatMessages
//                 setAllMessages={setAllMessages}
//                 isTyping={isTyping}
//                 AllMessages={AllMessages}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { MessageType, useSocket } from "@/context/WsSocket";
import ChatMessages from "@/app/components/chat/ChatMessages";
import ChatSidebar from "@/app/components/chat/SideBarChat";
import { useUserContext } from "@/context/MyState";

export default function PureWSChat() {
  const { user } = useUserContext();

  const {
    dataHeader,
    setDataHeader,
    conversations,
    setConversations,
    setAllOnline,
    socket,
  } = useSocket();

  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});

  const [AllMessages, setAllMessages] = useState<Record<string, MessageType[]>>(
    {},
  );

  // تسجيل المحادثات على السيرفر
  useEffect(() => {
    if (
      !socket ||
      socket.readyState !== WebSocket.OPEN ||
      !user?.id ||
      !conversations?.length
    ) {
      return;
    }

    socket.send(
      JSON.stringify({
        type: "init_conversations",
        payload: conversations.map((c: any) => ({
          conversationId: c.id,
          receiverId: user.id === c.senderId ? c.receiverId : c.senderId,
        })),
      }),
    );
  }, [conversations, socket, user?.id]);

  // استقبال رسائل WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "AllPresence": {
            const targetId = data.payload.receiverId;
            const isOnline = data.payload.isOnline;

            if (data.payload.senderId === user?.id) {
              setAllOnline((prevSet: Set<string>) => {
                const newSet = new Set(prevSet);

                isOnline ? newSet.add(targetId) : newSet.delete(targetId);

                return newSet;
              });
            }

            break;
          }

          case "presence": {
            const targetId = data.payload.senderId;
            const isOnline = data.payload.isOnline;

            if (data.payload.receiverId === user?.id) {
              setAllOnline((prevSet: Set<string>) => {
                const newSet = new Set(prevSet);

                isOnline ? newSet.add(targetId) : newSet.delete(targetId);

                return newSet;
              });
            }

            break;
          }

          case "new_message": {
            const { conversationId } = data.payload;

            setAllMessages((prev) => ({
              ...prev,
              [conversationId]: [...(prev[conversationId] || []), data.payload],
            }));

            setConversations((prev: any[]) => {
              const updated = prev.map((conv) => {
                if (conv.id !== conversationId) return conv;

                return {
                  ...conv,
                  lastMessage: data.payload.content,
                  lastMessageAt: new Date().toISOString(),
                };
              });

              return updated.sort(
                (a, b) =>
                  new Date(b.lastMessageAt).getTime() -
                  new Date(a.lastMessageAt).getTime(),
              );
            });

            break;
          }

          case "typing": {
            const {
              receiverId,
              conversationId,
              isTyping: typing,
            } = data.payload;

            if (!receiverId || !conversationId) break;

            setIsTyping((prev) => ({
              ...prev,
              [receiverId]: typing,
            }));

            break;
          }
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, user?.id, setAllOnline, setConversations]);

  return (
    <div
      className="no-scrollbar flex h-[100vh] md:h-[90vh] bg-[#F0F2F5] p-0 md:p-8 font-sans"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto w-full flex bg-white md:rounded-3xl shadow-2xl overflow-hidden border border-white/50 relative">
        <div
          className={`w-full md:w-[350px] lg:w-[400px] border-l border-gray-100 ${
            dataHeader ? "hidden md:block" : "block"
          }`}
        >
          <ChatSidebar isTyping={isTyping} />
        </div>

        <div
          className={`flex-1 flex flex-col bg-gray-50 ${
            !dataHeader ? "hidden md:flex" : "flex"
          }`}
        >
          {!dataHeader ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>

              <p className="text-lg font-medium">اختر محادثة لبدء المراسلة</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col relative h-full">
              <div className="md:hidden absolute top-4 right-4 z-50">
                <button
                  onClick={() => setDataHeader(null)}
                  className="p-2 bg-white/80 backdrop-blur rounded-full shadow-md text-[#204658]"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              </div>

              <ChatMessages
                setAllMessages={setAllMessages}
                isTyping={isTyping}
                AllMessages={AllMessages}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
