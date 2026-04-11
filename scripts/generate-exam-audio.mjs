/**
 * Generate exam audio files using OpenAI TTS API
 * Usage: OPENAI_API_KEY=sk-... node scripts/generate-exam-audio.mjs
 */

import fs from 'fs';
import path from 'path';

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error('Set OPENAI_API_KEY env var');
  process.exit(1);
}

const OUT_DIR = path.join(process.cwd(), 'public/audio/exam');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function generateAudio(text, filename) {
  const outPath = path.join(OUT_DIR, filename);
  console.log(`Generating: ${filename} (${text.length} chars)`);

  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1-hd',
      voice: 'nova',
      input: text,
      response_format: 'mp3',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`FAILED ${filename}: ${res.status} ${err}`);
    return false;
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buffer);
  console.log(`  ✓ ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
  return true;
}

// Small delay between requests to avoid rate limits
function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── Audio definitions ───────────────────────────────────────

const audios = [
  // Written exam instructions
  {
    filename: 'written-instructions.mp3',
    text: `笔试考试须知。
第一，考试时长为一小时。
第二，请遵守考场纪律，严禁携带与考试无关的物品进入考场。
第三，考试中遇到任何程序性问题请举手示意。
第四，距离考试结束15分钟时，监考老师会统一进行提醒。
第五，考试结束后请立即停笔并按照要求提交试卷。
祝各位考试顺利。`,
  },

  // Practical exam overview instructions
  {
    filename: 'practical-instructions.mp3',
    text: `实操考试流程说明。
本次实操考试共九项考核模块。每项考核模块有具体的考核内容和时间限制。
请按照屏幕上的提示依次完成各项考核。
每项考核结束后，请留在原地等待监考老师确认，不得擅自离开考位。
祝各位考试顺利。`,
  },

  // Module 1: CPR
  {
    filename: 'm1-cpr.mp3',
    text: `第一项：心肺复苏。
情景描述：在客户家里，一名1个月大的新生儿突然失去意识，新生儿躺在地上，身体僵直，没有明显的呼吸起伏，情况十分危急。
考核要求：请按照标准急救流程，对模拟新生儿进行正确的心肺复苏操作。
考核时间：2分钟。请开始。`,
  },

  // Module 2: Foreign Object First Aid
  {
    filename: 'm2-foreign-object.mp3',
    text: `第二项：异物梗塞急救。
情景描述：在客户家里，一名1个月大的新生儿正在进食，突然剧烈咳嗽，随后无法发出声音，脸色迅速变得青紫。您需要立即采取措施，帮助新生儿恢复正常呼吸。
考核要求：请演示如何在新生儿发生气道梗阻时，正确实施急救。
考核时间：2分钟。请开始。`,
  },

  // Module 3: Choking Treatment
  {
    filename: 'm3-choking.mp3',
    text: `第三项：呛奶处理。
情景描述：一名新生儿刚刚喝完奶，突然呼吸急促，疑似呛奶。家长抱着新生儿，慌乱无措地向您求助。您需要迅速判断情况，并采取正确的处理方式，确保新生儿安全。
考核要求：请展示如何处理新生儿呛奶情况，确保气道通畅并避免误吸风险。
考核时间：1分钟。请开始。`,
  },

  // Module 4: Newborn Carrying - 3 steps
  {
    filename: 'm4-carry-cradle.mp3',
    text: `第四项：新生儿抱姿。请考生展示常见的新生儿抱姿。第一个：横抱。考核时间：10秒。请开始。`,
  },
  {
    filename: 'm4-carry-upright.mp3',
    text: `第四项：新生儿抱姿。下一个：竖抱。考核时间：10秒。请开始。`,
  },
  {
    filename: 'm4-carry-airplane.mp3',
    text: `第四项：新生儿抱姿。下一个：飞机抱。考核时间：10秒。请开始。`,
  },

  // Module 5: Burping - 3 steps
  {
    filename: 'm5-burp-upright.mp3',
    text: `第五项：拍嗝技巧。请考生展示以下常见的新生儿拍嗝方法。第一个：竖抱拍嗝。考核时间：15秒。请开始。`,
  },
  {
    filename: 'm5-burp-sitting.mp3',
    text: `第五项：拍嗝技巧。下一个：坐姿拍嗝。考核时间：15秒。请开始。`,
  },
  {
    filename: 'm5-burp-rocking.mp3',
    text: `第五项：拍嗝技巧。下一个：摇嗝法。考核时间：15秒。请开始。`,
  },

  // Module 6: Baby Bath - 9 steps
  {
    filename: 'm6-bath-s1-prep.mp3',
    text: `第六项：婴儿洗澡。请根据屏幕上的提示，模拟完整的婴儿洗澡流程。
第一步：物品准备。仔细核查并准备洗澡所需所有用品，确保物品完好且放置有序。考核时间：1分钟。请开始。`,
  },
  {
    filename: 'm6-bath-s2-undress.mp3',
    text: `第二步：脱纸尿裤与衣物。按照规定程序，准确而迅速地脱去婴儿的纸尿裤及衣物，确保操作过程轻柔且安全。考核时间：1分钟。请开始。`,
  },
  {
    filename: 'm6-bath-s3-water.mp3',
    text: `第三步：准备澡盆及调控水温。请仔细检查澡盆是否完好无损，并确认水温已调节至符合安全标准的适宜温度。考核时间：30秒。请开始。`,
  },
  {
    filename: 'm6-bath-s4-wash-head.mp3',
    text: `第四步：洗头与洗脸。使用温和的洗浴产品，先对婴儿头部进行清洗，再依次清洁面部。考核时间：1分钟。请开始。`,
  },
  {
    filename: 'm6-bath-s5-wash-body.mp3',
    text: `第五步：洗澡。请使用正确抱持姿势，严格控制水温，均匀清洗婴儿全身。考核时间：2分钟。请开始。`,
  },
  {
    filename: 'm6-bath-s6-massage.mp3',
    text: `第六步：抚触护理。涂抹适量抚触油后，按照标准抚触操进行护理。考核时间：3分钟。请开始。`,
  },
  {
    filename: 'm6-bath-s7-umbilical.mp3',
    text: `第七步：脐部护理。对已脱落脐带后的脐部实施消毒和护理。考核时间：15秒。请开始。`,
  },
  {
    filename: 'm6-bath-s8-diaper.mp3',
    text: `第八步：臀部护理及包皮护理。请在婴儿臀部适量涂抹护臀膏，并配合包皮护理。考核时间：1分钟。请开始。`,
  },
  {
    filename: 'm6-bath-s9-finish.mp3',
    text: `第九步：洗澡结束。请给婴儿穿好尿布、穿好衣物、打好襁褓，并整理好所有用品。考核时间：2分钟。请开始。`,
  },

  // Module 7: Baby Gas Exercise
  {
    filename: 'm7-gas-exercise.mp3',
    text: `第七项：婴儿排气操。
考核要求：请示范并口述五个及以上的标准的婴儿排气操动作，并简述每个动作的意义。
考核时间：3分钟。请开始。`,
  },

  // Module 8: Breastfeeding Positions - 5 steps
  {
    filename: 'm8-bf-cradle.mp3',
    text: `第八项：亲喂姿势。请展示：摇篮式。考核时间：15秒。请开始。`,
  },
  {
    filename: 'm8-bf-cross.mp3',
    text: `第八项：亲喂姿势。请展示：交叉式。考核时间：15秒。请开始。`,
  },
  {
    filename: 'm8-bf-football.mp3',
    text: `第八项：亲喂姿势。请展示：橄榄球式。考核时间：15秒。请开始。`,
  },
  {
    filename: 'm8-bf-sidelying.mp3',
    text: `第八项：亲喂姿势。请展示：侧卧式。考核时间：15秒。请开始。`,
  },
  {
    filename: 'm8-bf-laidback.mp3',
    text: `第八项：亲喂姿势。请展示：半躺式。考核时间：15秒。请开始。`,
  },

  // Module 9: Lactation Practices
  {
    filename: 'm9-lactation.mp3',
    text: `第九项：泌乳实操。
考核要求：请您表述并示范通乳过程中常用的乳房按摩手法，不少于五种。在每种手法操作前，请简要说明该手法的名称、动作要领及其作用。
注意：操作应动作温和，体现专业性与规范性。
考核时间：5分钟。请开始。`,
  },
];

// ─── Main ────────────────────────────────────────────────────

async function main() {
  console.log(`Generating ${audios.length} audio files...\n`);
  let success = 0;
  let failed = 0;

  for (const { filename, text } of audios) {
    const ok = await generateAudio(text, filename);
    if (ok) success++;
    else failed++;
    await delay(500); // small delay between requests
  }

  console.log(`\nDone! ${success} succeeded, ${failed} failed.`);
}

main().catch(console.error);
