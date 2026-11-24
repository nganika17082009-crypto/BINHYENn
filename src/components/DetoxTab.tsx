import { CheckCircle2, Pause, Play, Plus, RotateCcw, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { INITIAL_DETOX_CHALLENGES } from '../data/mindspaceData';
import { DetoxChallenge } from '../types/mindspace';

type TimerPreset = {
  id: 'focus' | 'sprint' | 'break';
  label: string;
  minutes: number;
};

const TIMER_PRESETS: TimerPreset[] = [
  { id: 'focus', label: '25 phút học tập', minutes: 25 },
  { id: 'sprint', label: '15 phút ôn nhanh', minutes: 15 },
  { id: 'break', label: '5 phút nghỉ mắt', minutes: 5 },
];

const CHALLENGES_STORAGE_KEY = 'mindspace_detox_challenges_v1';
const SESSIONS_STORAGE_KEY = 'mindspace_pomodoro_sessions_v1';

function playGentleChime() {
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.16);
      gain.gain.setValueAtTime(0.001, now + idx * 0.16);
      gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.16 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.16 + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.16);
      osc.stop(now + idx * 0.16 + 0.75);
    });
    window.setTimeout(() => {
      ctx.close().catch(() => undefined);
    }, 1800);
  } catch {
    // Ignore audio errors if blocked
  }
}

