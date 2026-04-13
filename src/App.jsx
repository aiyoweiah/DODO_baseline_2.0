// VERSION: 3.1.1
// DODO Learning — Student Baseline Report PDF Generator
// Generates standardized 4-page PDF via jsPDF + html2canvas
//
// DEPENDENCIES: npm install jspdf html2canvas

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
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "Your child is in the earliest stage of cracking English's sound code — matching letters to the sounds they make. This work takes real cognitive effort, and the Navigator is building that foundation one pattern at a time. 孩子正处于破解英语拼音规律的起步阶段——建立字母与发音之间的关联。Navigator正帮助孩子一步一个脚印地夯实基础。",
    2: "Your child recognizes familiar sound patterns but slows on irregular words. The Navigator is building reading stamina and training the eye to move through text with increasing confidence. 孩子能识别常见发音规律，但在不规则词上仍有减速。Navigator正在训练阅读耐力，帮助孩子以越来越稳定的节奏推进文本。",
    3: "Decoding is becoming faster and more reliable. Your child is moving from reading letter-by-letter to reading in meaningful chunks — a shift that frees attention for what the text actually means. 解码速度稳步提升。孩子正从逐字阅读转向按意义组块处理——这一转变将释放更多认知资源用于理解文本含义。",
    4: "Your child catches and self-corrects most decoding errors without prompting. The Navigator is now channeling this growing automaticity into analytical work — noticing how word choice shapes meaning. 孩子能自主捕捉并纠正大多数解码错误。Navigator正将这种日益自动化的解码能力引入分析性工作——关注选词如何影响文本含义。",
    5: "Decoding is fully automatic. Your child's cognitive bandwidth is entirely free for what DODO Learning's program is built for: reading with precision, reasoning with evidence, and writing with intention. 自然拼读已完全自动化。孩子的认知资源已全部释放，可以专注于都学书院课程的核心目标：精准阅读、有据推理、有意为文。",
  },
  comprehension: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "Your child currently reads for facts — finding what is on the page. The Navigator's next work is training them to ask the first analytical question: not just what happened, but why. 孩子目前以获取事实为主。Navigator下一阶段的工作是训练孩子提出第一个分析性问题：不仅是发生了什么，而是为什么。",
    2: "Your child can follow a plot and identify key details. The Navigator is now building inference skills — the ability to read between the lines and use evidence from the text to support a claim. 孩子能跟上情节并识别关键细节。Navigator正引导孩子建立推断能力——学会从字里行间获取信息，并用文本证据支撑自己的观点。",
    3: "Your child is moving from reading to understand, toward reading to think. They can summarize independently and are beginning to analyze character motivation and the choices an author makes. 孩子正从「读懂」向「深思」迈进。他们能独立概括内容，并开始分析角色动机和作者的写作选择。",
    4: "Your child reads analytically. They identify themes, recognize complexity in character or argument, and can defend a position with textual evidence. The Navigator is raising the level of thinking the text demands. 孩子具备分析性阅读能力。他们能识别主题、辨析文本深层复杂性，并用文本证据为自己的观点进行辩护。Navigator正持续提升文本所要求的思维深度。",
    5: "Your child reads like a critic. They examine how a text is constructed, question the author's choices, and synthesize meaning across multiple layers. This is the analytical standard DODO Learning's program is built to reach. 孩子以批评者的眼光审视文本——分析其构建方式、质疑作者的选择，并在多个层面综合把握含义。这正是都学书院课程致力于达到的分析标准。",
  },
  vocabulary: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "Your child is building the core vocabulary needed to access more complex texts. The Navigator focuses on words that unlock meaning — the kind that appear across subjects and deepen as the child's reading level rises. 孩子正在积累理解复杂文本所需的核心词汇。Navigator专注于能够解锁意义的词汇——这类词汇跨学科出现，并随阅读水平的提升不断深化。",
    2: "Your child uses context to work out unfamiliar words — a strong instinct the Navigator is now making systematic. The next step is building Latin and Greek root awareness, so that academic vocabulary becomes predictable rather than random. 孩子能利用上下文推断生词含义——Navigator正将这一直觉转化为系统方法。下一步是建立拉丁和希腊词根意识，让学术词汇变得可预测而非随机。",
    3: "Your child has a solid working vocabulary and is building the academic language that carries weight in essays, analysis, and formal argument. The Navigator connects new words to root structures so they compound over time. 孩子具备扎实的功能性词汇，正在积累在论文、分析和正式论证中具有分量的学术语言。Navigator将新词与词根结构关联，使词汇量随时间复利增长。",
    4: "Word choice is becoming deliberate. Your child selects language with precision — choosing the exact word, not the approximate one. The Navigator is developing this into a writing strength: vocabulary as a tool for argument, not decoration. 选词日趋有意识。孩子能精准选择语言——用准确的词，而非近似的词。Navigator正将这一能力转化为写作优势：词汇是论证的工具，而非装饰。",
    5: "Your child possesses lexical depth. They understand connotation, register, and the way precise word choice shapes an argument. This is the vocabulary standard that distinguishes strong academic writing from merely competent writing. 孩子拥有词汇深度。他们理解词语的内涵、语域以及精准选词对论证的塑造作用。这正是区分优秀学术写作与合格写作的词汇标准。",
  },
  readingFluency: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "Your child reads word-by-word, which is the natural starting point. The Navigator works at the phrase level — training the eye and voice to move through text in meaningful groups rather than individual words. 孩子目前逐词阅读，这是自然的起点。Navigator在短语层面开展工作——训练眼睛和声音以有意义的组块而非单个词语推进文本。",
    2: "Reading momentum is building. Your child reads familiar text smoothly but slows on longer sentences. The Navigator coaches phrasing and breath support to build the stamina that carries through complex passages. 阅读势头正在形成。孩子能流畅阅读熟悉的文本，但遇到较长句子时仍有减速。Navigator正在指导断句和气息支撑，以建立贯穿复杂段落的阅读耐力。",
    3: "Your child reads at a steady pace with natural phrasing. The Navigator is now working on prosody — the musicality of language — because the way a sentence sounds shapes how its meaning lands. 孩子以稳定的节奏流畅朗读。Navigator现在专注于培养韵律感——语言的音乐性——因为句子的音响效果直接影响其意义的传达。",
    4: "Reading is smooth and expressive. Your child adjusts tone, emphasis, and pace in response to punctuation, character, and mood — a reading skill that transfers directly into powerful writing. 阅读流畅且富有表现力。孩子能根据标点、角色和情绪调整语气、重音和节奏——这一阅读能力直接迁移为有力的写作能力。",
    5: "Your child reads like a storyteller — modulating voice to serve meaning. This level of fluency is both a literacy skill and an analytical one: it proves the child has understood not just what is written, but how it works. 孩子像讲故事者一样朗读——用声音服务于意义。这种流利度既是读写能力，也是分析能力：它证明孩子不仅理解了写了什么，还理解了它是如何运作的。",
  },
  speaking: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "Your child is absorbing the language and building an internal model before producing it — which is the right sequence. The Navigator creates structured, low-pressure speaking opportunities so the first words come without hesitation. 孩子正在吸收语言并在内部建立模型，然后才开口输出——这是正确的顺序。Navigator设计了有结构、低压力的口语练习机会，让孩子在无负担的环境中开口。",
    2: "Your child is sharing ideas more consistently. The Navigator moves past single-word responses by asking follow-up questions that invite elaboration — building the habit of saying not just what, but why. 孩子分享想法的频率在提升。Navigator通过追问引导孩子详细阐述，从单词回答转向完整表达——养成不只说是什么，还说为什么的习惯。",
    3: "Your child engages willingly in discussion and keeps the conversation going, even when they need to work around unfamiliar vocabulary. The Navigator is now raising the analytical standard — defending a position, not just describing a preference. 孩子积极参与讨论，即使遇到不熟悉的词汇也能维持对话。Navigator正在提升分析标准——从描述偏好转向捍卫立场。",
    4: "Speaking feels natural and purposeful. Your child presents a position, supports it with reasoning, and responds to pushback — the speaking standard DODO Learning's program explicitly trains for. 表达自然且有目的。孩子能提出立场、用推理支撑，并回应挑战——这正是都学书院课程明确训练的口语标准。",
    5: "Your child commands a room. They shape their argument in real time, use evidence and emphasis with precision, and adjust for their audience. This is the speaking profile that leads in academic and professional environments. 孩子具备控场能力。他们能实时构建论点，精准使用证据和重音，并根据听众灵活调整。这是在学术和职业环境中引领他人的口语能力。",
  },
  pronunciation: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "The goal at this stage is clarity, not accent. The Navigator targets the specific sounds that don't exist in the child's first language — training the physical habits of English pronunciation before they have a chance to solidify incorrectly. 这一阶段的目标是清晰表达，而非口音。Navigator专注于孩子母语中不存在的特定发音——在发音习惯固化之前建立正确的英语发音肌肉记忆。",
    2: "Common words are clear. The Navigator is now targeting specific consonant clusters and vowel sounds with focused, repetitive practice — the kind of precision coaching that makes the difference between being understood and being effortlessly understood. 常用词发音清晰。Navigator正针对特定辅音组合和元音进行专项重复练习——这种精准指导决定了「能被理解」与「毫不费力地被理解」之间的差距。",
    3: "Your child is intelligible to most listeners. The Navigator is now working on sentence rhythm and stress patterns — because natural English is less about individual sounds and more about the rise and fall of a phrase. 大多数听众能清晰理解孩子的表达。Navigator正在训练句子节奏和重音规律——因为地道英语的关键不在于单个发音，而在于短语的起伏节奏。",
    4: "Your child speaks clearly with minimal errors. Pronunciation is no longer a barrier — it has become a tool. The Navigator is using this foundation to develop precise rhetorical emphasis: which words to stress to make an argument land. 孩子表达清晰，错误极少。发音不再是障碍，而是工具。Navigator正利用这一基础培养精准的修辞重音：强调哪些词才能让论点有力落地。",
    5: "Pronunciation is effortless and natural. Your child has mastered the linking, reduction, and intonation patterns that mark fluent English speech — and uses them to serve meaning, not just sound. 发音毫不费力，自然流畅。孩子掌握了流利英语口语的连读、弱读和语调规律——并将其用于服务意义，而非单纯追求音效。",
  },
  conversational: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "Your child can respond to direct questions with familiar prompts. The Navigator builds from here — using structured dialogue to develop the habit of asking follow-up questions, not just answering them. 孩子能回应熟悉的直接提问。Navigator从此出发——通过结构化对话培养孩子主动追问的习惯，而不仅仅是被动回答。",
    2: "Your child holds short exchanges on familiar topics. The Navigator is building conversational strategies — how to maintain a thread, redirect a topic, and bridge the moments when vocabulary runs short. 孩子能围绕熟悉话题进行简短交流。Navigator正培养对话策略——如何维持话题线索、转换话题，以及在词汇不足时如何搭桥过渡。",
    3: "Your child converses naturally on known topics and is learning to manage unexpected turns. The Navigator is now introducing the analytical dimension of conversation: how to ask a precise question, not just make a statement. 孩子能围绕熟悉话题自然对话，并正在学习应对突发转向。Navigator现在引入了对话的分析维度：如何提出精准问题，而不仅仅是陈述观点。",
    4: "Conversation is natural and engaged. Your child listens actively, responds to nuance, and builds on what others say — a conversational skill that translates directly into academic discussion and collaborative reasoning. 对话自然投入。孩子能主动倾听、回应细节，并在他人发言的基础上延伸——这一能力直接迁移为学术讨论和协作推理能力。",
    5: "Your child is a fluent, spontaneous conversationalist — adaptive, precise, and able to navigate complexity without losing the thread. The Navigator uses conversation as a rehearsal space for the analytical arguments that enter written work. 孩子是流利、自发的对话者——灵活、精准，能在不失主线的情况下驾驭复杂话题。Navigator将对话作为预演空间，为进入书面写作的分析性论证做准备。",
  },
  listening: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "Your child is building the listening map of English — learning to parse its rhythms, stress patterns, and phrasing before full meaning arrives. Daily exposure to spoken English at the right level accelerates this process significantly. 孩子正在建立英语的听觉地图——在完全理解意义之前，先学会解析其节奏、重音规律和短语结构。每天接触适当水平的英语口语将显著加速这一过程。",
    2: "Your child understands clear speech on familiar topics. Comprehension drops with complex or fast-paced input. The Navigator builds listening stamina by increasing the density and pace of spoken input gradually and with purpose. 孩子能理解熟悉话题上的清晰表达。面对复杂或快速的语言输入时理解力有所下降。Navigator通过有计划地逐步提升输入密度和语速来建立听力耐力。",
    3: "Your child follows most classroom-level English well. The Navigator is now targeting nuance — tone, implication, and the gap between what is said and what is meant. These are the listening skills that academic discussion demands. 孩子能跟上大部分课堂英语。Navigator现在专注于细微差别——语气、言下之意，以及字面表达与真实意图之间的落差。这些正是学术讨论所要求的听力能力。",
    4: "Your child is a strong listener — they track complex argument, notice shifts in tone, and can restate what they heard with precision. The Navigator uses this as a foundation for analytical listening: identifying the claim, the evidence, and the reasoning in spoken argument. 孩子是出色的听者——能追踪复杂论证、捕捉语气转变，并能精准复述所听内容。Navigator以此为基础培养分析性聆听：在口头论证中识别论点、证据和推理逻辑。",
    5: "Your child's listening comprehension is outstanding. They parse nuance, register, and rhetorical intent across a wide range of accents and delivery styles. This is the listening capacity that supports full participation in high-level academic environments. 孩子的听力理解能力卓越。他们能解析多种口音和表达风格中的细微差别、语域和修辞意图。这种听力能力支撑着在高水平学术环境中的全面参与。",
  },
  sentences: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "Your child is mastering the fundamental unit of English writing: a complete sentence with a subject, a verb, and a clear boundary. The Navigator builds from this foundation — every strong essay begins with a writer who knows how a sentence works. 孩子正在掌握英语写作的基本单位：一个有主语、谓语和清晰边界的完整句子。Navigator从这一基础出发——每一篇有力的文章都始于一位理解句子运作方式的写作者。",
    2: "Your child writes correct basic sentences and is beginning to combine ideas using connecting words. The Navigator is building sentence variety — the tool that controls a reader's pace and attention. 孩子能写出正确的基础句，并开始用连接词组合想法。Navigator正在培养句式多样性——控制读者节奏和注意力的工具。",
    3: "Your child uses varied sentence lengths to create rhythm and pace. The Navigator is now introducing complex structures — subordinate clauses, apposition, and deliberate fragments — as tools for analytical precision. 孩子能利用句式长短变化创造节奏。Navigator正引入复杂结构——从句、同位语和刻意使用的短句——作为分析精准度的工具。",
    4: "Sentence construction is purposeful and controlled. Your child shapes sentences to serve argument — knowing when a short sentence lands harder, and when a longer construction earns its complexity. 句式构建有目的、有节制。孩子能让句子服务于论证——知道何时短句更有力，何时复杂结构物有所值。",
    5: "Sentence craft is a deliberate tool for impact. Your child uses structure to create suspense, emphasize claims, and control how a reader moves through an argument. This is the sentence-level skill that distinguishes strong academic writing from mechanical prose. 句式是刻意运用的表达武器。孩子能用结构制造悬念、强调论点，并控制读者推进论证的节奏。这是区分优秀学术写作与机械散文的句子层面能力。",
  },
  grammar: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "Your child is learning the boundaries of English sentences — where they begin, where they end, and which word form belongs in which role. The Navigator treats grammar as architecture: the structure that makes meaning load-bearing. 孩子正在学习英语句子的边界——从哪里开始、在哪里结束，以及哪种词形属于哪种功能。Navigator将语法视为建筑结构：使意义具有承重能力的框架。",
    2: "Basic conventions are stable, but tense consistency and punctuation still need attention. The Navigator is building the habit of self-editing — reading aloud to catch what the eye skips — which is the first move of every skilled writer. 基础规范已稳定，但时态一致性和标点仍需关注。Navigator正培养自我编辑的习惯——大声朗读以捕捉眼睛跳过的错误——这是每一位熟练写作者的第一步。",
    3: "Your child has a solid command of most conventions. The Navigator is now working on the finer points — complex tenses, comma usage, and the distinction between rules and intentional stylistic choices — because a writer needs to understand both. 孩子对大多数规范掌握扎实。Navigator正在打磨细节——复杂时态、逗号用法，以及规则与刻意风格选择之间的区别——因为写作者需要同时理解两者。",
    4: "Writing is grammatically accurate and the child is beginning to catch their own errors. The Navigator is now introducing MCT's four-level sentence analysis — examining every sentence as an argument for why each word holds the position it does. 孩子写作语法准确，并开始自主捕捉错误。Navigator正在引入MCT四级句子分析框架——将每个句子视为论证，审视每个词出现在该位置的原因。",
    5: "Grammar is intuitive and strategic. Your child uses punctuation and syntax not just to meet convention, but to control pace, emphasis, and clarity — grammar as the architecture of argument. This is the standard MCT's classical language arts framework is built to reach. 语法既直觉化又具策略性。孩子使用标点和句法不仅为了符合规范，更是为了控制节奏、强调和清晰度——语法成为论证的建筑结构。这正是MCT古典语言艺术框架致力于达到的标准。",
  },
  organization: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "Your child's writing lists events rather than building an argument. The Navigator's foundational work here is teaching that a paragraph is not a container for ideas, but a structure for moving a reader from one position to another. 孩子的写作目前以罗列事件为主，而非构建论证。Navigator在此进行的是基础工作：教导段落不是盛放想法的容器，而是引导读者从一个立场移向另一个立场的结构。",
    2: "Your child can write a beginning, middle, and end. The Navigator is now making the logic of those sections explicit — a strong opening claim, evidence and analysis in the middle, and a conclusion that earns its place rather than restating the introduction. 孩子能写出开头、中间和结尾。Navigator正在使这些部分的逻辑变得明确——有力的开篇论点、中间的证据与分析，以及通过论证赢得位置而非重复开头的结论。",
    3: "Organization is clear and purposeful. The Navigator is now working on transitions — not the mechanical 'first, next, finally' of early writing, but the logical signposting that guides a reader through a complex argument without losing the thread. 组织结构清晰有目的。Navigator正在打磨过渡——不是早期写作中机械的过渡词，而是引导读者穿越复杂论证的逻辑路标。",
    4: "Your child structures writing with analytical intent — every section serves the argument. The Navigator is introducing the 6+1 Trait rubric's Organization criterion: not as a checklist, but as a framework for thinking about how structure serves meaning. 孩子以分析意图构建写作——每个部分都服务于论证。Navigator正在引入6+1特质评估体系的「组织」标准：不是作为清单，而是作为思考结构如何服务意义的框架。",
    5: "Your child designs the architecture of their writing. They understand that how a text is organized is itself an argument — and make structural choices that earn a reader's trust before the content begins. 孩子能设计写作的整体架构。他们理解文本的组织方式本身就是一种论证——并做出在内容展开之前就赢得读者信任的结构性选择。",
  },
  creative: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "Your child has ideas they want to express — the language is the bridge being built. The Navigator's role here is to meet the child's intention with the vocabulary and structure they need, building confidence without correcting the imagination. 孩子有想要表达的想法——语言是正在搭建的桥梁。Navigator在此的角色是用孩子所需的词汇和结构满足其表达意图，在不纠正想象力的前提下建立信心。",
    2: "Your child is beginning to include personal observations and specific details. The Navigator is training the 'show, don't tell' instinct — the difference between 'it was scary' and describing exactly what made it so. 孩子开始加入个人观察和具体细节。Navigator正在培养「展示而非陈述」的直觉——「it was scary」与描述是什么让人感到恐惧之间的区别。",
    3: "Your child is moving from describing to constructing. They use sensory detail purposefully and are developing what the 6+1 Trait rubric calls Voice — the quality that makes writing feel distinctly like this child, not like a template. 孩子正从描述转向构建。他们有目的地运用感官细节，并正在发展6+1特质评估体系所说的「声音」——使写作感觉明显属于这个孩子而非模板的品质。",
    4: "Your child writes with a strong, recognizable voice and genuine creative investment. Ideas are original, imagery is specific, and word choice reveals a writer who is thinking, not just filling space. 孩子以鲜明可辨的声音和真实的创意投入写作。想法原创，意象具体，选词揭示出一位在思考而非仅仅填充空间的写作者。",
    5: "Your child's creative writing demonstrates what the 6+1 Trait framework calls advanced Voice — language that surprises, takes risks, and shows a writer who has internalized that every word choice is also a thinking choice. 孩子的创意写作展示了6+1特质框架所称的高级「声音」——令人惊喜、敢于冒险的语言，展现出一位已将每次选词都视为思维选择的写作者。",
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
      { id: "organization", label: "Writing Organization", labelZh: "写作组织" },
      { id: "creative", label: "Creative Expression", labelZh: "创意表达" },
    ],
  },
];

