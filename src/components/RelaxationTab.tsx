import { Eye, Pause, Play, Volume2, VolumeX, Waves, CloudRain, Activity } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MOVEMENT_TIPS } from '../data/mindspaceData';
import { BreathPhase, SoundType } from '../types/mindspace';

const PHASE_DURATION_SECONDS = 4;

const PHASE_META: Record<
  BreathPhase,
  { label: string; instruction: string; scaleClass: string }
> = {
  idle: {
    label: 'Sẵn sàng',
    instruction: 'Nhấn bắt đầu để tập thở nhịp 4-4-4',
    scaleClass: 'scale-100 bg-[#3AAFA9] shadow-[0_0_24px_rgba(58,175,169,0.3)]',
  },
  inhale: {
    label: 'HÍT VÀO',
    instruction: 'Hít sâu bằng mũi trong 4 giây...',
    scaleClass: 'scale-[1.34] bg-[#1F6E6C] shadow-[0_0_38px_rgba(31,110,108,0.42)]',
  },
  hold: {
    label: 'GIỮ HƠI',
    instruction: 'Giữ nhịp thở nhẹ nhàng trong 4 giây...',
    scaleClass: 'scale-[1.34] bg-[#2B7A78] shadow-[0_0_34px_rgba(43,122,120,0.38)]',
  },
  exhale: {
    label: 'THỞ RA',
    instruction: 'Thở ra từ từ bằng miệng trong 4 giây...',
    scaleClass: 'scale-95 bg-[#4B9B7E] shadow-[0_0_20px_rgba(75,155,126,0.28)]',
  },
};

