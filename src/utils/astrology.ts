import { dailyAlmanac } from '@4n6h4x0r/stem-branch';

// ── 型定義 ──────────────────────────────────────────────────────────

/**
 * 診断結果のインターフェース
 */
export interface DiagnosisResult {
  pillars: {
    year: { stem: string; branch: string };
    month: { stem: string; branch: string };
    day: { stem: string; branch: string };
    hour?: { stem: string; branch: string };
  };
  personality: {
    stem: string;
    name: string;
    alias: string;
    natureSymbol: string;
    element: string;
    yinYang: string;
    instinct: string;
    instinctDescription: string;
    description: string;
    essence: string;
    strengths: string[];
    weaknesses: string[];
    advice: string;
    shortDesc: string; // 例: "知性、奉仕、コツコツ努力、潤いを与える"
  };
  jobStyle: {
    primaryStar: string;
    primaryStarReading: string;
    description: string;
    workStyle: string;
    suitableCareers: string[];
    shortDesc: string; // 例: "好奇心、放浪・改革、クリエイティブ、開拓・イノベーション"
  };
  lifeChart: {
    solarTermDay: number | null;
    hiddenStems: {
      yearBranch: string;
      monthBranch: string;
      dayBranch: string;
    };
    majorStars: {
      head: string;       // ① 日干 × 年干
      abdomen: string;    // ② 日干 × 月干
      leftHand: string;   // ③ 日干 × 年支の蔵干
      center: string;     // ④ 日干 × 月支の蔵干
      rightHand: string;  // ⑤ 日干 × 日支の蔵干
    };
    energyStars: {
      leftShoulder: string; // A 日干 × 年支
      leftFoot: string;     // B 日干 × 月支
      rightFoot: string;    // C 日干 × 日支
    };
  };
  natalChart: Array<{
    pillar: 'day' | 'month' | 'year';
    label: string;
    stem: string;
    branch: string;
    heavenlyStar: string;
    selectedHiddenStem: string;
    selectedHiddenStar: string;
    hiddenStems: Array<{
      stem: string;
      star: string;
    }>;
  }>;
  actionArea: {
    energyScore: number;
    energyLevel: 'low' | 'balanced' | 'high';
    dominantAreas: string[];
    points: Array<{
      pillar: 'year' | 'month' | 'day';
      label: string;
      number: number;
      stem: string;
      branch: string;
      area: 'A' | 'B' | 'C' | 'D';
      x: number;
      y: number;
      energyStar: string;
      energyValue: number;
    }>;
  };
  talentEnergy: {
    topGap: number;
    hasStrongTalentStar: boolean;
    dominantStars: string[];
    entries: Array<{
      stem: string;
      star: string;
      phenomenon: string;
      count: number;
      baseEnergy: number;
      totalEnergy: number;
      branchEnergies: {
        day: number;
        month: number;
        year: number;
      };
    }>;
  };
  communication: {
    description: string;       // 全体的なコミュニケーション特性
    howToGuide: string;        // 立場が下の人を指導するとき
    howToFollow: string;       // 立場が上の人に接するとき
    howToPeer: string;         // 同列・対等なコミュニケーション
    ngPoints: string;          // 避けるべきNG対応
  };
  energy: {
    star: string;
    reading: string;
    level: string;
    description: string;
  };
  rhythm: Array<{
    year: number;
    stem: string;
    branch: string;
    energyType: string;
    energyScore: number;
    waveEnergy: number;
    waveLabel: string;
    theme: string;
    description: string;
    isTenchusatsu: boolean;
    season: '春' | '夏' | '秋' | '冬'; // 人生の季節
    seasonYear: 1 | 2 | 3;
    seasonPhase: string;  // 季節内のフェーズ（例：「新芽期」）
    seasonAction: string; // その季節に適した行動指针
  }>;
  monthlyRhythm: Array<{
    month: number;
    branch: string;
    energy: number;
    label: string;
    theme: string;
    description: string;
    isTenchusatsu: boolean;
    season: '春' | '夏' | '秋' | '冬';
    seasonYear: 1 | 2 | 3;
    seasonPhase: string;
    seasonAction: string;
    solarTermName: string;
    solarTermDay: number;
  }>;
  majorLuck: {
    gender: 'male' | 'female';
    direction: 'right' | 'left';
    directionLabel: string;
    startAge: number;
    dayCount: number;
    currentAge: number;
    currentPeriod: {
      order: number;
      ageFrom: number;
      ageTo: number;
      calendarYearFrom: number;
      calendarYearTo: number;
      stem: string;
      branch: string;
      majorStar: string;
      energyStar: string;
      energyValue: number;
      theme: string;
    } | null;
    periods: Array<{
      order: number;
      ageFrom: number;
      ageTo: number;
      calendarYearFrom: number;
      calendarYearTo: number;
      stem: string;
      branch: string;
      majorStar: string;
      energyStar: string;
      energyValue: number;
      theme: string;
      focus: string;
      isCurrent: boolean;
    }>;
  };
  seasonCycle: {
    birth: {
      season: '春' | '夏' | '秋' | '冬';
      seasonYear: 1 | 2 | 3;
      label: string;
      theme: string;
      description: string;
    };
    current: {
      season: '春' | '夏' | '秋' | '冬';
      seasonYear: 1 | 2 | 3;
      label: string;
      theme: string;
      description: string;
    };
  };
  elementBalance: Record<string, number>; // 五行のバランススコア
  tenchusatsu: {
    name: string;           // 例: "戌亥天中殺"
    branches: string[];     // 例: ["戌", "亥"]
    description: string;    // 天中殺の特性・気質説明
    advice: string;         // 天中殺期間の過ごし方アドバイス
    caution: string;        // 天中殺に気をつけること
  };
}

// ── データ辞書 ────────────────────────────────────────────────────────

// 十干の基本情報
export const TEN_STEMS: Record<string, { element: string; yinYang: string; name: string; alias: string; natureSymbol: string }> = {
  "甲": { element: "木", yinYang: "陽", name: "こう", alias: "大樹", natureSymbol: "樹木" },
  "乙": { element: "木", yinYang: "陰", name: "おつ", alias: "草花", natureSymbol: "草花" },
  "丙": { element: "火", yinYang: "陽", name: "へい", alias: "太陽", natureSymbol: "太陽" },
  "丁": { element: "火", yinYang: "陰", name: "てい", alias: "灯火", natureSymbol: "灯" },
  "戊": { element: "土", yinYang: "陽", name: "ぼ", alias: "山岳", natureSymbol: "山" },
  "己": { element: "土", yinYang: "陰", name: "き", alias: "大地", natureSymbol: "大地" },
  "庚": { element: "金", yinYang: "陽", name: "こう", alias: "鋼鉄", natureSymbol: "鉄" },
  "辛": { element: "金", yinYang: "陰", name: "しん", alias: "宝石", natureSymbol: "宝石" },
  "壬": { element: "水", yinYang: "陽", name: "じん", alias: "大海", natureSymbol: "海" },
  "癸": { element: "水", yinYang: "陰", name: "き", alias: "雨露", natureSymbol: "雨" }
};

const ELEMENT_INSTINCTS: Record<string, { name: string; description: string }> = {
  "木": {
    name: "守備本能",
    description: "危険や違和感を察知すると、無意識に自分や大切なものを守ろうとする本能です。"
  },
  "火": {
    name: "伝達本能",
    description: "自分の意思や体験を伝え、次の時代や誰かの心に何かを残そうとする本能です。"
  },
  "土": {
    name: "引力本能",
    description: "人や情報、ものを引き寄せ、場の中心や魅力として働きやすい本能です。"
  },
  "金": {
    name: "攻撃本能",
    description: "前へ進み、課題に切り込み、鍛錬や突破によって現実を動かす本能です。"
  },
  "水": {
    name: "習得本能",
    description: "知識や経験を吸収し、学ぶだけでなく多くのものを受け入れて蓄積する本能です。"
  }
};

// 十二支の本気（代表する十干）マッピング
export const BRANCH_REPRESENTATIVE_STEM: Record<string, string> = {
  "子": "癸",
  "丑": "己",
  "寅": "甲",
  "卯": "乙",
  "辰": "戊",
  "巳": "丙",
  "午": "丁",
  "未": "己",
  "申": "庚",
  "酉": "辛",
  "戌": "戊",
  "亥": "壬"
};

type HiddenStemPeriod = {
  stem: string;
  untilDay?: number;
};

// 算命学の蔵干（二十八元）。節入り日を1日目として、その日の蔵干を選ぶ。
export const BRANCH_HIDDEN_STEM_PERIODS: Record<string, HiddenStemPeriod[]> = {
  "子": [{ stem: "癸" }],
  "丑": [{ stem: "癸", untilDay: 9 }, { stem: "辛", untilDay: 12 }, { stem: "己" }],
  "寅": [{ stem: "戊", untilDay: 7 }, { stem: "丙", untilDay: 14 }, { stem: "甲" }],
  "卯": [{ stem: "乙" }],
  "辰": [{ stem: "乙", untilDay: 9 }, { stem: "癸", untilDay: 12 }, { stem: "戊" }],
  "巳": [{ stem: "戊", untilDay: 5 }, { stem: "庚", untilDay: 14 }, { stem: "丙" }],
  "午": [{ stem: "己", untilDay: 19 }, { stem: "丁" }],
  "未": [{ stem: "丁", untilDay: 9 }, { stem: "乙", untilDay: 12 }, { stem: "己" }],
  "申": [{ stem: "戊", untilDay: 10 }, { stem: "壬", untilDay: 13 }, { stem: "庚" }],
  "酉": [{ stem: "辛" }],
  "戌": [{ stem: "辛", untilDay: 9 }, { stem: "丁", untilDay: 12 }, { stem: "戊" }],
  "亥": [{ stem: "甲", untilDay: 12 }, { stem: "壬" }]
};

export function getHiddenStemBySolarTermDay(branch: string, solarTermDay: number): string {
  const periods = BRANCH_HIDDEN_STEM_PERIODS[branch];
  if (!periods) return BRANCH_REPRESENTATIVE_STEM[branch] || "甲";

  const normalizedDay = Math.max(1, Math.floor(solarTermDay));
  const match = periods.find((period) => period.untilDay === undefined || normalizedDay <= period.untilDay);
  return match?.stem || periods[periods.length - 1].stem;
}

function getAllHiddenStems(branch: string): string[] {
  return (BRANCH_HIDDEN_STEM_PERIODS[branch] || [{ stem: BRANCH_REPRESENTATIVE_STEM[branch] || "甲" }])
    .map((period) => period.stem);
}

export function getSexagenaryNumber(stem: string, branch: string): number {
  const stemOrder = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const branchOrder = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const s = stemOrder.indexOf(stem);
  const b = branchOrder.indexOf(branch);
  if (s === -1 || b === -1) return 1;
  return (((s * 6 - b * 5) % 60 + 60) % 60) + 1;
}

function getActionAreaRoom(number: number): 'A' | 'B' | 'C' | 'D' {
  if (number <= 16) return 'A';
  if (number <= 31) return 'B';
  if (number <= 46) return 'D';
  return 'C';
}

function getActionAreaPoint(number: number) {
  const angle = (-90 + (number - 1) * 6) * Math.PI / 180;
  const radius = 42;
  return {
    x: 50 + Math.cos(angle) * radius,
    y: 50 + Math.sin(angle) * radius
  };
}

const TALENT_PHENOMENA: Record<string, string> = {
  "鳳閣星": "表現",
  "調舒星": "芸術",
  "禄存星": "財力",
  "司禄星": "家庭",
  "車騎星": "行動",
  "牽牛星": "資格",
  "龍高星": "創造",
  "玉堂星": "学問",
  "貫索星": "自我",
  "石門星": "仲間"
};

// 十二支の基本属性
export const TWELVE_BRANCHES: Record<string, { element: string; yinYang: string }> = {
  "子": { element: "水", yinYang: "陰" },
  "丑": { element: "土", yinYang: "陰" },
  "寅": { element: "木", yinYang: "陽" },
  "卯": { element: "木", yinYang: "陰" },
  "辰": { element: "土", yinYang: "陽" },
  "巳": { element: "火", yinYang: "陽" },
  "午": { element: "火", yinYang: "陰" },
  "未": { element: "土", yinYang: "陰" },
  "申": { element: "金", yinYang: "陽" },
  "酉": { element: "金", yinYang: "陰" },
  "戌": { element: "土", yinYang: "陽" },
  "亥": { element: "水", yinYang: "陽" }
};

