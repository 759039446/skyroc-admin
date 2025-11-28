import { Drawer, Form, Typography, Divider } from 'antd';
import type { FormInstance } from 'antd';
import { getComponentConfig, type CanvasComponent } from '../../../components';
import './styles.css';

const { Text } = Typography;

interface PropertyPanelProps {
  visible: boolean;
  component: CanvasComponent | null;
  form: FormInstance;
  onClose: () => void;
  onValuesChange: (componentId: string, values: Record<string, any>) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  visible,
  component,
  form,
  onClose,
  onValuesChange,
}) => {
  if (!component) return null;

  const { type, props, i } = component;
  const componentConfig = getComponentConfig(type);

  const renderContent = () => {
    if (!componentConfig) {
      return <Text type="secondary">未知组件类型</Text>;
    }

    return (
      <Form
        form={form}
        layout="vertical"
        onValuesChange={(_, allValues) => {
          onValuesChange(i, allValues);
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
    <Drawer
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>属性配置</span>
          {component && componentConfig && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {componentConfig.label}
            </Text>
          )}
        </div>
      }
      placement="right"
      width={400}
      open={visible && !!component}
      onClose={onClose}
      styles={{
        body: {
          padding: '16px',
        },
      }}
    >
      {renderContent()}
    </Drawer>
  );
};

export default PropertyPanel;
