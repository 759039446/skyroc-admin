import { Image, Form, Input, Select, InputNumber } from 'antd';
import type { ComponentConfig } from '../types';

export const ImageComponent: ComponentConfig = {
  id: 'image',
  type: 'Image',
  label: '图片',
  icon: '🖼️',
  defaultSize: {
    widthRatio: 0.33,
    heightRows: 6,
  },
  defaultWidth: '100%',
  defaultHeight: 'auto',
  defaultProps: {
    src: 'https://via.placeholder.com/400x300',
    alt: '图片',
    preview: true,
    style: {
      objectFit: 'contain',
    },
  },
  render: (props) => {
    return (
      <Image
        {...props}
        src={props.src || 'https://via.placeholder.com/400x300'}
        alt={props.alt || '图片'}
        preview={props.preview !== false}
        style={props.style}
      />
    );
  },
  renderPropertyPanel: (props, form) => {
    return (
      <>
        <Form.Item label="图片地址" name="src">
          <Input placeholder="输入图片URL" />
        </Form.Item>
        <Form.Item label="替代文本" name="alt">
          <Input placeholder="输入替代文本" />
        </Form.Item>
        <Form.Item label="图片填充方式" name={['style', 'objectFit']}>
          <Select>
            <Select.Option value="contain">适应容器</Select.Option>
            <Select.Option value="cover">覆盖容器</Select.Option>
            <Select.Option value="fill">拉伸填充</Select.Option>
            <Select.Option value="none">原始尺寸</Select.Option>
            <Select.Option value="scale-down">缩小适应</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="宽度" name={['style', 'width']}>
          <Input placeholder="例如: 100%, 200px, auto" />
        </Form.Item>
        <Form.Item label="高度" name={['style', 'height']}>
          <Input placeholder="例如: 100%, 200px, auto" />
        </Form.Item>
        <Form.Item label="圆角" name={['style', 'borderRadius']}>
          <InputNumber min={0} max={50} addonAfter="px" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="启用预览" name="preview">
          <Select>
            <Select.Option value={true}>是</Select.Option>
            <Select.Option value={false}>否</Select.Option>
          </Select>
        </Form.Item>
      </>
    );
  },
};
