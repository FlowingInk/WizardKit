import { JsonMap, parse } from '@iarna/toml';
import { load } from 'js-yaml';
import { convert } from 'xmlbuilder2';

export class MultiFormatParser {
    public static JSONParser(JSONString: string): object {
        return JSON.parse(JSONString);
    }

    public static TOMLParser(TMOLString: string): JsonMap {
        return parse(TMOLString);
    }

    public static YAMLParser(YAMLString: string): unknown {
        return load(YAMLString);
    }

    public static XMLParser(XMLString: string) {
        return convert(XMLString, { format: 'object' });
    }
}
