import { ModuleMetadata } from '@nestjs/common';
export const LOGGER_OPTIONS_TOKEN = Symbol('LoggerOptions');

export interface LoggerModuleOptions {
  startSymbol: string;
}

export interface LoggerModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory: (
    ...args: any[]
  ) => Promise<LoggerModuleOptions> | LoggerModuleOptions;
}
