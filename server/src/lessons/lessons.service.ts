/* eslint-disable prettier/prettier */
  
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';
import { CreateLessonDto, UpdateLessonDto } from 'src/dto/lesson.dto';
import { CreateStudentQuestionDto } from 'src/dto/student-question.dto';

@Injectable()
export class LessonsService {
  constructor() {}
  private prisma = new PrismaClient();

  // Create Lesson + Questions
  async createLesson(dto: CreateLessonDto) {
    return this.prisma.lesson.create({
      data: {
        title: dto.title,
        content: dto.content,
        questions: {
          create: dto.questions.map((q) => ({
            question: q.question,
          })),
        },
      },
      include: { questions: true },
    });
  }

  // Get all lessons
  async findAll() {
    return this.prisma.lesson.findMany({
      include: {
        questions: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get single lesson
  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id, isDeleted: false },
      include: { questions: true },
    });

    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  // Update lesson basic info
  async update(id: string, dto: UpdateLessonDto) {
    await this.findOne(id);

    return this.prisma.lesson.update({
      where: { id, isDeleted: false},
      data: {
        title: dto.title,
        content: dto.content,
      },
    });
  }

// Soft delete lesson
async remove(id: string) {
    await this.findOne(id);
  
    return this.prisma.lesson.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
  

  // Student submits question about a lesson
  async submitStudentQuestion(
    lessonId: string,
    studentId: string,
    dto: CreateStudentQuestionDto,
  ) {
    await this.findOne(lessonId);

    return this.prisma.studentLessonQuestion.create({
      data: {
        lessonId,
        studentId,
        question: dto.question,
      },
    });
  }

  // Get all student-submitted questions
  async getAllStudentQuestions() {
    return this.prisma.studentLessonQuestion.findMany({
      include: {
        lesson: {
          select: { id: true, title: true },
        },
        student: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get student questions filtered by lesson
  async getQuestionsByLesson(lessonId: string) {
    return this.prisma.studentLessonQuestion.findMany({
      where: { lessonId },
      include: {
        student: {
          select: { id: true, name: true, email: true },
        },
        lesson: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get questions by a specific student
  async getQuestionsByStudent(studentId: string) {
    return this.prisma.studentLessonQuestion.findMany({
      where: { studentId },
      include: {
        lesson: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async replyToStudentQuestion(questionId: string, answer: string) {
    const question = await this.prisma.studentLessonQuestion.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException('Student question not found');
    }

    return this.prisma.studentLessonQuestion.update({
      where: { id: questionId },
      data: { answer },
    });
  }

  async submitStudentAnswer(
    studentId: string,
    questionId: string,
    answer: string,
  ) {
    // Ensure question exists
    const question = await this.prisma.lessonQuestion.findUnique({
      where: { id: questionId },
    });

    if (!question) throw new NotFoundException('Question not found');

    return await this.prisma.studentLessonAnswer.create({
      data: {
        studentId,
        questionId,
        answer,
      },
    });
  }

  // Get answers by student
  async getStudentAnswers(studentId: string) {
    return this.prisma.studentLessonAnswer.findMany({
      where: { studentId },
      include: {
        question: {
          select: { id: true, question: true, lessonId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Admin: answers for a question
  async getAnswersForQuestion(questionId: string) {
    return this.prisma.studentLessonAnswer.findMany({
      where: { questionId },
      include: {
        student: {
          select: { id: true, name: true, email: true },
        },
        question: {
          select: { id: true, question: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async replyToStudentAnswer(answerId: string, reply: string) {
    return this.prisma.studentLessonAnswer.update({
      where: { id: answerId },
      data: { answer: reply },
    });
  }
  
}
