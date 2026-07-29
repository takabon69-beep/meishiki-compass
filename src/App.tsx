import { useMemo, useState } from 'react';
import { diagnoseUser, type DiagnosisResult } from './utils/astrology';

type ActiveTab = 'profile' | 'work' | 'relation' | 'rhythm';
type Gender = 'male' | 'female';

const defaultAccessCodeHash = 'ee800c299ae06ace262346e7516ae7b9b7ce90715b923823d16af5c4afa566b9';
const configuredAccessCodeHash = import.meta.env.VITE_ACCESS_CODE_HASH || '';
const acceptedAccessCodeHashes = Array.from(new Set([
  configuredAccessCodeHash,
  defaultAccessCodeHash,
].filter(Boolean)));
const accessStorageKey = 'meishiki-compass-access';
const shouldRequireAccessCode = !import.meta.env.DEV;

function getThemeClass(element: string) {
  switch (element) {
    case '木': return 'wood-theme';
    case '火': return 'fire-theme';
    case '土': return 'earth-theme';
    case '金': return 'metal-theme';
    case '水': return 'water-theme';
    default: return '';
  }
}

function assetPath(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}

function getStemImage(stem: string) {
  switch (stem) {
    case '甲': return assetPath('/assets/stem-kou-tree.svg');
    case '乙': return assetPath('/assets/stem-otsu-flower.svg');
    case '丙': return assetPath('/assets/stem-hei-sun.svg');
    case '丁': return assetPath('/assets/stem-tei-lamp.svg');
    case '戊': return assetPath('/assets/stem-bo-mountain.svg');
    case '己': return assetPath('/assets/stem-ki-earth.svg');
    case '庚': return assetPath('/assets/stem-kou-metal.svg');
    case '辛': return assetPath('/assets/stem-shin-jewel.svg');
    case '壬': return assetPath('/assets/stem-jin-sea.svg');
    case '癸': return assetPath('/assets/stem-ki-rain.svg');
    default: return assetPath('/assets/stem-kou-tree.svg');
  }
}

