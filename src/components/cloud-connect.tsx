import {useEffect, useState} from "react";
import {drive_v3} from "googleapis";
import {downloadFileFromDrive, isAudioFile} from "@lib/file";
import {Button} from "@ui/button";
import {Icons} from "@components/icons";
import {MediaProvider, PlaylistModel} from "@models/playlist.model";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@components/ui/sheet";
import {v4} from "uuid";
import {useToast} from "@hooks/use-toast";
import {usePlaylistStore} from "@store/playlist.store";

interface GDriveFile {
  id: string;
  name: string;
  mimeType: string;
}

const Connect = () => {
  if (
    !import.meta.env.VITE_API_GC_API_KEY &&
    !import.meta.env.VITE_API_GC_CLIENT_ID
  ) {
    return;
  }
  const [sheetOpen, setSheetOpen] = useState(false);
  const {toast} = useToast();
  const {playlist, addSongToPlaylist, addPlaylist} = usePlaylistStore(
    (state) => state
  );
  const [initializeGapiClient, setInitializeGapiClient] = useState(false);
  const [gdriveResponse, setGdriveResponse] = useState<{
    loading: boolean;
    error?: string;
    content: PlaylistModel[];
  }>({loading: false, content: []});
  useEffect(() => {
    async function fetchData() {
      if (!initializeGapiClient) {
        return;
      }
      if (window.gapi) {
        const initializeGapiClient = async () => {
          await window.gapi.client.init({
            apiKey: import.meta.env.VITE_API_GC_API_KEY,
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
            ],
          });
        };
        window.gapi.load("client", initializeGapiClient);
      }
      let tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_API_GC_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/drive",
        callback: async (resp) => {
          if (resp.error !== undefined) {
            toast({
              title: "Error: connecting to gdrive",
              variant: "destructive",
            });
            throw resp;
          }
          await listFiles();
        },
      });

      if (window.gapi.client?.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({prompt: "consent"});
      } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({prompt: ""});
      }
      async function listFiles() {
        setGdriveResponse({...gdriveResponse, loading: true});
        let response: any;
        try {
          response = await (
            window.gapi.client as unknown as {
              drive: {files: drive_v3.Resource$Files};
            }
          ).drive.files.list({
            fields: "files(id, name, mimeType)",
          });
        } catch (err: any) {
          toast({
            title: "Error: connecting to gdrive",
            description: err.message,
            variant: "destructive",
          });
          setGdriveResponse({
            ...gdriveResponse,
            loading: false,
            error: err.message,
          });
          return;
        }
        const files = response.result.files;
        // Filter only audio files
        const audioFiles = files.filter((file: GDriveFile) =>
          isAudioFile(file.mimeType)
        );

        if (audioFiles.length === 0) {
          console.log("No audio files found.");
          toast({
            title: "No audio",
            description: "No audio files found in your account",
          });
          setGdriveResponse({
            ...gdriveResponse,
            loading: false,
            error: "No audio files found.",
          });
          return;
        }
        const newOnes: PlaylistModel[] = await Promise.all(
          audioFiles.map(async (file: GDriveFile) => ({
            id: v4(),
            title: file.name,
            song: await downloadFileFromDrive(file.id, file.mimeType),
            provider: MediaProvider.gdrive,
          }))
        );
        setGdriveResponse({
          ...gdriveResponse,
          loading: false,
          content: newOnes,
        });
      }
    }
    fetchData();
  }, [initializeGapiClient]);
  const addSongToPlaylistHandler = () => {
    addPlaylist(gdriveResponse.content);
    setSheetOpen(false);
  };
  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={() => setSheetOpen(false)}>
        {gdriveResponse.content.length > 0 ? (
          <Button variant={"outline"} onClick={() => setSheetOpen(true)}>
            <span className="mr-2">Open GDrive Content Files</span>
            <Icons.gdrive className="h-6 w-6" />
          </Button>
        ) : (
          <Button
            variant={"outline"}
            onClick={() => setInitializeGapiClient(true)}
            disabled={initializeGapiClient || gdriveResponse.loading}
          >
            {gdriveResponse.loading ? (
              <>
                <span className="mr-2">Connecting</span>
                <Icons.spinner className="h-6 w-6 animate-spin" />
              </>
            ) : (
              <>
                <span className="mr-2">Connect</span>
                <Icons.gdrive className="h-6 w-6" />
              </>
            )}
          </Button>
        )}
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Gdrive content</SheetTitle>
            <SheetDescription>
              Click on the music you want to add to your playlist.
            </SheetDescription>
          </SheetHeader>
          {gdriveResponse.content.length > 0 &&
            gdriveResponse.content.map((song) => (
              <div
                className="flex justify-between items-center py-4 rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground overflow-x-hidden relative"
                key={song.title}
              >
                <div className="whitespace-nowrap w-[90%] animate-marquee">
                  {song.title}
                </div>
                <Button
                  variant="outline"
                  disabled={playlist.some(
                    (s) =>
                      s.id === song.id ||
                      (song.provider === MediaProvider.gdrive &&
                        s.title === song.title)
                  )}
                  className="absolute right-4"
                  onClick={() => addSongToPlaylist(song)}
                >
                  <Icons.plus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          {gdriveResponse.content.length > 0 && (
            <Button className="w-full" onClick={addSongToPlaylistHandler}>
              Add all songs to playlist
            </Button>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Connect;
