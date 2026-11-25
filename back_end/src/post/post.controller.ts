import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import GetAllPostsDto from './dto/getAllPosts.dto';
import { RequestType } from '../types/type';
import { CreatePostDto } from './dto/createPost.dto';
import { CENTER, TEACHER } from '../utils';
import { UpdatePostDto } from './dto/updatePost.dto';
import RolesDecorator from '../decorator/roles.decorator';
import QueryPageDto from '../validators/queryPageDto';
import AuthDecorator from 'src/decorator/auth.decorator';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @AuthDecorator()
  @Get()
  getAllPosts(
    @Query('page') page: QueryPageDto,
    @Query() getAllPostsDto: GetAllPostsDto,
    @Req() req,
  ) {
    return this.postService.getAllPosts(getAllPostsDto, req?.user, page.page);
  }

  @AuthDecorator()
  @Get(':postId')
  getPost(@Param('postId', ParseUUIDPipe) postId: string, @Req() req: any) {
    return this.postService.getPost(postId, req?.user?.userId);
  }

  @RolesDecorator(TEACHER, CENTER)
  @Post()
  createPost(@Body() createPostDto: CreatePostDto, @Req() req) {
    const { userId, role } = req.user as RequestType;

    return this.postService.createPost(createPostDto, userId, role);
  }

  @RolesDecorator(TEACHER, CENTER)
  @Patch(':postId')
  updatePost(
    @Param('postId', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: any,
  ) {
    return this.postService.updatePost(id, req.user.userId, updatePostDto);
  }

  @RolesDecorator(TEACHER, CENTER)
  @Delete(':postId')
  deletePost(@Param('postId', ParseUUIDPipe) postId: string, @Req() req) {
    return this.postService.deletePost(postId, req.user.userId);
  }
}
