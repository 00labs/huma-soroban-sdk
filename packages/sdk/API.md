## Functions

<dl>
<dt><a href="#getCreditLineClient">getCreditLineClient(poolName, network, wallet)</a> ⇒ <code>PoolCreditClient</code> | <code>undefined</code></dt>
<dd><p>Returns an soroban contract client instance for the credit line contract
associated with the given pool name on the current chain.</p></dd>
<dt><a href="#getAvailableBalanceForPool">getAvailableBalanceForPool(poolName, network, wallet)</a></dt>
<dd><p>Returns the current pool balance available for borrowing</p></dd>
<dt><a href="#getCreditRecordForPool">getCreditRecordForPool(poolName, network, wallet, borrower)</a></dt>
<dd><p>Returns the credit record of the borrower</p></dd>
<dt><a href="#getAvailableCreditForPool">getAvailableCreditForPool(borrower, poolName, network, wallet)</a></dt>
<dd><p>Returns the borrower's remaining credit they can use for borrowing. Note that this might not be
currently available for borrowing as the credit limit might exceed the available pool balance. Use
getPoolBalance() to get the current available pool balance.</p></dd>
<dt><a href="#getTotalDue">getTotalDue(poolName, network, wallet, borrower)</a> ⇒ <code>bigint</code> | <code>null</code></dt>
<dd><p>Returns borrower's total due amount in bigint format
associated with the given pool name on the current chain.</p></dd>
<dt><a href="#drawdown">drawdown(poolName, network, wallet, drawdownAmount)</a> ⇒ <code>Promise.&lt;SentTransaction&gt;</code></dt>
<dd><p>Draws down from a pool.</p></dd>
<dt><a href="#makePayment">makePayment(poolName, network, wallet, paymentAmount, principalOnly)</a> ⇒ <code>Promise.&lt;AssembledTransaction&gt;</code></dt>
<dd><p>Makes a payment.</p></dd>
</dl>

<a name="getCreditLineClient"></a>

## getCreditLineClient(poolName, network, wallet) ⇒ <code>PoolCreditClient</code> \| <code>undefined</code>
<p>Returns an soroban contract client instance for the credit line contract
associated with the given pool name on the current chain.</p>

**Kind**: global function  
**Returns**: <code>PoolCreditClient</code> \| <code>undefined</code> - <p>A contract client instance for the CreditLine contract or undefined if it could not be found.</p>  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>POOL\_NAME</code> | <p>The name of the credit pool to get the contract instance for.</p> |
| network | <code>StellarNetwork</code> | <p>The stellar network.</p> |
| wallet | <code>StellarWallet</code> | <p>The stellar wallet.</p> |

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

## getAvailableCreditForPool(borrower, poolName, network, wallet)
<p>Returns the borrower's remaining credit they can use for borrowing. Note that this might not be
currently available for borrowing as the credit limit might exceed the available pool balance. Use
getPoolBalance() to get the current available pool balance.</p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| borrower | <code>string</code> | <p>The address of the borrower to check the available credit for.</p> |
| poolName | <code>POOL\_NAME</code> | <p>The name of the credit pool to get the contract instance for.</p> |
| network | <code>StellarNetwork</code> | <p>The stellar network.</p> |
| wallet | <code>StellarWallet</code> | <p>The stellar wallet.</p> |

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

## makePayment(poolName, network, wallet, paymentAmount, principalOnly) ⇒ <code>Promise.&lt;AssembledTransaction&gt;</code>
<p>Makes a payment.</p>

**Kind**: global function  
**Returns**: <code>Promise.&lt;AssembledTransaction&gt;</code> - <ul>
<li>A Promise of the AssembledTransaction.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>POOL\_NAME</code> | <p>The name of the credit pool to get the contract instance for.</p> |
| network | <code>StellarNetwork</code> | <p>The stellar network.</p> |
| wallet | <code>StellarWallet</code> | <p>The stellar wallet.</p> |
| paymentAmount | <code>bigint</code> | <p>The amount to payback.</p> |
| principalOnly | <code>boolean</code> | <p>Whether this payment should ONLY apply to the principal</p> |
