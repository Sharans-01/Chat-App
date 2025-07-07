import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    selectedChatType,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");

    setSelectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-4">
      {contacts.map((contact) => {
        const isSelected = selectedChatData && selectedChatData._id === contact._id;

        return (
          <div
            key={contact._id}
            onClick={() => handleClick(contact)}
            className={`pl-6 py-3 rounded-lg mx-3 mb-2 cursor-pointer transition-all duration-300 
              ${
                isSelected
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  : "hover:bg-gray-100 text-gray-800 dark:hover:bg-[#2e2e3e] dark:text-gray-200"
              }`}
          >
            <div className="flex gap-4 items-center">
              {!isChannel && (
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  {contact.image ? (
                    <AvatarImage
                      src={`${HOST}/${contact.image}`}
                      alt="profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div
                      className={`uppercase h-10 w-10 text-sm border flex items-center justify-center rounded-full ${
                        isSelected
                          ? "bg-white/20 border-white text-white"
                          : getColor(contact.color)
                      }`}
                    >
                      {contact.firstName
                        ? contact.firstName.charAt(0)
                        : contact.email.charAt(0)}
                    </div>
                  )}
                </Avatar>
              )}

              {isChannel && (
                <div className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 h-10 w-10 flex items-center justify-center rounded-full text-lg font-semibold">
                  #
                </div>
              )}

              <span className="truncate font-medium">
                {isChannel
                  ? contact.name
                  : `${contact.firstName} ${contact.lastName}`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;
