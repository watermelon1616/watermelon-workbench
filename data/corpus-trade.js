/* ==================== 二、外贸沟通口语 ==================== */

SPEAKING_CORPUS.trade = {
  name: '外贸沟通',
  emoji: '🌍',
  color: '#F2A413',
  desc: '询盘、报价、议价、下单、跟单、付款 —— 一整条链路',

  dialogs: [
    {
      topic: '回复询盘',
      scene: '收到客户第一封询价邮件后的电话跟进',
      lines: [
        { r: 'A', en: "Hello, this is Emma from Nordic Home. We received your catalog and we're interested in your ceramic mugs.", cn: '你好，我是 Nordic Home 的 Emma。我们收到了你们的目录，对陶瓷马克杯很感兴趣。' },
        { r: 'B', en: "Thank you for your interest, Emma. May I know which model caught your eye and the quantity you have in mind?", cn: '感谢您的关注，Emma。请问您看中的是哪个型号？大概考虑多少数量？' },
        { r: 'A', en: "Model M-203. We're thinking about 3,000 pieces for a trial order.", cn: 'M-203 型号。我们考虑先下 3000 个试单。' },
        { r: 'B', en: "Noted. Our MOQ is 1,000 pieces, so 3,000 works well. Could you also tell me your target port and whether you need custom printing?", cn: '好的。我们的最小起订量是 1000 个，3000 个完全可以。能否告诉我目的港，以及是否需要定制印刷？' },
        { r: 'A', en: "Rotterdam, and yes, we'd like our logo on it.", cn: '鹿特丹港，是的，我们希望印上我们的 logo。' },
        { r: 'B', en: "Understood. I'll send you a detailed quotation with CIF Rotterdam terms within 24 hours.", cn: '明白。我会在 24 小时内给您发一份 CIF 鹿特丹条款的详细报价。' }
      ]
    },
    {
      topic: '报价与条款',
      scene: '正式报价沟通',
      lines: [
        { r: 'A', en: "Could you break down the price for me?", cn: '能给我拆解一下价格吗？' },
        { r: 'B', en: "Certainly. The unit price is 2.85 US dollars FOB Ningbo. With freight and insurance, CIF Rotterdam comes to 3.42 dollars per piece.", cn: '当然。单价是 2.85 美元 FOB 宁波。加上运费和保险，CIF 鹿特丹是每个 3.42 美元。' },
        { r: 'A', en: "How long is this price valid?", cn: '这个价格有效期多久？' },
        { r: 'B', en: "The quotation is valid for 30 days. Raw material prices have been fluctuating, so I'd suggest confirming sooner rather than later.", cn: '报价有效期 30 天。原材料价格一直在波动，建议尽早确认。' },
        { r: 'A', en: "What about payment terms?", cn: '付款方式呢？' },
        { r: 'B', en: "For the first order, we usually ask for 30% T/T deposit and 70% against the copy of B/L. For long-term cooperation, we can discuss L/C at sight.", cn: '首单我们通常要求 30% 电汇定金，70% 见提单副本付款。长期合作的话，可以谈即期信用证。' }
      ]
    },
    {
      topic: '议价',
      scene: '客户压价时怎么接',
      lines: [
        { r: 'A', en: "Honestly, your price is higher than what we're getting from other suppliers.", cn: '说实话，你们的价格比其他供应商给我们的要高。' },
        { r: 'B', en: "I understand your concern. May I ask what price level you're comparing with? I'd like to make sure we're comparing the same specifications.", cn: '我理解您的顾虑。请问您对比的价格是什么水平？我想确认我们比较的是同样的规格。' },
        { r: 'A', en: "Around 2.50 dollars FOB.", cn: '大概 2.50 美元 FOB。' },
        { r: 'B', en: "That's possible with thinner walls and a lower-grade glaze. Our mugs use food-grade glaze certified by SGS, and the breakage rate in transit is under 0.5%.", cn: '如果用更薄的杯壁和低等级釉料，那个价格是可能的。我们的杯子用的是通过 SGS 认证的食品级釉料，运输破损率低于 0.5%。' },
        { r: 'A', en: "Fair enough. But can you do anything on the price?", cn: '有道理。但价格上能松动一点吗？' },
        { r: 'B', en: "If you can increase the order to 5,000 pieces, I can offer 2.70 dollars. That's the best I can do while keeping the same quality.", cn: '如果您能把订单提到 5000 个，我可以给到 2.70 美元。在保持同等品质的前提下，这是我能做到的最好价格。' }
      ]
    },
    {
      topic: '交期与生产',
      scene: '客户催单',
      lines: [
        { r: 'A', en: "We need the goods before the Christmas season. Can you make it?", cn: '我们需要在圣诞季前拿到货，你们能做到吗？' },
        { r: 'B', en: "Let me check the production schedule. Normally the lead time is 35 days after receiving the deposit and approving the sample.", cn: '我查一下生产排期。通常收到定金并确认样品后，交期是 35 天。' },
        { r: 'A', en: "That's cutting it close.", cn: '那时间就很紧了。' },
        { r: 'B', en: "If you confirm the artwork by this Friday, we can start production next Monday and ship by October 20th. That leaves enough buffer for sea freight.", cn: '如果您这周五前确认图稿，我们下周一就能开工，10 月 20 日前发货，海运时间还有足够缓冲。' },
        { r: 'A', en: "What if there's a delay?", cn: '如果延误了怎么办？' },
        { r: 'B', en: "I'll keep you updated every week with production photos. If anything goes wrong, you'll know immediately, not at the last minute.", cn: '我每周会用生产照片向您更新进度。万一有问题，您会第一时间知道，而不是等到最后关头。' }
      ]
    },
    {
      topic: '质量投诉处理',
      scene: '客户收到货后反馈问题',
      lines: [
        { r: 'A', en: "We've received the shipment, but about 60 pieces arrived cracked.", cn: '我们收到货了，但大约有 60 个到货时是裂的。' },
        { r: 'B', en: "I'm really sorry to hear that. Could you send me photos of the damaged items and the outer cartons? That will help us find out whether it happened in production or in transit.", cn: '非常抱歉听到这个情况。能否把破损产品和外箱的照片发给我？这有助于判断是生产环节还是运输环节的问题。' },
        { r: 'A', en: "Sure, I'll email them today.", cn: '好的，我今天就发邮件。' },
        { r: 'B', en: "Thank you. Whatever the cause, we'll take responsibility. We can either replace them in your next shipment free of charge, or issue a credit note.", cn: '谢谢。无论原因是什么，我们都会承担责任。我们可以在下批货中免费补发，或者开一张贷记单。' },
        { r: 'A', en: "Replacement would be better.", cn: '补发比较好。' },
        { r: 'B', en: "Understood. I'll also improve the inner packaging with extra foam padding to prevent this from happening again.", cn: '明白。我还会改进内包装，增加泡沫衬垫，避免再次发生。' }
      ]
    },
    {
      topic: '付款催收',
      scene: '尾款迟迟未到',
      lines: [
        { r: 'A', en: "Hi Emma, I'm following up on the balance payment for order NH-2211.", cn: '你好 Emma，我想跟进一下 NH-2211 订单的尾款。' },
        { r: 'B', en: "Oh yes, our finance team is processing it. It should go out this week.", cn: '哦对，我们财务在处理，这周应该会付出去。' },
        { r: 'A', en: "Thank you. Just to remind you, the payment was due on the 15th. Once we receive it, we'll release the original documents right away.", cn: '谢谢。提醒一下，付款到期日是 15 号。我们一收到款就会立刻放正本单据。' },
        { r: 'B', en: "Understood. Could you resend the invoice? I'll push it internally.", cn: '明白。能重发一下发票吗？我在内部推一下。' },
        { r: 'A', en: "Of course, I'll send it in the next five minutes. Please let me know once the remittance is done, and share the payment slip if possible.", cn: '当然，五分钟内发给您。付款后请告知我，方便的话把水单发我。' },
        { r: 'B', en: "Will do. Sorry for the delay.", cn: '好的，抱歉延误了。' }
      ]
    },
    {
      topic: '展会搭讪与跟进',
      scene: '广交会 / 海外展会',
      lines: [
        { r: 'A', en: "Good morning! Welcome to our booth. Are you looking for anything in particular?", cn: '早上好！欢迎光临我们展位。您有特别想找的产品吗？' },
        { r: 'B', en: "Just browsing. What's your main product line?", cn: '随便看看。你们的主打产品线是什么？' },
        { r: 'A', en: "We specialize in ceramic tableware — mugs, plates and bowls. This series here is our best seller in Europe.", cn: '我们专注陶瓷餐具——马克杯、盘子和碗。这个系列是我们在欧洲最畅销的。' },
        { r: 'B', en: "Interesting. Do you do OEM?", cn: '有意思。你们做 OEM 吗？' },
        { r: 'A', en: "Yes, about 70% of our business is OEM. We can handle custom shapes, colors and packaging. Here's our catalog — may I have your card so I can follow up with a quotation?", cn: '做的，我们约 70% 的业务是 OEM。可以做定制的造型、颜色和包装。这是我们的目录——方便给我一张名片吗？我好跟进报价。' },
        { r: 'B', en: "Here you go.", cn: '给你。' },
        { r: 'A', en: "Thank you, Mr. Schmidt. I'll email you tonight with the details we discussed. Enjoy the rest of the fair!", cn: '谢谢您，Schmidt 先生。今晚我会把我们聊的细节邮件发给您。祝您逛展愉快！' }
      ]
    },
    {
      topic: '物流与单证',
      scene: '发货前确认',
      lines: [
        { r: 'A', en: "The goods are ready. Shall we book the shipment?", cn: '货已经准备好了，我们订舱吗？' },
        { r: 'B', en: "Yes, please. Use our forwarder — I'll send you their contact details.", cn: '好的，请用我们的货代，我把联系方式发给你。' },
        { r: 'A', en: "Noted. Which documents do you need? Normally we provide the commercial invoice, packing list, bill of lading and certificate of origin.", cn: '收到。您需要哪些单据？通常我们提供商业发票、装箱单、提单和原产地证。' },
        { r: 'B', en: "Also a fumigation certificate, since we use wooden pallets.", cn: '还要熏蒸证书，因为我们用木托盘。' },
        { r: 'A', en: "Good catch. I'll arrange it. Please double-check the consignee information on the draft B/L before we finalize it.", cn: '提醒得好，我来安排。在提单定稿前，请再核对一下收货人信息。' },
        { r: 'B', en: "Will do. Send me the draft as soon as you have it.", cn: '好的，有草本尽快发我。' }
      ]
    }
  ],

  words: [
    { en: 'inquiry', ph: "/ɪnˈkwaɪəri/", cn: '询盘' },
    { en: 'quotation', ph: "/kwəʊˈteɪʃn/", cn: '报价单' },
    { en: 'offer', ph: "/ˈɒfə/", cn: '报盘' },
    { en: 'counter-offer', ph: "/ˈkaʊntə ˈɒfə/", cn: '还盘' },
    { en: 'MOQ (minimum order quantity)', ph: "/em əʊ kjuː/", cn: '最小起订量' },
    { en: 'unit price', ph: "/ˈjuːnɪt praɪs/", cn: '单价' },
    { en: 'FOB (free on board)', ph: "/ef əʊ biː/", cn: '离岸价' },
    { en: 'CIF (cost, insurance & freight)', ph: "/siː aɪ ef/", cn: '到岸价' },
    { en: 'EXW (ex works)', ph: "/iː dʌblju ˈdʌblju/", cn: '工厂交货价' },
    { en: 'lead time', ph: "/liːd taɪm/", cn: '交货周期' },
    { en: 'trial order', ph: "/ˈtraɪəl ˈɔːdə/", cn: '试单' },
    { en: 'bulk order', ph: "/bʌlk ˈɔːdə/", cn: '大货订单' },
    { en: 'sample', ph: "/ˈsɑːmpl/", cn: '样品' },
    { en: 'proforma invoice', ph: "/prəʊˈfɔːmə/", cn: '形式发票' },
    { en: 'commercial invoice', ph: "/kəˈmɜːʃl/", cn: '商业发票' },
    { en: 'packing list', ph: "/ˈpækɪŋ lɪst/", cn: '装箱单' },
    { en: 'bill of lading (B/L)', ph: "/ˈleɪdɪŋ/", cn: '提单' },
    { en: 'certificate of origin', ph: "/ˈɒrɪdʒɪn/", cn: '原产地证' },
    { en: 'L/C (letter of credit)', ph: "/ˈletə əv ˈkredɪt/", cn: '信用证' },
    { en: 'T/T (telegraphic transfer)', ph: "/ˌtelɪˈɡræfɪk/", cn: '电汇' },
    { en: 'deposit', ph: "/dɪˈpɒzɪt/", cn: '定金' },
    { en: 'balance payment', ph: "/ˈbæləns/", cn: '尾款' },
    { en: 'shipment', ph: "/ˈʃɪpmənt/", cn: '装运、发货' },
    { en: 'freight forwarder', ph: "/freɪt ˈfɔːwədə/", cn: '货运代理' },
    { en: 'customs clearance', ph: "/ˈkʌstəmz ˈklɪərəns/", cn: '清关' },
    { en: 'tariff', ph: "/ˈtærɪf/", cn: '关税' },
    { en: 'OEM', ph: "/əʊ iː em/", cn: '贴牌代工' },
    { en: 'specification (spec)', ph: "/ˌspesɪfɪˈkeɪʃn/", cn: '规格' },
    { en: 'inspection', ph: "/ɪnˈspekʃn/", cn: '验货' },
    { en: 'defective', ph: "/dɪˈfektɪv/", cn: '有瑕疵的' },
    { en: 'claim', ph: "/kleɪm/", cn: '索赔' },
    { en: 'credit note', ph: "/ˈkredɪt nəʊt/", cn: '贷记单' },
    { en: 'exchange rate', ph: "/ɪksˈtʃeɪndʒ reɪt/", cn: '汇率' },
    { en: 'container (20ft / 40ft)', ph: "/kənˈteɪnə/", cn: '集装箱' },
    { en: 'ETD / ETA', ph: "/iː tiː diː/", cn: '预计离港 / 到港时间' }
  ],

  sentences: [
    { en: "Thank you for your inquiry. We'll get back to you within 24 hours.", cn: '感谢您的询盘，我们会在 24 小时内回复。' },
    { en: "Could you please advise your target price and quantity?", cn: '能否告知您的目标价和数量？' },
    { en: "Our MOQ is 1,000 pieces, but we can be flexible for a trial order.", cn: '我们的起订量是 1000 个，但试单可以灵活处理。' },
    { en: "This price is based on FOB Ningbo and is valid for 30 days.", cn: '此价格基于 FOB 宁波，有效期 30 天。' },
    { en: "I'm afraid that price is below our cost, but let me see what I can do.", cn: '恐怕那个价格低于我们的成本，不过我看看能做点什么。' },
    { en: "If you increase the quantity, we can offer a better unit price.", cn: '如果您提高数量，我们可以给出更好的单价。' },
    { en: "Let me confirm with our production department and revert to you shortly.", cn: '我跟生产部确认一下，稍后回复您。' },
    { en: "We'll send you production photos every week so you're always in the loop.", cn: '我们每周发生产照片给您，让您随时掌握进度。' },
    { en: "The goods are ready for shipment; shall we proceed with booking?", cn: '货已备妥，我们可以订舱了吗？' },
    { en: "Please kindly arrange the balance payment so we can release the documents.", cn: '请安排支付尾款，以便我们放单。' },
    { en: "I'd like to apologize for the inconvenience and assure you it won't happen again.", cn: '为造成的不便致歉，我保证不会再发生。' },
    { en: "We value our long-term cooperation and we'll find a solution together.", cn: '我们珍视长期合作，会一起找到解决办法。' },
    { en: "Could you clarify what you mean by that? I want to make sure I follow.", cn: '您那句话能再解释一下吗？我想确保理解正确。' },
    { en: "Sorry, the line is a bit unclear. Could you repeat that, please?", cn: '抱歉，线路有点不清楚，能再说一遍吗？' },
    { en: "Let me put that in writing so we're both on the same page.", cn: '我把这个写下来发您，确保我们理解一致。' },
    { en: "Just to recap what we agreed: 5,000 pieces at 2.70 dollars, shipped by October 20th.", cn: '总结一下我们的一致意见：5000 个，单价 2.70 美元，10 月 20 日前发货。' },
    { en: "Would it be possible to move the deadline forward by a week?", cn: '有可能把截止日期提前一周吗？' },
    { en: "I'll keep you posted on any updates.", cn: '有任何进展我会随时通知您。' },
    { en: "Please feel free to reach out if you have any further questions.", cn: '如有其他问题，请随时联系我。' },
    { en: "We look forward to a long and pleasant cooperation with you.", cn: '期待与您长期愉快地合作。' }
  ]
};