// 日干（本質気質）の診断詳細テキスト
const PERSONALITY_TEXTS: Record<string, { description: string; essence: string; strengths: string[]; weaknesses: string[]; advice: string; keywords: string }> = {
  "甲": {
    description: "天に向かって真っ直ぐ伸びる大樹のような人です。正義感が強く、曲がったことを嫌います。自立心に満ち、目標に向かってコツコツと努力を重ねる大器晩成型です。",
    essence: "樹木のように、まっすぐ伸びることを望む質です。環境が合えば太い幹を持つ頼もしい存在になり、環境が合わないと伸び悩みやすいため、根を張れる場所選びが大切です。",
    strengths: ["責任感が強い", "リーダーシップがある", "一度決めたらやり抜く堅実さ"],
    weaknesses: ["妥協するのが苦手", "挫折したときに心が折れやすい", "頑固で融通が利かない面がある"],
    advice: "時には風に揺れるしなやかさを持つことで、より大きな成長と周囲との調和が得られます。",
    keywords: "自立心、正義感、大器晩成、リーダー気質"
  },
  "乙": {
    description: "優しく柔和な草花のような人です。人当たりが良く、協調性に優れています。踏まれても立ち上がる雑草のような内に秘めた強い芯（外柔内剛）を持っています。",
    essence: "草花のように柔らかく、状況に合わせて伸びる質です。外側は控えめでも精神力は強く、人との関係を大切にしながら粘り強く道を作っていきます。",
    strengths: ["協調性が高く環境適応力がある", "粘り強く忍耐力がある", "周囲に癒やしを与える穏やかさ"],
    weaknesses: ["優柔不定になりやすい", "周囲の意見に流されがち", "他人の目を気にしすぎて疲れる"],
    advice: "自分の本音やこだわりを大切にし、時には自己主張することも必要です。",
    keywords: "協調性、忍耐、柔軟性、外柔内剛"
  },
  "丙": {
    description: "万物を明るく照らす太陽のような人です。陽気でエネルギッシュ、情熱的で開放的な性質を持ち、周囲を明るくする天性のスター性を持っています。",
    essence: "太陽のように、周囲へ明るさや温かさを届ける質です。相手を平等に照らす一方で、与える側に回りやすく、孤独を感じた時は受け取る時間も必要です。",
    strengths: ["行動力と表現力がある", "裏表がなくオープンな性格", "物事を肯定的に捉える明るさ"],
    weaknesses: ["熱しやすく冷めやすい", "自己中心的になりがち", "大雑把で細かいことを見落とす"],
    advice: "長期的な視点を持ち、時には立ち止まって詳細を確認する習慣をつけると信頼が深まります。",
    keywords: "情熱、開放性、行動力、スター性"
  },
  "丁": {
    description: "暗闇を優しく照らす灯火（キャンドルや焚き火）のような人です。感受性が豊かで温厚ですが、内面には激しい情熱と独自の鋭いセンスを秘めています。",
    essence: "灯のように、近くの人をそっと照らす質です。優しさと思いやりの奥に小さな火種を持ち、情熱が高まると一気に燃え上がる集中力があります。",
    strengths: ["思慮深く観察眼が鋭い", "優れた感性とクリエイティブな才能", "親しい人をとても大切にする"],
    weaknesses: ["感情の起伏が激しい", "秘密主義で本音を見せない", "傷つきやすく悩みやすい"],
    advice: "ストレスを溜め込まず、趣味や自己表現を通して上手に感情を発散させることが鍵です。",
    keywords: "感受性、鋭いセンス、温かさ、秘めた情熱"
  },
  "戊": {
    description: "威風堂々とそびえ立つ山岳のような人です。包容力があり、どっしりとした安心感を与えるため、自然と人が集まります。大局的な視点を持つロマンチストです。",
    essence: "山のように、自分から大きく動くよりも、そこに在ることで人や出来事を受け止める質です。安定感が魅力ですが、自分の領域に入られると頑固さも出やすくなります。",
    strengths: ["圧倒的な包容力と安定感", "面倒見が良く頼りがいがある", "スケールの大きな構想力"],
    weaknesses: ["腰が重く行動までに時間がかかる", "一度思い込むと頑固で曲げない", "自己表現がやや不器用"],
    advice: "スピーディなフットワークを心がけ、周囲の小さな変化にも耳を傾けるようにしましょう。",
    keywords: "包容力、安定、スケール感、構想力"
  },
  "己": {
    description: "万物を育む豊かな大地のような人です。優しく温和で、誰とでも親しくなれる柔軟性を持っています。学びや経験を吸収し、他者を育てる能力に長けています。",
    essence: "大地のように、広く受け入れ、育て、支える質です。庶民的で親しみやすい一方、何でも抱え込みやすいので、境界線を持つほど魅力が健やかに働きます。",
    strengths: ["育成能力と指導力がある", "多才多芸で器用", "庶民的で親しみやすい性格"],
    weaknesses: ["迷いやすく優柔不断", "おせっかいが過ぎてしまう", "自分の欲求を後回しにしがち"],
    advice: "人を育てるだけでなく、自分自身のスキル向上や内面の充実にも投資しましょう。",
    keywords: "育成力、柔軟性、多才、親しみやすさ"
  },
  "庚": {
    description: "硬く研ぎ澄まされた鋼鉄や刀剣のような人です。決断力と行動力に溢れ、困難に立ち向かう強さを持っています。逆境や鍛錬によってさらに輝きを増すタイプです。",
    essence: "鉄のように、鍛えられるほど役割が明確になる質です。前へ出る力が強く、言葉も行動も直線的になりやすいですが、根には人を助けたい温かさがあります。",
    strengths: ["抜群の決断力と実行力", "正義感が強く曲がったことが嫌い", "結果を出すためのストイックさ"],
    weaknesses: ["言動がストレートすぎて摩擦を生む", "完璧を求めすぎて他人に厳しい", "せっかちで衝突しやすい"],
    advice: "言葉選びに配慮し、相手の感情やペースを尊重することでリーダーシップがより発揮されます。",
    keywords: "決断力、正義感、ストイック、逆境で輝く"
  },
  "辛": {
    description: "繊細で美しい光を放つ宝石のような人です。非常に高い美意識とプライドを持ち、鋭い感受性を秘めています。磨かれること（試練）で本領を発揮します。",
    essence: "宝石のように、磨かれるほど美しさと価値が際立つ質です。美意識や特別意識が強く、自分を磨くことに集中すると、名誉や評価が自然に備わっていきます。",
    strengths: ["抜群のセンスと美意識", "純粋でこだわりが強い", "ディテールにこだわる完璧さ"],
    weaknesses: ["プライドが高く傷つきやすい", "批判に敏感で人を遠ざける", "自己否定に陥りやすい"],
    advice: "ありのままの自分を肯定し、完璧ではない不完全さも受け入れる寛容さを持つと楽になります。",
    keywords: "美意識、センス、純粋さ、完璧主義"
  },
  "壬": {
    description: "あらゆるものを包み込む広大な大海のような人です。自由を愛し、ダイナミックで変化に強い性質を持ちます。優れた知恵を駆使して物事を進める戦略家です。",
    essence: "海のように、止まらず流れ続ける自由な質です。好奇心と冒険心が強く、大きなスケールを求めるため、力を育てるほど人生の波を乗りこなしやすくなります。",
    strengths: ["変化に対応する柔軟性と機動力", "大局を見る知性と洞察力", "多くの人を惹きつけるカリスマ性"],
    weaknesses: ["束縛されるのを嫌いルールを無視しがち", "気分のムラが大きく流されやすい", "冷淡に見えることがある"],
    advice: "長期的な目標を設定し、日々の地道なルールや約束を守ることで確固たる地位を築けます。",
    keywords: "自由、知恵、戦略、カリスマ性"
  },
  "癸": {
    description: "大地を潤し生命を育む雨露や小川のような人です。知的好奇心が旺盛で、控えめながらも忍耐強く、コツコツと知識や努力を蓄積していくタイプです。",
    essence: "雨のように、小さな情報や経験を集めて大きな流れへ育てる質です。成果が出るまで時間はかかりますが、積み重ねを途中で止めないほど大きな開花につながります。",
    strengths: ["優れた知識欲と分析力", "優しく献身的な奉仕精神", "地道な作業を継続できる忍耐力"],
    weaknesses: ["考えすぎて行動が遅れる", "猜疑心が強く心配性", "内に不満を溜め込みやすい"],
    advice: "時には自分の直感を信じて素早く動き、悩みを信頼できる人に打ち明けることが大切です。",
    keywords: "知性、奉仕、コツコツ努力、潤いを与える"
  }
};

