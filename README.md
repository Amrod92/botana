<div align="center">

# Botana — TikTok Playlist Companion

Build and play a queue of TikTok videos with per‑item loop and duration controls. Paste TikTok links, manage your playlist, and play them back with a simple embedded player.

</div>

## Overview

Botana lets you collect TikTok videos into a playlist and control how long and how many times each item plays. It fetches TikTok oEmbed HTML for a reliable embed experience, remembers your playlist locally, and provides quick controls to play through, restart, or clear everything.

## Features

- Add TikTok URLs: Paste any TikTok link like `https://www.tiktok.com/@user/video/123...`.
- Play All: Start playback from the first item in your playlist.
- Restart: Stop playback and clear the player, keeping the playlist unchanged.
- Clean All: Remove all videos from the playlist and stop playback.
- Show/Hide Player: Toggle player visibility while keeping playback state.
- Per‑video controls: Set Loop count and Seconds (duration) for each item.
- Quick actions: Copy URL, Open in new tab, Play, Remove.
- Autoplay newly added: Newly added valid videos are queued to autoplay.
- Local persistence: Playlist is saved to `localStorage` and restored on load.

## How It Works

- URL parsing and validation live in `src/lib/tiktok.ts`.
- The playlist state machine and timers live in the `usePlaylist` hook (`src/hooks/usePlaylist.ts`).
- oEmbed HTML is fetched per URL and injected by the `Player` component (`src/components/Player.tsx`).
- The `Playlist` component (`src/components/Playlist.tsx`) renders the list and top‑level actions.

## Controls Explained

Top bar of the Your Playlist panel:

- Restart: Clears the player and stops playback, but does not modify the playlist.
- Clean All: Empties the playlist, stops playback, hides the player, and resets pending autoplay. Disabled when the playlist is empty.
- Play All: Starts from the first item. Disabled when the playlist is empty.

Per‑item row controls:

- Loop: Number of times the item repeats before advancing.
- Seconds: How long each loop plays before advancing or repeating.
- Copy: Copies the TikTok URL to clipboard.
- Open: Opens the TikTok URL in a new tab.
- Play: Plays just that item immediately.
- Remove: Removes the item from the playlist.

Player controls:

- Hide: Temporarily hides the player UI.
- Previous/Next: Navigate across items in the playlist.

## Data Persistence

- The playlist is stored in `localStorage` under the key `botana:playlist`.
- Items are stored as `{ id, url, loop, duration }` entries. See `src/types/index.ts` for type definitions.

## Project Structure

```
src/
  app/page.tsx            # Main page, wiring player + playlist
  components/
    AddPlaylistForm.tsx   # URL input and validation
    Player.tsx            # TikTok oEmbed injection and controls
    Playlist.tsx          # Playlist UI, actions (Restart / Clean All / Play All)
    ui/*                  # Shadcn UI primitives
  hooks/
    usePlaylist.ts        # Core playlist state, timers, persistence
  lib/
    tiktok.ts             # URL parsing/validation, oEmbed URL util
  types/
    index.ts              # Video and PlaylistVideo types
```

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev

# or
yarn && yarn dev
# or
pnpm install && pnpm dev
# or
bun install && bun dev
```

Open http://localhost:3000 and start pasting TikTok links.

## Development Notes

- TikTok oEmbed: The app fetches `https://www.tiktok.com/oembed?url=<video-url>` and injects the returned HTML. When you click Play on a list item without autoplay, the embed’s `autoplay` flag is normalized to off.
- Timers and looping: Each item’s `loop` and `duration` are respected by a timer in `usePlaylist`. When the loop count is reached, the player advances to the next item.
- Autoplay on add: New valid items are queued to play automatically once added to the list.
- Restart vs Clean All: Restart clears the player and playback state only; Clean All also clears the playlist itself.

## Tech Stack

- Next.js (App Router), TypeScript
- Radix Icons, shadcn/ui components

## Deploy

This is a standard Next.js app and can be deployed to any platform that supports Node.js hosting (e.g., Vercel). Build with `npm run build` and start with `npm start`.
