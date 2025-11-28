# 组件开发文档

本目录包含所有可在低代码设计器中使用的组件配置。每个组件都是独立的，通过统一的配置接口进行管理。

## 📁 文件结构

```
components/
├── types.ts              # 类型定义
├── index.ts              # 组件注册表
├── README.md            # 本文件
├── Button/               # 按钮组件
│   └── index.tsx
├── Input/                # 输入框组件
│   └── index.tsx
├── Card/                 # 卡片组件
│   └── index.tsx
├── Tag/                  # 标签组件
│   └── index.tsx
├── Text/                 # 文本组件
│   └── index.tsx
├── Title/                # 标题组件
│   └── index.tsx
├── Div/                  # 空白容器组件
│   └── index.tsx
└── Image/                # 图片组件
    └── index.tsx
```

## 🎯 设计理念

### 配置驱动
每个组件都通过一个配置对象定义，包含：
- 元数据（id, type, label, icon）
- 默认尺寸（widthRatio, heightRows）
- 默认属性（defaultProps）
- 渲染函数（render）
- 属性面板（renderPropertyPanel）

### 独立封装
- 每个组件独立在一个文件夹中
- 组件之间互不依赖
- 通过统一接口进行管理

### 自动注册
- 组件在 `index.ts` 中统一注册
- 主应用自动加载所有注册的组件
- 无需手动维护组件列表

## 📝 ComponentConfig 接口

```typescript
interface ComponentConfig {
  // 组件唯一标识
  id: string;
  
  // 组件类型名称
  type: string;
  
  // 组件显示名称
  label: string;
  
  // 组件图标（emoji）
  icon: string;
  
  // 默认尺寸配置
  defaultSize: {
    widthRatio: number;  // 宽度占总列数的比例 (0-1)
    heightRows: number;  // 高度行数
  };
  
  // 默认属性
  defaultProps: Record<string, any>;
  
  // 组件在画布上的默认宽度样式（可选）
  defaultWidth?: string;  // 例如: '100%', '200px', 'auto'
  
  // 组件在画布上的默认高度样式（可选）
  defaultHeight?: string;  // 例如: '100%', '200px', 'auto'
  
  // 渲染组件函数
  render: (props: Record<string, any>) => React.ReactNode;
  
  // 渲染属性配置表单（可选）
  renderPropertyPanel?: (props: Record<string, any>, form: FormInstance) => React.ReactNode;
}
```

## 🚀 如何添加新组件

### 1. 创建组件文件夹

在 `components` 目录下创建新的组件文件夹，例如 `MyComponent/`

### 2. 创建组件配置文件

在文件夹中创建 `index.tsx`：

```typescript
// components/MyComponent/index.tsx
import { Form, Input } from 'antd';
import type { ComponentConfig } from '../types';

export const MyComponent: ComponentConfig = {
  // 组件唯一标识
  id: 'my-component',
  
  // 组件类型
  type: 'MyComponent',
  
  // 显示名称
  label: '我的组件',
  
  // 图标
  icon: '🎨',
  
  // 默认尺寸
  defaultSize: {
    widthRatio: 0.33,    // 占画布宽度的33%
    heightRows: 4,       // 高度4行
  },
  
  // 默认宽度和高度
  defaultWidth: '100%',  // 充满容器宽度
  defaultHeight: 'auto', // 高度自适应
  
  // 默认属性
  defaultProps: {
    text: '默认文本',
    style: {},
  },
  
  // 渲染组件
  render: (props) => {
    return (
      <div style={props.style}>
        {props.text}
      </div>
    );
  },
  
  // 渲染属性面板（可选）
  renderPropertyPanel: (props, form) => {
    return (
      <>
        <Form.Item label="文本内容" name="text">
          <Input placeholder="输入文本" />
        </Form.Item>
      </>
    );
  },
};
```

### 3. 注册组件

在 `components/index.ts` 中导入并注册：

```typescript
import { MyComponent } from './MyComponent';

export const COMPONENT_REGISTRY: ComponentConfig[] = [
  ButtonComponent,
  InputComponent,
  // ... 其他组件
  MyComponent,  // 添加新组件
];
```

### 4. 完成！

新组件会自动出现在左侧组件库中，可以直接拖拽使用。

## 📚 最佳实践

### 1. 命名规范
- **文件夹**: PascalCase，例如 `Button/`
- **导出变量**: PascalCase + Component，例如 `ButtonComponent`
- **id**: kebab-case，例如 `my-component`
- **type**: PascalCase，例如 `MyComponent`

### 2. 默认属性
- 提供合理的默认值
- 确保组件在没有配置时也能正常显示
- 所有可配置属性都应在 `defaultProps` 中定义

