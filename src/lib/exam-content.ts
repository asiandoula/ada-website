export type ExamLang = 'en' | 'zh-cn' | 'zh-tw' | 'ja' | 'ko';

export type PracticalStep = {
  title: string;
  englishTitle: string;
  subtitle?: string;
  scenario: string;
  requirement: string;
  durationLabel: string;
  durationSeconds: number;
  audio: string;
};

export type PracticalModule = {
  title: string;
  englishTitle: string;
  steps: PracticalStep[];
};

export type ExamContent = {
  ui: {
    examTitle: string;
    committee: string;
    organizedBy: string;
    part1: string;
    part2: string;
    writtenExam: string;
    practicalExam: string;
    beginExam: string;
    nextStep: string;
    timeUp: string;
    timeRemaining: string;
    scenarioLabel: string;
    requirementLabel: string;
    durationLabel: string;
    examComplete: string;
    step: string;
    of: string;
  };
  writtenRules: string[];
  modules: PracticalModule[];
};

export const EXAM_LANGS: { code: ExamLang; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'zh-cn', label: 'Simplified Chinese', nativeLabel: '简体中文' },
  { code: 'zh-tw', label: 'Traditional Chinese', nativeLabel: '繁體中文' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어' },
];

// Shared modules across all languages — exam content is administered in Chinese
const modules: PracticalModule[] = [
  {
    title: '心肺复苏',
    englishTitle: 'Item 1: Cardiopulmonary Resuscitation',
    steps: [
      {
        title: '第一项：心肺复苏',
        englishTitle: 'Item 1: CPR',
        scenario:
          '在客户家里，一名1个月大的新生儿突然失去意识，新生儿躺在地上，身体僵直，没有明显的呼吸起伏，情况十分危急。',
        requirement:
          '请按照标准急救流程，对模拟新生儿进行正确的心肺复苏操作。',
        durationLabel: '考核时间：2 分钟。',
        durationSeconds: 120,
        audio: '/audio/exam/m1-cpr.mp3',
      },
    ],
  },
  {
    title: '异物梗塞急救',
    englishTitle: 'Item 2: Foreign Object Inhaled: First Aid',
    steps: [
      {
        title: '第二项：异物梗塞急救',
        englishTitle: 'Item 2: Foreign Object First Aid',
        scenario:
          '在客户家里，一名1个月大的新生儿正在进食，突然剧烈咳嗽，随后无法发出声音，脸色迅速变得青紫。您需要立即采取措施，帮助新生儿恢复正常呼吸。',
        requirement:
          '请演示如何在新生儿发生气道梗阻时，正确实施急救。',
        durationLabel: '考核时间：2 分钟。',
        durationSeconds: 120,
        audio: '/audio/exam/m2-foreign-object.mp3',
      },
    ],
  },
  {
    title: '呛奶处理',
    englishTitle: 'Item 3: Choking Treatment',
    steps: [
      {
        title: '第三项：呛奶处理',
        englishTitle: 'Item 3: Choking Treatment',
        scenario:
          '一名新生儿刚刚喝完奶，突然呼吸急促，疑似呛奶。家长抱着新生儿，慌乱无措地向您求助。您需要迅速判断情况，并采取正确的处理方式，确保新生儿安全。',
        requirement:
          '请展示如何处理新生儿呛奶情况，确保气道通畅并避免误吸风险。',
        durationLabel: '考核时间：1 分钟。',
        durationSeconds: 60,
        audio: '/audio/exam/m3-choking.mp3',
      },
    ],
  },
  {
    title: '新生儿抱姿',
    englishTitle: 'Item 4: Newborn Carrying Position',
    steps: [
      {
        title: '第四项：新生儿抱姿',
        englishTitle: 'Item 4: Newborn Carrying Position — Cradle Hold',
        subtitle: '横抱',
        scenario: '请考生展示常见的新生儿抱姿：',
        requirement: '横抱',
        durationLabel: '考核时间：10 秒。',
        durationSeconds: 10,
        audio: '/audio/exam/m4-carry-cradle.mp3',
      },
      {
        title: '第四项：新生儿抱姿',
        englishTitle: 'Item 4: Newborn Carrying Position — Upright Hold',
        subtitle: '竖抱',
        scenario: '请考生展示常见的新生儿抱姿：',
        requirement: '竖抱',
        durationLabel: '考核时间：10 秒。',
        durationSeconds: 10,
        audio: '/audio/exam/m4-carry-upright.mp3',
      },
      {
        title: '第四项：新生儿抱姿',
        englishTitle: 'Item 4: Newborn Carrying Position — Airplane Hold',
        subtitle: '飞机抱',
        scenario: '请考生展示常见的新生儿抱姿：',
        requirement: '飞机抱',
        durationLabel: '考核时间：10 秒。',
        durationSeconds: 10,
        audio: '/audio/exam/m4-carry-airplane.mp3',
      },
    ],
  },
  {
    title: '拍嗝技巧',
    englishTitle: 'Item 5: Burping Technique',
    steps: [
      {
        title: '第五项：拍嗝技巧',
        englishTitle: 'Item 5: Burping Technique — Upright',
        subtitle: '竖抱拍嗝',
        scenario: '请考生展示以下常见的新生儿拍嗝方法',
        requirement: '竖抱拍嗝',
        durationLabel: '考核时间：15 秒。',
        durationSeconds: 15,
        audio: '/audio/exam/m5-burp-upright.mp3',
      },
      {
        title: '第五项：拍嗝技巧',
        englishTitle: 'Item 5: Burping Technique — Sitting',
        subtitle: '坐姿拍嗝',
        scenario: '请考生展示以下常见的新生儿拍嗝方法',
        requirement: '坐姿拍嗝',
        durationLabel: '考核时间：15 秒。',
        durationSeconds: 15,
        audio: '/audio/exam/m5-burp-sitting.mp3',
      },
      {
        title: '第五项：拍嗝技巧',
        englishTitle: 'Item 5: Burping Technique — Rocking',
        subtitle: '摇嗝法',
        scenario: '请考生展示以下常见的新生儿拍嗝方法',
        requirement: '摇嗝法',
        durationLabel: '考核时间：15 秒。',
        durationSeconds: 15,
        audio: '/audio/exam/m5-burp-rocking.mp3',
      },
    ],
  },
  {
    title: '婴儿洗澡',
    englishTitle: 'Item 6: Baby Baths',
    steps: [
      {
        title: '第六项：婴儿洗澡',
        englishTitle: 'Item 6: Baby Baths — Step 1: Preparation',
        subtitle: '第一步：物品准备',
        scenario: '请根据屏幕上的提示，模拟完整的婴儿洗澡流程。',
        requirement:
          '仔细核查并准备洗澡所需所有用品，确保物品完好且放置有序。',
        durationLabel: '考核时间：1 分钟。',
        durationSeconds: 60,
        audio: '/audio/exam/m6-bath-s1-prep.mp3',
      },
      {
        title: '第六项：婴儿洗澡',
        englishTitle: 'Item 6: Baby Baths — Step 2: Undress',
        subtitle: '第二步：脱纸尿裤与衣物',
        scenario: '请根据屏幕上的提示，模拟完整的婴儿洗澡流程。',
        requirement:
          '按照规定程序，准确而迅速地脱去婴儿的纸尿裤及衣物，确保操作过程轻柔且安全。',
        durationLabel: '考核时间：1 分钟。',
        durationSeconds: 60,
        audio: '/audio/exam/m6-bath-s2-undress.mp3',
      },
      {
        title: '第六项：婴儿洗澡',
        englishTitle: 'Item 6: Baby Baths — Step 3: Water Temperature',
        subtitle: '第三步：准备澡盆及调控水温',
        scenario: '请根据屏幕上的提示，模拟完整的婴儿洗澡流程。',
        requirement:
          '请仔细检查澡盆是否完好无损，并确认水温已调节至符合安全标准的适宜温度。',
        durationLabel: '考核时间：30 秒。',
        durationSeconds: 30,
        audio: '/audio/exam/m6-bath-s3-water.mp3',
      },
      {
        title: '第六项：婴儿洗澡',
        englishTitle: 'Item 6: Baby Baths — Step 4: Wash Head & Face',
        subtitle: '第四步：洗头与洗脸',
        scenario: '请根据屏幕上的提示，模拟完整的婴儿洗澡流程。',
        requirement:
          '使用温和的洗浴产品，先对婴儿头部进行清洗，再依次清洁面部。',
        durationLabel: '考核时间：1 分钟。',
        durationSeconds: 60,
        audio: '/audio/exam/m6-bath-s4-wash-head.mp3',
      },
      {
        title: '第六项：婴儿洗澡',
        englishTitle: 'Item 6: Baby Baths — Step 5: Wash Body',
        subtitle: '第五步：洗澡',
        scenario: '请根据屏幕上的提示，模拟完整的婴儿洗澡流程。',
        requirement:
          '请使用正确抱持姿势，严格控制水温，均匀清洗婴儿全身。',
        durationLabel: '考核时间：2 分钟。',
        durationSeconds: 120,
        audio: '/audio/exam/m6-bath-s5-wash-body.mp3',
      },
      {
        title: '第六项：婴儿洗澡',
        englishTitle: 'Item 6: Baby Baths — Step 6: Massage',
        subtitle: '第六步：抚触护理',
        scenario: '请根据屏幕上的提示，模拟完整的婴儿洗澡流程。',
        requirement: '涂抹适量抚触油后，按照标准抚触操进行护理。',
        durationLabel: '考核时间：3 分钟。',
        durationSeconds: 180,
        audio: '/audio/exam/m6-bath-s6-massage.mp3',
      },
      {
        title: '第六项：婴儿洗澡',
        englishTitle: 'Item 6: Baby Baths — Step 7: Umbilical Care',
        subtitle: '第七步：脐部护理',
        scenario: '请根据屏幕上的提示，模拟完整的婴儿洗澡流程。',
        requirement: '对已脱落脐带后的脐部实施消毒和护理。',
        durationLabel: '考核时间：15 秒。',
        durationSeconds: 15,
        audio: '/audio/exam/m6-bath-s7-umbilical.mp3',
      },
      {
        title: '第六项：婴儿洗澡',
        englishTitle: 'Item 6: Baby Baths — Step 8: Diaper & Foreskin Care',
        subtitle: '第八步：臀部护理及包皮护理',
        scenario: '请根据屏幕上的提示，模拟完整的婴儿洗澡流程。',
        requirement:
          '请在在婴儿臀部适量涂抹护臀膏，并配合包皮护理',
        durationLabel: '考核时间：1 分钟。',
        durationSeconds: 60,
        audio: '/audio/exam/m6-bath-s8-diaper.mp3',
      },
      {
        title: '第六项：婴儿洗澡',
        englishTitle: 'Item 6: Baby Baths — Step 9: Finish',
        subtitle: '第九步：洗澡结束',
        scenario: '请根据屏幕上的提示，模拟完整的婴儿洗澡流程。',
        requirement:
          '请给婴儿穿好尿布、穿好衣物、打好襁褓，并整理好所有用品。',
        durationLabel: '考核时间：2 分钟。',
        durationSeconds: 120,
        audio: '/audio/exam/m6-bath-s9-finish.mp3',
      },
    ],
  },
  {
    title: '婴儿排气操',
    englishTitle: 'Item 7: Baby Exhaustion Exercise',
    steps: [
      {
        title: '第七项：婴儿排气操',
        englishTitle: 'Item 7: Baby Gas Relief Exercise',
        scenario: '',
        requirement:
          '请示范并口述五个及以上的标准的婴儿排气操动作，并简述每个动作的意义。',
        durationLabel: '考核时间：3 分钟。',
        durationSeconds: 180,
        audio: '/audio/exam/m7-gas-exercise.mp3',
      },
    ],
  },
  {
    title: '亲喂姿势',
    englishTitle: 'Item 8: Breast Feeding Positions',
    steps: [
      {
        title: '第八项：亲喂姿势',
        englishTitle: 'Item 8: Breastfeeding Positions — Cradle Hold',
        subtitle: '摇篮式',
        scenario: '请考生展示以下母乳妈妈的亲喂姿势',
        requirement: '摇篮式',
        durationLabel: '考核时间：15 秒。',
        durationSeconds: 15,
        audio: '/audio/exam/m8-bf-cradle.mp3',
      },
      {
        title: '第八项：亲喂姿势',
        englishTitle: 'Item 8: Breastfeeding Positions — Cross-Cradle Hold',
        subtitle: '交叉式',
        scenario: '请考生展示以下母乳妈妈的亲喂姿势',
        requirement: '交叉式',
        durationLabel: '考核时间：15 秒。',
        durationSeconds: 15,
        audio: '/audio/exam/m8-bf-cross.mp3',
      },
      {
        title: '第八项：亲喂姿势',
        englishTitle: 'Item 8: Breastfeeding Positions — Football Hold',
        subtitle: '橄榄球式',
        scenario: '请考生展示以下母乳妈妈的亲喂姿势',
        requirement: '橄榄球式',
        durationLabel: '考核时间：15 秒。',
        durationSeconds: 15,
        audio: '/audio/exam/m8-bf-football.mp3',
      },
      {
        title: '第八项：亲喂姿势',
        englishTitle: 'Item 8: Breastfeeding Positions — Side-Lying',
        subtitle: '侧卧式',
        scenario: '请考生展示以下母乳妈妈的亲喂姿势',
        requirement: '侧卧式',
        durationLabel: '考核时间：15 秒。',
        durationSeconds: 15,
        audio: '/audio/exam/m8-bf-sidelying.mp3',
      },
      {
        title: '第八项：亲喂姿势',
        englishTitle: 'Item 8: Breastfeeding Positions — Laid-Back',
        subtitle: '半躺式',
        scenario: '请考生展示以下母乳妈妈的亲喂姿势',
        requirement: '半躺式',
        durationLabel: '考核时间：15 秒。',
        durationSeconds: 15,
        audio: '/audio/exam/m8-bf-laidback.mp3',
      },
    ],
  },
  {
    title: '泌乳实操',
    englishTitle: 'Item 9: Lactation Practices',
    steps: [
      {
        title: '第九项：泌乳实操',
        englishTitle: 'Item 9: Lactation Practices',
        scenario:
          '请您表述并示范通乳过程中常用的乳房按摩手法，不少于五种。在每种手法操作前，请简要说明该手法的名称、动作要领及其作用。',
        requirement:
          '注意：操作应动作温和，体现专业性与规范性。请展示至少5种不同的按摩手法。',
        durationLabel: '考核时间：5 分钟。',
        durationSeconds: 300,
        audio: '/audio/exam/m9-lactation.mp3',
      },
    ],
  },
];

