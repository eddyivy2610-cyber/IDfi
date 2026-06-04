import { fetchWithAuth } from "@/src/lib/auth/session";

export const getAllComplaints = async (): Promise<unknown[]> => {
  const response = await fetchWithAuth("/api/complaints", {
    headers: {},
  });
  if (!response.ok) throw new Error("Failed to fetch complaints");
  return response.json();
};

export const submitComplaint = async (complaint: { studentId: string; text: string }): Promise<void> => {
  const response = await fetchWithAuth("/api/complaints", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: complaint.text }),
  });
  if (!response.ok) throw new Error("Failed to submit complaint");
};
