import { SupportedTypes } from '../type';
import { MultiFormatSerializer } from './MultiFormatSerializer';
import { InvalidFileExtensionError } from '../exceptions/invalidFileExtensionError';

export class AutoSerializer {
    public static serializer(
        fileExtension: SupportedTypes,
        fileContent: Record<string, any>,
    ) {
        switch (fileExtension) {
            case 'json':
                return MultiFormatSerializer.JSONSerializer(fileContent);
            case 'xml':
                return MultiFormatSerializer.XMLSerializer(fileContent);
            case 'yml':
                return MultiFormatSerializer.YAMLSerializer(fileContent);
            case 'yaml':
                return MultiFormatSerializer.YAMLSerializer(fileContent);
            case 'toml':
                return MultiFormatSerializer.TOMLSerializer(fileContent);
            default:
                throw new InvalidFileExtensionError(
                    'json,xml,yaml,toml',
                    fileExtension,
                );
        }
    }
}
