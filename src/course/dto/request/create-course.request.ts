import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
