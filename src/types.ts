export type user = {
    authUserId: number,
    token: string // Tokens are not invalidated so we can associate one token to a user
    email: string,
    nameFirst: string,
    nameLast: string,
    password: string,
};

export interface data {
    users: user[],
}
