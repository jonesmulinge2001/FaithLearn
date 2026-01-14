/* eslint-disable prettier/prettier */
 
 
 
 
/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */
import {
  
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';
import { CreateCourseDto } from 'src/dto/course.dto';
import { CreateLessonDto, UpdateLessonDto } from 'src/dto/lesson.dto';
import { CreateStudentQuestionDto } from 'src/dto/student-question.dto';

@Injectable()
export class LessonsService {
  constructor() {}
  private prisma = new PrismaClient();

  // =========================
  // COURSE METHODS
  // =========================

  // Create course
  async createCourse(data: CreateCourseDto) {
    return this.prisma.course.create({
      data,
    });
  }

  // Get all courses
  async findAllCourses() {
    return this.prisma.course.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get one course
  async findCourse(id: string) {
    const course = await this.prisma.course.findFirst({
      where: { id, isDeleted: false },
    });

    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  // Update course
  async updateCourse(
    id: string,
    data: { title?: string; description?: string },
  ) {
    await this.findCourse(id);
    return this.prisma.course.update({
      where: { id },
      data,
    });
  }

  // Soft delete course
  async deleteCourse(id: string) {
    const course = await this.findCourse(id);
    if(!course) return
    return this.prisma.course.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  // Create Lesson + Questions
  async createLesson(dto: CreateLessonDto) {
    return this.prisma.lesson.create({
      data: {
        title: dto.title,
        content: dto.content,
        courseId: dto.courseId,
        questions: {
          create: dto.questions.map((q) => ({ question: q.question })),
        },
      },
      include: { questions: true },
    });
  }

  // Get all lessons (only those not deleted)
  async findAllByCourse(courseId: string) {
    return this.prisma.lesson.findMany({
      where: { courseId, isDeleted: false },
      include: { questions: true },
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
      where: { id },
      data: {
        title: dto.title,
        content: dto.content,
        courseId: dto.courseId, // optional
      },
    });
  }

  async findOneWithCourse(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { course: true, questions: true },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  async findCourseWithLessons(courseId: string) {
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, isDeleted: false },
      include: {
        lessons: {
          where: { isDeleted: false },
          select: { title: true, content: true, questions: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }
  

  // Get ALL lessons
  async findAll() {
    return this.prisma.lesson.findMany({
      where: { isDeleted: false },
      include: { questions: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Soft delete lesson
  async deletelesson(id: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id, isDeleted: false },
      include: { questions: true },
    });

    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
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

  async getStudentsForLesson(lessonId: string) {
    return this.prisma.studentLesson.findMany({
      where: { lessonId },
      include: {
        student: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  // Enrollment
  async enrollStudentToCourse(studentId: string, courseId: string) {
    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if student is already enrolled
    const existingEnrollment = await this.prisma.studentCourse.findFirst({
      where: {
        studentId,
        courseId,
      },
    });

    if (existingEnrollment) {
      throw new ConflictException('Student is already enrolled in this course');
    }

    // Create enrollment
    const enrollment = await this.prisma.studentCourse.create({
      data: {
        studentId,
        courseId,
      },
    });

    return {
      message: 'Student enrolled successfully in a course',
      enrollment,
    };
  }

  // get courses student has enrolled
  async getEnrolledCourses(studentId: string) {
    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return this.prisma.studentCourse.findMany({
      where: { studentId },
      include: {
        course: {
          select: { id: true, title: true },
        },
      },
    });
  }
}
