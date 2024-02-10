import { useContract, useNFTs } from "@thirdweb-dev/react";
import { TOOLS_ADDRESS } from "../const/addresses";
import Link from "next/link";
import { Text, Button, Container, Flex, Heading, SimpleGrid, Spinner } from "@chakra-ui/react";
import NFT from "../components/NFT";

export default function Shop()  {
    const { contract } = useContract(TOOLS_ADDRESS);
    const { data: nfts } = useNFTs(contract);
    console.log(nfts);

    return (
        <div style={{ backgroundImage: `url('/fondominer.jpg')`, backgroundSize: 'cover', minHeight: '100vh' }}>
            <Container maxW={"1200px"} pt={10}>
                <Flex direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <Link href="/">
                        <Button>Back</Button>
                    </Link>
                </Flex>
                <Heading mt={"40px"} fontWeight="bold" color="white">Shop</Heading>
<Text fontWeight="bold" color="white">Purchase to increase your earnings.</Text>
                {!nfts ? (
                    <Flex h={"50vh"} justifyContent={"center"} alignItems={"center"}>
                        <Spinner />
                    </Flex>
                ) : (
                    <SimpleGrid columns={5} spacing={15}>
                        {nfts?.map((nftItem) => (
                            <NFT 
                                key={nftItem.metadata.id}
                                nft={nftItem}
                            />
                        ))}
                    </SimpleGrid>
                )}
            </Container>
        </div>
    )
};