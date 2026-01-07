// Time formatter
import { formatChatTimestamp } from "../../lib/timeFormat";
import { FileText, Download, File } from "lucide-react";

// File Helper
import { formatFileSize } from "../../lib/fileHelpers";

const ChatBubble = ({ message, user, isMine, ref, openImageViewer }) => {
  // Same getFileIcon function for consistency
  const getFileIcon = (file) => {
    if (file.type.includes("word")) {
      return <FileText className="size-4" />;
    } else if (
      file.type.includes("excel") ||
      file.type.includes("spreadsheet")
    ) {
      return <FileText className="size-4" />;
    } else if (
      file.type.includes("powerpoint") ||
      file.type.includes("presentation")
    ) {
      return <FileText className="size-4" />;
    } else if (file.type === "application/pdf") {
      return <FileText className="size-4" />;
    } else {
      return <File className="size-4" />;
    }
  };

  return (
    <div ref={ref} className={`chat ${isMine ? "chat-end" : "chat-start"} `}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src={user.profile_pic ? user.profile_pic : "/default.png"}
          />
        </div>
      </div>
      <div className="ps-2 pb-1 chat-header">
        <time className="text-xs opacity-50">
          {message.created_at && formatChatTimestamp(message.created_at)}
        </time>
      </div>

      <div
        className={`chat-bubble ${
          message.attachments ? "bg-transparent p-0" : ""
        }`}
      >
        {/* Display Multiple Attachments */}
        {message.attachments &&
          message.attachments.map((file, index) => (
            <div key={index} className="mb-2 last:mb-0">
              {file.isImage ? (
                // Image Preview with Daisy UI styling
                <div className="rounded-lg overflow-hidden bg-base-100 border border-base-300">
                  <img
                    onClick={() => openImageViewer && openImageViewer(file.url)}
                    src={file.url}
                    alt={file.name}
                    className="w-full max-w-xs cursor-pointer hover:opacity-90 transition-opacity"
                  />
                  <div className="p-2 bg-base-200">
                    <p className="text-xs text-base-content opacity-70 truncate">
                      {file.name}
                    </p>
                  </div>
                </div>
              ) : (
                // Document File with Daisy UI styling
                <div className="bg-base-100 rounded-lg border border-base-300 p-3 max-w-xs">
                  <div className="flex items-center gap-3">
                    <div className="text-primary flex-shrink-0">
                      {getFileIcon(file)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-base-content truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-base-content opacity-70">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base-content opacity-70 hover:text-primary transition-colors flex-shrink-0"
                      title="Download file"
                    >
                      <Download className="size-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}

        {/* Legacy single image support (backward compatibility) */}
        {message.image && !message.attachments && (
          <img
            onClick={openImageViewer}
            src={message.image}
            alt="Attachment"
            className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
          />
        )}

        {/* Message Text */}
        {message.text && (
          <div
            className={`${
              message.attachments ? "mt-2 p-3 bg-base-100 rounded-lg" : ""
            }`}
          >
            <p className="break-words">{message.text}</p>
          </div>
        )}
      </div>

      <div className="text-base-content text-xs opacity-70">
        {message.isSending ? "Sending..." : ""}
      </div>
    </div>
  );
};

export default ChatBubble;
