// src/app/components/lessons-list/lessons-list.component.ts
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { Lesson } from '../../interfaces/interfaces';
import { LessonsService } from '../../services/create-lesson.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-lessons-list',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css'],
})
export class LessonsComponent implements OnInit {
  lessons: Lesson[] = [];
  loading = false;
  error: string | null = null;

  // Modals state
  selectedLesson: Lesson | null = null;
  editLessonData: Lesson | null = null;
  deleteLessonData: Lesson | null = null;

  showViewModal = false;
  showEditModal = false;
  showDeleteModal = false;

  constructor(private lessonsService: LessonsService) {}

  ngOnInit(): void {
    this.fetchLessons();
  }

  fetchLessons(): void {
    this.loading = true;
    this.lessonsService
      .getAllLessons()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => (this.lessons = res),
        error: (err) => {
          console.error(err);
          this.error = 'Failed to load lessons';
        },
      });
  }

  // ----------------------
  // VIEW MODAL
  // ----------------------
  openViewModal(lesson: Lesson): void {
    this.selectedLesson = lesson;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.selectedLesson = null;
    this.showViewModal = false;
  }

  // ----------------------
  // EDIT MODAL
  // ----------------------
  openEditModal(lesson: Lesson): void {
    this.editLessonData = {
      ...lesson,
      questions: lesson.questions ? [...lesson.questions] : [],
    };
    this.showEditModal = true;
  }
  

  closeEditModal(): void {
    this.editLessonData = null;
    this.showEditModal = false;
  }

  saveLessonEdits(): void {
    if (!this.editLessonData) return;

    this.lessonsService.updateLesson(this.editLessonData.id, this.editLessonData).subscribe({
      next: (updatedLesson) => {
        const index = this.lessons.findIndex((l) => l.id === updatedLesson.id);
        if (index > -1) this.lessons[index] = updatedLesson;
        this.closeEditModal();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to save lesson edits';
      },
    });
  }

  // ----------------------
  // DELETE MODAL
  // ----------------------
  openDeleteModal(lesson: Lesson): void {
    this.deleteLessonData = lesson;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.deleteLessonData = null;
    this.showDeleteModal = false;
  }

  confirmDeleteLesson(): void {
    if (!this.deleteLessonData) return;

    this.lessonsService.deleteLesson(this.deleteLessonData.id).subscribe({
      next: () => {
        this.lessons = this.lessons.filter((l) => l.id !== this.deleteLessonData?.id);
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to delete lesson';
        this.closeDeleteModal();
      },
    });
  }
}
