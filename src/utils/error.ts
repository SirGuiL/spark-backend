export class ErrorUtils {
  static formatError(error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }

    if (typeof error === "string") {
      return {
        error,
      };
    }

    return {
      error: error,
    };
  }
}