// 十大主星（通変星）の詳細診断テキスト
const STAR_TEXTS: Record<string, {
  reading: string;
  description: string;
  workStyle: string;
  suitableCareers: string[];
  communication: string;    // 全体的なコミュニケーション特性
  howToGuide: string;       // このタイプを指導するとき（部下・後輩）
  howToFollow: string;      // このタイプに接するとき（上司・先輩）
  howToPeer: string;        // このタイプとのコミュニケーション（同僚・対等）
  ngPoints: string;         // 避けるべきNG対応
}> = {
  "貫索星": {
    reading: "かんさくせい",
    description: "比肩にあたります。極めて強い独立心と自分のペースを頑なに守る職人気質な性質です。集団に染まらず、自分の信念を真っ直ぐ貫きます。",
    workStyle: "自分の裁量で進められる職務やプロジェクトで最大の力を発揮します。マニュアルを遵守しつつ、独自のやり方を探求します。",
    suitableCareers: ["フリーランス", "専門職・技術職", "独立起業家", "研究者"],
    communication: "対等な関係を望み、お互いのプライベートやテリトリーを侵さない距離感を好みます。お世辞や無駄な社交辞令は苦手です。",
    howToGuide: "【部下・後輩として指導するとき】指示は目的と理由をセットで明確に伝え、実際の進め方は本人に一任しましょう。自分のやり方を持つ職人気質なので、進捗の細かい管理は禁物。成果物ベースで評価し、『あとはあなたに任せる』という言葉が最大の動機づけになります。",
    howToFollow: "【上司・先輩として接するとき】この上司タイプは成果と実力を何より重んじます。余計なお世辞や媚びを売るのは逆効果。自分の専門スキルや確かな仕事ぶりで評価を勝ち取ることが大切です。報告は簡潔に事実ベースで行い、自分の意見もしっかり伝えましょう。",
    howToPeer: "【同僚・対等な関係でのコミュニケーション】互いのテリトリーを尊重するドライな関係性を好みます。業務上は信頼関係があれば必要十分。雑談や群れることより、仕事の質で認め合うスタンスが相性抜群です。共通の専門テーマについて語ると一気に距離が縮まります。",
    ngPoints: "逐一監視・マイクロマネジメント、根拠のないお世辞、やり方への過干渉はモチベーションを著しく低下させます。"
  },
  "石門星": {
    reading: "せきもんせい",
    description: "劫財にあたります。高い対人スキルと協調性を備え、組織やグループをまとめる社交家・政治家タイプです。上下関係にとらわれないフラットな人脈を作ります。",
    workStyle: "人と人との調整、交渉、グループワーク、コミュニティ運営などで頭角を現します。目標に向けて仲間を率いるのが得意です。",
    suitableCareers: ["マネージャー", "広報・営業", "イベントプランナー", "コンサルタント"],
    communication: "非常にフレンドリーで誰とでも分け隔てなく接しますが、内面には強いリーダーシップと野心を秘めています。",
    howToGuide: "【部下・後輩として指導するとき】チームや仲間を束ねる役割・権限を与えることで本領を発揮します。孤立させず、常に人との関わりの中で活動させましょう。目標を『みんなで達成する』という文脈で伝えると燃えます。成果より過程での人望形成を評価してください。",
    howToFollow: "【上司・先輩として接するとき】フラットな関係性を好む上司タイプなので、過剰な敬語や硬い報告は不要。仲間の一員として自然体で接するのが好まれます。チームへの貢献を具体的にアピールし、人脈や調整力を活かせる仕事を自ら取りに行く姿勢が評価されます。",
    howToPeer: "【同僚・対等な関係でのコミュニケーション】非常に接しやすく、飲み会や雑談でも打ち解けやすいタイプ。ただし仕事上の競争心も旺盛なため、協力と切磋琢磨のバランスが大切です。共通の目標を持てると最高のチームメイトになります。",
    ngPoints: "孤立させること、個人プレーばかりを求めること、仲間の輪から外すことは大きなストレスになります。"
  },
  "鳳閣星": {
    reading: "ほうかくせい",
    description: "食神にあたります。明るく大らかで、自然体で生きることを愛するメッセンジャータイプです。遊び心にあふれ、楽しいことや表現することがモチベーションです。",
    workStyle: "感性や表現力を生かす仕事、または人と楽しく接する業務に向いています。ゆとりのある環境で創造力を発揮します。",
    suitableCareers: ["マーケター", "クリエイター", "飲食・サービス業", "広報・司会業"],
    communication: "明るくユーモアがあり、誰からも好かれるコミュニケーションです。楽しい空間を好み、重苦しい空気を嫌います。",
    howToGuide: "【部下・後輩として指導するとき】楽しさ・やりがい・自由度を動機の軸にしましょう。『あなたの感性が活かせる仕事だよ』という伝え方が最も効果的です。成果に対して感情豊かに喜びを表現し、堅苦しいノルマや重圧は最小限に。細かいルールより大きな方向性を示すと伸びます。",
    howToFollow: "【上司・先輩として接するとき】明るく楽しい関係性を好む上司タイプ。堅苦しい報告より、楽しい雰囲気の中で成果を共有する方が喜ばれます。ユーモアを交えたコミュニケーションや、アイデアを楽しんで提案する姿勢が好印象です。",
    howToPeer: "【同僚・対等な関係でのコミュニケーション】一緒にいると場が明るくなる存在。雑談や食事など、カジュアルな場での関係構築が得意です。仕事の話も遊び心を交えながら進めると最高のパートナーに。深刻になりすぎず軽やかに付き合うのがコツです。",
    ngPoints: "重苦しいプレッシャーをかけること、感情を無視した機械的な指示、楽しさのない環境は意欲を大きく削ぎます。"
  },
  "調舒星": {
    reading: "ちょうじょせい",
    description: "傷官にあたります。極めて繊細で鋭い感受性を持つ完璧主義者です。ロマンチストで孤独を好み、言葉やアートによる繊細な自己表現を得意とします。",
    workStyle: "妥協のない高品質なクリエイティブワーク、専門的な技術、文章表現などで高いパフォーマンスを発揮します。",
    suitableCareers: ["デザイナー・芸術家", "エンジニア・プログラマー", "執筆業・ライター", "専門アドバイザー"],
    communication: "好き嫌いがはっきりしており、本質を見抜く鋭さがあります。デリケートで傷つきやすい内面を隠すためにクールに振る舞うことがあります。",
    howToGuide: "【部下・後輩として指導するとき】感情の起伏を否定せず、まず気持ちを受け止めてから話しましょう。細部へのこだわりを丁寧に褒めることで深い信頼が生まれます。批評や否定は最小限に留め、改善提案は必ず代替案とともに提示すること。完璧を求める姿勢を尊重してください。",
    howToFollow: "【上司・先輩として接するとき】感受性が鋭く本質を見抜く上司タイプ。表面的なゴマすりは即座に見破られます。実力・誠実さ・美意識の高さで評価を得ることが大切。自分の専門性や独自の視点を丁寧な言葉で伝えると響きます。感情的な衝突は避けましょう。",
    howToPeer: "【同僚・対等な関係でのコミュニケーション】一対一の深い対話を好みます。表面的な社交より、お互いの美意識や価値観を丁寧に語り合う関係が理想的。相手のこだわりや作品を心から認め、正直なフィードバックをすると強い絆が生まれます。",
    ngPoints: "雑に扱うこと、感情を無視した批評、集団の場での否定・恥をかかせることは深く傷つきます。"
  },
  "禄存星": {
    reading: "ろくぞんせい",
    description: "偏財にあたります。誰に対しても親切で愛情深く、人を引き付ける魅力を持ったビジネス志向の人です。お金やモノ、人を大きく循環させることが得意です。",
    workStyle: "顧客のニーズを察知する営業、コンサルティング、大規模なプロジェクトなど、ダイナミックに人を動かす業務で能力を発揮します。",
    suitableCareers: ["営業・販売", "起業家・経営者", "金融・アドバイザー", "サービス業"],
    communication: "面倒見がよく、人を喜ばせることが好きです。誰にでも愛想良く接するため、多くのファンを作ることができます。",
    howToGuide: "【部下・後輩として指導するとき】自分の行動が周囲にどれだけの価値をもたらしたかを数字・影響力で具体的に示すと喜びます。裁量権と自分のやり方で動ける環境を与えましょう。感謝の言葉と実績の可視化が最高の動機づけになります。",
    howToFollow: "【上司・先輩として接するとき】人を喜ばせることが好きな上司タイプ。素直な感謝と感激の表現が最大の礼儀です。ビジネス的な成果や数字で実力を示し、相手の人脈や知恵を積極的に頼ることで信頼関係が深まります。",
    howToPeer: "【同僚・対等な関係でのコミュニケーション】人を喜ばせることが得意な存在。ギブ＆テイクの精神で互いに価値を循環させる関係が理想的です。ビジネスの話もサクサク進みます。感謝と互いの成果の共有で強固な関係に育ちます。",
    ngPoints: "貢献を無視すること、利益だけを求める冷たい態度、成果の横取りは強い反発を招きます。"
  },
  "司禄星": {
    reading: "しろくせい",
    description: "正財にあたります。真面目で誠実、堅実な生き方を重んじる努力家です。貯蓄や情報の収集など、コツコツと時間と信頼を積み重ねることが得意です。",
    workStyle: "ルーティン業務の最適化、管理業務、正確さが求められる事務作業、プロジェクトのバックオフィスで圧倒的な信頼を得ます。",
    suitableCareers: ["財務・経理", "事務・管理部門", "公務員", "リスク管理・品質保証"],
    communication: "誠実で約束を違えないため、時間とともに深く強固な信頼関係を築きます。派手さはありませんが安定しています。",
    howToGuide: "【部下・後輩として指導するとき】タスクはステップバイステップで論理的に説明し、期限とルールを明確にしましょう。日々の地道な貢献を細かく積み重ねて評価し、安心感を与えることが最大の動機づけです。いきなりの大きな変化より段階的な成長機会を提供してください。",
    howToFollow: "【上司・先輩として接するとき】約束を守り、誠実に淡々と成果を積み上げる姿勢が最も評価される上司タイプ。期限と約束を絶対に守り、報告・連絡・相談を怠らないことが信頼の基本です。コツコツとした実績を積み重ねて存在感を示しましょう。",
    howToPeer: "【同僚・対等な関係でのコミュニケーション】時間をかけてじっくりと信頼関係を育む相手です。約束を守り、誠実に向き合うことで得られる絆は非常に強固。急ぎすぎず、長期的な視点で関係を深めるのが成功の鍵です。",
    ngPoints: "急かすこと、ルールを無視した行動、約束を破ること、雑な評価は深く傷つき信頼を失います。"
  },
  "車騎星": {
    reading: "しゃきせい",
    description: "偏官にあたります。スピーディで行動力に溢れ、考えるよりも先に動く実践の人です。負けず嫌いで闘争心があり、困難な課題ほど燃え上がります。",
    workStyle: "意思決定が早く、現場での実践やトラブル対応など、即座の行動力が必要とされる局面で真価を発揮します。",
    suitableCareers: ["営業の最前線", "スタートアップでの立ち上げ", "ディレクター・施工管理", "アスリート・消防など"],
    communication: "回りくどい言い回しを嫌い、ストレートで白黒はっきりした意思疎通を好みます。情に厚く竹を割ったような性格です。",
    howToGuide: "【部下・後輩として指導するとき】結論ファーストで指示を出し、すぐに動けるタスクを割り振りましょう。目標を『攻略すべき課題』としてゲーム感覚で提示すると意欲が跳ね上がります。競争心を刺激するランキングや成績の可視化も効果的です。",
    howToFollow: "【上司・先輩として接するとき】スピードと行動力を重んじる上司タイプ。グダグダした報告や言い訳は厳禁。結果をシンプルに伝え、問題があれば対策と一緒に報告しましょう。積極的に動く姿勢と即断即決のフットワークが最も評価されます。",
    howToPeer: "【同僚・対等な関係でのコミュニケーション】ストレートな物言いで、裏表のない関係が続きます。意見がぶつかることも多いですが、ケンカ後はあっさりしているタイプ。互いに競い合い、刺激し合える切磋琢磨の関係が理想です。",
    ngPoints: "回りくどい指示や報告、モタモタした行動、言い訳の多さ、弱腰な姿勢は軽蔑されます。"
  },
  "牽牛星": {
    reading: "けんぎゅうせい",
    description: "正官にあたります。高いプライドと強い責任感、モラルを備えたエリートタイプです。自らの『役割』や『立場』を深く自覚し、組織のために忠実に行動します。",
    workStyle: "秩序や階層がしっかりした組織での役割遂行、マネジメント、制度の運用、公的な職務において本領を発揮します。",
    suitableCareers: ["マネージャー・管理者", "公務員・公的機関", "法務・監査", "経営企画"],
    communication: "礼儀正しく節度ある大人の対応をします。自分のステータスや名誉、ルールを非常に重視するため失礼な態度は嫌います。",
    howToGuide: "【部下・後輩として指導するとき】役割・肩書き・権限を明確に与えることで責任感を最大に発揮します。公の場（チームメンバーの前）でしっかり敬意を示し、公式に評価しましょう。プライドを傷つける言動は禁物で、信頼と名誉を軸にした指導が最も響きます。",
    howToFollow: "【上司・先輩として接するとき】礼儀・序列・ルールを何より重んじる上司タイプ。言葉遣いや態度の礼儀を徹底し、公式な手順を踏んで誠実に接しましょう。実績と役割への誠実な取り組みが信頼につながります。砕けすぎた態度は失礼と受け取られることがあります。",
    howToPeer: "【同僚・対等な関係でのコミュニケーション】お互いの役割と責任を尊重したプロとしての関係を大切にします。ルールや約束を守り、礼儀を保つことが関係の基本。共通の目標や組織への貢献を語り合うと深い連携が生まれます。",
    ngPoints: "プライドを傷つける発言、公の場での批判・恥をかかせること、序列を無視した言動は深刻な信頼失墜を招きます。"
  },
  "龍高星": {
    reading: "りゅうこうせい",
    description: "偏印にあたります。旺盛な好奇心と冒険心を持ち、現状に満足せず新しい世界を切り拓く改革者です。旅や海外、体験学習を通じて知識を得るクリエイティブな自由人です。",
    workStyle: "新規事業の立ち上げ、イノベーション、企画開発、調査旅行など、ルーティンではない流動的で刺激的なプロジェクトに向いています。",
    suitableCareers: ["企画開発・イノベーター", "研究開発", "旅行・クリエイティブディレクター", "ITコンサルタント"],
    communication: "ユニークな視点を持ち、知的でフランクな対話を好みます。束縛や古くからの慣習、過度な同調圧力には強い拒絶感を示します。",
    howToGuide: "【部下・後輩として指導するとき】既存の枠にとらわれない自由なアイデア出しや、新しいアプローチの探索を奨励しましょう。ルールで縛りすぎると急速にモチベーションを失います。好奇心の方向に伸ばしてあげることが最高の育成法です。",
    howToFollow: "【上司・先輩として接するとき】革新と自由を重んじる上司タイプ。前例踏襲や慣習への固執は嫌われます。新しいアイデアや独自の視点を積極的に提案することで評価されます。『なぜそうするのか』の理由と目的を明確に伝えながら相談すると好印象です。",
    howToPeer: "【同僚・対等な関係でのコミュニケーション】知的でフランクな対話を楽しめるパートナーを求めています。新しい情報・ユニークな視点・体験談を共有し合える関係が理想的。型にはまった会話より、互いの知見や好奇心を刺激し合える対話が絆を深めます。",
    ngPoints: "同調圧力、慣習への固執、創造性を否定すること、過度な束縛や管理は強い拒絶反応を引き起こします。"
  },
  "玉堂星": {
    reading: "ぎょくどうせい",
    description: "印綬にあたります。論理的で体系的な知識の習得を得意とするインテリ・教育者タイプです。伝統を重んじ、物事を客観的かつ深く分析する能力に長けています。",
    workStyle: "リサーチ、教育・育成、企画書の作成、知的財産の管理など、知的なバックグラウンドが必要な役割で極めて優秀です。",
    suitableCareers: ["教育者・講師", "リサーチャー・アナリスト", "プランナー・企画職", "システムアーキテクト"],
    communication: "知的で言葉遣いが美しく、丁寧な解説を好みます。感情論ではなく論理的で客観的な事実に基づいたコミュニケーションを望みます。",
    howToGuide: "【部下・後輩として指導するとき】指示は必ず背景・目的・論理的根拠（エビデンス）をセットで伝えましょう。本人の高い知性を尊重し、アドバイザーや専門家として意見を求めると能力が最大に発揮されます。感情論より事実と論理で語ることが信頼の基盤です。",
    howToFollow: "【上司・先輩として接するとき】知識・伝統・論理を重んじる上司タイプ。感情的な訴えや根拠のない提案は通じません。データや事例をしっかり準備し、論理的に説明することで評価されます。礼節を守り、学ぶ姿勢を見せることも好印象です。",
    howToPeer: "【同僚・対等な関係でのコミュニケーション】知識や分析力を互いに認め合える関係が理想的です。専門的なテーマを深く語り合うことで急速に親密になります。論理的な議論を楽しめるパートナーとして最高の存在になれます。",
    ngPoints: "感情論での説得、根拠のない指示・要求、知性を軽んじる態度、伝統やルールの無視は信頼を損ないます。"
  }
};

