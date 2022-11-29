export class QuizResponse {
  id: number;
  name: string;
  description: string;
  course: Course;
}

export class Course {
  id: number;
  name: string;
}
