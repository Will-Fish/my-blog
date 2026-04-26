# Stitch Prompt 清单

> 基于 `PRD_个人博客网站.md` 转换的 Stitch 原型生成 Prompt
> 建议逐页生成，风格统一为 **暗色极简 + 摄影感**

---

## 设计语言约定

在开始生成前，建议先确定一个统一的视觉基调，生成首页后后续页面沿用此风格：

| 视觉维度 | 推荐方向 | 备选方向 |
|---------|---------|---------|
| 整体色调 | 深色系（深灰/近黑背景） | 浅色系（白/浅灰背景） |
| 强调色 | 琥珀金 `#F5A623` 或 薄荷绿 `#4ECDC4` | 品牌蓝 `#4A90D9` |
| 字体风格 | 现代无衬线（类似 Inter / Noto Sans SC） | 衬线优雅风 |
| 图片风格 | 高饱和度、电影感 | 文艺低饱和 |

---

## P0 必须页面（v1.0 MVP）

### 1. 首页（Home）

**Prompt：**

```
A personal portfolio homepage for a product manager candidate.
Dark theme with near-black background (#0D0D0D) and warm gold accent (#F5A623).

Header: Minimal top navigation bar - logo/name on left, nav links (About, Projects, Blog, Photography, Contact) on right with subtle hover underline effect.

Hero Section:
- Large bold heading: "Product Manager & Creative Technologist"
- Subtitle: "Building products with purpose. Capturing moments with passion."
- Two CTA buttons side by side: primary "View Projects" (gold fill) and secondary "Contact Me" (outlined)
- Subtle animated gradient background or soft glow effect behind text

Skills Section:
- Small section title "What I Do"
- Horizontal row of 4-5 skill tags: "Product Strategy", "UX Research", "Photography", "Videography", "AI Tools"
- Tags with rounded pill style, semi-transparent background

Featured Projects:
- Section title "Selected Work"
- 2-3 project cards in a row, each showing: cover image (placeholder), project title, one-line description, category tag
- Hover effect: slight scale up + shadow

Photography Preview:
- Section title "Through My Lens"
- 4x2 grid of photo thumbnails (masonry-style preferred), small and elegant
- "View Gallery" text link on right side

Latest Posts:
- Section title "Latest Writing"
- 3 article cards: each with title, short excerpt (2 lines), date, reading time badge
- Clean card design with left border accent

Footer CTA:
- Dark section with centered "Let's Connect" heading
- Email icon + address, GitHub icon + handle, Download Resume button (gold)
- Copyright text at bottom

Mobile responsive: Stack all sections vertically on mobile, hamburger menu for navigation.
```

---

### 2. 关于我（About）

**Prompt：**

```
An elegant about page for a product manager's personal portfolio.
Dark theme, matching the homepage style.

Page Header:
- Full-width header with page title "About Me" in large typography
- Subtle decorative line or geometric element

Profile Section:
- Large circular avatar placeholder on the left
- Name, current title, and location on the right
- Short professional bio paragraph (3-4 lines of realistic placeholder text)

Education Section:
- Section title "Education"
- Timeline or card layout showing university name, degree, major, year
- Clean icon decoration

Skills Section:
- Section title "Skills"
- Two-column layout: left column "Product Skills" (bullet list with icons), right column "Creative Skills" (bullet list with icons)
- Product: Product Strategy, User Research, Prototyping, Data Analysis, Agile
- Creative: Photography, Video Editing, Lightroom, Premiere Pro, Drone

Interests Section:
- Section title "Beyond Work"
- 3-4 interest tags with small icons: Photography, Travel, Hiking, Coffee
- Minimalist card or tag style

Call to Action:
- Bottom section with "Interested in working together?" and contact link
- Matches footer style from homepage
```

---

### 3. 项目列表（Projects List）

**Prompt：**

```
A projects showcase page for a product manager portfolio.
Dark theme with consistent homepage styling.

Page Header:
- "Projects" title with small subtitle: "Selected case studies and product work"

Projects Grid:
- 2-column grid layout on desktop, single column on mobile
- 4 project cards in total
- Each card design:
  - Full-width cover image (16:9 ratio, placeholder image)
  - Project title in bold
  - One-line description
  - Category tag (pill style): "Product Strategy" / "App Design" / "AI Tool" etc.
  - Hover: card lifts slightly with shadow, image zooms subtly
  - Bottom right: arrow icon indicating "View Case Study"

Filter (visual only, for reference):
- Small row of filter buttons above grid: All / Product / AI / App (styled but non-functional in static image)

Footer matches homepage style.
```

---

### 4. 项目详情（Project Detail）

**Prompt：**

