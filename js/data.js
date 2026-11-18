/**
 * 《TA 的秘密礼盒》内容包
 * 每套内容：礼物 + 卡片标题 + 完整留言，语义绑定，不可随机混搭
 * 所有第三人称使用「TA」
 */

const GIFTS = [
  // 1. 围巾
  {
    id: "scarf",
    name: "一条柔软的围巾",
    category: "保暖",
    themes: ["关心", "日常", "想念"],
    moods: ["普通的一天", "想被关心", "想念 TA", "需要鼓励"],
    icon: "🧣",
    packs: [
      {
        cardTitle: "天凉了，记得照顾自己",
        message: "等天气转凉，记得多穿一点。选这条围巾没什么复杂的理由，只是觉得它很适合你。希望你戴上它的时候，能感觉到一点被惦记的温暖。",
        note: "外面风大，别着凉。",
        style: "温柔"
      },
      {
        cardTitle: "给你的一点温度",
        message: "最近早晚温差有点大。这条围巾颜色很安静，不张扬，但摸起来很舒服。如果哪天你觉得有点冷，就把它围上吧。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于保暖这件事",
        message: "我不太会说很正式的关心，但看到这条围巾的时候，突然就想到了你。希望它能陪你度过接下来的几场冷风。",
        note: "记得按时吃饭。",
        style: "直接"
      }
    ]
  },
  // 2. 鲜花
  {
    id: "flowers",
    name: "一束小花",
    category: "心意",
    themes: ["惊喜", "关心", "日常"],
    moods: ["普通的一天", "想被关心", "想要惊喜", "想念 TA"],
    icon: "💐",
    packs: [
      {
        cardTitle: "今天不是什么特别的日子",
        message: "今天不是什么特别的日子。不过，送花也不一定非要找理由。希望你看到它的时候，心情能好一点。",
        note: "花会慢慢谢，但心意会留下。",
        style: "温柔"
      },
      {
        cardTitle: "随便买的，但想给你",
        message: "路过花店的时候，突然就想把这束花送给你。颜色不艳，香味也不重，只是觉得它看起来很干净。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "一点小惊喜",
        message: "没有什么大事发生，就是想让你今天的桌面上多一点颜色。希望这束花能让你嘴角上扬一下。",
        note: "记得换水。",
        style: "俏皮"
      }
    ]
  },
  // 3. 电影票
  {
    id: "movie_ticket",
    name: "两张电影票",
    category: "约会",
    themes: ["约会", "日常", "想念"],
    moods: ["想去约会", "普通的一天", "想念 TA", "想要惊喜"],
    icon: "🎫",
    packs: [
      {
        cardTitle: "一起看一场电影吧",
        message: "最近有没有想看的电影？如果还没决定，就慢慢挑。比起电影本身，我更期待一起度过的那段时间。",
        note: "爆米花我来买。",
        style: "温柔"
      },
      {
        cardTitle: "关于一部还没选好的电影",
        message: "票先买着，片随便你定。我想坐在旁边，听你偶尔的小声吐槽，或者安静地一起看完。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "散场后的那段路",
        message: "电影结束以后，我们可以慢慢走回去。不用聊很多，也不用急着回家。就当是给这一天留一点余温。",
        note: "别忘了带外套。",
        style: "安静"
      }
    ]
  },
  // 4. 热可可
  {
    id: "hot_cocoa",
    name: "一杯热可可",
    category: "饮品",
    themes: ["关心", "日常", "鼓励"],
    moods: ["普通的一天", "想被关心", "需要鼓励", "想念 TA"],
    icon: "☕",
    packs: [
      {
        cardTitle: "先喝点热的",
        message: "不管你现在在忙什么，先停下来喝一口热的。可可的甜味不重，刚好能让人缓一下。",
        note: "小心烫。",
        style: "温柔"
      },
      {
        cardTitle: "给你的小休息",
        message: "这一杯没什么特别的配方，就是普通的热可可。但它可以陪你坐一会儿，不用赶着做下一件事。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "天冷就喝这个",
        message: "我不太会煮很复杂的东西，但这杯热可可是认真给你的。喝完再继续忙吧，别太勉强自己。",
        note: "记得吃点东西。",
        style: "直接"
      }
    ]
  },
  // 5. 手写信
  {
    id: "letter",
    name: "一封手写信",
    category: "文字",
    themes: ["想念", "关心", "日常"],
    moods: ["想念 TA", "想被关心", "普通的一天", "需要鼓励"],
    icon: "✉️",
    packs: [
      {
        cardTitle: "写给你的几句话",
        message: "本来想说很多，落笔的时候又觉得不用写太满。只是想让你知道，有人在很普通的日子里想起你。",
        note: "收好就好。",
        style: "温柔"
      },
      {
        cardTitle: "没有标题的信",
        message: "纸不贵，笔也不新，但字是一个一个写给你的。不用回信，看到就够了。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "想说又没说出口的",
        message: "有些话当面讲会觉得有点别扭，写下来反而更自然。希望你读到的时候，心情是放松的。",
        note: "慢慢看。",
        style: "安静"
      }
    ]
  },
  // 6. 书
  {
    id: "book",
    name: "一本薄薄的书",
    category: "阅读",
    themes: ["日常", "鼓励", "安静"],
    moods: ["普通的一天", "需要鼓励", "想念 TA", "想被关心"],
    icon: "📖",
    packs: [
      {
        cardTitle: "给你的睡前读物",
        message: "这本不厚，适合睡前翻几页。不用读完，也不用记住什么，只是想让你在安静的时候有个伴。",
        note: "喜欢就慢慢看。",
        style: "温柔"
      },
      {
        cardTitle: "随便翻开的一页",
        message: "我也不确定你会不会喜欢这个题材，但看到它的时候就想到了你。如果合得来，就当是多认识一个人。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于一本书的推荐",
        message: "这本书我自己看过，觉得还不错。现在转送给你。如果哪天你觉得无聊，可以翻开看看。",
        note: "有折痕的地方是我常看的。",
        style: "直接"
      }
    ]
  },
  // 7. 茶包
  {
    id: "tea",
    name: "几袋清淡的茶",
    category: "饮品",
    themes: ["日常", "关心", "安静"],
    moods: ["普通的一天", "想被关心", "需要鼓励"],
    icon: "🍵",
    packs: [
      {
        cardTitle: "泡一杯吧",
        message: "这几袋茶味道很淡，不会太抢。忙完或者累的时候，泡一杯坐一会儿就好。",
        note: "水温别太高。",
        style: "温柔"
      },
      {
        cardTitle: "给你的小茶包",
        message: "没有什么特别的仪式感，就是普通的茶。但希望它能让你在某一天的某个下午，觉得还挺舒服。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "慢一点也没关系",
        message: "茶要等一会儿才出味。你也是。不用急着把所有事做完，偶尔停下来泡一杯。",
        note: "记得休息。",
        style: "安静"
      }
    ]
  },
  // 8. 耳机
  {
    id: "headphones",
    name: "一副轻便的耳机",
    category: "音乐",
    themes: ["日常", "鼓励", "想念"],
    moods: ["普通的一天", "需要鼓励", "想念 TA", "想要惊喜"],
    icon: "🎧",
    packs: [
      {
        cardTitle: "给你的声音世界",
        message: "戴上它的时候，外面的噪音会小一点。你可以听喜欢的歌，或者什么都不听，就安静一会儿。",
        note: "音量别开太大。",
        style: "温柔"
      },
      {
        cardTitle: "关于独处的时候",
        message: "有时候一个人走路、等车、发呆，有个耳机在身边会安心一点。希望它能陪你度过那些小空隙。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "歌单可以慢慢建",
        message: "耳机给你了，歌单你自己填。哪天你愿意分享正在听的歌，我也很想知道。",
        note: "喜欢就用。",
        style: "俏皮"
      }
    ]
  },
  // 9. 小夜灯
  {
    id: "night_light",
    name: "一盏柔和的小夜灯",
    category: "居家",
    themes: ["关心", "日常", "鼓励"],
    moods: ["普通的一天", "想被关心", "需要鼓励", "想念 TA"],
    icon: "💡",
    packs: [
      {
        cardTitle: "夜里也不用全黑",
        message: "这盏灯的光很软，不会刺眼。如果半夜醒来，或者想在暗一点的环境里待着，可以开着它。",
        note: "睡前记得关。",
        style: "温柔"
      },
      {
        cardTitle: "给你的一点光",
        message: "不一定非要很亮，有一点就够了。希望你在需要的时候，能感觉到房间里还有一点温度。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于晚上的事",
        message: "我知道有时候晚上会想很多。这盏灯不能解决什么，但至少能让黑暗不那么满。",
        note: "早点休息。",
        style: "安静"
      }
    ]
  },
  // 10. 明信片
  {
    id: "postcard",
    name: "一张空白明信片",
    category: "文字",
    themes: ["想念", "日常", "惊喜"],
    moods: ["想念 TA", "普通的一天", "想要惊喜"],
    icon: "🏞️",
    packs: [
      {
        cardTitle: "随便写点什么",
        message: "这张明信片背面是空的。你想写什么就写什么，或者什么都不写，只是收着也好。",
        note: "邮寄可选。",
        style: "温柔"
      },
      {
        cardTitle: "一张还没寄出的",
        message: "我本来想写满再给你，后来觉得空白也挺好。你自己决定上面要放什么。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于远方的想象",
        message: "明信片通常来自别处。这张是我给你的，地址随便填，内容也随便。重要的是它现在在你手里。",
        note: "收好。",
        style: "俏皮"
      }
    ]
  },
  // 11. 钥匙扣
  {
    id: "keychain",
    name: "一个小钥匙扣",
    category: "随身",
    themes: ["日常", "关心", "想念"],
    moods: ["普通的一天", "想被关心", "想念 TA"],
    icon: "🔑",
    packs: [
      {
        cardTitle: "挂在钥匙上",
        message: "小小的一个，不会太占地方。每次开门关门的时候，或许会让你想到一点什么。",
        note: "别弄丢。",
        style: "温柔"
      },
      {
        cardTitle: "给你的小挂件",
        message: "没有特别的含义，就是觉得它看起来顺眼。如果你不喜欢，也可以换下来，没关系。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "随身带着就好",
        message: "钥匙每天都要用。多一个小东西，或许能让普通的动作多一点不同的感觉。",
        note: "喜欢就挂着。",
        style: "直接"
      }
    ]
  },
  // 12. 巧克力
  {
    id: "chocolate",
    name: "一小盒巧克力",
    category: "甜食",
    themes: ["惊喜", "关心", "日常"],
    moods: ["想要惊喜", "想被关心", "普通的一天", "需要鼓励"],
    icon: "🍫",
    packs: [
      {
        cardTitle: "甜一点没关系",
        message: "今天可以稍微放纵一下。这盒巧克力不多，够你在想吃甜的时候拆一颗。",
        note: "别一次吃完。",
        style: "温柔"
      },
      {
        cardTitle: "给你的小甜食",
        message: "不是很贵的那种，但味道还不错。忙完或者心情一般的时候，吃一颗会好一点。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于奖励自己",
        message: "有时候不需要什么大理由，就可以给自己一点甜的。这盒就当是预支的奖励。",
        note: "慢慢吃。",
        style: "俏皮"
      }
    ]
  },
  // 13. 日记本
  {
    id: "journal",
    name: "一本空白日记本",
    category: "文字",
    themes: ["日常", "鼓励", "安静"],
    moods: ["普通的一天", "需要鼓励", "想念 TA"],
    icon: "📓",
    packs: [
      {
        cardTitle: "写或者不写都行",
        message: "本子是空的，你想记什么就记什么。不想写的时候，就让它安静地待在桌上也好。",
        note: "没有截止日期。",
        style: "温柔"
      },
      {
        cardTitle: "给你的空白页",
        message: "不一定要每天都写，也不一定要写很长。有时候只是把今天发生的一件小事记下来，就已经够了。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于记录这件事",
        message: "以后翻开的时候，或许会发现自己走过了不少路。现在先不用想那么多，有感觉就写几笔。",
        note: "慢慢填。",
        style: "安静"
      }
    ]
  },
  // 14. 毛毯
  {
    id: "blanket",
    name: "一条柔软的小毯子",
    category: "保暖",
    themes: ["关心", "日常", "鼓励"],
    moods: ["想被关心", "普通的一天", "需要鼓励", "想念 TA"],
    icon: "🛏️",
    packs: [
      {
        cardTitle: "盖上会舒服一点",
        message: "坐着或者躺着的时候，把这条毯子搭在腿上。不厚，但足够挡住一点凉意。",
        note: "可以机洗。",
        style: "温柔"
      },
      {
        cardTitle: "给你的小窝",
        message: "有时候只是想把自己裹起来。这条毯子不会解决大问题，但能让你在那一刻觉得安全一点。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于休息的许可",
        message: "累了就盖着它休息一会儿。不用觉得自己在偷懒，休息本身就是必要的事。",
        note: "好好睡。",
        style: "直接"
      }
    ]
  },
  // 15. 香薰蜡烛
  {
    id: "candle",
    name: "一支安静的香薰蜡烛",
    category: "居家",
    themes: ["日常", "安静", "关心"],
    moods: ["普通的一天", "想被关心", "需要鼓励"],
    icon: "🕯️",
    packs: [
      {
        cardTitle: "点亮一会儿就好",
        message: "香味不浓，燃烧的时候房间会有一点点变化。你忙完或者想放空的时候，可以点上它。",
        note: "注意安全。",
        style: "温柔"
      },
      {
        cardTitle: "给你的一点氛围",
        message: "不一定要等特别的日子。普通的晚上，点一支蜡烛，也是一种对自己好的方式。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于慢下来",
        message: "蜡烛燃烧的速度比想象中慢。你可以借着它的时间，什么都不做，只是坐着。",
        note: "熄灭时小心。",
        style: "安静"
      }
    ]
  },
  // 16. 雨伞
  {
    id: "umbrella",
    name: "一把轻便的雨伞",
    category: "随身",
    themes: ["关心", "日常"],
    moods: ["普通的一天", "想被关心", "需要鼓励"],
    icon: "☔",
    packs: [
      {
        cardTitle: "下雨的时候用得上",
        message: "天气有时候说变就变。这把伞不重，收起来也不占地方。希望你需要的时候它就在身边。",
        note: "别忘了带。",
        style: "温柔"
      },
      {
        cardTitle: "给你的小防备",
        message: "不是什么贵重的东西，但能让你少淋一点雨。出门前看一眼天气，记得带上它。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于意外的雨",
        message: "有时候预报会不准。有一把伞在包里，心里会踏实一点。",
        note: "用完记得晾干。",
        style: "直接"
      }
    ]
  },
  // 17. 照片框
  {
    id: "photo_frame",
    name: "一个小相框",
    category: "纪念",
    themes: ["想念", "日常", "惊喜"],
    moods: ["想念 TA", "普通的一天", "想要惊喜"],
    icon: "🖼️",
    packs: [
      {
        cardTitle: "放一张你喜欢的照片",
        message: "框是空的，里面可以放任何你想留住的画面。不一定是正式的合影，一张随手拍的也好。",
        note: "慢慢选。",
        style: "温柔"
      },
      {
        cardTitle: "给你的小纪念",
        message: "有些瞬间值得被放在桌上。这个框不大，刚好适合那些不太张扬的回忆。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于记得",
        message: "以后看到它的时候，或许会想起某段日子。现在先空着也没关系，等你有想放的内容再填。",
        note: "放在顺眼的地方。",
        style: "安静"
      }
    ]
  },
  // 18. 星空投影
  {
    id: "star_projector",
    name: "一个小小的星空灯",
    category: "居家",
    themes: ["惊喜", "安静", "想念"],
    moods: ["想要惊喜", "普通的一天", "想念 TA", "需要鼓励"],
    icon: "✨",
    packs: [
      {
        cardTitle: "房间里的一点星光",
        message: "关掉大灯，打开它。天花板上会出现一些小光点。不算真的星空，但足够让夜晚柔软一点。",
        note: "可以调亮度。",
        style: "温柔"
      },
      {
        cardTitle: "给你的小宇宙",
        message: "有时候想看星星，但外面可能没有。这个灯可以让你在自己的房间里，假装一下。",
        note: null,
        style: "俏皮"
      },
      {
        cardTitle: "关于夜里的想象",
        message: "躺着看那些光点移动的时候，可以什么都不想。或者想一点很远的事。都行。",
        note: "睡前可以开着。",
        style: "安静"
      }
    ]
  },
  // 19. 香水小样
  {
    id: "perfume",
    name: "一小瓶香水小样",
    category: "气味",
    themes: ["惊喜", "日常", "想念"],
    moods: ["想要惊喜", "普通的一天", "想念 TA"],
    icon: "🧴",
    packs: [
      {
        cardTitle: "一点气味的记忆",
        message: "味道不浓，也不会留很久。但某天你闻到类似的气息时，或许会想起一点什么。",
        note: "少喷一点。",
        style: "温柔"
      },
      {
        cardTitle: "给你的小味道",
        message: "我也不确定你会不会喜欢这个香调。如果不合适，放着当装饰也行。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于留香",
        message: "香水会散，但有时候气味会变成一种提醒。希望它能在某些时刻，让你觉得被轻轻碰了一下。",
        note: "喜欢就留下。",
        style: "安静"
      }
    ]
  },
  // 20. 热饮杯
  {
    id: "mug",
    name: "一只手感舒服的杯子",
    category: "居家",
    themes: ["日常", "关心"],
    moods: ["普通的一天", "想被关心", "需要鼓励"],
    icon: "🥛",
    packs: [
      {
        cardTitle: "每天都会用到的",
        message: "杯子不大，刚好一手能握住。以后喝水、喝茶、喝咖啡，都可以用它。",
        note: "小心摔。",
        style: "温柔"
      },
      {
        cardTitle: "给你的日常",
        message: "没有特别的图案，就是一只普通但好用的杯子。希望它能陪你度过很多个普通的早晨和夜晚。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于举手之劳",
        message: "有时候对自己好一点，就是用顺手的东西。这只杯子希望能成为你顺手的那一个。",
        note: "用着舒服就好。",
        style: "直接"
      }
    ]
  },
  // 21. 贴纸包
  {
    id: "stickers",
    name: "一包小贴纸",
    category: "趣味",
    themes: ["惊喜", "日常", "俏皮"],
    moods: ["想要惊喜", "普通的一天", "想去约会"],
    icon: "🌟",
    packs: [
      {
        cardTitle: "随便贴",
        message: "笔记本、手机壳、水杯，想贴哪里就贴哪里。这些贴纸没什么实际用途，但能让东西看起来活泼一点。",
        note: "撕下来也没关系。",
        style: "俏皮"
      },
      {
        cardTitle: "给你的小装饰",
        message: "有时候生活需要一点不必要的东西。这包贴纸就是那种不必要，但挺开心的。",
        note: null,
        style: "温柔"
      },
      {
        cardTitle: "关于点缀",
        message: "空白的地方可以贴一点颜色。你决定贴什么、贴多少，或者干脆不贴。",
        note: "玩得开心。",
        style: "克制"
      }
    ]
  },
  // 22. 便携小风扇
  {
    id: "fan",
    name: "一个小小的风扇",
    category: "随身",
    themes: ["关心", "日常"],
    moods: ["普通的一天", "想被关心", "需要鼓励"],
    icon: "🌬️",
    packs: [
      {
        cardTitle: "热的时候用得上",
        message: "夏天或者人多的地方，有个小风扇会舒服一点。它不强大，但够用。",
        note: "记得充电。",
        style: "温柔"
      },
      {
        cardTitle: "给你的小凉意",
        message: "不是必须的东西，但有的时候会突然需要。希望它能在你觉得闷的时候帮上忙。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于小便利",
        message: "生活里有很多这种小东西。它们解决不了大事，但能让某几分钟好过一点。",
        note: "随身带着。",
        style: "直接"
      }
    ]
  },
  // 23. 护手霜
  {
    id: "hand_cream",
    name: "一支温和的护手霜",
    category: "护理",
    themes: ["关心", "日常"],
    moods: ["想被关心", "普通的一天", "需要鼓励"],
    icon: "🧴",
    packs: [
      {
        cardTitle: "手也需要照顾",
        message: "天气干的时候，或者洗完手以后，抹一点会舒服很多。味道很淡，不会抢其他气味。",
        note: "随身放着。",
        style: "温柔"
      },
      {
        cardTitle: "给你的小护理",
        message: "这不是什么大礼，只是想让你在忙的时候，也记得照顾一下自己的手。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于细节",
        message: "有时候关心就是这种小事。希望你用的时候，会觉得有人在意这些细节。",
        note: "别忘了用。",
        style: "直接"
      }
    ]
  },
  // 24. 音乐盒
  {
    id: "music_box",
    name: "一个小小的音乐盒",
    category: "纪念",
    themes: ["惊喜", "想念", "安静"],
    moods: ["想要惊喜", "想念 TA", "普通的一天"],
    icon: "🎵",
    packs: [
      {
        cardTitle: "转一下就会响",
        message: "旋律很简单，重复几遍就结束了。但每次打开它，都会有那么几秒是只属于你的。",
        note: "轻拿轻放。",
        style: "温柔"
      },
      {
        cardTitle: "给你的小声音",
        message: "它不会放很长的歌，也不会很大声。只是一个可以随时打开的、安静的小惊喜。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于重复的旋律",
        message: "有时候同一段音乐听很多遍也不会腻。这个盒子里的曲子，希望能陪你度过一些需要被安抚的时刻。",
        note: "慢慢听。",
        style: "安静"
      }
    ]
  },
  // 25. 植物小盆栽
  {
    id: "plant",
    name: "一盆好养活的绿植",
    category: "居家",
    themes: ["日常", "关心", "鼓励"],
    moods: ["普通的一天", "想被关心", "需要鼓励"],
    icon: "🪴",
    packs: [
      {
        cardTitle: "养着玩就好",
        message: "这盆植物不怎么挑，偶尔浇点水就行。看着它慢慢长，会有一点很细微的满足感。",
        note: "别浇太多。",
        style: "温柔"
      },
      {
        cardTitle: "给你的一点绿色",
        message: "房间里多一点活着的东西，感觉会不一样。它不会吵，也不会要求太多。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于陪伴",
        message: "植物不会说话，但每天看到它还在，会觉得自己也在被陪着。希望这盆能陪你久一点。",
        note: "放在有光的地方。",
        style: "安静"
      }
    ]
  },
  // 26. 日历本
  {
    id: "calendar",
    name: "一本小日历",
    category: "日常",
    themes: ["日常", "鼓励"],
    moods: ["普通的一天", "需要鼓励", "想被关心"],
    icon: "📅",
    packs: [
      {
        cardTitle: "一天一天过",
        message: "可以在上面记一点安排，或者只是划掉已经过去的日子。不管怎么用，它都会陪你走过这一年。",
        note: "慢慢翻。",
        style: "温柔"
      },
      {
        cardTitle: "给你的时间记录",
        message: "有些日子值得被标记，有些可以空白着。这本日历把选择权交给你。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于向前",
        message: "翻过一页，就是新的一天。希望你在用它的时候，会觉得时间是被认真对待的。",
        note: "别急着翻完。",
        style: "直接"
      }
    ]
  },
  // 27. 耳塞
  {
    id: "earplugs",
    name: "一副舒适的耳塞",
    category: "休息",
    themes: ["关心", "鼓励"],
    moods: ["想被关心", "需要鼓励", "普通的一天"],
    icon: "🔇",
    packs: [
      {
        cardTitle: "需要安静的时候",
        message: "有时候外面太吵，或者只是想把声音暂时关掉。戴上它，给自己一点真正安静的空间。",
        note: "睡前可以用。",
        style: "温柔"
      },
      {
        cardTitle: "给你的隔音",
        message: "它不能隔绝一切，但能让噪音小很多。希望你在需要休息的时候，用得上。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于保护自己的感官",
        message: "不是所有声音都需要被接收。这副耳塞是一个小小的许可，允许你偶尔屏蔽一下。",
        note: "好好休息。",
        style: "安静"
      }
    ]
  },
  // 28. 便签纸
  {
    id: "sticky_notes",
    name: "一叠彩色便签",
    category: "文字",
    themes: ["日常", "俏皮"],
    moods: ["普通的一天", "想要惊喜", "想去约会"],
    icon: "📝",
    packs: [
      {
        cardTitle: "随便写点提醒",
        message: "可以写待办，可以写心情，可以写一句给自己的话。贴在看得见的地方，或者收起来也行。",
        note: "用完再买。",
        style: "俏皮"
      },
      {
        cardTitle: "给你的小纸条",
        message: "有时候一句话就够了。这叠便签是为了那些「突然想记下来」的瞬间准备的。",
        note: null,
        style: "温柔"
      },
      {
        cardTitle: "关于留下痕迹",
        message: "便签会掉，字会褪。但写下来的那一刻，是真实的。希望你多用它记录一点开心的事。",
        note: "随便贴。",
        style: "克制"
      }
    ]
  },
  // 29. 眼罩
  {
    id: "eye_mask",
    name: "一个遮光眼罩",
    category: "休息",
    themes: ["关心", "鼓励"],
    moods: ["想被关心", "需要鼓励", "普通的一天"],
    icon: "😴",
    packs: [
      {
        cardTitle: "想睡的时候戴上",
        message: "白天想小睡，或者晚上灯关不干净的时候，用它会舒服一点。布料不厚，也不会压到眼睛。",
        note: "定期清洗。",
        style: "温柔"
      },
      {
        cardTitle: "给你的黑暗",
        message: "有时候需要一点彻底的黑，才能真正放松。这个眼罩可以帮你制造那样的环境。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于休息的权利",
        message: "睡不好的时候，外界很容易被责怪。这个眼罩是一个小小的工具，帮你把环境调整到更适合休息的状态。",
        note: "好好睡。",
        style: "直接"
      }
    ]
  },
  // 30. 书签
  {
    id: "bookmark",
    name: "一张精致的书签",
    category: "阅读",
    themes: ["日常", "安静"],
    moods: ["普通的一天", "需要鼓励", "想念 TA"],
    icon: "🔖",
    packs: [
      {
        cardTitle: "夹在正在看的书里",
        message: "书看不完没关系，夹着它，下次打开的时候就知道看到哪里了。小小的，但很实用。",
        note: "别折。",
        style: "温柔"
      },
      {
        cardTitle: "给你的阅读标记",
        message: "有些书值得慢慢看。这张书签是为了那些需要被暂停、然后继续的阅读准备的。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于未完待续",
        message: "故事可以停在任意一页。希望你用它的时候，会觉得「下次再看」是一件很自然的事。",
        note: "慢慢读。",
        style: "安静"
      }
    ]
  },
  // 31. 暖手宝
  {
    id: "hand_warmer",
    name: "一个可充电的暖手宝",
    category: "保暖",
    themes: ["关心", "日常"],
    moods: ["想被关心", "普通的一天", "需要鼓励", "想念 TA"],
    icon: "🔥",
    packs: [
      {
        cardTitle: "手冷的时候握着",
        message: "充电后可以暖一段时间。冬天或者空调房里，握着它会舒服很多。",
        note: "注意温度。",
        style: "温柔"
      },
      {
        cardTitle: "给你的一点热",
        message: "它不能暖很久，但足够让你在某段时间里，手不再那么冰。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于温度的传递",
        message: "有时候冷的不只是手。这个暖手宝是一个很直接的方式，告诉你「有人想让你暖和一点」。",
        note: "用的时候小心。",
        style: "直接"
      }
    ]
  },
  // 32. 小镜子
  {
    id: "mirror",
    name: "一面随身小镜子",
    category: "随身",
    themes: ["日常", "关心"],
    moods: ["普通的一天", "想被关心", "想要惊喜"],
    icon: "🪞",
    packs: [
      {
        cardTitle: "照一下就好",
        message: "出门前或者想整理一下的时候，可以用它。不大，但够用。",
        note: "别摔。",
        style: "温柔"
      },
      {
        cardTitle: "给你的小确认",
        message: "有时候只是想确认自己看起来还行。这面镜子是为了那些小小的确认时刻准备的。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于看见自己",
        message: "镜子里的人是你。希望你用它的时候，会对自己温和一点。",
        note: "收好。",
        style: "安静"
      }
    ]
  },
  // 33. 香氛喷雾
  {
    id: "room_spray",
    name: "一小瓶空间喷雾",
    category: "气味",
    themes: ["日常", "惊喜"],
    moods: ["普通的一天", "想要惊喜", "想被关心"],
    icon: "🌫️",
    packs: [
      {
        cardTitle: "喷一下房间会不一样",
        message: "味道很轻，不会长时间残留。想换一下心情的时候，可以喷几下。",
        note: "别对着人喷。",
        style: "温柔"
      },
      {
        cardTitle: "给你的空气改变",
        message: "有时候环境变一点，心情也会跟着松一点。这瓶喷雾是为了那些需要小改变的时刻。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于气味的魔法",
        message: "气味能很快把人拉进另一种状态。希望它能在你需要的时候，帮你切换一下。",
        note: "适量使用。",
        style: "俏皮"
      }
    ]
  },
  // 34. 笔
  {
    id: "pen",
    name: "一支好写的笔",
    category: "文字",
    themes: ["日常", "鼓励"],
    moods: ["普通的一天", "需要鼓励", "想去约会"],
    icon: "🖊️",
    packs: [
      {
        cardTitle: "写字会舒服一点",
        message: "笔触流畅，不会刮纸。记笔记、写待办、或者随便涂两笔，都会顺手一些。",
        note: "盖好笔帽。",
        style: "温柔"
      },
      {
        cardTitle: "给你的书写工具",
        message: "有时候一支顺手的笔，能让人更愿意写点什么。希望它能成为你常用的那一支。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于留下字迹",
        message: "字写下来就会留下痕迹。希望你用它写的，大多是让自己开心的内容。",
        note: "多用它。",
        style: "直接"
      }
    ]
  },
  // 35. 小零食
  {
    id: "snacks",
    name: "一袋不太甜的小零食",
    category: "甜食",
    themes: ["日常", "关心", "惊喜"],
    moods: ["普通的一天", "想被关心", "想要惊喜", "需要鼓励"],
    icon: "🍪",
    packs: [
      {
        cardTitle: "饿的时候垫一下",
        message: "不多，刚好够在两餐之间吃一点。味道不冲，也不会让人有负担。",
        note: "别一次吃完。",
        style: "温柔"
      },
      {
        cardTitle: "给你的小储备",
        message: "有时候忙起来会忘记吃东西。这袋零食可以放在包里或者抽屉里，需要的时候拿出来。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于被投喂",
        message: "被记住「可能会饿」这件事，本身就很温暖。这袋零食就是那个提醒。",
        note: "慢慢吃。",
        style: "俏皮"
      }
    ]
  },
  // 36. 耳机收纳袋
  {
    id: "pouch",
    name: "一个小收纳袋",
    category: "随身",
    themes: ["日常", "关心"],
    moods: ["普通的一天", "想被关心"],
    icon: "👜",
    packs: [
      {
        cardTitle: "把小东西装起来",
        message: "耳机、充电线、小饰品，都可以放进去。包里会整齐一点，找东西也方便。",
        note: "别装太多。",
        style: "温柔"
      },
      {
        cardTitle: "给你的小整理",
        message: "生活里总有很多零碎。这个袋子不能解决所有混乱，但能让一部分变得有序。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于收纳的安心",
        message: "东西有固定的位置，心里会踏实一点。希望这个小袋子能帮你多一点那种感觉。",
        note: "用着顺手就好。",
        style: "直接"
      }
    ]
  },
  // 37. 明信片套装
  {
    id: "postcard_set",
    name: "一套风景明信片",
    category: "文字",
    themes: ["想念", "日常", "惊喜"],
    moods: ["想念 TA", "普通的一天", "想要惊喜"],
    icon: "🎴",
    packs: [
      {
        cardTitle: "挑一张寄出去，或者留着",
        message: "每张都是不同的风景。你可以寄给别人，也可以自己收着，当书签或者壁纸。",
        note: "慢慢挑。",
        style: "温柔"
      },
      {
        cardTitle: "给你的远方想象",
        message: "有些地方可能暂时去不了。这些明信片是一种很轻的替代，让你在纸上先走一走。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于收藏风景",
        message: "风景被印在纸上，就变成了可以触摸的东西。希望你喜欢其中的某几张。",
        note: "收好。",
        style: "安静"
      }
    ]
  },
  // 38. 保温杯
  {
    id: "thermos",
    name: "一个小型保温杯",
    category: "饮品",
    themes: ["关心", "日常"],
    moods: ["想被关心", "普通的一天", "需要鼓励"],
    icon: "🧴",
    packs: [
      {
        cardTitle: "水可以一直是温的",
        message: "出门在外，有时候很难找到热水。这个杯子不大，但能让你随身带着一点温度。",
        note: "别装太满。",
        style: "温柔"
      },
      {
        cardTitle: "给你的随身温度",
        message: "它不能保温一整天，但足够让你在几个小时里，喝到还算热的水。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于被照顾的细节",
        message: "有人会记得你可能需要热水。这个杯子就是那个「记得」的具体形式。",
        note: "每天带着。",
        style: "直接"
      }
    ]
  },
  // 39. 小闹钟
  {
    id: "alarm",
    name: "一个安静的小闹钟",
    category: "日常",
    themes: ["日常", "鼓励"],
    moods: ["普通的一天", "需要鼓励", "想被关心"],
    icon: "⏰",
    packs: [
      {
        cardTitle: "到点会轻轻响",
        message: "声音不大，不会把人吓醒。设定好时间，它会在你需要的时候提醒你。",
        note: "记得上发条或充电。",
        style: "温柔"
      },
      {
        cardTitle: "给你的时间提醒",
        message: "有时候需要一个外力，把自己从某件事里拉出来。这个闹钟可以扮演那个角色。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于守时的温柔",
        message: "闹钟不是催促，是提醒。希望它响的时候，你不会觉得被打扰，而是被轻轻推了一下。",
        note: "设定你需要的时间。",
        style: "安静"
      }
    ]
  },
  // 40. 空白画册
  {
    id: "sketchbook",
    name: "一本空白的小画册",
    category: "创作",
    themes: ["日常", "鼓励", "惊喜"],
    moods: ["普通的一天", "需要鼓励", "想要惊喜", "想去约会"],
    icon: "🎨",
    packs: [
      {
        cardTitle: "画或者不画都行",
        message: "本子是空的，笔你可以自己准备。想涂两笔就涂，不想就让它保持空白。空白也是一种状态。",
        note: "没有必须完成的作业。",
        style: "温柔"
      },
      {
        cardTitle: "给你的创作空间",
        message: "不一定要画得很好。乱涂、写字、贴东西，都可以。这是一个属于你的、不会被打分的地方。",
        note: null,
        style: "克制"
      },
      {
        cardTitle: "关于开始的许可",
        message: "有时候需要一个「可以开始」的信号。这本画册就是那个信号。你决定什么时候打开它。",
        note: "慢慢填。",
        style: "俏皮"
      }
    ]
  }
];

