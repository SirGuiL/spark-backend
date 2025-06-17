export class ErrorUtils {
  static formatError(error: unknown) {
    return {
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
