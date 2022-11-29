import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateCourseRequest } from './dto/request/create-course.request';
import { UpdateCourseRequest } from './dto/request/update-course.request';
import { CourseService } from './course.service';
import { AtGuard } from '../common/guards';
import { GetCurrentUser } from '../common/decorators/get-current-user.decorator';

@UseGuards(AtGuard)
@Injectable()
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get(':id')
  async get(
    @GetCurrentUser('sub') userId: number,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.courseService.get(userId, id);
  }

  @Get()
  async getAll(@GetCurrentUser('sub') userId: number) {
    return this.courseService.getAll(userId);
  }

  @Post()
  async create(
    @GetCurrentUser('sub') userId: number,
    @Body() createCourseRequest: CreateCourseRequest,
  ) {
    return this.courseService.create(userId, createCourseRequest);
  }

  @Post(':id')
  async update(
    @GetCurrentUser('sub') userId: number,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateCourseRequest: UpdateCourseRequest,
  ) {
    return this.courseService.update(userId, id, updateCourseRequest);
  }

  @Delete(':id')
  async delete(
    @GetCurrentUser('sub') userId: number,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.courseService.delete(userId, id);
  }
}
