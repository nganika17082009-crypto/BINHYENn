import { Phone, MapPin, ShieldCheck, X } from 'lucide-react';
import { useEffect } from 'react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-[#DCE6E3] bg-white p-6 shadow-xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#2B7A78]">Kết nối trực tiếp · Bảo mật thông tin</p>
            <h2 id="support-modal-title" className="mt-1 text-xl font-bold text-[#17252A]">
              Kênh hỗ trợ khẩn cấp & Tư vấn chuyên sâu
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ hỗ trợ"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#DCE6E3] text-[#5C6B73] transition-colors hover:bg-[#F1F6F5] hover:text-[#17252A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F6E6C]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-[#5C6B73]">
          Nếu bạn đang cảm thấy quá tải, mất ngủ kéo dài hoặc cần một người lớn đáng tin cậy lắng nghe, đừng giữ một mình. Bạn luôn có thể liên hệ ngay:
        </p>

        <div className="mt-5 space-y-3">
          <div className="rounded-xl border border-[#DCE6E3] bg-[#F7FAF9] p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E4F0EE] text-[#1F6E6C]">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#17252A]">
                  Phòng Tư vấn Tâm lý Học đường
                </h3>
                <p className="mt-1 text-sm text-[#49585F]">
                  Phòng B102 · Giờ hành chính các ngày trong tuần (Thứ 2 – Thứ 6).
                </p>
                <p className="mt-1 text-xs text-[#5C6B73]">
                  Hỗ trợ trao đổi trực tiếp về áp lực thi cử, định hướng ngành nghề và giao tiếp gia đình.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#CFE2DF] bg-[#EDF5F4] p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1F6E6C] text-white">
                <Phone className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[#17252A]">
                    Tổng đài Quốc gia Bảo vệ Trẻ em
                  </h3>
                  <span className="font-mono text-base font-semibold tabular-nums text-[#1F6E6C]">
                    111
                  </span>
                </div>
                <p className="mt-1 text-sm text-[#394A51]">
                  Miễn phí cước gọi 24/7 trên toàn quốc để được chuyên gia tâm lý lắng nghe và tư vấn kịp thời.
                </p>
                <a
                  href="tel:111"
                  className="mt-3 inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap rounded-lg bg-[#1F6E6C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#175553] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F6E6C]"
                >
                  <Phone className="h-4 w-4" />
                  Gọi ngay 111
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#E6EEEC] pt-4">
          <div className="flex items-center gap-2 text-xs text-[#5C6B73]">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#2B7A78]" />
            <span>Mọi cuộc trao đổi đều được tôn trọng và bảo mật.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] shrink-0 whitespace-nowrap rounded-lg border border-[#DCE6E3] bg-white px-4 py-2 text-sm font-medium text-[#17252A] transition-colors hover:bg-[#F1F6F5]"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
