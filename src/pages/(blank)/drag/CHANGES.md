# 拖拽编辑器 UI 改造说明

## 修改概述

本次修改重构了组件库和属性配置的展示逻辑，提升了用户体验，并新增了完整的商城组件库。

## 主要变更

### 最新更新：商城组件库 (2024-11-29)
- **新增分类**：商城组件（🛒 ShoppingOutlined）
- **新增组件**：11个完整的电商页面组件
  1. **顶部导航栏**：网站主导航、登录注册、快捷入口
  2. **搜索栏**：商品搜索功能，支持自定义样式
  3. **购物车**：购物车数量显示、批量采购入口
  4. **商城Logo**：品牌标识、标语展示
  5. **主导航菜单**：商品分类导航，支持多列布局
  6. **轮播广告**：促销活动展示，支持多个广告轮播
  7. **企业权益**：企业专属功能和服务展示
  8. **促销信息**：新客优惠、活动推广
  9. **商品推荐**：商品列表展示，支持评分、价格等信息
  10. **底部信息**：公司信息、服务指南、联系方式
  11. **认证与合作**：资质认证、合作伙伴、旗下网站展示

## 历史变更

### 0. 主题色统一
- **依赖主题系统**：整个编辑器使用项目的 Ant Design 主题色系统
- **CSS 变量**：所有自定义样式使用 `var(--ant-color-primary)` 等 CSS 变量引用主题色
- **降级方案**：CSS 变量提供备用值确保兼容性，如 `var(--ant-color-primary, #1890ff)`
- **色彩规范**：建立完整的主题色系文档（详见 `THEME_COLORS.md`）
- **修正不一致**：将拖拽占位符从紫色渐变改为主题蓝色
- **统一交互**：所有激活、选中、悬停状态使用一致的蓝色系
- **设计原则**：优先使用 Ant Design 组件，自定义样式与主题保持一致

### 1. 组件库改造
- **移除**：收起/展开组件库的按钮
- **新增**：固定定位的侧边面板，从画布左侧横向滑出（非模态窗口，无遮罩层）
- **触发方式**：点击画布上方的组件库按钮（📦图标）才展示组件库
- **拖拽支持**：组件库打开时不会阻挡画布操作，可以正常拖拽组件到画布
- **左右分栏设计**：
  - 左侧：竖向排列的分类图标导航栏（56px宽，紧凑设计）
  - 右侧：选中分类的组件列表
- **分类导航**：
  - 基础组件：📦 AppstoreOutlined
  - 容器组件：🗂️ LayoutOutlined
  - 展示组件：🖼️ PictureOutlined
  - 其他组件：📄 FileTextOutlined
- **点击切换**：点击左侧分类图标，右侧即刻显示该分类下的所有组件

### 2. 浮动工具栏
- **新增功能**：画布右下角固定工具栏，提供快捷操作
- **固定位置**：工具栏固定在右下角（距离右侧和底部各 20px）
- **功能按钮**：
  - 导入：导入 DSL JSON 文件到画布
  - 导出：导出当前画布组件为 JSON 文件
  - 编辑：打开 JSON 编辑器弹窗
- **JSON 编辑器**：
  - 实时编辑画布组件的 JSON 数据
  - 支持格式化功能
  - 编辑后直接应用到画布
  - 实时语法错误提示

### 3. 画布工具栏改造
在画布卡片的标题区域新增两个图标按钮：

#### 组件库按钮 (📦)
- **位置**：画布卡片左上角
- **功能**：点击打开/关闭组件库侧边面板
- **状态显示**：
  - 激活状态（组件库打开）：蓝色高亮（primary类型）
  - 未激活状态（组件库关闭）：默认灰色

#### 属性配置按钮 (⚙️)
- **位置**：组件库按钮右侧
- **功能**：点击打开/关闭属性配置面板
- **状态显示**：
  - 激活状态（属性面板打开且有选中组件）：蓝色高亮（primary类型）
  - 未激活状态：默认灰色
  - 禁用状态（无选中组件）：灰色且不可点击
