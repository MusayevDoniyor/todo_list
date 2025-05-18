import { Field, ObjectType } from '@nestjs/graphql';
import { TodoModel } from '../entities/todo.model';

@ObjectType()
export class DeleteTodoResponse {
  @Field()
  id: string;

  @Field()
  message: string;

  @Field(() => TodoModel)
  todo: TodoModel;
}
