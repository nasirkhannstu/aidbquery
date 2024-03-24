type AlertTypes = "userRegister" | "profileUpdate";

type MessagesType = Record<
  AlertTypes,
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
  profileUpdate: {
    code: 200,
    message: "Profile successfully updated.",
  },
};
