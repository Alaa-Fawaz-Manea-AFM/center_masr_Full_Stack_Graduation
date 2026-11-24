import { Controller, Get, Query, Req } from '@nestjs/common';
import { TeacherDashboardService } from './teacher-dashboard.service';
import { TEACHER } from '../utils';
import RolesDecorator from '../decorator/roles.decorator';
import { CourseService } from '../course/course.service';
import GetAllCourseDto from '../course/dto/getAllCourseDto';

@Controller('teacher-dashboard')
export class TeacherDashboardController {
  constructor(
    private readonly teacherDashboardService: TeacherDashboardService,
    private readonly CourseService: CourseService,
  ) {}

  @RolesDecorator(TEACHER)
  @Get('courses')
  findAllCourses(@Query('') classRoom: GetAllCourseDto, @Req() req) {
    return this.CourseService.findAll(req.user.profileId, classRoom.classRoom!);
  }
  @RolesDecorator(TEACHER)
  @Get('students')
  findAllStudents(@Req() req) {
    return this.teacherDashboardService.findAllStudents(req.user.profileId);
  }
}
