import { Card, Form, Input } from 'antd';
import type { ComponentConfig } from '../types';

export const CardComponent: ComponentConfig = {
  id: 'card',
  type: 'Card',
  label: '卡片',
  icon: '🎴',
  defaultSize: {
    widthRatio: 0.5,
    heightRows: 6,
  },
  defaultWidth: '100%',
  defaultHeight: '100%',
  defaultProps: {
    title: '卡片标题',
    content: '卡片内容',
  },
  render: (props) => {
    return (
      <Card
        {...props}
        title={props.title || '卡片标题'}
        style={props.style}
        bodyStyle={{
          height: 'calc(100% - 57px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {props.content || '卡片内容'}
      </Card>
    );
  },
  renderPropertyPanel: (props, form) => {
    return (
      <>
        <Form.Item label="卡片标题" name="title">
          <Input placeholder="输入卡片标题" />
        </Form.Item>
        <Form.Item label="卡片内容" name="content">
          <Input.TextArea rows={3} placeholder="输入卡片内容" />
        </Form.Item>
      </>
    );
  },
};
