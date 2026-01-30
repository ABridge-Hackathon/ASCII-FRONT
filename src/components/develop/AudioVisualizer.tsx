"use client";

import { useEffect, useRef, useState } from "react";

interface AudioVisualizerProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

export default function AudioVisualizer({
  localStream,
  remoteStream,
}: AudioVisualizerProps) {
  const [localVolume, setLocalVolume] = useState(0);
  const [remoteVolume, setRemoteVolume] = useState(0);
  const [localMicEnabled, setLocalMicEnabled] = useState(false);
  const [remoteMicEnabled, setRemoteMicEnabled] = useState(false);

  const localAnalyserRef = useRef<AnalyserNode | null>(null);
  const remoteAnalyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // 볼륨 레벨 계산
  const calculateVolume = (analyser: AnalyserNode): number => {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    const average =
      dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    return Math.min(100, (average / 255) * 100);
  };

  // 로컬 오디오 분석 설정
  useEffect(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();

      // 오디오 트랙이 없으면 분석하지 않음
      if (audioTracks.length === 0) {
        setLocalMicEnabled(false);
        return;
      }

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      const source = audioContext.createMediaStreamSource(localStream);
      source.connect(analyser);

      localAnalyserRef.current = analyser;

      // 마이크 트랙 상태 확인
      const audioTrack = audioTracks[0];
      setLocalMicEnabled(audioTrack?.enabled ?? false);

      return () => {
        source.disconnect();
        audioContext.close();
      };
    }
  }, [localStream]);

  // 원격 오디오 분석 설정
  useEffect(() => {
    if (remoteStream) {
      const audioTracks = remoteStream.getAudioTracks();

      // 오디오 트랙이 없으면 분석하지 않음
      if (audioTracks.length === 0) {
        setRemoteMicEnabled(false);
        return;
      }

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      const source = audioContext.createMediaStreamSource(remoteStream);
      source.connect(analyser);

      remoteAnalyserRef.current = analyser;

      // 원격 오디오 트랙 상태 확인
      const audioTrack = audioTracks[0];
      setRemoteMicEnabled(audioTrack?.enabled ?? false);

      return () => {
        source.disconnect();
        audioContext.close();
      };
    }
  }, [remoteStream]);

  // 볼륨 레벨 업데이트 루프
  useEffect(() => {
    const updateVolume = () => {
      if (localAnalyserRef.current) {
        setLocalVolume(calculateVolume(localAnalyserRef.current));
      }
      if (remoteAnalyserRef.current) {
        setRemoteVolume(calculateVolume(remoteAnalyserRef.current));
      }
      animationFrameRef.current = requestAnimationFrame(updateVolume);
    };

    updateVolume();

    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const VolumeBar = ({
    volume,
    label,
    enabled,
  }: {
    volume: number;
    label: string;
    enabled: boolean;
  }) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-white text-sm font-semibold">{label}</span>
        <span className="text-xs text-gray-400">
          {enabled ? "🎤 ON" : "🔇 OFF"}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-100 ${
            enabled
              ? volume > 70
                ? "bg-red-500"
                : volume > 40
                  ? "bg-yellow-500"
                  : "bg-green-500"
              : "bg-gray-600"
          }`}
          style={{ width: `${volume}%` }}
        />
      </div>
      <div className="text-right text-xs text-gray-400 mt-1">
        {Math.round(volume)}%
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <h3 className="text-white font-bold mb-3 text-lg">🎧 오디오 디버그</h3>

      <VolumeBar
        volume={localVolume}
        label="내 마이크 입력"
        enabled={localMicEnabled}
      />

      <VolumeBar
        volume={remoteVolume}
        label="상대방 오디오 출력"
        enabled={remoteMicEnabled}
      />

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>로컬 스트림:</span>
            <span className={localStream ? "text-green-400" : "text-red-400"}>
              {localStream ? "✓ 활성" : "✗ 비활성"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>원격 스트림:</span>
            <span className={remoteStream ? "text-green-400" : "text-red-400"}>
              {remoteStream ? "✓ 활성" : "✗ 비활성"}
            </span>
          </div>
          {localStream && (
            <div className="flex justify-between">
              <span>비디오 트랙:</span>
              <span className="text-blue-400">
                {localStream.getVideoTracks().length}개
              </span>
            </div>
          )}
          {localStream && (
            <div className="flex justify-between">
              <span>오디오 트랙:</span>
              <span className="text-blue-400">
                {localStream.getAudioTracks().length}개
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-yellow-400">
          💡 말하면 볼륨 바가 움직입니다
        </p>
      </div>
    </div>
  );
}
