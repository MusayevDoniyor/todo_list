import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Users } from 'src/auth/entities/user.entity';
import { TodoService } from 'src/todo/todo.service';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private todoService: TodoService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const user = req.user as Users;
    const todoId = ctx.getArgs().id ?? ctx.getArgs().updateTodoInput.id;

    const todo = await this.todoService.findById(todoId);

    if (todo.user.id !== user.id) {
      throw new ForbiddenException('Access denied: not your todo');
    }

    return true;
  }
}
