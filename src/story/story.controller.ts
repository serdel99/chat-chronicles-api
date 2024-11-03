import { Body, Controller, Post, Req, UseGuards, InternalServerErrorException, Logger, BadRequestException, Param, Sse, Query } from '@nestjs/common';

import { AddResponseDto, CreateStoryDto } from './dto/requestBody';
import { AuthGuard } from 'src/auth/auth.guard';
import { StoryService } from './story.service';
import { interval, map, Observable } from 'rxjs';
import { NotificationService } from 'src/notification/notification.service';
import { query, response } from 'express';
import axios from 'axios';

@Controller('story')
export class StoryController {

  private logger = new Logger("StoryController")

  constructor(
    private storyService: StoryService,
    private notificationService: NotificationService
  ) { }

  @Post("/init")
  @UseGuards(AuthGuard)
  async create(@Body() createDto: CreateStoryDto, @Req() req): Promise<object> {
    try {

      if (!createDto.hero) {
        throw new BadRequestException()
      }
      const response = await this.storyService.initStory({
        hero: createDto.hero,
        context: createDto.context,
        user: req.user
      })
      return response
    } catch (e) {
      this.logger.error(e, "StoryController - Init")
      throw new InternalServerErrorException();
    }
  }

  @Post(":id/generate")
  @UseGuards(AuthGuard)
  async responseWithPoll(@Req() req, @Param("id") storyId, @Body() body: AddResponseDto) {
    try {
      const response = await this.storyService.genereateNextAct({
        user: req.user,
        storyId,
        selectedOption: body.selectedOption
      });
      return response
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  @Sse("storyEvents")
  storyEvents(@Query("storyId") id): Observable<any> {

    this.logger.log(`SSE conected storyId:${id}`,)

    this.notificationService.addStory(id)

    response.on("close", () => {
      this.notificationService.removeStory(id)
    })

    return this.notificationService.events(id)

  }

}
