import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import {MdFolderZip} from "react-icons/md"
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";



const MessageContainer = () => {
  const scrollRef = useRef(null);
  const { selectedChatType, selectedChatData, userInfo, selectedChatMessages, setSelectedChatMessages, setFileDownloadProgress, setIsDownloading } = useAppStore();
  const [showImage, setShowImage] = useState(false)
  const [imageURL, setImageURL] = useState(null)

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(GET_ALL_MESSAGES_ROUTE, { id: selectedChatData._id }, { withCredentials: true });
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedChatData._id && selectedChatType === "contact") {
      getMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex =/\.(jpg|png|gif|bnp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const renderMessages = () => {
    let lastData = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastData;
      lastData = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const downloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);

    const response = await apiClient.get(`${HOST}/${url}`,{responseType: "blob", onDownloadProgress: (progressEvent)=>{
      const {loaded, total}= progressEvent;
      const percentageCompleted = Math.round((loaded * 100 )/total);
      setFileDownloadProgress(percentageCompleted);
    }});
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download",url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);


  };

  const renderDMMessages = (message) => (
    <div className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"}`}>
      {message.messageType === "text" && (
       <div
  className={`inline-block p-4 my-2 max-w-[80%] break-words shadow-md transition-all duration-300
    ${message.sender !== selectedChatData._id 
      ? "bg-white text-gray-900 rounded-tl-lg rounded-tr-2xl rounded-bl-2xl rounded-br-md border"
      : "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-tr-lg rounded-tl-2xl rounded-br-2xl rounded-bl-md"
    }`}
 style={
  message.sender !== selectedChatData._id
    ? {
        borderWidth: "2px",
        borderStyle: "solid",
        // borderImageSource: "linear-gradient(to right, #3b82f6, #60a5fa)", // blue gradient
        borderImageSlice: 1,
        boxShadow: "0px 4px 14px rgba(96, 165, 250, 0.3)", // subtle 3D effect
      }
    : {
        boxShadow: "0px 4px 14px rgba(139, 92, 246, 0.4)", // subtle 3D effect for sent
      }
}

>
  {message.content}
</div>


      )}
      {
  message.messageType === "file" && (
    <div
      className={`${
        message.sender !== selectedChatData._id
          ? "bg-[#f3e8ff] text-[#6a00ff] border border-[#c084fc] dark:bg-[#2e1a47] dark:text-[#c084fc] dark:border-[#a855f7]/50 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl"
          : "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
      } inline-block p-4 my-2 max-w-[75%] break-words shadow-md`}
    >
      {checkIfImage(message.fileUrl) ? (
        <div
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => {
            setShowImage(true);
            setImageURL(message.fileUrl);
          }}
        >
          <img
            src={`${HOST}/${message.fileUrl}`}
            alt="Shared file"
            className="rounded-lg object-cover max-h-64 max-w-full border border-gray-300"
          />
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-full bg-black/10 dark:bg-white/10 text-black dark:text-white">
              <MdFolderZip />
            </span>
            <span className="truncate max-w-[150px] font-medium">
              {message.fileUrl.split("/").pop()}
            </span>
          </div>
          <button
            className="bg-black/10 hover:bg-black/20 text-xl p-2 rounded-full transition-all dark:bg-white/10 dark:hover:bg-white/20"
            onClick={() => downloadFile(message.fileUrl)}
          >
            <IoMdArrowRoundDown />
          </button>
        </div>
      )}
    </div>
  )
}
<div className="text-xs text-gray-500 mt-1 ml-1">
  {moment(message.timestamp).format("LT")}
</div>
</div>

  );

 return (
 <div className="h-full overflow-y-auto p-4 px-4 md:px-8 w-full bg-[#f9fafb] dark:bg-[#121212]">

    {renderMessages()}
    <div ref={scrollRef} className="h-1" />

    {showImage && (
      <div className="fixed z-[1000] top-0 left-0 h-full w-full flex items-center justify-center backdrop-blur-lg flex-col bg-black/70">
        <div>
          <img
            src={`${HOST}/${imageURL}`}
            className="max-h-[80vh] w-auto object-contain rounded shadow-lg"
            alt="Preview"
          />
        </div>
        <div className="flex gap-5 fixed top-0 mt-5">
          <button
            className="bg-white/10 p-3 text-2xl rounded-full hover:bg-white/20 text-white transition-all duration-300"
            onClick={() => downloadFile(imageURL)}
          >
            <IoMdArrowRoundDown />
          </button>
          <button
            className="bg-white/10 p-3 text-2xl rounded-full hover:bg-white/20 text-white transition-all duration-300"
            onClick={() => {
              setShowImage(false);
              setImageURL(null);
            }}
          >
            <IoCloseSharp />
          </button>
        </div>
      </div>
    )}
  </div>
);

};

export default MessageContainer;
