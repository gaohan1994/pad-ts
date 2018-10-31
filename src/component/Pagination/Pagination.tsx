import React from 'react';
import { Pagination } from 'antd';

export function itemRender(page: any, type: any) {
  if (type === 'prev') {
    return (<a>上一页</a>);
  } 
  if (type === 'next') {
    return (<a>下一页</a>);
  }
  return;
}

interface MyPanigationProps { }

class MyPanigation extends React.Component<MyPanigationProps, {}> {

  itemRender = (page: any, type: any) => {
    if (type === 'prev') {
      return (<a>上一页</a>);
    } 
    if (type === 'next') {
      return (<a>下一页</a>);
    }
    return;
  }

  render () {
    return (
      <Pagination
        {...this.props}
        itemRender={this.itemRender}
      />
    );
  }
}

export default MyPanigation;