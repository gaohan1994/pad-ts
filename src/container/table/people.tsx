/**
 * @param { created by Ghan 9.20 }
 */
// import history from '../../history';
import * as React from 'react';
import { Grid } from 'antd-mobile';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import BusinessController, { BusinessActions } from '../../action/business';
import { mergeProps } from '../../common/config';
import { Stores } from '../../store';
import { GetSelectedTable } from '../../store/business';

interface PeopleProps {
  selectedTable: any;
  saveChoicePeople: (people: any) => void;
}

class People extends React.Component<PeopleProps, {}> {

  componentDidMount() {
    this.checkTableData();
  }

  public checkTableData = () => {
    const { selectedTable } = this.props;
    
    if (!selectedTable.table_no) {
      // history.push('/table');
    }
  }
  
  /**
   * @todo 点击回调
   *
   * @memberof Table
   */
  public onChoicePeople = (people: any) => {
    const { saveChoicePeople } = this.props;
    console.log('people: ', people);
    saveChoicePeople(people);
  }

  public render() {
    const { selectedTable } = this.props;
    const data: any[] = [];

    if (selectedTable.peopelNum) {
      for (let i = 1; i <= selectedTable.peopelNum; i++) {
        data.push({
          icon: '',
          text: i
        });
      }
    }

    return (
      <div>
        <Grid 
          data={data} 
          columnNum={4}
          onClick={(people) => this.onChoicePeople(people)}  
        />
      </div>
    );
  }
}

const mapStateToProps = (state: Stores) => ({
  selectedTable: GetSelectedTable(state),
});

const mapDispatchToProps = (dispatch: Dispatch<BusinessActions>) => ({
  saveChoicePeople: bindActionCreators(BusinessController.saveChoicePeople, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(People);