export function DetoxTab() {
  const [preset, setPreset] = useState<TimerPreset>(TIMER_PRESETS[0]);
  const [timeLeft, setTimeLeft] = useState(TIMER_PRESETS[0].minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedNotice, setCompletedNotice] = useState(false);

  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
      return raw ? parseInt(raw, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [challenges, setChallenges] = useState<DetoxChallenge[]>(() => {
    try {
      const raw = localStorage.getItem(CHALLENGES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DetoxChallenge[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to defaults
    }
    return INITIAL_DETOX_CHALLENGES;
  });

  const [customChallengeInput, setCustomChallengeInput] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(challenges));
    } catch {
      // Ignore storage quota errors
    }
  }, [challenges]);

  useEffect(() => {
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, String(completedSessions));
    } catch {
      // Ignore storage quota errors
    }
  }, [completedSessions]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          setIsRunning(false);
          setCompletedNotice(true);
          if (preset.id !== 'break') {
            setCompletedSessions((count) => count + 1);
          }
          playGentleChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, preset.id]);

  const handleSelectPreset = (nextPreset: TimerPreset) => {
    setIsRunning(false);
    setPreset(nextPreset);
    setTimeLeft(nextPreset.minutes * 60);
    setCompletedNotice(false);
  };

  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(preset.minutes * 60);
    }
    setCompletedNotice(false);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(preset.minutes * 60);
    setCompletedNotice(false);
  };

  const toggleChallenge = (id: string) => {
    setChallenges((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleAddChallenge = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = customChallengeInput.trim();
    if (!trimmed) return;
    const newItem: DetoxChallenge = {
      id: `custom-${Date.now()}`,
      text: trimmed,
      detail: 'Cam kết cá nhân hôm nay',
      completed: false,
    };
    setChallenges((prev) => [newItem, ...prev]);
    setCustomChallengeInput('');
  };

  const resetChallenges = () => {
    setChallenges((prev) => prev.map((item) => ({ ...item, completed: false })));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes < 10 ? '0' : ''}${minutes}:${
    seconds < 10 ? '0' : ''
  }${seconds}`;

  const totalSeconds = preset.minutes * 60;
  const progressPercent = Math.round(
    ((totalSeconds - timeLeft) / totalSeconds) * 100
  );

  const completedCount = challenges.filter((c) => c.completed).length;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
      {/* Left: Pomodoro Focus Timer */}
      <section className="rounded-2xl border border-[#DCE6E3] bg-white p-6 shadow-xs sm:p-8 lg:col-span-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#17252A] sm:text-2xl">
              Đồng hồ Tập trung Pomodoro
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[#5C6B73]">
              Khắc phục tình trạng 71.9% học sinh dùng mạng trên 4 giờ/ngày và thức khuya lướt mạng xã hội.
            </p>
          </div>
          <span className="font-mono text-xs font-medium tabular-nums text-[#2B7A78] whitespace-nowrap">
            Đã xong {completedSessions} phiên
          </span>
        </div>

        <div
          className="mt-6 inline-flex w-full flex-wrap gap-1.5 rounded-xl bg-[#EEF4F3] p-1.5"
          role="group"
          aria-label="Chọn thời lượng Pomodoro"
        >
          {TIMER_PRESETS.map((item) => {
            const active = preset.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectPreset(item)}
                className={`min-h-[40px] flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                  active
                    ? 'bg-white text-[#17252A] shadow-xs'
                    : 'text-[#52646B] hover:text-[#17252A]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-[#DCE6E3] bg-[#F4F9F8] px-6 py-8 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-[#52646B]">
            <Timer className="h-4 w-4 text-[#1F6E6C]" />
            <span>
              {preset.id === 'break'
                ? 'Thời gian thư giãn mắt & vận động nhẹ'
                : `Phiên học tập tập trung (${preset.minutes} phút)`}
            </span>
          </div>

          <div
            className="mt-3 font-mono text-6xl font-semibold tracking-tight tabular-nums text-[#1F6E6C] sm:text-7xl"
            aria-live="polite"
          >
            {formattedTime}
          </div>

          <div className="mx-auto mt-5 h-1.5 max-w-xs overflow-hidden rounded-full bg-[#DCE9E7]">
            <div
              className="h-full bg-[#1F6E6C] transition-[width] duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {!isRunning ? (
              <button
                type="button"
                onClick={handleStart}
                className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-xl bg-[#1F6E6C] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#175553]"
              >
                <Play className="h-4 w-4" />
                Bắt đầu
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePause}
                className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-xl border border-[#1F6E6C] bg-white px-6 py-2.5 text-sm font-semibold text-[#1F6E6C] transition-colors hover:bg-[#EDF5F4]"
              >
                <Pause className="h-4 w-4" />
                Tạm dừng
              </button>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-xl border border-[#DCE6E3] bg-white px-5 py-2.5 text-sm font-medium text-[#49585F] transition-colors hover:bg-[#F4F7F6]"
            >
              <RotateCcw className="h-4 w-4" />
              Đặt lại
            </button>
          </div>

          <p className="mt-5 text-xs text-[#5C6B73]">
            Mẹo: Đặt điện thoại ở chế độ &quot;Không làm phiền&quot; và úp màn hình xuống cho đến khi hết giờ.
          </p>
        </div>

        {completedNotice && (
          <div
            role="status"
            className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#BFE0D9] bg-[#EAF6F2] p-4 text-sm font-medium text-[#16594A]"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Chúc mừng! Bạn đã hoàn thành phiên tập trung {preset.minutes} phút. Hãy đứng dậy thư giãn mắt 5 phút nhé!
            </span>
          </div>
        )}
      </section>

      {/* Right: Daily Digital Detox Checklist */}
      <section className="rounded-2xl border border-[#DCE6E3] bg-white p-6 shadow-xs sm:p-8 lg:col-span-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#EAEFEF] pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#17252A]">
              Thử thách Digital Detox hôm nay
            </h2>
            <p className="mt-1 text-sm text-[#5C6B73]">
              Từng bước xây dựng thói quen dùng Internet lành mạnh và bảo vệ giấc ngủ.
            </p>
          </div>
          <span className="font-mono text-xs font-semibold tabular-nums text-[#1F6E6C] whitespace-nowrap">
            {completedCount}/{challenges.length} hoàn thành
          </span>
        </div>

        <form onSubmit={handleAddChallenge} className="mt-5 flex gap-2">
          <input
            type="text"
            value={customChallengeInput}
            onChange={(e) => setCustomChallengeInput(e.target.value)}
            placeholder="Thêm cam kết detox riêng của bạn hôm nay..."
            className="min-h-[44px] flex-1 rounded-xl border border-[#DCE6E3] bg-[#F8FBFA] px-3.5 py-2 text-sm text-[#17252A] placeholder:text-[#7A8C93] focus:border-[#1F6E6C] focus:bg-white focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl bg-[#1F6E6C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#175553]"
          >
            <Plus className="h-4 w-4" />
            Thêm
          </button>
        </form>

        <div className="mt-5 space-y-2.5">
          {challenges.map((item) => (
            <label
              key={item.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                item.completed
                  ? 'border-[#BFE0D9] bg-[#F1F8F6]'
                  : 'border-[#E4ECEA] bg-[#FAFDFC] hover:border-[#C2D7D3]'
              }`}
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleChallenge(item.id)}
                className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#1F6E6C]"
              />
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-semibold leading-snug ${
                    item.completed
                      ? 'text-[#2C6B68] line-through'
                      : 'text-[#17252A]'
                  }`}
                >
                  {item.text}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#5C6B73]">
                  {item.detail}
                </p>
              </div>
            </label>
          ))}
        </div>

        {completedCount > 0 && (
          <div className="mt-5 flex items-center justify-between border-t border-[#EAEFEF] pt-4 text-xs">
            <span className="font-medium text-[#2B7A78]">
              {completedCount === challenges.length
                ? 'Tuyệt vời! Bạn đã hoàn tất toàn bộ mục tiêu Detox hôm nay.'
                : 'Tiếp tục duy trì nhịp độ lành mạnh nhé.'}
            </span>
            <button
              type="button"
              onClick={resetChallenges}
              className="font-medium text-[#5C6B73] underline-offset-2 hover:text-[#17252A] hover:underline whitespace-nowrap"
            >
              Đặt lại ngày mới
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
