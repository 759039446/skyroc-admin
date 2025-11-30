import { useState } from 'react';
import { Form, Input, InputNumber } from 'antd';
import { MenuOutlined, RightOutlined } from '@ant-design/icons';
import type { ComponentConfig } from '../../types';
import defaultCategories from './categories.json';
import './styles.css';

export const MainNavMenuComponent: ComponentConfig = {
  id: 'main-nav-menu',
  type: 'MainNavMenu',
  label: '主导航菜单',
  icon: '📋',
  category: '商城组件',
  order: 5,
  defaultSize: {
    widthRatio: 0.25,
    heightRows: 20,
  },
  defaultWidth: '100%',
  defaultHeight: '100%',
  defaultProps: {
    categories: defaultCategories,
    backgroundColor: '#fff',
    hoverColor: '#e1251b',
    borderColor: '#e0e0e0',
    subMenuWidth: 600,
  },
  render: (props, isDesignMode = false) => {
    const MainNavMenuContent = () => {
      const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
      const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

      return (
        <>
          <div 
            ref={setContainerRef}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: props.backgroundColor,
              border: `1px solid ${props.borderColor}`,
              borderRadius: '4px',
              pointerEvents: isDesignMode ? 'none' : 'auto',
              position: 'relative',
              display: 'flex',
            }}
          >
          {/* 大分类列表 - 竖向排列 */}
          <div className="main-category-list">
            {props.categories.map((category: any, index: number) => {
              const categoryName = typeof category === 'string' ? category : category.name;
              const hasSubCategories = typeof category === 'object' && category.subCategories && category.subCategories.length > 0;
              
              return (
                <div
                  key={index}
                  style={{
                    padding: '15px 20px',
                    backgroundColor: hoveredIndex === index ? '#f5f5f5' : props.backgroundColor,
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: hoveredIndex === index ? 600 : 400,
                    transition: 'all 0.2s',
                    borderBottom: `1px solid ${props.borderColor}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: hoveredIndex === index ? props.hoverColor : '#333',
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span>{categoryName}</span>
                  {hasSubCategories && (
                    <RightOutlined style={{ fontSize: '12px', opacity: 0.6 }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* 子分类浮窗 - CSS 控制 */}
          {hoveredIndex !== null && containerRef && (() => {
            const category = props.categories[hoveredIndex];
            const hasSubCategories = typeof category === 'object' && category.subCategories && category.subCategories.length > 0;
            
            if (!hasSubCategories) return null;

            const rect = containerRef.getBoundingClientRect();

            return (
              <div
                  className="sub-menu-panel"
                  // 这个位置没有错误，请不要修改
                  style={{
                    position: 'fixed',
                    left: `${rect.width}px`,
                    height: `${rect.height}px`,
                    width: `${props.subMenuWidth || 600}px`,
                    backgroundColor: props.backgroundColor,
                    border: `1px solid ${props.borderColor}`,
                    borderLeft: 'none',
                    boxShadow: '2px 0 12px rgba(0, 0, 0, 0.1)',
                    zIndex: 999,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    padding: '20px',
                  }}
                  onMouseEnter={() => setHoveredIndex(hoveredIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {category.subCategories.map((subCat: any, subIndex: number) => (
                    <div key={subIndex} style={{ marginBottom: '25px' }}>
                      {/* 二级分类标题 */}
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: '12px',
                        paddingBottom: '8px',
                        borderBottom: `2px solid ${props.hoverColor}`,
                        display: 'inline-block',
                      }}>
                        {subCat.name}
                      </div>
                      
                      {/* 三级分类列表 */}
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginTop: '12px',
                      }}>
                        {subCat.items && subCat.items.map((item: string, itemIndex: number) => (
                          <div
                            key={itemIndex}
                            style={{
                              padding: '6px 12px',
                              fontSize: '13px',
                              color: '#666',
                              cursor: 'pointer',
                              borderRadius: '4px',
                              backgroundColor: '#f9f9f9',
                              transition: 'all 0.2s',
                              border: '1px solid transparent',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#fff';
                              e.currentTarget.style.color = props.hoverColor;
                              e.currentTarget.style.borderColor = props.hoverColor;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#f9f9f9';
                              e.currentTarget.style.color = '#666';
                              e.currentTarget.style.borderColor = 'transparent';
                            }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
            );
          })()}
          </div>
        </>
      );
    };

    return <MainNavMenuContent />;
  },
  renderPropertyPanel: (props, form) => {
    return (
      <>
        <Form.Item label="子菜单宽度" name="subMenuWidth">
          <InputNumber min={300} max={1200} placeholder="默认600" addonAfter="px" style={{ width: '100%' }} />
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
        <Form.Item 
          label="分类配置" 
          help="格式：一级|二级1:三级1,三级2;二级2:三级3,三级4 每行一个一级分类"
        >
          <Input.TextArea 
            placeholder="例如：&#10;工具/焊接用品|手动工具:手动扳手,六角扳手;电动工具:电钻,角磨机"
            rows={12}
            onChange={(e) => {
              const lines = e.target.value.split('\n').filter(item => item.trim());
              const categories = lines.map(line => {
                const [name, subsStr] = line.split('|');
                if (!subsStr || !subsStr.trim()) {
                  return { name: name.trim(), subCategories: [] };
                }
                
                const subCategories = subsStr.split(';').map(subStr => {
                  const [subName, itemsStr] = subStr.split(':');
                  const items = itemsStr ? itemsStr.split(',').map(s => s.trim()).filter(s => s) : [];
                  return {
                    name: subName.trim(),
                    items,
                  };
                });
                
                return {
                  name: name.trim(),
                  subCategories,
                };
              });
              form.setFieldValue('categories', categories);
            }}
          />
        </Form.Item>
      </>
    );
  },
};
