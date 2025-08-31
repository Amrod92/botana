import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { isValidTiktokUrl } from "@/lib/tiktok";

interface AddPlaylistFormProps {
  onAddVideo: (url: string) => void;
}

export const AddPlaylistForm = ({ onAddVideo }: AddPlaylistFormProps) => {
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const handleAddVideo = () => {
    if (newVideoUrl.trim() === "") return;
    if (!isValidTiktokUrl(newVideoUrl)) {
      setUrlError("Invalid TikTok URL. Please paste a valid URL.");
      return;
    }
    onAddVideo(newVideoUrl);
    setNewVideoUrl("");
    setUrlError("");
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewVideoUrl(e.target.value);
    if (urlError) {
      setUrlError("");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Add to Playlist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="video-url" className="font-semibold">TikTok URL</Label>
          <Input
            id="video-url"
            type="text"
            placeholder="Paste a TikTok link (https://www.tiktok.com/@user/video/...)"
            value={newVideoUrl}
            onChange={handleUrlChange}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddVideo(); } }}
            autoComplete="off"
            className={cn(urlError ? "border-red-500" : "")}
          />
          {urlError && (
            <p className="text-sm text-red-500">{urlError}</p>
          )}
        </div>
        <Button
          onClick={handleAddVideo}
          className="w-full"
          disabled={!newVideoUrl.trim()}
        >
          <PlusCircledIcon className="mr-2" />
          Add Video
        </Button>
      </CardContent>
    </Card>
  );
};
