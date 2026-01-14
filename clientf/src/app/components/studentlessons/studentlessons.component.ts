import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LessonsService } from '../../services/create-lesson.service';
import { Lesson, Course, EnrolledCourse } from '../../interfaces/interfaces';
import { CommonModule } from '@angular/common';

type LessonStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

@Component({
  imports: [CommonModule],
  selector: 'app-student-lessons',
  templateUrl: './studentlessons.component.html',
})
export class StudentLessonsComponent implements OnInit {
  courses: Course[] = [];
  lessons: Lesson[] = [];
  statuses: Record<string, LessonStatus> = {};
  enrolledCourseIds = new Set<string>();
  loading = false;
  viewingLessonsForCourse: string | null = null;
  studentId = localStorage.getItem('userId') || ''; // load userId from local storage

  constructor(
    private lessonService: LessonsService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.loading = true;

    // 1. Load all courses
    this.lessonService.getAllCourses().subscribe({
      next: (allCourses: Course[]) => {
        this.courses = allCourses;

        // 2. Load enrolled courses
        this.lessonService.getEnrolledCourses(this.studentId).subscribe({
          next: (enrolled: EnrolledCourse[]) => {
            enrolled.forEach((e) => this.enrolledCourseIds.add(e.courseId));
            this.loading = false;
          },
          error: (err) => {
            console.error('Failed to load enrolled courses', err);
            this.loading = false;
          },
        });
      },
      error: (err) => {
        console.error('Failed to load all courses', err);
        this.loading = false;
      },
    });
  }

  enroll(courseId: string) {
    this.lessonService.enrollStudent(this.studentId, courseId).subscribe({
      next: (res) => {
        alert(res.message);
        this.enrolledCourseIds.add(courseId);
      },
      error: (err) => console.error('Enrollment failed', err),
    });
  }

  viewLessons(courseId: string) {
    this.viewingLessonsForCourse = courseId;

    this.lessonService.getLessonsByCourse(courseId).subscribe({
      next: (res: Lesson[]) => {
        console.log('getLessonsByCourse response:', res);

        this.lessons = res;
        this.statuses = {};

        this.lessons.forEach((lesson) => this.refreshStatus(lesson));
      },
      error: (err) => console.error('Failed to load lessons', err),
    });
  }

  refreshStatus(lesson: Lesson) {
    this.lessonService.getStudentsForLesson(lesson.id).subscribe({
      next: (answers) => {
        const answeredCount = Array.isArray(answers) ? answers.length : 0;
        const total = lesson.questions?.length ?? 0;
        if (answeredCount === 0) this.statuses[lesson.id] = 'NOT_STARTED';
        else if (answeredCount < total)
          this.statuses[lesson.id] = 'IN_PROGRESS';
        else this.statuses[lesson.id] = 'COMPLETED';
      },
      error: (err) =>
        console.warn(`Could not fetch answers for lesson ${lesson.id}`, err),
    });
  }

  canStartLesson(index: number): boolean {
    if (index === 0) return true;
    const prevLesson = this.lessons[index - 1];
    return this.statuses[prevLesson.id] === 'COMPLETED';
  }

  startLesson(lesson: Lesson, index: number) {
    if (this.canStartLesson(index)) {
      this.router.navigate(['/lessons', lesson.id]);
    } else {
      alert('Complete the previous lesson first.');
    }
  }

  reviewLesson(lesson: Lesson) {
    this.router.navigate(['/lessons', lesson.id], {
      queryParams: { review: true },
    });
  }

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

  // go back to courses view
  backToCourses() {
    this.viewingLessonsForCourse = null;
    this.lessons = [];
  }
}
