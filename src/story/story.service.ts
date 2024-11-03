import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { OpeniaService } from 'src/openia/openia.service';
import { TwitchService } from 'src/twitch/twitch.service';
import { Characters } from './story.characters';
import { StoryRepository } from './story.repository';
import { Story, StoryAct } from './dto/story';
import { NotificationService } from 'src/notification/notification.service';
import { strict } from 'assert';
import { string } from 'zod';
import { CreatePollResponse } from 'src/twitch/dto/twitchApiReponses';
import { EndPollEvent } from 'src/twitch/events/end-poll-event';
import { User } from 'src/auth/types/user';


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
        const randomEnemy = Characters.filter((characters) => characters !== hero)[Math.floor(Math.random() * Characters.length - 1)]
        const initStory = await this.openIA.generateStoryInit({
            hero,
            context,
            enemy: randomEnemy
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
            enemy: randomEnemy,
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

        const resume = story.story_acts.reduce<string>((acc, storyAct) => { return acc.concat(" ", storyAct.data.next_history) }, "")

        const prevAct = story.story_acts[story.story_acts.length - 1]

        const nextAct = await this.openIA.generateNextHistory({
            story: resume,
            enemyHealt: prevAct.data.enemy_healt,
            enemyName: story.enemy_name,
            heroHealt: prevAct.data.enemy_healt,
            heroName: story.hero_name,
            selectedOption
        })

        const poll = await this.twitchService.initPoll({
            user,
            question: nextAct.action,
            options: nextAct.options
        })



        const storyAct: StoryAct = {
            type: "act",
            pollId: poll.id,
            data: {
                next_history: nextAct.next_history,
                options: nextAct.options,
                action: nextAct.action,
                hero_healt: 0,
                enemy_healt: 0
            }
        }
        const savedAct = this.storyRepository.saveStoryAct(story.id, storyAct)
        return savedAct;

    }

    async sendPollResponse(pollResult: EndPollEvent) {
        try {
            const story = await this.storyRepository.getStoryByPollId({ pollId: pollResult.id })
            this.notificationService.sendNotification(story.id.toString(), pollResult)
        }
        catch (e) {
            this.logger.log(e)
        }
    }

}