import fs from "fs";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import MainChatWrapper from "@/components/chat/MainChatWrapper";
import NavigationDrawer from "@/components/NavigationDrawer";
import PDFReaderHeader from "@/components/HeaderRender";
import PDFRender from "@/components/renders/PDFRender";
import TextRender from "@/components/renders/TextRender";
import { db } from "@/db/prisma";
import { authOptions } from "@/lib/auth/authOption";
import { getUserSubscriptionPlan } from "@/config/using_mode";
import ImagePreview from "@/components/renders/ImagePreview";
import DOCRender from "@/components/renders/DOCRender";

interface DocumentDisplayPageProps {
  params: {
    fileid: string;
  };
}

const DocumentDisplayPage = async ({
  params: { fileid },
}: DocumentDisplayPageProps) => {
  const session = await getServerSession(authOptions);
  const plan = await getUserSubscriptionPlan();
  const user = session?.user;

  if (!user || !user.id) redirect("/authentication/login");

  const file = await db.files.findFirst({
    where: {
      id: fileid,
      userId: user.id,
    },
  });

  if (!file) notFound();

  return (
    <div className="flex h-auto min-h-[calc(100vh-56px)] justify-between gap-x-3 lg:max-h-[calc(100vh-56px)]">
      {/* navigation drawer */}
      <NavigationDrawer />

      <div className="flex max-w-full flex-1 flex-col gap-x-2 lg:flex-row">
        <div className="w-full max-w-full lg:w-[60%]">
          {/* Main area */}
          <div className="my-3">
            {/* fill the blank */}
            <PDFReaderHeader subscriptionPlan={plan} />
          </div>
          <div>
            {file.fileType === "PDF" ? (
              <PDFRender
                title={file.name}
                path={fs.readFileSync("public/uploads/pdfs/" + file.path, {
                  encoding: "base64",
                })}
              />
            ) : file.fileType === "TEXT" ? (
              <TextRender path={file.path} type="TEXT" />
            ) : file.fileType === "IMAGE" ? (
              <ImagePreview imagePath={file.path} imageName={file.name} />
            ) : file.fileType === "DOC" ? (
              <DOCRender fileId={file.id} />
            ) : file.fileType === "URL" ? (
              <TextRender path={file.path} type="URL" />
            ) : null}
          </div>
        </div>

        <div className="my-3 w-full max-w-full border-t border-gray-200 lg:my-0 lg:w-[40%] lg:border-l lg:border-t-0">
          <MainChatWrapper
            isSubscribed={plan.isSubscribed}
            fileId={file.id}
            fileType={file.fileType}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentDisplayPage;
