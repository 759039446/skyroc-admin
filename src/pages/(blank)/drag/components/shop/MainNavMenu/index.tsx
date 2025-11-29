import { Form, Input, Switch } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import type { ComponentConfig } from '../../types';

export const MainNavMenuComponent: ComponentConfig = {
  id: 'main-nav-menu',
  type: 'MainNavMenu',
  label: '主导航菜单',
  icon: '📋',
  category: '商城组件',
  order: 5,
  defaultSize: {
    widthRatio: 1,
    heightRows: 10,
  },
  defaultWidth: '100%',
  defaultHeight: '100%',
  defaultProps: {
    categories: [
      '工具/焊接用品',
      '紧固/密封/仪器仪表',
      '个人防护/安防/消防',
      '五金/工具/照明',
      '机械/动力',
      '电工/电气',
      '化工/清洁',
      '劳保/办公',
    ],
    backgroundColor: '#fff',
    hoverColor: '#e1251b',
    borderColor: '#e0e0e0',
  },
  render: (props, isDesignMode = false) => {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: props.backgroundColor,
        border: `1px solid ${props.borderColor}`,
        borderRadius: '4px',
        pointerEvents: isDesignMode ? 'none' : 'auto',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '15px 20px',
          backgroundColor: '#f5f5f5',
          borderBottom: `1px solid ${props.borderColor}`,
          fontSize: '16px',
          fontWeight: 'bold',
        }}>
          <MenuOutlined />
          <span>全部商品分类</span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1px',
          backgroundColor: props.borderColor,
        }}>
          {props.categories.map((category: string, index: number) => (
            <div
              key={index}
              style={{
                padding: '12px 20px',
                backgroundColor: props.backgroundColor,
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = props.hoverColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#333';
              }}
            >
              {category}
            </div>
          ))}
        </div>
      </div>
    );
  },
  renderPropertyPanel: (props, form) => {
    return (
      <>
        <Form.Item label="分类列表" name="categories">
          <Input.TextArea 
            placeholder="每行一个分类"
            rows={8}
            onChange={(e) => {
              const value = e.target.value.split('\n').filter(item => item.trim());
              form.setFieldValue('categories', value);
            }}
          />
        </Form.Item>
        <Form.Item label="背景颜色" name="backgroundColor">
          <Input type="color" />
        </Form.Item>
        <Form.Item label="悬停颜色" name="hoverColor">
          <Input type="color" />
        </Form.Item>
        <Form.Item label="边框颜色" name="borderColor">
          <Input type="color" />
        </Form.Item>
      </>
    );
  },
};
