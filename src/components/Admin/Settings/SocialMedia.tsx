"use client";
import { useState, useRef, useEffect } from "react";
import { FaFacebookSquare, FaRegEdit } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import { RxReload } from "react-icons/rx";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";

interface SocialMedia {
  editable: boolean;
  value: string;
  focus: boolean;
}

export type SocialMediaEventTypes = "facebook" | "twitter" | "support";

const SocialMedia = () => {
  const fbRef = useRef<HTMLInputElement>(null);
  const xRef = useRef<HTMLInputElement>(null);
  const supportRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const { data } = trpc.getSocialMedia.useQuery();
  const utils = trpc.useUtils();
  const { mutate: updateSocialMedia, isLoading } =
    trpc.setupSocialMedia.useMutation({
      onSuccess: ({ type }) => {
        if (type === "facebook")
          setFacebook((prev) => ({ ...prev, editable: false, focus: false }));
        if (type === "twitter")
          setTwitter((prev) => ({ ...prev, editable: false, focus: false }));
        if (type === "support")
          setSupport((prev) => ({ ...prev, editable: false, focus: false }));

        toast.toast({
          variant: "success",
          title: "Update Successful!",
          description: "Social media settings updated successfully",
        });
        utils.getSocialMedia.invalidate();
      },
      onError: ({ data }) => {
        const fieldErrors =
          (data?.zodError?.fieldErrors?.facebook &&
            data.zodError?.fieldErrors?.facebook[0]) ||
          (data?.zodError?.fieldErrors?.twitter &&
            data?.zodError?.fieldErrors?.twitter[0]) ||
          (data?.zodError?.fieldErrors?.support &&
            data?.zodError?.fieldErrors?.support[0]) ||
          "Failed to update social media settings";

        toast.toast({
          variant: "destructive",
          title: "Update Failed!",
          description: fieldErrors,
        });
      },
    });
  const [facebook, setFacebook] = useState<SocialMedia>({
    editable: false,
    value: "",
    focus: false,
  });
  const [twitter, setTwitter] = useState<SocialMedia>({
    editable: false,
    value: "",
    focus: false,
  });
  const [support, setSupport] = useState<SocialMedia>({
    editable: false,
    value: "",
    focus: false,
  });

  const handleSettings = (type: SocialMediaEventTypes) => {
    if (type === "facebook") {
      setTwitter((prev) => ({ ...prev, editable: false, focus: false }));
      setSupport((prev) => ({ ...prev, editable: false, focus: false }));
      setFacebook((prev) => ({
        ...prev,
        editable: !facebook.editable,
        focus: true,
      }));
    } else if (type === "twitter") {
      setSupport((prev) => ({ ...prev, editable: false, focus: false }));
      setFacebook((prev) => ({ ...prev, editable: false, focus: false }));
      setTwitter((prev) => ({
        ...prev,
        editable: !twitter.editable,
        focus: true,
      }));
    } else if (type === "support") {
      setTwitter((prev) => ({ ...prev, editable: false, focus: false }));
      setFacebook((prev) => ({ ...prev, editable: false, focus: false }));
      setSupport((prev) => ({
        ...prev,
        editable: !support.editable,
        focus: true,
      }));
    }
  };

  useEffect(() => {
    if (facebook.focus) fbRef.current?.focus();
    if (twitter.focus) xRef.current?.focus();
    if (support.focus) supportRef.current?.focus();
  }, [facebook.focus, twitter.focus, support.focus]);

  useEffect(() => {
    if (data?.facebook) {
      setFacebook((prev) => ({ ...prev, value: data?.facebook as string }));
    }
  }, [data?.facebook]);

  useEffect(() => {
    if (data?.twitter) {
      setTwitter((prev) => ({ ...prev, value: data?.twitter as string }));
    }
  }, [data?.twitter]);

  useEffect(() => {
    if (data?.support) {
      setSupport((prev) => ({ ...prev, value: data?.support as string }));
    }
  }, [data?.support]);

  return (
    <Card className="px-5 py-3">
      <h2 className="text-xl font-semibold">Social Media Settings</h2>
      <p className="text-lg font-light text-slate-500">
        Configure your social media settings. This will be used for contact.
      </p>

      <div className="my-7">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="w-[350px] max-w-sm">
                <div className="flex items-center gap-3">
                  <FaFacebookSquare className="h-10 w-10 text-blue-600" />

                  <div className="grid gap-0">
                    <h4 className="text-base font-semibold">Facebook</h4>
                    <p className="text-sm font-light text-slate-500">
                      Connect your Facebook account
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex w-full max-w-lg items-center space-x-2">
                  <Input
                    ref={fbRef}
                    disabled={facebook.editable ? false : true}
                    type="text"
                    placeholder="Exp: https://facebook.com/aicsvquery"
                    className="h-10 text-sm md:h-12 md:text-base"
                    onChange={(e) =>
                      setFacebook((prev) => ({
                        ...prev,
                        value: e.target.value,
                      }))
                    }
                    value={facebook.value}
                  />
                  <div className="w-8">
                    {facebook.focus ? (
                      isLoading ? (
                        <Button variant="outline" size="icon">
                          <RxReload className="h-4 w-4 text-primary" />
                        </Button>
                      ) : (
                        <Button
                          className="text-base font-semibold"
                          disabled={!facebook.value}
                          onClick={() =>
                            updateSocialMedia({
                              type: "facebook",
                              facebook: facebook.value,
                            })
                          }
                        >
                          Save
                        </Button>
                      )
                    ) : (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label="Edit Facebook URL"
                        onClick={() => handleSettings("facebook")}
                      >
                        <FaRegEdit className="h-6 w-6 text-slate-500" />
                      </Button>
                    )}
                  </div>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-3">
                  <FaSquareXTwitter className="h-10 w-10 text-black" />

                  <div className="grid gap-0">
                    <h4 className="text-base font-semibold">Twitter</h4>
                    <p className="text-sm font-light text-slate-500">
                      Connect your Twitter account
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex w-full max-w-lg items-center space-x-2">
                  <Input
                    ref={xRef}
                    disabled={twitter.editable ? false : true}
                    type="text"
                    placeholder="Exp: https://twitter.com/aicsvquery"
                    className="h-10 text-sm md:h-12 md:text-base"
                    onChange={(e) =>
                      setTwitter((prev) => ({ ...prev, value: e.target.value }))
                    }
                    value={twitter.value}
                  />
                  <div className="w-8">
                    {twitter.focus ? (
                      isLoading ? (
                        <Button variant="outline" size="icon">
                          <RxReload className="h-4 w-4 text-primary" />
                        </Button>
                      ) : (
                        <Button
                          className="text-base font-semibold"
                          disabled={!twitter.value}
                          onClick={() =>
                            updateSocialMedia({
                              type: "twitter",
                              twitter: twitter.value,
                            })
                          }
                        >
                          Save
                        </Button>
                      )
                    ) : (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label="Edit Facebook URL"
                        className="hover:bg-none"
                        onClick={() => handleSettings("twitter")}
                      >
                        <FaRegEdit className="h-6 w-6 text-slate-500" />
                      </Button>
                    )}
                  </div>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <SiGmail className="h-10 w-10 text-rose-400" />

                  <div className="grid gap-0">
                    <h4 className="text-base font-semibold">Contact</h4>
                    <p className="text-sm font-light text-slate-500">
                      Connect your contact email
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex w-full max-w-lg items-center space-x-2">
                  <Input
                    ref={supportRef}
                    disabled={support.editable ? false : true}
                    type="text"
                    placeholder="Exp: support@aicsvquery.com"
                    className="h-10 text-sm md:h-12 md:text-base"
                    onChange={(e) =>
                      setSupport((prev) => ({ ...prev, value: e.target.value }))
                    }
                    value={support.value}
                  />
                  <div className="w-8">
                    {support.focus ? (
                      isLoading ? (
                        <Button variant="outline" size="icon">
                          <RxReload className="h-4 w-4 text-primary" />
                        </Button>
                      ) : (
                        <Button
                          disabled={!support.value}
                          className="text-base font-semibold"
                          onClick={() =>
                            updateSocialMedia({
                              type: "support",
                              support: support.value,
                            })
                          }
                        >
                          Save
                        </Button>
                      )
                    ) : (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label="Edit Facebook URL"
                        className="hover:bg-none"
                        onClick={() => handleSettings("support")}
                      >
                        <FaRegEdit className="h-6 w-6 text-slate-500" />
                      </Button>
                    )}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default SocialMedia;
