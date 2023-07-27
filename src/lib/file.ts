import {drive_v3} from "googleapis";

export const readAsDataURL = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const isAudioFile = (mimeType: string) => {
  const audioMimeTypes = ["audio/mpeg", "audio/ogg"];

  return audioMimeTypes.includes(mimeType);
};

export const downloadFileFromDrive = async (
  fileId: string,
  fileType: string
) => {
  if (!window.gapi) {
    throw new Error(`You need to import gapi`);
  }
  try {
    const response: {
      status: number;
      statusText: string;
      headers: any;
      body?: string;
    } = await (
      window.gapi.client as unknown as {drive: {files: drive_v3.Resource$Files}}
    ).drive.files.get({
      fileId: fileId,
      alt: "media",
    });

    // Process the file content
    if (response.body) {
      const fileContent = response.body;
      return `data:${fileType};base64,${btoa(fileContent)}`;
    } else {
      throw new Error(`Error downloading the file: ${response.statusText}`);
    }
  } catch (err: any) {
    console.error("Error downloading the file:", err.message);
  }
};
