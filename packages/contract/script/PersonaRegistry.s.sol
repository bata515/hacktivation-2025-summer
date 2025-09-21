// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PersonaRegistry.sol";

contract PersonaRegistryScript is Script {
    function run() external {
        // Use the deployer key from broadcast (set via --private-key)
        vm.startBroadcast();

        // Deploy the PersonaRegistry contract
        PersonaRegistry registry = new PersonaRegistry();

        // Log the deployed contract address
        console.log("PersonaRegistry deployed to:", address(registry));

        vm.stopBroadcast();

        // Optionally create a sample persona for testing
        if (block.chainid == 31337) { // Anvil local chain
            createSamplePersona(registry);
        }
    }

    function createSamplePersona(PersonaRegistry registry) internal {
        vm.startBroadcast();

        console.log("Creating sample persona for testing...");

        uint256 personaId = registry.createPersona(
            unicode"マイケル・ジャクソン",                    // name
            50,                                  // age
            unicode"歌手・ダンサー・エンターテイナー",             // occupation
            unicode"アメリカ出身のポップ界の王と呼ばれた世界的なエンターテイナー", // background
            unicode"完璧主義者,創造的,情熱的,優しい", // traits
            unicode"魅力的で表現豊か、時に神秘的", // speakingStyle
            unicode"暖かく愛情深い、時に内省的", // tone
            unicode"音楽,ダンス,パフォーマンス,映像制作", // expertise
            unicode"スリラー,ムーンウォーク,世界ツアー,グラミー賞受賞", // experiences
            unicode"ネバーランド,ジャクソン5時代,初のムーンウォーク", // memories
            unicode"音楽で世界を癒す,子供たちを守る,人種の壁を越える", // beliefs
            unicode"音楽を通じた平和,子供たちの幸せ,芸術の追求" // priorities
        );

        uint256 personaId2 = registry.createPersona(
            unicode"吉田壮太",                    // name
            28,                                  // age
            unicode"ソフトウェアエンジニア",                     // occupation
            unicode"会社員から独立して1年半のフリーランスエンジニア",                 // background
            unicode"飽き性、めんどくさがり、ダラダラしている",                // traits
            unicode"ポジティブ、合理的",                     // speakingStyle
            unicode"博多弁",                     // tone
            unicode"Web開発、フロントエンド、バックエンド",                // expertise
            unicode"文系大学からソフトウェアエンジニアになった経験,イギリス短期留学、「ソフトボール、サッカー、ゴルフ、ダーツ」の経験、「英語、韓国語」学習",    // experiences
            unicode"イタリア旅行、韓国旅行、サッカー強豪校での挫折、アーセナルの試合を現地観戦、エンジニアカフェでハッカソンに参加", // memories
            unicode"個人主義、友達との繋がりを大切にする",        // beliefs
            unicode"合理性,計画性重視"         // priorities
        );

        console.log("Sample persona created with ID:", personaId2);

        PersonaRegistry.Persona memory persona2 = registry.getPersona(personaId2);
        console.log("Persona name:", persona2.name);
        console.log("Persona owner:", persona2.owner);

        console.log("Sample persona created with ID:", personaId);

        PersonaRegistry.Persona memory persona = registry.getPersona(personaId);
        console.log("Persona name:", persona.name);
        console.log("Persona owner:", persona.owner);
        console.log("Persona name:", persona2.name);
        console.log("Persona owner:", persona2.owner);
        console.log("Total personas:", registry.getTotalPersonaCount());

        vm.stopBroadcast();
    }
}