export function RelaxationTab() {
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(PHASE_DURATION_SECONDS);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const [activeSound, setActiveSound] = useState<SoundType | null>(null);
  const [volume, setVolume] = useState(0.55);
  const [imageFailed, setImageFailed] = useState(false);

  const [eyeRestSeconds, setEyeRestSeconds] = useState<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!isBreathing) return;

    const phases: BreathPhase[] = ['inhale', 'hold', 'exhale'];
    let phaseIndex = 0;
    let remaining = PHASE_DURATION_SECONDS;

    setPhase('inhale');
    setPhaseSecondsLeft(PHASE_DURATION_SECONDS);

    const timer = window.setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        const nextIndex = (phaseIndex + 1) % phases.length;
        if (nextIndex === 0) {
          setCyclesCompleted((prev) => prev + 1);
        }
        phaseIndex = nextIndex;
        remaining = PHASE_DURATION_SECONDS;
        setPhase(phases[phaseIndex]);
      }
      setPhaseSecondsLeft(remaining);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isBreathing]);

  useEffect(() => {
    if (eyeRestSeconds === null) return;
    if (eyeRestSeconds <= 0) {
      const resetTimeout = window.setTimeout(() => setEyeRestSeconds(null), 2200);
      return () => window.clearTimeout(resetTimeout);
    }
    const timer = window.setTimeout(() => {
      setEyeRestSeconds((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [eyeRestSeconds]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(
        volume,
        audioCtxRef.current.currentTime,
        0.05
      );
    }
  }, [volume]);

  const stopAmbientSound = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch {
        // Ignore already-stopped nodes
      }
      sourceNodeRef.current = null;
    }
    if (gainNodeRef.current) {
      try {
        gainNodeRef.current.disconnect();
      } catch {
        // Ignore disconnect errors
      }
      gainNodeRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientSound();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => undefined);
      }
    };
  }, []);

  const toggleSound = async (type: SoundType) => {
    if (activeSound === type) {
      stopAmbientSound();
      setActiveSound(null);
      return;
    }

    stopAmbientSound();

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContextClass();
    }
    const ctx = audioCtxRef.current;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    if (type === 'rain') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.055;
      }
    } else {
      let b0 = 0;
      let b1 = 0;
      let b2 = 0;
      let b3 = 0;
      let b4 = 0;
      let b5 = 0;
      let b6 = 0;
      for (let j = 0; j < bufferSize; j++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        output[j] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.022;
        b6 = white * 0.115926;
      }
    }

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = type === 'rain' ? 1800 : 850;

    const gainNode = ctx.createGain();
    gainNode.gain.value = volume;

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start(0);
    sourceNodeRef.current = source;
    gainNodeRef.current = gainNode;
    setActiveSound(type);
  };

  const toggleBreathing = () => {
    if (isBreathing) {
      setIsBreathing(false);
      setPhase('idle');
      setPhaseSecondsLeft(PHASE_DURATION_SECONDS);
    } else {
      setIsBreathing(true);
    }
  };

  const currentPhaseMeta = PHASE_META[phase];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
      {/* Left: Primary Breathing Stage */}
      <section className="flex flex-col justify-between rounded-2xl border border-[#DCE6E3] bg-white p-6 shadow-xs sm:p-8 lg:col-span-7">
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-bold text-[#17252A] sm:text-2xl">
              Trạm Thư Giãn Tức Thì
            </h2>
            <span className="font-mono text-xs font-medium tabular-nums text-[#2B7A78]">
              {cyclesCompleted} chu kỳ hoàn thành
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-[#5C6B73]">
            Thay thế lướt video ngắn: chỉ cần 3 phút hít thở điều hòa nhịp tim và lắng nghe âm thanh tự nhiên giúp hạ căng thẳng thần kinh hiệu quả.
          </p>
        </div>

        <div className="relative my-6 flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#DCE6E3] bg-[#EAF3F1] px-6 py-10">
          {!imageFailed ? (
            <img
              src="/src/assets/images/relax_nature_mist_1795356061124.jpg"
              alt="Mặt hồ tĩnh lặng giữa rừng cây xanh mát"
              referrerPolicy="no-referrer"
              onError={() => setImageFailed(true)}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
            />
          ) : null}

          <div className="relative z-10 flex flex-col items-center">
            <div className="flex h-48 w-48 items-center justify-center">
              <div
                className={`breathing-orb flex h-32 w-32 flex-col items-center justify-center rounded-full text-center text-white ${currentPhaseMeta.scaleClass}`}
              >
                <span className="font-display text-base font-bold tracking-wide">
                  {currentPhaseMeta.label}
                </span>
                {isBreathing && (
                  <span className="mt-1 font-mono text-sm font-semibold tabular-nums opacity-90">
                    {phaseSecondsLeft}s
                  </span>
                )}
              </div>
            </div>

            <p className="mt-4 text-center text-sm font-semibold text-[#17252A]">
              {currentPhaseMeta.instruction}
            </p>

            <button
              type="button"
              onClick={toggleBreathing}
              className={`mt-5 inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F6E6C] ${
                isBreathing
                  ? 'border border-[#1F6E6C] bg-white text-[#1F6E6C] hover:bg-[#F1F8F7]'
                  : 'bg-[#1F6E6C] text-white hover:bg-[#175553]'
              }`}
            >
              {isBreathing ? (
                <>
                  <Pause className="h-4 w-4" />
                  Dừng tập thở
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Bắt đầu bài tập thở
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EAEFEF] pt-4 text-xs text-[#5C6B73]">
          <span>Nhịp 4-4-4 chuẩn: 4s hít vào · 4s giữ hơi · 4s thở ra</span>
          <span>Gợi ý thực hiện 4–6 chu kỳ mỗi lần nghỉ</span>
        </div>
      </section>

      {/* Right: Ambient Sound & 5-min Movement */}
      <aside className="flex flex-col gap-6 lg:col-span-5">
        <div className="rounded-2xl border border-[#DCE6E3] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-bold text-[#17252A]">
              Âm thanh thiên nhiên thư giãn
            </h3>
            {activeSound ? (
              <Volume2 className="h-4 w-4 text-[#1F6E6C]" />
            ) : (
              <VolumeX className="h-4 w-4 text-[#829399]" />
            )}
          </div>
          <p className="mt-1.5 text-sm text-[#5C6B73]">
            Bấm để bật hoặc tắt âm thanh nền giúp tập trung ôn bài hoặc dễ ngủ.
          </p>

          <div className="mt-4 space-y-2.5">
            <button
              type="button"
              onClick={() => toggleSound('rain')}
              className={`flex min-h-[46px] w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                activeSound === 'rain'
                  ? 'border-[#1F6E6C] bg-[#1F6E6C] text-white'
                  : 'border-[#DCE6E3] bg-[#F8FBFA] text-[#17252A] hover:border-[#B6D0CB] hover:bg-[#F0F7F6]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <CloudRain className="h-4 w-4 shrink-0" />
                <span>Tiếng mưa rơi đều</span>
              </span>
              <span className="text-xs font-medium opacity-85 whitespace-nowrap">
                {activeSound === 'rain' ? 'Đang phát' : 'Nhấn để bật'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => toggleSound('waves')}
              className={`flex min-h-[46px] w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                activeSound === 'waves'
                  ? 'border-[#1F6E6C] bg-[#1F6E6C] text-white'
                  : 'border-[#DCE6E3] bg-[#F8FBFA] text-[#17252A] hover:border-[#B6D0CB] hover:bg-[#F0F7F6]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Waves className="h-4 w-4 shrink-0" />
                <span>Tiếng sóng biển êm dịu</span>
              </span>
              <span className="text-xs font-medium opacity-85 whitespace-nowrap">
                {activeSound === 'waves' ? 'Đang phát' : 'Nhấn để bật'}
              </span>
            </button>
          </div>

          <div className="mt-4 border-t border-[#EAEFEF] pt-4">
            <div className="flex items-center justify-between text-xs font-medium text-[#5C6B73]">
              <label htmlFor="ambient-volume">Âm lượng nền</label>
              <span className="font-mono tabular-nums text-[#17252A]">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <input
              id="ambient-volume"
              type="range"
              min={0.05}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="mt-2 h-2 w-full cursor-pointer accent-[#1F6E6C]"
            />
          </div>
        </div>

        <div className="flex-1 rounded-2xl border border-[#DCE6E3] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-base font-bold text-[#17252A]">
              <Activity className="h-4 w-4 text-[#1F6E6C]" />
              <span>Gợi ý vận động 5 phút</span>
            </h3>
            <span className="text-xs font-medium text-[#5C6B73]">
              70.7% nhu cầu khảo sát
            </span>
          </div>

          <ul className="mt-4 space-y-3.5">
            {MOVEMENT_TIPS.map((tip) => (
              <li
                key={tip.id}
                className="border-b border-[#F0F4F3] pb-3.5 last:border-b-0 last:pb-0"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-[#17252A]">{tip.title}</p>
                  <span className="font-mono text-xs tabular-nums text-[#2B7A78] whitespace-nowrap">
                    {tip.durationLabel}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-[#5C6B73]">
                  {tip.description}
                </p>
                {tip.id === 'eyes-20-20-20' && (
                  <button
                    type="button"
                    onClick={() =>
                      setEyeRestSeconds((prev) => (prev === null ? 20 : null))
                    }
                    className="mt-2.5 inline-flex min-h-[36px] items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#CFE2DF] bg-[#EFF6F5] px-3 py-1.5 text-xs font-semibold text-[#1F6E6C] transition-colors hover:bg-[#E1EFECE6]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    {eyeRestSeconds === null
                      ? 'Đếm ngược 20s nghỉ mắt'
                      : eyeRestSeconds === 0
                      ? 'Đã hoàn thành 20s nghỉ mắt'
                      : `Nhìn ra xa: còn ${eyeRestSeconds}s (Nhấn để hủy)`}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
