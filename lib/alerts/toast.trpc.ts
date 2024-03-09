type MessagesType = Record<
  string,
  {
    code: number;
    message: string;
  }
>;

export const messages: MessagesType = {
  userRegister: {
    code: 201,
    message: "The user successfully created.",
  },
};
