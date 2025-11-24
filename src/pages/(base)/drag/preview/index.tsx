import { useState } from 'react';
import { Modal, Button } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './preview.css';
import { getComponentConfig, type CanvasComponent } from '../components';

interface PreviewProps {
  open: boolean;
  onClose: () => void;
  components: CanvasComponent[];
  canvasWidth: number;
  gridConfig: {
    cols: number;
    rowHeight: number;
  };
}

/**
 * 预览组件 - 以只读模式显示画布内容
 */
const Preview = ({ open, onClose, components, canvasWidth, gridConfig }: PreviewProps) => {
  // 全屏状态
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // 关闭预览时重置全屏状态
  const handleClose = () => {
    setIsFullscreen(false);
    onClose();
  };
  
  return (
    <Modal
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '40px' }}>
          <span>预览页面</span>
          <Button 
            type="text" 
            icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? '退出全屏' : '全屏显示'}
          >
            {isFullscreen ? '退出全屏' : '全屏'}
          </Button>
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={isFullscreen ? '100%' : '90%'}
      centered={!isFullscreen}
      style={isFullscreen ? {
        top: 0,
        paddingBottom: 0,
        maxWidth: '100%',
      } : undefined}
      styles={{
        body: {
          padding: 0,
          maxHeight: isFullscreen ? 'calc(100vh - 110px)' : 'calc(100vh - 200px)',
          overflow: 'auto',
        },
      }}
      className={isFullscreen ? 'preview-modal-fullscreen' : ''}
    >
      <div className="preview-container">
        <div 
          className="preview-canvas"
          style={{ width: `${canvasWidth}px` }}
        >
          {components.length === 0 ? (
            <div className="preview-empty">
              <span>暂无内容</span>
            </div>
          ) : (
            <div style={{ paddingBottom: isFullscreen ? '50px' : '20px' }}>
              <GridLayout
                className="preview-layout"
                layout={components}
                cols={gridConfig.cols}
                rowHeight={gridConfig.rowHeight}
                width={canvasWidth}
                autoSize={true}
                isDraggable={false}
                isResizable={false}
                compactType={null}
              >
                {components.map(component => (
                  <div 
                    key={component.i}
                    className="preview-grid-item"
                  >
                    {/* 渲染组件内容 */}
                    <div className="preview-item-content">
                      {getComponentConfig(component.type)?.render(component.props)}
                    </div>
                  </div>
                ))}
              </GridLayout>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default Preview;
