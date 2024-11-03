

import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { StoryService } from "src/story/story.service";
import { RewardRedemptionEvent } from "../events/reward-redemption";

@Injectable()
export class RewardRedemptionListener {

    constructor(private storyService: StoryService) { }

    @OnEvent("channel.channel_points_custom_reward_redemption.add")
    onRewardRedemption(event: RewardRedemptionEvent) {
        this.storyService.sendPowerupRedemption(event);
    }
}