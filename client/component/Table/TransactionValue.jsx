import React from 'react';
import numeral from 'numeral';
import Icon from '../Icon';
import config from '../../../config'

/**
 * Adds ability to format a transaction value
 */
const TransactionValue = (tx, blockValue) => {
  const formattedBlockValue = (numeral(blockValue).format('0,0.0000'));

  const getTransactionTitle = (tx) => {
    let blockRewardTitle = 'Block Reward for POS & Masternode';

    // Check that tx has blockRewardDetails for backwards compatability
    if (tx.blockRewardDetails) {
      const inputAgeHours = (tx.blockRewardDetails.stake.input.age / 60 / 60).toFixed(2);
      const inputConfirmations = tx.blockRewardDetails.stake.input.confirmations;

      blockRewardTitle=`${blockRewardTitle} (Input: ${inputAgeHours} hours, ${inputConfirmations} confirmations)`
    }
    return blockRewardTitle;
  };

  if (tx.isReward) {
    return (
      <span title={getTransactionTitle(tx)}>
        {formattedBlockValue}
        <Icon name="gem" className="far pl-1 text-primary" />
      </span>
    );
  }

  return formattedBlockValue;
}

export default TransactionValue;