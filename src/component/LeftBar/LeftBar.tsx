/**
 * @todo created by Ghan 左侧功能栏组件
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Pagination } from 'antd';
import { Stores } from '../../store';
import { Dispatch } from 'redux';
import { mergeProps } from '../../common/config';
import styles from './styles.less';

export interface TextItem {
  key: string;
  title: string;
  value: string;
  style?: React.CSSProperties;
}

export interface FooterButton {
  values: string[];
  onClick: () => any;
  className?: string;
  style?: React.CSSProperties;
}

export interface HeadersData {
  data?: TextItem[][];
}

export interface ContentsData {
  title?: string;
  data?: any;
}

export interface FootersData {
  buttons: FooterButton[];
  detail?: TextItem[][];
  remarks?: string;
}

interface LeftBarProps {
  headers?: HeadersData;
  contents?: ContentsData;
  footers?: FootersData;
  renderHeader?: () => JSX.Element;
  renderContent?: () => JSX.Element;
  renderFooter?: () => JSX.Element;
}

/**
 * @param { headers: 渲染 header 需要的数据，和renderHeader 只存在一个 }
 * @param { renderHeader: 自定义渲染 header 和 headers 冲突 }
 *
 * @class LeftBar
 * @extends {Component<LeftBarProps, {}>}
 */
class LeftBar extends Component<LeftBarProps, {}> {

  render() {
    const {
      headers,
      contents,
      footers,
      renderHeader,
      renderContent,
      renderFooter,
    } = this.props;
    return (
      <div className={styles.container}>
      
        {
          renderHeader 
          ? renderHeader() 
          : (
            <div className={`${styles.box} ${styles.header}`}>
              {
                headers && headers.data ? (
                  headers.data.map((headerItem: TextItem[], index: number) => {
                    return (
                      <div className={styles.item} key={index}>
                        {
                          headerItem.map((item: TextItem) => {
                            return (
                              <div key={item.key} style={item.style || {}} >{`${item.title}  ${item.value}`}</div>
                            );
                          })
                        }
                      </div>
                    );
                  })
                ) : ''
              }
            </div>
          )
        }

        {
          renderContent
          ? renderContent()
          : (
            <div className={styles.box}>
              {contents && contents.title ? <div>{contents.title}</div> : ''}
              {
                contents && contents.data ? (
                  <div className={styles.dishes}>
                    <div className={styles.dish}>dish</div>
                  </div>
                ) : ''
              }
              <Pagination 
                total={10} 
                pageSize={7} 
                size="small"
                onChange={(...rest) => { console.log(rest); }}
              />
            </div>
          )
        }

        {
          renderFooter
          ? renderFooter()
          : (
            <div className={`${styles.footer}`}>
              <div className={`${styles.box} ${styles.remarks}`}>
                {footers && footers.remarks || ''}
              </div>
              <div className={`${styles.box}`} style={{margin: '0px'}}>
                {
                  footers && footers.detail && footers.detail.length > 0 ? (
                    footers.detail.map((detailTexts: TextItem[], index) => {
                      return (
                        <div className={styles.item} key={index}>
                          {
                            detailTexts.map((item: TextItem) => {
                              return (
                                <div key={item.key} style={item.style || {}} >{`${item.title}  ${item.value}`}</div>
                              );
                            })
                          }
                        </div>
                      );
                    })
                  ) : ''
                }
              </div>
            
              <div className={styles.footerBox}>
                {
                  footers && footers.buttons && footers.buttons.length > 0 ? (
                    footers.buttons.map((button: FooterButton, index: number) => {

                      return (
                        <div 
                          key={index}
                          className={`
                            ${styles.button}
                            ${button.className || ''}
                          `}
                          style={button.style || {}}
                          onClick={button.onClick}
                        >
                          {
                            button.values.map((value: string, j: number) => {
                              return (
                                <div 
                                  key={index + j}
                                >
                                  {value}
                                </div>
                              );
                            })
                          }
                        </div>
                      );
                    })
                  ) : ''
                }
              </div>
              
            </div>
          )
        }

      </div>
    );
  }
}

const mapStateToProps = (state: Stores) => ({
  
});

const mapDispatchToProps = (dispatch: Dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(LeftBar);
