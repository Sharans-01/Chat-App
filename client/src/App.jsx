import React, { useEffect } from 'react'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store'
import { useState } from 'react'
import apiClient from './lib/api-client'
import { GET_USER_INFO } from './utils/constants'
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/loading.json"; // adjust path as per your project


const PrivateRoute=({children})=>{
  const {userInfo}=useAppStore()
  const isAuthenticated = !!userInfo
  return isAuthenticated? children: <Navigate to="/auth" />
  
};

const AuthRoute=({children})=>{
  const {userInfo}=useAppStore()
  const isAuthenticated= !!userInfo
  return isAuthenticated? <Navigate to="/chat" />: children; 
  
};


const App = () => {
  const {userInfo,setUserInfo} = useAppStore()
  const [loading, setloading] = useState(true)

  useEffect(()=>{
    const getUserData=async()=>{
      try {
        const response=await apiClient.get(GET_USER_INFO, {withCredentials:true});
        if (response.status===200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        } 
         
        console.log({response});

}catch (error){
  setUserInfo(undefined);
} finally{
  setloading(false);
}
};

    if(!userInfo) {
      getUserData();
     } else{
        setloading(false)
      }
      
    },[userInfo,setUserInfo]);

   if (loading) {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
      <Lottie 
        animationData={loadingAnimation} 
        loop={true} 
        className="w-40 h-40 md:w-56 md:h-56"
      />
      <p className="mt-6 text-white text-lg md:text-xl font-medium animate-pulse">
        Loading, please wait...
      </p>
    </div>
  );
}

  

  return (
    <BrowserRouter>
        <Routes>
           <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
           <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
           <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

           <Route path="*" element={<Navigate to="/auth"/>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App