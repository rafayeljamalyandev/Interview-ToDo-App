import { Controller, Get, Param, Post, Body, Put } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../core/dtos';
import { AuthorUseCases } from '../use-cases/author/author.use-case';

@Controller('api/author')
export class UserController {
  constructor(private authorUseCases: AuthorUseCases) {}

  @Get()
  async getAll() {
    return this.authorUseCases.getAllAuthors();
  }

  @Get(':id')
  async getById(@Param('id') id: any) {
    return this.authorUseCases.getAuthorById(id);
  }

  @Post()
  createAuthor(@Body() authorDto: CreateUserDto) {
    return this.authorUseCases.createAuthor(authorDto);
  }

  @Put(':id')
  updateAuthor(
    @Param('id') authorId: string,
    @Body() updateAuthorDto: UpdateUserDto,
  ) {
    return this.authorUseCases.updateAuthor(authorId, updateAuthorDto);
  }
}
