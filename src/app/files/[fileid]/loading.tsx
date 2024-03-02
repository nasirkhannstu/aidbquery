import {
  ChatLoader,
  FileLoader,
  ListLoader,
} from "@/components/MyFiles/FileLoaders";

const FileLoading = () => {
  return (
    <div className="flex min-h-[calc(100vh-56px)] min-w-full gap-x-2">
      {/* List loader */}
      <ListLoader />
      <div className="flex flex-1 flex-col gap-x-2 gap-y-2 lg:flex-row lg:gap-y-0">
        {/* File loader */}
        <FileLoader />
        {/* Chat loader */}
        <ChatLoader />
      </div>
    </div>
  );
};

export default FileLoading;
