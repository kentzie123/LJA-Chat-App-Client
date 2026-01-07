// Lucide icon
import { X } from "lucide-react";

// Store
import { useChatStore } from "../../../store/useChatStore";

// Components
import SendMessage from "../../ui/SendMessage";
import ChatBubbleSkeleton from "../../ui/ChatBubbleSkeleton";

const ChatSkeleton = () => {
  const { closeChat } = useChatStore();

  return (
    <div className="flex flex-col bg-base-100 rounded-lg">
      {/* Header */}
      <div className="p-3 border-b border-b-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full skeleton" />
            <div>
              <div className="h-6 w-45 skeleton"></div>
              <div className="h-4 w-15 skeleton mt-1"></div>
            </div>
          </div>
          <button onClick={closeChat} className="btn btn-sm btn-ghost">
            <X className="cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Messages container with scroll */}
      <div className="flex-1 p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-14.7rem)]">
        {Array(10)
          .fill(null)
          .map((_, i) => (
            <ChatBubbleSkeleton key={i} isLeft={i % 2} />
          ))}
      </div>

      {/* Input */}
      <div className="p-3">
        <SendMessage />
      </div>
    </div>
  );
};

export default ChatSkeleton;
