import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScholarshipService } from './scholarship.service';
import { ScholarshipController } from './scholarship.controller';
import { Scholarship } from './entities/scholarship.entity';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [ScholarshipController],
  imports: [
    TypeOrmModule.forFeature([Scholarship]),
    UserModule,
  ],
  providers: [ScholarshipService],
  exports: [ScholarshipService],
})
export class ScholarshipModule {}
