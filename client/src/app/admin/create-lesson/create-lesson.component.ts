// src/app/components/create-lesson/create-lesson.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Course } from '../../interfaces/interfaces';
import { LessonsService } from '../../services/create-lesson.service';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  selector: 'app-create-lesson',
  templateUrl: './create-lesson.component.html',
})
export class CreateLessonComponent implements OnInit {
  lessonForm!: FormGroup;
  courses: Course[] = [];
  loadingCourses = true;
  submitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private lessonsService: LessonsService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCourses();
  }

  private initForm() {
    this.lessonForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      courseId: ['', Validators.required],
      questions: this.fb.array([this.createQuestionGroup()]),
    });
  }

  get questions(): FormArray {
    return this.lessonForm.get('questions') as FormArray;
  }

  createQuestionGroup(): FormGroup {
    return this.fb.group({
      question: ['', Validators.required],
    });
  }

  addQuestion() {
    this.questions.push(this.createQuestionGroup());
  }

  removeQuestion(index: number) {
    if (this.questions.length > 1) {
      this.questions.removeAt(index);
    }
  }

  loadCourses() {
    this.lessonsService.getAllCourses().subscribe({
      next: (res) => {
        this.courses = res;
        this.loadingCourses = false;
      },
      error: (err) => {
        console.error('Error loading courses', err);
        this.loadingCourses = false;
      },
    });
  }

  submitLesson() {
    if (this.lessonForm.invalid) return;

    this.submitting = true;
    this.lessonsService.createLesson(this.lessonForm.value).subscribe({
      next: (res) => {
        this.successMessage = 'Lesson created successfully!';
        this.lessonForm.reset();
        // reset questions to one field
        this.lessonForm.setControl('questions', this.fb.array([this.createQuestionGroup()]));
        this.submitting = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to create lesson.';
        this.submitting = false;
      },
    });
  }
}
