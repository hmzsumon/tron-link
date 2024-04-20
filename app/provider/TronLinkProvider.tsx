'use client';
import type { WalletError } from '@tronweb3/tronwallet-abstract-adapter';

import {
	WalletDisconnectedError,
	WalletNotFoundError,
} from '@tronweb3/tronwallet-abstract-adapter';
// @ts-ignore
import { toast } from 'react-hot-toast';
import {
	BitKeepAdapter,
	OkxWalletAdapter,
	TokenPocketAdapter,
	TronLinkAdapter,
	WalletConnectAdapter,
} from '@tronweb3/tronwallet-adapters';
import { useMemo } from 'react';
import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletModalProvider } from '@tronweb3/tronwallet-adapter-react-ui';
import '@tronweb3/tronwallet-adapter-react-ui/style.css';
import { LedgerAdapter } from '@tronweb3/tronwallet-adapter-ledger';

const TronLinkProvider = ({ children }: { children: React.ReactNode }) => {
	function onError(e: WalletError) {
		if (e instanceof WalletNotFoundError) {
			toast.error(e.message);
		} else if (e instanceof WalletDisconnectedError) {
			toast.error(e.message);
		} else toast.error(e.message);
	}
	const adapters = useMemo(function () {
		const tronLinkAdapter = new TronLinkAdapter();
		const ledger = new LedgerAdapter({
			accountNumber: 2,
		});
		const walletConnectAdapter = new WalletConnectAdapter({
			network: 'Mainnet',
			options: {
				relayUrl: 'wss://relay.walletconnect.com',
				// example WC app project ID
				projectId: '5fc507d8fc7ae913fff0b8071c7df231',
				metadata: {
					name: 'Test DApp',
					description: 'JustLend WalletConnect',
					url: 'https://your-dapp-url.org/',
					icons: ['https://your-dapp-url.org/mainLogo.svg'],
				},
			},
			web3ModalConfig: {
				themeMode: 'light',
				themeVariables: {
					'--w3m-z-index': '1000',
				},
			},
		});
		const bitKeepAdapter = new BitKeepAdapter();
		const tokenPocketAdapter = new TokenPocketAdapter();
		const okxwalletAdapter = new OkxWalletAdapter();
		return [
			tronLinkAdapter,
			bitKeepAdapter,
			tokenPocketAdapter,
			okxwalletAdapter,
			walletConnectAdapter,
			ledger,
		];
	}, []);

	return (
		<WalletProvider
			onError={onError}
			adapters={adapters}
			disableAutoConnectOnLoad={true}
		>
			<WalletModalProvider>{children}</WalletModalProvider>
		</WalletProvider>
	);
};

export default TronLinkProvider;
