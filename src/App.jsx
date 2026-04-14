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
// DODO Learning brand palette — Version 2.1
const B = {
  cream:      "#F5F5FF",   // Whisper — page & PDF background
  white:      "#FFFFFF",   // Card surfaces
  ink:        "#212830",   // Deep Void — body text on light
  voidBlack:  "#0E0E12",   // Void Black — deepest emphasis
  muted:      "#5E6879",   // Mid-tone secondary text (derived from Deep Void)
  border:     "#DCDCF5",   // Soft lavender-tinted border
  platinum:   "#F0F0F0",   // Platinum — light text on dark surfaces
  gilt:       "#F5C842",   // Gilt — CTA color ONLY

  // Pillar accent colors
  lavender:      "#B7B5FE", // Lavender Signal — Literacy pillar / primary accent
  lavenderLight: "#EEEEFF", // Lavender light surface
  softGreen:     "#7EC8A0", // Soft Green — Oral pillar
  softGreenLight:"#E6F6EE", // Soft Green light surface
  midnight:      "#2E3848", // Midnight — Writing pillar
  midnightLight: "#E8EAF0", // Midnight light surface

  // Legacy aliases used throughout (mapped to brand palette)
  green:      "#7EC8A0",   // Soft Green (oral)
  greenDark:  "#5AAA82",   // Soft Green dark
  greenLight: "#E6F6EE",   // Soft Green light
  brown:      "#B7B5FE",   // → Lavender Signal (literacy)
  brownDark:  "#2E3848",   // → Midnight (writing)
  brownLight: "#EEEEFF",   // → Lavender light
};

