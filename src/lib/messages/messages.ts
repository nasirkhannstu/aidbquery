export const account_actions = {
  accountSuspend: {
    title: "Account Suspended",
    message: "Your account is suspended, you cannot upload documents.",
    codeStr: "BAD_REQUEST",
    code: 400,
    TYPE: "error",
  },
};

export const file_actions = {
  fileNotFound: {
    title: "File Not Found",
    message: "The file you are trying to access does not exist.",
    codeStr: "NOT_FOUND",
    code: 404,
    TYPE: "error",
  },
  fileNotAllowed: {
    title: "Insufficient Permissions",
    message:
      "Sorry, you do not have the necessary permissions to upload files.",
    codeStr: "BAD_REQUEST",
    code: 400,
    TYPE: "error",
  },
  fileSizeExceeded: {
    title: "File Size Exceeded",
    message: "The uploaded file exceeds the maximum allowed file size.",
    codeStr: "BAD_REQUEST",
    code: 400,
    TYPE: "error",
  },
  uploadQuotaExceeded: {
    title: "Upload Quota Exceeded",
    message: "You have reached the maximum upload limit for this session.",
    codeStr: "BAD_REQUEST",
    code: 400,
    TYPE: "error",
  },
  emptyFile: {
    title: "Empty File",
    message: "The file you are trying to upload is empty.",
    codeStr: "BAD_REQUEST",
    code: 400,
    TYPE: "error",
  },
  catchAll: {
    title: "Something went wrong",
    message: "Please try again later",
    codeStr: "INTERNAL_SERVER_ERROR",
    code: 500,
    TYPE: "error",
  },
  csv: {
    fileNotAllowed: {
      title: "Insufficient Permissions",
      message:
        "Sorry, you do not have the necessary permissions to upload CSV files.",
      codeStr: "BAD_REQUEST",
      code: 400,
      TYPE: "error",
    },
    fileSizeExceeded: {
      title: "File Size Exceeded",
      message: "The uploaded CSV file exceeds the maximum allowed file size.",
      codeStr: "BAD_REQUEST",
      code: 400,
      TYPE: "error",
    },
    rowsExceeded: {
      title: "Rows Exceeded",
      message: "The uploaded CSV file exceeds the maximum allowed rows.",
      codeStr: "BAD_REQUEST",
      code: 400,
      TYPE: "error",
    },
    quotaExceeded: {
      title: "Upload Quota Exceeded",
      message:
        "You have reached the maximum CSV upload limit for this session.",
      codeStr: "BAD_REQUEST",
      code: 400,
      TYPE: "error",
    },
    wrongFileType: {
      title: "Wrong File Type",
      message:
        "The file you are trying to upload is not in a supported format. Only CSV files are accepted.",
      codeStr: "BAD_REQUEST",
      code: 400,
      TYPE: "error",
    },
  },
  json: {
    fileNotAllowed: {
      title: "Insufficient Permissions",
      message:
        "Sorry, you do not have the necessary permissions to upload JSON files.",
      codeStr: "BAD_REQUEST",
      code: 400,
      TYPE: "error",
    },
    fileSizeExceeded: {
      title: "File Size Exceeded",
      message: "The uploaded JSON file exceeds the maximum allowed file size.",
      codeStr: "BAD_REQUEST",
      code: 400,
      TYPE: "error",
    },
    quotaExceeded: {
      title: "Upload Quota Exceeded",
      message:
        "You have reached the maximum JSON upload limit for this session.",
      codeStr: "BAD_REQUEST",
      code: 400,
      TYPE: "error",
    },
    wrongFileType: {
      title: "Wrong File Type",
      message:
        "The file you are trying to upload is not in a supported format. Only JSON files are accepted.",
      codeStr: "BAD_REQUEST",
      code: 400,
      TYPE: "error",
    },
  },
};
