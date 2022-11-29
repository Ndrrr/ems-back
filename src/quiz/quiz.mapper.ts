import { Injectable } from '@nestjs/common';
import { Course, QuizResponse } from './dto/response/quiz.response';

@Injectable()
export class QuizMapper {
  async mapQuizResponse(quizItem, course) {
    const quizResponse = new QuizResponse();
    quizResponse.id = quizItem.id;
    quizResponse.name = quizItem.name;
    quizResponse.description = quizItem.description;
    quizResponse.course = {
      id: course.id,
      name: course.name,
    } as Course;
    return quizResponse;
  }
}
