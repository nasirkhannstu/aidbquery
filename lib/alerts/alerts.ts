type AlertTypes = Record<
  string,
  {
    code: number;
    message: string;
  }
>;

export const errorAlerts: AlertTypes = {
  fileNotFound: {
    code: 404,
    message:
      "We apologize; however, it appears that the file you attempted to access is missing.",
  },
  pageNotFound: {
    code: 404,
    message: "Sorry, the page you visited does not exist.",
  },
};

export const alerts: AlertTypes = {
  chatLoading: {
    code: 200,
    message: "Please be patient while we load the chat.",
  },
};
