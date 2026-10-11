/* ============================================================
   CAC 2026 战队页 - 复刻版交互脚本
   功能：战队切换 / 选手切换 / 赛程联动 / 中英切换 / Banner轮播 / 右侧导航
   ============================================================ */
(function () {
  "use strict";

  var teams = CAC_DATA.teams;      // 16 支战队
  var matches = CAC_DATA.matches;  // 24 场比赛

  var state = {
    teamIndex: 0,
    playerIndex: 0,
    lang: "zh"
  };

  /* ---------- i18n 文案 ---------- */
  var I18N = {
    zh: {
      nav_home: "首页", nav_live: "直播", nav_schedule: "赛程", nav_team: "战队",
      nav_ticket: "购票", nav_news: "新闻", nav_galleries: "图片", nav_data: "数据",
      nav_partner: "合作伙伴",
      right_home: "首页", right_teams: "参赛队伍", right_schedule: "赛程",
      right_partners: "合作伙伴", back_top: "回到顶部",
      top_more: "更多：", top_select: "前往其他平台",
      player_stats: "- 选手数据 -",
      stat_rating: "Rating Pro", stat_kills: "击杀", stat_matches: "场次", stat_hs: "爆头率",
      win: "胜", replay: "回放", no_match: "该战队暂无赛程记录",
      about_cac: '• CS亚洲邀请赛(CAC)——由完美世界电竞举办的世界T1级别线下CS赛事。<br />• CAC系列赛事始于2018年，CAC 2026赛事总奖金为100万美元，16支世界豪门战队将再度云集中国，为广大中国玩家带来2026年度CS线下超级盛宴。<br />• 凭借传承8年的赛事经验，CAC努力将世界顶尖力量引入中国，并推动亚洲CS水平的长远发展。CAC致力于打造高品质、高水平的CS赛事，一切是为了广大CS玩家与参赛战队。'
    },
    en: {
      nav_home: "Home", nav_live: "Live", nav_schedule: "Schedule", nav_team: "Teams",
      nav_ticket: "Ticket", nav_news: "News", nav_galleries: "Galleries", nav_data: "Data",
      nav_partner: "Partners",
      right_home: "Home", right_teams: "Teams", right_schedule: "Schedule",
      right_partners: "Partners", back_top: "Back Top",
      top_more: "More:", top_select: "Other Platforms",
      player_stats: "- PLAYER STATS -",
      stat_rating: "Rating Pro", stat_kills: "Kills", stat_matches: "Matches", stat_hs: "HS%",
      win: "WIN", replay: "REPLAY", no_match: "No matches for this team yet",
      about_cac: 'After a bright return in 2025, the CAC series forges onwards with its next iteration in 2026!<br />The Counter-Strike Asia Championships (CAC) series is the top tier Asian CS LAN series, hosted by Perfect World Esports.<br />CAC 2026 will boast a $1,000,000 prizepool, featuring 16 world-class teams competing on site in Shanghai, China in front of an electrifying live audience.<br />In 2026 and beyond, CAC continues the Perfect World Esports mission of bringing the best in Asia to the world, and the best globally to Asia -- for the fans and for the teams.'
    }
  };

  function t(key) { return I18N[state.lang][key] || key; }

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ================= Banner 轮播 ================= */
  var BANNER_SLIDES = [
    { img: "https://img.csgo.com.cn/csgostatic/csgo/eca26945-bd57-4424-9e59-43d76215470d.jpg" },
    { img: "https://static.pwesports.cn/esportsadmin/CSGO/cac2026/banner/banner-nv-1.jpg", link: "https://www.nvidia.cn/geforce/", alt: "NV" },
    { img: "https://static.pwesports.cn/esportsadmin/CSGO/2026-5-7/26f20c6e-1d93-44de-9d13-b53094d4ebb6.jpg", link: "https://www.intel.cn/content/www/cn/zh/homepage.html", alt: "Intel" },
    { img: "https://static.pwesports.cn/esportsadmin/esports/cac2026/banner/banner-agon.jpg", alt: "Agon" },
    { img: "https://static.pwesports.cn/esportsadmin/esports/cac2026/banner/banner-samsung-new.jpg", link: "https://www.samsung.com.cn/memory-storage/nvme-ssd/9100-pro-1tb-nvme-pcie-gen-5-mz-vap1t0bw/" },
    { img: "https://static.pwesports.cn/esportsadmin/CSGO/cac2026/banner/banner-rog.jpg", link: "https://mall.jd.com/index-1000412245.html?from=pc" },
    { img: "https://static.pwesports.cn/esportsadmin/CSGO/cac2026/banner/banner-mechrevo.jpg", link: "https://item.jd.com/100332458584.html" },
    { img: "https://static.pwesports.cn/esportsadmin/CSGO/cac2026/banner/banner-msi-new2.jpg", link: "https://item.jd.com/100146702289.html" },
    { img: "https://static.pwesports.cn/esportsadmin/CSGO/2026-4-15/f65d894b-bc48-4efb-ab3c-2c87d57e5ada.jpg" }
  ];

  function initBanner() {
    var track = $("bannerTrack");
    var pagi = $("bannerPagination");
    var slides = [];
    BANNER_SLIDES.forEach(function (s, i) {
      var slide = el("div", "swiper-slide");
      if (s.link) {
        slide.innerHTML = '<a href="' + esc(s.link) + '" target="_blank"><img src="' + esc(s.img) + '" alt="' + esc(s.alt || "") + '" /></a>';
      } else {
        slide.innerHTML = '<img src="' + esc(s.img) + '" alt="' + esc(s.alt || "") + '" />';
      }
      track.appendChild(slide);
      slides.push(slide);

      var dot = el("span", i === 0 ? "active" : "");
      dot.addEventListener("click", (function (idx) {
        return function () { goTo(idx); };
      })(i));
      pagi.appendChild(dot);
    });

    var current = 0;
    function goTo(i) {
      current = i;
      track.style.transform = "translateX(-" + (i * 100) + "%)";
      var dots = pagi.children;
      for (var j = 0; j < dots.length; j++) dots[j].className = j === i ? "active" : "";
    }
    var timer = setInterval(function () { goTo((current + 1) % slides.length); }, 5000);
    track.addEventListener("mouseenter", function () { clearInterval(timer); });
  }

  /* ================= 战队 Tabs ================= */
  function initTeamTabs() {
    var tabs = $("teamTabs");
    teams.forEach(function (team, i) {
      var li = el("li");
      li.innerHTML = '<img src="' + esc(team.logo) + '" alt="' + esc(team.name) + '" title="' + esc(team.name) + '" />';
      li.addEventListener("click", (function (idx) {
        return function () { selectTeam(idx, 0); };
      })(i));
      tabs.appendChild(li);
    });
  }

  /* ================= 选择战队 ================= */
  function selectTeam(teamIndex, playerIndex) {
    state.teamIndex = teamIndex;
    state.playerIndex = playerIndex || 0;
    var team = teams[teamIndex];

    // tabs 高亮
    var lis = $("teamTabs").children;
    for (var i = 0; i < lis.length; i++) lis[i].className = i === teamIndex ? "cur" : "";

    // 战队信息
    $("teamName").textContent = team.name;
    $("teamBg").src = team.bg ? team.bg + "?x-oss-process=image/resize,m_lfit,w_912" : "";
    $("teamLogo").src = team.logo;

    // 选手列表
    var member = $("teamMember");
    member.innerHTML = "";
    team.players.forEach(function (p, i) {
      var li = el("li", i === state.playerIndex ? "cur" : "", esc(p.name));
      li.title = p.name;
      li.addEventListener("click", (function (idx) {
        return function () { selectPlayer(idx); };
      })(i));
      member.appendChild(li);
    });

    renderPlayer();
    renderMatchList();
  }

  /* ================= 选择选手 ================= */
  function selectPlayer(playerIndex) {
    state.playerIndex = playerIndex;
    var lis = $("teamMember").children;
    for (var i = 0; i < lis.length; i++) lis[i].className = i === playerIndex ? "cur" : "";
    renderPlayer();
  }

  function renderPlayer() {
    var team = teams[state.teamIndex];
    var p = team.players[state.playerIndex];
    if (!p) return;
    $("playerName").textContent = p.name;
    $("playerPhoto").src = p.photo ? p.photo + "?x-oss-process=image/resize,m_lfit,w_400" : "";
    var s = p.stats || {};
    $("statAdr").textContent = s.adr != null ? s.adr : "--";
    $("statRating").textContent = s.rating != null ? s.rating : "--";
    $("statKills").textContent = s.kills != null ? s.kills : "--";
    $("statMatches").textContent = (s.matches != null ? s.matches : "0") + (state.lang === "zh" ? "场" : "");
    $("statHs").textContent = (s.hs != null ? s.hs : "0") + "%";
  }

  /* ================= 赛程列表（当前战队） ================= */
  function renderMatchList() {
    var team = teams[state.teamIndex];
    var list = $("matchList");
    list.innerHTML = "";
    var teamMatches = matches.filter(function (m) {
      return m.team1.id === team.id || m.team2.id === team.id;
    });

    if (!teamMatches.length) {
      var li = el("li");
      li.innerHTML = '<div class="no-match">' + esc(t("no_match")) + "</div>";
      list.appendChild(li);
      return;
    }

    teamMatches.forEach(function (m) {
      var winHtml1 = m.winTeamId && m.team1.id === m.winTeamId ? "<i>" + esc(t("win")) + "</i>" : "";
      var winHtml2 = m.winTeamId && m.team2.id === m.winTeamId ? "<i>" + esc(t("win")) + "</i>" : "";
      var videoHtml = "";
      var videos = Array.isArray(m.videos) ? m.videos : [];
      videos.forEach(function (v) {
        // 兼容两种格式: "url" 或 {map:"1", url:"..."}（按地图编号）
        var url = typeof v === "string" ? v : v.url;
        var label = t("replay") + (typeof v === "object" && v.map ? " Map " + v.map : "");
        if (url) videoHtml += '<a href="' + esc(url) + '" target="_blank"><span>' + esc(label) + "</span></a>";
      });

      var li = el("li");
      li.innerHTML =
        '<div class="time"><span>' + esc(m.date) + " " + esc(m.time) + "</span>" +
        (m.stage === 0 ? "<strong>" + esc(m.team1.group || "") + "</strong>" : "") +
        "</div>" +
        '<div class="team-info">' +
        '<div class="team">' +
        '<p class="name">' + winHtml1 + "<span>" + esc(m.team1.name) + "</span></p>" +
        '<img src="' + esc(m.team1.logo) + '" alt="' + esc(m.team1.name) + '" />' +
        "</div>" +
        '<p class="vs">vs</p>' +
        '<div class="team">' +
        '<img src="' + esc(m.team2.logo) + '" alt="' + esc(m.team2.name) + '" />' +
        '<p class="name">' + winHtml2 + "<span>" + esc(m.team2.name) + "</span></p>" +
        "</div>" +
        '<div class="video">' + videoHtml + "</div>" +
        "</div>" +
        '<div class="score">' +
        "<span>" + esc(m.team1.score != null ? m.team1.score : "-") + "</span><i>:</i><span>" +
        esc(m.team2.score != null ? m.team2.score : "-") + "</span>" +
        "</div>";
      list.appendChild(li);
    });
  }

  /* ================= 语言切换 ================= */
  function applyLang(lang) {
    state.lang = lang;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.title = lang === "zh" ? "CAC 2026 ｜ 战队（复刻测试页）" : "CAC 2026 ｜ Teams (Clone)";
    $("langZh").className = lang === "zh" ? "active" : "";
    $("langEn").className = lang === "en" ? "active" : "";

    // 替换所有带 data-i18n 的文案
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute("data-i18n");
      if (I18N[lang][key] !== undefined) nodes[i].innerHTML = I18N[lang][key];
    }
    renderPlayer();
    renderMatchList();
  }

  function initLang() {
    $("langZh").addEventListener("click", function () { applyLang("zh"); });
    $("langEn").addEventListener("click", function () { applyLang("en"); });
  }

  /* ================= 顶部导航 ================= */
  function initTopNav() {
    var spans = $("topNav").querySelectorAll("span[data-link]");
    for (var i = 0; i < spans.length; i++) {
      (function (span) {
        span.addEventListener("click", function () {
          var link = span.getAttribute("data-link");
          if (link) window.open(link);
        });
        span.addEventListener("mouseenter", function () {
          var indicator = $("navIndicator");
          if (span.previousElementSibling !== indicator) {
            indicator.style.left = span.offsetLeft + "px";
          }
        });
      })(spans[i]);
    }
    $("topNav").addEventListener("mouseleave", function () {
      $("navIndicator").style.left = "294px"; // team 默认位置
    });
  }

  /* ================= 右侧悬浮导航 ================= */
  function initRightNav() {
    var nav = $("rightNavbar");
    var items = nav.querySelectorAll("li[data-target]");
    window.addEventListener("scroll", function () {
      var show = (window.pageYOffset || document.documentElement.scrollTop) > 120;
      nav.className = show ? "right-navbar show" : "right-navbar";
    });
    for (var i = 0; i < items.length; i++) {
      (function (li) {
        li.addEventListener("click", function () {
          var target = document.getElementById(li.getAttribute("data-target"));
          if (target) target.scrollIntoView({ behavior: "smooth" });
        });
      })(items[i]);
    }
  }

  /* ================= 分享图标 ================= */
  function initShare() {
    var icons = document.querySelectorAll(".share-icon .icon[data-link]");
    for (var i = 0; i < icons.length; i++) {
      (function (icon) {
        icon.addEventListener("click", function () {
          window.open(icon.getAttribute("data-link"));
        });
      })(icons[i]);
    }
  }

  /* ================= 页脚（合作伙伴 + 官方平台） ================= */
  var PARTNERS = [
    { img: "https://img.csgo.com.cn/csgostatic/csgo/e9519513-3122-4188-98d3-95531baebbad.png" },
    { img: "https://img.csgo.com.cn/csgostatic/csgo/4a2feec7-e020-4058-81d9-d2677042c3f6.png" },
    { img: "https://img.csgo.com.cn/csgostatic/csgo/fb28ae98-f7f4-47ec-8db1-7fdb44ace17a.png" },
    { img: "https://img.csgo.com.cn/csgostatic/csgo/18e361f4-af09-4f84-8301-4e4e5fe2dd32.png" },
    { img: "https://img.csgo.com.cn/csgostatic/csgo/f314e8ae-45c6-4fe2-b838-a4884e9235e1.png" },
    { img: "https://img.csgo.com.cn/csgostatic/csgo/2fba19e8-60e4-4ed1-82fc-00d8a3067926.png" },
    { img: "https://img.csgo.com.cn/csgostatic/csgo/71ae6707-c6c0-46bb-b6dd-3a2ff5192a41.png" },
    { img: "https://img.csgo.com.cn/csgostatic/csgo/c900d8ec-5f93-4fa1-9a99-526e01aac092.png" },
    { img: "https://img.csgo.com.cn/csgostatic/csgo/ca110b78-f268-4572-ba6b-0e61e0c19d73.png" }
  ];

  var PLATFORMS = [
    { img: "https://img.csgo.com.cn/csgostatic/csgo/4d14ed54-8644-4695-bc05-1e50e5022a2f.png", name: { zh: "完美世界电竞 - 微博", en: "PWE - Weibo" } },
    { img: "https://static.pwesports.cn/esportsadmin/esports/2026-5-11/198e7077-4cac-4864-85af-9e4158073e4e.jpg", name: { zh: "完美世界电竞 - 抖音", en: "PWE - Douyin" } },
    { img: "https://img.csgo.com.cn/csgostatic/csgo/4da45390-b306-4581-a026-9963cbe809eb.jpg", name: { zh: "完美世界电竞CS赛事", en: "PWE CS" } },
    { img: "https://img.csgo.com.cn/csgostatic/csgo/74f288fa-c3b2-41bf-9d25-3e36bbebbaed.jpg", name: { zh: "完美世界电竞 - 微信公众号", en: "PWE - WeChat" } },
    { img: "https://img.csgo.com.cn/csgostatic/csgo/285a0e41-223f-49e2-ac53-6b5c19f7a353.jpg", name: { zh: "反恐精英 - 视频号", en: "CS - Channels" } },
    { img: "https://img.dota2.com.cn/dota2static/file/2679bfef-3147-4619-8cc7-f6be43777597.png", name: { zh: "完美世界电竞APP", en: "PWE App" } },
    { img: "https://img.dota2.com.cn/dota2static/file/c2418bc8-b8a9-4a0e-ae56-c7470cf4bd6f.png", name: { zh: "完美世界竞技平台", en: "PVP Platform", link: "https://pvp.wanmei.com" } },
    { img: "https://img.csgo.com.cn/csgostatic/csgo/e3708469-695c-4b45-b580-475b67cb6cd7.png", name: { zh: "反恐精英 - B站", en: "CS - Bilibili" } },
    { img: "https://img.dota2.com.cn/dota2static/file/9d58ca65-d0f0-42ba-a33a-496821ebcd3a.png", name: { zh: "反恐精英 - 抖音", en: "CS - Douyin" } },
    { img: "https://img.dota2.com.cn/dota2static/file/14f6743e-37e1-460c-8168-cb0ef4993af8.png", name: { zh: "反恐精英 - 快手", en: "CS - Kuaishou" } },
    { img: "https://img.dota2.com.cn/dota2static/file/24b053fc-30c1-43d2-9208-596c1452fbf6.png", name: { zh: "反恐精英 - 小红书", en: "CS - RedNote" } },
    { img: "https://img.dota2.com.cn/dota2static/file/76b89695-0c13-4b47-982d-aefb03c76981.jpg", name: { zh: "CS交流群", en: "CS Community" } }
  ];

  function initFooter() {
    var plist = $("partnerList");
    PARTNERS.forEach(function (p) {
      var li = el("li");
      li.innerHTML = '<div class="img-box"><img src="' + esc(p.img) + '" alt="partner" /></div>';
      plist.appendChild(li);
    });
    var flist = $("platformList");
    PLATFORMS.forEach(function (p) {
      var li = el("li");
      var img = '<img src="' + esc(p.img) + '" alt="' + esc(p.name.zh) + '" />';
      var box = p.link
        ? '<a href="' + esc(p.link) + '" target="_blank">' + img + "</a>"
        : img;
      li.innerHTML =
        '<p class="code-box' + (p.link ? " hide" : "") + '">' + box + "</p>" +
        '<p class="name"><span data-platform="' + esc(p.name.zh) + '" data-platform-en="' + esc(p.name.en) + '">' +
        esc(p.name.zh) + "</span></p>";
      flist.appendChild(li);
    });
  }

  function refreshPlatformNames() {
    var spans = document.querySelectorAll("[data-platform]");
    for (var i = 0; i < spans.length; i++) {
      spans[i].textContent = state.lang === "zh"
        ? spans[i].getAttribute("data-platform")
        : spans[i].getAttribute("data-platform-en");
    }
  }

  /* ================= 启动 ================= */
  function init() {
    initBanner();
    initTeamTabs();
    initFooter();
    initLang();
    initTopNav();
    initRightNav();
    initShare();

    // 原站行为：随机展示一支战队（这里默认 TYLOO，也可随机）
    var defaultIdx = Math.floor(Math.random() * teams.length);
    selectTeam(defaultIdx, 0);

    // 语言切换时同步平台名
    var oldApply = applyLang;
    applyLang = function (lang) { oldApply(lang); refreshPlatformNames(); };
    $("langZh").addEventListener("click", function () { refreshPlatformNames(); });
    $("langEn").addEventListener("click", function () { refreshPlatformNames(); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
