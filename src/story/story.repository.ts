import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { Story, StoryAct } from "./dto/story";


@Injectable()
export class StoryRepository {

    constructor(private database: DatabaseService) {
    }

    async saveInitStory(story: Story, storyInitAct: StoryAct) {
        const storyCreated = await this.database.story.create({
            data: {
                user_id: story.user_id,
                enemy: story.enemy,
                hero: story.hero,
                enemy_name: story.enemy_name,
                hero_name: story.hero_name,
                story_acts: {
                    create: {
                        type: storyInitAct.type,
                        data: storyInitAct.data
                    }
                }
            },
            include: {
                story_acts: true
            }
        })
        return storyCreated
    }

}