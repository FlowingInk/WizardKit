import { SupportedTypes } from '../type';
import { MultiFormatParser } from './MultiFormatParser';

import { InvalidFileExtensionError } from '../exceptions/invalidFileExtensionError';

export class AutoParser {
    public static parse(fileExtension: SupportedTypes, fileContent: string) {
        switch (fileExtension) {
            case 'json':
                return MultiFormatParser.JSONParser(fileContent);
            case 'yaml':
                return MultiFormatParser.YAMLParser(fileContent);
            case 'yml':
                return MultiFormatParser.YAMLParser(fileContent);
            case 'toml':
                return MultiFormatParser.TOMLParser(fileContent);
            case 'xml':
                return MultiFormatParser.XMLParser(fileContent);
            default:
                throw new InvalidFileExtensionError(
                    'json,xml,yaml,toml',
                    fileExtension,
                );
        }
    }
}
