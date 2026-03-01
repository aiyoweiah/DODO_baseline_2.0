// DODO Learning — Student Baseline Report PDF Generator v3.0
// Generates standardized PDF using jsPDF + html2canvas
// Works identically across all modern browsers
//
// INSTALL DEPENDENCIES:
//   npm install jspdf html2canvas
//

import { useState, useCallback, useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { LOGO_B64 } from "./assets/logo";

// ─── BRAND ──────────────────────────────────────────────────────────────
const B = {
  cream: "#f5e8d7", green: "#6b8e75", greenDark: "#4f6b58", greenLight: "#e8f0eb",
  brown: "#7a5145", brownDark: "#5c3c33", brownLight: "#f0e3dc",
  ink: "#2a1f1a", muted: "#8a7a72", border: "#e2d5c8", white: "#fffdf9",
};

// ─── COMMENT POOLS ──────────────────────────────────────────────────────
const COMMENT_POOL = {
  phonics: {
    0: "We did not evaluate the student in this area.",
    1: "Your child is mapping the \"code\" of English, connecting letter shapes to sounds. It's a high-effort stage for the brain. 孩子正处于'解码'阶段，练习字母与发音的关联。这是认知负荷最高的起步期。",
    2: "They recognize common sounds but still hit \"speed bumps\" with irregular words. We are building their reading stamina. 孩子能识别常见发音，但在不规则单词上仍有'减速'。我们须培养阅读耐力。",
    3: "Your child is moving past simple sounds and reading with their eyes rather than just their ears. Chunks of letters are becoming easier. 孩子正从'依赖听觉'向'依靠视觉'阅读过渡，对组合音的处理变得更轻松。",
    4: "Decoding is becoming a habit. They can often catch and self-correct their own mistakes, showing a strong internal ear for patterns. 单词解码正成为习惯。孩子能自我纠正发音错误，展现出对语感规律的内在监控。",
    5: "Decoding is now automatic. Your child's brain is fully free to focus on high-level analysis and deep meaning. 自然拼读已成为本能。孩子的大脑已完全释放，可以全身心投入到文本的深层分析中。",
  },
  comprehension: {
    0: "We did not evaluate the student in this area.",
    1: "Your child is a \"literal\" reader. They can find facts on the page but need guided questions to find the \"Why\" in a story. 孩子目前属于'字面阅读者'。他们能找到事实，但在理解故事深层动机时需要引导。",
    2: "They can follow a plot but sometimes lose the thread in complex sentences. We are working on identifying the main idea. 孩子能跟上情节，但在复杂句中容易迷失。我们正练习如何精准提取核心大意。",
    3: "Your child is transitioning from \"learning to read\" to \"reading to learn.\" They can summarize plots independently. 孩子正从'学习阅读'转向'通过阅读来学习'。他们已经能够独立概括故事情节。",
    4: "They are beginning to read between the lines, identifying character motivations and subtle themes without being told. 孩子开始学会'读懂言外之意'，能够独立识别角色动机和隐含的主题。",
    5: "Your child interacts with the text as a critic. They identify nuance, tone, and authorial intent with impressive clarity. 孩子能以批判者视角审视文本，敏锐捕捉语气和作者意图，具备高阶文学分析能力。",
  },
  vocabulary: {
    0: "We did not evaluate the student in this area.",
    1: "We are focusing on \"Tier 1\" high-frequency words. These are the essential building blocks for everyday communication. 我们应专注于基础高频词。这些是语言的基石，是日常交流最核心的组成部分。",
    2: "Your child understands common words and is starting to use context clues to guess what new words mean. 孩子掌握了常见词汇，并开始尝试利用上下文线索来推测生词的含义。",
    3: "They have a strong functional vocabulary. We are now introducing \"academic language\" needed for school subjects. 孩子具备了扎实的功能性词汇。我们正引入学科所需的'学术语言'来应对学校课程。",
    4: "Word choice is becoming more deliberate and expressive. They are using more specific adjectives and verbs to add color. 选词变得更有意识且富有表现力。孩子开始使用更精准的形容词和动词来丰富表达。",
    5: "Your child possesses a \"lexical curiosity.\" They use sophisticated language naturally and understand the power of precise wording. 孩子拥有'词汇好奇心'。他们能自然地使用高级词汇，并深谙精准选词的力量。",
  },
  readingFluency: {
    0: "We did not evaluate the student in this area.",
    1: "Your child reads word-by-word. We are working on grouping words into meaningful phrases to improve their speed. 孩子目前是逐词阅读。我们正练习将单词组合成短语，以提高阅读速度和流畅感。",
    2: "They are building momentum but still pause frequently. Daily reading aloud will help these connections become smoother. 阅读势头正在建立，但停顿仍较多。每天坚持大声朗读将有助于让表达变得更顺滑。",
    3: "Your child reads at a comfortable pace. We are now working on \"prosody\"—the musicality and rhythm of the language. 孩子的语速适中。我们现在的重点是培养'韵律感'，即语言本身的节奏与美感。",
    4: "Reading is smooth and expressive. They naturally adjust their tone for different characters or punctuation marks. 阅读流畅且富有表现力。孩子能根据标点或角色变换自然地调整语气。",
    5: "Your child sounds like a natural storyteller. Their fluency supports their ability to retain and explain complex information. 孩子听起来像个天生的故事家。极高的流利度支撑了他们理解并复述复杂信息的能力。",
  },
  speaking: {
    0: "We did not evaluate the student in this area.",
    1: "Your child is in the \"silent period,\" naturally absorbing the language. We are creating a safe space for them to take risks. 孩子正处于'沉默期'，大量吸收语言。我们为他们开口尝试创造一个安全、无压力的环境。",
    2: "They are sharing basic ideas more often. Every time they speak up is a win as they move past the fear of mistakes. 孩子分享想法的频率在增加。每一次开口都是进步，标志着他们正逐渐克服犯错的恐惧。",
    3: "Your child is a \"willing communicator.\" They keep conversations going even if they have to talk around a word they don't know. 孩子已是积极沟通者。即使遇到不会的词，也能通过变换表达来维持对话的持续。",
    4: "Speaking feels natural. They stay on topic and engage their listeners with clear confidence and a steady flow. 表达显得自然。他们能紧扣主题，以清晰的自信和稳定的流利度吸引听众。",
    5: "Your child commands the room. They use rhetorical pauses and emphasis to engage an audience, similar to a native speaker. 孩子具备控场能力。他们能像母语者一样，利用停顿和重音来增强表达的感染力。",
  },
  pronunciation: {
    0: "We did not evaluate the student in this area.",
    1: "We are training the \"articulators\" for new shapes. The focus is on being understood, not on perfect accent yet. 我们正训练发音器官适应新的嘴型。重点在于表达的清晰易懂，而非立即追求地道口音。",
    2: "Pronunciation is clear for familiar words. We are focusing on specific sounds that don't exist in their first language. 常用词发音清晰。我们正针对母语中不存在的特定英语发音进行专项突破。",
    3: "Your child is intelligible to most listeners. We are fine-tuning \"sentence rhythm,\" the key to sounding natural in English. 表达对大多数听众清晰易懂。我们正精细调整句子节奏，这是听起来自然地道的关键。",
    4: "Your child speaks clearly with very few errors. They are easily understood even when discussing new or complex topics. 孩子说话清晰，错误极少。即使在讨论陌生或复杂的话题时，听众也能轻松理解。",
    5: "Pronunciation is near-effortless. They have mastered the subtle musicality and linking of sounds found in natural speech. 发音几乎不费力。孩子掌握了自然口语中微妙的韵律感和连读技巧。",
  },
  conversational: {
    0: "We did not evaluate the student in this area.",
    1: "Your child can respond to simple questions but extended conversations are challenging. We're building that foundation. 孩子目前能应对简单提问，但在展开长对话时略显吃力。我们正在着手夯实这方面的基础。",
    2: "Your child can hold a short conversation on familiar topics. They're developing strategies to keep dialogue going. 孩子能够围绕熟悉的话题进行简短交流，并正在学习如何运用策略来维持对话。",
    3: "Your child converses well on known topics and is learning to manage unexpected turns in conversation. 在已知话题下表现良好，目前正处于学习如何应对对话中突发转向的阶段。",
    4: "Your child holds natural, engaging conversations and adapts their language to the listener. 对话表现自然且具吸引力，能够根据听众的不同身份灵活调整语言风格。",
    5: "Your child is a fluent, spontaneous conversationalist — natural, adaptive, and a joy to speak with. 表达极具自发性且流利。沟通风格灵活多变，是一位非常有感染力的交流者。",
  },
  listening: {
    0: "We did not evaluate the student in this area.",
    1: "Your child is learning to tune in to spoken English. Listening to English stories and videos daily makes a big difference. 孩子正在学习如何进入英语语境。建议每日坚持接触英语故事和视频，这对建立语感至关重要。",
    2: "Your child understands simple instructions and familiar topics. Comprehension drops with complex or fast speech. 能够理解简单的指令和熟悉的主题。面对复杂或语速较快的表达时，理解力仍有波动。",
    3: "Your child follows most classroom-level English well. Nuance and idiom are the next areas to develop. 能够跟上大部分课堂英语。接下来的进阶重点是理解语言中的细微差别和地道表达。",
    4: "Your child understands a wide range of spoken English, including unfamiliar topics. A strong listener. 听力理解范围广泛，即便面对不熟悉的话题也能准确捕捉信息。表现非常稳健。",
    5: "Your child's listening comprehension is outstanding — they understand nuanced language, accents, and complex content with ease. 听力表现卓越。无论是深层的语境、复杂的逻辑还是不同的口音，都能轻松驾驭。",
  },
  sentences: {
    0: "We did not evaluate the student in this area.",
    1: "We are mastering the \"Subject-Verb-Object\" unit. Next, we'll use words like \"and\" or \"but\" to glue thoughts together. 我们正掌握基础句型。下一步是学习使用连词，将这些零散的想法串联起来。",
    2: "They can write basic sentences correctly. We are now encouraging them to experiment with different sentence lengths. 孩子能写出正确的基础句。鼓励他们尝试长短句结合，以增加写作的多样性。",
    3: "Your child uses varied sentence lengths to create rhythm. We are now adding \"complexity\" with more advanced structures. 孩子能利用句式变换创造节奏感。我们会通过引入更高级的语法结构来增加深度。",
    4: "Writing is well-constructed and easy to follow. They use a mix of sentence types to keep the reader interested. 写作结构稳健且易读。他们能混合使用多种句型，始终抓住读者的注意力。",
    5: "Sentence craft is a tool for impact. Your child intentionally shapes sentences to create suspense or clarity. 句式已成为表达武器。孩子能有意识地调整结构来制造悬念或增强清晰度。",
  },
  grammar: {
    0: "We did not evaluate the student in this area.",
    1: "Mistakes are a sign of growth! We are focusing on capital letters and periods as the boundaries for their thoughts. 错误是进步的标志！我们目前的重点是掌握大小写和句号，为思维划定边界。",
    2: "Basic rules are stable, but they still need reminders for punctuation. We are focusing on consistent \"action words\" (tenses). 基础规则已稳定，但标点仍需提醒。我们目前的重点是保持动词时态的一致性。",
    3: "Your child has a solid grasp of most rules. We are now refining the finer points like complex tenses and commas. 孩子掌握了大部分规则。我们会精细化调整复杂时态和逗号的使用等细节。",
    4: "Writing is grammatically accurate. Most errors are small and the child is beginning to catch them on their own. 写作语法准确。大多数错误都很细微，且孩子已经开始尝试自我纠正。",
    5: "Grammar is intuitive. Your child can use complex punctuation to enhance the reader's experience, going beyond basic rules. 语法已内化为直觉。孩子能利用复杂标点提升阅读体验，超越了基础规则的束缚。",
  },
  organisation: {
    0: "We did not evaluate the student in this area.",
    1: "Your child's writing is a list of events. We are teaching them how to group related ideas into paragraphs. 孩子的写作目前类似于事件列表。我们正教导他们如何将相关想法归纳进段落中。",
    2: "They can write a beginning, middle, and end with some help. We are working on making these parts feel connected. 在帮助下能写出起承转合。我们正努力让文章的各个部分连接得更加紧密。",
    3: "Organization is clear. We are now working on smoother transitions to connect thoughts without using \"First/Next\" every time. 组织结构清晰。我们正磨练更自然的衔接技巧，避免每次都使用枯燥的过渡词。",
    4: "They structure their writing purposefully. Ideas flow logically from one to the next with clear signposting for the reader. 孩子能有目的地构建结构。观点逻辑严密，并为读者提供了清晰的阅读指引。",
    5: "Your child designs the \"arc\" of their writing. Each paragraph serves a purpose in building toward a powerful conclusion. 孩子具备设计文章'弧线'的能力。每一段都为最终的有力结论做出了铺垫。",
  },
  creative: {
    0: "We did not evaluate the student in this area.",
    1: "Your child is translating their vivid imagination into a new language. We celebrate their intent and provide the words they need. 孩子正尝试将想象力转化为新语言。我们鼓励这种表达意愿，并为其构思匹配词汇。",
    2: "They are starting to include personal ideas and descriptive details. We are encouraging them to take more risks with language. 孩子开始加入个人观点和细节描写。我们正鼓励他们在语言使用上进行更多大胆尝试。",
    3: "Your child is moving beyond \"telling\" to \"showing.\" They are starting to use sensory details to paint a picture for the reader. 孩子正从陈述转向描绘。他们开始利用感官细节为读者勾勒画面。",
    4: "They write with a strong voice and creative flair. Their work is engaging and feels distinctly like their own. 写作风格鲜明且富有创意。作品非常引人入胜，带有强烈的个人特色。",
    5: "Your child has a unique \"writer's voice.\" They play with language in ways that are surprising, effective, and sophisticated. 孩子拥有独特的作者笔触。他们能以令人惊喜且老练的方式驾驭语言。",
  },
};

const RATING_LABELS = { 0: "Did Not Test", 1: "Beginning", 2: "Developing", 3: "Approaching", 4: "Proficient", 5: "Advanced" };
const RATING_COLORS = {
  0: { bg: "#f0ece8", text: "#8a7a72", dot: "#b0a090" },
  1: { bg: "#fde8e8", text: "#7a2020", dot: "#c0504d" },
  2: { bg: "#fef3e2", text: "#7a4f10", dot: "#d4874e" },
  3: { bg: "#e8f0eb", text: "#3a5c45", dot: "#6b8e75" },
  4: { bg: "#e8eeea", text: "#2e5040", dot: "#4f7a60" },
  5: { bg: "#f0e3dc", text: "#7a5145", dot: "#a0695a" },
};

const PILLARS = [
  {
    id: "literacy", label: "Literacy", labelZh: "阅读理解",
    color: B.brown, lightColor: B.brownLight,
    skills: [
      { id: "phonics", label: "Phonics & Decoding", labelZh: "自然拼读与解码" },
      { id: "comprehension", label: "Reading Comprehension", labelZh: "阅读理解" },
      { id: "vocabulary", label: "Vocabulary", labelZh: "词汇量" },
      { id: "readingFluency", label: "Reading Fluency", labelZh: "阅读流利度" },
    ],
  },
  {
    id: "oral", label: "Oral Proficiency & Fluency", labelZh: "口语&流利度",
    color: B.green, lightColor: B.greenLight,
    skills: [
      { id: "speaking", label: "Speaking Confidence", labelZh: "口语自信心" },
      { id: "pronunciation", label: "Pronunciation & Clarity", labelZh: "发音与清晰度" },
      { id: "conversational", label: "Conversational Fluency", labelZh: "对话流利度" },
      { id: "listening", label: "Listening Comprehension", labelZh: "听力理解" },
    ],
  },
  {
    id: "writing", label: "Writing & Composition", labelZh: "构思&写作",
    color: B.brownDark, lightColor: "#ede0d8",
    skills: [
      { id: "sentences", label: "Sentence Structure", labelZh: "句子结构" },
      { id: "grammar", label: "Grammar & Mechanics", labelZh: "语法与写作规范" },
      { id: "organisation", label: "Writing Organisation", labelZh: "写作组织" },
      { id: "creative", label: "Creative Expression", labelZh: "创意表达" },
    ],
  },
];

// ─── GRADE MODULES ──────────────────────────────────────────────────────
const BAND_12 = {
  literacy: [
    { name: "Main Idea", nameZh: "核心大意", desc: "引导孩子从故事中提取关键信息，学会用一句话概括发生了什么。这是建立逻辑思考的第一步，帮助孩子在阅读初期理清叙事主线。" },
    { name: "Punctuation Pauses", nameZh: "标点停顿", desc: "通过识别句号和逗号，教会孩子在阅读时进行自然的节奏调节，培养语感。这不仅能提高朗读流利度，更有助于孩子理解句子的结构边界。" },
    { name: "Readers' Theater", nameZh: "读者剧场", desc: "通过角色扮演和趣味朗诵，让孩子在情境中练习表达，增强阅读的趣味性。这种互动方式能有效提升孩子的口语自信心和对文本的情感理解。" },
  ],
  oral: [
    { name: "Expressing Basic Needs", nameZh: "基础需求表达", desc: "引导孩子学会用清晰的短语或简单句表达学校生活中的基本需求。这是建立安全感和融入集体生活的关键第一步。" },
    { name: "Phonemic Awareness & Rhythm", nameZh: "语音意识与节奏", desc: "通过儿歌、韵律诗和单词拆解，训练孩子对英语独特节奏和发音位置的感知。这能有效预防早期发音习惯偏差。" },
    { name: "Basic Social Interaction", nameZh: "初级社交礼仪", desc: "教授基础的问候、感谢及简单的排队或分享用语。孩子将学习在社交场合中如何开启一段简单的对话。" },
  ],
  writing: [
    { name: "Sentence Starters", nameZh: "句式起步", desc: "引导孩子跳出重复的'I see...'模式，尝试使用不同的词汇开启句子。通过练习多种句式开头，孩子能学会如何构建完整且有节奏感的简单句。" },
    { name: "Punctuation Boundaries", nameZh: "标点边界", desc: "明确句号、问号和感叹号作为'思想边界'的作用，防止出现无休止的长难句。教会孩子根据语气选择正确的标点。" },
    { name: "Personal Narratives", nameZh: "简单记叙", desc: "鼓励孩子用文字记录生活中的小瞬间，学习按时间顺序组织简单的故事情节。我们重点培养孩子捕捉细节的能力。" },
  ],
};
const BAND_34 = {
  literacy: [
    { name: "Compare & Contrast", nameZh: "比较与对比", desc: "教会孩子识别事物或故事间的异同点，培养分类与分析思维。通过这种方式，孩子能更深入地理解文本细节。" },
    { name: "Visualization", nameZh: "视觉化想象", desc: "引导孩子将文字描述转化为脑海中的画面，增强对文学作品的感悟力。这种'脑内建模'的能力是提升深度阅读兴趣的关键。" },
    { name: "Synonyms & Antonyms", nameZh: "同义词与反义词", desc: "通过学习近义词和反义词，扩充词汇库并精准掌握表达的细微差别。这能让孩子的语言描述变得生动、丰富。" },
  ],
  oral: [
    { name: "Descriptive Storytelling", nameZh: "生动记叙", desc: "鼓励学生按照逻辑顺序描述一件趣事或讲述一个简单的故事。通过加入细节描写，学生能学会如何吸引听众的注意力。" },
    { name: "Conversational Turn-taking", nameZh: "对话往返技巧", desc: "训练学生在对话中不仅要表达自己，更要学会倾听并根据对方的内容给出合理回应。掌握交替发言的节奏能让沟通变得更加自然。" },
    { name: "Questioning Strategies", nameZh: "提问与求证", desc: "引导学生学会有目的地提出问题，以获取更多信息或澄清疑惑。这种主动探究的能力在课堂讨论中至关重要。" },
  ],
  writing: [
    { name: "Topic Sentences", nameZh: "段落核心", desc: "教授如何撰写强有力的主题句，以此统领全段的中心思想。学生将学会围绕一个核心点展开论述。" },
    { name: "Sensory Details", nameZh: "感官描写", desc: "引导学生在描写中加入视觉、听觉、触觉等感官细节，让文字'动'起来。通过使用精准的形容词和动词来丰富表达。" },
    { name: "Sentence Variety", nameZh: "句子多样性", desc: "练习将短句合并或拆分，尝试使用连词构建长短结合的错落感。避免单一重复的句式，提升写作档次。" },
  ],
};
const BAND_56 = {
  literacy: [
    { name: "Fact vs. Opinion", nameZh: "事实与观点", desc: "帮助孩子区分客观事实与主观感受，这是培养批判性思维的基石。在信息爆炸时代，这种能力能教会孩子审慎地分析所读到的内容。" },
    { name: "Summarizing", nameZh: "提炼摘要", desc: "训练孩子剔除冗余信息，精准捕捉文章的逻辑架构和核心论点。这不仅是一项重要的读写技能，更是高效学习的必备工具。" },
    { name: "Author's Purpose", nameZh: "作者意图", desc: "引导孩子思考作者的写作动机，是为了说服、告知还是娱乐。理解动机能帮助孩子更全面地把握文本语境和深层含义。" },
  ],
  oral: [
    { name: "Informative Presentations", nameZh: "信息类陈述", desc: "训练学生就特定主题进行短时间的口头报告，学习如何组织论点并辅以事实支撑。这是为中学阶段频繁的课堂演讲做准备。" },
    { name: "Collaborative Discussion", nameZh: "协作讨论", desc: "在小组活动中练习如何有礼貌地提出不同意见或补充他人观点。学生将学会使用转折词和连接词来维持讨论的深度。" },
    { name: "Paraphrasing Skills", nameZh: "换词重组", desc: "教授如何用自己的语言复述听到的复杂信息。这项技能能证明学生真正理解了内容，而非机械模仿。" },
  ],
  writing: [
    { name: "Transition Logic", nameZh: "逻辑过渡", desc: "系统学习使用过渡词（如 however, therefore），建立段落间的丝滑链接。学生将学会如何引导读者在不同观点间穿梭。" },
    { name: "Persuasive Techniques", nameZh: "说服技巧", desc: "介绍如何使用证据和理由来支持自己的立场，初步接触说服性写作。学生将学习如何识别受众并选择最具说服力的论点。" },
    { name: "Grammar Consistency", nameZh: "语法严谨性", desc: "重点解决时态混用和主谓一致性问题，确保长篇写作中的语法稳定性。我们引导学生养成'自我审查'的习惯。" },
  ],
};
const BAND_78 = {
  literacy: [
    { name: "Writing Style", nameZh: "写作风格", desc: "探讨不同作者如何通过选词、句式和语气来展现独特的'笔触'。通过分析他人的风格，学生能逐渐建立属于自己的写作个性。" },
    { name: "Drawing Inferences", nameZh: "推断与延伸", desc: "教会学生阅读'字里行间'的隐藏信息，根据已知线索推导逻辑结论。这种高阶阅读技能是解析复杂文本的核心。" },
    { name: "Identifying Theme", nameZh: "识别主题", desc: "引导学生超越具体情节，探讨文章背后的普遍真理或社会价值。理解主题能让学生将阅读内容与现实世界联系起来。" },
  ],
  oral: [
    { name: "Persuasive Speaking", nameZh: "说服性演讲", desc: "通过练习辩论和演讲，学习如何利用逻辑、情感和事实来影响听众的立场。学生将学会构建严密的论证结构。" },
    { name: "Register & Context", nameZh: "语境与语域切换", desc: "探讨在正式学术场合与非正式朋友聚会中，语言风格应如何灵活切换。学生将学会控制语气和选词的严谨度。" },
    { name: "Idiomatic Usage", nameZh: "地道表达与成语", desc: "引入高频的文化成语和地道词组，让学生的表达听起来更像母语者。这能消除'教科书式英语'带来的隔阂感。" },
  ],
  writing: [
    { name: "The Thesis Statement", nameZh: "论文论点", desc: "训练学生在文章开头提出一个清晰、可争辩且有力度的核心论点。这是中学论文写作的灵魂。" },
    { name: "Voice & Tone", nameZh: "写作语调与语境", desc: "探讨如何根据正式与非正式语境调整写作的'声音'，识别学术语气与创意语气的区别。" },
    { name: "Complex Structures", nameZh: "复杂句式", desc: "鼓励使用从句和非谓语动词，将深层次的因果或对比关系融入一个句子中。使表达更加精准且具逻辑张力。" },
  ],
};
const BAND_910 = {
  literacy: [
    { name: "Rhetorical Analysis", nameZh: "修辞分析", desc: "深入探讨作者如何运用修辞手段来增强说服力并引发读者共鸣。学生将学会解析语言背后的策略。" },
    { name: "Synthesis of Perspectives", nameZh: "观点综合", desc: "训练学生整合多篇文献的观点，并在不同声音之间寻找逻辑关联。这是撰写学术论文必备的跨文本综合分析能力。" },
    { name: "Nuance & Subtext", nameZh: "语境细微差别", desc: "引导学生识别讽刺、隐喻以及文化语境带来的语义变化。掌握这种敏锐度能让学生在应对高难度阅读任务时游刃有余。" },
  ],
  oral: [
    { name: "Socratic Seminar", nameZh: "苏格拉底式研讨", desc: "训练学生在复杂的学术研讨中进行即兴输出，能够根据多方观点实时调整自己的论据。" },
    { name: "Rhetorical Strategies", nameZh: "演讲修辞策略", desc: "引导学生在发言中有意识地运用排比、比喻和情感呼吁来增强感染力。" },
    { name: "Synthesizing Oral Evidence", nameZh: "多重观点综合", desc: "挑战学生在口头表达中同时引用并分析多个来源的信息，构建复杂的论证体系。" },
  ],
  writing: [
    { name: "Argumentative Logic", nameZh: "论证逻辑", desc: "深入学习如何构建严密的论证链条，包括反驳对立观点的技巧。学生将学会用逻辑而非情绪来支撑立场。" },
    { name: "Stylistic Devices", nameZh: "修辞手法应用", desc: "引导学生在写作中有意识地运用排比、隐喻、借代等修辞手段来增强文章的艺术感染力。" },
    { name: "Citations & Integrity", nameZh: "学术诚信与引用", desc: "教授正确的引用格式（如 MLA/APA），强调学术诚信的重要性。这是进入高中高年级必须掌握的准则。" },
  ],
};
const BAND_1112 = {
  literacy: [
    { name: "Literary Criticism", nameZh: "文学批评与理论", desc: "引导学生从历史、社会或心理学等不同理论维度来审视文学作品。这是迈入大学学术殿堂的敲门砖。" },
    { name: "Logical Fallacies", nameZh: "逻辑谬误", desc: "教会学生识别论证中的逻辑陷阱，培养严谨的理性思维和批判眼光。" },
    { name: "Abstract Synthesis", nameZh: "抽象综合", desc: "专注于长篇学术论文的逻辑架构，培养学生处理复杂数据和抽象理论的能力。" },
  ],
  oral: [
    { name: "Academic Defense", nameZh: "学术辩护", desc: "训练学生就自己的研究成果或观点进行严谨的辩护，应对质疑并清晰阐述逻辑。" },
    { name: "Professional Interviewing", nameZh: "专业面试", desc: "模拟大学录取或职场面试场景，练习如何精准展现个人优势并进行高效沟通。" },
    { name: "Nuance & Intonation", nameZh: "语调微调", desc: "专注于发音细节的打磨，包括重音位置、语调起伏以及微妙的文化含义传递。" },
  ],
  writing: [
    { name: "The Scholarly Voice", nameZh: "学术笔触", desc: "培养客观、严谨、具有权威感的学术写作风格，适应长篇论文的要求。" },
    { name: "Structural Fluidity", nameZh: "结构艺术", desc: "突破传统的'五段式'模版，根据论点的复杂程度灵活设计文章架构。" },
    { name: "Abstract Synthesis", nameZh: "抽象表达", desc: "挑战处理高度抽象的概念，并将其转化为逻辑清晰、证据详实的专业报告。" },
  ],
};
const GRADE_MODULES = {
  "Grade 1": BAND_12, "Grade 2": BAND_12, "Grade 3": BAND_34, "Grade 4": BAND_34,
  "Grade 5": BAND_56, "Grade 6": BAND_56, "Grade 7": BAND_78, "Grade 8": BAND_78,
  "Grade 9": BAND_910, "Grade 10": BAND_910, "Grade 11": BAND_1112, "Grade 12": BAND_1112,
};
const PILLAR_GRADE_KEY = { "Literacy": "literacy", "Oral Proficiency & Fluency": "oral", "Writing & Composition": "writing" };

const CURRICULUM = [
  {
    pillar: "Literacy", pillarZh: "阅读理解", color: B.brown, lightColor: B.brownLight,
    match: "我们通过系统化的教学培养孩子的\"认知自动化\"，旨在将大脑从繁重的辨词任务中解放，从而释放更多精力用于高阶逻辑分析。数据表明，保持高频互动的学生通常能在6个月内实现一至两个年级的阅读水平突破，成功跨越从\"学习阅读\"到\"通过阅读来学习\"的关键转折点",
    modules: [
      { name: "Phonics Sprint", nameZh: "拼读冲刺", desc: "针对性自然拼读训练，结合可解码文本，专门解决学习者最常遇到的发音难题。" },
      { name: "Reading Circles", nameZh: "阅读小组", desc: "小组引导阅读课，运用预测、提问、联系等阅读理解策略，深化文本理解。" },
      { name: "Word Wealth", nameZh: "词汇积累", desc: "通过阅读、游戏和词汇图谱，系统性地扩充学生的词汇量。" },
    ],
  },
  {
    pillar: "Oral Proficiency & Fluency", pillarZh: "口语&流利度", color: B.green, lightColor: B.greenLight,
    match: "我们坚信语言是鲜活的工具，而非枯燥的学科。每一堂课都经过精密设计，旨在最大化学生的\"有效口语输出时间\"，使学生从机械记忆转向真正的\"沟通胜任力\"。通过融入一对一朗读、辩论和叙事构建，我们成功架起了课堂理论与北美社交及学术环境所需的动态语言技能之间的桥梁。",
    modules: [
      { name: "Talk Time", nameZh: "口语时间", desc: "围绕学生感兴趣的真实生活场景设计的每周口语挑战活动。" },
      { name: "Pronunciation Lab", nameZh: "发音实验室", desc: "针对高频发音错误进行专项训练，结合音频示范和即时反馈。" },
      { name: "Listen Up", nameZh: "专注聆听", desc: "精选音视频任务，训练学生对不同口音和语速的听力理解能力。" },
    ],
  },
  {
    pillar: "Writing & Composition", pillarZh: "构思&写作", color: B.brownDark, lightColor: "#ede0d8",
    match: "DODO Learning是一个相信写作能力能够改变孩子未来的教育品牌。我们将写作视为学生独立思考的终极体现。我们的课程旨在引导学生从\"机械造句者\"蜕变为拥有独特且自信笔触的\"创作者\"。通过运用范文教学、图形组织工具以及专业的写作实验室模式，我们确保其书面作品能够体现出在英语教育体系中脱颖而出所需的结构化逻辑与创意表达。",
    modules: [
      { name: "Sentence Gym", nameZh: "句子训练营", desc: "针对语法、标点和句型多样性的日常句子练习，夯实写作基础。" },
      { name: "Write Like a Writer", nameZh: "像作家一样写作", desc: "以真实作家为灵感的写作项目，学生以不同体裁和风格完成创意写作。" },
      { name: "Edit & Elevate", nameZh: "修改与提升", desc: "同伴与评估师共同参与的审阅循环，教会学生自信地修改和完善自己的作品。" },
    ],
  },
];

const SESSION_OPTIONS = [
  { value: "", label: "— Select —" },
  { value: "Entrance Assessment", label: "Entrance Assessment · 入学评估" },
  { value: "First Phase", label: "First Phase · 第一阶段" },
  { value: "Second Phase", label: "Second Phase · 第二阶段" },
  { value: "Third Phase", label: "Third Phase · 第三阶段" },
];

const GRADE_LEXILE = [
  { grade: "Grade 1", lexile: "400+" }, { grade: "Grade 2", lexile: "600+" },
  { grade: "Grade 3", lexile: "800+" }, { grade: "Grade 4", lexile: "900+" },
  { grade: "Grade 5", lexile: "1000+" }, { grade: "Grade 6", lexile: "1050+" },
  { grade: "Grade 7", lexile: "1100+" }, { grade: "Grade 8", lexile: "1150+" },
  { grade: "Grade 9", lexile: "1200+" }, { grade: "Grade 10", lexile: "1250+" },
  { grade: "Grade 11", lexile: "1300+" }, { grade: "Grade 12", lexile: "1350+" },
];

// ─── PDF REPORT TEMPLATE (hidden, captured by html2canvas) ──────────────
const F = '"Noto Sans SC", "Avenir Next", "Avenir", "Helvetica Neue", sans-serif';
const PW = 794; // A4 at ~96dpi
const PAD = 32;

function ReportHeader({ info }) {
  return (
    <div style={{ background: B.cream, padding: `${PAD}px ${PAD}px 16px`, borderBottom: `3px solid ${B.green}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <img src={LOGO_B64} alt="DODO" style={{ height: 44, width: "auto" }} />
        <div style={{ borderLeft: `1.5px solid rgba(122,81,69,0.25)`, paddingLeft: 16 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", opacity: 0.65, fontFamily: F, fontWeight: 500 }}>DODO Learning · 都学学习</div>
          <div style={{ fontSize: 17, fontWeight: 700, fontFamily: F, marginTop: 2 }}>
            Student Baseline Report
            <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.72, marginLeft: 8 }}>学生评估报告</span>
          </div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right", fontSize: 11, fontFamily: F, color: B.muted }}>
          {info.phase && <div>{info.phase}</div>}
          <div>{info.date}</div>
        </div>
      </div>
    </div>
  );
}

function ReportPage1({ info, ratings, comments }) {
  const allSkills = PILLARS.flatMap(p => p.skills);
  const ratedCount = Object.keys(ratings).filter(k => ratings[k] != null).length;
  return (
    <div id="pdf-page1" style={{ width: PW, background: B.cream, fontFamily: F, color: B.ink }}>
      <ReportHeader info={info} />
      <div style={{ padding: `16px ${PAD}px ${PAD}px` }}>
        {/* Student Info */}
        <div style={{ background: B.white, borderRadius: 10, padding: 14, marginBottom: 14, border: `1px solid ${B.border}` }}>
          <div style={{ marginBottom: 8, paddingBottom: 6, borderBottom: `1px solid ${B.border}` }}>
            <span style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: B.brown, fontWeight: 700 }}>Student Information </span>
            <span style={{ fontSize: 11, color: B.muted }}>学生信息</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {[["Student Name 学生姓名", info.name], ["Age 年龄", info.age], ["Grade / Year 年级", info.grade],
              ["Evaluator 评估师", info.evaluator], ["Assessment Phase 评估阶段", info.phase], ["Date 评估日期", info.date]].map(([lbl, val]) => (
              <div key={lbl}>
                <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: B.muted, fontWeight: 700, marginBottom: 4 }}>{lbl}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: B.ink, minHeight: 18 }}>{val || "—"}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar Tables */}
        {PILLARS.map(pillar => (
          <div key={pillar.id} style={{ background: B.white, borderRadius: 8, marginBottom: 12, overflow: "hidden", border: `1px solid ${B.border}` }}>
            <div style={{ background: pillar.color, color: B.cream, padding: "7px 14px" }}>
              <div style={{ fontSize: 8, letterSpacing: 2, textTransform: "uppercase", opacity: 0.6, marginBottom: 1 }}>Pillar · 核心领域</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{pillar.label}</div>
              <div style={{ fontSize: 10, opacity: 0.8 }}>{pillar.labelZh}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "140px 130px 1fr", background: pillar.lightColor, borderBottom: `2px solid ${B.border}` }}>
              {[["Skill Area", "技能领域"], ["Rating", "评估等级"], ["What this means for your child", "这对您的孩子意味着什么"]].map(([en, zh]) => (
                <div key={en} style={{ padding: "5px 10px" }}>
                  <div style={{ fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: pillar.color, fontWeight: 700 }}>{en}</div>
                  <div style={{ fontSize: 9, color: B.muted, marginTop: 1 }}>{zh}</div>
                </div>
              ))}
            </div>
            {pillar.skills.map((skill, idx) => {
              const r = ratings[skill.id];
              const rc = r != null ? RATING_COLORS[r] : null;
              return (
                <div key={skill.id} style={{ display: "grid", gridTemplateColumns: "140px 130px 1fr", borderBottom: idx < pillar.skills.length - 1 ? `1px solid ${B.border}` : "none", alignItems: "start" }}>
                  <div style={{ padding: "7px 10px", borderRight: `1px solid ${B.border}` }}>
                    <div style={{ fontSize: 11, fontWeight: 600 }}>{skill.label}</div>
                    <div style={{ fontSize: 9, color: B.muted, marginTop: 1 }}>{skill.labelZh}</div>
                  </div>
                  <div style={{ padding: "7px 10px", borderRight: `1px solid ${B.border}` }}>
                    {r != null ? (
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", background: rc.bg, borderRadius: 12 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: rc.dot }} />
                        <span style={{ fontSize: 11, color: rc.text, fontWeight: 700 }}>{r} – {RATING_LABELS[r]}</span>
                      </div>
                    ) : <span style={{ fontSize: 11, color: B.border }}>—</span>}
                  </div>
                  <div style={{ padding: "7px 10px" }}>
                    <div style={{ fontSize: 10, lineHeight: 1.55, color: B.ink, whiteSpace: "pre-wrap" }}>{comments[skill.id] || ""}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <div style={{ background: B.brown, borderRadius: 8, padding: "8px 14px", color: B.cream, textAlign: "center" }}>
          <div style={{ fontSize: 11 }}>{ratedCount} of {allSkills.length} skills rated · 已评估 {ratedCount}/{allSkills.length} 项</div>
        </div>
      </div>
    </div>
  );
}

function ReportPage2({ info, ratings, proficientGrade, studentLexile, notes }) {
  const selectedGradeObj = GRADE_LEXILE.find(g => g.grade === proficientGrade);
  return (
    <div id="pdf-page2" style={{ width: PW, background: B.cream, fontFamily: F, color: B.ink }}>
      <ReportHeader info={info} />
      <div style={{ padding: `16px ${PAD}px ${PAD}px` }}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: B.muted, marginBottom: 6 }}>Consultation Overview · 咨询概述</div>
          <div style={{ fontSize: 19, fontWeight: 700, color: B.brown, fontFamily: F }}>
            「<span style={{ color: B.green }}>{info.name || "学生"}</span>」的个人化英语需求
          </div>
          <div style={{ marginTop: 4, color: B.muted, fontSize: 11, lineHeight: 1.5 }}>
            第一页的每一项评估结果，都直接对应DODO Learning的具体课程模块。以下将详细说明我们为您的孩子推荐的学习方向及长期的益处。
          </div>
        </div>

        {/* Lexile Info */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 14 }}>
          <div style={{ background: B.greenLight, border: `1.5px solid ${B.border}`, borderRadius: 10, padding: "8px 18px", textAlign: "center", minWidth: 140 }}>
            <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: B.green, marginBottom: 4, fontWeight: 700 }}>Proficient Lexile Level</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: B.green }}>{selectedGradeObj ? `Lexile ${selectedGradeObj.lexile}` : "—"}</div>
            {selectedGradeObj && <div style={{ fontSize: 11, color: B.green, fontWeight: 700, marginTop: 2 }}>{selectedGradeObj.grade}</div>}
          </div>
          <div style={{ background: B.brownLight, border: `1.5px solid ${B.border}`, borderRadius: 10, padding: "8px 18px", textAlign: "center", minWidth: 140 }}>
            <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: B.brown, marginBottom: 4, fontWeight: 700 }}>Student Lexile Level</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: B.brown }}>{studentLexile || "—"}</div>
            <div style={{ fontSize: 11, color: B.brown, fontWeight: 700, marginTop: 2 }}>Current level</div>
          </div>
        </div>

        {/* Summary Boxes */}
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: B.brown, fontWeight: 700, marginBottom: 8 }}>Summary · 各核心领域总结</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
          {PILLARS.map(pillar => {
            const scored = pillar.skills.filter(s => ratings[s.id] != null && ratings[s.id] > 0);
            const avg = scored.length > 0 ? scored.reduce((a, s) => a + ratings[s.id], 0) / scored.length : 0;
            const rounded = scored.length > 0 ? Math.round(avg) : null;
            const rc = rounded ? RATING_COLORS[rounded] : { bg: "#f0ece8", text: B.muted };
            return (
              <div key={pillar.id} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${B.border}` }}>
                <div style={{ background: B.green, color: B.cream, padding: "6px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{pillar.label}</div>
                  <div style={{ fontSize: 10, opacity: 0.72, marginTop: 1 }}>{pillar.labelZh}</div>
                </div>
                <div style={{ background: B.greenLight, padding: "5px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: B.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>平均等级</div>
                  {rounded ? (
                    <div style={{ display: "inline-block", padding: "3px 12px", background: rc.bg, color: rc.text, borderRadius: 16, fontSize: 12, fontWeight: 700 }}>
                      {rounded} – {RATING_LABELS[rounded]}
                    </div>
                  ) : <div style={{ color: B.border, fontSize: 12 }}>暂未评估</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Curriculum Sections */}
        {CURRICULUM.map(item => (
          <div key={item.pillar} style={{ background: B.white, borderRadius: 8, marginBottom: 10, overflow: "hidden", border: `1px solid ${B.border}` }}>
            <div style={{ background: item.color, color: B.cream, padding: "6px 14px" }}>
              <div style={{ fontSize: 8, letterSpacing: 2, textTransform: "uppercase", opacity: 0.6, marginBottom: 1 }}>Pillar · 核心领域</div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{item.pillar}</div>
              <div style={{ fontSize: 10, opacity: 0.72, marginTop: 1 }}>{item.pillarZh}</div>
            </div>
            <div style={{ padding: "8px 14px" }}>
              <p style={{ margin: "0 0 6px", lineHeight: 1.5, fontSize: 10, color: B.ink }}>{item.match}</p>
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: item.color, fontWeight: 700, marginBottom: 6 }}>
                Recommended Modules · 推荐课程模块
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                {(proficientGrade && GRADE_MODULES[proficientGrade]?.[PILLAR_GRADE_KEY[item.pillar]]?.length
                  ? GRADE_MODULES[proficientGrade][PILLAR_GRADE_KEY[item.pillar]]
                  : item.modules
                ).map(mod => (
                  <div key={mod.name} style={{ background: item.lightColor, border: `1px solid ${B.border}`, borderRadius: 6, padding: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: item.color }}>{mod.name}</div>
                    <div style={{ fontSize: 10, color: B.muted, marginBottom: 4, marginTop: 2 }}>{mod.nameZh}</div>
                    <div style={{ fontSize: 9, color: B.ink, lineHeight: 1.55 }}>{mod.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Evaluator Notes */}
        {notes && (
          <div style={{ background: B.white, borderRadius: 8, padding: 14, border: `1px solid ${B.border}` }}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: B.brown }}>Evaluator's Notes </span>
              <span style={{ fontSize: 12, color: B.muted }}>评估师备注</span>
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.7, color: B.ink, whiteSpace: "pre-wrap" }}>{notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────
export default function DodoEvalPDF() {
  const [info, setInfo] = useState({ name: "", age: "", grade: "", date: new Date().toISOString().split("T")[0], evaluator: "", phase: "" });
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [notes, setNotes] = useState("");
  const [proficientGrade, setProficientGrade] = useState("");
  const [studentLexile, setStudentLexile] = useState("");
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState("");

  // Load CJK font
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;800&display=swap";
    document.head.appendChild(link);
  }, []);

  const setRating = useCallback((skillId, val) => {
    if (val === "" || val === null) {
      setRatings(r => { const next = { ...r }; delete next[skillId]; return next; });
      setComments(c => { const next = { ...c }; delete next[skillId]; return next; });
      return;
    }
    const n = parseInt(val, 10);
    if (isNaN(n) || n < 0 || n > 5) return;
    setRatings(r => ({ ...r, [skillId]: n }));
    if (COMMENT_POOL[skillId]?.[n]) setComments(c => ({ ...c, [skillId]: COMMENT_POOL[skillId][n] }));
  }, []);

  // ─── PDF GENERATION ───────────────────────────────────────────────────
  const generatePDF = async () => {
    setGenerating(true);
    setStatus("Rendering report...");

    try {
      await new Promise(r => setTimeout(r, 500)); // let fonts settle

      const captureEl = async (id) => {
        const el = document.getElementById(id);
        if (!el) throw new Error(`Element #${id} not found`);
        return html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: B.cream,
          logging: false,
        });
      };

      setStatus("Capturing page 1...");
      const canvas1 = await captureEl("pdf-page1");
      setStatus("Capturing page 2...");
      const canvas2 = await captureEl("pdf-page2");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = 210;
      const pageH = 297;

      const addCanvasPages = (canvas, isFirst) => {
        const imgW = pageW;
        const imgH = (canvas.height * imgW) / canvas.width;
        const pxPerPage = (pageH / imgW) * canvas.width;
        const totalPages = Math.ceil(canvas.height / pxPerPage);

        for (let p = 0; p < totalPages; p++) {
          if (!(isFirst && p === 0)) pdf.addPage();
          const sliceY = p * pxPerPage;
          const sliceH = Math.min(pxPerPage, canvas.height - sliceY);
          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = sliceH;
          const ctx = sliceCanvas.getContext("2d");
          ctx.drawImage(canvas, 0, sliceY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
          const sliceImgH = (sliceH * imgW) / canvas.width;
          pdf.addImage(sliceCanvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, imgW, sliceImgH);
        }
      };

      setStatus("Building PDF...");
      addCanvasPages(canvas1, true);
      addCanvasPages(canvas2, false);

      const fileName = `DodoEval_${(info.name || "Student").replace(/\s+/g, "_")}_${info.date}.pdf`;
      pdf.save(fileName);
      setStatus(`✓ PDF saved: ${fileName}`);
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  // ─── FORM STYLES ──────────────────────────────────────────────────────
  const inp = { width: "100%", padding: "8px 10px", border: `1.5px solid ${B.border}`, borderRadius: 6, fontSize: 14, fontFamily: "inherit", background: B.white, color: B.ink, outline: "none", boxSizing: "border-box" };
  const lbl = { fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: B.muted, fontWeight: 700, marginBottom: 4 };

  return (
    <div style={{ fontFamily: '"Noto Sans SC", "Avenir Next", sans-serif', minHeight: "100vh", background: "#f0ece8" }}>
      {/* ════ FORM UI ════ */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px 80px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, paddingBottom: 16, borderBottom: `2px solid ${B.green}` }}>
          <img src={LOGO_B64} alt="DODO" style={{ height: 40 }} />
          <div>
            <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: B.muted }}>DODO Learning</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: B.brown }}>Student Report Generator</div>
          </div>
        </div>

        {/* Student Info */}
        <div style={{ background: B.white, borderRadius: 10, padding: 18, marginBottom: 16, border: `1px solid ${B.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: B.brown, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Student Information 学生信息</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {[["name", "Student Name 学生姓名", "text"], ["age", "Age 年龄", "number"], ["grade", "Grade / Year 年级", "text"],
              ["evaluator", "Evaluator 评估师", "text"]].map(([k, label, type]) => (
              <label key={k} style={{ display: "flex", flexDirection: "column" }}>
                <span style={lbl}>{label}</span>
                <input type={type} value={info[k]} onChange={e => setInfo(i => ({ ...i, [k]: e.target.value }))} style={inp} />
              </label>
            ))}
            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={lbl}>Assessment Phase 评估阶段</span>
              <select value={info.phase} onChange={e => setInfo(i => ({ ...i, phase: e.target.value }))} style={{ ...inp, cursor: "pointer" }}>
                {SESSION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={lbl}>Date 评估日期</span>
              <input type="date" value={info.date} onChange={e => setInfo(i => ({ ...i, date: e.target.value }))} style={inp} />
            </label>
          </div>
        </div>

        {/* Skill Ratings */}
        {PILLARS.map(pillar => (
          <div key={pillar.id} style={{ background: B.white, borderRadius: 10, marginBottom: 16, overflow: "hidden", border: `1px solid ${B.border}` }}>
            <div style={{ background: pillar.color, color: B.cream, padding: "10px 18px" }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{pillar.label}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>{pillar.labelZh}</div>
            </div>
            <div style={{ padding: 14 }}>
              {pillar.skills.map(skill => {
                const r = ratings[skill.id];
                const rc = r != null ? RATING_COLORS[r] : null;
                return (
                  <div key={skill.id} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${B.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{skill.label}</div>
                        <div style={{ fontSize: 11, color: B.muted }}>{skill.labelZh}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <select
                          value={r != null ? r : ""}
                          onChange={e => setRating(skill.id, e.target.value)}
                          style={{
                            ...inp, width: 150, textAlign: "center", fontWeight: 700, cursor: "pointer",
                            background: rc ? rc.bg : B.white, color: rc ? rc.text : B.muted,
                            border: `2px solid ${rc ? rc.dot : B.border}`,
                          }}
                        >
                          <option value="">— Rate 0-5 —</option>
                          {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} – {RATING_LABELS[n]}</option>)}
                        </select>
                      </div>
                    </div>
                    <textarea
                      value={comments[skill.id] || ""}
                      onChange={e => setComments(c => ({ ...c, [skill.id]: e.target.value }))}
                      placeholder="Select a rating to auto-fill, or type a custom comment…"
                      rows={3}
                      style={{ ...inp, resize: "vertical", lineHeight: 1.6, fontSize: 13, background: B.cream }}
                    />
                    {r != null && COMMENT_POOL[skill.id] && (
                      <select
                        defaultValue=""
                        onChange={e => { if (e.target.value) { setComments(c => ({ ...c, [skill.id]: e.target.value })); e.target.selectedIndex = 0; } }}
                        style={{ ...inp, marginTop: 6, fontSize: 12, color: B.muted, cursor: "pointer" }}
                      >
                        <option value="">↻ Swap comment from pool…</option>
                        {Object.entries(COMMENT_POOL[skill.id]).map(([lvl, text]) => (
                          <option key={lvl} value={text}>Lv{lvl} – {RATING_LABELS[lvl]}: {text.slice(0, 50)}…</option>
                        ))}
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Consultation Settings */}
        <div style={{ background: B.white, borderRadius: 10, padding: 18, marginBottom: 16, border: `1px solid ${B.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: B.brown, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Consultation Settings 咨询设置</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={lbl}>Proficient Lexile Level</span>
              <select value={proficientGrade} onChange={e => setProficientGrade(e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                <option value="">— Select Grade / Lexile —</option>
                {GRADE_LEXILE.map(g => <option key={g.grade} value={g.grade}>{g.grade} → Lexile {g.lexile}</option>)}
              </select>
            </label>
            <label style={{ display: "flex", flexDirection: "column" }}>
              <span style={lbl}>Student Lexile Level</span>
              <input type="text" placeholder="e.g. 720" value={studentLexile} onChange={e => setStudentLexile(e.target.value)} style={inp} />
            </label>
          </div>
        </div>

        {/* Evaluator Notes */}
        <div style={{ background: B.white, borderRadius: 10, padding: 18, marginBottom: 20, border: `1px solid ${B.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: B.brown, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Evaluator's Notes 评估师备注</div>
          <textarea
            value={notes} onChange={e => setNotes(e.target.value)} rows={5}
            placeholder="Add personalized notes, next steps, or parent communication points…"
            style={{ ...inp, resize: "vertical", lineHeight: 1.7, fontSize: 14, background: B.cream }}
          />
        </div>

        {/* Generate Button */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={generatePDF}
            disabled={generating}
            style={{
              padding: "14px 36px", background: generating ? B.muted : B.brown, color: B.cream,
              border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, fontFamily: "inherit",
              cursor: generating ? "wait" : "pointer", boxShadow: "0 3px 12px rgba(0,0,0,0.2)",
              transition: "all 0.2s",
            }}
          >
            {generating ? "⏳ Generating…" : "📄 Generate PDF Report"}
          </button>
          {status && <span style={{ fontSize: 13, color: status.startsWith("✓") ? B.green : status.startsWith("Error") ? "#c0504d" : B.muted }}>{status}</span>}
        </div>
      </div>

      {/* ════ HIDDEN REPORT TEMPLATES (captured by html2canvas) ════ */}
      <div style={{ position: "fixed", left: -10000, top: 0, zIndex: -1, opacity: 1, pointerEvents: "none" }}>
        <ReportPage1 info={info} ratings={ratings} comments={comments} />
        <ReportPage2 info={info} ratings={ratings} proficientGrade={proficientGrade} studentLexile={studentLexile} notes={notes} />
      </div>
    </div>
  );
}
