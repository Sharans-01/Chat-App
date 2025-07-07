import { useEffect } from "react";
import NewDM from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import apiClient from "@/lib/api-client";
import { GET_DM_CONTACTS_ROUTES } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/ui/contact-list";


const ContactsContainer = () => {

  const { setDirectMessagesContacts, directMessagesContacts} = useAppStore();
  
  useEffect(()=>{
    const getContacts = async () => {
      const response =await apiClient.get(GET_DM_CONTACTS_ROUTES, {withCredentials: true});
      if (response.data.contacts){
        setDirectMessagesContacts(response.data.contacts);

      }
    }
    getContacts();

  },[])

  return (
 <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#f0f4f8] border-r-2 border-[#1e3a8a] w-full">

    <div className="pt-3">
      <Logo />
    </div>
    <div className="my-5">
      <div className="flex items-center justify-between pr-10">
        <Title text="Direct Messages" />
        <NewDM />
      </div>
      <div className="max-h-[38vw] overflow-y-auto scrollbar-hidden">
        <ContactList contacts={directMessagesContacts} />
      </div>
    </div>
    <div className="my-5">
      <div className="flex items-center justify-between pr-10">
        <Title text="" />
      </div>
    </div>
    <ProfileInfo />
  </div>
);

}

export default ContactsContainer

const Logo = () => {
  return (
    <div className="flex p-5 justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="68"
        height="22"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#3b82f6" // Blue-500
        ></path>
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#60a5fa" // Blue-400
        ></path>
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#93c5fd" // Blue-300
        ></path>
      </svg>
      <span className="text-2xl font-bold text-slate-800">Chatter Hub</span>
    </div>
  );
};


  const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-gray-700 pl-10 font-medium text-sm">
      {text}
    </h6>
  );
};


  