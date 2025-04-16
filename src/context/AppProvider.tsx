"use client"

import { createContext, useContext, useEffect, useState } from "react";
import axios from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
// import SkeletonProduct from "../components/Skeleton";


interface AppProviderType {
  isLoading: boolean,
  authToken: string | null,
  login: (email: string, password: string) => Promise<void>,
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>
  logout: () => void
}

const AppContext = createContext<AppProviderType | undefined>(undefined)

// const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get("authToken");

    if (token) {
      setAuthToken(token); // ✅ Sets token in state on refresh
    }
    
    if (!token && pathname !== '/auth') {
      router.push('/auth');
    } else {
      setIsLoading(false);
    }
  }, [pathname]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  


  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await axios.post("/login", {
        email,
        password
      });

      if (response.data.status) {
        Cookies.set("authToken", response.data.token, { expires: 7 })
        toast.success("Login successful")
        setAuthToken(response.data.token);
        router.push("/");
      } else {
        toast.error("Invalid login details")
      }
      console.log(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Check if it's an Axios error
        // const axiosError = error as { response?: { data?: { message?: string } } };

        // toast.error(axiosError.response?.data?.message || error.message || "Login failed.");
        console.error("Login error:", error);
      } else {
        toast.error("An unexpected error occurred.");
        console.error("Unknown error:", error);
      }


    } finally {
      setIsLoading(false)
    }
    console.log("Logging in with:", { email, password });
    // Implement login API call
  };

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/register",
        { name, email, password, password_confirmation },

      );

      console.log("Registration Successful:", response.data);
      toast.success("Registration successful! Please log in.");
      await router.push("/auth");

    } catch (error: unknown) {
      console.log("Registration Error:", error);
    
      if (error instanceof Error) {
        toast.error(error.message || "Registration failed.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    Cookies.remove("authToken")
    setIsLoading(false)
    toast.success("User logged out")
    router.push("/auth")
  }

  return (
    <AppContext.Provider value={{ login, register, isLoading, authToken, logout }}>
      {isLoading ? 'Loading...' : children}
    </AppContext.Provider>
  );
};

// Custom hook to use AppContext
export const useAuth = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("myAppHook must be used within an AppProvider");
  }
  return context;
};
