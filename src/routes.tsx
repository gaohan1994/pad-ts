/**
 * created by Ghan 9.3
 * 
 * @todo 路由组件且成功配置过渡动画 
 */

import * as React from 'react';
import { /* Switch,  */ Route, Router } from 'react-router-dom';
import { /* AnimatedRoute, */ AnimatedSwitch } from 'react-router-transition';
import { connect } from 'react-redux';
import config from './common/config';
import DocumentTitle from 'react-document-title';
import history from './history';
import BasicLayout from './component/basicLayout';
import { Stores as ReducerStores } from './store/index';
import { getDocumentTitle } from './store/status';

/**
 * ------ routes ------
 */
import App from './container/App';
import Stores from './container/store/Stores';
import Store from './container/store/Store';
import Exception from './container/exception/Exception';
import NotFound from './container/exception/NotFound';
/**
 * @param title -- 网页 title
 *
 * @export
 * @interface DocumentTitleProps
 */
export interface DocumentTitleProps {
  title?: string;
}

/**
 * @todo 路由组件 加入路由过渡动画
 * 
 * 坑1.需要自己写 index.d.ts -- (已解决) react-router-transition.d.ts
 * 
 * 坑2.(已解决)
 * 如果没有设置 position: absolute 的时候
 * 在上一个组件没有完全隐去，下一个组件没有完全进入之前会同时显示两个组件 顺序排列
 * 设置了可能会造成布局问题
 * 
 * ------ 解决方案 ------
 * 在 AnimatedSwitch 提供的钩子函数中在ENTER LEAVE ACTIVE中设置不同的标记
 * 根据标记判断是否进入并且动态修改 position
 *
 * @class RouterConfig
 * @extends {React.StateLessComponent<DocumentTitleProps>}
 */

const RouterConfig = ({ title }: DocumentTitleProps) => {
  return (
    <DocumentTitle title={title || config.DEFAULT_DOCUMENT_TITLE}>
      <BasicLayout>
        <Router history={history}>
          <AnimatedSwitch
            atEnter={{ opacity: 0, foo: 0 }}
            atLeave={{ opacity: 0, foo: 2 }}
            atActive={{ opacity: 1, foo: 1 }}
            mapStyles={(styles) => {
              return {
                position: (styles.foo <= 1) ? 'relative' : 'absolute',
                width: '100%',
                height: '100%',
                opacity: styles.opacity
              };
            }}
          >
            <Route path="/" exact={true} component={App} />
            <Route path="/stores" component={Stores} />
            <Route path="/store/:id" component={Store} />
            <Route path="/exception/:status" component={Exception} />
            <Route component={NotFound}/>
          </AnimatedSwitch>
        </Router>
      </BasicLayout>
    </DocumentTitle>
  );
};

const mapStateToProps = (state: ReducerStores) => ({
  title: getDocumentTitle(state)
});

export default connect(mapStateToProps)(RouterConfig);