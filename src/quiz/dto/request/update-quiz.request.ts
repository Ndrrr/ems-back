import { IsString } from 'class-validator';

export class UpdateQuizRequest {
  @IsString()
  name: string;

  @IsString()
  description: string;

  courseId: number;
}
