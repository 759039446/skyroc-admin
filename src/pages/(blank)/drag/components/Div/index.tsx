import { Form, Input, InputNumber } from 'antd';
import type { ComponentConfig } from '../types';

export const DivComponent: ComponentConfig = {
  id: 'div',
  type: 'Div',
  label: '空白容器',
  icon: '⬜',
  category: '容器组件',
  order: 2,
  defaultSize: {
    widthRatio: 0.25,
    heightRows: 4,
  },
  defaultWidth: '100%',
  defaultHeight: '100%',
  defaultProps: {
    text: '',
    style: {
      backgroundColor: 'transparent',
      borderColor: '#d9d9d9',
      borderWidth: 1,
      borderRadius: 4,
    },
  },
  render: (props) => {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#bfbfbf',
          fontSize: '12px',
          backgroundColor: props.style?.backgroundColor || 'transparent',
          border: `${props.style?.borderWidth || 1}px dashed ${props.style?.borderColor || '#d9d9d9'}`,
          borderRadius: `${props.style?.borderRadius || 4}px`,
          ...props.style,
        }}
      >
        {props.text || ''}
      </div>
    );
  },
  renderPropertyPanel: (props, form) => {
    return (
      <>
        <Form.Item label="文本内容" name="text">
          <Input placeholder="输入文本内容" />
        </Form.Item>
        <Form.Item label="背景颜色" name={['style', 'backgroundColor']}>
          <Input type="color" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="边框颜色" name={['style', 'borderColor']}>
          <Input type="color" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="边框宽度" name={['style', 'borderWidth']}>
          <InputNumber min={0} max={10} addonAfter="px" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="圆角" name={['style', 'borderRadius']}>
          <InputNumber min={0} max={50} addonAfter="px" style={{ width: '100%' }} />
        </Form.Item>
      </>
    );
  },
};
