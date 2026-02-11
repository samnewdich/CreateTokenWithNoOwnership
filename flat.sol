// SPDX-License-Identifier: MIT

// File contracts/USDT.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.20;

/*
    Simple BEP-20 Token
    - Total supply minted at deployment
    - All tokens sent to deployer wallet
*/

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract USDT is IERC20 {
    string public name = "USD Treasure";
    string public symbol = "USD.T";
    uint8 public decimals = 18;

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    constructor() {
        // 80,000,000,000,000,000,000,000,000,000 tokens
        //uint256 supply = 8000000000000000000000000000;
        uint256 supply = 8_000_000_000_000_000_000_000_000_000 * 1e18;

        _totalSupply = supply;
        _balances[msg.sender] = supply;

        emit Transfer(address(0), msg.sender, supply);
    }

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) external override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) external view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");

        _allowances[sender][msg.sender] = currentAllowance - amount;
        _transfer(sender, recipient, amount);
        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "ERC20: transfer from zero address");
        require(to != address(0), "ERC20: transfer to zero address");
        require(_balances[from] >= amount, "ERC20: insufficient balance");

        _balances[from] -= amount;
        _balances[to] += amount;

        emit Transfer(from, to, amount);
    }
}
