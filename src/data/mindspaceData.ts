import {
  ConfessionItem,
  DetoxChallenge,
  MovementTip,
  StressEvaluation,
  StressOption,
  StressQuestion,
} from '../types/mindspace';

export const STRESS_OPTIONS: StressOption[] = [
  { label: 'Không bao giờ', value: 0 },
  { label: 'Thỉnh thoảng', value: 1 },
  { label: 'Thường xuyên', value: 2 },
  { label: 'Luôn luôn', value: 3 },
];

export const STRESS_QUESTIONS: StressQuestion[] = [
  {
    id: 'q1',
    text: '1. Trong tuần qua, bạn có cảm thấy khó thư giãn đầu óc vì áp lực điểm số/thi cử không?',
  },
  {
    id: 'q2',
    text: '2. Bạn có đang lo âu quá mức về việc định hướng nghề nghiệp, chọn ngành/trường?',
  },
  {
    id: 'q3',
    text: '3. Bạn có thức khuya lướt video ngắn/mạng xã hội nhiều giờ dù biết ngày mai phải đi học?',
  },
  {
    id: 'q4',
    text: '4. Sau khi giải trí trên mạng, bạn có cảm thấy trống rỗng, mệt mỏi hoặc hối hận vì mất thời gian?',
  },
  {
    id: 'q5',
    text: '5. Bạn có cảm thấy dễ cáu gắt, mất kiên nhẫn với gia đình hoặc bạn bè gần đây?',
  },
];

export function evaluateStressScore(total: number): StressEvaluation {
  if (total <= 4) {
    return {
      total,
      maxScore: 15,
      level: 'Mức độ Căng thẳng Thấp (Tâm lý ổn định)',
      tone: 'low',
      advice:
        'Bạn đang kiểm soát tốt áp lực học tập và thói quen dùng mạng. Hãy duy trì chế độ nghỉ ngơi hợp lý và tiếp tục sử dụng Đồng hồ Pomodoro khi học bài.',
      recommendedTab: 'detox',
      recommendedCta: 'Mở Đồng hồ Tập trung Pomodoro',
    };
  }

  if (total <= 9) {
    return {
      total,
      maxScore: 15,
      level: 'Mức độ Căng thẳng Trung bình (Có dấu hiệu lệ thuộc mạng xã hội)',
      tone: 'moderate',
      advice:
        'Bạn đang chịu áp lực thi cử hoặc định hướng và có xu hướng dùng mạng xã hội để né tránh tạm thời. Hãy chuyển sang Trạm Thư Giãn Nhanh để tập thở 3 phút và thực hiện thử thách Digital Detox tối nay.',
      recommendedTab: 'relax',
      recommendedCta: 'Đến Trạm Thư Giãn Nhanh',
    };
  }

  return {
    total,
    maxScore: 15,
    level: 'Mức độ Căng thẳng Cao (Cần được giải tỏa và hỗ trợ kịp thời)',
    tone: 'high',
    advice:
      'Việc thức khuya hoặc dùng mạng quá nhiều đang làm bạn kiệt sức hơn. Hãy tạm rời màn hình, thực hiện bài tập hít thở điều hòa và chia sẻ tâm sự tại Góc Lắng Nghe Ẩn Danh hoặc liên hệ phòng tư vấn tâm lý nhà trường.',
    recommendedTab: 'confess',
    recommendedCta: 'Chia sẻ tại Góc Lắng Nghe Ẩn Danh',
  };
}

export const MOVEMENT_TIPS: MovementTip[] = [
  {
    id: 'stretch',
    title: 'Giãn cơ cổ, vai và cổ tay',
    description: 'Đứng dậy vươn vai, xoay nhẹ khớp cổ và cổ tay 10 vòng để giải phóng căng cứng khi ngồi học lâu.',
    durationLabel: '2 phút',
  },
  {
    id: 'walk',
    title: 'Đi bộ ngắn không mang điện thoại',
    description: 'Đi bộ quanh hành lang, ban công hoặc sân trường để đổi không khí và tạm ngắt kết nối màn hình.',
    durationLabel: '5 phút',
  },
  {
    id: 'eyes-20-20-20',
    title: 'Quy tắc 20-20-20 bảo vệ thị lực',
    description: 'Nhìn ra xa khoảng 6 mét trong 20 giây để giảm mỏi mắt và điều tiết sau khi học hoặc xem màn hình.',
    durationLabel: '20 giây',
  },
];

