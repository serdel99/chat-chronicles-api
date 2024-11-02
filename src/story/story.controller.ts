import { Body, Controller, Post, Req, UseGuards, InternalServerErrorException, Logger, BadRequestException, Param, Sse, Query } from '@nestjs/common';

import { AddResponseDto, CreateStoryDto } from './dto/requestBody';
import { AuthGuard } from 'src/auth/auth.guard';
import { StoryService } from './story.service';
import { interval, map, Observable } from 'rxjs';
import { NotificationService } from 'src/notification/notification.service';
import { query, response } from 'express';

@Controller('story')
export class StoryController {

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
      Logger.error(e.message, "StoryController - Init")
      throw new InternalServerErrorException();
    }
  }

  // @Post(":id/response/poll")
  // @UseGuards(AuthGuard)
  // async responseWithPoll(@Req() req, @Param("id") storyId, @Body() body: AddResponseDto) {
  //   try {
  //     const response = await this.storyService.responseWithPoll({
  //       user: req.user,
  //       storyId,
  //       response: body.response
  //     });
  //     return response
  //   } catch (e) {
  //     throw new InternalServerErrorException();
  //   }
  // }

  @Sse("storyEvents")
  storyEvents(@Query("storyId") id): Observable<any> {

    Logger.log("SSe conected", { storyid: id })
    this.notificationService.addStory(id)

    response.on("close", () => {
      this.notificationService.removeStory(id)
    })

    return this.notificationService.events(id)

  }

}
