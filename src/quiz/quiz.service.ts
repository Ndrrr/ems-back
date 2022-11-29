import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizRequest } from './dto/request/create-quiz.request';
import { UpdateQuizRequest } from './dto/request/update-quiz.request';
import { QuizResponse } from './dto/response/quiz.response';
import { QuizMapper } from './quiz.mapper';

@Injectable()
export class QuizService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly quizMapper: QuizMapper,
  ) {}

  async get(userId: number, id: number) {
    const quizList = await this.prisma.quiz.findMany({
      where: {
        id: id,
        course: {
          courseTeachers: {
            some: {
              teacherId: userId,
            },
          },
        },
      },
    });
    const quizItem = quizList[0];
    const courseList = await this.prisma.course.findMany({
      where: {
        id: quizItem.courseId,
        courseTeachers: {
          some: {
            teacherId: userId,
          },
        },
      },
    });
    const course = courseList[0];
    if (!quizItem) return { error: 'Quiz not found' };
    return this.quizMapper.mapQuizResponse(quizItem, course);
  }

  async getAll(userId: number) {
    const quizzes = [] as QuizResponse[];
    const quizList = await this.prisma.quiz.findMany({
      where: {
        course: {
          courseTeachers: {
            some: {
              teacherId: userId,
            },
          },
        },
      },
    });
    for (const quiz of quizList) {
      const course = await this.prisma.course.findMany({
        where: {
          id: quiz.courseId,
          courseTeachers: {
            some: {
              teacherId: userId,
            },
          },
        },
      });
      quizzes.push(await this.quizMapper.mapQuizResponse(quiz, course[0]));
    }
    return { quizzes };
  }

  async create(userId: number, createQuizRequest: CreateQuizRequest) {
    // security risk
    // user can create a quiz for other user's course
    const quiz = await this.prisma.quiz.create({
      data: createQuizRequest,
    });
    return quiz;
  }

  async delete(userId: number, id: number) {
    const quiz = await this.prisma.quiz.deleteMany({
      where: {
        id: id,
        course: {
          courseTeachers: {
            some: {
              teacherId: userId,
            },
          },
        },
      },
    });

    return true;
  }

  async update(
    userId: number,
    id: number,
    updateQuizRequest: UpdateQuizRequest,
  ) {
    updateQuizRequest.courseId = Number(updateQuizRequest.courseId);
    console.log(updateQuizRequest);
    const quiz = await this.prisma.quiz.updateMany({
      where: {
        id: id,
        course: {
          courseTeachers: {
            some: {
              teacherId: userId,
            },
          },
        },
      },
      data: updateQuizRequest,
    });

    return quiz;
  }
}
