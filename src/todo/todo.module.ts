import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoResolver } from './todo.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModel } from './entities/todo.model';
import { Users } from 'src/auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoModel, Users])],
  providers: [TodoResolver, TodoService],
})
export class TodoModule {}
