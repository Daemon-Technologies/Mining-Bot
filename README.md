# Mining-Bot

Please Visit [Mining-Bot Documentation](https://daemon-technologies.github.io/docs/)

- [WSL Tutorial Video](https://www.youtube.com/watch?v=FXifFx0Akzc)
- [MacOS](https://www.youtube.com/watch?v=TCtCTttsSeI)

## Pooling

This pooling infrastructure assumes the following:

- All inputs to your specified pooling address will be new contributors.
- All outputs to your specified pooling address will be btc spent on mining.

### Formulation

For cycle ![](https://latex.codecogs.com/png.latex?n):

- Let ![](https://latex.codecogs.com/png.latex?X_{n-1}) be the total BTC contributed to the pool during cycle ![](https://latex.codecogs.com/png.latex?n-1).

- Let ![](https://latex.codecogs.com/png.latex?Y_{n-1}) be the total BTC in the pool at the end of cycle ![](https://latex.codecogs.com/png.latex?n-1).

- Let ![](https://latex.codecogs.com/png.latex?Z_{n-1}=Y_{n-1}-X_{n-1}), or the amount of BTC left in the pool after mining during cycle ![](https://latex.codecogs.com/png.latex?n-1) and not including the newest contributions in cycle ![](https://latex.codecogs.com/png.latex?n-1).

- If you contributed ![](https://latex.codecogs.com/png.latex?c_{n-1}) BTC during cycle ![](https://latex.codecogs.com/png.latex?n-1), your reward percentage for cycle ![](https://latex.codecogs.com/png.latex?n) will be ![](https://latex.codecogs.com/png.latex?P_n=\frac{c_{n-1}}{X_{n-1}}*\frac{X_{n-1}}{Y_{n-1}}=\frac{c_{n-1}}{Y_{n-1}}). In other words, your reward percentage is based on how much you contributed in last cycle compared all the BTC in the pool.

- If you contributed ![](https://latex.codecogs.com/png.latex?c_{k}) BTC during cycle ![](https://latex.codecogs.com/png.latex?k) where ![](https://latex.codecogs.com/png.latex?k<n-1), your reward percentage for cycle ![](https://latex.codecogs.com/png.latex?n) will be ![](https://latex.codecogs.com/png.latex?P_n=P_{n-1}\frac{Z_{n-1}}{Y_{n-1}}). In other words, your reward percentage is based on your reward percentage from the last cycle and the amount of btc left in the pool after mining, not including new contributors.

- If you contribute during multiple cycles, your total reward percentage is the sum of your reward percentages per contribution.

Essentially, your reward for any given cycle will be weighted based on how much you contributed divided by the total amount remaining at the end of each cycle. As time goes on, bitcoin will be spent on mining and more contributors will join the pool, so your reward percentage will go down unless you contribute more.

### Example:

Pool begins mining in cycle #10. Any BTC sent to the specified address before cycle #10 begins is counted as a contribution.

### Before Cycle #10

For example:

- ![](https://latex.codecogs.com/png.latex?n=10)
- You contribute 0.1 BTC (![](https://latex.codecogs.com/png.latex?c_{9}=0.1))
- Other people contribute 0.9 BTC total.
- Pool has a total of 1 BTC right before cycle #10 begins (![](https://latex.codecogs.com/png.latex?X_{9}=Y_{9}=1))
- You will earn ![](https://latex.codecogs.com/png.latex?P_{10}=\frac{c_{9}}{Y_{9}}=\frac{0.1}{1}=0.1) of all mining rewards in cycle #10.

### Cycle #10

- ![](https://latex.codecogs.com/png.latex?n=10)
- You earn 10% of all mining rewards this cycle.
- This address begins to mine STX.

### Before Cycle #11

- ![](https://latex.codecogs.com/png.latex?n=11)
- For example, let's say by the end of cycle #10, 0.1 BTC has been spent on mining, and another 0.9 BTC was contributed, so pool now has 1.8 BTC before cycle #11. (![](https://latex.codecogs.com/png.latex?X_{10}=0.9,Y_{10}=1.8,Z_{10}=1.8-0.9=0.9))
- Your last contribution was during cycle 9 (![](https://latex.codecogs.com/png.latex?k=9)), so your reward percentage for cycle 11 will be ![](https://latex.codecogs.com/png.latex?P_{11}=P_{10}\frac{Z_{10}}{Y_{10}}=0.1*\frac{0.9}{1.8}=0.05), so you will receive 5% of all rewards in cycle #11

### Cycle #11

- ![](https://latex.codecogs.com/png.latex?n=11)
- You receive 5% of all mining rewards this cycle.
- This address continues mining STX.
- BTC sent to this address during this cycle will count as contributions for cycle #12

### Before Cycle #12

- ![](https://latex.codecogs.com/png.latex?n=12)
- For example, let's say by the end of cycle #11, another 0.1 BTC has been spent on mining, and no other BTC was contributed, so pool now has 1.7 BTC before cycle #12 (![](https://latex.codecogs.com/png.latex?X_{11}=0,Y_{11}=1.7,Z_{11}=1.7-0=1.7)).
- Since no other BTC was contributed, and your last contribution was during cycle 9 (![](https://latex.codecogs.com/png.latex?k=9)) you still get a total of 5% of all mining rewards in cycle #12 (![](https://latex.codecogs.com/png.latex?P_{12}=P_{11}\frac{Z_{11}}{Y_{11}}=0.05*\frac{1.7}{1.7}=0.05)).

### Cycle #12

- ![](https://latex.codecogs.com/png.latex?n=12)
- You receive 5% of all mining rewards this cycle.
- This address continues mining STX.
- BTC sent to this address during this cycle will count as contributions for cycle #13

### Before Cycle #13

- ![](https://latex.codecogs.com/png.latex?n=13)
- You contribute another 0.4 BTC to the pool
- For example, let's say by the end of cycle #12, another 0.1 BTC has been spent on mining, so there is now 2 BTC before cycle #13 (![](https://latex.codecogs.com/png.latex?X_{12}=0.4,Y_{12}=2,Z_{12}=2.0-0.4=1.6)).
- Your contribution during cycle 12 gives you a cycle 13 reward percentage of ![](https://latex.codecogs.com/png.latex?P_{13}=P_{12}\frac{Z_{12}}{Y_{12}}=0.05*\frac{1.6}{2.0}=0.04) 
- Your contribution during cycle 9 gives you a cycle 13 reward percentage of ![](https://latex.codecogs.com/png.latex?P_{13}=\frac{c_{12}}{Y_{12}}=\frac{0.4}{2.0}=0.2) 
- Your total reward percentage will be 0.04 + 0.2 = 0.24 of all mining rewards in cycle 13.

### Manage Pool

On this page, you can manage a stacks mining pool. You should be able to:

- Define the btc address you want to pool on. Other people will send their btc to this address.
- See who has contributed to your pool.
- See how much time left in the "cycle".

### Join Pool

On this page, you can see the mining pool you joined. You should be able to:

- enter a bitcoin address to join their pool
- you can also specify how many bitcoin you want to send every "cycle"
- see how much remaining time for this "cycle"
