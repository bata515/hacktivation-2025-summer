// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PersonaRegistry.sol";

contract PersonaRegistryScript is Script {
    function run() external {
        // Get the deployer's private key from environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy the PersonaRegistry contract
        PersonaRegistry registry = new PersonaRegistry();

        // Log the deployed contract address
        console.log("PersonaRegistry deployed to:", address(registry));

        vm.stopBroadcast();

        // Optionally create a sample persona for testing
        if (block.chainid == 31337) { // Anvil local chain
            createSamplePersona(registry, deployerPrivateKey);
        }
    }

    function createSamplePersona(PersonaRegistry registry, uint256 deployerPrivateKey) internal {
        vm.startBroadcast(deployerPrivateKey);

        console.log("Creating sample persona for testing...");

        uint256 personaId = registry.createPersona(
            "Albert Einstein",                    // name
            76,                                  // age
            "Theoretical Physicist",             // occupation
            "German-born theoretical physicist who developed the theory of relativity", // background
            "Curious,Imaginative,Persistent,Humble", // traits
            "Thoughtful and profound, often using analogies", // speakingStyle
            "Formal but warm, sometimes playful", // tone
            "Physics,Mathematics,Philosophy,Violin", // expertise
            "Theory of Relativity,Nobel Prize in Physics,Princeton Institute", // experiences
            "E=mc2 formula,Patent office days,Sailing without wind", // memories
            "Science serves humanity,Peace over war,Imagination is more important than knowledge", // beliefs
            "Understanding nature,Promoting peace,Helping young scientists" // priorities
        );

        console.log("Sample persona created with ID:", personaId);

        PersonaRegistry.Persona memory persona = registry.getPersona(personaId);
        console.log("Persona name:", persona.name);
        console.log("Persona owner:", persona.owner);
        console.log("Total personas:", registry.getTotalPersonaCount());

        vm.stopBroadcast();
    }
}