import { IsEnum, IsOptional, IsString } from 'class-validator';
import QueryPageDto from '../../validators/queryPageDto';
import { RoleTeacherAndCenterDto } from '../../validators/roles.dto';

export class GetAllUsersDto extends QueryPageDto {
  @IsEnum(RoleTeacherAndCenterDto)
  role!: RoleTeacherAndCenterDto;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  educationalStage?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  studyMaterial?: string;

  @IsOptional()
  @IsString()
  classRoom?: string;
}