// 十二運星（十二大従星）の詳細診断テキスト
const ENERGY_STAR_TEXTS: Record<string, { reading: string; level: string; description: string }> = {
  "胎": { reading: "たい", level: "3 (天報星)", description: "変化と可能性に満ちた心の状態です。多才多芸で好奇心が強く、常に新しいことに挑戦しようとするエネルギーを秘めています。" },
  "養": { reading: "よう", level: "6 (天印星)", description: "周囲から愛され、可愛がられる心の状態です。甘え上手でユーモアがあり、他者の協力を引き出して調和を保つ天性の愛嬌を持っています。" },
  "長生": { reading: "ちょうせい", level: "9 (天貴星)", description: "素直で若々しく、発展途上にあるエネルギーです。信用を重んじ、コツコツと勉強や仕事を吸収していく優等生的な魅力があります。" },
  "沐浴": { reading: "もくよく", level: "7 (天恍星)", description: "ロマンを追い求め、自立を急ぐ心の状態です。少々の葛藤や迷いを抱えつつも、常に新しい可能性に憧れて積極的に行動します。" },
  "冠帯": { reading: "かんたい", level: "10 (天南星)", description: "意気揚々と前進する、勢いのある若いエネルギーです。華やかで自己主張が強く、どのような困難にも物怖じせず突き進むパワーを持っています。" },
  "建禄": { reading: "けんろく", level: "11 (天禄星)", description: "極めて手堅く実務能力の高い、成熟したエネルギーです。安全第一で計画的に物事を進め、組織を陰からしっかりと支えます。" },
  "帝旺": { reading: "ていおう", level: "12 (天将星)", description: "最大のエネルギー量を誇る、カリスマ的なトップリーダーの心の状態です。強い責任感とパワーで、大きな組織や過酷な環境を率いる器を持っています。" },
  "衰": { reading: "すい", level: "8 (天堂星)", description: "落ち着いた温和な長老のようなエネルギーです。経験豊富で調整力に長け、一歩引いたアドバイザー的な立場で強みを発揮します。" },
  "病": { reading: "びょう", level: "4 (天胡星)", description: "豊かな直感力とイマジネーションを持つ繊細な心の状態です。芸術的な感性が鋭く、目に見えない価値やロマンを形にすることが得意です。" },
  "死": { reading: "し", level: "2 (天極星)", description: "無欲で純粋な、クリアな精神状態を表します。打算がなく、物事の本質を素直に受け入れる高い精神性や霊的な感受性を持っています。" },
  "墓": { reading: "ぼ", level: "5 (天庫星)", description: "探究心旺盛で物事を深く追求するオタク気質なエネルギーです。収集癖があり、歴史や過去の知恵から学び取ることが得意です。" },
  "絶": { reading: "ぜつ", level: "1 (天馳星)", description: "時空を超えた瞬間最大風速のエネルギーです。瞬間的な爆発力とひらめきを持ち、忙しく動き回ることで力を発揮する天才肌です。" }
};

// 五行の相生関係（生み出す）
const GENERATING_RELATION: Record<string, string> = {
  "木": "火",
  "火": "土",
  "土": "金",
  "金": "水",
  "水": "木"
};

// 五行の相克関係（やっつける）
const OVERCOMING_RELATION: Record<string, string> = {
  "木": "土",
  "火": "金",
  "土": "水",
  "金": "木",
  "水": "火"
};

// ── 天中殺（空亡）データ辞書 ──────────────────────────────────────────

/**
 * 6種の天中殺グループ詳細テキスト
 * キーは「グループ番号（0〜5）」で管理し、名前・支・説明・アドバイスを格納する
 */
const TENCHUSATSU_DATA: Record<number, {
  name: string;
  branches: string[];
  description: string;
  advice: string;
  caution: string;
  year1: { theme: string; description: string; phase: string; action: string };
  year2: { theme: string; description: string; phase: string; action: string };
}> = {
  0: {
    name: "戌亥天中殺",
    branches: ["戌", "亥"],
    description: "天に最も近い、精神性の高い天中殺です。目に見えない世界（精神・哲学・芸術）に鋭い感性を持ち、物質よりも精神的な豊かさを重視します。現実的なビジネスや利益追求よりも、理念・ビジョン・信念で動く傾向があります。",
    advice: "天中殺の年（戌・亥年）は、新規事業の立ち上げや大きな決断を避け、既存のことを丁寧に継続しながら内面を磨くことに専念してください。精神的な学びや自己研鑽に最も向いている時期です。",
    caution: "物質的・世俗的な欲に振り回されると消耗します。実利や損得勘定を優先すると運気が乱れやすいため、理念を大切にした判断を心がけてください。",
    year1: {
      theme: "天中殺【1年目・戌年】：揺らぎと受動の年",
      description: "戌亥天中殺の1年目（戌年）です。現実面での手ごたえが薄れやすく、これまでのやり方に揺らぎが生じる天中殺の入口。強引な前進や大きな契約・投資は避け、身の回りの整理と受け身の姿勢で流れに任せましょう。",
      phase: "冬の前半（受動・調整期）",
      action: "受け身のスタンスを徹底し、無理な自己主張や拡張を避けて現状維持を心がける時期。"
    },
    year2: {
      theme: "天中殺【2年目・亥年】：精神的脱皮と深部充電の年",
      description: "戌亥天中殺の2年目（亥年）です。天中殺の最も深い充電期にあたり、物質的な執着を手放して高い精神性や直感を研ぎ澄ます年。学問・自己投資・精神的充実に専念することで次の芽吹きへつながります。",
      phase: "冬の深部（完全充電期）",
      action: "内面や技術の磨き上げに集中し、天中殺明けの飛躍に向けた強固なエネルギーを蓄える時期。"
    }
  },
  1: {
    name: "申酉天中殺",
    branches: ["申", "酉"],
    description: "鋭い知性と論理力を持ち、情報収集・分析・判断に長けた天中殺です。プライドが高く完璧主義な傾向があり、仕事では極めて高いパフォーマンスを発揮します。しかし、完璧を求めすぎて人間関係に距離ができることもあります。",
    advice: "天中殺の年（申・酉年）は、新しい人間関係の構築や重要な契約・交渉を慎重に進めてください。すでに信頼関係のある人との協力を深めることで安定します。インプットに集中し、実力を蓄える時期として活用してください。",
    caution: "プライドから来る頑固さや、感情を抑圧することに注意が必要です。人に頼ることも開運のカギとなります。",
    year1: {
      theme: "天中殺【1年目・申年】：波乱と環境適応の年",
      description: "申酉天中殺の1年目（申年）です。仕事や対人関係で予期せぬ変動や試練が起きやすいスタートの年。自分のこだわりを押し通さず、周囲の意向や状況に柔軟に合わせる受動的な姿勢が安全です。",
      phase: "冬の前半（受動・適応期）",
      action: "自分の意志を抑え、相手や環境に譲る寛容さを持つことでトラブルを回避できる時期。"
    },
    year2: {
      theme: "天中殺【2年目・酉年】：実力蓄積と自己投資の年",
      description: "申酉天中殺の2年目（酉年）です。プライドや対外的な評価を一旦手放し、基礎学習やスキルの磨き直しに没頭する年。静かに実力を蓄えることで、天中殺明けの躍進のパワーが満ちていきます。",
      phase: "冬の深部（完全充電期）",
      action: "見栄や評価を求めず、ひたむきに自己研鑽とインプットを重ねる充電の時期。"
    }
  },
  2: {
    name: "午未天中殺",
    branches: ["午", "未"],
    description: "情熱的で行動力があり、組織の中心人物になりやすい天中殺です。親分肌で面倒見がよく、人望を集める力を持っています。家族・仲間・チームへの強い愛着と責任感が特徴的です。",
    advice: "天中殺の年（午・未年）は、自分一人で突き進もうとせず、チームや仲間の力を借りることで乗り越えられます。この時期は人に与えることを優先し、利益よりも信頼を積み重ねる年と捉えてください。",
    caution: "感情的になりやすく、思わぬトラブルに発展しやすい時期です。言葉選びを丁寧に行い、衝動的な行動を自制することが大切です。",
    year1: {
      theme: "天中殺【1年目・午年】：感情手放しと感謝の年",
      description: "午未天中殺の1年目（午年）です。情熱が空回りしやすく、焦りから無理な行動に出て失敗を招きやすい年。自力での突破を諦め、感謝の気持ちを持って周囲への奉仕や関係維持に徹しましょう。",
      phase: "冬の前半（受動・手放し期）",
      action: "独断での意思決定を避け、人に与えることと調和を優先して過ごす時期。"
    },
    year2: {
      theme: "天中殺【2年目・未年】：絆の醸成と精神深化の年",
      description: "午未天中殺の2年目（未年）です。身近な人や仲間との信頼関係を静かに深める充電の年。損得勘定抜きで知識や経験を蓄積することで、運気が穏やかに安定します。",
      phase: "冬の深部（完全充電期）",
      action: "見返りを求めない利他心と学びを大切にし、豊かな精神基盤を築く時期。"
    }
  },
  3: {
    name: "辰巳天中殺",
    branches: ["辰", "巳"],
    description: "カリスマ性と独自性に富み、前人未到の道を歩む天中殺です。組織のルールや既存の価値観にとらわれず、革新的なアイデアと強烈な個性で時代を切り拓きます。孤独を恐れず独自の哲学を持っています。",
    advice: "天中殺の年（辰・巳年）は、大きな挑戦や転換をするには強いエネルギーが必要な時期です。自分のペースを守りながら、基盤の整備や内省に時間を使いましょう。新規参入より現状維持と深化が吉です。",
    caution: "孤立しやすくなる傾向があります。周囲との対話を意識して怠らないようにしてください。重要な約束や契約は、この時期を外して行うのが賢明です。",
    year1: {
      theme: "天中殺【1年目・辰年】：軌道修正と見渡しの年",
      description: "辰巳天中殺の1年目（辰年）です。これまで推し進めてきた方向性にブレーキがかかりやすい年。新規参入や無謀な挑戦を止め、現状の課題をしっかり把握して軌道修正を行いましょう。",
      phase: "冬の前半（受動・確認期）",
      action: "強引なイノベーションを控え、足元の改善と現状把握に時間を割く時期。"
    },
    year2: {
      theme: "天中殺【2年目・巳年】：内省と次章への準備の年",
      description: "辰巳天中殺の2年目（巳年）です。孤立を恐れず、自分自身の本心や信念と深く向き合う年。目先の成果にこだわらず、知性や技術を密かに培うことで強い芽吹きを準備できます。",
      phase: "冬の深部（完全充電期）",
      action: "外部へのアピールを控え、静かに自身の核となる技術や思想を鍛え上げる時期。"
    }
  },
  4: {
    name: "寅卯天中殺",
    branches: ["寅", "卯"],
    description: "誠実さと実直さを持ち、地に足のついた努力で着実に成果を積み重ねる天中殺です。安定した組織や家族を大切にし、長期的な視点で物事を判断します。権威や肩書きよりも、実力と信用を重んじます。",
    advice: "天中殺の年（寅・卯年）は、派手な投資や冒険よりも、コツコツとした日常業務の精度を高めることが開運の鍵です。既存の人間関係の深化や、身近な人への感謝を伝えることが吉運を引き寄せます。",
    caution: "保守的になりすぎて変化のチャンスを逃すことがあります。大きな決断は避けつつも、成長への種まきは積極的に行ってください。",
    year1: {
      theme: "天中殺【1年目・寅年】：慎重進行と足場固めの年",
      description: "寅卯天中殺の1年目（寅年）です。勢い任せの行動が思わぬ落とし穴を招きやすい天中殺の始まり。派手な投資や急な環境変化を避け、地道な作業で足元をすくわれないよう警戒しましょう。",
      phase: "冬の前半（受動・警戒期）",
      action: "大きな挑戦や引っ越し・転職などを控え、現状維持を徹頭徹尾守る時期。"
    },
    year2: {
      theme: "天中殺【2年目・卯年】：完全充填と身内愛の年",
      description: "寅卯天中殺の2年目（卯年）です。日常の身の回りを丁寧に整え、家族や信頼できる人々との絆を大切にする年。じっくりと心身を休め、パワーを100%溜め込むのに最良の時期です。",
      phase: "冬の深部（完全充電期）",
      action: "身近な人々に感謝を伝え、身体と心のケアを優先してリフレッシュする時期。"
    }
  },
  5: {
    name: "子丑天中殺",
    branches: ["子", "丑"],
    description: "根源的なエネルギーを持ち、物事の本質を見抜く深い洞察力を備えた天中殺です。精神的・社会的なテーマに強く関心を持ち、世の中の仕組みや人間の深層心理に鋭い理解を持っています。表面よりも本質を見る力があります。",
    advice: "天中殺の年（子・丑年）は、自分の内面と深く向き合う絶好の時期です。新しい出会いや外部への拡大よりも、既存の環境を整理・充実させることに専念してください。精神的な学びや瞑想も効果的です。",
    caution: "深読みしすぎて疑心暗鬼になることがあります。思い込みや先入観を手放し、シンプルな行動を心がけることで安定します。",
    year1: {
      theme: "天中殺【1年目・子年】：原点回帰と内省の年",
      description: "子丑天中殺の1年目（子年）です。物事の本質や人生の原点について深く考えさせられる時期。急いで結論を出さず、静かに思索を深めて心の中をクリアに整理しましょう。",
      phase: "冬の前半（受動・内省期）",
      action: "外部の評価に惑わされず、自分自身の本質的な願いや過去の振り返りを行う時期。"
    },
    year2: {
      theme: "天中殺【2年目・丑年】：知恵の蓄積と完全準備の年",
      description: "子丑天中殺の2年目（丑年）です。耐え忍びながらも確かな知識や経験を蓄える年。精神的な成長や自己研鑽に投資した時間が、天中殺明けの揺るぎない力となります。",
      phase: "冬の深部（完全充電期）",
      action: "読書や研究、自己投資に没頭し、春の芽吹きに向けたエネルギーを充填する時期。"
    }
  }
};

