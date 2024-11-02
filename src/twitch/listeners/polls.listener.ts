import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { EndPollEvent } from "../events/end-poll-event";
import { NotificationService } from "src/notification/notification.service";
import { StoryService } from "src/story/story.service";

@Injectable()
export class PollListener {

    constructor(private storyService: StoryService) { }

    @OnEvent("channel.poll.end")
    onPollEnd(event: EndPollEvent) {
        this.storyService.sendResponse(event)
        // Logger.log(event.choices)
    }
}