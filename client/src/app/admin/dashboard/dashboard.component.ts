import { Component, OnInit } from '@angular/core';
import { Lesson, LessonQuestion, StudentQuestion, StudentAnswer } from '../../interfaces/interfaces';
import { LessonService } from '../../services/create-lesson.service';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

interface LessonWithStudents extends Lesson {
  students?: { id: string; name: string; completedLessons: number }[];
  studentCount?: number;
}

@Component({
  imports: [CommonModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  lessons: LessonWithStudents[] = [];
  selectedLesson: LessonWithStudents | null = null;

  totalStudents: number = 0;
  totalCompletedLessons: number = 0;
  loadingLessons: boolean = false;
  loadingQuestions: boolean = false;

  constructor(private lessonService: LessonService) {}

  ngOnInit(): void {
    this.loadLessons();
  }

  loadLessons(): void {
    this.loadingLessons = true;
    this.lessonService.getLessons().subscribe({
      next: (lessons) => {
        // Map to LessonWithStudents
        const lessonsWithStudents: LessonWithStudents[] = lessons.map(l => ({ ...l }));
        this.lessons = lessonsWithStudents;

        // For each lesson, fetch students
        const studentRequests = lessonsWithStudents.map(l =>
          this.lessonService.getStudentsForLesson(l.id)
        );

        forkJoin(studentRequests).subscribe({
          next: (studentsPerLesson: { id: string; name: string; completedLessons?: number }[][]) => {
            const totalStudentsSet = new Set<string>();
            let totalCompleted = 0;
        
            studentsPerLesson.forEach((students, index) => {
              const lesson = lessonsWithStudents[index];
        
              // Map students with proper typing
              lesson.students = students.map((s: { id: string; name: string; completedLessons?: number }) => ({
                id: s.id,
                name: s.name,
                completedLessons: s.completedLessons || 0
              }));
        
              lesson.studentCount = students.length;
        
              // Count unique students & sum completed lessons
              students.forEach((s: { id: string; name: string; completedLessons?: number }) => {
                totalStudentsSet.add(s.id);
                totalCompleted += s.completedLessons || 0;
              });
            });
        
            this.totalStudents = totalStudentsSet.size;
            this.totalCompletedLessons = totalCompleted;
            this.loadingLessons = false;
          },
          error: (err) => {
            console.error('Failed to load students for lessons', err);
            this.loadingLessons = false;
          }
        });
        
      },
      error: (err) => {
        console.error('Failed to load lessons', err);
        this.loadingLessons = false;
      }
    });
  }

  selectLesson(lesson: LessonWithStudents): void {
    this.selectedLesson = lesson;
    this.loadLessonQuestions(lesson.id);
  }

  loadLessonQuestions(lessonId: string): void {
    this.loadingQuestions = true;
    this.lessonService.getQuestionsByLesson(lessonId).subscribe({
      next: (questions: LessonQuestion[]) => {
        if (this.selectedLesson) this.selectedLesson.questions = questions;
        this.loadingQuestions = false;
      },
      error: (err) => {
        console.error('Failed to load questions', err);
        this.loadingQuestions = false;
      }
    });
  }

  trackById(index: number, item: Lesson | LessonQuestion): string {
    return item.id!;
  }
}
