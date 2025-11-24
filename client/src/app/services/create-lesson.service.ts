import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { CreateLessonDto, Lesson, AdminReply } from "../interfaces/interfaces";

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

  createLesson(data: CreateLessonDto): Observable<Lesson> {
    return this.http.post<Lesson>(`${this.baseUrl}/lessons`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.baseUrl}/lessons`);
  }

  getLesson(id: string): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.baseUrl}/lessons/${id}`);
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

  askLessonQuestion(lessonId: string, payload: { question: string }) {
    return this.http.post(
      `${this.baseUrl}/lessons/${lessonId}/questions`,
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

  adminReply(answerId: string, payload: AdminReply) {
    return this.http.post(
      `${this.baseUrl}/lessons/answers/reply/${answerId}`,
      payload,
      { headers: this.getAuthHeaders() }
    );
  }
}
