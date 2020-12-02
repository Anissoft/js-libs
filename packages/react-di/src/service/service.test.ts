import { DEPENDENCIES, SERVICE } from "./../constants";
import "reflect-metadata";
import { Service } from "./service.decorator";
import { Inject } from "../inject/inject.decorator";

const keys = {
  property: Symbol("property"),
  parameter: Symbol("parameter"),
};

describe("@Service", () => {
  it("Should replace constructor with enhanced one", () => {
    @Service()
    class Test {
      constructor() {}
    }

    expect(Reflect.getMetadataKeys(Test)).toEqual(expect.arrayContaining([SERVICE]));
  });

  it("Shouldn't add DEPENDENCIES metadata if threr is no dependencies", () => {
    @Service()
    class Test {
      constructor() {}
    }

    expect(Reflect.getMetadataKeys(Test)).toEqual(expect.not.arrayContaining([DEPENDENCIES]));
  });

  it("Should mark all dependencies", () => {
    @Service()
    class Test {
      @Inject(keys.property) private property!: string;

      constructor(@Inject(keys.parameter) private parameter: string) {}
    }

    expect(Reflect.getMetadata(DEPENDENCIES, Test)).toEqual({
      properties: [["property", keys.property]],
      parameters: [[0, keys.parameter]],
    });
  });
});
