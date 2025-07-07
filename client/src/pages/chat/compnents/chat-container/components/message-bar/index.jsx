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
        <div className="min-h-[10vh] bg-[#fcfdfd] flex items-center justify-center px-8 gap-6 
        sticky bottom-0 w-full border-t border-gray-100 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">

            
            <div className="flex-1 flex bg-[#ffffff] rounded-full px-4 items-center border border-black/80 gap-5 pr-5">
                <input 
                    type="text" 
                    className="flex-1 p-4 bg-transparent rounded-md text-black 
                    focus:border-none focus:outline-none"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
    if (e.key === "Enter" && message.trim() !== "") {
      handleSendMessage();
    }
  }}
                />
    
                <button className="text-neutral-500 hover:text-white transition-all duration-300" onClick={handleAttachmentClick}>
                    <GrAttachment className="text-2xl" />
                </button>
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange}/>
    
                <div className="relative">
                    <button 
                        className="text-neutral-500 hover:text-white transition-all duration-300"
                        onClick={() => setEmojiPickerOpen(true)}
                    >
                        <RiEmojiStickerLine className="text-2xl" />
                    </button>
                    
                    {emojiPickerOpen && (
                        <div className="absolute bottom-16 right-0" ref={emojiRef}>
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
    
           <button
      onClick={handleSendMessage}
      className="bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 p-3 sm:p-4 rounded-full shadow-lg"
    >
      <IoSend className="text-white text-xl sm:text-2xl" />
    </button>

        </div>
    );
    
}

export default MessageBar