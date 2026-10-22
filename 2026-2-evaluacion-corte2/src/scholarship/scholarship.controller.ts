import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ScholarshipService } from './scholarship.service';
import { ValidRoles } from '../user/enums/valid-roles.enum';
import { Auth } from '../user/decorators/auth.decorator';
import { GetUser } from '../user/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { PaginationDto } from '../student/dto/pagination.dto';
import { BulkCreateScholarshipDto } from './dto/bulk-create-scholarship.dto';

@Controller('scholarship')
export class ScholarshipController {
  constructor(private readonly scholarshipService: ScholarshipService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto){
    return this.scholarshipService.findAll(paginationDto);
  }

  @Post("bulk")
  @Auth(ValidRoles.admin)
  bulkCreate(@Body() bulkCreateScholarshipDto: BulkCreateScholarshipDto, @GetUser() user: User){
    return this.scholarshipService.bulkCreate(bulkCreateScholarshipDto, user);
  }
}
