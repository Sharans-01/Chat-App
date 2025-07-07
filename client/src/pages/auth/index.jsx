import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {useEffect, useState} from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { SIGNUP_ROUTE, LOGIN_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";




const Auth = () => {
    const navigate = useNavigate();
    const {userInfo, setUserInfo}= useAppStore()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const validatelogin=() => {
        if (!email.trim().length) { 
            toast.error("Email is required");
            return false;
        }
        if (!password.trim().length) {
            toast.error("Password is required");
            return false;
        }
        
        return true;

    }

    const validateSignup = () => {
        if (!email.trim().length) { 
            toast.error("Email is required");
            return false;
        }
        if (!password.trim().length) {
            toast.error("Password is required");
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (validatelogin()) {
            if (!email || !password) {
                toast.error("Email and password are required.");
                return;
            }
        
            try {
                const response = await apiClient.post(LOGIN_ROUTE, 
                    { email, password }, 
                    { withCredentials: true }
                );
        
                if (response.data?.user?.id) {
                    setUserInfo(response.data.user);
        
                    // Wait for state update before navigating
                    setTimeout(() => {
                        navigate(response.data.user.profileSetup ? "/chat" : "/profile");
                    }, 100);
                } else {
                    toast.error("Login failed. Please try again.");
                }
            } catch (error) {
                console.error("Login error:", error);
        
                if (error.response) {
                    toast.error(error.response.data?.message || "Invalid credentials.");
                } else {
                    toast.error("An error occurred. Please try again.");
                }
            }
        };
    };
    
    const handleSignup = async () => {
        if (!validateSignup()) return; // Ensure validation passes
    
        try {
            const response = await apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true });
    
            if (response.status === 201 && response.data?.user) {
                setUserInfo(response.data.user);
    
                // Since state update is asynchronous, we will navigate after it updates
            } else {
                toast.error(response.data?.message || "Signup failed. Please try again.");
            }
        } catch (error) {
            console.error("Signup error:", error);
    
            const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
            toast.error(errorMessage);
        }
    };
    
    // Use useEffect to navigate after `userInfo` is set
    useEffect(() => {
        console.log("UserInfo updated:", userInfo);
    }, [userInfo, navigate]);
    
    

  return (
  <div
    className="min-h-screen w-full bg-cover bg-center relative"
    style={{ backgroundImage: `url('/loginc.jpg')` }}
  >
    {/* Overlay */}
    <div className="absolute inset-0 bg-black/70 z-0" />

    {/* Login Content */}
    <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl w-full max-w-4xl grid grid-cols-1 xl:grid-cols-[2fr_1.3fr] overflow-hidden">

        {/* Left - Form Area */}
        <div className="p-8 sm:p-12 flex flex-col gap-10 items-center justify-center">
          <div className="text-center space-y-3">
            <h1 className="text-white text-4xl sm:text-5xl font-bold flex items-center justify-center gap-3">
              Welcome <img src={Victory} alt="Victory" className="h-10 w-10 sm:h-12 sm:w-12" />
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Sign in to continue with <strong>Chatter Hub</strong>
            </p>
          </div>

          <Tabs className="w-full max-w-md" defaultValue="login">
            <TabsList className="flex justify-around bg-transparent rounded-full border border-white/20">
              <TabsTrigger
                value="login"
                className="w-full py-3 px-5 text-white font-medium transition-all rounded-full data-[state=active]:bg-gradient-to-r from-blue-500 to-indigo-600 data-[state=active]:shadow-lg data-[state=active]:text-white"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="w-full py-3 px-5 text-white font-medium transition-all rounded-full data-[state=active]:bg-gradient-to-r from-blue-500 to-indigo-600 data-[state=active]:shadow-lg data-[state=active]:text-white"
              >
                Signup
              </TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login" className="mt-6 flex flex-col gap-5">
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full px-6 py-4 bg-white/10 text-white placeholder:text-white/60 border border-white/20 focus:ring-2 focus:ring-blue-400"
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-full px-6 py-4 bg-white/10 text-white placeholder:text-white/60 border border-white/20 focus:ring-2 focus:ring-blue-400"
              />
              <Button
                onClick={handleLogin}
                className="rounded-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
              >
                Login
              </Button>
            </TabsContent>

            {/* Signup Form */}
            <TabsContent value="signup" className="mt-6 flex flex-col gap-5">
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full px-6 py-4 bg-white/10 text-white placeholder:text-white/60 border border-white/20 focus:ring-2 focus:ring-indigo-400"
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-full px-6 py-4 bg-white/10 text-white placeholder:text-white/60 border border-white/20 focus:ring-2 focus:ring-indigo-400"
              />
            <Input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-full px-6 py-4 bg-white/10 text-white placeholder:text-white/60 border border-white/20 focus:ring-2 focus:ring-indigo-400"
            />
            <Button
              onClick={handleSignup}
              className="rounded-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold"
            >
              Signup
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right - Image */}
      <div className="hidden xl:flex items-center justify-center bg-white/10 p-4">
        <img src={Background} alt="Background" className="h-92 object-contain" />
      </div>
    </div>
  </div>
  </div>
);


};

export default Auth;