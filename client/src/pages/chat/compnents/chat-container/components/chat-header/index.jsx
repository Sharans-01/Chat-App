import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store"
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri"


const ChatHeader = () => {

  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
  <div className="h-[10vh] min-h-[60px] px-4 sm:px-6 md:px-10 border-b border-[#cbd5e1] bg-[#f8fafc] flex items-center justify-between shadow-sm w-full">
    
    {/* Left: Avatar and Name */}
    <div className="flex items-center gap-3 sm:gap-4 overflow-hidden w-full">
      {/* Avatar */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 relative shrink-0">
        <Avatar className="h-full w-full rounded-full overflow-hidden">
          {selectedChatData.image ? (
            <AvatarImage
              src={`${HOST}/${selectedChatData.image}`}
              alt="profile"
              className="object-cover w-full h-full bg-black"
            />
          ) : (
            <div className={`uppercase h-full w-full text-sm sm:text-lg border flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}>
              {selectedChatData.firstName
                ? selectedChatData.firstName.charAt(0)
                : selectedChatData.email.charAt(0)}
            </div>
          )}
        </Avatar>
      </div>

      {/* Name */}
      <div className="text-sm sm:text-base md:text-lg font-medium text-gray-800 truncate max-w-[60vw] sm:max-w-[70vw]">
        {selectedChatType === "contact" && selectedChatData.firstName
          ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
          : selectedChatData.email}
      </div>
    </div>

    {/* Right: Close Button */}
    <button
      className="text-gray-500 hover:text-red-500 transition-all duration-300 focus:outline-none ml-2 sm:ml-4"
      onClick={closeChat}
    >
      <RiCloseFill className="text-2xl sm:text-3xl" />
    </button>
  </div>
);


};

export default ChatHeader