const contentMap: Record<ExamLang, { ui: ExamContent['ui']; writtenRules: string[] }> = {
  'zh-cn': {
    ui: {
      examTitle: '产后导乐国际认证考试',
      committee: '考试委员会',
      organizedBy: '亚洲导乐联盟认证委员会组织',
      part1: '第一部分',
      part2: '第二部分',
      writtenExam: '笔试考试',
      practicalExam: '实操考试',
      beginExam: '开始答题',
      nextStep: '下一步',
      timeUp: '时间到！',
      timeRemaining: '剩余时间',
      scenarioLabel: '情景描述：',
      requirementLabel: '考核要求：',
      durationLabel: '考核时间：',
      examComplete: '考试结束',
      step: '步骤',
      of: '/',
    },
    writtenRules: [
      '考试时长为一小时。',
      '请遵守考场纪律，严禁携带与考试无关的物品进入考场。',
      '考试中遇到任何程序性问题请举手示意。',
      '距离考试结束15分钟时，监考老师会统一进行提醒。',
      '考试结束后请立即停笔并按照要求提交试卷。',
    ],
  },

  'zh-tw': {
    ui: {
      examTitle: '產後導樂國際認證考試',
      committee: '考試委員會',
      organizedBy: '亞洲導樂聯盟認證委員會組織',
      part1: '第一部分',
      part2: '第二部分',
      writtenExam: '筆試考試',
      practicalExam: '實操考試',
      beginExam: '開始答題',
      nextStep: '下一步',
      timeUp: '時間到！',
      timeRemaining: '剩餘時間',
      scenarioLabel: '情景描述：',
      requirementLabel: '考核要求：',
      durationLabel: '考核時間：',
      examComplete: '考試結束',
      step: '步驟',
      of: '/',
    },
    writtenRules: [
      '考試時長為一小時。',
      '請遵守考場紀律，嚴禁攜帶與考試無關的物品進入考場。',
      '考試中遇到任何程序性問題請舉手示意。',
      '距離考試結束15分鐘時，監考老師會統一進行提醒。',
      '考試結束後請立即停筆並按照要求提交試卷。',
    ],
  },

  'en': {
    ui: {
      examTitle: 'Postpartum Doula International Certification Exam',
      committee: 'Examination Committee',
      organizedBy: 'Organized by the Asian Doula Association Certification Committee',
      part1: 'Part One',
      part2: 'Part Two',
      writtenExam: 'Written Exam',
      practicalExam: 'Practical Exam',
      beginExam: 'Begin Exam',
      nextStep: 'Next Step',
      timeUp: "Time's Up!",
      timeRemaining: 'Time Remaining',
      scenarioLabel: 'Scenario:',
      requirementLabel: 'Requirement:',
      durationLabel: 'Duration:',
      examComplete: 'Exam Complete',
      step: 'Step',
      of: 'of',
    },
    writtenRules: [
      'The exam duration is one hour.',
      'Please follow examination room rules. No items unrelated to the exam are permitted.',
      'If you encounter any procedural issues during the exam, please raise your hand.',
      'The proctor will give a reminder 15 minutes before the end of the exam.',
      'Please stop writing immediately when time is called and submit your paper as instructed.',
    ],
  },

  'ja': {
    ui: {
      examTitle: '産後ドゥーラ国際認定試験',
      committee: '試験委員会',
      organizedBy: 'アジアドゥーラ協会認定委員会主催',
      part1: '第一部',
      part2: '第二部',
      writtenExam: '筆記試験',
      practicalExam: '実技試験',
      beginExam: '試験開始',
      nextStep: '次のステップ',
      timeUp: '時間終了！',
      timeRemaining: '残り時間',
      scenarioLabel: 'シナリオ：',
      requirementLabel: '要件：',
      durationLabel: '試験時間：',
      examComplete: '試験終了',
      step: 'ステップ',
      of: '/',
    },
    writtenRules: [
      '試験時間は1時間です。',
      '試験室のルールを守り、試験に関係のないものの持ち込みは禁止です。',
      '試験中に手続き上の問題が生じた場合は、手を挙げてください。',
      '試験終了15分前に試験官が一斉に通知します。',
      '時間になったらすぐに筆記を止め、指示に従って答案を提出してください。',
    ],
  },

  'ko': {
    ui: {
      examTitle: '산후 둘라 국제 인증 시험',
      committee: '시험 위원회',
      organizedBy: '아시안 둘라 협회 인증 위원회 주관',
      part1: '제1부',
      part2: '제2부',
      writtenExam: '필기 시험',
      practicalExam: '실기 시험',
      beginExam: '시험 시작',
      nextStep: '다음 단계',
      timeUp: '시간 종료！',
      timeRemaining: '남은 시간',
      scenarioLabel: '상황 설명：',
      requirementLabel: '평가 요구사항：',
      durationLabel: '평가 시간：',
      examComplete: '시험 종료',
      step: '단계',
      of: '/',
    },
    writtenRules: [
      '시험 시간은 1시간입니다.',
      '시험장 규칙을 준수하며, 시험과 무관한 물품 반입을 엄격히 금지합니다.',
      '시험 중 절차적 문제가 발생하면 손을 들어 알려주세요.',
      '시험 종료 15분 전에 감독관이 일괄 안내합니다.',
      '시간이 종료되면 즉시 필기를 멈추고 지시에 따라 답안지를 제출해 주세요.',
    ],
  },
};

export function getExamContent(lang: ExamLang): ExamContent {
  const { ui, writtenRules } = contentMap[lang];
  return { ui, writtenRules, modules };
}
