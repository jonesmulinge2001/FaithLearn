import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Lesson } from '../../interfaces/interfaces';
import { LessonService } from '../../services/create-lesson.service';
import { FormBuilder, FormArray, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-lesson-details',
  templateUrl: './lesson-details.component.html',
})
export class LessonDetailsComponent implements OnInit {
  lesson!: Lesson;
  loading = true;
  error = false;

  // Edit Modal
  showEditModal = false;
  editForm!: FormGroup;
  updating = false;

  constructor(
    private route: ActivatedRoute,
    private lessonService: LessonService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadLesson();
  }

  loadLesson() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.lessonService.getLesson(id).subscribe({
      next: (data) => {
        this.lesson = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  // ----- EDIT MODAL LOGIC -----
  openEditModal() {
    this.editForm = this.fb.group({
      title: [this.lesson.title, Validators.required],
      content: [this.lesson.content, Validators.required],
      questions: this.fb.array(
        this.lesson.questions?.map((q) =>
          this.fb.group({ question: [q.question, Validators.required] })
        ) || []
      ),
    });

    this.showEditModal = true;
  }

  get questions(): FormArray {
    return this.editForm.get('questions') as FormArray;
  }

  addQuestion() {
    this.questions.push(this.fb.group({ question: ['', Validators.required] }));
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  submitEdit() {
    if (this.editForm.invalid) return;

    this.updating = true;
    this.lessonService
      .updateLesson(this.lesson.id, this.editForm.value)
      .subscribe({
        next: (updated) => {
          this.lesson = updated;
          this.showEditModal = false;
          this.updating = false;
        },
        error: () => {
          alert('Update failed. Try again.');
          this.updating = false;
        },
      });
  }

  closeModal() {
    this.showEditModal = false;
  }
}
