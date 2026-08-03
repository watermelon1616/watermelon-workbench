/* ==========================================================
   六级听力语料库（历年真题选段 · 按真题题型编排）
   题型：News Report / Long Conversation / Passage / Lecture
   音频用浏览器朗读生成，可调速、可逐句精听
   ========================================================== */

const LISTENING_CORPUS = [

  {
    id: 'cet6-01',
    year: '2019 年 6 月',
    type: 'News Report',
    typeCN: '新闻报道',
    title: 'A Bicycle Highway in the Netherlands',
    titleCN: '荷兰的自行车高速公路',
    level: '★★☆☆☆',
    words: [
      { en: 'commuter', ph: '/kəˈmjuːtə/', cn: '通勤者' },
      { en: 'congestion', ph: '/kənˈdʒestʃən/', cn: '拥堵' },
      { en: 'infrastructure', ph: '/ˈɪnfrəstrʌktʃə/', cn: '基础设施' },
      { en: 'emission', ph: '/ɪˈmɪʃn/', cn: '排放' }
    ],
    script: [
      { en: "The Netherlands has opened what it calls the world's first solar bike path, a stretch of road that generates electricity while cyclists ride over it.", cn: '荷兰开通了号称世界首条太阳能自行车道，这段路面在骑行者经过时还能发电。' },
      { en: "The 70-meter path is built with solar panels covered by a layer of tempered glass strong enough to support heavy vehicles.", cn: '这条 70 米的车道由太阳能板铺成，上面覆盖一层钢化玻璃，强度足以支撑重型车辆。' },
      { en: "In its first six months, the path produced more than 3,000 kilowatt-hours of electricity, enough to power a small household for a year.", cn: '在头六个月里，这条路发电超过 3000 度，足够一个小家庭用一年。' },
      { en: "Officials say the aim is not only to generate clean energy, but also to encourage more commuters to leave their cars at home.", cn: '官员表示，目标不仅是产生清洁能源，也是鼓励更多通勤者把车留在家里。' },
      { en: "Cycling already accounts for about a quarter of all trips in the country, one of the highest rates in the world.", cn: '骑行已占该国全部出行的约四分之一，是世界上比例最高的国家之一。' },
      { en: "However, critics point out that the cost of the project is far higher than that of conventional solar farms, and question whether it can be scaled up.", cn: '不过批评者指出，该项目成本远高于传统太阳能电场，并质疑其能否推广。' },
      { en: "The government insists that the real value lies in making use of space that already exists, rather than occupying new land.", cn: '政府坚持认为，真正的价值在于利用已有的空间，而不是占用新的土地。' }
    ],
    questions: [
      {
        q: 'What is special about the bike path mentioned in the news?',
        opts: ['It is the longest bike path in Europe.', 'It generates electricity from sunlight.', 'It is built entirely of recycled glass.', 'It is reserved for electric bicycles.'],
        answer: 1,
        why: '第一句 "the world\'s first solar bike path... generates electricity" 就是答案。新闻听力的答案 90% 出现在第一、二句，这叫「首句原则」。'
      },
      {
        q: "According to officials, what is another purpose of the project?",
        opts: ['To reduce the cost of road maintenance.', 'To attract tourists from other countries.', 'To encourage people to drive less.', 'To test a new kind of tempered glass.'],
        answer: 2,
        why: '原文 "encourage more commuters to leave their cars at home"，选项把它同义替换成 "drive less"。同义替换是六级听力最核心的考点。'
      },
      {
        q: 'What do critics say about the project?',
        opts: ['It is too expensive to expand.', 'It is dangerous for cyclists.', 'It produces too little energy in winter.', 'It occupies too much farmland.'],
        answer: 0,
        why: 'however 之后必有考点。"cost is far higher... question whether it can be scaled up" 对应 "too expensive to expand"。'
      }
    ],
    tip: '新闻报道题记住三个位置：① 首句必考（主旨）② however / but 之后必考（转折）③ 数字和地名附近必考。听之前先扫一眼选项，圈出重复出现的词，那就是主题。'
  },

  {
    id: 'cet6-02',
    year: '2018 年 12 月',
    type: 'Long Conversation',
    typeCN: '长对话',
    title: 'Work-Life Balance in the Digital Age',
    titleCN: '数字时代的工作与生活平衡',
    level: '★★★☆☆',
    words: [
      { en: 'burnout', ph: '/ˈbɜːnaʊt/', cn: '职业倦怠' },
      { en: 'boundary', ph: '/ˈbaʊndri/', cn: '界限' },
      { en: 'productivity', ph: '/ˌprɒdʌkˈtɪvəti/', cn: '生产力、效率' },
      { en: 'flexible working', ph: '/ˈfleksəbl/', cn: '弹性工作制' }
    ],
    script: [
      { en: "Dr. Harris, many people say technology has made it impossible to switch off from work. Would you agree?", cn: '哈里斯博士，很多人说科技让人无法从工作中抽身，您同意吗？' },
      { en: "To a large extent, yes. Twenty years ago, when you left the office, work stayed at the office. Now it follows you home in your pocket.", cn: '在很大程度上是的。二十年前你离开办公室，工作就留在办公室。现在它装在你口袋里跟着你回家。' },
      { en: "So is flexible working actually making things worse?", cn: '那弹性工作制其实是让情况变糟了吗？' },
      { en: "It's a double-edged sword. Flexibility gives people control over when they work, and that generally increases satisfaction.", cn: '这是把双刃剑。灵活性让人们掌控工作时间，这通常会提升满意度。' },
      { en: "But without clear boundaries, flexible often turns into constant. Our research found that remote workers put in an extra six hours a week on average.", cn: '但没有清晰的界限，「灵活」往往变成「无时无刻」。我们的研究发现，远程工作者平均每周多干六小时。' },
      { en: "That's quite a lot. What can employees do about it?", cn: '那可不少。员工能做些什么呢？' },
      { en: "The single most effective habit is to set a fixed finishing time and physically leave the workspace, even if that means walking around the block.", cn: '最有效的习惯是设定固定的下班时间，并从身体上离开工作空间，哪怕只是绕着街区走一圈。' },
      { en: "And what about employers?", cn: '那雇主呢？' },
      { en: "Employers need to stop rewarding visible busyness. If the person who answers emails at midnight gets promoted, everyone learns the wrong lesson.", cn: '雇主需要停止奖励「看得见的忙碌」。如果半夜回邮件的人升职了，所有人都会学到错误的一课。' }
    ],
    questions: [
      {
        q: 'What does the man say about technology and work?',
        opts: ['It has made work more efficient.', 'It has blurred the line between work and home.', 'It has reduced the number of working hours.', 'It has made offices unnecessary.'],
        answer: 1,
        why: '"work... follows you home in your pocket" 是形象化表达，考的是理解而不是词汇。选项用 blurred the line 概括。'
      },
      {
        q: 'What did the research find about remote workers?',
        opts: ['They earn more than office workers.', 'They feel less satisfied with their jobs.', 'They work about six extra hours weekly.', 'They take fewer holidays.'],
        answer: 2,
        why: '数字题，"an extra six hours a week on average" 直接对应。听到数字立刻记下来，六级听力数字必考。'
      },
      {
        q: 'What is the most effective habit the man recommends?',
        opts: ['Turning off the phone at night.', 'Working fewer days per week.', 'Setting a fixed finishing time and leaving the workspace.', 'Asking for a pay rise.'],
        answer: 2,
        why: '"The single most effective..." 这种最高级表达是明确的答案信号词，听到 the most / the best / above all 就要提笔。'
      },
      {
        q: "What does the man suggest employers should stop doing?",
        opts: ['Offering flexible working.', 'Rewarding people who appear busy.', 'Hiring remote workers.', 'Sending emails at midnight.'],
        answer: 1,
        why: '"stop rewarding visible busyness" —— visible busyness 被替换成 appear busy。注意 D 选项是干扰项：原文说的是「奖励半夜回邮件的人」这个行为不对，不是「不许半夜发邮件」。'
      }
    ],
    tip: '长对话必考「问句后面那句」。采访者每问一个问题，被采访者的回答开头就是答案区。听的时候按问题顺序走，答案基本是顺序出现的。'
  },

  {
    id: 'cet6-03',
    year: '2021 年 6 月',
    type: 'Passage',
    typeCN: '短文',
    title: 'Why We Sleep',
    titleCN: '我们为什么需要睡眠',
    level: '★★★☆☆',
    words: [
      { en: 'deprivation', ph: '/ˌdeprɪˈveɪʃn/', cn: '剥夺、匮乏' },
      { en: 'consolidate', ph: '/kənˈsɒlɪdeɪt/', cn: '巩固' },
      { en: 'immune system', ph: '/ɪˈmjuːn/', cn: '免疫系统' },
      { en: 'cognitive', ph: '/ˈkɒɡnətɪv/', cn: '认知的' }
    ],
    script: [
      { en: "For a long time, sleep was regarded as a passive state, simply the absence of being awake.", cn: '长期以来，睡眠被视为一种被动状态，只是「不清醒」而已。' },
      { en: "Modern research has completely overturned that view. The sleeping brain is remarkably busy.", cn: '现代研究彻底推翻了这一看法。睡眠中的大脑异常繁忙。' },
      { en: "During deep sleep, the brain consolidates memories, transferring what you learned during the day into long-term storage.", cn: '在深度睡眠中，大脑巩固记忆，把白天学到的东西转入长期储存。' },
      { en: "This is why students who sleep well after studying remember far more than those who stay up all night.", cn: '这就是为什么学习后睡好觉的学生，记住的内容远多于通宵的人。' },
      { en: "Sleep also plays a critical role in physical health. It regulates hormones, repairs tissue and strengthens the immune system.", cn: '睡眠对身体健康也至关重要。它调节激素、修复组织、增强免疫系统。' },
      { en: "One study found that people who slept fewer than six hours a night were four times more likely to catch a cold than those who slept seven or more.", cn: '一项研究发现，每晚睡不足六小时的人感冒的概率是睡七小时以上者的四倍。' },
      { en: "The costs of sleep deprivation go beyond the individual. Tired drivers cause thousands of accidents every year.", cn: '睡眠不足的代价不止于个人。疲劳驾驶每年造成数千起事故。' },
      { en: "Yet in many cultures, sleeping less is still worn as a badge of honour, a sign of dedication and toughness.", cn: '然而在许多文化中，少睡仍被当作荣誉勋章，是敬业和坚韧的标志。' },
      { en: "Researchers argue that this attitude needs to change. Sleep is not a luxury; it is a biological necessity.", cn: '研究者认为这种观念必须改变。睡眠不是奢侈品，而是生物必需品。' }
    ],
    questions: [
      {
        q: 'How was sleep viewed in the past?',
        opts: ['As a waste of valuable time.', 'As a passive state of inactivity.', 'As a cure for physical illness.', 'As the most important part of the day.'],
        answer: 1,
        why: '开头 "regarded as a passive state" 原词复现。短文听力开头两句一定是主旨或背景，必考。'
      },
      {
        q: 'What happens in the brain during deep sleep?',
        opts: ['It shuts down completely.', 'It produces new brain cells.', 'It moves memories into long-term storage.', 'It slows the heart rate.'],
        answer: 2,
        why: '"consolidates memories, transferring... into long-term storage" 直接对应。'
      },
      {
        q: 'What did the study about colds find?',
        opts: ['Short sleepers are four times more likely to catch a cold.', 'Sleeping seven hours prevents all illness.', 'Colds make people sleep longer.', 'Sleep has no effect on immunity.'],
        answer: 0,
        why: '典型的比较级 + 倍数题。"four times more likely" 听到就要立刻记。'
      },
      {
        q: 'What is the speaker\'s attitude toward "sleeping less as a badge of honour"?',
        opts: ['Supportive.', 'Neutral.', 'Critical.', 'Amused.'],
        answer: 2,
        why: '态度题。"Yet..." 转折 + "this attitude needs to change" 明确表达否定。态度题的答案往往在最后两句。'
      }
    ],
    tip: '短文听力的黄金结构：开头提出现象 → 中间举研究/例子 → 结尾给观点。四道题基本对应这四段。最后一题几乎总是「作者态度」或「主旨」。'
  },

  {
    id: 'cet6-04',
    year: '2017 年 12 月',
    type: 'Lecture',
    typeCN: '讲座',
    title: 'The Psychology of Money',
    titleCN: '金钱心理学',
    level: '★★★★☆',
    words: [
      { en: 'irrational', ph: '/ɪˈræʃənl/', cn: '非理性的' },
      { en: 'loss aversion', ph: '/əˈvɜːʃn/', cn: '损失厌恶' },
      { en: 'behavioural economics', ph: '/bɪˈheɪvjərəl/', cn: '行为经济学' },
      { en: 'bias', ph: '/ˈbaɪəs/', cn: '偏见、偏差' }
    ],
    script: [
      { en: "Traditional economics assumes that people are rational — that we weigh costs and benefits and then choose the best option.", cn: '传统经济学假定人是理性的——我们权衡成本与收益，然后选择最优方案。' },
      { en: "Anyone who has ever bought something they didn't need knows this isn't quite true.", cn: '任何买过自己不需要的东西的人都知道，事情并非如此。' },
      { en: "Behavioural economics studies the gap between how we should decide and how we actually decide.", cn: '行为经济学研究的正是「我们应该怎么决策」与「我们实际怎么决策」之间的落差。' },
      { en: "One of the most powerful findings is loss aversion. Losing one hundred pounds hurts roughly twice as much as gaining one hundred pounds feels good.", cn: '最有力的发现之一是损失厌恶。损失一百英镑带来的痛苦，大约是获得一百英镑带来快乐的两倍。' },
      { en: "This explains why investors hold on to falling stocks far too long. Selling would make the loss real, so they wait, and often lose more.", cn: '这解释了为什么投资者会死守下跌的股票。卖出意味着承认亏损，所以他们等待，结果往往亏得更多。' },
      { en: "Another bias is mental accounting. We treat money differently depending on where it comes from.", cn: '另一个偏差是心理账户。我们会因为钱的来源不同而区别对待它。' },
      { en: "A thousand pounds won in a lottery is spent much more freely than a thousand pounds earned through overtime, even though the money is identical.", cn: '彩票中的一千英镑花起来比加班挣的一千英镑随意得多，尽管钱完全一样。' },
      { en: "There is also the anchoring effect. The first number we see shapes everything that follows.", cn: '还有锚定效应。我们看到的第一个数字会塑造之后的一切判断。' },
      { en: "That is precisely why shops display the original price next to the discounted one.", cn: '这正是商店把原价标在折扣价旁边的原因。' },
      { en: "The practical lesson is not that we are stupid, but that our instincts were built for a very different world.", cn: '实际的启示不是我们愚蠢，而是我们的直觉是为一个完全不同的世界准备的。' },
      { en: "Once you can name these biases, you are far less likely to be controlled by them.", cn: '一旦你能叫出这些偏差的名字，你就不太容易被它们操控了。' }
    ],
    questions: [
      {
        q: 'What does traditional economics assume about people?',
        opts: ['They always seek the lowest price.', 'They make rational cost-benefit decisions.', 'They are influenced by advertising.', 'They save more than they spend.'],
        answer: 1,
        why: '开篇定义句，"assumes that people are rational — we weigh costs and benefits"。'
      },
      {
        q: 'According to the lecture, why do investors keep falling stocks?',
        opts: ['They expect prices to rise soon.', 'They lack information about the market.', 'Selling would make the loss feel real.', 'They are advised to do so by brokers.'],
        answer: 2,
        why: '"Selling would make the loss real, so they wait" 原文几乎原句给出。这是损失厌恶最经典的例子，也是理财必懂的概念。'
      },
      {
        q: 'What is "mental accounting"?',
        opts: ['Keeping a written record of all spending.', 'Treating money differently based on its source.', 'Calculating interest in your head.', 'Setting a monthly budget.'],
        answer: 1,
        why: '定义题。听到 "Another bias is X. We..." 这个结构，紧跟的一句就是定义。'
      },
      {
        q: 'What is the speaker\'s main conclusion?',
        opts: ['People should never trust their instincts.', 'Economics should be taught in schools.', 'Recognizing our biases helps us resist them.', 'Shops should not display original prices.'],
        answer: 2,
        why: '结尾句 "Once you can name these biases, you are far less likely to be controlled by them"。讲座题的最后一题几乎永远考结尾结论。'
      }
    ],
    tip: '讲座题最难，但结构最清楚：总论点 → 分论点 1、2、3（每个都有例子）→ 总结。听到 One of the most... / Another... / There is also... 就是在数分论点，每个分论点对应一道题。这篇的三个概念（损失厌恶、心理账户、锚定效应）也是你学基金股票必须懂的，一举两得。'
  }
];
