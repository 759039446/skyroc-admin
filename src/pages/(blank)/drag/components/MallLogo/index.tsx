import { Form, Input } from 'antd';
import type { ComponentConfig } from '../types';

export const MallLogoComponent: ComponentConfig = {
  id: 'mall-logo',
  type: 'MallLogo',
  label: '商城Logo',
  icon: '🏪',
  category: '商城组件',
  order: 4,
  defaultSize: {
    widthRatio: 0.3,
    heightRows: 8,
  },
  defaultWidth: '100%',
  defaultHeight: '100%',
  defaultProps: {
    logoText: '京东',
    logoColor: '#e1251b',
    slogan: '买五金上京东又好又便宜',
    sloganColor: '#666',
    showSlogan: true,
  },
  render: (props) => {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
      }}>
        <div style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: props.logoColor,
          fontFamily: 'Arial, sans-serif',
        }}>
          {props.logoText}
        </div>
        {props.showSlogan && (
          <div style={{
            fontSize: '14px',
            color: props.sloganColor,
            textAlign: 'center',
          }}>
            {props.slogan}
          </div>
        )}
      </div>
    );
  },
  renderPropertyPanel: (props, form) => {
    return (
      <>
        <Form.Item label="Logo文字" name="logoText">
          <Input placeholder="输入Logo文字" />
        </Form.Item>
        <Form.Item label="Logo颜色" name="logoColor">
          <Input type="color" />
        </Form.Item>
        <Form.Item label="标语内容" name="slogan">
          <Input.TextArea placeholder="输入标语" rows={2} />
        </Form.Item>
        <Form.Item label="标语颜色" name="sloganColor">
          <Input type="color" />
        </Form.Item>
      </>
    );
  },
};
