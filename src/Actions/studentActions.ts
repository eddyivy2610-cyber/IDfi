import { Course } from "@/src/lib/models/Course";
import { Lecturer } from "../lib/models/Lecturer";
import { fetchWithAuth } from "@/src/lib/auth/session";

// Actions/studentActions.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// export const getAllStudents = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/admin/students`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch students');
//     }

//     return await response.json();
//   } catch (error) {
//     throw new Error(error.message || 'Error fetching students');
//   }
// };

export async function updateStudent(studentId: string, data: Record<string, unknown>) {
  const res = await fetchWithAuth(`/api/admin/students/${studentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update student");
  }

  return await res.json();
}

export const getLecturerDetails = async (lecturerId: string): Promise<Lecturer> => {
  const response = await fetchWithAuth(`/api/lecturers?id=${lecturerId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch lecturer details: ${response.statusText}`);
  }
  return response.json();
};

export const getAllLecturers = async (): Promise<Lecturer[]> => {
  const response = await fetchWithAuth("/api/lecturers", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch lecturers: ${response.statusText}`);
  }
  return response.json();
};

export const registerStudent = async (userId: {userId: string}) => {
  try {
    const res = await fetchWithAuth("/api/students", {method: "POST", headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userId)
    })
    // if(res.status >= 400) return {error: true, message: "student not registered!"}

    return await res.json();
  } catch (error) {
    console.log(error)
    return {error: true, message: "student not registered!"}
  }
}

export const submitComplaint = async (data) => {
  try {
    const res = await fetchWithAuth("/api/complaints", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      }
    })

    if(res.status >= 400) return {error: true, data: await res.json()}

    return {error: false, data : await res.json() }

  } catch (error) {
    console.log(error)
    return error
  }
}

export const getStudentById = async (studentId) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/students/${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch student');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error fetching student');
  }
};

export const addStudent = async (studentData) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add student');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error adding student');
  }
};

// export const updateStudent = async (studentId, updateData) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/admin/students/${studentId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       },
//       body: JSON.stringify(updateData),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to update student');
//     }

//     return await response.json();
//   } catch (error) {
//     throw new Error(error.message || 'Error updating student');
//   }
// };

// export const deleteStudent = async (studentId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/admin/students/${studentId}`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       },
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to delete student');
//     }

//     return await response.json();
//   } catch (error) {
//     throw new Error(error.message || 'Error deleting student');
//   }
// };

// export const assignCourses = async (studentId, courseIds) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/admin/students/${studentId}/assign-courses`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       },
//       body: JSON.stringify({ courseIds }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to assign courses');
//     }

//     return await response.json();
//   } catch (error) {
//     throw new Error(error.message || 'Error assigning courses to student');
//   }
// };

export const unassignCourse = async (studentId, courseId) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/students/${studentId}/unassign-course`, {
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
    throw new Error(error.message || 'Error unassigning course from student');
  }
};

// export const getStudentCourses = async (studentId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/admin/students/${studentId}/courses`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch student courses');
//     }

//     return await response.json();
//   } catch (error) {
//     throw new Error(error.message || 'Error fetching student courses');
//   }
// };

export const enrollStudent = async (studentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/enroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to enroll student');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error enrolling student');
  }
};

export const getStudentsByProgram = async (program) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/students?program=${encodeURIComponent(program)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch students by program');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error fetching students by program');
  }
};

export const getStudentsByYear = async (year) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/students?year=${year}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch students by year');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error fetching students by year');
  }
};

//************************************************************ */

export const getAllStudents = async (): Promise<unknown[]> => {
  const response = await fetchWithAuth("/api/admin/students", {
    headers: {},
  });
  if (!response.ok) throw new Error("Failed to fetch students");
  return response.json();
};

export const deleteStudent = async (studentId: string): Promise<void> => {
  const response = await fetchWithAuth(`/api/users/${studentId}`, {
    method: "DELETE",
    headers: {},
  });
  if (!response.ok) throw new Error("Failed to delete student");
};

export const assignCourses = async (studentId: string, courseIds: string[]): Promise<void> => {
  const response = await fetchWithAuth("/api/student-courses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ studentId, courseIds }),
  });
  if (!response.ok) throw new Error("Failed to assign courses");
};

export const getStudentCourses = async (studentId: string): Promise<Course[] | []> => {
  const response = await fetchWithAuth(`/api/courses?studentId=${studentId}`, {
    headers: {},
  });
  if (!response.ok) return [];
  return response.json();
};

export const bulkActionApplications = async (userIds: string[], action: 'approve' | 'reject'): Promise<unknown> => {
  const response = await fetchWithAuth("/api/admin/applications/bulk-action", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userIds, action }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to ${action} applications`);
  }
  
  return response.json();
};
