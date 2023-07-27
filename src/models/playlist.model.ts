export interface PlaylistModel {
  id: string
  title: string;
  file?: File;
  song: string;
  provider: MediaProvider
}
export enum MediaProvider {
    gdrive = "gdrive",
    youtube = "youtube",
    native = "native"
}