import React, { useState, useEffect } from 'react';
import { MediaRenderer, Web3Button, useAddress, useContract, useContractRead } from '@thirdweb-dev/react';
import { NFT } from '@thirdweb-dev/sdk';
import { STAKING_ADDRESS, TOOLS_ADDRESS } from '../const/addresses';
import Link from 'next/link';
import { Text, Box, Button, Card, SimpleGrid, Stack, Input } from '@chakra-ui/react';
import { ethers } from "ethers";

type Props = {
    nft: NFT[] | undefined;
};

export function Inventory({ nft }: Props) {
    const address = useAddress();
    const { contract: toolContract } = useContract(TOOLS_ADDRESS);
    const { contract: stakingContract } = useContract(STAKING_ADDRESS);
    const [quantities, setQuantities] = useState<{ [id: string]: number }>({}); // Estado para almacenar la cantidad ingresada por el usuario para cada NFT
    const [userNftCounts, setUserNftCounts] = useState<{ [id: string]: number | undefined }>({}); // Estado para almacenar la cantidad de NFTs del usuario para cada NFT

    useEffect(() => {
        async function fetchUserNftCounts() {
            if (!address || !toolContract || !nft) return;

            // Obtener la cantidad de NFTs del usuario para cada NFT
            const counts = await Promise.all(nft.map(async nftItem => {
                const count = await toolContract?.erc1155.balanceOf(address, nftItem.metadata.id.toString());
                return count.toNumber();
            }));

            // Almacenar las cantidades de cada NFT del usuario en el estado correspondiente
            const userCounts = nft.reduce((acc, nftItem, index) => {
                return {
                    ...acc,
                    [nftItem.metadata.id]: counts[index],
                };
            }, {});
            setUserNftCounts(userCounts);
        }

        fetchUserNftCounts();
    }, [address, toolContract, nft]);

    async function stakeNFT(id: string) {
        if (!address || !toolContract || !stakingContract) {
            return;
        }

        const quantity = quantities[id] || 1; // Obtener la cantidad del estado correspondiente al ID del NFT

        const isApproved = await toolContract.erc1155.isApproved(address, STAKING_ADDRESS);

        if (!isApproved) {
            await toolContract.erc1155.setApprovalForAll(STAKING_ADDRESS, true);
        }
        await stakingContract.call("stake", [id, quantity]); // Utilizamos la cantidad ingresada por el usuario
    };

    if(nft?.length === 0) {
        return (
            <Box>
                <Text>No Miners.</Text>
                <Link href="/shop">
                    <Button style={{ color: 'Red', backgroundColor: 'Black' }}>Shop Miners</Button>
                </Link>
            </Box>
        )
    }
    
    return (
        <SimpleGrid columns={3} spacing={4}>
            {nft?.map((nftItem) => (
                <Card key={nftItem.metadata.id} p={5}>
                    <Stack alignItems="center">
                        <MediaRenderer 
                            src={nftItem.metadata.image} 
                            height="100px"
                            width="100px"
                        />
                        <Text>{nftItem.metadata.name}</Text>
                        <Text>Nft Quantity: {userNftCounts[nftItem.metadata.id] !== undefined ? userNftCounts[nftItem.metadata.id] : 'Cargando...'}</Text>
                        <Input
                            type="number"
                            value={quantities[nftItem.metadata.id] || ''}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                setQuantities(prevState => ({
                                    ...prevState,
                                    [nftItem.metadata.id]: isNaN(value) ? 1 : value, // Actualizar la cantidad para este NFT específico
                                }));
                            }}
                            placeholder="Amount"
                            style={{ backgroundColor: 'black', color: 'yellow', textAlign: 'center' }}
                        />
                        <Web3Button
                            contractAddress={STAKING_ADDRESS}
                            action={() => stakeNFT(nftItem.metadata.id)}
                            style={{ color: 'yellow', backgroundColor: 'black' }}
                        >
                            Work
                        </Web3Button>
                    </Stack>
                </Card>
            ))}
        </SimpleGrid>
    );
};