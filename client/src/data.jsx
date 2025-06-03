export const API_KEY = "b94c2fae0c756831bc1f";
export const API_SECRET = "42df8bff4d632ee735dab5d51961b741c4c028c7e8f65b001c35ce4a158e14d9";
export const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyZTAxOTljZi1hMzg0LTQxOTktYjY5OC0xYzhlNzE3MDUzMzMiLCJlbWFpbCI6Inlhc2hkYW5lajIwMDRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImI5NGMyZmFlMGM3NTY4MzFiYzFmIiwic2NvcGVkS2V5U2VjcmV0IjoiNDJkZjhiZmY0ZDYzMmVlNzM1ZGFiNWQ1MTk2MWI3NDFjNGMwMjhjN2U4ZjY1YjAwMWMzNWNlNGExNThlMTRkOSIsImV4cCI6MTc4MDQwODM3M30.yyDVWFYLnpRO_JBw3SySk0di-9ZBWmWt6T0FzP7dhPw";
export const PINATA_GATEWAY_URL = "fuchsia-near-roadrunner-113.mypinata.cloud";
export const CONTRACT_ADDRESS = "0xaee8da7e639b368d2f0e8e700bdc29ec09f8b78e";
export const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_url",
				"type": "string"
			}
		],
		"name": "add",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "allow",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "disallow",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "display",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "shareAccess",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "access",
						"type": "bool"
					}
				],
				"internalType": "struct Upload.Access[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]