```
A detailed project case study page for a product manager portfolio.
Dark theme, content-heavy but well-structured layout.

Hero Section:
- Full-width project cover image (placeholder)
- Project title overlay at bottom left with gradient scrim
- Project metadata badges: Role, Timeline, Team size below title

Content Structure (sidebar + main content layout on desktop):

Sidebar (sticky on scroll):
- Table of contents with section links: Background, Problem, Research, Solution, Results
- Smooth scroll behavior indicator

Main Content:
1. Background section: heading + 2 paragraphs of context text
2. Problem Statement: highlighted quote box with left border accent
3. User Research: text with bullet points, optional small chart placeholder
4. Solution: 2-3 prototype screenshot placeholders in a row
5. Results & Metrics: 3 stat callout boxes (e.g., "+40% engagement", "2 weeks faster")
6. Learnings: reflective text section

Navigation:
- "Next Project" link with arrow at bottom right
- "Back to All Projects" breadcrumb at top

Responsive: Single column on mobile, sidebar becomes top table of contents.
```

---

### 5. 博客列表（Blog List）

**Prompt：**

```
A blog listing page for a product manager portfolio.
Dark theme, clean reading-focused design.

Page Header:
- "Blog" title with subtitle: "Thoughts on products, tech, and craft"

Featured Post:
- One large featured article card at top (full width)
- Cover image on left, title + excerpt + date on right
- "Featured" badge on top left corner

Article Grid:
- 2-column grid of article cards below
- Each card:
  - Small cover image (optional, 3:2 ratio)
  - Article title (bold, 2 lines max)
  - Short excerpt (3 lines, lighter text color)
  - Meta row: date | reading time | category tag
  - Hover: title color shifts to accent gold

Category Filter (visual reference):
- Pill-style filter buttons: All / Product Analysis / Project Reflection / AI Tools / UX Design

Pagination (visual reference):
- Simple pagination at bottom: Previous | 1 2 3 | Next
- Disabled state for unavailable buttons

Empty state (optional):
- Illustration + "No articles yet" message if no content

Footer matches homepage style.
```

---

### 6. 博客详情（Blog Detail）

**Prompt：**

```
A blog article detail page for a product manager portfolio.
Dark theme optimized for reading, clean typography.

Article Header:
- Category tag above title
- Large article title (h1)
- Author name, publish date, reading time in a row
- Hero cover image below (full width, 16:9)

Article Body (centered column, max-width 700px):
- Clean body text typography (suitable for reading)
- H2 and H3 headings with subtle left border or accent
- Bullet and numbered lists
- Blockquote with gold left border and italic text
- Code block with dark background (#1A1A1A) and monospace font
- Inline images with captions below

Sidebar (on wider screens):
- Table of contents (auto-generated from headings)
- Sticky position on scroll
- Current section highlighted

Article Footer:
- Author bio card (avatar + name + short bio)
- "Share" section with icon buttons (Twitter/X, LinkedIn, Copy link)
- "Related Articles" section with 2-3 small cards

Navigation:
- Previous article / Next article links at very bottom
- Back to Blog link in top nav
```

---

### 7. 摄影-图片集（Photography Gallery）

**Prompt：**

```
A photography gallery page showcasing photo collections.
Dark theme with emphasis on letting images stand out.

Page Header:
- "Photography" title with subtitle "Through My Lens"
- Subtitle: "Capturing stories, one frame at a time"

Category Filter Bar:
- Horizontal row of filter pills: All / Landscape / Portrait / City / Travel / Documentary
- Active state: filled gold pill
- Inactive: outlined pill style

Gallery Grid:
- Masonry / waterfall layout (mixed aspect ratios preserved)
- 8-12 photo thumbnails in the grid
- Each photo:
  - Natural aspect ratio (not cropped)
  - Subtle border radius (4px)
  - Hover state: dark overlay (40% opacity) with photo title and location below
  - Click indicator: subtle zoom icon on hover corner

Lightbox Preview (generate one card in "opened" state):
- Full-screen dark overlay (95% opacity)
- Large centered image (maintains aspect ratio, max 90vw/90vh)
- Photo title and location text below image
- Close button (X) top right corner
- Left/Right arrow navigation buttons on sides
- Image counter "3 / 24" bottom right

Footer matches homepage style.
```

---

### 8. 摄影-视频集（Videos）

**Prompt：**

```
A video collection page for a photographer's portfolio.
Dark theme, cinematic feel.

Page Header:
- "Videos" title with subtitle "Motion & Stories"
- Subtitle: "From timelapses to documentary shorts"

Category Filter (same style as gallery page):
- All / Vlog / Timelapse / Documentary / Travel

Video Grid:
- 3-column grid on desktop, 1-2 column on tablet, 1 column on mobile
- Each video card:
  - Thumbnail image (16:9 ratio)
  - Play button overlay (centered, white circle with triangle)
  - Duration badge (bottom right corner of thumbnail, e.g., "3:42")
  - Video title below thumbnail
  - Short description (1-2 lines, muted text color)
  - Category tag (small pill)

Modal Video Player Preview (generate one in "opened" state):
- Dark overlay background
- Centered modal box (16:9 aspect ratio)
- Video player area (dark gray placeholder with play icon)
- Video title above player
- Close button (X) top right
- Video description below player

Footer matches homepage style.
```

