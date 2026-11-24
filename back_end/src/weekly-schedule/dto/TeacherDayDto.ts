import { Transform } from 'class-transformer';
import { IsString, Matches, IsUUID, IsIn, IsDateString } from 'class-validator';
import { weekDays } from '../../utils';
import { studyMaterialSet } from '../../utils/constant';
import { IsInSet, Trim } from '../../validators/is-in-set.validator';

export class TeacherDayDto {
  @Transform(({ value }) => value?.toLowerCase())
  @IsString()
  @IsIn(weekDays, { message: 'Invalid day' })
  day!: string;

  @IsDateString({}, { message: 'time must be a valid ISO date' })
  time!: string;

  @IsUUID()
  teacherByCenterId!: string;
}
