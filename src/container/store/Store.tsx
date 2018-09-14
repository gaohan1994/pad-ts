import * as React from 'react';
import * as CSSModules from 'react-css-modules';
import { 
  ListView,
} from 'antd-mobile';

/**
 * react-redux
 */
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { mergeProps } from '../../common/config';
import { Stores } from '../../store';
import { GetMenu } from '../../store/menu';
import MenuController from '../../action/menu';

import styles from './index.less';

const MyBody = (props: any) => {
  return (
    <div
      style={{
      width: '100%',
      height: '100%',
      // marginBottom: '100px',
    }}
      className="am-list-body my-am-list-body"
    >
      {props.children}
    </div>
  );
};
interface StoreProps {
  menu: any;
  dispatch: Dispatch;
  match: { params: { id: string } };
  getAllSingleMenuNew: (mchnt_cd: string) => void;
}
interface StoreState {
  menuDataSource: any;
}
class Store extends React.Component<StoreProps, StoreState> {
  constructor (props: StoreProps) {
    super(props);
    this.state = {
      menuDataSource: new ListView.DataSource({
        rowHasChanged: (row1: any, row2: any) => row1 !== row2,
      })
    };
  }

  componentWillReceiveProps(nextProps: any) {
    const { menu } = nextProps;

    if (menu !== this.props.menu) {
      console.log('menu length', menu.length);
      this.setState({
        menuDataSource: this.state.menuDataSource.cloneWithRows(menu),
      }, () => {
        console.log(this.state);
      });
    }
  }

  /**
   * 请求扫描出来的餐厅的数据保存到redux中去
   * 在接下来会使用到数据的地方都从redux中取
   *
   * @memberof Welcome
   */
  componentDidMount() {
    const { match, getAllSingleMenuNew } = this.props;

    getAllSingleMenuNew(match.params.id);
  }

  public render() {

    return (
      <div className={`${styles.container} ${styles.store}`}>
        <ListView
          dataSource={this.state.menuDataSource}
          renderRow={this.renderRow}
          renderBodyComponent={() => <MyBody />}
          className="no-border-contaienr"
          pageSize={8}
          style={{
            height: `${document.documentElement.clientHeight}px`,
            overflow: 'auto',
          }}
          scrollRenderAheadDistance={10}
          onEndReached={() => { console.log('hello'); }}
        />
      </div>
    );
  }

  private renderRow = ( item: any ): React.ReactElement<any> => {
    return (
      <div 
        key={item.product_id}
        className={styles.item}
      >
        {item.product_name}
      </div>
    );
  }
}

const StoreHoc = CSSModules(Store, styles);

const mapStateToProps = (state: Stores) => ({
  menu: GetMenu(state),
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  dispatch,
  getAllSingleMenuNew: bindActionCreators(MenuController.getAllSingleMenuNew, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(StoreHoc);
