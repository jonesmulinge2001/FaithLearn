export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'ADMIN' | 'LEARNER';
  }
  
  export interface RegisterResponse {
    message: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    success: boolean;
    message: string;
    data?: {
      token: string;
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    };
  }
  
  export interface VerifyEmailRequest {
    email: string;
    code: string;
  }
  
  export interface GenericResponse {
    message: string;
  }
  
  export interface ResetPasswordRequest {
    email: string;
    code: string;
    password: string;
  }

  // src/app/models/lesson.model.ts

export interface LessonQuestion {
  id?: string;
  question: string;
  createdAt?: string;
  answer?: string; // optional admin/student reply
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  courseId?: string; // optional if linking to courses
  questions?: LessonQuestion[];
  createdAt?: string;
}

export interface CreateLessonDto {
  title: string;
  content: string;
  courseId?: string;
  questions?: { question: string }[];
}

export interface StudentQuestion {
  id: string;
  lessonId: string;
  studentId: string;
  question: string;
  createdAt?: string;
  answer?: string; // admin reply
}

export interface StudentAnswer {
  id: string;
  lessonId: string;
  studentId: string;
  questionId: string;
  answer: string;
  createdAt?: string;
}

export interface AdminReply {
  answer: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  lessons?: Lesson[];
  createdAt?: string;
}
