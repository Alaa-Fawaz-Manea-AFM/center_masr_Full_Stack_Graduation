"use client";
import { useUserContext } from "@/context/MyState";
import { useSocket } from "@/context/WsSocket";
import { DOMAIN } from "@/utils/constants";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const ButtonSendChat = ({ id }: { id: string }) => {
  const router = useRouter();
  const { user } = useUserContext();
  const {
    setDataHeader,
    setConversations,
    conversations,
    // senderId,
    socket,
  } = useSocket();

  const createConversation = async () => {
    if (id === user?.id) {
      setDataHeader(null);
      return router.push("/chat");
    }
    const res = await fetch(
      `${DOMAIN}conversations?senderId=${user?.id}&receiverId=${id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
    );
    const data = await res.json();

    if (
      !conversations.some((item) => item.id === data.data.id) &&
      user?.id !== data.data.senderId
    ) {
      setConversations((prev) => [...prev, data.data]);
    }
    setDataHeader(data.data);

    const emitEvent = (type: string) => {
      socket?.send(
        JSON.stringify({
          type,
          payload: {
            receiverId: data.data.receiverId,
            conversationId: data.data.id,
          },
        }),
      );
    };
    emitEvent("join");
    emitEvent("open_chat");
    router.push("/chat");
  };

  return (
    <button
      onClick={() =>
        user === null
          ? toast.error("يرجى تسجيل الدخول أولاً")
          : createConversation()
      }
      className="flex items-center gap-2 border border-[#818181] text-[#343A40] text-sm px-6 py-2.5 rounded-xl font-bold cursor-pointer hover:bg-[#343A40] hover:text-white transition-all"
    >
      <MessageSquare size={18} /> مراسلة
    </button>
  );
};

export default ButtonSendChat;
