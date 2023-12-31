import {convertSecondsToMinutesAndSeconds} from "@lib/timer";
import * as SliderPrimitive from "@radix-ui/react-slider";
import {motion} from "framer-motion";

import {cn} from "@lib/utils";
import {useState} from "react";
interface TimelineProps {
  onSeek: (number: number) => void;
  currentTime: number;
  duration: number
}
const Timeline = ({onSeek, currentTime, duration}: TimelineProps) => {
  const [seeking, setSeeking] = useState(false);
  return (
    <SliderPrimitive.Root
      onMouseEnter={() => setSeeking(true)}
      onMouseLeave={() => setSeeking(false)}
      onValueChange={(value) => onSeek(value[0] / 100 * duration)}
      value={[((currentTime || 0) / (duration || 1)) * 100 || 0]}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center"
      )}
    >
      <SliderPrimitive.Track className="relative h-4 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full backdrop-blur bg-black/10 dark:bg-white/50" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb asChild>
        <motion.span
          animate={{
            scale: seeking ? 1.4 : 1,
          }}
          className="block h-4 w-1 rounded-sm bg-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        ></motion.span>
      </SliderPrimitive.Thumb>
      <div className="absolute right-2 top-0 text-xs text-foreground space-x-1">
        <span>{convertSecondsToMinutesAndSeconds(currentTime)}</span>
        <span> / </span>
        <span>{convertSecondsToMinutesAndSeconds(duration)}</span>
      </div>
    </SliderPrimitive.Root>
  );
};

export default Timeline;
