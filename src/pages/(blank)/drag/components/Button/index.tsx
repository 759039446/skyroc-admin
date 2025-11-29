import { Button, Form, Input, Select } from 'antd';
import type { ComponentConfig } from '../types';

export const ButtonComponent: ComponentConfig = {
  id: 'button',
  type: 'Button',
  label: '按钮',
  icon: '🔘',
  category: '基础组件',
  order: 1,
  defaultSize: {
    widthRatio: 0.25,
    heightRows: 3,
  },
  defaultWidth: '100%',
  defaultHeight: '100%',
  defaultProps: {
    text: '按钮',
    type: 'default',
    size: 'middle',
    danger: false,
    style: {
      display: 'block',
    },
  },
  render: (props, isDesignMode = false) => {
    return (
      <div style={{ pointerEvents: isDesignMode ? 'none' : 'auto', width: '100%', height: '100%' }}>
        <Button {...props} style={props.style}>
          {props.text || '按钮'}
        </Button>
      </div>
    );
  },
  renderPropertyPanel: (props, form) => {
    return (
      <>
        <Form.Item label="文本内容" name="text">
          <Input placeholder="输入文本内容" />
        </Form.Item>
        <Form.Item label="按钮类型" name="type">
          <Select>
            <Select.Option value="default">默认</Select.Option>
            <Select.Option value="primary">主要</Select.Option>
            <Select.Option value="dashed">虚线</Select.Option>
            <Select.Option value="text">文本</Select.Option>
            <Select.Option value="link">链接</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="按钮大小" name="size">
          <Select>
            <Select.Option value="small">小</Select.Option>
            <Select.Option value="middle">中</Select.Option>
            <Select.Option value="large">大</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="危险按钮" name="danger">
          <Select>
            <Select.Option value={false}>否</Select.Option>
            <Select.Option value={true}>是</Select.Option>
          </Select>
        </Form.Item>
      </>
    );
  },
};
