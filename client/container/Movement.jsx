
import Actions from '../core/Actions';
import Component from '../core/Component';
import throttle from '../../lib/throttle';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import CardTXs from '../component/Card/CardTXs';
import HorizontalRule from '../component/HorizontalRule';
import Pagination from '../component/Pagination';
import Select from '../component/Select';

import { PAGINATION_PAGE_SIZE } from '../constants';

class Movement extends Component {
  static propTypes = {
    getTXs: PropTypes.func.isRequired,
    setTXs: PropTypes.func.isRequired,
    tx: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loading: true,
      pages: 0,
      page: 1,
      size: 10,
      txs: []
    };

    //This is a new, better implementation of debouncing. The problem with old approach is that the initial request will be delayed by 800ms. 
    //First request should not be debounced, only actions after as majority of users will only view first page anyway, we need it to be as fast as possible;
    this.getThrottledTxs = throttle(() => {
      this.props
        .getTXs({
          limit: this.state.size,
          skip: (this.state.page - 1) * this.state.size
        })
        .then(({ pages, txs }) => {
          this.setState({ pages, txs, loading: false }, () => {
            this.props.setTXs(txs); // Add this set of new txs to store
          });
        })
        .catch(error => this.setState({ error, loading: false }));
    }, 800);
  };

  componentDidMount() {
    this.getTXs();
  };

  componentWillUnmount() {
    if (this.throttledTxs) {
      clearTimeout(this.getThrottledTxs);
    }
  };

  getTXs = () => {
    this.setState({ loading: true }, () => {
      this.getThrottledTxs();
    });
  };

  handlePage = page => this.setState({ page }, this.getTXs);

  handleSize = size => this.setState({ size, page: 1 }, this.getTXs);

  render() {
    if (!!this.state.error) {
      return this.renderError(this.state.error);
    } else if (this.state.loading) {
      return this.renderLoading();
    }
    const selectOptions = PAGINATION_PAGE_SIZE;

    const select = (
      <Select
        onChange={value => this.handleSize(value)}
        selectedValue={this.state.size}
        options={selectOptions} />
    );

    return (
      <div>
        <HorizontalRule
          select={select}
          title="Movement" />
        <CardTXs txs={this.state.txs} addBadgeClassToValue={false} />
        <Pagination
          current={this.state.page}
          className="float-right"
          onPage={this.handlePage}
          total={this.state.pages} />
        <div className="clearfix" />
      </div>
    );
  };
}

const mapDispatch = dispatch => ({
  getTXs: query => Actions.getTXs(null, query),
  setTXs: txs => Actions.setTXs(dispatch, txs)
});

const mapState = state => ({
  tx: state.txs.length ? state.txs[0] : {}
});

export default connect(mapState, mapDispatch)(Movement);
