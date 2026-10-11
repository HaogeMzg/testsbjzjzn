# CAC 2026 战队页（复刻测试版）

这是 [CAC 2026 官网战队页](https://cac.pwesports.cn/2026/team) 的纯静态复刻版本，用于本地测试与学习。

## 功能

- **16 支参赛战队**：点击顶部战队 Logo 切换战队详情（战队背景图、队标、分组）
- **选手数据卡**：点击选手名切换 ADR / Rating Pro / 击杀 / 场次 / 爆头率 五项数据
- **战队赛程**：自动展示当前战队的历史比赛（对阵、比分、胜者标记、B 站回放链接）
- **中英文切换**：右上角 中 / EN 切换界面语言
- **Banner 轮播**：官方主视觉与赞助商轮播图
- **右侧悬浮导航**：滚动后出现，点击平滑定位、回到顶部

## 目录结构

```
cac2026-team/
├── index.html      # 页面入口
├── css/
│   └── style.css   # 全部样式（提取自官网并改写）
├── js/
│   ├── data.js     # 战队/选手/赛程数据快照（抓取自官方接口）
│   └── main.js     # 渲染与交互逻辑（零依赖，原生 JS）
├── .gitignore
└── README.md
```

## 本地运行

无需构建，任选其一：

```bash
# 方式一：Python
python3 -m http.server 8000

# 方式二：Node.js
npx serve .
```

浏览器打开 <http://localhost:8000> 即可。直接双击 `index.html` 也能打开。

## 部署到 GitHub Pages

1. 在 GitHub 上新建一个仓库（例如 `cac2026-team`）
2. 把本目录内容推上去：

```bash
git init
git add .
git commit -m "CAC 2026 team page clone"
git branch -M main
git remote add origin https://github.com/<你的用户名>/cac2026-team.git
git push -u origin main
```

3. 仓库 **Settings → Pages**，Source 选择 `Deploy from a branch`，分支选 `main`、目录选 `/ (root)`，保存
4. 稍等 1~2 分钟，访问 `https://<你的用户名>.github.io/cac2026-team/`

## 说明

- 数据为抓取官方接口后的静态快照（16 支战队、80 名选手、24 场比赛），不会实时更新
- 页面图片（战队 Logo、选手海报、背景装饰图）与文字内容直接引用自完美世界电竞官方 CDN 及原站资源，版权归原作者所有
- 本项目仅用于本地测试与前端学习，请勿用于商业用途
