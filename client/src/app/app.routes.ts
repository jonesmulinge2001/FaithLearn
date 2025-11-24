import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { AuthGuard } from './auth/auth.guard';
import { StudentLayoutComponent } from './layouts/student-layout/student-layout.component';
import { HomeComponent } from './components/home/home.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { CreateLessonComponent } from './admin/create-lesson/create-lesson.component';
import { LessonsComponent } from './admin/lessons/lessons.component';
import { LessonDetailsComponent } from './admin/lesson-details/lesson-details.component';

export const routes: Routes = [
    // ==== Public routes (no layout) ====
    { path: 'register', component: RegisterComponent },
    { path: 'verify-email', component: VerifyEmailComponent },
    { path: 'login', component: LoginComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },

      // ==== Student routes ====
  {
    path: '',
    component: StudentLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
    ]
  },

    // ==== Admin routes ====
    {
      path: 'admin',
      component: AdminLayoutComponent,
      canActivate: [AuthGuard],
      children: [
        { path: 'dashboard', component: DashboardComponent },
        { path: 'create-lesson', component: CreateLessonComponent },
        { path: 'lessons', component: LessonsComponent },
        {
          path: 'lessons/:id',
          component: LessonDetailsComponent
        }
        
      ]
    },
]
