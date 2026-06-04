import { Lecturer } from "@/src/lib/models/Lecturer";
import { fetchWithAuth } from "@/src/lib/auth/session";


// Actions/lecturerActions.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// export const getAllLecturers = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/admin/lecturers`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch lecturers');
//     }

//     return await response.json();
//   } catch (error) {
//     throw new Error(error.message || 'Error fetching lecturers');
//   }
// };

// export const addLecturer = async (lecturerData) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/admin/lecturers`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       },
//       body: JSON.stringify(lecturerData),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to add lecturer');
//     }

//     return await response.json();
//   } catch (error) {
//     throw new Error(error.message || 'Error adding lecturer');
//   }
// };

export const updateLecturer = async (lecturerId, updateData) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/lecturers/${lecturerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update lecturer');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error updating lecturer');
  }
};

// export const deleteLecturer = async (lecturerId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/admin/lecturers/${lecturerId}`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
//       },
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to delete lecturer');
//     }

//     return await response.json();
//   } catch (error) {
//     throw new Error(error.message || 'Error deleting lecturer');
//   }
// };

export const assignCourseToLecturer = async (lecturerId, courseId) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/lecturers/${lecturerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to assign course');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error assigning course to lecturer');
  }
};

export const unassignCourseFromLecturer = async (lecturerId, courseId) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/lecturers/${lecturerId}/unassign-course`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to unassign course');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error unassigning course from lecturer');
  }
};

export const getLecturerById = async (lecturerId) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/lecturers/${lecturerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch lecturer');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error fetching lecturer');
  }
};

export const getLecturerCourses = async (lecturerId) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/lecturers/${lecturerId}/courses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch lecturer courses');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error fetching lecturer courses');
  }
};

// *****************************************************

export const getAllLecturers = async (): Promise<Lecturer[]> => {
  const response = await fetchWithAuth("/api/admin/lecturers", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch lecturers: ${response.statusText}`);
  }
  return response.json();
};

export const getLecturerDetails = async (lecturerId: string): Promise<Lecturer> => {
  const response = await fetchWithAuth(`/api/admin/lecturers?id=${lecturerId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch lecturer details: ${response.statusText}`);
  }
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
  if (!response.ok) {
    throw new Error(`Failed to add lecturer: ${response.statusText}`);
  }
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
  if (!response.ok) {
    throw new Error(`Failed to assign course: ${response.statusText}`);
  }
};

export const deleteLecturer = async (lecturerId: string): Promise<void> => {
  const response = await fetchWithAuth(`/api/admin/lecturers?id=${lecturerId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to delete lecturer: ${response.statusText}`);
  }
};
