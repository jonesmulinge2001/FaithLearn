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

  showDeleteModal = false;
lessonToDelete: string | null = null;

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

  openDeleteModal(id: string) {
    this.lessonToDelete = id;
    this.showDeleteModal = true;
  }
  
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.lessonToDelete = null;
  }

  confirmDelete() {
    if (!this.lessonToDelete) return;
  
    this.lessonService.deleteLesson(this.lessonToDelete).subscribe({
      next: () => {
        this.lessons = this.lessons.filter(l => l.id !== this.lessonToDelete);
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error(err);
        this.closeDeleteModal();
        alert("Failed to delete lesson");
      }
    });
  }
}
