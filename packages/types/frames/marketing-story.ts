export interface FrameManifest {
  frameCount: number;
  fps: number;
  duration: number;
  r2BaseUrl: string;
  qualities: {
    [key: string]: {
      width: number;
      height: number;
      zipUrl: string;
      totalSize: number;
      avgFrameSize: number;
      zipSize: number;
    };
  };
}

export interface VideoScrollAnimationProps {
  className?: string;
}
