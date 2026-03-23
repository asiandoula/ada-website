import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const articles = {
  'ada-certification-recognized-by-carrot-fertility': `<h2>A New Door Opens for Culturally Integrated Doula Care</h2>
<p>The Asian Doula Alliance is proud to announce that <strong>Carrot Fertility</strong>, one of the nation's leading employer fertility and postpartum benefit platforms, now recognizes ADA certification for doulas serving Carrot members. This milestone means that employees at hundreds of companies offering Carrot benefits can now access ADA-certified postpartum doulas — and have their care covered through their workplace benefits.</p>
<p>For many families, this removes one of the biggest barriers to receiving culturally integrated postpartum support: cost.</p>
<h2>What Is Carrot Fertility?</h2>
<p>Carrot Fertility partners with major employers to provide comprehensive fertility, pregnancy, and postpartum benefits to their employees. Companies ranging from Fortune 500 corporations to fast-growing startups use Carrot to offer their workforce access to fertility treatments, adoption support, pregnancy care, and — critically — postpartum doula services.</p>
<p>Unlike traditional insurance, Carrot operates as an employer-sponsored benefit platform. When a company partners with Carrot, their employees gain access to a curated network of vetted providers, including doulas. Carrot's recognition of ADA certification means that our graduates meet the platform's quality and training standards — and can serve families within their network.</p>
<h2>How the Partnership Came Together</h2>
<p>The recognition was validated through an <strong>online pilot program</strong> in which ADA-certified doulas provided postpartum support to Carrot members. The pilot assessed doula competency, family satisfaction, and the integration of culturally specific care practices — including Chinese <em>zuo yuezi</em>, Korean <em>sanhujori</em>, and Japanese <em>satogaeri</em> traditions — within Carrot's service framework.</p>
<p>The results were overwhelmingly positive. Families reported high satisfaction with the cultural competence of their doulas, the quality of newborn and postpartum care, and the seamless coordination through Carrot's platform.</p>
<h2>What This Means for Families</h2>
<p>If your employer offers Carrot Fertility benefits, you may be able to receive postpartum doula care from an ADA-certified doula at little or no out-of-pocket cost. Here's what to do:</p>
<ul>
<li><strong>Check your benefits:</strong> Ask your HR department or log into your Carrot Fertility account to see if postpartum doula care is included in your plan.</li>
<li><strong>Request a culturally matched doula:</strong> Through Carrot, you can specifically request an ADA-certified doula who speaks your language and understands your family's cultural practices.</li>
<li><strong>Receive care covered by your employer:</strong> Depending on your plan, doula services may be fully or partially covered.</li>
</ul>
<h2>Looking Ahead</h2>
<p>"Our mission has always been to make culturally integrated postpartum care accessible to every family that needs it," said <strong>Betty Meng</strong>, founder and president of the Asian Doula Alliance. "Carrot Fertility's recognition of our certification is a validation of the training model we've built — and more importantly, it removes a real financial barrier for working families."</p>
<p>ADA continues to pursue partnerships with benefit platforms, insurance providers, and healthcare systems to expand access. If you're an employer interested in offering culturally integrated doula services, reach out at <strong>contact@asiandoula.org</strong> or call <strong>(714) 202-6501</strong>.</p>`,

  'ada-inaugural-postpartum-doula-summit-2025': `<h2>A Historic Gathering for Culturally Integrated Maternal Health</h2>
<p>On <strong>September 20-21, 2025</strong>, the Asian Doula Alliance hosted its <strong>first annual Postpartum Doula Summit</strong> in Irvine, California — and the energy in the room made one thing clear: this wasn't just a conference. It was the beginning of a movement.</p>
<p>Over <strong>150 attendees</strong> filled the venue across two packed days of keynotes, panels, hands-on workshops, and the kind of candid conversations that only happen when people who share a mission finally find each other in the same room.</p>
<h2>Opening Keynote: The Future of Culturally Integrated Maternal Health</h2>
<p>ADA founder and president <strong>Betty Meng</strong> opened the summit with a keynote tracing the arc from ADA's earliest days to its current reach of 167+ certified doulas. She spoke about the gap that inspired ADA's founding — the disconnect between Western postpartum medical models and the rich, time-tested recovery traditions practiced in Asian cultures.</p>
<p>"Every culture has wisdom about how to care for a mother after birth," Betty told the audience. "Chinese <em>zuo yuezi</em>, Korean <em>sanhujori</em>, Japanese <em>satogaeri</em> — these aren't folklore. They're sophisticated care frameworks developed over centuries."</p>
<h2>Panel Highlights: Voices from Across the Country</h2>
<p>Doulas from <strong>Los Angeles, the Bay Area, Seattle, and New York City</strong> shared the unique challenges and opportunities of their markets:</p>
<ul>
<li><strong>Los Angeles:</strong> Navigating enormous demand and complex insurance landscapes, including Medi-Cal managed care partnerships.</li>
<li><strong>Bay Area:</strong> Serving multilingual tech-industry families who often have employer benefits but struggle to find culturally matched doulas.</li>
<li><strong>Seattle:</strong> Building referral networks in a market where cultural competency training remains rare.</li>
<li><strong>New York City:</strong> Working within one of the most regulated healthcare environments while serving immigrant communities.</li>
</ul>
<h2>Workshop Tracks</h2>
<h3>Lactation Support</h3>
<p>Culturally sensitive approaches to breastfeeding support — including how to navigate family dynamics when grandparents have strong opinions about feeding practices.</p>
<h3>Postpartum Mood Disorders</h3>
<p>The intersection of postpartum depression and cultural stigma around mental health. Doulas learned screening techniques and referral protocols.</p>
<h3>Building a Doula Business</h3>
<p>From setting rates to managing client contracts to marketing in multilingual communities.</p>
<h3>Insurance Credentialing</h3>
<p>Step-by-step guidance on vendor applications, documentation requirements, and communicating with insurance representatives.</p>
<h2>Save the Date: 2026 Summit</h2>
<p>The <strong>second annual Postpartum Doula Summit is confirmed for 2026</strong> — returning to Southern California with an expanded program. Follow ADA's website for updates, or reach out to <strong>contact@asiandoula.org</strong> to be added to the notification list.</p>`,

  'from-truck-driver-to-postpartum-doula': `<h2>The Road That Never Ended</h2>
<p>For three years, Mei-Ling Chen's world was 72 feet long and 8 feet wide.</p>
<p>She and her husband, Jianwei, drove as a team — one of thousands of husband-wife pairs hauling freight across the American interstate system. One drives while the other sleeps. Eight hours on, eight hours off, twenty-four hours a day. Their three-year-old son, Lucas, lived in the cab with them.</p>
<p>The money was good — better than anything else available to a couple who'd immigrated from Fujian Province with limited English. Team drivers could clear $200,000 a year in gross revenue, and the overhead was low when your truck was also your home.</p>
<p>Mei-Ling was good at it. Clean driving record. Sharp spatial awareness. She could back a 53-foot trailer into a tight dock on the first attempt. She kept meticulous logs and never cut a corner on safety.</p>
<p>But somewhere around mile 300,000, she started to disappear.</p>
<h2>Invisible</h2>
<p>It wasn't dramatic. No breakdown, no single moment of crisis. More like erosion.</p>
<p>Mei-Ling and Jianwei were together every minute of every day. They ate together, slept in shifts in the same bunk, navigated together, parented together. No space that belonged only to her.</p>
<p>"People think the hard part of trucking is the driving," Mei-Ling would later say. "The driving was the easy part. The hard part was never being alone and always being lonely."</p>
<p>She had no identity outside of them. She was Jianwei's co-driver. She was Lucas's mother. She was a function, not a person.</p>
<p>Mei-Ling started having a recurring thought: <em>I could do this for twenty more years and no one would ever know I existed.</em></p>
<h2>A Different Kind of Night Shift</h2>
<p>A friend from her church group in LA had shared a photo on WeChat — herself in a lavender polo, holding a newborn. The caption: "My first solo overnight shift as a certified doula. I didn't sleep. I never felt more awake."</p>
<p>Mei-Ling read it three times. Then she looked up the Asian Doula Alliance.</p>
<p>She read everything on the ADA website during her off-shifts, phone propped against the bunk wall while the truck hummed down I-10 through the Texas night. A certification program. A career. Something of her own.</p>
<p>When she told Jianwei, he was quiet for a long time. Then he said: "You haven't sounded like this since before the truck."</p>
<h2>Training</h2>
<p>Mei-Ling enrolled in ADA's certification program, driving from Fontana to the training center at 7515 Irvine Center Drive — an hour each way, a distance that felt laughably short after years of cross-country hauls.</p>
<p>What surprised her most wasn't the curriculum. It was being <em>seen</em>.</p>
<p>ADA's trainers understood her situation. They didn't treat her trucking background as irrelevant. They treated it as a foundation.</p>
<p>"You've been working 24-hour shifts for three years," one trainer told her. "You know how to stay alert at 3 AM. You know how to be calm when something goes wrong. You've been training for this work your whole adult life — you just didn't know it."</p>
<h2>The Skills She Already Had</h2>
<ul>
<li><strong>Endurance:</strong> Three years on a sleep rotation made twelve-hour doula shifts feel like a break.</li>
<li><strong>24/7 availability:</strong> The baby doesn't wait, just like the load didn't wait.</li>
<li><strong>Safety consciousness:</strong> The vigilance that kept her alive on the highway translated directly to newborn care.</li>
<li><strong>Calm under pressure:</strong> A jackknifing trailer in a rainstorm. A colicky baby at 2 AM. Both require steady hands and a clear head.</li>
<li><strong>Working in close quarters:</strong> She'd lived in a truck cab with two other people. Working in a family's home felt natural.</li>
</ul>
<h2>The First Night</h2>
<p>Her first solo overnight was with a family in Arcadia — a young couple with a six-day-old daughter. The mother hadn't slept more than ninety minutes at a stretch since the birth.</p>
<p>Mei-Ling arrived at 9 PM. She warmed the postpartum soup. She checked the baby, swaddled her, sat with the grandmother for twenty minutes listening to her worries. Then she sent everyone to bed.</p>
<p>For the next eight hours, she held the baby, fed her, changed her, tracked everything on a log sheet. At 4 AM, the baby slept, and Mei-Ling sat in the dim living room thinking about all those nights driving through darkness — the only one awake, keeping everything on the road.</p>
<p>She was doing the same thing now. But this time, someone would wake up and say <em>thank you</em>.</p>
<p>The mother came out at 6:30 AM looking like a different person. She'd slept six hours straight.</p>
<p>"How are you not tired?" she asked.</p>
<p>Mei-Ling smiled. "I've had practice."</p>
<h2>Mei-Ling Now</h2>
<p>Today, Mei-Ling has a client roster, a professional reputation, and something she couldn't find in 300,000 miles: herself.</p>
<p>She has business cards with her name on them — not a company name, not a truck number. <em>Her</em> name.</p>
<p>"In the truck, I was a function. Nobody cared who I was — they cared that the load arrived. Now, families invite me into their homes. They trust me with their baby. They ask for me by name."</p>
<p>She pauses.</p>
<p>"I drove across this entire country and nobody saw me. Now I stay in one house for one night, and a mother tells me I changed her life. That's not a career change. That's waking up."</p>
<p><em>The Asian Doula Alliance certifies postpartum doulas from all backgrounds. If you're considering a career change — no matter where you're starting from — visit our website or contact us at contact@asiandoula.org.</em></p>`,

  'ada-doulas-credential-with-iehp-inland-empire': `<h2>A New Pathway for Inland Empire Families</h2>
<p>Several ADA-certified postpartum doulas have successfully completed the credentialing process to become <strong>approved providers with Inland Empire Health Plan (IEHP)</strong> — one of the largest Medi-Cal managed care plans in California. With ADA's guidance throughout the application process, these doulas can now serve IEHP members in Riverside and San Bernardino counties.</p>
<h2>Understanding IEHP</h2>
<p>Inland Empire Health Plan serves approximately <strong>1.5 million Medi-Cal members</strong> across Riverside and San Bernardino counties. As California expands Medi-Cal coverage to include doula services, IEHP has opened pathways for qualified doulas to become credentialed providers — meaning their services can be covered at no cost to eligible members.</p>
<h2>ADA's Role: Guiding Doulas Through the Process</h2>
<p><strong>Individual doulas hold the provider credentials, not ADA.</strong> Each doula went through IEHP's vendor application and credentialing process independently. ADA provided the support system that made success possible:</p>
<ul>
<li><strong>Vendor applications:</strong> Coaching on completing detailed paperwork requiring documentation of training, certification, and liability insurance.</li>
<li><strong>Documentation preparation:</strong> Helping doulas assemble credentials in the right format.</li>
<li><strong>Communication support:</strong> Assisting with follow-ups and responding to requests for additional information — especially critical for doulas whose primary language is not English.</li>
<li><strong>Compliance guidance:</strong> Explaining ongoing obligations once credentialed.</li>
</ul>
<p>"We don't do the credentialing for our doulas — they do it themselves, and they should be proud of that," said <strong>Betty Meng</strong>. "But we walk beside them through every step. Our role is to empower doulas to become independent healthcare providers who can stand on their own in the insurance system."</p>
<h2>Why the Inland Empire Needs This</h2>
<p>The Inland Empire has significant and growing Asian American communities, yet the region has been underserved for culturally specific maternal health services. Families have had to choose between culturally competent care they pay for out of pocket and insurance-covered care that doesn't reflect their values.</p>
<p>With ADA-certified doulas now credentialed through IEHP, that choice is no longer necessary for eligible families.</p>
<h2>What This Means for IEHP Members</h2>
<ul>
<li><strong>Doula services may be covered</strong> under California's Medi-Cal doula benefit.</li>
<li><strong>You can request a culturally matched doula</strong> who speaks your language.</li>
<li><strong>Ask early</strong> — the best time to arrange doula support is during pregnancy.</li>
</ul>
<h2>The Bigger Picture</h2>
<p>Every doula who successfully credentials with a Medi-Cal managed care plan makes the path clearer for the next one. Every family that receives culturally competent care through their health plan makes the case stronger for expanding these pathways. This is how systems change — one credentialed doula, one served family, one covered visit at a time.</p>
<p>If you're an ADA-certified doula interested in IEHP credentialing, or a family looking for a culturally competent doula, contact us at <strong>contact@asiandoula.org</strong> or <strong>(714) 202-6501</strong>.</p>`,
};

async function run() {
  for (const [slug, content] of Object.entries(articles)) {
    const { error } = await sb.from('articles').update({ content }).eq('slug', slug);
    if (error) console.log('[FAIL]', slug, error.message);
    else console.log('[OK]', slug, '—', content.length, 'chars');
  }
}
run();
