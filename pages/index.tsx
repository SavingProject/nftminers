import { ConnectWallet, MediaRenderer, Web3Button, useAddress, useContract, useContractRead, useContractWrite, useOwnedNFTs } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { FARMER_ADDRESS, REWARDS_ADDRESS, STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ClaimFarmer } from "../components/ClaimFarmer";
import { Inventory } from "../components/Inventory";
import { Equipped } from "../components/Equipped";
import { BigNumber, ethers } from "ethers";
import { Text, Box, Card, Container, Flex, Heading, SimpleGrid, Spinner, Stack, Skeleton, Image } from "@chakra-ui/react";

const Home: NextPage = () => {
  const address = useAddress();

  const { contract: farmercontract } = useContract(FARMER_ADDRESS);
  const { contract: toolsContract } = useContract(TOOLS_ADDRESS);
  const { contract: stakingContract } = useContract(STAKING_ADDRESS);
  const { contract: rewardContract } = useContract(REWARDS_ADDRESS);

  const { data: ownedFarmers, isLoading: loadingOwnedFarmers } = useOwnedNFTs(farmercontract, address);
  const { data: ownedTools, isLoading: loadingOwnedTools } = useOwnedNFTs(toolsContract, address);

  const { data: equippedTools } = useContractRead(
    stakingContract, 
    "getStakeInfo",
    [address]
  );

  const { data: rewardBalance } = useContractRead(rewardContract, "balanceOf", [address]);
  
  if (!address) {
    return (
      <Container maxW={"1200px"}>
        <Flex direction={"column"} h={"100vh"} justifyContent={"center"} alignItems={"center"}>
          <Heading my={"40px"}>Welcom to Nft Miner</Heading>
          <ConnectWallet />
        </Flex>
      </Container>
    );
  }

  if (loadingOwnedFarmers) {
    return(
      <Container maxW={"1200px"}>
        <Flex h={"100vh"} justifyContent={"center"} alignItems={"center"}>
          <Spinner />
        </Flex>
      </Container>
    );
  }

  if (ownedFarmers?.length === 0) {
    return (
      <Container maxW={"1200px"}>
        <ClaimFarmer />
      </Container>
    );
  }

  return (
    <div style={{ backgroundImage: `url('/fondominer.jpg')`, backgroundSize: 'cover', minHeight: '100vh' }}>
      <Container maxW={"1200px"} pt={10}>
        <SimpleGrid columns={2} spacing={10}>
          <Card p={5}>
            
            <Image src="/svit.png" alt="Descripción de la imagen" boxSize="40px" />
            <SimpleGrid columns={2} spacing={10}>
              <Box>
                {ownedFarmers?.map((nft) => (
                  <div key={nft.metadata.id}>
                    <MediaRenderer 
                      src={nft.metadata.image} 
                      height="75%"
                      width="75%"
                    />
                  </div>
                ))}
              </Box>
              <Box>
                <Text fontSize={"x-large"} fontWeight={"bold"}>SVIT Balance:</Text>
                  {rewardBalance && (
                      <p style={{ fontWeight: 'bold', fontSize: '2rem', color: 'Blue' }}
                      >{ethers.utils.formatUnits(rewardBalance, 18)}</p>
                    )}
                </Box>
            </SimpleGrid>
          </Card>
          <Card p={5}>
            <Heading>Inventory:</Heading>
            <Skeleton isLoaded={!loadingOwnedTools}>
              <Inventory
                nft={ownedTools}
              />     
            </Skeleton>
          </Card>
        </SimpleGrid>
        <Card p={5} my={10}>
          <Heading mb={"30px"}>Working:</Heading>
          <SimpleGrid columns={3} spacing={10}>
              {equippedTools &&
                equippedTools[0].map((nft: BigNumber) => (
                  <Equipped
                    key={nft.toNumber()}
                    tokenId={nft.toNumber()}
                  />
                ))}
          </SimpleGrid>
        </Card>
      </Container>
    </div>
  );
};

export default Home;