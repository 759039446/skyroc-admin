# 低代码组件设计器

一个基于 React + React-Grid-Layout + Ant Design 的可视化低代码组件设计器，支持拖拽、属性配置、撤回/恢复等功能。

## 📋 目录

- [功能特性](#功能特性)
- [设计思路](#设计思路)
- [项目结构](#项目结构)
- [核心概念](#核心概念)
- [使用指南](#使用指南)
- [组件开发](#组件开发)
- [技术栈](#技术栈)
- [最佳实践](#最佳实践)

## ✨ 功能特性

### 🎨 画布功能
- **拖拽添加组件** - 从左侧组件库拖拽组件到画布
- **自由布局** - 支持拖拽移动和调整组件大小
- **网格对齐** - 48列网格系统，精确布局
- **滚动画布** - 支持垂直滚动，底部预留400px空间
- **美化滚动条** - 自定义滚动条样式，提升视觉体验
- **组件选中** - 点击选中组件，显示蓝色边框
- **组件删除** - 悬停显示删除按钮
- **清空画布** - 一键清空所有组件

### ⚙️ 属性配置
- **实时配置** - 选中组件后在右侧面板配置属性
- **即时预览** - 属性修改后立即在画布中反映
- **多样化表单** - 支持输入框、选择器、数字输入、颜色选择等
- **样式定制** - 支持配置颜色、尺寸、对齐、边框等样式

### 🔄 历史管理
- **撤回操作** (Ctrl+Z) - 撤回到上一步
- **恢复操作** (Ctrl+Y / Ctrl+Shift+Z) - 恢复到下一步
- **历史记录** - 最多保存50条历史记录
- **多种触发方式** - 支持按钮点击和键盘快捷键
- **状态追踪** - 追踪组件添加、删除、移动、调整、属性修改

### 🧩 内置组件
1. **按钮 (Button)** - 可配置类型、大小、危险状态
2. **输入框 (Input)** - 可配置占位符、大小
3. **卡片 (Card)** - 可配置标题、内容
4. **标签 (Tag)** - 可配置文本、颜色
5. **文本 (Text)** - 可配置内容、字体、颜色、对齐
6. **标题 (Title)** - 可配置级别、样式
7. **容器 (Div)** - 可配置背景、边框、圆角
8. **图片 (Image)** - 可配置URL、填充方式、圆角、预览

## 🎯 设计思路

### 架构设计

#### 1. 模块化组件系统
```
组件配置 → 自动注册 → 统一渲染
```

**核心理念：**
- 每个组件独立封装在单独的文件夹中
- 组件配置与渲染逻辑分离
- 通过配置驱动的方式统一管理

**优势：**
- 易于扩展新组件
- 降低维护成本
- 代码复用性高
- 职责清晰分明

#### 2. 配置驱动渲染
```typescript
ComponentConfig {
  元数据 (id, type, label, icon)
  → 默认尺寸 (widthRatio, heightRows)
  → 默认属性 (defaultProps)
  → 渲染函数 (render)
  → 属性面板 (renderPropertyPanel)
}
```

**工作流程：**
1. 定义组件配置对象
2. 注册到组件注册表
3. 拖拽时根据配置创建实例
4. 渲染时动态调用render函数
5. 选中时动态渲染属性面板

#### 3. 状态管理策略

**画布状态：**
```typescript
canvasComponents: CanvasComponent[] // 画布上的组件实例
selectedComponent: string | null     // 当前选中的组件ID
```

**历史状态：**
```typescript
history: CanvasComponent[][]  // 历史记录栈
historyIndex: number          // 当前历史位置
```

**关键设计：**
- 使用深拷贝保存历史快照
- 分支历史自动截断
- 限制历史数量防止内存溢出

#### 4. 网格系统设计

**网格配置：**
```typescript
{
  cols: 48,           // 48列提供精细布局
  rowHeight: 5px,     // 小行高实现细粒度控制
  width: 1200px       // 固定宽度适配大多数屏幕
}
```

**组件尺寸计算：**
```typescript
实际宽度 = cols × widthRatio
实际高度 = heightRows × rowHeight
```

#### 5. 样式隔离策略

**组件样式：**
- 每个组件通过 `defaultWidth` 和 `defaultHeight` 控制内部尺寸
- 支持 `100%`、`auto`、`200px` 等CSS值
- 通过 `props.style` 传递自定义样式

**容器样式：**
- 网格单元控制外部布局
- 内容容器适配组件内容
- 使用 `box-border` 确保尺寸准确

### 交互设计

#### 1. 拖拽交互
```
组件库 → 拖拽开始 → 传递类型数据
       ↓
画布区 → 接收Drop → 创建组件实例 → 自动布局
```

#### 2. 选中交互
```
点击组件 → 设置选中状态 → 更新边框样式
         ↓
         加载属性面板 → 显示当前属性
```

#### 3. 编辑交互
```
修改属性 → 表单onChange → 更新组件props
        ↓
        触发重渲染 → 保存历史记录
```

#### 4. 历史交互
```
用户操作 → 保存快照 → 推入历史栈
         ↓
撤回/恢复 → 从历史栈读取 → 恢复画布状态
```

## 📁 项目结构

```
drag/
├── index.tsx                    # 主入口文件，状态管理和事件协调
├── styles.css                   # 通用样式文件（网格、组件项等）
├── README.md                    # 本文件
├── components/                  # 组件配置目录
│   ├── types.ts                # 类型定义
│   ├── index.ts                # 组件注册表
│   ├── README.md               # 组件开发文档
│   ├── Button/                 # 按钮组件
│   │   └── index.tsx
│   ├── Input/                  # 输入框组件
│   │   └── index.tsx
│   ├── Card/                   # 卡片组件
│   │   └── index.tsx
│   ├── Tag/                    # 标签组件
│   │   └── index.tsx
│   ├── Text/                   # 文本组件
│   │   └── index.tsx
│   ├── Title/                  # 标题组件
│   │   └── index.tsx
│   ├── Div/                    # 容器组件
│   │   └── index.tsx
│   └── Image/                  # 图片组件
│       └── index.tsx
└── modules/                     # 功能模块目录
    ├── preview/                # 预览模块
    │   ├── preview.tsx
    │   └── preview.css
    └── edit/                   # 编辑器模块（新增）
        ├── index.ts            # 模块导出入口
        ├── README.md           # 模块说明文档
        ├── component-library/  # 组件库模块
        │   ├── index.tsx       # 组件库主文件
        │   └── styles.css      # 组件库样式
        ├── canvas/             # 画布模块
        │   ├── index.tsx       # 画布主文件
        │   └── styles.css      # 画布样式
        └── property-panel/     # 属性配置模块
            ├── index.tsx       # 属性面板主文件
            └── styles.css      # 属性面板样式
```

### 模块化架构说明

**编辑器模块 (modules/edit)**：将原有的单体组件拆分为三个独立模块：

1. **组件库 (component-library)**：左侧组件面板，负责展示可拖拽的组件列表
2. **画布 (canvas)**：中间编辑区域，负责组件的布局和交互
3. **属性配置 (property-panel)**：右侧抽屉面板，负责组件属性的配置

**优势**：
- 职责分离，每个模块独立维护
- 代码复用性更高
- 易于测试和调试
- 样式隔离，避免冲突

## 🔑 核心概念

### ComponentConfig（组件配置）

每个组件的配置对象，定义组件的所有元数据和行为：

```typescript
interface ComponentConfig {
  id: string;                    // 唯一标识
  type: string;                  // 组件类型
  label: string;                 // 显示名称
  icon: string;                  // 图标（emoji）
  defaultSize: {                 // 默认尺寸
    widthRatio: number;          // 宽度比例（0-1）
    heightRows: number;          // 高度行数
  };
  defaultProps: Record<string, any>;        // 默认属性
  defaultWidth?: string;                     // 默认CSS宽度
  defaultHeight?: string;                    // 默认CSS高度
  render: (props) => ReactNode;             // 渲染函数
  renderPropertyPanel?: (props, form) => ReactNode;  // 属性面板
}
```

### CanvasComponent（画布组件实例）

画布上的组件实例，包含布局和属性信息：

```typescript
interface CanvasComponent {
  i: string;                     // 组件实例ID
  x: number;                     // X坐标（列）
  y: number;                     // Y坐标（行）
  w: number;                     // 宽度（列数）
  h: number;                     // 高度（行数）
  type: string;                  // 组件类型
  props: Record<string, any>;    // 组件属性
}
```

### COMPONENT_REGISTRY（组件注册表）

全局组件注册表，存储所有可用组件的配置：

```typescript
export const COMPONENT_REGISTRY: ComponentConfig[] = [
  ButtonComponent,
  InputComponent,
  // ... 更多组件
];
```

### 网格配置

控制画布网格系统的参数：

```typescript
const GRID_CONFIG = {
  cols: 48,           // 列数
  rowHeight: 5,       // 行高（px）
  width: 1200,        // 画布宽度（px）
};
```

## 📖 使用指南

### 基本操作

#### 1. 添加组件
1. 从左侧组件库中选择组件
2. 按住鼠标左键拖拽到画布区域
3. 释放鼠标，组件自动添加到画布

#### 2. 移动组件
1. 点击组件标题栏（带有组件名称的区域）
2. 拖拽到目标位置
3. 释放鼠标，组件移动完成

#### 3. 调整大小
1. 悬停到组件边缘
2. 出现调整手柄时拖拽
3. 调整到合适大小后释放

#### 4. 配置属性
1. 点击组件选中（显示蓝色边框）
2. 在右侧属性面板中修改属性
3. 修改后自动应用到画布

#### 5. 删除组件
1. 悬停到组件上
2. 点击右上角的 ✕ 按钮
3. 组件立即删除

#### 6. 撤回/恢复
- **撤回**: 点击撤回按钮 或 按 `Ctrl+Z`
- **恢复**: 点击恢复按钮 或 按 `Ctrl+Y`

#### 7. 清空画布
1. 点击画布标题栏的"清空画布"按钮
2. 所有组件被清除

### 键盘快捷键

| 快捷键 | 功能 | 说明 |
|--------|------|------|
| `Ctrl+Z` | 撤回 | 撤回上一步操作 |
| `Ctrl+Y` | 恢复 | 恢复下一步操作 |
| `Ctrl+Shift+Z` | 恢复 | 恢复下一步操作（备用） |
| `Cmd+Z` | 撤回 | macOS撤回 |
| `Cmd+Y` | 恢复 | macOS恢复 |
| `Cmd+Shift+Z` | 恢复 | macOS恢复（备用） |

### 组件属性说明

#### Button（按钮）
- **文本内容**: 按钮显示的文字
- **按钮类型**: default, primary, dashed, text, link
- **按钮大小**: small, middle, large
- **危险按钮**: 是否显示为危险样式

#### Input（输入框）
- **占位符**: 输入框的placeholder文本
- **输入框大小**: small, middle, large

#### Card（卡片）
- **卡片标题**: 卡片顶部标题
- **卡片内容**: 卡片主体内容

#### Tag（标签）
- **文本内容**: 标签显示的文字
- **标签颜色**: blue, green, red, orange, purple, cyan, gold

#### Text（文本）
- **文本内容**: 显示的文字
- **字体大小**: 12-72px
- **字体粗细**: normal, bold, lighter, 100-900
- **文本颜色**: 颜色选择器
- **文本对齐**: left, center, right

#### Title（标题）
- **文本内容**: 标题文字
- **标题级别**: H1-H5
- **字体大小**: 12-72px
- **字体粗细**: normal, bold, lighter, 100-900
- **文本颜色**: 颜色选择器
- **文本对齐**: left, center, right

#### Div（容器）
- **文本内容**: 容器内显示的文字
- **背景颜色**: 颜色选择器
- **边框颜色**: 颜色选择器
- **边框宽度**: 0-10px
- **圆角**: 0-50px

#### Image（图片）
- **图片地址**: 图片URL
- **替代文本**: 图片alt属性
- **图片填充方式**: contain, cover, fill, none, scale-down
- **宽度**: CSS宽度值
- **高度**: CSS高度值
- **圆角**: 0-50px
- **启用预览**: 是否支持点击放大

## 🛠️ 组件开发

详细的组件开发指南请查看 [components/README.md](./components/README.md)

### 快速开始

1. **创建组件文件夹**
```bash
mkdir components/YourComponent
```

2. **创建组件配置**
```typescript
// components/YourComponent/index.tsx
import type { ComponentConfig } from '../types';

export const YourComponent: ComponentConfig = {
  id: 'your-component',
  type: 'YourComponent',
  label: '你的组件',
  icon: '🎨',
  defaultSize: {
    widthRatio: 0.33,
    heightRows: 4,
  },
  defaultWidth: '100%',
  defaultHeight: 'auto',
  defaultProps: {
    text: '默认文本',
  },
  render: (props) => {
    return <div>{props.text}</div>;
  },
  renderPropertyPanel: (props, form) => {
    return (
      <Form.Item label="文本" name="text">
        <Input />
      </Form.Item>
    );
  },
};
```

3. **注册组件**
```typescript
// components/index.ts
import { YourComponent } from './YourComponent';

export const COMPONENT_REGISTRY: ComponentConfig[] = [
  // ... 其他组件
  YourComponent,
];
```

## 💻 技术栈

### 核心框架
- **React 18** - UI框架
- **TypeScript** - 类型系统
- **React-Grid-Layout** - 网格布局和拖拽

### UI组件库
- **Ant Design 5** - UI组件
- **Tailwind CSS** - 样式工具类

### 状态管理
- **React Hooks** - useState, useCallback, useEffect
- 本地状态管理（无需Redux）

### 构建工具
- **Vite** - 构建工具
- **ESLint** - 代码检查
- **TypeScript** - 类型检查

## 📚 最佳实践

### 组件开发

1. **保持组件独立性**
   - 每个组件应该是自包含的
   - 不依赖外部状态
   - 通过props接收所有数据

2. **合理设置默认值**
   - defaultProps中提供合理的默认值
   - 确保组件在没有配置时也能正常显示

3. **属性面板设计**
   - 只暴露用户真正需要的属性
   - 使用合适的表单控件
   - 提供清晰的标签和提示

4. **尺寸配置**
   - 使用widthRatio而不是固定宽度
   - 根据内容特性选择defaultWidth和defaultHeight
   - 充满型组件使用100%，自适应型使用auto

### 性能优化

1. **使用useCallback**
   - 事件处理函数使用useCallback包裹
   - 避免不必要的重渲染

2. **深拷贝优化**
   - 历史记录使用深拷贝避免引用问题
   - 限制历史记录数量

3. **渲染优化**
   - 只在必要时更新状态
   - 拖拽过程中使用节流
   - 拖拽结束才保存历史

### 用户体验

1. **视觉反馈**
   - 选中状态有明确的视觉提示
   - 悬停效果增强可操作性
   - 拖拽过程显示占位符

2. **操作便捷性**
   - 支持键盘快捷键
   - 提供多种操作方式
   - 清晰的按钮和提示文本

3. **错误处理**
   - 防止操作失败
   - 提供清晰的错误信息
   - 支持撤回恢复容错

## 🚀 未来规划

### 短期计划
- [ ] 组件分组和折叠
- [ ] 组件搜索和过滤
- [ ] 组件复制和粘贴
- [ ] 键盘Delete删除组件
- [ ] 多选和批量操作

### 中期计划
- [ ] 画布缩放功能
- [ ] 标尺和参考线
- [ ] 组件对齐辅助
- [ ] 组件层级管理
- [ ] 导出JSON配置

### 长期计划
- [ ] 自定义主题
- [ ] 组件预设模板
- [ ] 拖拽生成代码
- [ ] 协同编辑
- [ ] 版本管理

## 📝 更新日志

### v1.0.0 (2024-11-24)
- ✅ 实现基础画布功能
- ✅ 实现8个内置组件
- ✅ 实现拖拽添加组件
- ✅ 实现属性配置面板
- ✅ 实现撤回/恢复功能
- ✅ 实现组件模块化架构
- ✅ 实现自定义滚动条
- ✅ 优化用户交互体验

## 📄 许可证

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件至项目维护者

---

**Happy Coding! 🎉**
