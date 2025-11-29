import { Card, Typography } from 'antd';
import { useState } from 'react';
import { 
  AppstoreOutlined, 
  LayoutOutlined, 
  PictureOutlined, 
  FileTextOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { COMPONENT_REGISTRY } from '../../../components';
import type { ComponentConfig } from '../../../components';
import './styles.css';

const { Text } = Typography;

interface ComponentLibraryProps {
  visible: boolean;
  onClose: () => void;
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

// 分类图标映射
const categoryIcons: Record<string, React.ReactNode> = {
  '基础组件': <AppstoreOutlined />,
  '容器组件': <LayoutOutlined />,
  '展示组件': <PictureOutlined />,
  '其他组件': <FileTextOutlined />,
  '商城组件': <ShoppingOutlined />,
};

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  visible,
  onClose,
  onDragStart,
}) => {
  const groupedComponents = getGroupedComponents();
  const categories = Object.keys(groupedComponents);
  
  // 当前选中的分类
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] || '');
  
  // 当前分类的组件
  const currentComponents = selectedCategory ? groupedComponents[selectedCategory] : [];

  return (
    <div className={`drag-component-library-panel ${visible ? 'visible' : ''}`}>
      <Card
        title="组件库"
        className="drag-component-library-card"
        styles={{
          body: {
            padding: 0,
            height: 'calc(100% - 57px)',
            display: 'flex',
          }
        }}
      >
        <div className="drag-library-container">
          {/* 左侧分类导航 */}
          <div className="drag-category-nav">
            {categories.map(category => (
              <div
                key={category}
                className={`drag-category-item ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
                title={category}
              >
                <span className="drag-category-icon">
                  {categoryIcons[category] || <AppstoreOutlined />}
                </span>
                <span className="drag-category-name">{category}</span>
              </div>
            ))}
          </div>
          
          {/* 右侧组件列表 */}
          <div className="drag-component-content">
            <div className="drag-component-group-items">
              {currentComponents.map(component => (
                <div
                  key={component.id}
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ComponentLibrary;
