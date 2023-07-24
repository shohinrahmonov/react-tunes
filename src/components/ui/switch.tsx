import { cn } from "@lib/utils";
import {motion} from "framer-motion";
const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30,
};
interface SwitchProps {
  onChange: () => void;
  value: boolean;
  className?: string | undefined
}
const Switch = ({value, onChange, className}: SwitchProps) => {
  return (
    <div className={cn("w-12 h-8 bg-secondary flex justify-start rounded-3xl cursor-pointer p-2 data-[state=true]:justify-end", className)} data-state={value} onClick={onChange}>
      <motion.div className="h-4 w-4 bg-primary rounded-full" layout transition={spring} />
    </div>
  );
};

export default Switch;
