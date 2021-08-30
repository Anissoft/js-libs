import React from "react";
import { render } from "@testing-library/react";
import { useService } from "./useService.hook";
import { Service, Inject, ServiceProvider } from "../react-di";

const tags = {
  dependency: Symbol("dependency"),
  master: Symbol("master"),
};

@Service()
class Dependency {
  constructor() {
    //
  }
}

@Service()
class Master {
  constructor(@Inject(tags.dependency) public dependency: Dependency) { }
}

describe("useService", () => {
  it("Should provide access to services from Services context", (end) => {
    const Child = () => {
      const dependency = useService<Dependency>(tags.dependency);
      const master = useService<Master>(tags.master);

      expect(dependency).toBeInstanceOf(Dependency);
      expect(master).toBeInstanceOf(Master);
      expect(master.dependency).toBe(dependency);
      end();

      return <></>;
    };

    render(
      <ServiceProvider services={{ [tags.dependency]: Dependency, [tags.master]: Master }}>
        <Child />
      </ServiceProvider>
    );
  });

  it("Should throw 'Unable to resolve dependency' error, if dependency is missing", () => {
    const Child = () => {
      useService<Dependency>(tags.master);
      return <></>;
    };
    const renderChildInInvalidContext = () =>
      render(
        <ServiceProvider services={{ [tags.dependency]: Dependency }}>
          <Child />
        </ServiceProvider>
      );
    expect(renderChildInInvalidContext).toThrow();
  });
});
