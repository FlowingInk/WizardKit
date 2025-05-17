import { BaseAction } from './baseAction';
import { AutoSerializer } from '../util/AutoSerializer';
import { SupportedTypes } from '../type';

import { writeFileSync } from 'fs';
import { extname } from 'path';
import { merge } from 'lodash';


export class WriteAction extends BaseAction {
    public type: string = 'write';
    private readonly writeObject: Record<string, any>;
    private readonly filePath: string;
    private readonly fileExtension: SupportedTypes;

    constructor(path: string, writeObject: Record<string, any>) {
        super();
        this.filePath = path;
        this.writeObject = writeObject;
        this.fileExtension = extname(path) as SupportedTypes;
    }

    execute(writeContent: Record<string, any> = {}) {
        const tempObject = merge({}, this.writeObject, writeContent);
        let serializedData: string = AutoSerializer.serializer(
            this.fileExtension,
            tempObject,
        );

        writeFileSync(this.filePath, serializedData, 'utf8');
    }
}
