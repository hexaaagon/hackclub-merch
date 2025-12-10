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
  /**
   * Speed multiplier for the scroll animation.
   * - 0.1: slowest (requires 10x more scroll)
   * - 1.0: default speed
   * - 2.0: fastest (requires 50% less scroll)
   * @default 1.0
   */
  speed?: number;
}