// ─── COMMENT POOLS ──────────────────────────────────────────────────────
const COMMENT_POOL = {
  comprehension: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "Your child is encountering literary text as story — following events, tracking characters, receiving what is on the surface of the page. The Navigator's work begins with the first analytical question: not what happened, but why the author chose to tell it this way. 孩子目前将文学文本当作故事来理解——跟踪情节、认识角色、获取页面上的表层信息。Navigator眼下教学的重心是引导孩子提出第一个分析性问题：不只是发生了什么，而是作者为什么选择这样来讲述。",
    2: "Your child follows the plot and identifies key details with growing confidence. The Navigator is building the habit of cumulative thinking — each reading session builds on the last, so comprehension deepens across a text rather than resetting. The first analytical questions are arriving: why did the character act this way? What was the author trying to make us feel? 孩子能自信地跟随情节并点出关键细节。Navigator正在培养累积性思考的习惯——每次阅读课在上一次的基础上延伸，让理解在持续阅读的过程中加深，而非每次归零重来。第一批分析性问题开始出现：角色为什么这样行动？作者想让读者产生什么样的感受？",
    3: "Your child reads analytically — identifying themes, tracking author choices at the structural level, and defending a position with textual evidence. The Navigator is now working toward reading as the investigation of craft: how does the author use grammar, vocabulary, and structure as instruments? The classical texts — Alice in Wonderland, Treasure Island, and the works that follow — are the living proof of everything learned in grammar and vocabulary. 孩子已具备分析性阅读能力——能识别主题、追踪作者的结构选择，并用文本证据为自己的观点辩护。Navigator现将按照MCT课程：使阅读成为对写作技艺的探究——作者如何将语法、词汇和结构作为工具来运用？《爱丽丝梦游仙境》《金银岛》等SAT必读经典文本，正是孩子在语法和词汇学习中所掌握一切的活生生的证明。",
    4: "Your child reads with layered attention: examining how a text is constructed, questioning word choices at the sentence level, and synthesizing meaning across a whole work. The Navigator brings this to bear on the classical literature — each text examined simultaneously for its story, its grammar, its vocabulary, and its craft. Reading at this level is already an act of analysis. 孩子的阅读正在发展深度：能分析文本是如何构建的，在句子层面思考选词，并在整部作品的范围内综合把握意义。Navigator将深入MCT经典文学的学习——每部文本都同时从故事、语法、词汇和写作技艺四个维度加以审视。在这个层次上的阅读，本身就是一种逻辑分析练习。",
    5: "Your child reads like a literary critic. They examine a text at four simultaneous levels — the words, the sentences, the structure, and the ideas — the same four lenses that four-level grammar analysis trains. Every reading session is an act of scholarship: noticing what the author did, understanding why it worked, and borrowing what can be used in their own writing. 孩子使用了严谨的阅读分析能力——同时从四个层面审视一部作品：词语、句子、结构和思想——这与语言架构的四层级分析所训练的四个视角完全一致。这使每堂阅读课都可以是一次学术探究：注意作者做了什么，理解为什么有效，以及可以如何借鉴到自己的写作中。恭喜！这正是都学书院课程致力于达到的阅读分析标准。",
  },
  vocabulary: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "Your child is building the foundational vocabulary needed to access more complex text. The Navigator begins introducing the concept that English words have histories — they carry meaning from ancient Latin and Greek, and understanding where a word comes from is worth far more than memorizing its definition. 孩子正在积累进入更复杂文本所需的基础词汇量。Navigator开始引入概念：英语词汇有其历史渊源——它们承载着来自古代拉丁语和希腊语的含义；理解一个词的来源远比背诵其定义有价值得多。",
    2: "Your child is building awareness of Latin and Greek word stems — the roots from which academic English grows. The first great stem families arrive: aqua, terra, tempus, spiritus, and the dozens that follow. The Navigator teaches this as history, culture, and language together, not as a list to memorize: a word is an argument built from parts with pasts. 孩子正在建立对拉丁语和希腊语词根的认识——学术英语正是从这些词根中生长出来的。我们开始引入了第一批重要词根家族：aqua（水）、terra（土地）、tempus（时间）、spiritus（精神）以及随后的数十个词根。Navigator将历史、文化和语言融为一体来教授，而非作为需要记诵的列表：一个词是由有着各自历史的部件构建而成的。",
    3: "Your child uses stem knowledge actively — encountering an unfamiliar word, decomposing it into its roots, and reasoning toward its meaning before checking any definition. This is the morphological habit the vocabulary strand is designed to build. For a child who already reads Chinese characters by analyzing their component parts, this transfer is natural and powerful. 孩子能主动运用词根知识——遇到生词时，先将其分解为词根，再推断含义，然后才查词典。这正是MCT词汇训练所要建立的形态分析习惯。对于一个已经习惯通过分析偏旁部首来理解汉字的孩子来说，这种迁移既自然又有力。",
    4: "Your child possesses deep, cumulative vocabulary knowledge built on Latin and Greek root families. They understand not just definitions but connotation, register, and etymological family: the precise difference between contemplate and consider, between malevolent and wicked. The Navigator connects every new word to root structures the child already knows, so vocabulary compounds rather than merely accumulates. 孩子拥有建立在拉丁语和希腊语词根体系上开始有累积的词汇知识。他们不仅理解定义，更理解内涵、语域和词根家族关系：contemplate（沉思）与consider（考虑）之间的精确差异，malevolent（有恶意的）与wicked（邪恶的）之间的微妙区别。Navigator将每个新词与孩子已知的词根结构联系起来，让词汇量呈复利增长，而非简单累积。",
    5: "Your child's vocabulary is built on a clear architectural principle: academic English is largely Latin and Greek; knowing roots means knowing families of words; and lexical depth is the primary key to reading dense analytical prose. At this level, the child approaches unfamiliar academic vocabulary the way they approach an unknown Chinese character — by analyzing the components, not guessing the whole. This is the vocabulary standard that separates a writer who commands their language from one who is commanded by it. 孩子的词汇量有丰富的累计且有高级的词汇知识：当孩子面对陌生学术词汇时，就像面对一个未知汉字一样——通过分析构成部件来推断含义，而非猜测整体。这是区分一个驾驭语言的写作者与一个被语言驾驭的写作者的词汇标准。",
  },
  readingFluency: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "Your child reads word by word, giving each unit full decoding attention before moving to the next. The Navigator works at the phrase level — training the eye and voice to move through text in meaningful grammatical clusters. This is the beginning of understanding how sentence structure carries meaning: a prepositional phrase is read as one unit because it is one unit of thought. 孩子目前逐词阅读，在进入下一个词之前给予每个词充分的解码注意。Navigator在短语层面开始教学——训练眼睛和声音以有意义的语法组块来推进文本。",
    2: "Reading momentum is building. The child reads familiar text with increasing smoothness and is beginning to use punctuation as an analytical guide — a comma as a breath between grammatical units, a semicolon as a pivot, a period as the completion of a thought. The Navigator coaches the connection between grammatical structure and spoken rhythm: how a sentence sounds is a clue to how it is built. 阅读习惯正在酝酿。孩子读熟悉文本时越来越流畅，并开始将标点作为分析性指引——逗号是语法单位之间的停顿，分号是思维的转折，句号是思想的完成。Navigator会引导孩子建立语法结构与口语节奏之间的联系：一个句子听起来的感觉，是理解它如何构建的线索。",
    3: "The child reads with natural phrasing and steady pace. The Navigator is now working on prosody — the musicality of language — which is the beginning of poetics work. Students learn that great authors chose their words not only for meaning but for sound: the difference between a line that moves a reader forward and a line that stops them. Reading aloud with attention to rhythm is itself a form of analysis. 孩子以自然的断句和稳定的节奏朗读。Navigator现在专注于培养韵律感——语言的音乐性。孩子学会了伟大的作者选词不仅考虑意义，还考虑声音：一行让人向前读的句子与一行让人停顿的句子之间的差异。带着对节奏的关注大声朗读，也可以是一种分析形式。",
    4: "Reading is smooth, expressive, and analytically grounded. The child adjusts emphasis and pace in response to grammatical structure — stressing the operative word in a clause, pausing where syntax demands a breath, accelerating through a list to build momentum. This is the fluency that prepares a student for full poetics work: understanding prosody, recognizing scansion, and hearing the music in English sentences. 孩子的阅读流畅、富有表现力且有分析依据。他们根据语法结构调整重音和节奏——在从句中强调关键词，在句法要求呼吸的地方停顿，在列举中加速以建立动势。这一流利度水平为孩子准备好练习下一步：理解韵律、识别格律，以及听出英语句子中的音乐性。",
    5: "The child's oral reading demonstrates mastery of prosody. They read not just for meaning but for music: modulating voice to serve structure, using emphasis to illuminate argument, understanding that how a sentence sounds is inseparable from what it means. A student who reads at this level understands literature this way: as the living demonstration of everything learned in grammar, vocabulary, and craft. 孩子的朗读展示了成熟的韵律掌握。他们不只是为了意义而读，也为了音乐性而读：用声音服务于结构，用重音照亮论点，理解一个句子的声音与其意义不可分割。在这个层次朗读的孩子，可以以艺术的眼光来理解文学：作为语法、词汇和写作技艺中所学一切的鲜活的展现。",
  },
  phonics: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "Your child is in the foundational stage of English decoding — establishing the correspondence between letters, letter clusters, and the sounds they represent. This work is the prerequisite for everything that follows: comprehension, analysis, vocabulary development, and the classical literature at the center of this program. The Navigator develops this foundation systematically, targeting phoneme patterns that don't exist in the child's first language before incorrect habits have a chance to form. 孩子正处于发音解码的基础阶段——建立字母、字母组合与其所代表发音之间的对应关系。这一步是后续一切的前提：理解力、分析能力、词汇发展，以及经典文学阅读。Navigator会系统性地建立基础，在孩子母语中不存在的音素规律上进行针对性训练，在错误习惯形成之前加以纠正。",
    2: "The child recognizes common sound patterns reliably and is building the decoding stamina needed for longer texts. The Navigator is working toward full automaticity — the state in which decoding requires no conscious attention, freeing all cognitive resources for what matters: comprehension, analysis, and the deep reading this program demands. 孩子能可靠地识别常见发音规律，并正在建立处理较长文本所需的解码耐力。Navigator下一步将专注使解码达到完全自动化——即解码不再需要有意识关注的状态，从而将所有认知资源释放给真正重要的工作：理解、分析，以及深度阅读。",
    3: "Decoding is becoming automatic on most text. The child self-corrects without prompting and moves through multi-syllabic words with confidence. This is the threshold the program is built past: once decoding is automatic, Navigator attention shifts entirely to the analytical strand — literary analysis, grammar architecture, etymological vocabulary, sentence craft, writing organization, and poetics. The work this program is designed for begins here. 孩子对文字发音的解码正在趋向自动化。孩子能无需提示地自我纠正，并能自信地处理多音节词。Navigator将关注转向分析性训练——文学分析、语言架构、词源词汇、句子技艺、写作组织和韵律学。",
    4: "Decoding is fully automatic. This threshold has been cleared. The Navigator's attention is now entirely on the analytical strand: reading classical literature with comprehension and craft awareness; working through four-level grammar analysis; building etymological vocabulary from Latin and Greek root families; developing written argument assessed by the 6+1 Trait rubric. The work this program is designed for is fully underway. 孩子的发音解码已自动化。Navigator的注意力现在完全转向分析性训练：以理解力和技艺意识阅读经典文学；进行四层级语言架构分析；从拉丁语和希腊语词根家族建立词源词汇；培养以6+1特质评估体系衡量的书面论证能力。",
    5: "Decoding is fully automatic and has been for some time. Your child's cognitive bandwidth is entirely free for the analytical, compositional, and literary work that is the purpose of this program. Every Navigator session operates at the level of meaning, structure, argument, and craft — which is where this work was always intended to go. 解码已完全自动化，孩子的全部认知资源都可以自由用于分析性、写作性和文学性工作。",
  },
  speaking: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "Your child is absorbing language before producing it — building an internal model through listening before the words come out. This is the correct sequence, and the Navigator respects it. Structured, low-pressure speaking opportunities are built into every session: the Socratic question that invites a single genuine observation; the retelling of a passage already read and discussed together. 孩子目前以重复的方式来口语表达——通过倾听在内部建立语言，然后输出。这是正确的顺序也是健康的规律。每堂课都融入了有结构、低压力的口语机会：启蒙孩子独立思考并表达的「实验室」。",
    2: "The child shares ideas more consistently in response to questions. The Navigator follows a Socratic approach: every response is met with a follow-up question, not an evaluation. The habit being built is not answering — but extending and defending. What makes you say that? Where in the text does that come from? Can you say more? 孩子在回应问题时更稳定地分享自己的想法。Navigator跟孩子不只是建立回答的能力，而是延伸和捍卫自己的论点。你这样说的依据是什么？文本中哪里有这个证据？能说得更具体吗？",
    3: "The child engages in analytical discussion willingly, holds a position when challenged, and is beginning to distinguish between what they think and what the text supports. The Navigator is raising the analytical bar: a student who can articulate a claim and defend it orally is already prepared to do the same on the page. 孩子愿意参与分析性讨论，在受到挑战时能坚持自己的立场，并开始区分自己的想法与文本所支持的内容。Navigator正在将口语标准提升到学术讨论模式的水平：一个能口头表达论点并加以捍卫的孩子，已经为在写作中做同样的事情做好了准备。",
    4: "The child presents a position, defends it with evidence from the text, and responds to counterarguments without abandoning their reasoning. This is what consistent analytical discussion, session after session, builds toward. 孩子能有力地提出立场，用证据加以捍卫，并在不放弃推理的前提下回应反驳。他们展现了对自身口语的自信。",
    5: "The child commands academic discussion with precision. They build arguments in real time, use textual evidence with specificity, and adjust for their listener without losing the thread of their reasoning. This is the speaking profile the program is built toward: confident, evidence-driven, analytically precise. 孩子以精准的方式主导学术讨论。他们能实时构建论证，以具体性引用文本证据，并在不失去推理线索的前提下根据听众调整表达方式。这是我们教学的目标—自信、有据可依、分析精准。",
  },
  pronunciation: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "The goal at this stage is clarity, not accent. The Navigator targets the specific sounds that don't exist in the child's first language — establishing correct physical habits before they have a chance to solidify incorrectly. Every session includes oral reading from a classical text, which provides structured, natural exposure to the full phoneme range of English. 这一阶段的目标是清晰表达，而非口音。Navigator专注于孩子母语中不存在的特定发音——在错误的发音习惯固化之前建立正确的口腔肌肉记忆。每次课都包含对经典文本的朗读，为孩子提供系统、自然的英语全音素接触。",
    2: "Common words are clear and phonemic confidence is building. The Navigator targets specific consonant clusters and vowel sounds with focused, repetitive practice — the kind of precision that makes the difference between being understood and being effortlessly understood. The oral reading component of every session is the vehicle: the text provides the content; the Navigator provides the coaching. 常用词发音清晰，孩子的语音自信正在建立。Navigator针对特定辅音组合和元音进行专项重复练习——这种精准决定了「能被理解」与「毫不费力地被理解」之间的差距。每次课的朗读部分是载体：文本提供内容，Navigator提供精准指导。",
    3: "The child is intelligible to all listeners. The Navigator is now working on sentence rhythm and stress patterns — because natural English is less about any individual sound and more about the rise and fall of a phrase. This work connects directly to prosody: how a sentence sounds is evidence of how its grammar is structured. 所有听众都能清楚理解孩子的表达。Navigator现在专注于句子节奏和重音规律——因为地道英语的关键不在于任何单个音素，而在于短语的起伏节奏。这项工作与韵律训练直接相连：一个句子听起来的感觉，正是其语法结构的证明。",
    4: "Pronunciation is clear with minimal errors. It has become a tool rather than a barrier. The Navigator uses this foundation to develop rhetorical precision: which words to stress to make an argument land; how emphasis follows grammatical structure; how the voice reveals the hierarchy of ideas in a complex sentence — the same hierarchy that four-level analysis reads on the page. 孩子发音清晰，错误极少。发音已从障碍转变为工具。Navigator以此为基础培养修辞精准度：强调哪些词才能让论点有力落地；重音如何跟随语法结构；声音如何揭示复杂句子中的思想层次——这与四层级分析在纸面上所读取的层次完全一致。",
    5: "Pronunciation is effortless and natural. The child has mastered the linking, reduction, and intonation patterns that mark fluent English speech — and deploys them deliberately to serve the meaning and grammatical structure of what they are saying. At this level, pronunciation is inseparable from analysis: the way the child reads aloud is a demonstration of how deeply they understand what they are reading. 孩子发音毫不费力，自然流畅。他们掌握了标志流利英语口语的连读、弱读和语调规律——并将其有意识地运用于服务所说内容的意义和语法结构。在这个层次上，发音与分析不可分割：孩子朗读的方式，正是其对所读内容理解深度的展示。",
  },
  conversational: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "The child responds to direct questions on familiar content. The Navigator builds from here — not by asking more questions but by teaching the child to ask their own. The conversation is always moving toward a better question, not a final answer. 孩子能回应熟悉的直接提问。Navigator的工作从这里出发——教孩子自己提问。对话始终朝着一个更好的问题迈进，而非一个最终答案。",
    2: "The child holds short exchanges on familiar topics. The Navigator is building conversational strategies — how to maintain the thread when vocabulary runs short, how to redirect a discussion, how to return to the text when the argument goes too abstract. The text is always the anchor. 孩子能围绕熟悉话题进行简短交流。Navigator正在培养对话策略——词汇不足时如何维持话题线索，如何转换讨论方向，当论证变得过于抽象时如何回归文本。文本始终是锚点。",
    3: "The child converses naturally and is learning to manage unexpected turns. The Navigator introduces the analytical dimension of conversation: can the child ask a precise question — one that opens the text rather than closes it — rather than simply stating a preference? 孩子能自然对话，也开始学会应对话题的意外转折。Navigator引入了对话的分析维度：孩子能否提出一个精准的问题——一个打开文本而非关闭它的问题？",
    4: "Conversation is natural and analytically engaged. The child listens actively, responds to nuance, and builds on what was just said — not just participating in the discussion, but improving the quality of it. 对话自然，分析性的投入也已到位。孩子能主动倾听、回应细节，并在刚才所说内容的基础上延伸——不只是参与讨论，而是让讨论变得更好。",
    5: "The child is a fluent, spontaneous academic conversationalist — precise, adaptive, and able to navigate complex ideas without losing the thread of reasoning. Every discussion is rehearsal space for the analytical arguments that will enter written work. At this level, the distance between speaking well and writing well is narrow. 孩子是流利、自发的学术对话者——精准、灵活，能驾驭复杂思想而不失线索。每次讨论，都是写作的预演。说得好与写得好，在这里几乎已经是同一件事。",
  },
  listening: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "Your child is building the listening map of English — learning to parse its rhythms and phrase structures before full meaning arrives. The Navigator's oral reading in every session — always from a classical text — is the primary input. Sustained exposure to well-constructed English prose, read aloud with attention, is foundational. 孩子正在建立英语的听觉地图——在意义完整到来之前，先感受节奏和结构。Navigator在每堂课上的朗读——来自经典文本——是最主要的语言输入。",
    2: "The child follows clear speech on familiar topics with solid comprehension. The Navigator is building listening stamina — gradually increasing the density and complexity of spoken input, always using the classical texts as the vehicle. The goal is the ability to follow an extended analytical argument, not just a narrative. 孩子能扎实理解熟悉话题上的清晰表达。Navigator逐步提升输入的密度和复杂度——目标不只是跟上叙事，而是能跟上一段完整的分析性论证。",
    3: "The child follows most instructional-level English well. The Navigator is now targeting nuance — tone, implication, the gap between what is said and what is meant. These are the listening skills that Socratic discussion demands: hearing not just the surface of what the Navigator says, but the analytical move being made. 孩子对教学级别的英语理解已相当扎实。Navigator现在着重训练细微差别——语气、言下之意、字面表达与真实意图之间的落差。不只是听到说了什么，更要听到其中的分析性动作。",
    4: "The child is a strong analytical listener. They track complex argument, notice shifts in tone and reasoning, and can restate what they heard with precision — identifying the claim, the supporting evidence, and the question left open. This is listening as literary analysis applied to speech. 孩子是出色的分析性听者。他们能追踪复杂论证、捕捉语气和推理方式的变化，并能精准复述所听内容——识别论点、支撑它的证据，以及它所留下的开放性问题。这是将文学分析应用于口语的听力能力。",
    5: "Listening comprehension is outstanding. The child parses nuance, register, and rhetorical intent across a wide range of delivery speeds and styles. This is the listening capacity that enables full participation in the kind of Socratic academic discussion this program is built around. 孩子的听力理解能力卓越。他们能解析多种语速和表达风格中的细微差别、语域和修辞意图。这是我们每堂课所要求的参与标准。",
  },
  grammar: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "Your child is learning the classification of words — the eight parts of speech that form the vocabulary of grammar itself. The Navigator introduces this not as a list to memorize but as the beginning of a lifelong analytical lens: every word in every sentence holds a specific position for a reason, and grammar is the system that names those reasons. The foundational premise is this: grammar is the language of language arts. 孩子正在学习八大词类——语法本身的词汇体系。Navigator不把这当作背诵列表，而是终身分析视角的起点：每个词在句子中的位置都有原因，语法就是命名这些原因的系统。",
    2: "The child identifies the eight parts of speech reliably and is beginning four-level sentence analysis — the signature method of this grammar work. Level one: parts of speech. Each sentence is treated as a short investigation, not a drill: three minutes of close attention, a complete review of everything known so far. The Navigator teaches four-level analysis as a practice that deepens with use, the way musical scales deepen with daily playing. 孩子能可靠地识别八大词类，并开始进行四层级句子分析。第一层：词性。每个句子是一次简短探究，不是训练——三分钟的专注，对迄今所学的一次完整回顾。四层级分析是随使用而加深的实践，就像音阶随每天练习而加深一样。",
    3: "The child works through four-level analysis with increasing confidence: parts of speech, parts of sentence, phrases, and clauses. At this level they identify subject, predicate, and object — the load-bearing elements of a sentence — and see how phrases and clauses modify the core structure. The Navigator is developing architectural understanding: a sentence is not a sequence of words but a structure, and understanding that structure is the prerequisite for building a better one. 孩子以越来越自信的方式推进四层级分析：词性、句子成分、短语和从句。他们开始看到句子的承重元素，以及短语和从句如何在核心结构上做修饰。一个句子不是词语的序列，而是一个结构；理解这个结构，是构建更好句子的前提。",
    4: "Four-level analysis is reliable and internalized. The child moves through all four levels as a single integrated act, not a sequence of separate steps. They identify not just what a word is but what it does: its grammatical function in the load-bearing structure of the sentence. This is the prerequisite for serious writing instruction — the foundation on which sentence craft and composition are built. 四层级分析已内化。孩子将四个层级作为一个整合动作来推进——不是分开的步骤。他们不仅识别词性，更识别功能：这个词在句子承重结构中做什么。这是正式写作教学的前提。",
    5: "Grammar is fully architectural. The child uses four-level analysis as both a reading tool and a writing tool: to examine any sentence's logic before writing it, and to audit its structure after. They understand that a grammatical choice and a thinking choice are the same choice — that the structure of a sentence is the structure of the argument it carries. Grammar, understood this way, becomes the foundation of all writing instruction. 语法已完全架构化。孩子将四层级分析既作为阅读工具，也作为写作工具：写之前审视句子的逻辑，写之后审查其结构。他们理解语法选择与思维选择是同一个选择——一个句子的结构，就是它所承载的论证的结构。恭喜。",
  },
  sentences: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "Your child is mastering the fundamental unit of English writing: the complete sentence — subject, predicate, clear boundary. The writing strand begins here, with the understanding that a sentence is not merely a grammatical unit but the primary vehicle of thought. Every strong essay ever written began with a writer who knew exactly how a sentence works. 孩子正在掌握英语写作的基本单位：完整的句子——主语、谓语、清晰的边界。句子不只是语法单位，更是思想的首要载体。每一篇有力的文章，都始于一位清楚知道句子如何运作的写作者。",
    2: "The child writes correct sentences and is beginning to combine ideas. The Navigator introduces sentence variety not as decoration but as function: a short sentence creates emphasis; a longer construction builds complexity and subordinates one idea to another. The choice between them is an argument, not a stylistic preference. 孩子能写出正确的句子，并开始组合想法。Navigator将句式多样性不作为装饰，而作为功能来引入：短句制造强调；长句构建复杂性并将一个想法从属于另一个。选择哪种句式是一种论证，而非风格偏好。",
    3: "The child uses varied sentence structures purposefully — simple sentences for impact, compound sentences for balance, complex sentences for hierarchical reasoning. The Navigator introduces the deeper mechanics of sentence construction: how subordinate clauses create a hierarchy of ideas; how apposition adds density without losing clarity; how a deliberate fragment can land with more force than any complete sentence. Grammar knowledge is now writing knowledge. 孩子有目的地运用多样的句式——简单句制造冲击，并列句建立平衡，复杂句实现层次推理。Navigator引入了更深的句子机制：从句如何建立思想层次；同位语如何增加密度而不失清晰；刻意的短句残片如何比完整句更有力地落地。语法知识，在这里成了写作知识。",
    4: "Sentence construction is analytical and deliberate. The child shapes sentences to serve argument — knowing when a short sentence lands harder, when subordination creates the right hierarchy of ideas, when parallel structure generates the right rhythm. The four-level analysis the child has developed is now applied directly to their own writing: a sentence is final only when it can be justified at every level. 句子构建是分析性的、经过深思熟虑的。孩子让句子服务于论证——知道何时短句更有力地落地，何时从属结构建立正确的思想层次，何时平行结构创造正确的节奏。孩子一直在培养的四层级分析，现在被直接应用于自己的写作：一个句子只有在每个层级上都能得到论证时才算定稿。",
    5: "Sentence craft is a deliberate instrument — beautiful, grammatically exact prose. The child designs sentences with full grammatical awareness: knowing what each element carries, where the stress falls, and how the sentence moves the reader. Every sentence can be justified at all four levels of analysis. This is the distinction between a writer who commands their language and one who merely uses it. 句子技艺已成为刻意运用的工具。孩子在设计每个句子时，知道每个元素承载什么，重音落在哪里，句子如何推动读者前进。每个句子都能在四个层级上得到论证。这是驾驭语言与仅仅使用语言之间的区别。恭喜。",
  },
  organization: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "Your child's writing lists events rather than building argument. The Navigator's foundational work is teaching the difference between a container for ideas and a structure that moves a reader. A paragraph has direction — it begins somewhere and ends somewhere different — and learning to feel that direction is the first step toward organized writing. 孩子的写作以罗列事件为主，而非构建论证。Navigator的基础工作是教孩子感受段落的方向感——它从某处开始，在某个不同的地方结束。感受到这种方向性，是有组织写作的第一步。",
    2: "The child can write a beginning, middle, and end. The Navigator is making the logic of each section explicit: a strong opening claim that commits to a position; evidence and analysis in the middle that earn the reader's trust; a conclusion that advances the argument rather than restating the introduction. The writing sequence — sentence craft to paragraph design to essay architecture — begins here. 孩子能写出开头、中间和结尾。Navigator正在使每个部分的逻辑变得明确：有力承诺一个立场的开篇；在中间赢得读者信任的证据和分析；推进论证而非重复开头的结论。写作序列——从句子技艺到段落设计到文章架构——从这里开始。",
    3: "Organization is clear and purposeful. The Navigator is working on transitions — not the mechanical 'first, next, finally' of early writing, but the logical connective tissue that guides a reader through a complex argument without losing the thread. The standard: every sentence must earn its position in the sequence, just as every word must earn its position in the sentence. 写作组织清晰且有目的性。Navigator正在打磨过渡——不是机械的过渡词，而是引导读者穿越复杂论证的逻辑连接。每个句子必须在序列中赢得自己的位置，就像每个词必须在句子中赢得自己的位置一样。",
    4: "The child structures writing with analytical intent — every section serves the argument, nothing decorates. The Navigator works with the full writing sequence: grammar architecture enables sentence precision; sentence precision enables paragraph design; paragraph design enables essay architecture. Each level builds directly on the last. The 6+1 Trait Organization criterion enters the assessment frame here — not as a checklist but as a framework for understanding how structure creates meaning. 孩子以分析性意图构建写作结构——每个部分服务于论证，没有任何装饰。语言架构实现句子精准；句子精准实现段落设计；段落设计实现文章架构——每个层级直接建立在上一个之上。6+1特质的「组织」标准在这一阶段进入评估视角，不作为清单，而作为理解结构如何创造意义的框架。",
    5: "The child designs the architecture of their writing. They understand that how a text is organized is itself an argument: a claim about what matters, what follows from what, and where the reader should arrive. Structural choices at this level earn a reader's trust before the content begins. This is the organizational mastery that transforms correct writing into powerful writing. 孩子已能设计写作的整体架构。他们理解文本的组织方式本身就是一种论证：关于什么重要、什么从什么衍生，以及读者应该抵达何处。在这个层次上的结构选择，在内容展开之前就赢得了读者的信任。这是将正确写作变为有力写作的关键。恭喜。",
  },
  creative: {
    0: "This area was not assessed during this session. 本次评估未涉及该项能力。",
    1: "Your child is beginning to hear that language has music — that some sentences sound different from others even when they carry roughly the same meaning. The Navigator introduces this through oral reading from the classical texts: the rhythms of Lewis Carroll, the precision of Poe, the clean declarative sentences of Jack London. The goal at this stage is attentiveness to sound — the ability to notice that something in the language is working. 孩子开始听到语言有音乐性——有些句子即使意思相近，听起来也截然不同。Navigator通过经典文本的朗读引入这一意识：卡罗尔的节奏感，坡的精准，伦敦干净的陈述句。这一阶段的目标，是让孩子开始注意到——语言里有某种东西在运作。",
    2: "The child is identifying sound patterns in text — alliteration, the contrast between hard consonant clusters and soft vowel sequences, the way a short sentence after a long one creates sudden emphasis. Poetics work begins with the music of vowels and consonants and builds toward prosody. The Navigator teaches that great authors made sound choices as deliberately as word-meaning choices: the two cannot be separated. 孩子能识别文本中的声音规律——头韵、辅音的硬度与元音的柔软度之间的对比、长句之后短句所制造的强调效果。Navigator带孩子看到：伟大的作者在做声音选择时，与做词义选择时同样刻意——两者不可分割。",
    3: "The child analyzes the sound architecture of a text — identifying syllabic stress, understanding how rhythm shapes the pace at which meaning arrives, noticing when an author's word choice was driven by sound as much as by sense. Poetic technique is not decoration exclusive to poetry — it prepares students for all genres of writing, including analytical prose. A student who hears rhythm can control it. 孩子能分析文本的声音架构——识别音节重音，理解节奏如何影响意义的到达方式，注意到选词何时同时由声音和意义驱动。诗歌技巧不是专属于诗歌的装饰——它为所有体裁的写作做准备。一个能听出节奏的学生，就能控制它。",
    4: "The child reads and writes with prosodic awareness. They understand how stress, rhythm, and sound interact with grammatical structure and meaning; they examine a prose passage or poem for its technical construction and identify the choices the author made. The Navigator uses this work to develop the 6+1 Trait of Voice: the quality that makes writing feel distinctly like this student — built from deliberate choices about sound as well as meaning. 孩子以韵律感知进行阅读和写作。他们理解重音、节奏和声音如何与语法结构和意义相互作用；能审视一段散文或一首诗的技术构建，并识别作者所做的选择。Navigator用这项工作培养6+1特质中的「声音」——使写作感觉明显属于这个孩子的品质，由对声音和意义的双重刻意选择所建构。",
    5: "The child's understanding of language has reached the philosophical dimension of poetics work. Word choices carry beauty alongside meaning; great prose has musicality inseparable from its argument; a writer's voice is constructed as much from how the words sound together as from what they say. Every word choice is simultaneously a grammatical choice, a semantic choice, and an aesthetic one. This is where this work was always headed. 孩子对语言的理解已到达韵律学的哲学维度。选词在意义之外还承载美；伟大的散文有着无法与其论证分离的音乐性；写作者的声音，从词语组合在一起的声响中建构的程度，不亚于从所说内容中建构的程度。每次选词，同时是语法选择、语义选择和美学选择。恭喜。",
  },
};
const RATING_LABELS = { 0: "Did Not Test", 1: "Beginning", 2: "Developing", 3: "Approaching", 4: "Proficient", 5: "Advanced" };
const RATING_COLORS = {
  0: { bg: "#EEEEFF", text: "#5E6879", dot: "#B7B5FE" },    // lavender — Did Not Test
  1: { bg: "#fde8e8", text: "#7a2020", dot: "#c0504d" },    // red — Beginning
  2: { bg: "#fef3e2", text: "#7a4f10", dot: "#d4874e" },    // orange — Developing
  3: { bg: "#E6F6EE", text: "#1A4D35", dot: "#7EC8A0" },    // soft green — Approaching
  4: { bg: "#D4EEDF", text: "#14392A", dot: "#5AAA82" },    // deeper green — Proficient
  5: { bg: "#EBEBFF", text: "#3535A0", dot: "#B7B5FE" },    // lavender — Advanced
};

