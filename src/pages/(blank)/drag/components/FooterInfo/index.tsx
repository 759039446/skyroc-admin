import { Form, Input } from 'antd';
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import type { ComponentConfig } from '../types';

export const FooterInfoComponent: ComponentConfig = {
  id: 'footer-info',
  type: 'FooterInfo',
  label: '底部信息',
  icon: '📄',
  category: '商城组件',
  order: 10,
  defaultSize: {
    widthRatio: 1,
    heightRows: 20,
  },
  defaultWidth: '100%',
  defaultHeight: '100%',
  defaultProps: {
    companyName: '京东工业品有限公司',
    copyright: '© 2024 JD.com 版权所有',
    phone: '400-123-4567',
    email: 'service@jd.com',
    address: '北京市朝阳区北辰西路8号院',
    links: [
      { title: '购物指南', items: ['购物流程', '会员介绍', '生活旅行'] },
      { title: '配送方式', items: ['快递配送', '送货上门', '自提服务'] },
      { title: '支付方式', items: ['在线支付', '货到付款', '分期付款'] },
      { title: '售后服务', items: ['售后政策', '价格保护', '退款说明'] },
    ],
    backgroundColor: '#f5f5f5',
    textColor: '#666',
  },
  render: (props) => {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: props.backgroundColor,
        color: props.textColor,
        padding: '40px 20px 20px 20px',
      }}>
        {/* 服务链接 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          marginBottom: '30px',
          paddingBottom: '30px',
          borderBottom: `1px solid ${props.textColor}33`,
        }}>
          {props.links && props.links.map((linkGroup: any, groupIndex: number) => (
            <div key={groupIndex}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '15px',
                color: '#333',
              }}>
                {linkGroup.title}
              </h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
              }}>
                {linkGroup.items.map((item: string, itemIndex: number) => (
                  <li
                    key={itemIndex}
                    style={{
                      marginBottom: '8px',
                      cursor: 'pointer',
                      transition: 'color 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#e1251b';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = props.textColor;
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 联系信息 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PhoneOutlined />
            <span>{props.phone}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MailOutlined />
            <span>{props.email}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <EnvironmentOutlined />
            <span>{props.address}</span>
          </div>
        </div>

        {/* 版权信息 */}
        <div style={{
          textAlign: 'center',
          fontSize: '12px',
          paddingTop: '20px',
          borderTop: `1px solid ${props.textColor}33`,
        }}>
          <div style={{ marginBottom: '5px' }}>{props.companyName}</div>
          <div>{props.copyright}</div>
        </div>
      </div>
    );
  },
  renderPropertyPanel: (props, form) => {
    return (
      <>
        <Form.Item label="公司名称" name="companyName">
          <Input placeholder="输入公司名称" />
        </Form.Item>
        <Form.Item label="版权信息" name="copyright">
          <Input placeholder="输入版权信息" />
        </Form.Item>
        <Form.Item label="联系电话" name="phone">
          <Input placeholder="输入联系电话" />
        </Form.Item>
        <Form.Item label="电子邮箱" name="email">
          <Input placeholder="输入电子邮箱" />
        </Form.Item>
        <Form.Item label="公司地址" name="address">
          <Input placeholder="输入公司地址" />
        </Form.Item>
        <Form.Item label="背景颜色" name="backgroundColor">
          <Input type="color" />
        </Form.Item>
        <Form.Item label="文字颜色" name="textColor">
          <Input type="color" />
        </Form.Item>
      </>
    );
  },
};
