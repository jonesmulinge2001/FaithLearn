// src/app/services/lessons.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, CreateLessonDto, Lesson, StudentQuestion, StudentAnswer } from '../interfaces/interfaces';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LessonsService {
  private baseUrl = environment.apiBase;

  constructor(private http: HttpClient) {}

  // Helper to add headers
  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    };
  }

  // ----------------------
  // COURSES
  // ----------------------
  
  createCourse(data: { title: string; description?: string }): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}/lessons/courses`, data, this.getHeaders());
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/lessons/courses`, this.getHeaders());
  }

  getCourse(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/lessons/courses/${id}`, this.getHeaders());
  }

  updateCourse(id: string, data: { title?: string; description?: string }): Observable<Course> {
    return this.http.patch<Course>(`${this.baseUrl}/lessons/courses/${id}`, data, this.getHeaders());
  }

  deleteCourse(id: string): Observable<Course> {
    return this.http.delete<Course>(`${this.baseUrl}/lessons/courses/${id}`, this.getHeaders());
  }

  // ----------------------
  // LESSONS
  // ----------------------
  
  createLesson(dto: CreateLessonDto): Observable<Lesson> {
    return this.http.post<Lesson>(`${this.baseUrl}/lessons`, dto, this.getHeaders());
  }

  getAllLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.baseUrl}/lessons`, this.getHeaders());
  }

  getLesson(id: string): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.baseUrl}/lessons/${id}`, this.getHeaders());
  }

  updateLesson(id: string, dto: Partial<CreateLessonDto>): Observable<Lesson> {
    return this.http.patch<Lesson>(`${this.baseUrl}/lessons/${id}`, dto, this.getHeaders());
  }

  deleteLesson(id: string): Observable<Lesson> {
    return this.http.delete<Lesson>(`${this.baseUrl}/lessons/${id}`, this.getHeaders());
  }

  // ----------------------
  // LESSON QUESTIONS
  // ----------------------
  
  submitStudentQuestion(lessonId: string, studentId: string, question: { question: string }): Observable<StudentQuestion> {
    return this.http.post<StudentQuestion>(`${this.baseUrl}/lessons/${lessonId}/questions/${studentId}`, question, this.getHeaders());
  }

  getQuestionsByLesson(lessonId: string): Observable<StudentQuestion[]> {
    return this.http.get<StudentQuestion[]>(`${this.baseUrl}/lessons/${lessonId}/questions`, this.getHeaders());
  }

  getAllStudentQuestions(): Observable<StudentQuestion[]> {
    return this.http.get<StudentQuestion[]>(`${this.baseUrl}/lessons/questions/all`, this.getHeaders());
  }

  replyToStudentQuestion(questionId: string, answer: string): Observable<StudentQuestion> {
    return this.http.post<StudentQuestion>(`${this.baseUrl}/lessons/questions/reply/${questionId}`, { answer }, this.getHeaders());
  }

  // ----------------------
  // STUDENT ANSWERS
  // ----------------------
  
  submitStudentAnswer(studentId: string, questionId: string, answer: string): Observable<StudentAnswer> {
    return this.http.post<StudentAnswer>(`${this.baseUrl}/lessons/answers/${studentId}/${questionId}`, { answer }, this.getHeaders());
  }

  getStudentAnswers(studentId: string): Observable<StudentAnswer[]> {
    return this.http.get<StudentAnswer[]>(`${this.baseUrl}/lessons/student/${studentId}/answers`, this.getHeaders());
  }

  replyToStudentAnswer(answerId: string, reply: string): Observable<StudentAnswer> {
    return this.http.post<StudentAnswer>(`${this.baseUrl}/lessons/answers/reply/${answerId}`, { reply }, this.getHeaders());
  }

  // ----------------------
  // GET LESSONS BY COURSE
  // ----------------------
  
  getLessonsByCourse(courseId: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.baseUrl}/lessons/course/${courseId}`, this.getHeaders());
  }

  // ----------------------
  // GET STUDENTS FOR LESSON
  // ----------------------
  
  getStudentsForLesson(lessonId: string): Observable<{ id: string; name: string; email: string }[]> {
    return this.http.get<{ id: string; name: string; email: string }[]>(`${this.baseUrl}/lessons/${lessonId}/students`, this.getHeaders());
  }
}
