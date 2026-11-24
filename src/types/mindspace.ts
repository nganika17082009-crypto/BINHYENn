export type TabId = 'test' | 'relax' | 'detox' | 'confess';

export interface StressOption {
  label: string;
  value: number;
}

export interface StressQuestion {
  id: string;
  text: string;
}

export interface StressEvaluation {
  total: number;
  maxScore: number;
  level: string;
  tone: 'low' | 'moderate' | 'high';
  advice: string;
  recommendedTab: TabId;
  recommendedCta: string;
}

export type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale';

export type SoundType = 'rain' | 'waves';

export interface MovementTip {
  id: string;
  title: string;
  description: string;
  durationLabel: string;
}

export interface DetoxChallenge {
  id: string;
  text: string;
  detail: string;
  completed: boolean;
}

export type ConfessionGrade = 'Khối 10' | 'Khối 11' | 'Khối 12' | 'Ẩn danh chung';

export type ConfessionTopic =
  | 'Áp lực thi cử'
  | 'Định hướng nghề nghiệp'
  | 'Mạng xã hội & Giấc ngủ'
  | 'Gia đình & Bạn bè';

export interface ConfessionItem {
  id: string;
  grade: ConfessionGrade;
  topic: ConfessionTopic;
  timeLabel: string;
  content: string;
  reply: string;
  isUserCreated?: boolean;
}
