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

type ErrorsType = Record<
  string,
  {
    code: ErrorCode;
    message: string;
  }
>;

export const userErrors: ErrorsType = {
  userExists: {
    code: "BAD_REQUEST",
    message: "The user already exists.",
  },
};

export const fileErrors: ErrorsType = {
  fileNotFound: {
    code: "NOT_FOUND",
    message: "File not found",
  },
};
