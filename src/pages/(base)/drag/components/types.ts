import type { FormInstance } from 'antd';

// 组件配置接口
export interface ComponentConfig {
  // 组件唯一标识
  id: string;
  // 组件类型名称
  type: string;
  // 组件显示名称
  label: string;
  // 组件图标（emoji）
  icon: string;
  // 所属分组
  category: string;
  // 排序（同分组内的排序，数字越小越靠前）
  order: number;
  // 预览图片（可选，如果没有图片则使用 icon）
  previewImage?: string;
  // 默认尺寸配置
  defaultSize: {
    widthRatio: number;  // 宽度占总列数的比例 (0-1)
    heightRows: number;  // 高度行数
  };
  // 默认属性
  defaultProps: Record<string, any>;
  // 组件在画布上的默认宽度样式（可选，例如 '100%', '200px', 'auto'）
  defaultWidth?: string;
  // 组件在画布上的默认高度样式（可选，例如 '100%', '200px', 'auto'）
  defaultHeight?: string;
  // 渲染组件
  render: (props: Record<string, any>) => React.ReactNode;
  // 渲染属性配置表单（可选）
  renderPropertyPanel?: (props: Record<string, any>, form: FormInstance) => React.ReactNode;
}

// 画布上的组件实例
export interface CanvasComponent {
  i: string;       // 组件实例ID
  x: number;       // X坐标（列）
  y: number;       // Y坐标（行）
  w: number;       // 宽度（列数）
  h: number;       // 高度（行数）
  type: string;    // 组件类型
  props: Record<string, any>;  // 组件属性
}
