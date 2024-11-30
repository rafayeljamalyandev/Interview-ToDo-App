import { Controller, Get, Param, Post, Body, Put } from '@nestjs/common';
import { GenreUseCases } from '../use-cases/genre/genre.use-case';

@Controller('api/genre')
export class TodoController {
  constructor(private genreUseCases: GenreUseCases) {}

  @Get()
  async getAll() {
    return this.genreUseCases.getAllGenres();
  }

  @Get(':id')
  async getById(@Param('id') id: any) {
    return this.genreUseCases.getGenreById(id);
  }

}
