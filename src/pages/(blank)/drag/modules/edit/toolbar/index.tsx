import { useRef } from 'react';
import { Tooltip } from 'antd';
import { ImportOutlined, ExportOutlined, EditOutlined } from '@ant-design/icons';
import './styles.css';

interface FloatingToolbarProps {
  onImport: (file: File) => void;
  onExport: () => void;
  onEdit: () => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  onImport,
  onExport,
  onEdit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      // 清空 input 以便可以重复导入同一个文件
      e.target.value = '';
    }
  };

  return (
    <>
      <div className="drag-floating-toolbar">
        <div className="drag-toolbar-header">
          <span className="drag-toolbar-title">工具</span>
        </div>
        
        <div className="drag-toolbar-actions">
          <Tooltip title="导入 JSON" placement="left">
            <div className="drag-toolbar-action" onClick={handleImportClick}>
              <ImportOutlined />
            </div>
          </Tooltip>

          <Tooltip title="导出 JSON" placement="left">
            <div className="drag-toolbar-action" onClick={onExport}>
              <ExportOutlined />
            </div>
          </Tooltip>

          <Tooltip title="编辑 JSON" placement="left">
            <div className="drag-toolbar-action" onClick={onEdit}>
              <EditOutlined />
            </div>
          </Tooltip>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default FloatingToolbar;
