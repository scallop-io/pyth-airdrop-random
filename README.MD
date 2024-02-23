## Pyth Airdrop Randomization Process

### Event Rule

- A random snapshot will be taken from February 21st to February 27th.
- The top 3 winners will receive 4,888, 2,888, and 888 $PYTH, respectively, and will be selected randomly.
- Additionally, 1,497 users will be randomly chosen from all users included in the snapshot. The remaining $PYTH amount will be distributed equally among these users.

### Randomization Logic

After taking a snapshot at a random time and compiling a list of eligible users, we will select 1,500 random users to receive the Pyth airdrop. Here is the process for selecting the 1,500 random users:

1. Retrieve the complete list of eligible users.
2. Select a future drand round to use as the seed for hashing the list.
3. When the chosen drand round occurs, use that round's Drand result as the source of randomness.
4. Combine each user's Sui address with the randomness in the format {address}{randomness}, and then hash this combination using the Blake2b algorithm, producing a hash result in hexadecimal form.
5. Convert the hexadecimal hash result into a number.
6. Sort these numbers from largest to smallest and pick the top 1,500 users from the sorted results as winners of the Pyth airdrop.
