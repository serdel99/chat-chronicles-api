export type CreatePollBody = {
    broadcaster_id: string
    title: string,
    choices: { title: string }[]
    duration: number

}