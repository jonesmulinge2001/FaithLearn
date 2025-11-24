import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LessonService } from '../../services/create-lesson.service';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-create-lesson',
  templateUrl: './create-lesson.component.html',
})
export class CreateLessonComponent {
  loading = false;
  success = false;
  error = false;

  lessonForm!: FormGroup;

  constructor(private fb: FormBuilder, private lessonService: LessonService) {
    this.lessonForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      questions: this.fb.array([]),
    });
  }

  get questions(): FormArray {
    return this.lessonForm.get('questions') as FormArray;
  }

  addQuestion() {
    this.questions.push(
      this.fb.group({
        question: ['', Validators.required],
      })
    );
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  submitLesson() {
    if (this.lessonForm.invalid) return;

    this.loading = true;
    this.error = false;

    this.lessonService.createLesson(this.lessonForm.value).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        this.lessonForm.reset();
        this.questions.clear();
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }
}
