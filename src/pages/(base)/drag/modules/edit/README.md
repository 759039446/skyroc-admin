# 编辑器模块

本目录包含拖拽编辑器的核心编辑功能模块。

## 目录结构

```
edit/
├── component-library/    # 组件库模块
│   ├── index.tsx        # 组件库主文件
│   └── styles.css       # 组件库样式
├── canvas/              # 画布模块
│   ├── index.tsx        # 画布主文件
│   └── styles.css       # 画布样式
├── property-panel/      # 属性配置模块
│   ├── index.tsx        # 属性面板主文件
│   └── styles.css       # 属性面板样式
├── index.ts             # 模块入口文件
└── README.md            # 本文档
```

## 模块说明

### 1. 组件库 (component-library)

**功能：** 左侧组件库面板，展示可拖拽的组件列表。

**主要特性：**
- 组件分组显示
- 支持折叠/展开
- 拖拽组件到画布

**Props:**
- `collapsed`: boolean - 是否折叠
- `onToggleCollapse`: () => void - 切换折叠状态
- `onDragStart`: (e: React.DragEvent, componentType: string) => void - 拖拽开始回调

### 2. 画布 (canvas)

**功能：** 中间画布区域，展示和编辑组件布局。

**主要特性：**
- 网格布局（基于 react-grid-layout）
- 组件拖拽、缩放
- 选中和删除组件
- 撤回/恢复操作

**Props:**
- `components`: CanvasComponent[] - 画布上的组件列表
- `selectedComponent`: string | null - 当前选中的组件ID
- `gridConfig`: { cols, rowHeight, width } - 网格配置
- `historyIndex`: number - 历史记录索引
- `historyLength`: number - 历史记录总数
- `onDrop`: (e: React.DragEvent) => void - 放置组件回调
- `onDragOver`: (e: React.DragEvent) => void - 拖拽悬停回调
- `onLayoutChange`: (layout: any[]) => void - 布局变化回调
- `onLayoutChangeComplete`: (layout: any[]) => void - 布局变化完成回调
- `onSelectComponent`: (componentId: string) => void - 选中组件回调
- `onOpenPropertyDrawer`: (componentId: string) => void - 打开属性配置回调
- `onRemoveComponent`: (componentId: string) => void - 删除组件回调
- `onClearCanvas`: () => void - 清空画布回调
- `onUndo`: () => void - 撤回操作回调
- `onRedo`: () => void - 恢复操作回调
- `onPreview`: () => void - 预览回调

### 3. 属性配置面板 (property-panel)

**功能：** 右侧抽屉式属性配置面板。

**主要特性：**
- 动态渲染组件属性表单
- 实时更新组件属性
- 支持多种表单控件

**Props:**
- `visible`: boolean - 是否显示
- `component`: CanvasComponent | null - 当前编辑的组件
- `form`: FormInstance - Ant Design 表单实例
- `onClose`: () => void - 关闭回调
- `onValuesChange`: (componentId: string, values: Record<string, any>) => void - 属性变化回调

## 使用示例

```tsx
import { ComponentLibrary, Canvas, PropertyPanel } from './modules/edit';

function DragEditor() {
  // ... 状态管理代码

  return (
    <div className="drag-container">
      <ComponentLibrary
        collapsed={leftPanelCollapsed}
        onToggleCollapse={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
        onDragStart={handleDragStart}
      />

      <Canvas
        components={canvasComponents}
        selectedComponent={selectedComponent}
        gridConfig={GRID_CONFIG}
        // ... 其他 props
      />

      <PropertyPanel
        visible={drawerVisible}
        component={currentComponent}
        form={form}
        onClose={() => setDrawerVisible(false)}
        onValuesChange={updateComponentProps}
      />
    </div>
  );
}
```

## 样式说明

每个模块都有独立的样式文件，主要样式类名：

- **组件库：** `.drag-left-panel`, `.drag-component-list`, `.drag-component-item`
- **画布：** `.drag-canvas-wrapper`, `.drag-canvas`, `.drag-grid-item`
- **属性面板：** 使用 Ant Design Drawer 的内置样式

## 注意事项

1. 所有模块都依赖于 `components` 目录下的组件配置
2. 样式文件需要在各自的模块中导入
3. 主文件 `index.tsx` 负责状态管理和事件协调
4. 模块间通过 props 传递数据和事件处理函数
