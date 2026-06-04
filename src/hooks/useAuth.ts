// import { useEffect, useState } from "react";
// import { User, Session } from "@supabase/supabase-js";
// import { supabase } from "@/src/integrations/supabase/client";
// import { useToast } from "@/src/hooks/use-toast";

// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null);
//   const [session, setSession] = useState<Session | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [profile, setProfile] = useState<any>(null);
//   const { toast } = useToast();

//   useEffect(() => {
//     // Set up auth state listener
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       (event, session) => {
//         setSession(session);
//         setUser(session?.user ?? null);
        
//         // Fetch profile when user logs in
//         if (session?.user) {
//           setTimeout(() => {
//             fetchProfile(session.user.id);
//           }, 0);
//         } else {
//           setProfile(null);
//         }
        
//         setLoading(false);
//       }
//     );

//     // Check for existing session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//       setUser(session?.user ?? null);
      
//       if (session?.user) {
//         fetchProfile(session.user.id);
//       }
//       setLoading(false);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   const fetchProfile = async (userId: string) => {
//     try {
//       const { data, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('user_id', userId)
//         .single();

//       if (error) throw error;
//       setProfile(data);
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//     }
//   };

//   const signUp = async (email: string, password: string, fullName: string, role: string = 'student') => {
//     try {
//       const redirectUrl = `${window.location.origin}/`;
      
//       const { error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           emailRedirectTo: redirectUrl,
//           data: {
//             full_name: fullName,
//             role: role
//           }
//         }
//       });

//       if (error) throw error;

//       toast({
//         title: "Sign up successful!",
//         description: "Please check your email to verify your account.",
//       });

//       return { error: null };
//     } catch (error: any) {
//       toast({
//         title: "Sign up failed",
//         description: error.message,
//         variant: "destructive",
//       });
//       return { error };
//     }
//   };

//   const signIn = async (email: string, password: string) => {
//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) throw error;

//       toast({
//         title: "Sign in successful!",
//         description: "Welcome back!",
//       });

//       return { error: null };
//     } catch (error: any) {
//       toast({
//         title: "Sign in failed",
//         description: error.message,
//         variant: "destructive",
//       });
//       return { error };
//     }
//   };

//   const signOut = async () => {
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;

//       toast({
//         title: "Signed out successfully",
//         description: "See you next time!",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Sign out failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   };

//   return {
//     user,
//     session,
//     profile,
//     loading,
//     signUp,
//     signIn,
//     signOut,
//     fetchProfile
//   };
// }

"use client"

import { useEffect, useState, useCallback } from "react"
import { useToast } from "@/src/hooks/use-toast"
import { store } from "@/src/state/store"
import { logOut } from "@/src/state/authSlice"

// Types for your user/session data
interface User {
  id: string
  email: string
  full_name: string
  role: string
  createdAt: Date
}

interface Session {
  token: string
  user: User
  expiresAt: Date
}

interface Profile {
  userId: string
  full_name: string
  bio?: string
  avatar?: string
  preferences?: unknown
  study_year: number
  studentId: string
  sex?: string
  dob?: string
  stateOfOrigin?: string
  signature?: string
  nextOfKin?: string
  kinAddress?: string
  kinPhone?: string
  phone?: string
  createdAt?: string
  updatedAt?: string
}

export function useAuth() {

  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const { toast } = useToast()

  const clearAuthSession = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
    store.dispatch(logOut())
    setUser(null)
    setSession(null)
    setProfile(null)
  }, [])

  const fetchProfile = useCallback(async (userId: string) => {
    if (!userId) return null

    try {
      console.log("useAuth: fetchProfile started for user:", userId)
      setLoading(true)
      const response = await fetch(`/api/users/${userId}/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })
      console.log("useAuth: fetchProfile response status:", response.status)

      if (response.status > 400) {
        if (response.status === 401) {
          clearAuthSession()
        }
        throw new Error("Failed to fetch profile")
      }

      const profileData = await response.json()
      console.log("useAuth: fetchProfile loaded:", profileData)
      return profileData
    } catch (error) {
      console.error("useAuth: Error fetching profile:", error)
      return null
    } finally {
      console.log("useAuth: fetchProfile finally block setting loading false")
      setLoading(false)
    }
  }, [clearAuthSession])

  const checkExistingSession = useCallback(async () => {
    console.log("useAuth: checkExistingSession started")
    try {
      const token = localStorage.getItem("auth_token")
      console.log("useAuth: checkExistingSession token:", token ? `${token.substring(0, 10)}...` : null)
      if (!token) {
        console.log("useAuth: checkExistingSession - no token, setting loading false")
        clearAuthSession()
        setLoading(false)
        return
      }

      const response = await fetch("/api/auth/verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log("useAuth: checkExistingSession verify response status:", response.status)

      if (response.status === 200) {
        const { user, session } = await response.json()
        console.log("useAuth: checkExistingSession verify success:", { user, session })
        setUser(user)
        setSession(session)

        if (user?.id) {
          console.log("useAuth: checkExistingSession calling fetchProfile:", user.id)
          await fetchProfile(user.id)
        }
      } else {
        console.log("useAuth: checkExistingSession verify failed (non-200), removing token")
        clearAuthSession()
      }
    } catch (error) {
      console.error("useAuth: Error checking session:", error)
      clearAuthSession()
    } finally {
      console.log("useAuth: checkExistingSession finally block setting loading false")
      setLoading(false)
    }
  }, [clearAuthSession, fetchProfile])

  const signUp = async (email: string, password: string, fullName: string, role = "student") => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
          role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data?.message || "Sign up failed",
          data: null
        };
      }

      toast({
        title: "Sign up successful!",
        description: "You can now sign in with your credentials.",
      })

      return { error: null, user: data.user }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Sign up failed"
      return { error: message, data: null }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        return { error: data?.message || "Invalid credentials", user: null, token: null }
      }

      const { token, user, session } = data
      localStorage.setItem("auth_token", token)
      setUser(user)
      setSession(session)

      if (user?.id) {
        await fetchProfile(user.id)
      }

      toast({
        title: "Sign in successful!",
        description: "Welcome back!",
      })

      return { error: null, user: user, token: token }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Sign in failed"
      toast({
        title: "Sign in failed",
        description: message,
        variant: "destructive",
      })
      return { error: message, user: null, token: null }
    }
  }

  useEffect(() => {
    checkExistingSession()
  }, [checkExistingSession])

  useEffect(() => {
    if (user && user?.id) {
      fetchProfile(user.id)
    }
  }, [user, fetchProfile])

  return {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    fetchProfile,
  }
}
