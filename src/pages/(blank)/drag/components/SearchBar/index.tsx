import { Form, Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ComponentConfig } from '../types';

export const SearchBarComponent: ComponentConfig = {
  id: 'search-bar',
  type: 'SearchBar',
  label: '搜索栏',
  icon: '🔍',
  category: '商城组件',
  order: 2,
  defaultSize: {
    widthRatio: 0.6,
    heightRows: 6,
  },
  defaultWidth: '100%',
  defaultHeight: '100%',
  defaultProps: {
    placeholder: '请输入商品名称或关键词',
    buttonText: '搜索',
    buttonColor: '#e1251b',
    borderColor: '#e1251b',
  },
  render: (props) => {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <input
          type="text"
          placeholder={props.placeholder}
          style={{
            flex: 1,
            height: '40px',
            padding: '0 15px',
            border: `2px solid ${props.borderColor}`,
            borderRadius: '4px 0 0 4px',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button
          style={{
            height: '40px',
            padding: '0 30px',
            backgroundColor: props.buttonColor,
            color: '#fff',
            border: 'none',
            borderRadius: '0 4px 4px 0',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <SearchOutlined />
          {props.buttonText}
        </button>
      </div>
    );
  },
  renderPropertyPanel: (props, form) => {
    return (
      <>
        <Form.Item label="占位符文字" name="placeholder">
          <Input placeholder="输入占位符文字" />
        </Form.Item>
        <Form.Item label="按钮文字" name="buttonText">
          <Input placeholder="输入按钮文字" />
        </Form.Item>
        <Form.Item label="按钮颜色" name="buttonColor">
          <Input type="color" />
        </Form.Item>
        <Form.Item label="边框颜色" name="borderColor">
          <Input type="color" />
        </Form.Item>
      </>
    );
  },
};
