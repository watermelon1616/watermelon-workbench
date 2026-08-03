/* ========== 六级听力语料库 · 续 ========== */

LISTENING_CORPUS.push(

  {
    id: 'cet6-05',
    year: '2020 年 9 月',
    type: 'News Report',
    typeCN: '新闻报道',
    title: 'Cashless Society',
    titleCN: '无现金社会',
    level: '★★☆☆☆',
    words: [
      { en: 'transaction', ph: '/trænˈzækʃn/', cn: '交易' },
      { en: 'vulnerable', ph: '/ˈvʌlnərəbl/', cn: '脆弱的、易受影响的' },
      { en: 'convenience', ph: '/kənˈviːniəns/', cn: '便利' },
      { en: 'anonymity', ph: '/ˌænəˈnɪməti/', cn: '匿名性' }
    ],
    script: [
      { en: "Sweden is on track to become the world's first cashless society, with notes and coins now used in fewer than one in ten transactions.", cn: '瑞典有望成为世界首个无现金社会，纸币和硬币目前在不到十分之一的交易中使用。' },
      { en: "Many shops and cafes have simply stopped accepting cash, displaying signs that say card only.", cn: '许多商店和咖啡馆干脆不再收现金，贴出「仅限刷卡」的标识。' },
      { en: "Supporters argue that going cashless cuts costs, reduces robbery and makes tax evasion much harder.", cn: '支持者认为无现金化能降低成本、减少抢劫，也让逃税困难得多。' },
      { en: "But the central bank has warned that the shift is happening too fast, leaving vulnerable groups behind.", cn: '但中央银行警告，这一转变发生得太快，让弱势群体被落下。' },
      { en: "Elderly people and rural residents, who are less comfortable with smartphones, are finding everyday shopping increasingly difficult.", cn: '不太会用智能手机的老年人和农村居民，日常购物越来越困难。' },
      { en: "There are also concerns about privacy, since every digital payment leaves a permanent record.", cn: '还有隐私方面的担忧，因为每笔数字支付都会留下永久记录。' },
      { en: "Parliament is now considering a law that would require banks to continue offering cash services.", cn: '议会目前正在考虑一项法律，要求银行继续提供现金服务。' }
    ],
    questions: [
      {
        q: 'What is reported about Sweden?',
        opts: ['It has banned the use of cash.', 'It may become the first cashless society.', 'It has the highest bank fees in Europe.', 'It is printing fewer banknotes this year.'],
        answer: 1,
        why: '首句 "on track to become the world\'s first cashless society"。注意 A 是过度推断——「很少用」不等于「禁止」，这是六级最爱设的陷阱。'
      },
      {
        q: 'What warning did the central bank give?',
        opts: ['Digital payments are not secure.', 'The change is leaving some groups behind.', 'Banks are losing too much money.', 'Card fees will rise sharply.'],
        answer: 1,
        why: 'But 之后是考点：“leaving vulnerable groups behind”。'
      },
      {
        q: 'What is Parliament considering?',
        opts: ['Making banks keep offering cash services.', 'Taxing all digital transactions.', 'Giving smartphones to elderly people.', 'Closing rural bank branches.'],
        answer: 0,
        why: '结尾句常出一道题，"require banks to continue offering cash services"。'
      }
    ],
    tip: '这篇顺便是财经素材：无现金化涉及支付成本、税收征管、金融普惠、数据隐私 —— 考公申论和面试也会用到，一鱼两吃。'
  },

  {
    id: 'cet6-06',
    year: '2019 年 12 月',
    type: 'Long Conversation',
    typeCN: '长对话',
    title: 'A Job Interview at an Accounting Firm',
    titleCN: '会计师事务所面试',
    level: '★★★☆☆',
    words: [
      { en: 'candidate', ph: '/ˈkændɪdət/', cn: '候选人' },
      { en: 'attention to detail', ph: '/əˈtenʃn/', cn: '注重细节' },
      { en: 'deadline', ph: '/ˈdedlaɪn/', cn: '截止期限' },
      { en: 'qualification', ph: '/ˌkwɒlɪfɪˈkeɪʃn/', cn: '资质、资格证' }
    ],
    script: [
      { en: "Thanks for coming in, Sarah. I see you're in your final year of an accounting degree. What attracted you to this firm?", cn: '谢谢你能来，Sarah。我看到你是会计专业大四学生。是什么吸引你来我们事务所？' },
      { en: "Two things, really. Your firm works with a lot of mid-sized manufacturers, and I'd like to understand how businesses actually run, not just how they look on paper.", cn: '主要是两点。贵所服务很多中型制造企业，我想了解企业实际是怎么运转的，而不只是纸面上的样子。' },
      { en: "That's a good answer. What would you say is your greatest strength?", cn: '回答得不错。你觉得自己最大的优势是什么？' },
      { en: "Attention to detail. In my internship, I found a duplicate payment of eight thousand yuan that had been missed for two months.", cn: '注重细节。实习时我发现了一笔被漏掉两个月的八千元重复付款。' },
      { en: "How did you find it?", cn: '你是怎么发现的？' },
      { en: "I was reconciling the supplier ledger and noticed the same invoice number appearing twice with different dates.", cn: '我在核对供应商明细账时，注意到同一个发票号出现了两次，日期不同。' },
      { en: "Good. Now, this job involves tight deadlines, especially during the busy season. How do you handle pressure?", cn: '很好。这份工作有很紧的截止期限，尤其在忙季。你怎么应对压力？' },
      { en: "I break large tasks into smaller ones and set my own internal deadlines a day early. That way, if something goes wrong, there's still a buffer.", cn: '我把大任务拆成小任务，并给自己设定提前一天的内部截止时间。这样即使出问题也还有缓冲。' },
      { en: "And what about the CPA qualification?", cn: '注册会计师资格方面呢？' },
      { en: "I've passed two papers already and plan to take two more next year. I know the firm supports study leave, which is one reason I applied.", cn: '我已经通过两门，计划明年再考两门。我知道贵所支持备考假，这也是我申请的原因之一。' }
    ],
    questions: [
      {
        q: 'Why is Sarah interested in this firm?',
        opts: ['It offers the highest salary.', 'It works with mid-sized manufacturers.', 'It is close to her university.', 'It has offices overseas.'],
        answer: 1,
        why: '"Your firm works with a lot of mid-sized manufacturers" 直接给出。听到 "Two things, really" 就知道后面要给两个理由，注意别只听到一半。'
      },
      {
        q: 'What example does Sarah give of her strength?',
        opts: ['She trained new interns.', 'She designed a new filing system.', 'She discovered a duplicate payment.', 'She reduced the company\'s tax bill.'],
        answer: 2,
        why: '举例题。"found a duplicate payment of eight thousand yuan" —— 顺便记住 duplicate payment（重复付款）这个会计常用词。'
      },
      {
        q: 'How does Sarah deal with pressure?',
        opts: ['She works overtime every day.', 'She asks colleagues for help.', 'She sets her own earlier deadlines.', 'She takes regular breaks.'],
        answer: 2,
        why: '"set my own internal deadlines a day early" —— 这个答案本身也是很好的面试话术，可以直接背下来用。'
      },
      {
        q: 'What do we learn about Sarah\'s CPA progress?',
        opts: ['She has passed all the papers.', 'She has passed two papers.', 'She has not started yet.', 'She failed two papers last year.'],
        answer: 1,
        why: '数字细节题，"passed two papers already"。注意后半句 "plan to take two more" 是干扰。'
      }
    ],
    tip: '这篇对你来说是双重价值：既是听力真题，也是一份现成的英文面试答案模板。Sarah 的三个回答（为什么选我们 / 你的优势 / 抗压能力）可以直接改成你自己的版本背下来。'
  },

  {
    id: 'cet6-07',
    year: '2022 年 6 月',
    type: 'Passage',
    typeCN: '短文',
    title: 'The Value of Failure',
    titleCN: '失败的价值',
    level: '★★★☆☆',
    words: [
      { en: 'resilience', ph: '/rɪˈzɪliəns/', cn: '韧性、复原力' },
      { en: 'setback', ph: '/ˈsetbæk/', cn: '挫折' },
      { en: 'perfectionism', ph: '/pəˈfekʃənɪzəm/', cn: '完美主义' },
      { en: 'mindset', ph: '/ˈmaɪndset/', cn: '思维模式' }
    ],
    script: [
      { en: "In many education systems, failure is treated as something to be avoided at all costs.", cn: '在许多教育体系中，失败被视为必须不惜代价避免的事。' },
      { en: "Students learn early that mistakes lower their scores, so they choose the safe option again and again.", cn: '学生很早就学会，犯错会拉低分数，于是一次又一次选择安全的选项。' },
      { en: "Psychologist Carol Dweck calls this a fixed mindset — the belief that ability is something you either have or don't.", cn: '心理学家卡罗尔·德韦克称之为固定型思维——认为能力要么有要么没有。' },
      { en: "In contrast, people with a growth mindset see ability as something that develops through effort.", cn: '相比之下，成长型思维的人认为能力是通过努力发展出来的。' },
      { en: "For them, a poor result is not a verdict on their intelligence; it is information about what to practise next.", cn: '对他们而言，糟糕的结果不是对智力的判决，而是关于下一步该练什么的信息。' },
      { en: "Research in several countries shows that students praised for effort rather than talent take on harder problems and give up less easily.", cn: '多国研究显示，因努力而非天赋受到表扬的学生，会挑战更难的题目，也更不容易放弃。' },
      { en: "This does not mean that failure is automatically useful. Failing without reflection simply repeats itself.", cn: '这并不意味着失败自动有用。不加反思的失败只会重复自己。' },
      { en: "What turns a setback into progress is the habit of asking one specific question: what exactly went wrong, and what will I do differently?", cn: '把挫折变成进步的，是养成问一个具体问题的习惯：到底哪里错了，我下次要怎么做不同。' },
      { en: "Those who build that habit early tend to recover faster from difficulties throughout their lives.", cn: '早早养成这个习惯的人，一生中从困难中恢复的速度都更快。' }
    ],
    questions: [
      {
        q: 'What do students learn early in many education systems?',
        opts: ['That effort matters more than talent.', 'That mistakes reduce their scores.', 'That teachers dislike questions.', 'That competition is unhealthy.'],
        answer: 1,
        why: '"mistakes lower their scores" 同义替换成 reduce their scores。'
      },
      {
        q: 'How do people with a growth mindset view a poor result?',
        opts: ['As proof of low intelligence.', 'As bad luck.', 'As information about what to practise.', 'As a reason to change subjects.'],
        answer: 2,
        why: '"it is information about what to practise next" 几乎原句。对比结构 In contrast 之后必考。'
      },
      {
        q: 'What does the speaker say about failure itself?',
        opts: ['It is always valuable.', 'It is useful only with reflection.', 'It should be avoided when possible.', 'It affects young people most.'],
        answer: 1,
        why: '这题最容易错。"This does not mean that failure is automatically useful" —— 六级特别爱考这种「限定与反驳」的句子，听到 does not mean 就要警觉。'
      },
      {
        q: 'What habit turns a setback into progress?',
        opts: ['Asking what went wrong and what to change.', 'Talking to friends about it.', 'Trying the same method again.', 'Setting easier goals.'],
        answer: 0,
        why: '结尾具体建议题。这个问题本身你也可以拿去用：每次考砸或事情没做好，就问自己这两句。'
      }
    ],
    tip: '这篇的内容和你的「自我提升」播客是一条线的。听完可以顺手把 growth mindset / fixed mindset 记进单词本 —— 这两个词在考研英语、面试和申论里都能用。'
  },

  {
    id: 'cet6-08',
    year: '2023 年 6 月',
    type: 'Lecture',
    typeCN: '讲座',
    title: 'How Inflation Affects Ordinary People',
    titleCN: '通货膨胀如何影响普通人',
    level: '★★★★☆',
    words: [
      { en: 'inflation', ph: '/ɪnˈfleɪʃn/', cn: '通货膨胀' },
      { en: 'purchasing power', ph: '/ˈpɜːtʃəsɪŋ/', cn: '购买力' },
      { en: 'wage', ph: '/weɪdʒ/', cn: '工资' },
      { en: 'interest rate', ph: '/ˈɪntrəst reɪt/', cn: '利率' }
    ],
    script: [
      { en: "Let's start with a simple definition. Inflation is a sustained rise in the general level of prices.", cn: '我们从一个简单的定义开始。通货膨胀是物价总水平的持续上涨。' },
      { en: "Notice two words: sustained and general. A one-off jump in the price of tomatoes is not inflation.", cn: '注意两个词：持续的、总体的。西红柿价格一次性上涨不是通货膨胀。' },
      { en: "The most important effect of inflation is on purchasing power. If prices rise five percent and your income stays the same, you have effectively taken a five percent pay cut.", cn: '通胀最重要的影响是购买力。如果物价上涨 5% 而你的收入不变，你实际上被减薪了 5%。' },
      { en: "But inflation does not hit everyone equally. This is the part most textbooks skip.", cn: '但通胀并非对所有人一视同仁。这是大多数教科书跳过的部分。' },
      { en: "Borrowers often benefit, because they repay loans with money that is worth less than when they borrowed it.", cn: '借款人往往受益，因为他们还款用的钱比借时更不值钱。' },
      { en: "Savers who keep cash in low-interest accounts lose out, since their money quietly shrinks in real terms.", cn: '把现金放在低息账户的储户则受损，因为他们的钱在实际价值上悄悄缩水。' },
      { en: "People on fixed incomes, such as pensioners, are usually hit hardest of all.", cn: '领取固定收入的人，比如退休人员，通常受打击最大。' },
      { en: "Central banks respond mainly by raising interest rates, which makes borrowing more expensive and cools demand.", cn: '央行主要通过提高利率来应对，这让借贷成本上升，从而给需求降温。' },
      { en: "The trade-off is that higher rates can slow growth and increase unemployment, so timing matters enormously.", cn: '代价是高利率可能拖慢增长、推高失业率，所以时机至关重要。' },
      { en: "For an individual, the practical takeaway is this: holding all your money in cash is not the safe choice people imagine.", cn: '对个人而言，实际的启示是：把所有钱都放成现金，并不是人们想象中的安全选择。' }
    ],
    questions: [
      {
        q: 'Which two words are key to the definition of inflation?',
        opts: ['Rapid and unexpected.', 'Sustained and general.', 'Global and permanent.', 'Small and gradual.'],
        answer: 1,
        why: '"Notice two words: sustained and general" —— 讲座里出现 Notice / Remember / The key word is，后面必是考点。'
      },
      {
        q: 'Who tends to benefit from inflation?',
        opts: ['Savers with cash in the bank.', 'People on fixed incomes.', 'Borrowers repaying loans.', 'Pensioners.'],
        answer: 2,
        why: '"Borrowers often benefit" 直接给出。这个知识点在你学理财时非常关键：通胀期间，负债的实际负担在下降。'
      },
      {
        q: 'How do central banks usually respond to inflation?',
        opts: ['By printing more money.', 'By raising interest rates.', 'By lowering taxes.', 'By fixing prices.'],
        answer: 1,
        why: '"respond mainly by raising interest rates"。记住这条因果链：通胀↑ → 加息 → 借贷成本↑ → 需求降温。'
      },
      {
        q: 'What is the practical takeaway for individuals?',
        opts: ['Cash is the safest place for all your money.', 'Holding only cash is not as safe as it seems.', 'One should borrow as much as possible.', 'Interest rates never affect ordinary people.'],
        answer: 1,
        why: '结尾结论句。注意 C 是典型的极端化干扰项 —— 六级选项里出现 all / never / must / only，八成是错的。'
      }
    ],
    tip: '这一篇你要精听两遍：第一遍当听力，第二遍当财经课。通胀、购买力、利率、加息传导 —— 这是你看懂财经新闻的第一块基石，直接对应「新闻热点」板块里的内容。'
  }
);
