import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'

export default function PauseToken() {
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: '0x2c8178DcE38f3Fd29F1AF13B50152Dc955Adb13A',
    abi: [
			{
				inputs: [],
				name: "unpause",
				outputs: [],
				stateMutability: "nonpayable",
				type: "function"
			},
    ],
    functionName: 'unpause',
  })
  const { data, error, isError, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return (
    <div>
      <button disabled={!write || isLoading} onClick={() => write()}>
        {isLoading ? 'Unpausing...' : 'Unpause'}
      </button>
      {isSuccess && (
        <div>
          Successfully unpaused your token!
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
          </div>
        </div>
      )}
      {(isPrepareError || isError) && (
        <div>Error: {(prepareError || error)?.message}</div>
      )}
    </div>
  )
}
