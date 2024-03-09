type ErrorCode =
  | "PARSE_ERROR"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR"
  | "NOT_IMPLEMENTED"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "METHOD_NOT_SUPPORTED"
  | "TIMEOUT"
  | "CONFLICT";

type UserErrorsType = Record<
  string,
  {
    code: ErrorCode;
    message: string;
  }
>;

export const userErrors: UserErrorsType = {
  userExists: {
    code: "BAD_REQUEST",
    message: "User already exists",
  },
};
