import { PARAMETER_PREFIX, PROPERTY_PREFIX } from "../constants";
import { InjectIdentificator } from "../types";

export function Inject(name: InjectIdentificator) {
  return function (target: any, propertyKey: string, parameterIndex?: number) {
    if (name === undefined) {
      throw new Error(`Undefined identifier for ${target.name}. Please, specify one`);
    }
    const isParameter = typeof parameterIndex === "number";
    const prefix = isParameter ? PARAMETER_PREFIX : PROPERTY_PREFIX;
    const key = isParameter ? parameterIndex : propertyKey;
    const constructor = isParameter ? target : target.constructor;

    Reflect.defineMetadata(`${prefix}${key}`, name, constructor);
  };
}
