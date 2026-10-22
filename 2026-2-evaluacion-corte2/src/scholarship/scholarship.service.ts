import { ConflictException, HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Scholarship } from './entities/scholarship.entity';
import { User } from '../user/entities/user.entity';
import { PaginationDto } from '../student/dto/pagination.dto';
import { BulkCreateScholarshipDto } from './dto/bulk-create-scholarship.dto';

@Injectable()
export class ScholarshipService {

    private readonly logger = new Logger("ScholarshipService");

    constructor(
        @InjectRepository(Scholarship)
        private readonly scholarshipRepository: Repository<Scholarship>,
        private readonly datasource: DataSource
    ){}

    async findAll(paginationDto: PaginationDto){
        const { limit, skip } = paginationDto;
        return this.scholarshipRepository.find({
            take: limit,
            skip: skip
        });
    }

    async bulkCreate(bulkCreateScholarshipDto: BulkCreateScholarshipDto, user: User){
        const { scholarships } = bulkCreateScholarshipDto;

        const names = scholarships.map(scholarship => scholarship.name);
        const codes = scholarships.map(scholarship => scholarship.code);
        if(new Set(names).size !== names.length || new Set(codes).size !== codes.length)
            throw new ConflictException("Duplicated name or code inside the batch");

        const queryRunner = this.datasource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            const existing = await queryRunner.manager.find(Scholarship, {
                where: [{ name: In(names) }, { code: In(codes) }]
            });
            if(existing.length)
                throw new ConflictException(`Scholarships already exist: ${existing.map(scholarship => scholarship.code).join(", ")}`);

            const newScholarships = scholarships.map(scholarship =>
                this.scholarshipRepository.create({ ...scholarship, createdBy: user })
            );
            await queryRunner.manager.save(Scholarship, newScholarships);
            await queryRunner.commitTransaction();
            return newScholarships;
        }catch(error){
            await queryRunner.rollbackTransaction();
            this.handleException(error);
        }finally{
            await queryRunner.release();
        }
    }

    private handleException(error: any){
        if(error instanceof HttpException) throw error;
        this.logger.error(error);
        if(error.code === '23505')
            throw new ConflictException(error.detail);
        throw new InternalServerErrorException("Unexpected error, check server logs");
    }
}
