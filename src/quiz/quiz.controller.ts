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
import { QuizService } from './quiz.service';
import { CreateQuizRequest } from './dto/request/create-quiz.request';
import { UpdateQuizRequest } from './dto/request/update-quiz.request';
import { AtGuard } from '../common/guards';

@UseGuards(AtGuard)
@Injectable()
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get(':id')
  async get(@Param('id', new ParseIntPipe()) id: number) {
    return this.quizService.get(id);
  }

  @Get()
  async getAll() {
    return this.quizService.getAll();
  }

  @Post()
  async create(@Body() createQuizRequest: CreateQuizRequest) {
    return this.quizService.create(createQuizRequest);
  }

  @Post(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateQuizRequest: UpdateQuizRequest,
  ) {
    return this.quizService.update(id, updateQuizRequest);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: number) {
    return this.quizService.delete(id);
  }
}