export const INITIAL_DETOX_CHALLENGES: DetoxChallenge[] = [
  {
    id: 'no-morning-scroll',
    text: 'Không cầm điện thoại trong 30 phút đầu sau khi thức dậy',
    detail: 'Giúp não bộ tỉnh táo tự nhiên thay vì bị cuốn vào dòng tin tức buổi sáng.',
    completed: false,
  },
  {
    id: 'dnd-study',
    text: 'Bật chế độ "Không làm phiền" trong suốt phiên ôn bài',
    detail: 'Ngắt thông báo mạng xã hội giúp rút ngắn thời gian hoàn thành bài tập.',
    completed: false,
  },
  {
    id: 'sleep-curfew',
    text: 'Đặt điện thoại ngoài tầm với trước 23:00 để bảo vệ giấc ngủ',
    detail: 'Khắc phục thói quen thức khuya lướt video ngắn gây mệt mỏi ngày hôm sau.',
    completed: false,
  },
  {
    id: 'replace-short-video',
    text: 'Thay 15 phút lướt video ngắn bằng tập thở hoặc đi bộ',
    detail: 'Giảm kích thích dopamine tức thì và hạ nhịp căng thẳng thần kinh.',
    completed: false,
  },
  {
    id: 'screen-limit',
    text: 'Kiểm soát tổng thời gian giải trí trên mạng dưới 90 phút/ngày',
    detail: 'Giữ cân bằng giữa kết nối bạn bè, ôn thi và nghỉ ngơi thực tế.',
    completed: false,
  },
];

export const INITIAL_CONFESSIONS: ConfessionItem[] = [
  {
    id: 'seed-1',
    grade: 'Khối 12',
    topic: 'Áp lực thi cử',
    timeLabel: 'Ẩn danh',
    content:
      'Mình rất áp lực vì kỳ thi tốt nghiệp sắp tới mà điểm thi thử vẫn chưa đạt nguyện vọng 1. Tối nào mình cũng lướt mạng đến 1-2h sáng để quên đi nhưng sáng dậy lại càng mệt mỏi hơn.',
    reply:
      'Phản hồi hỗ trợ: Cảm giác lo âu trước kỳ thi là rất tự nhiên. Thay vì thức khuya lướt mạng gây kiệt sức, bạn hãy thử chuyển sang tab "Trạm Thư Giãn Nhanh" để tập thở 3 phút và chia nhỏ mục tiêu ôn tập từng ngày nhé!',
  },
  {
    id: 'seed-2',
    grade: 'Khối 11',
    topic: 'Định hướng nghề nghiệp',
    timeLabel: 'Ẩn danh',
    content:
      'Bố mẹ muốn mình thi ngành Y nhưng mình lại thích thiết kế đồ họa. Mình không biết phải nói chuyện với gia đình thế nào.',
    reply:
      'Phản hồi hỗ trợ: Bạn có thể đặt lịch trao đổi trực tiếp với Giáo viên Tư vấn Tâm lý của trường để được hỗ trợ cách trình bày lộ trình nghề nghiệp thuyết phục với bố mẹ.',
  },
];

export function buildSupportiveReply(content: string, topic: string): string {
  const lower = content.toLowerCase();
  if (lower.includes('ngủ') || lower.includes('khuya') || lower.includes('mạng') || lower.includes('tiktok')) {
    return 'Hệ thống ghi nhận: Thức khuya lướt mạng thường khiến cơ thể càng cạn năng lượng vào hôm sau. Tối nay bạn hãy thử đặt điện thoại xa giường 15 phút sớm hơn và bật âm thanh mưa rơi ở Trạm Thư Giãn Nhanh nhé!';
  }
  if (lower.includes('thi') || lower.includes('điểm') || lower.includes('áp lực')) {
    return 'Hệ thống ghi nhận: Kết quả một bài kiểm tra không định nghĩa toàn bộ giá trị của bạn. Hãy thử chia phần kiến thức còn yếu thành các phiên Pomodoro 25 phút ngắn gọn và cho phép bản thân được nghỉ ngơi đúng lúc.';
  }
  if (topic === 'Định hướng nghề nghiệp' || lower.includes('ngành') || lower.includes('bố mẹ')) {
    return 'Hệ thống ghi nhận: Sự khác biệt mong muốn chọn ngành với gia đình là điều nhiều học sinh THPT gặp phải. Bạn có thể ghi lại 3 lý do cụ thể về sở thích, năng lực của mình và tìm gặp thầy cô Phòng B102 để có thêm góc nhìn đồng hành.';
  }
  return 'Hệ thống ghi nhận: Cảm ơn bạn đã tin tưởng chia sẻ. Hãy thử hít thở sâu 3 nhịp ở Trạm Thư Giãn và nhớ rằng bạn luôn có thầy cô, bạn bè đồng hành!';
}
