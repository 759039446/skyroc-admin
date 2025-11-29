import { Form, Input } from 'antd';
import { CrownOutlined, TeamOutlined, ShopOutlined, AppstoreOutlined, FileTextOutlined, PrinterOutlined } from '@ant-design/icons';
import type { ComponentConfig } from '../../types';

export const EnterpriseRightsComponent: ComponentConfig = {
  id: 'enterprise-rights',
  type: 'EnterpriseRights',
  label: '企业权益',
  icon: '👔',
  category: '商城组件',
  order: 7,
  defaultSize: {
    widthRatio: 1,
    heightRows: 15,
  },
  defaultWidth: '100%',
  defaultHeight: '100%',
  defaultProps: {
    items: [
      { icon: 'crown', title: '企业专享价', desc: '会员专属价格' },
      { icon: 'team', title: '企业达量返', desc: '满额返现' },
      { icon: 'shop', title: '企业团购', desc: '团购优惠' },
      { icon: 'appstore', title: '工作台', desc: '高效管理' },
      { icon: 'file', title: '订单中心', desc: '订单查询' },
      { icon: 'printer', title: '极速开票', desc: '快速开具' },
    ],
    backgroundColor: '#fff',
    borderColor: '#e0e0e0',
    iconColor: '#e1251b',
  },
  render: (props, isDesignMode = false) => {
    const getIcon = (iconName: string) => {
      const iconMap: Record<string, React.ReactNode> = {
        crown: <CrownOutlined />,
        team: <TeamOutlined />,
        shop: <ShopOutlined />,
        appstore: <AppstoreOutlined />,
        file: <FileTextOutlined />,
        printer: <PrinterOutlined />,
      };
      return iconMap[iconName] || <AppstoreOutlined />;
    };

    return (
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: props.backgroundColor,
        border: `1px solid ${props.borderColor}`,
        borderRadius: '8px',
        padding: '20px',
        pointerEvents: isDesignMode ? 'none' : 'auto',
      }}>
        <h3 style={{
          margin: '0 0 20px 0',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333',
        }}>
          企业权益与常用功能
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '20px',
        }}>
          {props.items && props.items.map((item: any, index: number) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                padding: '15px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9f9f9';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '32px', color: props.iconColor }}>
                {getIcon(item.icon)}
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#333',
                textAlign: 'center',
              }}>
                {item.title}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#999',
                textAlign: 'center',
              }}>
                {item.desc}
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
        <Form.Item label="功能配置" help="格式: 图标|标题|描述，每行一个">
          <Input.TextArea 
            rows={8}
            placeholder="例如：&#10;crown|企业专享价|会员专属价格&#10;team|企业达量返|满额返现"
            onChange={(e) => {
              const lines = e.target.value.split('\n').filter(l => l.trim());
              const items = lines.map(line => {
                const [icon, title, desc] = line.split('|').map(s => s.trim());
                return { icon: icon || 'appstore', title, desc };
              });
              form.setFieldValue('items', items);
            }}
          />
        </Form.Item>
        <Form.Item label="背景颜色" name="backgroundColor">
          <Input type="color" />
        </Form.Item>
        <Form.Item label="图标颜色" name="iconColor">
          <Input type="color" />
        </Form.Item>
      </>
    );
  },
};
