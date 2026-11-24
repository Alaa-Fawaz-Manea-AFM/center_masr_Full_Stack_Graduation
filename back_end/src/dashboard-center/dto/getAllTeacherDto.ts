import { IsString } from 'class-validator';
import { Trim } from '../../validators/is-in-set.validator';

export class GetAllDashboardCenterTeacherDto {
  @Trim()
  @IsString()
  name?: string;

  @Trim()
  @IsString()
  educationalStage?: string;
}
