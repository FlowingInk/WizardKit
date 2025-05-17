import { readFileSync } from 'fs';
import { BaseAction } from './baseAction';


export class LoadFileAction extends BaseAction {
    public type: string = 'loadFile';
    private readonly filePath: string;

    constructor(path: string) {
        super();
        this.filePath = path;
    }

    public async execute() {
        return readFileSync(this.filePath, 'utf8');
    }
}
