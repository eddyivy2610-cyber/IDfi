// import { use, useContext, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/src/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
// import { Input } from "@/src/components/ui/input";
// import { Label } from "@/src/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
// import { useAuth } from "@/src/hooks/useAuth";
// import { GraduationCap } from "lucide-react";
// import { toast } from "sonner";
// import { setAuth } from "@/src/state/authSlice";
// import { useDispatch, UseDispatch, useSelector } from "react-redux";
// import { RootState } from "@/src/state/store";
// import { fetchProfile } from "@/src/Actions/profileActions";

// const Auth = () => {
//   const dispatch = useDispatch();
//   const { loading, signIn, signUp } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
// const {user, token} = useSelector((state: RootState) => state.auth)
//   // Form states for login
//   const [loginEmail, setLoginEmail] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");
//   // Form states for signup
//   const [signupEmail, setSignupEmail] = useState("");
//   const [signupPassword, setSignupPassword] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [role, setRole] = useState("student");

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   if (user) {
//     return useRouter().push("/dashboard");
//   }

//   const handleSignIn = async (e: React.FormEvent) => {
//     try {
      
//       // setLoading(true)
//       toast.info(loginEmail + " " + "attempting login", { duration: 1000 });
//       e.preventDefault();
//       setIsLoading(true);
  
//      const {user, error} = await signIn(loginEmail, loginPassword);
//      console.log("auth", user)
//      if(user) {const profile = await fetchProfile(user.id)
//      dispatch(setAuth({user: user, profile: profile, token: token, loading: false} ))
//       setIsLoading(false);
//       // setLoading(false)
// }
//     } catch (err) {
//       console.log(err)
//     }
//   };

//   const handleSignUp = async (e: React.FormEvent) => {
//     try {
//         dispatch(setAuth({loading: true, user: null, profile: null, token: null}))
//       toast.info("Sigining you up...");
//       e.preventDefault();
//       setIsLoading(true);
//      const {error, data} = await signUp(signupEmail, signupPassword, fullName, role);
//      if (error)  {
//        setIsLoading(false); 
//       toast.error(error)} else {
//         toast.success("signup successful");
//         dispatch(setAuth({loading: false, user: data, profile: null, token: null}))
//         setIsLoading(false);
//       }
      
//     } catch (err) {
//       console.log(err);
//       toast.error(err.statusText)
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background p-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <div className="mx-auto w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
//             <GraduationCap className="w-6 h-6 text-primary-foreground" />
//           </div>
//           <h1 className="text-2xl font-bold text-foreground">University ID System</h1>
//           <p className="text-muted-foreground">Access your digital student ID</p>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Welcome</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Tabs defaultValue="login" className="w-full">
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="login">Login</TabsTrigger>
//                 <TabsTrigger value="signup">Sign Up</TabsTrigger>
//               </TabsList>

//               <TabsContent value="login">
//                 <form onSubmit={handleSignIn} className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="email">Email</Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       placeholder="Enter your email"
//                       value={loginEmail}
//                       onChange={(e) => setLoginEmail(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="password">Password</Label>
//                     <Input
//                       id="password"
//                       type="password"
//                       placeholder="Enter your password"
//                       value={loginPassword}
//                       onChange={(e) => setLoginPassword(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <Button type="submit" className="w-full" disabled={isLoading}>
//                     {isLoading ? "Signing in..." : "Sign In"}
//                   </Button>
//                 </form>
//               </TabsContent>

//               <TabsContent value="signup">
//                 <form onSubmit={handleSignUp} className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="fullName">Full Name</Label>
//                     <Input
//                       id="fullName"
//                       type="text"
//                       placeholder="Enter your full name"
//                       value={fullName}
//                       onChange={(e) => setFullName(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="signupEmail">Email</Label>
//                     <Input
//                       id="signupEmail"
//                       type="email"
//                       placeholder="Enter your email"
//                       value={signupEmail}
//                       onChange={(e) => setSignupEmail(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="signupPassword">Password</Label>
//                     <Input
//                       id="signupPassword"
//                       type="password"
//                       placeholder="Enter your password"
//                       value={signupPassword}
//                       onChange={(e) => setSignupPassword(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="role">Role</Label>
//                     <Select value={role} onValueChange={setRole}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select your role" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="student">Student</SelectItem>
//                         <SelectItem value="admin">Admin</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <Button type="submit" className="w-full" disabled={isLoading}>
//                     {isLoading ? "Creating account..." : "Create Account"}
//                   </Button>
//                 </form>
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Auth;

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { useAuth } from "@/src/hooks/useAuth"
import { Fingerprint } from "lucide-react"
import { toast } from "sonner"
import { setAuth, setLoading } from "@/src/state/authSlice"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/src/state/store"
import { fetchProfile } from "@/src/Actions/profileActions"

const Auth = () => {
  const dispatch = useDispatch()
  const { loading: authLoading, signIn, signUp } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const { user, token, loading: storeLoading } = useSelector((state: RootState) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (storeLoading) {
      dispatch(setLoading(false))
    }
  }, [storeLoading, dispatch])

  // Form states for login
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  // Form states for signup
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState("student")

  console.log("Auth Page Render State:", {
    authLoading,
    storeLoading,
    user: user ? { id: user.id, email: user.email, role: user.role } : null,
    token: token ? `${token.substring(0, 10)}...` : null
  });

  if (authLoading || storeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0052FF]"></div>
      </div>
    )
  }

  if (user && token) {
    router.push("/dashboard")
    return null
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      dispatch(setLoading(true))
      toast.info(`${loginEmail} attempting login`, { duration: 1000 })
      setIsLoading(true)

      const { user, token, error } = await signIn(loginEmail, loginPassword)

      if (error) {
        toast.error(error)
        return
      }

      if (user && token) {
        console.log("auth", user)

        try {
          const profile = await fetchProfile(user.id)

          dispatch(
            setAuth({
              user: user,
              profile: profile,
              token: token, // Use the token from signin response
            }),
          )

          toast.success("Login successful!")
          router.push("/dashboard")
        } catch (profileError) {
          console.warn("Profile fetch failed:", profileError)
          dispatch(
            setAuth({
              user: user,
              profile: null,
              token: token,
            }),
          )
          toast.success("Login successful!")
          router.push("/dashboard")
        }
      }
    } catch (err: any) {
      console.error("Login error:", err)
      toast.error(err.message || "Login failed")
    } finally {
      setIsLoading(false)
      dispatch(setLoading(false))
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      dispatch(setLoading(true))
      toast.info("Signing you up...")
      setIsLoading(true)

      const { error, data } = await signUp(signupEmail, signupPassword, fullName, role)

      if (error) {
        toast.error(error)
      } else {
        toast.success("Signup successful! Please sign in.")
        setSignupEmail("")
        setSignupPassword("")
        setFullName("")
        setRole("student")
      }
    } catch (err: any) {
      console.error("Signup error:", err)
      toast.error(err.message || "Signup failed")
    } finally {
      setIsLoading(false)
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-4 font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 bg-[#0052FF] rounded-2xl flex items-center justify-center mb-6 shadow-[0_4px_16px_rgba(0,82,255,0.2)]">
            <Fingerprint className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#111827] font-sora tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>IDfi</h1>
          <p className="text-[#6E7C87] mt-2 text-[15px]">Access your digital student ID</p>
        </div>

        <Card className="bg-white border border-[#EAECF0] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
          <CardHeader className="pb-0 pt-8 px-8 text-center border-b border-[#EAECF0] bg-white">
            <CardTitle className="text-lg font-bold text-[#111827] font-sora" style={{ fontFamily: "'Sora', sans-serif" }}>Welcome Back</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="h-12 bg-[#F8FAFC] border-[#EAECF0] rounded-xl focus-visible:ring-2 focus-visible:ring-[#0052FF] focus:bg-white transition-all text-[15px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="h-12 bg-[#F8FAFC] border-[#EAECF0] rounded-xl focus-visible:ring-2 focus-visible:ring-[#0052FF] focus:bg-white transition-all text-[15px]"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 bg-[#0052FF] hover:bg-[#0040D0] text-white font-semibold rounded-xl text-[15px] shadow-[0_4px_12px_rgba(0,82,255,0.15)] transition-all mt-2" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="h-12 bg-[#F8FAFC] border-[#EAECF0] rounded-xl focus-visible:ring-2 focus-visible:ring-[#0052FF] focus:bg-white transition-all text-[15px]"
                    />
                    <p className="text-[11px] text-[#6B7280] font-medium italic mt-1">
                      * Please ensure this exactly matches the name on your admission letter.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail" className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Email Address</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder="Enter your email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="h-12 bg-[#F8FAFC] border-[#EAECF0] rounded-xl focus-visible:ring-2 focus-visible:ring-[#0052FF] focus:bg-white transition-all text-[15px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword" className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Password</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      placeholder="Create a password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      className="h-12 bg-[#F8FAFC] border-[#EAECF0] rounded-xl focus-visible:ring-2 focus-visible:ring-[#0052FF] focus:bg-white transition-all text-[15px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Account Role</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger className="h-12 bg-[#F8FAFC] border-[#EAECF0] rounded-xl focus-visible:ring-2 focus-visible:ring-[#0052FF] focus:bg-white transition-all text-[15px]">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-[#EAECF0]">
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full h-12 bg-[#0052FF] hover:bg-[#0040D0] text-white font-semibold rounded-xl text-[15px] shadow-[0_4px_12px_rgba(0,82,255,0.15)] transition-all mt-2" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Auth
