import { Lecturer } from "@/src/lib/models/Lecturer";
import { fetchWithAuth } from "@/src/lib/auth/session";

export const getAllLecturers = async (): Promise<Lecturer[]> => {
  const response = await fetchWithAuth("/api/admin/lecturers", {
    headers: {},
  });
  if (!response.ok) throw new Error("Failed to fetch lecturers");
  return response.json();
};

export const addLecturer = async (lecturer: Omit<Lecturer, "_id" | "createdAt" | "updatedAt">): Promise<Lecturer> => {
  
    const response = await fetchWithAuth("/api/admin/lecturers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lecturer),
  });
  if (!response.ok) throw new Error("Failed to add lecturer");
  return response.json();
};

export const assignCourse = async (lecturerId: string, courseId: string): Promise<void> => {
  const response = await fetchWithAuth("/api/admin/lecturers", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: lecturerId, courseId }),
  });
  if (!response.ok) throw new Error("Failed to assign course");
};

export const getLecturerDetails = async (lecturerId: string): Promise<Lecturer> => {
  const response = await fetchWithAuth(`/api/admin/lecturers?id=${lecturerId}`, {
    headers: {},
  });
  if (!response.ok) throw new Error("Failed to fetch lecturer details");
  return response.json();
};
