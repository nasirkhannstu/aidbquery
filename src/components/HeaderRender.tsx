"use client";
import React from "react";
import { LuArrowBigLeft, LuMenu } from "react-icons/lu";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PageProps } from "@/components/MyFiles/MyFiles";
import { useDrawerHandle } from "@/hooks/useDrawerHandler";
import URLUploadButton from "@/components/upload/URLUploadButton";
import UploadDocumentButton from "@/components/upload/UploadDocumentButton";
import ImageUploadButton from "@/components/upload/ImageUploadButton";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import NavigationDrawerSM from "@/components/NavigationDrawerSM";

const HeaderRender = ({ subscriptionPlan }: PageProps) => {
  const { setIsOpen } = useDrawerHandle();
  const router = useRouter();

  return (
    <div className="flex h-14 w-full items-center justify-between rounded-md bg-white px-3 shadow">
      <div className="flex items-center gap-1">
        <div className="hidden lg:block">
          <Button
            variant="outline"
            aria-label="Open the drawer"
            onClick={() => setIsOpen()}
          >
            <LuMenu className="h-5 w-5 text-blue-600" />
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              aria-label="Open the drawer in small screen"
              className="lg:hidden"
            >
              <LuMenu className="h-5 w-5 text-green-600" />
            </Button>
          </SheetTrigger>
          <NavigationDrawerSM />
        </Sheet>

        <Button
          variant="outline"
          aria-label="back button"
          onClick={() => router.push("/files")}
        >
          <LuArrowBigLeft className="h-5 w-5 text-pink-600" />
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <URLUploadButton />
        <ImageUploadButton
          isAllowed={subscriptionPlan?.image?.isAllowed as boolean}
        />
        <UploadDocumentButton />
      </div>
    </div>
  );
};

export default HeaderRender;
