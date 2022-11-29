import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseRequest } from './dto/request/create-course.request';
import { UpdateCourseRequest } from './dto/request/update-course.request';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async get(userId: number, id: number) {
    const course = await this.prisma.course.findMany({
      where: {
        id: id,
        courseTeachers: {
          some: {
            teacherId: userId,
          },
        },
      },
    });
    if (!course[0]) return { error: 'Course not found' };
    return course[0];
  }

  async getAll(userId: number) {
    const courses = await this.prisma.course.findMany({
      where: {
        courseTeachers: {
          some: {
            teacherId: userId,
          },
        },
      },
    });
    return { courses };
  }

  async create(userId: number, createCourseRequest: CreateCourseRequest) {
    const course = await this.prisma.course.create({
      data: {
        ...createCourseRequest,
        courseTeachers: {
          create: [
            {
              teacher: {
                connect: {
                  teacherId: userId,
                },
              },
            },
          ],
        },
      },
    });
    return course;
  }

  async delete(userId: number, id: number) {
    const course = await this.prisma.course.deleteMany({
      where: {
        id: id,
        courseTeachers: {
          some: {
            teacherId: userId,
          },
        },
      },
    });

    return true;
  }

  async update(
    userId: number,
    id: number,
    updateCourseRequest: UpdateCourseRequest,
  ) {
    const course = await this.prisma.course.updateMany({
      where: {
        id: id,
        courseTeachers: {
          some: {
            teacherId: userId,
          },
        },
      },
      data: updateCourseRequest,
    });

    return course;
  }
}