- **触发方式**：
  - 点击按钮打开
  - 双击画布上的组件打开（保持原有逻辑）

### 3. 布局优化
- **移除**：左侧固定宽度的组件库面板
- **新增**：画布占满整个容器区域，组件库以固定定位从左侧滑出
- **画布自适应**：组件库打开时，画布区域自动向右缩小 320px，避免内容被遮挡
- **平滑过渡**：画布位置变化使用 0.3s 过渡动画，与组件库滑出动画同步
- **更新**：空画布提示文本从"从左侧拖拽组件到此处开始设计"改为"点击组件库按钮选择组件，拖拽到此处开始设计"

## 文件修改清单

### 组件文件
1. **src/pages/(blank)/drag/index.tsx**
   - 移除 `leftPanelCollapsed` 状态
   - 新增 `libraryVisible` 状态
   - 新增 `jsonEditorVisible` 状态
   - 新增导入 JSON 功能 `handleImportJson`
   - 新增导出 JSON 功能 `handleExportJson`
   - 新增应用 JSON 功能 `handleApplyJson`
   - 集成 FloatingToolbar 和 JsonEditor 组件
   - 更新 ComponentLibrary 和 Canvas 组件的 props

2. **src/pages/(blank)/drag/modules/edit/component-library/index.tsx**
   - 将组件库从 Drawer 抽屉改为固定定位的侧边面板
   - 使用 CSS transform 实现横向滑出动画
   - 更新组件接口（visible、onClose）
   - 移除模态遮罩层，确保不阻挡拖拽操作
   - 实现左右分栏布局：左侧分类导航 + 右侧组件列表
   - 添加分类图标映射（categoryIcons）
   - 使用 useState 管理当前选中的分类
   - 根据选中分类动态显示对应组件

3. **src/pages/(blank)/drag/modules/edit/canvas/index.tsx**
   - 在工具栏添加组件库和属性配置按钮
   - 更新组件接口，新增相关状态和回调函数
   - 更新空画布提示文本
   - 根据 libraryVisible 状态动态添加 library-open class

### 样式文件
4. **src/pages/(blank)/drag/styles.css**
   - 简化主容器样式，移除 gap 和横向滚动
   - 移除左侧面板的响应式样式
   - 添加 position: relative 确保组件库正确定位
   - 使用 CSS 变量替换所有硬编码的主题色：
     - 拖拽占位符背景：`var(--ant-color-primary)`
     - 组件悬停/选中边框：`var(--ant-color-primary)`
     - 组件标签文字：`var(--ant-color-primary)`
     - 调整大小手柄：`var(--ant-color-primary)`
     - 阴影效果：`var(--ant-color-primary-bg-hover)` / `var(--ant-color-primary-bg)`

5. **src/pages/(blank)/drag/modules/edit/component-library/styles.css**
   - 移除 Drawer 和 Collapse 折叠面板样式
   - 新增固定定位侧边面板样式
   - 添加 transform 横向滑出动画
   - 新增左右分栏容器样式（drag-library-container）
   - 新增左侧分类导航样式（56px宽，紧凑设计，浅灰背景）
   - 新增分类导航项样式（竖向排列，图标16px+文字10px）
   - 分类名称：width: 2em 实现每行两个字自动换行
   - 使用 CSS 变量实现主题色：
     - 分类激活背景：`var(--ant-color-primary)`
     - 分类悬停背景：`var(--ant-color-primary-bg-hover)`
     - 分类悬停图标：`var(--ant-color-primary)`
     - 组件项悬停边框：`var(--ant-color-primary)`
   - 减小内边距和间距，整体更紧凑
   - 右侧组件内容区域：自适应宽度，网格布局

