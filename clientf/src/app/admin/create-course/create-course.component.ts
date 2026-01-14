import { Component, OnInit } from '@angular/core';
import { Course } from '../../interfaces/interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LessonsService } from '../../services/create-lesson.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-course',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.component.css'
})
export class CreateCourseComponent implements OnInit{
  courseForm!: FormGroup
  course: Course[] = [];
  submitting: boolean = false;
  successMessage: string = '';
  errormessage: string = '';

  constructor(
    private fb: FormBuilder,
    private lessonService: LessonsService
  ){}

  ngOnInit(): void {
    this.initForm(); 
  }

  // initialize the form
  private initForm(){
    this.courseForm = this.fb.group({
      title: ['', Validators.required]
    })
  }

  submitCourse() {
    if(this.courseForm.invalid) return
    this.submitting = true;
    this.lessonService.createCourse(this.courseForm.value).subscribe({
      next: (res) => {
        this.successMessage = 'Course created successfully!'
        this.courseForm.reset();
      },
      error: (err) => {
        console.error
        this.errormessage = 'Failed to create course';
        this.submitting = false;
      }
    })
  }
}
