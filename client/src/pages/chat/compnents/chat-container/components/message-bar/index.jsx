import { useSocket } from "@/context/SocketContext";
import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import { useEffect } from "react";
import{ useState, useRef} from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";


const MessageBar = () => {
    const emojiRef = useRef();
    const fileInputRef = useRef();
    const socket = useSocket();
    const {selectedChatType,selectedChatData, userInfo, setIsUploading, setFileUploadProgress } =useAppStore();

    const [message, setMessage] = useState("")
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

    useEffect(() => {
        function handleClickOutside(event){
            if (emojiRef.current && !emojiRef.current.contains(event.target)){
                setEmojiPickerOpen(false);
            };
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }


    },[emojiRef])


    const handleAddEmoji = async (emoji) =>{
        setMessage((msg) => msg + emoji.emoji);

    }

    const handleSendMessage = async()=>{
        if(selectedChatType === "contact"){
            socket.emit("sendMessage",{
                sender: userInfo.id,
                content: message,
                recipient: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined,


            })
            setMessage("");
        }

    };

    const handleAttachmentClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleAttachmentChange = async () => {
        try {
            const file = event.target.files[0];
            if(file){
                const formData = new FormData();
                formData.append('file', file);
                setIsUploading(true);
                const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, { withCredentials: true, onUploadProgress:data => {setFileUploadProgress(Math.round((100 * data.loaded) / data.total))} });

                if (response.status === 200 && response.data){
                    setIsUploading(false);
                    if (selectedChatType === "contact"){
                    socket.emit("sendMessage",{
                        sender: userInfo.id,
                        content: undefined,
                        recipient: selectedChatData._id,
                        messageType: "file",
                        fileUrl: response.data.filePath,
        
        
                    });
                }

                }
            }
            console.log({file});

        } catch (error) {
            setIsUploading(false);
            console.log({error});
        }

    };

    return (
  <div className="sticky bottom-0 z-50 w-full bg-[#fcfdfd] border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] px-3 py-2 sm:px-6">
    <div className="flex items-center gap-3 sm:gap-4">
      {/* Input Container */}
      <div className="flex-1 flex items-center bg-white rounded-full border border-black/20 px-4 sm:px-5 py-2 sm:py-3">
        <input
          type="text"
          className="flex-1 bg-transparent text-sm sm:text-base text-black focus:outline-none placeholder-gray-500"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && message.trim() !== "") {
              handleSendMessage();
            }
          }}
        />

        {/* Attachment Button */}
        <button
          className="text-gray-500 hover:text-black transition mr-2"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-xl sm:text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />

        {/* Emoji Button */}
        <div className="relative">
          <button
            className="text-gray-500 hover:text-black transition"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className="text-xl sm:text-2xl" />
          </button>
          {emojiPickerOpen && (
           <div
  className="absolute bottom-[60px] right-0 z-50 w-[70vw] sm:w-[350px] overflow-hidden"
  ref={emojiRef}
>


              <EmojiPicker
                theme="dark"
                open={emojiPickerOpen}
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* Send Button */}
      <button
        onClick={handleSendMessage}
        className="p-3 sm:p-4 bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-full shadow-lg"
      >
        <IoSend className="text-white text-xl sm:text-2xl" />
      </button>
    </div>
  </div>
);

    
}

export default MessageBar