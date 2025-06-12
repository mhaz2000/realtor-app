export type LoginRequest = {
    username: string;
    password: string;
}

export type LoginResult = {
    access_token: string
}