import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TodoModel } from 'src/todo/entities/todo.model';

@ObjectType()
@Entity()
export class Users {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 100 })
  name: string;

  @Field()
  @Column({ length: 100, unique: true })
  email: string;

  // Password DB uchun, GraphQL'da ko‘rsatilmaydi:
  @Column({ length: 100 })
  password: string;

  @OneToMany(() => TodoModel, (todo) => todo.user)
  todos: TodoModel[];

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }
}
