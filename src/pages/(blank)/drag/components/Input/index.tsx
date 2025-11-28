import { Input, Form, Select } from 'antd';
import type { ComponentConfig } from '../types';

export const InputComponent: ComponentConfig = {
  id: 'input',
  type: 'Input',
  label: '输入框',
  icon: '📝',
  category: '基础组件',
  order: 2,
  defaultSize: {
    widthRatio: 0.5,
    heightRows: 3,
  },
  defaultWidth: '100%',
  defaultHeight: '100%',
  defaultProps: {
    placeholder: '请输入内容',
    size: 'middle',
    style: {},
  },
  render: (props) => {
    return (
      <Input
        {...props}
        placeholder={props.placeholder || '请输入内容'}
        style={props.style}
      />
    );
  },
  renderPropertyPanel: (props, form) => {
    return (
      <>
        <Form.Item label="占位符" name="placeholder">
          <Input placeholder="输入占位符文本" />
        </Form.Item>
        <Form.Item label="输入框大小" name="size">
          <Select>
            <Select.Option value="small">小</Select.Option>
            <Select.Option value="middle">中</Select.Option>
            <Select.Option value="large">大</Select.Option>
          </Select>
        </Form.Item>
      </>
    );
  },
};
