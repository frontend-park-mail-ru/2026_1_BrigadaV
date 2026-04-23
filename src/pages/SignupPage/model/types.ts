export type SignUpFields = {
    nickname: string;
    login: string;
    password: string;
    'password-repeat': string;
}

export type SignUpPayload = SignUpFields;
