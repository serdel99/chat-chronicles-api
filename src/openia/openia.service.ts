import { ChatOpenAI } from '@langchain/openai';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { promptInitTemplate, initJson } from './definitions'

@Injectable()
export class OpeniaService {

    private llm = new ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0.7,
    })


    async generateStoryInit({ hero, context, enemy }) {
        const response = await promptInitTemplate.pipe(this.llm.withStructuredOutput(initJson)).invoke({ hero, enemy, context })
        return response
    }



}
