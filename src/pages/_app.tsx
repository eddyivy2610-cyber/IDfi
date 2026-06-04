import "@/src/styles/globals.css";
import type { AppProps } from "next/app";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import { Toaster } from "@/src/components/ui/toaster";
import {Toaster as Sonner} from '@/src/components/ui/sonner'
import React, { useEffect } from "react";
import { AppProvider } from "../state/provider";

export default function App({ Component, pageProps }: AppProps) {
  
  useEffect(()=>{
  },[])

  return (
    <TooltipProvider>
      <Toaster/>
      <Sonner />
      <AppProvider>
      <Component {...pageProps} />
      </AppProvider>
    </TooltipProvider>
  )
 
}

// "use client"

// import "@/src/styles/globals.css"
// import type { AppProps } from "next/app"
// import { TooltipProvider } from "@/src/components/ui/tooltip"
// import { Toaster } from "@/src/components/ui/toaster"
// import { Toaster as Sonner } from "@/src/components/ui/sonner"
// import { useAuth } from "../hooks/useAuth"
// import { UserProvider } from "@/src/contexts/userContext"
// import { useEffect } from "react"
// import { fetchProfile } from "@/src/Actions/profileActions"
// import { useRouter } from "next/navigation"
// import { useUser } from "@/src/contexts/userContext" // Declare the variable before using it

// function AppContent({ Component, pageProps }: AppProps) {
//   const navigation = useRouter()
//   const { user, loading } = useAuth()
//   const { setProfile, setLoading } = useUser() // Access context methods

//   async function initApp() {
//     // if (!user?.id) return

//     try {
//       setLoading(true)
//       console.log("[v0] Fetching profile for user:", user.id)
//       const profile = await fetchProfile(user.id)
//       console.log("[v0] Profile fetched:", profile)
//       setProfile(profile) // Use context method to update profile
//     } catch (error) {
//       console.error("[v0] Error fetching profile:", error)
//       setProfile(null)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (user && user.id) {
//       initApp()
//     }
//     console.log("[v0] _app user:", user)
//   }, [user]) // Only depend on user to avoid infinite re-renders

//   return <Component {...pageProps} />
// }

// export default function App(props: AppProps) {
//   const { user } = useAuth()

//   return (
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <UserProvider initialUser={user} initialProfile={null}>
//         <AppContent {...props} />
//       </UserProvider>
//     </TooltipProvider>
//   )
// }

