import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { TodoModel } from './entities/todo.model';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { UseGuards } from '@nestjs/common';
import { Users } from 'src/auth/entities/user.entity';
import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { OwnerGuard } from 'src/common/guards/owner.guard';
import { DeleteTodoResponse } from './response/delete-todo.response';

@Resolver(() => TodoModel)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [TodoModel])
  myTodos(@CurrentUser() user: Users) {
    return this.todoService.findAllByUser(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TodoModel)
  createTodo(
    @Args('createTodoInput') createTodoInput: CreateTodoInput,
    @CurrentUser() user: Users,
  ) {
    return this.todoService.create(createTodoInput, user);
  }

  @Query(() => [TodoModel], { name: 'todos' })
  findAll() {
    return this.todoService.findAll();
  }

  @UseGuards(GqlAuthGuard, OwnerGuard)
  @Mutation(() => TodoModel)
  updateTodo(@Args('updateTodoInput') updateTodoInput: UpdateTodoInput) {
    return this.todoService.update(updateTodoInput.id, updateTodoInput);
  }

  @UseGuards(GqlAuthGuard, OwnerGuard)
  @Mutation(() => DeleteTodoResponse)
  deleteTodo(@Args('id', { type: () => String }) id: string) {
    return this.todoService.remove(id);
  }

  @UseGuards(GqlAuthGuard, OwnerGuard)
  @Mutation(() => TodoModel)
  toggleTodo(@Args('id', { type: () => String }) id: string) {
    return this.todoService.toggle(id);
  }
}
