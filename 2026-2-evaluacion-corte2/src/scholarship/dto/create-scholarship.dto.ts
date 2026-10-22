import { IsInt, IsString, Matches, Max, Min, MinLength } from "class-validator";

export class CreateScholarshipDto {

    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @Matches(/^BEC-\d{3}$/)
    code: string;

    @IsInt()
    @Min(1)
    @Max(100)
    percentage: number;
}
