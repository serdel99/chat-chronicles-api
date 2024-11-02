export type EndPollEvent = {
    id: string
    broadcaster_user_id: string
    title: string
    status: "completed"
    choices: {
        id: string,
        title: string,
        bits_votes: number,
        votes: number
    }[]
}