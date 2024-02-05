const contracts = {
    "1":{
        "contract":[{
            "name":"ownder",
            "address":"0xA4680514d527C0Efec844edC44Ffc3A27771BA44",
            "ercType":"ERC20"
        },
        {
            "name":"USDC",
            "address":"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            "ercType":"ERC20"
        },
        {
            "name":"USDT",
            "address":"0xdac17f958d2ee523a2206206994597c13d831ec7",
            "ercType":"ERC20"
        },
        {
            "name":"Dai",
            "address":"0x6b175474e89094c44da98b954eedeac495271d0f",
            "ercType":"ERC20"
        },
    ]
    },
    "168587773":{
        "contract":[{
            "name":"ownder",
            "address":"0x85A04646499b612b480587769C3a05EFe849BA83",
            "ercType":"ERC20"
        },
        {
            "name":"USDC",
            "address":"0xA4680514d527C0Efec844edC44Ffc3A27771BA44",
            "ercType":"ERC20"
        },
        {
            "name":"PFP",
            "address":"0xA4680514d527C0Efec844edC44Ffc3A27771BA44",
            "ercType":"ERC721"
        },
    ]
    },
    "11155111":{
        "contract":[
            {
                "name":"eth",
                "address":"",
                "ercType":"ERC20"
            },
            {
            "name":"ownder",
            "address":"0xBe561cA407E4f64c1027b6420D937274b2923bDF",
            "ercType":"ERC20"
        },
        {
            "name":"Stake",
            "address":"0xEE478b9b671FEC50D73C81adb740574D6927fb4C",
            "ercType":"ERC20"
        },
        {
            "name":"PFP",
            "address":"0xA4680514d527C0Efec844edC44Ffc3A27771BA44",
            "ercType":"ERC721"
        },
        {
            "name":"USDC",
            "address":"0xCDA29ae8768905B15eA0de00E6ee446a5BB6Bf33",
            "ercType":"ERC20"
        },
        {
            "name":"DAI",
            "address":"0x94a8F7cb5a7b9f73F485d25E79A65Bf2D9eaeaeE",
            "ercType":"ERC20"
        },
        {
            "name":"USDT",
            "address":"0x16c975455d5f95952cD342Bed75e5014dD3aED19",
            "ercType":"ERC20"
        },
    ]
    }
    
};

function chainList(chainId){
    if(contracts[chainId]==undefined || contracts[chainId]==""){
        return [];
    }
    if(contracts[chainId]["contract"].length <= 0){
        return [];
    }
    return contracts[chainId]["contract"];
}

export { contracts,chainList };