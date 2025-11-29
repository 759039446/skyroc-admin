import type { ComponentConfig } from './types';
import { ButtonComponent } from './Button';
import { InputComponent } from './Input';
import { CardComponent } from './Card';
import { TagComponent } from './Tag';
import { TextComponent } from './Text';
import { TitleComponent } from './Title';
import { DivComponent } from './Div';
import { ImageComponent } from './Image';

// 商城组件
import { TopNavBarComponent } from './shop/TopNavBar';
import { SearchBarComponent } from './shop/SearchBar';
import { ShoppingCartComponent } from './shop/ShoppingCart';
import { MallLogoComponent } from './shop/MallLogo';
import { MainNavMenuComponent } from './shop/MainNavMenu';
import { CarouselAdComponent } from './shop/CarouselAd';
import { EnterpriseRightsComponent } from './shop/EnterpriseRights';
import { PromotionInfoComponent } from './shop/PromotionInfo';
import { ProductRecommendComponent } from './shop/ProductRecommend';
import { FooterInfoComponent } from './shop/FooterInfo';
import { CertificationPartnerComponent } from './shop/CertificationPartner';

/**
 * 组件注册表
 * 所有可用组件的配置集合
 */
export const COMPONENT_REGISTRY: ComponentConfig[] = [
  // 基础组件
  ButtonComponent,
  InputComponent,
  CardComponent,
  TagComponent,
  TextComponent,
  TitleComponent,
  DivComponent,
  ImageComponent,
  
  // 商城组件
  TopNavBarComponent,
  SearchBarComponent,
  ShoppingCartComponent,
  MallLogoComponent,
  MainNavMenuComponent,
  CarouselAdComponent,
  EnterpriseRightsComponent,
  PromotionInfoComponent,
  ProductRecommendComponent,
  FooterInfoComponent,
  CertificationPartnerComponent,
];

/**
 * 根据类型获取组件配置
 * @param type 组件类型
 * @returns 组件配置对象
 */
export const getComponentConfig = (type: string): ComponentConfig | undefined => {
  return COMPONENT_REGISTRY.find(config => config.type === type);
};

// 导出类型
export type { ComponentConfig, CanvasComponent } from './types';
