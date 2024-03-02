"use client";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useResizeDetector } from "react-resize-detector";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SimpleBar from "simplebar-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LuChevronDown,
  LuChevronUp,
  LuLoader2,
  LuRotateCw,
  LuSearch,
} from "react-icons/lu";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PdfFullscreen from "@/components/PDFFullScreenView";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PDFRendererProps {
  title: string;
  path: string;
}

const PDFRender = ({ title, path }: PDFRendererProps) => {
  const [isRender, setIsRender] = useState(false);
  const { toast } = useToast();
  const [numPages, setNumPages] = useState<number>();
  const [currPage, setCurrPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== scale;

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });

  // console.log(errors);

  const { width, ref } = useResizeDetector();

  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setCurrPage(Number(page));
    setValue("page", String(page));
  };

  useEffect(() => {
    setIsRender(true);
  }, [isRender]);

  if (!isRender) return null;

  return (
    <>
      <div className="flex w-full flex-col items-center rounded-md bg-white shadow">
        <div className="flex h-14 w-full items-center justify-between border-b border-zinc-200 px-2">
          <div className="mr-1 flex items-center gap-1.5">
            <Button
              disabled={currPage <= 1}
              onClick={() => {
                setCurrPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
                setValue("page", String(currPage - 1));
              }}
              variant="ghost"
              aria-label="previous page"
            >
              <LuChevronDown className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1.5">
              <Input
                {...register("page")}
                className={cn(
                  "h-8 w-12",
                  errors.page && "focus-visible:ring-red-500",
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(handlePageSubmit)();
                  }
                }}
              />
              <p className="space-x-1 text-sm text-zinc-700">
                <span>/</span>
                <span>{numPages ?? "x"}</span>
              </p>
            </div>
            <Button
              disabled={numPages === undefined || currPage === numPages}
              onClick={() => {
                setCurrPage((prev) =>
                  prev + 1 > numPages! ? numPages! : prev + 1,
                );
                setValue("page", String(currPage + 1));
              }}
              variant="ghost"
              aria-label="next page"
            >
              <LuChevronUp className="h-4 w-4" />
            </Button>
          </div>

          <div className="hidden flex-1 scroll-smooth truncate text-center text-xl font-semibold md:block">
            {title}
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="gap-1.5" aria-label="zoom" variant="ghost">
                  <LuSearch className="h-4 w-4" />
                  {scale * 100}%
                  <LuChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setScale(1)}>
                  100%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(1.5)}>
                  150%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(2)}>
                  200%
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(2.5)}>
                  250%
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden md:block">
              <Button
                onClick={() => setRotation((prev) => prev + 90)}
                variant="ghost"
                aria-label="rotate 90 degrees"
              >
                <LuRotateCw className="h-4 w-4" />
              </Button>
            </div>

            <PdfFullscreen fileUrl={`data:application/pdf;base64,${path}`} />
          </div>
        </div>

        <div className="max-h-screen w-full flex-1">
          <SimpleBar autoHide={false} className="max-h-[calc(100vh-12.5rem)]">
            <div ref={ref}>
              <Document
                loading={
                  <div className="flex justify-center">
                    <LuLoader2 className="my-24 h-6 w-6 animate-spin" />
                  </div>
                }
                onLoadError={() => {
                  toast({
                    title: "Error loading PDF",
                    description: "Please try again later",
                    variant: "destructive",
                  });
                }}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                file={`data:application/pdf;base64,${path}`}
                className="max-h-full"
              >
                {isLoading && renderedScale ? (
                  <Page
                    width={width ? width : 1}
                    pageNumber={currPage}
                    scale={scale}
                    rotate={rotation}
                    key={"@" + renderedScale}
                  />
                ) : null}

                <Page
                  className={cn(isLoading ? "hidden" : "")}
                  width={width ? width : 1}
                  pageNumber={currPage}
                  scale={scale}
                  rotate={rotation}
                  key={"@" + scale}
                  loading={
                    <div className="flex justify-center">
                      <LuLoader2 className="my-24 h-6 w-6 animate-spin" />
                    </div>
                  }
                  onRenderSuccess={() => setRenderedScale(scale)}
                />
              </Document>
            </div>
          </SimpleBar>
        </div>
      </div>
    </>
  );
};

export default PDFRender;
