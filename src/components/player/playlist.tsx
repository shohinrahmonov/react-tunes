import {cn} from "@lib/utils";
import {PlaylistModel} from "src/models/playlist.model";

interface PlaylistProps {
  playlist: PlaylistModel[];
  setSongIndex: React.Dispatch<React.SetStateAction<number>>;
  currentSongIndex: number;
}

const Playlist = ({
  playlist,
  setSongIndex,
  currentSongIndex,
}: PlaylistProps) => {
  return (
    <>
      {playlist.length > 0 ? (
        <div className="space-y-2">
          {playlist.map((song, index) => (
            <div
              onClick={() => setSongIndex(index)}
              key={index}
              className={cn(
                "p-4 rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground overflow-x-hidden",
                index === currentSongIndex ? "bg-accent" : ""
              )}
            >
              <span
                className={cn(
                  "inline-block animate-marquee whitespace-nowrap",
                  index === currentSongIndex ? "sm:animate-none" : "animate-none"
                )}
              >
                {song.title}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div>No songs in playlist</div>
      )}
    </>
  );
};

export default Playlist;
