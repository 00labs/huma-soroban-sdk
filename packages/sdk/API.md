## Functions

<dl>
<dt><a href="#getAvailableBalanceForPool">getAvailableBalanceForPool(poolName, network, wallet)</a></dt>
<dd><p>Returns the current pool balance available for borrowing</p></dd>
<dt><a href="#getCreditRecordForPool">getCreditRecordForPool(poolName, network, wallet, borrower)</a></dt>
<dd><p>Returns the credit record of the borrower</p></dd>
<dt><a href="#getAvailableCreditForPool">getAvailableCreditForPool(poolName, network, wallet, borrower)</a></dt>
<dd><p>Returns the borrower's remaining credit they can use for borrowing. Note that this might not be
currently available for borrowing as the credit limit might exceed the available pool balance. Use
getPoolBalance() to get the current available pool balance.</p></dd>
<dt><a href="#getTotalDue">getTotalDue(poolName, network, wallet, borrower)</a> ⇒ <code>bigint</code> | <code>null</code></dt>
<dd><p>Returns borrower's total due amount in bigint format
associated with the given pool name on the current chain.</p></dd>
<dt><a href="#approveAllowanceForSentinel">approveAllowanceForSentinel(poolName, network, wallet)</a></dt>
<dd><p>Approve allowance for sentinel if not enough allowance is approved.</p></dd>
<dt><a href="#drawdown">drawdown(poolName, network, wallet, drawdownAmount)</a> ⇒ <code>Promise.&lt;SentTransaction&gt;</code></dt>
<dd><p>Draws down from a pool.</p></dd>
<dt><a href="#makePayment">makePayment(poolName, network, wallet, paymentAmount, principalOnly)</a> ⇒ <code>Promise.&lt;SentTransaction&gt;</code></dt>
<dd><p>Makes a payment.</p></dd>
<dt><a href="#approveSep41Allowance">approveSep41Allowance(poolName, network, wallet, spenderAddress)</a></dt>
<dd><p>Approves an Sep41 allowance for a spender address.
Allowance is required to do certain actions on the Huma protocol (e.g. makePayment for Autopay)</p></dd>
<dt><a href="#getYieldToWithdraw">getYieldToWithdraw(poolName, network, wallet)</a> ⇒ <code>Promise.&lt;SentTransaction&gt;</code></dt>
<dd><p>Get yield available to withdraw from the pool for a lender account</p></dd>
<dt><a href="#withdrawYields">withdrawYields(poolName, network, wallet)</a> ⇒ <code>Promise.&lt;SentTransaction&gt;</code></dt>
<dd><p>Withdraw yield from the pool for a lender account</p></dd>
</dl>

<a name="getAvailableBalanceForPool"></a>

## getAvailableBalanceForPool(poolName, network, wallet)
<p>Returns the current pool balance available for borrowing</p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>POOL\_NAME</code> | <p>The name of the credit pool to get the contract instance for.</p> |
| network | <code>StellarNetwork</code> | <p>The stellar network.</p> |
| wallet | <code>StellarWallet</code> | <p>The stellar wallet.</p> |

<a name="getCreditRecordForPool"></a>

## getCreditRecordForPool(poolName, network, wallet, borrower)
<p>Returns the credit record of the borrower</p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>POOL\_NAME</code> | <p>The name of the credit pool to get the contract instance for.</p> |
| network | <code>StellarNetwork</code> | <p>The stellar network.</p> |
| wallet | <code>StellarWallet</code> | <p>The stellar wallet.</p> |
| borrower | <code>string</code> | <p>The address of the borrower to check the credit record for.</p> |

<a name="getAvailableCreditForPool"></a>

## getAvailableCreditForPool(poolName, network, wallet, borrower)
<p>Returns the borrower's remaining credit they can use for borrowing. Note that this might not be
currently available for borrowing as the credit limit might exceed the available pool balance. Use
getPoolBalance() to get the current available pool balance.</p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>POOL\_NAME</code> | <p>The name of the credit pool to get the contract instance for.</p> |
| network | <code>StellarNetwork</code> | <p>The stellar network.</p> |
| wallet | <code>StellarWallet</code> | <p>The stellar wallet.</p> |
| borrower | <code>string</code> | <p>The address of the borrower to check the available credit for.</p> |

<a name="getTotalDue"></a>

## getTotalDue(poolName, network, wallet, borrower) ⇒ <code>bigint</code> \| <code>null</code>
<p>Returns borrower's total due amount in bigint format
associated with the given pool name on the current chain.</p>

