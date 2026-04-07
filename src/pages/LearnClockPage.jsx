import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiArrowRight,
  FiHome,
  FiBookOpen,
  FiSettings,
  FiRefreshCw,
  FiCheck,
  FiX,
  FiPlay,
  FiAward,
} from 'react-icons/fi';
import PremiumButton from '../components/common/PremiumButton';
import PremiumCard from '../components/common/PremiumCard';

/* ============================================================
   COMPONENT: AnalogClock (SVG)
   ============================================================ */
function AnalogClock({
  hour = 10,
  minute = 10,
  second = 0,
  size = 320,
  showSeconds = true,
  showNumbers = true,
  showMinuteLabels = false,
  highlight = null, // 'hour' | 'minute' | 'second' | null
  theme = 'classic',
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 12;

  const themes = {
    classic: {
      face: '#fef9c3',
      faceInner: '#fef3c7',
      border: '#92400e',
      hour: '#1e293b',
      minute: '#1e293b',
      second: '#dc2626',
      number: '#1e293b',
      tick: '#78350f',
    },
    ocean: {
      face: '#dbeafe',
      faceInner: '#eff6ff',
      border: '#1e40af',
      hour: '#0c4a6e',
      minute: '#0c4a6e',
      second: '#06b6d4',
      number: '#1e3a8a',
      tick: '#1e40af',
    },
    forest: {
      face: '#dcfce7',
      faceInner: '#f0fdf4',
      border: '#15803d',
      hour: '#14532d',
      minute: '#14532d',
      second: '#f59e0b',
      number: '#14532d',
      tick: '#166534',
    },
    candy: {
      face: '#fce7f3',
      faceInner: '#fdf2f8',
      border: '#be185d',
      hour: '#831843',
      minute: '#831843',
      second: '#fb923c',
      number: '#831843',
      tick: '#9d174d',
    },
  };
  const colors = themes[theme] || themes.classic;

  const hourAngle = ((hour % 12) + minute / 60 + second / 3600) * 30;
  const minuteAngle = (minute + second / 60) * 6;
  const secondAngle = second * 6;

  const angleToCoord = (angleDeg, length) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + length * Math.cos(rad),
      y: cy + length * Math.sin(rad),
    };
  };

  const hourEnd = angleToCoord(hourAngle, r * 0.5);
  const minuteEnd = angleToCoord(minuteAngle, r * 0.72);
  const secondEnd = angleToCoord(secondAngle, r * 0.82);

  const minuteTicks = Array.from({ length: 60 }, (_, i) => i);
  const hourPositions = Array.from({ length: 12 }, (_, i) => i);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="drop-shadow-2xl"
    >
      <defs>
        <radialGradient id={`face-${theme}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={colors.faceInner} />
          <stop offset="100%" stopColor={colors.face} />
        </radialGradient>
      </defs>

      {/* Outer ring */}
      <circle
        cx={cx}
        cy={cy}
        r={r + 6}
        fill="none"
        stroke={colors.border}
        strokeWidth="3"
        opacity="0.4"
      />
      {/* Face */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={`url(#face-${theme})`}
        stroke={colors.border}
        strokeWidth="6"
      />

      {/* Minute ticks */}
      {minuteTicks.map((i) => {
        const angle = i * 6;
        const isHour = i % 5 === 0;
        const inner = angleToCoord(angle, r * (isHour ? 0.86 : 0.92));
        const outer = angleToCoord(angle, r * 0.97);
        return (
          <line
            key={`tick-${i}`}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
            stroke={colors.tick}
            strokeWidth={isHour ? 3 : 1}
            strokeLinecap="round"
            opacity={isHour ? 1 : 0.5}
          />
        );
      })}

      {/* Hour numbers */}
      {showNumbers &&
        hourPositions.map((i) => {
          const num = i === 0 ? 12 : i;
          const angle = i * 30;
          const pos = angleToCoord(angle, r * 0.74);
          return (
            <text
              key={`num-${i}`}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={size * 0.1}
              fontWeight="bold"
              fill={colors.number}
              fontFamily="system-ui, sans-serif"
            >
              {num}
            </text>
          );
        })}

      {/* Minute labels (5, 10, 15...) */}
      {showMinuteLabels &&
        hourPositions.map((i) => {
          const angle = i * 30;
          const pos = angleToCoord(angle, r * 0.55);
          return (
            <text
              key={`min-${i}`}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={size * 0.05}
              fontWeight="bold"
              fill="#dc2626"
              fontFamily="system-ui, sans-serif"
            >
              {i * 5}
            </text>
          );
        })}

      {/* Hour hand */}
      <line
        x1={cx}
        y1={cy}
        x2={hourEnd.x}
        y2={hourEnd.y}
        stroke={colors.hour}
        strokeWidth={size * 0.028}
        strokeLinecap="round"
        opacity={highlight && highlight !== 'hour' ? 0.25 : 1}
      />

      {/* Minute hand */}
      <line
        x1={cx}
        y1={cy}
        x2={minuteEnd.x}
        y2={minuteEnd.y}
        stroke={colors.minute}
        strokeWidth={size * 0.018}
        strokeLinecap="round"
        opacity={highlight && highlight !== 'minute' ? 0.25 : 1}
      />

      {/* Second hand */}
      {showSeconds && (
        <line
          x1={cx}
          y1={cy}
          x2={secondEnd.x}
          y2={secondEnd.y}
          stroke={colors.second}
          strokeWidth={size * 0.008}
          strokeLinecap="round"
          opacity={highlight && highlight !== 'second' ? 0.25 : 1}
        />
      )}

      {/* Center cap */}
      <circle cx={cx} cy={cy} r={size * 0.03} fill={colors.hour} />
      {showSeconds && (
        <circle cx={cx} cy={cy} r={size * 0.012} fill={colors.second} />
      )}
    </svg>
  );
}

