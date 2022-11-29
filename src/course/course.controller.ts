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

@UseGuards(AtGuard)
@Injectable()
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get(':id')
  async get(@Param('id', new ParseIntPipe()) id: number) {
    return this.courseService.get(id);
  }

  @Get()
  async getAll() {
    return this.courseService.getAll();
  }

  @Post()
  async create(@Body() createCourseRequest: CreateCourseRequest) {
    return this.courseService.create(createCourseRequest);
  }

  @Post(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateCourseRequest: UpdateCourseRequest,
  ) {
    return this.courseService.update(id, updateCourseRequest);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: number) {
    return this.courseService.delete(id);
  }
}
