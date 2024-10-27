export type GetAppTokenDto = {
    access_token: string,
    expires_in: number
}

export type GetUserAccessTokenDto = {
    access_token: string,
    expires_in: number,
    id_token: string,
    refresh_token: string,
    scope: string[],
    token_type: string
}

export type User = {
    "id": string,
    "login": string,
    "display_name": string
    "profile_image_url": string,
}