/* ============================================================
   LESSONS DATA
   ============================================================ */
const LESSONS = [
  {
    id: 1,
    level: 'Cơ bản',
    title: 'Bài 1: Làm quen với đồng hồ kim',
    intro: 'Chào con! Hôm nay chúng ta sẽ học cách xem đồng hồ kim nhé! 🕐',
    points: [
      { icon: '👉', text: 'Đồng hồ kim có 3 cây kim quan trọng.' },
      { icon: '🟦', text: 'Kim NGẮN nhất là KIM GIỜ — chỉ giờ.' },
      { icon: '🟪', text: 'Kim DÀI hơn là KIM PHÚT — chỉ phút.' },
      { icon: '🟥', text: 'Kim MẢNH (thường màu đỏ) là KIM GIÂY — chỉ giây.' },
      { icon: '🔢', text: 'Trên đồng hồ có 12 con số, từ 1 đến 12.' },
      { icon: '🔄', text: 'Các kim quay theo chiều: 12 → 1 → 2 → 3 → ...' },
    ],
    clock: { hour: 10, minute: 10, second: 30, highlight: null },
  },
  {
    id: 2,
    level: 'Cơ bản',
    title: 'Bài 2: Phân biệt 3 kim',
    intro: 'Hãy nhìn kỹ vào đồng hồ và phân biệt 3 kim nhé!',
    points: [
      { icon: '🟦', text: 'KIM GIỜ ngắn và mập — đi RẤT chậm.' },
      { icon: '🟪', text: 'KIM PHÚT dài hơn — đi nhanh hơn kim giờ.' },
      { icon: '🟥', text: 'KIM GIÂY mảnh nhất — chạy nhanh nhất, "tích tắc tích tắc".' },
      { icon: '⏱️', text: '60 giây = 1 phút. Kim giây đi 1 vòng = 1 phút trôi qua.' },
      { icon: '🕑', text: '60 phút = 1 giờ. Kim phút đi 1 vòng = 1 giờ trôi qua.' },
    ],
    clock: { hour: 3, minute: 25, second: 40, highlight: null },
  },
  {
    id: 3,
    level: 'Cơ bản',
    title: 'Bài 3: Đọc giờ đúng',
    intro: 'Bây giờ ta học cách đọc "giờ đúng" — dễ lắm!',
    points: [
      { icon: '⭐', text: 'Khi KIM PHÚT chỉ vào số 12, ta gọi là "giờ đúng".' },
      { icon: '👀', text: 'Lúc đó, KIM GIỜ chỉ vào số nào thì ta đọc số đó.' },
      { icon: '✅', text: 'Ví dụ: Kim phút ở số 12, kim giờ ở số 3 → 3 GIỜ đúng.' },
      { icon: '🎯', text: 'Cứ như vậy: 4 giờ, 5 giờ, 6 giờ... đều đọc theo kim giờ.' },
    ],
    clock: { hour: 3, minute: 0, second: 0, highlight: 'hour' },
  },
  {
    id: 4,
    level: 'Cơ bản',
    title: 'Bài 4: Mỗi số = 5 phút',
    intro: 'Đây là một bí mật giúp con đọc phút thật nhanh! 🤫',
    points: [
      { icon: '🔢', text: 'Khoảng cách giữa 2 số liền nhau trên đồng hồ = 5 phút.' },
      { icon: '➕', text: 'Số 1 = 5 phút, số 2 = 10 phút, số 3 = 15 phút...' },
      { icon: '➕', text: 'Số 6 = 30 phút (nửa giờ), số 9 = 45 phút.' },
      { icon: '🏁', text: 'Số 12 = 0 phút (hoặc 60 phút = giờ tròn mới).' },
      { icon: '💡', text: 'Con chỉ cần lấy số đó × 5 là ra phút!' },
    ],
    clock: { hour: 12, minute: 0, second: 0, highlight: 'minute', showMinuteLabels: true },
  },
  {
    id: 5,
    level: 'Trung bình',
    title: 'Bài 5: Đọc giờ rưỡi',
    intro: 'Khi kim phút chỉ vào số 6, đó là "giờ rưỡi" (30 phút).',
    points: [
      { icon: '⏰', text: 'Kim phút ở số 6 → 30 phút (nửa giờ).' },
      { icon: '🟦', text: 'Lúc này kim giờ nằm GIỮA hai số.' },
      { icon: '⬅️', text: 'Ta đọc theo số NHỎ HƠN ở phía bên trái.' },
      { icon: '✅', text: 'Ví dụ: Kim giờ ở giữa 2 và 3, kim phút ở số 6 → 2 giờ 30 phút (2 giờ rưỡi).' },
    ],
    clock: { hour: 2, minute: 30, second: 0, highlight: null },
  },
  {
    id: 6,
    level: 'Trung bình',
    title: 'Bài 6: Đọc phút bất kỳ',
    intro: 'Bây giờ ta đọc phút theo kim phút chỉ vào bất kỳ số nào!',
    points: [
      { icon: '👉', text: 'Đếm số mà kim phút đang chỉ vào.' },
      { icon: '✖️', text: 'Lấy số đó × 5 = số phút.' },
      { icon: '✅', text: 'Ví dụ: Kim phút ở số 4 → 4 × 5 = 20 phút.' },
      { icon: '✅', text: 'Kim phút ở số 7 → 7 × 5 = 35 phút.' },
      { icon: '📌', text: 'Đọc như sau: "GIỜ ... PHÚT ..." Ví dụ: 8 giờ 20 phút.' },
    ],
    clock: { hour: 8, minute: 20, second: 0, highlight: 'minute', showMinuteLabels: true },
  },
  {
    id: 7,
    level: 'Nâng cao',
    title: 'Bài 7: Đọc giây',
    intro: 'Kim giây chạy nhanh nhất — "tích tắc tích tắc". 🎵',
    points: [
      { icon: '🟥', text: 'Kim giây mảnh và thường có màu đỏ.' },
      { icon: '⚡', text: 'Kim giây chạy 1 vòng = 60 giây = 1 phút.' },
      { icon: '🔢', text: 'Cũng giống kim phút: số 1 = 5 giây, số 2 = 10 giây...' },
      { icon: '✅', text: 'Ví dụ: Kim giây chỉ vào số 6 → 30 giây.' },
      { icon: '📌', text: 'Đọc đầy đủ: "8 giờ 20 phút 30 giây".' },
    ],
    clock: { hour: 8, minute: 20, second: 30, highlight: 'second' },
  },
  {
    id: 8,
    level: 'Nâng cao',
    title: 'Bài 8: Tổng hợp - Đọc giờ phút giây',
    intro: 'Bây giờ con đã biết cách đọc cả 3 kim! Hãy luyện tập thật nhiều nhé! 🎉',
    points: [
      { icon: '1️⃣', text: 'Xem KIM GIỜ (ngắn) chỉ ở đâu để biết GIỜ.' },
      { icon: '2️⃣', text: 'Xem KIM PHÚT (dài) — lấy số đó × 5 = PHÚT.' },
      { icon: '3️⃣', text: 'Xem KIM GIÂY (mảnh) — lấy số đó × 5 = GIÂY.' },
      { icon: '🗣️', text: 'Đọc to: "... GIỜ ... PHÚT ... GIÂY".' },
      { icon: '🏆', text: 'Cố gắng luyện tập mỗi ngày để giỏi hơn nhé!' },
    ],
    clock: { hour: 7, minute: 45, second: 20, highlight: null },
  },
];

