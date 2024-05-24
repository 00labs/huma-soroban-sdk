## Classes

<dl>
<dt><a href="#Client">Client</a></dt>
<dd><p>The protocol fee has been changed.</p>
<h1>Fields</h1>
<ul>
<li><code>old_fee_bps</code> - The old protocol fee in bps.</li>
<li><code>new_fee_bps</code> - The new protocol fee in bps.</li>
</ul></dd>
<dt><a href="#Client">Client</a></dt>
<dd><p>The minimum and maximum amount that can be deposited into a tranche.</p></dd>
<dt><a href="#Client">Client</a></dt>
<dd><p>The minimum and maximum amount that can be deposited into a tranche.</p></dd>
<dt><a href="#Client">Client</a></dt>
<dd><p>The minimum and maximum amount that can be deposited into a tranche.</p></dd>
<dt><a href="#Client">Client</a></dt>
<dd><p>The minimum and maximum amount that can be deposited into a tranche.</p></dd>
</dl>

## Constants

<dl>
<dt><a href="#Errors">Errors</a></dt>
<dd><p>The senior yield tracker has been refreshed.</p>
<h1>Fields:</h1>
<ul>
<li><code>total_assets</code> - The total assets in the senior tranche after the refresh.</li>
<li><code>unpaid_yield</code> - The amount of unpaid yield to the senior tranche after the refresh.</li>
<li><code>last_updated_date</code> - The last time the tracker was updated after the refresh.</li>
</ul></dd>
<dt><a href="#Errors">Errors</a></dt>
<dd><p><code>CreditConfig</code> keeps track of the static settings of a credit.
A <code>CreditConfig</code> is created after the approval of each credit.</p>
<h1>Fields:</h1>
<ul>
<li><code>credit_limit</code> - The maximum amount that can be borrowed.</li>
<li><code>committed_amount</code> - The amount that the borrower has committed to use. If the used credit
is less than this amount, the borrower will be charged yield using this amount.</li>
<li><code>pay_period_duration</code> - The duration of each pay period, e.g., monthly, quarterly, or semi-annually.</li>
<li><code>num_of_periods</code> - The number of periods before the credit expires.</li>
<li><code>yield_bps</code> - The expected yield expressed in basis points, where 1% is 100, and 100% is 10,000. It means different things
for different credit types:</li>
</ul>
<ol>
<li>For credit line, it is APR.</li>
<li>For factoring, it is factoring fee for the given period.</li>
<li>For dynamic yield credit, it is the estimated APY.</li>
</ol>
<ul>
<li><code>revolving</code> - A flag indicating if repeated borrowing is allowed.</li>
</ul></dd>
<dt><a href="#Errors">Errors</a></dt>
<dd><p>Event indicating that the pool has been closed.</p>
<h1>Fields:</h1>
<ul>
<li><code>by</code> - The address that closed the pool.</li>
</ul></dd>
<dt><a href="#Errors">Errors</a></dt>
<dd><p>The yield reinvestment setting has been updated.</p>
<h1>Fields:</h1>
<ul>
<li><code>account</code> - The account whose setting has been updated.</li>
<li><code>reinvest_yield</code> - A flag indicating whether the lender is reinvesting or not.</li>
</ul></dd>
</dl>

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
<dt><a href="#drawdown">drawdown(poolName, network, wallet, drawdownAmount)</a> ⇒ <code>Promise.&lt;AssembledTransaction&gt;</code></dt>
<dd><p>Draws down from a pool.</p></dd>
<dt><a href="#makePaymentWithReceivable">makePaymentWithReceivable(poolName, network, wallet, paymentAmount, principalOnly)</a> ⇒ <code>Promise.&lt;AssembledTransaction&gt;</code></dt>
<dd><p>Makes a payment.</p></dd>
</dl>

<a name="Client"></a>