async function sha256Hex(value: string) {
  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function AccessGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setError('');

    const inputHash = await sha256Hex(code.trim());
    if (acceptedAccessCodeHashes.includes(inputHash)) {
      localStorage.setItem(accessStorageKey, inputHash);
      onUnlock();
      return;
    }

    setError('パスコードが違います。もう一度入力してください。');
    setIsChecking(false);
  };

  return (
    <div className="app-container access-screen">
      <main className="access-shell">
        <section className="access-panel">
          <span className="eyebrow">PRIVATE PREVIEW</span>
          <h1>MEISHIKI Compass</h1>
          <p>
            このページは、パスコードを知っている方だけに公開しています。
            共有された合言葉を入力してください。
          </p>
          <form onSubmit={handleSubmit} className="access-form">
            <label className="form-group">
              <span className="form-label">パスコード</span>
              <input
                type="password"
                className="form-input"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                autoComplete="current-password"
                autoFocus
              />
            </label>
            {error && <p className="access-error">{error}</p>}
            <button type="submit" className="btn-primary" disabled={isChecking || !code.trim()}>
              {isChecking ? '確認しています' : '入る'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

function AccessSetupRequired() {
  return (
    <div className="app-container access-screen">
      <main className="access-shell">
        <section className="access-panel">
          <span className="eyebrow">SETUP REQUIRED</span>
          <h1>パスコード未設定です</h1>
          <p>
            公開用ビルドにアクセス用のSecretが入っていません。
            GitHubのActions Secretに「VITE_ACCESS_CODE_HASH」を追加してから、Deploy workflowを再実行してください。
          </p>
        </section>
      </main>
    </div>
  );
}

function makeBirthDate(year: string, month: string, day: string) {
  return new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
}

function getDaysInMonth(year: string, month: string) {
  return new Date(Number(year), Number(month), 0).getDate();
}

function clampDay(year: string, month: string, day: string) {
  return String(Math.min(Number(day), getDaysInMonth(year, month)));
}

type EnergyStarCorrespondence = {
  fortuneName: string;
  sanmeiName: string;
  order: number;
  energyValue: number;
  lifeStage: string;
  keywords: string;
  profileMeaning: string;
};

const energyStarCorrespondences: Record<string, EnergyStarCorrespondence> = {
  胎: {
    fortuneName: '胎',
    sanmeiName: '天報星',
    order: 1,
    energyValue: 3,
    lifeStage: '母胎に宿る・可能性の芽生え',
    keywords: '感覚的・空想力・準備段階・多芸多才',
    profileMeaning: 'まだ形になる前の可能性を多く持つ星です。ひとつに決め切る前の感覚や空想から動き始めるため、変化を試しながら芽を見つけると力が出ます。',
  },
  養: {
    fortuneName: '養',
    sanmeiName: '天印星',
    order: 2,
    energyValue: 6,
    lifeStage: '胎内で育まれる・守られる',
    keywords: '無邪気・養子気質・こだわらない・自然体',
    profileMeaning: '守られながら育つような、自然体で人を和ませる星です。周りの力を借りることに抵抗を持ちすぎないほど、愛嬌や柔らかさが役割になります。',
  },
  長生: {
    fortuneName: '長生',
    sanmeiName: '天貴星',
    order: 3,
    energyValue: 9,
    lifeStage: '誕生・初々しいスタート',
    keywords: 'プライド・探求心・伝統や古典',
    profileMeaning: '生まれたばかりの素直な成長力を持つ星です。学ぶ、吸収する、信頼を積み上げる流れに乗ると、まっすぐ伸びていきます。',
  },
  沐浴: {
    fortuneName: '沐浴',
    sanmeiName: '天恍星',
    order: 4,
    energyValue: 7,
    lifeStage: '産湯を使う・未成熟な魅力',
    keywords: 'ロマンチスト・芸能向き・華やかさ',
    profileMeaning: '未成熟さと華やかさが同居する星です。ロマンや憧れに心が動きやすく、表現する場や新しい刺激があるほど魅力が出ます。',
  },
  冠帯: {
    fortuneName: '冠帯',
    sanmeiName: '天南星',
    order: 5,
    energyValue: 10,
    lifeStage: '元服・青年期の意気込み',
    keywords: '冒険心・向上心・強い自我・批判力',
    profileMeaning: '青年期の勢いと、自分の力を試したい気持ちが強い星です。目標がはっきりすると前に出る力が増し、挑戦の場で持ち味が出ます。',
  },
  建禄: {
    fortuneName: '建禄',
    sanmeiName: '天禄星',
    order: 6,
    energyValue: 11,
    lifeStage: '社会人として自立・実務力',
    keywords: '堅実・慎重・観察力・論理的思考',
    profileMeaning: '社会の中で自立し、現実を手堅く動かす星です。観察し、段取りを組み、継続して整える仕事で信頼を積み上げます。',
  },
  帝旺: {
    fortuneName: '帝旺',
    sanmeiName: '天将星',
    order: 7,
    energyValue: 12,
    lifeStage: '人生の最盛期・強いエネルギー',
    keywords: '自信家・リーダー気質・創始者タイプ',
    profileMeaning: '十二段階の中で最も大きなエネルギーを持つ星です。責任ある立場や大きなテーマを引き受けた時に、統率力と突破力が出やすくなります。',
  },
  衰: {
    fortuneName: '衰',
    sanmeiName: '天堂星',
    order: 8,
    energyValue: 8,
    lifeStage: '盛りを過ぎ、落ち着き・円熟へ',
    keywords: '老成・思慮深さ・精神性・悟り',
    profileMeaning: '勢いで押すより、経験や落ち着きで支える星です。一歩引いた場所から全体を見て、助言や調整で力を発揮します。',
  },
  病: {
    fortuneName: '病',
    sanmeiName: '天胡星',
    order: 9,
    energyValue: 4,
    lifeStage: '老いによる衰え・内省',
    keywords: '直感・芸術性・繊細でロマンティック',
    profileMeaning: '外へ強く押し出すより、内側の感性や直感が働く星です。静かに感じ取り、イメージや言葉や作品として形にすることで力が出ます。',
  },
  死: {
    fortuneName: '死',
    sanmeiName: '天極星',
    order: 10,
    energyValue: 2,
    lifeStage: '肉体活動の終わり・純粋性',
    keywords: '一途・技術や芸術への没頭・宗教性',
    profileMeaning: '余計な欲をそぎ落とし、純粋にひとつのことへ向かう星です。派手さよりも、技術や精神性を深める場で集中力が出ます。',
  },
  墓: {
    fortuneName: '墓',
    sanmeiName: '天庫星',
    order: 11,
    energyValue: 5,
    lifeStage: '墓に還る・蓄積・探求',
    keywords: '凝り性・探求・伝統の継承・長男気質',
    profileMeaning: '集める、蓄える、深く掘ることに強い星です。過去の知恵や資料を整理し、専門性として積み上げるほど価値になります。',
  },
  絶: {
    fortuneName: '絶',
    sanmeiName: '天馳星',
    order: 12,
    energyValue: 1,
    lifeStage: 'いったん消滅・エネルギーの極限',
    keywords: '瞬発力・土壇場での爆発力・多忙',
    profileMeaning: '一定のペースで積み上げるより、瞬間的な反応とひらめきで動く星です。変化や短期集中の場で、土壇場の強さが出ます。',
  },
};

function getEnergyStarCorrespondence(star: string) {
  return energyStarCorrespondences[star] || {
    fortuneName: star,
    sanmeiName: star,
    order: 0,
    energyValue: 0,
    lifeStage: '命式上のエネルギー段階',
    keywords: '行動エネルギー',
    profileMeaning: 'その人がどんな勢いで動きやすいかを見る星です。',
  };
}

function buildInsightCards(
  result: DiagnosisResult,
  targetLabel: string,
) {
  const currentYearNode = result.rhythm.find((node) => node.year === new Date().getFullYear()) || result.rhythm[0];
  const energyGuide = getEnergyStarCorrespondence(result.energy.star);

  return [
    {
      eyebrow: 'SELF MANUAL',
      title: `${targetLabel}の取扱説明書`,
      body: `${result.personality.alias}タイプは、${result.personality.shortDesc}が核にあります。無理に急かすより、納得できる目的と自分らしい進め方があると力を出しやすいタイプです。`,
      items: result.personality.strengths,
    },
    {
      eyebrow: 'OUTSIDE VIEW',
      title: '周囲から見た印象',
      body: `${result.jobStyle.primaryStar}の性質が出るため、仕事では「${result.jobStyle.shortDesc}」の人として見られやすいでしょう。本人の自然な振る舞いが、そのまま役割として伝わります。`,
      items: result.jobStyle.suitableCareers.slice(0, 3),
    },
    {
      eyebrow: 'RELATIONSHIP',
      title: 'まわりとの関係のヒント',
      body: result.communication.howToPeer,
      items: [
        '先に目的を共有する',
        '合う距離感を尊重する',
        '強みが出る役割を渡す',
      ],
    },
    {
      eyebrow: 'TEAM ROLE',
      title: 'チームで活きる役割',
      body: `${energyGuide.sanmeiName}（十二運：${energyGuide.fortuneName}）の行動エネルギーを持つため、${energyGuide.profileMeaning} チームでは、この人が自然に動ける場面を見つけることが大切です。`,
      items: [
        `エネルギー値 ${energyGuide.energyValue}`,
        currentYearNode?.theme ?? '今の流れを読む',
        `${result.tenchusatsu.name}のリズム`,
      ],
    },
  ];
}

function PillarBox({ label, stem, branch }: { label: string; stem: string; branch: string }) {
  return (
    <div className="pillar-box">
      <span className="pillar-label">{label}</span>
      <span className="pillar-value">{stem}{branch}</span>
    </div>
  );
}

const stemPillarQualities: Record<string, string> = {
  甲: 'まっすぐ伸びる意志があり、正しいと思った道を粘り強く進める力',
  乙: '柔らかく人に合わせながら、自分の根を静かに広げていく力',
  丙: '明るく場を照らし、物事を前向きに動かしていく力',
  丁: '小さな違和感や気持ちを受け取り、必要な人をそっと照らす力',
  戊: 'どっしり構えて人や出来事を受け止め、大きな視点で支える力',
  己: '現実を整え、人や物事を育てながら形にしていく力',
  庚: '決断力があり、迷いを断ち切って現実を動かす力',
  辛: '美意識と精度を大切にし、物事を磨き上げる力',
  壬: '大きな流れを読み、自由に動きながら可能性を広げる力',
  癸: '細やかに学び、必要なものを静かに蓄えて育てる力',
};

const branchPillarQualities: Record<string, string> = {
  子: '直感と吸収力が働き、まだ見えていない可能性を感じ取る性質',
  丑: '時間をかけて蓄え、簡単には崩れない土台を作る性質',
  寅: '新しい方向へ踏み出し、伸びしろを信じて挑戦する性質',
  卯: '人との調和や柔らかさを大切にし、自然に縁を広げる性質',
  辰: '変化を受け止めながら、理想を現実へつなげようとする性質',
  巳: '内側に熱を持ち、集中して物事を深めていく性質',
  午: '表に出る力が強く、明るさや勢いで場を動かす性質',
  未: '人を育て、場を和らげながら着実に整えていく性質',
  申: '観察力と実行力があり、状況に応じて素早く動く性質',
  酉: '完成度や美しさを求め、無駄を削って整える性質',
  戌: '誠実さと信念を大切にし、守るべきものに忠実に動く性質',
  亥: '深い感受性と探究心があり、見えない流れを感じながら進む性質',
};

function getPillarCombinationMeaning(stem: string, branch: string) {
  const stemQuality = stemPillarQualities[stem] || '自分らしい力を外へ出していく性質';
  const branchQuality = branchPillarQualities[branch] || 'その力を支える土台の性質';
  return `${stemQuality}と、${branchQuality}が重なる組み合わせです。`;
}

type PillarMeaningCard = {
  label: string;
  title: string;
  body: string;
  relation: string;
  face: string;
  ageRange: string;
};

function getPillarMeaningCards(result: DiagnosisResult) {
  const makePillarText = (
    pillar: { stem: string; branch: string } | undefined,
    roleText: string,
    missingText?: string,
  ) => {
    if (!pillar) return missingText || '出生時間が不明なため、この柱は参考情報として見ます。';

    return `${getPillarCombinationMeaning(pillar.stem, pillar.branch)}${roleText}`;
  };

  return [
    {
      label: '年柱',
      title: `${result.pillars.year.stem}${result.pillars.year.branch}の意味`,
      body: makePillarText(
        result.pillars.year,
        'この柱は、目上の人や社会から見られやすい公の顔として出ます。初対面でまといやすい雰囲気、家系から受け取った価値観、肩書きや立場を通して信頼される土台を読みます。',
      ),
      relation: '先祖・家系・両親・目上・社会全体',
      face: '社会や目上から見られる自分。第一印象、公の顔、肩書きに出やすい性質。',
      ageRange: '幼少期〜20代半ば',
    },
    {
      label: '月柱',
      title: `${result.pillars.month.stem}${result.pillars.month.branch}の意味`,
      body: makePillarText(
        result.pillars.month,
        'この柱は、職場や友人関係など対等な人との間で出やすい顔として読みます。社会人としての振る舞い、仕事の進め方、横のつながりの中で自然に出る性格がここに表れます。',
      ),
      relation: '兄弟姉妹・同僚・友人・仕事関係',
      face: '対等な関係で出る自分。働き方、社交性、仕事での癖が見えやすい場所。',
      ageRange: '20代後半〜50代',
    },
    {
      label: '日柱',
      title: `${result.pillars.day.stem}${result.pillars.day.branch}の意味`,
      body: makePillarText(
        result.pillars.day,
        'この柱は、本人の核になる場所です。外向きに整えた顔ではなく、取り繕わない素の価値観、自分らしい選び方、配偶者や深いパートナーシップで出る姿を読みます。',
      ),
      relation: '自分自身・配偶者・深いパートナー',
      face: '素の自分。価値観、体質、結婚生活や深い関係で出やすい本質。',
      ageRange: '50代後半〜70代',
    },
    {
      label: '時柱',
      title: result.pillars.hour ? `${result.pillars.hour.stem}${result.pillars.hour.branch}の意味` : '出生時間不明',
      body: makePillarText(
        result.pillars.hour,
        'この柱は、自分が生み出すもの、育てるものへの関わり方として読みます。子ども、部下、後継者、作品や事業など、未来へ残していくものに向かう姿が表れます。',
        '出生時間を指定しない場合、時柱は出しません。子ども・部下・後継者との関わりや、晩年に育てるものは、年柱・月柱・日柱を中心に参考として見ます。',
      ),
      relation: '子ども・部下・後継者・作品や事業',
      face: '目下や未来に見せる自分。育て方、任せ方、晩年の可能性が出やすい場所。',
      ageRange: '70代以降',
    },
  ] satisfies PillarMeaningCard[];
}

function FoundationNotesPanel({
  result,
  hasHour,
  targetLabel,
}: {
  result: DiagnosisResult;
  hasHour: boolean;
  targetLabel: string;
}) {
  const pillarMeaningCards = getPillarMeaningCards(result);
  const centerStar = result.lifeChart.majorStars.center;
  const centerGuide = getCenterStarPracticalGuide(centerStar);
  const energyGuide = getEnergyStarCorrespondence(result.energy.star);

  return (
    <section className="foundation-panel" aria-label="四柱推命の基礎情報">
      <div className="foundation-heading">
        <span className="eyebrow">PROFILE GUIDE</span>
        <h3>{targetLabel}のプロファイル</h3>
        <p>
          四柱は、{targetLabel}を中心にして、人間関係の距離感ごとにどんな顔が出やすいかを見る場所です。
          年柱は目上や社会、月柱は対等な関係、日柱は素の自分、時柱は目下や未来へ育てるもの。
          命式は性格を決めつけるものではなく、自分を扱いやすくするための地図です。
        </p>
      </div>

      <div className="pillar-meaning-grid">
        {pillarMeaningCards.map((item) => (
          <article key={item.label} className={!hasHour && item.label === '時柱' ? 'muted' : ''}>
            <span>{item.label}</span>
            <strong>{item.title}</strong>
            <p>{item.body}</p>
            <dl className="pillar-context-list">
              <div>
                <dt>関係</dt>
                <dd>{item.relation}</dd>
              </div>
              <div>
                <dt>出方</dt>
                <dd>{item.face}</dd>
              </div>
              <div>
                <dt>年齢域</dt>
                <dd>{item.ageRange}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <p className="pillar-age-note">
        年齢域は固定的な判定ではなく、読み方の目安です。実際の運の流れは大運や年運と重ねて見ます。
      </p>

      <div className="foundation-guide-grid">
        <article>
          <span>日干の星</span>
          <strong>{result.personality.stem}・{result.personality.natureSymbol}</strong>
          <p>
            {targetLabel}の根っこにある気質です。
            {result.personality.essence}
          </p>
        </article>
        <article>
          <span>中心星</span>
          <strong>{centerStar}（{centerGuide.sourceName}）</strong>
          <p>
            {centerGuide.headline}。
            {centerGuide.essence}
          </p>
        </article>
        <article>
          <span>十二大従星 / 十二運</span>
          <strong>{energyGuide.sanmeiName}（{energyGuide.fortuneName}）</strong>
          <p>
            {targetLabel}が動く時のエネルギー量と質です。
            {energyGuide.profileMeaning}
          </p>
          <dl className="center-star-correspondence">
            <div>
              <dt>四柱推命</dt>
              <dd>{energyGuide.fortuneName}</dd>
            </div>
            <div>
              <dt>算命学</dt>
              <dd>{energyGuide.sanmeiName}</dd>
            </div>
            <div>
              <dt>段階</dt>
              <dd>{energyGuide.order}. {energyGuide.lifeStage}</dd>
            </div>
            <div>
              <dt>キーワード</dt>
              <dd>{energyGuide.keywords}</dd>
            </div>
          </dl>
        </article>
        <article>
          <span>天中殺</span>
          <strong>{result.tenchusatsu.name}</strong>
          <p>
            算命学では{result.tenchusatsu.suimeiName}、四柱推命では{result.tenchusatsu.shichuName}と呼びます。
            欠ける支は{result.tenchusatsu.branches.join('・')}。
            {result.tenchusatsu.advice}
          </p>
          <dl className="center-star-correspondence">
            <div>
              <dt>見る基準</dt>
              <dd>日柱の六十干支</dd>
            </div>
            <div>
              <dt>テーマ</dt>
              <dd>{result.tenchusatsu.openTheme}</dd>
            </div>
            <div>
              <dt>欠ける気</dt>
              <dd>{result.tenchusatsu.missingDirection}</dd>
            </div>
            <div>
              <dt>宿命天中殺</dt>
              <dd>{result.tenchusatsu.destinyHits.length ? result.tenchusatsu.destinyHits.map((hit) => hit.label).join(' / ') : '命式内の該当なし'}</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}

function NatalChartTable({ result }: { result: DiagnosisResult }) {
  return (
    <section className="natal-chart-panel" aria-label="命式と蔵干">
      <div className="natal-chart-copy">
        <span className="eyebrow">NATAL STEMS</span>
        <h3>命式・蔵干表</h3>
        <p>
          天干と地支、地支の中に含まれる蔵干を並べています。
          採用蔵干は人体星図の十大主星、蔵干すべては才能エネルギーの個数に使います。
        </p>
      </div>
      <div className="natal-table-wrap">
        <table className="natal-table">
          <thead>
            <tr>
              <th>柱</th>
              <th>天干</th>
              <th>地支</th>
              <th>天干の星</th>
              <th>採用蔵干</th>
              <th>採用蔵干の星</th>
              <th>蔵干すべて</th>
            </tr>
          </thead>
          <tbody>
            {result.natalChart.map((row) => (
              <tr key={row.pillar}>
                <td>{row.label}</td>
                <td>{row.stem}</td>
                <td>{row.branch}</td>
                <td>{row.heavenlyStar}</td>
                <td><strong>{row.selectedHiddenStem}</strong></td>
                <td>{row.selectedHiddenStar}</td>
                <td>
                  <div className="hidden-stem-list">
                    {row.hiddenStems.map((hidden, index) => (
                      <span key={`${row.pillar}-${hidden.stem}-${index}`}>
                        {hidden.stem}<em>{hidden.star}</em>
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function InsightCard({
  eyebrow,
  title,
  body,
  items,
}: {
  eyebrow: string;
  title: string;
  body: string;
  items: string[];
}) {
  return (
    <article className="insight-card">
      <span className="eyebrow">{eyebrow}</span>
      <h3>{title}</h3>
      <p>{body}</p>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function ChartCell({
  marker,
  title,
  value,
  source,
  muted = false,
}: {
  marker?: string;
  title: string;
  value: string;
  source: string;
  muted?: boolean;
}) {
  return (
    <div className={muted ? 'chart-cell muted' : 'chart-cell'}>
      {marker && <span className="chart-marker">{marker}</span>}
      <small>{title}</small>
      <strong>{value}</strong>
      <em>{source}</em>
    </div>
  );
}

const majorStarMeanings: Record<string, string> = {
  貫索星: '自立心、守り、粘り強さ。自分の軸を保つ星です。',
  石門星: '仲間、協調、人脈。人とのつながりから広がる星です。',
  鳳閣星: '自然体の表現、伝達、楽しみ。無理なく伝える星です。',
  調舒星: '感性、こだわり、芸術性。繊細な違和感を形にする星です。',
  禄存星: '魅力、愛情、回転財。人や価値を引き寄せる星です。',
  司禄星: '蓄積、家庭、堅実さ。日々の積み重ねで形にする星です。',
  車騎星: '行動、勝負、突破力。現場で動いて結果を出す星です。',
  牽牛星: '責任、役割、名誉。社会的な信頼を重んじる星です。',
  龍高星: '改革、創造、冒険心。未知の経験から学ぶ星です。',
  玉堂星: '学問、知性、伝統。知識や教えを受け取り深める星です。',
};

type CenterStarPracticalGuide = {
  sourceName: string;
  fiveElementRelation: string;
  yinYangRelation: string;
  keywords: string;
  headline: string;
  essence: string;
  relation: string;
  money: string;
  watch: string;
};

const centerStarPracticalGuides: Record<string, CenterStarPracticalGuide> = {
  貫索星: {
    sourceName: '比肩',
    fiveElementRelation: '比和（同じ五行）',
    yinYangRelation: '同じ陰陽',
    keywords: '独立心・自我・マイペース',
    headline: '妥協せず、自分を貫く頑張り屋',
    essence: '自分の中にしっかりした軸があり、一度決めたことは簡単に曲げません。独立心が強く、自分のペースを守れるほど力が出ます。',
    relation: '対等な関係を好みます。干渉されるより、任されるほうが素直に動きやすいタイプです。',
    money: '自分のこだわりや専門性で稼ぐ形が合います。誰かに依存するより、自分の看板を育てるほうが安定します。',
    watch: '意地を張りすぎると、必要な助けまで拒みやすくなります。守るものと譲れるものを分けておくと楽です。',
  },
  石門星: {
    sourceName: '劫財',
    fiveElementRelation: '比和（同じ五行）',
    yinYangRelation: '異なる陰陽',
    keywords: '協調・社交・駆け引き',
    headline: '横並びの関係に強い、人脈づくりの星',
    essence: '人と人をつなぎ、仲間や集団の力を動かす星です。社交性と協調性があり、受け入れられる場で本領を発揮します。',
    relation: '上下より横並び。仲間として扱われると力が出ますが、対等に見られないと距離を取りやすくなります。',
    money: '人脈、紹介、チーム、ネットワークがお金につながります。ひとり勝ちより、場を作ることで回り始めます。',
    watch: '人に合わせすぎると、自分の本音が見えにくくなります。誰と組むかを選ぶことが大切です。',
  },
  鳳閣星: {
    sourceName: '食神',
    fiveElementRelation: '我生（自分が生む）',
    yinYangRelation: '同じ陰陽',
    keywords: '楽天・表現・食と楽しみ',
    headline: '楽観的で自然体。ありのままを楽しむ星',
    essence: '食、健康、楽しみ、表現に縁があります。肩の力が抜けた時ほど魅力が出て、まわりにも安心感を渡します。',
    relation: '深刻さより、ゆったりした空気が合います。急かされるより、楽しく続けられる環境で伸びます。',
    money: '食、健康、趣味、表現、日常を豊かにする仕事と相性が良い星です。好きなことが自然に仕事へつながります。',
    watch: '楽なほうへ流れすぎると、集中力が散りやすくなります。遊びと締切の両方を用意すると安定します。',
  },
  調舒星: {
    sourceName: '傷官',
    fiveElementRelation: '我生（自分が生む）',
    yinYangRelation: '異なる陰陽',
    keywords: '繊細・完璧主義・美意識',
    headline: '反骨精神と繊細な感性を持つ表現者',
    essence: '感受性が鋭く、違和感や怒りを言葉や作品に変える力があります。独立独歩で進むほど才能が磨かれます。',
    relation: '雑に扱われると深く傷つきます。表面的な励ましより、こだわりを丁寧に見てもらえる関係が合います。',
    money: '文章、美術、音楽、企画、専門技術など、自分の感性を形にする仕事で価値を生みます。',
    watch: '言葉が鋭くなりやすい星です。正しさを伝える時ほど、相手の受け取り方を一呼吸おくと強みになります。',
  },
  禄存星: {
    sourceName: '偏財',
    fiveElementRelation: '我剋（自分が剋す）',
    yinYangRelation: '同じ陰陽',
    keywords: '奉仕・愛嬌・回転する財',
    headline: '柔軟に動き、人と財を回す星',
    essence: '人にもお金にも動きがあります。親切で面倒見がよく、場の流れを見ながら必要なものを回せるタイプです。',
    relation: '相手に合わせる柔らかさがあります。人のために動く一方で、反応が返ってこないと疲れやすくなります。',
    money: '商売、営業、紹介、調整、プロデュースなど、動きながら人と価値をつなぐほど財が生まれます。',
    watch: 'よく見せたい気持ちが強くなると、無理な出費や約束が増えます。自分の器に合う範囲を決めておくと安心です。',
  },
  司禄星: {
    sourceName: '正財',
    fiveElementRelation: '我剋（自分が剋す）',
    yinYangRelation: '異なる陰陽',
    keywords: '堅実・蓄積・コツコツ型',
    headline: '堅実に積み上げ、テリトリーを守る星',
    essence: 'コツコツ時間をかけて、生活、家族、文化、信頼を守り育てる星です。派手さより、着実さに強みがあります。',
    relation: '安心できる小さな世界を大切にします。急な変化より、約束や手順が見える関係で落ち着きます。',
    money: '貯蓄、管理、継続収入、家業、事務、計画性のある働き方に向きます。長く続けるほど強くなります。',
    watch: '守りが強すぎると、チャンスにも慎重になりすぎます。小さく試す枠を持つと現実が広がります。',
  },
  車騎星: {
    sourceName: '偏官',
    fiveElementRelation: '剋我（自分が剋される）',
    yinYangRelation: '同じ陰陽',
    keywords: '行動力・瞬発力・突破力',
    headline: '強い行動力で突破する勝負の星',
    essence: '先に体が動く、闘争心のある星です。スピード、挑戦、現場感のある場でエネルギーが大きくなります。',
    relation: '回りくどさより率直さを好みます。目標がはっきりすると、仲間のためにも一気に動けます。',
    money: '営業、スポーツ、現場仕事、実行責任のある役割など、動きと成果が直結する仕事で力が出ます。',
    watch: '急ぎすぎると周囲がついてこられません。勝負どころと待つ場面を分けると、突破力がきれいに出ます。',
  },
  牽牛星: {
    sourceName: '正官',
    fiveElementRelation: '剋我（自分が剋される）',
    yinYangRelation: '異なる陰陽',
    keywords: '責任感・秩序・社会的信用',
    headline: '責任と品位を重んじ、王道を歩く星',
    essence: '社会的な役割、信用、規律を大切にします。評価されるほど背筋が伸び、任された責任をきちんと果たします。',
    relation: '礼儀や約束を守る人に安心します。きちんと扱われることで、落ち着きと信頼感が増します。',
    money: '組織、資格、管理職、公的な仕事、専門職など、信頼や肩書きが価値になる領域に向きます。',
    watch: '正しさに寄りすぎると、自分にも人にも厳しくなります。規範の中に余白を作ると人がついてきます。',
  },
  龍高星: {
    sourceName: '偏印',
    fiveElementRelation: '生我（自分を生む）',
    yinYangRelation: '同じ陰陽',
    keywords: '探求心・改革・専門性',
    headline: 'ひらめきと変化で、壊して創る星',
    essence: '学歴より発想、安定より変化に強い星です。知らない環境に飛び込むほど、経験が知恵に変わります。',
    relation: '自由度が必要です。縛られるより、動きながら学べる関係や職場で本来の力が出ます。',
    money: '企画、旅、調査、IT、技術、創作、新規事業など、変化と発想を扱う仕事に向きます。',
    watch: '飽きやすさが出ると積み上げが途切れます。自由に動ける余白と、続ける最低ラインを両方決めると強いです。',
  },
  玉堂星: {
    sourceName: '印綬',
    fiveElementRelation: '生我（自分を生む）',
    yinYangRelation: '異なる陰陽',
    keywords: '知性・学問・伝統・受容性',
    headline: '安定した環境で知性を深める星',
    essence: '学問、研究、伝統、教えることに縁があります。落ち着いた環境でじっくり学ぶほど、内側の優しさも育ちます。',
    relation: '丁寧な説明や礼儀のある会話を好みます。信頼できる人から学び、また人に渡すことで力が整います。',
    money: '教育、研究、資料作成、相談業、公務、伝統分野など、知識を蓄えて渡す仕事に向きます。',
    watch: '考えすぎると動きが遅くなります。学んだことを小さく外に出す習慣が、才能を眠らせないコツです。',
  },
};

function getCenterStarPracticalGuide(star: string): CenterStarPracticalGuide {
  return centerStarPracticalGuides[star] || {
    sourceName: star,
    fiveElementRelation: '陰陽五行の関係',
    yinYangRelation: '陰陽の組み合わせ',
    keywords: 'その星らしい性質',
    headline: '中心にある星の使い方を見る',
    essence: '中心星は、日干と月支の蔵干から出る本人の核です。無意識に使いやすい性質として表れます。',
    relation: '人との関わり方、安心できる距離感、役割の取り方に出やすい星です。',
    money: 'お金や仕事では、その星の性質を自然に使える形を選ぶほど続きやすくなります。',
    watch: '強みが強く出すぎると、同じ性質がつまずきにもなります。',
  };
}

const starBehaviorTendencies: Record<string, string> = {
  貫索星:
    '相手に合わせすぎず、自分の考えや距離感を守って接しやすいです。面倒見は静かですが、譲れないところでは頑固さや厳しさが出ます。',
  石門星:
    '上下を強く出すより、ざっくばらんに声をかけて仲間のような関係を作りやすいです。一方で、身内意識が強くなるほど「同じ方向を向いてほしい」と厳しく言うことがあります。',
  鳳閣星:
    '自然体で明るく、相手を急かさずに見守る接し方になりやすいです。重い話や細かな管理は避けたくなり、良くも悪くもゆるさが出ます。',
  調舒星:
    '相手の気持ちや小さな変化に敏感で、細やかに気づく接し方になりやすいです。期待が外れたり傷ついたりすると、言葉が鋭くなることがあります。',
  禄存星:
    '親切で面倒見がよく、相手に必要なものを与えようとする接し方になりやすいです。尽くした分、感謝や反応を求めすぎることがあります。',
  司禄星:
    '日常を整え、コツコツ支える接し方になりやすいです。安心させたい気持ちから、細かな確認や心配が増えて管理的に見えることがあります。',
  車騎星:
    '率直で行動が早く、相手を前に進ませようとする接し方になりやすいです。勢いが強い時は、言い方がきつく見えたり急かしてしまうことがあります。',
  牽牛星:
    '礼儀や責任を大切にし、きちんとした態度で接しやすいです。相手にも役割や結果を求めるため、甘さより厳しさが前に出ることがあります。',
  龍高星:
    '自由度を大切にし、相手にも新しい経験や自立を促す接し方になりやすいです。型にはめられることを嫌い、少し距離があるように見えることがあります。',
  玉堂星:
    '知識や経験をもとに、落ち着いて教え導く接し方になりやすいです。丁寧に説明する反面、説教っぽくなったり理屈が先に立つことがあります。',
};

const directionBehaviorContexts: Record<string, string> = {
  中央: '自分の内側では',
  東: '仕事や社会の場では',
  西: '家庭や近しい人には',
  北: '親・上司・目上の人には',
  南: '子ども・部下・後輩には',
};

const directionStarBehaviorOverrides: Record<string, string> = {
  '南:石門星':
    '子ども・部下・後輩には、上下関係を強く出すより、ざっくばらんに声をかけて気楽な仲間関係を作ろうとします。場を和ませる一方で、自分の子どもや身内には「仲間としてちゃんとしてほしい」という思いから、意外と厳しく言ってしまうことがあります。',
};

function getLifeChartBehavior(direction: string, star: string) {
  const override = directionStarBehaviorOverrides[`${direction}:${star}`];
  if (override) {
    return override;
  }

  const context = directionBehaviorContexts[direction] || '人との関係では';
  const tendency = starBehaviorTendencies[star] || 'その星の性質が、相手への接し方や距離感に表れやすくなります。';
  return `${context}、${tendency}`;
}

function LifeChartPanel({ result, targetLabel }: { result: DiagnosisResult; targetLabel: string }) {
  const { majorStars, energyStars, hiddenStems } = result.lifeChart;
  const directionInsights = [
    {
      direction: '中央',
      star: majorStars.center,
      title: '自分の本質・心',
      placeMeaning: 'ひとりでいる時や、無意識に戻った時の核になりやすい場所です。',
    },
    {
      direction: '東',
      star: majorStars.leftHand,
      title: '社会で見せる顔',
      placeMeaning: '仕事、対外的な行動、他人から評価されやすい振る舞いに出る場所です。',
    },
    {
      direction: '西',
      star: majorStars.rightHand,
      title: '家庭で見せる顔',
      placeMeaning: '家族や近しい人の前で出やすい態度、安心した場での行動に表れる場所です。',
    },
    {
      direction: '北',
      star: majorStars.head,
      title: '親・上司に見せる顔',
      placeMeaning: '親、上司、師匠など目上の人への向き合い方に出る場所です。',
    },
    {
      direction: '南',
      star: majorStars.abdomen,
      title: '子ども・部下に見せる顔',
      placeMeaning: '子ども、部下、後輩など目下の人への接し方に出る場所です。',
    },
  ];

  return (
    <section className="life-chart-panel" aria-label="人体星図">
      <div className="life-chart-copy">
        <span className="eyebrow">YOUSEN CHART</span>
        <h3>{targetLabel}の人体星図</h3>
        <p>
          参考画像の配置に合わせ、①〜⑤は十大主星、A〜Cは十二大従星として表示しています。
          十二大従星は、四柱推命では十二運と呼ばれ、初年・中年・晩年にどんな勢いで動きやすいかを見る場所です。
          中心の星は、月支の蔵干「{hiddenStems.monthBranch}」から出しています。
        </p>
      </div>
      <div className="life-chart-grid">
        <ChartCell title="本人" value={targetLabel} source="日干" muted />
        <ChartCell marker="①" title="北・目上の顔" value={majorStars.head} source="日干 × 年干" />
        <ChartCell marker="A" title="初年期の運" value={energyStars.leftShoulder} source="日干 × 年支" />
        <ChartCell marker="⑤" title="西・家庭の顔" value={majorStars.rightHand} source="日干 × 日支蔵干" />
        <ChartCell marker="④" title="中央・本質" value={majorStars.center} source="日干 × 月支蔵干" />
        <ChartCell marker="③" title="東・社会の顔" value={majorStars.leftHand} source="日干 × 年支蔵干" />
        <ChartCell marker="C" title="晩年期の運" value={energyStars.rightFoot} source="日干 × 日支" />
        <ChartCell marker="②" title="南・目下の顔" value={majorStars.abdomen} source="日干 × 月干" />
        <ChartCell marker="B" title="中年期の運" value={energyStars.leftFoot} source="日干 × 月支" />
      </div>
      <div className="direction-guide">
        {directionInsights.map((item) => (
          <article key={item.direction}>
            <span>{item.direction}</span>
            <strong>{item.star}</strong>
            <h4>{item.title}</h4>
            <dl>
              <div>
                <dt>場所の意味</dt>
                <dd>{item.placeMeaning}</dd>
              </div>
              <div>
                <dt>星の意味</dt>
                <dd>{majorStarMeanings[item.star] || 'その人の内面や関係性に表れる個性の星です。'}</dd>
              </div>
              <div>
                <dt>接し方の傾向</dt>
                <dd>{getLifeChartBehavior(item.direction, item.star)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function CenterStarPracticalPanel({ result, targetLabel }: { result: DiagnosisResult; targetLabel: string }) {
  const centerStar = result.lifeChart.majorStars.center;
  const guide = getCenterStarPracticalGuide(centerStar);

  return (
    <section className="center-star-panel" aria-label="中心星の実用メモ">
      <div className="center-star-heading">
        <span className="eyebrow">CENTER STAR</span>
        <h3>{targetLabel}の中心星は{centerStar}</h3>
        <p>
          算命学では「{centerStar}」、四柱推命では「{guide.sourceName}」として見る星です。
          呼び名は違いますが、どちらも日干とほかの干の陰陽五行の関係から出します。
        </p>
      </div>
      <div className="center-star-summary">
        <strong>{guide.headline}</strong>
        <p>{guide.essence}</p>
        <dl className="center-star-correspondence">
          <div>
            <dt>通変星</dt>
            <dd>{guide.sourceName}</dd>
          </div>
          <div>
            <dt>五行の関係</dt>
            <dd>{guide.fiveElementRelation}</dd>
          </div>
          <div>
            <dt>陰陽</dt>
            <dd>{guide.yinYangRelation}</dd>
          </div>
          <div>
            <dt>キーワード</dt>
            <dd>{guide.keywords}</dd>
          </div>
        </dl>
      </div>
      <div className="center-star-grid">
        <article>
          <span>人との距離感</span>
          <p>{guide.relation}</p>
        </article>
        <article>
          <span>仕事・お金</span>
          <p>{guide.money}</p>
        </article>
        <article>
          <span>気をつけたい癖</span>
          <p>{guide.watch}</p>
        </article>
      </div>
    </section>
  );
}

function getActionEnergyText(level: DiagnosisResult['actionArea']['energyLevel']) {
  if (level === 'low') {
    return 'エネルギー値は小さめ。広く動き回るより、限られた領域で深めるほど力を使いやすいタイプです。';
  }
  if (level === 'high') {
    return 'エネルギー値は大きめ。活動量を必要とするため、動ける場が狭いとストレスが溜まりやすいタイプです。';
  }
  return 'エネルギー値は標準域。行動エリアの広さと活動量のバランスを取りやすいタイプです。';
}

const actionAreaMeanings: Record<string, { title: string; body: string; advice: string }> = {
  A: {
    title: '守り・安定',
    body: '無意識に安定性のある方へ動きやすく、守備力や粘り強さが出ます。',
    advice:
      '環境を整えてから動くと力が出ます。急に広げるより、信頼できる人・場所・手順を決めて、同じことを深めていく動き方が合います。',
  },
  B: {
    title: '伝達・自由',
    body: '自分の思いや実績を伝えたい欲求が強く、枠にはめられると窮屈になりやすい部屋です。',
    advice:
      '話す、書く、見せるなど、外に出す行動を増やすと流れがよくなります。予定を詰めすぎず、自由に試せる余白を残してください。',
  },
  C: {
    title: '知的欲求・創造',
    body: '創造力を発揮できる分野へ向かいやすく、理論や知的な探求に強みが出ます。',
    advice:
      '学ぶ、調べる、仮説を立てる時間を先に確保すると動きやすくなります。考えたことは企画、設計、資料、作品など形にして残すのがコツです。',
  },
  D: {
    title: '攻撃性・開拓',
    body: '動的な方向へ向かいやすく、忙しさや挑戦の中で力を出しやすい部屋です。',
    advice:
      '迷ったら小さく動き出すほうが合います。交渉、営業、現場対応、新規開拓など、反応がすぐ返ってくる場で力を使うと前に進みやすいです。',
  },
};

function ActionAreaPanel({ result, targetLabel }: { result: DiagnosisResult; targetLabel: string }) {
  const { actionArea } = result;
  const polygonPoints = actionArea.points.map((point) => `${point.x},${point.y}`).join(' ');
  const dominantLabel = actionArea.dominantAreas.join(' / ');

  return (
    <section className="action-area-panel" aria-label="行動エリア">
      <div className="action-area-copy">
        <span className="eyebrow">ACTION AREA</span>
        <h3>{targetLabel}の行動エリア</h3>
        <p>
          この三角形は、{targetLabel}が自然に動きやすい範囲を表しています。
          外へ出て広げると満たされるのか、身近な場所で深めると落ち着くのかを見ます。
        </p>
        <div className="action-score">
          <strong>{actionArea.energyScore}</strong>
          <span>エネルギー値</span>
        </div>
        <p>{getActionEnergyText(actionArea.energyLevel)}</p>
      </div>

      <div className="action-map">
        <svg viewBox="0 0 100 100" role="img" aria-label="行動エリア三角形">
          <circle cx="50" cy="50" r="42" />
          <line x1="50" y1="8" x2="50" y2="92" />
          <line x1="8" y1="50" x2="92" y2="50" />
          <text x="66" y="29">A</text>
          <text x="66" y="75">B</text>
          <text x="28" y="29">C</text>
          <text x="28" y="75">D</text>
          <text x="50" y="5" className="axis">No.1</text>
          <text x="94" y="52" className="axis">No.16</text>
          <text x="50" y="98" className="axis">No.31</text>
          <text x="6" y="52" className="axis">No.46</text>
          <polygon points={polygonPoints} />
          {actionArea.points.map((point) => (
            <g key={point.pillar}>
              <circle className="action-dot" cx={point.x} cy={point.y} r="2.2" />
              <text className="dot-label" x={point.x} y={point.y - 4}>{point.label}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="action-point-list">
        {actionArea.points.map((point) => (
          <article key={point.pillar}>
            <span>{point.label}</span>
            <strong>No.{point.number} {point.stem}{point.branch}</strong>
            <p>{point.area}の部屋 / {point.energyStar} / {point.energyValue}</p>
          </article>
        ))}
      </div>

      <div className="action-area-guide">
        <h4>主に出やすい部屋：{dominantLabel}</h4>
        <div>
          {Object.entries(actionAreaMeanings).map(([area, meaning]) => (
            <article key={area} className={actionArea.dominantAreas.includes(area) ? 'active' : ''}>
              <span>{area}</span>
              <strong>{meaning.title}</strong>
              <p>{meaning.body}</p>
              <dl>
                <div>
                  <dt>動き方のコツ</dt>
                  <dd>{meaning.advice}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const talentEnergyGuides: Record<string, { meaning: string; action: string; caution: string }> = {
  貫索星: {
    meaning: '自分の軸を守り、ひとつのことを粘り強く続ける才能です。',
    action:
      '専門分野や担当範囲を決めて、じっくり深める場を持つと力が出ます。人に合わせすぎず、自分のやり方で積み上げられる仕事を選んでください。',
    caution: '頑固になりすぎると孤立します。譲れない点と任せてもよい点を分けると使いやすくなります。',
  },
  石門星: {
    meaning: '人と人をつなぎ、仲間や組織の力を大きくする才能です。',
    action:
      '一人で抱えず、チーム、紹介、コミュニティ、協業の形にして動くと広がります。調整役や場づくりを引き受けると才能が見えやすいです。',
    caution: '全員に合わせすぎると自分の本音が薄くなります。誰と組むか、どこまで関わるかを決めておきましょう。',
  },
  鳳閣星: {
    meaning: '自然体で伝え、人を安心させたり楽しませたりする才能です。',
    action:
      '話す、書く、教える、発信するなど、感じたことを外に出してください。完璧に整える前に、まず軽く出すほうが流れに乗れます。',
    caution: '楽な方へ流れると締まりがなくなります。期限や最低ラインだけは先に決めると安定します。',
  },
  調舒星: {
    meaning: '小さな違和感を拾い、感性や美意識で形にする才能です。',
    action:
      '文章、デザイン、企画、改善提案など、自分のこだわりを作品や成果物に落とす場を作ってください。一人で集中する時間が大事です。',
    caution: '鋭さが人を傷つけることがあります。批評するときは、代わりにどうすると良いかまで添えると伝わります。',
  },
  禄存星: {
    meaning: '人、情報、お金、機会を集めて循環させる才能です。',
    action:
      '相手が何を求めているかを見て、紹介、提案、販売、支援に変えると力になります。人に喜ばれる仕組みを作るのが向いています。',
    caution: '与えすぎると疲れます。感謝されたい気持ちが強くなったら、先に条件や線引きを決めましょう。',
  },
  司禄星: {
    meaning: '日々の積み重ねで、信頼や成果を安定して育てる才能です。',
    action:
      '記録、管理、習慣化、仕組み化に向いています。大きく当てるより、毎日少しずつ増やす設計にすると成果が残ります。',
    caution: '心配が強くなると動きが重くなります。完璧に準備してからではなく、小さく始めて整えていくのがコツです。',
  },
  車騎星: {
    meaning: 'すぐに動き、現場で突破する才能です。',
    action:
      '営業、交渉、現場対応、短期集中の課題など、反応が早い場で力を使ってください。迷ったら小さく試す、動きながら直す、が合います。',
    caution: 'スピードが強すぎると周囲がついてこられません。結論だけでなく、なぜ動くのかも一言添えると通りやすくなります。',
  },
  牽牛星: {
    meaning: '責任、役割、信頼を背負って成果に変える才能です。',
    action:
      '肩書き、役割、目標、評価基準がはっきりした場で力が出ます。任されたことをきちんとやり切り、信用を積み上げてください。',
    caution: '正しさや体裁を気にしすぎると窮屈になります。失敗しても役割を失うわけではない、と少し緩めると動きやすいです。',
  },
  龍高星: {
    meaning: '変化を取り込み、新しいやり方を生み出す才能です。',
    action:
      '旅、調査、新規企画、学び直し、異業種との接点など、未知のものに触れるほど発想が動きます。慣れた場所だけに閉じないことです。',
    caution: '自由を求めすぎると継続が途切れます。変える部分と残す部分を分けると、改革が形になります。',
  },
  玉堂星: {
    meaning: '知識を整理し、学びや教えとして深める才能です。',
    action:
      '調べる、体系化する、教える、資料にする動きが合います。経験をそのまま終わらせず、言葉や型にして人に渡してください。',
    caution: '考えすぎると実行が遅れます。調べる時間を決め、最後は試して確かめる流れを作りましょう。',
  },
};

function getTalentEnergyGuide(star: string) {
  return talentEnergyGuides[star] || {
    meaning: '命式の中で、無意識に使いたくなる才能です。',
    action: '日常の仕事や人間関係の中で、この星の性質を意識して使う場面を増やしてください。',
    caution: '強く出すぎると偏りになります。周囲の反応を見ながら調整しましょう。',
  };
}

function getTalentEnergyFocusText(entries: DiagnosisResult['talentEnergy']['entries'], hasStrongTalentStar: boolean) {
  const [first, second, third] = entries;
  if (!first) {
    return '命式に出ている星の偏りを見ながら、使いやすい才能を探します。';
  }

  const firstGuide = getTalentEnergyGuide(first.star);
  if (hasStrongTalentStar || !second) {
    return `まずは${first.star}を中心に使うと良さが出ます。これは${firstGuide.meaning}仕事や人間関係では、この才能を使える役割を意識して選んでください。`;
  }

  const stars = [first.star, second.star, third?.star].filter(Boolean).join('・');
  return `才能は一点集中というより、${stars}を組み合わせて使うタイプです。1つに絞りすぎず、強い星を順番に使うと動きやすくなります。`;
}

const workCareerGuides: Record<string, {
  theme: string;
  moneyKeyword: string;
  mindset: string;
  workAdvice: string;
  avoid: string;
  fields: string[];
}> = {
  貫索星: {
    theme: '守る・続ける・専門を持つ',
    moneyKeyword: '継続',
    mindset: '守る対象があるほど力が出ます。人、財産、技術、作品、信用など、何を守る仕事なのかが見えると満足しやすい星です。',
    workAdvice: '自分の担当領域を明確にし、長期で信頼を積み上げてください。独立性のある働き方、専門職、管理や保全の役割が合います。',
    avoid: '人の都合で頻繁に方針が変わる環境や、裁量がほとんどない働き方は疲れやすくなります。',
    fields: ['保管・管理', '保険・保障', '医療・安全', '博物館・美術館', '専門職・独立業'],
  },
  石門星: {
    theme: 'つなぐ・まとめる・和合する',
    moneyKeyword: '人脈',
    mindset: '人と人、組織と組織をつないだ時に価値が生まれます。個人プレーより、仲間や集団の力を動かす仕事で広がります。',
    workAdvice: '紹介、調整、交渉、チームづくりを引き受けると良さが出ます。人脈をただ広げるだけでなく、共通の目的を持つ場に育ててください。',
    avoid: '孤立した作業や、関係者と話せない役割が続くと力を使いにくくなります。',
    fields: ['組織づくり', '紹介業・人材支援', '合併・統合', '外交・調整', '組合・コミュニティ'],
  },
  鳳閣星: {
    theme: '伝える・楽しませる・整えて届ける',
    moneyKeyword: '自然体',
    mindset: '正確に伝えること、場を明るくすること、食や健康のように人をほっとさせることが仕事につながります。',
    workAdvice: '感じたことを言葉、映像、企画、サービスとして外に出してください。無理に背伸びするより、自然体で続けられる表現が強みになります。',
    avoid: '重すぎる責任や楽しさのない環境では、持ち味が出にくくなります。',
    fields: ['報道・取材', '広告・宣伝', '出版・発信', '食・健康', '観光・癒やし'],
  },
  調舒星: {
    theme: '個性を表現する・作品にする',
    moneyKeyword: 'オンリーワン',
    mindset: 'みんなと同じではなく、自分だけの感性や違和感を形にした時に価値が出ます。個人の表現が核になる星です。',
    workAdvice: '作品、文章、音楽、デザイン、企画など、こだわりを成果物に落としてください。一人で集中できる時間を仕事の中に必ず入れると安定します。',
    avoid: '感性を押し込める仕事や、集団に合わせるだけの役割はストレスになりやすいです。',
    fields: ['芸能・芸術', '文章・講演', '編集・プロデュース', '音楽・音響', '個人ブランド'],
  },
  禄存星: {
    theme: '引きつける・助ける・循環させる',
    moneyKeyword: '人助け',
    mindset: '人や物を引き寄せ、必要なところへ回すことで価値が生まれます。奉仕の愛と財の循環、どちらも仕事のテーマになります。',
    workAdvice: '相手の困りごとを見つけ、紹介、販売、支援、運用に変えてください。感謝される流れを仕組みにすると収入にもつながります。',
    avoid: '与えっぱなしになると疲れます。先に条件、範囲、対価を決めておきましょう。',
    fields: ['奉仕・福祉', '医療・薬剤', '金融・資産運用', '不動産・動産', '営業・サービス'],
  },
  司禄星: {
    theme: '蓄積する・準備する・暮らしを整える',
    moneyKeyword: '家族愛',
    mindset: '情報、経験、お金、信用を少しずつ積み上げるほど強くなります。派手さより、日々の安定と準備が財になります。',
    workAdvice: '記録、管理、保管、分析、生活設計のように、細かく整える役割を持ってください。長期契約や継続支援の形が合います。',
    avoid: '一発勝負や大きなリスクを取る働き方は不安定になりやすいです。',
    fields: ['情報収集', '保険・金融', '銀行・証券', '保管・コレクション', '生活アドバイス'],
  },
  車騎星: {
    theme: '動く・攻める・現場で突破する',
    moneyKeyword: 'スピード',
    mindset: '考え込むより、動きながら状況を変えることで力が出ます。忙しさや勝負どころがあるほど燃える星です。',
    workAdvice: '営業、現場対応、交渉、短期集中の課題など、すぐ反応が返る場所で動いてください。まず小さく試し、結果を見て次を打つ動き方が合います。',
    avoid: '待つだけ、調整だけ、机上の検討だけの仕事が続くとエネルギーが余りやすくなります。',
    fields: ['スポーツ・トレーナー', '警察・消防・自衛', '現場作業', '狩猟・漁業', '動物・自然保護'],
  },
  牽牛星: {
    theme: '資格・役割・責任を背負う',
    moneyKeyword: '資格',
    mindset: '肩書、資格、信用、組織の後ろ盾があるほど力を発揮します。役割をきちんと果たすことで評価と収入につながります。',
    workAdvice: '資格取得、専門認定、管理職、公的な役割など、責任が明確な道を選んでください。礼儀、手順、報告を整えるほど信頼されます。',
    avoid: '立場が曖昧なまま便利屋のように動くと、誇りを保ちにくくなります。',
    fields: ['国家資格職', '大企業・管理職', '公務員・教育', '秘書・接遇', '許認可・法務'],
  },
  龍高星: {
    theme: '体験する・吸収する・新しく創る',
    moneyKeyword: 'ユニークな発想',
    mindset: '机上だけでなく、体験から学んだことを新しい知恵に変える星です。未知の場所、人、技術に触れるほど仕事の幅が広がります。',
    workAdvice: '旅、調査、新規企画、IT、研究、写真、貿易など、変化のある仕事で動いてください。経験したことを形にして、人に渡すところまでやるのがコツです。',
    avoid: '同じ場所で同じ作業だけを続けると、好奇心が止まりやすくなります。',
    fields: ['新規企画', 'IT・理数分野', '交通・観光', '歴史・考古', '写真・貿易・服飾'],
  },
  玉堂星: {
    theme: '学ぶ・教える・受け継ぐ',
    moneyKeyword: '学び',
    mindset: '知識を深め、整理し、人に渡すことで価値が生まれます。伝統や体系だった学びを扱う仕事に向きます。',
    workAdvice: '調べる、教える、資料化する、相談に乗る役割を持ってください。学んだことを自分の中に留めず、講座や資料、助言として外に出すと仕事になります。',
    avoid: '学ぶだけで終わると現実の成果になりません。締切を決めて、形にして出す流れを作りましょう。',
    fields: ['研究・大学教授', '教育・講師', 'コンサル・助言', '伝統継承', '書道・茶道・舞踊'],
  },
};

function getWorkCareerGuide(star: string) {
  return workCareerGuides[star] || {
    theme: '強みを仕事に変える',
    moneyKeyword: '実践',
    mindset: '命式に出ている星の性質を、日々の仕事でどう使うかを見ます。',
    workAdvice: '得意な役割を小さく試し、周囲から反応が返ってくる仕事の形に整えてください。',
    avoid: '合わない役割を無理に続けると、持ち味が出にくくなります。',
    fields: ['得意分野', '継続できる役割', '人から頼まれる仕事'],
  };
}

const workEnergyGuides: Record<string, { pace: string; role: string; advice: string }> = {
  胎: {
    pace: '変化を入れながら、小さく試すほど動きやすいエネルギーです。',
    role: '新規企画、リサーチ、試作品づくり、複数テーマを横断する役割。',
    advice: '最初から一つに絞りすぎず、仮説を立てて試してください。芽が出たものを残す働き方が合います。',
  },
  養: {
    pace: '人に助けてもらいながら、場の空気をやわらかくして進むエネルギーです。',
    role: '接客、顧客対応、チームの潤滑油、周囲の協力を引き出す役割。',
    advice: '一人で抱え込まず、早めに相談してください。愛嬌や頼り上手さも、仕事では立派な力になります。',
  },
  長生: {
    pace: '学びながら着実に伸びるエネルギーです。素直に吸収するほど安定します。',
    role: '研修、育成、品質管理、マニュアル化、先輩の知見を受け継ぐ役割。',
    advice: '手順と基準を決めて、少しずつ上達する形にしてください。良い師匠や見本がある環境で伸びます。',
  },
  沐浴: {
    pace: '自由度と刺激があるほど動きやすいエネルギーです。',
    role: '企画、発信、クリエイティブ、外部との接点が多い役割。',
    advice: '同じ場所に縛りすぎず、新しい人や情報に触れる時間を入れてください。変化を悪者にしないのがコツです。',
  },
  冠帯: {
    pace: '勢いと華やかさで前に出るエネルギーです。',
    role: '営業、プレゼン、イベント、立ち上げ期、周囲を引っ張る役割。',
    advice: '人前に出る場や、目標がはっきりした仕事で力を使ってください。勢いだけで約束を増やしすぎないようにしましょう。',
  },
  建禄: {
    pace: '手堅く積み上げ、現実を安定させるエネルギーです。',
    role: '運用管理、実務責任者、経理・総務、長期プロジェクトを支える役割。',
    advice: '計画、確認、継続の仕組みを作ると強みが出ます。急な変更より、見通しのある働き方が合います。',
  },
  帝旺: {
    pace: '大きな責任や負荷を引き受けるほど燃えるエネルギーです。',
    role: 'リーダー、責任者、経営、難しい局面をまとめる役割。',
    advice: '小さくまとまるより、責任ある立場で力を使ってください。ただし全部を背負わず、任せる相手を作ることも大切です。',
  },
  衰: {
    pace: '一歩引いて全体を見ながら、経験で支えるエネルギーです。',
    role: '相談役、調整役、アドバイザー、若手を支える役割。',
    advice: '前に出続けるより、落ち着いて判断する位置が合います。経験談や助言を言葉にして渡してください。',
  },
  病: {
    pace: '感性や想像力が動くと力を出しやすいエネルギーです。',
    role: '企画、デザイン、文章、癒やし、目に見えない価値を扱う役割。',
    advice: '静かに考える時間を確保してください。気分や直感を否定せず、形に残すと仕事につながります。',
  },
  死: {
    pace: '余計な欲をそぎ落とし、純粋に役割へ向かうエネルギーです。',
    role: '裏方支援、研究、精神性の高い仕事、静かに人を支える役割。',
    advice: '派手な成果を急がず、無理なく続く範囲で力を使ってください。ひとりで整える時間があるほど安定します。',
  },
  墓: {
    pace: '深く掘り下げ、集めて蓄えるほど強くなるエネルギーです。',
    role: '専門研究、資料整理、データベース化、歴史や過去の知恵を扱う役割。',
    advice: '浅く広くより、テーマを決めて深掘りしてください。蓄積したものを資料や仕組みにすると価値になります。',
  },
  絶: {
    pace: '瞬発力とひらめきで動くエネルギーです。',
    role: '短期案件、緊急対応、アイデア出し、移動や変化の多い役割。',
    advice: '長く同じペースで走るより、短く集中して成果を出す形が合います。日常の管理は仕組みで補うと楽です。',
  },
};

function getWorkEnergyGuide(star: string) {
  return workEnergyGuides[star] || {
    pace: '仕事中にどんなペースで力が出るかを見るエネルギーです。',
    role: '自然に動ける役割を見つけるヒントになります。',
    advice: '説明文だけで終わらせず、実際の仕事の進め方に置き換えて使ってください。',
  };
}

function TalentEnergyPanel({ result, targetLabel }: { result: DiagnosisResult; targetLabel: string }) {
  const sortedEntries = [...result.talentEnergy.entries].sort((a, b) => b.totalEnergy - a.totalEnergy);
  const topEntries = sortedEntries.slice(0, 3);
  const topNames = result.talentEnergy.dominantStars.join(' / ');
  const focusText = getTalentEnergyFocusText(topEntries, result.talentEnergy.hasStrongTalentStar);

  return (
    <section className="talent-energy-panel" aria-label="才能エネルギー">
      <div className="talent-summary">
        <span className="eyebrow">TALENT ENERGY</span>
        <h3>{targetLabel}の才能エネルギー</h3>
        <p>
          ここでは、{targetLabel}が無意識に使いたくなる才能を見ます。
          頑張らなくてもつい選んでしまうこと、気づくと力を注いでいること。
          その方向に役割や仕事を寄せると、自然に力が出やすくなります。
        </p>
        <div className="talent-main">
          <span>{result.talentEnergy.hasStrongTalentStar ? '才能星' : '高エネルギー星'}</span>
          <strong>{topNames}</strong>
          <p>
            1位と2位の差は{result.talentEnergy.topGap}。
            {result.talentEnergy.hasStrongTalentStar
              ? '差が大きいので、この星はかなり強く出やすいでしょう。'
              : '差が30未満なので、才能は一点集中というより複数の星に分散しています。'}
          </p>
          <p>{focusText}</p>
        </div>
      </div>

      <div className="talent-ranking">
        {topEntries.map((entry, index) => {
          const guide = getTalentEnergyGuide(entry.star);
          return (
            <article key={entry.stem}>
              <span>No.{index + 1}</span>
              <strong>{entry.star}</strong>
              <em>{entry.phenomenon}</em>
              <p>{entry.totalEnergy} = {entry.baseEnergy} × {entry.count}</p>
              <dl>
                <div>
                  <dt>意味</dt>
                  <dd>{guide.meaning}</dd>
                </div>
                <div>
                  <dt>行動アドバイス</dt>
                  <dd>{guide.action}</dd>
                </div>
                <div>
                  <dt>注意点</dt>
                  <dd>{guide.caution}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>

      <div className="talent-table-wrap">
        <table className="talent-table">
          <thead>
            <tr>
              <th>干</th>
              <th>星</th>
              <th>現象</th>
              <th>個数</th>
              <th>日支</th>
              <th>月支</th>
              <th>年支</th>
              <th>基礎</th>
              <th>合計</th>
            </tr>
          </thead>
          <tbody>
            {result.talentEnergy.entries.map((entry) => (
              <tr key={entry.stem} className={result.talentEnergy.dominantStars.includes(entry.star) ? 'active' : ''}>
                <td>{entry.stem}</td>
                <td>{entry.star}</td>
                <td>{entry.phenomenon}</td>
                <td>{entry.count}</td>
                <td>{entry.branchEnergies.day}</td>
                <td>{entry.branchEnergies.month}</td>
                <td>{entry.branchEnergies.year}</td>
                <td>{entry.baseEnergy}</td>
                <td>{entry.totalEnergy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RhythmPanel({ result }: { result: DiagnosisResult }) {
  const displayCurrentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentYearNode = result.rhythm.find((node) => node.year === displayCurrentYear) || result.rhythm[0];
  const currentMonthNode = result.monthlyRhythm.find((node) => node.month === currentMonth) || result.monthlyRhythm[0];
  const currentYearIsTenchusatsu = currentYearNode.isTenchusatsu;
  const currentMonthIsTenchusatsu = currentMonthNode.isTenchusatsu;
  const peakYears = result.rhythm.filter((node) => node.waveEnergy >= 10).map((node) => `${node.year}年`);
  const cautionMonths = result.monthlyRhythm
    .filter((node) => node.isTenchusatsu || node.energy <= 2)
    .map((node) => `${node.month}月`);
  const currentMajorLuck = result.majorLuck.currentPeriod;
  const firstMajorLuck = result.majorLuck.periods[0];
  const currentMajorLuckIsTenchusatsu = currentMajorLuck
    ? result.tenchusatsu.branches.includes(currentMajorLuck.branch)
    : false;
  const currentMajorLuckStarGuide = currentMajorLuck
    ? getCenterStarPracticalGuide(currentMajorLuck.majorStar)
    : null;

  return (
    <div className="rhythm-view">
      <article className="wide-card">
        <span className="eyebrow">TENCHUSATSU</span>
        <h3>{result.tenchusatsu.name}（{result.tenchusatsu.shichuName}）</h3>
        <p>{result.tenchusatsu.principle}</p>
        <p>{result.tenchusatsu.description}</p>
        <div className="tenchusatsu-layer-grid">
          <article className={currentYearIsTenchusatsu || currentMonthIsTenchusatsu ? 'active' : ''}>
            <span>運命天中殺</span>
            <strong>年・月・日・時間で巡る周期</strong>
            <p>
              年は12年に2年、月は12ヶ月に2ヶ月巡ります。
              現在は年運が{currentYearIsTenchusatsu ? '天中殺期間' : '通常期'}、
              月運が{currentMonthIsTenchusatsu ? '天中殺期間' : '通常期'}です。
            </p>
          </article>
          <article className={result.tenchusatsu.destinyHits.length ? 'active' : ''}>
            <span>宿命天中殺</span>
            <strong>{result.tenchusatsu.destinyHits.length ? result.tenchusatsu.destinyHits.map((hit) => hit.label).join(' / ') : '命式内の該当なし'}</strong>
            <p>
              {result.tenchusatsu.destinyHits.length
                ? result.tenchusatsu.destinyHits.map((hit) => `${hit.label}：${hit.meaning}`).join(' ')
                : '年支・月支・日支には、天中殺の支が入っていません。後天的に巡る年運・月運を中心に見ます。'}
            </p>
          </article>
          <article className={currentMajorLuckIsTenchusatsu ? 'active' : ''}>
            <span>大運天中殺</span>
            <strong>{result.tenchusatsu.majorLuckHits.length ? `${result.tenchusatsu.majorLuckHits.length}旬が該当` : '表示中の大運では該当なし'}</strong>
            <p>
              {result.tenchusatsu.majorLuckHits.length
                ? result.tenchusatsu.majorLuckHits.map((hit) => `第${hit.order}旬 ${hit.ageFrom}〜${hit.ageTo}歳（${hit.stem}${hit.branch}）`).join(' / ')
                : '120年の大運の中で、表示している10旬には天中殺の支が重なっていません。'}
            </p>
          </article>
        </div>
        <div className="tenchusatsu-usage-grid">
          <article>
            <span>欠ける気</span>
            <p>{result.tenchusatsu.missingDirection}</p>
          </article>
          <article>
            <span>関係テーマ</span>
            <p>{result.tenchusatsu.relationshipTheme}</p>
          </article>
          <article>
            <span>開運テーマ</span>
            <p>{result.tenchusatsu.openTheme}</p>
          </article>
        </div>
        <div className="tenchusatsu-chip-list" aria-label="天中殺期間に避けたいこと">
          {result.tenchusatsu.avoidActions.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <p>{result.tenchusatsu.advice}</p>
        <p>{result.tenchusatsu.caution}</p>
      </article>

      <article className="rhythm-summary-card">
        <span className="eyebrow">YEAR WAVE</span>
        <h3>{currentYearNode.year}年の年運</h3>
        <strong>{currentYearNode.waveLabel}・{currentYearNode.waveEnergy}/12</strong>
        <p>{currentYearNode.seasonPhase}。{currentYearNode.theme}</p>
      </article>

      <article className="rhythm-summary-card">
        <span className="eyebrow">MONTH WAVE</span>
        <h3>{currentMonthNode.month}月の月運</h3>
        <strong>{currentMonthNode.label}・{currentMonthNode.energy}/12</strong>
        <p>{currentMonthNode.seasonPhase}。{currentMonthNode.theme}</p>
      </article>

      <section className="season-cycle-panel" aria-label="春夏秋冬サイクル">
        <div className="season-cycle-current">
          <span className="eyebrow">SEASON MAJOR LUCK</span>
          <h3>四季運の現在地</h3>
          <p className="season-cycle-lead">
            四季運は、月支から始まる人生120年の大きな季節です。
            大運と同じ{result.seasonCycle.directionLabel}で巡り、春・夏・秋・冬を30年ずつ見ます。
            年運や月運よりも大きい、人生全体の戦略フェーズとして読みます。
          </p>
          <div className="season-current-grid">
            <article>
              <span>開始の季節</span>
              <strong>{result.seasonCycle.birth.label}</strong>
              <p>
                月支「{result.seasonCycle.startBranch}」は{result.seasonCycle.birth.branchGroup}のグループ。
                {result.seasonCycle.birth.instinct}から始まります。
              </p>
            </article>
            <article>
              <span>現在の季節</span>
              <strong>{result.seasonCycle.current.label}</strong>
              <p>
                {result.seasonCycle.current.instinct}の時期です。
                {result.seasonCycle.current.description}
              </p>
            </article>
          </div>
        </div>
        <div className="season-card-grid">
          {result.seasonCycle.phases.map((card) => (
            <article
              key={`${card.season}-${card.ageFrom}`}
              className={card.isCurrent ? 'active' : ''}
            >
              <div className="season-card-title">
                <strong>{card.season}</strong>
                <span>{card.ageFrom}〜{card.ageTo}歳</span>
              </div>
              <dl>
                <div>
                  <dt>本能</dt>
                  <dd>{card.instinct}</dd>
                </div>
                <div>
                  <dt>使い方</dt>
                  <dd>{card.description}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
        <p className="major-luck-note">
          四季運は算命学独自の上位レイヤーです。大運の10年単位の読みと重ねて、
          今の30年でどの本能を使いやすいかを見ます。
        </p>
      </section>

      <section className="major-luck-panel" aria-label="大運">
        <div className="major-luck-heading">
          <div>
            <span className="eyebrow">MAJOR LUCK</span>
            <h3>大運（10年運）</h3>
            <p>
              大運は、算命学と四柱推命に共通する10年ごとの後天運です。
              月柱の干支を起点に、性別と年干の陰陽で順行・逆行を決めます。
              ここでは十大主星と十二大従星を重ねて、10年単位のテーマを見ます。
            </p>
          </div>
          <div className="major-luck-stats">
            <article>
              <span>計算</span>
              <strong>{result.majorLuck.gender === 'male' ? '男性' : '女性'}</strong>
            </article>
            <article>
              <span>回り方</span>
              <strong>{result.majorLuck.directionLabel}</strong>
            </article>
            <article>
              <span>起運</span>
              <strong>{result.majorLuck.startAge}歳運</strong>
            </article>
          </div>
        </div>

        {currentMajorLuck ? (
          <article className="major-luck-current">
            <span>現在の大運</span>
            <strong>
              第{currentMajorLuck.order}旬 {currentMajorLuck.ageFrom}〜{currentMajorLuck.ageTo}歳
            </strong>
            <p>
              {currentMajorLuck.stem}{currentMajorLuck.branch}・{currentMajorLuck.majorStar}・
              {currentMajorLuck.energyStar} / {currentMajorLuck.energyFortune}（{currentMajorLuck.energyValue}）
            </p>
            {currentMajorLuckStarGuide && (
              <p className="major-luck-star-note">
                {currentMajorLuck.majorStar}は「{currentMajorLuckStarGuide.keywords}」の星です。
                {currentMajorLuckStarGuide.essence}
              </p>
            )}
            <p>{currentMajorLuck.theme}</p>
          </article>
        ) : firstMajorLuck ? (
          <article className="major-luck-current">
            <span>現在の大運</span>
            <strong>起運前</strong>
            <p>
              {result.majorLuck.currentYear}年は、まだ大運に入る前の時期です。
              第1旬は{firstMajorLuck.calendarYearFrom}年、{firstMajorLuck.ageFrom}歳から始まります。
            </p>
            <p>今は基本の命式や家庭環境の影響を土台として見ます。</p>
          </article>
        ) : null}

        <div className="major-luck-table-wrap">
          <table className="major-luck-table">
            <thead>
              <tr>
                <th>旬</th>
                <th>年齢</th>
                <th>西暦</th>
                <th>大運干支</th>
                <th>十大主星</th>
                <th>十二大従星 / 十二運</th>
                <th>テーマ</th>
              </tr>
            </thead>
            <tbody>
              {result.majorLuck.periods.map((period) => (
                <tr key={period.order} className={period.isCurrent ? 'active' : ''}>
                  <td>第{period.order}旬</td>
                  <td>{period.ageFrom}〜{period.ageTo}歳</td>
                  <td>{period.calendarYearFrom}〜{period.calendarYearTo}</td>
                  <td><strong>{period.stem}{period.branch}</strong></td>
                  <td>{period.majorStar}</td>
                  <td>{period.energyStar} / {period.energyFortune}（{period.energyValue}）</td>
                  <td>
                    <span className="major-luck-table-note">
                      {period.majorStar}：{getCenterStarPracticalGuide(period.majorStar).keywords}
                    </span>
                    {period.focus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="major-luck-note">
          起運年齢は、資料の考え方に合わせて節入り日までの日数を3で割り、小数点は切り上げて出しています。
          計算日数：{result.majorLuck.dayCount}日 / 表示年：{result.majorLuck.currentYear}年 / 満年齢：{result.majorLuck.currentAge}歳。
        </p>
      </section>

      <section className="wave-section" aria-label="年運の波動">
        <div className="wave-heading">
          <div>
            <span className="eyebrow">12 YEARS</span>
            <h3>年運の波動</h3>
          </div>
          <p>過去2年と、今年を含む今後10年を並べています。前の流れが次の判断にどうつながるかを見るための年表です。</p>
        </div>
        <div className="graph-container wave-graph">
          {result.rhythm.map((node) => {
            const yearPosition = node.year < displayCurrentYear
              ? 'past'
              : node.year === displayCurrentYear ? 'current' : 'future';
            return (
              <div key={node.year} className={`graph-column ${yearPosition === 'current' ? 'current-year' : yearPosition === 'past' ? 'past-year' : ''}`}>
                <div className="graph-bar-wrapper">
                  <div
                    className={`graph-bar ${node.isTenchusatsu ? 'tenchusatsu' : node.waveEnergy <= 2 ? 'caution' : ''}`}
                    style={{ height: `${Math.max((node.waveEnergy / 12) * 100, 6)}%` }}
                    title={`${node.year}年 ${node.stem}${node.branch}: ${node.waveLabel} ${node.waveEnergy}/12`}
                  >
                    <span>{node.waveEnergy}</span>
                  </div>
                </div>
                <small>{node.branch}</small>
                <em>{node.season}{node.seasonYear}</em>
                <b>{yearPosition === 'past' ? '過去' : yearPosition === 'current' ? '今年' : '今後'}</b>
                <span>{node.year}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="wave-section" aria-label="月運の波動">
        <div className="wave-heading">
          <div>
            <span className="eyebrow">12 MONTHS</span>
            <h3>月運の波動</h3>
          </div>
          <p>毎年くる月の流れです。1月は丑、12月は子として見ます。</p>
        </div>
        <div className="graph-container wave-graph month-wave">
          {result.monthlyRhythm.map((node) => (
            <div key={node.month} className="graph-column">
              <div className="graph-bar-wrapper">
                <div
                  className={`graph-bar ${node.isTenchusatsu ? 'tenchusatsu' : node.energy <= 2 ? 'caution' : ''}`}
                  style={{ height: `${Math.max((node.energy / 12) * 100, 6)}%` }}
                  title={`${node.month}月 ${node.branch}: ${node.label} ${node.energy}/12`}
                >
                  <span>{node.energy}</span>
                </div>
              </div>
              <small>{node.branch}</small>
              <em>{node.season}{node.seasonYear}</em>
              <span>{node.month}月</span>
            </div>
          ))}
        </div>
      </section>

      <div className="timeline-container">
        <article className="timeline-node">
          <b>幸運期が強い年</b>
          <span>{peakYears.length ? peakYears.join(' / ') : 'この12年では控えめ'}</span>
          <p>他力運が10以上の年です。人からの紹介、追い風、外部環境の後押しを使いやすい時期です。</p>
        </article>
        <article className="timeline-node alert">
          <b>注意したい月</b>
          <span>{cautionMonths.length ? cautionMonths.join(' / ') : '大きな注意月は少なめ'}</span>
          <p>天中殺期間、またはエネルギー2以下の月です。大きな変更よりも確認・整理・準備を優先しましょう。</p>
        </article>
        {result.rhythm.map((node) => {
          const yearPosition = node.year < displayCurrentYear
            ? '過去'
            : node.year === displayCurrentYear ? '今年' : '今後';
          return (
          <article key={node.year} className={node.isTenchusatsu ? 'timeline-node alert' : node.year === displayCurrentYear ? 'timeline-node current' : 'timeline-node'}>
            <b>{node.year}年 {yearPosition}・{node.waveLabel}</b>
            <span>{node.stem}{node.branch}・{node.waveEnergy}/12・{node.seasonPhase}</span>
            <p>{node.seasonAction} {node.description}</p>
          </article>
          );
        })}
      </div>
    </div>
  );
}

function App() {
  const [isUnlocked, setIsUnlocked] = useState(() => (
    !shouldRequireAccessCode || acceptedAccessCodeHashes.includes(localStorage.getItem(accessStorageKey) || '')
  ));
  const [targetName, setTargetName] = useState('');
  const [birthYear, setBirthYear] = useState('2000');
  const [birthMonth, setBirthMonth] = useState('1');
  const [birthDay, setBirthDay] = useState('1');
  const [birthHour, setBirthHour] = useState('12');
  const [gender, setGender] = useState<Gender>('male');
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const targetLabel = targetName.trim() || 'あなた';
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1900 + 1 }, (_, index) => String(currentYear - index));
  const monthOptions = Array.from({ length: 12 }, (_, index) => String(index + 1));
  const dayOptions = Array.from({ length: getDaysInMonth(birthYear, birthMonth) }, (_, index) => String(index + 1));
  const birthDateLabel = `${birthYear}/${birthMonth.padStart(2, '0')}/${birthDay.padStart(2, '0')}`;
  const insightCards = useMemo(
    () => result ? buildInsightCards(result, targetLabel) : [],
    [result, targetLabel],
  );
  const workGuide = result ? getWorkCareerGuide(result.jobStyle.primaryStar) : null;
  const workEnergyGuide = result ? getWorkEnergyGuide(result.energy.star) : null;
  const currentEnergyGuide = result ? getEnergyStarCorrespondence(result.energy.star) : null;

  if (shouldRequireAccessCode && acceptedAccessCodeHashes.length === 0) {
    return <AccessSetupRequired />;
  }

  if (!isUnlocked) {
    return <AccessGate onUnlock={() => setIsUnlocked(true)} />;
  }

  const handleDiagnose = (e: React.FormEvent) => {
    e.preventDefault();

    const hourVal = birthHour !== '' ? Number.parseInt(birthHour, 10) : undefined;
    setResult(diagnoseUser(makeBirthDate(birthYear, birthMonth, birthDay), hourVal, gender));
    setActiveTab('profile');
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className={`app-container ${result ? getThemeClass(result.personality.element) : ''}`}>
      <header className="app-header">
        <div className="app-kicker">PERSONAL MEISHIKI PROFILE</div>
        <h1 className="app-title">MEISHIKI Compass</h1>
        <p className="app-subtitle">
          命式から、その人の持ち味、力の出し方、仕事で活きる役割を読み解くプロファイルツール
        </p>
      </header>

      <main>
        {!result ? (
          <form onSubmit={handleDiagnose} className="tool-shell">
            <section className="form-panel">
              <div className="panel-heading">
                <span className="eyebrow">INPUT</span>
                <h2>自分を知る</h2>
              </div>

              <div className="form-row">
                <label className="form-group">
                  <span className="form-label">名前</span>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="例：田中さん / たかさん"
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                  />
                </label>
              </div>

              <div className="form-row">
                <fieldset className="form-group date-select-group">
                  <span className="form-label">生年月日</span>
                  <div className="date-select-grid">
                    <label>
                      <span>年</span>
                      <select
                        className="form-input"
                        value={birthYear}
                        onChange={(e) => {
                          const nextYear = e.target.value;
                          setBirthYear(nextYear);
                          setBirthDay((currentDay) => clampDay(nextYear, birthMonth, currentDay));
                        }}
                      >
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>{year}年</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span>月</span>
                      <select
                        className="form-input"
                        value={birthMonth}
                        onChange={(e) => {
                          const nextMonth = e.target.value;
                          setBirthMonth(nextMonth);
                          setBirthDay((currentDay) => clampDay(birthYear, nextMonth, currentDay));
                        }}
                      >
                        {monthOptions.map((month) => (
                          <option key={month} value={month}>{month}月</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span>日</span>
                      <select
                        className="form-input"
                        value={birthDay}
                        onChange={(e) => setBirthDay(e.target.value)}
                      >
                        {dayOptions.map((day) => (
                          <option key={day} value={day}>{day}日</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </fieldset>
                <label className="form-group">
                  <span className="form-label">出生時間</span>
                  <select
                    className="form-input"
                    value={birthHour}
                    onChange={(e) => setBirthHour(e.target.value)}
                  >
                    <option value="">不明 / 指定なし（三柱）</option>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <option key={i} value={i}>{String(i).padStart(2, '0')}:00頃</option>
                    ))}
                  </select>
                </label>
                <label className="form-group">
                  <span className="form-label">性別（大運計算用）</span>
                  <select
                    className="form-input"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                  >
                    <option value="male">男性として計算</option>
                    <option value="female">女性として計算</option>
                  </select>
                </label>
              </div>

              <button type="submit" className="btn-primary">
                {targetLabel}のプロファイルを見る
              </button>
            </section>
          </form>
        ) : (
          <div className="result-layout">
            <section className="summary-panel">
              <div className="summary-copy">
                <span className="eyebrow">YOUR PROFILE</span>
                <h2>
                  {targetLabel}は「{result.personality.alias}」タイプ
                  <span>（{result.personality.element}・{result.personality.yinYang}）</span>
                </h2>
                <p>{result.personality.description}</p>
                <div className="summary-meta">
                  <span>{birthDateLabel} 生まれ</span>
                  <span>自然界：{result.personality.natureSymbol}</span>
                  <span>{result.personality.instinct}</span>
                  <span>大運：{result.majorLuck.directionLabel}</span>
                  {birthHour !== '' && <span>{birthHour}:00頃</span>}
                </div>
              </div>
              <div className="summary-visual">
                <img
                  src={getStemImage(result.personality.stem)}
                  alt={`${result.personality.stem}・${result.personality.natureSymbol}`}
                />
                <div className="element-badge">
                  {result.personality.stem} / {result.personality.element}（{result.personality.yinYang}）
                </div>
              </div>
            </section>

            <section className="pillar-strip" aria-label="四柱">
              <PillarBox label="年柱" stem={result.pillars.year.stem} branch={result.pillars.year.branch} />
              <PillarBox label="月柱" stem={result.pillars.month.stem} branch={result.pillars.month.branch} />
              <PillarBox label="日柱" stem={result.pillars.day.stem} branch={result.pillars.day.branch} />
              {result.pillars.hour && (
                <PillarBox label="時柱" stem={result.pillars.hour.stem} branch={result.pillars.hour.branch} />
              )}
              <button type="button" className="btn-secondary" onClick={handleReset}>入力に戻る</button>
            </section>

            <FoundationNotesPanel result={result} hasHour={birthHour !== ''} targetLabel={targetLabel} />

            <NatalChartTable result={result} />

            <LifeChartPanel result={result} targetLabel={targetLabel} />

            <CenterStarPracticalPanel result={result} targetLabel={targetLabel} />

            <ActionAreaPanel result={result} targetLabel={targetLabel} />

            <TalentEnergyPanel result={result} targetLabel={targetLabel} />

            <section className="insight-grid" aria-label="実用インサイト">
              {insightCards.map((card) => (
                <InsightCard key={card.eyebrow} {...card} />
              ))}
            </section>

            <nav className="tab-navigation" aria-label="詳細タブ">
              {[
                ['profile', '本質気質'],
                ['work', '仕事と役割'],
                ['relation', '関係性'],
                ['rhythm', 'リズム'],
              ].map(([tab, label]) => (
                <button
                  key={tab}
                  type="button"
                  className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab as ActiveTab)}
                >
                  {label}
                </button>
              ))}
            </nav>

            <section className="detail-panel">
              {activeTab === 'profile' && (
                <div className="detail-grid">
                  <article>
                    <span className="eyebrow">CORE</span>
                    <h3>本質のキーワード</h3>
                    <p>{result.personality.shortDesc}</p>
                    <h4>強み</h4>
                    <ul className="check-list">
                      {result.personality.strengths.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </article>
                  <article>
                    <span className="eyebrow">CARE</span>
                    <h3>気をつけたいこと</h3>
                    <ul className="check-list">
                      {result.personality.weaknesses.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                    <h4>整え方</h4>
                    <p>{result.personality.advice}</p>
                  </article>
                  <article className="wide-card stem-meaning-card">
                    <span className="eyebrow">TEN STEM MEANING</span>
                    <h3>十干の意味</h3>
                    <div className="stem-meaning-grid">
                      <div>
                        <span>日干</span>
                        <strong>{result.personality.stem}・{result.personality.natureSymbol}</strong>
                        <p>{result.personality.element}の気の{result.personality.yinYang}</p>
                      </div>
                      <div>
                        <span>五行の本能</span>
                        <strong>{result.personality.instinct}</strong>
                        <p>{result.personality.instinctDescription}</p>
                      </div>
                    </div>
                    <p>{result.personality.essence}</p>
                  </article>
                  <article className="wide-card">
                    <span className="eyebrow">ELEMENT BALANCE</span>
                    <h3>五行バランス（偏差値）</h3>
                    <p className="balance-note">
                      命式の天干・地支・採用蔵干からraw dataを出し、50を平均として偏差値化しています。
                    </p>
                    <div className="balance-list">
                      {Object.entries(result.elementBalance).map(([element, score]) => (
                        <div key={element} className="balance-row">
                          <span>{element}</span>
                          <div className="balance-track">
                            <div style={{ width: `${Math.min(100, Math.max(0, (score / 80) * 100))}%` }} />
                          </div>
                          <b>{score.toFixed(2)}</b>
                          <small>raw {result.elementBalanceRaw[element]}</small>
                        </div>
                      ))}
                    </div>
                    <p className="balance-diff">差分合計：{result.elementBalanceDifferenceTotal.toFixed(2)}</p>
                  </article>
                </div>
              )}

              {activeTab === 'work' && (
                <div className="detail-grid">
                  <article className="wide-card">
                    <span className="eyebrow">WORK STYLE</span>
                    <h3>{result.jobStyle.primaryStar}（{result.jobStyle.primaryStarReading}）</h3>
                    <p>{result.jobStyle.description}</p>
                    <p>{result.jobStyle.workStyle}</p>
                  </article>
                  {workGuide && (
                    <article className="wide-card work-advice-card">
                      <span className="eyebrow">CAREER GUIDE</span>
                      <h3>適職・働き方の使い方</h3>
                      <div className="work-guide-grid">
                        <div>
                          <span>職業テーマ</span>
                          <strong>{workGuide.theme}</strong>
                          <p>{workGuide.mindset}</p>
                        </div>
                        <div>
                          <span>お金につながる心がまえ</span>
                          <strong>{workGuide.moneyKeyword}</strong>
                          <p>{workGuide.workAdvice}</p>
                        </div>
                        <div>
                          <span>避けたい働き方</span>
                          <strong>合わない形</strong>
                          <p>{workGuide.avoid}</p>
                        </div>
                      </div>
                    </article>
                  )}
                  <article>
                    <span className="eyebrow">GOOD FIELD</span>
                    <h3>活きやすい領域</h3>
                    <div className="career-grid">
                      {result.jobStyle.suitableCareers.map((career) => (
                        <span key={career}>{career}</span>
                      ))}
                    </div>
                  </article>
                  {workGuide && (
                    <article>
                      <span className="eyebrow">REFERENCE FIELD</span>
                      <h3>適職例</h3>
                      <div className="career-grid">
                        {workGuide.fields.map((field) => (
                          <span key={field}>{field}</span>
                        ))}
                      </div>
                    </article>
                  )}
                  {workEnergyGuide && (
                    <article>
                      <span className="eyebrow">WORK ENERGY</span>
                      <h3>仕事でのエネルギーの使い方</h3>
                      {currentEnergyGuide && (
                        <p className="small-note">
                          十二大従星：{currentEnergyGuide.sanmeiName} / 十二運：{currentEnergyGuide.fortuneName} / エネルギー値：{currentEnergyGuide.energyValue}
                        </p>
                      )}
                      <dl className="work-energy-list">
                        <div>
                          <dt>働くペース</dt>
                          <dd>{workEnergyGuide.pace}</dd>
                        </div>
                        <div>
                          <dt>向く役割</dt>
                          <dd>{workEnergyGuide.role}</dd>
                        </div>
                        <div>
                          <dt>使い方のコツ</dt>
                          <dd>{workEnergyGuide.advice}</dd>
                        </div>
                      </dl>
                    </article>
                  )}
                </div>
              )}

              {activeTab === 'relation' && (
                <div className="detail-grid relation-grid">
                  <article className="wide-card">
                    <span className="eyebrow">COMMUNICATION</span>
                    <h3>{result.jobStyle.primaryStar}タイプと接するとき</h3>
                    <p className="small-note">
                      ここでは、{targetLabel}の中心に出ている{result.jobStyle.primaryStar}を「この星」「このタイプ」として見ます。
                      下の項目は、この星を持つ相手にどう接すると伝わりやすいかのヒントです。
                    </p>
                    <p>{result.communication.description}</p>
                  </article>
                  <article>
                    <h3>この星を指導・支援するとき</h3>
                    <p>{result.communication.howToGuide}</p>
                  </article>
                  <article>
                    <h3>このタイプが上司・先輩のとき</h3>
                    <p>{result.communication.howToFollow}</p>
                  </article>
                  <article>
                    <h3>このタイプと対等に話すとき</h3>
                    <p>{result.communication.howToPeer}</p>
                  </article>
                  <article>
                    <h3>この星に避けたい対応</h3>
                    <p>{result.communication.ngPoints}</p>
                  </article>
                </div>
              )}

              {activeTab === 'rhythm' && (
                <RhythmPanel result={result} />
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
