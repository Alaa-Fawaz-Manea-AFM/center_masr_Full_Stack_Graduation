import { Module } from '@nestjs/common';
import { TeacherDashboardService } from './teacher-dashboard.service';
import { TeacherDashboardController } from './teacher-dashboard.controller';
import { CourseService } from '../course/course.service';

@Module({
  controllers: [TeacherDashboardController],
  providers: [TeacherDashboardService, CourseService],
})
export class TeacherDashboardModule {}
