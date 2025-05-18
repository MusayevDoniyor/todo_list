import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from 'src/auth/entities/user.entity';

@ObjectType()
@Entity()
export class TodoModel {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 200 })
  title: string;

  @Field()
  @Column({ default: false })
  completed: boolean;

  @Field(() => Users)
  @ManyToOne(() => Users, (user) => user.todos, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Field()
  @CreateDateColumn()
  created_at: Date;
}
