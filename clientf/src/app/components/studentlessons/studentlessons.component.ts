import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Lesson } from '../../interfaces/interfaces';
import { LessonsService } from '../../services/create-lesson.service';
import { CommonModule } from '@angular/common';

type LessonStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

@Component({
  imports: [CommonModule],
  selector: 'app-student-lessons',
  templateUrl: './studentlessons.component.html',
})
export class StudentLessonsComponent {
  lessons: Lesson[] = [];
  // map lessonId -> status
  statuses: Record<string, LessonStatus> = {};
  loading = false;
  studentId = localStorage.getItem('userId') || ''; // ensure it's present

  constructor(private lessonService: LessonsService, private router: Router) {}

  ngOnInit(): void {
    this.loadLessons();
  }

  loadLessons() {
    this.loading = true;
    this.lessonService.getAllLessons().subscribe({
      next: (lessons) => {
        this.lessons = lessons;
        // initialize statuses
        lessons.forEach((l) => (this.statuses[l.id] = 'NOT_STARTED'));
        // fetch progress for each lesson
        lessons.forEach((lesson) => this.refreshStatus(lesson));
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load lessons', err);
        this.loading = false;
      },
    });
  }

  refreshStatus(lesson: Lesson) {
    if (!this.studentId) return; // no student id
    this.lessonService
      .getStudentsForLesson(lesson.id)
      .subscribe({
        next: (answers) => {
          const answeredCount = Array.isArray(answers) ? answers.length : 0;
          const total = lesson.questions?.length ?? 0;
          if (answeredCount === 0) this.statuses[lesson.id] = 'NOT_STARTED';
          else if (answeredCount < total)
            this.statuses[lesson.id] = 'IN_PROGRESS';
          else this.statuses[lesson.id] = 'COMPLETED';
        },
        error: (err) => {
          // If backend route doesn't exist, keep NOT_STARTED or fallback:
          console.warn(`Could not fetch answers for lesson ${lesson.id}`, err);
        },
      });
  }

  startLesson(lesson: Lesson) {
    // Navigate to lesson view where student will see content & questions
    this.router.navigate(['/lessons', lesson.id]);
  }

  reviewLesson(lesson: Lesson) {
    // review is the same view but you may show readonly answers inside that view
    this.router.navigate(['/lessons', lesson.id], {
      queryParams: { review: true },
    });
  }

  // small helper for UI
  getStatusLabel(s: LessonStatus) {
    switch (s) {
      case 'COMPLETED':
        return 'Completed';
      case 'IN_PROGRESS':
        return 'Continue';
      default:
        return 'Start';
    }
  }
}
