'use strict';

import { ActionFlow } from '../ActionFlow';

export abstract class BaseAction {
    abstract type: string;
    abstract readonly params: object;

    public constructor() {}

    abstract execute(...args:any[]): Promise<any> | any;
}
