import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Pagination } from 'antd';
import { Stores } from '../../store';
import { mergeProps } from '../../common/config';
import Helper from '../Helper/Helper_V1';
import styles from './styles.less';
import { GetSearchStatus } from '../../store/status';
import StatusContoller from '../../action/status';
import MenuController from '../../action/menu';
import { Dispatch, bindActionCreators } from 'redux';
import { GetAllDishes } from '../../store/menu';
import numeral from 'numeral';
import { STOREPAGESIZE } from '../../container/store/Store';

interface SearchDishHelperParams {
  value: string;
  dishes: any[];
}
/**
 * @param {SearchDish} 搜索菜品
 * @param {value} 要查询的字符串
 * @param {dishes} 要查询的菜品
 */
export const SearchDishHelper = (params: SearchDishHelperParams): any => {
  const { dishes } = params;
  if (params.value && dishes.length > 0) {
    let searchedDishes: any[] = [];
    /**
     * @param {value} 转大写的字符串
     * @param {1.按中文查询}
     * @param {2.按拼音查询}
     * @param {3.按首字母查询}
     */
    const value = params.value.toUpperCase();

    const reg = new RegExp(value);

    dishes.forEach((dish: any) => {
      const result = dish.product_name.match(reg) 
      || dish.product_name_spell.match(reg)
      || dish.product_name_frist_letter.match(reg);

      if (result) {
        searchedDishes.push(dish);
      }
    });

    return searchedDishes;
  } else {
    return [];
  }
};

interface SearchProps { 
  showSearch?: boolean;
  dispatch?: Dispatch;
  dishes?: any;
  searchMenus?: (params: any) => void;
}

interface SearchState { 
  value: string;
  searchedDishes: any[];
  currentPage: number;
}

/**
 * @todo 搜索页面
 * 
 * --- 根据 redux 控制是否显示，内置 Helper 点击即添加至 currentCart 购物车中 ---
 * 
 * 后期应该加入动画
 *
 * @class SearchDish
 * @extends {Component<SearchProps, SearchState>}
 */
class SearchDish extends Component<SearchProps, SearchState> {
  state = {
    value: '',
    searchedDishes: [],
    currentPage: 1,
  };
  /**
   * @todo 关闭search
   * @param {1.StatucContoller.hideSearch} 关闭页面
   * @param {2.onChangeHandle} 重置输入框
   *
   * @memberof SearchDish
   */
  public hideSaerch = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      StatusContoller.hideSearch(dispatch);
      this.onChangeHandle({ target: { value: '' } });
    }
  }

  /**
   * @输入框变化 handle 
   *
   * @memberof SearchDish
   */
  public onChangeHandle = ({ target: { value } }: any) => {
    this.setState({ value });
    const { dishes } = this.props;
    if (value !== '') {
      /**
       * @param {onChangePageHandle} 切回第一页
       * @param {SearchDishHelper} 搜索菜品
       */
      this.onChangePageHandle(1);
      const params: SearchDishHelperParams = { value, dishes };
      const searchedDishes = SearchDishHelper(params);
      this.setState({ searchedDishes });
    } else {
      this.onChangePageHandle(1);
      this.setState({ searchedDishes: [] });
    }
  }

  /**
   * @todo 修改当前页数
   *
   * @memberof Store
   */
  public onChangePageHandle = (page: number): void => {
    this.setState({ currentPage: page });
  }

  render() {
    const { value, searchedDishes, currentPage } = this.state;
    const { showSearch } = this.props;
    if (showSearch === true) {
      return (
        <div className={styles.searchContainer}>
          <div className={styles.searchClose} onClick={this.hideSaerch} />
          <div className={styles.searchInputBox}>
            <div className={styles.searchIcon}/>
            <input 
              className={styles.searchInput}
              placeholder="请输入菜品名称"
              value={value}
              onChange={this.onChangeHandle}
            />
          </div>

          <div className={styles.dishes} style={{paddingLeft: '0px'}}>
            {
              searchedDishes && searchedDishes.length > 0
                ? searchedDishes.slice((currentPage - 1) * STOREPAGESIZE, currentPage * STOREPAGESIZE).map((dish: any) => {
                  return (
                    <Helper key={dish.product_id} data={dish} >
                      <div 
                        className={numeral(dish.inventory).value() === 0
                          ? styles.emptyDish
                          : styles.dish}
                      >
                        {
                          numeral(dish.inventory).value() === 0
                          ? <div className={styles.mask} >
                              <div>已售罄</div>
                            </div>
                          : ''
                        }
                        <span>{dish.product_name}</span>
                        <span>￥{numeral(dish.price).format('0.00')}</span>
                      </div>
                    </Helper>
                  );
                })
                : ''
            }
            <div className={styles.pagination}>
              <Pagination
                current={currentPage}
                size="small" 
                total={searchedDishes.length}
                pageSize={STOREPAGESIZE}
                hideOnSinglePage={true}
                onChange={this.onChangePageHandle}
              />  
            </div>
          </div>
        </div>
      ); 
    } else {
      return '';
    }
  }
}

const mapStateToProps = (state: Stores) => ({
  showSearch: GetSearchStatus(state),
  dishes: GetAllDishes(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  searchMenus: bindActionCreators(MenuController.searchMenus, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SearchDish);
