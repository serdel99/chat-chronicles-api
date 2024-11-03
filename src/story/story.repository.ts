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
                        pollId: storyInitAct.pollId,
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

    async saveStoryAct(storyId, storyAct: StoryAct) {

        const act = await this.database.storyAct.create({
            data: {
                pollId: storyAct.pollId,
                data: storyAct.data,
                type: storyAct.type,
                story_id: storyId
            }
        })

        return act;
    }

    async getStoryByPollId({ pollId }: { pollId?: string }) {
        const act = await this.database.story.findFirstOrThrow({
            include: {
                story_acts: true
            },
            where: {
                story_acts: {
                    some: {
                        pollId
                    }
                }
            },
        })
        return act
    }

    async getStory(id: number) {
        const story = await this.database.story.findFirst({
            where: {
                id
            },
            include: { story_acts: true }
        })
        return story
    }
}