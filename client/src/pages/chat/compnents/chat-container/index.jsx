import ChatHeader from "./components/chat-header"
import MessageBar from "./components/message-bar"
import MessageContainer from "./components/message-container"

const ChatContainer = () => {
  return (
    <div className="flex flex-col flex-1 bg-[#1c1d25] md:static">
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  )
}

export default ChatContainer
