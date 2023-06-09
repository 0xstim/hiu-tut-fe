import { useState } from 'react'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'


export default function MintToken() {
  const [tokenAmount, setTokenAmount] = useState('')
  // const debouncedTokenAmount = useDebounce(tokenAmount)
  const [receivingAddress, setReceivingAddress] = useState('')
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: '0x2c8178DcE38f3Fd29F1AF13B50152Dc955Adb13A',
    abi: [
			{
				inputs: [
					{
						internalType: "address",
						name: "to",
						type: "address"
					},
					{
						internalType: "uint256",
						name: "amount",
						type: "uint256"
					}
				],
				name: "mint",
				outputs: [],
				stateMutability: "nonpayable",
				type: "function"
			},
    ],
    functionName: 'mint',
    args: [receivingAddress, tokenAmount],
  })
  const { data, error, isError, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        write?.()
      }}
    >
      <label htmlFor="tokenForm">Mint parameters</label>
      <input
        id="tokenForm"
        onChange={(e) => setTokenAmount(e.target.value)}
        placeholder="0"
        value={tokenAmount}
      />
      <input
        id="tokenForm"
        onChange={(e) => setReceivingAddress(e.target.value)}
        placeholder="valid ethereum address"
        value={receivingAddress}
      />
      <button disabled={!write || isLoading}>
        {isLoading ? 'Minting...' : 'Mint'}
      </button>
      {isSuccess && (
        <div>
          Successfully minted your tokens!
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
          </div>
        </div>
      )}
      {(isPrepareError || isError) && (
        <div>Error: {(prepareError || error)?.message}</div>
      )}
    </form>
  )
}