const TENCHUSATSU_WAVE_ENERGY: Record<number, Record<string, number>> = {
  // 写真資料「天中殺の波動（幸運と衰運のサイクル）」の他力運グラフ。
  // キーは天中殺グループ番号、値はその年・月の十二支ごとのエネルギー（0〜12）。
  0: { "申": 6, "酉": 7, "戌": 0, "亥": 0, "子": 3, "丑": 6, "寅": 8, "卯": 10, "辰": 12, "巳": 12, "午": 2, "未": 1 },
  1: { "申": 0, "酉": 0, "戌": 3, "亥": 6, "子": 5, "丑": 8, "寅": 12, "卯": 12, "辰": 1, "巳": 2, "午": 6, "未": 7 },
  2: { "申": 7, "酉": 5, "戌": 2, "亥": 1, "子": 8, "丑": 4, "寅": 12, "卯": 12, "辰": 10, "巳": 6, "午": 0, "未": 0 },
  3: { "申": 8, "酉": 10, "戌": 12, "亥": 10, "子": 6, "丑": 1, "寅": 6, "卯": 7, "辰": 0, "巳": 0, "午": 3, "未": 5 },
  4: { "申": 10, "酉": 12, "戌": 12, "亥": 10, "子": 5, "丑": 5, "寅": 1, "卯": 1, "辰": 4, "巳": 0, "午": 3, "未": 6 },
  5: { "申": 9, "酉": 12, "戌": 12, "亥": 1, "子": 0, "丑": 0, "寅": 3, "卯": 4, "辰": 6, "巳": 6, "午": 1, "未": 3 }
};

const MONTH_BRANCHES = ["丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子"];
const STEM_SEQUENCE = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const BRANCH_SEQUENCE = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const SEXAGENARY_CYCLE = Array.from({ length: 60 }, (_, index) => ({
  stem: STEM_SEQUENCE[index % 10],
  branch: BRANCH_SEQUENCE[index % 12]
}));

const MAJOR_LUCK_FOCUS: Record<string, string> = {
  "貫索星": "自分の軸を守り、独立性を育てる10年。",
  "石門星": "仲間や組織とのつながりを広げる10年。",
  "鳳閣星": "自然体の表現や発信が広がる10年。",
  "調舒星": "感性、技術、こだわりを磨く10年。",
  "禄存星": "人を惹きつけ、信頼や財を循環させる10年。",
  "司禄星": "日々の積み重ねで基盤を固める10年。",
  "車騎星": "行動量を上げ、現場で突破していく10年。",
  "牽牛星": "責任、役割、社会的信用を整える10年。",
  "龍高星": "変化を受け入れ、新しい知恵を取り込む10年。",
  "玉堂星": "学び、伝統、専門性を深める10年。"
};

type LifeSeasonName = '春' | '夏' | '秋' | '冬';

type LifeSeasonDetail = {
  season: LifeSeasonName;
  seasonYear: 1 | 2 | 3;
  label: string;
  archetype: string;
  theme: string;
  description: string;
};

const LIFE_SEASON_DETAILS: LifeSeasonDetail[] = [
  {
    season: '春',
    seasonYear: 1,
    label: '春1年目',
    archetype: '世話人',
    theme: 'ケアと拡大開始',
    description: '冬に根づいた活動や関係を外へ伸ばし、自分の力を磨いて育てる時期です。'
  },
  {
    season: '春',
    seasonYear: 2,
    label: '春2年目',
    archetype: '探求者',
    theme: '自己探求と仕掛け',
    description: '広がり始めた道を検証し、自分はどう進みたいのかを問い直す時期です。'
  },
  {
    season: '春',
    seasonYear: 3,
    label: '春3年目',
    archetype: '破壊者',
    theme: '脱皮と夏への準備',
    description: '次の成長に合わなくなったものを見直し、手放すものを選ぶ時期です。'
  },
  {
    season: '夏',
    seasonYear: 1,
    label: '夏1年目',
    archetype: '恋人',
    theme: '満喫とチャレンジ',
    description: '勢いを味方につけ、好きなことや広げたいことへ大きく踏み出す時期です。'
  },
  {
    season: '夏',
    seasonYear: 2,
    label: '夏2年目',
    archetype: '創造者',
    theme: '創造と拡大',
    description: 'エネルギーが強まり、現実を形にしながら活動範囲を広げる時期です。'
  },
  {
    season: '夏',
    seasonYear: 3,
    label: '夏3年目',
    archetype: '統治者',
    theme: '責任と秋への準備',
    description: 'これまで作ってきた状況を把握し、次の秋に向けて整える時期です。'
  },
  {
    season: '秋',
    seasonYear: 1,
    label: '秋1年目',
    archetype: '魔術師',
    theme: '収穫と新陳代謝',
    description: '夏までの結果が表れ始めます。変化を観察し、流れに委ねる時期です。'
  },
  {
    season: '秋',
    seasonYear: 2,
    label: '秋2年目',
    archetype: '賢者',
    theme: '受容と学び',
    description: '起きたことを受け止め、反省や学びとして自分の中に落とし込む時期です。'
  },
  {
    season: '秋',
    seasonYear: 3,
    label: '秋3年目',
    archetype: '愚者',
    theme: '仕上げと次の準備',
    description: '良いことも難しいことも収穫として味わい、次のサイクルへ備える時期です。'
  },
  {
    season: '冬',
    seasonYear: 1,
    label: '冬1年目',
    archetype: '無垢',
    theme: '検証とスタート',
    description: '前のサイクルを振り返り、新しい方向性を静かに試し始める時期です。'
  },
  {
    season: '冬',
    seasonYear: 2,
    label: '冬2年目',
    archetype: '孤児',
    theme: '再確認と基礎固め',
    description: '必要なものを見極め、トライアンドエラーで土台を作る時期です。'
  },
  {
    season: '冬',
    seasonYear: 3,
    label: '冬3年目',
    archetype: '戦士',
    theme: '春の準備と課題への取り組み',
    description: '春の拡大に向けて、避けていた課題や本当の問題に向き合う時期です。'
  }
];

const MONTH_SOLAR_TERMS = [
  { month: 2, name: '立春', d: 4.8693, a: 0.242713 },
  { month: 3, name: '啓蟄', d: 6.3968, a: 0.242512 },
  { month: 4, name: '清明', d: 5.6280, a: 0.242231 },
  { month: 5, name: '立夏', d: 6.3771, a: 0.241945 },
  { month: 6, name: '芒種', d: 6.5733, a: 0.241731 },
  { month: 7, name: '小暑', d: 8.0091, a: 0.241642 },
  { month: 8, name: '立秋', d: 8.4102, a: 0.241703 },
  { month: 9, name: '白露', d: 8.5186, a: 0.241898 },
  { month: 10, name: '寒露', d: 9.1414, a: 0.242179 },
  { month: 11, name: '立冬', d: 8.2396, a: 0.242469 },
  { month: 12, name: '大雪', d: 7.9152, a: 0.242689 },
  { month: 1, name: '小寒', d: 6.3811, a: 0.242778 }
];

// ── ヘルパー関数 ───────────────────────────────────────────────────

/**
 * 五行の相生・相克・比和の関係性を判定する
 * @param myElem 日干の五行
 * @param targetElem 対象の五行
 * @returns 五行の関係性の距離
 */
function getRelationship(myElem: string, targetElem: string): string {
  if (myElem === targetElem) return "同";
  if (GENERATING_RELATION[myElem] === targetElem) return "生"; // 我生 (食傷)
  if (OVERCOMING_RELATION[myElem] === targetElem) return "克"; // 我克 (財星)
  if (GENERATING_RELATION[targetElem] === myElem) return "被生"; // 生我 (印星)
  return "被克"; // 克我 (官星)
}

/**
 * 2つの十干の組み合わせから通変星・十大主星を算出する
 * @param myStem 日干の十干
 * @param targetStem 対象の十干
 */
/**
 * 日柱の干支から天中殺グループを算出する（60干支サイクルベース）
 * @param stem 日干（甲〜癸）
 * @param branch 日支（子〜亥）
 * @returns 天中殺グループ番号（0〜5）
 */
export function getTenchusatsuGroup(stem: string, branch: string): number {
  const stemOrder = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const branchOrder = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const s = stemOrder.indexOf(stem);
  const b = branchOrder.indexOf(branch);
  if (s === -1 || b === -1) return 0;
  // 60干支の通し番号を CRT（中国余剰定理）的に算出する
  // i ≡ s (mod 10), i ≡ b (mod 12) → i = (s * 6 - b * 5 + 60) % 60
  const index60 = ((s * 6 - b * 5) % 60 + 60) % 60;
  return Math.floor(index60 / 10);
}

export function getTenStars(myStem: string, targetStem: string): { shinsui: string; sanmei: string } {
  const me = TEN_STEMS[myStem];
  const target = TEN_STEMS[targetStem];
  const rel = getRelationship(me.element, target.element);
  const sameYinYang = me.yinYang === target.yinYang;

  if (rel === "同") {
    return sameYinYang ? { shinsui: "比肩", sanmei: "貫索星" } : { shinsui: "劫財", sanmei: "石門星" };
  } else if (rel === "生") {
    return sameYinYang ? { shinsui: "食神", sanmei: "鳳閣星" } : { shinsui: "傷官", sanmei: "調舒星" };
  } else if (rel === "克") {
    return sameYinYang ? { shinsui: "偏財", sanmei: "禄存星" } : { shinsui: "正財", sanmei: "司禄星" };
  } else if (rel === "被克") {
    return sameYinYang ? { shinsui: "偏官", sanmei: "車騎星" } : { shinsui: "正官", sanmei: "牽牛星" };
  } else {
    // 被生 (生我)
    return sameYinYang ? { shinsui: "偏印", sanmei: "龍高星" } : { shinsui: "印綬", sanmei: "玉堂星" };
  }
}

/**
 * 日干と地支の組み合わせから十二運星を決定する
 * @param stem 日干の十干
 * @param branch 地支の十二支
 */
