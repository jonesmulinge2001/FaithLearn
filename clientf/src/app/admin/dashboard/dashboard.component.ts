// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Course, EnrolledCourse, Lesson } from '../../interfaces/interfaces';
import { LessonsService } from '../../services/create-lesson.service';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  courses: Course[] = [];
  selectedCourse: Course | null = null;
  lessons: Lesson[] = [];
  loadingCourses: boolean = false;
  loadingLessons: boolean = false;
  errorMessage: string = '';
  enrolledCourses: EnrolledCourse[] = []
  loading: boolean = false;

  constructor(private lessonsService: LessonsService) {}

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses() {
    this.loadingCourses = true;
    this.lessonsService.getAllCourses().subscribe({
      next: (res) => {
        this.courses = res;
        this.loadingCourses = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load courses.';
        console.error(err);
        this.loadingCourses = false;
      },
    });
  }

  fetchEnrolledCourses(studentId: string) {
    this.loading = true;
    this.lessonsService.getEnrolledCourses(studentId).subscribe({
      next: (res) => {
        this.enrolledCourses = res;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to get enrolled courses';
        console.error(err);
        this.loading = false;
      }
    });
  }

  selectCourse(course: Course) {
    this.selectedCourse = course;
    this.fetchLessons(course.id);
  }

  fetchLessons(courseId: string) {
    this.loadingLessons = true;
    this.lessonsService.getLessonsByCourse(courseId).subscribe({
      next: (res) => {
        this.lessons = res;
        this.loadingLessons = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load lessons for this course.';
        console.error(err);
        this.loadingLessons = false;
      },
    });
  }

  clearSelectedCourse() {
    this.selectedCourse = null;
    this.lessons = [];
  }
}
