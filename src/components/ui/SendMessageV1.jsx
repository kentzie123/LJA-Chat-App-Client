// Lucide icons
import { Send, Image, X } from "lucide-react";

// Hooks
import { useRef } from "react";

// Store
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";

// Toast
import toast from "react-hot-toast";

const SendMessage = () => {
  const selectFileRef = useRef();
  const { sendMessage, selectedUser, message, setMessage } = useChatStore();
  const { authUser } = useAuthStore();

  const handleSelectFile = (file) => {
    const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const fileTypes = [
      ...imageTypes,
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!fileTypes.includes(file.type)) {
      toast.error("File type not supported!");
      return;
    }

    if (file.size / (1024 * 1024) > 10) {
      toast.error("File size exceeds 10MB!");
      return;
    }

    if (imageTypes.includes(file.type)) {
      // Image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMessage({
          ...message,
          file,
          preview: reader.result,
          isImage: true,
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Non-image file: just show filename
      setMessage({
        ...message,
        file,
        preview: file.name,
        isImage: false,
      });
    }
  };

  const closeFilePreview = () => {
    setMessage({ ...message, file: null, preview: null, isImage: false });
    if (selectFileRef.current) selectFileRef.current.value = "";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!message.text && !message.file) return;

    sendMessage(message, selectedUser.id, authUser.id);

    // Clear input
    setMessage({ text: "", file: null, preview: null, isImage: false });
    if (selectFileRef.current) selectFileRef.current.value = "";
  };

  return (
    <div className="p-3">
      {message.file && (
        <div className="relative w-fit mb-2">
          <button
            onClick={closeFilePreview}
            className="absolute top-[-9px] right-[-9px] size-5 btn btn-circle cursor-pointer rounded-full"
          >
            <X className="size-3" />
          </button>
          {message.isImage ? (
            <img
              className="size-23 rounded-lg object-cover"
              src={message.preview}
              alt="preview"
            />
          ) : (
            <div className="p-2 border rounded-lg bg-gray-100">
              {message.preview}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          value={message.text}
          type="text"
          placeholder="Send a message..."
          className="input flex-grow"
          onChange={(e) => setMessage({ ...message, text: e.target.value })}
        />

        <input
          ref={selectFileRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
          className="hidden"
          onChange={(e) => handleSelectFile(e.target.files[0])}
        />

        <button
          type="button"
          onClick={() => selectFileRef.current.click()}
          className="btn btn-circle"
        >
          <Image className={`size-5 ${message.file ? "text-secondary" : ""}`} />
        </button>

        <button
          type="submit"
          disabled={!message.text && !message.file}
          className="btn btn-circle"
        >
          <Send className="size-5" />
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
