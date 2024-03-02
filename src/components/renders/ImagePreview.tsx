import React from "react";
import Image from "next/image";
import fs from "fs";

interface ImagePreviewProps {
  imagePath: string;
  imageName: string;
}

const ImagePreview = ({ imagePath, imageName }: ImagePreviewProps) => {
  const imageBase64 = fs.readFileSync("public/uploads/images/" + imagePath, {
    encoding: "base64",
  });

  return (
    <div className="flex max-h-[calc(100vh-56px-56px-0.75rem-0.75rem)] w-full justify-center overflow-hidden">
      <Image
        src={`data:image/png;base64,${imageBase64}`}
        width={1000}
        height={800}
        alt={imageName}
        quality={100}
        className="h-auto w-full rounded-md border border-gray-300 bg-white p-3 shadow-lg"
        style={{ objectFit: "contain" }}
        placeholder="blur"
        blurDataURL={`data:image/png;base64,${imageBase64}`}
      />
    </div>
  );
};

export default ImagePreview;
