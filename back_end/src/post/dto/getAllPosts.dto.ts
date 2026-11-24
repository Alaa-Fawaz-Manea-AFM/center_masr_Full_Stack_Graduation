import { IsEnum, IsUUID } from 'class-validator';
import { roleTeacherAndCenter } from '../../utils/constant';
import { Trim } from '../../validators/is-in-set.validator';
import QueryPageDto from '../../validators/queryPageDto';
import { RoleTeacherAndCenterDto } from '../../validators/roles.dto';

class GetAllPostsDto {
  @IsUUID()
  userId!: string;

  @Trim()
  @IsEnum(roleTeacherAndCenter)
  role!: RoleTeacherAndCenterDto;
}

export default GetAllPostsDto;
