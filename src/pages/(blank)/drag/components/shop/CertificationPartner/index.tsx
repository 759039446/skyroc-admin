import { Form, Input } from 'antd';
import { SafetyCertificateOutlined, TrophyOutlined, GlobalOutlined } from '@ant-design/icons';
import type { ComponentConfig } from '../../types';

export const CertificationPartnerComponent: ComponentConfig = {
  id: 'certification-partner',
  type: 'CertificationPartner',
  label: '认证与合作',
  icon: '🏆',
  category: '商城组件',
  order: 11,
  defaultSize: {
    widthRatio: 1,
    heightRows: 12,
  },
  defaultWidth: '100%',
  defaultHeight: '100%',
  defaultProps: {
    certifications: [
      { name: 'ISO 9001', desc: '质量管理体系认证' },
      { name: '可信网站', desc: '实名认证' },
      { name: '诚信网站', desc: '诚信认证' },
    ],
    partners: ['阿里巴巴', '腾讯', '百度', '华为', '字节跳动'],
    subsidiaries: ['京东商城', '京东物流', '京东金融', '京东健康'],
    backgroundColor: '#fafafa',
    borderColor: '#e0e0e0',
  },
  render: (props, isDesignMode = false) => {
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '30px',
        }}>
          {/* 安全认证 */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '15px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
            }}>
              <SafetyCertificateOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
              <span>安全认证</span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              {props.certifications && props.certifications.map((cert: any, index: number) => (
                <div
                  key={index}
                  style={{
                    padding: '10px',
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
                    {cert.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {cert.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 合作伙伴 */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '15px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
            }}>
              <TrophyOutlined style={{ fontSize: '20px', color: '#faad14' }} />
              <span>合作伙伴</span>
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
            }}>
              {props.partners && props.partners.map((partner: string, index: number) => (
                <div
                  key={index}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#666',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1890ff';
                    e.currentTarget.style.color = '#1890ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e0e0e0';
                    e.currentTarget.style.color = '#666';
                  }}
                >
                  {partner}
                </div>
              ))}
            </div>
          </div>

          {/* 旗下网站 */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '15px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
            }}>
              <GlobalOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
              <span>旗下网站</span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              {props.subsidiaries && props.subsidiaries.map((site: string, index: number) => (
                <div
                  key={index}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#666',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f8ff';
                    e.currentTarget.style.borderColor = '#1890ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff';
                    e.currentTarget.style.borderColor = '#e0e0e0';
                  }}
                >
                  {site}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
  renderPropertyPanel: (props, form) => {
    return (
      <>
        <Form.Item label="认证信息" help="格式: 名称|描述，每行一个">
          <Input.TextArea 
            rows={4}
            placeholder="例如：&#10;ISO 9001|质量管理体系认证&#10;可信网站|实名认证"
            onChange={(e) => {
              const lines = e.target.value.split('\n').filter(l => l.trim());
              const certifications = lines.map(line => {
                const [name, desc] = line.split('|').map(s => s.trim());
                return { name, desc };
              });
              form.setFieldValue('certifications', certifications);
            }}
          />
        </Form.Item>
        <Form.Item label="合作伙伴" help="多个用逗号分隔">
          <Input.TextArea 
            rows={3}
            placeholder="例如：阿里巴巴,腾讯,百度"
            onChange={(e) => {
              const partners = e.target.value.split(',').map(s => s.trim()).filter(s => s);
              form.setFieldValue('partners', partners);
            }}
          />
        </Form.Item>
        <Form.Item label="旗下网站" help="多个用逗号分隔">
          <Input.TextArea 
            rows={2}
            placeholder="例如：京东商城,京东物流,京东金融"
            onChange={(e) => {
              const subsidiaries = e.target.value.split(',').map(s => s.trim()).filter(s => s);
              form.setFieldValue('subsidiaries', subsidiaries);
            }}
          />
        </Form.Item>
        <Form.Item label="背景颜色" name="backgroundColor">
          <Input type="color" />
        </Form.Item>
      </>
    );
  },
};
