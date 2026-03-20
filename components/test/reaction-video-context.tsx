"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ReactionVideoContextValue = {
  supported: boolean;
  consent: "idle" | "accepted" | "declined";
  isRecording: boolean;
  isUploading: boolean;
  uploadedPath?: string;
  error?: string;
  acceptAndStart: () => Promise<void>;
  skipVideo: () => void;
  finalizeRecording: () => Promise<string | undefined>;
};

const ReactionVideoContext = createContext<ReactionVideoContextValue | null>(null);

type ReactionVideoProviderProps = {
  slug: string;
  children: ReactNode;
};

export function ReactionVideoProvider({
  slug,
  children,
}: ReactionVideoProviderProps) {
  const [supported, setSupported] = useState(false);
  const [consent, setConsent] = useState<"idle" | "accepted" | "declined">("idle");
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPath, setUploadedPath] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    setSupported(
      typeof window !== "undefined" &&
        typeof navigator !== "undefined" &&
        Boolean(navigator.mediaDevices?.getUserMedia) &&
        typeof MediaRecorder !== "undefined",
    );
  }, []);

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
    setIsRecording(false);
  }, []);

  useEffect(() => cleanupStream, [cleanupStream]);

  const uploadBlob = useCallback(
    async (blob: Blob) => {
      const file = new File([blob], `reaction-${Date.now()}.webm`, {
        type: blob.type || "video/webm",
      });
      const formData = new FormData();
      formData.append("slug", slug);
      formData.append("video", file);

      const response = await fetch("/api/reaction-video", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Video upload failed.");
      }

      const data = (await response.json()) as { path?: string };
      return data.path;
    },
    [slug],
  );

  const acceptAndStart = useCallback(async () => {
    if (!supported || uploadedPath) {
      return;
    }

    setError(undefined);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
          ? "video/webm;codecs=vp8,opus"
          : "video/webm",
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.start(1000);
      recorderRef.current = recorder;
      setConsent("accepted");
      setIsRecording(true);
    } catch {
      setConsent("declined");
      setError("Camera permission was not granted. The test can continue without video.");
      cleanupStream();
    }
  }, [cleanupStream, supported, uploadedPath]);

  const skipVideo = useCallback(() => {
    cleanupStream();
    setConsent("declined");
    setError(undefined);
  }, [cleanupStream]);

  const finalizeRecording = useCallback(async () => {
    if (uploadedPath) {
      return uploadedPath;
    }

    if (consent !== "accepted" || !recorderRef.current) {
      return undefined;
    }

    setIsUploading(true);
    setError(undefined);

    try {
      const recorder = recorderRef.current;

      const blob = await new Promise<Blob>((resolve, reject) => {
        recorder.onstop = async () => {
          try {
            const builtBlob = new Blob(chunksRef.current, {
              type: recorder.mimeType || "video/webm",
            });
            resolve(builtBlob);
          } catch (uploadError) {
            reject(uploadError);
          }
        };

        if (recorder.state !== "inactive") {
          recorder.stop();
        } else {
          resolve(
            new Blob(chunksRef.current, {
              type: recorder.mimeType || "video/webm",
            }),
          );
        }
      });

      cleanupStream();

      if (blob.size === 0) {
        return undefined;
      }

      const path = await uploadBlob(blob);
      setUploadedPath(path);
      return path;
    } catch {
      setError("Video could not be uploaded, but the test can still be submitted.");
      cleanupStream();
      return undefined;
    } finally {
      setIsUploading(false);
    }
  }, [cleanupStream, consent, uploadBlob, uploadedPath]);

  const value = useMemo(
    () => ({
      supported,
      consent,
      isRecording,
      isUploading,
      uploadedPath,
      error,
      acceptAndStart,
      skipVideo,
      finalizeRecording,
    }),
    [
      supported,
      consent,
      isRecording,
      isUploading,
      uploadedPath,
      error,
      acceptAndStart,
      skipVideo,
      finalizeRecording,
    ],
  );

  return (
    <ReactionVideoContext.Provider value={value}>
      {children}
    </ReactionVideoContext.Provider>
  );
}

export function useReactionVideo() {
  const context = useContext(ReactionVideoContext);

  if (!context) {
    throw new Error("useReactionVideo must be used within ReactionVideoProvider");
  }

  return context;
}

export function ReactionVideoConsentCard() {
  const {
    supported,
    consent,
    isRecording,
    isUploading,
    uploadedPath,
    error,
    acceptAndStart,
    skipVideo,
  } = useReactionVideo();

  useEffect(() => {
    if (supported && consent === "idle") {
      void acceptAndStart();
    }
  }, [acceptAndStart, consent, supported]);

  if (!supported) {
    return null;
  }

  return (
    <div className="">
      
    </div>
  );
}