---

### 9. 联系我（Contact）

**Prompt：**

```
A contact page for a product manager portfolio.
Dark theme, minimal and professional.

Page Header:
- "Get In Touch" title
- Brief friendly subtitle: "Open to opportunities and collaborations"

Contact Methods:
- 3 contact cards in a row (or stacked on mobile):
  1. Email: envelope icon + "Send me an email" label + actual email address
  2. GitHub: GitHub icon + "Check my repos" label + @username
  3. WeChat: QR code placeholder with "Let's connect on WeChat" label

Resume Download Section:
- Highlighted section with dark card background
- "Download My Resume" heading
- Brief description: "Last updated: April 2026"
- Large gold "Download PDF" button with download icon
- Button hover: slight glow effect

Optional Message Form (visual reference only):
- Simple form illustration or placeholder showing:
  - Name field
  - Email field
  - Message textarea
  - Submit button (gold)
  - Caption: "Coming soon" or "Form illustration"

Footer matches homepage style.
```

---

## P1 增强页面（v1.1 迭代）

### 10. 博客分类页（Blog Category）

**Prompt：**

```
A filtered blog category page showing articles by tag.
Dark theme, same as blog list page.

Page Header:
- Category name as title (e.g., "Product Analysis")
- Article count badge next to title
- Category description paragraph

Active Filter Indication:
- Current category pill highlighted
- Clear filter / "Show All" option visible

Content:
- Same card grid as blog list page
- "X articles found" count below header

Pagination at bottom.
```

---

### 11. 摄影分类页（Gallery Category）

**Prompt：**

```
A filtered photography gallery page by category.
Dark theme, same as main gallery.

Page Header:
- Category name (e.g., "Landscape") as title
- Photo count badge
- Brief category description

Active Filter:
- Current category pill highlighted in filter bar

Gallery:
- Masonry grid showing only photos in that category
- Same hover behavior as main gallery page
```

---

## P2 进阶页面（v2.0+）

### 12. 暗黑模式切换

> 建议：在生成上述页面时，同步生成一套**浅色版本**作为对照
>
> 浅色版 Prompt 调整：把 `dark theme` 改为 `light theme`，`#0D0D0D` 改为 `#FFFFFF`，文字改为深灰色

---

### 13. 搜索结果页

**Prompt：**

```
A search results page for a portfolio blog.
Dark theme, clean and functional.

Search Bar (prominent at top):
- Large search input field with search icon
- Placeholder: "Search articles, projects..."
- Current search query displayed if coming from search

Results Section:
- "X results for 'query term'" header
- Results as mixed list (articles + projects):
  - Each result: title, excerpt, type badge, date
  - Highlight matching text in results

No Results State:
- Illustration or icon
- "No results found for 'query'" message
- Suggestions: "Try different keywords" or "Browse all articles"
```

---

## Stitch 使用技巧

### 生成优化建议

| 场景 | 技巧 |
|------|------|
| 风格不一致 | 先生成首页，确定基调后，后续 Prompt 开头加 "Same dark theme style as the previous pages" |
| 布局跑偏 | 多次生成选最优，或用「Regenerate」按钮微调 |
| 中文显示乱码 | Stitch 对中文支持有限，建议用英文生成后，截图展示给面试官，或后续在 Figma 中替换 |
| 需要中文版 | 生成浅色/英文版后，在 Figma 中替换文字内容 |

### 输出物整理建议

```
生成的文件命名规范：
├── Stitch_Home_首页_v1.png
├── Stitch_About_关于我_v1.png
├── Stitch_Projects_项目列表_v1.png
├── Stitch_ProjectDetail_项目详情_案例1_v1.png
├── Stitch_Blog_博客列表_v1.png
├── Stitch_BlogPost_博客详情_v1.png
├── Stitch_Gallery_图片集_v1.png
├── Stitch_Videos_视频集_v1.png
└── Stitch_Contact_联系我_v1.png
```

### 后续加工

1. **导入 Figma** → 截图导入，做交互连线 + 标注尺寸 + 替换占位图
2. **制作原型演示视频** → 用 Loom 或 Figma 原型模式录制页面跳转流程
3. **面试展示素材** → 整理成 PDF 或 Notion 页面，作为项目经历附件

---

*Prompt 清单版本：v1.0，基于 PRD_个人博客网站.md 生成，2026-04-22*
