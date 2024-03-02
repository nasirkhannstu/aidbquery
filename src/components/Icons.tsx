import { LuUser } from "react-icons/lu";
import { IconBaseProps } from "react-icons";
import { TbBrandOpenai } from "react-icons/tb";

export const Icons = {
  user: LuUser,
  logo: (props: IconBaseProps) => <TbBrandOpenai {...props} />,
};
