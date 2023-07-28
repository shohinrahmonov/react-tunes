import {usePlaylistStore} from "@store/playlist.store";
import {usePlayerStore} from "@store/player.store";
import {MediaProvider, PlaylistModel} from "@models/playlist.model";
import {v4} from "uuid";
import {readAsDataURL} from "@lib/file";
import {Input} from "@ui/input";


const Upload = () => {
  const {playlist, addPlaylist} = usePlaylistStore(
    (state) => state
  );
  const {updatePlaying} = usePlayerStore((state) => state);

  const handleUploadSongs = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newUploadedFiles = e.target.files
        ? Array.from(e.target.files).map((file) => ({
            id: v4(),
            title: file.name,
            file: file,
            song: "",
            provider: MediaProvider.native,
          }))
        : [];
      const filtredPlaylist = playlist
        .concat(newUploadedFiles)
        .filter((file, index, self) => {
          return (
            self.findIndex(
              (f) =>
                f.title === file.title &&
                f.provider === MediaProvider.native &&
                f.file
            ) === index
          );
        }) as (Omit<PlaylistModel, "file"> & {file: File})[];
      try {
        const fileReadPromises = filtredPlaylist.map(async (file) => {
          const song = (await readAsDataURL(file.file)) as string;
          return {...file, song};
        });
        const results = await Promise.all(fileReadPromises);
        addPlaylist(results);
        updatePlaying(true);
      } catch (error) {
        console.error("Error reading files:", error);
      }
    }
  };
  return (
    <Input
      type="file"
      accept="audio/*"
      multiple
      className="my-4"
      onChange={(e) => handleUploadSongs(e)}
    />
  );
};

export default Upload;
