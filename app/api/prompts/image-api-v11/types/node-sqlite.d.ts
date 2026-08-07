declare module "node:sqlite" {
  export class DatabaseSync {
    constructor(path: string);
    exec(query: string): void;
    prepare(query: string): {
      get(...args: unknown[]): unknown;
      all(...args: unknown[]): unknown[];
      run(...args: unknown[]): { changes: number };
    };
  }
}
