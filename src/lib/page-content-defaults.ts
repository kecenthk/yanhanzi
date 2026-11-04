export const pageKeys = ["home", "cases", "method", "services", "about", "alliance", "contact", "privacy", "global"] as const;

export type PageKey = (typeof pageKeys)[number];

export const pageMeta: Record<PageKey, { label: string; path: string; group: string; description: string }> = {
  global: { label: "全站导航与页脚", path: "/", group: "全站", description: "品牌名、导航栏目、页脚与通用行动区" },
  home: { label: "首页", path: "/", group: "页面文案", description: "首屏、案例、四维、服务、主理人、FAQ 与联盟" },
  cases: { label: "大宅案例", path: "/cases", group: "页面文案", description: "案例列表与案例详情页的通用文案" },
  method: { label: "四维方法", path: "/method", group: "页面文案", description: "四个维度的名称、说明与要点" },
  services: { label: "服务与交付", path: "/services", group: "页面文案", description: "服务类型、合作阶段、预算说明与 FAQ" },
  about: { label: "主理人与团队", path: "/about", group: "页面文案", description: "主理人介绍、团队分工与资料说明" },
  alliance: { label: "联盟合作", path: "/alliance", group: "页面文案", description: "联盟介绍、支持方向、伙伴条件与流程" },
  contact: { label: "预约项目沟通", path: "/contact", group: "页面文案", description: "联系方式标签、表单与联盟沟通说明" },
  privacy: { label: "隐私与素材说明", path: "/privacy", group: "页面文案", description: "信息处理方式与素材来源说明" },
};

