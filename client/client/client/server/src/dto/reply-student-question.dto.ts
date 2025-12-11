/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty } from 'class-validator';

export class ReplyStudentQuestionDto {
  @IsString()
  @IsNotEmpty()
  answer: string;
}
