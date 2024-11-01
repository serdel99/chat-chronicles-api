
import { ChatPromptTemplate } from "@langchain/core/prompts"


import { z } from 'zod'


export const initJson = z.object({
    nextHistory: z.string().describe("El siguiente parrafo de la historia, maximo 150 palabras y utiliza saltos de linea para darle formato al texto"),
    options: z.array(z.string()).describe("Posibles elecciones del personaje principal"),
    heroName: z.string().describe("Nombre del heroe"),
    enemyName: z.string().describe("Nombre del enemigo debe ser generado"),
    heroHealt: z.number().describe("Puntos de saluda actual del heroe maximo 100 minimo 0"),
    enemyHealt: z.number().describe("Puntos de saluda actual del enemigo maximo 100 minimo 0"),
    action: z.string().describe("Pregunta de introduccion para las opciones dadas")
})

export const responseJson = z.object({
    nextHistory: z.string().describe("El siguiente parrafo de la historiam, utiliza saltos de linea, maximo 150 palabras y utiliza saltos de linea para darle formato al texto"),
    options: z.array(z.string()).describe("Posibles elecciones del personaje principal"),
    heroHealt: z.number().describe("Puntos de saluda actual del heroe maximo 100 minimo 0"),
    enemyHealt: z.number().describe("Puntos de saluda actual del enemigo maximo 100 minimo 0"),
    action: z.string().describe("Pregunta de introduccion para las opciones dadas")
})

export const promptInitTemplate = ChatPromptTemplate.fromMessages([
    ["system", "Esta es una batalla colaborativa generada por una audiencia en Twitch. Un heroe y un enemigo se enfrentan, cada uno tiene 100 puntos de salud que pueden subir o bajar dependiendo de las acciones,  A continuación, se presenta el primer párrafo de la historia. Después de cada sección, los espectadores votarán sobre cómo continuar. La historia debe ser coherente y creativa, y debe mantener un tono [épico/ciencia ficción/terror], adaptándose a las decisiones votadas, no debe tener mas de 7 actos"],
    ["human", `Genera la introduccion de la historia utilizando como base este contexto del usuario {context},
        el heroe sera un {hero} el enemigo sera un {enemy},
        genera 4 elecciones que tenga que tomar el personaje principal para continuar la historia,
        no hagas referencia a los puntos de salud explicitamente en la historia,
        No pongas en el parrafo explicitamente las opciones, es importante que muestres el texto en markdown utilizando headings, textos en bold, italic y blockquotes`
    ]
])

export const promtResponseTemplate = ChatPromptTemplate.fromMessages([
    ["system", "Esta es una batalla colaborativa generada por una audiencia en Twitch. Un heroe y un enemigo se enfrentan, cada uno tiene 100 puntos de salud que pueden subir o bajar dependiendo de las acciones,  A continuación, se presenta el primer párrafo de la historia. Después de cada sección, los espectadores votarán sobre cómo continuar. La historia debe ser coherente y creativa, y debe mantener un tono [épico/ciencia ficción/terror], adaptándose a las decisiones votadas, no debe tener mas de 7 actos"],
    ["human", `  La historia hasta ahora es: "{story}", 
                        El héroe {heroName} (salud: {heroHealt}, se enfrenta al enemigo {enemyName} (salud: {enemyHealt}.
                        Los espectadores han elegido: {selectedOption}.
                        Describe lo que sucede después ten encuenta la vida acutual del enemigo y del heroe, no debe tener mas de 150 palabras
                        calcula nuevamente la vida del heroe y el villano en base a las acciones que tomen la vida de alguno debe disminuir,
                        genera 4 elecciones que tenga que tomar el personaje principal para continuar la historia,
                        no hagas referencia a los puntos de salud explicitamente en la historia,
                        termina el parrafo con una pregunta de una accion proxima a realizar sin poner explicitamente las opciones, es importante que muestres el texto en markdown utilizando mucho textos en bold, italic y blockquotes, tambien incluye headings
        `
    ]
])

// const StoryInit = promptInitTemplate.pipe(StoryGenerator.withStructuredOutput(initJson))

// const StoryAddResponse = promtResponseTemplate.pipe(StoryGenerator.withStructuredOutput(responseJson))


// const mockInit = { "nextHistory": "En un mundo donde la ciencia y la magia coexisten en un delicado equilibrio, un samurái llamado Kaito se adentra en la oscura y opresiva ciudad de Aokigahara. Allí, un doctor obsesionado con la inmortalidad, conocido solo como el Dr. Hoshino, ha desatado una plaga que convierte a los ciudadanos en criaturas grotescas y desalmadas. Kaito, armado con su katana ancestral, sabe que debe detener al médico antes de que su locura consuma el mundo entero. En la penumbra de los callejones, se enfrenta a un dilema: ¿debería atacar directamente al Dr. Hoshino, intentar infiltrarse en su laboratorio, buscar aliados entre los sobrevivientes de la ciudad, o descubrir la fuente de su poder?", "options": ["Atacar directamente al Dr. Hoshino", "Infiltrarse en su laboratorio", "Buscar aliados entre los sobrevivientes", "Descubrir la fuente de su poder"], "heroName": "Kaito", "enemyName": "Dr. Hoshino", "heroHealt": 100, "enemyHealt": 100 }

// const mockNext = { "nextHistory": "Kaito, sintiendo la presión del tiempo y la urgencia de su misión, decide que la mejor forma de enfrentarse al Dr. Hoshino es infiltrarse en su laboratorio. Con pasos sigilosos, se adentra en las sombras de la ciudad, siguiendo las pistas que lo conducen a la instalación del médico. A medida que avanza, se encuentra con las horrendas criaturas que antes fueron humanos, ahora transformadas por la plaga. Con cada encuentro, Kaito se esfuerza por mantener su concentración, recordando el motivo de su lucha. Finalmente, llega a la entrada del laboratorio, una puerta de hierro custodiada por dos de los monstruos que una vez fueron ciudadanos. Con su katana en mano, sabe que debe actuar con rapidez y estrategia. ¿Debería intentar distraer a las criaturas para entrar sigilosamente, atacar a los guardianes antes de entrar, buscar un camino alternativo o utilizar su conocimiento de magia ancestral para crear una ilusión que confunda a los monstruos?", "options": ["Distraer a las criaturas para entrar sigilosamente", "Atacar a los guardianes antes de entrar", "Buscar un camino alternativo", "Utilizar magia ancestral para crear una ilusión"], "heroHealt": 100, "enemyHealt": 100 }


// module.exports = {
//     StoryInit,
//     StoryAddResponse
// }



// module.exports = {
//     StoryInit: { invoke: async () => mockInit },
//     StoryAddResponse: {
//         invoke: async () => mockNext
//     }
// }