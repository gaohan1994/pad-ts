/**
 * @todo created by Ghan 左侧功能栏组件
 */
import React, { Component } from 'react';
import numeral from 'numeral';
import { merge } from 'lodash';
import { connect } from 'react-redux';
import { Pagination } from 'antd';
import { Stores } from '../../store';
import { Dispatch } from 'redux';
import { mergeProps } from '../../common/config';
import styles from './styles.less';

export const ListItem = (props: any) => {
  const { data, onClick } = props;
  if (data.attrType) {
    // 规格
    return data.number.map((attrItem: any, index: number) => {
      const { attrs } = attrItem;
      
      return (
        <div key={index} className={styles.listItem} onClick={onClick ? () => onClick({ data, currentAttr: attrItem }) : () => { console.log('noempty'); }}>
          <div className={styles.listBox}>
            {
              data.itemIcon ? (
                <span className={styles.itemIcon} style={{backgroundImage: `url(${data.itemIcon})`}} />
              ) : ''
            }
            <div className={styles.listItemTexts}>
              <div className={styles.mainText}>{data.product_name}</div>
              {
                attrs && attrs.length > 0 ? (
                  <div className={styles.subText}>
                  {
                    attrs.map((attr: any, attrIndex: number) => {
                      return `${attr.attrName} ${attrIndex === 0 ? '/' : ''}`;
                    })
                  }
                  </div>
                ) : ''
              }
            </div>
          </div>
          <div className={styles.listItemTexts}>
            <div className={styles.mainText}>{attrItem.number}</div>
            <div className={styles.subText}>{data.price}</div>
          </div>
        </div>
      );
    });
  } else if (numeral(data.is_weight).value() === 1) {
    // 称斤
    return (
      <div className={styles.listItem} onClick={onClick ? () => onClick({data}) : () => { console.log('noempty'); }}>
        <div>{data.product_name}</div>
      </div>
    );
  } else {
    // 默认
    return (
      <div className={styles.listItem} onClick={onClick ? () => onClick({data}) : () => { console.log('noempty'); }}>
        <div>{data.product_name}</div>
      </div>
    );
  }
};
export interface TextItem {
  key: string;
  title: string;
  value: string;
  style?: React.CSSProperties;
}

export interface ContentData {
  id?: string;
  itemIcon?: string;
  list: any[];
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
  data?: ContentData[];
  onClick?: (param?: any) => void;
}

export interface FootersData {
  buttons: FooterButton[];
  detail?: TextItem[][];
  remarks?: string;
}

export interface AnalysisContentsDataReturn {
  onClick?: (param: any) => void;
  list: any[];
}

/**
 * @todo 拆包 contents data
 * @return {AnalysisContentsDataReturn} 返回一个标准化的list
 */
export const analysisContentsData = (contents?: ContentsData): AnalysisContentsDataReturn => {
  if (contents) {
    const { data } = merge({}, contents, {});
  
    if (data && data.length > 0) {
      let total: any[] = [];
      
      data.forEach((contentData: ContentData) => {
        const { itemIcon, list } = contentData;
        if (itemIcon) {
          const addIconList: any[] = list.map((item: any) => {
            return {...item, itemIcon };
          });
          total = total.concat(addIconList);
        } else {  
          total = total.concat(list);
        }
      });
      
      return {
        onClick: contents.onClick,
        list: total
      };
    } else {
      return { list: [], onClick: contents.onClick, };
    }
  } else {
    return { list: [] };
  }
};

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

    const { list, onClick: onItemClick } = analysisContentsData(contents);
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
            <div 
              className={styles.box}
              style={{
                maxHeight: document && document.documentElement && document.documentElement.clientHeight
                  ? document && document.documentElement && document.documentElement.clientHeight - 180
                  : '',
                overflow: 'auto',
                paddingBottom: '40px',
              }}
            >
              {contents && contents.title ? <div>{contents.title}</div> : ''}
              {
                list ? (
                  list.map((listItem: any, index: number) => {
                    return (
                      <ListItem key={index} data={listItem} onClick={onItemClick ? onItemClick : () => { console.log('console'); }}/>
                    );
                  })
                ) : ''
              }
              <div className={styles.pagination}>
                <Pagination
                  style={{marginTop: '10px'}}
                  total={list.length || 0} 
                  pageSize={7} 
                  size="small"
                  onChange={(...rest) => { console.log(rest); }}
                />
              </div>
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
