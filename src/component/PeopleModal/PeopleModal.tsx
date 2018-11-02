import React, { Component } from 'react';
import { Modal } from 'antd';
import { connect, Dispatch } from 'react-redux';
import { Stores } from '../../store';
import { mergeProps } from '../../common/config';
import StatusController, { StatusAtions } from '../../action/status';
import { GetChangePeopleModalStatus } from '../../store/status';
import styles from './styles.less';
import { GetSelecetedTable } from '../../store/table';
import { bindActionCreators } from 'redux';
// import numeral from 'numeral';
import TableController from '../../action/table';
 
interface PeopleModalProps  {
  visible?: boolean;
  selectedTable?: any;
  dispatch?: Dispatch<StatusAtions>;
  changePeople?: (param: any) => void;
}
interface PeopleModalState {
  value: number;
}

class PeopleModal extends Component<PeopleModalProps, PeopleModalState> {
  state = {
    value: 1,
  };

  public onChangePeopleHandle = (value: number) => {
    this.setState({ value });
  }

  /**
   * @todo 关闭选择人数modal
   *
   * @memberof PeopleModal
   */
  public onCloseModal = () => {
    const { dispatch } = this.props;
    const params = { changePeopleModalStatus: true, dispatch };
    StatusController.changePeopleModalHandle(params);
  }

  public saveChoicePeople = (item: any) => {
    const { changePeople } = this.props;
    if (changePeople) {
      const params = { people: item.value };
      changePeople(params);
    }
  }

  render() {
    const { visible, selectedTable } = this.props;
    console.log('visible: ', visible);
    let data: any[] = [];

    if (selectedTable && typeof selectedTable.num === 'number') {
      data = new Array(selectedTable.num).fill({}).map((_, index: number) => {
        return {
          key: index + 1,
          value: index + 1,
        };
      });
    }

    if (visible === true) {
      return (
        <Modal
          title="请用餐人数"
          visible={visible}
          footer={null}
          onCancel={this.onCloseModal}
          centered={true}
          className="my-change-table-modal my-change-people-modal"
        >
          <div className={styles.people}>
            {
              data && data.map((item: any) => {
                return (
                  <div 
                    key={item.key} 
                    className={styles.number}
                    onClick={() => this.saveChoicePeople(item)}
                  >
                    {item.value}
                  </div>
                );
              })
            }
          </div>
        </Modal>
      );
    } else {
      return '';
    }
  }
}

const mapStateToProps = (state: Stores) => ({
  visible: GetChangePeopleModalStatus(state),
  selectedTable: GetSelecetedTable(state),
});

const mapDispatchToProps = (dispatch: Dispatch<StatusAtions>) => ({
  dispatch,
  changePeople: bindActionCreators(TableController.changePeople, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(PeopleModal);
