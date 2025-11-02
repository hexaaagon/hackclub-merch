// this thing purely written by claude,
// i dont know how videoscroll works.
//
// even though, i edited most of the code below
// since AI generates a very bad code fr.
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import JSZip from "jszip";

import { manifest } from "@merch/config/frames/marketing-story";
import type { VideoScrollAnimationProps } from "@merch/types/frames/marketing-story";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// IndexedDB cache for persistent frame storage
const DB_NAME = "merch-frames-cache";
const DB_VERSION = 2; // Increment version for ZIP-based cache
const STORE_NAME = "frames";
const META_STORE_NAME = "metadata";

interface LoadingState {
  stage: "idle" | "downloading" | "extracting" | "ready" | "error";
  progress: number;
  message: string;
  currentFrame?: number;
  totalFrames?: number;
}

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

        // Create frames store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }

        // Create metadata store if it doesn't exist
        if (!db.objectStoreNames.contains(META_STORE_NAME)) {
          db.createObjectStore(META_STORE_NAME);
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

  async getMetadata(key: string): Promise<any> {
    if (!this.db) await this.init();
    const db = this.db;
    if (!db) return null;

    return new Promise((resolve) => {
      const transaction = db.transaction([META_STORE_NAME], "readonly");
      const store = transaction.objectStore(META_STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }

  async setMetadata(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();
    const db = this.db;
    if (!db) return;

    return new Promise((resolve) => {
      const transaction = db.transaction([META_STORE_NAME], "readwrite");
      const store = transaction.objectStore(META_STORE_NAME);
      store.put(value, key);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve(); // Silent fail
    });
  }

  async hasQuality(quality: string): Promise<boolean> {
    const metadata = await this.getMetadata(`${quality}-cached`);
    return metadata === true;
  }
}

const frameDB = new FrameCacheDB();

export function VideoScrollAnimation({ className }: VideoScrollAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinElementRef = useRef<HTMLDivElement>(null);

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
  // Track if initialization has started to prevent multiple calls
  const initStartedRef = useRef<boolean>(false);

  // Loading state
  const [loadingState, setLoadingState] = useState<LoadingState>({
    stage: "idle",
    progress: 0,
    message: "",
  });

  // Download and extract ZIP file
  const downloadAndExtractZip = useCallback(
    async (quality: string, zipUrl: string): Promise<void> => {
      try {
        setLoadingState({
          stage: "downloading",
          progress: 0,
          message: "Downloading frames...",
        });

        // Download ZIP with progress tracking
        const response = await fetch(zipUrl, { cache: "force-cache" });
        if (!response.ok) {
          throw new Error(`Failed to download ZIP: ${response.statusText}`);
        }

        const contentLength = parseInt(
          response.headers.get("Content-Length") || "0",
          10,
        );
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Response body is not readable");
        }

        const chunks: Uint8Array[] = [];
        let receivedLength = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
          receivedLength += value.length;

          if (contentLength > 0) {
            const progress = Math.round((receivedLength / contentLength) * 100);
            setLoadingState({
              stage: "downloading",
              progress,
              message: `Downloading frames... ${progress}%`,
            });
          }
        }

        // Combine chunks into single Uint8Array
        const zipData = new Uint8Array(receivedLength);
        let position = 0;
        for (const chunk of chunks) {
          zipData.set(chunk, position);
          position += chunk.length;
        }

        // Extract ZIP
        setLoadingState({
          stage: "extracting",
          progress: 0,
          message: "Extracting frames...",
          totalFrames: manifest.frameCount,
        });

        const zip = await JSZip.loadAsync(zipData);
        const fileNames = Object.keys(zip.files).filter((name) =>
          name.endsWith(".webp"),
        );

        let extracted = 0;
        for (const fileName of fileNames) {
          const file = zip.files[fileName];
          if (file.dir) continue;

          const blob = await file.async("blob");
          const frameMatch = fileName.match(/frame_(\d+)\.webp/);
          if (frameMatch) {
            const frameIndex = parseInt(frameMatch[1], 10) - 1; // 0-indexed
            const cacheKey = `${quality}-${frameIndex}`;
            await frameDB.set(cacheKey, blob);

            extracted++;
            const progress = Math.round((extracted / fileNames.length) * 100);
            setLoadingState({
              stage: "extracting",
              progress,
              message: `Extracting frames... ${extracted}/${fileNames.length}`,
              currentFrame: extracted,
              totalFrames: fileNames.length,
            });
          }
        }

        // Mark quality as cached
        await frameDB.setMetadata(`${quality}-cached`, true);

        setLoadingState({
          stage: "ready",
          progress: 100,
          message: "Ready",
        });
      } catch (err) {
        console.error("Failed to download and extract ZIP:", err);
        setLoadingState({
          stage: "error",
          progress: 0,
          message: "Failed to load frames. Please refresh the page.",
        });
        throw err;
      }
    },
    [], // setLoadingState is stable from useState
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: downloadAndExtractZip is stable and initStartedRef prevents multiple calls
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

    // Initialize ZIP loading
    const initFrames = async () => {
      // Prevent multiple initializations
      if (initStartedRef.current) return;
      initStartedRef.current = true;

      try {
        await frameDB.init();

        // Check if frames are already cached
        const isCached = await frameDB.hasQuality(quality);

        if (!isCached) {
          // Download and extract ZIP
          await downloadAndExtractZip(quality, qualityConfig.zipUrl);
        } else {
          setLoadingState({
            stage: "ready",
            progress: 100,
            message: "Loaded from cache",
          });
        }
      } catch (err) {
        console.error("Failed to initialize frames:", err);
        setLoadingState({
          stage: "error",
          progress: 0,
          message: "Failed to load frames. Please refresh the page.",
        });
      }
    };

    // Only initialize if not already ready/loading
    if (loadingState.stage === "idle") {
      initFrames();
    }

    // Load a single frame from IndexedDB cache
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

      // Load from IndexedDB
      return frameDB
        .get(frameKey)
        .then((cachedBlob) => {
          if (!cachedBlob) {
            loadingFrames.current.delete(frameIndex);
            throw new Error(`Frame ${frameIndex} not found in cache`);
          }

          // Load from cached blob
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
            img.src = URL.createObjectURL(cachedBlob);
          });
        })
        .catch((err) => {
          console.warn(`Failed to load frame ${frameIndex}:`, err);
          loadingFrames.current.delete(frameIndex);
          throw err;
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
    let trigger: ScrollTrigger | null = null;

    const setupScrollTrigger = () => {
      if (loadingState.stage !== "ready") {
        // Wait for frames to be ready
        return;
      }

      trigger = ScrollTrigger.create({
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
    };

    // Setup scroll trigger when frames are ready
    if (loadingState.stage === "ready") {
      setupScrollTrigger();
    }

    // Cleanup
    return () => {
      if (trigger) {
        trigger.kill();
      }
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
      frameCache.current.clear();
      loadingFrames.current.clear();
      // Reset init flag on cleanup
      initStartedRef.current = false;
    };
  }, [loadingState.stage]);

  // Calculate scroll height based on frame count
  // Using 1.5vh per frame to prevent gap: 103 frames * 1.5vh = 154.5vh
  const scrollHeight = manifest ? `${manifest.frameCount * 1.5}vh` : "150vh";

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height: scrollHeight }}
    >
      <div ref={pinElementRef} className="relative h-screen w-full">
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

        {/* Loading UI */}
        {loadingState.stage !== "ready" && loadingState.stage !== "idle" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 text-white">
            <div className="max-w-md space-y-4 px-4 text-center">
              {loadingState.stage === "error" ? (
                <>
                  <div className="font-semibold text-red-500 text-xl">
                    ⚠️ Error
                  </div>
                  <p>{loadingState.message}</p>
                </>
              ) : (
                <>
                  <div className="font-semibold text-lg">
                    {loadingState.message}
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-700">
                    <div
                      className="h-2.5 rounded-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${loadingState.progress}%` }}
                    />
                  </div>
                  {loadingState.stage === "extracting" &&
                    loadingState.currentFrame &&
                    loadingState.totalFrames && (
                      <p className="text-gray-400 text-sm">
                        {loadingState.currentFrame} / {loadingState.totalFrames}{" "}
                        frames
                      </p>
                    )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
