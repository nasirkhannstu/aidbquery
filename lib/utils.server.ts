import fs from "fs";

export const isFileExist = (filePath: string) => {
  console.log("filePath: >> ", filePath);

  return fs.existsSync(filePath);
};
