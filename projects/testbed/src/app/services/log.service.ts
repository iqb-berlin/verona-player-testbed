import { Injectable } from '@angular/core';

export enum LogLevel { NONE = 0, ERROR = 1, WARN = 2, INFO = 3, DEBUG = 4 }
export const LogLevelByOrder = ['NONE', 'ERROR', 'WARN', 'INFO', 'DEBUG'];

@Injectable({
  providedIn: 'root'
})

export class LogService {
  static level: LogLevel = 3;

  static error(component:string, message:string, ...args: unknown[]): void {
    if (LogService.level >= LogLevel.ERROR) {
      const logArgs = [component, message, ...args];
      window.console.error.apply(console, logArgs);
    }
  }

  static warn(component:string, message:string, ...args: unknown[]): void {
    if (LogService.level >= LogLevel.WARN) {
      const logArgs = [component, message, ...args];
      window.console.warn.apply(console, logArgs);
    }
  }

  static info(component:string, message:string, ...args: unknown[]): void {
    if (LogService.level >= LogLevel.INFO) {
      const logArgs = [component, message, ...args];
      window.console.info.apply(console, logArgs);
    }
  }

  static debug(component:string, message:string, ...args: unknown[]): void {
    if (LogService.level >= LogLevel.DEBUG) {
      const logArgs = [component, message, ...args];
      window.console.info.apply(console, logArgs);
    }
  }
}
