/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LessonQuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string;

}

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonQuestionDto)
  questions: LessonQuestionDto[];
}

export class UpdateLessonDto {
  @IsString()
  title?: string;

  @IsString()
  content?: string;
}
