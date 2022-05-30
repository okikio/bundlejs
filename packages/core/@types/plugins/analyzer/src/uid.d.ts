export declare class Id {
    private _id;
    private _href;
    constructor(id: string);
    get id(): Id["_id"];
    get href(): Id["_href"];
    toString(): string;
}
export declare function generateUniqueId(name: string): Id;
