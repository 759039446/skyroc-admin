import { Form, Input, InputNumber, Switch } from 'antd';
import { ShoppingCartOutlined, ShoppingOutlined } from '@ant-design/icons';
import type { ComponentConfig } from '../types';

export const ShoppingCartComponent: ComponentConfig = {
  id: 'shopping-cart',
  type: 'ShoppingCart',
  label: '购物车',
  icon: '🛒',
  category: '商城组件',
  order: 3,
  defaultSize: {
    widthRatio: 0.3,
    heightRows: 6,
  },
  defaultWidth: '100%',
  defaultHeight: '100%',
  defaultProps: {
    cartCount: 0,
    showBatchPurchase: true,
    batchPurchaseText: '批量采购',
    cartColor: '#e1251b',
  },
  render: (props) => {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '20px',
      }}>
        <div style={{
          position: 'relative',
          fontSize: '24px',
          color: props.cartColor,
          cursor: 'pointer',
        }}>
          <ShoppingCartOutlined />
          {props.cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: props.cartColor,
              color: '#fff',
              fontSize: '12px',
              padding: '2px 6px',
              borderRadius: '10px',
              minWidth: '18px',
              textAlign: 'center',
            }}>
              {props.cartCount}
            </span>
          )}
        </div>
        {props.showBatchPurchase && (
          <button style={{
            padding: '8px 20px',
            backgroundColor: '#fff',
            border: `1px solid ${props.cartColor}`,
            color: props.cartColor,
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}>
            <ShoppingOutlined />
            {props.batchPurchaseText}
          </button>
        )}
      </div>
    );
  },
  renderPropertyPanel: (props, form) => {
    return (
      <>
        <Form.Item label="购物车数量" name="cartCount">
          <InputNumber min={0} placeholder="输入数量" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="显示批量采购" name="showBatchPurchase" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="批量采购文字" name="batchPurchaseText">
          <Input placeholder="输入按钮文字" />
        </Form.Item>
        <Form.Item label="主题颜色" name="cartColor">
          <Input type="color" />
        </Form.Item>
      </>
    );
  },
};
