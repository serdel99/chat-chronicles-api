import { Injectable, Logger } from '@nestjs/common';
import { OpeniaService } from 'src/openia/openia.service';
import { TwitchService } from 'src/twitch/twitch.service';
import { Characters } from './story.characters';
import { StoryRepository } from './story.repository';
import { Story, StoryAct } from './dto/story';
import { NotificationService } from 'src/notification/notification.service';
import { EndPollEvent } from 'src/twitch/events/end-poll-event';
import { User } from 'src/auth/types/user';
import { RewardRedemptionEvent } from 'src/twitch/events/reward-redemption';
import { Powerups } from "src/story/powerups/porwerups.definitions"

@Injectable()
export class StoryService {

    private logger = new Logger("StoryService")

    constructor(
        private openIA: OpeniaService,
        private storyRepository: StoryRepository,
        private twitchService: TwitchService,
        private notificationService: NotificationService
    ) {

    }

    async initStory({ hero, context, user }) {
        const enemys = Characters.filter((characters) => characters !== hero)

        const enemy = enemys[Math.floor(Math.random() * enemys.length)]

        const initStory = await this.openIA.generateStoryInit({
            hero,
            context,
            enemy: enemy
        });

        // await this.twitchService.subscribeEndPollEvent({ user });
        const poll = await this.twitchService.initPoll({
            user,
            question: initStory.action,
            options: initStory.options
        })

        const story: Story = {
            hero,
            hero_name: initStory.heroName,
            enemy: enemy,
            enemy_name: initStory.enemyName,
            user_id: user.sub
        }

        const storyAct: StoryAct = {
            type: "init_story",
            pollId: poll.id,
            data: {

                enemy_healt: initStory.enemyHealt,
                hero_healt: initStory.heroHealt,
                next_history: initStory.nextHistory,
                options: initStory.options,
                action: initStory.action
            }
        }

        const storyCreated = await this.storyRepository.saveInitStory(story, storyAct);
        return storyCreated
    }

    async genereateNextAct({ user, selectedOption, storyId }: { user: User, selectedOption: string, storyId: string }) {

        const story = await this.storyRepository.getStory(Number(storyId));

        const resume = story.story_acts.reduce((acc, storyAct) => { return acc.concat(" ", storyAct.data.next_history) }, "")

        const prevAct = story.story_acts[story.story_acts.length - 1]

        console.log(JSON.stringify({
            story: resume,
            enemyHealt: prevAct.data.enemy_healt,
            enemyName: story.enemy_name,
            heroHealt: prevAct.data.hero_healt,
            heroName: story.hero_name,
            selectedOption
        }))


        const nextAct = await this.openIA.generateNextHistory({
            story: resume,
            enemyHealt: prevAct.data.enemy_healt,
            enemyName: story.enemy_name,
            heroHealt: prevAct.data.hero_healt,
            heroName: story.hero_name,
            selectedOption
        })

        const isFinalAct = nextAct.heroHealt <= 0 || nextAct.enemyHealt <= 0

        let poll;

        if (!isFinalAct) {
            poll = await this.twitchService.initPoll({
                user,
                question: nextAct.action,
                options: nextAct.options
            })
        }

        const storyAct: StoryAct = {
            type: isFinalAct ? "final_act" : "next_act",
            pollId: poll?.id,
            data: {
                next_history: nextAct.nextHistory,
                options: nextAct.options,
                action: nextAct.action,
                hero_healt: nextAct.heroHealt,
                enemy_healt: nextAct.enemyHealt
            }
        }
        const savedAct = this.storyRepository.saveStoryAct(story.id, storyAct)
        return savedAct;

    }

    async sendPollResponse(pollResult: EndPollEvent) {
        try {
            this.notificationService.sendNotification(pollResult.event.broadcaster_user_id, pollResult.event)
        }
        catch (e) {
            this.logger.log(e)
        }
    }

    async sendPowerupRedemption(redemption: RewardRedemptionEvent) {
        try {
            this.logger.log(redemption)
            const type = Object.values(Powerups).reduce((acc, powerUp) => powerUp.title === redemption.event.reward.title ? powerUp.type : acc, "")
            const withTypeRemption = { ...redemption.event, type }
            this.notificationService.sendNotification(redemption.event.broadcaster_user_id, withTypeRemption)
        }
        catch (e) {
            this.logger.log(e)
        }
    }

}