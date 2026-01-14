/* eslint-disable prettier/prettier */
export class CreateCourseDto {
  title: string;
  description?: string;
}

export class UpdateCourseDto {
  title?: string;
  description?: string;
}
