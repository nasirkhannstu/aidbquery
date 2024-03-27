type AlertTypes =
  | "userRegister"
  | "profileUpdate"
  | "passwordChange"
  | "reactiveAccount"
  | "deactivateAccount"
  | "deleteUser";

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
  passwordChange: {
    code: 200,
    message: "Password successfully changed.",
  },
  reactiveAccount: {
    code: 200,
    message: "Account reactivated successfully.",
  },
  deactivateAccount: {
    code: 200,
    message: "Account deactivated successfully.",
  },
  deleteUser: {
    code: 200,
    message: "Account deleted successfully.",
  },
};
