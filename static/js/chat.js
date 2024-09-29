let pubnub;
const DEFAULT_PROFILE_PICTURE = 'https://vibranium.netlify.app/static/images/default.png';

function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') {
        throw new TypeError('Input must be a string');
    }

    unsafe = unsafe.trim();

    const maxLength = 1000; 
    if (unsafe.length > maxLength) {
        throw new RangeError(`Input exceeds maximum length of ${maxLength} characters`);
    }

    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/`/g, "&#x60;")
        .replace(/\\/g, "&#x5C;")
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, function (match) {
            return `&#${match.charCodeAt(0)};`;
        });
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function generateUserID() {
    return crypto.getRandomValues(new Uint32Array(1))[0].toString().padStart(8, '0');
}

function generateChannelID() {
    const randomId = crypto.getRandomValues(new Uint32Array(3)).join('').slice(0, 12);
    const letter = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    return `${randomId}${letter}`;
}

function formatDate(date) {
    const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleString('en-US', options);
}

let currentUser = {
    userId: `${generateUserID()}`,
    username: `user-${generateUserID()}`,
    profilePicture: DEFAULT_PROFILE_PICTURE
};

let currentRoom = {
    roomId: "",
    roomName: "",
    isPrivate: false,
};

function initializePubNub() {
    pubnub = new PubNub({
        publishKey: window.PUBNUB_PUBLISH_KEY,
        subscribeKey: window.PUBNUB_SUBSCRIBE_KEY,
        userId: currentUser.userId,
    });
    
    pubnub.addListener({
        message: (msgEvent) => {
            if (msgEvent.message.sender !== currentUser.username) {
                const receivedTime = formatDate(new Date());
                console.log(`${msgEvent.message.sender} sent a message: "${msgEvent.message.text}" at ${receivedTime}`);
                displayReceivedMessage(msgEvent.message, receivedTime);
            }
        },
        status: (statusEvent) => {
            if (statusEvent.category === "PNConnectedCategory") {
                console.log("Joined RoomID: ", currentRoom.roomId);
                displayRoomInfo();
                fetchMessageHistory();
            }
        },
    });
    pubnub.subscribe({
        channels: [currentRoom.roomId]
    });
}

function fetchMessageHistory() {
    pubnub.history({
        channel: currentRoom.roomId,
        count: 25
    }).then((response) => {
        response.messages.forEach((message) => {
            const receivedTime = formatDate(new Date(message.timetoken));
            displayReceivedMessage(message.entry, receivedTime);
        });
    }).catch((error) => {
        console.error("Error fetching message history:", error);
    });
}

function displayRoomInfo() {
    const roomInfoDiv = document.getElementById("roomInfo");
    roomInfoDiv.innerHTML = `
        <div class="room-info-container">
            <button class="leave-room-btn" id="leaveRoomBtn">
                <i class="fas fa-sign-out-alt leave-room-icon"></i>
            </button>
            <h3 class="room-id-heading">Room ID: ${currentRoom.roomId}</h3>
        </div>
    `;

    document.getElementById("leaveRoomBtn").addEventListener("click", leaveRoom);
}

function leaveRoom() {
    pubnub.unsubscribe({ channels: [currentRoom.roomId] });
    currentRoom = { roomId: "", roomName: "", isPrivate: false, participants: [] };
    
    const roomInfoDiv = document.getElementById("roomInfo");
    roomInfoDiv.innerHTML = ''; 

    document.getElementById("messageContainer").innerHTML = '';
    document.getElementById("chatContainer").style.display = "none";
    document.getElementById("roomChoiceModal").style.display = "block";
}


document.getElementById("profileModal").style.display = "block";

document.querySelector('.next-button').addEventListener("click", function () {
    const username = document.querySelector('.profile-name').innerText;

    currentUser.userId = generateUserID();
    currentUser.username = username || `user-${currentUser.userId}`;
    currentUser.profilePicture = DEFAULT_PROFILE_PICTURE;  

    document.getElementById("profileModal").style.display = "none";
    document.getElementById("roomChoiceModal").style.display = "block";
});

document.getElementById("createRoomOptionBtn").addEventListener("click", function() {
    document.getElementById("roomChoiceModal").style.display = "none";
    document.getElementById("roomModal").style.display = "block";
});

document.getElementById("joinRoomOptionBtn").addEventListener("click", function() {
    document.getElementById("roomChoiceModal").style.display = "none";
    document.getElementById("joinRoomModal").style.display = "block";
});

document.getElementById("createRoomBtn").addEventListener("click", function() {
    const roomName = document.getElementById("roomNameInput").value;
    const roomPrivacy = document.getElementById("roomPrivacy").value;
    const chatBox = document.getElementById("chatContainer");

    if (roomName) {
        currentRoom.roomId = generateChannelID();
        currentRoom.roomName = roomName;
        currentRoom.isPrivate = roomPrivacy === "private";
        chatBox.style.display = "block";

        document.getElementById("roomModal").style.display = "none";
        initializePubNub();

        showMessageInput();
    } else {
        alert("Please enter a room name.");
    }
});

