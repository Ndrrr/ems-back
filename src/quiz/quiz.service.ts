import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizRequest } from './dto/request/create-quiz.request';
import { UpdateQuizRequest } from './dto/request/update-quiz.request';

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}

  async get(id: number) {
    const quiz = await this.prisma.quiz.findUnique({
      where: {
        id: id,
      },
    });
    if (!quiz) return { error: 'Quiz not found' };
    return quiz;
  }

  async getAll() {
    const quizzes = await this.prisma.quiz.findMany();
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
    const quiz = await this.prisma.quiz.update({
      where: {
        id: id,
      },
      data: updateQuizRequest,
    });

    return quiz;
  }
}