6. **src/pages/(blank)/drag/modules/edit/canvas/styles.css**
   - 添加画布左边距过渡动画
   - 组件库打开时画布自动左移 320px
   - 使用与组件库相同的过渡时长和贝塞尔曲线
   - 使用 CSS 变量：
     - 空画布悬停边框：`var(--ant-color-primary)`
     - 空画布悬停背景：`var(--ant-color-primary-bg)`

### 新增组件
7. **src/pages/(blank)/drag/modules/edit/toolbar/index.tsx**
   - 浮动工具栏组件
   - 固定在画布右下角
   - 导入、导出、编辑三个功能按钮
   - 简洁的文件选择和导入导出逻辑

8. **src/pages/(blank)/drag/modules/edit/toolbar/styles.css**
   - 浮动工具栏样式
   - 使用 fixed 定位固定在右下角
   - 按钮悬停效果
   - 使用 CSS 变量实现主题色

9. **src/pages/(blank)/drag/modules/edit/json-editor/index.tsx**
   - JSON 编辑器弹窗组件
   - 实时 JSON 编辑
   - 格式化功能
   - 错误提示
   - 应用功能

10. **src/pages/(blank)/drag/modules/edit/json-editor/styles.css**
    - JSON 编辑器样式
    - 文本域样式（代码风格）
    - 错误提示样式
    - 自定义滚动条

### 新增商城组件
11. **src/pages/(blank)/drag/components/TopNavBar/index.tsx**
    - 顶部导航栏组件，包含网站主导航和快捷入口

12. **src/pages/(blank)/drag/components/SearchBar/index.tsx**
    - 搜索栏组件，支持自定义样式和占位符

13. **src/pages/(blank)/drag/components/ShoppingCart/index.tsx**
    - 购物车组件，显示数量和批量采购入口

14. **src/pages/(blank)/drag/components/MallLogo/index.tsx**
    - 商城Logo组件，展示品牌标识和标语

15. **src/pages/(blank)/drag/components/MainNavMenu/index.tsx**
    - 主导航菜单组件，商品分类导航

16. **src/pages/(blank)/drag/components/CarouselAd/index.tsx**
    - 轮播广告组件，支持多广告轮播展示

17. **src/pages/(blank)/drag/components/EnterpriseRights/index.tsx**
    - 企业权益组件，展示企业专属功能

18. **src/pages/(blank)/drag/components/PromotionInfo/index.tsx**
    - 促销信息组件，展示优惠活动

19. **src/pages/(blank)/drag/components/ProductRecommend/index.tsx**
    - 商品推荐组件，网格布局展示商品

20. **src/pages/(blank)/drag/components/FooterInfo/index.tsx**
    - 底部信息组件，公司信息和服务指南

21. **src/pages/(blank)/drag/components/CertificationPartner/index.tsx**
    - 认证与合作组件，展示资质和合作伙伴

### 新增文档
22. **src/pages/(blank)/drag/THEME_COLORS.md**
    - 主题色规范文档
    - CSS 变量使用指南和示例
    - 定义完整的色彩体系
    - 说明各组件状态的颜色使用
    - 提供设计原则和注意事项
    - 强调使用 CSS 变量实现主题色统一

## 功能特性

### 主题色 CSS 变量
- **自动适配**：使用 `var(--ant-color-primary)` 等 CSS 变量，自动跟随项目主题色
- **降级支持**：提供备用值如 `var(--ant-color-primary, #1890ff)`，确保兼容性
- **全局统一**：修改项目 Ant Design 主题配置，所有自定义样式自动更新
- **易于维护**：无需手动修改每个样式文件中的硬编码颜色值
- **常用变量**：
  - `--ant-color-primary`：主色
  - `--ant-color-primary-bg-hover`：主色浅色背景（悬停）
  - `--ant-color-primary-bg`：主色极浅背景

