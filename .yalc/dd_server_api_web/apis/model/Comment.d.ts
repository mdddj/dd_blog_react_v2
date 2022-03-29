import { BlogData } from "./result/BlogPushNewResultData";
export interface Comment {
    id: number;
    email: string;
    website: string;
    content: string;
    findKey: string;
    name: string;
    code: null;
    parentComment: null;
    type: string;
    blog: BlogData | undefined;
    childComment: null;
    createDate: number;
    avatarUrl: string | undefined;
    likeUsers: null;
}
