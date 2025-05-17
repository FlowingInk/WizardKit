import { create } from 'xmlbuilder2';
import yaml from 'js-yaml';
import { JsonMap, stringify } from '@iarna/toml';

export class MultiFormatSerializer {
    //https://oozcitak.github.io/xmlbuilder2/object-conversion.html
    public static XMLSerializer(XMLObject: object): string {
        const doc = create(XMLObject);
        return doc.end({ prettyPrint: true });
    }

    public static JSONSerializer(JSONObject: object): string {
        return JSON.stringify(JSONObject);
    }

    public static YAMLSerializer(YAMLObject: object): string {
        return yaml.dump(YAMLObject);
    }

    public static TOMLSerializer(TOMLObject: object): string {
        return stringify(<JsonMap>TOMLObject);
    }
}
