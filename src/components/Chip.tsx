import { cn } from "@/lib/utils";

interface ChipProps {
  rounded: string;
  textColor: string;
  bgColor: string;
  text: string;
  border: boolean;
  borderColor: string;
}

const Chip = ({
  bgColor,
  border,
  borderColor,
  text,
  textColor,
  rounded,
}: ChipProps) => {
  return (
    <span
      className={cn(
        "px-3 py-1 text-xs font-semibold",
        bgColor,
        textColor,
        border ? `border ${borderColor}` : "",
        rounded,
      )}
    >
      {text}
    </span>
  );
};

export default Chip;
