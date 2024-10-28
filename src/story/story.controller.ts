import { Body, Controller, Post, Req, UseGuards, InternalServerErrorException, Logger } from '@nestjs/common';

import { CreateStoryDto } from './dto/createStoryRequest';
import { AuthGuard } from 'src/auth/auth.guard';
import { StoryService } from './story.service';

@Controller('story')
export class StoryController {

  constructor(private storyService: StoryService) { }

  @Post("/init")
  @UseGuards(AuthGuard)
  async create(@Body() createDto: CreateStoryDto, @Req() req): Promise<object> {
    try {
      const response = await this.storyService.initStory({
        hero: createDto.hero,
        context: createDto.context,
        userId: req.user.sub
      })
      return response
    } catch (e) {
      Logger.error(e.message, "StoryController - Init")
      throw new InternalServerErrorException();
    }
  }
}
