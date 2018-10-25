/**
 * @todo 双飞翼布局 created by Ghan 2018.10.18
 * 
 * @param { Layout: 外层div }
 * 
 * @param { Item: 三栏布局 }
 * tips: Item main 必须放在第一个（首先加载 main中的数据）
 * 
 * @param { ItemBar: 操作栏 }
 * tips: render ItemBar 之后请手动给main marginLeft += 90
 */
import React, { Component } from 'react';
import styles from './index.less';

export interface SmallCardProps { 
  img?: string;
  value?: string;
  onClick?: (param?: any) => any;
  className?: string;
  render?: () => JSX.Element;
} 

export class SmallCard extends Component <SmallCardProps, {}> {
  render () {
    const { 
      className,
      img,
      value,
      onClick,
      render,
    } = this.props;

    if (render) {
      return (
        render()
      );
    } else {
      return (
        <div
          className={`
            ${styles.smallCard}
            ${className || ''}
          `}
          onClick={onClick}
        >
          <span style={{backgroundImage: `url(${img})`}} />
          <div>{value}</div>
        </div>
      );
    }
  }
}

export interface ItemBarProps { }

class ItemBar extends Component <ItemBarProps, {}> {
  static SmallCard = SmallCard;

  render () {
    return (
      <div className={styles.bar}>
        {this.props.children}
      </div>
    );
  }
}

export interface ItemProps {
  style?: React.CSSProperties;
  className?: string;
  position?: 'left' | 'main' | 'right';
}

class Item extends Component<ItemProps, {}> {
  static ItemBar = ItemBar;

  render () {
    const {
      style,
      className,
      position = 'main',
    } = this.props;

    if (position === 'main') {

      return (
        <div className={styles.main}>
          <div 
            className={`
              ${styles.content}
              ${className || ''}
            `}
            style={style || {}}
          >
            {this.props.children}
          </div>
        </div>
      );
    } else {

      return (
        <div
          className={`
            ${styles[position]}
            ${className || ''}
          `}
          style={style || {}}
        >
          {this.props.children}
        </div>
      );
    }
  }
}

class Layout extends Component<{}, {}> {
  static Item = Item;
  
  render() {
    return (
      <div className={styles.ct}>
        {/* <div>main</div> */}
        {this.props.children}
      </div>
    );
  }
}

export default Layout;