type LikeURL = {
    toString(): string;
};
declare class ContentElement {
    get parent(): ContentElement | undefined;
    get childs(): ContentElement[] | undefined;
}
export declare class RoadmapFile {
    private url;
    private markdown;
    private constructor();
    indexListOfContent(): Promise<ContentElement[]>;
    infoTasks(): Promise<{
        ref: string;
        title: string;
        status: string;
        expectedCompletionDate: string;
        expectedReleaseDate: string;
    }[]>;
    listTasks(): Promise<{
        ref?: string | undefined;
        title: string;
        status?: string | undefined;
        expectedCompletionDate?: string | undefined;
        expectedReleaseDate?: string | undefined;
    }[]>;
    static fromFile(location: LikeURL, inputBuffer?: Uint8Array): Promise<RoadmapFile>;
}
export {};