// ─── GRADE MODULES ──────────────────────────────────────────────────────
const BAND_12 = {
  literacy: [
    { name: "Pattern & Decode", nameZh: "规律与解码", desc: "Navigator引导孩子系统识别英语中最高频的拼音规律，将大脑从逐字辨认的认知负担中解放出来。每一个掌握的规律都是阅读速度和理解深度的双重提升。" },
    { name: "The Story Loop", nameZh: "故事循环", desc: "通过有引导的朗读和结构化提问，训练孩子在故事层面建立基本的分析能力：发生了什么，谁做了什么，接下来会怎样。The Loop从这里开始。" },
    { name: "Word Builders", nameZh: "词汇建构", desc: "通过图文结合和高频词反复接触，系统扩充孩子理解和使用简单英文文本所需的核心词汇库。" },
  ],
  oral: [
    { name: "First Conversations", nameZh: "初次对话", desc: "Navigator设计低压力、高结构的口语任务，帮助孩子建立开口的信心。重点是表达意图而非追求完美，每一句话都是下一句话的基础。" },
    { name: "Sound & Rhythm", nameZh: "发音与节奏", desc: "通过押韵、节拍和朗诵练习，训练孩子对英语独特发音位置和句子节奏的感知，预防早期发音偏差在习惯形成后难以纠正。" },
    { name: "Speaking in Scenes", nameZh: "场景口语", desc: "围绕孩子真实生活场景设计对话任务，从问候、描述到简单叙事，训练孩子在情境中自然运用语言。" },
  ],
  writing: [
    { name: "Sentence Architecture", nameZh: "句子架构", desc: "Navigator从完整句子的基本单位出发，训练孩子理解主语、谓语和句子边界。每一个写对的句子都是更复杂写作的地基。" },
    { name: "Punctuation as Boundary", nameZh: "标点即边界", desc: "教会孩子句号、问号和感叹号不只是符号，而是思维的边界标记。学会使用标点，是学会组织想法的第一步。" },
    { name: "My Story", nameZh: "我的故事", desc: "鼓励孩子用文字记录生活中的真实时刻，按事件顺序组织简单叙事。Navigator的重点是帮助孩子捕捉具体细节而非泛泛描述。" },
  ],
};
const BAND_34 = {
  literacy: [
    { name: "Compare & Analyze", nameZh: "比较与分析", desc: "训练孩子识别人物、事件或观点之间的异同，培养分类与对比思维。这是从描述性阅读走向分析性阅读的关键转折。" },
    { name: "Reading with Evidence", nameZh: "有据阅读", desc: "Navigator引导孩子学习用「文本中的哪里告诉了你这一点」来支撑自己的想法，建立以证据驱动理解的阅读习惯。" },
    { name: "Word Architecture", nameZh: "词汇建筑", desc: "通过词根意识和语境推断，系统扩充词汇量。孩子开始理解词语不只是要记忆的标签，而是有内部逻辑的建筑。" },
  ],
  oral: [
    { name: "Narrative Voice", nameZh: "叙事声音", desc: "训练孩子按照清晰的逻辑顺序讲述一件事，加入具体细节和感官描写，让听众真正跟上故事的节奏。" },
    { name: "Turn & Build", nameZh: "轮流与延伸", desc: "在对话中不只是表达自己，更要倾听并在对方发言的基础上延伸。Navigator训练孩子将对话变成思维的共同构建。" },
    { name: "Ask Better Questions", nameZh: "提出更好的问题", desc: "引导孩子从回答问题转向主动提问。Navigator的第一步永远是一个更好的问题——孩子也在学习这个习惯。" },
  ],
  writing: [
    { name: "The Topic Sentence", nameZh: "主题句", desc: "教会孩子一个段落需要一个统领全局的核心句，其余内容都围绕它展开。这是从列举式写作走向论证性写作的第一步。" },
    { name: "Show, Don't Tell", nameZh: "展示而非陈述", desc: "训练「it was exciting」和描述具体发生了什么之间的区别。Navigator通过感官细节训练，让孩子的描写从标签变成画面。" },
    { name: "Sentence Variety", nameZh: "句式多样性", desc: "通过合并、拆分和连接不同长度的句子，训练孩子有意识地控制写作的节奏。避免单一句式是写作进阶的关键信号。" },
  ],
};
const BAND_56 = {
  literacy: [
    { name: "Fact vs. Claim", nameZh: "事实与论点", desc: "帮助孩子区分客观事实与主观论断——这是批判性思维的基石。在复杂文本中识别这一区别，是高阶阅读和写作的双重基础。" },
    { name: "The Main Argument", nameZh: "核心论点", desc: "训练孩子从较长的文章中提炼核心论点和支撑结构，而不只是复述情节。这是The Loop中Think阶段的核心训练。" },
    { name: "Author's Choices", nameZh: "作者的选择", desc: "引导孩子思考作者为什么这样写，而不只是写了什么。理解写作动机让孩子开始将阅读与自己的写作实践相互印证。" },
  ],
  oral: [
    { name: "Present & Defend", nameZh: "陈述与辩护", desc: "训练孩子就特定话题组织论点并清晰呈现，同时能够回应追问。Navigator在这里扮演的是挑战者角色，而非评判者。" },
    { name: "Collaborative Argument", nameZh: "协作论证", desc: "在小组讨论中学习如何有礼貌地提出不同观点，并用逻辑而非情绪来推进对话。学术讨论所需的核心口语能力在这里系统训练。" },
    { name: "Restate & Extend", nameZh: "复述与延伸", desc: "教会孩子用自己的语言准确复述复杂信息，并在此基础上提出延伸问题。这是证明真正理解而非机械模仿的标志。" },
  ],
  writing: [
    { name: "Logical Transitions", nameZh: "逻辑过渡", desc: "系统训练使用「however, therefore, in contrast」等过渡词，建立段落间的逻辑链接。Navigator引导孩子用结构引导读者，而非让读者自行摸索。" },
    { name: "Evidence & Argument", nameZh: "证据与论证", desc: "引入论证性写作的核心结构：论点—证据—分析。孩子开始学习如何不只是陈述立场，而是通过具体证据为立场建立支撑。" },
    { name: "Grammar as Craft", nameZh: "语法即技艺", desc: "重点解决时态混用和主谓一致问题，同时引导孩子理解：语法不是规则的束缚，而是精准表达的工具。" },
  ],
};
const BAND_78 = {
  literacy: [
    { name: "Author's Craft", nameZh: "作者的技艺", desc: "分析作者如何通过具体的选词、句式和结构选择来塑造文本的效果。阅读不再只是理解内容，而是理解内容是如何被构建的。" },
    { name: "Inference & Evidence", nameZh: "推断与证据", desc: "训练孩子从文本中提取隐性信息，根据已知线索推导逻辑结论，并用原文证据支撑推断。这是MCT文学三段论体系的核心阅读实践。" },
    { name: "Theme & Complexity", nameZh: "主题与复杂性", desc: "引导孩子超越具体情节，探讨文章传递的更深层价值和内在张力。优秀的文本往往包含两个都合理的答案——学会同时持有这种张力。" },
  ],
  oral: [
    { name: "Persuasive Speaking", nameZh: "说服性表达", desc: "通过结构化辩论练习，训练孩子构建有逻辑链条的口头论证，用事实、推理和反驳建立可信的立场。" },
    { name: "Register & Context", nameZh: "语域与语境", desc: "探讨在学术报告、朋友对话和正式演讲中，语言风格应如何灵活切换。Navigator帮助孩子建立对语境的意识，而不只是流利度。" },
    { name: "Spoken Analysis", nameZh: "口头分析", desc: "要求孩子就文本中的具体选择给出有据可查的分析性判断。Navigator的追问训练孩子不只是说出结论，而是说出推导路径。" },
  ],
  writing: [
    { name: "The Thesis", nameZh: "论文论点", desc: "训练孩子在文章开头提出一个清晰、可争辩且有分量的核心论点。论点是整篇文章的承重墙——这里的工作决定了整体结构的稳定性。" },
    { name: "Voice & Tone", nameZh: "写作语调", desc: "探讨如何根据正式与非正式语境调整写作的声音，识别学术语气与创意语气的核心区别及相互借鉴的可能。" },
    { name: "Complex Structures", nameZh: "复杂句式", desc: "训练使用从句和非谓语动词，将深层次的因果、对比或条件关系融入单一句子中。精准不等于简单——有时复杂结构才是最清晰的表达。" },
  ],
};
const BAND_910 = {
  literacy: [
    { name: "Rhetorical Analysis", nameZh: "修辞分析", desc: "深入解析作者如何运用修辞手段增强说服力并引发读者共鸣。孩子将学会识别语言背后的策略——不只是读出意思，而是读出意图。" },
    { name: "Synthesis of Sources", nameZh: "多源综合", desc: "训练孩子整合来自多篇文献的观点，在不同声音之间寻找逻辑关联，构建跨文本的分析性理解。这是学术写作的核心前提。" },
    { name: "Nuance & Subtext", nameZh: "细微差别与潜台词", desc: "引导孩子识别讽刺、隐喻以及文化语境带来的语义变化。能够读懂字面之下的层次，是高难度文本和真实世界沟通的共同要求。" },
  ],
  oral: [
    { name: "Socratic Seminar", nameZh: "苏格拉底式研讨", desc: "训练孩子在复杂学术研讨中进行即兴输出，根据多方观点实时调整自己的论据。Navigator的追问结构在课堂讨论中的延伸形式。" },
    { name: "Rhetorical Strategies", nameZh: "演讲修辞", desc: "引导孩子在发言中有意识地运用排比、比喻和情感呼吁，让论证不只是逻辑严密，还具有感染力。" },
    { name: "Multi-Source Argument", nameZh: "多重证据论证", desc: "挑战孩子在口头表达中同时引用并分析多个来源的信息，构建复杂的、有纵深的论证体系。" },
  ],
  writing: [
    { name: "Argumentative Logic", nameZh: "论证逻辑", desc: "深入训练如何构建严密的论证链条，包括识别和反驳对立观点的技巧。用逻辑而非情绪支撑立场——这是大学写作的核心要求。" },
    { name: "Stylistic Devices", nameZh: "修辞手法", desc: "引导孩子在写作中有意识地运用排比、隐喻、借代等手段，让文章在逻辑严密的同时具备文学感染力。" },
    { name: "Academic Integrity", nameZh: "学术诚信与引用", desc: "教授正确的引用格式（如MLA/APA），将学术诚信建立为思维习惯而非外部规则。进入高年级学术写作的必备基础。" },
  ],
};
const BAND_1112 = {
  literacy: [
    { name: "Literary Criticism", nameZh: "文学批评", desc: "引导孩子从历史、社会或心理学等不同理论维度审视文学作品。这是MCT课程最高级别的阅读实践——文本成为进入更大思想世界的入口。" },
    { name: "Logical Fallacies", nameZh: "逻辑谬误", desc: "教会孩子识别论证中的逻辑陷阱，培养严谨的理性思维。能够发现他人论证中的漏洞，也意味着能够建立不留漏洞的自身论证。" },
    { name: "Abstract Synthesis", nameZh: "抽象综合", desc: "专注于长篇学术写作的逻辑架构能力，处理复杂数据和抽象理论，并将其组织为清晰、有力的书面论证。" },
  ],
  oral: [
    { name: "Academic Defense", nameZh: "学术辩护", desc: "训练孩子就自己的研究或观点进行严谨辩护，应对质疑并清晰阐述推导路径。大学面试和学术研讨的核心口语能力。" },
    { name: "Professional Communication", nameZh: "专业沟通", desc: "模拟大学录取面试和职业场景，练习如何精准展现思维深度并进行高效的正式沟通。" },
    { name: "Precision & Intonation", nameZh: "精准度与语调", desc: "专注于发音和语调的精细打磨，包括重音位置、语调起伏以及如何用声音控制论证的节奏和重量。" },
  ],
  writing: [
    { name: "The Scholarly Voice", nameZh: "学术写作声音", desc: "培养客观、严谨、具有权威感的学术写作风格。孩子将学习如何在保持自己声音的前提下，写出具有学术可信度的长篇论证。" },
    { name: "Structural Fluidity", nameZh: "结构灵活性", desc: "突破固定的五段式模版，根据论点的复杂程度和读者的需求，灵活设计文章的整体架构。结构服务内容，而非内容适应结构。" },
    { name: "Synthesized Argument", nameZh: "综合性论证", desc: "处理高度抽象的概念并将其转化为逻辑清晰、证据详实的专业报告。DODO Learning写作课程的最高级别表达目标。" },
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
    match: "每一位孩子进入DODO Learning课程时，都先通过Lexile分级评估确定当前阅读水平。Navigator的工作从这个数字开始——不是赶进度，而是通过系统训练让孩子的认知带宽真正释放出来。以MCT经典文学文本为核心素材，结合Harvard Project Zero的思维训练框架，确保孩子不只是读懂了文字，而是学会了如何对文本提问、推断，并用证据支撑自己的解读。坚持参与课程的学生通常能在16周内实现一至两个Lexile等级的突破。",
    modules: [
      { name: "The Decoding Foundation", nameZh: "解码基础", desc: "Navigator使用可解码文本系统训练对英语拼音规律的掌握，将大脑从辨词任务中解放，为高阶阅读理解释放认知资源。" },
      { name: "The Reading Loop", nameZh: "阅读循环", desc: "以MCT经典文学文本为核心，Navigator引导孩子经历完整的Read→Think循环：朗读文本，随即通过结构化提问训练推断、分析和深度理解。" },
      { name: "Word Architecture", nameZh: "词汇建筑", desc: "以拉丁和希腊词根为锚点系统扩充学术词汇量。双语学习者天然具备的形旁表意思维在这里得到迁移和强化。" },
    ],
  },
  {
    pillar: "Oral Proficiency & Fluency", pillarZh: "口语&流利度", color: B.green, lightColor: B.greenLight,
    match: "语言是思维的外壳。DODO Learning的口语课程不以流利度为终点——流利度是结果。Navigator设计的每一个口语任务都指向一个更高的目标：让孩子学会不只是「说出来」，而是「论证出来」。通过朗读、叙事构建和结构化讨论，孩子逐步建立在北美学术和社交环境中真正需要的表达能力——能够提出立场、支撑理由，并在对话中回应挑战。Navigator的第一个动作永远是一个更好的问题，而非一个评价。",
    modules: [
      { name: "Speaking Lab", nameZh: "口语实验室", desc: "围绕真实情境设计的口语任务，训练孩子在不同语境下呈现立场并支撑观点。流利度在这里是工具，而非目标。" },
      { name: "Pronunciation Lab", nameZh: "发音实验室", desc: "针对高频发音难点进行专项精准训练，结合即时反馈，建立自然地道的英语语音节律。" },
      { name: "Analytical Listening", nameZh: "分析性聆听", desc: "通过精选音视频材料训练孩子不只是「听懂」，而是识别论点结构、语气转变和说话者的修辞意图。" },
    ],
  },
  {
    pillar: "Writing & Composition", pillarZh: "构思&写作", color: B.brownDark, lightColor: "#ede0d8",
    match: "DODO Learning将写作视为思维的最终检验。一个孩子写了什么，揭示了他们对文本思考了多深。我们的写作课程以6+1特质评估体系为评量标准，以MCT的语法与语言艺术框架为教学基础，通过Navigator的逐步引导，帮助孩子从能写正确的句子，发展为能用精准语言构建有力论证的写作者。写作能力在都学书院的课程体系中，是认知发展的可见证明。",
    modules: [
      { name: "The Grammar Foundation", nameZh: "语法基础", desc: "以MCT语法框架为核心，通过四级句子分析让孩子理解每个词在句子中存在的原因——将语法从规则记忆转化为写作工具。" },
      { name: "Write to Think", nameZh: "以写促思", desc: "所有写作任务从文本阅读和思维训练中生长出来，以6+1特质评估体系为标准，训练孩子用精准语言构建论证性表达。" },
      { name: "The Edit Loop", nameZh: "编辑循环", desc: "Navigator与学生共同进行结构化审阅，教会孩子将自我编辑视为思维过程的延伸——不只是修正错误，而是强化论点。" },
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


// ═══════════════════════════════════════════════════════════════════════
// PDF TEMPLATE COMPONENTS (hidden off-screen, captured by html2canvas)
// ═══════════════════════════════════════════════════════════════════════

const F = '"Noto Sans SC", "Avenir Next", "Avenir", "Helvetica Neue", sans-serif';
// A4 at 96dpi = 794 x 1123px. We render at this size, html2canvas captures at 2x.
const PW = 794;
const PH = 1123;
const PAD = 30;
const SKILL_ROW_H = 82; // Fixed row height for skill rows
const GAP_H = 73; // Spacer height — matches header visual height

function PDFHeader({ info }) {
  return (
    <div style={{ background: B.cream, padding: `18px ${PAD}px 12px`, borderBottom: `3px solid ${B.green}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <img src={LOGO_B64} alt="DODO" style={{ height: 40, width: "auto" }} />
        <div style={{ borderLeft: `1.5px solid rgba(122,81,69,0.25)`, paddingLeft: 14 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", opacity: 0.65, fontFamily: F, fontWeight: 500 }}>DODO Learning · 都学书院</div>
          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: F, marginTop: 1 }}>
            Student Baseline Report
            <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.72, marginLeft: 8 }}>学生评估报告</span>
          </div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right", fontSize: 10, fontFamily: F, color: B.muted }}>
          {info.phase && <div>{info.phase}</div>}
          <div>{info.date}</div>
        </div>
      </div>
    </div>
  );
}

function PillarTable({ pillar, ratings, comments }) {
  return (
    <div style={{ background: B.white, borderRadius: 8, overflow: "hidden", border: `1px solid ${B.border}` }}>
      <div style={{ background: pillar.color, color: B.cream, padding: "6px 14px" }}>
        <div style={{ fontSize: 8, letterSpacing: 2, textTransform: "uppercase", opacity: 0.6, marginBottom: 1 }}>Pillar · 核心领域</div>
        <div style={{ fontSize: 13, fontWeight: 700 }}>{pillar.label}</div>
        <div style={{ fontSize: 10, opacity: 0.8 }}>{pillar.labelZh}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "140px 140px 1fr", background: pillar.lightColor, borderBottom: `2px solid ${B.border}` }}>
        {[["Skill Area", "技能领域"], ["Assessment Rating", "评估等级"], ["What this means for your child", "这对您的孩子意味着什么"]].map(([en, zh]) => (
          <div key={en} style={{ padding: "4px 10px" }}>
            <div style={{ fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: pillar.color, fontWeight: 700 }}>{en}</div>
            <div style={{ fontSize: 8, color: B.muted, marginTop: 1 }}>{zh}</div>
          </div>
        ))}
      </div>
      {pillar.skills.map((skill, idx) => {
        const r = ratings[skill.id];
        const rc = (r !== undefined && r !== null) ? RATING_COLORS[r] : null;
        return (
          <div key={skill.id} style={{
            display: "grid", gridTemplateColumns: "140px 140px 1fr",
            borderBottom: idx < pillar.skills.length - 1 ? `1px solid ${B.border}` : "none",
            alignItems: "stretch", minHeight: SKILL_ROW_H, height: SKILL_ROW_H,
          }}>
            <div style={{ padding: "6px 10px", borderRight: `1px solid ${B.border}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 600 }}>{skill.label}</div>
              <div style={{ fontSize: 9, color: B.muted, marginTop: 1 }}>{skill.labelZh}</div>
            </div>
            <div style={{ padding: "6px 10px", borderRight: `1px solid ${B.border}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {(r !== undefined && r !== null) ? (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", background: rc.bg, borderRadius: 12, alignSelf: "flex-start" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: rc.dot, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: rc.text, fontWeight: 700, whiteSpace: "nowrap" }}>{r} – {RATING_LABELS[r]}</span>
                </div>
              ) : <span style={{ fontSize: 11, color: B.border }}>—</span>}
            </div>
            <div style={{ padding: "6px 10px", display: "flex", alignItems: "center", overflow: "hidden" }}>
              <div style={{ fontSize: 9.5, lineHeight: 1.5, color: B.ink }}>{comments[skill.id] || ""}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CurriculumSection({ item, proficientGrade }) {
  return (
    <div style={{ background: B.white, borderRadius: 8, overflow: "hidden", border: `1px solid ${B.border}` }}>
      <div style={{ background: item.color, color: B.cream, padding: "6px 14px" }}>
        <div style={{ fontSize: 8, letterSpacing: 2, textTransform: "uppercase", opacity: 0.6, marginBottom: 1 }}>Pillar · 核心领域</div>
        <div style={{ fontSize: 12, fontWeight: 700 }}>{item.pillar}</div>
        <div style={{ fontSize: 10, opacity: 0.72, marginTop: 1 }}>{item.pillarZh}</div>
      </div>
      <div style={{ padding: "8px 14px" }}>
        <p style={{ margin: "0 0 6px", lineHeight: 1.5, fontSize: 10, color: B.ink, fontFamily: F }}>{item.match}</p>
        <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: item.color, fontWeight: 700, marginBottom: 6, fontFamily: F }}>
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
  );
}

// ═══════════════════════════════════════════════════════════════════════
// 4 PDF PAGE TEMPLATES
// ═══════════════════════════════════════════════════════════════════════

// PAGE 1: Header + Student Info + Literacy
function PDFPage1({ info, ratings, comments }) {
  const allSkills = PILLARS.flatMap(p => p.skills);
  const ratedCount = Object.keys(ratings).filter(k => ratings[k] !== undefined && ratings[k] !== null).length;
  return (
    <div id="pdf-p1" style={{ width: PW, height: PH, background: B.cream, fontFamily: F, color: B.ink, boxSizing: "border-box", overflow: "hidden" }}>
      <PDFHeader info={info} />
      <div style={{ padding: `14px ${PAD}px ${PAD}px`, display: "flex", flexDirection: "column", height: PH - 85 }}>
        {/* Student Info — takes up available space with flex-grow */}
        <div style={{ background: B.white, borderRadius: 8, padding: "16px 16px 20px", marginBottom: 14, border: `1px solid ${B.border}`, flexShrink: 0 }}>
          <div style={{ marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${B.border}` }}>
            <span style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: B.brown, fontWeight: 700 }}>Student Information </span>
            <span style={{ fontSize: 11, color: B.muted }}>学生信息</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, rowGap: 16 }}>
            {[["Student Name 学生姓名", info.name], ["Age 年龄", info.age], ["Grade / Year 年级", info.grade],
              ["Evaluator 评估师", info.evaluator], ["Assessment Phase 评估阶段", info.phase], ["Date 评估日期", info.date]].map(([lbl, val]) => (
              <div key={lbl}>
                <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: B.muted, fontWeight: 700, marginBottom: 5 }}>{lbl}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: B.ink, minHeight: 20, borderBottom: `1.5px solid ${B.border}`, paddingBottom: 4 }}>{val || "—"}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Gap — same height as header */}
        <div style={{ height: GAP_H, flexShrink: 0 }} />

        {/* Literacy Table */}
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <PillarTable pillar={PILLARS[0]} ratings={ratings} comments={comments} />
          <div style={{ background: B.brown, borderRadius: 6, padding: "6px 14px", color: B.cream, textAlign: "center", marginTop: 10 }}>
            <div style={{ fontSize: 10 }}>{ratedCount} of {allSkills.length} skills rated · 已评估 {ratedCount}/{allSkills.length} 项</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// PAGE 2: Header + Oral + Writing
