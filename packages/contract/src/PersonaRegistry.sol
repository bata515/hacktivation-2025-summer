// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PersonaRegistry {
    // 人格の基本情報
    struct BasicInfo {
        uint8 age;
        string occupation;
        string background;
    }

    // 人格の性格特性
    struct Personality {
        string traits;        // カンマ区切りの特徴
        string speakingStyle;
        string tone;
    }

    // 人格の知識・経験
    struct Knowledge {
        string expertise;     // カンマ区切りの専門分野
        string experiences;   // カンマ区切りの経験
        string memories;      // カンマ区切りの記憶
    }

    // 人格の価値観
    struct Values {
        string beliefs;       // カンマ区切りの信念
        string priorities;    // カンマ区切りの優先事項
    }

    // 完全な人格データ（オンチェーン保存）
    struct Persona {
        uint256 id;
        string name;
        BasicInfo basicInfo;
        Personality personality;
        Knowledge knowledge;
        Values values;
        address owner;
        uint256 createdAt;
        uint256 updatedAt;
        bool isActive;
    }

    // Storage
    uint256 private nextPersonaId = 1;
    mapping(uint256 => Persona) public personas;
    mapping(address => uint256[]) public userPersonas;

    // Events
    event PersonaCreated(uint256 indexed personaId, address indexed owner, string name);
    event PersonaUpdated(uint256 indexed personaId, string name);
    event PersonaTransferred(uint256 indexed personaId, address from, address to);
    event PersonaDeactivated(uint256 indexed personaId);

    // Modifiers
    modifier onlyPersonaOwner(uint256 _personaId) {
        require(personas[_personaId].owner == msg.sender, "Not the owner of this persona");
        require(personas[_personaId].isActive, "Persona is not active");
        _;
    }

    modifier personaExists(uint256 _personaId) {
        require(_personaId > 0 && _personaId < nextPersonaId, "Persona does not exist");
        _;
    }

    // 新規人格作成（全データをオンチェーン保存）
    function createPersona(
        string memory _name,
        uint8 _age,
        string memory _occupation,
        string memory _background,
        string memory _traits,
        string memory _speakingStyle,
        string memory _tone,
        string memory _expertise,
        string memory _experiences,
        string memory _memories,
        string memory _beliefs,
        string memory _priorities
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_age > 0 && _age < 200, "Age must be between 1 and 199");

        uint256 personaId = nextPersonaId++;

        Persona storage newPersona = personas[personaId];
        newPersona.id = personaId;
        newPersona.name = _name;

        // 基本情報
        newPersona.basicInfo.age = _age;
        newPersona.basicInfo.occupation = _occupation;
        newPersona.basicInfo.background = _background;

        // 性格
        newPersona.personality.traits = _traits;
        newPersona.personality.speakingStyle = _speakingStyle;
        newPersona.personality.tone = _tone;

        // 知識
        newPersona.knowledge.expertise = _expertise;
        newPersona.knowledge.experiences = _experiences;
        newPersona.knowledge.memories = _memories;

        // 価値観
        newPersona.values.beliefs = _beliefs;
        newPersona.values.priorities = _priorities;

        // メタデータ
        newPersona.owner = msg.sender;
        newPersona.createdAt = block.timestamp;
        newPersona.updatedAt = block.timestamp;
        newPersona.isActive = true;

        userPersonas[msg.sender].push(personaId);

        emit PersonaCreated(personaId, msg.sender, _name);

        return personaId;
    }

    // 人格データ更新（部分更新可能）
    function updatePersona(
        uint256 _personaId,
        string memory _name,
        uint8 _age,
        string memory _occupation,
        string memory _background,
        string memory _traits,
        string memory _speakingStyle,
        string memory _tone,
        string memory _expertise,
        string memory _experiences,
        string memory _memories,
        string memory _beliefs,
        string memory _priorities
    ) public onlyPersonaOwner(_personaId) personaExists(_personaId) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_age > 0 && _age < 200, "Age must be between 1 and 199");

        Persona storage persona = personas[_personaId];

        persona.name = _name;
        persona.basicInfo.age = _age;
        persona.basicInfo.occupation = _occupation;
        persona.basicInfo.background = _background;
        persona.personality.traits = _traits;
        persona.personality.speakingStyle = _speakingStyle;
        persona.personality.tone = _tone;
        persona.knowledge.expertise = _expertise;
        persona.knowledge.experiences = _experiences;
        persona.knowledge.memories = _memories;
        persona.values.beliefs = _beliefs;
        persona.values.priorities = _priorities;
        persona.updatedAt = block.timestamp;

        emit PersonaUpdated(_personaId, _name);
    }

    // 人格データ取得（構造体全体を返却）
    function getPersona(uint256 _personaId)
        public
        view
        personaExists(_personaId)
        returns (Persona memory)
    {
        return personas[_personaId];
    }

    // 人格の詳細データを個別に取得
    function getPersonaBasicInfo(uint256 _personaId)
        public
        view
        personaExists(_personaId)
        returns (BasicInfo memory)
    {
        return personas[_personaId].basicInfo;
    }

    function getPersonaPersonality(uint256 _personaId)
        public
        view
        personaExists(_personaId)
        returns (Personality memory)
    {
        return personas[_personaId].personality;
    }

    function getPersonaKnowledge(uint256 _personaId)
        public
        view
        personaExists(_personaId)
        returns (Knowledge memory)
    {
        return personas[_personaId].knowledge;
    }

    function getPersonaValues(uint256 _personaId)
        public
        view
        personaExists(_personaId)
        returns (Values memory)
    {
        return personas[_personaId].values;
    }

    // ユーザーの人格ID一覧取得
    function getUserPersonaIds(address _user)
        public
        view
        returns (uint256[] memory)
    {
        return userPersonas[_user];
    }

    // ユーザーの全人格データ取得
    function getUserPersonasWithData(address _user)
        public
        view
        returns (Persona[] memory)
    {
        uint256[] memory personaIds = userPersonas[_user];
        uint256 activeCount = 0;

        // アクティブな人格数を数える
        for (uint256 i = 0; i < personaIds.length; i++) {
            if (personas[personaIds[i]].isActive) {
                activeCount++;
            }
        }

        // アクティブな人格のみを返す配列を作成
        Persona[] memory activePersonas = new Persona[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < personaIds.length; i++) {
            if (personas[personaIds[i]].isActive) {
                activePersonas[index] = personas[personaIds[i]];
                index++;
            }
        }

        return activePersonas;
    }

    // 人格の所有権移転
    function transferPersona(uint256 _personaId, address _to)
        public
        onlyPersonaOwner(_personaId)
        personaExists(_personaId)
    {
        require(_to != address(0), "Cannot transfer to zero address");
        require(_to != msg.sender, "Cannot transfer to yourself");

        Persona storage persona = personas[_personaId];
        address from = persona.owner;

        // 元の所有者のリストから削除
        uint256[] storage fromPersonas = userPersonas[from];
        for (uint256 i = 0; i < fromPersonas.length; i++) {
            if (fromPersonas[i] == _personaId) {
                fromPersonas[i] = fromPersonas[fromPersonas.length - 1];
                fromPersonas.pop();
                break;
            }
        }

        // 新しい所有者に追加
        persona.owner = _to;
        userPersonas[_to].push(_personaId);

        emit PersonaTransferred(_personaId, from, _to);
    }

    // 人格の無効化（削除ではなくフラグ管理）
    function deactivatePersona(uint256 _personaId)
        public
        onlyPersonaOwner(_personaId)
        personaExists(_personaId)
    {
        personas[_personaId].isActive = false;
        emit PersonaDeactivated(_personaId);
    }

    // 人格の再有効化
    function reactivatePersona(uint256 _personaId)
        public
        onlyPersonaOwner(_personaId)
        personaExists(_personaId)
    {
        personas[_personaId].isActive = true;
        emit PersonaCreated(_personaId, msg.sender, personas[_personaId].name);
    }

    // 総人格数取得
    function getTotalPersonaCount() public view returns (uint256) {
        return nextPersonaId - 1;
    }

    // 特定ユーザーのアクティブ人格数取得
    function getUserActivePersonaCount(address _user) public view returns (uint256) {
        uint256[] memory personaIds = userPersonas[_user];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < personaIds.length; i++) {
            if (personas[personaIds[i]].isActive) {
                activeCount++;
            }
        }

        return activeCount;
    }
}