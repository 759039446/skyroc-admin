import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, message } from 'antd';
import './styles.css';
import { getComponentConfig, type CanvasComponent } from './components';
import Preview from './modules/preview/preview';
import { ComponentLibrary, Canvas, PropertyPanel } from './modules/edit';
import FloatingToolbar from './modules/edit/toolbar';
import JsonEditor from './modules/edit/json-editor';

// 网格配置项
const GRID_CONFIG = {
  cols: 96,           // 网格列数
  rowHeight: 5,       // 每行高度（px）
  width: 1200,        // 画布宽度（px，可配置）
};

// 主组件
const Drag = () => {
  const { t } = useTranslation();
  const [canvasComponents, setCanvasComponents] = useState<CanvasComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [form] = Form.useForm();
  
  // 组件库可见性状态
  const [libraryVisible, setLibraryVisible] = useState(false);
  
  // 预览模式状态
  const [previewVisible, setPreviewVisible] = useState(false);
  
  // 属性配置抽屉状态
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  // JSON 编辑器状态
  const [jsonEditorVisible, setJsonEditorVisible] = useState(false);

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

  // 导入 JSON
  const handleImportJson = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (Array.isArray(json)) {
          setCanvasComponents(json);
          saveHistory(json);
          message.success(`成功导入 ${json.length} 个组件`);
        } else {
          message.error('JSON 格式错误：必须是组件数组');
        }
      } catch (err) {
        message.error('JSON 解析失败：' + (err as Error).message);
      }
    };
    reader.readAsText(file);
  }, [saveHistory]);

  // 导出 JSON
  const handleExportJson = useCallback(() => {
    try {
      const json = JSON.stringify(canvasComponents, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `canvas-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success('JSON 已导出');
    } catch (err) {
      message.error('导出失败：' + (err as Error).message);
    }
  }, [canvasComponents]);

  // 应用 JSON 编辑器的修改
  const handleApplyJson = useCallback((json: any) => {
    if (Array.isArray(json)) {
      setCanvasComponents(json);
      saveHistory(json);
    } else {
      message.error('JSON 格式错误：必须是组件数组');
    }
  }, [saveHistory]);

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

  return (
    <div className="drag-container">
      {/* 组件库抽屉 */}
      <ComponentLibrary
        visible={libraryVisible}
        onClose={() => setLibraryVisible(false)}
        onDragStart={handleDragStart}
      />

      {/* 中间画布区域 */}
      <Canvas
        components={canvasComponents}
        selectedComponent={selectedComponent}
        gridConfig={GRID_CONFIG}
        historyIndex={historyIndex}
        historyLength={history.length}
        libraryVisible={libraryVisible}
        drawerVisible={drawerVisible}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onLayoutChange={handleLayoutChange}
        onLayoutChangeComplete={handleLayoutChangeComplete}
        onSelectComponent={handleSelectComponent}
        onOpenPropertyDrawer={handleOpenPropertyDrawer}
        onRemoveComponent={handleRemoveComponent}
        onClearCanvas={handleClearCanvas}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onPreview={() => setPreviewVisible(true)}
        onToggleLibrary={() => setLibraryVisible(!libraryVisible)}
        onToggleDrawer={() => {
          if (!selectedComponent) return;
          const component = canvasComponents.find(c => c.i === selectedComponent);
          if (component) {
            form.setFieldsValue(component.props);
          }
          setDrawerVisible(!drawerVisible);
        }}
      />

      {/* 属性配置面板 */}
      <PropertyPanel
        visible={drawerVisible}
        component={currentComponent || null}
        form={form}
        onClose={() => setDrawerVisible(false)}
        onValuesChange={updateComponentProps}
      />
      
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

      {/* 浮动工具栏 */}
      <FloatingToolbar
        onImport={handleImportJson}
        onExport={handleExportJson}
        onEdit={() => setJsonEditorVisible(true)}
      />

      {/* JSON 编辑器 */}
      <JsonEditor
        visible={jsonEditorVisible}
        value={canvasComponents}
        onClose={() => setJsonEditorVisible(false)}
        onApply={handleApplyJson}
      />
    </div>
  );
};

export default Drag;
