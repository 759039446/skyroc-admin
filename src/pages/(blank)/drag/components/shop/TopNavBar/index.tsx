import { Form, Input, Switch } from 'antd';
import type { ComponentConfig } from '../../types';

export const TopNavBarComponent: ComponentConfig = {
  id: 'top-nav-bar',
  type: 'TopNavBar',
  label: '顶部导航栏',
  icon: '🔝',
  category: '商城组件',
  order: 1,
  defaultSize: {
    widthRatio: 1,
    heightRows: 5,
  },
  defaultWidth: '100%',
  defaultHeight: '100%',
  defaultProps: {
    siteName: '京东首页',
    location: '福建',
    showLogin: true,
    showRegister: true,
    showMyOrders: true,
    showMyJD: true,
    showMember: true,
    showEnterprise: true,
    showService: true,
    showSiteNav: true,
    showMobileJD: true,
    showFavorite: true,
    backgroundColor: '#E3E4E5',
    textColor: '#666',
    linkColor: '#f10215',
  },
  render: (props, isDesignMode = false) => {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: props.backgroundColor,
        padding: '8px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: props.textColor,
        pointerEvents: isDesignMode ? 'none' : 'auto',
      }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span>{props.siteName}</span>
          <span style={{ marginLeft: '10px', color: props.linkColor }}>📍 {props.location}</span>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {props.showLogin && <span style={{ color: props.linkColor }}>你好，请登录</span>}
          {props.showRegister && <span style={{ color: props.linkColor }}>免费注册</span>}
          {props.showMyOrders && <span>我的订单</span>}
          {props.showMyJD && <span>我的京东</span>}
          {props.showMember && <span>京东会员</span>}
          {props.showEnterprise && <span>企业采购</span>}
          {props.showService && <span>客户服务</span>}
          {props.showSiteNav && <span>网站导航</span>}
          {props.showMobileJD && <span>手机京东</span>}
          {props.showFavorite && <span>收藏本站</span>}
        </div>
      </div>
    );
  },
  renderPropertyPanel: (props, form) => {
    return (
      <>
        <Form.Item label="网站名称" name="siteName">
          <Input placeholder="输入网站名称" />
        </Form.Item>
        <Form.Item label="地区" name="location">
          <Input placeholder="输入地区" />
        </Form.Item>
        <Form.Item label="显示登录" name="showLogin" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="显示注册" name="showRegister" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="显示我的订单" name="showMyOrders" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="显示我的京东" name="showMyJD" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="显示会员" name="showMember" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="显示企业采购" name="showEnterprise" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="背景颜色" name="backgroundColor">
          <Input type="color" />
        </Form.Item>
        <Form.Item label="文字颜色" name="textColor">
          <Input type="color" />
        </Form.Item>
        <Form.Item label="链接颜色" name="linkColor">
          <Input type="color" />
        </Form.Item>
      </>
    );
  },
};
