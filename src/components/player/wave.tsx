import {cn} from "@lib/utils";
import {usePlayerStore} from "@store/player.store";

const Wave = ({className}: {className?: string}) => {
  const playing = usePlayerStore((state) => state.playing);
  const storokes = Array.from({length: 9}, (_, i) => i + 1);

  return (
    <div className={cn("flex items-center h-4 space-x-1", className)}>
      {storokes.map((_, index) => (
        <div
          key={index}
          className="stroke animate-wave w-1 h-full rounded-full bg-gradient-to-t from-primary to-secondary"
          style={{animationPlayState: playing ? "running" : "paused"}}
        ></div>
      ))}
    </div>
  );
};

export default Wave;