/* ============================================================
   PRACTICE HELPERS
   ============================================================ */
function generateRandomTime(level) {
  // level: 'easy' (giờ đúng), 'medium' (×5 phút), 'hard' (giờ phút giây)
  const hour = Math.floor(Math.random() * 12) + 1;
  let minute = 0;
  let second = 0;
  if (level === 'easy') {
    minute = 0;
  } else if (level === 'medium') {
    minute = Math.floor(Math.random() * 12) * 5;
  } else {
    minute = Math.floor(Math.random() * 12) * 5;
    second = Math.floor(Math.random() * 12) * 5;
  }
  return { hour, minute, second };
}

function formatAnswer(t, level) {
  if (level === 'easy') return `${t.hour} giờ`;
  if (level === 'medium') return `${t.hour} giờ ${t.minute} phút`;
  return `${t.hour} giờ ${t.minute} phút ${t.second} giây`;
}

function generateChoices(correct, level) {
  const set = new Set();
  set.add(formatAnswer(correct, level));
  while (set.size < 4) {
    const fake = generateRandomTime(level);
    set.add(formatAnswer(fake, level));
  }
  // Shuffle
  return Array.from(set).sort(() => Math.random() - 0.5);
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
function LearnClockPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('lesson'); // 'lesson' | 'practice'
  const [lessonIndex, setLessonIndex] = useState(0);

  // Settings
  const [theme, setTheme] = useState('classic');
  const [showSeconds, setShowSeconds] = useState(true);
  const [showNumbers, setShowNumbers] = useState(true);
  const [clockSize, setClockSize] = useState(320);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Practice state
  const [practiceLevel, setPracticeLevel] = useState('easy');
  const [currentTime, setCurrentTime] = useState(() => generateRandomTime('easy'));
  const [choices, setChoices] = useState(() => generateChoices(currentTime, 'easy'));
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const lesson = LESSONS[lessonIndex];

  // Reset practice when level changes
  useEffect(() => {
    const t = generateRandomTime(practiceLevel);
    setCurrentTime(t);
    setChoices(generateChoices(t, practiceLevel));
    setSelected(null);
  }, [practiceLevel]);

  const correctAnswer = useMemo(
    () => formatAnswer(currentTime, practiceLevel),
    [currentTime, practiceLevel]
  );

  const handleAnswer = (choice) => {
    if (selected) return;
    setSelected(choice);
    setQuestionCount((c) => c + 1);
    if (choice === correctAnswer) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    const t = generateRandomTime(practiceLevel);
    setCurrentTime(t);
    setChoices(generateChoices(t, practiceLevel));
    setSelected(null);
  };

  const resetScore = () => {
    setScore(0);
    setStreak(0);
    setQuestionCount(0);
    nextQuestion();
  };

  // ----- Lesson interactive controls (let kids change clock) -----
  const [customHour, setCustomHour] = useState(lesson.clock.hour);
  const [customMinute, setCustomMinute] = useState(lesson.clock.minute);
  const [customSecond, setCustomSecond] = useState(lesson.clock.second);

  useEffect(() => {
    setCustomHour(lesson.clock.hour);
    setCustomMinute(lesson.clock.minute);
    setCustomSecond(lesson.clock.second);
  }, [lessonIndex, lesson.clock.hour, lesson.clock.minute, lesson.clock.second]);

  const adjustHour = (delta) => {
    setCustomHour((h) => {
      const next = ((h - 1 + delta + 12) % 12) + 1;
      return next;
    });
  };
  const adjustMinute = (delta) => {
    setCustomMinute((m) => (m + delta + 60) % 60);
  };
  const adjustSecond = (delta) => {
    setCustomSecond((s) => (s + delta + 60) % 60);
  };

  const themesList = [
    { id: 'classic', name: 'Cổ điển', preview: 'bg-amber-200' },
    { id: 'ocean', name: 'Đại dương', preview: 'bg-blue-200' },
    { id: 'forest', name: 'Rừng xanh', preview: 'bg-green-200' },
    { id: 'candy', name: 'Kẹo ngọt', preview: 'bg-pink-200' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors mb-2"
          >
            <FiHome size={16} /> Trang chủ
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-purple-400">
            🕐 Học Xem Đồng Hồ Kim
          </h1>
          <p className="text-slate-400 mt-1">
            Khoá học vui dành cho các bạn nhỏ — từ cơ bản đến nâng cao
          </p>
        </div>
        <button
          onClick={() => setSettingsOpen((o) => !o)}
          className="p-3 rounded-xl bg-slate-800 border border-white/10 text-slate-300 hover:text-indigo-400 transition-colors"
          title="Tuỳ chỉnh giao diện"
        >
          <FiSettings size={20} />
        </button>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <PremiumCard className="p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <FiSettings /> Tuỳ chỉnh giao diện
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Theme picker */}
                <div>
                  <label className="text-slate-300 text-sm font-medium mb-2 block">
                    Chủ đề màu sắc
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {themesList.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                          theme === t.id
                            ? 'border-indigo-500 bg-indigo-500/10'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full ${t.preview}`} />
                        <span className="text-slate-200 text-sm">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles + size */}
                <div className="space-y-3">
                  <label className="text-slate-300 text-sm font-medium block">
                    Hiển thị
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-800 rounded-lg">
                    <input
                      type="checkbox"
                      checked={showNumbers}
                      onChange={(e) => setShowNumbers(e.target.checked)}
                      className="w-5 h-5 accent-indigo-500"
                    />
                    <span className="text-slate-200">Hiển thị số 1-12</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-800 rounded-lg">
                    <input
                      type="checkbox"
                      checked={showSeconds}
                      onChange={(e) => setShowSeconds(e.target.checked)}
                      className="w-5 h-5 accent-indigo-500"
                    />
                    <span className="text-slate-200">Hiển thị kim giây</span>
                  </label>
                  <div>
                    <label className="text-slate-300 text-sm block mb-1">
                      Kích thước đồng hồ: {clockSize}px
                    </label>
                    <input
                      type="range"
                      min="220"
                      max="420"
                      step="10"
                      value={clockSize}
                      onChange={(e) => setClockSize(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </PremiumCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode tabs */}
      <div className="flex gap-2 p-1 bg-slate-800/60 rounded-2xl border border-white/5 w-fit mx-auto">
        <button
          onClick={() => setMode('lesson')}
          className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
            mode === 'lesson'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FiBookOpen /> Bài học
        </button>
        <button
          onClick={() => setMode('practice')}
          className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
            mode === 'practice'
              ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FiPlay /> Luyện tập
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'lesson' ? (
          <motion.div
            key="lesson"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
          >
            {/* Clock side */}
            <PremiumCard className="p-6 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  {lesson.level}
                </span>
                <span className="text-slate-400 text-sm">
                  Bài {lessonIndex + 1} / {LESSONS.length}
                </span>
              </div>
              <AnalogClock
                hour={customHour}
                minute={customMinute}
                second={customSecond}
                size={clockSize}
                showSeconds={showSeconds}
                showNumbers={showNumbers}
                showMinuteLabels={lesson.clock.showMinuteLabels}
                highlight={lesson.clock.highlight}
                theme={theme}
              />

              {/* Time display */}
              <div className="mt-4 px-6 py-3 bg-slate-900/60 rounded-2xl border border-white/5">
                <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-400 font-mono">
                  {String(customHour).padStart(2, '0')}:
                  {String(customMinute).padStart(2, '0')}
                  {showSeconds && `:${String(customSecond).padStart(2, '0')}`}
                </div>
                <div className="text-center text-xs text-slate-400 mt-1">
                  {customHour} giờ {customMinute} phút
                  {showSeconds && ` ${customSecond} giây`}
                </div>
              </div>

              {/* Adjustment buttons */}
              <div className="mt-4 grid grid-cols-3 gap-2 w-full max-w-md">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-slate-400">Giờ</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => adjustHour(-1)}
                      className="w-9 h-9 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 font-bold"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-slate-100 font-bold">
                      {customHour}
                    </span>
                    <button
                      onClick={() => adjustHour(1)}
                      className="w-9 h-9 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-slate-400">Phút (+5)</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => adjustMinute(-5)}
                      className="w-9 h-9 rounded-lg bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 font-bold"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-slate-100 font-bold">
                      {customMinute}
                    </span>
                    <button
                      onClick={() => adjustMinute(5)}
                      className="w-9 h-9 rounded-lg bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-slate-400">Giây (+5)</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => adjustSecond(-5)}
                      className="w-9 h-9 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 font-bold"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-slate-100 font-bold">
                      {customSecond}
                    </span>
                    <button
                      onClick={() => adjustSecond(5)}
                      className="w-9 h-9 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3 text-center">
                💡 Bấm các nút trên để chỉnh đồng hồ và xem cách các kim di chuyển!
              </p>
            </PremiumCard>

            {/* Lesson content side */}
            <div className="space-y-4">
              <PremiumCard className="p-6">
                <h2 className="text-2xl font-bold text-slate-100 mb-3">
                  {lesson.title}
                </h2>
                <p className="text-slate-300 mb-4 text-lg">{lesson.intro}</p>
                <ul className="space-y-3">
                  {lesson.points.map((p, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex gap-3 items-start p-3 bg-slate-900/40 rounded-xl border border-white/5"
                    >
                      <span className="text-2xl flex-shrink-0">{p.icon}</span>
                      <span className="text-slate-200 leading-relaxed">{p.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </PremiumCard>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center gap-3">
                <PremiumButton
                  onClick={() => setLessonIndex((i) => Math.max(0, i - 1))}
                  disabled={lessonIndex === 0}
                  variant="secondary"
                  icon={FiArrowLeft}
                >
                  Bài trước
                </PremiumButton>
                <div className="flex gap-1">
                  {LESSONS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setLessonIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === lessonIndex
                          ? 'bg-indigo-500 w-6'
                          : 'bg-slate-600 hover:bg-slate-500'
                      }`}
                      title={`Bài ${i + 1}`}
                    />
                  ))}
                </div>
                <PremiumButton
                  onClick={() =>
                    setLessonIndex((i) => Math.min(LESSONS.length - 1, i + 1))
                  }
                  disabled={lessonIndex === LESSONS.length - 1}
                  variant="primary"
                >
                  Bài tiếp <FiArrowRight />
                </PremiumButton>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="practice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Level picker + score */}
            <PremiumCard className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex gap-2 flex-wrap justify-center">
                {[
                  { id: 'easy', name: '🟢 Dễ - Giờ đúng' },
                  { id: 'medium', name: '🟡 Vừa - Giờ + Phút' },
                  { id: 'hard', name: '🔴 Khó - Giờ + Phút + Giây' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setPracticeLevel(l.id);
                      resetScore();
                    }}
                    className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                      practiceLevel === l.id
                        ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-lg'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-4 text-sm">
                <div className="text-center">
                  <div className="text-slate-400">Điểm</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {score}/{questionCount}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-slate-400 flex items-center gap-1">
                    <FiAward /> Chuỗi
                  </div>
                  <div className="text-2xl font-bold text-amber-400">{streak}</div>
                </div>
                <button
                  onClick={resetScore}
                  className="self-center p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Làm lại"
                >
                  <FiRefreshCw />
                </button>
              </div>
            </PremiumCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <PremiumCard className="p-6 flex flex-col items-center">
                <p className="text-slate-300 text-lg mb-4">
                  ❓ Đồng hồ chỉ mấy giờ?
                </p>
                <AnalogClock
                  hour={currentTime.hour}
                  minute={currentTime.minute}
                  second={currentTime.second}
                  size={clockSize}
                  showSeconds={practiceLevel === 'hard' && showSeconds}
                  showNumbers={showNumbers}
                  theme={theme}
                />
              </PremiumCard>

              <div className="space-y-3">
                {choices.map((choice, idx) => {
                  const isCorrect = choice === correctAnswer;
                  const isPicked = choice === selected;
                  let style =
                    'bg-slate-800 border-slate-700 text-slate-100 hover:border-indigo-500 hover:bg-slate-700';
                  if (selected) {
                    if (isCorrect)
                      style =
                        'bg-emerald-500/20 border-emerald-500 text-emerald-200';
                    else if (isPicked)
                      style = 'bg-rose-500/20 border-rose-500 text-rose-200';
                    else style = 'bg-slate-800/50 border-slate-700 text-slate-500';
                  }
                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(choice)}
                      disabled={!!selected}
                      className={`w-full p-4 rounded-2xl border-2 text-left text-lg font-medium transition-all flex items-center justify-between ${style}`}
                    >
                      <span>
                        <span className="inline-block w-8 h-8 rounded-full bg-slate-700/60 text-center leading-8 mr-3 text-sm">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {choice}
                      </span>
                      {selected && isCorrect && (
                        <FiCheck className="text-emerald-400 text-2xl" />
                      )}
                      {selected && isPicked && !isCorrect && (
                        <FiX className="text-rose-400 text-2xl" />
                      )}
                    </motion.button>
                  );
                })}

                {selected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-4 rounded-2xl bg-slate-800/60 border border-white/5"
                  >
                    {selected === correctAnswer ? (
                      <p className="text-emerald-400 font-bold text-lg">
                        🎉 Chính xác! Con giỏi quá!
                      </p>
                    ) : (
                      <p className="text-rose-400 font-bold text-lg">
                        Sai rồi 😢 Đáp án đúng là:{' '}
                        <span className="text-emerald-300">{correctAnswer}</span>
                      </p>
                    )}
                    <PremiumButton
                      onClick={nextQuestion}
                      variant="primary"
                      className="mt-3 mx-auto"
                    >
                      Câu tiếp theo →
                    </PremiumButton>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LearnClockPage;
