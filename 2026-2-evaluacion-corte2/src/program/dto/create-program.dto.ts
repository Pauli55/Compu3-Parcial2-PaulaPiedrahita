// TODO Reto 1: reglas de validación con class-validator
//   - name: string, mínimo 3 caracteres
//   - code: string de 3 a 6 letras MAYÚSCULAS (ej. "SIS", "MED")
//   - credits: entero positivo

import { IsInt, IsOptional, IsString, IsUppercase, Matches, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateProgramDto {

    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @MinLength(3)
    @MaxLength(6)
    @Matches(/^[A-Z]+$/)
    code: string;

    @IsInt()
    credits: number;
}


