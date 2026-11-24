import { AlertCircle, MapPin, MessageSquareHeart, Phone, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  INITIAL_CONFESSIONS,
  buildSupportiveReply,
} from '../data/mindspaceData';
import {
  ConfessionGrade,
  ConfessionItem,
  ConfessionTopic,
} from '../types/mindspace';

const CONFESSIONS_STORAGE_KEY = 'mindspace_confessions_v1';

const GRADE_OPTIONS: ConfessionGrade[] = [
  'Ẩn danh chung',
  'Khối 10',
  'Khối 11',
  'Khối 12',
];

const TOPIC_OPTIONS: ConfessionTopic[] = [
  'Áp lực thi cử',
  'Định hướng nghề nghiệp',
  'Mạng xã hội & Giấc ngủ',
  'Gia đình & Bạn bè',
];

export function ConfessionTab() {
  const [confessions, setConfessions] = useState<ConfessionItem[]>(() => {
    try {
      const raw = localStorage.getItem(CONFESSIONS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ConfessionItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to initial seed data
    }
    return INITIAL_CONFESSIONS;
  });

  const [grade, setGrade] = useState<ConfessionGrade>('Ẩn danh chung');
  const [topic, setTopic] = useState<ConfessionTopic>('Áp lực thi cử');
  const [content, setContent] = useState('');
  const [showError, setShowError] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | ConfessionTopic>('all');

  useEffect(() => {
    try {
      localStorage.setItem(CONFESSIONS_STORAGE_KEY, JSON.stringify(confessions));
    } catch {
      // Ignore storage quota errors
    }
  }, [confessions]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) {
      setShowError(true);
      return;
    }

    const newEntry: ConfessionItem = {
      id: `user-${Date.now()}`,
      grade,
      topic,
      timeLabel: 'Vừa xong · Ẩn danh',
      content: trimmed,
      reply: buildSupportiveReply(trimmed, topic),
      isUserCreated: true,
    };

    setConfessions((prev) => [newEntry, ...prev]);
    setContent('');
    setShowError(false);
    setActiveFilter('all');
  };

  const visibleConfessions =
    activeFilter === 'all'
      ? confessions
      : confessions.filter((item) => item.topic === activeFilter);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
      {/* Left: Anonymous Composer + School Support Contacts */}
      <div className="space-y-6 lg:col-span-5">
        <section className="rounded-2xl border border-[#DCE6E3] bg-white p-6 shadow-xs sm:p-7">
          <h2 className="text-xl font-bold text-[#17252A]">
            Góc Lắng Nghe Ẩn Danh
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-[#5C6B73]">
            Nơi bạn có thể giải tỏa áp lực thi cử, chọn ngành nghề một cách an toàn, không phán xét (đáp ứng nhu cầu của 39% học sinh khảo sát).
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="confess-grade"
                  className="block text-xs font-semibold text-[#49585F]"
                >
                  Khối lớp
                </label>
                <select
                  id="confess-grade"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as ConfessionGrade)}
                  className="mt-1.5 min-h-[42px] w-full rounded-xl border border-[#DCE6E3] bg-[#F8FBFA] px-3 text-sm text-[#17252A] focus:border-[#1F6E6C] focus:bg-white focus:outline-none"
                >
                  {GRADE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="confess-topic"
                  className="block text-xs font-semibold text-[#49585F]"
                >
                  Chủ đề chia sẻ
                </label>
                <select
                  id="confess-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value as ConfessionTopic)}
                  className="mt-1.5 min-h-[42px] w-full rounded-xl border border-[#DCE6E3] bg-[#F8FBFA] px-3 text-sm text-[#17252A] focus:border-[#1F6E6C] focus:bg-white focus:outline-none"
                >
                  {TOPIC_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="confessionInput"
                className="block text-xs font-semibold text-[#49585F]"
              >
                Điều bạn đang băn khoăn hoặc muốn giãi bày
              </label>
              <textarea
                id="confessionInput"
                rows={4}
                maxLength={600}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (showError) setShowError(false);
                }}
                placeholder="Viết ra những áp lực điểm số, chuyện thức khuya hay khó khăn khi nói chuyện với gia đình... Mọi chia sẻ đều hoàn toàn ẩn danh."
                className="mt-1.5 w-full resize-y rounded-xl border border-[#DCE6E3] bg-[#F8FBFA] p-3.5 text-sm leading-relaxed text-[#17252A] placeholder:text-[#7A8C93] focus:border-[#1F6E6C] focus:bg-white focus:outline-none"
              />
              <div className="mt-1 flex items-center justify-between text-xs text-[#6B7C83]">
                <span>Không lưu tên hay tài khoản cá nhân</span>
                <span className="font-mono tabular-nums">{content.length}/600</span>
              </div>
            </div>

            {showError && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-xl border border-[#ECC6BE] bg-[#FDF3F1] px-3.5 py-2.5 text-sm font-medium text-[#A23B2A]"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Bạn hãy nhập nội dung chia sẻ trước khi bấm gửi nhé!</span>
              </div>
            )}

            <button
              type="submit"
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#1F6E6C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#175553]"
            >
              <Send className="h-4 w-4" />
              Gửi tâm sự ẩn danh
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-[#DCE6E3] bg-[#EDF4F2] p-6">
          <h3 className="text-base font-bold text-[#17252A]">
            Kênh hỗ trợ khẩn cấp & Tư vấn chuyên sâu
          </h3>
          <div className="mt-4 space-y-3 text-sm text-[#394A51]">
            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#1F6E6C]" />
              <div>
                <p className="font-semibold text-[#17252A]">
                  Phòng Tư vấn Tâm lý Học đường
                </p>
                <p className="mt-0.5 text-[#52646B]">
                  Phòng B102 · Giờ hành chính các ngày trong tuần.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 border-t border-[#D6E4E1] pt-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#1F6E6C]" />
              <div>
                <p className="font-semibold text-[#17252A]">
                  Tổng đài Quốc gia Bảo vệ Trẻ em: <span className="font-mono text-[#1F6E6C]">111</span>
                </p>
                <p className="mt-0.5 text-[#52646B]">
                  Miễn phí 24/7 để được chuyên gia tâm lý lắng nghe.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Right: Community Confessions Feed */}
      <section className="rounded-2xl border border-[#DCE6E3] bg-white p-6 shadow-xs sm:p-8 lg:col-span-7">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#EAEFEF] pb-4">
          <div className="flex items-center gap-2">
            <MessageSquareHeart className="h-5 w-5 text-[#1F6E6C]" />
            <h2 className="text-xl font-bold text-[#17252A]">
              Chia sẻ gần đây từ cộng đồng học sinh
            </h2>
          </div>
          <span className="font-mono text-xs tabular-nums text-[#5C6B73]">
            {visibleConfessions.length} chia sẻ
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Lọc tâm sự theo chủ đề">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`min-h-[36px] whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeFilter === 'all'
                ? 'bg-[#1F6E6C] text-white'
                : 'bg-[#F1F6F5] text-[#49585F] hover:bg-[#E4EEEC]'
            }`}
          >
            Tất cả
          </button>
          {TOPIC_OPTIONS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveFilter(item)}
              className={`min-h-[36px] whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeFilter === item
                  ? 'bg-[#1F6E6C] text-white'
                  : 'bg-[#F1F6F5] text-[#49585F] hover:bg-[#E4EEEC]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-4">
          {visibleConfessions.length === 0 ? (
            <div className="rounded-xl border border-[#E6EEEC] bg-[#F8FBFA] p-6 text-center text-sm text-[#5C6B73]">
              Chưa có chia sẻ nào trong chủ đề này. Bạn có thể gửi tâm sự đầu tiên ở khung bên cạnh.
            </div>
          ) : (
            visibleConfessions.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-[#E3ECEA] bg-[#FAFDFC] p-5"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#5C6B73]">
                  <span className="font-semibold text-[#1F6E6C]">
                    Học sinh {item.grade}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{item.timeLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.topic}</span>
                </div>

                <p className="mt-2.5 text-sm leading-relaxed text-[#17252A] sm:text-[15px]">
                  &ldquo;{item.content}&rdquo;
                </p>

                <div className="mt-3.5 rounded-lg bg-[#EAF4F2] px-4 py-3 text-sm leading-relaxed text-[#184E4C]">
                  {item.reply}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
