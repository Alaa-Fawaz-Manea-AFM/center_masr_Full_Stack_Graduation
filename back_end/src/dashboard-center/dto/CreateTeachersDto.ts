import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import BaseDataUserDto from '../../validators/baseDataUser.dto';
import { TeacherDto } from '../../validators/teacher.dto';

class baseDataUser extends OmitType(BaseDataUserDto, [
  'password',
  'email',
  'role',
]) {}

export class CreateTeachersDto extends IntersectionType(
  TeacherDto,
  baseDataUser,
) {}
