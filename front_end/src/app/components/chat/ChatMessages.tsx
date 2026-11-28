"use client";

import { useSocket } from "@/context/WsSocket";
import { Send, X, User } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatDateTime } from "../helper";
import { useUserContext } from "@/context/MyState";

type TypingSession = {
  conversationId: string;
  receiverId: string;
};

type ChatMessagesProps = {
  setAllMessages: React.Dispatch<React.SetStateAction<Record<string, any[]>>>;
  AllMessages: Record<string, any[]>;
  isTyping: Record<string, boolean>;
};

const ChatMessages = ({
  setAllMessages,
  AllMessages,
  isTyping,
}: ChatMessagesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const typingSessionRef = useRef<TypingSession | null>(null);

  const [inputValue, setInputValue] = useState("");

  const { user } = useUserContext();

  const { dataHeader, setDataHeader, AllOnline, socket } = useSocket();

  const receiverId =
    dataHeader?.receiverId === user?.id
      ? dataHeader?.senderId
      : dataHeader?.receiverId;

  const messages = AllMessages[dataHeader?.id] || [];

  const sendTypingStatus = useCallback(
    (isTyping: boolean, session: TypingSession) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) return;

      socket.send(
        JSON.stringify({
          type: "typing",
          payload: {
            receiverId: session.receiverId,
            conversationId: session.conversationId,
            isTyping,
          },
        }),
      );
    },
    [socket],
  );

  const stopTyping = useCallback(() => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    const session = typingSessionRef.current;

    if (!session) return;

    sendTypingStatus(false, session);

    typingSessionRef.current = null;
  }, [sendTypingStatus]);

  const handleTyping = useCallback(() => {
    if (!dataHeader?.id || !receiverId || !user?.id) return;

    const session: TypingSession = {
      conversationId: dataHeader.id,
      receiverId,
    };

    if (!typingSessionRef.current) {
      typingSessionRef.current = session;
      sendTypingStatus(true, session);
    }

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = setTimeout(() => {
      stopTyping();
    }, 1500);
  }, [dataHeader?.id, receiverId, user?.id, sendTypingStatus, stopTyping]);

  const openChat = useCallback(async () => {
    if (!dataHeader?.id || !user?.id || !receiverId) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}messages?senderId=${user?.id}&receiverId=${receiverId}`,
      );

      if (!res.ok) {
        throw new Error("Failed to load messages");
      }

      const data = await res.json();

      setAllMessages((prev) => ({
        ...prev,
        [dataHeader.id]: data?.data,
      }));
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  }, [dataHeader?.id, user?.id, receiverId, setAllMessages]);

  useEffect(() => {
    setInputValue("");

    stopTyping();

    if (!dataHeader?.id) return;

    inputRef.current?.focus();

    if (!AllMessages[dataHeader.id]) {
      openChat();
    }
  }, [dataHeader?.id]);

  useEffect(() => {
    return () => {
      stopTyping();
    };
  }, [dataHeader?.id, stopTyping]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const userOnline = AllOnline?.has(receiverId!);

  const typing = isTyping[receiverId!] || false;

  const sendMessage = useCallback(() => {
    if (!inputValue.trim() || !dataHeader || !socket || !user?.id) {
      return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return;
    }

    stopTyping();

    const messagePayload = {
      type: "send_message",
      payload: {
        conversationId: dataHeader.id,
        senderId: user.id,
        receiverId,
        content: inputValue?.trim(),
      },
    };

    socket.send(JSON.stringify(messagePayload));

    setInputValue("");
  }, [inputValue, dataHeader, socket, user?.id, receiverId, stopTyping]);

  if (!dataHeader) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F5F7F9] text-gray-400">
        <div className="p-8 rounded-full bg-white mb-4 shadow-sm">
          <User size={48} className="opacity-20" />
        </div>

        <p className="font-bold text-lg">اختر محادثة للبدء</p>
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex flex-col bg-[#F5F7F9] h-full overflow-hidden"
      dir="rtl"
    >
      <header className="p-4 bg-white border-b flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="size-11 rounded-full overflow-hidden border border-gray-200 bg-gradient-to-tr from-gray-50 to-gray-200 flex items-center justify-center">
              {dataHeader?.imageUrl ? (
                <Image
                  src={dataHeader?.imageUrl}
                  alt={dataHeader?.name || "User"}
                  width={80}
                  height={80}
                  className="object-cover size-full"
                  unoptimized
                />
              ) : (
                <User className="text-gray-400" size={24} />
              )}
            </div>

            <div
              className={`absolute bottom-0 left-0 size-3 border-2 border-white rounded-full transition-colors duration-500 ${
                userOnline
                  ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                  : "bg-gray-300"
              }`}
            />
          </div>

          <div className="text-right">
            <h3 className="font-bold text-[#204658] text-[15px]">
              {dataHeader?.name}
            </h3>

            <span
              className={`text-[11px] font-medium ${
                userOnline ? "text-green-600" : "text-gray-400"
              }`}
            >
              {userOnline ? "متصل الآن" : "غير متصل"}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            stopTyping();
            setDataHeader(null);
          }}
          className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
        >
          <X size={20} />
        </button>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F9FA] custom-scrollbar"
      >
        {messages.map((msg: any, index: number) => {
          const isMe = msg.senderId === user?.id;

          return (
            <div
              key={msg?.id || index}
              className={`flex ${isMe ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`group relative p-3 px-4 rounded-[18px] max-w-[80%] shadow-sm transition-all ${
                  isMe
                    ? "bg-[#204658] text-white rounded-tr-none hover:bg-[#28556b]"
                    : "bg-white text-[#204658] rounded-tl-none border border-gray-100 hover:border-gray-200"
                }`}
              >
                <p className="text-[14px] leading-relaxed break-words whitespace-pre-wrap">
                  {msg?.content}
                </p>

                <span
                  className={`text-[9px] mt-1 block opacity-50 ${
                    isMe ? "text-left" : "text-right"
                  }`}
                >
                  {formatDateTime(msg?.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="relative p-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2 max-w-4xl mx-auto bg-[#F8F9FA] p-1.5 rounded-[24px] border border-gray-200 focus-within:bg-white focus-within:border-[#204658] focus-within:ring-4 focus-within:ring-[#204658]/5 transition-all duration-300">
          {typing && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 transition-all duration-500 ease-in-out z-20">
              <div className="bg-white/95 backdrop-blur-md border border-gray-200 p-2 px-5 rounded-full flex items-center gap-3 shadow-xl ring-1 ring-black/5">
                <div className="flex gap-1.5">
                  <span
                    className="size-1.5 bg-[#204658] rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />

                  <span
                    className="size-1.5 bg-[#204658] rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />

                  <span
                    className="size-1.5 bg-[#204658] rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>

                <span className="text-[13px] text-[#204658] font-medium tracking-tight border-r pr-3 border-gray-200">
                  {dataHeader?.name} يكتب الآن...
                </span>
              </div>
            </div>
          )}

          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              const value = e.target.value;

              setInputValue(value);

              if (!value.trim()) {
                stopTyping();
                return;
              }

              handleTyping();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && inputValue.trim()) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 bg-transparent py-2.5 px-4 outline-none text-[14.5px] text-gray-800 placeholder:text-gray-400"
          />

          <button
            onClick={sendMessage}
            disabled={!inputValue.trim()}
            className="bg-[#204658] text-white p-3 rounded-full hover:bg-[#2c5b72] active:scale-90 disabled:opacity-20 disabled:grayscale transition-all shadow-md flex-shrink-0"
          >
            <Send size={18} className="rotate-180" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatMessages;
