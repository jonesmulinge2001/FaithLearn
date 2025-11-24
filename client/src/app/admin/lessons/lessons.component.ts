import { Component, OnInit } from '@angular/core';
import { Lesson } from '../../interfaces/interfaces';
import { LessonService } from '../../services/create-lesson.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
})
export class LessonsComponent implements OnInit {
  lessons: Lesson[] = [];
  loading = true;

  constructor(private lessonService: LessonService) {}

  ngOnInit(): void {
    this.lessonService.getLessons().subscribe({
      next: (data) => {
        this.lessons = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
