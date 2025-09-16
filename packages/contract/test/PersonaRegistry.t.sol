// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PersonaRegistry.sol";

contract PersonaRegistryTest is Test {
    PersonaRegistry public registry;
    address public user1 = address(0x1);
    address public user2 = address(0x2);

    function setUp() public {
        registry = new PersonaRegistry();
        vm.label(user1, "User1");
        vm.label(user2, "User2");
    }

    // Test persona creation
    function testCreatePersona() public {
        vm.startPrank(user1);

        uint256 personaId = registry.createPersona(
            "Albert Einstein",     // name
            76,                   // age
            "Theoretical Physicist", // occupation
            "German-born theoretical physicist", // background
            "Curious,Imaginative,Persistent", // traits
            "Thoughtful and profound", // speakingStyle
            "Formal but warm", // tone
            "Physics,Mathematics,Philosophy", // expertise
            "Theory of Relativity,Nobel Prize", // experiences
            "E=mc2,Princeton years", // memories
            "Science serves humanity,Peace over war", // beliefs
            "Understanding nature,Promoting peace" // priorities
        );

        vm.stopPrank();

        // Verify the persona was created correctly
        PersonaRegistry.Persona memory persona = registry.getPersona(personaId);

        assertEq(persona.id, 1);
        assertEq(persona.name, "Albert Einstein");
        assertEq(persona.basicInfo.age, 76);
        assertEq(persona.basicInfo.occupation, "Theoretical Physicist");
        assertEq(persona.owner, user1);
        assertTrue(persona.isActive);

        // Check user persona list
        uint256[] memory userPersonas = registry.getUserPersonaIds(user1);
        assertEq(userPersonas.length, 1);
        assertEq(userPersonas[0], personaId);

        // Check counts
        assertEq(registry.getTotalPersonaCount(), 1);
        assertEq(registry.getUserActivePersonaCount(user1), 1);
    }

    // Test persona creation with invalid data
    function testCreatePersonaInvalidData() public {
        vm.startPrank(user1);

        // Test empty name
        vm.expectRevert("Name cannot be empty");
        registry.createPersona(
            "",                   // empty name
            76,
            "Physicist",
            "Background",
            "Traits",
            "Speaking",
            "Tone",
            "Expertise",
            "Experiences",
            "Memories",
            "Beliefs",
            "Priorities"
        );

        // Test invalid age (0)
        vm.expectRevert("Age must be between 1 and 199");
        registry.createPersona(
            "Test",
            0,                    // invalid age
            "Physicist",
            "Background",
            "Traits",
            "Speaking",
            "Tone",
            "Expertise",
            "Experiences",
            "Memories",
            "Beliefs",
            "Priorities"
        );

        // Test invalid age (200)
        vm.expectRevert("Age must be between 1 and 199");
        registry.createPersona(
            "Test",
            200,                  // invalid age
            "Physicist",
            "Background",
            "Traits",
            "Speaking",
            "Tone",
            "Expertise",
            "Experiences",
            "Memories",
            "Beliefs",
            "Priorities"
        );

        vm.stopPrank();
    }

    // Test persona update
    function testUpdatePersona() public {
        // First create a persona
        vm.startPrank(user1);

        uint256 personaId = registry.createPersona(
            "Original Name",
            30,
            "Original Job",
            "Original Background",
            "Original Traits",
            "Original Style",
            "Original Tone",
            "Original Expertise",
            "Original Experience",
            "Original Memory",
            "Original Belief",
            "Original Priority"
        );

        // Update the persona
        registry.updatePersona(
            personaId,
            "Updated Name",
            35,
            "Updated Job",
            "Updated Background",
            "Updated Traits",
            "Updated Style",
            "Updated Tone",
            "Updated Expertise",
            "Updated Experience",
            "Updated Memory",
            "Updated Belief",
            "Updated Priority"
        );

        vm.stopPrank();

        // Verify the update
        PersonaRegistry.Persona memory persona = registry.getPersona(personaId);
        assertEq(persona.name, "Updated Name");
        assertEq(persona.basicInfo.age, 35);
        assertEq(persona.basicInfo.occupation, "Updated Job");
        assertTrue(persona.updatedAt > persona.createdAt);
    }

    // Test update persona by non-owner
    function testUpdatePersonaByNonOwner() public {
        // User1 creates a persona
        vm.startPrank(user1);
        uint256 personaId = registry.createPersona(
            "Test Name", 30, "Job", "Background", "Traits", "Style", "Tone",
            "Expertise", "Experience", "Memory", "Belief", "Priority"
        );
        vm.stopPrank();

        // User2 tries to update it
        vm.startPrank(user2);
        vm.expectRevert("Not the owner of this persona");
        registry.updatePersona(
            personaId, "Hacked", 25, "Hacker", "Evil", "Bad", "Rude", "Mean",
            "Stealing", "Hacking", "Crime", "Money", "Power"
        );
        vm.stopPrank();
    }

    // Test persona transfer
    function testTransferPersona() public {
        // User1 creates a persona
        vm.startPrank(user1);
        uint256 personaId = registry.createPersona(
            "Transfer Test", 30, "Job", "Background", "Traits", "Style", "Tone",
            "Expertise", "Experience", "Memory", "Belief", "Priority"
        );

        // Transfer to user2
        registry.transferPersona(personaId, user2);
        vm.stopPrank();

        // Verify the transfer
        PersonaRegistry.Persona memory persona = registry.getPersona(personaId);
        assertEq(persona.owner, user2);

        // Verify user persona lists
        uint256[] memory user1Personas = registry.getUserPersonaIds(user1);
        uint256[] memory user2Personas = registry.getUserPersonaIds(user2);

        assertEq(user1Personas.length, 0);
        assertEq(user2Personas.length, 1);
        assertEq(user2Personas[0], personaId);

        assertEq(registry.getUserActivePersonaCount(user1), 0);
        assertEq(registry.getUserActivePersonaCount(user2), 1);
    }

    // Test transfer to invalid addresses
    function testTransferPersonaInvalidAddress() public {
        vm.startPrank(user1);
        uint256 personaId = registry.createPersona(
            "Test", 30, "Job", "Background", "Traits", "Style", "Tone",
            "Expertise", "Experience", "Memory", "Belief", "Priority"
        );

        // Test transfer to zero address
        vm.expectRevert("Cannot transfer to zero address");
        registry.transferPersona(personaId, address(0));

        // Test transfer to self
        vm.expectRevert("Cannot transfer to yourself");
        registry.transferPersona(personaId, user1);

        vm.stopPrank();
    }

    // Test persona deactivation and reactivation
    function testPersonaDeactivation() public {
        vm.startPrank(user1);

        uint256 personaId = registry.createPersona(
            "Deactivation Test", 30, "Job", "Background", "Traits", "Style", "Tone",
            "Expertise", "Experience", "Memory", "Belief", "Priority"
        );

        // Deactivate the persona
        registry.deactivatePersona(personaId);

        // Verify deactivation
        PersonaRegistry.Persona memory persona = registry.getPersona(personaId);
        assertFalse(persona.isActive);

        assertEq(registry.getUserActivePersonaCount(user1), 0);

        // Reactivate the persona
        registry.reactivatePersona(personaId);

        // Verify reactivation
        persona = registry.getPersona(personaId);
        assertTrue(persona.isActive);

        assertEq(registry.getUserActivePersonaCount(user1), 1);

        vm.stopPrank();
    }

    // Test operations on deactivated persona
    function testOperationsOnDeactivatedPersona() public {
        vm.startPrank(user1);

        uint256 personaId = registry.createPersona(
            "Test", 30, "Job", "Background", "Traits", "Style", "Tone",
            "Expertise", "Experience", "Memory", "Belief", "Priority"
        );

        registry.deactivatePersona(personaId);

        // Try to update deactivated persona
        vm.expectRevert("Persona is not active");
        registry.updatePersona(
            personaId, "Updated", 35, "NewJob", "NewBackground", "NewTraits",
            "NewStyle", "NewTone", "NewExpertise", "NewExperience",
            "NewMemory", "NewBelief", "NewPriority"
        );

        vm.stopPrank();
    }

    // Test getting persona details individually
    function testGetPersonaDetails() public {
        vm.startPrank(user1);

        uint256 personaId = registry.createPersona(
            "Detail Test", 45, "Engineer", "Tech Background",
            "Analytical,Creative", "Direct", "Professional",
            "Software,AI", "10 years coding", "First program",
            "Technology helps people", "Quality over speed"
        );

        vm.stopPrank();

        // Test individual getters
        PersonaRegistry.BasicInfo memory basicInfo = registry.getPersonaBasicInfo(personaId);
        assertEq(basicInfo.age, 45);
        assertEq(basicInfo.occupation, "Engineer");
        assertEq(basicInfo.background, "Tech Background");

        PersonaRegistry.Personality memory personality = registry.getPersonaPersonality(personaId);
        assertEq(personality.traits, "Analytical,Creative");
        assertEq(personality.speakingStyle, "Direct");
        assertEq(personality.tone, "Professional");

        PersonaRegistry.Knowledge memory knowledge = registry.getPersonaKnowledge(personaId);
        assertEq(knowledge.expertise, "Software,AI");
        assertEq(knowledge.experiences, "10 years coding");
        assertEq(knowledge.memories, "First program");

        PersonaRegistry.Values memory values = registry.getPersonaValues(personaId);
        assertEq(values.beliefs, "Technology helps people");
        assertEq(values.priorities, "Quality over speed");
    }

    // Test getUserPersonasWithData with mixed active/inactive personas
    function testGetUserPersonasWithData() public {
        vm.startPrank(user1);

        // Create multiple personas
        uint256 persona1 = registry.createPersona(
            "Persona 1", 30, "Job1", "Background1", "Traits1", "Style1", "Tone1",
            "Expertise1", "Experience1", "Memory1", "Belief1", "Priority1"
        );

        uint256 persona2 = registry.createPersona(
            "Persona 2", 40, "Job2", "Background2", "Traits2", "Style2", "Tone2",
            "Expertise2", "Experience2", "Memory2", "Belief2", "Priority2"
        );

        uint256 persona3 = registry.createPersona(
            "Persona 3", 50, "Job3", "Background3", "Traits3", "Style3", "Tone3",
            "Expertise3", "Experience3", "Memory3", "Belief3", "Priority3"
        );

        // Deactivate one persona
        registry.deactivatePersona(persona2);

        vm.stopPrank();

        // Get all user personas (should only return active ones)
        PersonaRegistry.Persona[] memory userPersonas = registry.getUserPersonasWithData(user1);

        assertEq(userPersonas.length, 2);
        assertEq(userPersonas[0].name, "Persona 1");
        assertEq(userPersonas[1].name, "Persona 3");

        // Verify all returned personas are active
        for (uint256 i = 0; i < userPersonas.length; i++) {
            assertTrue(userPersonas[i].isActive);
        }
    }

    // Test access to non-existent persona
    function testNonExistentPersona() public {
        vm.expectRevert("Persona does not exist");
        registry.getPersona(999);

        vm.expectRevert("Persona does not exist");
        registry.getPersonaBasicInfo(999);
    }

    // Test event emissions
    function testEventEmissions() public {
        vm.startPrank(user1);

        // Test PersonaCreated event
        vm.expectEmit(true, true, false, true);
        emit PersonaCreated(1, user1, "Event Test");

        uint256 personaId = registry.createPersona(
            "Event Test", 30, "Job", "Background", "Traits", "Style", "Tone",
            "Expertise", "Experience", "Memory", "Belief", "Priority"
        );

        // Test PersonaUpdated event
        vm.expectEmit(true, false, false, true);
        emit PersonaUpdated(personaId, "Updated Event Test");

        registry.updatePersona(
            personaId, "Updated Event Test", 35, "NewJob", "NewBackground",
            "NewTraits", "NewStyle", "NewTone", "NewExpertise",
            "NewExperience", "NewMemory", "NewBelief", "NewPriority"
        );

        // Test PersonaTransferred event
        vm.expectEmit(true, true, true, false);
        emit PersonaTransferred(personaId, user1, user2);

        registry.transferPersona(personaId, user2);

        vm.stopPrank();

        // Test PersonaDeactivated event
        vm.startPrank(user2);
        vm.expectEmit(true, false, false, false);
        emit PersonaDeactivated(personaId);

        registry.deactivatePersona(personaId);
        vm.stopPrank();
    }

    // Events for testing
    event PersonaCreated(uint256 indexed personaId, address indexed owner, string name);
    event PersonaUpdated(uint256 indexed personaId, string name);
    event PersonaTransferred(uint256 indexed personaId, address from, address to);
    event PersonaDeactivated(uint256 indexed personaId);
}
