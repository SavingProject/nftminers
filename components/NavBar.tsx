import { Container, Flex, Heading, Link, Image, HStack } from "@chakra-ui/react";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function NavBar() {
    return (
        <Container maxW={"1200px"} py={4}>
             
            <Flex direction={"row"} justifyContent={"space-between"}>
            <HStack spacing={4} align="center">
                <Heading>Nft Miners</Heading>
                <Image src="/svit.png" alt="Descripción de la imagen" boxSize="40px" />
                </HStack>
                <Flex alignItems={"center"}>
                    <Link href={"/"} mx={4} fontSize="20px" style={{ color: 'Green', fontWeight: 'bold' }}>Mining</Link>
                    <Link href={"/shop"} mx={4} fontSize="20px" style={{ color: 'Green', fontWeight: 'bold' }}>Shop</Link>
                    <Link href={"https://www.savingtoken.net/market-farm/nft-miner"} mx={4} fontSize="20px" target="_blank" style={{ color: 'Green', fontWeight: 'bold' }}>Main Page</Link>
                                                    
                </Flex>
                <ConnectWallet/>
            </Flex>
        </Container>
    )
};