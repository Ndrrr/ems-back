import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuizRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  courseId: number;
}
