import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import{IoArrowBack} from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import {FaTrash, FaPlus} from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from "@/utils/constants";

const Profile=()=>{
  const navigate =useNavigate();
  const{userInfo, setUserInfo}=useAppStore();
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setselectedColor] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setfirstName(userInfo.firstName);
      setlastName(userInfo.lastName);
      setselectedColor(userInfo.color);
    }
  
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`); 
    }
  }, [userInfo]);
  
  const validateProfile=()=>{
    if (!firstName){
      toast.error("First name is required");
      return false;
    }
    if (!lastName){
      toast.error("Last name is required");
      return false;
    }
    return true;
  };

  const saveChanges=async()=>{
    if (validateProfile()){
      try {
        const response=await apiClient.post(UPDATE_PROFILE_ROUTE, {firstName, lastName, color:selectedColor}, {withCredentials: true});

        if (response.status===200 && response.data){
          setUserInfo({...response.data});
          toast.success("Profile updated successfully");
          navigate("/Chat");
        }

    }catch(error){
      console.log(error);
    }
    }
  };

  const handleNavigate=()=>{
    if (userInfo.profileSetup){
      navigate("/chat");
    }else{
      toast.error("Please setup profile.")
    }

  };

  const handleFileInputClick = ()=>{
    
    fileInputRef.current.click();
  };

  const handleImageChange= async(event)=>{
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      const formData = new FormData();
      formData.append('profile-image', file);
      const response=await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {withCredentials: true});
      if (response.status===200 && response.data.image){
        setUserInfo({...userInfo, image:response.data.image});
        toast.success("Image uploaded successfully.");
      }
     
    }
  };

  const handleDeleteImage =async()=>{
    try {

      const response=await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {withCredentials: true}
      );
      if (response.status===200){
        setUserInfo({...userInfo, image:null});
        toast.success("Image deleted successfully.");
        setImage(null);
      }
      
    }catch(error) {
      console.log(error);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1e2f] to-[#0f172a]
 flex items-center justify-center px-4 py-10">
  <div className="w-full max-w-5xl flex flex-col items-center gap-10">
      {/* Back Button aligned to left */}
<div className="w-full flex justify-start">
  <div onClick={handleNavigate} className="text-white cursor-pointer">
    <IoArrowBack className="text-3xl sm:text-4xl" />
  </div>
</div>


      {/* Profile Section */}
      <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
        {/* Avatar Section */}
        <div
          className="relative group w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Avatar className="w-full h-full rounded-full overflow-hidden">
            {image ? (
              <AvatarImage
                src={image}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div className={`uppercase w-full h-full text-4xl md:text-5xl flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>
                {firstName ? firstName.charAt(0) : userInfo.email.charAt(0)}
              </div>
            )}
          </Avatar>

          {/* Hover Actions */}
          {hovered && (
            <div
              className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition"
              onClick={image ? handleDeleteImage : handleFileInputClick}
            >
              {image ? (
                <FaTrash className="text-white text-2xl" />
              ) : (
                <FaPlus className="text-white text-2xl" />
              )}
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
            name="profile-image"
            accept=".png, .jpg, .jpeg, .svg, .webp"
          />
        </div>

        {/* Input Fields */}
<div className="flex-1 w-80 max-w-md space-y-5 text-white">
  <Input
    placeholder="Email"
    type="email"
    disabled
    value={userInfo.email}
    className="rounded-lg p-5 bg-[#2c2e3b] border-none w-full"
  />
  <Input
    placeholder="First Name"
    type="text"
    onChange={(e) => setfirstName(e.target.value)}
    value={firstName}
    className="rounded-lg p-5 bg-[#2c2e3b] border-none w-full"
  />
  <Input
    placeholder="Last Name"
    type="text"
    onChange={(e) => setlastName(e.target.value)}
    value={lastName}
    className="rounded-lg p-5 bg-[#2c2e3b] border-none w-full"
  />

          {/* Color Picker */}
          <div className="flex gap-7 flex-wrap">
            {colors.map((color, index) => (
              <div
                key={index}
                className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                  selectedColor === index ? "ring-2 ring-white/60" : ""
                }`}
                onClick={() => setselectedColor(index)}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="w-full flex justify-center">
  <Button
    className="h-14 w-full max-w-md bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 text-lg text-white rounded-md"
    onClick={saveChanges}
  >
    Save Changes
  </Button>
</div>

    </div>
  </div>
);

};


export default Profile;

  