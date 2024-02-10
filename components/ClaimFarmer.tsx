import { MediaRenderer, Web3Button, useContract, useContractMetadata } from "@thirdweb-dev/react";
import { FARMER_ADDRESS } from "../const/addresses";
import { Box, Container, Flex, Heading } from "@chakra-ui/react";

import Link from 'next/link';
import { Text, Button, Card, SimpleGrid, Stack } from '@chakra-ui/react';

export function ClaimFarmer() {
    const { contract } = useContract(FARMER_ADDRESS);
    const { data: metadata } = useContractMetadata(contract);
    
    return (
        <div style={{ backgroundImage: `url('/fondominer.jpg')`, backgroundSize: 'cover', minHeight: '100vh' }}>
            <Container maxW={"1200px"} pt={10}>
                <Flex direction={"column"} alignItems={"center"} justifyContent={"center"} h={"50vh"}>
                    <Heading fontWeight="bold" color="white">Buy a Participation Card</Heading>
                    <Box borderRadius={"8px"} overflow={"hidden"} my={10}>
                        <MediaRenderer
                            src={metadata?.image}
                            height="300px"
                            width="500px"
                        />
                    </Box>
                    <Box>
                        <Text> </Text>
                        <Link href="https://www.savingtoken.net/market-farm/nft-miner">
                            <Button style={{ color: 'Red', backgroundColor: 'Black' }}>Buy Card</Button>
                        </Link>
                    </Box>
                </Flex>
            </Container>
        </div>
    );
}