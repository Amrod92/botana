import { useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  TrackPreviousIcon,
  TrackNextIcon,
  EyeClosedIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Video } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTiktokLabel } from "@/lib/tiktok";

interface PlayerProps {
  currentlyPlaying: Video | null;
  embedHtml: string;
  isVisible: boolean;
  onHide: () => void;
  onPlayNext: () => void;
  onPlayPrev: () => void;
  replayCounter: number;
  isLoading?: boolean;
}

const TikTokEmbed = ({ html }: { html: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!html || !ref.current) return;

    ref.current.innerHTML = html;

    const script = ref.current.querySelector("script");
    if (script) {
      const newScript = document.createElement("script");
      newScript.src = script.src;
      newScript.async = true;
      document.body.appendChild(newScript);

      return () => {
        if (document.body.contains(newScript)) {
          document.body.removeChild(newScript);
        }
      };
    }
  }, [html]);

  return <div ref={ref} className="inline-block" />;
};

export const Player = ({
  currentlyPlaying,
  embedHtml,
  isVisible,
  onHide,
  onPlayNext,
  onPlayPrev,
  replayCounter,
  isLoading,
}: PlayerProps) => {
  if (!currentlyPlaying || !embedHtml) {
    return (
      <div className="flex justify-center">
        <div className="inline-block rounded-lg border bg-muted/40 dark:bg-muted/20 px-6 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Botana</h2>
            <p className="text-gray-500 dark:text-gray-400">Your TikTok Playlist Companion</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("sticky top-6", !isVisible ? "hidden" : "")}>
      <div className="mx-auto w-full max-w-[520px] md:max-w-[560px] lg:max-w-[600px]">
        <Card className="py-4">
          <CardHeader className="flex flex-row items-center justify-between px-5">
            <div>
              <CardTitle className="text-xl font-bold">Now Playing</CardTitle>
              {currentlyPlaying?.url && (
                <CardDescription
                  className="truncate max-w-[60ch]"
                  title={formatTiktokLabel(currentlyPlaying.url)}
                >
                  {formatTiktokLabel(currentlyPlaying.url)}
                </CardDescription>
              )}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onHide}>
                  <EyeClosedIcon className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hide Player</p>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent className="px-5">
            <div className="flex justify-center">
              <div className="rounded-lg overflow-hidden inline-block">
                {isLoading ? (
                  <Skeleton className="w-[360px] h-[640px]" />
                ) : (
                  <TikTokEmbed
                    key={`${currentlyPlaying.id}-${replayCounter}`}
                    html={embedHtml}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-center items-center gap-2 mt-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onPlayPrev}>
                    <TrackPreviousIcon className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Previous</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onPlayNext}>
                    <TrackNextIcon className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Next</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
