import { Typography, Form, Input, Select, InputNumber, Divider } from 'antd';
import type { ComponentConfig } from '../types';

const { Title } = Typography;

export const TitleComponent: ComponentConfig = {
  id: 'title',
  type: 'Title',
  label: '标题',
  icon: '📋',
  category: '基础组件',
  order: 4,
  defaultSize: {
    widthRatio: 0.33,
    heightRows: 3,
  },
  defaultWidth: 'auto',
  defaultHeight: 'auto',
  defaultProps: {
    text: '标题',
    level: 4,
    style: {},
  },
  render: (props) => {
    return (
      <Title level={props.level || 4} style={props.style}>
        {props.text || '标题'}
      </Title>
    );
  },
  renderPropertyPanel: (props, form) => {
    return (
      <>
        <Form.Item label="文本内容" name="text">
          <Input placeholder="输入文本内容" />
        </Form.Item>
        <Form.Item label="标题级别" name="level">
          <Select>
            <Select.Option value={1}>H1 - 特大</Select.Option>
            <Select.Option value={2}>H2 - 大</Select.Option>
            <Select.Option value={3}>H3 - 中</Select.Option>
            <Select.Option value={4}>H4 - 小</Select.Option>
            <Select.Option value={5}>H5 - 更小</Select.Option>
          </Select>
        </Form.Item>
        <Divider orientation="left" style={{ fontSize: '12px', margin: '8px 0' }}>
          文本样式
        </Divider>
        <Form.Item label="字体大小" name={['style', 'fontSize']}>
          <InputNumber min={12} max={72} addonAfter="px" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="字体粗细" name={['style', 'fontWeight']}>
          <Select>
            <Select.Option value="normal">正常</Select.Option>
            <Select.Option value="bold">粗体</Select.Option>
            <Select.Option value="lighter">细体</Select.Option>
            <Select.Option value={100}>100</Select.Option>
            <Select.Option value={300}>300</Select.Option>
            <Select.Option value={500}>500</Select.Option>
            <Select.Option value={700}>700</Select.Option>
            <Select.Option value={900}>900</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="文本颜色" name={['style', 'color']}>
          <Input type="color" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="文本对齐" name={['style', 'textAlign']}>
          <Select>
            <Select.Option value="left">左对齐</Select.Option>
            <Select.Option value="center">居中</Select.Option>
            <Select.Option value="right">右对齐</Select.Option>
          </Select>
        </Form.Item>
      </>
    );
  },
};
