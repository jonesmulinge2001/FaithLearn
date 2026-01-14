/* eslint-disable prettier/prettier */
 
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto, UpdateLessonDto } from 'src/dto/lesson.dto';
import { CreateStudentQuestionDto } from 'src/dto/student-question.dto';
import { JwtAuthGuard } from 'src/guards/jwt/jwtAuth.guard';
import { PermissionGuard } from 'src/guards/permissions.guard';
import { RequirePermissions } from 'src/decorator/permission.decorator';
import { Permission } from 'src/permissions/permission.enums';
import { CreateCourseDto } from 'src/dto/course.dto';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  // =========================
  // COURSE ROUTES
  // =========================

  // Get a single course with all its lessons (specific, before :id)
  @UseGuards(JwtAuthGuard)
  @Get('courses/:courseId/with-lessons')
  async getCourseWithLessons(@Param('courseId') courseId: string) {
    return this.lessonsService.findCourseWithLessons(courseId);
  }

  // CREATE COURSE
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(Permission.MANAGE_LESSONS)
  @Post('/courses')
  async createCourse(@Body() data: CreateCourseDto) {
    return this.lessonsService.createCourse(data);
  }

  // GET ALL COURSES
  @Get('/courses')
  async getAllCourses() {
    return this.lessonsService.findAllCourses();
  }

  // GET SINGLE COURSE
  @Get('/courses/:id')
  async findCourse(@Param('id') id: string) {
    return this.lessonsService.findCourse(id);
  }

  // GET lessons by course
  @Get('course/:courseId')
  async getLessonsByCourse(@Param('courseId') courseId: string) {
    return this.lessonsService.findAllByCourse(courseId);
  }

  // UPDATE COURSE
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(Permission.MANAGE_LESSONS)
  @Patch('/courses/:id')
  async updateCourse(
    @Param('id') id: string,
    @Body() data: { title?: string; description?: string },
  ) {
    return this.lessonsService.updateCourse(id, data);
  }

  // DELETE COURSE
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(Permission.MANAGE_LESSONS)
  @Delete('/courses/:id')
  async deleteCourse(@Param('id') id: string) {
    return this.lessonsService.deleteCourse(id);
  }

  // =========================
  // LESSON ROUTES
  // =========================

  // Create lesson
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(Permission.MANAGE_LESSONS)
  @Post()
  async createLesson(@Body() dto: CreateLessonDto) {
    return this.lessonsService.createLesson(dto);
  }

  // Get all lessons
  @Get()
  async findAll() {
    return this.lessonsService.findAll();
  }

  // Get questions for one lesson (specific)
  @Get(':lessonId/questions')
  async getQuestionsByLesson(@Param('lessonId') lessonId: string) {
    return this.lessonsService.getQuestionsByLesson(lessonId);
  }

  // Get students for a lesson (specific)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(Permission.MANAGE_LESSONS)
  @Get(':lessonId/students')
  async getStudentsForLesson(@Param('lessonId') lessonId: string) {
    return this.lessonsService.getStudentsForLesson(lessonId);
  }

  // Get one lesson (catch-all, should be last among lesson routes)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  // Update lesson
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(Permission.MANAGE_LESSONS)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonsService.update(id, dto);
  }

  // Soft delete lesson
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(Permission.MANAGE_LESSONS)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.lessonsService.deletelesson(id);
  }

  // =========================
  // STUDENT QUESTIONS & ANSWERS
  // =========================

  // Submit question
  @Post(':lessonId/questions/:studentId')
  async submitStudentQuestion(
    @Param('lessonId') lessonId: string,
    @Param('studentId') studentId: string,
    @Body() dto: CreateStudentQuestionDto,
  ) {
    return this.lessonsService.submitStudentQuestion(lessonId, studentId, dto);
  }

  // Get all student-submitted questions
  @Get('/questions/all')
  async getAllStudentQuestions() {
    return this.lessonsService.getAllStudentQuestions();
  }

  // Get questions by student
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(Permission.MANAGE_LESSONS)
  @Get('student/:studentId/questions')
  async getQuestionsByStudent(@Param('studentId') studentId: string) {
    return this.lessonsService.getQuestionsByStudent(studentId);
  }

  // Admin reply to student question
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(Permission.MANAGE_LESSONS)
  @Post('/questions/reply/:questionId')
  async replyToStudentQuestion(
    @Param('questionId') questionId: string,
    @Body('answer') answer: string,
  ) {
    return this.lessonsService.replyToStudentQuestion(questionId, answer);
  }

  // Submit student answer
  @Post('/answers/:studentId/:questionId')
  async submitStudentAnswer(
    @Param('studentId') studentId: string,
    @Param('questionId') questionId: string,
    @Body('answer') answer: string,
  ) {
    return this.lessonsService.submitStudentAnswer(
      studentId,
      questionId,
      answer,
    );
  }

  // Get student's own answers
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(Permission.COMPLETE_LESSON)
  @Get('student/:studentId/answers')
  async getStudentAnswers(@Param('studentId') studentId: string) {
    return this.lessonsService.getStudentAnswers(studentId);
  }

  // Admin: get all answers for a question
  @Get('answers/question/:questionId')
  async getAnswersForQuestion(@Param('questionId') questionId: string) {
    return this.lessonsService.getAnswersForQuestion(questionId);
  }

  // Admin reply to student answer
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(Permission.MANAGE_LESSONS)
  @Post('/answers/reply/:answerId')
  async replyToStudentAnswer(
    @Param('answerId') answerId: string,
    @Body('reply') reply: string,
  ) {
    return this.lessonsService.replyToStudentAnswer(answerId, reply);
  }

  // =========================
  // ENROLLMENT
  // =========================

  @UseGuards(JwtAuthGuard)
  @Post('enroll/:studentId/:courseId')
  async enrollStudentToCourse(
    @Param('studentId') studentId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.lessonsService.enrollStudentToCourse(studentId, courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('enrolled-courses/:studentId')
  async getEnrolledCourses(@Param('studentId') studentId: string) {
    return this.lessonsService.getEnrolledCourses(studentId);
  }
}
