import { Leaf, PhoneCall } from 'lucide-react';
import { useState } from 'react';
import { ConfessionTab } from './components/ConfessionTab';
import { DetoxTab } from './components/DetoxTab';
import { RelaxationTab } from './components/RelaxationTab';
import { StressTestTab } from './components/StressTestTab';
import { SupportModal } from './components/SupportModal';
import { StressEvaluation, TabId } from './types/mindspace';

interface NavTabItem {
  id: TabId;
  shortLabel: string;
  fullLabel: string;
}

const NAV_TABS: NavTabItem[] = [
  { id: 'test', shortLabel: 'Đo Stress', fullLabel: '1. Đo Mức Độ Stress' },
  { id: 'relax', shortLabel: 'Thư Giãn Nhanh', fullLabel: '2. Trạm Thư Giãn Nhanh' },
  { id: 'detox', shortLabel: 'Digital Detox', fullLabel: '3. Digital Detox & Tập Trung' },
  { id: 'confess', shortLabel: 'Lắng Nghe Ẩn Danh', fullLabel: '4. Góc Lắng Nghe Ẩn Danh' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('test');
  const [lastEvaluation, setLastEvaluation] = useState<StressEvaluation | null>(null);
  const [supportOpen, setSupportOpen] = useState(false);
  const [heroImageError, setHeroImageError] = useState(false);

  const handleNavigateTab = (tab: TabId) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8F7] text-[#17252A]">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="border-b border-[#DCE6E3] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
          <button
            type="button"
            onClick={() => handleNavigateTab('test')}
            className="font-display text-lg font-bold tracking-tight text-[#1F6E6C] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F6E6C]"
          >
            MindSpace THPT
          </button>

          <nav
            aria-label="Phân hệ chính"
            className="hidden md:flex items-center gap-6"
          >
            {NAV_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleNavigateTab(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-2 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F6E6C] ${
                    isActive
                      ? 'text-[#1F6E6C]'
                      : 'text-[#52646B] hover:text-[#17252A]'
                  }`}
                >
                  {tab.shortLabel}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-[15px] h-0.5 bg-[#1F6E6C]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setSupportOpen(true)}
              className="inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap shrink-0 rounded-xl bg-[#1F6E6C] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#175553] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F6E6C] sm:text-sm"
            >
              <PhoneCall className="h-4 w-4" />
              Hỗ trợ 111
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:py-8">
        {/* Compact Editorial Hero Split */}
        <section className="grid grid-cols-1 gap-6 overflow-hidden rounded-2xl border border-[#DCE6E3] bg-white shadow-xs lg:grid-cols-12 lg:items-stretch">
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-7">
            <p className="text-xs font-medium text-[#2B7A78]">
              Sức khỏe tinh thần học đường · THPT
            </p>
            <h1 className="mt-2 max-w-2xl text-2xl font-bold leading-tight tracking-tight text-[#17252A] [text-wrap:balance] sm:text-3xl">
              Không gian số giải tỏa căng thẳng & cân bằng thói quen dùng Internet
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#52646B] sm:text-base">
              Nhận diện sớm áp lực thi cử, thay thế thói quen thức khuya lướt video ngắn bằng hít thở điều hòa, đồng hồ tập trung Pomodoro và góc lắng nghe ẩn danh an toàn.
            </p>

            {/* Quick module switcher for clear workflow & mobile accessibility */}
            <div
              className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap"
              role="tablist"
              aria-label="Chọn chức năng hỗ trợ"
            >
              {NAV_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleNavigateTab(tab.id)}
                    className={`min-h-[42px] whitespace-nowrap shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                      isActive
                        ? 'bg-[#1F6E6C] text-white'
                        : 'border border-[#DCE6E3] bg-[#F7FAF9] text-[#35454B] hover:border-[#B6D0CB] hover:bg-[#EDF5F4]'
                    }`}
                  >
                    {tab.fullLabel}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative min-h-[200px] bg-[#E8F1EF] lg:col-span-5">
            {!heroImageError ? (
              <img
                src="/src/assets/images/hero_mindspace_calm_1795356060825.jpg"
                alt="Góc bàn học yên tĩnh ngập ánh nắng sớm và cây xanh thư giãn"
                referrerPolicy="no-referrer"
                onError={() => setHeroImageError(true)}
                className="h-full w-full object-cover lg:h-full"
              />
            ) : (
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center bg-gradient-to-br from-[#DCECE8] to-[#EDF5F3] p-6 text-center">
                <Leaf className="h-8 w-8 text-[#1F6E6C]" />
                <p className="mt-2 text-sm font-semibold text-[#17252A]">
                  MindSpace THPT
                </p>
                <p className="mt-1 text-xs text-[#52646B]">
                  Không gian học tập tĩnh tại và cân bằng
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Active Module Workspace */}
        <div className="mt-6">
          {activeTab === 'test' && (
            <StressTestTab
              onNavigateTab={handleNavigateTab}
              lastEvaluation={lastEvaluation}
              onSaveEvaluation={setLastEvaluation}
            />
          )}
          {activeTab === 'relax' && <RelaxationTab />}
          {activeTab === 'detox' && <DetoxTab />}
          {activeTab === 'confess' && <ConfessionTab />}
        </div>
      </main>

      <footer className="mt-10 border-t border-[#DCE6E3] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-xs text-[#5C6B73] sm:flex-row sm:px-6 sm:text-left">
          <p>
            Dự án Nghiên cứu Khoa học Kỹ thuật THPT · Giải pháp ứng dụng không gian số hỗ trợ sức khỏe tinh thần học đường.
          </p>
          <button
            type="button"
            onClick={() => setSupportOpen(true)}
            className="font-semibold text-[#1F6E6C] underline-offset-2 hover:underline whitespace-nowrap shrink-0"
          >
            Phòng Tư vấn B102 · Tổng đài 111
          </button>
        </div>
      </footer>

      <SupportModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
    </div>
  );
}
