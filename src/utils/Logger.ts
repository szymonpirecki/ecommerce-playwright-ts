type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export class Logger {
  private readonly context: string;

  constructor(context: string) {
    this.context = context;
  }

  info(message: string): void {
    this.log('INFO', message);
  }

  warn(message: string): void {
    this.log('WARN', message);
  }

  error(message: string): void {
    this.log('ERROR', message);
  }

  private log(level: LogLevel, message: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${level}] [${timestamp}] [${this.context}] ${message}`);
  }
}