document.getElementById("joinRoomBtn").addEventListener("click", function() {
    const channelId = document.getElementById("joinRoomIdInput").value;
    const chatBox = document.getElementById("chatContainer");
    
    if (channelId) {
        currentRoom.roomId = channelId;
        chatBox.style.display = "block"; 
        document.getElementById("joinRoomModal").style.display = "none";
        initializePubNub();

        showMessageInput();
    } else {
        alert("Please enter a channel ID.");
    }
});

function showMessageInput() {
    const messageInputContainer = document.getElementById("messageInputContainer");
    const messageInput = document.getElementById("messageInput");
    const sendMessageBtn = document.getElementById("sendMessageBtn");

    messageInputContainer.style.display = "block"; 
    messageInput.value = ""; 

    sendMessageBtn.addEventListener("click", sendMessage);
    
    messageInput.addEventListener("keypress", function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });
}

function sendMessage() {
    let messageText = document.getElementById("messageInput").value.trim();
    const sanitizedMessage = escapeHtml(messageText); 

    if (sanitizedMessage) {
        const message = {
            text: sanitizedMessage,
            sender: currentUser.username,
            senderProfilePicture: currentUser.profilePicture,
        };

        pubnub.publish({
            channel: currentRoom.roomId,
            message: message
        }).then(() => {
            const sentTime = formatDate(new Date());
            displaySentMessage(sanitizedMessage, sentTime);
            document.getElementById("messageInput").value = ""; 
        }).catch(error => {
            console.error("Error publishing message:", error);
        });
    } else {
        alert("Please enter a message.");
    }
}

function displaySentMessage(messageText, time) {
    const messageDisplay = document.createElement("div");
    messageDisplay.className = "message sent";
    messageDisplay.textContent = `You: ${messageText}`;
    const timestampElement = document.createElement("span");
    timestampElement.className = "timestamp";
    timestampElement.textContent = time;
    messageDisplay.appendChild(timestampElement);
    document.getElementById("messageContainer").appendChild(messageDisplay);
    const messageContainer = document.getElementById("messageContainer");
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function displayReceivedMessage(message, time) {
    const messageDisplay = document.createElement("div");
    messageDisplay.className = "message received";
    const sanitizedText = escapeHtml(message.text);
    messageDisplay.textContent = `${message.sender}: ${sanitizedText}`;
    const timestampElement = document.createElement("span");
    timestampElement.className = "timestamp";
    timestampElement.textContent = time;
    messageDisplay.appendChild(timestampElement);
    document.getElementById("messageContainer").appendChild(messageDisplay);
    const messageContainer = document.getElementById("messageContainer");
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

window.onload = () => {
    const profileNameElement = document.querySelector('.profile-name');
    const profilePictureElement = document.querySelector('#profile-picture img');
    const profilePictureInput = document.querySelector('#profile-picture-input');
    const cameraIcon = document.querySelector('#camera-icon');
    const profileInitialsElement = document.querySelector('.profile-initials');

    profileNameElement.innerText = currentUser.username;
    profilePictureElement.src = currentUser.profilePicture;
    updateProfileInitials(profileInitialsElement, currentUser.username); 

    cameraIcon.addEventListener('click', () => profilePictureInput.click());

    profilePictureInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePictureElement.src = e.target.result;
                currentUser.profilePicture = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    profileNameElement.addEventListener('click', () => {
        const username = profileNameElement.innerText;
        const input = createUsernameInput(username);

        profileNameElement.innerHTML = '';
        profileNameElement.appendChild(input);

        input.focus();
        input.select();
    });
};

function createUsernameInput(username) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = username;
    input.classList.add('username-input');
    
    input.style.cssText = `
        border: none; 
        font-size: 1em; /* Adjust this to match the original font-size */
        outline: none; 
        background: transparent; 
        color: white; 
        text-align: center; /* Center text horizontally */
        width: auto; /* Let the width be determined by content */
        display: inline-block; /* Avoid pushing other elements */
        padding: 0;
        margin: 0;
        height: 100%; /* Keep the input the same height as the original element */
    `;

    input.addEventListener('blur', () => {
        const newUsername = input.value.trim() || username;
        input.parentElement.innerText = newUsername;

        currentUser.username = newUsername;

        const profileInitialsElement = document.querySelector('.profile-initials');
        updateProfileInitials(profileInitialsElement, newUsername); 
    });

    return input;
}

function getInitials(username) {
    const words = username.split(' ').filter(word => word);
    let initials = '';
    if (words.length === 1) {
        initials = words[0].slice(0, 2);
    } else if (words.length >= 2) {
        initials = words[0][0] + words[words.length - 1][0];
    }
    return initials.toUpperCase();
}

function updateProfileInitials(element, username) {
    const initials = getInitials(username);
    element.innerText = initials;
}