export const pageContentDefaults = {
  global: {
    brand: {
      prefix: "艳汉子",
      suffix: "大定制",
      english: "YANHANZI",
      tagline: "让大宅，好看、好用，更好住。",
      location: "东莞 · 大湾区",
    },
    nav: [
      { href: "/cases", label: "大宅案例" },
      { href: "/method", label: "四维方法" },
      { href: "/services", label: "服务与交付" },
      { href: "/about", label: "主理人与团队" },
      { href: "/alliance", label: "联盟合作" },
    ],
    headerCta: "预约项目沟通",
    footer: {
      contactTitle: "开启一段关于家的对话",
      contactPlaceholder: "联系方式待配置",
      requirementLabel: "整理项目需求 →",
      copyrightName: "艳汉子大定制",
      copyrightNote: "空间因生活而有意义。",
      imageNote: "图片取自品牌提供的商业计划书",
      extraLinks: [
        { href: "/contact", label: "联系我们" },
        { href: "/privacy", label: "隐私与素材说明" },
      ],
    },
    contactBand: {
      homeTitle: "聊聊你想要的家。",
      homeText: "每个项目，都从一次认真倾听开始。",
      homeCta: "预约项目沟通",
      allianceTitle: "一起，把服务做扎实。",
      allianceText: "从理念、能力与具体项目开始，认真了解彼此。",
      allianceCta: "咨询联盟合作",
    },
  },
  home: {
    hero: {
      title: "好看，好用，\n更好住。",
      description: "精装升级与旧房整装，\n让每一处设计，回到生活本身。",
      ctaLabel: "查看大宅案例",
      ctaHref: "/cases",
      caption: "东莞 · 大宅居住提案 / 商业计划书封面意象",
      image: "/images/cover-interior.jpg",
      imageAlt: "深绿与自然光交织的居住空间，品牌商业计划书封面意象",
    },
    cases: {
      title: "让空间，回应真实生活。",
      subtitle: "每个家，都有自己的答案。",
      linkLabel: "看全部案例",
      linkHref: "/cases",
    },
    questions: [
      { href: "/services#upgrade", label: "精装，\n如何更有自己的样子？" },
      { href: "/method#storage", label: "收纳，\n怎样顺着生活习惯？" },
      { href: "/services#renovation", label: "旧房，\n如何回应新的生活？" },
    ],
    method: {
      title: "四个维度，\n一个完整的家。",
      text: "从生活方式出发，把设计、家具、定制与收纳放在一起考虑，让美感与实用彼此成就。",
      linkLabel: "了解四维方法",
      linkHref: "/method",
    },
    service: {
      title: "从想法，到日常。",
      image: "/images/cover-interior.jpg",
      imageAlt: "品牌空间意象中的材质与光线",
      imageNote: "商业计划书封面意象 · 非项目交付记录",
      ctaLabel: "了解服务与交付",
      ctaHref: "/services",
    },
    founder: {
      title: "理解空间，\n更理解生活。",
      quote: "主理人的判断，与团队的协同，\n一起构成服务的完整体验。\n在美学与实用之间，寻找属于每个家的平衡。",
      image: "/images/founder.jpg",
      imageAlt: "商业计划书中的艳汉子主理人照片",
      imageNote: "艳汉子 · 品牌主理人",
      linkLabel: "认识艳汉子",
      linkHref: "/about",
    },
    faq: {
      title: "在开始之前，\n你可能想了解。",
      linkLabel: "更多服务说明",
      linkHref: "/services#faq",
    },
    alliance: {
      title: "大湾区大宅 · 住得更好 IP 联盟",
      text: "与认同大宅服务理念的本地主理人，一起把服务做扎实。",
      linkLabel: "了解联盟合作",
      linkHref: "/alliance",
    },
  },
  cases: {
    meta: {
      title: "大宅案例",
      description: "从商业计划书所列南城悦府项目出发，观察空间、材质、家具与生活的关系。",
    },
    intro: {
      title: "每个家，\n都有自己的答案。",
      description: "从具体空间出发，理解设计如何回应生活。这里收录品牌资料中的项目图片与空间观察，保留原始图片署名。",
    },
    section: {
      label: "南城悦府 · 资料所列项目",
      sourceNote: "项目图取自品牌提供的商业计划书第6页，原图含 WAN RUN SPACE DESIGN 署名。具体服务分工、完工状态、面积与造价待补充，不作为本站已核实事实。",
    },
    detail: {
      metaCityLabel: "所在城市",
      metaCityValue: "东莞",
      metaLocationLabel: "项目位置",
      metaLocationValue: "南城悦府",
      metaSourceLabel: "素材来源",
      metaSourceValue: "品牌商业计划书",
      metaContentLabel: "本页内容",
      metaContentValue: "资料图片与空间观察",
      metaNote: "项目具体服务分工、图像性质、完工状态、面积、造价与工期，等待完整资料补充。本页观察不构成业主证言或实际交付承诺。",
      observationTitle: "从空间里，读懂生活。",
      imageCaptionPrefix: "商业计划书第6页项目图片 · 原图署名：WAN RUN SPACE DESIGN",
      methodLinkLabel: "了解背后的四维方法",
      otherTitle: "继续看看，另一种表达。",
      backLabel: "返回全部案例",
      cardNote: "商业计划书所列项目 · 原图署名保留",
      imageAltSuffix: "资料项目图，原图含 WAN RUN SPACE DESIGN 署名",
    },
  },
  method: {
    meta: {
      title: "四维大宅方法",
      description: "大定制、大家居、大设计、大宅收纳，从生活方式出发，整体考虑美学与实用。",
    },
    intro: {
      title: "四个维度，\n一个完整的家。",
      description: "好看、好用与好住，来自空间各部分的共同配合。我们把定制、家具、设计与收纳放在同一套居住逻辑下考虑。",
    },
    methods: [
      {
        no: "01",
        name: "大定制",
        summary: "从使用习惯出发。",
        detail: "从柜体布局、功能分区到细节选材，让定制真正适合家庭的日常。",
        question: "先想清楚怎么用，再决定怎么做。",
        points: ["家庭成员的使用习惯", "不同空间的功能关系", "尺寸、五金与材料的协同"],
      },
      {
        no: "02",
        name: "大家居",
        summary: "让家具与空间彼此呼应。",
        detail: "把柜体、家具、软装放在同一幅画面里考虑，建立整体而有层次的居住氛围。",
        question: "整体的美感，藏在彼此的关系里。",
        points: ["家具尺度与空间留白", "材质、色彩与灯光的关系", "美感与日常使用的平衡"],
      },
      {
        no: "03",
        name: "大设计",
        summary: "把动线与采光一起考虑。",
        detail: "从全局梳理空间关系，兼顾家人之间的互动、独处与生活的流动。",
        question: "好的设计，先理解一家人的生活。",
        points: ["原有空间的保留与调整", "公共空间与私密空间", "采光、视线与生活动线"],
      },
      {
        no: "04",
        name: "大宅收纳",
        summary: "给物品安排合适的位置。",
        detail: "按物品、频率与使用者规划收纳，让取放顺手，让空间保持从容。",
        question: "收纳的起点，是物品和人的关系。",
        points: ["按成员与使用场景分区", "常用与低频物品的安排", "给家庭变化预留余量"],
      },
    ],
    note: "每一项方法都需要回到具体的房屋、家庭与预算中讨论。材料配置、设计成果与服务范围，以项目实际约定为准。",
    linkLabel: "去案例中看看空间表达",
    linkHref: "/cases",
  },
  services: {
    meta: {
      title: "服务与交付",
      description: "了解精装升级与旧房整装的服务方向、沟通阶段与预算形成方式。",
    },
    intro: {
      title: "从想法，\n一步步走向日常。",
      description: "先理解家庭与房屋，再讨论设计与落地。服务范围、预算和阶段安排，都从具体项目出发，一项项沟通清楚。",
    },
    types: [
      {
        id: "upgrade",
        no: "01 / 精装升级",
        title: "在已有基础上，\n长出自己的生活。",
        summary: "适合已有精装基础，希望进一步改善定制、收纳、家具软装或空间整体感受的家庭。",
        points: ["梳理原有空间的保留与调整", "讨论定制与收纳的使用需求", "统筹家具、软装与空间关系"],
      },
      {
        id: "renovation",
        no: "02 / 旧房整装",
        title: "让熟悉的家，\n回应新的生活。",
        summary: "适合家庭需求发生变化，希望重新梳理空间关系、居住习惯与整体搭配的旧房业主。",
        points: ["从房屋现状与家庭变化开始", "讨论布局与日常动线的关系", "确认设计、施工及定制协同范围"],
      },
    ],
    process: {
      title: "先把过程，沟通清楚。",
      note: "以下为合作阶段说明。具体成果、责任分工与节点安排，在项目中逐项确认。",
    },
    steps: [
      { no: "01", title: "需求沟通", body: "从房屋现状、家庭成员与生活习惯开始，梳理期待、范围和优先级。", output: "沟通项目需求与服务匹配度" },
      { no: "02", title: "设计协同", body: "在空间、定制、家具与收纳之间建立整体关系，讨论设计取舍与预算安排。", output: "按约定推进方案与范围确认" },
      { no: "03", title: "落地配合", body: "围绕确认的服务范围，沟通材料、进度与关键节点，让设计与实际工作相互衔接。", output: "按项目约定推进节点确认" },
    ],
    budget: {
      title: "预算，是具体选择\n共同形成的结果。",
      text1: "房屋现状、调整范围、材料配置、定制内容和家具软装，都会参与预算的形成。先确认需求的优先级，再讨论适合的投入与取舍。",
      text2: "设计、施工、柜体、家具家电及其他费用是否包含，需要分别确认。网站暂不提供统一套餐、固定工期或付款节点承诺。",
      note: "资料中提及的11节点交付体系，完整内容待团队确认；本页不将概览阶段替代为11节点的实际SOP。",
    },
    faq: {
      title: "关于合作，你可能还想了解。",
      items: [
        { question: "哪些房屋需求适合先沟通？", answer: "精装交付后希望改善整体搭配、定制或收纳的家庭，以及希望重新梳理空间与生活方式的旧房业主，都可以先了解服务匹配度。具体承接范围需要结合房屋现状与团队安排确认。" },
        { question: "可以只做局部升级吗？", answer: "可以先沟通具体空间与问题，再判断局部调整是否能够回应需求。设计、定制、施工及家具软装的范围，在项目沟通后分别确认。" },
        { question: "如何了解预算？", answer: "预算会受到房屋现状、工作范围、材料配置及家具软装选择等影响。网站暂不提供统一套餐价格，建议先整理需求，再讨论适合的范围与预算。" },
        { question: "现在可以预约量房或看样板吗？", answer: "官网联系入口正在配置，暂不接收线上预约。量房、到店和样板参观需要结合服务条件、接待安排及业主授权另行确认。" },
      ],
    },
  },
  about: {
    meta: {
      title: "主理人与团队",
      description: "认识艳汉子，了解品牌对大宅美学、日常收纳与项目协同的思考。",
    },
    intro: {
      title: "理解空间，\n更理解生活。",
      description: "我们关注空间呈现，也关注一家人长期如何使用这个家。在设计的每一次选择里，让美学与实用保持对话。",
    },
    founder: {
      label: "艳汉子大定制",
      title: "以实战，\n重构大宅美学。",
      quote: "品牌从东莞本地大宅需求出发，围绕整体设计、全屋定制、家具软装和收纳，寻找适合改善家庭的居住表达。",
      note: "“大宅闺蜜”是资料中的亲切表达。真正的理解，应体现在需求沟通、设计取舍与具体协作中。",
      linkLabel: "看见空间中的想法",
      linkHref: "/cases",
      image: "/images/founder.jpg",
      imageAlt: "艳汉子主理人照片，来自品牌商业计划书",
      imageNote: "艳汉子 · 主理人 / 照片由品牌资料提供",
    },
    question: {
      title: "让美学成为日常，\n让实用经得起生活。",
    },
    team: {
      title: "主理人的判断，\n与团队的协同。",
      description: "每个项目的人员配置、参与环节与具体责任，依据实际服务范围确认。",
      items: [
        { title: "设计与需求", body: "把家庭需求转化为空间问题，讨论整体关系，明确设计取舍与阶段成果。" },
        { title: "项目与落地", body: "把确认的方案与材料、定制和现场工作衔接，沟通进度与关键节点。" },
      ],
      sourceNote: "具体团队履历、成员名单及主理人参与范围，待正式资料补充后更新。",
    },
  },
  alliance: {
    meta: {
      title: "大湾区大宅·住得更好IP联盟",
      description: "面向本地实际经营者，围绕获客、设计、交付与供应链，共同探讨大宅服务的合作方式。",
    },
    intro: {
      title: "与本地主理人一起，\n把大宅服务做扎实。",
      text: "大湾区大宅 · 住得更好 IP 联盟\n从真实项目出发，围绕获客、设计、交付与供应链，共同探讨本地大宅服务的经营与协作。",
      ctaLabel: "咨询联盟合作",
    },
    support: {
      title: "共同的理念，\n具体的支持。",
      description: "以下为商业计划书提出的合作方向。实际交付清单、支持形式与适用条件，需要在合作沟通中确认。",
      items: [
        { no: "01", title: "经营与交付方法", body: "围绕楼盘样板、需求沟通与项目协同，交流可执行的方法与工具。" },
        { no: "02", title: "设计与内容协作", body: "以真实项目为基础，积累设计表达、主理人内容与案例复盘。" },
        { no: "03", title: "供应链协作", body: "探讨选材、供货与项目配合，让设计与供应链保持一致的服务目标。" },
        { no: "04", title: "培训与项目交流", body: "通过方法讨论、样板学习和项目复盘，共同提高本地服务能力。" },
      ],
    },
    fit: {
      title: "适合怎样的伙伴？",
      items: [
        { title: "愿意亲自参与本地经营", body: "面向认同四维大宅理念的定制门店主理人、独立设计师与软装工作室，重视真实需求、项目能力与长期口碑。" },
        { title: "具备或愿意建立落地能力", body: "结合所在城市、团队基础、项目资源与本人投入，评估双方是否匹配。具体准入与合作责任需进一步沟通。" },
        { title: "以真实项目积累方法", body: "通过项目记录、案例复盘与团队交流，逐步形成可共享、可检验的服务经验。" },
      ],
    },
    note: "联盟目前展示合作方向。具体收费、城市授权、分佣、培训复训与陪跑权益待确认；本页不承诺经营收益。广州相关品牌、项目与授权关系，待正式资料确认后再行披露。",
    steps: ["初步了解理念与诉求", "沟通城市与团队基础", "核实具体条件与责任"],
  },
  contact: {
    meta: {
      title: "预约项目沟通",
      description: "整理房屋与生活需求，为一次认真沟通做好准备。",
    },
    intro: {
      projectTitle: "聊聊你想要的家。",
      projectDescription: "每个项目，都从一次认真倾听开始。可以先想一想房屋现状、家人的生活方式，以及最希望改善的事。",
      allianceTitle: "从一次了解，\n开始合作的可能。",
      allianceDescription: "可以先梳理所在城市、团队基础与合作诉求。联盟咨询入口正在配置，暂不接收线上申请。",
    },
    aside: {
      phoneLabel: "项目咨询电话",
      wechatLabel: "微信 / 企业微信",
      emailLabel: "联系邮箱",
      visitLabel: "到店与参观",
      visitText: "接待地址与服务时间待配置。量房、到店及样板参观需提前确认安排。",
      placeholder: "待配置",
      privacyNote: "请勿在提纲中填写身份证、门牌、财务信息等敏感内容。提交前请确认信息仅用于项目沟通。",
    },
    form: {
      noticeTitle: "咨询通道待配置",
      noticeText: "可以先整理项目需求。信息仅用于当前页面生成提纲，不会发送或保存到服务器。",
      enabledNoticeTitle: "可以提交项目需求",
      enabledNoticeText: "提交后会保存到官网后台，仅用于项目沟通与服务匹配，不会用于营销推送。",
      disabledNote: "生成提纲需要开启浏览器 JavaScript；咨询通道开启后可提交需求。",
      nameLabel: "怎么称呼你",
      namePlaceholder: "例如：陈先生",
      phoneLabel: "联系电话",
      phonePlaceholder: "手机号或微信同号",
      cityLabel: "所在城市",
      cityPlaceholder: "例如：东莞",
      directionLabel: "项目方向",
      directionOptions: ["精装升级", "旧房整装", "定制与收纳", "家具与软装", "先了解服务"],
      areaLabel: "房屋面积（选填）",
      areaPlaceholder: "例如：约 160㎡",
      timingLabel: "计划时间（选填）",
      timingOptions: ["尚未确定", "三个月内", "半年内", "半年以后"],
      needsLabel: "希望改善什么？",
      needsPlaceholder: "聊聊房屋现状、生活习惯，以及你最在意的问题……",
      generateLabel: "生成沟通提纲",
      briefTitle: "你的项目沟通提纲",
      copyLabel: "复制提纲",
      briefNote: "提纲在浏览器本地生成，刷新或离开页面后不会保留。",
      submitLabel: "提交项目需求",
      submittingLabel: "正在提交…",
      successText: "已收到你的需求，我们会通过所留联系方式与你沟通。",
      errorText: "提交未成功，请稍后再试，或检查联系电话是否完整。",
    },
    alliancePanel: {
      noticeTitle: "联盟合作入口待配置",
      noticeText: "正式咨询渠道开通后，可围绕所在城市、现有业务、团队情况与合作诉求展开沟通。",
      title: "沟通前，可以先想想。",
      questions: [
        "01 / 目前在什么城市，主要提供哪些服务？",
        "02 / 自己和团队具备哪些设计或落地能力？",
        "03 / 希望在项目、内容或供应链中获得怎样的支持？",
        "04 / 计划投入哪些时间和资源参与实际经营？",
      ],
    },
  },
  privacy: {
    meta: {
      title: "隐私与素材说明",
      description: "说明当前网站的信息处理方式、素材来源，以及联系入口的开放状态。",
    },
    intro: {
      title: "隐私与素材说明",
      description: "说明当前网站的信息处理方式、素材来源，以及联系入口的开放状态。",
    },
    sections: [
      {
        title: "当前联系功能",
        paragraphs: [
          "咨询通道是否开启，以联系页面显示为准。未开启时，需求提纲只在当前浏览器页面生成，不会上传至服务器、写入浏览器持久存储或发送给外部平台。离开或刷新页面后，页面状态不会保留。使用复制功能时，提纲会写入设备剪贴板。",
          "咨询通道开启后，提交的称呼、联系电话、城市、房屋信息与需求描述会保存到本官网后台，仅用于项目沟通与服务匹配。后台仅管理员可访问。",
        ],
      },
      {
        title: "网站访问",
        paragraphs: [
          "当前应用未接入广告追踪或第三方分析。托管服务可能为提供访问服务及维护安全处理必要的技术日志；这与项目需求信息的处理方式不同。",
        ],
      },
      {
        title: "图片与项目内容",
        paragraphs: [
          "空间图、项目图与主理人照片取自品牌方提供的《艳汉子大定制·大湾区大宅-住得更好IP联盟商业计划书》。封面图作为空间意象使用。两个南城悦府项目图保留原图 WAN RUN SPACE DESIGN 署名。",
          "项目图片的性质、完整设计与施工分工、完工状态及相关权限，以品牌方后续确认资料为准。本站未将未确认的面积、造价、工期或业主评价作为事实发布。项目页的空间观察是对资料图片的说明，不作为业主证言。",
        ],
      },
      {
        title: "信息更新与联系",
        paragraphs: [
          "经营主体、对外联系渠道及素材补充正在配置。涉及素材或信息更正，可通过品牌既有联系渠道反馈。",
        ],
      },
    ],
  },
} as const;

export type PageContentMap = typeof pageContentDefaults;
