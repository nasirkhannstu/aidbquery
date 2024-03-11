type AlertNames = "unauthorized" | "invalidFile" | "fileNotFound" | "catchAll";

type AlertTypes = Record<
  AlertNames,
  {
    code: number;
    message: string;
  }
>;

export const APIErrors: AlertTypes = {
  unauthorized: {
    code: 401,
    message: "Unauthorized",
  },
  fileNotFound: {
    code: 404,
    message: "File not found",
  },
  invalidFile: {
    code: 400,
    message: "Invalid file type. Only CSV and JSON files are allowed.",
  },
  catchAll: {
    code: 500,
    message: "Upload failed, please try again.",
  },
};

export const alerts = {
  uploadSucceed: {
    code: 201,
    message: "File uploaded successfully",
  },
};
