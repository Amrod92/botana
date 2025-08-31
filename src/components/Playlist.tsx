import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayIcon, TrashIcon, ReloadIcon, EyeOpenIcon, EyeClosedIcon, VideoIcon, CopyIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { PlaylistVideo } from "@/types";
import { formatTiktokLabel } from "@/lib/tiktok";

interface PlaylistProps {
  playlist: PlaylistVideo[];
  currentlyPlaying: PlaylistVideo | null;
  currentVideoIndex: number;
  onPlayVideo: (index: number, options: { autoplay: boolean }) => void;
  onRemoveVideo: (index: number) => void;
  onUpdateVideo: (index: number, updatedVideo: Partial<PlaylistVideo>) => void;
  onRestart: () => void;
  onClearAll: () => void;
  onPlayAll: () => void;
  isPlayerVisible: boolean;
  onTogglePlayerVisibility: () => void;
}

export const Playlist = ({
  playlist,
  currentlyPlaying,
  currentVideoIndex,
  onPlayVideo,
  onRemoveVideo,
  onUpdateVideo,
  onRestart,
  onClearAll,
  onPlayAll,
  isPlayerVisible,
  onTogglePlayerVisibility,
}: PlaylistProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Your Playlist ({playlist.length})</CardTitle>
        <div className="flex items-center gap-2">
          {currentlyPlaying && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onTogglePlayerVisibility}>
                  {isPlayerVisible ? <EyeClosedIcon className="mr-2 h-4 w-4" /> : <EyeOpenIcon className="mr-2 h-4 w-4" />}
                  {isPlayerVisible ? 'Hide' : 'Show'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isPlayerVisible ? 'Hide' : 'Show'} Player</p>
              </TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onRestart}>
                <ReloadIcon className="mr-2 h-4 w-4" />
                Restart
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Stop playback and clear the player.</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onClearAll} disabled={playlist.length === 0}>
                <TrashIcon className="mr-2 h-4 w-4" />
                Clean All
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove all videos from the playlist.</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" onClick={onPlayAll} disabled={playlist.length === 0}>
                <PlayIcon className="mr-2 h-4 w-4" />
                Play All
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Play all videos from the beginning.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent>
        {playlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg">
            <div className="text-center">
              <VideoIcon className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold">
                Your playlist is empty
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Add a TikTok URL to get started.
              </p>
            </div>
          </div>
        ) : (
          <ul className="space-y-3 sm:space-y-4">
            {playlist.map((video, index) => (
              <li
                key={index}
                className={cn(
                  "p-3 sm:p-4 rounded-lg cursor-pointer border overflow-hidden transition-colors",
                  currentVideoIndex === index
                    ? 'border-primary bg-accent/30 dark:bg-accent/10'
                    : 'border-transparent hover:border-primary/50 hover:bg-accent/20 dark:hover:bg-accent/5'
                )}
                onClick={() => onPlayVideo(index, { autoplay: false })}
              >
                <div className="grid grid-cols-[64px_1fr_auto] grid-rows-[auto_auto] items-center gap-x-4 gap-y-2">
                  <div className="row-span-2 w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-md flex items-center justify-center">
                    <PlayIcon className="w-8 h-8 text-gray-500" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="font-semibold truncate" title={formatTiktokLabel(video.url)}>{formatTiktokLabel(video.url)}</p>
                      {currentVideoIndex === index && (
                        <span className="shrink-0 rounded-full bg-primary/10 text-primary text-[10px] px-2 py-0.5">Playing</span>
                      )}
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={video.url}>{video.url}</p>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm break-all"><p className="text-xs">{video.url}</p></TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="row-span-2 flex items-center gap-1.5 justify-self-end">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Copy URL"
                          onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(video.url).catch(() => {}); }}
                        >
                          <CopyIcon className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Copy URL</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Open URL"
                          onClick={(e) => { e.stopPropagation(); window.open(video.url, "_blank"); }}
                        >
                          <OpenInNewWindowIcon className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Open</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Play" onClick={(e) => { e.stopPropagation(); onPlayVideo(index, { autoplay: false }); }}>
                          <PlayIcon className="w-5 h-5 text-green-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Play</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label="Remove"
                          onClick={(e) => { e.stopPropagation(); onRemoveVideo(index); }}
                        >
                          <TrashIcon className="w-4 h-4 mr-1.5 text-red-500" />
                          <span className="hidden sm:inline">Remove</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Remove</p></TooltipContent>
                    </Tooltip>
                  </div>

                  <div className="col-start-2 flex items-center gap-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`loop-count-${index}`} className="text-xs">Loop</Label>
                          <Input
                            id={`loop-count-${index}`}
                            type="number"
                            min="1"
                            value={video.loop || 1}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              onUpdateVideo(index, { loop: !isNaN(val) && val >= 1 ? val : 1 });
                            }}
                            className="w-20 h-8"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent><p>Number of times to loop the video.</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`duration-${index}`} className="text-xs">Seconds</Label>
                          <Input
                            id={`duration-${index}`}
                            type="number"
                            min="1"
                            value={video.duration || 60}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              onUpdateVideo(index, { duration: !isNaN(val) && val >= 1 ? val : 1 });
                            }}
                            className="w-20 h-8"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent><p>Duration to play the video in seconds.</p></TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
