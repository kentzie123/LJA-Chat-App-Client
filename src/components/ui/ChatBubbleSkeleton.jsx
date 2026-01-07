const ChatBubbleSkeleton = ({ isLeft }) => {
  return (
    <div
      className={`chat ${
        isLeft ? "chat-start" : "chat-end"
      } `}
    >
      <div className="chat-image avatar">
        <div className="size-10 rounded-full skeleton"/>
      </div>
      <div className="ps-2 pb-1 chat-header">
        <div className="h-3 w-12 skeleton"></div>
      </div>
      <div className="h-5 w-45 skeleton"/>
    </div>
  );
};

export default ChatBubbleSkeleton;
