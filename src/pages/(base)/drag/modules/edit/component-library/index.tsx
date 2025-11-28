import { Card, Button, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { COMPONENT_REGISTRY } from '../../../components';
import type { ComponentConfig } from '../../../components';
import './styles.css';

const { Text } = Typography;

interface ComponentLibraryProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onDragStart: (e: React.DragEvent, componentType: string) => void;
}

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
  }, {} as Record<string, ComponentConfig[]>);

  // 对每个分组内的组件按 order 排序
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => a.order - b.order);
  });

  return grouped;
};

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  collapsed,
  onToggleCollapse,
  onDragStart,
}) => {
  const groupedComponents = getGroupedComponents();

  return (
    <div className={`drag-left-panel ${collapsed ? 'collapsed' : ''}`}>
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
            icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
            onClick={onToggleCollapse}
            title={collapsed ? '展开组件库' : '收起组件库'}
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
                    onDragStart={(e) => onDragStart(e, component.type)}
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
  );
};

export default ComponentLibrary;
