import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson, LessonQuestion, StudentAnswer } from '../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LessonsService } from '../../services/create-lesson.service';

@Component({
  standalone: true,
  selector: 'app-lesson-view',
  imports: [CommonModule, FormsModule],
  templateUrl: './lesson-view.component.html',
})
export class LessonViewComponent implements OnInit {
  lesson!: Lesson | null;
  studentId = localStorage.getItem('userId') || '';
  answersMap: Record<string, string> = {};
  submittedAnswersSet = new Set<string>();
  loading = false;
  submittingQuestionId: string | null = null;
  studentQuestion = '';
  reviewMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lessonService: LessonsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.reviewMode = this.route.snapshot.queryParamMap.get('review') === 'true';

    if (!id) {
      this.router.navigate(['/lessons']);
      return;
    }

    this.loadLesson(id);
  }

  loadLesson(id: string) {
    this.loading = true;

    this.lessonService.getLesson(id).subscribe({
      next: (lesson) => {
        this.lesson = lesson;

        (lesson.questions ?? []).forEach((q) => {
          if (q.id) this.answersMap[q.id] = '';
        });

        if (this.studentId) {
          this.lessonService.getStudentAnswers(this.studentId).subscribe({
            next: (answers: StudentAnswer[]) => {
              answers.forEach((a) => {
                if (a && a.questionId) {
                  this.submittedAnswersSet.add(a.questionId);
                  this.answersMap[a.questionId] = a.answer || '';
                }
              });

              this.loading = false;
            },
            error: () => {
              this.loading = false;
            },
          });
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Failed to load lesson', err);
        this.loading = false;
      },
    });
  }

  submitAnswer(questionId: string) {
    if (!this.lesson) return;

    const text = (this.answersMap[questionId] || '').trim();
    if (!text) {
      alert('Please write an answer before submitting.');
      return;
    }

    this.submittingQuestionId = questionId;

    this.lessonService
      .submitStudentAnswer(this.studentId, questionId, text)
      .subscribe({
        next: () => {
          this.submittedAnswersSet.add(questionId);
          this.submittingQuestionId = null;
        },
        error: (err) => {
          console.error('Failed to submit answer', err);
          this.submittingQuestionId = null;
          alert('Failed to submit answer. Try again.');
        },
      });
  }

  askAdmin() {
    if (!this.lesson || !this.studentId) return;

    const question = this.studentQuestion.trim();
    if (!question) {
      alert('Please type your question before sending.');
      return;
    }

    this.lessonService
      .submitStudentQuestion(this.lesson.id, this.studentId, { question })
      .subscribe({
        next: () => {
          alert('Your question was sent to admin.');
          this.studentQuestion = '';
        },
        error: (err) => {
          console.error('Failed to send question', err);
          alert('Failed to send question. Try again later.');
        },
      });
  }

  isQuestionSubmitted(q: LessonQuestion) {
    return !!q.id && this.submittedAnswersSet.has(q.id);
  }
}
