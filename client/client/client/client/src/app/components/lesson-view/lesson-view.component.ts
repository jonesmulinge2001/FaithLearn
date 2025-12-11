import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Lesson, LessonQuestion } from '../../interfaces/interfaces';
import { LessonsService } from '../../services/create-lesson.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports:[CommonModule, FormsModule],
  selector: 'app-lesson-view',
  templateUrl: './lesson-view.component.html',
})
export class LessonViewComponent {
  // lesson!: Lesson | null;
  // studentId = localStorage.getItem('userId') || '';
  // answersMap: Record<string, string> = {}; // questionId -> text (local draft)
  // submittedAnswersSet = new Set<string>(); // questionIds that were successfully submitted
  // loading = false;
  // submittingQuestionId: string | null = null;
  // studentQuestion = ''; // question to admin
  // reviewMode = false; // if route query param review=true

  // constructor(
  //   private route: ActivatedRoute,
  //   private router: Router,
  //   private lessonService: LessonsService
  // ) {}

  // ngOnInit(): void {
  //   const id = this.route.snapshot.paramMap.get('id');
  //   this.reviewMode = this.route.snapshot.queryParamMap.get('review') === 'true';
  //   if (!id) {
  //     this.router.navigate(['/lessons']);
  //     return;
  //   }
  //   this.loadLesson(id);
  // }

  // loadLesson(id: string) {
  //   this.loading = true;
  //   this.lessonService.getLesson(id).subscribe({
  //     next: (lesson) => {
  //       this.lesson = lesson;
  //       // initialize answersMap for questions so ngModel binds without error
  //       (lesson.questions ?? []).forEach((q) => {
  //         if (q.id) this.answersMap[q.id] = '';
  //       });
  //       // load already submitted answers for this student for this lesson (if any)
  //       if (this.studentId) {
  //         this.lessonService.getStudentAnswersForLesson(id, this.studentId).subscribe({
  //           next: (answers: any[]) => {
  //             // backend expected to return array of StudentAnswer objects
  //             answers.forEach((a) => {
  //               if (a && a.questionId) {
  //                 this.submittedAnswersSet.add(a.questionId);
  //                 // populate local draft with the submitted answer for review/readonly view
  //                 this.answersMap[a.questionId] = a.answer ?? this.answersMap[a.questionId] ?? '';
  //               }
  //             });
  //             this.checkAutoComplete();
  //             this.loading = false;
  //           },
  //           error: (err) => {
  //             // if route not available, still continue; user can submit answers normally
  //             console.warn('Could not fetch student answers', err);
  //             this.loading = false;
  //           },
  //         });
  //       } else {
  //         this.loading = false;
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Failed to load lesson', err);
  //       this.loading = false;
  //     },
  //   });
  // }

  // submitAnswer(questionId: string) {
  //   if (!this.lesson) return;
  //   const text = (this.answersMap[questionId] || '').trim();
  //   if (!text) {
  //     alert('Please write an answer before submitting.');
  //     return;
  //   }
  //   this.submittingQuestionId = questionId;
  //   this.lessonService
  //     .answerLessonQuestion(this.lesson.id, questionId, { answer: text })
  //     .subscribe({
  //       next: () => {
  //         this.submittedAnswersSet.add(questionId);
  //         this.submittingQuestionId = null;
  //         // optional: update status in lessons list (other component) by localStorage or event — here we just call complete check
  //         this.checkAutoComplete();
  //       },
  //       error: (err) => {
  //         console.error('Failed to submit answer', err);
  //         this.submittingQuestionId = null;
  //         alert('Failed to submit answer. Try again.');
  //       },
  //     });
  // }

  // // If all questions have been submitted, optionally call completeLesson
  // checkAutoComplete() {
  //   if (!this.lesson || !this.studentId) return;
  //   const total = this.lesson.questions?.length ?? 0;
  //   if (total === 0) return;
  //   const submitted = this.submittedAnswersSet.size;
  //   if (submitted >= total) {
  //     // mark completed (optional backend endpoint)
  //     this.lessonService.completeLesson(this.lesson.id, this.studentId).subscribe({
  //       next: () => {
  //         // feedback
  //         console.log(`Lesson ${this.lesson?.id} marked complete for ${this.studentId}`);
  //         // optionally emit an event or update shared state so list view updates
  //         alert('Congratulations — you have completed this lesson!');
  //       },
  //       error: (err) => {
  //         // if backend doesn't have the endpoint, it's okay; log and still show success
  //         console.warn('completeLesson endpoint may not exist', err);
  //         alert('You have answered all questions — lesson considered completed.');
  //       },
  //     });
  //   }
  // }

  // // Ask admin a question about this lesson
  // askAdmin() {
  //   if (!this.lesson || !this.studentId) return;
  //   const payload = { question: (this.studentQuestion || '').trim() };
  //   if (!payload.question) {
  //     alert('Please type your question before sending.');
  //     return;
  //   }
  //   this.lessonService.askLessonQuestion(this.lesson.id, this.studentId, payload).subscribe({
  //     next: () => {
  //       alert('Your question was sent to admin.');
  //       this.studentQuestion = '';
  //     },
  //     error: (err) => {
  //       console.error('Failed to send question', err);
  //       alert('Failed to send question. Try again later.');
  //     },
  //   });
  // }

  // isQuestionSubmitted(q: LessonQuestion) {
  //   return !!q.id && this.submittedAnswersSet.has(q.id);
  // }
}
