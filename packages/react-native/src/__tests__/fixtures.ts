export const TEST_ADDRESS = "GDWT6V543ZVXYNECWWUZ34ZHLJJ6OHGQXVYXJWD6WP7NOF65BT7GSUU5"
export const USDC_ISSUER = "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN"
export const TEST_HASH = "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
export const CONTRACT_ID = "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM"

export const mockAccountData = {
  id: TEST_ADDRESS,
  sequenceNumber: () => "1234567890123456",
  subentry_count: 2,
  thresholds: { low_threshold: 1, med_threshold: 2, high_threshold: 3 },
  signers: [{ key: TEST_ADDRESS, weight: 1, type: "ed25519_public_key" }],
  balances: [
    { asset_type: "native", balance: "100.0000000" },
    {
      asset_type: "credit_alphanum4",
      asset_code: "USDC",
      asset_issuer: USDC_ISSUER,
      balance: "250.5000000",
      limit: "1000.0000000",
    },
  ],
}
