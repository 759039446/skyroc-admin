import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button, Space, Typography, Form, Divider, Drawer } from 'antd';
import { LeftOutlined, RightOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './styles.css';
import { COMPONENT_REGISTRY, getComponentConfig, type CanvasComponent } from './components';
import Preview from './modules/preview';

const { Text } = Typography;

// 网格配置项
const GRID_CONFIG = {
  cols: 48,           // 网格列数
  rowHeight: 5,       // 每行高度（px）
  width: 1200,        // 画布宽度（px，可配置）
};

// 主组件
const Drag = () => {
  const { t } = useTranslation();
  const [canvasComponents, setCanvasComponents] = useState<CanvasComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [form] = Form.useForm();
  
  // 侧边栏折叠状态
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  
  // 预览模式状态
  const [previewVisible, setPreviewVisible] = useState(false);
  
  // 属性配置抽屉状态
  const [drawerVisible, setDrawerVisible] = useState(false);

  // 历史记录管理
  const [history, setHistory] = useState<CanvasComponent[][]>([[]]); // 历史记录栈
  const [historyIndex, setHistoryIndex] = useState(0); // 当前历史索引

  // 获取当前选中的组件
  const currentComponent = canvasComponents.find(c => c.i === selectedComponent);

  // 保存历史记录
  const saveHistory = useCallback((newComponents: CanvasComponent[]) => {
    setHistory(prev => {
      // 删除当前索引之后的所有历史（分支历史）
      const newHistory = prev.slice(0, historyIndex + 1);
      // 添加新状态
      newHistory.push(JSON.parse(JSON.stringify(newComponents)));
      // 限制历史记录数量（最多50条）
      if (newHistory.length > 50) {
        return newHistory.slice(-50);
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  // 撤回
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCanvasComponents(JSON.parse(JSON.stringify(history[newIndex])));
      setSelectedComponent(null);
    }
  }, [historyIndex, history]);

  // 恢复
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCanvasComponents(JSON.parse(JSON.stringify(history[newIndex])));
      setSelectedComponent(null);
    }
  }, [historyIndex, history]);

  // 更新组件属性
  const updateComponentProps = useCallback((componentId: string, newProps: Record<string, any>) => {
    setCanvasComponents(prev => {
      const updated = prev.map(comp =>
        comp.i === componentId
          ? { ...comp, props: { ...comp.props, ...newProps } }
          : comp
      );
      saveHistory(updated);
      return updated;
    });
  }, [saveHistory]);

  // 选中组件（单击）
  const handleSelectComponent = useCallback((componentId: string) => {
    setSelectedComponent(componentId);
  }, []);
  
  // 打开属性配置（双击）
  const handleOpenPropertyDrawer = useCallback((componentId: string) => {
    setSelectedComponent(componentId);
    const component = canvasComponents.find(c => c.i === componentId);
    if (component) {
      form.setFieldsValue(component.props);
      setDrawerVisible(true);
    }
  }, [canvasComponents, form]);

  // 处理布局变化（实时更新）
  const handleLayoutChange = useCallback((layout: any[]) => {
    setCanvasComponents(prev => {
      const updated = prev.map(comp => {
        const layoutItem = layout.find(item => item.i === comp.i);
        if (layoutItem) {
          return { ...comp, x: layoutItem.x, y: layoutItem.y, w: layoutItem.w, h: layoutItem.h };
        }
        return comp;
      });
      return updated;
    });
  }, []);

  // 布局变化结束时保存历史（拖拽结束）
  const handleLayoutChangeComplete = useCallback((layout: any[]) => {
    setCanvasComponents(prev => {
      const updated = prev.map(comp => {
        const layoutItem = layout.find(item => item.i === comp.i);
        if (layoutItem) {
          return { ...comp, x: layoutItem.x, y: layoutItem.y, w: layoutItem.w, h: layoutItem.h };
        }
        return comp;
      });
      saveHistory(updated);
      return updated;
    });
  }, [saveHistory]);

  // 从组件库拖拽到画布
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('componentType');
    
    if (componentType) {
      const componentConfig = getComponentConfig(componentType);
      if (!componentConfig) return;

      // 根据配置计算组件尺寸
      const defaultWidth = Math.round(GRID_CONFIG.cols * componentConfig.defaultSize.widthRatio);
      const defaultHeight = componentConfig.defaultSize.heightRows;
      
      // 合并默认属性，如果组件配置了defaultWidth或defaultHeight，则添加到style中
      const initialProps = { ...componentConfig.defaultProps };
      if (componentConfig.defaultWidth || componentConfig.defaultHeight) {
        initialProps.style = {
          ...initialProps.style,
          ...(componentConfig.defaultWidth && { width: componentConfig.defaultWidth }),
          ...(componentConfig.defaultHeight && { height: componentConfig.defaultHeight }),
        };
      }
      
      const newComponent: CanvasComponent = {
        i: `component-${Date.now()}`,
        x: 0,
        y: Infinity, // 自动放置在底部
        w: defaultWidth,
        h: defaultHeight,
        type: componentType,
        props: initialProps,
      };
      
      setCanvasComponents(prev => {
        const updated = [...prev, newComponent];
        saveHistory(updated);
        return updated;
      });
    }
  }, [saveHistory]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // 删除组件
  const handleRemoveComponent = useCallback((componentId: string) => {
    setCanvasComponents(prev => {
      const updated = prev.filter(comp => comp.i !== componentId);
      saveHistory(updated);
      return updated;
    });
    if (selectedComponent === componentId) {
      setSelectedComponent(null);
      setDrawerVisible(false);
    }
  }, [selectedComponent, saveHistory]);

  // 清空画布
  const handleClearCanvas = useCallback(() => {
    const updated: CanvasComponent[] = [];
    setCanvasComponents(updated);
    saveHistory(updated);
    setSelectedComponent(null);
    setDrawerVisible(false);
  }, [saveHistory]);

  // 开始拖拽组件库中的组件
  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    e.dataTransfer.setData('componentType', componentType);
  };

  // 组件分组处理
  const getGroupedComponents = () => {
    // 按 category 分组
    const grouped = COMPONENT_REGISTRY.reduce((acc, component) => {
      const category = component.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(component);
      return acc;
    }, {} as Record<string, typeof COMPONENT_REGISTRY>);

    // 对每个分组内的组件按 order 排序
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => a.order - b.order);
    });

    return grouped;
  };

  const groupedComponents = getGroupedComponents();

  // 键盘快捷键监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z 或 Cmd+Z 撤回
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Ctrl+Y 或 Cmd+Shift+Z 恢复
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // 渲染属性配置表单
  const renderPropertyPanel = () => {
    if (!currentComponent) return null;

    const { type, props } = currentComponent;
    const componentConfig = getComponentConfig(type);

    if (!componentConfig) {
      return <Text type="secondary">未知组件类型</Text>;
    }

    return (
      <Form
        form={form}
        layout="vertical"
        onValuesChange={(_, allValues) => {
          updateComponentProps(currentComponent.i, allValues);
        }}
        initialValues={props}
      >
        <Divider orientation="left" style={{ fontSize: '14px', margin: '8px 0' }}>
          {componentConfig.label} 属性
        </Divider>
        {componentConfig.renderPropertyPanel?.(props, form)}
      </Form>
    );
  };

  return (
    <div className="drag-container">
      {/* 左侧组件库 */}
      <div className={`drag-left-panel ${leftPanelCollapsed ? 'collapsed' : ''}`}>
        <Card 
          title="组件库" 
          className="drag-panel-card"
          styles={{ 
            body: { 
              padding: '12px',
              overflowY: 'auto',
              overflowX: 'hidden',
            } 
          }}
          extra={
            <Button 
              type="text" 
              size="small" 
              icon={leftPanelCollapsed ? <RightOutlined /> : <LeftOutlined />}
              onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
              title={leftPanelCollapsed ? '展开组件库' : '收起组件库'}
            />
          }
        >
          <div className="drag-component-list">
            {Object.entries(groupedComponents).map(([category, components]) => (
              <div key={category} className="drag-component-group">
                <div className="drag-component-group-title">{category}</div>
                <div className="drag-component-group-items">
                  {components.map(component => (
                    <Card
                      key={component.id}
                      size="small"
                      hoverable
                      draggable
                      onDragStart={(e) => handleDragStart(e, component.type)}
                      className="drag-component-item"
                    >
                      <div className="drag-component-item-content">
                        {component.previewImage ? (
                          <img 
                            src={component.previewImage} 
                            alt={component.label}
                            className="drag-component-preview-image"
                          />
                        ) : (
                          <span className="drag-component-icon">{component.icon}</span>
                        )}
                        <Text className="drag-component-label">{component.label}</Text>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 中间画布区域 */}
      <div className="drag-canvas-wrapper">
        <Card 
          title="画布" 
          className="drag-canvas-card"
          styles={{ body: { height: 'calc(100% - 57px)', overflow: 'auto' } }}
          extra={
            <Space>
              <Text type="secondary">组件数: {canvasComponents.length}</Text>
              <Button 
                size="small"
                icon={<EyeOutlined />}
                onClick={() => setPreviewVisible(true)}
                type="primary"
                title="预览页面"
              >
                预览
              </Button>
              <Button 
                size="small"
                icon={<span>↶</span>}
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                title="撤回 (Ctrl+Z)"
              >
                撤回
              </Button>
              <Button 
                size="small"
                icon={<span>↷</span>}
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                title="恢复 (Ctrl+Y)"
              >
                恢复
              </Button>
              <Button 
                size="small" 
                danger 
                onClick={handleClearCanvas}
              >
                清空画布
              </Button>
            </Space>
          }
        >
          <div className="drag-canvas-container">
            <div 
              className="drag-canvas"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              style={{ width: `${GRID_CONFIG.width}px` }}
            >
              {canvasComponents.length === 0 ? (
                <div className="drag-empty-canvas">
                  <Text type="secondary" style={{ fontSize: '16px' }}>
                    从左侧拖拽组件到此处开始设计
                  </Text>
                </div>
              ) : (
                <div style={{ paddingBottom: '400px' }}>
                  <GridLayout
                    className="layout"
                    layout={canvasComponents}
                    cols={GRID_CONFIG.cols}
                    rowHeight={GRID_CONFIG.rowHeight}
                    width={GRID_CONFIG.width}
                    autoSize={true}
                    onLayoutChange={handleLayoutChange}
                    onDragStop={handleLayoutChangeComplete}
                    onResizeStop={handleLayoutChangeComplete}
                    draggableHandle=".drag-handle"
                  >
                    {canvasComponents.map(component => (
                      <div 
                        key={component.i}
                        className={`drag-grid-item ${
                          selectedComponent === component.i ? 'selected' : ''
                        }`}
                        onClick={() => handleSelectComponent(component.i)}
                        onDoubleClick={() => handleOpenPropertyDrawer(component.i)}
                      >
                        {/* 拖拽控制栏 - 悬停时显示 */}
                        <div className="drag-handle drag-item-toolbar">
                          <span className="drag-item-label">
                            {getComponentConfig(component.type)?.label}
                          </span>
                          <DeleteOutlined 
                            className="drag-item-remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveComponent(component.i);
                            }}
                          />
                        </div>
                        {/* 组件内容区域 */}
                        <div className="drag-item-content">
                          {getComponentConfig(component.type)?.render(component.props)}
                        </div>
                      </div>
                    ))}
                  </GridLayout>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* 属性配置抽屉 */}
      <Drawer
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>属性配置</span>
            {currentComponent && (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {getComponentConfig(currentComponent.type)?.label}
              </Text>
            )}
          </div>
        }
        placement="right"
        width={400}
        open={drawerVisible && !!currentComponent}
        onClose={() => setDrawerVisible(false)}
        styles={{
          body: {
            padding: '16px',
          },
        }}
      >
        {renderPropertyPanel()}
      </Drawer>
      
      {/* 预览弹窗 */}
      <Preview
        open={previewVisible}
        onClose={() => setPreviewVisible(false)}
        components={canvasComponents}
        canvasWidth={GRID_CONFIG.width}
        gridConfig={{
          cols: GRID_CONFIG.cols,
          rowHeight: GRID_CONFIG.rowHeight,
        }}
      />
    </div>
  );
};

export default Drag;