### 浮动工具栏特性
- **固定位置**：工具栏固定在画布右下角（right: 20px, bottom: 20px）
- **始终可见**：位置固定，不随页面滚动，始终可访问
- **简洁设计**：竖向排列三个功能按钮，占用空间小
- **JSON 导入导出**：
  - 导入：支持选择 JSON 文件导入画布组件
  - 导出：一键导出当前画布所有组件为 JSON 文件
  - 文件命名：导出文件自动带时间戳（canvas-timestamp.json）
- **JSON 编辑器**：
  - 实时编辑：直接编辑画布组件的 JSON 数据
  - 格式化：一键格式化 JSON 便于阅读
  - 语法检查：实时检测 JSON 语法错误并提示
  - 即时应用：编辑后直接应用到画布，无需刷新

### 侧边面板特性
- **固定定位**：使用 `position: fixed` 实现固定在视口左侧
- **滑出动画**：使用 `transform: translateX()` 实现平滑的横向滑出效果
- **无遮罩层**：不使用模态遮罩，保证画布操作不受阻挡
- **支持拖拽**：组件库打开时，可以正常拖拽组件到画布

### 分类导航特性
- **左右分栏**：左侧 56px 紧凑分类导航，右侧自适应组件列表
- **图标导航**：每个分类配置专属图标（AppstoreOutlined、LayoutOutlined 等）
- **竖向排列**：分类图标（16px）和名称竖向排列，清晰易识别
- **文字换行**：分类名称每行显示两个字，自动换行（如"基础\n组件"）
- **紧凑设计**：减小内边距和图标尺寸，节省空间
- **即点即显**：点击左侧分类，右侧立即显示该分类的所有组件
- **视觉反馈**：
  - 激活状态：蓝色背景 + 白色图标和文字
  - 悬停状态：浅蓝背景 + 蓝色图标
  - 默认状态：浅灰背景 + 深灰图标

### 画布自适应特性
- **动态调整**：组件库打开时，画布区域自动添加 320px 左边距
- **同步动画**：画布位移动画与组件库滑出动画同步（0.3s，cubic-bezier(0.4, 0, 0.2, 1)）
- **内容保护**：确保画布内容不被组件库遮挡，始终完整可见
- **流畅体验**：过渡动画使布局变化更加自然流畅

### 按钮状态管理
- 组件库按钮和属性配置按钮都有明确的激活/未激活状态
- 通过按钮类型（type="primary" / type="default"）实现高亮效果
- 属性配置按钮在无选中组件时自动禁用

### 交互保持
- 属性配置的双击打开逻辑保持不变
- 拖拽组件到画布的交互保持不变
- 快捷键（Ctrl+Z / Ctrl+Y）保持不变
- 预览、撤回、恢复等功能保持不变

## 用户体验提升

1. **更大的画布空间**：移除固定的左侧面板，画布区域扩大
2. **按需显示**：组件库和属性配置都改为按需显示，不占用画布空间
3. **直观的分类导航**：左侧竖向图标导航，一目了然，快速定位所需组件分类
4. **即点即显**：点击分类图标，右侧立即显示该分类组件，无需展开折叠
5. **视觉层次清晰**：左侧导航与右侧内容分离，信息架构更清晰
6. **图标语义化**：每个分类都有专属图标，提升识别速度
7. **智能避让**：组件库打开时画布自动缩小，避免内容被遮挡
8. **流畅动画**：所有布局变化都有平滑的过渡动画，体验更加自然
9. **清晰的状态指示**：按钮高亮状态让用户清楚知道当前打开了哪些面板
10. **灵活的布局**：侧边面板设计让界面更加灵活和现代化
11. **无阻挡拖拽**：组件库打开时不会阻止用户操作画布，可以边看组件库边拖拽
12. **固定工具栏**：工具栏固定在右下角，始终可见，快速访问常用功能
13. **数据导入导出**：方便的 JSON 导入导出功能，快速保存和加载画布配置
14. **可视化编辑 JSON**：JSON 编辑器让高级用户可以直接编辑数据，提高效率
15. **实时反馈**：JSON 编辑器实时检测语法错误，避免无效操作