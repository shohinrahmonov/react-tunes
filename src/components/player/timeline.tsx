import {convertSecondsToMinutesAndSeconds} from "@lib/timer";

interface TimelineProps {
  currentTime: number;
  duration: number;
  onSeek?: (number: number) => void;
}
const Timeline = ({currentTime, duration, onSeek}: TimelineProps) => {
    const handleSeekTrack = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const xPos =
          (e.pageX - e.currentTarget.getBoundingClientRect().left) /
          e.currentTarget.offsetWidth;
          onSeek && onSeek(xPos * duration);
      };
  return (
    <div className="flex items-center w-full">
      <div
        className="h-4 w-full bg-secondary cursor-pointer overflow-hidden rounded-full"
        onClick={(e) => handleSeekTrack(e)}
      >
        <div
          className="bg-primary h-full transition-all easy-in duration-75"
          style={{
            width: `${((currentTime || 0) / (duration || 1)) * 100 || 0}%`,
          }}
        />
      </div>
      <div className="mx-2">
        <span>{convertSecondsToMinutesAndSeconds(currentTime)}</span>/
        <span>{convertSecondsToMinutesAndSeconds(duration)}</span>
      </div>
    </div>
  );
};

export default Timeline;
