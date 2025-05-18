import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { TodoModel } from './entities/todo.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/auth/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoModel)
    private todoRepository: Repository<TodoModel>,
  ) {}

  async create(createTodoInput: CreateTodoInput, user: Users) {
    const todo = this.todoRepository.create({
      ...createTodoInput,
      user: { id: user.id },
    });

    return await this.todoRepository.save(todo);
  }

  async findAll() {
    return await this.todoRepository.find();
  }

  findAllByUser(userId: string) {
    return this.todoRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async update(id: string, updateTodoInput: UpdateTodoInput) {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    Object.assign(todo, updateTodoInput);
    return await this.todoRepository.save(todo);
  }

  async remove(id: string) {
    const todo = await this.todoRepository.findOneBy({ id });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    await this.todoRepository.remove(todo);

    return {
      message: 'Todo deleted successfully',
      todo,
    };
  }

  async toggle(id: string): Promise<TodoModel> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) throw new NotFoundException('Todo not found');
    todo.completed = !todo.completed;
    return this.todoRepository.save(todo);
  }

  async findById(id: string): Promise<TodoModel> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) throw new NotFoundException('Todo not found');

    return todo;
  }
}
