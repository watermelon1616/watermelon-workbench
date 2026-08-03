/* ==========================================================
   口语语料库 —— 三大类
   accounting  会计专业英语
   trade       外贸沟通
   client      接待客户
   每天自动轮换，同一天内容固定
   ========================================================== */

const SPEAKING_CORPUS = {

  /* ==================== 一、会计专业口语 ==================== */
  accounting: {
    name: '会计专业',
    emoji: '📊',
    color: '#3FAE7B',
    desc: '大二会计学必备：从记账到报表，能用英文说清楚',

    dialogs: [
      {
        topic: '自我介绍 · 会计专业学生',
        scene: '实习面试 / 社团面试常用开场',
        lines: [
          { r: 'A', en: "Could you tell me a little about yourself?", cn: '可以简单介绍一下你自己吗？' },
          { r: 'B', en: "Sure. I'm a sophomore majoring in Accounting. I've finished Basic Accounting and I'm now taking Intermediate Financial Accounting.", cn: '好的。我是会计学大二学生，已经学完基础会计，现在在学中级财务会计。' },
          { r: 'A', en: "What made you choose accounting?", cn: '你为什么选会计这个专业？' },
          { r: 'B', en: "I like the fact that accounting is the language of business. Numbers never lie, and I enjoy making messy information clear and reliable.", cn: '我喜欢“会计是商业的语言”这一点。数字不会骗人，我享受把混乱的信息整理清楚、变得可靠。' },
          { r: 'A', en: "Any software you're familiar with?", cn: '你熟悉哪些软件？' },
          { r: 'B', en: "I'm comfortable with Excel — VLOOKUP, PivotTables and basic financial modeling. I'm also learning Kingdee and SAP basics.", cn: '我熟练使用 Excel，包括 VLOOKUP、数据透视表和基础财务建模，也在学金蝶和 SAP 的基础操作。' }
        ]
      },
      {
        topic: '解释会计恒等式',
        scene: '课堂 pre / 面试专业问答',
        lines: [
          { r: 'A', en: "Can you explain the accounting equation in plain English?", cn: '你能用大白话解释一下会计恒等式吗？' },
          { r: 'B', en: "Of course. Assets equal liabilities plus owner's equity. Everything a company owns is funded either by what it owes, or by what the owners put in.", cn: '当然。资产 = 负债 + 所有者权益。公司拥有的一切，要么是借来的，要么是股东投的。' },
          { r: 'A', en: "Why must it always balance?", cn: '为什么它必须永远相等？' },
          { r: 'B', en: "Because of double-entry bookkeeping. Every transaction is recorded twice — one debit and one credit — so both sides always move together.", cn: '因为复式记账。每笔业务都记两次，一借一贷，所以两边永远同步变动。' },
          { r: 'A', en: "Give me an example.", cn: '举个例子。' },
          { r: 'B', en: "If we buy equipment worth 10,000 in cash, equipment goes up by 10,000 and cash goes down by 10,000. Total assets stay the same.", cn: '如果我们用现金买了一万元设备，设备增加一万，现金减少一万，总资产不变。' }
        ]
      },
      {
        topic: '三大报表',
        scene: '专业问答 / 小组讨论',
        lines: [
          { r: 'A', en: "What are the three main financial statements?", cn: '三大财务报表是什么？' },
          { r: 'B', en: "The balance sheet, the income statement, and the cash flow statement.", cn: '资产负债表、利润表和现金流量表。' },
          { r: 'A', en: "How would you describe the difference?", cn: '它们的区别你怎么描述？' },
          { r: 'B', en: "The balance sheet is a photo — it shows the financial position at one moment. The income statement is a video — it shows performance over a period.", cn: '资产负债表像一张照片，展示某一时点的财务状况；利润表像一段视频，展示一段时期的经营成果。' },
          { r: 'A', en: "And the cash flow statement?", cn: '那现金流量表呢？' },
          { r: 'B', en: "It tracks where the cash actually came from and went. A company can be profitable on paper but still run out of cash — that's why this statement matters.", cn: '它追踪现金真实的来龙去脉。一家公司账面盈利但现金断裂完全可能，所以这张表很重要。' }
        ]
      },
      {
        topic: '权责发生制 vs 收付实现制',
        scene: '课堂讨论 / 期末口试',
        lines: [
          { r: 'A', en: "What's the difference between accrual basis and cash basis?", cn: '权责发生制和收付实现制有什么区别？' },
          { r: 'B', en: "Under the accrual basis, we record revenue when it's earned and expenses when they're incurred, no matter when the cash moves.", cn: '权责发生制下，收入在赚取时确认，费用在发生时确认，跟现金什么时候动没关系。' },
          { r: 'A', en: "And the cash basis?", cn: '收付实现制呢？' },
          { r: 'B', en: "Cash basis only records things when money actually changes hands. It's simpler, but it can be misleading for a growing business.", cn: '收付实现制只在钱真正收付时才记账。更简单，但对成长中的企业容易产生误导。' },
          { r: 'A', en: "Which one do listed companies use?", cn: '上市公司用哪一种？' },
          { r: 'B', en: "The accrual basis. It's required under both CAS and IFRS because it matches revenue with the related costs.", cn: '权责发生制。中国企业会计准则和国际财务报告准则都要求这样做，因为它能把收入和相关成本匹配起来。' }
        ]
      },
      {
        topic: '月末结账',
        scene: '实习工作场景',
        lines: [
          { r: 'A', en: "How's the month-end closing going?", cn: '月末结账进行得怎么样了？' },
          { r: 'B', en: "Almost done. I've posted all the adjusting entries and I'm doing the bank reconciliation now.", cn: '快好了。调整分录都已过账，现在在做银行存款余额调节。' },
          { r: 'A', en: "Any discrepancies?", cn: '有差异吗？' },
          { r: 'B', en: "There's a small difference of 320 yuan. I suspect it's an outstanding check that hasn't cleared yet. I'll trace it back to the voucher.", cn: '有 320 元的小差异。我怀疑是一张还没兑现的未达支票，我会追到凭证去核对。' },
          { r: 'A', en: "Good. Please send me the trial balance once it's clean.", cn: '好。核平之后把试算平衡表发我。' },
          { r: 'B', en: "Will do. I'll have it ready before five.", cn: '好的，五点前给您。' }
        ]
      },
      {
        topic: '折旧的解释',
        scene: '专业问答',
        lines: [
          { r: 'A', en: "Why do we depreciate fixed assets?", cn: '为什么要对固定资产计提折旧？' },
          { r: 'B', en: "Because a fixed asset helps generate revenue over many years. Depreciation spreads its cost across those years, so the cost matches the benefit.", cn: '因为固定资产会在多年内帮助创造收入。折旧把它的成本分摊到这些年份，让成本与收益相匹配。' },
          { r: 'A', en: "Which method do you prefer?", cn: '你倾向于哪种方法？' },
          { r: 'B', en: "It depends. The straight-line method is simple and stable. The double-declining balance method recognizes more expense early on, which suits assets like computers.", cn: '看情况。直线法简单稳定；双倍余额递减法前期费用更多，适合电脑这类资产。' },
          { r: 'A', en: "Does depreciation involve cash?", cn: '折旧涉及现金吗？' },
          { r: 'B', en: "No, it's a non-cash expense. That's why we add it back in the cash flow statement.", cn: '不涉及，它是非付现费用，所以在现金流量表里要加回来。' }
        ]
      },
      {
        topic: '审计与内控',
        scene: '事务所实习面试',
        lines: [
          { r: 'A', en: "Do you know what internal control means?", cn: '你了解内部控制是什么吗？' },
          { r: 'B', en: "Yes. It's the set of procedures a company uses to protect assets, ensure accurate records and prevent fraud.", cn: '了解。它是企业用来保护资产、保证记录准确、防止舞弊的一整套程序。' },
          { r: 'A', en: "Give me one concrete example.", cn: '给我一个具体例子。' },
          { r: 'B', en: "Segregation of duties. The person who approves a payment should never be the same person who records it or handles the cash.", cn: '不相容职务分离。批准付款的人，不应该同时是记账或管钱的人。' },
          { r: 'A', en: "Why is that so important?", cn: '为什么这么重要？' },
          { r: 'B', en: "Because most fraud happens when one person controls the whole process from beginning to end.", cn: '因为大多数舞弊都发生在一个人从头管到尾的时候。' }
        ]
      },
      {
        topic: '汇报财务数据',
        scene: '小组会议',
        lines: [
          { r: 'A', en: "Could you walk us through last quarter's numbers?", cn: '能带我们过一遍上季度的数据吗？' },
          { r: 'B', en: "Sure. Revenue reached 8.6 million, up 12% year on year. Gross margin improved from 31% to 34%.", cn: '好的。营业收入 860 万，同比增长 12%。毛利率从 31% 提升到 34%。' },
          { r: 'A', en: "What drove the margin improvement?", cn: '毛利率提升的原因是什么？' },
          { r: 'B', en: "Two things: raw material prices came down, and we shifted the product mix toward higher-margin items.", cn: '两个原因：原材料价格回落，同时我们把产品结构向高毛利产品倾斜。' },
          { r: 'A', en: "Any concerns?", cn: '有什么值得担心的吗？' },
          { r: 'B', en: "Accounts receivable turnover slowed down. We should tighten the credit policy before it hurts our cash flow.", cn: '应收账款周转变慢了。建议在影响现金流之前收紧信用政策。' }
        ]
      },
      {
        topic: '税务基础',
        scene: '专业问答',
        lines: [
          { r: 'A', en: "Can you briefly explain VAT?", cn: '能简单解释一下增值税吗？' },
          { r: 'B', en: "VAT stands for value-added tax. It's charged on the value a business adds at each stage, not on the full selling price.", cn: '增值税就是对企业在每个环节新增的价值征税，而不是对全部售价征税。' },
          { r: 'A', en: "So how is it calculated?", cn: '那怎么计算呢？' },
          { r: 'B', en: "Output tax minus input tax. You collect tax from customers and deduct the tax you already paid to suppliers.", cn: '销项税额减进项税额。向客户收的税，减去已经付给供应商的税。' },
          { r: 'A', en: "What about corporate income tax?", cn: '企业所得税呢？' },
          { r: 'B', en: "The standard rate in China is 25%, but small and low-profit enterprises enjoy preferential rates.", cn: '中国的标准税率是 25%，但小型微利企业享受优惠税率。' }
        ]
      },
      {
        topic: '职业规划',
        scene: '面试高频题',
        lines: [
          { r: 'A', en: "Where do you see yourself in five years?", cn: '你怎么看未来五年的自己？' },
          { r: 'B', en: "In the short term, I want to pass the CPA exams while building solid hands-on experience in financial reporting.", cn: '短期内我想通过注会考试，同时在财务报告方面积累扎实的实操经验。' },
          { r: 'A', en: "And in the long run?", cn: '长期呢？' },
          { r: 'B', en: "I'd like to move from pure bookkeeping toward financial analysis — helping management make decisions, not just recording what already happened.", cn: '我希望从单纯记账走向财务分析——帮管理层做决策，而不只是记录已经发生的事。' },
          { r: 'A', en: "That's ambitious. What are you doing about it now?", cn: '挺有志气。你现在为此做了什么？' },
          { r: 'B', en: "I read financial news every day, practice English for cross-border work, and I'm learning Python for data analysis.", cn: '我每天读财经新闻，练习跨境工作用的英语，还在学 Python 做数据分析。' }
        ]
      }
    ],

    words: [
      { en: 'asset', ph: "/ˈæset/", cn: '资产' },
      { en: 'liability', ph: "/ˌlaɪəˈbɪləti/", cn: '负债' },
      { en: "owner's equity", ph: "/ˈəʊnəz ˈekwəti/", cn: '所有者权益' },
      { en: 'revenue', ph: "/ˈrevənjuː/", cn: '收入、营业收入' },
      { en: 'expense', ph: "/ɪkˈspens/", cn: '费用' },
      { en: 'profit / net income', ph: "/ˈprɒfɪt/", cn: '利润 / 净利润' },
      { en: 'balance sheet', ph: "/ˈbæləns ʃiːt/", cn: '资产负债表' },
      { en: 'income statement', ph: "/ˈɪnkʌm ˈsteɪtmənt/", cn: '利润表' },
      { en: 'cash flow statement', ph: "/kæʃ fləʊ/", cn: '现金流量表' },
      { en: 'double-entry bookkeeping', ph: "/ˈdʌbl ˈentri/", cn: '复式记账' },
      { en: 'debit', ph: "/ˈdebɪt/", cn: '借方' },
      { en: 'credit', ph: "/ˈkredɪt/", cn: '贷方' },
      { en: 'journal entry', ph: "/ˈdʒɜːnl ˈentri/", cn: '会计分录' },
      { en: 'ledger', ph: "/ˈledʒə/", cn: '分类账' },
      { en: 'voucher', ph: "/ˈvaʊtʃə/", cn: '记账凭证' },
      { en: 'trial balance', ph: "/ˈtraɪəl ˈbæləns/", cn: '试算平衡表' },
      { en: 'accrual basis', ph: "/əˈkruːəl ˈbeɪsɪs/", cn: '权责发生制' },
      { en: 'cash basis', ph: "/kæʃ ˈbeɪsɪs/", cn: '收付实现制' },
      { en: 'depreciation', ph: "/dɪˌpriːʃiˈeɪʃn/", cn: '折旧' },
      { en: 'amortization', ph: "/əˌmɔːtaɪˈzeɪʃn/", cn: '摊销' },
      { en: 'accounts receivable', ph: "/rɪˈsiːvəbl/", cn: '应收账款' },
      { en: 'accounts payable', ph: "/ˈpeɪəbl/", cn: '应付账款' },
      { en: 'inventory', ph: "/ˈɪnvəntri/", cn: '存货' },
      { en: 'fixed assets', ph: "/fɪkst ˈæsets/", cn: '固定资产' },
      { en: 'intangible assets', ph: "/ɪnˈtændʒəbl/", cn: '无形资产' },
      { en: 'gross margin', ph: "/ɡrəʊs ˈmɑːdʒɪn/", cn: '毛利率' },
      { en: 'net margin', ph: "/net ˈmɑːdʒɪn/", cn: '净利率' },
      { en: 'audit', ph: "/ˈɔːdɪt/", cn: '审计' },
      { en: 'auditor', ph: "/ˈɔːdɪtə/", cn: '审计师' },
      { en: 'internal control', ph: "/ɪnˈtɜːnl kənˈtrəʊl/", cn: '内部控制' },
      { en: 'segregation of duties', ph: "/ˌseɡrɪˈɡeɪʃn/", cn: '不相容职务分离' },
      { en: 'bank reconciliation', ph: "/ˌrekənsɪliˈeɪʃn/", cn: '银行存款余额调节' },
      { en: 'accrued expenses', ph: "/əˈkruːd/", cn: '应计费用' },
      { en: 'prepaid expenses', ph: "/ˌpriːˈpeɪd/", cn: '预付费用' },
      { en: 'retained earnings', ph: "/rɪˈteɪnd ˈɜːnɪŋz/", cn: '留存收益' },
      { en: 'dividend', ph: "/ˈdɪvɪdend/", cn: '股利、分红' },
      { en: 'VAT (value-added tax)', ph: "/ˌviː eɪ ˈtiː/", cn: '增值税' },
      { en: 'corporate income tax', ph: "/ˈkɔːpərət/", cn: '企业所得税' },
      { en: 'budget', ph: "/ˈbʌdʒɪt/", cn: '预算' },
      { en: 'cost accounting', ph: "/kɒst əˈkaʊntɪŋ/", cn: '成本会计' },
      { en: 'break-even point', ph: "/breɪk ˈiːvn/", cn: '盈亏平衡点' },
      { en: 'working capital', ph: "/ˈwɜːkɪŋ ˈkæpɪtl/", cn: '营运资金' },
      { en: 'liquidity', ph: "/lɪˈkwɪdəti/", cn: '流动性' },
      { en: 'solvency', ph: "/ˈsɒlvənsi/", cn: '偿债能力' },
      { en: 'write-off', ph: "/ˈraɪt ɒf/", cn: '核销、注销' },
      { en: 'impairment', ph: "/ɪmˈpeəmənt/", cn: '减值' },
      { en: 'fiscal year', ph: "/ˈfɪskl jɪə/", cn: '财政年度' },
      { en: 'month-end closing', ph: "/mʌnθ end/", cn: '月末结账' },
      { en: 'reimbursement', ph: "/ˌriːɪmˈbɜːsmənt/", cn: '报销' },
      { en: 'petty cash', ph: "/ˈpeti kæʃ/", cn: '备用金、零用金' }
    ],

    sentences: [
      { en: "Let me double-check the figures before I send the report.", cn: '在发报告之前，让我再核对一遍数字。' },
      { en: "The numbers don't add up — there must be an error somewhere.", cn: '数字对不上，肯定哪里出错了。' },
      { en: "Could you provide the supporting documents for this entry?", cn: '这笔分录能提供一下原始凭证吗？' },
      { en: "This expense should be recorded in the current period, not the next one.", cn: '这笔费用应该计入本期，而不是下期。' },
      { en: "We need to accrue the interest expense at the end of the month.", cn: '月末我们需要计提利息费用。' },
      { en: "I'll reconcile the bank statement with our cash ledger.", cn: '我会把银行对账单和现金账核对一下。' },
      { en: "The trial balance is off by 320 yuan; I'm tracing it now.", cn: '试算平衡差 320 元，我正在追查。' },
      { en: "Please make sure every voucher has an authorized signature.", cn: '请确保每张凭证都有授权签字。' },
      { en: "Our accounts receivable turnover has slowed down this quarter.", cn: '本季度我们的应收账款周转变慢了。' },
      { en: "Cash flow is tight, so let's postpone non-essential spending.", cn: '现金流比较紧张，非必要开支先缓一缓。' },
      { en: "This transaction needs to be reclassified under operating expenses.", cn: '这笔业务需要重分类到营业费用下。' },
      { en: "According to the accounting standards, we should recognize revenue upon delivery.", cn: '按照会计准则，我们应在交付时确认收入。' },
      { en: "I'd like to walk you through the key changes in this year's figures.", cn: '我想带您过一遍今年数据的关键变化。' },
      { en: "Compared with the same period last year, costs rose by 8 percent.", cn: '与去年同期相比，成本上升了 8%。' },
      { en: "That's a fair point, but the underlying data tells a slightly different story.", cn: '这个观点有道理，不过底层数据反映的情况略有不同。' },
      { en: "Let me get back to you on that after I check the ledger.", cn: '这个我查一下账再回复您。' },
      { en: "To be honest, I'm not familiar with that standard yet, but I'll look it up.", cn: '说实话我对那条准则还不熟，但我会去查。' },
      { en: "I want to make sure I understand you correctly — you mean the net figure, right?", cn: '我想确认一下我的理解——您指的是净额，对吗？' },
      { en: "The audit is scheduled for next Monday, so please have the files ready.", cn: '审计安排在下周一，请把资料准备好。' },
      { en: "This adjustment has no impact on cash, only on the reported profit.", cn: '这项调整不影响现金，只影响账面利润。' }
    ]
  }
};
