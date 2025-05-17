import { BaseAction } from './baseAction';
import { SupportedTypes } from '../type';
import { AutoSerializer } from '../util/AutoSerializer';

import { extname } from 'path';
import { writeFileSync, readFileSync } from 'fs';
import { merge } from 'lodash';

export class AppendFileAction extends BaseAction {
    private readonly filePath: string;
    private readonly appendObject: Record<string, any>;
    private readonly fileExtension: SupportedTypes;
    public type: string = 'appendFile';

    constructor(path: string, appendObject: Record<string, any>) {
        super();
        this.filePath = path;
        this.appendObject = appendObject;
        this.fileExtension = extname(path) as SupportedTypes;
    }

    public execute(): void {
        const fileContent: string = readFileSync(this.filePath, 'utf-8');
        const mergeObject: Record<string, any> = merge({}, fileContent, this.appendObject);
        writeFileSync(this.filePath, AutoSerializer.serializer(this.fileExtension, mergeObject), 'utf-8');
    }
}
