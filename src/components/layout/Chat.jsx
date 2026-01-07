// Lucide icons
import { X, Video } from "lucide-react";

// Hooks
import { useEffect, useRef, useState, useMemo } from "react";

// Stores
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useVideoCallStore } from "../../store/useVideoCallStore";

// Components
import ChatBubble from "../ui/ChatBubble";
import SendMessage from "../ui/SendMessage";
import ChatSkeleton from "./skeleton/ChatSkeleton";
import ImageViewer from "../ui/ImageViewer";

const Chat = () => {
  const {
    selectedUser,
    selectedUserMessages,
    closeChat,
    isMessagesLoading,
    latestMessage,
    handleScrollEvent,
    setLatestMessage,
  } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const { handleCallUser } = useVideoCallStore();

  const [isViewerOpen, setViewerOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const messageContainerRef = useRef();
  const bottomRef = useRef(null);

  // Get all images from messages (both legacy single image and new attachments)
  const images = useMemo(() => {
    const imageList = [];

    selectedUserMessages?.forEach((msg) => {
      // Legacy single image support
      if (msg.image) {
        imageList.push({ src: msg.image });
      }

      // New multiple attachments support
      if (msg.attachments && Array.isArray(msg.attachments)) {
        msg.attachments.forEach((attachment) => {
          if (attachment.isImage) {
            imageList.push({
              src: attachment.url,
              name: attachment.name,
            });
          }
        });
      }
    });

    return imageList.reverse();
  }, [selectedUserMessages]);

  // Scroll to bottom when the component mounts or when new messages are added
  useEffect(() => {
    if (!latestMessage || !selectedUserMessages.length) return;

    const latestTime = new Date(latestMessage.created_at);
    const lastMessageTime = new Date(
      selectedUserMessages[selectedUserMessages.length - 1].created_at
    );
    if (latestTime >= lastMessageTime) {
      bottomRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
    }
    setLatestMessage(null);
  }, [latestMessage, selectedUserMessages]);

  // Handle opening image viewer for both legacy and new attachments
  const handleOpenImageViewer = (imageUrl) => {
    const index = images.findIndex((img) => img.src === imageUrl);
    if (index !== -1) {
      setPhotoIndex(index);
      setViewerOpen(true);
    }
  };

  if (!selectedUser || isMessagesLoading) {
    return <ChatSkeleton />;
  }

  return (
    <div className="flex flex-col bg-base-100 rounded-lg h-full">
      {/* Header */}
      <div className="p-3 border-b border-b-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              className="size-10 rounded-full"
              src={selectedUser.profile_pic || "/default.png"}
              alt="profile"
            />
            <div className="overflow-hidden">
              <div className="font-medium truncate md:whitespace-normal md:overflow-visible md:text-normal">
                {selectedUser.fullname}
              </div>
              <div className="text-base-content/60 text-sm">
                {onlineUsers.includes(selectedUser.id) ? "Online" : "Offline"}
              </div>
            </div>
          </div>
          <div className="flex">
            <button
              onClick={handleCallUser}
              type="button"
              className="btn btn-ghost"
            >
              <Video />
            </button>
            <button onClick={closeChat} className="btn btn-ghost">
              <X />
            </button>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div
        ref={messageContainerRef}
        onScroll={() => handleScrollEvent(messageContainerRef.current)}
        className="flex-1 p-3 space-y-5 overflow-y-auto"
      >
        {selectedUserMessages.map((message, i) => (
          <ChatBubble
            key={i}
            message={message}
            user={message.sender_id === authUser.id ? authUser : selectedUser}
            isMine={message.sender_id === authUser.id}
            ref={i === selectedUserMessages.length - 1 ? bottomRef : null}
            openImageViewer={handleOpenImageViewer}
          />
        ))}
      </div>

      {/* Input */}
      <div>
        <SendMessage />
      </div>

      <ImageViewer
        images={images}
        isViewerOpen={isViewerOpen}
        setViewerOpen={setViewerOpen}
        photoIndex={photoIndex}
        setPhotoIndex={setPhotoIndex}
      />
    </div>
  );
};

export default Chat;