// 心情列表
const MOODS = [
  { id: "ordinary", label: "普通的一天", desc: "没什么特别，只是想收到一点什么" },
  { id: "care", label: "想被关心", desc: "今天有点累，想被轻轻照顾一下" },
  { id: "celebrate", label: "想庆祝", desc: "有好事发生，想分享一点喜悦" },
  { id: "date", label: "想去约会", desc: "想和 TA 一起做点什么" },
  { id: "encourage", label: "需要鼓励", desc: "有点低落，想听一点温暖的话" },
  { id: "miss", label: "想念 TA", desc: "突然很想 TA，想收到 TA 的痕迹" },
  { id: "surprise", label: "想要惊喜", desc: "今天想被一点点小惊喜击中" }
];

// 心情到礼物的映射辅助（实际抽取时会再过滤）
const MOOD_MAP = {
  "普通的一天": ["scarf", "flowers", "hot_cocoa", "letter", "book", "tea", "headphones", "night_light", "postcard", "keychain", "chocolate", "journal", "blanket", "candle", "umbrella", "photo_frame", "mug", "stickers", "fan", "hand_cream", "plant", "calendar", "earplugs", "sticky_notes", "eye_mask", "bookmark", "hand_warmer", "mirror", "room_spray", "pen", "snacks", "pouch", "postcard_set", "thermos", "alarm", "sketchbook"],
  "想被关心": ["scarf", "flowers", "hot_cocoa", "letter", "tea", "night_light", "blanket", "candle", "umbrella", "hand_cream", "plant", "earplugs", "eye_mask", "hand_warmer", "mirror", "thermos", "mug"],
  "想庆祝": ["flowers", "chocolate", "movie_ticket", "stickers", "music_box", "star_projector", "perfume", "postcard_set", "sketchbook"],
  "想去约会": ["movie_ticket", "flowers", "headphones", "stickers", "pen", "postcard", "perfume"],
  "需要鼓励": ["scarf", "hot_cocoa", "letter", "book", "tea", "night_light", "journal", "blanket", "candle", "plant", "calendar", "earplugs", "eye_mask", "hand_warmer", "pen", "snacks", "alarm", "sketchbook"],
  "想念 TA": ["scarf", "flowers", "movie_ticket", "letter", "headphones", "postcard", "keychain", "photo_frame", "star_projector", "perfume", "music_box", "postcard_set", "bookmark"],
  "想要惊喜": ["flowers", "movie_ticket", "headphones", "postcard", "chocolate", "star_projector", "perfume", "stickers", "music_box", "room_spray", "snacks", "postcard_set", "sketchbook"]
};

console.log(`内容包加载完成：${GIFTS.length} 种礼物，共 ${GIFTS.reduce((s, g) => s + g.packs.length, 0)} 套完整留言`);