## Client
<p>The protocol fee has been changed.</p>
<h1>Fields</h1>
<ul>
<li><code>old_fee_bps</code> - The old protocol fee in bps.</li>
<li><code>new_fee_bps</code> - The new protocol fee in bps.</li>
</ul>

**Kind**: global class  
<a name="Client"></a>

## Client
<p>The minimum and maximum amount that can be deposited into a tranche.</p>

**Kind**: global class  
<a name="Client"></a>

## Client
<p>The minimum and maximum amount that can be deposited into a tranche.</p>

**Kind**: global class  
<a name="Client"></a>

## Client
<p>The minimum and maximum amount that can be deposited into a tranche.</p>

**Kind**: global class  
<a name="Client"></a>

## Client
<p>The minimum and maximum amount that can be deposited into a tranche.</p>

**Kind**: global class  
<a name="Errors"></a>

## Errors
<p>The senior yield tracker has been refreshed.</p>
<h1>Fields:</h1>
<ul>
<li><code>total_assets</code> - The total assets in the senior tranche after the refresh.</li>
<li><code>unpaid_yield</code> - The amount of unpaid yield to the senior tranche after the refresh.</li>
<li><code>last_updated_date</code> - The last time the tracker was updated after the refresh.</li>
</ul>

**Kind**: global constant  
<a name="Errors"></a>

## Errors
<p><code>CreditConfig</code> keeps track of the static settings of a credit.
A <code>CreditConfig</code> is created after the approval of each credit.</p>
<h1>Fields:</h1>
<ul>
<li><code>credit_limit</code> - The maximum amount that can be borrowed.</li>
<li><code>committed_amount</code> - The amount that the borrower has committed to use. If the used credit
is less than this amount, the borrower will be charged yield using this amount.</li>
<li><code>pay_period_duration</code> - The duration of each pay period, e.g., monthly, quarterly, or semi-annually.</li>
<li><code>num_of_periods</code> - The number of periods before the credit expires.</li>
<li><code>yield_bps</code> - The expected yield expressed in basis points, where 1% is 100, and 100% is 10,000. It means different things
for different credit types:</li>
</ul>
<ol>
<li>For credit line, it is APR.</li>
<li>For factoring, it is factoring fee for the given period.</li>
<li>For dynamic yield credit, it is the estimated APY.</li>
</ol>
<ul>
<li><code>revolving</code> - A flag indicating if repeated borrowing is allowed.</li>
</ul>

**Kind**: global constant  
<a name="Errors"></a>

## Errors
<p>Event indicating that the pool has been closed.</p>
<h1>Fields:</h1>
<ul>
<li><code>by</code> - The address that closed the pool.</li>
</ul>

**Kind**: global constant  
<a name="Errors"></a>

## Errors
<p>The yield reinvestment setting has been updated.</p>
<h1>Fields:</h1>
<ul>
<li><code>account</code> - The account whose setting has been updated.</li>
<li><code>reinvest_yield</code> - A flag indicating whether the lender is reinvesting or not.</li>
</ul>

**Kind**: global constant  
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

## drawdown(poolName, network, wallet, drawdownAmount) ⇒ <code>Promise.&lt;AssembledTransaction&gt;</code>
<p>Draws down from a pool.</p>

**Kind**: global function  
**Returns**: <code>Promise.&lt;AssembledTransaction&gt;</code> - <ul>
<li>A Promise of the AssembledTransaction.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>POOL\_NAME</code> | <p>The name of the credit pool to get the contract instance for.</p> |
| network | <code>StellarNetwork</code> | <p>The stellar network.</p> |
| wallet | <code>StellarWallet</code> | <p>The stellar wallet.</p> |
| drawdownAmount | <code>BigNumberish</code> | <p>The amount to drawdown.</p> |

<a name="makePaymentWithReceivable"></a>

## makePaymentWithReceivable(poolName, network, wallet, paymentAmount, principalOnly) ⇒ <code>Promise.&lt;AssembledTransaction&gt;</code>
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

