import { AlertTriangle, ArrowRight, CheckCircle2, ClipboardCheck, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import {
  STRESS_OPTIONS,
  STRESS_QUESTIONS,
  evaluateStressScore,
} from '../data/mindspaceData';
import { StressEvaluation, TabId } from '../types/mindspace';

interface StressTestTabProps {
  onNavigateTab: (tab: TabId) => void;
  lastEvaluation: StressEvaluation | null;
  onSaveEvaluation: (evaluation: StressEvaluation) => void;
}

export function StressTestTab({
  onNavigateTab,
  lastEvaluation,
  onSaveEvaluation,
}: StressTestTabProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showError, setShowError] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === STRESS_QUESTIONS.length;

  const handleSelect = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (showError) {
      setShowError(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!allAnswered) {
      setShowError(true);
      return;
    }
    const total = STRESS_QUESTIONS.reduce(
      (sum, question) => sum + (answers[question.id] ?? 0),
      0
    );
    const evaluation = evaluateStressScore(total);
    onSaveEvaluation(evaluation);
  };

  const handleReset = () => {
    setAnswers({});
    setShowError(false);
  };

  const toneStyles = (tone: StressEvaluation['tone']) => {
    if (tone === 'low') {
      return {
        wrapper: 'border-[#BFE0D9] bg-[#EEF7F5]',
        badgeText: 'text-[#1A5E5C]',
        label: 'Ổn định',
      };
    }
    if (tone === 'moderate') {
      return {
        wrapper: 'border-[#E7D4B5] bg-[#FCF7EE]',
        badgeText: 'text-[#8C5A14]',
        label: 'Cần điều chỉnh',
      };
    }
    return {
      wrapper: 'border-[#ECC6BE] bg-[#FDF3F1]',
      badgeText: 'text-[#A23B2A]',
      label: 'Mức cao · Cần giải tỏa',
    };
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
      <section className="rounded-2xl border border-[#DCE6E3] bg-white p-6 shadow-xs sm:p-8 lg:col-span-7">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#EAEFEF] pb-5">
          <div>
            <h2 className="text-xl font-bold text-[#17252A] sm:text-2xl">
              Đánh giá nhanh trạng thái căng thẳng hiện tại
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[#5C6B73]">
              Nhận diện đúng mức độ áp lực học tập và thi cử trước khi quyết định lướt mạng xã hội vô định.
            </p>
          </div>
          <span className="font-mono text-xs font-medium tabular-nums text-[#2B7A78] whitespace-nowrap shrink-0">
            {answeredCount}/{STRESS_QUESTIONS.length} câu hỏi
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {STRESS_QUESTIONS.map((question) => {
            const selectedValue = answers[question.id];
            return (
              <fieldset
                key={question.id}
                className="border-b border-[#F0F4F3] pb-6 last:border-b-0 last:pb-0"
              >
                <legend className="text-base font-semibold leading-snug text-[#17252A]">
                  {question.text}
                </legend>
                <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {STRESS_OPTIONS.map((option) => {
                    const isChecked = selectedValue === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors ${
                          isChecked
                            ? 'border-[#1F6E6C] bg-[#EAF4F3] text-[#144B49]'
                            : 'border-[#E2EAE8] bg-[#F8FBFA] text-[#3B4B52] hover:border-[#B9D2CE] hover:bg-[#F1F7F6]'
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.value}
                          checked={isChecked}
                          onChange={() => handleSelect(question.id, option.value)}
                          className="h-4 w-4 accent-[#1F6E6C]"
                        />
                        <span className="leading-tight">{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}

          {showError && (
            <div
              role="alert"
              className="flex items-center gap-2.5 rounded-xl border border-[#ECC6BE] bg-[#FDF3F1] px-4 py-3 text-sm font-medium text-[#A23B2A]"
            >
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Vui lòng chọn đầy đủ cả 5 câu hỏi trước khi xem kết quả nhé!</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap shrink-0 rounded-xl bg-[#1F6E6C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#175553] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F6E6C]"
            >
              <ClipboardCheck className="h-4 w-4" />
              Xem kết quả & Lộ trình gợi ý
            </button>

            {answeredCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap shrink-0 rounded-xl border border-[#DCE6E3] bg-white px-4 py-2.5 text-sm font-medium text-[#49585F] transition-colors hover:bg-[#F4F7F6]"
              >
                <RotateCcw className="h-4 w-4" />
                Chọn lại
              </button>
            )}
          </div>
        </form>
      </section>

      <aside className="space-y-5 lg:col-span-5">
        {lastEvaluation ? (
          <div
            className={`rounded-2xl border p-6 shadow-xs sm:p-7 ${
              toneStyles(lastEvaluation.tone).wrapper
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                  toneStyles(lastEvaluation.tone).badgeText
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                {toneStyles(lastEvaluation.tone).label}
              </span>
              <span className="font-mono text-sm font-semibold tabular-nums text-[#17252A]">
                {lastEvaluation.total}/{lastEvaluation.maxScore} điểm
              </span>
            </div>

            <h3 className="mt-3 text-lg font-bold leading-snug text-[#17252A]">
              {lastEvaluation.level}
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-[#35454B]">
              {lastEvaluation.advice}
            </p>

            <button
              type="button"
              onClick={() => onNavigateTab(lastEvaluation.recommendedTab)}
              className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#1F6E6C] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#175553]"
            >
              <span>{lastEvaluation.recommendedCta}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#DCE6E3] bg-white p-6 shadow-xs sm:p-7">
            <h3 className="text-base font-bold text-[#17252A]">
              Thang đánh giá nhanh 0 – 15 điểm
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#5C6B73]">
              Hoàn thành 5 câu hỏi bên cạnh để nhận phân tích mức độ căng thẳng và gợi ý công cụ phù hợp ngay lúc này.
            </p>
            <dl className="mt-5 space-y-3 border-t border-[#EAEFEF] pt-4 text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="font-medium text-[#1F6E6C]">0 – 4 điểm</dt>
                <dd className="text-right text-[#5C6B73]">Tâm lý ổn định</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="font-medium text-[#8C5A14]">5 – 9 điểm</dt>
                <dd className="text-right text-[#5C6B73]">Căng thẳng trung bình</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="font-medium text-[#A23B2A]">10 – 15 điểm</dt>
                <dd className="text-right text-[#5C6B73]">Căng thẳng cao · Cần hỗ trợ</dd>
              </div>
            </dl>
          </div>
        )}

        <div className="rounded-2xl border border-[#DCE6E3] bg-[#EDF4F2] p-6">
          <h3 className="text-sm font-bold text-[#17252A]">
            Ghi chú tự quan sát cho học sinh THPT
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#46575D]">
            Lướt video ngắn lúc mệt mỏi tạo cảm giác giải khuây tạm thời nhưng khiến não bộ tiếp nhận quá nhiều kích thích và khó đi vào giấc ngủ sâu. Thử dành 3 phút điều hòa nhịp thở trước khi mở mạng xã hội.
          </p>
        </div>
      </aside>
    </div>
  );
}