export function getTwelveEnergyStars(stem: string, branch: string): string {
  const table: Record<string, Record<string, string>> = {
    "甲": { "子": "沐浴", "丑": "冠帯", "寅": "建禄", "卯": "帝旺", "辰": "衰", "巳": "病", "午": "死", "未": "墓", "申": "絶", "酉": "胎", "戌": "養", "亥": "長生" },
    "乙": { "子": "病", "丑": "衰", "寅": "帝旺", "卯": "建禄", "辰": "冠帯", "巳": "沐浴", "午": "長生", "未": "養", "申": "胎", "酉": "絶", "戌": "墓", "亥": "死" },
    "丙": { "子": "胎", "丑": "養", "寅": "長生", "卯": "沐浴", "辰": "冠帯", "巳": "建禄", "午": "帝旺", "未": "衰", "申": "病", "酉": "死", "戌": "墓", "亥": "絶" },
    "丁": { "子": "絶", "丑": "墓", "寅": "死", "卯": "病", "辰": "衰", "巳": "帝旺", "午": "建禄", "未": "冠帯", "申": "沐浴", "酉": "長生", "戌": "養", "亥": "胎" },
    "戊": { "子": "胎", "丑": "養", "寅": "長生", "卯": "沐浴", "辰": "冠帯", "巳": "建禄", "午": "帝旺", "未": "衰", "申": "病", "酉": "死", "戌": "墓", "亥": "絶" }, // 火土同根
    "己": { "子": "絶", "丑": "墓", "寅": "死", "卯": "病", "辰": "衰", "巳": "帝旺", "午": "建禄", "未": "冠帯", "申": "沐浴", "酉": "長生", "戌": "養", "亥": "胎" }, // 火土同根
    "庚": { "子": "死", "丑": "墓", "寅": "絶", "卯": "胎", "辰": "養", "巳": "長生", "午": "沐浴", "未": "冠帯", "申": "建禄", "酉": "帝旺", "戌": "衰", "亥": "病" },
    "辛": { "子": "長生", "丑": "養", "寅": "胎", "卯": "絶", "辰": "墓", "巳": "死", "午": "病", "未": "衰", "申": "帝旺", "酉": "建禄", "戌": "冠帯", "亥": "沐浴" },
    "壬": { "子": "帝旺", "丑": "衰", "寅": "病", "卯": "死", "辰": "墓", "巳": "絶", "午": "胎", "未": "養", "申": "長生", "酉": "沐浴", "戌": "冠帯", "亥": "建禄" },
    "癸": { "子": "建禄", "丑": "冠帯", "寅": "沐浴", "卯": "長生", "辰": "養", "巳": "胎", "午": "絶", "未": "墓", "申": "死", "酉": "病", "戌": "衰", "亥": "帝旺" }
  };
  return table[stem]?.[branch] || "絶";
}

function getCalendarDayStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function diffCalendarDays(from: Date, to: Date) {
  const fromTime = getCalendarDayStart(from).getTime();
  const toTime = getCalendarDayStart(to).getTime();
  return Math.round((toTime - fromTime) / 86_400_000);
}

function getCurrentAge(birthDate: Date, today: Date) {
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!hasBirthdayPassed) age -= 1;
  return Math.max(0, age);
}

function getMajorLuckDirection(gender: 'male' | 'female', yearStem: string): 'right' | 'left' {
  const isYearStemYang = TEN_STEMS[yearStem]?.yinYang === "陽";
  if (gender === 'male') return isYearStemYang ? 'right' : 'left';
  return isYearStemYang ? 'left' : 'right';
}

function getMajorLuckStartAge(
  birthDate: Date,
  currentSolarMonthTerm: { name: string; date: Date },
  nextSolarMonthTerm: { name: string; date: Date },
  direction: 'right' | 'left',
) {
  const dayCount = direction === 'right'
    ? Math.max(1, diffCalendarDays(birthDate, nextSolarMonthTerm.date))
    : Math.max(1, diffCalendarDays(currentSolarMonthTerm.date, birthDate) + 1);
  const startAge = Math.min(10, Math.max(1, Math.ceil(dayCount / 3)));
  return { dayCount, startAge };
}

function getSolarMonthTermsAround(date: Date) {
  const year = date.getFullYear();
  const terms = [year - 1, year, year + 1]
    .flatMap((targetYear) => getMonthSolarTerms(targetYear).map((term) => ({
      name: term.name,
      date: new Date(targetYear, term.month - 1, term.day, 12, 0, 0)
    })))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  const birthDay = getCalendarDayStart(date).getTime();
  const current = [...terms].reverse().find((term) => getCalendarDayStart(term.date).getTime() <= birthDay);
  const next = terms.find((term) => getCalendarDayStart(term.date).getTime() > birthDay);

  return {
    current: current || { name: "節入り", date },
    next: next || { name: "次の節入り", date }
  };
}

function getMajorLuckTheme(majorStar: string, energyValue: number) {
  if (energyValue >= 10) return `${majorStar}が強く動き、社会的な役割や活動量が大きくなりやすい時期です。`;
  if (energyValue >= 7) return `${majorStar}の性質を外へ出しながら、経験を広げていく時期です。`;
  if (energyValue >= 4) return `${majorStar}を土台に、無理なく整えながら積み上げる時期です。`;
  return `${majorStar}の性質を内側で育て、準備や見直しに力を使いやすい時期です。`;
}

function buildMajorLuck(
  birthDate: Date,
  gender: 'male' | 'female',
  yearStem: string,
  monthStem: string,
  monthBranch: string,
  dayStem: string,
  toEnergyStarName: (energyName: string) => string,
  toEnergyValue: (energyName: string) => number,
): DiagnosisResult["majorLuck"] {
  const today = new Date();
  const direction = getMajorLuckDirection(gender, yearStem);
  const solarMonthTerms = getSolarMonthTermsAround(birthDate);
  const { dayCount, startAge } = getMajorLuckStartAge(
    birthDate,
    solarMonthTerms.current,
    solarMonthTerms.next,
    direction
  );
  const currentAge = getCurrentAge(birthDate, today);
  const monthIndex = getSexagenaryNumber(monthStem, monthBranch) - 1;
  const directionStep = direction === 'right' ? 1 : -1;

  const periods = Array.from({ length: 10 }, (_, index) => {
    const cycleIndex = (monthIndex + directionStep * index + 60) % 60;
    const luckStem = SEXAGENARY_CYCLE[cycleIndex].stem;
    const luckBranch = SEXAGENARY_CYCLE[cycleIndex].branch;
    const majorStar = getTenStars(dayStem, luckStem).sanmei;
    const energyName = getTwelveEnergyStars(dayStem, luckBranch);
    const ageFrom = startAge + index * 10;
    const ageTo = ageFrom + 9;
    const energyValue = toEnergyValue(energyName);

    return {
      order: index + 1,
      ageFrom,
      ageTo,
      calendarYearFrom: birthDate.getFullYear() + ageFrom,
      calendarYearTo: birthDate.getFullYear() + ageTo,
      stem: luckStem,
      branch: luckBranch,
      majorStar,
      energyStar: toEnergyStarName(energyName),
      energyValue,
      theme: getMajorLuckTheme(majorStar, energyValue),
      focus: MAJOR_LUCK_FOCUS[majorStar] || "自分の宿命と社会の接点を確認する10年。",
      isCurrent: currentAge >= ageFrom && currentAge <= ageTo
    };
  });

  return {
    gender,
    direction,
    directionLabel: direction === 'right' ? '右回り（順回り）' : '左回り（逆回り）',
    startAge,
    dayCount,
    currentAge,
    currentPeriod: periods.find((period) => period.isCurrent) || null,
    periods
  };
}

function getWaveLabel(energy: number, isTenchusatsu: boolean): string {
  if (isTenchusatsu) return "天中殺期間";
  if (energy <= 2) return "危険時期";
  if (energy >= 10) return "幸運期";
  if (energy >= 7) return "上昇期";
  if (energy >= 4) return "調整期";
  return "静観期";
}

function getWaveTheme(label: string): string {
  switch (label) {
    case "天中殺期間":
      return "流れに逆らわず、内側を整える時期";
    case "危険時期":
      return "大きな決断を控え、足元を確認する時期";
    case "幸運期":
      return "外からの追い風を活かし、成果を広げる時期";
    case "上昇期":
      return "動きながらチャンスをつかむ時期";
    case "調整期":
      return "準備と修正で次の流れを作る時期";
    default:
      return "静かに観察し、無理をしない時期";
  }
}

function getWaveDescription(label: string, energy: number): string {
  switch (label) {
    case "天中殺期間":
      return `他力運エネルギーは${energy}。新規拡大よりも整理・学び・内省を優先し、既存の約束を丁寧に守ることで次の流れが整います。`;
    case "危険時期":
      return `他力運エネルギーは${energy}。勢いで進めるほどブレが出やすいので、契約・投資・方向転換は慎重に確認しましょう。`;
    case "幸運期":
      return `他力運エネルギーは${energy}。周囲からの後押しを得やすく、発信・提案・人との連携を広げるほど運が動きます。`;
    case "上昇期":
      return `他力運エネルギーは${energy}。流れが上向きやすい時期です。試したいことを小さく始め、反応を見ながら広げましょう。`;
    case "調整期":
      return `他力運エネルギーは${energy}。準備、修正、関係の整え直しに向きます。焦らず土台を作るほど後半が安定します。`;
    default:
      return `他力運エネルギーは${energy}。周囲の動きをよく観察し、無理な拡大よりも自分のペースを守ることが大切です。`;
  }
}

function getJulianDay(year: number, month: number, day: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    m += 12;
    y -= 1;
  }
  return Math.floor(365.25 * y) + Math.floor(y / 400) - Math.floor(y / 100) + Math.floor(30.59 * (m - 2)) + day + 1721088.5;
}

function getRisshunDay(year: number): number {
  return Math.floor(4.8693 + (0.242713 * (year - 1900 - 1)) - Math.floor((year - 1900 - 1) / 4));
}

function getSeasonPatternTens(year: number, month: number, day: number): number {
  const elapsed = getJulianDay(year, month, day) - getJulianDay(1916, 1, 28);
  let remainder = elapsed % 60;
  if (remainder < 0) remainder += 60;
  const pattern = remainder <= 9 ? 10 : remainder + 10;
  return Math.floor(pattern / 10);
}

function getSeasonPatternOnes(year: number, month: number, day: number): number {
  const risshunDay = getRisshunDay(year);
  const isAfterRisshun = getJulianDay(year, month, day) >= getJulianDay(year, 2, risshunDay);
  if (isAfterRisshun) return year % 2 === 0 ? 1 : 2;
  return year % 2 === 0 ? 2 : 1;
}

function getSeasonPattern(year: number, month: number, day: number): number {
  return getSeasonPatternTens(year, month, day) * 10 + getSeasonPatternOnes(year, month, day);
}

function getLifeSeasonForDate(year: number, month: number, day: number, pattern: number): LifeSeasonDetail {
  let adjustedYear = year;
  const risshunDay = getRisshunDay(year);
  if (getJulianDay(year, month, day) < getJulianDay(year, 2, risshunDay)) {
    adjustedYear -= 1;
  }

  let k = (adjustedYear - pattern) % 12;
  if (k < 0) k += 12;

  if (k >= 2 && k <= 4) return LIFE_SEASON_DETAILS[6 + (k - 2)];
  if (k >= 5 && k <= 7) return LIFE_SEASON_DETAILS[9 + (k - 5)];
  if (k >= 8 && k <= 10) return LIFE_SEASON_DETAILS[k - 8];
  return LIFE_SEASON_DETAILS[3 + (k === 11 ? 0 : k + 1)];
}

function getMonthSolarTerms(year: number) {
  return MONTH_SOLAR_TERMS.map((term) => {
    const calculationYear = term.month <= 2 ? year - 1 : year;
    const day = Math.floor(term.d + (term.a * (calculationYear - 1900)) - Math.floor((calculationYear - 1900) / 4));
    return { ...term, day };
  });
}

function getMonthlyLifeSeasons(displayYear: number, today: Date, pattern: number) {
  const currentSeason = getLifeSeasonForDate(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
    pattern
  );
  const currentSeasonIndex = LIFE_SEASON_DETAILS.findIndex(
    (detail) => detail.season === currentSeason.season && detail.seasonYear === currentSeason.seasonYear
  );
  let eto = (displayYear % 12) - 6;
  if (eto < 0) eto += 12;

  const risshunDay = getRisshunDay(today.getFullYear());
  const isBeforeRisshun = getJulianDay(today.getFullYear(), today.getMonth() + 1, today.getDate())
    < getJulianDay(today.getFullYear(), 2, risshunDay);
  let monthSeasonIndex = currentSeasonIndex - eto + (isBeforeRisshun ? 1 : 0);
  if (monthSeasonIndex < 0) monthSeasonIndex += 12;
  if (monthSeasonIndex >= 12) monthSeasonIndex -= 12;

  return getMonthSolarTerms(displayYear).map((term) => {
    const detail = LIFE_SEASON_DETAILS[monthSeasonIndex];
    monthSeasonIndex = monthSeasonIndex < 11 ? monthSeasonIndex + 1 : 0;
    return {
      solarTermName: term.name,
      solarTermDay: term.day,
      detail
    };
  });
}

// ── メイン診断ロジック ──────────────────────────────────────────────

/**
 * 生年月日から人間タイプ診断を行う
 * @param birthDate 生年月日
 * @param birthHour 出生時間 (0-23, 不明な場合は undefined)
 */
