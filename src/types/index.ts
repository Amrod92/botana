export interface Video {
  id: string;
  url: string;
}

export interface PlaylistVideo extends Video {
  loop: number;
  duration: number;
}
