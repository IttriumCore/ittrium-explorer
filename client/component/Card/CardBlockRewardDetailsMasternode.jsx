import Component from '../../core/Component';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import config from '../../../config'

export default class CardBlockRewardDetailsMasternode extends Component {
  static propTypes = {
    tx: PropTypes.object.isRequired
  };

  render() {
    // Ensure this reward transaction has new blockRewardDetails data (for backwards compatability)
    if (this.props.tx.isReward && !this.props.tx.blockRewardDetails) {
      return null;
    }

    const blockRewardDetails = this.props.tx.blockRewardDetails;

    return (
      <div className="animated fadeIn">
        <div className="card--block">
          <div className="card__row">
            <span className="card__label">Masternode Address:</span>
            <span className="card__result"><Link to={`/address/${blockRewardDetails.masternode.address}`}>{blockRewardDetails.masternode.address}</Link></span>
          </div>
          <div className="card__row">
            <span className="card__label">Masternode Reward:</span>
            <span className="card__result">{numeral(blockRewardDetails.masternode.reward).format(config.coinDetails.coinNumberFormat)} {config.coinDetails.shortName}</span>
          </div>
        </div>
      </div>
    );
  };
}