export function diagnoseUser(birthDate: Date, birthHour?: number, gender: 'male' | 'female' = 'male'): DiagnosisResult {
  // 高精度天文暦から干支(四柱)を計算
  const almanacResult = dailyAlmanac(birthDate);
  const { pillars } = almanacResult;

  const yearStem = pillars.year.stem;
  const yearBranch = pillars.year.branch;
  const monthStem = pillars.month.stem;
  const monthBranch = pillars.month.branch;
  const dayStem = pillars.day.stem;
  const dayBranch = pillars.day.branch;

  // 出生時間に基づく時柱の処理 (無ければ年または日干支から仮で算出)
  const hourStem = birthHour !== undefined ? pillars.hour?.stem || "甲" : undefined;
  const hourBranch = birthHour !== undefined ? pillars.hour?.branch || "子" : undefined;

  // 1. 気質（日干）の取得
  const myPersonalityInfo = TEN_STEMS[dayStem];
  const personalDetail = PERSONALITY_TEXTS[dayStem];
  const instinctDetail = ELEMENT_INSTINCTS[myPersonalityInfo.element];

  // 2. 中心星（主星）の取得
  // 算命学の中心星は、日干と月支の「その日の蔵干（二十八元）」から算出する。
  const currentSolarTerm = almanacResult.solarTerm.current;
  const solarTermDay = currentSolarTerm
    ? Math.floor((birthDate.getTime() - new Date(currentSolarTerm.date).getTime()) / 86_400_000) + 1
    : null;
  const getBranchHiddenStem = (branch: string) => solarTermDay
    ? getHiddenStemBySolarTermDay(branch, solarTermDay)
    : BRANCH_REPRESENTATIVE_STEM[branch] || "甲";
  const yearHiddenStem = getBranchHiddenStem(yearBranch);
  const monthHiddenStem = getBranchHiddenStem(monthBranch);
  const dayHiddenStem = getBranchHiddenStem(dayBranch);
  const starCalc = getTenStars(dayStem, monthHiddenStem);
  const primaryStar = starCalc.sanmei; // 算命学ベースの十大主星を採用
  const makeNatalChartRow = (
    pillar: 'day' | 'month' | 'year',
    label: string,
    stem: string,
    branch: string,
    selectedHiddenStem: string,
  ) => ({
    pillar,
    label,
    stem,
    branch,
    heavenlyStar: getTenStars(dayStem, stem).sanmei,
    selectedHiddenStem,
    selectedHiddenStar: getTenStars(dayStem, selectedHiddenStem).sanmei,
    hiddenStems: getAllHiddenStems(branch).map((hiddenStem) => ({
      stem: hiddenStem,
      star: getTenStars(dayStem, hiddenStem).sanmei
    }))
  });
  const natalChart: DiagnosisResult["natalChart"] = [
    makeNatalChartRow('year', '年柱', yearStem, yearBranch, yearHiddenStem),
    makeNatalChartRow('month', '月柱', monthStem, monthBranch, monthHiddenStem),
    makeNatalChartRow('day', '日柱', dayStem, dayBranch, dayHiddenStem)
  ];

  const starDetail = STAR_TEXTS[primaryStar] || STAR_TEXTS["鳳閣星"];

  // 3. 十二大従星（日柱地支から算出）
  const energyStarName = getTwelveEnergyStars(dayStem, dayBranch);
  const energyDetail = ENERGY_STAR_TEXTS[energyStarName] || ENERGY_STAR_TEXTS["養"];
  const toEnergyStarName = (energyName: string) => {
    const match = ENERGY_STAR_TEXTS[energyName]?.level.match(/（(.+?)）|\((.+?)\)/);
    return match?.[1] || match?.[2] || `${energyName}星`;
  };
  const toEnergyValue = (energyName: string) => Number.parseInt(ENERGY_STAR_TEXTS[energyName]?.level, 10) || 0;
  const makeActionPoint = (
    pillar: 'year' | 'month' | 'day',
    label: string,
    stem: string,
    branch: string,
  ) => {
    const number = getSexagenaryNumber(stem, branch);
    const energyName = getTwelveEnergyStars(dayStem, branch);
    return {
      pillar,
      label,
      number,
      stem,
      branch,
      area: getActionAreaRoom(number),
      ...getActionAreaPoint(number),
      energyStar: toEnergyStarName(energyName),
      energyValue: toEnergyValue(energyName)
    };
  };
  const actionAreaPoints = [
    makeActionPoint('year', '年干支', yearStem, yearBranch),
    makeActionPoint('month', '月干支', monthStem, monthBranch),
    makeActionPoint('day', '日干支', dayStem, dayBranch)
  ];
  const actionEnergyScore = actionAreaPoints.reduce((sum, point) => sum + point.energyValue, 0);
  const areaCounts = actionAreaPoints.reduce<Record<string, number>>((counts, point) => {
    counts[point.area] = (counts[point.area] || 0) + 1;
    return counts;
  }, {});
  const maxAreaCount = Math.max(...Object.values(areaCounts));
  const dominantAreas = Object.entries(areaCounts)
    .filter(([, count]) => count === maxAreaCount)
    .map(([area]) => area);
  const visibleStems = [
    dayStem,
    monthStem,
    yearStem,
    ...getAllHiddenStems(dayBranch),
    ...getAllHiddenStems(monthBranch),
    ...getAllHiddenStems(yearBranch)
  ];
  const visibleStemCounts = visibleStems.reduce<Record<string, number>>((counts, stem) => {
    counts[stem] = (counts[stem] || 0) + 1;
    return counts;
  }, {});
  const stemOrder = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const talentEntries = stemOrder.map((stem) => {
    const star = getTenStars(dayStem, stem).sanmei;
    const branchEnergies = {
      day: toEnergyValue(getTwelveEnergyStars(stem, dayBranch)),
      month: toEnergyValue(getTwelveEnergyStars(stem, monthBranch)),
      year: toEnergyValue(getTwelveEnergyStars(stem, yearBranch))
    };
    const baseEnergy = branchEnergies.day + branchEnergies.month + branchEnergies.year;
    const count = visibleStemCounts[stem] || 0;
    return {
      stem,
      star,
      phenomenon: TALENT_PHENOMENA[star] || "才能",
      count,
      baseEnergy,
      totalEnergy: baseEnergy * count,
      branchEnergies
    };
  });
  const sortedTalentEntries = [...talentEntries].sort((a, b) => b.totalEnergy - a.totalEnergy);
  const topTalentEnergy = sortedTalentEntries[0]?.totalEnergy || 0;
  const secondTalentEnergy = sortedTalentEntries[1]?.totalEnergy || 0;
  const topTalentStars = talentEntries
    .filter((entry) => entry.totalEnergy === topTalentEnergy && topTalentEnergy > 0)
    .map((entry) => entry.star);

  // 4. 五行バランスの計算
  const elementBalance: Record<string, number> = { "木": 0, "火": 0, "土": 0, "金": 0, "水": 0 };
  const addElement = (stemName: string, branchName: string) => {
    const sElem = TEN_STEMS[stemName]?.element;
    const bElem = TWELVE_BRANCHES[branchName]?.element;
    if (sElem) elementBalance[sElem] += 2; // 天干は影響力を高め（2点）
    if (bElem) elementBalance[bElem] += 1.5; // 地支は1.5点
  };

  addElement(dayStem, dayBranch);
  addElement(monthStem, monthBranch);
  addElement(yearStem, yearBranch);
  if (hourStem && hourBranch) {
    addElement(hourStem, hourBranch);
  }

  // 5. 天中殺（空亡）の算出
  const tenchusatsuGroup = getTenchusatsuGroup(dayStem, dayBranch);
  const tenchusatsuData = TENCHUSATSU_DATA[tenchusatsuGroup];
  const tenchusatsuBranches = tenchusatsuData.branches;
  const tenchusatsuWave = TENCHUSATSU_WAVE_ENERGY[tenchusatsuGroup] || TENCHUSATSU_WAVE_ENERGY[0];
  const seasonPattern = getSeasonPattern(
    birthDate.getFullYear(),
    birthDate.getMonth() + 1,
    birthDate.getDate()
  );
  const today = new Date();
  const birthLifeSeason = getLifeSeasonForDate(
    birthDate.getFullYear(),
    birthDate.getMonth() + 1,
    birthDate.getDate(),
    seasonPattern
  );
  const currentLifeSeason = getLifeSeasonForDate(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
    seasonPattern
  );

  // 6. 12年間の運気サイクル（バイオリズム）を計算
  // 因果関係を見やすくするため、過去2年 + 今年を含む今後10年で表示する。
  const currentYear = today.getFullYear();
  const rhythmStartYear = currentYear - 2;
  const rhythm: DiagnosisResult["rhythm"] = [];
  const monthlyLifeSeasons = getMonthlyLifeSeasons(currentYear, today, seasonPattern);
  const monthlyRhythm: DiagnosisResult["monthlyRhythm"] = MONTH_BRANCHES.map((branch, index) => {
    const energy = tenchusatsuWave[branch] ?? 0;
    const isTenchusatsu = tenchusatsuBranches.includes(branch);
    const label = getWaveLabel(energy, isTenchusatsu);
    const monthSeason = monthlyLifeSeasons[index] || monthlyLifeSeasons[0];
    return {
      month: index + 1,
      branch,
      energy,
      label,
      theme: getWaveTheme(label),
      description: getWaveDescription(label, energy),
      isTenchusatsu,
      season: monthSeason.detail.season,
      seasonYear: monthSeason.detail.seasonYear,
      seasonPhase: `${monthSeason.detail.label}「${monthSeason.detail.archetype}」`,
      seasonAction: monthSeason.detail.description,
      solarTermName: monthSeason.solarTermName,
      solarTermDay: monthSeason.solarTermDay
    };
  });
  const majorLuck = buildMajorLuck(
    birthDate,
    gender,
    yearStem,
    monthStem,
    monthBranch,
    dayStem,
    toEnergyStarName,
    toEnergyValue
  );

  // 通変星・十大主星に応じた12年運気バイオリズムのデータ定義（四柱推命・算命学双方のキーに対応）
  const STAR_RHYTHM_MAP: Record<string, {
    energyType: string;
    energyScore: number;
    theme: string;
    description: string;
    season: '春' | '夏' | '秋' | '冬';
    seasonPhase: string;
    seasonAction: string;
  }> = {
    "比肩": {
      energyType: "開拓", energyScore: 4.2,
      theme: "自立と新たな開拓の年",
      description: "自分軸を確立し、新しいスタートを切る年。意志を持って自分の道を切り拓く時期です。",
      season: "春", seasonPhase: "開拓期（芽吹き）", seasonAction: "新しい目標を明確にし、主体的に挑戦を開始する最適な時期です。"
    },
    "貫索星": {
      energyType: "開拓", energyScore: 4.2,
      theme: "自立と新たな開拓の年",
      description: "自分軸を確立し、新しいスタートを切る年。意志を持って自分の道を切り拓く時期です。",
      season: "春", seasonPhase: "開拓期（芽吹き）", seasonAction: "新しい目標を明確にし、主体的に挑戦を開始する最適な時期です。"
    },
    "劫財": {
      energyType: "挑戦", energyScore: 4.6,
      theme: "和合とスケールアップの年",
      description: "仲間や協力を得て大きな目標へ挑戦する年。スケールの大きな展開が期待できます。",
      season: "春", seasonPhase: "生長前期（拡大）", seasonAction: "周囲と協力しながら事業や活動を拡大し、野心を持って前進しましょう。"
    },
    "石門星": {
      energyType: "挑戦", energyScore: 4.6,
      theme: "和合とスケールアップの年",
      description: "仲間や協力を得て大きな目標へ挑戦する年。スケールの大きな展開が期待できます。",
      season: "春", seasonPhase: "生長前期（拡大）", seasonAction: "周囲と協力しながら事業や活動を拡大し、野心を持って前進しましょう。"
    },
    "食神": {
      energyType: "表現", energyScore: 3.5,
      theme: "悠々自適と自己表現の年",
      description: "心身のゆとりと楽しみを大切にする年。趣味や表現活動から新しい幸運が生まれます。",
      season: "夏", seasonPhase: "開花期（花咲く時期）", seasonAction: "無理な拡張よりも楽しむことを優先し、自分の魅力や感性をのびのびと表現しましょう。"
    },
    "鳳閣星": {
      energyType: "表現", energyScore: 3.5,
      theme: "悠々自適と自己表現の年",
      description: "心身のゆとりと楽しみを大切にする年。趣味や表現活動から新しい幸運が生まれます。",
      season: "夏", seasonPhase: "開花期（花咲く時期）", seasonAction: "無理な拡張よりも楽しむことを優先し、自分の魅力や感性をのびのびと表現しましょう。"
    },
    "傷官": {
      energyType: "探求", energyScore: 3.2,
      theme: "感性の研ぎ澄ましと探求の年",
      description: "鋭い直感と美的センスが冴える年。専門技術やクリエイティブな分野で才能が開花します。",
      season: "夏", seasonPhase: "洗練期（専門深化）", seasonAction: "こだわりを持ってクオリティを高め、感性を生かした制作や技術の習得に打ち込みましょう。"
    },
    "調舒星": {
      energyType: "探求", energyScore: 3.2,
      theme: "感性の研ぎ澄ましと探求の年",
      description: "鋭い直感と美的センスが冴える年。専門技術やクリエイティブな分野で才能が開花します。",
      season: "夏", seasonPhase: "洗練期（専門深化）", seasonAction: "こだわりを持ってクオリティを高め、感性を生かした制作や技術の習得に打ち込みましょう。"
    },
    "偏財": {
      energyType: "循環", energyScore: 4.5,
      theme: "人脈開拓とダイナミックな循環の年",
      description: "多くの人と関わり、人脈とお金の流れが活発になる回転の年。社交性が運を呼びます。",
      season: "秋", seasonPhase: "結実期（果実が実る時期）", seasonAction: "積極的に人と会い、価値や情報を循環させることで大きなチャンスを掴みましょう。"
    },
    "禄存星": {
      energyType: "循環", energyScore: 4.5,
      theme: "人脈開拓とダイナミックな循環の年",
      description: "多くの人と関わり、人脈とお金の流れが活発になる回転の年。社交性が運を呼びます。",
      season: "秋", seasonPhase: "結実期（果実が実る時期）", seasonAction: "積極的に人と会い、価値や情報を循環させることで大きなチャンスを掴みましょう。"
    },
    "正財": {
      energyType: "蓄積", energyScore: 4.0,
      theme: "堅実な信頼と資産蓄積の年",
      description: "日々の努力が形になり、信頼と安定した基盤が作られる年。着実な一歩が実りを結びます。",
      season: "秋", seasonPhase: "収穫期（蓄えの時期）", seasonAction: "契約や貯蓄、日々のルーティンを大切にし、長期的な安定基盤をしっかりと固めましょう。"
    },
    "司禄星": {
      energyType: "蓄積", energyScore: 4.0,
      theme: "堅実な信頼と資産蓄積の年",
      description: "日々の努力が形になり、信頼と安定した基盤が作られる年。着実な一歩が実りを結びます。",
      season: "秋", seasonPhase: "収穫期（蓄えの時期）", seasonAction: "契約や貯蓄、日々のルーティンを大切にし、長期的な安定基盤をしっかりと固めましょう。"
    },
    "偏官": {
      energyType: "躍進", energyScore: 5.0,
      theme: "スピーディな挑戦と飛躍の年",
      description: "環境が激しく動き、持ち前の行動力で限界を突破するアクションの年。多忙ですが飛躍できます。",
      season: "夏", seasonPhase: "躍進期（太陽へ向かう時期）", seasonAction: "フットワーク軽く即断即決で動くことが鍵。課題やトラブルもチャンスに変えられます。"
    },
    "車騎星": {
      energyType: "躍進", energyScore: 5.0,
      theme: "スピーディな挑戦と飛躍の年",
      description: "環境が激しく動き、持ち前の行動力で限界を突破するアクションの年。多忙ですが飛躍できます。",
      season: "夏", seasonPhase: "躍進期（太陽へ向かう時期）", seasonAction: "フットワーク軽く即断即決で動くことが鍵。課題やトラブルもチャンスに変えられます。"
    },
    "正官": {
      energyType: "達成", energyScore: 4.8,
      theme: "社会的役割と名誉確立の年",
      description: "これまでの貢献が評価され、責任あるポジションや名誉を得る達成の年。信頼が高まります。",
      season: "秋", seasonPhase: "完熟期（最高評価の時期）", seasonAction: "組織や社会での役割を果たし、約束を守り誠実に行動することで不動の評価を得ましょう。"
    },
    "牽牛星": {
      energyType: "達成", energyScore: 4.8,
      theme: "社会的役割と名誉確立の年",
      description: "これまでの貢献が評価され、責任あるポジションや名誉を得る達成の年。信頼が高まります。",
      season: "秋", seasonPhase: "完熟期（最高評価の時期）", seasonAction: "組織や社会での役割を果たし、約束を守り誠実に行動することで不動の評価を得ましょう。"
    },
    "偏印": {
      energyType: "改革", energyScore: 3.6,
      theme: "好奇心と環境イノベーションの年",
      description: "新しい世界への好奇心が高まり、環境や学びを変革する年。旅行や体験からインスピレーションを得ます。",
      season: "冬", seasonPhase: "準備期（次サイクルへの移行）", seasonAction: "固定観念にとらわれず、新しいアイデアや未知の分野にどんどん触れて見聞を広めましょう。"
    },
    "龍高星": {
      energyType: "改革", energyScore: 3.6,
      theme: "好奇心と環境イノベーションの年",
      description: "新しい世界への好奇心が高まり、環境や学びを変革する年。旅行や体験からインスピレーションを得ます。",
      season: "冬", seasonPhase: "準備期（次サイクルへの移行）", seasonAction: "固定観念にとらわれず、新しいアイデアや未知の分野にどんどん触れて見聞を広めましょう。"
    },
    "印綬": {
      energyType: "習得", energyScore: 3.8,
      theme: "学問探求と知性充填の年",
      description: "じっくり学び、知識や精神性を深める年。インプットと自分磨きに最適な知識の充実期です。",
      season: "春", seasonPhase: "萌芽期（知恵の種を育てる）", seasonAction: "勉強・資格取得・研究に時間を投資し、目上の人や師からの教えを素直に吸収しましょう。"
    },
    "玉堂星": {
      energyType: "習得", energyScore: 3.8,
      theme: "学問探求と知性充填の年",
      description: "じっくり学び、知識や精神性を深める年。インプットと自分磨きに最適な知識の充実期です。",
      season: "春", seasonPhase: "萌芽期（知恵の種を育てる）", seasonAction: "勉強・資格取得・研究に時間を投資し、目上の人や師からの教えを素直に吸収しましょう。"
    }
  };

  // 年ごとの干支を簡易計算 (2026年＝丙午 を基準とする)
  const stemsLoop = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const branchesLoop = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

  for (let i = 0; i < 12; i++) {
    const testYear = rhythmStartYear + i;
    // 2026年(令和8年)は「丙午」
    const yearDiff = testYear - 2026;
    const stemIdx = (stemsLoop.indexOf("丙") + yearDiff + 120) % 10;
    const branchIdx = (branchesLoop.indexOf("午") + yearDiff + 120) % 12;

    const yStem = stemsLoop[stemIdx];
    const yBranch = branchesLoop[branchIdx];

    // 本人の日干と、その年の年干の関係性からその年の運気星を計算
    const annualStar = getTenStars(dayStem, yStem);
    const starName = annualStar.sanmei;

    // 天中殺の年かどうか判定（その年の地支が本人の天中殺の地支と一致するか）
    const isTenchusatsu = tenchusatsuBranches.includes(yBranch);
    const waveEnergy = tenchusatsuWave[yBranch] ?? 0;
    const waveLabel = getWaveLabel(waveEnergy, isTenchusatsu);

    const baseData = STAR_RHYTHM_MAP[starName] || STAR_RHYTHM_MAP[annualStar.shinsui] || {
      energyType: "開拓",
      energyScore: 4.0,
      theme: "穏やかに過ごせる堅実な時期",
      description: "自分のペースを守り、着実に進んでいく時期です。",
      season: "春",
      seasonPhase: "開拓期",
      seasonAction: "基盤を整えましょう。"
    };

    let energyType = baseData.energyType;
    let energyScore = baseData.energyScore;
    let theme = baseData.theme;
    let description = baseData.description;
    let season = baseData.season;
    let seasonYear: 1 | 2 | 3 = 1;
    let seasonPhase = baseData.seasonPhase;
    let seasonAction = baseData.seasonAction;
    const isCurrentYear = testYear === currentYear;
    const lifeSeason = getLifeSeasonForDate(
      testYear,
      isCurrentYear ? today.getMonth() + 1 : 7,
      isCurrentYear ? today.getDate() : 1,
      seasonPattern
    );

    if (isTenchusatsu) {
      const tenIdx = tenchusatsuBranches.indexOf(yBranch);
      const isYear1 = tenIdx === 0;
      const yearInfo = isYear1 ? tenchusatsuData.year1 : tenchusatsuData.year2;

      energyType = isYear1 ? "天中殺 1年目" : "天中殺 2年目";
      energyScore = isYear1 ? 1.8 : 1.4;
      theme = yearInfo.theme;
      description = yearInfo.description;
    } else {
      theme = `${getWaveTheme(waveLabel)}（${baseData.theme}）`;
      description = `${getWaveDescription(waveLabel, waveEnergy)} ${baseData.description}`;
    }
    season = lifeSeason.season;
    seasonYear = lifeSeason.seasonYear;
    seasonPhase = `${lifeSeason.label}「${lifeSeason.archetype}」`;
    seasonAction = lifeSeason.description;

    rhythm.push({
      year: testYear,
      stem: yStem,
      branch: yBranch,
      energyType,
      energyScore,
      waveEnergy,
      waveLabel,
      theme,
      description,
      isTenchusatsu,
      season,
      seasonYear,
      seasonPhase,
      seasonAction
    });
  }

  return {
    pillars: {
      year: { stem: yearStem, branch: yearBranch },
      month: { stem: monthStem, branch: monthBranch },
      day: { stem: dayStem, branch: dayBranch },
      hour: hourStem && hourBranch ? { stem: hourStem, branch: hourBranch } : undefined
    },
    personality: {
      stem: dayStem,
      name: myPersonalityInfo.name,
      alias: myPersonalityInfo.alias,
      natureSymbol: myPersonalityInfo.natureSymbol,
      element: myPersonalityInfo.element,
      yinYang: myPersonalityInfo.yinYang,
      instinct: instinctDetail.name,
      instinctDescription: instinctDetail.description,
      description: personalDetail.description,
      essence: personalDetail.essence,
      strengths: personalDetail.strengths,
      weaknesses: personalDetail.weaknesses,
      advice: personalDetail.advice,
      shortDesc: personalDetail.keywords
    },
    jobStyle: {
      primaryStar,
      primaryStarReading: starDetail.reading,
      description: starDetail.description,
      workStyle: starDetail.workStyle,
      suitableCareers: starDetail.suitableCareers,
      shortDesc: starDetail.workStyle
    },
    lifeChart: {
      solarTermDay,
      hiddenStems: {
        yearBranch: yearHiddenStem,
        monthBranch: monthHiddenStem,
        dayBranch: dayHiddenStem
      },
      majorStars: {
        head: getTenStars(dayStem, yearStem).sanmei,
        abdomen: getTenStars(dayStem, monthStem).sanmei,
        leftHand: getTenStars(dayStem, yearHiddenStem).sanmei,
        center: primaryStar,
        rightHand: getTenStars(dayStem, dayHiddenStem).sanmei
      },
      energyStars: {
        leftShoulder: toEnergyStarName(getTwelveEnergyStars(dayStem, yearBranch)),
        leftFoot: toEnergyStarName(getTwelveEnergyStars(dayStem, monthBranch)),
        rightFoot: toEnergyStarName(getTwelveEnergyStars(dayStem, dayBranch))
      }
    },
    natalChart,
    actionArea: {
      energyScore: actionEnergyScore,
      energyLevel: actionEnergyScore < 15 ? 'low' : actionEnergyScore > 24 ? 'high' : 'balanced',
      dominantAreas,
      points: actionAreaPoints
    },
    talentEnergy: {
      topGap: topTalentEnergy - secondTalentEnergy,
      hasStrongTalentStar: topTalentEnergy - secondTalentEnergy >= 30,
      dominantStars: topTalentStars,
      entries: talentEntries
    },
    communication: {
      description: starDetail.communication,
      howToGuide: starDetail.howToGuide,
      howToFollow: starDetail.howToFollow,
      howToPeer: starDetail.howToPeer,
      ngPoints: starDetail.ngPoints
    },
    energy: {
      star: energyStarName,
      reading: energyDetail.reading,
      level: energyDetail.level,
      description: energyDetail.description
    },
    rhythm,
    monthlyRhythm,
    majorLuck,
    seasonCycle: {
      birth: {
        season: birthLifeSeason.season,
        seasonYear: birthLifeSeason.seasonYear,
        label: birthLifeSeason.label,
        theme: birthLifeSeason.theme,
        description: birthLifeSeason.description
      },
      current: {
        season: currentLifeSeason.season,
        seasonYear: currentLifeSeason.seasonYear,
        label: currentLifeSeason.label,
        theme: currentLifeSeason.theme,
        description: currentLifeSeason.description
      }
    },
    elementBalance,
    tenchusatsu: {
      name: tenchusatsuData.name,
      branches: tenchusatsuData.branches,
      description: tenchusatsuData.description,
      advice: tenchusatsuData.advice,
      caution: tenchusatsuData.caution
    }
  };
}