**Kind**: global function  
**Returns**: <code>bigint</code> \| <code>null</code> - <p>The account's total due amount in bigint format</p>  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>POOL\_NAME</code> | <p>The name of the credit pool to get the contract instance for.</p> |
| network | <code>StellarNetwork</code> | <p>The stellar network.</p> |
| wallet | <code>StellarWallet</code> | <p>The stellar wallet.</p> |
| borrower | <code>string</code> | <p>The address of the borrower to check the available credit for.</p> |

<a name="approveAllowanceForSentinel"></a>

## approveAllowanceForSentinel(poolName, network, wallet)
<p>Approve allowance for sentinel if not enough allowance is approved.</p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>POOL\_NAME</code> | <p>The name of the credit pool to get the contract instance for.</p> |
| network | <code>StellarNetwork</code> | <p>The stellar network.</p> |
| wallet | <code>StellarWallet</code> | <p>The stellar wallet.</p> |

<a name="drawdown"></a>

## drawdown(poolName, network, wallet, drawdownAmount) ⇒ <code>Promise.&lt;SentTransaction&gt;</code>
<p>Draws down from a pool.</p>

**Kind**: global function  
**Returns**: <code>Promise.&lt;SentTransaction&gt;</code> - <ul>
<li>A Promise of the SentTransaction.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>POOL\_NAME</code> | <p>The name of the credit pool to get the contract instance for.</p> |
| network | <code>StellarNetwork</code> | <p>The stellar network.</p> |
| wallet | <code>StellarWallet</code> | <p>The stellar wallet.</p> |
| drawdownAmount | <code>BigNumberish</code> | <p>The amount to drawdown.</p> |

<a name="makePayment"></a>

## makePayment(poolName, network, wallet, paymentAmount, principalOnly) ⇒ <code>Promise.&lt;SentTransaction&gt;</code>
<p>Makes a payment.</p>

**Kind**: global function  
**Returns**: <code>Promise.&lt;SentTransaction&gt;</code> - <ul>
<li>A Promise of the SentTransaction.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>POOL\_NAME</code> | <p>The name of the credit pool to get the contract instance for.</p> |
| network | <code>StellarNetwork</code> | <p>The stellar network.</p> |
| wallet | <code>StellarWallet</code> | <p>The stellar wallet.</p> |
| paymentAmount | <code>bigint</code> | <p>The amount to payback.</p> |
| principalOnly | <code>boolean</code> | <p>Whether this payment should ONLY apply to the principal</p> |

<a name="approveSep41Allowance"></a>

## approveSep41Allowance(poolName, network, wallet, spenderAddress)
<p>Approves an Sep41 allowance for a spender address.
Allowance is required to do certain actions on the Huma protocol (e.g. makePayment for Autopay)</p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>POOL\_NAME</code> | <p>The name of the credit pool to get the contract instance for.</p> |
| network | <code>StellarNetwork</code> | <p>The stellar network.</p> |
| wallet | <code>StellarWallet</code> | <p>The wallet used to send the transaction.</p> |
| spenderAddress | <code>string</code> | <p>The address of the spender to approve an allowance for.</p> |

<a name="getYieldToWithdraw"></a>

## getYieldToWithdraw(poolName, network, wallet) ⇒ <code>Promise.&lt;SentTransaction&gt;</code>
<p>Get yield available to withdraw from the pool for a lender account</p>

**Kind**: global function  
**Returns**: <code>Promise.&lt;SentTransaction&gt;</code> - <ul>
<li>A Promise of the SentTransaction.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>POOL\_NAME</code> | <p>The name of the credit pool to get the contract instance for.</p> |
| network | <code>StellarNetwork</code> | <p>The stellar network.</p> |
| wallet | <code>StellarWallet</code> | <p>The stellar wallet.</p> |

<a name="withdrawYields"></a>

## withdrawYields(poolName, network, wallet) ⇒ <code>Promise.&lt;SentTransaction&gt;</code>
<p>Withdraw yield from the pool for a lender account</p>

**Kind**: global function  
**Returns**: <code>Promise.&lt;SentTransaction&gt;</code> - <ul>
<li>A Promise of the SentTransaction.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>POOL\_NAME</code> | <p>The name of the credit pool to get the contract instance for.</p> |
| network | <code>StellarNetwork</code> | <p>The stellar network.</p> |
| wallet | <code>StellarWallet</code> | <p>The stellar wallet.</p> |

