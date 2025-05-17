'use strict';


export abstract class BaseAction {
    public abstract type: string;

    public constructor() {}

    public abstract execute(...args:any[]): Promise<any> | any;
}