### 3. 尺寸配置
- `widthRatio`: 0-1之间的小数，表示占画布宽度的比例
- `heightRows`: 整数，表示占用的行数
- `defaultWidth`: 组件内容的CSS宽度（'100%', 'auto', '200px'）
- `defaultHeight`: 组件内容的CSS高度（'100%', 'auto', '200px'）

**尺寸选择建议：**
- 充满型组件（Button, Input, Card, Div）：`defaultWidth: '100%'`, `defaultHeight: '100%'`
- 自适应型组件（Text, Title, Tag）：`defaultWidth: 'auto'`, `defaultHeight: 'auto'`
- 图片组件：`defaultWidth: '100%'`, `defaultHeight: 'auto'`

### 4. 样式处理
- 通过 `props.style` 接收自定义样式
- 在 render 函数中合并样式
- 支持嵌套样式属性（使用 `name={['style', 'fontSize']}`）

### 5. 属性面板设计
- 只暴露用户真正需要的属性
- 使用合适的表单控件（Input, Select, InputNumber, ColorPicker等）
- 提供清晰的标签和占位符
- 使用 Divider 分组相关属性

### 6. 渲染函数
- 保持组件独立性，不依赖外部状态
- 通过 props 接收所有数据
- 提供合理的默认值（例如 `props.text || '默认文本'`）
- 正确应用 style 属性

## 🎨 组件示例

### 简单组件（只渲染）

```typescript
export const SimpleComponent: ComponentConfig = {
  id: 'simple',
  type: 'Simple',
  label: '简单组件',
  icon: '⭐',
  defaultSize: { widthRatio: 0.25, heightRows: 2 },
  defaultProps: { text: 'Hello' },
  render: (props) => <div>{props.text}</div>,
};
```

### 带属性配置的组件

```typescript
export const ConfigurableComponent: ComponentConfig = {
  id: 'configurable',
  type: 'Configurable',
  label: '可配置组件',
  icon: '⚙️',
  defaultSize: { widthRatio: 0.5, heightRows: 4 },
  defaultWidth: '100%',
  defaultHeight: '100%',
  defaultProps: {
    text: 'Content',
    color: '#1890ff',
    size: 'medium',
  },
  render: (props) => (
    <div style={{ color: props.color, fontSize: props.size }}>
      {props.text}
    </div>
  ),
  renderPropertyPanel: (props, form) => (
    <>
      <Form.Item label="文本" name="text">
        <Input />
      </Form.Item>
      <Form.Item label="颜色" name="color">
        <Input type="color" />
      </Form.Item>
      <Form.Item label="大小" name="size">
        <Select>
          <Select.Option value="small">小</Select.Option>
          <Select.Option value="medium">中</Select.Option>
          <Select.Option value="large">大</Select.Option>
        </Select>
      </Form.Item>
    </>
  ),
};
```

## 🔧 网格配置

当前网格配置（在主文件 `index.tsx` 中）：

```typescript
const GRID_CONFIG = {
  cols: 48,           // 网格列数
  rowHeight: 5,       // 每行高度（px）
  width: 1200,        // 画布宽度（px）
};
```

### 尺寸计算示例

```typescript
// widthRatio = 0.25 的组件
实际宽度 = 48 * 0.25 = 12 列

// heightRows = 6 的组件
实际高度 = 6 * 5 = 30px
```

## 📖 内置组件说明

### Button（按钮）
- 可配置文本、类型、大小、危险状态
- 充满容器宽高

### Input（输入框）
- 可配置占位符、大小
- 充满容器宽高

### Card（卡片）
- 可配置标题、内容
- 充满容器宽高

### Tag（标签）
- 可配置文本、颜色
- 自适应宽高

### Text（文本）
- 可配置内容、字体大小、粗细、颜色、对齐
- 自适应宽高

### Title（标题）
- 可配置内容、级别、字体大小、粗细、颜色、对齐
- 自适应宽高

### Div（容器）
- 可配置背景色、边框色、边框宽度、圆角
- 充满容器宽高

### Image（图片）
- 可配置URL、填充方式、圆角、预览
- 宽度充满，高度自适应

## 🤝 贡献指南

1. 遵循现有代码风格
2. 确保类型定义完整
3. 提供合理的默认值
4. 编写清晰的属性面板
5. 测试组件在画布上的表现
6. 更新此文档（如有必要）

## 📞 获取帮助

如有问题，请：
- 查看现有组件的实现作为参考
- 阅读主 README 文档
- 提交 Issue

---

**Happy Coding! 🎉**
