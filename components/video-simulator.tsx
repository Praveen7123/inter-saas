import { IconPlayerRecord, IconPlayerStop, IconClock, IconCircleFilled, IconUserCheck, IconEye } from "@tabler/icons-react"
import { useState, useEffect, useRef } from "react"
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { auth, db } from "@/lib/firebase/config";
import { sessionService } from "@/services/sessionService";
import { snapshotService } from "@/services/snapshotService";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";

export function VideoSimulator() {
  const { user } = useAuth()
  const [isRecording, setIsRecording] = useState(false)
  const [timer, setTimer] = useState(0)
  const [metrics, setMetrics] = useState({ eyeContact: 0, engagement: 0, confidence: 0 })
  const [loadingAI, setLoadingAI] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null)
  const requestRef = useRef<number | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  // Initialize MediaPipe
  useEffect(() => {
    const initAI = async () => {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );
      faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numFaces: 1
      });
      setLoadingAI(false)
    }
    initAI()
  }, [])

  // AI Processing Loop
  useEffect(() => {
    const processVideo = () => {
      if (videoRef.current && faceLandmarkerRef.current && isRecording) {
        const startTimeMs = performance.now()
        const results = faceLandmarkerRef.current.detectForVideo(videoRef.current, startTimeMs)
        
        if (results.faceLandmarks.length > 0) {
          // Simple heuristic metrics
          const landmarks = results.faceLandmarks[0]
          const leftEye = landmarks[159]
          const rightEye = landmarks[386]
          
          // Heuristic: Face alignment & Eye position
          const eyeDist = Math.abs(leftEye.x - rightEye.x)
          const contact = eyeDist > 0.05 ? 90 : 40 
          const engage = (1 - Math.abs(landmarks[1].x - 0.5)) * 100
          
          setMetrics({
            eyeContact: Math.round(contact),
            engagement: Math.round(engage),
            confidence: Math.round((contact + engage) / 2)
          })
        }
      }
      requestRef.current = requestAnimationFrame(processVideo)
    }

    if (isRecording) {
      requestRef.current = requestAnimationFrame(processVideo)
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [isRecording])

  const startRecording = async () => {
    if (!user) {
      toast.error("Please log in to start a session");
      return;
    }
    
    try {
      const id = await sessionService.createSession(user.uid, 'video');
      setSessionId(id);
      
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (e: any) {
        if (e.name === 'NotAllowedError') {
          // Diagnostic: Check if it's just audio or just video
          try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            throw new Error("MICROPHONE_BLOCKED");
          } catch (vErr: any) {
            if (vErr.message === "MICROPHONE_BLOCKED") throw vErr;
            throw new Error("CAMERA_OR_ALL_BLOCKED");
          }
        }
        throw e;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        toast.promise(sessionService.completeSession(id, blob), {
          loading: 'Saving session...',
          success: 'Session saved successfully!',
          error: 'Error saving session'
        });
        stream.getTracks().forEach(track => track.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
      };
      
      recorder.start();
      setIsRecording(true);
      setTimer(0);
      toast.success("Recording started");
    } catch (err: any) {
      console.error("Recording error:", err);
      if (err.message === "MICROPHONE_BLOCKED") {
        toast.error("Microphone Access Denied: Your system (Windows) is blocking the microphone. Please check Windows Privacy Settings for Microphone.");
      } else if (err.message === "CAMERA_OR_ALL_BLOCKED" || err.name === 'NotAllowedError') {
        toast.error("Camera/System Permission Denied: Please check Windows Privacy Settings for BOTH Camera and Microphone.");
      } else {
        toast.error(`Could not start session [${err.name}]: ${err.message}`);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setSessionId(null);
  };

  const captureSnapshot = async () => {
    if (!canvasRef.current || !videoRef.current || !sessionId) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;
    
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    
    canvasRef.current.toBlob(async (blob) => {
      if (blob) {
        const url = await sessionService.uploadSnapshot(sessionId, blob, Date.now());
        await snapshotService.logSnapshotMetrics(sessionId, metrics, url);
      }
    }, 'image/jpeg');
  };

  // Timer & Snapshots
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const next = prev + 1
          if (next % 10 === 0) captureSnapshot()
          return next
        })
      }, 1000)
    } else {
      setTimer(0)
    }
    return () => interval && clearInterval(interval)
  }, [isRecording, sessionId, metrics])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Video Window */}
      <div className="relative aspect-video bg-muted rounded-xl border overflow-hidden flex items-center justify-center shadow-inner">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" muted playsInline />
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        
        {/* Indicators */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          {isRecording && (
            <Badge variant="destructive" className="animate-pulse gap-1.5 px-3">
              <IconCircleFilled className="size-2" />
              REC
            </Badge>
          )}
          <Badge variant="secondary" className="bg-black/20 text-white backdrop-blur-md border-white/10 uppercase tracking-tighter font-mono">
            {loadingAI ? "Loading AI..." : "AI Connected v2"}
          </Badge>
        </div>

        {/* Timer */}
        <div className="absolute bottom-4 left-4 bg-black/40 text-white backdrop-blur-md px-3 py-1.5 rounded-md font-mono flex items-center gap-2 border border-white/10">
          <IconClock className="size-4" />
          {formatTime(timer)}
        </div>

        {/* AI Metrics Overlay (During Recording) */}
        {isRecording && (
          <div className="absolute bottom-4 right-4 w-40 space-y-2 bg-black/40 backdrop-blur-md p-3 rounded-lg border border-white/10 z-10">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-white/70 uppercase font-bold">
                <span>Eye Contact</span>
                <span>{metrics.eyeContact}%</span>
              </div>
              <Progress value={metrics.eyeContact} className="h-1 bg-white/10" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-white/70 uppercase font-bold">
                <span>Engagement</span>
                <span>{metrics.engagement}%</span>
              </div>
              <Progress value={metrics.engagement} className="h-1 bg-white/10" />
            </div>
          </div>
        )}

        {/* Placeholder UI */}
        {!isRecording && (
          <div className="z-10 flex flex-col items-center gap-4 text-white">
            <div className="size-16 rounded-full border-2 border-dashed border-white/40 flex items-center justify-center">
              <IconPlayerRecord className="size-8" />
            </div>
            <p className="font-medium text-sm">Diagnostic Mode: Click Start to begin</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {!isRecording ? (
          <Button 
            size="lg" 
            className="rounded-full px-8 bg-red-600 hover:bg-red-700 text-white gap-2 transition-all hover:scale-105"
            onClick={startRecording}
            disabled={loadingAI}
          >
            <IconPlayerRecord className="size-5" />
            Start Recording
          </Button>
        ) : (
          <Button 
            size="lg" 
            className="rounded-full px-8 gap-2 transition-all border-2"
            variant="outline"
            onClick={stopRecording}
          >
            <IconPlayerStop className="size-5 fill-current" />
            Stop Recording
          </Button>
        )}
      </div>

      {/* Current Question */}
      <div className="bg-card border rounded-xl p-6 shadow-xs">
        <h3 className="text-primary font-semibold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
            <IconUserCheck className="size-4" />
            Current Question
        </h3>
        <p className="text-xl font-medium leading-normal italic">
          "Tell me about a time you handled a difficult objection from a prospect. How did you turn it around?"
        </p>
      </div>
    </div>
  )
}
