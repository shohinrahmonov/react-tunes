import {cn} from "@lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown";
import {Button} from "@ui/button";
import {Icons} from "@components/icons";
import {usePlaylistStore} from "@store/playlist.store";
import {usePlayerStore} from "@store/player.store";
const Playlist = () => {
  const {playlist, removeSong, activeSongIndex, updateActiveSongIndex} =
    usePlaylistStore((state) => state);
  const {updatePlaying} =
  usePlayerStore((state) => state);
    const chooseSongHandler = (index: number) => {
      updateActiveSongIndex(index);
      updatePlaying(true);
    }
  return (
    <>
      {playlist.length > 0 ? (
        <div className="space-y-2">
          {playlist.map((song, index) => (
            <div
              onClick={() => chooseSongHandler(index)}
              key={index}
              className={cn(
                "flex justify-between items-center p-4 rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground overflow-x-hidden relative",
                index === activeSongIndex ? "bg-accent" : ""
              )}
            >
              <span
                className={cn(
                  "inline-block animate-marquee whitespace-nowrap w-[90%]",
                  index === activeSongIndex
                    ? "sm:animate-none"
                    : "animate-none truncate  "
                )}
              >
                {song.title}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="absolute right-4">
                    <Icons.dots className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={() => removeSong(song.title)}>
                    <Icons.trash className="mr-2 w-4 h-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
