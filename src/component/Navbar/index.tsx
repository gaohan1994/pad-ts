/**
 * 导航组件  created by Ghan 2018.6.22
 */
import React, { PureComponent } from 'react';
import * as CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { mergeProps } from '../../common/config';
import { Motion, StaggeredMotion, spring } from 'react-motion';
import {
  Flex,
} from 'antd-mobile';
import { range } from 'lodash';
import history from '../../history';
import styles from './index.css';
import { Stores } from '../../store';

const SPRING_CONFIG = { stiffness: 500, damping: 30 };

interface NavItem {
  id: string;
  img: string;
  title: string;
  onClick: () => void;
}

interface NavbarProps {
  dispatch?: Dispatch;
}

interface NavbarState {
  showModal: boolean;
}

class Navbar extends PureComponent<NavbarProps, NavbarState> {
  state = {
    showModal: false,
  };

  onShowModalHandle = () => {
    this.setState({
      showModal: true,
    });
  }

  onHideModalHandle = () => {
    this.setState({
      showModal: false,
    });
  }

  onNavHandle = (index: string) => {
    this.onHideModalHandle();
    history.push(`/${index}`);
  }

  /**
   * 根据屏幕大小返回Item大小 最大70px
   *
   * @memberof Navbar
   */
  getSize = () => {
    const windowHeight = window && window.innerHeight;
    let size;

    if (windowHeight) {
      if (windowHeight < 450) {
        size = 40;
      } else if (windowHeight < 550) {
        size = 50;
      } else if (windowHeight < 650) {
        size = 60;
      } else {
        size = 70;
      }
    } else {
      size = 70;
    }
    return size;
  }

  initialChildButtonStyles = () => {
    return {
      width: this.getSize(),
      height: this.getSize(),
      bottom: 0,
      rotate: -180,
      scale: 0.5,
    };
  }

  initialChildButtonStylesInit = () => {
    return {
      width: spring(0, SPRING_CONFIG),
      height: spring(0, SPRING_CONFIG),
      bottom: spring(0, SPRING_CONFIG),
      rotate: spring(-180, SPRING_CONFIG),
      scale: spring(0.5, SPRING_CONFIG),
    };
  }

  finalChildButtonStyles = (index: number) => {
    return {
      width: this.getSize(),
      height: this.getSize(),
      bottom: spring(index * (this.getSize() + 30), SPRING_CONFIG),
      rotate: spring(0, SPRING_CONFIG),
      scale: spring(1, SPRING_CONFIG),
    };
  }

  NavItem = (
    item: NavItem, 
    width?: number, 
    height?: number, 
    bottom?: number, 
    rotate?: number, 
    scale?: number,
  ) => {
    const { showModal } = this.state;
    return (
      <Flex
        key={item.id}
        direction="column"
        className={styles.item}
        style={{ bottom }}
      >
        <div
          className={styles.itemImg}
          style={{
            backgroundImage: `url(${item.img})`,
            height,
            width,
            transform: rotate ? `rotate(${rotate}deg) scale(${scale})` : '',
          }}
          onClick={item.onClick}
        />
        {item.title
        ? showModal === true
          ? <div className={styles.itemName}>{item.title}</div>
          : ''
        : ''}
      </Flex>
    );
  }

  renderChildButtons = () => {
    const { showModal } = this.state;

    let navItems: NavItem[] = [
      {
        id: '0',
        img: '//net.huanmusic.com/qg/x/icon_menu.png',
        title: '菜单',
        onClick: () => this.onNavHandle('stores'),
      },
      {
        id: '1',
        img: '//net.huanmusic.com/qg/icon_indent.png',
        title: '我的订单',
        onClick: () => this.onNavHandle('order/list'),
      },
      {
        id: '2',
        img: '//net.huanmusic.com/qg/icon_settle1.png',
        title: '结账',
        onClick: () => this.onNavHandle('store/123'),
      },
      {
        id: '3',
        img: '//net.huanmusic.com/qg/icon_cart.png',
        title: '购物车',
        onClick: () => this.onNavHandle('exception/123'),
      },
      {
        id: '4',
        img: '//net.huanmusic.com/qg/icon_return.png',
        title: '返回',
        onClick: this.onHideModalHandle,
      },
    ];

    navItems = navItems.reverse();

    const targetButtonStylesInitObject = range(navItems.length).map((i) => {
      return showModal ? this.finalChildButtonStyles(i) : this.initialChildButtonStyles();
    });

    const targetButtonStylesInit = Object.keys(
      targetButtonStylesInitObject).map(
      key => targetButtonStylesInitObject[key]
    );

    const calculateStylesFroNextFrame = (prevFrameStyles: any[]) => {
      const nextFrameStyles = prevFrameStyles.map((_: any, i: number) => {
        if (showModal === true) {
          return this.finalChildButtonStyles(i);
        } else {
          return this.initialChildButtonStylesInit();
        }
      });

      return nextFrameStyles;
    };

    return (
      <StaggeredMotion
        defaultStyles={targetButtonStylesInit}
        styles={calculateStylesFroNextFrame}
      >
        {
          (interpolatedStyles: any[]) => {
            return (
              <div className={styles.box}>
                {interpolatedStyles.map((style, index) => {
                  const { width, height, bottom, rotate, scale } = style;
                  return this.NavItem(navItems[index], width, height, bottom, rotate, scale);
                })}
              </div>
            );
          }
        }
      </StaggeredMotion>
    );
  }

  render() {
    const { showModal } = this.state;
    const nav = {
      id: 'nav',
      img: '//net.huanmusic.com/qg/icon_navigation1.png',
      title: '',
      onClick: this.onShowModalHandle,
    };

    const mainButtonDisplay =
      !showModal
        ? {
          width: spring(this.getSize(), SPRING_CONFIG),
          height: spring(this.getSize(), SPRING_CONFIG),
          bottom: 0,
        } : {
          width: spring(0, SPRING_CONFIG),
          height: spring(0, SPRING_CONFIG),
          bottom: 0,
        };

    return (
      <div className={styles.container}>
        <div
          className={styles.modal}
          style={{
            opacity: showModal === true ? 1 : 0,
            visibility: showModal === true ? 'visible' : 'hidden',
          }}
        />
        <div className={styles.childBox} >
          {this.renderChildButtons()}
        </div>

        <div className={styles.mainItem}>
          <Motion style={mainButtonDisplay} >
            {({ width, height, bottom }) => this.NavItem(nav, width, height, bottom)}
          </Motion>
        </div>
      </div>
    );
  }
}

const NavbarHoc = CSSModules(Navbar, styles);

const mapStateToProps = (state: Stores) => ({

});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(NavbarHoc);

// export default NavbarHoc;