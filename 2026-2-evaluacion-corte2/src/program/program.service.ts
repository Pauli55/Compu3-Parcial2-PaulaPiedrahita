import { HttpStatus, Injectable } from '@nestjs/common';
import { BadRequestException, ConflictException, HttpException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Program } from './entities/program.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { PaginationDto } from 'src/student/dto/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ProgramService {
    [x: string]: any;

    // TODO Reto 1: inyecta el repositorio de Program (y lo que necesites para las transacciones)
    private readonly logger = new Logger("ProgramService");
    

    // TODO Reto 1: inyecta el repositorio de Club (y lo que necesites para el Reto 2)

    constructor(
        @InjectRepository(Program)
        private readonly programRepository: Repository<Program>,
        private readonly datasource: DataSource

    ){}

    // TODO Reto 1: create(createProgramDto, user) -> guarda el programa
    //   - nombre o código repetido -> 409 Conflict (no 500)

    async create(createProgramDto: CreateProgramDto, user: User){
        try{
            const program = this.programRepository.create({
                ...createProgramDto,
                createdBy: user
            });
            await this.programRepository.save(program);
            return program;
        }catch(error){
            this.handleException(error);
        }
    }


    // TODO Reto 1: findAll(paginationDto) -> lista paginada (limit / skip)
    async findAll(paginationDto: PaginationDto){
        const { limit, skip } = paginationDto;
        return this.programRepository.find({
            take: limit,
            skip: skip
        });
    }
    
    // TODO Reto 2: findOne(id) -> programa con sus estudiantes, 404 si no existe
    async findOne(id: string){
        let program: Program | null;

        if(isUUID(id)){
            program = await this.programRepository.findOne({
                where: { id: id },
                relations: { students: true }
            });
        }else{
            program = await this.programRepository.createQueryBuilder("program")
                .where("UPPER(program.name) = :name", { name: id.toUpperCase() })
                .leftJoinAndSelect("name.students", "students")
                .getOne();
        }

        if(!program) throw new NotFoundException(`Program ${name} not found`);

        return program;
    }

    // TODO Reto 2: assignStudents(id, assignStudentsDto) -> AGREGA estudiantes al programa
    //   dentro de una transacción (QueryRunner), conservando los que ya tenía.
    //   Mismo patrón del update de estudiantes corregido en clase (combinar las notas):
    //   traer los actuales -> combinar con los nuevos -> guardar la lista completa.
    //   Si algún id no existe: 404 y rollback.

    // TODO Reto 3: bulkCreate(bulkCreateProgramDto, user) -> crea todos los programas o ninguno
    //   (transacción). Cualquier nombre/código repetido -> 409 y rollback.
}
