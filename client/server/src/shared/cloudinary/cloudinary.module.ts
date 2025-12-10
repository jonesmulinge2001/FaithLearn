/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LightCloudinaryService } from './cloudinary.service';

@Module({
  imports: [ConfigModule],
  providers: [LightCloudinaryService],
  exports: [LightCloudinaryService],
})
export class CloudinaryModule {}
