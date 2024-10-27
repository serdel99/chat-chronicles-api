import { Controller, Post } from '@nestjs/common';

@Controller('story')
export class StoryController {

  @Post("/init")
  create(): string {
    return 'test';
  }
}
