import { fetchWithAuth } from "@/src/lib/auth/session";

// Actions/studentCourseActions.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Get all available courses for enrollment
export const getAvailableCourses = async (studentId: string) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/students/${studentId}/available-courses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch available courses');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error fetching available courses');
  }
};

// Get student's enrolled courses
export const getStudentCourses = async (studentId) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/students/${studentId}/courses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch student courses');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error fetching student courses');
  }
};

// Enroll in a course
export const enrollInCourse = async (studentId, courseId) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/students/${studentId}/enroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to enroll in course');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error enrolling in course');
  }
};

// Drop a course
export const dropCourse = async (studentId, courseId) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/students/${studentId}/drop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to drop course');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error dropping course');
  }
};

// Get student's credit summary
export const getStudentCreditSummary = async (studentId) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/students/${studentId}/credit-summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch credit summary');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error fetching credit summary');
  }
};

// Check enrollment eligibility
export const checkEnrollmentEligibility = async (studentId, courseId) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/students/${studentId}/check-eligibility/${courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to check eligibility');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error checking enrollment eligibility');
  }
};

// Get enrollment history
export const getEnrollmentHistory = async (studentId) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/students/${studentId}/enrollment-history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch enrollment history');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error fetching enrollment history');
  }
};

// Bulk enroll in multiple courses
export const bulkEnrollCourses = async (studentId, courseIds) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/students/${studentId}/bulk-enroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseIds }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to enroll in courses');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error enrolling in courses');
  }
};
