
var qrcodeAddress = new QRCode(document.getElementById("qrcodeAddress"),{width: 120,height: 120});
var qrcodeSecret = new QRCode(document.getElementById("qrcodeSecret"),{width: 120, height: 120});

newbte();

function getConfig() {
	var networkConfigs = {
		'BTE': {
			'uri': 'BTE:',
			'title': 'BTE Wallet',
			'name': 'Bitweb',
			'ticker': 'BTE',
			'network': {
				'messagePrefix': '\x18BTE Signed Message:\n',
				'bip32': {
					'public': 0x0488b21e,
					'private': 0x0488ade4
				},
				'bech32': 'web',
				'pubKeyHash': 0x21,
				'scriptHash': 0x1E,
				'wif': 0x80
			}
		}
	}
	network=Object.keys(networkConfigs)[0]
	return networkConfigs[network]
}

// Create new wallet
function newbte(){
	var keys = bitcoin.ECPair.makeRandom({'network': getConfig()['network']})
	var address = getAddress(keys)

	if (address != undefined) {
		var addrurl = "https://explorer.bitwebcore.org";
		document.getElementById("address").innerHTML = address;
		document.getElementById("secret").innerHTML = keys.toWIF();
		document.getElementById("address-top").innerHTML = address;
		document.getElementById("secret-top").innerHTML = keys.toWIF();
		document.getElementById("addr").href = addrurl;
		qrcodeAddress.makeCode(address);
		qrcodeSecret.makeCode(keys.toWIF());
	}
}

function getAddress(keys) {
	var network = getConfig()['network']
	var address = undefined

	
	if (getAddressType() == 'bech32') {
		address = bitcoin.payments.p2wpkh({
			'pubkey': keys.publicKey,
			'network': network
		}).address
	} else if (getAddressType() == 'segwit') {
		address = bitcoin.payments.p2sh({
			'redeem': getP2WPKHScript(keys.publicKey),
			'network': network
		}).address
	} else if (getAddressType() == 'legacy') {
		address = bitcoin.payments.p2pkh({
			'pubkey': keys.publicKey,
			'network': getConfig()['network']
		}).address
	}

	return address
}

function getAddressType() {
	var type = 'bech32'
	return type
}
