import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { CreateLessonDto, Lesson, AdminReply, LessonQuestion } from "../interfaces/interfaces";

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private baseUrl = `${environment.apiBase}`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // ----------------------
  // LESSON CRUD
  // ----------------------
  createLesson(data: CreateLessonDto): Observable<Lesson> {
    return this.http.post<Lesson>(`${this.baseUrl}/lessons`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.baseUrl}/lessons`, {
      headers: this.getAuthHeaders(),
    });
  }

  getLesson(id: string): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.baseUrl}/lessons/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  updateLesson(id: string, payload: Partial<Lesson>): Observable<Lesson> {
    return this.http.patch<Lesson>(`${this.baseUrl}/lessons/${id}`, payload, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteLesson(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/lessons/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // ----------------------
  // STUDENT INTERACTIONS
  // ----------------------
  askLessonQuestion(
    lessonId: string,
    studentId: string,
    payload: { question: string }
  ) {
    return this.http.post(
      `${this.baseUrl}/lessons/${lessonId}/questions/${studentId}`,
      payload,
      { headers: this.getAuthHeaders() }
    );
  }

  answerLessonQuestion(
    lessonId: string,
    questionId: string,
    payload: { answer: string }
  ) {
    return this.http.post(
      `${this.baseUrl}/lessons/answers/${lessonId}/${questionId}`,
      payload,
      { headers: this.getAuthHeaders() }
    );
  }

  // ----------------------
  // ADMIN INTERACTIONS
  // ----------------------
  adminReply(answerId: string, payload: AdminReply) {
    return this.http.post(
      `${this.baseUrl}/lessons/answers/reply/${answerId}`,
      payload,
      { headers: this.getAuthHeaders() }
    );
  }

  getAllStudentQuestions() {
    return this.http.get(`${this.baseUrl}/lessons/questions/all`, {
      headers: this.getAuthHeaders(),
    });
  }

  getQuestionsByLesson(lessonId: string): Observable<LessonQuestion[]> {
    return this.http.get<LessonQuestion[]>(
      `${this.baseUrl}/lessons/${lessonId}/questions`,
      { headers: this.getAuthHeaders() }
    );
  }
  

  getStudentQuestions(studentId: string) {
    return this.http.get(
      `${this.baseUrl}/lessons/student/${studentId}/questions`,
      { headers: this.getAuthHeaders() }
    );
  }

  getStudentsForLesson(lessonId: string): Observable<{ id: string; name: string; completedLessons?: number }[]> {
    return this.http.get<{ id: string; name: string; completedLessons?: number }[]>(
      `${this.baseUrl}/lessons/${lessonId}/students`,
      { headers: this.getAuthHeaders() }
    );
  }
  
}
