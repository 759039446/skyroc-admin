# 设计模式说明

## 概述

所有组件现在都支持**设计模式**和**预览模式**两种状态，通过 `isDesignMode` 参数控制组件的交互行为。

## 模式说明

### 设计模式 (Design Mode)

**用途**: 在画布上进行拖拽、布局设计时使用

**特点**:
- ✅ 可以拖拽组件调整位置
- ✅ 可以调整组件大小
- ✅ 可以选中组件进行配置
- ❌ **组件内部的点击事件被禁用**
- ❌ **组件内部的交互功能被禁用**

**实现方式**:
```typescript
// 所有组件的 render 函数都接收 isDesignMode 参数
render: (props, isDesignMode = false) => {
  return (
    <div style={{ 
      pointerEvents: isDesignMode ? 'none' : 'auto',
      width: '100%',
      height: '100%'
    }}>
      {/* 组件内容 */}
    </div>
  );
}
```

**CSS 属性说明**:
- `pointerEvents: 'none'` - 禁用所有鼠标事件，包括点击、悬停等
- `pointerEvents: 'auto'` - 恢复正常的鼠标交互

### 预览模式 (Preview Mode)

**用途**: 查看最终效果，测试组件功能

**特点**:
- ❌ 不能拖拽或调整组件
- ✅ **组件内部的点击事件正常工作**
- ✅ **组件内部的交互功能正常工作**
- ✅ 可以测试按钮、输入框等交互组件

**触发方式**:
- 点击画布顶部的 **预览** 按钮
- `isDesignMode` 参数会自动设置为 `false`

## 使用场景

### 场景 1: 设计布局

当你需要调整页面布局时：
1. 在画布上拖拽组件
2. 调整组件大小和位置
3. 此时组件内部的按钮、链接等**不会响应点击**
4. 避免了误触组件功能干扰布局设计

### 场景 2: 测试交互

当你需要测试组件功能时：
1. 点击 **预览** 按钮进入预览模式
2. 测试按钮点击、表单输入等功能
3. 组件内部的所有交互都正常工作

### 场景 3: 编辑商城组件

以商城组件为例：
- **设计模式**: 可以拖拽导航栏、调整商品推荐的大小，但点击"搜索"按钮不会有任何反应
- **预览模式**: 可以测试搜索功能、购物车交互、商品点击等

## 技术实现

### 组件定义

```typescript
// 组件配置接口
export interface ComponentConfig {
  // ...其他属性
  render: (props: Record<string, any>, isDesignMode?: boolean) => React.ReactNode;
}
```

### 画布渲染

```typescript
// 在画布中渲染组件时，传递 isDesignMode=true
<div className="drag-item-content">
  {getComponentConfig(component.type)?.render(component.props, true)}
</div>
```

### 预览渲染

```typescript
// 在预览模式中渲染组件时，传递 isDesignMode=false 或不传
<div className="preview-content">
  {getComponentConfig(component.type)?.render(component.props, false)}
</div>
```

## 支持的组件

### 基础组件
- ✅ Button (按钮)
- ✅ Input (输入框)
- ✅ Card (卡片)
- ✅ Tag (标签)
- ✅ Text (文本)
- ✅ Title (标题)
- ✅ Div (空白容器)
- ✅ Image (图片)

### 商城组件
- ✅ TopNavBar (顶部导航栏)
- ✅ SearchBar (搜索栏)
- ✅ ShoppingCart (购物车)
- ✅ MallLogo (商城Logo)
- ✅ MainNavMenu (主导航菜单)
- ✅ CarouselAd (轮播广告)
- ✅ EnterpriseRights (企业权益)
- ✅ PromotionInfo (促销信息)
- ✅ ProductRecommend (商品推荐)
- ✅ FooterInfo (底部信息)
- ✅ CertificationPartner (认证与合作)

## 开发指南

### 为新组件添加设计模式支持

如果你要创建新的组件，请按照以下模式编写 render 函数：

```typescript
export const YourComponent: ComponentConfig = {
  // ...其他配置
  render: (props, isDesignMode = false) => {
    return (
      <div style={{
        // 基础样式
        width: '100%',
        height: '100%',
        // 关键：根据模式控制交互
        pointerEvents: isDesignMode ? 'none' : 'auto',
      }}>
        {/* 组件内容 */}
      </div>
    );
  },
};
```

### 特殊处理

某些组件可能需要特殊处理：

#### Image 组件
```typescript
// 设计模式下禁用图片预览功能
preview={isDesignMode ? false : (props.preview !== false)}
```

#### 嵌套组件
如果组件内部有多层嵌套，只需在最外层设置 `pointerEvents` 即可，它会自动应用到所有子元素。

## 注意事项

1. **默认值**: `isDesignMode` 参数的默认值为 `false`，确保向后兼容
2. **一致性**: 所有组件都应该遵循相同的模式，保持一致的用户体验
3. **性能**: `pointerEvents` 是 CSS 属性，性能开销极小
4. **可访问性**: 设计模式只影响交互，不影响屏幕阅读器等辅助功能

## 常见问题 (FAQ)

### Q: 为什么在画布上点击按钮没有反应？
**A**: 这是预期行为。在设计模式下，组件的点击事件被禁用，以避免干扰布局设计。如果需要测试按钮功能，请点击"预览"按钮。

### Q: 如何在预览模式下编辑组件？
**A**: 预览模式主要用于查看和测试，如需编辑，请退出预览模式回到设计模式。

### Q: 可以在设计模式下调整某个组件的交互吗？
**A**: 不可以。设计模式下所有组件的内部交互都被禁用，这是为了提供一致的设计体验。

### Q: 新创建的组件需要做什么特殊配置吗？
**A**: 只需要在 render 函数中添加 `isDesignMode` 参数，并在最外层元素设置 `pointerEvents` 样式即可。

## 更新日志

### v1.0.0 (2024-11-29)
- ✅ 为所有基础组件添加设计模式支持
- ✅ 为所有商城组件添加设计模式支持
- ✅ 更新 ComponentConfig 接口类型定义
- ✅ 在画布渲染时默认启用设计模式
- ✅ 创建设计模式说明文档

## 相关文档

- [组件类型定义](./types.ts) - 组件接口定义
- [画布组件](../modules/edit/canvas/index.tsx) - 画布渲染逻辑
- [商城组件使用指南](./MALL_COMPONENTS.md) - 商城组件详细说明
