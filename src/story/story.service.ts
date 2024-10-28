import { Injectable, Logger } from '@nestjs/common';
import { OpeniaService } from 'src/openia/openia.service';
import { TwitchService } from 'src/twitch/twitch.service';
import { Characters } from './story.characters';
import { StoryRepository } from './story.repository';
import { Story, StoryAct } from './dto/story';

@Injectable()
export class StoryService {


    constructor(
        private openIA: OpeniaService,
        private storyRepository: StoryRepository) {

    }


    async initStory({ hero, context, userId }) {
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
            user_id: userId
        }

        const storyAct: StoryAct = {
            type: "init_story",
            data: {
                enemy_healt: initStory.enemyHealt,
                hero_healt: initStory.heroHealt,
                next_history: initStory.nextHistory,
                options: initStory.options
            }
        }

        const storyCreated = await this.storyRepository.saveInitStory(story, storyAct);

        return storyCreated

    }


}
