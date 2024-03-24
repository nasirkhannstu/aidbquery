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

type UserAlertTypes = "userExists" | "userNotFound";
type FileAlertTypes = "fileNotFound" | "deleteFailed";

type UserErrorsType = Record<
  UserAlertTypes,
  {
    code: ErrorCode;
    message: string;
  }
>;

type FileErrorsType = Record<
  FileAlertTypes,
  {
    code: ErrorCode;
    message: string;
  }
>;

export const userErrors: UserErrorsType = {
  userExists: {
    code: "BAD_REQUEST",
    message: "The user already exists.",
  },
  userNotFound: {
    code: "NOT_FOUND",
    message: "User not found",
  },
};

export const fileErrors: FileErrorsType = {
  fileNotFound: {
    code: "NOT_FOUND",
    message: "File not found",
  },
  deleteFailed: {
    code: "BAD_REQUEST",
    message: "Failed to delete file",
  },
};
