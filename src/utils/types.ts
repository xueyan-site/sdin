export type PromiseOrNot<T> = Promise<T> | T

export type FunctionType<T> = T extends (...args: any[]) => infer R ? R : any

export type PromiseData<T> = T extends Promise<infer R> ? R : T

export interface ModuleAlias {
  [index: string]: string
}
