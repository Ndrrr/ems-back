import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseRequest } from './dto/request/create-course.request';
import { UpdateCourseRequest } from './dto/request/update-course.request';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async get(id: number) {
    const quiz = await this.prisma.course.findUnique({
      where: {
        id: id,
      },
    });
    if (!quiz) return { error: 'Course not found' };
    return quiz;
  }

  async getAll() {
    const courses = await this.prisma.course.findMany();
    return { courses };
  }

  async create(createCourseRequest: CreateCourseRequest) {
    const quiz = await this.prisma.course.create({
      data: createCourseRequest,
    });
    return quiz;
  }

  async delete(id: number) {
    const quiz = await this.prisma.course.delete({
      where: {
        id: id,
      },
    });

    return true;
  }

  async update(id: number, updateCourseRequest: UpdateCourseRequest) {
    const quiz = await this.prisma.course.update({
      where: {
        id: id,
      },
      data: updateCourseRequest,
    });

    return quiz;
  }
}
