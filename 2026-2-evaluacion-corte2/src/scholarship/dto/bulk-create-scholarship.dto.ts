import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, ValidateNested } from "class-validator";
import { CreateScholarshipDto } from "./create-scholarship.dto";

export class BulkCreateScholarshipDto {

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateScholarshipDto)
    scholarships: CreateScholarshipDto[];
}
