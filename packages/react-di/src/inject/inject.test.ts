import { PROPERTY_PREFIX, PARAMETER_PREFIX } from "./../constants";
import "reflect-metadata";
import { Inject } from "./inject.decorator";

const keys = {
  property: Symbol("property"),
  parameter: Symbol("parameter"),
};

describe("@Inject", () => {
  it("should add metadata to constructor about injection", () => {
    class Test {
      @Inject(keys.property) private property!: string;

      constructor(@Inject(keys.parameter) private parameter: string) {}
    }

    expect(Reflect.getMetadataKeys(Test)).toEqual(
      expect.arrayContaining([`${PROPERTY_PREFIX}property`, `${PARAMETER_PREFIX}0`])
    );

    expect(Reflect.getMetadata(`${PROPERTY_PREFIX}property`, Test)).toBe(keys.property);
    expect(Reflect.getMetadata(`${PARAMETER_PREFIX}0`, Test)).toBe(keys.parameter);
  });

  it("should throw exception, if name of injection is not provided", () => {
    const createInvalid = () => {
      class Test {
        @Inject(undefined as any) private property!: string;

        constructor(@Inject(undefined as any) private parameter: string) {}
      }
    };
    expect(createInvalid).toThrow();
  });
});
