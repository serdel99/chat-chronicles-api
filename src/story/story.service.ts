import { Injectable, Logger } from '@nestjs/common';
import { OpeniaService } from 'src/openia/openia.service';
import { TwitchService } from 'src/twitch/twitch.service';
import { Characters } from './story.characters';
import { StoryRepository } from './story.repository';
import { Story, StoryAct } from './dto/story';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class StoryService {


    constructor(
        private openIA: OpeniaService,
        private storyRepository: StoryRepository,
        private twitchService: TwitchService,
        private notificationService: NotificationService
    ) {

    }

    async initStory({ hero, context, user }) {
        const randomEnemy = Characters.filter((characters) => characters !== hero)[Math.floor(Math.random() * Characters.length - 1)]
        const initStory = await this.openIA.generateStoryInit({
            hero,
            context,
            enemy: randomEnemy
        });

        const story: Story = {
            hero,
            hero_name: initStory.heroName,
            enemy: randomEnemy,
            enemy_name: initStory.enemyName,
            user_id: user.sub
        }

        const storyAct: StoryAct = {
            type: "init_story",
            data: {
                enemy_healt: initStory.enemyHealt,
                hero_healt: initStory.heroHealt,
                next_history: initStory.nextHistory,
                options: initStory.options,
                action: initStory.action
            }
        }

        await this.twitchService.subscribeEndPollEvent({ user });
        await this.twitchService.initPoll({
            user,
            question: initStory.action,
            options: initStory.options
        })
        const storyCreated = await this.storyRepository.saveInitStory(story, storyAct);
        return storyCreated
    }


    async sendResponse(event) {
        this.notificationService.sendNotification("1", { test: "notification" })
    }



}