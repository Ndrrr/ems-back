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

  async get(id: number) {
    const quizItem = await this.prisma.quiz.findUnique({
      where: {
        id: id,
      },
    });
    const course = await this.prisma.course.findUnique({
      where: {
        id: quizItem.courseId,
      },
    });
    if (!quizItem) return { error: 'Quiz not found' };
    return this.quizMapper.mapQuizResponse(quizItem, course);
  }

  async getAll() {
    const quizzes = [] as QuizResponse[];
    const quizList = await this.prisma.quiz.findMany();
    for (const quiz of quizList) {
      const course = await this.prisma.course.findUnique({
        where: {
          id: quiz.courseId,
        },
      });
      quizzes.push(await this.quizMapper.mapQuizResponse(quiz, course));
    }
    return { quizzes };
  }

  async create(createQuizRequest: CreateQuizRequest) {
    const quiz = await this.prisma.quiz.create({
      data: createQuizRequest,
    });
    return quiz;
  }

  async delete(id: number) {
    const quiz = await this.prisma.quiz.delete({
      where: {
        id: id,
      },
    });

    return true;
  }

  async update(id: number, updateQuizRequest: UpdateQuizRequest) {
    updateQuizRequest.courseId = Number(updateQuizRequest.courseId);
    console.log(updateQuizRequest);
    const quiz = await this.prisma.quiz.update({
      where: {
        id: id,
      },
      data: updateQuizRequest,
    });

    return quiz;
  }
}