const PILLARS = [
  {
    id: "literacy", label: "Literature & Literacy", labelZh: "文学与读写素养",
    color: B.lavender, lightColor: B.lavenderLight, headerTextColor: B.voidBlack,
    skills: [
      { id: "phonics", label: "Foundational Fluency", labelZh: "自然拼读（阈值技能）" },
      { id: "comprehension", label: "Literary Analysis & Comprehension", labelZh: "文学分析与阅读理解" },
      { id: "vocabulary", label: "Vocabulary & Etymology", labelZh: "词汇与词源" },
      { id: "readingFluency", label: "Reading Fluency & Prosody", labelZh: "阅读流利度与韵律感" },
    ],
  },
  {
    id: "oral", label: "Speaking & Discussion", labelZh: "口语与讨论",
    color: B.softGreen, lightColor: B.softGreenLight, headerTextColor: B.voidBlack,
    skills: [
      { id: "speaking", label: "Speaking Confidence", labelZh: "口语自信心" },
      { id: "pronunciation", label: "Pronunciation & Clarity", labelZh: "发音与清晰度" },
      { id: "conversational", label: "Conversational Fluency", labelZh: "对话流利度" },
      { id: "listening", label: "Listening Comprehension", labelZh: "听力理解" },
    ],
  },
  {
    id: "writing", label: "Language Craft & Writing", labelZh: "语言技艺与写作",
    color: B.midnight, lightColor: B.midnightLight, headerTextColor: B.platinum,
    skills: [
      { id: "sentences", label: "Sentence Craft", labelZh: "句子技艺" },
      { id: "grammar", label: "Language Architecture", labelZh: "语言架构（语法）" },
      { id: "organization", label: "Writing Organization", labelZh: "写作组织" },
      { id: "creative", label: "Poetics & Voice", labelZh: "韵律与声音" },
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
const PILLAR_GRADE_KEY = { "Literature & Literacy": "literacy", "Speaking & Discussion": "oral", "Language Craft & Writing": "writing" };

const CURRICULUM = [
  {
    pillar: "Literature & Literacy", pillarZh: "文学与读写素养", color: B.lavender, lightColor: B.lavenderLight, headerTextColor: B.voidBlack,
    match: "每一位孩子进入DODO Learning课程时，都先通过Lexile分级评估确定当前阅读水平。Navigator的工作从这个数字开始——不是赶进度，而是通过系统训练让孩子的认知带宽真正释放出来。以MCT经典文学文本为核心素材，结合Harvard Project Zero的思维训练框架，确保孩子不只是读懂了文字，而是学会了如何对文本提问、推断，并用证据支撑自己的解读。坚持参与课程的学生通常能在16周内实现一至两个Lexile等级的突破。",
    modules: [
      { name: "The Decoding Foundation", nameZh: "解码基础", desc: "Navigator使用可解码文本系统训练对英语拼音规律的掌握，将大脑从辨词任务中解放，为高阶阅读理解释放认知资源。" },
      { name: "The Reading Loop", nameZh: "阅读循环", desc: "以MCT经典文学文本为核心，Navigator引导孩子经历完整的Read→Think循环：朗读文本，随即通过结构化提问训练推断、分析和深度理解。" },
      { name: "Word Architecture", nameZh: "词汇建筑", desc: "以拉丁和希腊词根为锚点系统扩充学术词汇量。双语学习者天然具备的形旁表意思维在这里得到迁移和强化。" },
    ],
  },
  {
    pillar: "Speaking & Discussion", pillarZh: "口语与讨论", color: B.softGreen, lightColor: B.softGreenLight, headerTextColor: B.voidBlack,
    match: "语言是思维的外壳。DODO Learning的口语课程不以流利度为终点——流利度是结果。Navigator设计的每一个口语任务都指向一个更高的目标：让孩子学会不只是「说出来」，而是「论证出来」。通过朗读、叙事构建和结构化讨论，孩子逐步建立在北美学术和社交环境中真正需要的表达能力——能够提出立场、支撑理由，并在对话中回应挑战。Navigator的第一个动作永远是一个更好的问题，而非一个评价。",
    modules: [
      { name: "Speaking Lab", nameZh: "口语实验室", desc: "围绕真实情境设计的口语任务，训练孩子在不同语境下呈现立场并支撑观点。流利度在这里是工具，而非目标。" },
      { name: "Pronunciation Lab", nameZh: "发音实验室", desc: "针对高频发音难点进行专项精准训练，结合即时反馈，建立自然地道的英语语音节律。" },
      { name: "Analytical Listening", nameZh: "分析性聆听", desc: "通过精选音视频材料训练孩子不只是「听懂」，而是识别论点结构、语气转变和说话者的修辞意图。" },
    ],
  },
  {
    pillar: "Language Craft & Writing", pillarZh: "语言技艺与写作", color: B.midnight, lightColor: B.midnightLight, headerTextColor: B.platinum,
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

const F = '"DM Sans", "Noto Sans SC", sans-serif';
// A4 at 96dpi = 794 x 1123px. We render at this size, html2canvas captures at 2x.
const PW = 794;
const PH = 1123;
const PAD = 30;
const SKILL_ROW_H = 82; // Fixed row height for skill rows
const GAP_H = 73; // Spacer height — matches header visual height

function PDFHeader({ info }) {
  return (
    <div style={{ background: B.cream, padding: `18px ${PAD}px 12px`, borderBottom: `3px solid ${B.lavender}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <img src={LOGO_B64} alt="DODO" style={{ height: 40, width: "auto" }} />
        <div style={{ borderLeft: `1.5px solid rgba(183,181,254,0.45)`, paddingLeft: 14 }}>
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
      <div style={{ background: pillar.color, color: pillar.headerTextColor || B.platinum, padding: "6px 14px" }}>
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
      <div style={{ background: item.color, color: item.headerTextColor || B.platinum, padding: "6px 14px" }}>
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
            <span style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: B.lavender, fontWeight: 700 }}>Student Information </span>
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
          <div style={{ background: B.lavender, borderRadius: 6, padding: "6px 14px", color: B.voidBlack, textAlign: "center", marginTop: 10 }}>
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
          <div style={{ fontSize: 18, fontWeight: 700, color: B.ink, fontFamily: F }}>
            「<span style={{ color: B.lavender }}>{info.name || "学生"}</span>」的个人化英语需求
          </div>
          <div style={{ marginTop: 4, color: B.muted, fontSize: 10, lineHeight: 1.5 }}>
            第一页的每一项评估结果，都直接对应DODO Learning的具体课程模块。以下将详细说明我们为您的孩子推荐的学习方向及长期的益处。
          </div>
        </div>

        {/* Lexile Boxes — taller to fill space */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 14 }}>
          <div style={{ background: B.softGreenLight, border: `1.5px solid ${B.border}`, borderRadius: 10, padding: "14px 22px", textAlign: "center", minWidth: 160 }}>
            <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: B.softGreen, marginBottom: 6, fontWeight: 700 }}>Proficient Lexile Level</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: B.softGreen }}>{selectedGradeObj ? `Lexile ${selectedGradeObj.lexile}` : "—"}</div>
            {selectedGradeObj && <div style={{ fontSize: 12, color: B.softGreen, fontWeight: 700, marginTop: 4 }}>{selectedGradeObj.grade}</div>}
          </div>
          <div style={{ background: B.lavenderLight, border: `1.5px solid ${B.border}`, borderRadius: 10, padding: "14px 22px", textAlign: "center", minWidth: 160 }}>
            <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: B.lavender, marginBottom: 6, fontWeight: 700 }}>Student Lexile Level</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: B.lavender }}>{studentLexile || "—"}</div>
            <div style={{ fontSize: 12, color: B.lavender, fontWeight: 700, marginTop: 4 }}>Current level</div>
          </div>
        </div>

        {/* Gap — after consultation overview */}
        <div style={{ height: GAP_H }} />

        {/* Summary */}
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: B.ink, fontWeight: 700, marginBottom: 8 }}>Summary · 各核心领域总结</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
          {PILLARS.map(pillar => {
            const scored = pillar.skills.filter(s => ratings[s.id] !== undefined && ratings[s.id] !== null && ratings[s.id] > 0);
            const avg = scored.length > 0 ? scored.reduce((a, s) => a + ratings[s.id], 0) / scored.length : 0;
            const rounded = scored.length > 0 ? Math.round(avg) : null;
            const rc = rounded ? RATING_COLORS[rounded] : null;
            return (
              <div key={pillar.id} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${B.border}` }}>
                <div style={{ background: pillar.color, color: pillar.headerTextColor || B.platinum, padding: "6px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{pillar.label}</div>
                  <div style={{ fontSize: 10, opacity: 0.72, marginTop: 1 }}>{pillar.labelZh}</div>
                </div>
                <div style={{ background: pillar.lightColor, padding: "8px 10px", textAlign: "center" }}>
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
              <span style={{ fontSize: 12, fontWeight: 700, color: B.lavender }}>Evaluator's Notes </span>
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
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap";
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
    <div style={{ fontFamily: '"DM Sans", "Noto Sans SC", sans-serif', minHeight: "100vh", background: B.cream }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px 80px" }}>

        {/* Form Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, paddingBottom: 16, borderBottom: `2px solid ${B.lavender}` }}>
          <img src={LOGO_B64} alt="DODO" style={{ height: 40 }} />
          <div>
            <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: B.muted }}>DODO Learning</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: B.ink }}>Student Report Generator</div>
          </div>
        </div>

        {/* Student Info */}
        <div style={{ background: B.white, borderRadius: 10, padding: 18, marginBottom: 16, border: `1px solid ${B.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: B.ink, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Student Information 学生信息</div>
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
            <div style={{ background: pillar.color, color: pillar.headerTextColor || B.platinum, padding: "10px 18px" }}>
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
          <div style={{ fontSize: 12, fontWeight: 700, color: B.ink, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Consultation Settings 咨询设置</div>
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
          <div style={{ fontSize: 12, fontWeight: 700, color: B.ink, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Evaluator's Notes 评估师备注</div>
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
              padding: "14px 36px", background: generating ? B.muted : B.gilt, color: generating ? B.cream : B.voidBlack,
              border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, fontFamily: "inherit",
              cursor: generating ? "wait" : "pointer", boxShadow: "0 3px 12px rgba(0,0,0,0.15)",
              opacity: fontsReady ? 1 : 0.5, transition: "all 0.2s",
            }}
          >
            {!fontsReady ? "Loading fonts…" : generating ? "⏳ Generating…" : "📄 Generate PDF Report"}
          </button>
          {status && <span style={{ fontSize: 13, color: status.startsWith("✓") ? B.softGreen : status.startsWith("Error") ? "#c0504d" : B.muted }}>{status}</span>}
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