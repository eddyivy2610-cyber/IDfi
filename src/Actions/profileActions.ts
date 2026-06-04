import { toast } from "sonner";
import { fetchWithAuth } from "@/src/lib/auth/session";
// export async function updateProfile(data: {
//     user_id: string;
//     studentId?: string;
//     study_year?: number;  
//     program?: string;
//     full_name: string;
//     email: string;
//     bio: string;
//     avatar: string;
// }) {
//      try {
//     const res = await fetch("/api/users/" + data.user_id + "/profile", {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${localStorage.getItem('auth_token')}`,
//         },
//         body: JSON.stringify(data),
//     })
//     const resData = await res.json()

//     if(res.status !== 200) {
//         console.error("Update profile failed:", resData);
//         toast.error(resData.message || "Failed to update profile");
//         return null;
//     }

//         toast.success("Profile updated successfully");
//         return resData.data;
    
// } catch (error) {
//     console.error("Update profile error:", error);
//     toast.error("Failed to update profile");
// }
// }

export const updateProfile = async (profileData: {
  user_id: string
  studentId: string
  study_year: number
  program: string
  full_name: string
  email: string
  bio: string
  avatar?: string
  sex?: string
  dob?: string
  stateOfOrigin?: string
  signature?: string
  nextOfKin?: string
  kinAddress?: string
  kinPhone?: string
  phone?: string
}) => {
  try {
    const response = await fetchWithAuth(`/api/users/${profileData.user_id}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = errorText

      try {
        const parsed = JSON.parse(errorText)
        errorMessage = parsed?.message || errorText
      } catch {
        // Keep raw text if response is not JSON
      }

      if (response.status === 401) {
        const authError = new Error(errorMessage || "Session expired. Please sign in again.")
        authError.name = "AuthError"
        throw authError
      }

      throw new Error(`Failed to update profile: ${errorMessage}`)
    }

    const updatedProfile = await response.json()
    return updatedProfile.data
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error("Error updating profile:", error)
    throw error
  }
}


  // Profile actions for fetching user profile data
export const fetchProfile = async (userId: string) => {
  try {
    const response = await fetchWithAuth(`/api/users/${userId}/profile?_t=${Date.now()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      },
    })

    if (response.status >= 400) {
      throw new Error("Failed to fetch profile")
    }
    const profile = await response.json()
    return profile;
  } catch (error) {
    console.error("Error fetching profile:", error)
    // Return null if profile fetch fails - don't block authentication
    console.log(error)
    return null
  }
}
