import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { QuizMapper } from './quiz.mapper';

@Module({
  providers: [QuizService, QuizMapper],
  controllers: [QuizController],
})
export class QuizModule {}
