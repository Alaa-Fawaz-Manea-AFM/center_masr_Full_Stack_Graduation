import { IsUUID } from 'class-validator';
import QueryPageDto from '../../validators/queryPageDto';

export class GetAllChatIdDto extends QueryPageDto {
  @IsUUID()
  senderId!: string;

  @IsUUID()
  receiverId!: string;
}
