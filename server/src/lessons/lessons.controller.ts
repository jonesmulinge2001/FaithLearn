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

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

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

  // Get one lesson
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
    return this.lessonsService.remove(id);
  }

  // Student submits question about a lesson
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

  // Get questions for one lesson
  @Get(':lessonId/questions')
  async getQuestionsByLesson(@Param('lessonId') lessonId: string) {
    return this.lessonsService.getQuestionsByLesson(lessonId);
  }

  // Get questions by student
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(Permission.MANAGE_LESSONS)
  @Get('student/:studentId/questions')
  async getQuestionsByStudent(@Param('studentId') studentId: string) {
    return this.lessonsService.getQuestionsByStudent(studentId);
  }

  // Admin reply to a student question
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(Permission.MANAGE_LESSONS)
  @Post('/questions/reply/:questionId')
  async replyToStudentQuestion(
    @Param('questionId') questionId: string,
    @Body('answer') answer: string,
  ) {
    return this.lessonsService.replyToStudentQuestion(questionId, answer);
  }

  // Student submits answer to lesson question
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

  // Student: get their own answers
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

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(Permission.MANAGE_LESSONS)
  @Post('/answers/reply/:answerId')
  async replyToStudentAnswer(
    @Param('answerId') answerId: string,
    @Body('reply') reply: string,
  ) {
    return this.lessonsService.replyToStudentAnswer(answerId, reply);
  }
}
