/**
 * migrate-articles.ts
 *
 * Inserts sample articles into the Supabase articles table.
 * Run with: npx tsx scripts/migrate-articles.ts
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const sampleArticles = [
  {
    title: 'ADA Launches New Multilingual Certification Program',
    slug: 'ada-launches-multilingual-certification',
    category: 'news',
    author: 'Asian Doula Alliance',
    excerpt:
      'The Asian Doula Alliance is proud to announce expanded certification exams available in Chinese, Japanese, and Korean, making culturally competent doula care more accessible than ever.',
    content: `<h2>A New Chapter in Inclusive Doula Certification</h2>
<p>The Asian Doula Alliance has officially launched its multilingual certification program, offering postpartum doula exams in English, Chinese (Simplified and Traditional), Japanese, and Korean. This expansion reflects our commitment to breaking language barriers in maternal care.</p>
<h2>Why Multilingual Certification Matters</h2>
<p>For many Asian American families, the postpartum period is deeply intertwined with cultural traditions passed down through generations. Having a doula who speaks the family's native language and understands these traditions can make a profound difference in the quality of care.</p>
<h3>Key Benefits</h3>
<ul>
<li>Doulas can demonstrate competency in their strongest language</li>
<li>Families receive care from providers who truly understand their needs</li>
<li>Cultural postpartum practices are respected and supported</li>
</ul>
<h2>How to Apply</h2>
<p>Eligible candidates can register for the multilingual exam through our website. The exam consists of a 60-minute written portion and a 30-minute practical assessment.</p>
<blockquote><p>Our goal is to ensure that every family, regardless of language, has access to qualified, culturally competent postpartum care.</p></blockquote>`,
  },
  {
    title: 'Understanding Postpartum Traditions in East Asian Cultures',
    slug: 'postpartum-traditions-east-asian-cultures',
    category: 'education',
    author: 'Dr. Lisa Wang',
    excerpt:
      'Explore the rich traditions of "sitting the month" (zuo yuezi) and similar practices across Chinese, Japanese, and Korean cultures, and how modern doulas can honor these customs.',
    content: `<h2>The Practice of "Sitting the Month"</h2>
<p>In Chinese culture, the tradition of zuo yuezi (坐月子) dates back thousands of years. New mothers are expected to rest for 30 days after giving birth, following specific dietary and behavioral guidelines to promote recovery.</p>
<h2>Sanhujori in Korean Culture</h2>
<p>Korean postpartum care, known as sanhujori (산후조리), shares many similarities with the Chinese tradition. Mothers are encouraged to rest, eat warm nourishing foods like miyeokguk (seaweed soup), and avoid cold exposure.</p>
<h3>Common Elements Across Cultures</h3>
<ul>
<li>Extended rest periods (typically 21-40 days)</li>
<li>Special dietary requirements emphasizing warm, nourishing foods</li>
<li>Avoidance of cold water and wind exposure</li>
<li>Family support systems surrounding the new mother</li>
</ul>
<h2>Satogaeri Bunben in Japanese Culture</h2>
<p>The Japanese tradition of satogaeri bunben involves the mother returning to her parents' home for birth and the postpartum period. This provides built-in support while allowing the new mother to rest and bond with her baby.</p>
<h2>Modern Doula Practice</h2>
<p>As postpartum doulas serving Asian American families, understanding these traditions is essential. A culturally competent doula doesn't just provide physical care — they honor and facilitate the cultural practices that are meaningful to each family.</p>`,
  },
  {
    title: 'Community Spotlight: Building Bridges Through Doula Care',
    slug: 'community-spotlight-building-bridges',
    category: 'community',
    author: 'Sarah Chen',
    excerpt:
      'Meet three certified doulas who are making a difference in their local communities, from Los Angeles to New York City.',
    content: `<h2>Connecting Cultures Through Care</h2>
<p>Across the United States, ADA-certified doulas are doing more than providing postpartum support — they're building bridges between cultures and generations. Here are three inspiring stories from our community.</p>
<h2>Amy Liu — Los Angeles, CA</h2>
<p>A first-generation Chinese American, Amy became a doula after her own challenging postpartum experience. "I didn't have anyone who understood what zuo yuezi meant to my mother-in-law," she recalls. "I wanted to be that bridge for other families."</p>
<h3>Impact by the Numbers</h3>
<p>In just two years, Amy has served over 40 families in the greater Los Angeles area, with clients speaking Mandarin, Cantonese, and English.</p>
<h2>Yuki Tanaka — Seattle, WA</h2>
<p>Yuki specializes in supporting Japanese and Japanese American families. Her approach integrates traditional Japanese postpartum wisdom with modern evidence-based practices.</p>
<h2>Minji Park — New York, NY</h2>
<p>As one of the few Korean-speaking certified doulas in the NYC area, Minji fills a critical gap in her community. She has developed a network of Korean postpartum meal providers to support her clients.</p>`,
  },
  {
    title: 'ADA Certification: What to Expect on Exam Day',
    slug: 'ada-certification-exam-day-guide',
    category: 'certification',
    author: 'Ruby Zhang',
    excerpt:
      'A comprehensive guide to preparing for and taking the ADA postpartum doula certification exam, including tips from recent test-takers.',
    content: `<h2>Before the Exam</h2>
<p>The ADA certification exam is designed to assess your knowledge, skills, and cultural competency as a postpartum doula. Here's everything you need to know to walk in confident and prepared.</p>
<h3>Required Documents</h3>
<ul>
<li>Government-issued photo ID</li>
<li>Proof of completed training (minimum 40 hours)</li>
<li>Exam confirmation email</li>
</ul>
<h2>The Written Exam (60 Minutes)</h2>
<p>The written portion covers postpartum care fundamentals, newborn care, breastfeeding support, cultural competency, and professional ethics. The exam is available in English, Chinese, Japanese, and Korean.</p>
<h3>Study Tips</h3>
<ul>
<li>Review the ADA study guide thoroughly</li>
<li>Focus on cultural practices across Asian traditions</li>
<li>Practice time management — 60 minutes goes fast</li>
</ul>
<h2>The Practical Assessment (30 Minutes)</h2>
<p>The hands-on portion is a one-on-one assessment where you'll demonstrate key doula skills including infant handling, swaddling techniques, and client communication scenarios.</p>
<h2>Results and Next Steps</h2>
<p>Results are typically available within 2 weeks. Upon passing, you'll receive your ADA certification, valid for 3 years. Your digital certificate and verification code will be accessible through our website.</p>`,
  },
  {
    title: 'The Science Behind Postpartum Recovery: What Every Doula Should Know',
    slug: 'science-behind-postpartum-recovery',
    category: 'education',
    author: 'Dr. Michelle Huang',
    excerpt:
      'An evidence-based look at the physiological changes during the postpartum period and how doulas can support optimal recovery.',
    content: `<h2>Understanding Postpartum Physiology</h2>
<p>The postpartum period involves dramatic physiological changes as the body transitions from pregnancy. Understanding these changes helps doulas provide informed, effective support.</p>
<h2>Hormonal Shifts</h2>
<p>After delivery, estrogen and progesterone levels drop sharply. This hormonal shift contributes to mood changes, sleep disruption, and the onset of lactation. Doulas who understand this can normalize these experiences for new mothers.</p>
<h3>Key Hormones in Postpartum Recovery</h3>
<ul>
<li><strong>Oxytocin</strong> — promotes bonding and milk letdown</li>
<li><strong>Prolactin</strong> — drives milk production</li>
<li><strong>Cortisol</strong> — stress hormone that can impact recovery</li>
</ul>
<h2>Nutrition and Recovery</h2>
<p>Many traditional Asian postpartum foods align surprisingly well with modern nutritional science. Warming soups rich in collagen (like pig trotter soup in Chinese tradition) support tissue repair, while seaweed soup (Korean miyeokguk) provides essential iodine for thyroid function and breastfeeding.</p>
<h2>Sleep and Mental Health</h2>
<p>Sleep deprivation is one of the greatest challenges in the postpartum period. Doulas play a crucial role in facilitating rest, whether through overnight support, establishing feeding schedules, or educating families about the importance of the mother's sleep.</p>
<h2>When to Refer</h2>
<p>Certified doulas should be able to recognize signs that require professional medical attention, including signs of postpartum depression, infection, or complications. Knowing when and how to refer is a critical competency.</p>`,
  },
  {
    title: 'Insurance Coverage for Doula Services: A 2026 Update',
    slug: 'insurance-coverage-doula-services-2026',
    category: 'news',
    author: 'Asian Doula Alliance',
    excerpt:
      'Major insurance providers are expanding coverage for postpartum doula services. Here is what families and doulas need to know about the latest changes.',
    content: `<h2>Expanding Access to Doula Care</h2>
<p>2026 marks a significant milestone for doula care coverage. Several major insurance providers have expanded their postpartum doula benefits, making professional support more accessible to families across the country.</p>
<h2>Current Insurance Partners</h2>
<p>The following insurance providers now recognize ADA-certified doulas for reimbursement:</p>
<ul>
<li><strong>Medi-Cal</strong> — Full coverage for eligible families in California</li>
<li><strong>Kaiser Permanente</strong> — Partial coverage through wellness benefits</li>
<li><strong>Cigna</strong> — Coverage through select plans</li>
<li><strong>Carrot Fertility</strong> — Comprehensive doula benefits</li>
<li><strong>Progyny</strong> — Postpartum support packages</li>
</ul>
<h3>FSA/HSA Eligibility</h3>
<p>Postpartum doula services are now eligible for Flexible Spending Account (FSA) and Health Savings Account (HSA) reimbursement in most cases. Families should keep detailed receipts and invoices.</p>
<h2>What This Means for Doulas</h2>
<p>ADA certification is increasingly recognized by insurance providers as a mark of quality. Certified doulas may see increased demand as more families gain coverage for postpartum support services.</p>
<h2>How to Verify Coverage</h2>
<p>We recommend families contact their insurance provider directly to verify specific coverage details. ADA can provide certification verification letters to support insurance claims.</p>`,
  },
  {
    title: 'Breastfeeding Support: Integrating Traditional and Modern Approaches',
    slug: 'breastfeeding-traditional-modern-approaches',
    category: 'education',
    author: 'Jennifer Kim, IBCLC',
    excerpt:
      'How postpartum doulas can combine evidence-based lactation support with traditional Asian practices to help new mothers succeed in their breastfeeding journey.',
    content: `<h2>A Holistic Approach to Lactation Support</h2>
<p>Breastfeeding is a cornerstone of postpartum care across Asian cultures. As doulas, we have the unique opportunity to support families by blending time-honored traditions with current medical evidence.</p>
<h2>Traditional Galactagogues in Asian Cuisine</h2>
<p>Many traditional postpartum foods are believed to promote milk production. While scientific evidence varies, these foods are culturally significant and often nutritionally beneficial:</p>
<ul>
<li><strong>Papaya fish soup</strong> (Chinese) — Rich in protein and vitamins</li>
<li><strong>Fenugreek tea</strong> — Some evidence for lactation support</li>
<li><strong>Sesame oil chicken</strong> (Taiwanese) — Warming and nourishing</li>
<li><strong>Red date tea</strong> — Iron-rich, supports energy</li>
</ul>
<h2>Evidence-Based Positioning and Latch</h2>
<p>Regardless of cultural background, proper positioning and latch are fundamental to successful breastfeeding. Doulas should be familiar with various holding positions and be able to identify signs of poor latch.</p>
<h3>When Cultural Beliefs and Medical Advice Differ</h3>
<p>Sometimes traditional practices may conflict with current medical recommendations. The doula's role is to facilitate respectful dialogue, provide accurate information, and ultimately support the mother's informed decisions.</p>
<h2>Knowing Your Scope</h2>
<p>Postpartum doulas provide lactation support within their scope of practice. For persistent difficulties, doulas should refer families to an International Board Certified Lactation Consultant (IBCLC).</p>`,
  },
  {
    title: 'ADA Annual Conference 2026: Recap and Highlights',
    slug: 'ada-annual-conference-2026-recap',
    category: 'community',
    author: 'Asian Doula Alliance',
    excerpt:
      'Over 200 doulas, healthcare professionals, and community advocates gathered for the ADA Annual Conference. Here are the key takeaways.',
    content: `<h2>A Day of Learning and Connection</h2>
<p>The 2026 ADA Annual Conference brought together over 200 attendees at our Irvine, California headquarters for a day of education, networking, and inspiration. This year's theme was "Honoring Traditions, Embracing Innovation."</p>
<h2>Keynote Highlights</h2>
<p>Dr. Grace Park opened the conference with a powerful talk on the intersection of cultural humility and evidence-based care, challenging attendees to continuously examine their own biases and assumptions.</p>
<h3>Workshop Sessions</h3>
<ul>
<li>Advanced Newborn Care Techniques</li>
<li>Cultural Competency Deep Dive: Korean Sanhujori</li>
<li>Business Building for Independent Doulas</li>
<li>Mental Health First Aid for Postpartum Support</li>
</ul>
<h2>Community Awards</h2>
<p>This year's Community Impact Award went to the Bay Area Doula Collective, which has provided free doula services to over 100 low-income Asian American families since 2024.</p>
<h2>Looking Ahead</h2>
<p>Mark your calendars — the 2027 conference is tentatively scheduled for March in Los Angeles. We're already planning an expanded program with more hands-on workshops and networking opportunities.</p>`,
  },
];

async function main() {
  console.log(`Inserting ${sampleArticles.length} sample articles...`);

  for (const article of sampleArticles) {
    const { error } = await supabase.from('articles').insert({
      ...article,
      status: 'published',
      published_at: new Date(
        Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000
      ).toISOString(),
    });

    if (error) {
      // Might fail on duplicate slug — that's OK
      if (error.code === '23505') {
        console.log(`  SKIP (exists): ${article.slug}`);
      } else {
        console.error(`  ERROR: ${article.slug} — ${error.message}`);
      }
    } else {
      console.log(`  OK: ${article.slug}`);
    }
  }

  console.log('Done!');
}

main();
