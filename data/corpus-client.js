/* ==================== 三、接待客户口语 ==================== */

SPEAKING_CORPUS.client = {
  name: '接待客户',
  emoji: '🤝',
  color: '#FF5C6E',
  desc: '从机场接机到工厂参观、商务宴请、送别，全流程话术',

  dialogs: [
    {
      topic: '机场接机',
      scene: '举牌接到客户的第一句话',
      lines: [
        { r: 'A', en: "Excuse me, are you Mr. Anderson from Bright Retail?", cn: '打扰一下，请问您是 Bright Retail 的 Anderson 先生吗？' },
        { r: 'B', en: "Yes, that's me.", cn: '是的，我是。' },
        { r: 'A', en: "Wonderful. I'm Lily from Sunrise Ceramics. Welcome to Ningbo! How was your flight?", cn: '太好了。我是 Sunrise 陶瓷的 Lily。欢迎来到宁波！飞行还顺利吗？' },
        { r: 'B', en: "A bit long, but smooth. Thank you for coming to pick me up.", cn: '有点久，但还算顺利。谢谢你来接我。' },
        { r: 'A', en: "It's my pleasure. Let me help you with your luggage. Our car is just outside — it's about a 40-minute drive to the hotel.", cn: '这是我应该做的。我来帮您拿行李。车就在外面，到酒店大概 40 分钟车程。' },
        { r: 'B', en: "Great, I could use a shower.", cn: '太好了，我想冲个澡。' },
        { r: 'A', en: "Of course. I've already checked you in, so you can go straight up to your room. Would you like to rest today, or shall we visit the factory this afternoon?", cn: '当然。我已经帮您办好入住，可以直接上房间。您今天想休息，还是下午参观工厂？' }
      ]
    },
    {
      topic: '公司接待与寒暄',
      scene: '客户到访公司前台 / 会议室',
      lines: [
        { r: 'A', en: "Good morning, Ms. Chen. Welcome to our company. Did you find us easily?", cn: '早上好，陈女士。欢迎来到我们公司，路上好找吗？' },
        { r: 'B', en: "Yes, the directions you sent were very clear.", cn: '嗯，你发的路线说明很清楚。' },
        { r: 'A', en: "I'm glad. Please have a seat. Would you prefer coffee, green tea, or just water?", cn: '那就好。请坐。您喝咖啡、绿茶还是白水？' },
        { r: 'B', en: "Green tea would be lovely.", cn: '绿茶就好。' },
        { r: 'A', en: "Coming right up. Before we start, let me briefly introduce our team. This is Mr. Wang, our production manager, and Ms. Liu from quality control.", cn: '马上来。开始之前，我先介绍一下团队。这位是生产经理王先生，这位是质检部的刘女士。' },
        { r: 'B', en: "Nice to meet you both.", cn: '很高兴认识两位。' },
        { r: 'A', en: "We've prepared a short presentation, and then we'd love to hear more about what you're looking for. Shall we begin?", cn: '我们准备了一个简短的介绍，之后很想听听您的需求。我们可以开始了吗？' }
      ]
    },
    {
      topic: '工厂参观讲解',
      scene: '带客户走产线',
      lines: [
        { r: 'A', en: "This way, please. Watch your step — the floor can be slippery here.", cn: '这边请。小心脚下，这里地面有点滑。' },
        { r: 'B', en: "Thanks. How many production lines do you have?", cn: '谢谢。你们有多少条生产线？' },
        { r: 'A', en: "Six in total. This one is dedicated to export orders, with a daily capacity of about 12,000 pieces.", cn: '一共六条。这条专门做出口订单，日产能约 12000 件。' },
        { r: 'B', en: "Impressive. What about quality control?", cn: '很不错。质量控制是怎么做的？' },
        { r: 'A', en: "We inspect at three stages: incoming materials, in-process, and final random inspection before packing. Every batch has a traceable record.", cn: '我们分三个阶段检验：来料、过程中，以及包装前的成品抽检。每一批都有可追溯记录。' },
        { r: 'B', en: "Can I see the testing lab?", cn: '我可以看看检测室吗？' },
        { r: 'A', en: "Absolutely, it's right through that door. Please feel free to ask anything — and take photos if you'd like.", cn: '当然可以，就在那扇门后。有任何问题请随时问，想拍照也没关系。' }
      ]
    },
    {
      topic: '商务宴请',
      scene: '晚宴上的得体表达',
      lines: [
        { r: 'A', en: "I hope you like Chinese food. This restaurant is famous for local seafood.", cn: '希望您喜欢中餐。这家店以本地海鲜出名。' },
        { r: 'B', en: "I love trying new things. What do you recommend?", cn: '我很喜欢尝试新东西。你推荐什么？' },
        { r: 'A', en: "The steamed fish is excellent — very fresh and not spicy at all. Do you have any dietary restrictions or allergies I should know about?", cn: '清蒸鱼很棒，非常新鲜，一点都不辣。您有什么饮食禁忌或过敏需要我注意的吗？' },
        { r: 'B', en: "No allergies, but I don't eat too much spicy food.", cn: '没有过敏，但我不太能吃辣。' },
        { r: 'A', en: "Noted, I'll keep the dishes mild. Let me propose a toast — to a successful cooperation and to your first visit to China. Cheers!", cn: '记下了，我会点清淡些的。我提议干一杯——祝合作顺利，也祝贺您首次来中国。干杯！' },
        { r: 'B', en: "Cheers! Thank you for the warm hospitality.", cn: '干杯！谢谢你们的热情款待。' },
        { r: 'A', en: "You're very welcome. Please, help yourself — don't be shy.", cn: '不客气。请随意用，别客气。' }
      ]
    },
    {
      topic: '处理客户不满',
      scene: '客户当面表达不满时',
      lines: [
        { r: 'A', en: "To be frank, I'm not happy about the delay on the last order.", cn: '坦白说，上一单的延误让我很不满意。' },
        { r: 'B', en: "I completely understand, and I want to apologize personally. You were right to raise this.", cn: '我完全理解，我个人向您道歉。您提出这个问题是完全应该的。' },
        { r: 'A', en: "So what happened?", cn: '到底发生了什么？' },
        { r: 'B', en: "Our glaze supplier changed their formula without notice, and we had to re-test everything. We should have informed you the same day instead of waiting.", cn: '我们的釉料供应商未经通知更改了配方，我们不得不重新检测。我们本该当天就告知您，而不是拖着。' },
        { r: 'A', en: "That's the part that bothered me — the silence.", cn: '让我不舒服的正是这一点——你们的沉默。' },
        { r: 'B', en: "You're absolutely right. From now on, I'll send you a short weekly update, good news or bad. And for this order, we'll cover the extra air freight.", cn: '您说得完全对。从现在起，无论好消息坏消息，我每周都会给您一个简短更新。这一单额外的空运费由我们承担。' },
        { r: 'A', en: "I appreciate that.", cn: '我很感谢。' }
      ]
    },
    {
      topic: '送别客户',
      scene: '结束行程时',
      lines: [
        { r: 'A', en: "It's been a real pleasure having you here these three days.", cn: '这三天招待您真的很愉快。' },
        { r: 'B', en: "Thank you for everything. The factory visit was very helpful.", cn: '谢谢你们的一切安排，工厂参观非常有帮助。' },
        { r: 'A', en: "I'm glad. Here's a small gift — it's a local tea from our region. Nothing expensive, just a token of our appreciation.", cn: '我很高兴。这是一点小礼物，我们本地的茶叶。不贵重，只是一点心意。' },
        { r: 'B', en: "That's very thoughtful of you.", cn: '你们太贴心了。' },
        { r: 'A', en: "I'll email you the revised quotation and the sample tracking number by Friday. Have a safe trip home, and please give my regards to your team.", cn: '我会在周五前把修订报价和样品单号邮件发您。祝您旅途平安，也请代我向团队问好。' },
        { r: 'B', en: "I will. Let's keep in touch.", cn: '会的，保持联系。' },
        { r: 'A', en: "Definitely. Looking forward to seeing you again soon.", cn: '一定。期待很快再见到您。' }
      ]
    },
    {
      topic: '电话与线上会议',
      scene: '视频会议开场与收尾',
      lines: [
        { r: 'A', en: "Hi everyone, can you hear me clearly?", cn: '大家好，能清楚听到我说话吗？' },
        { r: 'B', en: "Yes, loud and clear.", cn: '可以，很清楚。' },
        { r: 'A', en: "Great. Thanks for making the time. Today I'd like to cover three things: the sample feedback, the revised pricing, and the shipping schedule.", cn: '很好，感谢各位抽时间。今天我想讲三件事：样品反馈、修订价格和发货时间表。' },
        { r: 'B', en: "Sounds good. Let's start with the samples.", cn: '好的，从样品开始吧。' },
        { r: 'A', en: "Sure. Let me share my screen... Can you see the slide?", cn: '好的。我共享一下屏幕……能看到幻灯片吗？' },
        { r: 'B', en: "Yes.", cn: '能看到。' },
        { r: 'A', en: "Perfect. To wrap up — I'll send the minutes today, and we'll follow up next Tuesday. Thank you all for your time.", cn: '很好。最后总结一下——我今天会发会议纪要，下周二我们再跟进。谢谢大家。' }
      ]
    }
  ],

  words: [
    { en: 'hospitality', ph: "/ˌhɒspɪˈtæləti/", cn: '热情款待' },
    { en: 'itinerary', ph: "/aɪˈtɪnərəri/", cn: '行程安排' },
    { en: 'appointment', ph: "/əˈpɔɪntmənt/", cn: '预约、会面' },
    { en: 'reception', ph: "/rɪˈsepʃn/", cn: '接待、前台' },
    { en: 'courtesy', ph: "/ˈkɜːtəsi/", cn: '礼节、客气' },
    { en: 'business card', ph: "/ˈbɪznəs kɑːd/", cn: '名片' },
    { en: 'small talk', ph: "/smɔːl tɔːk/", cn: '寒暄、闲聊' },
    { en: 'agenda', ph: "/əˈdʒendə/", cn: '议程' },
    { en: 'presentation', ph: "/ˌpreznˈteɪʃn/", cn: '演示、介绍' },
    { en: 'facility tour', ph: "/fəˈsɪləti tʊə/", cn: '参观厂区' },
    { en: 'production line', ph: "/prəˈdʌkʃn laɪn/", cn: '生产线' },
    { en: 'capacity', ph: "/kəˈpæsəti/", cn: '产能' },
    { en: 'quality control (QC)', ph: "/ˈkwɒləti/", cn: '质量控制' },
    { en: 'traceability', ph: "/ˌtreɪsəˈbɪləti/", cn: '可追溯性' },
    { en: 'banquet', ph: "/ˈbæŋkwɪt/", cn: '宴会' },
    { en: 'toast', ph: "/təʊst/", cn: '祝酒' },
    { en: 'dietary restriction', ph: "/ˈdaɪətəri/", cn: '饮食禁忌' },
    { en: 'souvenir', ph: "/ˌsuːvəˈnɪə/", cn: '纪念品' },
    { en: 'accommodate', ph: "/əˈkɒmədeɪt/", cn: '容纳、迁就安排' },
    { en: 'follow up', ph: "/ˈfɒləʊ ʌp/", cn: '跟进' },
    { en: 'minutes (of meeting)', ph: "/ˈmɪnɪts/", cn: '会议纪要' },
    { en: 'sincerely', ph: "/sɪnˈsɪəli/", cn: '真诚地' },
    { en: 'complaint', ph: "/kəmˈpleɪnt/", cn: '投诉' },
    { en: 'compensation', ph: "/ˌkɒmpenˈseɪʃn/", cn: '补偿' },
    { en: 'reassure', ph: "/ˌriːəˈʃʊə/", cn: '使安心、打消顾虑' },
    { en: 'rapport', ph: "/ræˈpɔː/", cn: '融洽关系' },
    { en: 'punctual', ph: "/ˈpʌŋktʃuəl/", cn: '守时的' },
    { en: 'shuttle / pick-up', ph: "/ˈʃʌtl/", cn: '接送' },
    { en: 'check in / check out', ph: "/tʃek ɪn/", cn: '入住 / 退房' },
    { en: 'jet lag', ph: "/dʒet læɡ/", cn: '时差反应' }
  ],

  sentences: [
    { en: "Welcome! We've been looking forward to your visit.", cn: '欢迎！我们一直期待您的到访。' },
    { en: "How was your flight? I hope you managed to get some rest.", cn: '飞行还顺利吗？希望您休息得还好。' },
    { en: "Please let me know if there's anything you need during your stay.", cn: '您在这里期间有任何需要请告诉我。' },
    { en: "May I take your coat?", cn: '我帮您把外套挂起来好吗？' },
    { en: "Would you prefer coffee, tea, or something cold?", cn: '您想喝咖啡、茶还是冷饮？' },
    { en: "Let me introduce my colleague, who's in charge of production.", cn: '我来介绍一下我的同事，他负责生产。' },
    { en: "Please feel free to ask questions at any point.", cn: '任何时候有问题都请随时提出。' },
    { en: "Watch your step, please.", cn: '请小心脚下。' },
    { en: "I'd be happy to walk you through the whole process.", cn: '我很乐意带您了解整个流程。' },
    { en: "That's a great question — let me check and give you an accurate answer.", cn: '这个问题很好——我确认一下，给您一个准确的答复。' },
    { en: "I'm sorry, I didn't quite catch that. Could you say it again?", cn: '抱歉，我没太听清，能再说一遍吗？' },
    { en: "Thank you for pointing that out. We'll fix it right away.", cn: '谢谢您指出来，我们会马上改正。' },
    { en: "I completely understand how you feel, and I apologize.", cn: '我完全理解您的感受，向您致歉。' },
    { en: "Let me see what I can do and get back to you within the hour.", cn: '我看看能怎么处理，一小时内回复您。' },
    { en: "Shall we take a short break and continue in ten minutes?", cn: '我们休息一下，十分钟后继续好吗？' },
    { en: "I've prepared a small gift for you — just a token of our appreciation.", cn: '我给您准备了一份小礼物，只是一点心意。' },
    { en: "It's been a real pleasure meeting you.", cn: '认识您非常愉快。' },
    { en: "Have a safe trip, and please give my regards to your team.", cn: '一路平安，请代我向您的团队问好。' },
    { en: "I'll send you a summary of what we discussed today.", cn: '我会把今天讨论的内容整理后发给您。' },
    { en: "Let's stay in touch — my WeChat and email are both on the card.", cn: '保持联系——我的微信和邮箱都在名片上。' }
  ]
};
