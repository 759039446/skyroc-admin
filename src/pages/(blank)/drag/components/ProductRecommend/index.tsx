import { Form, Input, InputNumber } from 'antd';
import { StarFilled } from '@ant-design/icons';
import type { ComponentConfig } from '../types';

export const ProductRecommendComponent: ComponentConfig = {
  id: 'product-recommend',
  type: 'ProductRecommend',
  label: '商品推荐',
  icon: '🛍️',
  category: '商城组件',
  order: 9,
  defaultSize: {
    widthRatio: 1,
    heightRows: 25,
  },
  defaultWidth: '100%',
  defaultHeight: '100%',
  defaultProps: {
    title: '为你推荐',
    products: [
      { name: '五金工具套装', price: 299.00, originalPrice: 399.00, rating: 4.8, sales: 1000 },
      { name: '电动螺丝刀', price: 199.00, originalPrice: 259.00, rating: 4.9, sales: 2500 },
      { name: '焊接工具箱', price: 589.00, originalPrice: 789.00, rating: 4.7, sales: 800 },
      { name: '安全防护装备', price: 159.00, originalPrice: 199.00, rating: 4.6, sales: 1500 },
    ],
    columns: 4,
    priceColor: '#e1251b',
    backgroundColor: '#fff',
  },
  render: (props) => {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: props.backgroundColor,
        padding: '20px',
      }}>
        <h3 style={{
          margin: '0 0 20px 0',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333',
        }}>
          {props.title}
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
          gap: '20px',
        }}>
          {props.products && props.products.map((product: any, index: number) => (
            <div
              key={index}
              style={{
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* 商品图片占位 */}
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
              }}>
                📦
              </div>
              
              {/* 商品信息 */}
              <div style={{ padding: '15px' }}>
                <div style={{
                  fontSize: '14px',
                  color: '#333',
                  marginBottom: '10px',
                  height: '40px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {product.name}
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '10px',
                  marginBottom: '10px',
                }}>
                  <span style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: props.priceColor,
                  }}>
                    ¥{product.price.toFixed(2)}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: '#999',
                    textDecoration: 'line-through',
                  }}>
                    ¥{product.originalPrice.toFixed(2)}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: '#999',
                }}>
                  <span>
                    <StarFilled style={{ color: '#faad14', marginRight: '5px' }} />
                    {product.rating}
                  </span>
                  <span>{product.sales}人付款</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
  renderPropertyPanel: (props, form) => {
    return (
      <>
        <Form.Item label="标题" name="title">
          <Input placeholder="输入标题" />
        </Form.Item>
        <Form.Item label="列数" name="columns">
          <InputNumber min={2} max={6} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="商品配置" help="格式: 名称|价格|原价|评分|销量，每行一个">
          <Input.TextArea 
            rows={8}
            placeholder="例如：&#10;五金工具套装|299.00|399.00|4.8|1000&#10;电动螺丝刀|199.00|259.00|4.9|2500"
            onChange={(e) => {
              const lines = e.target.value.split('\n').filter(l => l.trim());
              const products = lines.map(line => {
                const [name, price, originalPrice, rating, sales] = line.split('|').map(s => s.trim());
                return {
                  name,
                  price: parseFloat(price) || 0,
                  originalPrice: parseFloat(originalPrice) || 0,
                  rating: parseFloat(rating) || 5.0,
                  sales: parseInt(sales) || 0,
                };
              });
              form.setFieldValue('products', products);
            }}
          />
        </Form.Item>
        <Form.Item label="价格颜色" name="priceColor">
          <Input type="color" />
        </Form.Item>
      </>
    );
  },
};
