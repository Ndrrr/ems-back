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
import { GetCurrentUser } from '../common/decorators/get-current-user.decorator';

@UseGuards(AtGuard)
@Injectable()
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get(':id')
  async get(
    @GetCurrentUser('sub') userId: number,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.quizService.get(userId, id);
  }

  @Get()
  async getAll(@GetCurrentUser('sub') userId: number) {
    return this.quizService.getAll(userId);
  }

  @Post()
  async create(
    @GetCurrentUser('sub') userId: number,
    @Body() createQuizRequest: CreateQuizRequest,
  ) {
    return this.quizService.create(userId, createQuizRequest);
  }

  @Post(':id')
  async update(
    @GetCurrentUser('sub') userId: number,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateQuizRequest: UpdateQuizRequest,
  ) {
    return this.quizService.update(userId, id, updateQuizRequest);
  }

  @Delete(':id')
  async delete(
    @GetCurrentUser('sub') userId: number,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.quizService.delete(userId, id);
  }
}
