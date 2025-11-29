import { Form, Input } from 'antd';
import { GiftOutlined, PercentageOutlined, DollarOutlined } from '@ant-design/icons';
import type { ComponentConfig } from '../types';

export const PromotionInfoComponent: ComponentConfig = {
  id: 'promotion-info',
  type: 'PromotionInfo',
  label: '促销信息',
  icon: '🎁',
  category: '商城组件',
  order: 8,
  defaultSize: {
    widthRatio: 1,
    heightRows: 12,
  },
  defaultWidth: '100%',
  defaultHeight: '100%',
  defaultProps: {
    promotions: [
      { icon: 'gift', title: '新客买工业品首单8折', highlight: '8折' },
      { icon: 'percentage', title: '专享价93折起', highlight: '93折' },
      { icon: 'dollar', title: '注册另享3200元津贴', highlight: '3200元' },
    ],
    backgroundColor: '#fff5f0',
    borderColor: '#ffccc7',
    highlightColor: '#e1251b',
  },
  render: (props) => {
    const getIcon = (iconName: string) => {
      const iconMap: Record<string, React.ReactNode> = {
        gift: <GiftOutlined />,
        percentage: <PercentageOutlined />,
        dollar: <DollarOutlined />,
      };
      return iconMap[iconName] || <GiftOutlined />;
    };

    return (
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: props.backgroundColor,
        border: `2px solid ${props.borderColor}`,
        borderRadius: '8px',
        padding: '20px',
      }}>
        <div style={{
          marginBottom: '15px',
          fontSize: '20px',
          fontWeight: 'bold',
          color: props.highlightColor,
          textAlign: 'center',
        }}>
          🎉 新客专享优惠
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          gap: '20px',
        }}>
          {props.promotions && props.promotions.map((promo: any, index: number) => (
            <div
              key={index}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                padding: '15px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ fontSize: '36px', color: props.highlightColor }}>
                {getIcon(promo.icon)}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#333',
                textAlign: 'center',
              }}>
                {promo.title}
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: props.highlightColor,
              }}>
                {promo.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
  renderPropertyPanel: (props, form) => {
    return (
      <>
        <Form.Item label="促销配置" help="格式: 图标|标题|高亮文字，每行一个">
          <Input.TextArea 
            rows={6}
            placeholder="例如：&#10;gift|新客买工业品首单8折|8折&#10;percentage|专享价93折起|93折"
            onChange={(e) => {
              const lines = e.target.value.split('\n').filter(l => l.trim());
              const promotions = lines.map(line => {
                const [icon, title, highlight] = line.split('|').map(s => s.trim());
                return { icon: icon || 'gift', title, highlight };
              });
              form.setFieldValue('promotions', promotions);
            }}
          />
        </Form.Item>
        <Form.Item label="背景颜色" name="backgroundColor">
          <Input type="color" />
        </Form.Item>
        <Form.Item label="边框颜色" name="borderColor">
          <Input type="color" />
        </Form.Item>
        <Form.Item label="高亮颜色" name="highlightColor">
          <Input type="color" />
        </Form.Item>
      </>
    );
  },
};
