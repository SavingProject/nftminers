import React, { useState, useEffect } from "react";
import {
    MediaRenderer,
    Web3Button,
    useAddress,
    useContract,
    useContractRead,
    useNFT,
    useTokenBalance,
} from "@thirdweb-dev/react";
import { STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import styles from "../styles/Home.module.css";
import { Text, Box, Card, Stack, Flex } from "@chakra-ui/react";

interface EquippedProps {
    tokenId: number;
}

export const Equipped = (props: EquippedProps) => {
    const address = useAddress();

    const { contract: toolContract } = useContract(TOOLS_ADDRESS);
    const { data: nft } = useNFT(toolContract, props.tokenId);

    const { contract: stakingContract } = useContract(STAKING_ADDRESS);

    const { data: claimableRewards, refetch: refetchClaimableRewards } = useContractRead(
        stakingContract,
        "getStakeInfoForToken",
        [props.tokenId, address]
    );

    // Estado para almacenar la cantidad de trabajo para cada NFT
    const [quantities, setQuantities] = useState<{ [id: number]: number }>({ [props.tokenId]: 1 });
    const [showMiningMessage, setShowMiningMessage] = useState(false);

    // Función para hacer un trabajo desequipado para un NFT específico
    async function unWorkNFT(id: number) {
        if (!address || !stakingContract) return;
        const quantity = quantities[id] || 1; // Obtener la cantidad del estado correspondiente al ID del NFT
        await stakingContract.call("withdraw", [id, quantity]); // Utilizamos la cantidad ingresada por el usuario
    };

    // Efecto para actualizar automáticamente el saldo reclamable de SVIT
    useEffect(() => {
        const interval = setInterval(() => {
            refetchClaimableRewards(); // Vuelve a consultar el saldo reclamable de SVIT cada cierto intervalo
        }, 10000); // Intervalo de actualización cada 5 segundos (puedes ajustar este valor según tus necesidades)

        // Limpia el intervalo cuando el componente se desmonta o cuando cambia el tokenId
        return () => clearInterval(interval);
    }, [stakingContract, props.tokenId]);

    return (
        <Box style={{ backgroundColor: "black" }}>
            {nft && (
                <Card className={styles.equipcontainer} p={5}>
                    {showMiningMessage && (
                        <Text fontWeight={"bold"} color="green">Mining...</Text>
                    )}
                    <Flex>
                        <Box>
                            <MediaRenderer
                                src={nft.metadata.image}
                                height="100%"
                                width="300%"
                            />
                        </Box>
                        <Stack spacing={1}>
                            <Text fontSize={"2xl"} fontWeight={"bold"}>
                                {nft.metadata.name}
                            </Text>
                            
                            <Text>Work: {ethers.utils.formatUnits(claimableRewards[0], 0)}</Text>
                            
                            <input
                                type="number"
                                value={quantities[props.tokenId] || ''}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    setQuantities(prevState => ({
                                        ...prevState,
                                        [props.tokenId]: isNaN(value) ? 1 : value, // Actualizar la cantidad para este NFT específico
                                    }));
                                }}
                                placeholder="Amount to UnWork"
                                className={styles.inputField} // Asegúrate de tener un estilo para el campo de entrada
                                style={{ backgroundColor: 'black', color: 'yellow' }}
                            />
                            <Web3Button
                                contractAddress={STAKING_ADDRESS}
                                action={() => unWorkNFT(props.tokenId)}
                                className={styles.unequipbutton}
                                style={{ color: 'Yellow', backgroundColor: 'Black' }}
                            >
                                UnWork
                            </Web3Button>
                        </Stack>
                    </Flex>
                    <Box mt={5}>
                        <Text fontSize={"large"} fontWeight={"bold"}>Claimable Token Saving (SVIT):</Text>
                        <Text fontSize={"large"} fontWeight={"bold"} color={"Blue"}
                        >{ethers.utils.formatUnits(claimableRewards[1], 18)}</Text>
                        <Web3Button
                            contractAddress={STAKING_ADDRESS}
                            action={(contract) => contract.call("claimRewards", [props.tokenId])}
                            style={{ color: 'Red', backgroundColor: 'Black' }}
                        >
                            Withdraw SVIT
                        </Web3Button>
                    </Box>
                </Card>
            )}
        </Box>
    );
};