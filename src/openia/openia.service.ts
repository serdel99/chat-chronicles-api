import { ChatOpenAI } from '@langchain/openai';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { promptInitTemplate, promtResponseTemplate, initJson, responseJson } from './definitions'

@Injectable()
export class OpeniaService {

    private llm = new ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0.7,
    })


    async generateStoryInit({ hero, context, enemy }) {
        // const response = await promptInitTemplate.pipe(this.llm.withStructuredOutput(initJson)).invoke({ hero, enemy, context })
        // return response

        return {
            "action": "¿Qué acción tomará el Wizard?",
            "options": [
                "Atacar al ninja con un hechizo poderoso",
                "Desplazarse sigilosamente para evadir el ataque",
                "Invocar un escudo mágico para protegerse",
                "Negociar con el ninja para evitar el combate"
            ],
            "heroHealt": 100,
            "enemyHealt": 100,
            "heroName": "Juan Pedro",
            "enemyName": "Evil Juan",
            "nextHistory": "En las ruinas de un antiguo templo, un **Wizard** se encuentra en medio de un oscuro ritual. Las sombras parecen cobrar vida, danzando alrededor de él mientras invoca poderosas fuerzas arcanas. Sin embargo, una presencia amenazante se acerca, un **ninja** de movimientos furtivos y letales. Sus ojos brillan con una determinación fría mientras se prepara para atacar, buscando interrumpir el ritual y reclamar la magia para sí mismo.\n\nLos vientos susurran secretos de poder mientras el Wizard se enfrenta a su adversario. La atmósfera se carga de electricidad y tensión; el tiempo parece detenerse. Ahora, el destino de su magia y su vida pende de un hilo. ¿Deberá enfrentarse al ninja de frente, usar su astucia para evadirlo, invocar un poderoso hechizo, o intentar negociar para salvarse?"
        }
    }

    async generateNextHistory({
        story, heroName, enemyName, enemyHealt, heroHealt, selectedOption }: {
            story: string,
            heroName: string,
            enemyName: string,
            enemyHealt: number,
            heroHealt: number,
            selectedOption: string
        }) {
        // const response = await promtResponseTemplate.pipe(
        //     this.llm.withStructuredOutput(responseJson)
        // ).invoke({
        //     story,
        //     heroName,
        //     enemyName,
        //     enemyHealt,
        //     heroHealt,
        //     selectedOption
        // })
        // return response

        return {
            "action": "¿Qué acción tomará el Wizard?",
            "options": [
                "Atacar al ninja con un hechizo poderoso",
                "Desplazarse sigilosamente para evadir el ataque",
                "Invocar un escudo mágico para protegerse",
                "Negociar con el ninja para evitar el combate"
            ],
            "heroHealt": 90,
            "enemyHealt": 30,
            "nextHistory": "En las ruinas de un antiguo templo, un **Wizard** se encuentra en medio de un oscuro ritual. Las sombras parecen cobrar vida, danzando alrededor de él mientras invoca poderosas fuerzas arcanas. Sin embargo, una presencia amenazante se acerca, un **ninja** de movimientos furtivos y letales. Sus ojos brillan con una determinación fría mientras se prepara para atacar, buscando interrumpir el ritual y reclamar la magia para sí mismo.\n\nLos vientos susurran secretos de poder mientras el Wizard se enfrenta a su adversario. La atmósfera se carga de electricidad y tensión; el tiempo parece detenerse. Ahora, el destino de su magia y su vida pende de un hilo. ¿Deberá enfrentarse al ninja de frente, usar su astucia para evadirlo, invocar un poderoso hechizo, o intentar negociar para salvarse?"
        }
    }



}
