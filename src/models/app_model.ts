export interface ApiResponse<T> {
    data: T;
    help: string;
    message: string;
    state: number;
    success: boolean;
    type: number;
}

export interface LoginResultModel {
    token: string;
    user: User;
}

export interface User {
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    authorities: string[];
    city: string;
    credentialsNonExpired: boolean;
    email: string;
    enabled: boolean;
    id: number;
    job: string;
    loginNumber: string;
    loginTime: string;
    nickName: string;
    openAiFlag: boolean;
    openAiTokens: number;
    phone: string;
    picture: string;
    roles: string[];
    status: number;
    type: number;
    username: string;
    vip: number;
    wallet: number;
}
