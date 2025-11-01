// this thing purely written by claude,
// i dont know how videoscroll works.
//
// even though, i edited most of the code below
// since AI generates a very bad code fr.
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// IndexedDB cache for persistent frame storage
const DB_NAME = "merch-frames-cache";
const DB_VERSION = 1;
const STORE_NAME = "frames";

class FrameCacheDB {
  private db: IDBDatabase | null = null;

  async init() {
    if (this.db) return;

    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
    });
  }

  async get(key: string): Promise<Blob | null> {
    if (!this.db) await this.init();
    const db = this.db;
    if (!db) return null;

    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }

  async set(key: string, value: Blob): Promise<void> {
    if (!this.db) await this.init();
    const db = this.db;
    if (!db) return;

    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      store.put(value, key);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve(); // Silent fail
    });
  }
}

const frameDB = new FrameCacheDB();

interface FrameManifest {
  frameCount: number;
  fps: number;
  duration: number;
  qualities: {
    [key: string]: {
      width: number;
      height: number;
      basePath: string;
      pattern: string;
      totalSize: number;
      avgFrameSize: number;
    };
  };
}

interface VideoScrollAnimationProps {
  className?: string;
}

export function VideoScrollAnimation({ className }: VideoScrollAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinElementRef = useRef<HTMLDivElement>(null);
  const [manifest, setManifest] = useState<FrameManifest | null>(null);

  // Frame cache: Map<frameIndex, HTMLImageElement>
  const frameCache = useRef<Map<number, HTMLImageElement>>(new Map());
  // Currently loading frames to prevent duplicate requests
  const loadingFrames = useRef<Set<number>>(new Set());
  // Current frame index
  const currentFrameRef = useRef<number>(0);
  // Selected quality
  const qualityRef = useRef<string>("720p");
  // Preload timeout for debouncing
  const preloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Last frame for velocity calculation
  const lastFrameRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Load manifest
    fetch("/static/frames/merch-story/manifest.json")
      .then((res) => res.json())
      .then((data: FrameManifest) => {
        setManifest(data);
      })
      .catch((err) => console.error("Failed to load frame manifest:", err));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const backgroundCanvas = backgroundCanvasRef.current;
    const container = containerRef.current;
    const pinElement = pinElementRef.current;

    if (!canvas || !backgroundCanvas || !container || !pinElement || !manifest)
      return;

    const ctx = canvas.getContext("2d");
    const bgCtx = backgroundCanvas.getContext("2d");
    if (!ctx || !bgCtx) return;

    // Detect device and connection to select quality
    const selectQuality = (): string => {
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

      // Network Information API
      const connection = (
        navigator as unknown as { connection?: { effectiveType?: string } }
      ).connection;

      if (isMobile) {
        // Mobile: use 480p to save bandwidth
        return "480p";
      } else if (isTablet) {
        // Tablet: use 720p
        return "720p";
      } else {
        // Desktop: check connection
        if (
          connection?.effectiveType === "4g" ||
          connection?.effectiveType === "5g"
        ) {
          return "1080p";
        }
        return "720p";
      }
    };

    const quality = selectQuality();
    qualityRef.current = quality;
    const qualityConfig = manifest.qualities[quality];

    // Set canvas size to match quality dimensions
    canvas.width = qualityConfig.width;
    canvas.height = qualityConfig.height;
    backgroundCanvas.width = qualityConfig.width;
    backgroundCanvas.height = qualityConfig.height;

    // Load a single frame with IndexedDB persistent cache
    const loadFrame = (frameIndex: number): Promise<HTMLImageElement> => {
      // Check memory cache first (synchronous)
      const cachedFrame = frameCache.current.get(frameIndex);
      if (cachedFrame) {
        return Promise.resolve(cachedFrame);
      }

      // Check if already loading
      if (loadingFrames.current.has(frameIndex)) {
        // Wait for it to finish loading
        return new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            const loadedFrame = frameCache.current.get(frameIndex);
            if (loadedFrame) {
              clearInterval(checkInterval);
              resolve(loadedFrame);
            }
          }, 50);
        });
      }

      loadingFrames.current.add(frameIndex);

      const frameKey = `${quality}-${frameIndex}`;
      const framePath = `${qualityConfig.basePath}/${qualityConfig.pattern.replace("%04d", String(frameIndex).padStart(4, "0"))}`;

      // Load from network and cache
      const loadFromNetwork = (): Promise<HTMLImageElement> => {
        return fetch(framePath, {
          cache: "force-cache", // Use browser cache aggressively
        })
          .then((response) => response.blob())
          .then(async (blob) => {
            // Store in IndexedDB for future page loads
            try {
              await frameDB.set(frameKey, blob);
            } catch (err) {
              console.warn("IndexedDB write failed:", err);
            }

            // Create image from blob
            return new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.onload = () => {
                frameCache.current.set(frameIndex, img);
                loadingFrames.current.delete(frameIndex);
                resolve(img);
              };
              img.onerror = () => {
                loadingFrames.current.delete(frameIndex);
                reject(new Error(`Failed to load frame ${frameIndex}`));
              };
              img.src = URL.createObjectURL(blob);
            });
          })
          .catch((err) => {
            loadingFrames.current.delete(frameIndex);
            throw err;
          });
      };

      // Try IndexedDB cache first, then network
      return frameDB
        .get(frameKey)
        .then((cachedBlob) => {
          if (cachedBlob) {
            // Load from IndexedDB (no R2 request!)
            return new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.onload = () => {
                frameCache.current.set(frameIndex, img);
                loadingFrames.current.delete(frameIndex);
                resolve(img);
              };
              img.onerror = () => {
                // If cached blob fails, fall back to network
                loadFromNetwork().then(resolve).catch(reject);
              };
              img.src = URL.createObjectURL(cachedBlob);
            });
          } else {
            // Not in IndexedDB, load from network
            return loadFromNetwork();
          }
        })
        .catch((err) => {
          console.warn("IndexedDB read failed, using network:", err);
          return loadFromNetwork();
        });
    };

    // Preload frames around current position (debounced for fast scrolling)
    const preloadFrames = (
      centerFrame: number,
      windowSize = 10,
      immediate = false,
    ) => {
      // Clear existing timeout
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }

      const doPreload = () => {
        const startFrame = Math.max(
          0,
          centerFrame - Math.floor(windowSize / 2),
        );
        const endFrame = Math.min(
          manifest.frameCount - 1,
          centerFrame + Math.floor(windowSize / 2),
        );

        // Load frames in priority order: center first, then radiating outward
        const framesToLoad: number[] = [centerFrame];
        for (let offset = 1; offset <= Math.floor(windowSize / 2); offset++) {
          if (centerFrame - offset >= startFrame)
            framesToLoad.push(centerFrame - offset);
          if (centerFrame + offset <= endFrame)
            framesToLoad.push(centerFrame + offset);
        }

        // Load frames
        framesToLoad.forEach((frameIndex) => {
          if (
            !frameCache.current.has(frameIndex) &&
            !loadingFrames.current.has(frameIndex)
          ) {
            loadFrame(frameIndex).catch(() => {}); // Silent fail for background preloads
          }
        });

        // Desktop: evict frames outside window to save memory
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) {
          const framesToKeep = new Set(framesToLoad);
          for (const [frameIndex] of frameCache.current) {
            if (!framesToKeep.has(frameIndex)) {
              frameCache.current.delete(frameIndex);
            }
          }
        }
        // Mobile: keep all loaded frames in cache
      };

      if (immediate) {
        // Immediate preload (for initial load or when scroll stops)
        doPreload();
      } else {
        // Debounce preloading during fast scrolling (wait 150ms after last scroll)
        preloadTimeoutRef.current = setTimeout(doPreload, 150);
      }
    };

    // Draw frame to canvas (with object-fit: contain behavior)
    // From frame 75+, also draw blurred background with cover
    const drawFrame = async (frameIndex: number) => {
      try {
        const img = await loadFrame(frameIndex);

        // Clear both canvases
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bgCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

        // Draw blurred background (object-fit: cover at 125% scale) for frames 75+
        if (frameIndex >= 75) {
          const canvasAspect = backgroundCanvas.width / backgroundCanvas.height;
          const imgAspect = img.width / img.height;

          let bgDrawWidth = backgroundCanvas.width;
          let bgDrawHeight = backgroundCanvas.height;
          let bgOffsetX = 0;
          let bgOffsetY = 0;

          if (imgAspect > canvasAspect) {
            // Image is wider - fit to height (cover)
            bgDrawWidth = backgroundCanvas.height * imgAspect;
            bgOffsetX = (backgroundCanvas.width - bgDrawWidth) / 2;
          } else {
            // Image is taller - fit to width (cover)
            bgDrawHeight = backgroundCanvas.width / imgAspect;
            bgOffsetY = (backgroundCanvas.height - bgDrawHeight) / 2;
          }

          // Scale to 125%
          const scale = 1.25;
          bgDrawWidth *= scale;
          bgDrawHeight *= scale;
          bgOffsetX = (backgroundCanvas.width - bgDrawWidth) / 2;
          bgOffsetY = (backgroundCanvas.height - bgDrawHeight) / 2;

          // Apply blur filter
          bgCtx.filter = "blur(10px)";
          bgCtx.drawImage(img, bgOffsetX, bgOffsetY, bgDrawWidth, bgDrawHeight);
          bgCtx.filter = "none"; // Reset filter
        }

        // Draw main frame (object-fit: contain)
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = img.width / img.height;

        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let offsetX = 0;
        let offsetY = 0;

        if (imgAspect > canvasAspect) {
          // Image is wider - fit to width
          drawHeight = canvas.width / imgAspect;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          // Image is taller - fit to height
          drawWidth = canvas.height * imgAspect;
          offsetX = (canvas.width - drawWidth) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        currentFrameRef.current = frameIndex;
      } catch (err) {
        console.error(`Failed to draw frame ${frameIndex}:`, err);
      }
    };

    // GSAP ScrollTrigger setup for frame scrubbing
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      pin: pinElement, // Pin the inner element
      pinSpacing: false, // Don't add spacing
      anticipatePin: 1, // Smoother pinning
      scrub: 0.5, // Slight smoothing for better feel
      onUpdate: (self) => {
        // Calculate target frame based on scroll progress
        // Clamp to ensure we stay within bounds
        const targetFrame = Math.min(
          manifest.frameCount - 1,
          Math.max(0, Math.floor(self.progress * (manifest.frameCount - 1))),
        );

        // Calculate velocity (frames jumped per time)
        const now = Date.now();
        const timeDelta = now - lastFrameTimeRef.current;
        const frameDelta = Math.abs(targetFrame - lastFrameRef.current);
        const velocity = timeDelta > 0 ? frameDelta / timeDelta : 0;

        lastFrameRef.current = targetFrame;
        lastFrameTimeRef.current = now;

        // Draw frame if it's different from current
        if (targetFrame !== currentFrameRef.current) {
          drawFrame(targetFrame);

          // Only preload if scrolling slowly (velocity < 0.5 frames/ms)
          // or debounce preload during fast scrolling
          if (velocity < 0.5) {
            // Slow scroll - preload immediately with smaller window
            preloadFrames(targetFrame, 5, true);
          } else {
            // Fast scroll - debounce preload (waits 150ms after scroll stops)
            preloadFrames(targetFrame, 10, false);
          }
        }
      },
    });

    // Initial load: draw first frame and preload initial window
    drawFrame(0).then(() => {
      preloadFrames(0, 10, true);
    });

    // Cleanup
    return () => {
      trigger.kill();
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
      frameCache.current.clear();
      loadingFrames.current.clear();
    };
  }, [manifest]);

  // Calculate scroll height based on frame count
  // Using 1.5vh per frame to prevent gap: 103 frames * 1.5vh = 154.5vh
  const scrollHeight = manifest ? `${manifest.frameCount * 1.5}vh` : "150vh";

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height: scrollHeight }}
    >
      <div ref={pinElementRef} className="h-screen w-full">
        {/* Background canvas - blurred, cover (shows from frame 75+) */}
        <canvas
          ref={backgroundCanvasRef}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Main canvas - contain */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
    </div>
  );
}
