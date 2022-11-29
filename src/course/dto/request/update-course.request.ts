import { IsString } from 'class-validator';

export class UpdateCourseRequest {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
