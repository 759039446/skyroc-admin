import { Form, Input, InputNumber } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { ComponentConfig } from '../../types';

export const CarouselAdComponent: ComponentConfig = {
  id: 'carousel-ad',
  type: 'CarouselAd',
  label: '轮播广告',
  icon: '🎬',
  category: '商城组件',
  order: 6,
  defaultSize: {
    widthRatio: 1,
    heightRows: 30,
  },
  defaultWidth: '100%',
  defaultHeight: '100%',
  defaultProps: {
    slides: [
      { title: '工业价同双11', subtitle: '企业专享价 93折起', bgColor: '#ff6b6b' },
      { title: '企采至高返650E卡', subtitle: '新客注册享3200元津贴', bgColor: '#4ecdc4' },
      { title: '五金工具专场', subtitle: '爆款直降 低至5折', bgColor: '#45b7d1' },
    ],
    autoPlay: true,
    interval: 3000,
  },
  render: (props, isDesignMode = false) => {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        pointerEvents: isDesignMode ? 'none' : 'auto',
      }}>
        {/* 简化展示：只显示第一张 */}
        {props.slides && props.slides.length > 0 && (
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: props.slides[0].bgColor,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            position: 'relative',
          }}>
            <h2 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              margin: '0 0 20px 0',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}>
              {props.slides[0].title}
            </h2>
            <p style={{
              fontSize: '24px',
              margin: 0,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            }}>
              {props.slides[0].subtitle}
            </p>
          </div>
        )}
        
        {/* 左右切换按钮 */}
        <button style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '40px',
          height: '40px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          border: 'none',
          borderRadius: '50%',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <LeftOutlined />
        </button>
        <button style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '40px',
          height: '40px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          border: 'none',
          borderRadius: '50%',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <RightOutlined />
        </button>

        {/* 指示点 */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
        }}>
          {props.slides && props.slides.map((_: any, index: number) => (
            <div
              key={index}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: index === 0 ? '#fff' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </div>
    );
  },
  renderPropertyPanel: (props, form) => {
    return (
      <>
        <Form.Item label="轮播间隔(ms)" name="interval">
          <InputNumber min={1000} max={10000} step={500} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="广告配置" help="格式: 标题|副标题|背景色，每行一个">
          <Input.TextArea 
            rows={8}
            placeholder="例如：&#10;工业价同双11|企业专享价|#ff6b6b&#10;企采至高返650E卡|新客注册|#4ecdc4"
            onChange={(e) => {
              const lines = e.target.value.split('\n').filter(l => l.trim());
              const slides = lines.map(line => {
                const [title, subtitle, bgColor] = line.split('|').map(s => s.trim());
                return { title, subtitle, bgColor: bgColor || '#45b7d1' };
              });
              form.setFieldValue('slides', slides);
            }}
          />
        </Form.Item>
      </>
    );
  },
};
