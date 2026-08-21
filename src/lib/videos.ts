import videosData from '../data/videos.json';
import type { Video } from './types';

/**
 * Every video the feed knows about, Shorts included. Rarely what you want —
 * prefer `videos` below.
 */
export const todosOsVideos = videosData as Video[];

/**
 * The videos the site shows. Shorts are excluded deliberately: the site is for
 * the full motovlogs, and a 9:16 clip next to them reads as a different thing.
 *
 * Filtered here rather than in scripts/sync-videos.mjs on purpose — the sync
 * still records Shorts and their `isShort` flag, so this is one line to undo
 * and no history is lost. Absent `isShort` means "not known to be a Short",
 * which is the safe default for a 16:9 layout.
 *
 * Every page and component reads videos through this module so the rule lives
 * in one place.
 */
export const videos = todosOsVideos.filter((video) => video.isShort !== true);