function PDFPage2({ info, ratings, comments }) {
  return (
    <div id="pdf-p2" style={{ width: PW, height: PH, background: B.cream, fontFamily: F, color: B.ink, boxSizing: "border-box", overflow: "hidden" }}>
      <PDFHeader info={info} />
      <div style={{ padding: `14px ${PAD}px ${PAD}px`, display: "flex", flexDirection: "column", gap: 14 }}>
        <PillarTable pillar={PILLARS[1]} ratings={ratings} comments={comments} />
        <PillarTable pillar={PILLARS[2]} ratings={ratings} comments={comments} />
      </div>
    </div>
  );
}

// PAGE 3: Header + Consultation Overview + Summary + Literacy Curriculum
function PDFPage3({ info, ratings, proficientGrade, studentLexile }) {
  const selectedGradeObj = GRADE_LEXILE.find(g => g.grade === proficientGrade);
  return (
    <div id="pdf-p3" style={{ width: PW, height: PH, background: B.cream, fontFamily: F, color: B.ink, boxSizing: "border-box", overflow: "hidden" }}>
      <PDFHeader info={info} />
      <div style={{ padding: `14px ${PAD}px ${PAD}px`, display: "flex", flexDirection: "column" }}>
        {/* Consultation Title */}
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: B.muted, marginBottom: 5 }}>Consultation Overview · 咨询概述</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: B.brown, fontFamily: F }}>
            「<span style={{ color: B.green }}>{info.name || "学生"}</span>」的个人化英语需求
          </div>
          <div style={{ marginTop: 4, color: B.muted, fontSize: 10, lineHeight: 1.5 }}>
            第一页的每一项评估结果，都直接对应DODO Learning的具体课程模块。以下将详细说明我们为您的孩子推荐的学习方向及长期的益处。
          </div>
        </div>

        {/* Lexile Boxes — taller to fill space */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 14 }}>
          <div style={{ background: B.greenLight, border: `1.5px solid ${B.border}`, borderRadius: 10, padding: "14px 22px", textAlign: "center", minWidth: 160 }}>
            <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: B.green, marginBottom: 6, fontWeight: 700 }}>Proficient Lexile Level</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: B.green }}>{selectedGradeObj ? `Lexile ${selectedGradeObj.lexile}` : "—"}</div>
            {selectedGradeObj && <div style={{ fontSize: 12, color: B.green, fontWeight: 700, marginTop: 4 }}>{selectedGradeObj.grade}</div>}
          </div>
          <div style={{ background: B.brownLight, border: `1.5px solid ${B.border}`, borderRadius: 10, padding: "14px 22px", textAlign: "center", minWidth: 160 }}>
            <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: B.brown, marginBottom: 6, fontWeight: 700 }}>Student Lexile Level</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: B.brown }}>{studentLexile || "—"}</div>
            <div style={{ fontSize: 12, color: B.brown, fontWeight: 700, marginTop: 4 }}>Current level</div>
          </div>
        </div>

        {/* Gap — after consultation overview */}
        <div style={{ height: GAP_H }} />

        {/* Summary */}
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: B.brown, fontWeight: 700, marginBottom: 8 }}>Summary · 各核心领域总结</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
          {PILLARS.map(pillar => {
            const scored = pillar.skills.filter(s => ratings[s.id] !== undefined && ratings[s.id] !== null && ratings[s.id] > 0);
            const avg = scored.length > 0 ? scored.reduce((a, s) => a + ratings[s.id], 0) / scored.length : 0;
            const rounded = scored.length > 0 ? Math.round(avg) : null;
            const rc = rounded ? RATING_COLORS[rounded] : null;
            return (
              <div key={pillar.id} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${B.border}` }}>
                <div style={{ background: B.green, color: B.cream, padding: "6px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{pillar.label}</div>
                  <div style={{ fontSize: 10, opacity: 0.72, marginTop: 1 }}>{pillar.labelZh}</div>
                </div>
                <div style={{ background: B.greenLight, padding: "8px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: B.muted, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>平均等级</div>
                  {rounded ? (
                    <div style={{ display: "inline-block", padding: "4px 14px", background: rc.bg, color: rc.text, borderRadius: 16, fontSize: 12, fontWeight: 700 }}>
                      {rounded} – {RATING_LABELS[rounded]}
                    </div>
                  ) : <div style={{ color: B.border, fontSize: 12 }}>暂未评估</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Gap — after summary */}
        <div style={{ height: GAP_H }} />

        {/* Literacy Curriculum */}
        <CurriculumSection item={CURRICULUM[0]} proficientGrade={proficientGrade} />
      </div>
    </div>
  );
}

// PAGE 4: Header + Oral Curriculum + Writing Curriculum + Notes
function PDFPage4({ info, proficientGrade, notes }) {
  return (
    <div id="pdf-p4" style={{ width: PW, height: PH, background: B.cream, fontFamily: F, color: B.ink, boxSizing: "border-box", overflow: "hidden" }}>
      <PDFHeader info={info} />
      <div style={{ padding: `14px ${PAD}px ${PAD}px`, display: "flex", flexDirection: "column", gap: 0 }}>
        <CurriculumSection item={CURRICULUM[1]} proficientGrade={proficientGrade} />
        {/* Gap — after Oral Proficiency & Fluency */}
        <div style={{ height: GAP_H }} />
        <CurriculumSection item={CURRICULUM[2]} proficientGrade={proficientGrade} />
        {/* Gap — after Writing & Composition */}
        <div style={{ height: GAP_H }} />

        {/* Evaluator Notes */}
        {notes && (
          <div style={{ background: B.white, borderRadius: 8, padding: 14, border: `1px solid ${B.border}` }}>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: B.brown }}>Evaluator's Notes </span>
              <span style={{ fontSize: 11, color: B.muted }}>评估师备注</span>
            </div>
            <div style={{ fontSize: 11, lineHeight: 1.7, color: B.ink, whiteSpace: "pre-wrap" }}>{notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT — INPUT FORM + PDF GENERATION
// ═══════════════════════════════════════════════════════════════════════

export default function DodoEvalPDF() {
  const [info, setInfo] = useState({ name: "", age: "", grade: "", date: new Date().toISOString().split("T")[0], evaluator: "", phase: "" });
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [notes, setNotes] = useState("");
  const [proficientGrade, setProficientGrade] = useState("");
  const [studentLexile, setStudentLexile] = useState("");
  const [generating, setGenerating] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;800&display=swap";
    document.head.appendChild(link);
    document.fonts.ready.then(() => setFontsReady(true));
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

  // ─── PDF GENERATION ─────────────────────────────────────────────────
  const generatePDF = async () => {
    setGenerating(true);
    setStatus("Rendering report…");
    try {
      setStatus("Waiting for fonts…");
      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 100)); // brief settle after fonts

      const capture = async (id) => {
        const el = document.getElementById(id);
        if (!el) throw new Error(`#${id} not found`);
        return html2canvas(el, { scale: 2, useCORS: true, backgroundColor: B.cream, logging: false });
      };

      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = 210, pageH = 297;

      const pages = ["pdf-p1", "pdf-p2", "pdf-p3", "pdf-p4"];
      for (let i = 0; i < pages.length; i++) {
        setStatus(`Capturing page ${i + 1} of 4…`);
        const canvas = await capture(pages[i]);
        if (i > 0) pdf.addPage();
        const imgW = pageW;
        const imgH = (canvas.height * imgW) / canvas.width;
        pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, imgW, Math.min(imgH, pageH));
      }

      const fileName = `DodoEval_${(info.name || "Student").replace(/\s+/g, "_")}_${info.date}.pdf`;
      pdf.save(fileName);
      setStatus(`✓ Saved: ${fileName}`);
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  // ─── FORM STYLES ────────────────────────────────────────────────────
  const inp = { width: "100%", padding: "8px 10px", border: `1.5px solid ${B.border}`, borderRadius: 6, fontSize: 14, fontFamily: "inherit", background: B.white, color: B.ink, outline: "none", boxSizing: "border-box" };
  const lbl = { fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: B.muted, fontWeight: 700, marginBottom: 4, display: "block" };

  return (
    <div style={{ fontFamily: '"Noto Sans SC", "Avenir Next", sans-serif', minHeight: "100vh", background: "#f0ece8" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px 80px" }}>

        {/* Form Header */}
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

        {/* Skill Ratings — ALL LEFT ALIGNED */}
        {PILLARS.map(pillar => (
          <div key={pillar.id} style={{ background: B.white, borderRadius: 10, marginBottom: 16, overflow: "hidden", border: `1px solid ${B.border}` }}>
            <div style={{ background: pillar.color, color: B.cream, padding: "10px 18px" }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{pillar.label}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>{pillar.labelZh}</div>
            </div>
            <div style={{ padding: 14 }}>
              {pillar.skills.map((skill, idx) => {
                const r = ratings[skill.id];
                const rc = (r !== undefined && r !== null) ? RATING_COLORS[r] : null;
                return (
                  <div key={skill.id} style={{ marginBottom: idx < pillar.skills.length - 1 ? 14 : 0, paddingBottom: idx < pillar.skills.length - 1 ? 14 : 0, borderBottom: idx < pillar.skills.length - 1 ? `1px solid ${B.border}` : "none" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{skill.label}</div>
                        <div style={{ fontSize: 11, color: B.muted }}>{skill.labelZh}</div>
                      </div>
                      <select
                        value={r !== undefined && r !== null ? r : ""}
                        onChange={e => setRating(skill.id, e.target.value)}
                        style={{
                          ...inp, width: 180, fontWeight: 700, cursor: "pointer", textAlign: "left",
                          background: rc ? rc.bg : B.white, color: rc ? rc.text : B.muted,
                          border: `2px solid ${rc ? rc.dot : B.border}`,
                        }}
                      >
                        <option value="">— Rate 0-5 —</option>
                        {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} – {RATING_LABELS[n]}</option>)}
                      </select>
                    </div>
                    <textarea
                      value={comments[skill.id] || ""}
                      onChange={e => setComments(c => ({ ...c, [skill.id]: e.target.value }))}
                      placeholder="Select a rating to auto-fill, or type a custom comment…"
                      rows={3}
                      style={{ ...inp, resize: "vertical", lineHeight: 1.6, fontSize: 13, background: B.cream, textAlign: "left" }}
                    />
                    {(r !== undefined && r !== null) && COMMENT_POOL[skill.id] && (
                      <select
                        defaultValue=""
                        onChange={e => { if (e.target.value) { setComments(c => ({ ...c, [skill.id]: e.target.value })); e.target.selectedIndex = 0; } }}
                        style={{ ...inp, marginTop: 6, fontSize: 12, color: B.muted, cursor: "pointer", textAlign: "left" }}
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
            disabled={generating || !fontsReady}
            style={{
              padding: "14px 36px", background: generating ? B.muted : B.brown, color: B.cream,
              border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, fontFamily: "inherit",
              cursor: generating ? "wait" : "pointer", boxShadow: "0 3px 12px rgba(0,0,0,0.2)",
              opacity: fontsReady ? 1 : 0.5, transition: "all 0.2s",
            }}
          >
            {!fontsReady ? "Loading fonts…" : generating ? "⏳ Generating…" : "📄 Generate PDF Report"}
          </button>
          {status && <span style={{ fontSize: 13, color: status.startsWith("✓") ? B.green : status.startsWith("Error") ? "#c0504d" : B.muted }}>{status}</span>}
        </div>
      </div>

      {/* ═══ HIDDEN 4-PAGE PDF TEMPLATES ═══ */}
      <div style={{ position: "fixed", left: -9999, top: 0, zIndex: -1, opacity: 1, pointerEvents: "none" }}>
        <PDFPage1 info={info} ratings={ratings} comments={comments} />
        <PDFPage2 info={info} ratings={ratings} comments={comments} />
        <PDFPage3 info={info} ratings={ratings} proficientGrade={proficientGrade} studentLexile={studentLexile} />
        <PDFPage4 info={info} proficientGrade={proficientGrade} notes={notes} />
      </div>
    </div>
  );
}