/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateStudentQuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string;
}
