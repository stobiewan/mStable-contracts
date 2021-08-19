// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.8.6;
pragma abicoder v2;

import { StakedToken } from "./StakedToken.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title StakedTokenMTA
 * @dev Derives from StakedToken, and simply adds the functionality specific to the $MTA staking token,
 * for example compounding rewards.
 **/
contract StakedTokenMTA is StakedToken {
    using SafeERC20 for IERC20;

    /**
     * @param _signer Signer address is used to verify completion of quests off chain
     * @param _nexus System nexus
     * @param _rewardsToken Token that is being distributed as a reward. eg MTA
     * @param _stakedToken Core token that is staked and tracked (e.g. MTA)
     * @param _cooldownSeconds Seconds a user must wait after she initiates her cooldown before withdrawal is possible
     * @param _unstakeWindow Window in which it is possible to withdraw, following the cooldown period
     */
    constructor(
        address _signer,
        address _nexus,
        address _rewardsToken,
        address _stakedToken,
        uint256 _cooldownSeconds,
        uint256 _unstakeWindow
    ) StakedToken(_signer, _nexus, _rewardsToken, _stakedToken, _cooldownSeconds, _unstakeWindow) {}

    /**
     * @dev Allows a staker to compound their rewards IF the Staking token and the Rewards token are the same
     * for example, with $MTA as both staking token and rewards token. Calls 'claimRewards' on the HeadlessStakingRewards
     * before executing a stake here
     */
    function compoundRewards() external {
        require(address(STAKED_TOKEN) == address(REWARDS_TOKEN), "Only for same pairs");

        // 1. claim rewards
        uint256 balBefore = STAKED_TOKEN.balanceOf(address(this));
        _claimReward(address(this));

        // 2. check claim amount
        uint256 balAfter = STAKED_TOKEN.balanceOf(address(this));
        uint256 claimed = balAfter - balBefore;
        require(claimed > 0, "Must compound something");

        // 3. re-invest
        _settleStake(claimed, address(0), false);
    }
}
