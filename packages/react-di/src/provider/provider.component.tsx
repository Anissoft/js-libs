import React from "react";
import "reflect-metadata";
import { DEPENDENCIES } from "../constants";
import { Constructor, InjectIdentificator } from "../types";

export const ContainerContext = React.createContext<Map<InjectIdentificator, any>>(new Map());

function getKeys<T>(obj: Record<InjectIdentificator, T>) {
  return [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)];
}

function getValues<T>(obj: Record<InjectIdentificator, T>) {
  return getKeys(obj).map((key) => obj[key as string]);
}

export const Provider = ({
  services,
  children,
}: React.PropsWithChildren<{ services: Record<InjectIdentificator, Constructor> }>) => {
  const container = React.useMemo(() => {
    function getInjectIdentificator(value: Constructor) {
      return getKeys(services).find(
        (key) => services[key as string] === value
      ) as InjectIdentificator;
    }
    const allServices: Map<InjectIdentificator, any> = new Map();

    // extract all dependencies identificators from metadata
    const servicesWithDepsSet: [Constructor, Set<InjectIdentificator>][] = getValues(services).map(
      (constructor: Constructor) => {
        if (Reflect.hasOwnMetadata(DEPENDENCIES, constructor)) {
          const {
            parameters,
            properties,
          }: {
            parameters: [number, InjectIdentificator][];
            properties: [string, InjectIdentificator][];
          } = Reflect.getMetadata(DEPENDENCIES, constructor);

          const deps = new Set([
            ...parameters.map(([, dep]) => dep),
            ...properties.map(([, dep]) => dep),
          ]);

          Array.from(deps).forEach((identificator) => {
            if (!services[identificator as any]) {
              // eslint-disable-next-line no-useless-escape
              throw new Error(
                `Unable to resolve dependency ${String(identificator)
                  .split(/[\s\(\)]/gim)
                  .slice(0, 2)
                  .join(" ")} for ${constructor} constructor. Make sure you have provided it.`
              );
            }
          });

          return [constructor, deps] as [Constructor, Set<InjectIdentificator>];
        }
        return [constructor, new Set([])] as [Constructor, Set<InjectIdentificator>];
      }
    );

    // extract all services without dependencies
    const [servicesWithoudDeps, servicesWithDeps] = servicesWithDepsSet.reduce(
      (acc, serviceWithDepsSet) => {
        if (Array.from(serviceWithDepsSet[1]).length === 0) {
          acc[0].push(serviceWithDepsSet);
        } else {
          acc[1].push(serviceWithDepsSet);
        }
        return acc;
      },
      [[], []] as [
        [Constructor, Set<InjectIdentificator>][],
        [Constructor, Set<InjectIdentificator>][]
      ]
    );

    if (servicesWithoudDeps.length === 0) {
      throw new Error(
        "All services depends on each other. Maybe, some of the dependencies wasn't provided"
      );
    }

    servicesWithoudDeps.forEach(([Service]) => {
      allServices.set(getInjectIdentificator(Service), new Service());
    });

    // recursively add all services with dependencies
    function spawnServicesWithDependencies(
      servicesWithDependencies: [Constructor, Set<InjectIdentificator>][]
    ) {
      const [readyToBeSpawned, notRedyToBeSpawned] = servicesWithDependencies.reduce(
        (acc, serviceWithDepsSet) => {
          const ready = Array.from(serviceWithDepsSet[1]).every((identificator) =>
            allServices.has(identificator)
          );

          if (ready) {
            acc[0].push(serviceWithDepsSet);
          } else {
            acc[1].push(serviceWithDepsSet);
          }

          return acc;
        },
        [[], []] as [
          [Constructor, Set<InjectIdentificator>][],
          [Constructor, Set<InjectIdentificator>][]
        ]
      );

      readyToBeSpawned.forEach(([Service]) => {
        const {
          parameters,
          properties,
        }: {
          parameters: [number, InjectIdentificator][];
          properties: [string, InjectIdentificator][];
        } = Reflect.getMetadata(DEPENDENCIES, Service);

        const candidate = new Service(
          ...parameters.reduce((acc, [index, identificator]) => {
            acc[index] = allServices.get(identificator);
            return acc;
          }, [] as any[])
        );

        properties.forEach(([name, identificator]) => {
          (candidate as any)[name] = allServices.get(identificator);
        });

        allServices.set(getInjectIdentificator(Service), candidate);
      });

      if (notRedyToBeSpawned.length > 0) {
        spawnServicesWithDependencies(notRedyToBeSpawned);
      }
    }

    spawnServicesWithDependencies(servicesWithDeps);

    return allServices;
  }, [...getValues(services)]);

  return <ContainerContext.Provider value={container}>{children}</ContainerContext.Provider>;
};

export const ServiceProvider = Provider;
export const ServicesProvider = Provider;
export const ServiceConsumer = ContainerContext.Consumer;
export const ServicesConsumer = ContainerContext.Consumer;
