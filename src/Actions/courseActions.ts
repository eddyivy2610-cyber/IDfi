import { Course } from "@/src/lib/models/Course";
import { ObjectId } from 'mongodb';
import { fetchWithAuth } from "@/src/lib/auth/session";


export const getAllCourses = async (): Promise<Course[]> => {
  const response = await fetchWithAuth("/api/courses", {
    headers: {},
  });
  if (!response.ok) throw new Error("Failed to fetch courses");
  const data = await response.json();

  return data;
};

export const addCourse = async (course: Omit<Course, "_id" | "createdAt" | "updatedAt">): Promise<Course> => {
  const response = await fetchWithAuth("/api/courses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(course),
  });
  if (!response.ok) throw new Error("Failed to add course");
  return response.json();
};

export const deleteCourse = async (courseId: ObjectId): Promise<void> => {
  const response = await fetchWithAuth(`/api/courses?id=${courseId}`, {
    method: "DELETE",
    headers: {},
  });
  if (!response.ok) throw new Error("Failed to delete course");
};
