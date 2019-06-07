
import Component from '../../core/Component';
import { Link } from 'react-router-dom';
import moment from 'moment';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import React from 'react';

import Table from '../Table';
import config from '../../../config'

//@todo this is wrong name for this card, it should be CardVins
export default class CardTXIn extends Component {
  static defaultProps = {
    txs: [] //@todo should be vins
  };

  static propTypes = {
    txs: PropTypes.array.isRequired
  };

  getInputLabel(vin) {
    let inputLabel = 'Unknown';

    if (vin.relatedVout) {
      inputLabel = vin.relatedVout.address;
    } else if (vin.coinbase) {
      inputLabel = 'COINBASE';
    } else if (vin.scriptSig && vin.scriptSig.asm == 'OP_ZEROCOINSPEND') {
      inputLabel = 'ZEROCOIN';
    }

    return inputLabel;
  }

  constructor(props) {
    super(props);
    this.state = {
      cols: [
        { key: 'address', title: 'Address' },
        { key: 'value', title: 'Value' }
      ]
    };

    // If any inputs have a related vout add some extra columns. 
    // Ex: Coinbase transactions would not have relatedVout so we don't need to show a bunch of empty data
    if (this.props.txs.some(tx => tx.relatedVout)) {
      this.state.cols = [
        { key: 'address', title: 'Address' },
        { key: 'age', title: 'Age' },
        { key: 'confirmations', title: 'Confirmations' },
        { key: 'value', title: 'Value' }
      ]
    }
  };

  render() {
    return (
      <Table
        cols={ this.state.cols }
        data={ this.props.txs.map(tx => ({
          ...tx,
          address: tx.relatedVout
            ? (<Link to={ `/address/${ tx.relatedVout.address }` }>{ this.getInputLabel(tx) }</Link>)
            : this.getInputLabel(tx),
          age: tx.relatedVout
            ? (<Link to={ `/address/${ tx.relatedVout.address }` }>{ (tx.relatedVout.age / 60 / 60).toFixed(2) }h</Link>)
            : '',
          confirmations: tx.relatedVout
            ? (<Link to={ `/address/${ tx.relatedVout.address }` }>{ tx.relatedVout.confirmations }</Link>)
            : '',
          value: tx.relatedVout
            ? (
                <span className="badge badge-danger">
                -{numeral(tx.relatedVout.value).format(config.coinDetails.coinNumberFormat)} {config.coinDetails.shortName}
                </span>
              )
            : 'N/A'
        })) } />
    );
  };
}
