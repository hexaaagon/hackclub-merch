import type { FrameManifest } from "@merch/types/frames/marketing-story";

export const manifest: FrameManifest = {
  frameCount: 103,
  fps: 5,
  duration: 20.6,
  r2BaseUrl: "https://merch-cdn.hexaa.sh",
  qualities: {
    "1080p": {
      width: 1920,
      height: 1080,
      zipUrl: "https://merch-cdn.hexaa.sh/merch-story/1080p-frames.zip",
      totalSize: 7073029,
      avgFrameSize: 68670,
      zipSize: 6578074,
    },
    "720p": {
      width: 1280,
      height: 720,
      zipUrl: "https://merch-cdn.hexaa.sh/merch-story/720p-frames.zip",
      totalSize: 3644774,
      avgFrameSize: 35387,
      zipSize: 3460065,
    },
    "480p": {
      width: 854,
      height: 480,
      zipUrl: "https://merch-cdn.hexaa.sh/merch-story/480p-frames.zip",
      totalSize: 1980590,
      avgFrameSize: 19230,
      zipSize: 1874444,
    },
  },
};

export default manifest;
