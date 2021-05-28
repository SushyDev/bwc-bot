export declare interface EmbedContent {
    title: string;
    description: string;
    color?: string | number;
    thumbnail?: string;
    fields?: object[];
    footer?: string;
}

export declare interface BotConfig {
    presence: {
        status: string;
        activity: {
            name: string;
            type: string;
        };
    };
    prefix: string;
}
