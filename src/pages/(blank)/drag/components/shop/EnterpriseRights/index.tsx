import { Form, Input, InputNumber, Select } from 'antd';
import { CrownOutlined, TeamOutlined, ShopOutlined, AppstoreOutlined, FileTextOutlined, PrinterOutlined } from '@ant-design/icons';
import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
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
    columnsPerRow: 6,  // 每行显示的列数
    gap: 20,  // 项目间距
    itemHeight: 'auto',  // 项目高度：'auto'自动 或 具体数值(px)
  },
  render: (props, isDesignMode = false) => {
    // 将组件逻辑封装为一个真正的 React 组件
    const EnterpriseRightsContent = () => {
      const containerRef = useRef<HTMLDivElement>(null);
      const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

      useEffect(() => {
        if (containerRef.current) {
          let rafId: number | null = null;
          
          const updateSize = () => {
            if (containerRef.current) {
              setContainerSize({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight,
              });
            }
          };
          
          // 使用 requestAnimationFrame 节流，避免频繁更新
          const handleResize = () => {
            if (rafId !== null) {
              cancelAnimationFrame(rafId);
            }
            rafId = requestAnimationFrame(updateSize);
          };
          
          updateSize();
          
          // 监听窗口大小变化
          const resizeObserver = new ResizeObserver(handleResize);
          resizeObserver.observe(containerRef.current);
          
          return () => {
            if (rafId !== null) {
              cancelAnimationFrame(rafId);
            }
            resizeObserver.disconnect();
          };
        }
      }, []);

    const getIcon = useCallback((iconName: string) => {
      const iconMap: Record<string, React.ReactNode> = {
        crown: <CrownOutlined />,
        team: <TeamOutlined />,
        shop: <ShopOutlined />,
        appstore: <AppstoreOutlined />,
        file: <FileTextOutlined />,
        printer: <PrinterOutlined />,
      };
      return iconMap[iconName] || <AppstoreOutlined />;
    }, []);

    // 动态计算尺寸 - 使用 useMemo 缓存，只在依赖项变化时重新计算
    const sizes = useMemo(() => {
      const columns = props.columnsPerRow || 6;
      const gap = props.gap || 20;
      const containerWidth = containerSize.width || 800; // 默认值
      const containerHeight = containerSize.height || 400;
      
      // 计算每个项目的可用宽度
      const totalGapWidth = gap * (columns - 1);
      const itemWidth = (containerWidth - totalGapWidth - 4) / columns; // 减去容器padding
      
      // 计算项目高度
      let itemHeight: number;
      if (props.itemHeight && props.itemHeight !== 'auto') {
        itemHeight = typeof props.itemHeight === 'number' ? props.itemHeight : parseInt(props.itemHeight);
      } else {
        // 自动计算：基于容器高度和项目数量
        const itemCount = props.items?.length || 6;
        const rows = Math.ceil(itemCount / columns);
        const totalGapHeight = gap * (rows - 1);
        itemHeight = Math.max(80, (containerHeight - totalGapHeight - 4) / rows);
      }
      
      // 根据项目宽度和高度动态计算元素尺寸
      // 使用可用空间的较小值作为基准
      const baseSize = Math.min(itemWidth, itemHeight);
      
      // 图标大小：占基准尺寸的 35-45%
      const iconSize = Math.max(20, Math.min(60, baseSize * 0.4));
      
      // 标题大小：基于项目宽度，约为宽度的 8-12%
      const titleSize = Math.max(12, Math.min(22, itemWidth * 0.1));
      
      // 描述大小：标题的 70-80%
      const descSize = Math.max(10, titleSize * 0.75);
      
      // 内边距：基于项目大小的 8-12%
      const padding = Math.max(8, Math.min(24, baseSize * 0.1));
      
      // 内部间距：基于项目大小的 5-8%
      const innerGap = Math.max(6, Math.min(14, baseSize * 0.07));
      
      // 显示策略：根据项目宽度决定
      // 当项目宽度小于120px时，隐藏描述
      const showDesc = itemWidth >= 120;
      
      return {
        iconSize,
        titleSize,
        descSize,
        padding,
        innerGap,
        itemHeight,
        showDesc,
      };
    }, [
      containerSize.width,
      containerSize.height,
      props.columnsPerRow,
      props.gap,
      props.itemHeight,
      props.items?.length,
    ]);

    return (
      <div 
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: props.backgroundColor,
          border: `1px solid ${props.borderColor}`,
          borderRadius: '8px',
          padding: '2px',
          pointerEvents: isDesignMode ? 'none' : 'auto',
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${props.columnsPerRow || 6}, 1fr)`,
          gap: `${props.gap || 20}px`,
        }}>
          {props.items && props.items.map((item: any, index: number) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: `${sizes.innerGap}px`,
                padding: `${sizes.padding}px`,
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                minHeight: `${sizes.itemHeight}px`,
                height: props.itemHeight === 'auto' ? 'auto' : `${sizes.itemHeight}px`,
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
              <div style={{ fontSize: `${sizes.iconSize}px`, color: props.iconColor }}>
                {getIcon(item.icon)}
              </div>
              <div style={{
                fontSize: `${sizes.titleSize}px`,
                fontWeight: 'bold',
                color: '#333',
                textAlign: 'center',
                lineHeight: 1.2,
              }}>
                {item.title}
              </div>
              {sizes.showDesc && (
                <div style={{
                  fontSize: `${sizes.descSize}px`,
                  color: '#999',
                  textAlign: 'center',
                  lineHeight: 1.3,
                }}>
                  {item.desc}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      );
    };

    return <EnterpriseRightsContent />;
  },
  renderPropertyPanel: (props, form) => {
    return (
      <>
        <Form.Item label="每行列数" name="columnsPerRow" tooltip="设置每行显示几个项目">
          <Select
            options={[
              { label: '2列', value: 2 },
              { label: '3列', value: 3 },
              { label: '4列', value: 4 },
              { label: '5列', value: 5 },
              { label: '6列（默认）', value: 6 },
              { label: '8列', value: 8 },
            ]}
          />
        </Form.Item>
        <Form.Item label="项目间距" name="gap" tooltip="设置项目之间的间距（像素）">
          <InputNumber min={0} max={50} addonAfter="px" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="项目高度" name="itemHeight" tooltip="输入具体高度（像素），留空则自动适应" help="留空表示自动适应，推荐：2列160、3列140、4列130、6列100、8列90">
          <InputNumber 
            min={50} 
            max={300} 
            placeholder="自动适应" 
            addonAfter="px" 
            style={{ width: '100%' }}
          />
        </Form.Item>
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
