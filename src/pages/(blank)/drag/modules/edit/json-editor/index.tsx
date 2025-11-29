import { useState, useEffect } from 'react';
import { Modal, Button, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import './styles.css';

interface JsonEditorProps {
  visible: boolean;
  value: any;
  onClose: () => void;
  onApply: (value: any) => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({
  visible,
  value,
  onClose,
  onApply,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (visible && value) {
      try {
        setJsonText(JSON.stringify(value, null, 2));
        setError('');
      } catch (err) {
        setError('无法序列化当前数据');
      }
    }
  }, [visible, value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(e.target.value);
    setError('');
  };

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onApply(parsed);
      message.success('JSON 已应用到画布');
      onClose();
    } catch (err) {
      setError(`JSON 格式错误: ${(err as Error).message}`);
      message.error('JSON 格式错误');
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setError('');
      message.success('JSON 已格式化');
    } catch (err) {
      setError(`JSON 格式错误: ${(err as Error).message}`);
      message.error('JSON 格式错误，无法格式化');
    }
  };

  return (
    <Modal
      title="JSON 编辑器"
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="format" onClick={handleFormat}>
          格式化
        </Button>,
        <Button key="cancel" icon={<CloseOutlined />} onClick={onClose}>
          取消
        </Button>,
        <Button
          key="apply"
          type="primary"
          icon={<CheckOutlined />}
          onClick={handleApply}
        >
          应用
        </Button>,
      ]}
    >
      <div className="drag-json-editor">
        <textarea
          className="drag-json-textarea"
          value={jsonText}
          onChange={handleTextChange}
          placeholder="请输入 JSON..."
          spellCheck={false}
        />
        {error && (
          <div className="drag-json-error">
            {error}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default JsonEditor;
