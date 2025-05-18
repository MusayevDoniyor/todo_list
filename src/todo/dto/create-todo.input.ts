import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTodoInput {
  @Field(() => String, { description: 'Title for Todo' })
  title: string;
}
