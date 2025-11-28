import { Tag, Form, Input, Select } from 'antd';
import type { ComponentConfig } from '../types';

export const TagComponent: ComponentConfig = {
  id: 'tag',
  type: 'Tag',
  label: '标签',
  icon: '🏷️',
  category: '展示组件',
  order: 1,
  defaultSize: {
    widthRatio: 0.33,
    heightRows: 3,
  },
  defaultWidth: 'auto',
  defaultHeight: 'auto',
  defaultProps: {
    text: '标签',
    color: 'blue',
  },
  render: (props) => {
    return (
      <Tag {...props} color={props.color || 'blue'}>
        {props.text || '标签'}
      </Tag>
    );
  },
  renderPropertyPanel: (props, form) => {
    return (
      <>
        <Form.Item label="文本内容" name="text">
          <Input placeholder="输入文本内容" />
        </Form.Item>
        <Form.Item label="标签颜色" name="color">
          <Select>
            <Select.Option value="blue">蓝色</Select.Option>
            <Select.Option value="green">绿色</Select.Option>
            <Select.Option value="red">红色</Select.Option>
            <Select.Option value="orange">橙色</Select.Option>
            <Select.Option value="purple">紫色</Select.Option>
            <Select.Option value="cyan">青色</Select.Option>
            <Select.Option value="gold">金色</Select.Option>
          </Select>
        </Form.Item>
      </>
    );
  },
};
