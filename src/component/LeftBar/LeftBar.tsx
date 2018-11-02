/**
 * @todo created by Ghan 左侧功能栏组件
 */
import React, { Component } from 'react';
import { merge } from 'lodash';
import { connect } from 'react-redux';
import { Pagination } from 'antd';
import numeral from 'numeral';
import { Stores } from '../../store';
import { Dispatch } from 'redux';
import { mergeProps } from '../../common/config';
import styles from './styles.less';
import { GetCurrentDish } from '../../store/cart';

export const ListItem = (props: any) => {
  const { data, onClick, currentDish } = props;
  if (data.attrType) {
    // 规格
    return data.number.map((attrItem: any, index: number) => {
      const { attrs } = attrItem;
      return (
        <div 
          key={index} 
          className={currentDish && currentDish.currentAttr && currentDish.currentAttr.id === attrItem.id
            ? styles.activeListItem 
            : styles.listItem} 
          onClick={onClick 
            ? () => onClick({ data, currentAttr: attrItem }) 
            : () => { /** */ }}
        >
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
          <div className={`${styles.listItemTexts}`}>
            <div className={`${styles.mainText} ${styles.number}`}>
              {`
                x${numeral(data.is_weight).value() === 1 
                  ? numeral(attrItem.number).format('0.00') 
                  : numeral(attrItem.number).format('0')}
              `}
            </div>
            <div className={styles.subText}>{`￥${data.price}`}</div>
          </div>
        </div>
      );
    });
  } else {
    // 称斤 和 默认
    return (
      <div 
        className={currentDish && currentDish.product_id === data.product_id 
          ? styles.activeListItem 
          : styles.listItem} 
        onClick={onClick 
          ? () => onClick({data}) 
          : () => { /** */ }}
      >
        <div className={styles.listBox}>
          {
            data.itemIcon ? (
              <span className={styles.itemIcon} style={{backgroundImage: `url(${data.itemIcon})`}} />
            ) : ''
          }
          <div className={styles.listItemTexts}>
            <div className={styles.mainText}>{data.product_name}</div>
          </div>
        </div>
        <div className={`${styles.listItemTexts}`}>
          {
            typeof data.num === 'number' || typeof data.num === 'string' ? (
              <div className={`${styles.mainText} ${styles.number}`}>
                {`
                  x${numeral(data.is_weight).value() === 1 
                    ? numeral(data.num).format('0.00') 
                    : numeral(data.num).format('0')}
                `}
              </div>
            ) : (
              <div className={`${styles.mainText} ${styles.number}`}>
                {`
                  x${numeral(data.is_weight).value() === 1 
                    ? numeral(data.number).format('0.00') 
                    : numeral(data.number).format('0')}
                `}
              </div>)
          }
          <div className={styles.subText}>{`￥${data.price}`}</div>
        </div>
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
  onClick?: (param: any) => void;
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
}

export interface FootersData {
  buttons: FooterButton[];
  detail?: TextItem[][];
  remarks?: string;
}

export interface AnalysisContentsDataReturn {
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
        const { itemIcon = '', list, onClick = () => {/** no empty */} } = contentData;

        if (list && list.length > 0) {

          const addIconList: any[] = list.map((item: any) => {
            return {...item, itemIcon, onClick };
          });
          total = total.concat(addIconList);
        }
      });
      
      return { list: total };
    } else {
      return { list: [] };
    }
  } else {
    return { list: [] };
  }
};

interface LeftBarProps {
  currentDish?: any;
  headers?: HeadersData;
  contents?: ContentsData;
  footers?: FootersData;
  renderHeader?: () => JSX.Element;
  renderContent?: () => JSX.Element;
  renderFooter?: () => JSX.Element;
}

interface LeftBarState {
  currentPage: number;
}

const DEFAULT_LEFTBAR_PAGESIZE: number = 7;

/**
 * @param { headers: 渲染 header 需要的数据，和renderHeader 只存在一个 }
 * @param { renderHeader: 自定义渲染 header 和 headers 冲突 }
 *
 * @class LeftBar
 * @extends {Component<LeftBarProps, {}>}
 */
class LeftBar extends Component<LeftBarProps, LeftBarState> {
  state = {
    currentPage: 1
  };

  /**
   * @todo 分页handle 
   *
   * @memberof LeftBar
   */
  public onChangeCurrentPage = (page: number) => {
    this.setState({
      currentPage: page
    });
  }

  render() {
    const { currentPage } = this.state;
    const {
      currentDish,
      headers,
      contents,
      footers,
      renderHeader,
      renderContent,
      renderFooter,
    } = this.props;
    const { list } = analysisContentsData(contents);
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
                padding: '0 0 40px 0',
              }}
            >
              {contents && contents.title ? <div>{contents.title}</div> : ''}
              {
                list ? (
                  list.slice(
                    (currentPage - 1) * DEFAULT_LEFTBAR_PAGESIZE, currentPage * DEFAULT_LEFTBAR_PAGESIZE
                  ).map((listItem: any, index: number) => {
                    return (
                      <ListItem 
                        key={index} 
                        data={listItem} 
                        onClick={listItem.onClick}
                        currentDish={currentDish}
                      />
                    );
                  })
                ) : ''
              }
              <div className={styles.pagination}>
                <Pagination
                  current={currentPage}
                  style={{marginTop: '10px'}}
                  total={list.length || 0} 
                  pageSize={DEFAULT_LEFTBAR_PAGESIZE} 
                  size="small"
                  hideOnSinglePage={true}
                  onChange={this.onChangeCurrentPage}
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
              {
                footers && footers.remarks ? (
                  <div className={`${styles.box} ${styles.remarks}`}>
                    {footers.remarks}
                  </div>
                ) : ''
              }
              
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
  currentDish: GetCurrentDish(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(LeftBar);
