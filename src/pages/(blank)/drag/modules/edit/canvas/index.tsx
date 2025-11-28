import { Card, Button, Space, Typography } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { getComponentConfig, type CanvasComponent } from '../../../components';
import './styles.css';

const { Text } = Typography;

interface CanvasProps {
  components: CanvasComponent[];
  selectedComponent: string | null;
  gridConfig: {
    cols: number;
    rowHeight: number;
    width: number;
  };
  historyIndex: number;
  historyLength: number;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onLayoutChange: (layout: any[]) => void;
  onLayoutChangeComplete: (layout: any[]) => void;
  onSelectComponent: (componentId: string) => void;
  onOpenPropertyDrawer: (componentId: string) => void;
  onRemoveComponent: (componentId: string) => void;
  onClearCanvas: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onPreview: () => void;
}

const Canvas: React.FC<CanvasProps> = ({
  components,
  selectedComponent,
  gridConfig,
  historyIndex,
  historyLength,
  onDrop,
  onDragOver,
  onLayoutChange,
  onLayoutChangeComplete,
  onSelectComponent,
  onOpenPropertyDrawer,
  onRemoveComponent,
  onClearCanvas,
  onUndo,
  onRedo,
  onPreview,
}) => {
  return (
    <div className="drag-canvas-wrapper">
      <Card 
        title="画布" 
        className="drag-canvas-card"
        styles={{ body: { height: 'calc(100% - 57px)', overflow: 'auto' } }}
        extra={
          <Space>
            <Text type="secondary">组件数: {components.length}</Text>
            <Button 
              size="small"
              icon={<EyeOutlined />}
              onClick={onPreview}
              type="primary"
              title="预览页面"
            >
              预览
            </Button>
            <Button 
              size="small"
              icon={<span>↶</span>}
              onClick={onUndo}
              disabled={historyIndex <= 0}
              title="撤回 (Ctrl+Z)"
            >
              撤回
            </Button>
            <Button 
              size="small"
              icon={<span>↷</span>}
              onClick={onRedo}
              disabled={historyIndex >= historyLength - 1}
              title="恢复 (Ctrl+Y)"
            >
              恢复
            </Button>
            <Button 
              size="small" 
              danger 
              onClick={onClearCanvas}
            >
              清空画布
            </Button>
          </Space>
        }
      >
        <div className="drag-canvas-container">
          <div 
            className="drag-canvas"
            onDrop={onDrop}
            onDragOver={onDragOver}
            style={{ width: `${gridConfig.width}px` }}
          >
            {components.length === 0 ? (
              <div className="drag-empty-canvas">
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  从左侧拖拽组件到此处开始设计
                </Text>
              </div>
            ) : (
              <div style={{ paddingBottom: '400px' }}>
                <GridLayout
                  className="layout"
                  layout={components}
                  cols={gridConfig.cols}
                  rowHeight={gridConfig.rowHeight}
                  width={gridConfig.width}
                  autoSize={true}
                  onLayoutChange={onLayoutChange}
                  onDragStop={onLayoutChangeComplete}
                  onResizeStop={onLayoutChangeComplete}
                  draggableHandle=".drag-handle"
                >
                  {components.map(component => (
                    <div 
                      key={component.i}
                      className={`drag-grid-item ${
                        selectedComponent === component.i ? 'selected' : ''
                      }`}
                      onClick={() => onSelectComponent(component.i)}
                      onDoubleClick={() => onOpenPropertyDrawer(component.i)}
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
                            onRemoveComponent(component.i);
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
  );
};

export default Canvas;
