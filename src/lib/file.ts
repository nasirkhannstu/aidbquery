import fs from "fs";

type Folder = "csvs" | "jsons" | "avatars";

export const deleteUnExistingFile = async (filePath: string) => {
  return fs.existsSync(filePath);
};

export const makeBase64 = async (folder: Folder, file: string) => {
  return fs.readFileSync(`public/uploads/${folder}/` + file, {
    encoding: "base64",
  });
};
