import { useState, useRef } from 'react';
import { Modal, Button, message } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined, CameraOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './preview.css';
import { getComponentConfig, type CanvasComponent } from '../../components';

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
  // 截图加载状态
  const [isCapturing, setIsCapturing] = useState(false);
  // 画布容器引用
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // 关闭预览时重置全屏状态
  const handleClose = () => {
    setIsFullscreen(false);
    onClose();
  };

  // 截图功能
  const handleCapture = async () => {
    if (!canvasRef.current) {
      message.error('未找到画布元素');
      return;
    }

    setIsCapturing(true);
    message.loading({ content: '正在生成截图...', key: 'capture', duration: 0 });

    try {
      const element = canvasRef.current;
      
      // 保存原始样式
      const originalOverflow = element.style.overflow;
      const parentElement = element.parentElement;
      const originalParentOverflow = parentElement?.style.overflow;
      
      // 临时移除 overflow 限制，确保所有内容可见
      element.style.overflow = 'visible';
      if (parentElement) {
        parentElement.style.overflow = 'visible';
      }
      
      // 等待样式应用
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 获取实际内容尺寸
      const actualWidth = Math.max(
        element.scrollWidth,
        element.offsetWidth,
        element.clientWidth
      );
      const actualHeight = Math.max(
        element.scrollHeight,
        element.offsetHeight,
        element.clientHeight
      );

      // 使用 html2canvas 将 DOM 转换为 canvas
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2, // 提高清晰度
        useCORS: true, // 允许跨域图片
        logging: false,
        width: actualWidth,
        height: actualHeight,
        windowWidth: actualWidth,
        windowHeight: actualHeight,
        x: 0,
        y: 0,
      });
      
      // 恢复原始样式
      element.style.overflow = originalOverflow;
      if (parentElement && originalParentOverflow !== undefined) {
        parentElement.style.overflow = originalParentOverflow;
      }

      // 将 canvas 转换为图片并下载
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const timestamp = new Date().getTime();
          link.download = `页面截图_${timestamp}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          
          message.success({ content: '截图已保存', key: 'capture' });
        } else {
          message.error({ content: '截图失败', key: 'capture' });
        }
      }, 'image/png');
    } catch (error) {
      console.error('截图失败:', error);
      message.error({ content: '截图失败，请重试', key: 'capture' });
    } finally {
      setIsCapturing(false);
    }
  };
  
  return (
    <Modal
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '40px' }}>
          <span>预览页面</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              type="text" 
              icon={<CameraOutlined />}
              onClick={handleCapture}
              loading={isCapturing}
              title="截图导出"
            >
              截图
            </Button>
            <Button 
              type="text" 
              icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? '退出全屏' : '全屏显示'}
            >
              {isFullscreen ? '退出全屏' : '全屏'}
            </Button>
          </div>
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
          ref={canvasRef}
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
