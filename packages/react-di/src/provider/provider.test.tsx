import React from "react";
import { render, screen } from "@testing-library/react";
import { ServiceProvider, ServiceConsumer } from "./provider.component";
import { Service, Inject } from "../react-di";

@Service()
class BrokenDependencyOfDependency {
  constructor(@Inject("DEPENDENCY") public dependency: Dependency) {}
}

class DependencyOfDependency {
  constructor() {
    // @Inject('DEPENDENCY') public dependency: Dependency,
  }
}

@Service()
class Dependency {
  @Inject("DependencyOfDependency")
  private dependencyOfDependency!: DependencyOfDependency;

  constructor() {
    //
  }
}

@Service()
class Test {
  @Inject("DependencyOfDependency")
  private dependency2!: DependencyOfDependency;

  constructor(@Inject("DEPENDENCY") public dependency: Dependency) {}
}

describe("ServiceProvider", () => {
  beforeAll(() => {
    jest.spyOn(console, "error");
    (console.error as any).mockImplementation(() => {
      //
    });
  });

  it("Should accept services as prop and render its children", () => {
    render(<ServiceProvider services={{ TEST: DependencyOfDependency }}>Child</ServiceProvider>);

    expect(screen.getByText("Child")).toBeDefined();
  });

  it("Should accept services with dependencies as prop and render its children", () => {
    render(
      <ServiceProvider
        services={{
          TEST: Test,
          DEPENDENCY: Dependency,
          DependencyOfDependency: DependencyOfDependency,
        }}
      >
        Child
      </ServiceProvider>
    );

    expect(screen.getByText("Child")).toBeDefined();
  });

  it("Should provice access to services in context via consumer", (end) => {
    const Child = () => {
      return (
        <ServiceConsumer>
          {(container) => {
            expect(container.get("DependencyOfDependency")).toBeInstanceOf(DependencyOfDependency);
            expect(container.get("DEPENDENCY")).toBeInstanceOf(Dependency);
            expect(container.get("DEPENDENCY").dependencyOfDependency).toBe(
              container.get("DependencyOfDependency")
            );
            expect(container.get("TEST").dependency.dependencyOfDependency).toBe(
              container.get("DependencyOfDependency")
            );
            expect(container.get("TEST").dependency).toBe(container.get("DEPENDENCY"));
            expect(container.get("TEST")).toBeInstanceOf(Test);
            end();
            return <></>;
          }}
        </ServiceConsumer>
      );
    };
    render(
      <ServiceProvider
        services={{
          TEST: Test,
          DEPENDENCY: Dependency,
          DependencyOfDependency: DependencyOfDependency,
        }}
      >
        <Child />
      </ServiceProvider>
    );
  });

  it("Should allow Symbols as tag-names", (end) => {
    const tags = {
      dependency: Symbol("dependency"),
      master: Symbol("master"),
    };

    @Service()
    class Dep {
      constructor() {
        //
      }
    }

    @Service()
    class Master {
      constructor(@Inject(tags.dependency) public dependency: Dep) {}
    }

    const Child = () => {
      return (
        <ServiceConsumer>
          {(container) => {
            expect(container.get(tags.dependency)).toBeInstanceOf(Dep);
            expect(container.get(tags.master)).toBeInstanceOf(Master);
            expect(container.get(tags.master).dependency).toBe(container.get(tags.dependency));
            end();
            return <></>;
          }}
        </ServiceConsumer>
      );
    };

    render(
      <ServiceProvider services={{ [tags.dependency]: Dep, [tags.master]: Master }}>
        <Child />
      </ServiceProvider>
    );
  });

  it("Should throw error if not all dependencies was passed", () => {
    const test = () => {
      render(<ServiceProvider services={{ TEST: Test }}>Child</ServiceProvider>);
    };

    expect(test).toThrow();
  });

  it("Should throw error if there is a circular dependency", () => {
    const test = () => {
      render(
        <ServiceProvider
          services={{
            TEST: Test,
            DEPENDENCY: Dependency,
            DependencyOfDependency: BrokenDependencyOfDependency,
          }}
        >
          Child
        </ServiceProvider>
      );
    };

    expect(test).toThrow();
  });

  afterAll(() => {
    (console.error as any).mockRestore();
  });
});
