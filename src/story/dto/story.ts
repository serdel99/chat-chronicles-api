
export type StoryAct = {
    type: string,
    pollId: string,
    data: {
        hero_healt: number
        enemy_healt: number,
        next_history: string
        options: string[]
        action: string,
    }
}

export type Story = {
    id?: string;
    user_id: string;
    enemy: string
    hero: string
    hero_name: string,
    enemy_name: string
    story?: StoryAct[]
}   